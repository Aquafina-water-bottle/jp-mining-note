/**
 * @jest-environment jsdom
 */

import { AutoPitchAccent, NoteInfoPA, PAGroup } from '../modules/autoPitchAccent';

// a few samples of valid text

//const PA_OVERRIDE_TEXT = "";
//const PA_OVERRIDE_CSV = "";
//const PA_POSITIONS = "";
//const PA_POSITIONS_NON_JPMN = "";

function testResult(noteInfo: NoteInfoPA, expected: string) {
  const parser = new AutoPitchAccent();
  const e = document.createElement('div');
  parser.addPosition(e, noteInfo);
  expect(e.innerHTML).toBe(expected);
}

type NoteInfoPAPartial = {
  -readonly [K in keyof NoteInfoPA]?: NoteInfoPA[K];
};

const NISEMONO = '偽者[にせもの]';
const KYODORU = 'きょどる';

// helper functions to construct the HTML easier

// wrap pa group
function paGrp(paGroup: PAGroup, str: string): string {
  return `<span class="pa-group-${paGroup}">${str}</span>`;
}

// wrap overline
function overL(str: string): string {
  return `<span class="pitchoverline">${str}</span>`;
}

// wrap bold
function bold(str: string): string {
  return `<b>${str}</b>`;
}

// downstep
const DS = '<span class="downstep"><span class="downstep-inner">ꜜ</span></span>';

const CONN_DOT = '・';
const CONN_COMMA = '、';

const NISEMONO_0 = paGrp('heiban', 'ニ' + overL('セモノ'));
const NISEMONO_1 = paGrp('atamadaka', overL('ニ') + DS + 'セモノ');
const NISEMONO_2 = paGrp('nakadaka', 'ニ' + overL('セ') + DS + 'モノ');
const NISEMONO_3 = paGrp('nakadaka', 'ニ' + overL('セモ') + DS + 'ノ');
const NISEMONO_4 = paGrp('odaka', 'ニ' + overL('セモノ') + DS);

function noteInfoFill(noteInfo: NoteInfoPAPartial): NoteInfoPA {
  return {
    tags: noteInfo.tags ?? [],
    PAOverrideText: noteInfo.PAOverrideText ?? '',
    PAOverride: noteInfo.PAOverride ?? '',
    PAPositions: noteInfo.PAPositions ?? '',
    AJTWordPitch: noteInfo.AJTWordPitch ?? '',
    WordReading: noteInfo.WordReading ?? '',
    YomichanWordTags: noteInfo.YomichanWordTags ?? '',
  };
}

// PAOverrideText

test('PAOverrideText', () => {
  const rawStr = 'Hello world!';
  const pNoteInfo: NoteInfoPAPartial = {
    PAOverrideText: rawStr,
  };

  const noteInfo = noteInfoFill(pNoteInfo);
  testResult(noteInfo, rawStr);
});

test('PAOverrideText everything filled', () => {
  const rawStr = 'Hello world!';
  const pNoteInfo: NoteInfoPAPartial = {
    PAOverrideText: rawStr,
    PAOverride: 'A',
    PAPositions: 'A',
    AJTWordPitch: 'A',
    WordReading: 'A',
    YomichanWordTags: 'A',
  };

  const noteInfo = noteInfoFill(pNoteInfo);
  testResult(noteInfo, rawStr);
});

// PAOverride

test('PAOverride integer heiban', () => {
  const pNoteInfo: NoteInfoPAPartial = {
    PAOverride: '0',
    WordReading: NISEMONO,
  };

  const noteInfo = noteInfoFill(pNoteInfo);
  testResult(noteInfo, NISEMONO_0);
});

test('PAOverride integer atamadaka', () => {
  const pNoteInfo: NoteInfoPAPartial = {
    PAOverride: '1',
    WordReading: NISEMONO,
  };

  const noteInfo = noteInfoFill(pNoteInfo);
  testResult(noteInfo, NISEMONO_1);
});

test('PAOverride integer nakadaka', () => {
  const pNoteInfo: NoteInfoPAPartial = {
    PAOverride: '2',
    WordReading: NISEMONO,
  };

  const noteInfo = noteInfoFill(pNoteInfo);
  testResult(noteInfo, NISEMONO_2);
});

test('PAOverride integer nakadaka2', () => {
  const pNoteInfo: NoteInfoPAPartial = {
    PAOverride: '3',
    WordReading: NISEMONO,
  };

  const noteInfo = noteInfoFill(pNoteInfo);
  testResult(noteInfo, NISEMONO_3);
});

test('PAOverride integer odaka', () => {
  const pNoteInfo: NoteInfoPAPartial = {
    PAOverride: '4',
    WordReading: NISEMONO,
  };

  const noteInfo = noteInfoFill(pNoteInfo);
  testResult(noteInfo, NISEMONO_4);
});

test('PAOverride integer atamadaka kyodoru', () => {
  const pNoteInfo: NoteInfoPAPartial = {
    PAOverride: '2',
    WordReading: KYODORU,
  };

  const noteInfo = noteInfoFill(pNoteInfo);
  const expected = paGrp('nakadaka', 'キョ' + overL('ド') + DS + 'ル');
  testResult(noteInfo, expected);
});

test('PAOverride text downstep', () => {
  const pNoteInfo: NoteInfoPAPartial = {
    PAOverride: 'きょど＼る',
    WordReading: NISEMONO, // different from above
  };

  const noteInfo = noteInfoFill(pNoteInfo);
  const expected = paGrp('nakadaka', 'キョ' + overL('ド') + DS + 'ル');
  testResult(noteInfo, expected);
});

test('PAOverride text heiban', () => {
  const pNoteInfo: NoteInfoPAPartial = {
    PAOverride: 'きょどる￣',
    WordReading: NISEMONO,
  };

  const noteInfo = noteInfoFill(pNoteInfo);
  const expected = paGrp('heiban', 'キョ' + overL('ドル'));
  testResult(noteInfo, expected);
});

test('PAOverride multiple integers', () => {
  const pNoteInfo: NoteInfoPAPartial = {
    PAOverride: '0,1',
    WordReading: NISEMONO,
  };

  const noteInfo = noteInfoFill(pNoteInfo);
  const expected = [NISEMONO_0, NISEMONO_1].join(CONN_DOT);
  testResult(noteInfo, expected);
});

test('PAOverride multiple integers space', () => {
  const pNoteInfo: NoteInfoPAPartial = {
    PAOverride: '0 ,1 ',
    WordReading: NISEMONO,
  };

  const noteInfo = noteInfoFill(pNoteInfo);
  const expected = [NISEMONO_0, NISEMONO_1].join(CONN_DOT);
  testResult(noteInfo, expected);
});

test('PAOverride multiple integers bold', () => {
  const pNoteInfo: NoteInfoPAPartial = {
    PAOverride: '0,<b>1</b>',
    WordReading: NISEMONO,
  };

  const noteInfo = noteInfoFill(pNoteInfo);
  const expected = [bold(NISEMONO_0), NISEMONO_1].join(bold(CONN_DOT));
  testResult(noteInfo, expected);
});

test('PAOverride multiple same integers', () => {
  const pNoteInfo: NoteInfoPAPartial = {
    PAOverride: '0,0,0',
    WordReading: NISEMONO,
  };

  const noteInfo = noteInfoFill(pNoteInfo);
  const expected = [NISEMONO_0, NISEMONO_0, NISEMONO_0].join(CONN_DOT);
  testResult(noteInfo, expected);
});

test('PAOverride multiple text', () => {
  const pNoteInfo: NoteInfoPAPartial = {
    PAOverride: 'どく＼、くらう￣、さら￣',
    WordReading: NISEMONO,
  };

  const noteInfo = noteInfoFill(pNoteInfo);
  const expected = [
    paGrp('odaka', 'ド' + overL('ク') + DS),
    paGrp('heiban', 'ク' + overL('ラウ')),
    paGrp('heiban', 'サ' + overL('ラ')),
  ].join(CONN_COMMA);
  testResult(noteInfo, expected);
});

// TODO: kifuku override

// TODO: kifuku with proper word tags

// TODO: PAPositions

// TODO: PAPositions with different displayMode settings

// TODO: AJTWordPitch

// TODO: readingDisplayMode and searchForAJTWord (combined with all other fields)
