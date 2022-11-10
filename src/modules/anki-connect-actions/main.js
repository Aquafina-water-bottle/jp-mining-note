
/// {% set globals %}

// note that this cache will NOT respect card review undos,
// but that should be a niche enough case to not warrent caching.
// maps cacheKey -> bool
var isNewCardCache = nullish(isNewCardCache, {});

// maps card_id -> (card info retrieved by Anki-Connect)
var cardsInfoCache = nullish(cardsInfoCache, {});

// maps query_str -> [card ids]
var cardQueryCache = nullish(cardQueryCache, {});

// maps key.sentence -> card id
var cardIdCache = nullish(cardIdCache, {});

/// {% endset %}



/// {% set functions %}

const JPMNAnkiConnectActions = (() => {

  const logger = new JPMNLogger("anki-connect-actions");

  function constructFindCardAction(query) {
    return {
      "action": "findCards",
      "params": {
        "query": query,
      }
    }
  }

  function constructCardsInfoAction(idList) {
    return {
      "action": "cardsInfo",
      "params": {
        "cards": idList,
      }
    }
  }

  const key = document.getElementById("hidden_key").innerHTML;
  const sentence = document.getElementById("hidden_sentence").innerHTML;
  const cacheKey = `${key}.${sentence}`;


  class JPMNAnkiConnectActions {
    constructor() {
      // this cache is destroyed on each card side
      // but the cache allows the same result to be used if the function is called multiple times
      // on one side
      this.isNewCardLocalCache = null;
    }

    // https://github.com/FooSoft/anki-connect#javascript
    invoke(action, params={}) {
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
        xhr.send(JSON.stringify({action, version, params}));
      });
    }


    filterCards(nonNewCardIds, newCardIds, maxNonNewOldest, maxNonNewLatest, maxNewLatest) {
      const max = maxNonNewOldest + maxNonNewLatest + maxNewLatest;
      if (nonNewCardIds.length + newCardIds.length <= max) {
        return [nonNewCardIds, newCardIds];
      }

      // adjusts for when there can be other cards that can fit the space
      // for example, 6 old & 0 new, or 0 old & 6 new
      if (newCardIds.length < maxNewLatest) {
        let diff = (maxNewLatest - newCardIds.length);
        maxNonNewOldest += (diff/2);
        maxNonNewLatest += (diff/2 + diff%2);
      }
      if (nonNewCardIds.length < (maxNonNewOldest + maxNonNewLatest)) {
        maxNewLatest += ((maxNonNewOldest + maxNonNewLatest) - nonNewCardIds.length);
      }

      // non new: gets the earliest and latest
      let nonNewResultIds = []
      if (nonNewCardIds.length > maxNonNewOldest + maxNonNewLatest) {
        nonNewResultIds = [
          ...nonNewCardIds.slice(0, maxNonNewOldest), // earliest
          ...nonNewCardIds.slice(-maxNonNewLatest, nonNewCardIds.length), // latest
        ];
      } else {
        nonNewResultIds = [...nonNewCardIds];
      }

      let newResultIds = newCardIds.slice(0, maxNewLatest);

      return [nonNewResultIds, newResultIds];
    }


    async query(queryStr, cache=true) {
      if (cache && queryStr in cardQueryCache) {
        logger.debug(`Using cached query result for ${queryStr}`, 2);
        return cardQueryCache[queryStr];
      }

      let cardIds = await this.invoke("findCards", {"query": queryStr});
      if (cache) {
        cardQueryCache[queryStr] = Array.from(cardIds); // shallow copy
      }
      return cardIds;

    }


    async cardsInfo(cardIds, cache=true) {
      if (cardIds.length === 0) {
        return cardIds;
      }

      let result = [];
      let searchCards = [];
      let mustSearchMap = {};

      if (cache) {
        for (const [i, cid] of cardIds.entries()) {
          if (cid in cardsInfoCache) {
            logger.debug(`Using cached cardsInfo result for ${cid}`, 2);
            result.push(cardsInfoCache[cid]);
          } else {
            result.push(0);
            searchCards.push(cid);
            mustSearchMap[cid] = i;
          }
        }
      } else {
        searchCards = cardIds;
      }

      if (searchCards.length > 0) {
        const cardsInfo = await this.invoke("cardsInfo", {"cards": searchCards});
        if (!cache) {
          return cardsInfo;
        }

        // uses cache
        for (const [i, cid] of searchCards.entries()) {
          const j = mustSearchMap[cid];
          result[j] = cardsInfo[i];
          cardsInfoCache[cid] = cardsInfo[i];
        }
      }

      return result;
    }

    async queryAndCardsInfo(queryStr, cacheQuery=true, cacheCardInfo=true) {
      let cardIds = await this.query(queryStr, cacheQuery);
      return await this.cardsInfo(cardIds, cacheCardInfo);
    }

    async cardIsNew() {

      // refreshes on every new check, b/c one cannot assume that a card
      if (cacheKey in isNewCardCache && !isNewCardCache[cacheKey]) {
        logger.debug("Key in new card cache and is not new.");
        return false;
      }

      if (this.isNewCardLocalCache !== null) {
        return this.isNewCardLocalCache;
      }
      logger.debug("Testing for new card...", 2);

      const cid = await this.getDisplayedCardId();
      const cardTypeName = '{{ NOTE_FILES("templates", note.card_type, "name").item() }}';
      if (cid === 0) {
        return false;
      }
      const query = `is:new cid:${cid} "card:${cardTypeName}"`
      const result = this.query(query, /*cache=*/false);
      const isNew = (result.length > 0);

      isNewCardCache[cacheKey] = isNew;
      this.isNewCardLocalCache = isNew;

      return isNew;
    }

    /*
     * Attempts to get the displayed card using the combination of the key and sentence.
     *
     * This function makes no assumption that the Key field is unique,
     * and was in fact made specifically to get the card even if the Key field is not unique.
     *
     * Returns 0 if cannot find the displayed card
     */
    async _getDisplayedCardId() {
      //let currentCard = null;
      //let validErrMsg = "Gui review is not currently active.";

      //try {
      //  currentCard = await this.invoke("guiCurrentCard");
      //} catch (error) {
      //  // the error is apparently a string?
      //  if (error !== validErrMsg) {
      //    throw error;
      //  }
      //}

      //if (currentCard !== null) {
      //  return currentCard.cardId;
      //}

      const cardTypeName = '{{ NOTE_FILES("templates", note.card_type, "name").item() }}';
      const noteName = '{{ NOTE_FILES("model-name").item() }}';

      let cachable = true;

      let keyText = key.replace('"', '\\"');
      let sentenceSearch = sentence.replace('"', '\\"');

      // query with sentence and key
      let query = `"Key:${keyText}" "Sentence:${sentenceSearch}" "card:${cardTypeName}" "note:${noteName}"`;
      let result = await this.query(query);

      if (result.length >= 1) {
        if (result.length >= 2) {
          logger.warn("Found multiple cards with the same Key and Sentence."); // why
          cachable = false;
        }
        return [result[0], cachable];
      }
      cachable = false;

      // last try query (why would this not work)
      query = `"Key:${keyText}" "card:${cardTypeName}" "note:${noteName}"`;
      result = await this.query(query);

      if (result.length >= 1) {
        if (result.length >= 2) {
          logger.warn("Found multiple cards with the same Key.");
        }
        return [result[0], cachable];
      }

      // result.length === 0
      logger.warn("Cannot get displayed card ID.");
      return [0, cachable];

    }

    async getDisplayedCardId() {
      if (cacheKey in cardIdCache) {
        return cardIdCache[cacheKey];
      }

      const [cid, cachable] = await this._getDisplayedCardId();
      if (cachable) {
        cardIdCache[cacheKey] = cid;
      }
      return cid;
    }


  }

  return JPMNAnkiConnectActions;

})();

/// {% endset %}

