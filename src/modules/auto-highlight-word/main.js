

/// {% set functions %}

// =========================
//  Auto Sentence Highlight
// =========================

const JPMNAutoHighlightWord = (() => {

  const logger = new JPMNLogger("auto-highlight-word");

  class JPMNAutoHighlightWord {
    constructor() {
      this.jpUtils = new JPMNJPUtils();
    }

    // Base code taken from:
    // https://github.com/MarvNC/JP-Resources#anki-automatically-highlight-in-sentence
    findReplace(sentence, word, wordReadingKana, wordReadingHiragana) {

      let possibleReplaces = [
        // shorten kanji expression
        this.shorten(word, sentence, 1),
        // shorten with kana reading
        this.shorten(wordReadingKana, sentence, 2),
        this.shorten(wordReadingHiragana, sentence, 2),

        // find katakana
        this.shorten(this.jpUtils.convertHiraganaToKatakana(word), sentence, 2),
        // find katakana with kana reading
        this.shorten(this.jpUtils.convertHiraganaToKatakana(wordReadingKana), sentence, 2),
        this.shorten(this.jpUtils.convertHiraganaToKatakana(wordReadingHiragana), sentence, 2),
      ];

      // find and use longest one that is a substring of the sentence
      let replaceFilter = possibleReplaces.filter((str) => str && sentence.includes(str));
      let replace = "";
      if (replaceFilter.length > 0) { // reduce() errors if array has 0 elements
        replace = replaceFilter.reduce((a, b) => (a.length > b.length ? a : b));
      }

      return replace
    }

    // https://stackoverflow.com/a/6969486
    _escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
    _escapeReplacement(string) {
        return string.replace(/\$/g, '$$$$');
    }

    highlightWord(sentence, word, wordReadingKana, wordReadingHiragana) {
      let replace = this.findReplace(sentence, word, wordReadingKana, wordReadingHiragana);
      let result = sentence;

      if (replace.length > 0) {
        result = sentence.replace(
          new RegExp(this._escapeRegExp(replace), 'g'),
          `<b>${this._escapeReplacement(replace)}</b>`
        );
      }

      return [result, replace];
    }

    // takes an expression and shortens it until it's in the sentence
    shorten(expression, sentence, minLength) {

      while (expression.length > minLength && !sentence.includes(expression)) {
        expression = expression.substr(0, expression.length - 1);
      }
      return expression;
    }

    _isKana(c) {
      return (this.jpUtils.isCodePointInRange(c.codePointAt(0), this.jpUtils.HIRAGANA_RANGE)
        || this.jpUtils.isCodePointInRange(c.codePointAt(0), this.jpUtils.KATAKANA_RANGE));
    }


    /* attempts to highlight the word given the rubyfied sentence */
    highlightWordRuby(sentenceRuby, foundReplaces) {
      let longestSubstr = Array.from(foundReplaces)
        .reduce((a, b) => (a.length > b.length ? a : b));

      // ruby format example:
      // <ruby><rb>端</rb><rt>はじ</rt></ruby>
      let replaceResult = [];
      let beforeKanjiRegex = "(<ruby>(<rb>)?)";
      // \u3040-\u30ff should specify hiragana + katakana
      // this assumes that all kanjis have readings, which may be incorrect wrong
      let afterKanjiRegex = "((</rb><rt>[\u3040-\u30ff]*?)(</rt></ruby>))";
      let betweenKanjiRegex = `(${beforeKanjiRegex}${afterKanjiRegex})?`;

      for (let i = 0; i < longestSubstr.length-1; i++) {
        const previous = longestSubstr[i];
        const after = longestSubstr[i+1];

        // if first index is kanji
        if (i === 0 && !this._isKana(previous)) {
          replaceResult.push(beforeKanjiRegex);
        }

        replaceResult.push(this._escapeRegExp(previous));

        if (this._isKana(previous) && !this._isKana(after)) { // kana + non-kana
          replaceResult.push(beforeKanjiRegex);
        } else if (!this._isKana(previous) && this._isKana(after)) { // non-kana + kana
          replaceResult.push(afterKanjiRegex);
        } else if (!this._isKana(previous) && !this._isKana(after)) { // kana + kana
          replaceResult.push(betweenKanjiRegex);
        }
      }

      // adds last character
      if (longestSubstr.length) {
        let lastChr = longestSubstr[longestSubstr.length-1];

        replaceResult.push(lastChr)
        if (!this._isKana(this._escapeRegExp(lastChr))) {
          replaceResult.push(afterKanjiRegex);
        }
      }

      // searches for:
      // - the ruby reading
      // - or regular result (valid if SentenceReading is not filled)
      // brackets around everything to use $1
      let replace = `((${replaceResult.join("")})|(${longestSubstr}))`;
      let replaceRegex = new RegExp(replace, 'g');
      let matchResult = sentenceRuby.match(replaceRegex);

      let result = sentenceRuby.replace(
        replaceRegex,
        `<b>$1</b>`
      );

      logger.debug(replace, 2);
      logger.debug(sentenceRuby, 2);
      logger.debug(result, 2);

      return [result, matchResult];

    }
  }

  return JPMNAutoHighlightWord;

})();

/// {% endset %}

