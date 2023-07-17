import { escapeQueryStr, invoke } from './ankiConnectUtils';
import { getFieldValue } from './fields';
import { LOGGER } from './logger';
import { getOption } from './options';
import { selectPersistAny } from './spersist';
import { isAndroid, type CardSide } from './utils';

const cardIsNewKey = 'isNew.cardIsNewKey';

// global empty declaration so typescript doesn't fail
declare global {
  var AnkiDroidJS: any;
}

function cardIsNewAndroid() {
  // TODO: Make this work?

  //const jsApi = {"version" : "0.0.1",
  //  "Aquafina-water-bottle" : "17107540+Aquafina-water-bottle@users.noreply.github.com"};
  //if (typeof globalThis.AnkiDroidJS === "undefined" || globalThis.AnkiDroidJS.init === "undefined") {
  //  LOGGER.warn("android undefined");
  //  return false;
  //}

  //const apiStatus = globalThis.AnkiDroidJS.init(JSON.stringify(jsApi));
  //const api = JSON.parse(apiStatus);
  //if (api['ankiGetCardType']) {
  //  const cardType = globalThis.AnkiDroidJS.ankiGetCardType();
  //  LOGGER.warn("cardType " + cardType);
  //  return (cardType === 0); // 0 means new
  //}
  //LOGGER.warn("android getcardtype undefined");
  //LOGGER.warn(apiStatus);
  return false;
}

export async function cardIsNew(cardSide: CardSide) {
  if (isAndroid()) {
    return cardIsNewAndroid();
  }

  if (!getOption('enableAnkiconnectFeatures')) {
    return false; // we don't know without ankiconnect!
  }

  const spersist = selectPersistAny();

  const key = escapeQueryStr(getFieldValue('Key'));
  const sent = escapeQueryStr(getFieldValue('Sentence'));

  const cacheKey = `${cardIsNewKey}.${key}.${sent}`;

  // only attempts to query if:
  // - not stored in cache yet
  // - stored in cache, but is front side + new
  // assumptions:
  // - the order always goes from front -> back. It is impossible for a card to be new
  //   at the front but not new on the back, and visa versa.
  // - If cached, the back side never has to be queried because getting the new status
  //   is always done at the front side of the card
  if (spersist?.has(cacheKey)) {
    const cacheVal = spersist.get(cacheKey);
    if (!cacheVal) {
      return cacheVal;
    }
    if (cardSide === 'back') {
      return cacheVal;
    }
  }

  LOGGER.debug('Testing for new card...', 2);

  // TODO generalize / don't hardcode?
  const noteName = 'JP Mining Note';
  const cardTypeName = 'Mining Card';

  const query = `is:new "Key:${key}" "Sentence:${sent}" "note:${noteName}" "card:${cardTypeName}"`;
  const result = await invoke('findCards', { query: query });
  const isNew = Array.isArray(result) && result.length > 0;
  LOGGER.debug(`is new: ${isNew}, query: ${query}, result: ${result}`, 1);

  spersist?.set(cacheKey, isNew ? 'true' : '');

  //CACHE.get("isNewCardCache", cacheKey, isNew);
  //this.isNewCardLocalCache = isNew;

  return isNew;
}
