/// {% set functions %}

/// {# {% include "jp-mining-note/partials/info_circle_svg.html" %} #}

const JPMNJPUtils = (() => {

  const logger = new JPMNLogger("jp-utils");

  class JPMNJPUtils {
    constructor() {

      this.HIRAGANA_CONVERSION_RANGE = [0x3041, 0x3096];
      this.KATAKANA_CONVERSION_RANGE = [0x30a1, 0x30f6];
      this.KATAKANA_RANGE = [0x30a0, 0x30ff];

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


    getMoras(readingKana) {
      // creates div
      const ignoredKana = "ょゅゃョュャ";
      const len = [...readingKana].length;

      // I think the plural of mora is mora, but oh well
      let moras = [];

      let currentPos = 0;
      while (currentPos < len) {
        // checks next kana to see if it's a combined mora (i.e. きょ)
        // ignoredKana.includes(...) <=> ... in ignoredKana
        if (currentPos !== (len-1) && ignoredKana.includes(readingKana[currentPos+1])) {
          moras.push(readingKana.substring(currentPos, currentPos+2));
          currentPos++;
        } else {
          moras.push(readingKana[currentPos])
        }
        currentPos++;
      }

      return moras;
    }


    // copied/pasted directly from yomichan
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


