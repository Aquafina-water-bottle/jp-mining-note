/// {% set functions %}

/// {# {% include "jp-mining-note/partials/info_circle_svg.html" %} #}

const JPMNJPUtils = (() => {

  const logger = new JPMNLogger("jp-utils");

  class JPMNJPUtils {
    constructor() {

      this.HIRAGANA_CONVERSION_RANGE = [0x3041, 0x3096];
      this.KATAKANA_CONVERSION_RANGE = [0x30a1, 0x30f6];
      this.HIRAGANA_RANGE = [0x3040, 0x309f];
      this.KATAKANA_RANGE = [0x30a0, 0x30ff];
      this.SMALL_KANA_SET = new Set(Array.from('ぁぃぅぇぉゃゅょゎァィゥェォャュョヮ'));

      this.LONG_VOWEL_MARKER_TO_VOWEL = {
        "アナタサカワラヤマハャパバダザガ": "ア",
        "イニチシキリミヒピビヂジギ":       "イ",
        "ウヌツスクルユムフュプブヅズグ":   "ウ",
        "エネテセケレメヘペベデゼゲ":       "イ", // "エ",
        "ノトソコヲロヨモホョポボドゾゴ":   "ウ", // "オ",
        "オ": "オ", // "オ",
      }

      this.EXTENDED_VOWELS = {
        "ア": "ナタサカワラヤマハャパバダザガ",
        "イ": "ニチシキリミヒピビヂジギ" + "ネテセケレメヘペベデゼゲ",
        "ウ": "ヌツスクルユムフュプブヅズグ" + "ノトソコヲロヨモホョポボドゾゴ",
        "エ": "ネテセケレメヘペベデゼゲ",
        "オ": "ノトソコヲロヨモホョポボドゾゴ",
      };
    }


    // function name gore :sob:
    convertHiraganaToKatakanaWithLongVowelMarks(reading) {
      // converts to katakana and changes vowels to extended vowel form
      const katakana = this.convertHiraganaToKatakana(reading);
      let result = [...katakana];

      for (let i = 1; i < result.length; i++) {
        if (result[i] in this.EXTENDED_VOWELS && this.EXTENDED_VOWELS[result[i]].includes(result[i-1])) {
          result[i] = "ー";
        }
      }

      return result.join("");
    }


    // shamelessly stolen from Yomichan (getKanaMorae)
    // https://github.com/FooSoft/yomichan/blob/master/ext/js/language/sandbox/japanese-util.js
    getMorae(text) {
      const morae = [];
      let i;
      for (const c of text) {
        if (this.SMALL_KANA_SET.has(c) && (i = morae.length) > 0) {
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
    isCodePointInRange(codePoint, [min, max]) {
      return (codePoint >= min && codePoint <= max);
    }

    convertHiraganaToKatakana(text) {
      let result = '';
      const offset = (this.KATAKANA_CONVERSION_RANGE[0] - this.HIRAGANA_CONVERSION_RANGE[0]);
      for (let char of text) {
        const codePoint = char.codePointAt(0);
        if (this.isCodePointInRange(codePoint, this.HIRAGANA_CONVERSION_RANGE)) {
          char = String.fromCodePoint(codePoint + offset);
        }
        result += char;
      }
      return result;
    }

  }

  return JPMNJPUtils;

})();

/// {% endset %}


