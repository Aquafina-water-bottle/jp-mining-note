import { Module } from '../module';
import { getOption, checkOptTags } from '../options';
import {
  countOccurancesInString,
  TAGS_LIST,
  paIndicator,
  getCardType,
  fieldAnyExist,
  fieldNoneExist,
} from '../utils';

type Sentence = {
  // open quote, sentence, closed quote
  readonly open: Element;
  readonly contents: Element;
  readonly close: Element;

  readonly base: Element;
};

type SentenceType = 'fullSent' | 'display';
type OptionSentenceType = SentenceType | 'altDisplay';
//type QuoteProcessMode = 'add' | 'remove' | 'as-is' | 'none';

type QuotePair = {
  open: string;
  close: string;
};

const sentenceStyleClasses = [
  'sentence-unquoted-display-indent',
  'sentence-unquoted-display-no-indent',
  'sentence-unquoted-display-right-shifted',
  'sentence-quoted-display-block',
  'sentence-quoted-display-flow',
];
type SentenceStyleClass = typeof sentenceStyleClasses[number];

export class SentUtils extends Module {
  private readonly quoteMatches = getOption('sentUtils.quotes.matches');

  // replaces bolded elements with [...]
  clozeReplaceBold(sentContents: string) {
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
      if (
        // TODO test for arbitrary length quote openings / closings
        sentContents.substring(0, qp.open.length) === qp.open &&
        sentContents.substring(
          sentContents.length - 1 - qp.close.length,
          sentContents.length - 1
        ) === qp.close
      ) {
        return [
          sentContents.substring(0, qp.open.length),
          sentContents.substring(
            qp.open.length,
            sentContents.length - 1 - qp.close.length
          ),
          sentContents.substring(
            sentContents.length - 1 - qp.close.length,
            sentContents.length - 1
          ),
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

    this.logger.debug(paIndicator.type);

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

  private processQuotes(
    sent: Sentence,
    sentContents: string,
    processMode: string,
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
    if (o === '') {
      // unquoted
      const dispMode = getOption(`sentUtils.${sentType}.quotes.displayMode.unquoted`);
      if (dispMode === 'indent') {
        sentenceStyleClass = 'sentence-unquoted-display-indent';
      } else if (dispMode === 'no-indent') {
        sentenceStyleClass = 'sentence-unquoted-display-no-indent';
      } else {
        // right-shifted
        sentenceStyleClass = 'sentence-unquoted-display-right-shifted';
      }
    } else {
      const dispMode = getOption(`sentUtils.${sentType}.quotes.displayMode.quoted`);
      if (dispMode === 'block') {
        sentenceStyleClass = 'sentence-quoted-display-block';
      } else {
        // flow
        sentenceStyleClass = 'sentence-quoted-display-flow';
      }

      // quotes are guaranteed here!
      if (
        fieldAnyExist('PAShowInfo') &&
        ((getCardType() === 'main' && // either main or pa sentence option
          getOption('sentUtils.display.quotes.paIndicatorColor.main')) ||
          (getCardType() === 'pa_sent' &&
            getOption('sentUtils.display.quotes.paIndicatorColor.paSent')))
      ) {
        this.colorQuotes(sent);
      }
    }

    sent.base.classList.toggle(sentenceStyleClass, true);
    sent.open.innerHTML = o;
    sent.contents.innerHTML = strippedSent;
    sent.close.innerHTML = c;
  }

  private fixDivList(sent: Element): string {
    // checks that all children are 'div's
    const arr = Array.from(sent.children);
    if (arr.every((x) => x.nodeName === 'div')) {
      return arr.map((x) => x.innerHTML).join('<br>');
    }
    return sent.innerHTML;
  }

  private getQuoteProcessMode(
    optSentType: OptionSentenceType,
    checkTags = false
  ): string {
    if (checkTags) {
      const processMode = checkOptTags(TAGS_LIST, [
        ['sentUtils.display.quotes.processMode.tagOverride.add', 'add'],
        ['sentUtils.display.quotes.processMode.tagOverride.remove', 'remove'],
        ['sentUtils.display.quotes.processMode.tagOverride.asIs', 'as-is'],
        ['sentUtils.display.quotes.processMode.tagOverride.none', 'none'],
      ]);
      if (typeof processMode !== 'undefined') {
        return processMode;
      }
    }

    return getOption(`sentUtils.${optSentType}.quotes.processMode`) as string;
  }

  processSentence(sent: Sentence, sentType: SentenceType, isMulti: boolean = false) {
    // only valid for sentenceType == 'display' anyways
    const isAltDisplay = sent.contents.classList.contains('expression-inner--altdisplay');
    const isClozeDeletion = sent.contents.classList.contains(
      'expression-inner--cloze-deletion'
    );

    // attempts to remove the weird list of div thing that can happen
    let result: string = this.fixDivList(sent.contents);

    // removes leading and trailing white space (equiv. of strip() in python)
    result = result.trim();

    // TODO attempt to highlight the word here (before cloze deletion bold)

    if (sentType === 'display' && isClozeDeletion) {
      result = this.clozeReplaceBold(result);
    }

    // checks for multi
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

    if (processMode === 'none') {
      // we are done
      sent.base.children[1].innerHTML = result;
      return;
    }

    // parses quotes
    this.processQuotes(sent, result, processMode, sentType);
  }

  main() {
    let sentEles = document.querySelectorAll('.expression--sentence');

    if (sentEles !== null) {
      for (const sentEle of sentEles) {
        if (sentEle.children.length === 3) {
          const sent: Sentence = {
            open: sentEle.children[0] as Element,
            contents: sentEle.children[1] as Element,
            close: sentEle.children[2] as Element,
            base: sentEle,
          };
          this.processSentence(sent, 'display', false);
        } else {
          this.logger.warn(`invalid sentence format: ${sentEle.innerHTML}`);
        }
      }
    }
  }
}
