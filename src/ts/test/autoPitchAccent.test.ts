/**
 * @jest-environment jsdom
 */

import { AutoPitchAccent, NoteInfoPA } from '../modules/autoPitchAccent';

// a few samples of valid text

//const PA_OVERRIDE_TEXT = "";
//const PA_OVERRIDE_CSV = "";
//const PA_POSITIONS = "";
//const PA_POSITIONS_NON_JPMN = "";

function testResult(noteInfo: NoteInfoPA, expected: string) {
  const parser = new AutoPitchAccent();
  const e = document.createElement("div");
  parser.addPosition(e, noteInfo);
  expect(e.innerHTML).toBe(expected);
}

type NoteInfoPAPartial = {
  -readonly [K in keyof NoteInfoPA]?: NoteInfoPA[K] 
}

const NISEMONO = "偽者[にせもの]";
const KYODORU = "きょどる";


function noteInfoFill(noteInfo: NoteInfoPAPartial): NoteInfoPA {
  return {
    tags: noteInfo.tags ?? [],
    PAOverrideText: noteInfo.PAOverrideText ?? "",
    PAOverride: noteInfo.PAOverride ?? "",
    PAPositions: noteInfo.PAPositions ?? "",
    AJTWordPitch: noteInfo.AJTWordPitch ?? "",
    WordReading: noteInfo.WordReading ?? "",
    YomichanWordTags: noteInfo.YomichanWordTags ?? "",
  }
}


test('PAOverrideText smoke test', () => {
  const rawStr = "Hello world!";
  const pNoteInfo: NoteInfoPAPartial = {
    PAOverrideText: rawStr
  }

  const noteInfo = noteInfoFill(pNoteInfo);
  testResult(noteInfo, rawStr)
});

test('PAOverrideText everything filled', () => {
  const rawStr = "Hello world!";
  const pNoteInfo: NoteInfoPAPartial = {
    PAOverrideText: rawStr,
    PAOverride: "A",
    PAPositions: "A",
    AJTWordPitch: "A",
    WordReading: "A",
    YomichanWordTags: "A",
  }

  const noteInfo = noteInfoFill(pNoteInfo);
  testResult(noteInfo, rawStr)
});


test('PAOverride', () => {
  const pNoteInfo: NoteInfoPAPartial = {
    PAOverride: "0",
    WordReading: NISEMONO,
  }

  const noteInfo = noteInfoFill(pNoteInfo);
  testResult(noteInfo, `<span class="heiban">ニ<span class="pitchoverline">セモノ</span>`)
});
