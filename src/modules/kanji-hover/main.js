
/// {% set functions %}

// =============
//  Kanji Hover
// =============


// Cache used:
// kanjiHoverCardCache: card -> generated WordReading with kanji hover elements
// kanjiHoverCache: kanji -> [word readings used, hover element for that kanji]

const JPMNKanjiHover = (() => {

  const logger = new JPMNLogger("kanji-hover");

  // element outside async function to prevent double-adding due to anki funkyness
  let wordReading = document.getElementById("dh_reading");
  let kanjiHoverEnabled = false;

  // realistically, key should be good enough since we assume that key has no duplicates
  // however, just in case, wordreading is added
  // note that even if the key is a duplicate, if the wordreading is literally the same,
  // then it should get the exact same result regardless, so this key is still valid
  const keyHTML = document.getElementById("hidden_key").innerHTML;
  const wordReadingHTML = document.getElementById("hidden_word_reading").innerHTML;
  const cacheKey = `${keyHTML}.${wordReadingHTML}`

  class JPMNKanjiHover {
    constructor() {
      const displayPitchAccent = {{ utils.opt("modules", "kanji-hover", "display-pitch-accent") }}
      const displayPitchAccentHover = {{ utils.opt("modules", "kanji-hover", "display-pitch-accent-hover-only") }}
      this.tooltipBuilder = new JPMNTooltipBuilder(displayPitchAccent, displayPitchAccentHover);
      this.ankiConnectHelper = new JPMNAnkiConnectActions();
    }


    getWordReadings(nonNewCardInfo, newCardInfo) {
      let wordsArr = []

      for (const card of nonNewCardInfo) {
        wordsArr.push(card["fields"]["WordReading"]["value"])
      }
      for (const card of newCardInfo) {
        wordsArr.push(card["fields"]["WordReading"]["value"])
      }

      return wordsArr;
    }

    addBrowseOnClick() {
      if ({{ utils.opt("modules", "kanji-hover", "click-word-to-browse") }}) {
        this.tooltipBuilder.addBrowseOnClick(`.dh-left__reading .hover-tooltip__word-div`);
      }
    }


    buildString(character, nonNewCardInfo, newCardInfo) {

      /*
       * <span class="hover-wrapper">
       *   <span class="hover-text"> (kanji) </span>
       *   <span class="hover-tooltip-wrapper">
       *     <span class="hover-tooltip"> ... </span>
       *   </span>
       * </span>
       *
       */

      // wrapper element that isn't used, to get the inner html

      const kanjiHoverWrapper = document.createElement('span');
      kanjiHoverWrapper.classList.add("hover-wrapper");

      const kanjiSpan = document.createElement('span');
      kanjiSpan.classList.add("hover-text");
      kanjiSpan.innerText = character;

      const tooltipWrapperSpan = document.createElement('span');
      tooltipWrapperSpan.classList.add("hover-tooltip-wrapper");

      const tooltipSpan = document.createElement('span');
      tooltipSpan.classList.add("hover-tooltip");
      tooltipSpan.classList.add("hover-tooltip--kanji-hover");

      let count = 0;


      for (const card of nonNewCardInfo) {
        const cardDiv = this.tooltipBuilder.buildCardDiv(card, character);
        if (count >= 1) {
          cardDiv.classList.add("hover-tooltip--not-first");
        }
        count++;

        tooltipSpan.appendChild(cardDiv);
      }

      for (const card of newCardInfo) {
        const cardDiv = this.tooltipBuilder.buildCardDiv(card, character, /*isNew=*/true);
        if (count >= 1) {
          cardDiv.classList.add("hover-tooltip--not-first");
        }
        count++;

        tooltipSpan.appendChild(cardDiv);
      }


      // 0 length checks
      if (nonNewCardInfo.length + newCardInfo.length == 0) {
        tooltipSpan.innerText = "{{ TRANSLATOR.get('kanji-not-found') }}";
      }

      tooltipWrapperSpan.appendChild(tooltipSpan)
      kanjiHoverWrapper.appendChild(kanjiSpan);
      kanjiHoverWrapper.appendChild(tooltipWrapperSpan);

      return kanjiHoverWrapper;
    }


    // multi query result, in the format of
    // [kanji 1 (non-new), kanji 1 (new), kanji 2 (non-new), kanji 2 (new), etc.]
    async cardQueries(kanjiArr) {
      const noteName = '{{ NOTE_DATA("model-name").item() }}';
      const cardTypeName = 'Mining Card';

      function constructFindCardAction(query) {
        return {
          "action": "findCards",
          "params": {
            "query": query,
          }
        }
      }

      // constructs the multi findCards request for ankiconnect
      let actions = [];
      for (const character of kanjiArr) {

        const keyEsc = this.ankiConnectHelper.escapeStr(keyHTML);
        const wordReadingEsc = this.ankiConnectHelper.escapeStr(wordReadingHTML);

        let baseQuery = `(-"Key:${keyEsc}" Word:*${character}* "card:${cardTypeName}" "note:${noteName}" -"WordReading:${wordReadingEsc}") `;

        logger.debug(`query: ${baseQuery}`, 1);

        const nonNewQuery = baseQuery + {{ utils.opt("modules", "kanji-hover", "non-new-query") }};
        const newQuery = baseQuery + {{ utils.opt("modules", "kanji-hover", "new-query") }};
        logger.debug(`nonNewQuery: ${nonNewQuery}`, 1);
        logger.debug(`newquery: ${newQuery}`, 1);

        actions.push(constructFindCardAction(nonNewQuery))
        actions.push(constructFindCardAction(newQuery))
      }

      return await this.ankiConnectHelper.invoke("multi", {"actions": actions})
    }



    async getCardsInfo(queryResults) {
      function constructCardsInfoAction(idList) {
        return {
          "action": "cardsInfo",
          "params": {
            "cards": idList,
          }
        }
      }

      let actions = [];
      logger.assert(queryResults.length % 2 == 0, "query results not even");

      for (let i = 0; i < queryResults.length/2; i++) {
        // ids are equivalent to creation dates, so sorting ids is equivalent to
        // sorting to card creation date
        const nonNewCardIds = queryResults[i*2].sort();
        const newCardIds = queryResults[i*2 + 1].sort();

        const maxNonNewOldest = {{ utils.opt("modules", "kanji-hover", "max-non-new-oldest") }};
        const maxNonNewLatest = {{ utils.opt("modules", "kanji-hover", "max-non-new-latest") }};
        const maxNewLatest = {{ utils.opt("modules", "kanji-hover", "max-new-latest") }};

        const [nonNewResultIds, newResultIds] = this.ankiConnectHelper.filterCards(
          nonNewCardIds, newCardIds,
          maxNonNewOldest, maxNonNewLatest, maxNewLatest
        );

        // creates a multi request of the following format:
        // [cardInfo (nonNewCardIds, kanji 1), cardInfo (newCardIds, kanji 1), etc.]
        actions.push(constructCardsInfoAction(nonNewResultIds));
        actions.push(constructCardsInfoAction(newResultIds));
      }

      return await this.ankiConnectHelper.invoke("multi", {"actions": actions});
    }

    async run() {
      {% if "time-performance" in modules.keys() %}
      let tpID = "async kanji-hover";
      TIME_PERFORMANCE.start(tpID);
      {% endif %}

      const readingHTML = wordReading.innerHTML;

      // uses cache if it already exists
      let kanjiSet = new Set() // set of kanjis that requires api calls
      // regex shamelessly stolen from cade's kanji hover:
      // https://github.com/cademcniven/Kanji-Hover/blob/main/_kanjiHover.js
      const regex = /([\u4E00-\u9FAF])(?![^<]*>|[^<>]*<\/g)/g;
      const matches = readingHTML.matchAll(regex);
      for (const match of matches) {
        kanjiSet.add(...match);
      }

      let kanjiDict = {};
      let wordReadings = {}; // used only for the cache

      // attempts to fill out the kanji dict with cached entries
      for (let kanji of [...kanjiSet]) {
        // also checks that the current word is not used
        if (CACHE.has("kanjiHoverCache", kanji)) {
          let [wordReadings, hoverEle] = CACHE.get("kanjiHoverCache", kanji);
          logger.debug(`${kanji} wordReadings: ${wordReadings}`, 1);

          if (!wordReadings.includes(wordReadingHTML)) {
            logger.debug(`Using cached kanji ${kanji}`)
            kanjiDict[kanji] = hoverEle;
            kanjiSet.delete(kanji);
          }
        }
      }

      // only calls the api on the needed kanjis
      const kanjiArr = [...kanjiSet];
      const queryResults = await this.cardQueries(kanjiArr);
      const cardsInfo = await this.getCardsInfo(queryResults);

      logger.debug(`New kanjis: [${kanjiArr.join(", ")}]`)

      for (const [i, character] of kanjiArr.entries()) {
        let nonNewCardInfo = cardsInfo[i*2];
        let newCardInfo = cardsInfo[i*2 + 1];

        // attempts to insert string
        kanjiDict[character] = this.buildString(character, nonNewCardInfo, newCardInfo);
        wordReadings[character] = this.getWordReadings(nonNewCardInfo, newCardInfo);
      }

      if (Object.keys(kanjiDict).length > 0) { // an empty kanjiDict seems to replace every empty space
        const re = new RegExp(Object.keys(kanjiDict).join("|"), "gi");
        const resultHTML = readingHTML.replace(re, function (matched) {
          return `<span data-kanji-hover="${matched}">${matched}</span>`
        });

        wordReading.innerHTML = resultHTML;
      }

      for (let kanji of Object.keys(kanjiDict)) {
        for (let ele of document.querySelectorAll(`.dh-left__reading [data-kanji-hover="${kanji}"]`)) {
          ele.innerText = "";
          // cloneNode(true) in case of duplicate kanjis
          ele.appendChild(kanjiDict[kanji].cloneNode(true));
        }
      }

      // caches card
      let cloneElement = wordReading.cloneNode(true)
      cloneElement.removeAttribute("id");
      CACHE.set("kanjiHoverCardCache", cacheKey, cloneElement);

      for (const character of kanjiArr) {
        CACHE.set("kanjiHoverCache", character, [wordReadings[character], kanjiDict[character]]);
      }

      this.addBrowseOnClick();

      {% if "time-performance" in modules.keys() %}
      TIME_PERFORMANCE.stop(tpID, true);
      TIME_PERFORMANCE.reset(tpID);
      {% endif %}
    }

    runMode() {
      const mode = {{ utils.opt("modules", "kanji-hover", "mode") }};
      if (mode === 0) {
        this.run();
      } else { // === 1
        wordReading.onmouseover = (() => {
          // replaces the function with a null function to avoid calling this function
          wordReading.onmouseover = function() {}
          this.run();
        });
      }
    }


    runAfterDelay() {

      if (kanjiHoverEnabled) {
        logger.debug("Kanji hover is already enabled");
        return;
      }
      kanjiHoverEnabled = true;

      if (CACHE.has("kanjiHoverCardCache", cacheKey)) {
        logger.debug("Card was cached")
        let cachedEle = CACHE.get("kanjiHoverCardCache", cacheKey);
        cachedEle.setAttribute("id", "dh_reading");
        wordReading.parentNode.replaceChild(cachedEle, wordReading);
        this.addBrowseOnClick();
        return;
      }

      let delay = {{ utils.opt("modules", "kanji-hover", "load-delay") }};
      if (delay === 0) {
        this.runMode();
      } else {
        setTimeout(() => {
          this.runMode();
        }, delay);
      }

    }

  }

  return JPMNKanjiHover;

})();

/// {% endset %}






/// {% set run %}

// only continues if kanji-hover is actually enabled
if ({{ utils.opt("modules", "kanji-hover", "enabled") }}
    && {{ utils.opt("enable-ankiconnect-features") }}) {

  const kanjiHover = new JPMNKanjiHover();
  kanjiHover.runAfterDelay();

}

/// {% endset %}
