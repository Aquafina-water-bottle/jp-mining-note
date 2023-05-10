/**
 * @jest-environment jsdom
 */

import {
  Sentence,
  QuotePair,
  SentenceParser,
  NoteInfoSentence,
} from '../modules/sentenceParser';

function createParser() {
  return new SentenceParser();
}

function createSentence(sentString: string, quotePair?: QuotePair) {
  const contents = document.createElement('span');
  contents.innerHTML = sentString;

  const open = document.createElement('span');
  const close = document.createElement('span');
  if (quotePair !== undefined) {
    open.innerHTML = quotePair.open;
    close.innerHTML = quotePair.close;
  }

  const base = document.createElement('div');
  base.appendChild(open);
  base.appendChild(contents);
  base.appendChild(close);

  return {
    open: base.children[0] as Element,
    contents: base.children[1] as Element,
    close: base.children[2] as Element,
    base: base,
  };
}

function setSentenceToAltDisplay(sentence: Sentence) {
  sentence.contents.classList.toggle('expression-inner--altdisplay', true);
}

// TODO rename
function setSentenceToClozeDeletion(sentence: Sentence) {
  sentence.contents.classList.toggle('expression-inner--cloze-deletion', true);
}

function createNoteInfoSent(
  word: string,
  wordReading: string,
  wordReadingHiragana: string,
  sentence: string
): NoteInfoSentence {
  return {
    Word: word,
    WordReading: wordReading,
    WordReadingHiragana: wordReadingHiragana,
    Sentence: sentence,
  };
}

function createNoteInfoSent_nisemono(sentStr: string) {
  return createNoteInfoSent('偽者', '偽者[にせもの]', 'にせもの', sentStr);
}

test('processSentence fullSent', () => {
  const sentStr = 'かわいげのある女じゃない。さては<b>偽者</b>だな！';
  const sentence = createSentence(sentStr);
  const noteInfo = createNoteInfoSent_nisemono(sentStr);

  createParser().processSentence(sentence, 'fullSent', noteInfo);
  expect(sentence.contents.innerHTML).toBe(sentStr);

  // no quotes should exist
  expect(sentence.open.innerHTML).toBe('');
  expect(sentence.close.innerHTML).toBe('');
});

test('processSentence display', () => {
  const sentStr = 'かわいげのある女じゃない。さては<b>偽者</b>だな！';
  const sentence = createSentence(sentStr);
  const noteInfo = createNoteInfoSent_nisemono(sentStr);

  createParser().processSentence(sentence, 'display', noteInfo);
  expect(sentence.contents.innerHTML).toBe(sentStr);

  // quotes are automatically added to display sentence
  expect(sentence.open.innerHTML).toBe('「');
  expect(sentence.close.innerHTML).toBe('」');
});

test('processSentence fullSent empty', () => {
  const sentStr = '';
  const sentence = createSentence(sentStr);
  const noteInfo = createNoteInfoSent_nisemono(sentStr);

  createParser().processSentence(sentence, 'fullSent', noteInfo);
  expect(sentence.contents.innerHTML).toBe(sentStr);

  // no quotes should exist
  expect(sentence.open.innerHTML).toBe('');
  expect(sentence.close.innerHTML).toBe('');
});

// fixDivList
test('processSentence fixDivList', () => {
  const sentStr =
    '<div>かわいげのある女じゃない。</div><div>さては<b>偽者</b>だな！</div>';
  const sentence = createSentence(sentStr);
  const noteInfo = createNoteInfoSent_nisemono(sentStr);

  createParser().processSentence(sentence, 'fullSent', noteInfo);
  expect(sentence.contents.innerHTML).toBe(
    'かわいげのある女じゃない。<br>さては<b>偽者</b>だな！'
  );
});

test('processSentence fixDivList space', () => {
  const sentStr =
    '<div>かわいげのある女じゃない。</div> <div>さては<b>偽者</b>だな！</div>';
  const sentence = createSentence(sentStr);
  const noteInfo = createNoteInfoSent_nisemono(sentStr);

  createParser().processSentence(sentence, 'fullSent', noteInfo);
  expect(sentence.contents.innerHTML).toBe(
    'かわいげのある女じゃない。<br>さては<b>偽者</b>だな！'
  );
});

test('processSentence fixDivList unbolded', () => {
  const sentStr = '<div>かわいげのある女じゃない。</div><div>さては偽者だな！</div>';
  const sentence = createSentence(sentStr);
  const noteInfo = createNoteInfoSent_nisemono(sentStr);

  const parser = createParser();
  parser.overrideOption('sentenceParser.autoHighlightWord.enabled', false);
  parser.processSentence(sentence, 'fullSent', noteInfo);
  expect(sentence.contents.innerHTML).toBe(
    'かわいげのある女じゃない。<br>さては偽者だな！'
  );
});

test('processSentence fixDivList empty div', () => {
  const sentStr =
    '<div>かわいげのある女じゃない。</div><div></div><div>さては<b>偽者</b>だな！</div>';
  const sentence = createSentence(sentStr);
  const noteInfo = createNoteInfoSent_nisemono(sentStr);

  createParser().processSentence(sentence, 'fullSent', noteInfo);
  expect(sentence.contents.innerHTML).toBe(
    'かわいげのある女じゃない。<br><br>さては<b>偽者</b>だな！'
  );
});

// auto highlight

test('processSentence autoHighlight', () => {
  const sentStr = 'かわいげのある女じゃない。さては偽者だな！';
  const sentence = createSentence(sentStr);
  const noteInfo = createNoteInfoSent_nisemono(sentStr);

  createParser().processSentence(sentence, 'display', noteInfo);
  expect(sentence.contents.innerHTML).toBe(
    'かわいげのある女じゃない。さては<b>偽者</b>だな！'
  );
});

test('processSentence autoHighlight none', () => {
  // ensures that even if nothing is highlighted, no weird null-related errors happen

  const sentStr = 'えっと…『ｘ（３ｘ－１）』だと思います';
  const sentence = createSentence(sentStr);
  const noteInfo = createNoteInfoSent('括弧', '括弧[かっこ]', 'かっこ', sentStr);

  createParser().processSentence(sentence, 'display', noteInfo);
  expect(sentence.contents.innerHTML).toBe(sentStr);
});

test('processSentence autoHighlight hiragana', () => {
  const sentStr = 'ふー…これでひとまずは大丈夫そうね…';
  const sentence = createSentence(sentStr);
  const noteInfo = createNoteInfoSent('一先ず', '一先[ひとま]ず', 'ひとまず', sentStr);

  createParser().processSentence(sentence, 'display', noteInfo);
  expect(sentence.contents.innerHTML).toBe('ふー…これで<b>ひとまず</b>は大丈夫そうね…');
});

test('processSentence autoHighlight katakana', () => {
  const sentStr = '嫌っ！このケダモノ！';
  const sentence = createSentence(sentStr);
  const noteInfo = createNoteInfoSent('獣', '獣[けだもの]', 'けだもの', sentStr);

  createParser().processSentence(sentence, 'display', noteInfo);
  expect(sentence.contents.innerHTML).toBe('嫌っ！この<b>ケダモノ</b>！');
});

test('processSentence autoHighlight do not run', () => {
  // sentences that are bolded will not run auto highlight
  const sentStr = '<b>かわいげのある女じゃない</b>。さては偽者だな！';
  const sentence = createSentence(sentStr);
  const noteInfo = createNoteInfoSent_nisemono(sentStr);

  createParser().processSentence(sentence, 'display', noteInfo);
  expect(sentence.contents.innerHTML).toBe(sentStr);
});

test('processSentence autoHighlight ruby', () => {
  const sentStr =
    'かわいげのある<ruby><rb>女</rb><rt>おんな</rt></ruby>じゃない。さては<ruby><rb>偽者</rb><rt>にせもの</rt></ruby>だな！';
  const plainSentStr = 'かわいげのある女じゃない。さては偽者だな！';
  const sentence = createSentence(sentStr);
  const noteInfo = createNoteInfoSent_nisemono(plainSentStr);

  createParser().processSentence(sentence, 'display', noteInfo);
  expect(sentence.contents.innerHTML).toBe(
    'かわいげのある<ruby><rb>女</rb><rt>おんな</rt></ruby>じゃない。さては<b><ruby><rb>偽者</rb><rt>にせもの</rt></ruby></b>だな！'
  );
});

// ruby sentence where highlighted section contains kana
test('processSentence autoHighlight ruby and kana', () => {
  const sentStr =
    '<ruby><rb>俺</rb><rt>おれ</rt></ruby>と<ruby><rb>智寿子</rb><rt>ちずこ</rt></ruby><ruby><rb>姉</rb><rt>ねえ</rt></ruby>さんは<ruby><rb>正直</rb><rt>しょうじき</rt></ruby><ruby><rb>折</rb><rt>お</rt></ruby>り<ruby><rb>合</rb><rt>あ</rt></ruby>いが<ruby><rb>悪</rb><rt>わる</rt></ruby>い…';
  const plainSentStr = '俺と智寿子姉さんは正直折り合いが悪い…';
  const sentence = createSentence(sentStr);
  const noteInfo = createNoteInfoSent(
    '折り合い',
    '折[お]り 合[あ]い',
    'おりあい',
    plainSentStr
  );

  createParser().processSentence(sentence, 'display', noteInfo);
  expect(sentence.contents.innerHTML).toBe(
    '<ruby><rb>俺</rb><rt>おれ</rt></ruby>と<ruby><rb>智寿子</rb><rt>ちずこ</rt></ruby><ruby><rb>姉</rb><rt>ねえ</rt></ruby>さんは<ruby><rb>正直</rb><rt>しょうじき</rt></ruby><b><ruby><rb>折</rb><rt>お</rt></ruby>り<ruby><rb>合</rb><rt>あ</rt></ruby>い</b>が<ruby><rb>悪</rb><rt>わる</rt></ruby>い…'
  );
});

// cloze deletion

test('processSentence clozeDeletion', () => {
  const sentStr = 'かわいげのある女じゃない。さては<b>偽者</b>だな！';
  const sentence = createSentence(sentStr);
  const noteInfo = createNoteInfoSent_nisemono(sentStr);
  setSentenceToClozeDeletion(sentence);

  createParser().processSentence(sentence, 'display', noteInfo);
  expect(sentence.contents.innerHTML).toBe(
    'かわいげのある女じゃない。さては<b>[...]</b>だな！'
  );
});

test('processSentence clozeDeletion multiple', () => {
  const sentStr = 'かわいげのある<b>女じゃない</b>。さては<b>偽者</b>だな！';
  const sentence = createSentence(sentStr);
  const noteInfo = createNoteInfoSent_nisemono(sentStr);
  setSentenceToClozeDeletion(sentence);

  createParser().processSentence(sentence, 'display', noteInfo);
  expect(sentence.contents.innerHTML).toBe(
    'かわいげのある<b>[...]</b>。さては<b>[...]</b>だな！'
  );
});

test('processSentence clozeDeletion nested', () => {
  const sentStr = 'かわいげのある<b>女<b>じゃ<b>な</b>い</b></b>。さては偽者だな！';
  const sentence = createSentence(sentStr);
  const noteInfo = createNoteInfoSent_nisemono(sentStr);
  setSentenceToClozeDeletion(sentence);

  createParser().processSentence(sentence, 'display', noteInfo);
  expect(sentence.contents.innerHTML).toBe(
    'かわいげのある<b>[...]</b>。さては偽者だな！'
  );
});

// parse quotes
// default: add
test('processSentence display quote', () => {
  const sentStr = '「かわいげのある女じゃない。さては<b>偽者</b>だな！」';
  const sentence = createSentence(sentStr);
  const noteInfo = createNoteInfoSent_nisemono(sentStr);

  createParser().processSentence(sentence, 'display', noteInfo);
  expect(sentence.contents.innerHTML).toBe(
    'かわいげのある女じゃない。さては<b>偽者</b>だな！'
  );
  expect(sentence.open.innerHTML).toBe('「');
  expect(sentence.close.innerHTML).toBe('」');
});

test('processSentence quote add', () => {
  const sentStr = '「かわいげのある女じゃない。さては<b>偽者</b>だな！」';
  const sentence = createSentence(sentStr);
  const noteInfo = createNoteInfoSent_nisemono(sentStr);

  const parser = createParser();
  parser.overrideOption('sentenceParser.fullSent.quotes.processMode', 'add');
  parser.processSentence(sentence, 'fullSent', noteInfo);
  expect(sentence.contents.innerHTML).toBe(
    'かわいげのある女じゃない。さては<b>偽者</b>だな！'
  );
  expect(sentence.open.innerHTML).toBe('「');
  expect(sentence.close.innerHTML).toBe('」');
});

test('processSentence quote remove', () => {
  const sentStr = '「かわいげのある女じゃない。さては<b>偽者</b>だな！」';
  const sentence = createSentence(sentStr);
  const noteInfo = createNoteInfoSent_nisemono(sentStr);

  const parser = createParser();
  parser.overrideOption('sentenceParser.fullSent.quotes.processMode', 'remove');
  parser.processSentence(sentence, 'fullSent', noteInfo);
  expect(sentence.contents.innerHTML).toBe(
    'かわいげのある女じゃない。さては<b>偽者</b>だな！'
  );
  expect(sentence.open.innerHTML).toBe('');
  expect(sentence.close.innerHTML).toBe('');
});

test('processSentence quote as-is (quoted)', () => {
  const sentStr = '「かわいげのある女じゃない。さては<b>偽者</b>だな！」';
  const sentence = createSentence(sentStr);
  const noteInfo = createNoteInfoSent_nisemono(sentStr);

  const parser = createParser();
  parser.overrideOption('sentenceParser.fullSent.quotes.processMode', 'as-is');
  parser.processSentence(sentence, 'fullSent', noteInfo);
  expect(sentence.contents.innerHTML).toBe(
    'かわいげのある女じゃない。さては<b>偽者</b>だな！'
  );
  expect(sentence.open.innerHTML).toBe('「');
  expect(sentence.close.innerHTML).toBe('」');
});

test('processSentence quote as-is (unquoted)', () => {
  const sentStr = 'かわいげのある女じゃない。さては<b>偽者</b>だな！';
  const sentence = createSentence(sentStr);
  const noteInfo = createNoteInfoSent_nisemono(sentStr);

  const parser = createParser();
  parser.overrideOption('sentenceParser.fullSent.quotes.processMode', 'as-is');
  parser.processSentence(sentence, 'fullSent', noteInfo);
  expect(sentence.contents.innerHTML).toBe(
    'かわいげのある女じゃない。さては<b>偽者</b>だな！'
  );
  expect(sentence.open.innerHTML).toBe('');
  expect(sentence.close.innerHTML).toBe('');
});

// remove periods
// recall that fullSent is unquoted by default
test('processSentence removeFinalPeriod true', () => {
  const sentStr = 'かわいげのある女じゃない。さては<b>偽者</b>だな。';
  const sentence = createSentence(sentStr);
  const noteInfo = createNoteInfoSent_nisemono(sentStr);

  const parser = createParser();
  parser.overrideOption('sentenceParser.removeFinalPeriod.fullSent.unquoted', true);
  parser.processSentence(sentence, 'fullSent', noteInfo);
  expect(sentence.contents.innerHTML).toBe(
    'かわいげのある女じゃない。さては<b>偽者</b>だな'
  );
});

test('processSentence removeFinalPeriod false', () => {
  const sentStr = 'かわいげのある女じゃない。さては<b>偽者</b>だな。';
  const sentence = createSentence(sentStr);
  const noteInfo = createNoteInfoSent_nisemono(sentStr);

  const parser = createParser();
  parser.overrideOption('sentenceParser.removeFinalPeriod.fullSent.unquoted', false);
  parser.processSentence(sentence, 'fullSent', noteInfo);
  expect(sentence.contents.innerHTML).toBe(
    'かわいげのある女じゃない。さては<b>偽者</b>だな。'
  );
});
