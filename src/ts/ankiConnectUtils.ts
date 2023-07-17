import { selectPersistObj, SPersistInterface } from './spersist';
import { type Field } from './fields';

const getQueryCacheKey = 'ankiConnectUtils.getQueryCacheKey';
const getCardInfoCacheKey = 'ankiConnectUtils.getCardInfoCacheKey';

type _FieldValue = {
  value: string;
  order: number;
};

export type NoteInfo = {
  readonly noteId: number;
  readonly modelName: string;
  readonly tags: string[];
  readonly fields: Record<Field, { value: string }>;
};

// copied from https://github.com/FooSoft/anki-connect#cardsinfo
export type CardInfo = {
  readonly answer: string;
  readonly question: string;
  readonly deckName: string;
  readonly modelName: string;
  readonly fieldOrder: number;
  readonly fields: Record<Field, _FieldValue>;
  readonly css: string;
  readonly cardId: number;
  readonly interval: number;
  readonly note: number;
  readonly ord: number;
  readonly type: number;
  readonly queue: number;
  readonly due: number;
  readonly reps: number;
  readonly lapses: number;
  readonly left: number;
  readonly mod: number;
};

export type AnkiConnectAction = {
  action: string;
  version: number;
  params?: Record<string, any>;
};

// https://github.com/FooSoft/anki-connect#javascript
export function invoke(action: string, params: Record<string, any> = {}): unknown {
  //console.log(`invoke(${action}, ${JSON.stringify(params)}`);

  let version = 6;
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('error', () => reject('AnkiConnect failed to issue request.'));
    xhr.addEventListener('load', () => {
      try {
        const response = JSON.parse(xhr.responseText);
        if (Object.getOwnPropertyNames(response).length != 2) {
          throw 'response has an unexpected number of fields';
        }
        if (!response.hasOwnProperty('error')) {
          throw 'response is missing required error field';
        }
        if (!response.hasOwnProperty('result')) {
          throw 'response is missing required result field';
        }
        if (response.error) {
          throw response.error;
        }
        resolve(response.result);
      } catch (e) {
        reject(e);
      }
    });

    xhr.open('POST', 'http://127.0.0.1:8765');
    xhr.send(JSON.stringify({ action, version, params }));
  });
}

/* Escapes the string to be used in Anki-Connect queries */
export function escapeQueryStr(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

export function constructFindCardsAction(query: string): AnkiConnectAction {
  return {
    action: 'findCards',
    version: 6,
    params: {
      query: query,
    },
  };
}

/* expects that persist can store objects */
export function getQueryCache(
  persistObj: SPersistInterface,
  query: string
): number[] | null {
  const key = `${getQueryCacheKey}.${query}`;
  if (persistObj.has(key)) {
    return persistObj.get(key) as number[];
  }
  return null;
}

/* expects that persist can store objects */
export function setQueryCache(
  persistObj: SPersistInterface,
  query: string,
  queryResult: number[]
) {
  const key = `${getQueryCacheKey}.${query}`;
  persistObj.set(key, queryResult);
}

/* expects that persist can store objects */
export async function queryAnki(
  persistObj: SPersistInterface | null,
  query: string,
  readCache: boolean,
  writeCache: boolean
): Promise<number[]> {
  if (readCache && persistObj !== null) {
    const cache = getQueryCache(persistObj, query);
    if (cache !== null) {
      return cache;
    }
  }
  const result = (await invoke('findCards', { query: query })) as number[];
  if (writeCache && persistObj !== null) {
    setQueryCache(persistObj, query, result);
  }
  return result;
}

/* expects that persist can store objects */
export function setCardInfoCache(
  persist: SPersistInterface,
  cardID: number,
  cardInfo: CardInfo
) {
  const key = `${getCardInfoCacheKey}.${cardID}`;
  persist.set(key, cardInfo);
}

/* expects that persist can store objects */
export function getCardInfoCache(
  persist: SPersistInterface,
  cardID: number
): CardInfo | null {
  const key = `${getCardInfoCacheKey}.${cardID}`;
  if (persist.has(key)) {
    return persist.get(key) as CardInfo;
  }
  return null;
}

export async function cardsInfo(
  cardIDs: number[],
  readCache = true,
  writeCache = true
): Promise<Record<number, CardInfo>> {
  const result: Record<number, CardInfo> = {};

  if (readCache) {
    const persist = selectPersistObj();
    if (persist !== null) {
      for (const id of cardIDs) {
        const cache = getCardInfoCache(persist, id);
        if (cache !== null) {
          result[id] = cache;
        }
      }
    }
  }

  // gets all not originally cached
  const searchIDs: number[] = [];
  for (const id of cardIDs) {
    if (!(id in result)) {
      searchIDs.push(id);
    }
  }
  const cardsInfoResult = (await invoke('cardsInfo', { cards: searchIDs })) as CardInfo[];
  for (let i = 0; i < searchIDs.length; i++) {
    const id = searchIDs[i];
    const cardInfo = cardsInfoResult[i];
    result[id] = cardInfo;
  }

  if (writeCache) {
    const persist = selectPersistObj();
    if (persist !== null) {
      for (let i = 0; i < searchIDs.length; i++) {
        const id = searchIDs[i];
        const cardInfo = cardsInfoResult[i];
        setCardInfoCache(persist, id, cardInfo);
      }
    }
  }

  return result;
}

/* equivalent of cardsInfo() except it simply uses the cache instead */
export function cardIDsToCardsInfo(
  cardIDs: number[],
  cardsInfoResult: Record<number, CardInfo>
): CardInfo[] {
  const result: CardInfo[] = [];
  for (const id of cardIDs) {
    if (!(id in cardsInfoResult)) {
      throw Error('id not in cardsInfoResult: ${id}');
    }
    result.push(cardsInfoResult[id]);
  }
  return result;
}

export class QueryBuilder {
  private segments: string[] = [];

  constructor() {}

  addSegment(segment: string, negate = false): QueryBuilder {
    if (segment.length > 0) {
      const resultSegment = `${negate ? '-' : ''}(${segment})`;
      this.segments.push(resultSegment);
    }
    return this;
  }

  build() {
    return this.segments.join(' ');
  }

  clone() {
    const qb = new QueryBuilder();
    qb.segments = Array.from(this.segments);
    return qb;
  }
}
