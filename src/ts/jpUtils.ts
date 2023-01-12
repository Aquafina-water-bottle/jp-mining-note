import { Module } from './module';
import { getOption } from './options';

export type CodePointRange = {
  min: number;
  max: number;
};

// this doesn't have to be a class anymore! it's just another utils section!!

const HIRAGANA_CONVERSION_RANGE = { min: 0x3041, max: 0x3096 };
const KATAKANA_CONVERSION_RANGE = { min: 0x30a1, max: 0x30f6 };
const HIRAGANA_RANGE = { min: 0x3040, max: 0x309f };
const KATAKANA_RANGE = { min: 0x30a0, max: 0x30ff };
const SMALL_KANA_SET = new Set(Array.from('ぁぃぅぇぉゃゅょゎァィゥェォャュョヮ'));

const LONG_VOWEL_MARKER_TO_VOWEL = {
  アナタサカワラヤマハャパバダザガ: 'ア',
  イニチシキリミヒピビヂジギ: 'イ',
  ウヌツスクルユムフュプブヅズグ: 'ウ',
  エネテセケレメヘペベデゼゲ: 'イ', // "エ",
  ノトソコヲロヨモホョポボドゾゴ: 'ウ', // "オ",
  オ: 'オ', // "オ",
};

const EXTENDED_VOWELS = {
  ア: 'ナタサカワラヤマハャパバダザガ',
  イ: 'ニチシキリミヒピビヂジギ' + 'ネテセケレメヘペベデゼゲ',
  ウ: 'ヌツスクルユムフュプブヅズグ' + 'ノトソコヲロヨモホョポボドゾゴ',
  エ: 'ネテセケレメヘペベデゼゲ',
  オ: 'ノトソコヲロヨモホョポボドゾゴ',
};

// function name gore :sob:
function convertHiraganaToKatakanaWithLongVowelMarks(reading: string): string {
  // converts to katakana and changes vowels to extended vowel form
  const katakana = convertHiraganaToKatakana(reading);
  let result = [...katakana];

  for (let i = 1; i < result.length; i++) {
    if (
      result[i] in EXTENDED_VOWELS &&
      EXTENDED_VOWELS[result[i] as keyof typeof EXTENDED_VOWELS].includes(result[i - 1])
    ) {
      result[i] = 'ー';
    }
  }

  return result.join('');
}

// shamelessly stolen from Yomichan (getKanaMorae)
// https://github.com/FooSoft/yomichan/blob/master/ext/js/language/sandbox/japanese-util.js
function getMorae(text: string): string[] {
  const morae = [];
  let i;
  for (const c of text) {
    if (SMALL_KANA_SET.has(c) && (i = morae.length) > 0) {
      morae[i - 1] += c;
    } else {
      morae.push(c);
    }
  }
  return morae;
}

// shamelessly stolen from Yomichan
// https://github.com/FooSoft/yomichan/blob/master/ext/js/language/sandbox/japanese-util.js
// I have no idea what is going on tbh but it seems to work
function isCodePointInRange(codePoint: number, range: CodePointRange) {
  return codePoint >= range.min && codePoint <= range.max;
}

export function convertHiraganaToKatakana(text: string): string {
  let result = '';
  const offset = KATAKANA_CONVERSION_RANGE.min - HIRAGANA_CONVERSION_RANGE.min;
  for (let char of text) {
    const codePoint = char.codePointAt(0);
    if (
      codePoint !== undefined &&
      isCodePointInRange(codePoint, HIRAGANA_CONVERSION_RANGE)
    ) {
      char = String.fromCodePoint(codePoint + offset);
    }
    result += char;
  }
  return result;
}

export function isKana(c: string) {
  let pt = c.codePointAt(0);
  if (pt === undefined) {
    return false; // why would this happen?
  }

  return isCodePointInRange(pt, HIRAGANA_RANGE) || isCodePointInRange(pt, KATAKANA_RANGE);
}
