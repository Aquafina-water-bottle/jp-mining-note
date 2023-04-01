import { JSDOM } from 'jsdom';
//import { xhr2 } from 'xhr2';
import {KanjiHover} from '../modules/kanjiHover';
import {invoke} from '../ankiConnectUtils';
import {NoteInfo} from '../utils';
import {Field} from '../fields';



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

async function calcKanjiHover() {

  //globalThis.XMLHttpRequest = xhr2;
  globalThis.XMLHttpRequest = require('xhr2');

  // TODO cli flags
  const query = `"note:JP Mining Note" prop:due=0`;
  console.log("Querying due notes...")
  const notes = await invoke("findNotes", { query: query }) as number[];

  console.log("Getting notes info...")
  const notesInfo = await invoke("notesInfo", { notes: notes }) as NoteInfo[];

  for (const info of notesInfo ) {
    console.log("Key:", info.fields.Key.value);
    simulateEnv(info);

    const kanjiHover = new KanjiHover();
    kanjiHover.main();
    break;
  }

}

function main() {
  //console.log("Hello world!");
  const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p><div id="hidden"></div>`);
  globalThis.document = dom.window.document;

  calcKanjiHover();
}

main();
