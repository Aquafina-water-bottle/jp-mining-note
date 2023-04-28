import { JSDOM } from 'jsdom';
//import { xhr2 } from 'xhr2';
import {KanjiHover, NoteInfoKanjiHover} from '../modules/kanjiHover';
import {invoke} from '../ankiConnectUtils';
import {NoteInfo, plainToRuby} from '../utils';
import {Field} from '../fields';
import {manuallyCreateObjPersist} from '../spersist';
import {WordIndicatorLabel, WordIndicators} from '../modules/wordIndicators';



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

}

async function getNotesInfo(): Promise<NoteInfo[]> {
  // TODO cli flags
  //const query = `"note:JP Mining Note" prop:due=0`;
  const query = `"note:JP Mining Note" key:家族`;
  console.log("Querying due notes...")
  const notes = await invoke("findNotes", { query: query }) as number[];

  console.log("Getting notes info...")
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
  const indicators = wordIndicators.getIndicators()
  for (const indicator of indicators) {
    const tooltipHTML = await indicator.getTooltipHTML();
    result[indicator.label] = tooltipHTML;
  }
  return result;
}

/*

<span data-cache-version="1">
  <span data-cache-type="kanji-hover">
    <span data-cache-kanji="(KANJI)">
      (KANJI HOVER RESULT)
    </span>
  </span>
</span>

*/
function constructCacheEle(epochTime: number, kanjiToHoverHTML: Record<string, string>, wordIndicatorTooltips: Record<WordIndicatorLabel, string | null>): HTMLElement {
  const base = document.createElement("div");
  base.setAttribute("data-cache-version", "1");
  base.setAttribute("data-cache-write-time", `${epochTime}`);
  base.setAttribute("data-cache-expires", `9`);


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

async function main() {
  //console.log("Hello world!");
  const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p><div id="hidden"></div>`);
  globalThis.document = dom.window.document;

  //globalThis.XMLHttpRequest = xhr2;
  globalThis.XMLHttpRequest = require('xhr2');

  // fake a persist obj
  manuallyCreateObjPersist();

  const notesInfo = await getNotesInfo();

  const epochTime = Date.now();

  const actions: ReturnType<typeof constructWriteAction>[] = [];
  for (const info of notesInfo) {
    console.log("Key:", info.fields.Key.value);
    simulateEnv(info);

    const kanjiToHoverHTML = await calcKanjisToHover(info);
    const wordIndicatorTooltips = await calcWordIndicatorTooltips();

    const cacheEle = constructCacheEle(epochTime, kanjiToHoverHTML, wordIndicatorTooltips);
    const action = constructWriteAction(cacheEle.outerHTML, info,);
    actions.push(action)
    //console.log(action)
    //console.log(JSON.stringify(action, null, 2))

    //break; // TODO temp
  }

  await invoke("multi", {actions: actions});
}

main();
