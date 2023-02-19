import { Module } from '../module';
import { convertHiraganaToKatakana, isKana } from '../jpUtils';
import { escapeRegExp } from '../utils';

export type SearchString = {
  value: string;
  isWord?: boolean; // whether it's the full kanji word or not
};
export type SearchStrings = Readonly<SearchString[]>;

export class AutoHighlightWord extends Module {
  private plainReplaceCache: Set<string> = new Set();
  private attemptedPlainReplace: boolean = false;

  constructor() {
    super('sm:autoHighlightWord');
  }

  // Base code taken from:
  // https://github.com/MarvNC/JP-Resources#anki-automatically-highlight-in-sentence
  // side effect: caches in plainReplaceCache
  private findPlainReplace(sentence: string, searchStrings: SearchStrings): string | null {
    let possibleReplaces: string[] = [];

    for (const searchString of searchStrings) {
      const min = searchString.isWord ? 1 : 2;
      possibleReplaces.push(this.shorten(searchString.value, sentence, min));
      possibleReplaces.push(
        this.shorten(convertHiraganaToKatakana(searchString.value), sentence, 2)
      );
    }

    // find and use longest one that is a substring of the sentence
    let replaceFilter = possibleReplaces.filter((str) => str && sentence.includes(str));
    let replace = null;
    if (replaceFilter.length > 0) {
      // reduce() errors if array has 0 elements
      replace = replaceFilter.reduce((a, b) => (a.length > b.length ? a : b));
    }

    if (replace === null) {
      this.logger.debug("findPlainReplace: could not highlight");
    } else {
      this.plainReplaceCache.add(replace);
    }
    return replace;
  }

  // takes an expression and shortens it until it's in the sentence
  private shorten(expression: string, sentence: string, minLength: number): string {
    while (expression.length > minLength && !sentence.includes(expression)) {
      expression = expression.substring(0, expression.length - 1);
    }
    return expression;
  }

  private isRubySentence(sentence: string): boolean {
    return sentence.includes('<ruby>');
  }

  /* attempts to highlight the word given the rubyfied sentence */
  private highlightWordRuby(sentenceRuby: string): [string, string | null] {

    const cache = Array.from(this.plainReplaceCache)
    let longestSubstr: string | null = null;
    if (cache.length > 0) {
      longestSubstr = cache.reduce((a, b) =>
        a.length > b.length ? a : b
      );
    }
    if (longestSubstr === null) {
      return [sentenceRuby, null];
    }

    // ruby format example:
    // <ruby><rb>端</rb><rt>はじ</rt></ruby>
    let replaceResult: string[] = [];
    const beforeKanjiRegex = '(<ruby>(<rb>)?)';
    // \u3040-\u30ff should specify hiragana + katakana
    // this assumes that all kanjis have readings, which may be incorrect
    const afterKanjiRegex = '((</rb><rt>[\u3040-\u30ff]*?)(</rt></ruby>))';
    const betweenKanjiRegex = `(${beforeKanjiRegex}${afterKanjiRegex})?`;

    for (let i = 0; i < longestSubstr.length - 1; i++) {
      const previous = longestSubstr[i];
      const after = longestSubstr[i + 1];

      // if first index is kanji
      if (i === 0 && !isKana(previous)) {
        replaceResult.push(beforeKanjiRegex);
      }

      replaceResult.push(escapeRegExp(previous));

      if (isKana(previous) && !isKana(after)) {
        // kana + non-kana
        replaceResult.push(beforeKanjiRegex);
      } else if (!isKana(previous) && isKana(after)) {
        // non-kana + kana
        replaceResult.push(afterKanjiRegex);
      } else if (!isKana(previous) && !isKana(after)) {
        // kana + kana
        replaceResult.push(betweenKanjiRegex);
      }
    }

    // adds last character
    if (longestSubstr.length) {
      const lastChr = longestSubstr[longestSubstr.length - 1];

      replaceResult.push(lastChr);
      if (!isKana(escapeRegExp(lastChr))) {
        replaceResult.push(afterKanjiRegex);
      }
    }

    // searches for:
    // - the ruby reading
    // - or regular result (valid if SentenceReading is not filled)
    // brackets around everything to use $1
    const replace = `((${replaceResult.join('')})|(${longestSubstr}))`;
    const replaceRegex = new RegExp(replace, 'g');
    const matchResult = sentenceRuby.match(replaceRegex);

    const result = sentenceRuby.replace(replaceRegex, `<b>$1</b>`);

    this.logger.debug(`highlightWordRuby replace: ${replace}`, 2);
    this.logger.debug(`highlightWordRuby sentenceRuby: ${sentenceRuby}`, 2);
    this.logger.debug(`highlightWordRuby result: ${result}`, 2);

    return [result, matchResult === null ? null : matchResult[0]];
  }

  private highlightWordPlain(
    sentence: string, // can be ruby sentence or plain sentence
    searchStrings: SearchStrings
  ): [string, string | null] {
    let replace = this.findPlainReplace(sentence, searchStrings);
    let result = sentence;

    if (replace !== null && replace.length > 0) {
      result = sentence.replace(
        new RegExp(`(${escapeRegExp(replace)})`, 'g'),
        `<b>$1</b>`
      );
    }

    this.logger.debug(`highlightWordPlain sentence: ${sentence}`, 2);
    this.logger.debug(`highlightWordPlain result: ${result}`, 2);
    this.logger.debug(`highlightWordPlain replace: ${replace}`, 2);

    return [result, replace];
  }

  /*
   * Returns with new sentence and found replacement
   */
  highlightWord(
    sentence: string, // can be ruby sentence or plain sentence
    searchStrings: SearchStrings,
    plainSentence?: string
  ): [string, string | null] {

    if (this.isRubySentence(sentence) && !this.attemptedPlainReplace) {
      if (plainSentence === undefined) {
        this.logger.warn("plainSentence is undefined when trying to highlight ruby sentence");
      } else {
        // side effect: caches replace beforehand
        if (this.plainReplaceCache.size === 0) {
          this.logger.debug("attempting to cache beforehand...");
          this.findPlainReplace(plainSentence, searchStrings);
        }
      }
      return this.highlightWordRuby(sentence);
    }
    return this.highlightWordPlain(sentence, searchStrings);
  }
}
