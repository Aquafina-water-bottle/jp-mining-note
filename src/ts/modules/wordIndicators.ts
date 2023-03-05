import { RunnableAsyncModule } from '../module';
import { getOption } from '../options';
import { getFieldValue, filterCards, getTags, CARD_KEY } from '../utils';
import {
  Tooltips,
  QueryBuilderGroup,
  NoteInfoTooltipBuilder,
  TooltipBuilder,
} from './tooltips';
import { selectPersist } from '../spersist';
import {
  getQueryCache,
  AnkiConnectAction,
  constructFindCardsAction,
  invoke,
  setQueryCache,
  CardInfo,
  cardsInfo,
  cardIDsToCardsInfo,
  escapeQueryStr,
} from '../ankiConnectUtils';

type WordIndicatorsCategoryID =
  | 'nonNew.hidden'
  | 'nonNew.default'
  | 'new.hidden'
  | 'new.default';

const wordIndicatorCardCacheKey = 'WordIndicators.wordIndicatorCardCacheKey';
const wordIndicatorMutexKey = 'WordIndicators.wordIndicatorMutexKey';

const clsMainWord = 'dh-left__similar-words-indicators-main-word';
const clsWithIndicators = 'dh-left--with-similar-word-indicators';

type QueryCategories = Record<WordIndicatorsCategoryID, string>;
type QueryResults = Record<WordIndicatorsCategoryID, number[]>;

type FilteredCardCategories = 'nonNew' | 'new';
type FilteredCardIDs = Record<FilteredCardCategories, number[]>;
type FilteredCardsInfo = Record<FilteredCardCategories, CardInfo[]>;

//type WordIndicatorData = {
//  indicator: HTMLElement | null,
//  tooltip: HTMLElement | null,
//
//  queryCategories: QueryCategories,
//  label: string,
//}

class WordIndicator {
  // is also the html id for the indicator element
  private readonly label: string;

  private readonly baseIndicatorQuery: string;

  private readonly wordInds: WordIndicators;

  private readonly cacheKey: string;
  private readonly mutexKey: string;

  constructor(label: string, baseIndicatorQuery: string, wordInds: WordIndicators) {
    this.label = label;
    //this.queryCategories = queryCategories
    this.baseIndicatorQuery = baseIndicatorQuery;
    this.wordInds = wordInds;
    this.cacheKey = `${wordIndicatorCardCacheKey}.${label}.${CARD_KEY}`;
    this.mutexKey = `${wordIndicatorMutexKey}.${label}.${CARD_KEY}`;

    //this.tooltips = tooltips
    //this.useCache = useCache;
  }

  private async getQueryResults() {
    const baseQuery = this.wordInds.tooltips.getCardBaseQuery(getFieldValue('Key'));

    // TODO!
    const queries: QueryCategories = {
      'nonNew.hidden': '',
      'nonNew.default': '',
      'new.hidden': '',
      'new.default': '',
    };

    const queryGroup: QueryBuilderGroup = this.wordInds.tooltips.getQueryBuilderGroup();

    // qb == query builder
    for (const [key, qb] of Object.entries(queryGroup)) {
      qb.addSegment(baseQuery);
      qb.addSegment('-WordReadingHiragana:');
      qb.addSegment(this.baseIndicatorQuery);
      queries[`${key as keyof QueryBuilderGroup}`] = qb.build();
    }

    const queryResults: QueryResults = {
      'nonNew.hidden': [-1],
      'nonNew.default': [-1],
      'new.hidden': [-1],
      'new.default': [-1],
    };

    // checks cache
    if (this.wordInds.useCache) {
      for (const [queryKey, query] of Object.entries(queries)) {
        if (this.wordInds.persistObj !== null) {
          const cache = getQueryCache(this.wordInds.persistObj, query);
          if (cache !== null) {
            queryResults[queryKey as WordIndicatorsCategoryID] = cache;
          }
        }
      }
    }

    // checks unnecessary query (hidden has nothing)
    function checkUnnecessaryQuery(queryKey: 'new.hidden' | 'nonNew.hidden') {
      if (queries[queryKey] === '') {
        queryResults[queryKey] = [];
      }
    }
    checkUnnecessaryQuery('new.hidden');
    checkUnnecessaryQuery('nonNew.hidden');

    // gets actions for queries
    // these two arrays should be the same length, as they map query key <-> query
    let queriesFlattened: string[] = [];
    let categoriesFlattened: WordIndicatorsCategoryID[] = [];
    let actions: AnkiConnectAction[] = [];

    // any remaining results == [-1] will actually be queried
    for (const [categoryID, queryResult] of Object.entries(queryResults)) {
      if (queryResult.length === 1 && queryResult[0] === -1) {
        const query = queries[categoryID as WordIndicatorsCategoryID];
        queriesFlattened.push(query);
        categoriesFlattened.push(categoryID as WordIndicatorsCategoryID);

        const action = constructFindCardsAction(query);
        actions.push(action);
      }
    }

    // parses multi result back into queryResults
    type MultiResult = { result: number[]; error: string | null };
    const multiResults = (await invoke('multi', { actions: actions })) as MultiResult[];
    for (let i = 0; i < multiResults.length; i++) {
      const query = queriesFlattened[i];
      const categoryID = categoriesFlattened[i];
      const queryResult = multiResults[i].result;

      if (this.wordInds.persistObj !== null) {
        setQueryCache(this.wordInds.persistObj, query, queryResult);
      }

      queryResults[categoryID] = queryResult;
    }

    return queryResults;
  }

  private sortByTimeCreated(queryResults: QueryResults): FilteredCardIDs {
    const maxNonNewOldest = this.wordInds.tooltips.getOption(
      'tooltips.categoryMax.nonNew.oldest'
    );
    const maxNonNewNewest = this.wordInds.tooltips.getOption(
      'tooltips.categoryMax.nonNew.newest'
    );
    const maxNewOldest = this.wordInds.tooltips.getOption(
      'tooltips.categoryMax.new.oldest'
    );
    const maxNewNewest = this.wordInds.tooltips.getOption(
      'tooltips.categoryMax.new.newest'
    );

    const [nonNewResultIds, newResultIds] = filterCards(
      [queryResults['nonNew.default'], []],
      [queryResults['new.default'], []],
      maxNonNewOldest,
      maxNonNewNewest,
      maxNewOldest,
      maxNewNewest
    );

    const filteredCardIDs: FilteredCardIDs = {
      nonNew: nonNewResultIds[0],
      new: newResultIds[0],
    };

    return filteredCardIDs;
  }

  private async getCardInfo(
    filteredCardIDs: FilteredCardIDs
  ): Promise<FilteredCardsInfo> {
    const cardIDs: Set<number> = new Set();

    //const result: FilteredCardsInfo = {};

    // there's no set union?
    // there's also no easy way to add all elements from an iterable to a set???
    // therefore, you just go to for-loop through all the values???????
    const ids = [...filteredCardIDs['nonNew'], ...filteredCardIDs['new']];
    for (const id of ids) {
      cardIDs.add(id);
    }

    // convert set to array
    const cardIDsArray = [...cardIDs];
    const cardsInfoResult = await cardsInfo(cardIDsArray, this.wordInds.useCache);

    const result: FilteredCardsInfo = {
      nonNew: cardIDsToCardsInfo(filteredCardIDs['nonNew'], cardsInfoResult),
      new: cardIDsToCardsInfo(filteredCardIDs['new'], cardsInfoResult),
    };

    return result;
  }

  // adds this to the tooltip because the tooltip covers up the current word
  private addCurrentCardToTooltip(tooltipBuilder: TooltipBuilder) {
    const currentCardInfo: NoteInfoTooltipBuilder = {
      AJTWordPitch: getFieldValue('AJTWordPitch'),
      PAOverride: getFieldValue('PAOverride'),
      PAOverrideText: getFieldValue('PAOverrideText'),
      PAPositions: getFieldValue('PAPositions'),
      Sentence: getFieldValue('Sentence'),
      Word: getFieldValue('Word'),
      WordReading: getFieldValue('WordReading'),
      WordReadingHiragana: getFieldValue('WordReading'),
      YomichanWordTags: getFieldValue('YomichanWordTags'),
      tags: getTags(),
    };
    const currentCardBuilder = this.wordInds.tooltips.newCardBuilder();
    currentCardBuilder.createWordDiv(currentCardInfo);

    const mainCardDiv = currentCardBuilder.build();
    mainCardDiv.classList.add(clsMainWord);
    tooltipBuilder.addCardDiv(mainCardDiv);
  }

  private addCardsInfoToTooltip(
    cardsInfo: CardInfo[],
    tooltipBuilder: TooltipBuilder,
    isNew: boolean
  ) {
    for (const cardInfo of cardsInfo) {
      const cardBuilder = this.wordInds.tooltips.newCardBuilder();

      const noteInfoTTB =
        this.wordInds.tooltips.cardInfoToNoteInfoTooltipBuilder(cardInfo);
      cardBuilder.createWordDiv(noteInfoTTB, null, cardInfo.cardId);
      cardBuilder.createSentDiv(noteInfoTTB);
      if (isNew) {
        cardBuilder.setNew();
      }

      tooltipBuilder.addCardDiv(cardBuilder.build());
    }
  }

  private buildTooltip(filteredCardsInfo: FilteredCardsInfo): string {
    const tooltipBuilder = this.wordInds.tooltips.newBuilder();

    this.addCurrentCardToTooltip(tooltipBuilder);

    this.addCardsInfoToTooltip(filteredCardsInfo['nonNew'], tooltipBuilder, false);
    this.addCardsInfoToTooltip(filteredCardsInfo['new'], tooltipBuilder, true);

    return tooltipBuilder.buildTooltipOnly().innerHTML;
  }

  private displayIfEleExists(tooltipHTML: string) {
    // tooltipHTML can actually be an empty string, to store the fact that nothing has to be shown
    if (tooltipHTML.length === 0) {
      return;
    }

    // gets all elements here to prevent race condition at front of card
    // i.e. if this was ran in the front of the card & the back was blocked by a mutex,
    // then this code is still valid to run
    const indicatorEle = document.getElementById(this.label);
    const dhLeftEle = document.getElementById('dh_left');
    if (indicatorEle === null || dhLeftEle === null) {
      return;
    }
    // TODO document structure of element?
    indicatorEle.children[1].children[0].innerHTML = tooltipHTML;
    indicatorEle.classList.toggle("dh-left__similar-words-indicator--visible", true);

    // TODO rework this! this also affects pitch accents!
    dhLeftEle.classList.toggle(clsWithIndicators, true);

    // we cannot 
    this.wordInds.tooltips.addBrowseOnClick(indicatorEle);
  }

  private releaseMutex() {
    // removes mutex
    this.wordInds.persist?.pop(this.mutexKey);
    this.wordInds.logger.debug(`Finished running ${this.label}`);
  }

  async run() {
    // resets on refresh
    const indicatorEle = document.getElementById(this.label);
    indicatorEle?.classList.toggle("dh-left__similar-words-indicator--visible", false);

    // gets cache if exists
    if (this.wordInds.useCache && this.wordInds.persist?.has(this.cacheKey)) {
      this.wordInds.logger.debug('Using cached card');
      const tooltipHTML = this.wordInds.persist.get(this.cacheKey);
      this.displayIfEleExists(tooltipHTML);
      return;
    }

    // normal mutex
    if (this.wordInds.persist?.has(this.mutexKey)) {
      this.wordInds.logger.debug('Cannot run due to mutex');
      return;
    }
    this.wordInds.logger.debug(`Running ${this.label}`);
    this.wordInds.persist?.set(this.mutexKey, 'true');

    const queryResults = await this.getQueryResults();

    // checks if there are any results in the first place
    // doesn't work properly with hidden entries! can show an empty indicator
    // I find the normal for-loop version easier to read than the reduce() w/ accumulate method
    //let sum = 0;
    //for (const item of Object.values(queryResults)) {
    //  sum += item.length;
    //}

    // only checks non-hidden entries
    // TODO how to deal with hidden entries?
    const sum =
      queryResults['new.default'].length + queryResults['nonNew.default'].length;
    if (sum === 0) {
      // this part is already cached because queries are cached!
      // i.e. there's no need to write to the cache here

      // caches empty html
      if (this.wordInds.persist !== null) {
        this.wordInds.persist.set(this.cacheKey, "");
      }

      this.releaseMutex();
      return;
    }

    const sortMethod = this.wordInds.tooltips.getOption('tooltips.sortMethod');
    let filteredCardIds: FilteredCardIDs;
    if (sortMethod === 'time-created') {
      filteredCardIds = this.sortByTimeCreated(queryResults);
    } else {
      this.releaseMutex();
      throw Error('not implemented');
      //await this.sortByFirstReview(queryResults, kanjiToHover);
    }

    const filteredCardInfo = await this.getCardInfo(filteredCardIds);
    const tooltipHTML = this.buildTooltip(filteredCardInfo);

    // caches
    if (this.wordInds.persist !== null) {
      this.wordInds.persist.set(this.cacheKey, tooltipHTML);
      this.displayIfEleExists(tooltipHTML);
    }

    this.releaseMutex();
  }
}

export class WordIndicators extends RunnableAsyncModule {
  readonly persist = selectPersist();
  readonly persistObj = selectPersist('window');
  readonly tooltips: Tooltips;

  constructor() {
    super('wordIndicators');
    this.tooltips = new Tooltips();
    this.tooltips.overrideOptions(getOption('wordIndicators.overrideOptions.tooltips'));
  }

  //private async getQueries() {
  //  // not the current note
  //  const baseQuery = this.tooltips.getCardBaseQuery(getFieldValue('Key'));

  //  let cardIdsNonNew = await queryAnki(newQuery, this.persistObj, true, true); // read cache, write cache
  //  let cardIdsNew = await queryAnki(nonNewQuery, this.persistObj, true, true);

  //}

  async main() {
    //constructor(label: string, indicatorEle: HTMLElement, queryCategories: QueryCategories, wordInds: WordIndicators) {

    //const queryGroup: QueryBuilderGroup = this.tooltips.getQueryBuilderGroup();
    //for (const [key, qb] of Object.entries(queryGroup)) {
    //  qb.addSegment(baseQuery);

    //  const qbSent = qb.clone();
    //  qb.addSegment(wordQuery);
    //  queries[`word.${key as keyof QueryBuilderGroup}`] = qb.build();

    //  qbSent.addSegment(sentQuery);
    //  queries[`sent.${key as keyof QueryBuilderGroup}`] = qbSent.build();
    //}

    if (!this.getOption('enableAnkiconnectFeatures')) {
      return;
    }

    const word = escapeQueryStr(getFieldValue('Word'));
    const wordReadingHiragana = escapeQueryStr(getFieldValue('WordReadingHiragana'));

    const baseWordQuery = `"Word:${word}"  "WordReadingHiragana:${wordReadingHiragana}"`;
    const baseKanjiQuery = `"Word:${word}" -"WordReadingHiragana:${wordReadingHiragana}"`;
    const baseReadingQuery = `-"Word:${word}"  "WordReadingHiragana:${wordReadingHiragana}"`;

    const indicators: WordIndicator[] = [
      new WordIndicator('same_word_indicator', baseWordQuery, this),
      new WordIndicator('same_kanji_indicator', baseKanjiQuery, this),
      new WordIndicator('same_reading_indicator', baseReadingQuery, this),
    ];
    for (const indicator of indicators) {
      await indicator.run();
    }

    //this.addBrowseOnClick();
  }
}
