import {escapeQueryStr, invoke} from './ankiConnectUtils';
import {getFieldValue} from './fields';
import { LOGGER } from './logger';
import {getOption} from './options';
import {selectPersistAny} from './spersist';
import {CardSide, isAndroid} from './utils';

const cardIsNewKey = "isNew.cardIsNewKey";

function cardIsNewAndroid() {
  //const jsApi = {"version" : "0.0.1",
  //  "Aquafina-water-bottle" : "17107540+Aquafina-water-bottle@users.noreply.github.com"};
  //const apiStatus = AnkiDroidJS.init(JSON.stringify(jsApi));
  //const api = JSON.parse(apiStatus);

  //if (api['markCard']) {
  //  console.log("API mark card available");
  //}   
  //AnkiDroidJS.ankiGetCardType()

  // TODO: is there a stable way of using the ankidroid js api?
  return false;
}

export async function cardIsNew(cardSide: CardSide) {
  if (!getOption("enableAnkiconnectFeatures")) {
    return false; // we don't know without ankiconnect!
  }

  if (isAndroid()) {
    return cardIsNewAndroid();
  }

  const spersist = selectPersistAny()

  const key = escapeQueryStr(getFieldValue("Key"));
  const sent = escapeQueryStr(getFieldValue("Sentence"));

  const cacheKey = `${cardIsNewKey}.${key}.${sent}`

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
    if (cardSide === "back") {
      return cacheVal;
    }
  }

  LOGGER.debug("Testing for new card...", 2);

  // TODO generalize / don't hardcode?
  const noteName = 'JP Mining Note';
  const cardTypeName = 'Mining Card';

  const query = `is:new "Key:${key}" "Sentence:${sent}" "note:${noteName}" "card:${cardTypeName}"`
  const result = await invoke('findCards', { query: query });
  const isNew = (Array.isArray(result) && result.length > 0);
  LOGGER.debug(`is new: ${isNew}, query: ${query}, result: ${result}`, 1);

  spersist?.set(cacheKey, isNew ? "true" : "");

  //CACHE.get("isNewCardCache", cacheKey, isNew);
  //this.isNewCardLocalCache = isNew;

  return isNew;


}
