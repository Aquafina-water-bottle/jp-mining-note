import { compileOpts } from '../consts';
import { Module } from '../module';
import { AutoPitchAccent, AutoPitchAccentArgs, NoteInfoPA } from './autoPitchAccent';
import { NoteInfoSentence, SentenceParser } from './sentenceParser';
import { Sentence } from './sentenceParser';
import { invoke, escapeQueryStr, QueryBuilder } from '../ankiConnectUtils';

//export type TooltipBuilderArgs = {
//  displayPA?: boolean;
//  displayPAOnHover?: boolean;
//};

export type NoteInfoTooltipBuilder = NoteInfoPA &
  NoteInfoSentence & {
    cardId: string;
  };

//export type QueryPair = {
//  default: QueryBuilder;
//  hidden: QueryBuilder;
//};

//export type QueryPairResult = {
//  "default": number[];
//  "hidden": number[];
//}



//export type BuiltQueries = {
//  'nonNew.hidden': string;
//  'nonNew.default': string;
//  'new.hidden': string;
//  'new.default': string;
//};

//export type BuiltQueriesResults = {
//  "nonNew.hidden": number[],
//  "nonNew.default": number[],
//  "new.hidden": number[],
//  "new.default": number[],
//}


export type QueryBuilderGroup = {
  'nonNew.hidden': QueryBuilder;
  'nonNew.default': QueryBuilder;
  'new.hidden': QueryBuilder;
  'new.default': QueryBuilder;
};
//
//
//export type QueryGroup = {
//  'nonNew.hidden': string;
//  'nonNew.default': string;
//  'new.hidden': string;
//  'new.default': string;
//};



export class TooltipBuilder extends Module {
  private readonly autoPA: AutoPitchAccent;
  private readonly sentParser: SentenceParser;

  //private readonly displayPA: boolean;
  //private readonly displayPAOnHover: boolean;

  //constructor(args?: TooltipBuilderArgs) {
  constructor() {
    super('sm:tooltipBuilder');

    const paArgs: AutoPitchAccentArgs = {
      attemptGlobalColor: false,
      showTitle: false,
      removeNasal: true,
    };
    this.autoPA = new AutoPitchAccent('tb:autoPitchAccent', paArgs);
    this.autoPA.overrideOptions(
      this.getOption('tooltipBuilder.overrideOptions.autoPitchAccent')
    );

    this.sentParser = new SentenceParser('tb:sentenceParser');
    this.sentParser.overrideOptions(
      this.getOption('tooltipBuilder.overrideOptions.sentenceParser')
    );

    //this.displayPA = args?.displayPA ?? true;
    //this.displayPAOnHover = args?.displayPAOnHover ?? true;
  }

  _buildWordDiv(wordReading: string, character: string, cardId = null) {
    const wordDivWrapper = document.createElement('div');

    const wordEle = document.createElement('span');
    const re = / ?([^ >]+?)\[(.+?)\]/g;

    let wordReadingRuby = wordReading.replace(/&nbsp;/g, ' ');
    wordReadingRuby = wordReadingRuby.replace(re, '<ruby><rb>$1</rb><rt>$2</rt></ruby>');

    if (character !== null) {
      wordReadingRuby = wordReadingRuby.replace(
        new RegExp(character, 'g'),
        `<b>${character}</b>`
      );
    }

    wordEle.innerHTML = wordReadingRuby;
    wordEle.classList.add('hover-tooltip__word-div');
    wordDivWrapper.appendChild(wordEle);

    if (cardId !== null) {
      wordEle.setAttribute('data-cid', cardId);
    }

    return wordDivWrapper;
  }

  /* cardId may be null due to the first entry in word indicators */
  buildWordDiv(noteInfo: NoteInfoTooltipBuilder, character: string, cardId = null) {
    const wordDiv = this._buildWordDiv(noteInfo.WordReading, character, cardId);

    if (this.getOption('tooltipBuilder.displayPitchAccent')) {
      const displayEle = document.createElement('span');
      displayEle.classList.add('hover-tooltip__pitch-accent');
      this.autoPA.addPosition(displayEle, noteInfo);

      wordDiv.appendChild(displayEle);
    }

    return wordDiv;
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

    const sent: Sentence = {
      open: sentEle.children[0] as Element,
      contents: sentEle.children[1] as Element,
      close: sentEle.children[2] as Element,
      base: sentEle,
    };

    this.sentParser.processSentence(sent, 'fullSent', noteInfo);

    return sentEle;
  }

  buildCardDiv(noteInfo: NoteInfoTooltipBuilder, character: string, isNew = false) {
    const cardDiv = document.createElement('div');

    const wordDiv = this.buildWordDiv(noteInfo, character);

    const sentenceDiv = this.buildSentDiv(noteInfo);

    cardDiv.appendChild(wordDiv);
    cardDiv.appendChild(sentenceDiv);

    cardDiv.classList.add('hover-tooltip__card');
    if (isNew) {
      cardDiv.classList.add('hover-tooltip__card--new');
    }
    if (this.getOption('tooltipBuilder.displayPitchAccentOnHoverOnly')) {
      cardDiv.classList.add('hover-tooltip__card-div--hover');
    }

    return cardDiv;
  }

  /* returns:
    {
      default: (default query)
      hidden: (query to get hidden cards, or "" if hidden query has nothing specified)
    }
  */
  //_buildQueryPair(baseQuery: string, type: 'new' | 'nonNew'): QueryPair {
  //  const base = this.getOption(`tooltipBuilder.query.${type}.base`);
  //  const hidden = this.getOption(`tooltipBuilder.query.${type}.hidden`);
  //  const removed = this.getOption(`tooltipBuilder.query.${type}.removed`);

  //  // function exists because a query of () or -() is not valid!
  //  let querySegmentsDefault: string[] = [];
  //  function pushIfNotEmpty(querySegments: string[], segment: string, negate = false) {
  //    if (segment.length > 0) {
  //      const resultSegment = `${negate ? '-' : ''}(${segment})`;
  //      querySegments.push(resultSegment);
  //    }
  //  }
  //  pushIfNotEmpty(querySegmentsDefault, baseQuery);
  //  pushIfNotEmpty(querySegmentsDefault, base);
  //  pushIfNotEmpty(querySegmentsDefault, removed);

  //  let querySegmentsHidden = Array.from(querySegmentsDefault);
  //  pushIfNotEmpty(querySegmentsDefault, hidden, true);
  //  pushIfNotEmpty(querySegmentsHidden, hidden, false);

  //  return {
  //    default: querySegmentsDefault.join(' '),
  //    hidden: hidden ? querySegmentsHidden.join(' ') : '',
  //  };
  //}



  /* queries any card that isn't this current card */
  getCardBaseQuery(Key: string): string {
    const noteName = 'JP Mining Note';
    const cardTypeName = 'Mining Card';
    const key = escapeQueryStr(Key);

    return `-"Key:${key}" "note:${noteName}" "card:${cardTypeName}"`;
  }

  getQueryPair(type: 'new' | 'nonNew') {
    const base = this.getOption(`tooltipBuilder.query.${type}.base`);
    const hidden = this.getOption(`tooltipBuilder.query.${type}.hidden`);
    const removed = this.getOption(`tooltipBuilder.query.${type}.removed`);

    // function exists because a query of () or -() is not valid!
    const qb = new QueryBuilder()
      .addSegment(base)
      .addSegment(removed, true);

    const qbHidden = qb.clone()

    qbHidden.addSegment(hidden, false)
    qb.addSegment(hidden, true)

    return {
      default: qb,
      hidden: qbHidden,
    };
  }

  getQueryBuilderGroup(): QueryBuilderGroup {
    const qpNew = this.getQueryPair("new");
    const qpNonNew = this.getQueryPair("nonNew");

    return {
      'nonNew.default': qpNonNew.default,
      'nonNew.hidden': qpNonNew.hidden,
      'new.default': qpNew.default,
      'new.hidden': qpNew.hidden,
    };
  }

  //cloneQueryBuilderGroup(group: QueryBuilderGroup): QueryBuilderGroup {
  //  return {
  //    'nonNew.default': group['nonNew.default'].clone(),
  //    'nonNew.hidden': group['nonNew.hidden'].clone(),
  //    'new.default': group['new.default'].clone(),
  //    'new.hidden': group['new.hidden'].clone(),
  //  };
  //}

  //createQueryGroup(base: string): QueryGroup {
  //  const qpNew = this.getQueryPair("new");
  //  const qpNonNew = this.getQueryPair("nonNew");

  //  qpNonNew.default.addSegment(base)
  //  qpNonNew.hidden.addSegment(base)
  //  qpNew.default.addSegment(base)
  //  qpNew.hidden.addSegment(base)

  //  return {
  //    'nonNew.default': qpNonNew.default.build(),
  //    'nonNew.hidden': qpNonNew.hidden.build(),
  //    'new.default': qpNew.default.build(),
  //    'new.hidden': qpNew.hidden.build(),
  //  };
  //}

  //cloneQueryBuilderGroup(group: QueryBuilderGroup): QueryBuilderGroup {
  //  return {
  //    'nonNew.default': group['nonNew.default'].clone(),
  //    'nonNew.hidden': group['nonNew.hidden'].clone(),
  //    'new.default': group['new.default'].clone(),
  //    'new.hidden': group['new.hidden'].clone(),
  //  };
  //}





  //buildQueries(baseQuery: string): BuiltQueries {
  //  const nonNewQueryPair = this._buildQueryPair(baseQuery, 'nonNew');
  //  const newQueryPair = this._buildQueryPair(baseQuery, 'new');

  //  return {
  //    'nonNew.hidden': nonNewQueryPair.hidden,
  //    'nonNew.default': nonNewQueryPair.default,
  //    'new.hidden': newQueryPair.hidden,
  //    'new.default': newQueryPair.default,
  //  };
  //}

  /* goes through the HTML to search for data-cid, and then adds a guiBrowse
     call to view that cid (if it exists) */
  addBrowseOnClick(query: string) {
    for (const ele of document.querySelectorAll(query)) {
      let cid = ele.getAttribute('data-cid');
      if (cid !== null) {
        (ele as HTMLElement).onclick = () => {
          invoke('guiBrowse', { query: `cid:${cid}` });
        };
        ele.classList.add('hover-tooltip__word-div--clickable');
      }
    }
  }

  filterCards(
    nonNewCardIds: number[],
    newCardIds: number[],
    maxNonNewOldest: number,
    maxNonNewLatest: number,
    maxNewLatest: number
  ): [number[], number[]] {
    const max = maxNonNewOldest + maxNonNewLatest + maxNewLatest;
    if (nonNewCardIds.length + newCardIds.length <= max) {
      return [nonNewCardIds, newCardIds];
    }

    // adjusts for when there can be other cards that can fit the space
    // for example, 6 old & 0 new, or 0 old & 6 new
    if (newCardIds.length < maxNewLatest) {
      let diff = maxNewLatest - newCardIds.length;
      maxNonNewOldest += Math.floor(diff / 2);
      maxNonNewLatest += Math.floor(diff / 2) + (diff % 2);
    }
    if (nonNewCardIds.length < maxNonNewOldest + maxNonNewLatest) {
      maxNewLatest += maxNonNewOldest + maxNonNewLatest - nonNewCardIds.length;
    }

    // non new: gets the earliest and latest
    let nonNewResultIds = [];
    if (nonNewCardIds.length > maxNonNewOldest + maxNonNewLatest) {
      nonNewResultIds = [
        ...nonNewCardIds.slice(0, maxNonNewOldest), // earliest
        ...nonNewCardIds.slice(-maxNonNewLatest, nonNewCardIds.length), // latest
      ];
    } else {
      nonNewResultIds = [...nonNewCardIds];
    }

    let newResultIds = newCardIds.slice(0, maxNewLatest);
    this.logger.debug(
      `(${maxNonNewOldest}, ${maxNonNewLatest}, ${maxNewLatest}) -> (${nonNewResultIds.length}, ${newResultIds.length})`,
      2
    );

    return [nonNewResultIds, newResultIds];
  }
}
