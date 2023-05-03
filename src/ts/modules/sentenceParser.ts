import { RunnableModule } from '../module';
import { checkOptTags } from '../options';
import { getFieldValue } from '../fields';
import { plainToKanaOnly, getTags, getCardSide } from '../utils';
import { compileOpts } from '../consts';
import { AutoHighlightWord, SearchStrings } from './autoHighlightWord';
import {plainToKanjiOnly} from '../utils';

export type Sentence = {
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
type SentenceStyleClass = (typeof sentenceStyleClasses)[number];

export type QuotePair = {
  open: string;
  close: string;
};

// subset of an entry in anki-connect's `notesInfo` call
//type NoteInfoTags = {
//  readonly tags: string[];
//}

export type NoteInfoSentence = {
  readonly Word: string;
  readonly WordReading: string;
  readonly WordReadingHiragana: string;
  readonly Sentence: string;
};

export type SentenceParserArgs = {
  debugLevel?: number;
};

export class SentenceParser extends RunnableModule {
  private readonly quoteMatches = this.getOption('sentenceParser.quotes.matches');
  private readonly autoHighlight = compileOpts[
    'enableModule.sentenceParser.autoHighlight'
  ]
    ? new AutoHighlightWord()
    : null;

  private debugLevel: number;

  constructor(id?: string, args?: SentenceParserArgs) {
    super('sentenceParser', id);
    this.debugLevel = args?.debugLevel ?? 3;
  }

  // replaces bolded elements with [...]
  private clozeReplaceBold(sentContents: string) {
    // uses an html parser so embedded <b> tags can be taken into account
    const tempEle = document.createElement('span');
    tempEle.innerHTML = sentContents;

    const bTags = Array.from(tempEle.getElementsByTagName('b'));
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

  //private colorQuotes(sent: Sentence) {
  //  sent.open.classList.add(paIndicator.className);
  //  sent.close.classList.add(paIndicator.className);

  //  // the things below are only for the main card type
  //  if (getCardType() !== 'main') {
  //    return;
  //  }

  //  // removes pa indicator for hover cards / click cards (sentences)
  //  if (fieldsAnyFilled('IsHoverCard', 'IsClickCard')) {
  //    let elemsHybrid = document.getElementsByClassName('expression__hybrid');
  //    for (const e of elemsHybrid) {
  //      e.classList.add('expression__hybrid--remove-pa-indicator');
  //    }
  //  }

  //  // neither hover & click and is either one of TSC / sentence -> removes flag
  //  if (
  //    fieldsAllEmpty('IsHoverCard', 'IsClickCard', 'IsHintCard') &&
  //    fieldsAnyFilled('IsTargetedSentenceCard', 'IsSentenceCard')
  //  ) {
  //    let elemsExpr = document.getElementsByClassName('expression');
  //    for (const e of elemsExpr) {
  //      e.classList.add('expression--remove-pa-indicator');
  //    }
  //  }
  //}

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
      // no quotes are added if the sentence is empty in the first place
      // this could be a runtime option, but only if there is demand and/or a use case
      if (o === '' && c === '' && sent.contents.innerHTML.length > 0) {
        // only adds if there weren't quotes already
        o = this.getOption('sentenceParser.quotes.quoteOpen');
        c = this.getOption('sentenceParser.quotes.quoteClose');
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
      `${sentType} | ${processMode} -> ${o === '' ? 'unquoted' : 'quoted'} | ${dispMode}`,
      this.debugLevel
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
    //if (
    //  o !== '' &&
    //  fieldsAnyFilled('PAShowInfo') &&
    //  ((getCardType() === 'main' && // either main or pa sentence option
    //    this.getOption('sentenceParser.display.quotes.paIndicatorColor.main')) ||
    //    (getCardType() === 'pa_sent' &&
    //      this.getOption('sentenceParser.display.quotes.paIndicatorColor.paSent')))
    //) {
    //  this.colorQuotes(sent);
    //}

    sent.base.classList.toggle(sentenceStyleClass, true);

    return [o, strippedSent, c];
  }

  private fixDivList(sent: Element): string {
    // checks that all children are 'div's
    const arr = Array.from(sent.children);
    if (arr.length > 0 && arr.every((x) => x.nodeName === 'DIV')) {
      this.logger.warn(
        `Following sentence was stripped of div elements: ${sent.innerHTML}`
      );
      return arr.map((x) => x.innerHTML).join('<br>');
    }
    return sent.innerHTML;
  }

  private getQuoteProcessMode(
    optSentType: OptionSentenceType,
    checkTags = false
  ): QuoteProcessMode {
    if (checkTags) {
      const processMode = checkOptTags(getTags(), [
        ['sentenceParser.display.quotes.processMode.tagOverride.add', 'add'],
        ['sentenceParser.display.quotes.processMode.tagOverride.remove', 'remove'],
        ['sentenceParser.display.quotes.processMode.tagOverride.asIs', 'as-is'],
        ['sentenceParser.display.quotes.processMode.tagOverride.none', 'none'],
      ]);
      if (processMode !== undefined) {
        return processMode;
      }
    }

    return this.getOption(
      `sentenceParser.${optSentType}.quotes.processMode`
    ) as QuoteProcessMode;
  }

  private getQuoteDisplayMode(
    sentType: SentenceType,
    isQuoted: boolean,
    checkTags = false
  ): QuoteDisplayMode {
    if (checkTags) {
      let displayMode;
      if (isQuoted) {
        displayMode = checkOptTags(getTags(), [
          ['sentenceParser.display.quotes.displayMode.quoted.tagOverride.block', 'block'],
          ['sentenceParser.display.quotes.displayMode.quoted.tagOverride.flow', 'flow'],
        ]);
      } else {
        displayMode = checkOptTags(getTags(), [
          [
            'sentenceParser.display.quotes.displayMode.unquoted.tagOverride.indented',
            'indented',
          ],
          [
            'sentenceParser.display.quotes.displayMode.unquoted.tagOverride.noIndent',
            'no-indent',
          ],
          [
            'sentenceParser.display.quotes.displayMode.unquoted.tagOverride.rightShifted',
            'right-shifted',
          ],
        ]);
      }
      if (displayMode !== undefined) {
        return displayMode;
      }
    }
    return this.getOption(
      `sentenceParser.${sentType}.quotes.displayMode.${isQuoted ? 'quoted' : 'unquoted'}`
    ) as QuoteDisplayMode;
  }

  private processPeriod(sentContents: string): string {
    const periods = this.getOption('sentenceParser.removeFinalPeriod.validPeriods');
    const rxLastPeriod = new RegExp(`[${periods}]$`);
    const rxPeriods = new RegExp(`[${periods}]`, 'g');

    // we use regex to remove tags instead of the safer alternative of invoking an HTML parser
    // since this should be much faster + this is a simple enough case
    const rxTags = new RegExp(`<.*?>`, 'g');

    // the last period can be part of an html tag, i.e. `(text)<b>(text)。</b>`
    // therefore, we strip the tags to search, and then if found, remove the last found period
    // within the actual sentContents
    if (rxLastPeriod.test(sentContents.replace(rxTags, ''))) {
      const results = Array.from(sentContents.matchAll(rxPeriods));
      if (results.length > 0) {
        // lastIndexOf only works on strings and not regex it seems?
        const i = results[results.length - 1].index; // position of last period
        if (i !== undefined) {
          return sentContents.substring(0, i) + sentContents.substring(i + 1);
        }
      }
    }
    return sentContents;
  }

  private autoHighlightLog(sentType: SentenceType, replace: string | null, word: string) {
    if (replace === null) {
      this.logger.warn(`Could not highlight word in ${sentType}: ${word}.`);
    } else {
      // was able to bold something
      this.logger.warn(`Automatically highlighted word in ${sentType}: ${replace}.`);
    }
  }

  // not private since it may be used in tooltip builder
  // isMulti is an internal argument. May be moved to a private function...
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

    if (this.getOption('sentenceParser.fixDivList.enabled')) {
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
      result.length > 0 &&
      !result.match(/<b>/) &&
      this.autoHighlight !== null &&
      this.getOption('sentenceParser.autoHighlightWord.enabled')
    ) {
      const searchStrings: SearchStrings = [
        { value: noteInfo.Word },
        { value: plainToKanaOnly(noteInfo.WordReading) },
        { value: noteInfo.WordReadingHiragana },
      ];
      let replace: string | null;
      [result, replace] = this.autoHighlight.highlightWord(
        result,
        searchStrings,
        noteInfo.Sentence
      );
      this.autoHighlightLog(sentType, replace, noteInfo.Word);
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
    //  this.getOption(`sentenceParser.${optSentType}.quotes.processMode.searchMulti`) &&
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
    if (this.getOption(`sentenceParser.removeFinalPeriod.${optSentType}.${isQuoted}`)) {
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
    if (sentEle.innerHTML.trim().length === 0) {
      return; // nothing to do
    }

    if (sentEle.children.length === 3) {
      const sent: Sentence = {
        open: sentEle.children[0] as Element,
        contents: sentEle.children[1] as Element,
        close: sentEle.children[2] as Element,
        base: sentEle,
      };

      const noteInfoSentence: NoteInfoSentence = {
        Word: getFieldValue('Word'),
        WordReading: getFieldValue('WordReading'),
        WordReadingHiragana: getFieldValue('WordReadingHiragana'),
        Sentence: getFieldValue('Sentence'),
      };

      this.processSentence(sent, sentenceType, noteInfoSentence, false);
    } else {
      this.logger.warn(`Invalid sentence format (${sentenceType}): ${sentEle.innerHTML}`);
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

  private compareSentenceReading() {
    const sentence = getFieldValue("Sentence")
    const sentReading = plainToKanjiOnly(getFieldValue("SentenceReading"));
    if (sentReading.trim().length !== 0 && sentence.trim() !== sentReading.trim()) {
      this.logger.warn(`The Sentence field is not the same as the SentenceReading field. Your sentence might be displayed incorrectly. See <a href="https://aquafina-water-bottle.github.io/jp-mining-note-prerelease/faq/#the-sentencereading-field-is-not-updated-is-different-from-the-sentence-field">here</a> for more info.`, {isHtml: true})
    }
  }

  main() {
    this.processDisplaySentences();
    this.processFullSentence();
    if (getCardSide() === "back" && this.getOption("sentenceParser.checkSentenceReadingEqualsSentence")) {
      this.compareSentenceReading();
    }
  }
}
