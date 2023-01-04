import { Module, ModuleId } from '../module';
import { getOption, checkOptTags } from '../options';
import {
  countOccurancesInString,
  TAGS_LIST,
  paIndicator,
  getCardType,
  fieldAnyExist,
  fieldNoneExist,
  getFieldValue,
  plainToKanaOnly,
} from '../utils';
import { compileOpts } from '../consts';
import { AutoHighlightWord, SearchStrings } from '../side-modules/autoHighlightWord';

type Sentence = {
  // open quote, sentence, closed quote
  readonly open: Element;
  readonly contents: Element;
  readonly close: Element;

  readonly base: Element;
};

type QuoteProcessMode = 'add' | 'remove' | 'as-is' | 'none';
type QuoteDisplayMode = 'block' | 'flow' | 'indent' | 'no-indent' | 'right-shifted';

export type SentenceType = 'fullSent' | 'display';
type OptionSentenceType = SentenceType | 'altDisplay';

const sentenceStyleClasses = [
  'sentence-unquoted-display-indent',
  'sentence-unquoted-display-no-indent',
  'sentence-unquoted-display-right-shifted',
  'sentence-quoted-display-block',
  'sentence-quoted-display-flow',
];
type SentenceStyleClass = typeof sentenceStyleClasses[number];

// subset of an entry in anki-connect's `notesInfo` call
//type NoteInfoTags = {
//  readonly tags: string[];
//}

type NoteInfoSentence = {
  readonly tags?: string[];
  readonly fields: {
    readonly Word: {
      readonly value: string;
    };
    readonly WordReading: {
      readonly value: string;
    };
    readonly WordReadingHiragana: {
      readonly value: string;
    };
    readonly Sentence: {
      readonly value: string;
    };
  };
};

export class SentUtils extends Module {
  private readonly quoteMatches = getOption('sentUtils.quotes.matches');
  private readonly autoHighlight = compileOpts['enableModule.sentUtils.autoHighlight']
    ? new AutoHighlightWord()
    : null;

  private tags = TAGS_LIST;

  constructor(id: ModuleId) {
    super(id);
  }

  // replaces bolded elements with [...]
  private clozeReplaceBold(sentContents: string) {
    // uses an html parser so embedded <b> tags can be taken into account
    const tempEle = document.createElement('span');
    tempEle.innerHTML = sentContents;

    const bTags = tempEle.getElementsByTagName('b');
    for (const bTag of bTags) {
      bTag.innerHTML = '[...]';
    }

    return tempEle.innerHTML;
  }

  private getOptSentType(
    sentType: SentenceType,
    isAltDisplay: boolean
  ): OptionSentenceType {
    if (sentType === 'display' && isAltDisplay) {
      return 'altDisplay';
    }
    return sentType;
  }

  // returns [quote, strippedSentence, quote] if found
  // otherwise, returns ["", originalSentence, ""]
  private checkQuoteAndStrip(sentContents: string): [string, string, string] {
    // qp is "quote pair"
    for (const qp of this.quoteMatches) {
      const [i1, i2] = [0, qp.open.length]; // open quote
      const [j1, j2] = [sentContents.length - qp.close.length, sentContents.length]; // close quote

      if (
        // TODO test for arbitrary length quote openings / closings
        sentContents.substring(i1, i2) === qp.open &&
        sentContents.substring(j1, j2) === qp.close
      ) {
        return [
          sentContents.substring(i1, i2),
          sentContents.substring(i2, j1),
          sentContents.substring(j1, j2),
        ];
      }
    }

    return ['', sentContents, ''];
  }

  private isQuoted(sentContents: string): boolean {
    return this.checkQuoteAndStrip(sentContents)[0] !== '';
  }

  // checks that either one of:
  // - not surrounded by a quote but valid number of quotes
  // - surrounded by a quote but valid number of more quotes
  // - opening and closing quote numbers are equal
  // TODO test:
  //  "「「A」」" -> true
  //  "「」「」" -> true
  //  "「」A" -> true
  //  "A「」A" -> true
  //  "「A」" -> false
  //  "A" -> false
  //  "「A」」" -> false
  //private canBeMulti(sentContents: string): boolean {
  //  let numOpen = 0;
  //  let numClosed = 0;

  //  for (const qp of this.quoteMatches) {
  //    const o = countOccurancesInString(sentContents, qp.open);
  //    const c = countOccurancesInString(sentContents, qp.close);
  //    if (o !== c) {
  //      this.logger.debug(`uneven # quotes for ${qp}`);
  //      return false;
  //    }
  //    numOpen += o;
  //    numClosed += c;
  //  }

  //  if (this.isQuoted(sentContents)) {
  //    return numOpen + numClosed > 2;
  //  }
  //  // not quoted
  //  return numOpen + numClosed >= 2;
  //}

  //private attemptParseMulti(sentContents: string): Sentence[] | null {
  //  return null;
  //}

  private colorQuotes(sent: Sentence) {
    sent.open.classList.add(paIndicator.className);
    sent.close.classList.add(paIndicator.className);

    // the things below are only for the main card type
    if (getCardType() !== 'main') {
      return;
    }

    // removes pa indicator for hover cards / click cards (sentences)
    if (fieldAnyExist('IsHoverCard', 'IsClickCard')) {
      let elemsHybrid = document.getElementsByClassName('expression__hybrid');
      for (const e of elemsHybrid) {
        e.classList.add('expression__hybrid--remove-pa-indicator');
      }
    }

    // neither hover & click and is either one of TSC / sentence -> removes flag
    if (
      fieldNoneExist('IsHoverCard', 'IsClickCard', 'IsHintCard') &&
      fieldAnyExist('IsTargetedSentenceCard', 'IsSentenceCard')
    ) {
      let elemsExpr = document.getElementsByClassName('expression');
      for (const e of elemsExpr) {
        e.classList.add('expression--remove-pa-indicator');
      }
    }
  }

  // note: this function adds css!
  private processQuotes(
    sent: Sentence,
    sentContents: string,
    processMode: QuoteProcessMode,
    sentType: SentenceType
  ) {
    let [o, strippedSent, c] = this.checkQuoteAndStrip(sentContents);

    // strips of any classes that came from the compilation step
    for (const cls of sentenceStyleClasses) {
      sent.base.classList.toggle(cls, false);
    }

    if (processMode === 'add') {
      if (o === '' && c === '') {
        // only adds if there weren't quotes already
        o = getOption('sentUtils.quotes.quoteOpen');
        c = getOption('sentUtils.quotes.quoteClose');
      }
    } else if (processMode === 'remove') {
      o = '';
      c = '';
    } else {
      // as-is
      // nothing to do it seems?
    }

    let sentenceStyleClass: SentenceStyleClass;
    const dispMode = this.getQuoteDisplayMode(sentType, o !== '', sentType === 'display');
    this.logger.debug(
      `${sentType} | ${processMode} -> ${o === '' ? 'unquoted' : 'quoted'} | ${dispMode}`
    );

    if (dispMode === 'indent') {
      sentenceStyleClass = 'sentence-unquoted-display-indent';
    } else if (dispMode === 'no-indent') {
      sentenceStyleClass = 'sentence-unquoted-display-no-indent';
    } else if (dispMode === 'right-shifted') {
      sentenceStyleClass = 'sentence-unquoted-display-right-shifted';
    } else if (dispMode === 'flow') {
      sentenceStyleClass = 'sentence-quoted-display-flow';
    } else {
      // block
      sentenceStyleClass = 'sentence-quoted-display-block';
    }

    // attempts to color quotes if quotes exists and options specify so
    if (
      o !== '' &&
      fieldAnyExist('PAShowInfo') &&
      ((getCardType() === 'main' && // either main or pa sentence option
        getOption('sentUtils.display.quotes.paIndicatorColor.main')) ||
        (getCardType() === 'pa_sent' &&
          getOption('sentUtils.display.quotes.paIndicatorColor.paSent')))
    ) {
      this.colorQuotes(sent);
    }

    sent.base.classList.toggle(sentenceStyleClass, true);

    return [o, strippedSent, c];
  }

  private fixDivList(sent: Element): string {
    // checks that all children are 'div's
    const arr = Array.from(sent.children);
    if (arr.length > 0 && arr.every((x) => x.nodeName === 'DIV')) {
      if (getOption('sentUtils.fixDivList.warnOnFix')) {
        this.logger.warn(
          `Following sentence was stripped of div elements: ${sent.innerHTML}`
        );
      }
      return arr.map((x) => x.innerHTML).join('<br>');
    }
    return sent.innerHTML;
  }

  private getQuoteProcessMode(
    optSentType: OptionSentenceType,
    checkTags = false
  ): QuoteProcessMode {
    if (checkTags) {
      const processMode = checkOptTags(this.tags, [
        ['sentUtils.display.quotes.processMode.tagOverride.add', 'add'],
        ['sentUtils.display.quotes.processMode.tagOverride.remove', 'remove'],
        ['sentUtils.display.quotes.processMode.tagOverride.asIs', 'as-is'],
        ['sentUtils.display.quotes.processMode.tagOverride.none', 'none'],
      ]);
      if (processMode !== undefined) {
        return processMode;
      }
    }

    return getOption(`sentUtils.${optSentType}.quotes.processMode`) as QuoteProcessMode;
  }

  private getQuoteDisplayMode(
    sentType: SentenceType,
    isQuoted: boolean,
    checkTags = false
  ): QuoteDisplayMode {
    if (checkTags) {
      let displayMode;
      if (isQuoted) {
        displayMode = checkOptTags(this.tags, [
          ['sentUtils.display.quotes.displayMode.quoted.tagOverride.block', 'block'],
          ['sentUtils.display.quotes.displayMode.quoted.tagOverride.flow', 'flow'],
        ]);
      } else {
        displayMode = checkOptTags(this.tags, [
          [
            'sentUtils.display.quotes.displayMode.unquoted.tagOverride.indented',
            'indented',
          ],
          [
            'sentUtils.display.quotes.displayMode.unquoted.tagOverride.noIndent',
            'no-indent',
          ],
          [
            'sentUtils.display.quotes.displayMode.unquoted.tagOverride.rightShifted',
            'right-shifted',
          ],
        ]);
      }
      if (displayMode !== undefined) {
        return displayMode;
      }
    }
    return getOption(
      `sentUtils.${sentType}.quotes.displayMode.${isQuoted ? 'quoted' : 'unquoted'}`
    ) as QuoteDisplayMode;
  }

  private processPeriod(sentContents: string): string {
    const periods = getOption('sentUtils.removeFinalPeriod.validPeriods');
    const re = new RegExp(`[${periods}]$`);
    return sentContents.replace(re, '');
  }

  private autoHighlightLog(sentType: SentenceType, replace: string | null, word: string) {
    // additional logging here
    if (replace === null) {
      const msg = `Could not highlight word in ${sentType}: ${word}.`;
      if (getOption('sentUtils.autoHighlightWord.warnIfAutoHighlightFails')) {
        this.logger.warn(msg);
      } else {
        this.logger.debug(msg);
      }
    } else {
      // was able to bold something
      const msg = `Automatically highlighted word in ${sentType}: ${replace}.`;
      if (getOption('sentUtils.autoHighlightWord.warnOnAutoHighlight')) {
        this.logger.warn(msg);
      } else {
        this.logger.debug(msg);
      }
    }
  }

  // not private since it may be used in tooltip builder
  processSentence(
    sent: Sentence,
    sentType: SentenceType,
    noteInfo: NoteInfoSentence,
    isMulti: boolean = false
  ) {
    // only valid for sentenceType == 'display' anyways
    const isAltDisplay = sent.contents.classList.contains('expression-inner--altdisplay');
    const isClozeDeletion = sent.contents.classList.contains(
      'expression-inner--cloze-deletion'
    );

    let result: string = sent.contents.innerHTML;
    this.logger.debug(`init: "${result}"`, 1);

    // ------------------------------------------------------------------------
    // attempts to remove the weird list of div thing that can happen

    if (getOption('sentUtils.fixDivList.enabled')) {
      result = this.fixDivList(sent.contents);
    }
    this.logger.debug(`fixDivList: "${result}"`, 1);

    // ------------------------------------------------------------------------
    // removes leading and trailing white space (equiv. of strip() in python)
    result = result.trim();
    this.logger.debug(`trim: "${result}"`, 1);

    // ------------------------------------------------------------------------
    // auto highlight
    if (
      !result.match(/<(b)>/) &&
      this.autoHighlight !== null &&
      getOption('sentUtils.autoHighlightWord')
    ) {
      const searchStrings: SearchStrings = [
        { value: noteInfo.fields.Word.value },
        { value: plainToKanaOnly(noteInfo.fields.WordReading.value) },
        { value: noteInfo.fields.WordReadingHiragana.value },
      ];
      let replace: string | null;
      [result, replace] = this.autoHighlight.highlightWord(result, searchStrings);
      this.autoHighlightLog(sentType, replace, noteInfo.fields.Word.value);
      this.logger.debug(`autoHighlight: "${result}"`, 1);
    }

    // ------------------------------------------------------------------------
    // cloze deletion
    if (sentType === 'display' && isClozeDeletion) {
      result = this.clozeReplaceBold(result);
      this.logger.debug(`clozeReplaceBold: "${result}"`, 1);
    }

    // ------------------------------------------------------------------------
    // checks for multi (TODO)
    //if (
    //  !isMulti &&
    //  getOption(`sentUtils.${optSentType}.quotes.processMode.searchMulti`) &&
    //  this.canBeMulti(result)
    //) {
    //  const multi = this.attemptParseMulti(result);
    //  if (multi !== null) {
    //    // it was found!
    //  }
    //}

    const optSentType = this.getOptSentType(sentType, isAltDisplay);
    const processMode = this.getQuoteProcessMode(optSentType, sentType === 'display');

    let o, c;
    if (processMode === 'none') {
      // nothing is done with the quotes
      o = '';
      c = '';
    } else {
      // process quotes and add the appropriate css
      [o, result, c] = this.processQuotes(sent, result, processMode, sentType);
      this.logger.debug(`processQuotes: "${o}", "${result}", "${c}"`, 1);
    }

    // ------------------------------------------------------------------------
    // now that quotes are parsed, it's safe to check for period
    // although realistically, periods don't appear at the end of a quote
    // or right after a quote anyways?
    const isQuoted = o.length === 0 ? 'unquoted' : 'quoted';
    if (getOption(`sentUtils.removeFinalPeriod.${optSentType}.${isQuoted}`)) {
      result = this.processPeriod(result);
      this.logger.debug(`processPeriod: "${result}"`, 1);
    }

    // ------------------------------------------------------------------------
    // we are done
    sent.open.innerHTML = o;
    sent.contents.innerHTML = result;
    sent.close.innerHTML = c;
    this.logger.debug(`final: "${o}${result}${c}"`, 1);
  }

  extractSentenceAndProcess(sentEle: Element, sentenceType: SentenceType) {
    if (sentEle.children.length === 3) {
      const sent: Sentence = {
        open: sentEle.children[0] as Element,
        contents: sentEle.children[1] as Element,
        close: sentEle.children[2] as Element,
        base: sentEle,
      };

      const noteInfoSentence: NoteInfoSentence = {
        fields: {
          Word: { value: getFieldValue('Word') },
          WordReading: { value: getFieldValue('WordReading') },
          WordReadingHiragana: { value: getFieldValue('WordReading') },
          Sentence: { value: getFieldValue('Sentence') },
        },
      };

      this.processSentence(sent, sentenceType, noteInfoSentence, false);
    } else {
      this.logger.warn(`invalid sentence format (${sentenceType}): ${sentEle.innerHTML}`);
    }
  }

  private processDisplaySentences() {
    const sentEles = document.querySelectorAll('.expression--sentence');

    for (const sentEle of sentEles) {
      this.extractSentenceAndProcess(sentEle, 'display');
    }
  }

  private processFullSentence() {
    const sentEle = document.getElementById('full_sentence');
    if (sentEle !== null) {
      this.extractSentenceAndProcess(sentEle, 'fullSent');
    }
  }

  main() {
    this.processDisplaySentences();
    this.processFullSentence();
  }
}
