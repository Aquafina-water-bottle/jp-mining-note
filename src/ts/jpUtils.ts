import {LOGGER} from './logger';
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

const KATAKANA_SMALL_KA_CODE_POINT = 0x30f5;
const KATAKANA_SMALL_KE_CODE_POINT = 0x30f6;
const KANA_PROLONGED_SOUND_MARK_CODE_POINT = 0x30fc;

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

const VOWEL_TO_KANA_MAPPING = new Map([
    ['a', 'ぁあかがさざただなはばぱまゃやらゎわヵァアカガサザタダナハバパマャヤラヮワヵヷ'],
    ['i', 'ぃいきぎしじちぢにひびぴみりゐィイキギシジチヂニヒビピミリヰヸ'],
    ['u', 'ぅうくぐすずっつづぬふぶぷむゅゆるゥウクグスズッツヅヌフブプムュユルヴ'],
    ['e', 'ぇえけげせぜてでねへべぺめれゑヶェエケゲセゼテデネヘベペメレヱヶヹ'],
    ['o', 'ぉおこごそぞとどのほぼぽもょよろをォオコゴソゾトドノホボポモョヨロヲヺ'],
    ['', 'のノ']
]);

const KANA_TO_VOWEL_MAPPING = (() => {
  const map = new Map();
  for (const [vowel, characters] of VOWEL_TO_KANA_MAPPING) {
    for (const character of characters) {
      map.set(character, vowel);
    }
  }
  return map;
})();

// function name gore :sob:
export function convertHiraganaToKatakanaWithLongVowelMarks(reading: string): string {
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
export function getMorae(text: string): string[] {
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

  // ー -> katakana
export function katakanaRemoveLongVowelMarks(katakana: string) {
  let resultArr = [...katakana];

  let first = null;
  let second = null;
  for (const [i, c] of resultArr.entries()) {
    const pt = c.codePointAt(0);
    if (pt !== undefined && isCodePointInRange(pt, KATAKANA_RANGE)) {
      if (first === null) {
        first = c;
      } else if (second === null) {
        second = c;
      } else {
        // pushes back
        first = second;
        second = c;
      }

      if (first !== null && second !== null && second === "ー") {
        let found = false;
        for (const [searchStr, vowel] of Object.entries(LONG_VOWEL_MARKER_TO_VOWEL)) {
          if (searchStr.includes(first)) {
            resultArr[i] = vowel;
            found = true;
            break;
          }
        }

        if (!found) {
          LOGGER.debug(`(katakanaRemoveLongVowelMarks) Cannot find replacement: ${first} | ${second}`);
        }
      }
    }
  }

  return resultArr.join("");
}

function getProlongedHiragana(previousCharacter: string) {
  switch (KANA_TO_VOWEL_MAPPING.get(previousCharacter)) {
    case 'a': return 'あ';
    case 'i': return 'い';
    case 'u': return 'う';
    case 'e': return 'え';
    case 'o': return 'う';
    default: return null;
  }
}

// shamelessly stolen from Yomichan
// https://github.com/FooSoft/yomichan/blob/master/ext/js/language/sandbox/japanese-util.js
export function convertKatakanaToHiragana(text: string, keepProlongedSoundMarks=false) {
  let result = '';
  const offset = (HIRAGANA_CONVERSION_RANGE.min - KATAKANA_CONVERSION_RANGE.min);
  for (let char of text) {
    const codePoint = char.codePointAt(0);
    switch (codePoint) {
      case KATAKANA_SMALL_KA_CODE_POINT:
        case KATAKANA_SMALL_KE_CODE_POINT:
        // No change
        break;
      case KANA_PROLONGED_SOUND_MARK_CODE_POINT:
        if (!keepProlongedSoundMarks && result.length > 0) {
        const char2 = getProlongedHiragana(result[result.length - 1]);
        if (char2 !== null) { char = char2; }
      }
      break;
      default:
        if (codePoint !== undefined && isCodePointInRange(codePoint, KATAKANA_CONVERSION_RANGE)) {
          char = String.fromCodePoint(codePoint + offset);
        }
      break;
    }
    result += char;
  }
  return result;
}
