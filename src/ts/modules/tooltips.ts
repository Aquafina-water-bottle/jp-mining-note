import { compileOpts } from '../consts';
import { Module } from '../module';
import {
  AutoPitchAccent,
  AutoPitchAccentArgs,
  NoteInfoPA,
  PAGroup,
} from './autoPitchAccent';
import { NoteInfoSentence, SentenceParser } from './sentenceParser';
import { Sentence } from './sentenceParser';
import { invoke, escapeQueryStr, QueryBuilder, CardInfo } from '../ankiConnectUtils';
import { plainToRuby } from '../utils';

export type NoteInfoTooltipBuilder = NoteInfoPA & NoteInfoSentence;
export type TooltipAddCardArgs = {
  character?: string;
  isNew?: boolean;
  cardId?: number;
};

export type QueryBuilderGroup = {
  'nonNew.hidden': QueryBuilder;
  'nonNew.default': QueryBuilder;
  'new.hidden': QueryBuilder;
  'new.default': QueryBuilder;
};

export class TooltipCardDivBuilder {
  // separate class in order to separate itself from the Module class (and to not
  // waste the getOption / overrideOptions function calls)

  private readonly tooltips: Tooltips;
  private wordDiv: HTMLDivElement | null = null;
  private mainPAGroup: PAGroup | null = null;
  private sentDiv: HTMLDivElement | null = null;
  private isNew = false;

  constructor(tooltips: Tooltips) {
    this.tooltips = tooltips;
  }

  addWordDiv(div: HTMLDivElement) {
    this.wordDiv = div;
    return this;
  }

  addSentDiv(div: HTMLDivElement) {
    this.sentDiv = div;
    return this;
  }

  createWordDiv(
    noteInfo: NoteInfoTooltipBuilder,
    character: string | null = null,
    cardId: number | null = null
  ) {
    [this.wordDiv, this.mainPAGroup] = this.tooltips.buildWordDiv(
      noteInfo,
      character,
      cardId
    );
    return this;
  }

  createSentDiv(noteInfo: NoteInfoTooltipBuilder) {
    this.sentDiv = this.tooltips.buildSentDiv(noteInfo);
    return this;
  }

  /* greys out the card */
  setNew() {
    this.isNew = true;
  }

  build(): HTMLDivElement {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('hover-tooltip__card');

    if (this.wordDiv === null && this.sentDiv === null) {
      throw Error('Cannot make a card with both empty wordDiv and sentDiv');
    }

    if (this.mainPAGroup) {
      // here because tooltips shouldn't store this info
      // TODO refactor this? feels hacky to have this here...
      // highlights the kanji
      if (
        this.tooltips.autoPA.getOption(
          'autoPitchAccent.coloredPitchAccent.color.wordReadingKanji'
        )
      ) {
        const wordClass = 'pa-sentence-highlight-' + this.mainPAGroup; // sentence so it only highlights bold
        this.wordDiv?.classList.add(wordClass);
      }
      // highlights the sentence
      if (
        this.tooltips.autoPA.getOption(
          'autoPitchAccent.coloredPitchAccent.color.fullSentence'
        ) &&
        this.tooltips.getOption('tooltips.highlightWordInSentence')
      ) {
        this.sentDiv?.classList.add(`pa-sentence-highlight-${this.mainPAGroup}`);
      }
    }
    if (this.tooltips.getOption('tooltips.highlightWordInSentence')) {
      this.sentDiv?.classList.add('highlight-bold');
    }

    if (this.wordDiv !== null) {
      cardDiv.appendChild(this.wordDiv);
    }
    if (this.sentDiv !== null) {
      cardDiv.appendChild(this.sentDiv);
    }

    if (this.sentDiv !== null && this.wordDiv === null) {
      cardDiv.classList.add('hover-tooltip__card--sentence-only');
    }

    if (this.isNew) {
      cardDiv.classList.add('hover-tooltip__card--new');
    }
    if (this.tooltips.getOption('tooltips.displayPitchAccentOnHoverOnly')) {
      cardDiv.classList.add('hover-tooltip__card-div--hover');
    }

    return cardDiv;
  }
}

export class TooltipBuilder {
  // separate class in order to separate itself from the Module class (and to not
  // waste the getOption / overrideOptions function calls)

  private readonly tooltips: Tooltips;
  private hoverText: string | HTMLElement | null = null;
  private onEmptyText: string | HTMLElement | null = null;
  private cardDivs: HTMLDivElement[] = [];

  constructor(tooltips: Tooltips) {
    this.tooltips = tooltips;
  }

  addCardDiv(cardDiv: HTMLDivElement) {
    //console.log(cardDiv)
    if (this.cardDivs.length > 0) {
      cardDiv.classList.add('hover-tooltip--not-first');
    }
    this.cardDivs.push(cardDiv);
  }

  addSeparator() {
    // TODO...
    const sepDiv = document.createElement('div');
    sepDiv.classList.add('hover-tooltip__card');
    sepDiv.classList.add('hover-tooltip__card--separator');

    this.cardDivs.push(sepDiv);
  }

  // what text should be hovered over
  addHoverText(text: string | HTMLElement) {
    this.hoverText = text;
  }

  addOnEmptyText(text: string | HTMLElement) {
    this.onEmptyText = text;
  }

  // TODO rename this entire class?
  // what is the tooltip vs hover text?
  buildTooltipOnly(): HTMLElement {
    /*
     * <span class="hover-tooltip"> ... </span>
     *
     */

    const tooltipSpan = document.createElement('span');
    tooltipSpan.classList.add('hover-tooltip');
    //tooltipSpan.classList.add("hover-tooltip--kanji-hover");

    for (const cardDiv of this.cardDivs) {
      tooltipSpan.appendChild(cardDiv);
    }

    // 0 length checks
    if (tooltipSpan.children.length === 0) {
      if (this.onEmptyText === null) {
        throw Error('Empty tooltip, but no empty text was specified');
      }

      if (typeof this.onEmptyText === 'string') {
        tooltipSpan.textContent = this.onEmptyText;
      } else {
        tooltipSpan.appendChild(this.onEmptyText);
      }
    }
    return tooltipSpan;
  }

  build(): HTMLElement {
    /*
     * <span class="hover-wrapper">
     *   <span class="hover-text"> (kanji) </span>
     *   <span class="hover-tooltip-wrapper">
     *     <span class="hover-tooltip"> ... </span>
     *   </span>
     * </span>
     *
     */

    if (this.hoverText === null) {
      throw Error('No hover text found, cannot build tooltip');
    }

    const tooltipWrapperSpan = document.createElement('span');
    tooltipWrapperSpan.classList.add('hover-tooltip-wrapper');

    const wrapper = document.createElement('span');
    wrapper.classList.add('hover-wrapper');

    const hoverText = document.createElement('span');
    hoverText.classList.add('hover-text');
    if (typeof this.hoverText === 'string') {
      hoverText.textContent = this.hoverText;
    } else {
      hoverText.appendChild(this.hoverText);
    }

    tooltipWrapperSpan.appendChild(this.buildTooltipOnly());

    wrapper.appendChild(hoverText);
    wrapper.appendChild(tooltipWrapperSpan);

    return wrapper;
  }
}

export class Tooltips extends Module {
  public readonly autoPA: AutoPitchAccent;
  private readonly sentParser: SentenceParser;

  constructor() {
    super('sm:tooltips');

    const paArgs: AutoPitchAccentArgs = {
      attemptGlobalColor: false,
      showTitle: false,
      removeNasal: true, // TODO should this be a runtime option?
      debugLevel: 2,
    };
    this.autoPA = new AutoPitchAccent('tb:autoPitchAccent', paArgs);
    this.autoPA.overrideOptions(
      this.getOption('tooltips.overrideOptions.autoPitchAccent')
    );

    this.sentParser = new SentenceParser('tb:sentenceParser', { debugLevel: 2 });
    this.sentParser.overrideOptions(
      this.getOption('tooltips.overrideOptions.sentenceParser')
    );
  }

  newCardBuilder(): TooltipCardDivBuilder {
    return new TooltipCardDivBuilder(this);
  }
  newBuilder(): TooltipBuilder {
    return new TooltipBuilder(this);
  }

  buildWordDiv(
    noteInfo: NoteInfoTooltipBuilder,
    character: string | null,
    cardId: number | null = null
  ): [HTMLDivElement, PAGroup | null] {
    const wordDiv = document.createElement('div');
    wordDiv.classList.add('hover-tooltip__word-div');

    let wordReadingRuby = plainToRuby(noteInfo.WordReading);
    if (character !== null) {
      wordReadingRuby = wordReadingRuby.replace(
        new RegExp(character, 'g'),
        `<b>${character}</b>`
      );
    }

    const wordEle = document.createElement('span');
    wordEle.innerHTML = wordReadingRuby;
    wordEle.classList.add('hover-tooltip__word-span');
    if (cardId !== null) {
      wordEle.setAttribute('data-cid', cardId.toString());
    }

    wordDiv.appendChild(wordEle);

    let mainPAGroup = null;
    if (this.getOption('tooltips.displayPitchAccent')) {
      const displayEle = document.createElement('span');
      displayEle.classList.add('hover-tooltip__pitch-accent');

      const dispPosData = this.autoPA.addPosition(displayEle, noteInfo);
      mainPAGroup = dispPosData?.mainPAGroup ?? null;

      wordDiv.appendChild(displayEle);
    }

    return [wordDiv, mainPAGroup];
  }

  buildSentDiv(noteInfo: NoteInfoTooltipBuilder) {
    // sentEle is the base, containing open/contents/close
    const sentEle = document.createElement('div');
    sentEle.classList.add('hover-tooltip__sent-div');
    sentEle.classList.add('left-align-quote');

    const sentenceOpen = document.createElement('span');
    sentenceOpen.innerHTML = compileOpts.autoQuoteOpen;
    const sentenceContents = document.createElement('span');
    sentenceContents.innerHTML = noteInfo.Sentence;
    const sentenceClose = document.createElement('span');
    sentenceClose.innerHTML = compileOpts.autoQuoteClose;
    sentEle.appendChild(sentenceOpen);
    sentEle.appendChild(sentenceContents);
    sentEle.appendChild(sentenceClose);

    const sent: Sentence = {
      open: sentEle.children[0],
      contents: sentEle.children[1],
      close: sentEle.children[2],
      base: sentEle,
    };

    this.sentParser.processSentence(sent, 'fullSent', noteInfo);

    return sentEle;
  }

  /* queries any card that isn't this current card */
  getCardBaseQuery(Key: string): string {
    // TODO generalize / don't hardcode?
    const noteName = 'JP Mining Note';
    const cardTypeName = 'Mining Card';
    const key = escapeQueryStr(Key);

    return `-"Key:${key}" "note:${noteName}" "card:${cardTypeName}"`;
  }

  getQueryPair(type: 'new' | 'nonNew') {
    const base = this.getOption(`tooltips.query.${type}.base`);
    const hidden = this.getOption(`tooltips.query.${type}.hidden`);
    const removed = this.getOption(`tooltips.query.${type}.removed`);

    // function exists because a query of () or -() is not valid!
    const qb = new QueryBuilder().addSegment(base).addSegment(removed, true);

    const qbHidden = qb.clone();

    qbHidden.addSegment(hidden, false);
    qb.addSegment(hidden, true);

    return {
      default: qb,
      hidden: qbHidden,
    };
  }

  getQueryBuilderGroup(): QueryBuilderGroup {
    const qpNew = this.getQueryPair('new');
    const qpNonNew = this.getQueryPair('nonNew');

    return {
      'nonNew.default': qpNonNew.default,
      'nonNew.hidden': qpNonNew.hidden,
      'new.default': qpNew.default,
      'new.hidden': qpNew.hidden,
    };
  }

  /* goes through the HTML to search for data-cid, and then adds a guiBrowse
     call to view that cid (if it exists) */
  addBrowseOnClick(parentEle: HTMLElement) {
    // ASSUMPTION: ankiconnect is active here since the tooltip can only be built
    // when ankiconnect exists (to search for other cards)
    for (const ele of parentEle.querySelectorAll('[data-cid]')) {
      let cid = ele.getAttribute('data-cid');
      if (cid !== null) {
        (ele as HTMLElement).onclick = () => {
          invoke('guiBrowse', { query: `cid:${cid}` });
        };
        ele.classList.add('hover-tooltip__word-div--clickable');
      }
    }
  }

  // transforms CardInfo into something useful for the tooltip builder
  // boldSentKanji: null => do not replace, string => remove existing bold and only bold that specified kanji
  cardInfoToNoteInfoTooltipBuilder(
    cardInfo: CardInfo,
    boldSentKanji: string | null = null,
    cardId: number | null = null
  ): NoteInfoTooltipBuilder {
    let resultSent = cardInfo.fields.Sentence.value;
    if (boldSentKanji !== null) {
      if (!resultSent.includes(boldSentKanji)) {
        throw Error(
          `Cannot use boldSentKanji ${boldSentKanji} when kanji does not exist in sentence: ${resultSent}`
        );
      }
      resultSent = resultSent.replace(/<b>|<\/b>/g, '');
      const rx = new RegExp(boldSentKanji, 'g');
      if (cardId === null) {
        resultSent = resultSent.replace(rx, `<b>${boldSentKanji}</b>`);
      } else {
        // the extra span is so auto-highlight detection properly works (it currently is a regex search on <b>)
        resultSent = resultSent.replace(
          rx,
          `<b><span data-cid="${cardId}">${boldSentKanji}</span></b>`
        );
      }
    }

    return {
      AJTWordPitch: cardInfo.fields.AJTWordPitch.value,
      PAOverride: cardInfo.fields.PAOverride.value,
      PAOverrideText: cardInfo.fields.PAOverrideText.value,
      PAPositions: cardInfo.fields.PAPositions.value,
      Sentence: resultSent,
      Word: cardInfo.fields.Word.value,
      WordReading: cardInfo.fields.WordReading.value,
      WordReadingHiragana: cardInfo.fields.WordReading.value,
      YomichanWordTags: cardInfo.fields.YomichanWordTags.value,
      tags: [],
    };
  }
}
