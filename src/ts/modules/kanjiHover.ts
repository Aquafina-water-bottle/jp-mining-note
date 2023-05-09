import { RunnableAsyncModule } from '../module';
import { getOption } from '../options';
import { SPersistInterface, selectPersist } from '../spersist';
import { plainToRuby, getCardKey, filterCards } from '../utils';
import { getFieldValue, getFieldValueEle, Field, cacheFieldValue } from '../fields';
import { type CardCache } from './cardCache';

import {
  Tooltips,
  QueryBuilderGroup,
  TooltipBuilder,
} from './tooltips';
import {
  AnkiConnectAction,
  constructFindCardsAction,
  escapeQueryStr,
  getQueryCache,
  setQueryCache,
  invoke,
  CardInfo,
  cardsInfo,
  cardIDsToCardsInfo,
} from '../ankiConnectUtils';
import { translatorStrs } from '../consts';
import { MobilePopup } from '../mobilePopup';

type KanjiHoverCategoryID =
  | 'word.nonNew.hidden'
  | 'word.nonNew.default'
  | 'word.new.hidden'
  | 'word.new.default'
  | 'sent.nonNew.hidden'
  | 'sent.nonNew.default'
  | 'sent.new.hidden'
  | 'sent.new.default';

type QueryCategories = Record<KanjiHoverCategoryID, string>;
type QueryResults = Record<KanjiHoverCategoryID, number[]>;
type KanjiQueryResults = Record<string, QueryResults>;

// TODO may have to separate preview and non-preview
type FilteredCardCategories = 'word.nonNew' | 'sent.nonNew' | 'word.new' | 'sent.new';
type FilteredCardIDs = Record<FilteredCardCategories, number[]>;
type KanjiToFilteredCardIDs = Record<string, FilteredCardIDs>;
type FilteredCardsInfo = Record<FilteredCardCategories, CardInfo[]>;
type KanjiToFilteredCardsInfo = Record<string, FilteredCardsInfo>;

type KanjiToHoverHTML = Record<string, string>;

export type NoteInfoKanjiHover = {
  WordReadingRubyHTML: string;
  WordReading: string;
  Key: string;
};


// maps a kanji to the full hover HTML (the html containing the kanji + the full popup)
type KanjiToHover = Record<string, string>;

export class KanjiHover extends RunnableAsyncModule {
  private readonly persist = selectPersist();
  private readonly persistObj = selectPersist('window');
  private readonly tooltips: Tooltips;
  private readonly cardWordReadingResultKey: string;
  private readonly cardHoverHTMLCacheKey: string;
  private readonly mobilePopup: MobilePopup | null;
  private readonly wordReadingEle: HTMLElement | null;
  private readonly cardCache: CardCache | null;

  private readonly noteInfo: NoteInfoKanjiHover = {
    WordReading: getFieldValue('WordReading'),
    WordReadingRubyHTML: plainToRuby(getFieldValue('WordReading')),
    Key: getFieldValue('Key'),
  } as const;

  constructor(cardCache: CardCache | null, mobilePopup: MobilePopup | null) {
    super('kanjiHover');

    this.tooltips = new Tooltips();
    this.tooltips.overrideOptions(getOption('kanjiHover.overrideOptions.tooltips'));

    this.cardWordReadingResultKey = `KanjiHover.cardWordReadingResultKey.${getCardKey()}`
    this.cardHoverHTMLCacheKey = `KanjiHover.cardHoverHTMLCacheKey.${getCardKey()}`;

    this.mobilePopup = mobilePopup;

    this.wordReadingEle = document.getElementById('dh_reading');
    this.cardCache = cardCache;

    // ran synchronously, so fields will 100% be cached
    const cacheFields: readonly Field[] = [
      'Key',
      'Word',
      'WordReading',
    ] as const;
    for (const f of cacheFields) {
      cacheFieldValue(f);
    }

  }

  private wordReadingKanjis(noteInfo: NoteInfoKanjiHover): Set<string> {
    let kanjiSet = new Set<string>(); // set of kanjis that requires api calls

    // regex shamelessly stolen from cade's kanji hover:
    // https://github.com/cademcniven/Kanji-Hover/blob/main/_kanjiHover.js
    const regex = /([\u4E00-\u9FAF])(?![^<]*>|[^<>]*<\/g)/g;
    const matches = noteInfo.WordReading.matchAll(regex);
    for (const match of matches) {
      for (const kanji of match) {
        kanjiSet.add(kanji);
      }
    }

    return kanjiSet;
  }

  // TODO combine this with word indicators via tooltip builder at some point?
  private async cardQueries(
    noteInfo: NoteInfoKanjiHover,
    kanjis: string[]
  ): Promise<KanjiQueryResults> {
    // TODO how to run this across other notes / cards?

    const baseQuery = this.tooltips.getCardBaseQuery(getFieldValue('Key'));

    let kanjiToQueryCategory: Record<string, QueryCategories> = {};
    let queryResults: KanjiQueryResults = {};

    // TODO when combining, this can be a lambda
    for (const kanji of kanjis) {
      const wordReading = escapeQueryStr(noteInfo.WordReading);

      const wordQuery = `-"WordReading:${wordReading}" Word:*${kanji}*`;
      // should be mutually exclusive from the above
      const sentQuery = `-"WordReading:${wordReading}" -Word:*${kanji}* Sentence:*${kanji}*`;

      const queryGroup: QueryBuilderGroup = this.tooltips.getQueryBuilderGroup();

      const queries: QueryCategories = {
        'word.nonNew.hidden': '',
        'word.nonNew.default': '',
        'word.new.hidden': '',
        'word.new.default': '',
        'sent.nonNew.hidden': '',
        'sent.nonNew.default': '',
        'sent.new.hidden': '',
        'sent.new.default': '',
      };

      for (const [key, qb] of Object.entries(queryGroup)) {
        qb.addSegment(baseQuery);

        const qbSent = qb.clone();
        qb.addSegment(wordQuery);
        queries[`word.${key as keyof QueryBuilderGroup}`] = qb.build();

        qbSent.addSegment(sentQuery);
        queries[`sent.${key as keyof QueryBuilderGroup}`] = qbSent.build();
      }

      kanjiToQueryCategory[kanji] = queries;
    }

    for (const [kanji, queryCategory] of Object.entries(kanjiToQueryCategory)) {
      queryResults[kanji] = {
        'word.nonNew.hidden': [-1],
        'word.nonNew.default': [-1],
        'word.new.hidden': [-1],
        'word.new.default': [-1],
        'sent.nonNew.hidden': [-1],
        'sent.nonNew.default': [-1],
        'sent.new.hidden': [-1],
        'sent.new.default': [-1],
      };

      // checks cache
      if (this.useCache) {
        for (const [queryKey, query] of Object.entries(queryCategory)) {
          if (this.persistObj !== null) {
            const cache = getQueryCache(this.persistObj, query);
            if (cache !== null) {
              queryResults[kanji][queryKey as KanjiHoverCategoryID] = cache;
            }
          }
        }
      }

      // checks unnecessary query (hidden has nothing)
      function checkUnnecessaryQuery(
        queryKey:
          | 'sent.new.hidden'
          | 'sent.nonNew.hidden'
          | 'word.new.hidden'
          | 'word.nonNew.hidden'
      ) {
        if (queryCategory[queryKey] === '') {
          queryResults[kanji][queryKey] = [];
        }
      }
      // for some reason, this for loop doesn't seem to work with typescript?
      //for (const queryKey of ['new.hidden', 'nonNew.hidden']) {
      //  checkUnnecessaryQuery(queryKey);
      //}
      checkUnnecessaryQuery('sent.new.hidden');
      checkUnnecessaryQuery('sent.nonNew.hidden');
      checkUnnecessaryQuery('word.new.hidden');
      checkUnnecessaryQuery('word.nonNew.hidden');
    }

    // gets actions for queries
    // these two arrays should be the same length, as they map query key <-> query
    let queriesFlattened: string[] = [];
    let kanjisFlattened: string[] = [];
    let categoriesFlattened: KanjiHoverCategoryID[] = [];
    let actions: AnkiConnectAction[] = [];

    // any remaining results == [-1] will actually be queried
    for (const [kanji, queryCategory] of Object.entries(queryResults)) {
      for (const [categoryID, queryResult] of Object.entries(queryCategory)) {
        if (queryResult.length === 1 && queryResult[0] === -1) {
          const query = kanjiToQueryCategory[kanji][categoryID as KanjiHoverCategoryID];
          queriesFlattened.push(query);

          kanjisFlattened.push(kanji);
          categoriesFlattened.push(categoryID as KanjiHoverCategoryID);

          const action = constructFindCardsAction(query);
          actions.push(action);
        }
      }
    }

    // parses multi result back into queryResults
    type MultiResult = { result: number[]; error: string | null };
    const multiResults = (await invoke('multi', { actions: actions })) as MultiResult[];
    for (let i = 0; i < multiResults.length; i++) {
      const query = queriesFlattened[i];
      const kanji = kanjisFlattened[i];
      const categoryID = categoriesFlattened[i];
      const queryResult = multiResults[i].result;

      if (this.persistObj !== null) {
        setQueryCache(this.persistObj, query, queryResult);
      }

      queryResults[kanji][categoryID] = queryResult;
    }

    return queryResults;
  }

  // TODO move this into tooltip builder maybe?
  private sortByTimeCreated(
    kanjiQueryResults: KanjiQueryResults
  ): KanjiToFilteredCardIDs {
    const maxNonNewOldest = this.getOption('tooltips.categoryMax.nonNew.oldest');
    const maxNonNewNewest = this.getOption('tooltips.categoryMax.nonNew.newest');
    const maxNewOldest = this.getOption('tooltips.categoryMax.new.oldest');
    const maxNewNewest = this.getOption('tooltips.categoryMax.new.newest');

    const kanjiToFilteredCardIDs: KanjiToFilteredCardIDs = {};

    for (const [kanji, queryResult] of Object.entries(kanjiQueryResults)) {
      const [nonNewResultIds, newResultIds] = filterCards(
        [queryResult['word.nonNew.default'], queryResult['sent.nonNew.default']],
        [queryResult['word.new.default'], queryResult['sent.new.default']],
        maxNonNewOldest,
        maxNonNewNewest,
        maxNewOldest,
        maxNewNewest
      );

      kanjiToFilteredCardIDs[kanji] = {
        'word.nonNew': nonNewResultIds[0],
        'sent.nonNew': nonNewResultIds[1],
        'word.new': newResultIds[0],
        'sent.new': newResultIds[1],
      };
    }

    return kanjiToFilteredCardIDs;
  }

  // TODO move this into tooltip builder
  private async sortByFirstReview(
    kanjiQueryResults: KanjiQueryResults,
    kanjiToHover: KanjiToHover
  ) {
    throw Error('not implemented');
  }

  private async getCardInfo(
    kanjiToFilteredCardIDs: KanjiToFilteredCardIDs
  ): Promise<KanjiToFilteredCardsInfo> {
    const kanjiToFilteredCardsInfo: KanjiToFilteredCardsInfo = {};
    // extracts the card ids and just attempts to get it
    const cardIDs: Set<number> = new Set();

    const result: KanjiToFilteredCardsInfo = {};

    for (const filteredCardIDs of Object.values(kanjiToFilteredCardIDs)) {
      // there's no set union?
      // there's also no easy way to add all elements from an iterable to a set???
      // therefore, you just go to for-loop through all the values???????
      const ids = [
        ...filteredCardIDs['word.nonNew'],
        ...filteredCardIDs['word.new'],
        ...filteredCardIDs['sent.nonNew'],
        ...filteredCardIDs['sent.new'],
      ];
      for (const id of ids) {
        cardIDs.add(id);
      }
    }

    // convert set to array
    const cardIDsArray = [...cardIDs];
    const cardsInfoResult = await cardsInfo(cardIDsArray, this.useCache);

    for (const [kanji, filteredCardIDs] of Object.entries(kanjiToFilteredCardIDs)) {
      result[kanji] = {
        'word.nonNew': cardIDsToCardsInfo(
          filteredCardIDs['word.nonNew'],
          cardsInfoResult
        ),
        'word.new': cardIDsToCardsInfo(filteredCardIDs['word.new'], cardsInfoResult),
        'sent.nonNew': cardIDsToCardsInfo(
          filteredCardIDs['sent.nonNew'],
          cardsInfoResult
        ),
        'sent.new': cardIDsToCardsInfo(filteredCardIDs['sent.new'], cardsInfoResult),
      };
    }

    return result;
  }

  private buildTooltips(
    kanjiToFilteredCardIDs: KanjiToFilteredCardsInfo,
    kanjiToHover: KanjiToHover
  ) {
    for (const [kanji, filteredCardsInfo] of Object.entries(kanjiToFilteredCardIDs)) {
      kanjiToHover[kanji] = this.buildTooltip(filteredCardsInfo, kanji);
    }
  }

  // helper function for buildTooltip
  // not in tooltips.ts because kanji and isSentCard arguments
  private addCardsInfoToTooltip(
    cardsInfo: CardInfo[],
    kanji: string,
    tooltipBuilder: TooltipBuilder,
    isSentCard: boolean,
    isNew: boolean
  ) {
    for (const cardInfo of cardsInfo) {
      const cardBuilder = this.tooltips.newCardBuilder();

      if (isSentCard) {
        // removes existing bold & adds bold to kanji in sentence
        const noteInfoTTB = this.tooltips.cardInfoToNoteInfoTooltipBuilder(cardInfo, kanji, cardInfo.cardId);
        cardBuilder.createSentDiv(noteInfoTTB);
      } else {
        const noteInfoTTB = this.tooltips.cardInfoToNoteInfoTooltipBuilder(cardInfo);
        cardBuilder.createWordDiv(noteInfoTTB, kanji, cardInfo.cardId);
        cardBuilder.createSentDiv(noteInfoTTB);
      }
      if (isNew) {
        cardBuilder.setNew();
      }

      tooltipBuilder.addCardDiv(cardBuilder.build());
    }
  }

  private buildTooltip(filteredCardsInfo: FilteredCardsInfo, kanji: string): string {
    const tooltipBuilder = this.tooltips.newBuilder();

    const wordLen =
      filteredCardsInfo['word.nonNew'].length + filteredCardsInfo['word.new'].length;
    const sentLen =
      filteredCardsInfo['sent.nonNew'].length + filteredCardsInfo['sent.new'].length;

    this.addCardsInfoToTooltip(
      filteredCardsInfo['word.nonNew'],
      kanji,
      tooltipBuilder,
      false,
      false
    );
    this.addCardsInfoToTooltip(
      filteredCardsInfo['word.new'],
      kanji,
      tooltipBuilder,
      false,
      true
    );

    if (wordLen > 0 && sentLen > 0) {
      tooltipBuilder.addSeparator();
    }

    this.addCardsInfoToTooltip(
      filteredCardsInfo['sent.nonNew'],
      kanji,
      tooltipBuilder,
      true,
      false
    );
    this.addCardsInfoToTooltip(
      filteredCardsInfo['sent.new'],
      kanji,
      tooltipBuilder,
      true,
      true
    );

    tooltipBuilder.addHoverText(kanji);
    tooltipBuilder.addOnEmptyText(translatorStrs['kanji-not-found']);

    return tooltipBuilder.build().outerHTML;
  }

  async getKanjisToHover(
    noteInfo: NoteInfoKanjiHover
  ): Promise<Record<string, string>> {
    // Nothing is cached in this function directly, caching happens in
    // the ankiConnectUtils queries / cardsInfo
    let kanjiSet = this.wordReadingKanjis(noteInfo);

    // maps a kanji to the full hover HTML (the html containing the kanji + the full popup)
    let kanjiToHover: Record<string, string> = {};

    // searches the remaining kanjis in kanjiSet
    const queryResults = await this.cardQueries(noteInfo, Array.from(kanjiSet));
    //console.log("queryResults", queryResults);

    // two possible handlers:
    // a) find all note infos for sorting purposes
    // b) sort by card id
    const sortMethod = this.getOption('tooltips.sortMethod');
    let kanjiToFilteredCardIDs: KanjiToFilteredCardIDs;
    if (sortMethod === 'time-created') {
      kanjiToFilteredCardIDs = this.sortByTimeCreated(queryResults);
    } else {
      throw Error('not implemented');
      //await this.sortByFirstReview(queryResults, kanjiToHover);
    }
    //console.log("kanjiToFilteredCardIDs", kanjiToFilteredCardIDs);

    const kanjiToFilteredCardInfo = await this.getCardInfo(kanjiToFilteredCardIDs);
    //console.log("kanjiToFilteredCardInfo", kanjiToFilteredCardInfo)
    this.buildTooltips(kanjiToFilteredCardInfo, kanjiToHover);

    return kanjiToHover;
  }

  private getWordReadingResult(kanjiToHoverHTML: KanjiToHoverHTML, wordReadingRubyHTML: string): string {

    let resultHTML = wordReadingRubyHTML;
    if (Object.keys(kanjiToHoverHTML).length > 0) {
      // an empty object seems to replace every empty space
      const re = new RegExp(Object.keys(kanjiToHoverHTML).join('|'), 'gi');
      resultHTML = wordReadingRubyHTML.replace(re, function (matched) {
        return `<span data-kanji-hover="${matched}">${kanjiToHoverHTML[matched]}</span>`;
      });
    }
    return resultHTML;
  }

  // attempts to get things without cache
  async populateTooltips() {
    //if (this.persist?.has(this.mutexKey)) {
    //  this.logger.debug("Cannot run due to mutex");
    //  return;
    //}
    if (this.wordReadingEle === null) {
      this.logger.debug("Cannot run kanji hover due to null wordReadingEle");
      return;
    }
    this.logger.debug(`Running on ${getCardKey()}...`);
    //this.persist?.set(this.mutexKey, "true")

    // gets popup for each kanji character and cache
    let kanjiToHoverHTML = await this.getKanjisToHover(this.noteInfo);
    this.displayResultFromKanjiToHoverHTML(kanjiToHoverHTML, this.wordReadingEle)

    //this.persist?.pop(this.mutexKey)
    this.logger.debug(`Finished running on ${getCardKey()}...`);
  }

  /**
   * - Caches all results
   * - Displays results, whether it's via cache or not
   */
  private displayResultFromKanjiToHoverHTML(kanjiToHoverHTML: KanjiToHoverHTML, wordReadingEle: HTMLElement) {

    this.persist?.set(this.cardHoverHTMLCacheKey, JSON.stringify(kanjiToHoverHTML));

    // this technically can be optimized depending on mobile or not, but imo
    // it's safer to save this on both pc/mobile display
    let resultHTML = this.getWordReadingResult(kanjiToHoverHTML, this.noteInfo.WordReadingRubyHTML)
    this.persist?.set(this.cardWordReadingResultKey, resultHTML); // caches final result per card

    // mobilePopup is not null <=> bp < combinePicture <=> should display mobile
    if (this.mobilePopup !== null) {
      this.mobilePopup.setupKanjiHover(kanjiToHoverHTML, wordReadingEle, this.noteInfo.WordReadingRubyHTML);
    } else { // display normally
      wordReadingEle.innerHTML = resultHTML;
      this.tooltips.addBrowseOnClick(wordReadingEle);
    }
  }

  private displayCachedResult(persist: SPersistInterface, wordReadingEle: HTMLElement) {
    this.logger.debug("Using cached card");

    // mobilePopup is not null <=> bp < combinePicture <=> should display mobile
    if (this.mobilePopup !== null) {
      const kanjiToHoverHTML: KanjiToHoverHTML = JSON.parse(persist.get(this.cardHoverHTMLCacheKey));

      this.mobilePopup.setupKanjiHover(kanjiToHoverHTML, wordReadingEle, this.noteInfo.WordReadingRubyHTML);
      // TODO addBrowseOnClick on mobile?

    } else { // display normally
      const resultHTML = persist.get(this.cardWordReadingResultKey);
      wordReadingEle.innerHTML = resultHTML;
      this.tooltips.addBrowseOnClick(wordReadingEle);
    }

  }

  async main() {

    // checks for all caches first
    if (this.useCache && this.wordReadingEle !== null) {

      // checks for standard persist first, to allow refreshing to stick for the session
      if (this.persist !== null && this.persist.has(this.cardWordReadingResultKey)) {
        this.displayCachedResult(this.persist, this.wordReadingEle);
        return;
      }

      // then checks card cache
      if (this.cardCache?.shouldUse()) {
        // checks for CardCache field first
        const kanjiHoverData = this.cardCache.getKanjiHoverData();
        if (kanjiHoverData) {
          // format said data into kanjiToHoverHTML
          const kanjiToHoverHTML: KanjiToHoverHTML = {};
          for (const child of kanjiHoverData.children) {
            const kanji = child.getAttribute("data-cache-kanji");
            const hoverHTML = child.innerHTML;
            if (kanji !== null) {
              kanjiToHoverHTML[kanji] = hoverHTML;
            }
          }

          this.logger.debug("Using CardCache");
          console.log(kanjiToHoverHTML);
          this.displayResultFromKanjiToHoverHTML(kanjiToHoverHTML, this.wordReadingEle);
          return;
        }
      }
    }

    // only now do we need anki-connect, if no cache was found
    if (!this.getOption("enableAnkiconnectFeatures")) {
      return;
    }

    if (this.getOption("kanjiHover.activateOn") === "hover") {
      if (this.wordReadingEle !== null) {

        this.wordReadingEle.onmouseover = (() => {
          // replaces the function with a null function to avoid calling this function
          if (this.wordReadingEle !== null) {
            this.wordReadingEle.onmouseover = function() {}
          }
          this.populateTooltips();
        });
      } // otherwise front side. we do nothing! (pre-loading will lag the card)
    } else {
      // TODO: remove the above option! It should't be an option in the first place!
      //await this.populateTooltips();
    }
  }
}
