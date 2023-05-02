import { JSDOM } from 'jsdom';
//import { xhr2 } from 'xhr2';
import {KanjiHover, NoteInfoKanjiHover} from '../modules/kanjiHover';
import {invoke} from '../ankiConnectUtils';
import {NoteInfo, plainToRuby, _resetGlobalState as _resetGlobalStateUtils} from '../utils';
import {Field, _resetGlobalState as _resetGlobalStateFields} from '../fields';
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

  _resetGlobalStateUtils();
  _resetGlobalStateFields();
}

async function getNotesInfo(): Promise<NoteInfo[]> {
  // TODO cli flags
  const query = `"note:JP Mining Note" (prop:due=0)`;
  //const query = "cid:1679878820999 OR cid:1679879962917 OR cid:1670736430754 OR cid:1670751054470 OR cid:1670751627638 OR cid:1670752182179 OR cid:1670752828713 OR cid:1670753452666 OR cid:1670754404523 OR cid:1670759984783 OR cid:1670767693507 OR cid:1670812672583 OR cid:1670813402590 OR cid:1670840591380 OR cid:1670841005409 OR cid:1670844752574 OR cid:1670845767977 OR cid:1670920871892 OR cid:1670920994917 OR cid:1670921670805 OR cid:1670973359742 OR cid:1670995157666 OR cid:1670996099016 OR cid:1671006862874 OR cid:1671008336839 OR cid:1671053146364 OR cid:1671053913946 OR cid:1671054128008 OR cid:1671054316614 OR cid:1671055545564"
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
  wordIndicators.setUseCache(false); // 
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
  // CREATE/SUPPRESS GLOBAL OBJECTS
  const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p><div id="hidden"></div>`);
  globalThis.document = dom.window.document;
  globalThis.XMLHttpRequest = require('xhr2');
  manuallyCreateObjPersist(); // fake a persist obj
  // literally clears out console output, because otherwise it spams... (we use print instead)
  const print = console.log;
  console.log = () => {};

  const notesInfo = await getNotesInfo();
  const epochTime = Date.now();
  let actions: ReturnType<typeof constructWriteAction>[] = [];

  // write buffer
  const maxBuffer = 10;
  let currentBuffer = 0;

  for (const [i, info] of notesInfo.entries()) {
    print(`Caching note ${i+1}/${notesInfo.length}...`)
    //console.log("Key:", info.fields.Key.value);

    try {
      simulateEnv(info);

      const kanjiToHoverHTML = await calcKanjisToHover(info);
      const wordIndicatorTooltips = await calcWordIndicatorTooltips();

      const cacheEle = constructCacheEle(epochTime, kanjiToHoverHTML, wordIndicatorTooltips);
      const action = constructWriteAction(cacheEle.outerHTML, info,);
      actions.push(action)
      //console.log(action)
      //console.log(JSON.stringify(action, null, 2))

      //break; // TODO temp
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
