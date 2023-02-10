import { SPersistInterface } from './spersist';

const getQueryCacheKey = 'ankiConnectUtils.getQueryCacheKey';

export type AnkiConnectAction = {
  action: string;
  version: number;
  params?: Record<string, any>;
};

// https://github.com/FooSoft/anki-connect#javascript
export function invoke(action: string, params: Record<string, any> = {}) {
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
  persist: SPersistInterface,
  query: string
): number[] | null {
  const key = `${getQueryCacheKey}.${query}`;
  if (persist.has(key)) {
    return persist.get(key) as number[];
  }
  return null;
}

/* expects that persist can store objects */
export function setQueryCache(
  persist: SPersistInterface,
  query: string,
  queryResult: number[]
) {
  const key = `${getQueryCacheKey}.${query}`;
  persist.set(key, queryResult);
}




export class QueryBuilder {

  private segments: string[] = []

  constructor() { }

  addSegment(segment: string, negate = false) {
    if (segment.length > 0) {
      const resultSegment = `${negate ? '-' : ''}(${segment})`;
      this.segments.push(resultSegment);
    }
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

