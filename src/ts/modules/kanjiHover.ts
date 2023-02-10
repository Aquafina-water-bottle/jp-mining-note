import { RunnableAsyncModule } from '../module';
import { getOption } from '../options';
import { selectPersist } from '../spersist';
import { getFieldValue, plainToRuby } from '../utils';
import { BuiltQueries, TooltipBuilder } from './tooltipBuilder';
import {
  AnkiConnectAction,
  constructFindCardsAction,
  escapeQueryStr,
  getQueryCache,
  invoke,
  setQueryCache,
} from '../ankiConnectUtils';

type HoverInfo = {
  usedWords: string[];
  hoverHTML: string;
};

type NoteInfoKanjiHover = {
  WordReadingRubyHTML: string;
  WordReading: string;
  Key: string;
};

const HOVER_INFO_CACHE_KEY = 'kanjiToHoverInfoCache';

//type QueryResults = Record<string, number[]>;

type QueryResultKeys = 'nonNew.default' | 'nonNew.hidden' | 'new.default' | 'new.hidden'
// TODO QueryResult from QueryResultKeys
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

  // returns a map:
  // kanji.(notNew|new).(hidden|default) -> card ids
  // TODO combine this with word indicators via tooltip builder at some point?
  private async cardQueries(
    noteInfo: NoteInfoKanjiHover,
    kanjis: string[]
  ): Promise<QueryResults> {
    // TODO how to run this across other notes / cards?

    let kanjiToBuiltQueries: Record<string, BuiltQueries> = {};
    // maps kanji.(notNew|new).(hidden|default) -> card ids
    let queryResults: QueryResults = {};

    // TODO when combining, this can be a lambda
    for (const kanji of kanjis) {
      const wordReading = escapeQueryStr(noteInfo.WordReading);
      const base = this.tooltipBuilder.buildBaseQuery(noteInfo.Key);
      const baseQuery = `(${base}) (-"WordReading:${wordReading}" Word:*${kanji}*)`;

      const queries = this.tooltipBuilder.buildQueries(baseQuery);
      kanjiToBuiltQueries[kanji] = queries;
    }

    for (const [kanji, builtQuery] of Object.entries(kanjiToBuiltQueries)) {
      // checks cache
      if (this.useCache) {
        for (const [queryKey, query] of Object.entries(builtQuery)) {
          if (this.persistObj !== null) {
            const cache = getQueryCache(this.persistObj, query);
            if (cache !== null) {
              const qResultKey = `${kanji}.${queryKey}`;
              queryResults[qResultKey] = cache;
            }
          }
        }
      }

      // checks unnecessary query (hidden has nothing)
      function checkUnnecessaryQuery(queryKey: 'new.hidden' | 'nonNew.hidden') {
        if (builtQuery[queryKey] === '') {
          const qResultKey = `${kanji}.${queryKey}`;
          queryResults[qResultKey] = [];
        }
      }
      // for some reason, this for loop doesn't seem to work with typescript?
      //for (const queryKey of ['new.hidden', 'nonNew.hidden']) {
      //  checkUnnecessaryQuery(queryKey);
      //}
      checkUnnecessaryQuery('new.hidden');
      checkUnnecessaryQuery('nonNew.hidden');
    }

    // gets actions for queries
    // these two arrays should be the same length, as they map query key <-> query
    let queriesFlattened: string[] = [];
    let queryKeysFlattened: string[] = [];
    let actions: AnkiConnectAction[] = [];

    for (const [kanji, builtQuery] of Object.entries(kanjiToBuiltQueries)) {
      for (const [queryKey, query] of Object.entries(builtQuery)) {
        const qResultKey = `${kanji}.${queryKey}`;
        if (!(qResultKey in queryResults)) {
          queriesFlattened.push(query);
          queryKeysFlattened.push(qResultKey);
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
      const queryKey = queryKeysFlattened[i];
      const queryResult = multiResult[i];

      if (this.persistObj !== null) {
        setQueryCache(this.persistObj, query, queryResult);
      }
      queryResults[queryKey] = queryResult;
    }

    return queryResults;
  }

  // TODO move this into tooltip builder
  private async sortByTimeCreated(
    queryResults: QueryResults,
    kanjiToHover: KanjiToHover
  ) {
    // restructures
    const kanjiToQueryResult: Record<string, Record<string, number[]>> = {};
    for (const qResultKey of Object.keys(queryResults)) {
      const kanji = qResultKey.substring(0, 1);
      const queryType = qResultKey.substring(2); // kanji.(notNew|new).(hidden|default)
      if (!(kanji in kanjiToQueryResult)) {
        kanjiToQueryResult[kanji] = {};
        kanjiToQueryResult[kanji][queryType] = queryResults[qResultKey];
      }
    }

    const maxNonNewOldest = this.getOption('tooltipBuilder.categoryMax.nonNewOldest');
    const maxNonNewLatest = this.getOption('tooltipBuilder.categoryMax.nonNewLatest');
    const maxNewLatest = this.getOption('tooltipBuilder.categoryMax.newLatest');

    for (const [kanji, queryResult] of Object.entries(kanjiToQueryResult)) {
      const [nonNewResultIds, newResultIds] = this.tooltipBuilder.filterCards(
        queryResult['nonNew.default'],
        queryResult['new.default'],
        maxNonNewOldest,
        maxNonNewLatest,
        maxNewLatest
      );
    }
  }

  // TODO move this into tooltip builder
  private async sortByFirstReview(
    queryResults: QueryResults,
    kanjiToHover: KanjiToHover
  ) {}

  private async getKanjisToHover(
    noteInfo: NoteInfoKanjiHover
  ): Promise<Record<string, string>> {
    let kanjiSet = this.wordReadingKanjis(noteInfo);

    // maps a kanji to the full hover HTML (the html containing the kanji + the full popup)
    let kanjiToHover: Record<string, string> = {};

    // looks for a cached hoverHTMLKey that doesn't contain the target word
    // Array.from is to shallow-copy, so it doesn't interfere with kanjiSet.delete()
    for (const kanji of Array.from(kanjiSet)) {
      const key = `${HOVER_INFO_CACHE_KEY}.${kanji}`;
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
    if (sortMethod === 'time-created') {
      await this.sortByTimeCreated(queryResults, kanjiToHover);
    } else {
      await this.sortByFirstReview(queryResults, kanjiToHover);
    }

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
