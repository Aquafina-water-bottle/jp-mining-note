import { JSDOM } from 'jsdom';
//import { xhr2 } from 'xhr2';


import {KanjiHover, NoteInfoKanjiHover} from '../modules/kanjiHover';
import {invoke} from '../ankiConnectUtils';
import {type NoteInfo, type CardInfo, plainToRuby, _resetGlobalState as _resetGlobalStateUtils} from '../utils';
import {type Field, _resetGlobalState as _resetGlobalStateFields} from '../fields';
import {manuallyCreateObjPersist} from '../spersist';
import {WordIndicatorLabel, WordIndicators} from '../modules/wordIndicators';


type CacheArgs = {
  "new-cards-per-day": number,
  "day-buffer": number,
  "custom-query": null | string,
  "suppress-log": boolean,
  "expires": number,
  "print-notes-only": boolean,
}

// required for printing, since console.log is completely suppressed for now
const _print = console.log;

function simulateEnv(noteInfo: NoteInfo) {
  const h = document.getElementById("hidden") as HTMLElement;
  h.innerHTML = "";

  for (const key of Object.keys(noteInfo.fields)) {

    const val = noteInfo.fields[key as Field].value;

    const eleVal = document.createElement("div");
    eleVal.setAttribute("id", `hidden_field_${key}`);
    eleVal.innerHTML = val;

    const eleExists = document.createElement("div");
    eleExists.setAttribute("id", `hidden_field_exists_${key}`);
    eleExists.innerHTML = val.length > 0 ? "1" : "";

    h.appendChild(eleVal);
    h.appendChild(eleExists);
  }

  _resetGlobalStateUtils();
  _resetGlobalStateFields();
}


// logic equivalent to batch.py's get_new_due_cards
async function getNewDueCards(limit: number): Promise<number[]> {
  const query = '"note:JP Mining Note" is:new -is:suspended';
  const cards = await invoke("findCards", {query: query});
  const cardsInfo = await invoke("cardsInfo", {cards: cards}) as Array<CardInfo>;
  cardsInfo.sort((a: any, b: any) => a.due - b.due); // sort by due cards
  // takes first ${LIMIT} and only returns card ids
  const newDueCards = cardsInfo.slice(limit).map((val) => val.cardId);
  return newDueCards;
}


async function getNotes(dayBuffer: number, newCardsPerDay: number): Promise<number[]> {
  let query = `"note:JP Mining Note" (prop:due>=0 prop:due<=${dayBuffer})`;
  if (newCardsPerDay > 0) {
    _print("Calculating new cards...");
    const newDueCards = await getNewDueCards(newCardsPerDay);
    const newDueCardsQuery = newDueCards.map(cid => `cid:${cid}`).join(" OR ");
    query = `(${query}) OR (${newDueCardsQuery})`;
  }
  return getNotesFromQuery(query);
}


async function getNotesFromQuery(query: string): Promise<number[]> {
  _print("Querying due notes...")
  _print("Query:", query);
  return invoke("findNotes", { query: query }) as number[];
}


async function getNotesInfo(notes: number[]): Promise<NoteInfo[]> {
  _print("Getting notes info...")
  return invoke("notesInfo", { notes: notes }) as NoteInfo[];
}

async function calcKanjisToHover(info: NoteInfo) {
  const kanjiHover = new KanjiHover(null);

  const noteInfo: NoteInfoKanjiHover = {
    WordReading: info.fields.WordReading.value,
    WordReadingRubyHTML: plainToRuby(info.fields.WordReading.value),
    Key: info.fields.Key.value,
  } as const;

  return kanjiHover.getKanjisToHover(noteInfo);
}

async function calcWordIndicatorTooltips(): Promise<Record<WordIndicatorLabel, string | null>> {
  const result: Record<WordIndicatorLabel, string | null> = {
    'same_word_indicator': null,
    'same_kanji_indicator': null,
    'same_reading_indicator': null,
  }
  const wordIndicators = new WordIndicators(null);
  wordIndicators.setUseCache(false); // 
  const indicators = wordIndicators.getIndicators()
  for (const indicator of indicators) {
    const tooltipHTML = await indicator.getTooltipHTML();
    result[indicator.label] = tooltipHTML;
  }
  return result;
}

/*
<div data-cache-version="1" data-cache-write-time="EPOCH_TIME" data-cache-expires="NUM_OF_DAYS">
  <div data-cache-type="kanji-hover">
    <div data-cache-kanji="(KANJI)">
      (KANJI HOVER RESULT)
    </div>
  </div>
  <div data-cache-type="word-indicators">
    <div data-cache-label="LABEL"> <!-- LABEL is of type WordIndicatorLabel -->
      (WORD INDICTOR RESULT)
    </div>
  </div>
</div>
*/
function constructCacheEle(epochTime: number, kanjiToHoverHTML: Record<string, string>, wordIndicatorTooltips: Record<WordIndicatorLabel, string | null>, expires: number): HTMLElement {
  const base = document.createElement("div");
  base.setAttribute("data-cache-version", "1");
  base.setAttribute("data-cache-write-time", `${epochTime}`);
  base.setAttribute("data-cache-expires", `${expires}`);


  const kanjiHoverBaseEle = document.createElement("div");
  kanjiHoverBaseEle.setAttribute("data-cache-type", "kanji-hover");
  for (const [key, value] of Object.entries(kanjiToHoverHTML)) {
    const kanjiHoverEle = document.createElement("div");
    kanjiHoverEle.setAttribute("data-cache-kanji", key);
    kanjiHoverEle.innerHTML = value;
    kanjiHoverBaseEle.appendChild(kanjiHoverEle);
  }
  base.appendChild(kanjiHoverBaseEle);

  const wordIndsBaseEle = document.createElement("div");
  wordIndsBaseEle.setAttribute("data-cache-type", "word-indicators");
  for (const [label, tooltip] of Object.entries(wordIndicatorTooltips)) {
    const wordIndsEle = document.createElement("div");
    wordIndsEle.setAttribute("data-cache-label", label);
    wordIndsEle.innerHTML = tooltip ?? ""; // WordIndicators.display expects an empty string when empty
    wordIndsBaseEle.appendChild(wordIndsEle);
  }
  base.appendChild(wordIndsBaseEle);

  return base;
}

function constructWriteAction(cacheEleHTML: string, info: NoteInfo) {
  return {
      "action": "updateNoteFields",
      "params": {
          "note": {
              "id": info.noteId,
              "fields": {
                  "CardCache": cacheEleHTML
              },
          }
      },
  };
}

const HELP_MESSAGE = (
  "Usage: \n" +
  "--new-cards-per-day=INT    Number of new JPMN cards you expect to review per day\n" +
  "--day-buffer=INT           Number of days you want to cache for\n" +
  "--expires=INT              Number of days the cache is valid for. This should be greater than day-buffer.\n" +
  "--custom-query=STR         Query to use instead of the generated query. Ignores all\n" +
  "--[no-]suppress-log        Whether console.log output from the internal modules are suppressed or not.\n" +
  "--[no-]print-notes-only    Only prints out the note IDs. Does not calculate cache results.\n"
)

function parseArgs(): CacheArgs {
  const defaultOpts = {
    "new-cards-per-day": 20,
    "day-buffer": 8,
    "custom-query": null,
    "suppress-log": true,
    "expires": 14,
    "print-notes-only": false,
  } as const;
  const opts = {
    alias: [
      "new-cards-per-day",
      "day-buffer",
      "expires",
    ],
    unknown: (arg: string) => {
      throw Error(`Unknown option: ${arg}`);
    },
    string: [
      "custom-query",
    ],
    boolean: [
      "suppress-log",
      "print-notes-only",
    ],
    default: defaultOpts,
  }
  const args = require('minimist')(process.argv.slice(2), opts);

  // get rid of aliases???
  delete args["0"];
  delete args["1"];
  // get rid of empty argument
  delete args["_"];

  if (args["expires"] < args["day-buffer"]) {
    throw Error(`--expires cannot be lower than --day-buffer: ${args}`);
  }

  return args;
}

async function main() {
  // CREATE/SUPPRESS GLOBAL OBJECTS
  const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p><div id="hidden"></div>`);
  globalThis.document = dom.window.document;
  globalThis.XMLHttpRequest = require('xhr2');
  manuallyCreateObjPersist(); // fake a persist obj

  // help message
  if (process.argv[2] === "--help") {
    _print(HELP_MESSAGE);
    return;
  }

  const args = parseArgs();
  _print("Arguments:", args);

  if (args['suppress-log']) {
    // literally clears out console output, because otherwise it spams... (we use print instead)
    console.log = () => {};
  }

  let notes: number[];
  const customQuery = args['custom-query'];
  if (customQuery === null) {
    notes = await getNotes(args["day-buffer"], args["new-cards-per-day"]);
  } else {
    notes = await getNotesFromQuery(customQuery);
  }

  if (args["print-notes-only"]) {
    _print(notes);
    return;
  }

  const notesInfo = await getNotesInfo(notes);
  _print(`Number of notes found: ${notesInfo.length}`);
  const epochTime = Date.now();
  let actions: ReturnType<typeof constructWriteAction>[] = [];

  // write buffer
  const maxBuffer = 10;
  let currentBuffer = 0;

  for (const [i, info] of notesInfo.entries()) {
    _print(`Caching note ${i+1}/${notesInfo.length}...`)

    try {
      simulateEnv(info);

      const kanjiToHoverHTML = await calcKanjisToHover(info);
      const wordIndicatorTooltips = await calcWordIndicatorTooltips();

      const cacheEle = constructCacheEle(epochTime, kanjiToHoverHTML, wordIndicatorTooltips, args.expires);
      const action = constructWriteAction(cacheEle.outerHTML, info,);
      actions.push(action)

      currentBuffer++;
      if (currentBuffer >= maxBuffer) {
        currentBuffer = 0;
        await invoke("multi", {actions: actions});
        actions = []
      }
    } catch (e) {
      console.error(e)
    }
  }

  // in case the buffer wasn't ran
  await invoke("multi", {actions: actions});
}

main();
