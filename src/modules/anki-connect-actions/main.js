
/// {% set globals %}

// note that this cache will NOT respect card review undos,
// but that should be a niche enough case to not warrent caching.
// maps key -> bool
var isNewCardCache = nullish(isNewCardCache, {});

// maps card_id -> (card info retrieved by Anki-Connect)
var cardsInfoCache = nullish(cardsInfoCache, {});

// maps query_str -> [card ids]
var cardQueryCache = nullish(cardQueryCache, {});

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



  class JPMNAnkiConnectActions {
    constructor() { }

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
        maxNonNewOldest += (maxNewLatest - newCardIds.length);
      }
      if (nonNewCardIds.length < (maxNonNewOldest + maxNonNewLatest)) {
        maxNonNewLatest += ((maxNonNewOldest + maxNonNewLatest) - nonNewCardIds.length);
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
      cardQueryCache[queryStr] = Array.from(cardIds); // shallow copy
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

    //async queryAndCardInfo(query, cacheQuery=true, cacheCardInfo=true) {
    //  let cardIds = await this.query(query);
    //  if (cacheQuery && query in cardQueryCache) {
    //    cardIds = cacheQuery[query];
    //  } else {
    //    cardIds = await invoke("findCards", {"query": query});
    //  }

    //  if (cardIds.length === 0) {
    //    return [];
    //  }

    //  let result = [];
    //  let searchCards = [];
    //  let mustSearchMap = {};

    //  if (cacheCardInfo) {
    //    for (const [i, cid] of cardIds.entries()) {
    //      if (cid in cardsInfoCache) {
    //        result.push(cardsInfoCache[cid]);
    //      } else {
    //        result.push(0);
    //        searchCards.push(cid);
    //        mustSearchMap[cid] = i;
    //      }
    //    }
    //  } else {
    //    searchCards = cardIds;
    //  }

    //  if (searchCards.length > 0) {
    //    const cardsInfo = await invoke("cardsInfo", {"cards": searchCards});
    //    if (!cacheCardInfo) {
    //      return cardsInfo;
    //    }

    //    // uses cache
    //    for (const [i, cid] of searchCards.entries()) {
    //      const j = mustSearchMap[cid]
    //      result[j] = cardsInfo[i];
    //    }
    //  }

    //  return result;

    //}

    async cardIsNew() {

      // refreshes on every new check, b/c one cannot assume that a card
      // is no longer new once you see a new card (for example, editing a new card
      //   will consistently refresh the currently new card)
      const key = "{{ T('Key') }}";
      if (key in isNewCardCache && !isNewCardCache[key]) {
        logger.debug("Key in new card cache and is not new.");
        return false;
      }
      logger.debug("Testing for new card...", 2);

      // constructs the multi findCards request for ankiconnect
      let actions = [];
      const cardTypeName = '{{ NOTE_FILES("templates", note.card_type, "name").item() }}';
      actions.push(constructFindCardAction(`"Key:${key}" "card:${cardTypeName}"`));
      actions.push(constructFindCardAction(`is:new "Key:${key}" "card:${cardTypeName}"`));

      const multi = await this.invoke("multi", {"actions": actions});
      const cards = multi[0];

      if (cards.length > 1) {
        logger.warn("Duplicate key found.", isHtml=false, unique=true);
        return false;
      }
      if (cards.length == 0) {
        logger.error("Cannot find its own card?");
        return false;
      }

      const isNew = (multi[1].length > 0);
      isNewCardCache[key] = isNew;

      return isNew;
    }
  }


  return JPMNAnkiConnectActions;

})();

/// {% endset %}

