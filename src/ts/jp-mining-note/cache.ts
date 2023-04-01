import {KanjiHover} from '../modules/kanjiHover';
import {invoke} from '../ankiConnectUtils';

async function calcKanjiHover() {

  const kanjiHover = new KanjiHover();
  kanjiHover.main();

  // TODO cli flags
  const query = `"note:JP Mining Note" due:1`;
  console.log("Querying due notes...")
  const notes = await invoke("findNotes", { query: query }) as number[];

  console.log("Getting notes info...")
  const notesInfo = await invoke("notesInfo", { notes: notes }) as any[];
  console.log(notesInfo)

  for (const info of notesInfo ) {
    console.log("Key:", info.fields.Key.value);
    break;
  }

}

function main() {
  const calcKanjiHoverBtn = document.getElementById("calc_kanji_hover")
  if (calcKanjiHoverBtn) {
    calcKanjiHoverBtn.onclick = (() => {
      console.log("A");
      calcKanjiHover();
    });
  } else {
    console.log("B");
  }
}

main();
