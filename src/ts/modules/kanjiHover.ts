import { RunnableAsyncModule } from '../module';
import { getOption } from '../options';
import { selectPersist } from '../spersist';
import { getFieldValue, plainToRuby } from '../utils';
import { TooltipBuilder, QueryBuilderGroup, NoteInfoTooltipBuilder } from './tooltipBuilder';
import {
  AnkiConnectAction,
  constructFindCardsAction,
  escapeQueryStr,
  getQueryCache,
  setQueryCache,
  invoke,
  QueryBuilder,
  CardInfo,
  cardsInfo,
} from '../ankiConnectUtils';

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

type KanjiQueryCategories = Record<string, QueryCategories>;
type KanjiQueryResults = Record<string, QueryResults>;

// TODO may have to separate preview and non-preview
type FilteredCardCategories = 'word.nonNew' | 'sent.nonNew' | 'word.new' | 'sent.new';
type FilteredCardIDs = Record<FilteredCardCategories, number[]>;
type KanjiToFilteredCardIDs = Record<string, FilteredCardIDs>;
type FilteredCardsInfo = Record<FilteredCardCategories, CardInfo[]>;
type KanjiToFilteredCardsInfo = Record<string, FilteredCardsInfo>;

type HoverInfo = {
  usedWords: string[];
  hoverHTML: string;
};

type NoteInfoKanjiHover = {
  WordReadingRubyHTML: string;
  WordReading: string;
  Key: string;
};

//type BuiltQueries = {
//  'word.nonNew.hidden': string;
//  'word.nonNew.default': string;
//  'word.new.hidden': string;
//  'word.new.default': string;
//
//  'sent.nonNew.hidden': string;
//  'sent.nonNew.default': string;
//  'sent.new.hidden': string;
//  'sent.new.default': string;
//}

//type QueryResults = Record<string, number[]>;

//type QueryResultKeys = 'nonNew.default' | 'nonNew.hidden' | 'new.default' | 'new.hidden';
// TODO QueryResult from QueryResultKeys

const hoverInfoCacheKey = 'KanjiHover.hoverInfoCacheKey';

// maps a kanji to the full hover HTML (the html containing the kanji + the full popup)
type KanjiToHover = Record<string, string>;

export class KanjiHover extends RunnableAsyncModule {
  private readonly persist = selectPersist();
  private readonly persistObj = selectPersist('window');
  private readonly tooltipBuilder: TooltipBuilder;

  //private wordReadingHTML = "";

  constructor() {
    //const displayPitchAccent = {{ utils.opt("modules", "kanji-hover", "display-pitch-accent") }}
    //const displayPitchAccentHover = {{ utils.opt("modules", "kanji-hover", "display-pitch-accent-hover-only") }}

    super('kanjiHover');
    this.tooltipBuilder = new TooltipBuilder();
    this.tooltipBuilder.overrideOptions(
      getOption('kanjiHover.overrideOptions.tooltipBuilder')
    );
  }

  private clearCardCache() {}

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

    let kanjiToQueryCategory: Record<string, QueryCategories> = {};
    // maps kanji.(notNew|new).(hidden|default) -> card ids
    let queryResults: KanjiQueryResults = {};
    //let queryResultsTemp: Record<string, number[]> = {};

    // TODO when combining, this can be a lambda
    for (const kanji of kanjis) {
      const wordReading = escapeQueryStr(noteInfo.WordReading);

      const wordQuery = `-"WordReading:${wordReading}" Word:*${kanji}*`;
      // should be mutually exclusive from the above
      const sentQuery = `-"WordReading:${wordReading}" -Word:*${kanji}* Sentence:*${kanji}*`;

      const queryGroup: QueryBuilderGroup = this.tooltipBuilder.getQueryBuilderGroup();

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
          queryResults[kanji][queryKey as KanjiHoverCategoryID] = [];
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

    for (const [kanji, queryCategory] of Object.entries(queryResults)) {
      for (const [categoryID, queryResult] of Object.entries(queryCategory)) {
        //const qResultKey = `${kanji}.${queryKey}`;
        if (queryResult.length === 1 && queryResult[0] === -1) {
          const query = kanjiToQueryCategory[kanji][categoryID as KanjiHoverCategoryID];
          queriesFlattened.push(query);

          kanjisFlattened.push(kanji);
          categoriesFlattened.push(categoryID as KanjiHoverCategoryID);

          console.log(query);
          const action = constructFindCardsAction(query);
          actions.push(action);
        }
      }
    }

    // parses multi result back into queryResults
    const multiResult = (await invoke('multi', { actions: actions })) as number[][];
    for (let i = 0; i < multiResult.length; i++) {
      const query = queriesFlattened[i];
      const kanji = kanjisFlattened[i];
      const categoryID = categoriesFlattened[i];
      const queryResult = multiResult[i];

      if (this.persistObj !== null) {
        setQueryCache(this.persistObj, query, queryResult);
      }

      queryResults[kanji][categoryID] = queryResult;
    }

    return queryResults;
  }

  private filterCards(
    a: number[][],
    b: number[][],
    aMaxFirst: number,
    aMaxLast: number,
    bMaxFirst: number,
    bMaxLast: number
  ): [number[][], number[][]] {
    if (a.length !== b.length) {
      throw Error(`Invalid lengths: ${a.length} vs ${b.length}`);
    }

    // result
    let aRes: number[][] = [];
    let bRes: number[][] = [];

    // attempts to use all in a_arr and b_arr to fill all of the resulting 2 arrays
    for (let i = 0; i < a.length; i++) {
      const aArr = Array.from(a[i]).sort();
      const bArr = Array.from(b[i]).sort();

      // spreads out the limits to each other if necessary
      // only spreads out the limits if the other array can handle it!
      // expensive but it's guaranteed to work
      let flip = true;
      while (aMaxFirst + aMaxLast > aArr.length && bMaxFirst + bMaxLast < bArr.length) {
        if (flip && aMaxFirst > 0) {
          aMaxFirst -= 1;
          bMaxFirst += 1;
        } else if (aMaxLast > 0) {
          aMaxLast -= 1;
          bMaxLast += 1;
        }
        flip = !flip;
      }
      console.log(aMaxFirst, aMaxLast, bMaxFirst, bMaxLast);

      // same thing but on b array
      flip = true;
      while (bMaxFirst + bMaxLast > bArr.length && aMaxFirst + aMaxLast < aArr.length) {
        if (flip && bMaxFirst > 0) {
          bMaxFirst -= 1;
          aMaxFirst += 1;
        } else if (bMaxLast > 0) {
          bMaxLast -= 1;
          aMaxLast += 1;
        }
        flip = !flip;
      }
      console.log(aMaxFirst, aMaxLast, bMaxFirst, bMaxLast);

      if (aArr.length > aMaxFirst + aMaxLast) {
        aRes.push([...aArr.slice(0, aMaxFirst), ...aArr.slice(-aMaxLast, aArr.length)]);
        aMaxFirst = 0;
        aMaxLast = 0;
      } else {
        aRes.push(Array.from(aArr));
        aMaxFirst = 0;

        // expensive reduce once again
        let reduceBy = aArr.length;
        while (reduceBy > 0) {
          let foundOne = false;
          if (aMaxFirst > 0) {
            aMaxFirst -= 1;
            reduceBy -= 1;
            foundOne = true;
          }
          if (reduceBy <= 0) {
            break;
          }
          if (aMaxLast > 0) {
            aMaxLast -= 1;
            reduceBy -= 1;
            foundOne = true;
          }

          if (!foundOne) {
            this.logger.error(`Cannot reduce any further? > ${aArr} < and ${bArr}`);
            break; // guarantees no infinite recursion, but this also implies there's an error in the code
          }
        }
      }

      if (bArr.length > bMaxFirst + bMaxLast) {
        bMaxFirst = 0;
        bMaxLast = 0;
        bRes.push([...bArr.slice(0, bMaxFirst), ...bArr.slice(-bMaxLast, bArr.length)]);
      } else {
        bRes.push(Array.from(bArr));

        // expensive reduce once again
        let reduceBy = bArr.length;
        while (reduceBy > 0) {
          let foundOne = false;
          if (bMaxFirst > 0) {
            bMaxFirst -= 1;
            reduceBy -= 1;
            foundOne = true;
          }
          if (reduceBy <= 0) {
            break;
          }
          if (bMaxLast > 0) {
            bMaxLast -= 1;
            reduceBy -= 1;
            foundOne = true;
          }

          if (!foundOne) {
            this.logger.error(`Cannot reduce any further? ${aArr} and > ${bArr} <`);
            break; // guarantees no infinite recursion
          }
        }
      }
      console.log(aMaxFirst, aMaxLast, bMaxFirst, bMaxLast);
    }

    return [aRes, bRes];
  }

  // TODO move this into tooltip builder maybe?
  private sortByTimeCreated(
    kanjiQueryResults: KanjiQueryResults
  ): KanjiToFilteredCardIDs {
    const maxNonNewOldest = this.getOption('tooltipBuilder.categoryMax.nonNew.oldest');
    const maxNonNewNewest = this.getOption('tooltipBuilder.categoryMax.nonNew.newest');
    const maxNewOldest = this.getOption('tooltipBuilder.categoryMax.new.oldest');
    const maxNewNewest = this.getOption('tooltipBuilder.categoryMax.new.newest');

    const kanjiToFilteredCardIDs: KanjiToFilteredCardIDs = {};

    for (const [kanji, queryResult] of Object.entries(kanjiQueryResults)) {
      const [nonNewResultIds, newResultIds] = this.filterCards(
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

  /* equivalent of cardsInfo() except it simply uses the cache instead */
  private cardIDsToCardsInfo(cardIDs: number[], cardsInfoResult: Record<number, CardInfo>): CardInfo[] {
    const result: CardInfo[] = [];
    for (const id of cardIDs) {
      if (!(id in cardsInfoResult)) {
        throw Error("id not in cardsInfoResult: ${id}");
      }
      result.push(cardsInfoResult[id])
    }
    return result
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
    const cardsInfoResult = await cardsInfo(cardIDsArray);

    for (const [kanji, filteredCardIDs] of Object.entries(kanjiToFilteredCardIDs)) {
      result[kanji] = {
        'word.nonNew': this.cardIDsToCardsInfo(filteredCardIDs['word.nonNew'], cardsInfoResult),
        'word.new': this.cardIDsToCardsInfo(filteredCardIDs['word.new'], cardsInfoResult),
        'sent.nonNew': this.cardIDsToCardsInfo(filteredCardIDs['sent.nonNew'], cardsInfoResult),
        'sent.new': this.cardIDsToCardsInfo(filteredCardIDs['sent.new'], cardsInfoResult),
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


  // transforms CardInfo into something useful for the tooltip builder
  private cardInfoToNoteInfoTooltipBuilder(cardInfo: CardInfo): NoteInfoTooltipBuilder {
    return {
      "AJTWordPitch": cardInfo.fields.AJTWordPitch.value,
      "PAOverride": cardInfo.fields.PAOverride.value,
      "PAOverrideText": cardInfo.fields.PAOverrideText.value,
      "PAPositions":cardInfo.fields.PAPositions.value,
      "Sentence": cardInfo.fields.Sentence.value,
      "Word": cardInfo.fields.Word.value,
      "WordReading": cardInfo.fields.WordReading.value,
      "WordReadingHiragana": cardInfo.fields.WordReading.value,
      "YomichanWordTags": cardInfo.fields.YomichanWordTags.value,
      "tags": []
    }
  }

  private buildTooltip(filteredCardsInfo: FilteredCardsInfo, kanji: string): string {
    for (const cardInfo of filteredCardsInfo['word.nonNew']) {
      const noteInfoTTB = this.cardInfoToNoteInfoTooltipBuilder(cardInfo);
      const wordDiv = this.tooltipBuilder.buildWordDiv(noteInfoTTB, kanji, cardInfo.cardId);
      const sentDiv = this.tooltipBuilder.buildSentDiv(noteInfoTTB);
    }
    for (const cardInfo of filteredCardsInfo['sent.nonNew']) {
      const noteInfoTTB = this.cardInfoToNoteInfoTooltipBuilder(cardInfo);
      const sentDiv = this.tooltipBuilder.buildSentDiv(noteInfoTTB);
    }
  }

  private async getKanjisToHover(
    noteInfo: NoteInfoKanjiHover
  ): Promise<Record<string, string>> {
    let kanjiSet = this.wordReadingKanjis(noteInfo);

    // maps a kanji to the full hover HTML (the html containing the kanji + the full popup)
    let kanjiToHover: Record<string, string> = {};

    // looks for a cached hoverHTMLKey that doesn't contain the target word
    // Array.from is to shallow-copy, so it doesn't interfere with kanjiSet.delete()
    for (const kanji of Array.from(kanjiSet)) {
      const key = `${hoverInfoCacheKey}.${kanji}`;
      if (this.persistObj?.has(key)) {
        const hoverInfoArray: HoverInfo[] = this.persistObj.get(key);

        for (const hoverInfo of hoverInfoArray) {
          if (!hoverInfo.usedWords.includes(noteInfo.WordReading)) {
            kanjiToHover[kanji] = hoverInfo.hoverHTML;
            break;
          }
        }
      }
    }

    // searches the remaining kanjis in kanjiSet
    const queryResults = await this.cardQueries(noteInfo, Array.from(kanjiSet));
    console.log(queryResults);

    // two possible handlers:
    // a) find all note infos for sorting purposes
    // b) sort by card id
    const sortMethod = this.getOption('tooltipBuilder.sortMethod');
    let kanjiToFilteredCardIDs: KanjiToFilteredCardIDs;
    if (sortMethod === 'time-created') {
      kanjiToFilteredCardIDs = this.sortByTimeCreated(queryResults);
    } else {
      throw Error('not implemented');
      //await this.sortByFirstReview(queryResults, kanjiToHover);
    }

    const kanjiToFilteredCardInfo = await this.getCardInfo(kanjiToFilteredCardIDs);
    this.buildTooltips(kanjiToFilteredCardInfo, kanjiToHover);

    return kanjiToHover;

    // flattens out the ids and maps to corresponding queries

    // Gets the card info for all the necessary cards
    // TODO caching!
    // TODO change the results of these to be something like:
    // {
    //   "kanji": {
    //     "nonNew": [...],
    //     "new": [...],
    //   },
    //   ...
    // }
    //const queryResults = await this.cardQueries(kanjiArr);
    //const cardsInfo = await this.getCardsInfo();

    //this.buildHoverHTML()

    //return {};
  }

  async main() {
    if (this.useCache) {
      // checks for card cache first
      // TODO
    } else {
      this.clearCardCache();
    }

    const noteInfo: NoteInfoKanjiHover = {
      WordReading: getFieldValue('WordReading'),
      WordReadingRubyHTML: plainToRuby(getFieldValue('WordReading')),
      Key: getFieldValue('Key'),
    };

    let wordReadingEle = document.getElementById('dh_reading');

    // checks for cache per kanji character
    let kanjiToHoverHTML = await this.getKanjisToHover(noteInfo);

    if (Object.keys(kanjiToHoverHTML).length > 0) {
      // an empty object seems to replace every empty space
      const re = new RegExp(Object.keys(kanjiToHoverHTML).join('|'), 'gi');
      const resultHTML = noteInfo.WordReadingRubyHTML.replace(re, function (matched) {
        return `<span data-kanji-hover="${matched}">${kanjiToHoverHTML[matched]}</span>`;
      });

      // can be null because this can be ran at the front side of the card
      if (wordReadingEle !== null) {
        wordReadingEle.innerHTML = resultHTML;
      }
    }

    // caches card
    // TODO

    this.tooltipBuilder.addBrowseOnClick(`.dh-left__reading > .hover-tooltip__word-div`);
  }
}
