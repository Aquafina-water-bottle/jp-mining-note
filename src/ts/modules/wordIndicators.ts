import { RunnableAsyncModule } from '../module';
import { getOption } from '../options';
import {
  filterCards,
  getTags,
  getCardKey,
  getCardSide,
} from '../utils';
import { getFieldValue, Field, cacheFieldValue, getFieldValueEle } from '../fields';
import {
  Tooltips,
  QueryBuilderGroup,
  NoteInfoTooltipBuilder,
  TooltipBuilder,
} from './tooltips';
import { selectPersistAny, selectPersistObj } from '../spersist';
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
import { cardIsNew } from '../isNew';
import { MobilePopup } from '../mobilePopup';
import { type CardCache } from './cardCache';

type WordIndicatorsCategoryID =
  | 'nonNew.hidden'
  | 'nonNew.default'
  | 'new.hidden'
  | 'new.default';

const wordIndicatorCardCacheKey = 'WordIndicators.wordIndicatorCardCacheKey';
const wordIndicatorsCardResultCacheKey =
  'WordIndicators.wordIndicatorsCardResultCacheKey';

const clsMainWord = 'dh-left__similar-words-indicators-main-word';
//const clsWithIndicators = 'dh-left--with-similar-word-indicators';

type QueryCategories = Record<WordIndicatorsCategoryID, string>;
type QueryResults = Record<WordIndicatorsCategoryID, number[]>;

type FilteredCardCategories = 'nonNew' | 'new';
type FilteredCardIDs = Record<FilteredCardCategories, number[]>;
type FilteredCardsInfo = Record<FilteredCardCategories, CardInfo[]>;

export type WordIndicatorLabel =
  | 'same_word_indicator'
  | 'same_kanji_indicator'
  | 'same_reading_indicator';

export class WordIndicator {
  // is also the html id for the indicator element
  private readonly baseIndicatorQuery: string;
  private readonly wordInds: WordIndicators;
  readonly label: WordIndicatorLabel;
  readonly indicatorEle: HTMLElement | null;
  readonly infoCircIndicatorEle: HTMLElement | null;
  readonly cacheKey: string;

  constructor(
    label: WordIndicatorLabel,
    baseIndicatorQuery: string,
    wordInds: WordIndicators,
    indicatorEle: HTMLElement | null,
    infoCircIndicatorEle: HTMLElement | null
  ) {
    this.label = label;
    this.baseIndicatorQuery = baseIndicatorQuery;
    this.wordInds = wordInds;
    this.indicatorEle = indicatorEle;
    this.infoCircIndicatorEle = infoCircIndicatorEle;
    this.cacheKey = `${wordIndicatorCardCacheKey}.${label}.${getCardKey()}`;

    // ran synchronously, so fields will 100% be cached
    const cacheFields: readonly Field[] = [
      'Key',
      'AJTWordPitch',
      'PAOverride',
      'PAOverrideText',
      'PAPositions',
      'Sentence',
      'Word',
      'WordReading',
      'WordReadingHiragana',
      'YomichanWordTags',
    ] as const;
    for (const f of cacheFields) {
      cacheFieldValue(f);
    }
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
    // TODO shouldn't this be cached in the constructor?
    const currentCardInfo: NoteInfoTooltipBuilder = {
      AJTWordPitch: getFieldValue('AJTWordPitch'),
      PAOverride: getFieldValue('PAOverride'),
      PAOverrideText: getFieldValue('PAOverrideText'),
      PAPositions: getFieldValue('PAPositions'),
      Sentence: getFieldValue('Sentence'),
      Word: getFieldValue('Word'),
      WordReading: getFieldValue('WordReading'),
      WordReadingHiragana: getFieldValue('WordReadingHiragana'),
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

  // this is only expected to be called at the backside of the card
  async display() {
    // doesn't use isCached() function, because useCache is false on refresh
    if (!this.wordInds.persist?.has(this.cacheKey)) {
      this.wordInds.logger.debug(`${this.label} -> nothing cached?`);
      return;
    }
    const tooltipHTML = this.wordInds.persist?.get(this.cacheKey);

    // tooltipHTML can actually be an empty string, to store the fact that nothing has to be shown
    if (tooltipHTML.length === 0) {
      this.wordInds.logger.debug(`${this.label} -> empty`);
      return;
    }
    this.wordInds.logger.debug(`${this.label} -> displaying...`);

    // mobilePopup is not null <=> bp < combinePicture <=> should display mobile
    if (this.wordInds.mobilePopup !== null) {
      this.wordInds.mobilePopup.setupWordIndicator(
        this,
        this.wordInds.infoCircIndicatorsGroupEle,
        tooltipHTML
      );
    } else {
      // elements are gotten in the constructor of WordIndicators, so these cannot
      // accidentally grab the wrong element
      const indicatorEle = this.indicatorEle;
      const dhLeftEle = this.wordInds.dhLeftEle;

      if (indicatorEle === null || dhLeftEle === null) {
        this.wordInds.logger.warn(`Cannot display indicator: ${this.label}`);
        return;
      }

      // TODO document structure of element?
      indicatorEle.children[1].children[0].innerHTML = tooltipHTML;
      indicatorEle.classList.toggle('dh-left__similar-words-indicator--visible', true);

      if (await cardIsNew('back')) {
        indicatorEle.classList.toggle('dh-left__similar-words-indicator--new', true);
      }

      // TODO rework this! this also affects pitch accents!
      //dhLeftEle.classList.toggle(clsWithIndicators, true);

      this.wordInds.tooltips.addBrowseOnClick(indicatorEle);
    }
  }

  isCached() {
    return this.wordInds.useCache && this.wordInds.persist?.has(this.cacheKey);
  }

  async getTooltipHTML(): Promise<string> {
    // resets on refresh
    const indicatorEle = document.getElementById(this.label);
    indicatorEle?.classList.toggle('dh-left__similar-words-indicator--visible', false);

    // gets cache if exists
    // this section is before the mutex in case this was called
    // on the back side of the card while the front side is still running
    if (this.isCached()) {
      this.wordInds.logger.debug('Has cached indicator');
      return this.wordInds.persist?.get(this.cacheKey) ?? '';
    }

    this.wordInds.logger.debug(`Running ${this.label}`);

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
        this.wordInds.persist.set(this.cacheKey, '');
      }
      this.wordInds.logger.debug(`Finished running ${this.label}: nothing found`);
      return '';
    }

    const sortMethod = this.wordInds.tooltips.getOption('tooltips.sortMethod');
    let filteredCardIds: FilteredCardIDs;
    if (sortMethod === 'time-created') {
      filteredCardIds = this.sortByTimeCreated(queryResults);
    } else {
      throw Error('not implemented');
      //await this.sortByFirstReview(queryResults, kanjiToHover);
    }

    const filteredCardInfo = await this.getCardInfo(filteredCardIds);
    const tooltipHTML = this.buildTooltip(filteredCardInfo);
    return tooltipHTML;
  }
}

export class WordIndicators extends RunnableAsyncModule {
  readonly persist = selectPersistAny();
  readonly persistObj = selectPersistObj();

  // elements gotten here for safety from async calls
  private readonly indicatorEleSameWord = document.getElementById('same_word_indicator');
  private readonly indicatorEleSameKanji =
    document.getElementById('same_kanji_indicator');
  private readonly indicatorEleSameReading = document.getElementById(
    'same_reading_indicator'
  );

  readonly infoCircIndicatorsGroupEle = document.getElementById(
    'ic_similar_words_indicators'
  );
  private readonly infoCircIndicatorEleSameWord = document.getElementById(
    'ic_same_word_indicator'
  );
  private readonly infoCircIndicatorEleSameKanji = document.getElementById(
    'ic_same_kanji_indicator'
  );
  private readonly infoCircIndicatorEleSameReading = document.getElementById(
    'ic_same_reading_indicator'
  );

  readonly dhLeftEle = document.getElementById('dh_left');
  readonly mobilePopup: MobilePopup | null;
  private readonly cardCache: CardCache | null;

  readonly tooltips: Tooltips;

  // caches here for safety from async calls
  private readonly cardSide = getCardSide();

  constructor(cardCache: CardCache | null, mobilePopup: MobilePopup | null) {
    super('wordIndicators');
    this.tooltips = new Tooltips();
    this.tooltips.overrideOptions(getOption('wordIndicators.overrideOptions.tooltips'));

    this.mobilePopup = mobilePopup;
    this.cardCache = cardCache;
  }

  getIndicators(): WordIndicator[] {
    // ASSUMPTION: if safe, then should be backside of card -> this.indicatorEle* and this.dhLeftEle
    // are all non-null!

    const word = escapeQueryStr(getFieldValue('Word'));
    const wordReadingHiragana = escapeQueryStr(getFieldValue('WordReadingHiragana'));

    const baseWordQuery = `"Word:${word}"  "WordReadingHiragana:${wordReadingHiragana}"`;
    const baseKanjiQuery = `"Word:${word}" -"WordReadingHiragana:${wordReadingHiragana}"`;
    const baseReadingQuery = `-"Word:${word}"  "WordReadingHiragana:${wordReadingHiragana}"`;

    return [
      new WordIndicator(
        'same_word_indicator',
        baseWordQuery,
        this,
        this.indicatorEleSameWord,
        this.infoCircIndicatorEleSameWord
      ),
      new WordIndicator(
        'same_kanji_indicator',
        baseKanjiQuery,
        this,
        this.indicatorEleSameKanji,
        this.infoCircIndicatorEleSameKanji
      ),
      new WordIndicator(
        'same_reading_indicator',
        baseReadingQuery,
        this,
        this.indicatorEleSameReading,
        this.infoCircIndicatorEleSameReading
      ),
    ];
  }

  async main() {
    // checks for CardCache field first
    // if it exists, the calculation at the front side will also be skipped here
    if (this.useCache && this.persist !== null && this.cardCache?.shouldUse()) {
      const wordIndsData = this.cardCache.getWordIndsData()
      if (wordIndsData) {
        this.logger.debug('Using CardCache');
        const indicators = this.getIndicators();
        for (const indicator of indicators) {
          const tooltipHTML =
            wordIndsData.querySelector(`[data-cache-label="${indicator.label}"]`)
              ?.innerHTML ?? '';
          if (tooltipHTML !== null && this.cardSide === 'back') {
            this.persist.set(indicator.cacheKey, tooltipHTML);
            indicator.display();
          }
        }
        return;
      }
    }

    const getResultFront = this.getOption('wordIndicators.getResultsFront');
    if (!getResultFront && this.cardSide === 'front') {
      return;
    }

    // starts to properly calculate the results here, AKA uses anki-connect
    if (!this.getOption('enableAnkiconnectFeatures')) {
      return;
    }

    const indicators = this.getIndicators();
    const persistObj = selectPersistObj();

    // if getResultFront, this code will always fire regardless of side
    if (getResultFront || (!getResultFront && this.cardSide === 'back')) {
      // not a constant due to cache.ts erroring on import step
      const cardResultsCacheKey = `${wordIndicatorsCardResultCacheKey}.${getCardKey()}`;

      if (persistObj === null) {
        // abort because this will probably be too expensive...
        this.logger.warn('cannot persist, will not get results...');
      } else {
        // global variable to store whether the indicators have gotten the results or not
        let getResults = async () => {
          // these should run very quickly if something is cached (as it immediately returns)
          for (const indicator of indicators) {
            // ASSUMPTION: this actually awaits for the result!
            const tooltipHTML = await indicator.getTooltipHTML();

            // caches
            if (this.persist !== null) {
              this.persist.set(indicator.cacheKey, tooltipHTML);
              this.logger.debug(
                `${indicator.label}: cached result of length ${tooltipHTML.length}`
              );
            }
          }
          return true;
        };

        if (this.useCache && persistObj.has(cardResultsCacheKey)) {
          this.logger.debug('no reason to get results: already queued');
        } else {
          persistObj.set(cardResultsCacheKey, getResults());
        }
      }

      if (this.cardSide === 'back') {
        if (persistObj !== null && persistObj.has(cardResultsCacheKey)) {
          await persistObj.get(cardResultsCacheKey); // so it's no longer a promise

          for (const indicator of indicators) {
            indicator.display();
          }
        } else {
          this.logger.warn('cannot persist or results are not cached');
        }
      }
    }
  }
}
