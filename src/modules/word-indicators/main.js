/// {% set globals %}

//var sameReadingCardCache = nullish(sameReadingCardCache, {});
var similarWordsCardCache = nullish(similarWordsCardCache, {});

/// {% endset %}

/// {% set functions %}

/// {# {% include "jp-mining-note/partials/info_circle_svg.html" %} #}

const JPMNSameReadingIndicator = (() => {

  let enabled = false;

  const logger = new JPMNLogger("word-indicators");
  const key = "{{ T('Key') }}";

  const indicatorNewClass = "dh-left__similar-words-indicator--new";
  const mainWordClass = "dh-left__similar-words-indicators-main-word";
  const addPaddingClass = "dh-left--with-similar-word-indicators";

  const queryWordDiv = `.dh-left__similar-words-indicators .hover-tooltip__word-div`;

  const cardTypeName = 'Mining Card';
  const baseQuery = `-"Key:{{ T('Key') }}" "card:${cardTypeName}"`;
  const baseWordQuery = `"Word:{{ T('Word') }}" "WordReadingHiragana:{{ T('WordReadingHiragana') }}"`;
  const baseKanjiQuery = `"Word:{{ T('Word') }}" -"WordReadingHiragana:{{ T('WordReadingHiragana') }}"`;
  const baseReadingQuery = `-"Word:{{ T('Word') }}" "WordReadingHiragana:{{ T('WordReadingHiragana') }}"`;
  const nonNewQueryPartial = {{ utils.opt("modules", "word-indicators", "non-new-query") }};
  const newQueryPartial = {{ utils.opt("modules", "word-indicators", "new-query") }};

  //const indicatorDiv = document.getElementById("same_reading_indicator");
  //const indicatorTooltipDiv = document.getElementById("same_reading_indicator_tooltip");
  const dhLeftEle = document.getElementById("dh_left");

  const localPositionsEle = document.getElementById("hidden_pa_positions");
  const localAjtEle = document.getElementById("hidden_ajt_word_pitch");
  const localOverrideEle = document.getElementById("hidden_pa_override");
  const localOverrideTextEle = document.getElementById("hidden_pa_override_text");
  const localReadingEle = document.getElementById("hidden_word_reading");

  class IndicatorInfo {
    constructor(baseIndicatorQuery, indicatorDiv, indicatorTooltipDiv, label) {
      this.newQuery = `(${baseQuery} ${baseIndicatorQuery}) ${newQueryPartial}`;
      this.nonNewQuery = `(${baseQuery} ${baseIndicatorQuery}) ${nonNewQueryPartial}`;
      this.indicatorDiv = indicatorDiv;
      this.indicatorTooltipDiv = indicatorTooltipDiv;
      this.label = label;
    }
  }

  class IndicatorCache {
    constructor() {
      this.word = ""
      this.kanji = ""
      this.reading = ""
    }
  }

  const wordIndicatorInfo = new IndicatorInfo(
    baseWordQuery,
    document.getElementById("same_word_indicator"),
    document.getElementById("same_word_indicator_tooltip"),
    "word",
  )

  const kanjiIndicatorInfo = new IndicatorInfo(
    baseKanjiQuery,
    document.getElementById("same_kanji_indicator"),
    document.getElementById("same_kanji_indicator_tooltip"),
    "kanji",
  )

  const readingIndicatorInfo = new IndicatorInfo(
    baseReadingQuery,
    document.getElementById("same_reading_indicator"),
    document.getElementById("same_reading_indicator_tooltip"),
    "reading",
  )

  const indicatorsArray = [wordIndicatorInfo, kanjiIndicatorInfo, readingIndicatorInfo];

  class JPMNSameReadingIndicator {
    constructor() {
      const displayPitchAccent = {{ utils.opt("modules", "word-indicators", "display-pitch-accent") }}
      const displayPitchAccentHover = {{ utils.opt("modules", "word-indicators", "display-pitch-accent-hover-only") }}
      this.ankiConnectHelper = new JPMNAnkiConnectActions();
      this.tooltipBuilder = new JPMNTooltipBuilder(displayPitchAccent, displayPitchAccentHover);
    }

    buildString(nonNewCardInfo, newCardInfo) {

      let tooltipSpan = document.createElement('span');

      const currentCardDiv = document.createElement('div');

      const currentWordDiv = this.tooltipBuilder.buildWordDiv(
        localReadingEle.innerHTML,
        localPositionsEle,
        localAjtEle,
        localOverrideEle,
        localOverrideTextEle,
        null
      );
      currentCardDiv.appendChild(currentWordDiv);
      currentCardDiv.classList.add(mainWordClass);
      tooltipSpan.appendChild(currentCardDiv);

      for (const card of nonNewCardInfo) {
        const cardDiv = this.tooltipBuilder.buildCardDiv(card, null);
        cardDiv.classList.add("hover-tooltip--not-first");

        tooltipSpan.appendChild(cardDiv);
      }

      for (const card of newCardInfo) {
        const cardDiv = this.tooltipBuilder.buildCardDiv(card, null, true);
        cardDiv.classList.add("hover-tooltip--not-first");

        tooltipSpan.appendChild(cardDiv);
      }

      return tooltipSpan.innerHTML;

    }

    addBrowseOnClick() {
      if ({{ utils.opt("modules", "word-indicators", "click-word-to-browse") }}) {
        this.tooltipBuilder.addBrowseOnClick(queryWordDiv);
      }
    }

    async displayIndicatorIfExists(nonNewCardIds, newCardIds, indicatorInfo) {
      if (nonNewCardIds.length === 0 && newCardIds.length === 0) {
        return;
      }
      logger.debug(`Same ${indicatorInfo.label} found. Creating indicator...`)

      const nonNewCardInfo = await this.ankiConnectHelper.cardsInfo(nonNewCardIds);
      const newCardInfo = await this.ankiConnectHelper.cardsInfo(newCardIds);
      const indicatorStr = this.buildString(nonNewCardInfo, newCardInfo);

      //sameReadingCardCache[key] = indicatorStr;
      similarWordsCardCache[key][indicatorInfo.label] = indicatorStr;

      return this.displayIndicator(indicatorStr, indicatorInfo);
    }

    async displayIndicator(indicatorStr, indicatorInfo) {

      const isNew = await this.ankiConnectHelper.cardIsNew();
      indicatorInfo.indicatorTooltipDiv.innerHTML = indicatorStr;
      if (isNew) {
        indicatorInfo.indicatorDiv.classList.add(indicatorNewClass);
      }
      indicatorInfo.indicatorDiv.style.display = "inline-block"; // doesn't matter because position is absolute

      dhLeftEle.classList.toggle("dh-left--with-similar-word-indicators", true);
    }

    runAfterDelay(delay) {
      if (enabled) {
        logger.debug("Already enabled");
        return;
      }
      enabled = true;

      if (key in similarWordsCardCache) {
        logger.debug("Card was cached");
        const indicatorCache = similarWordsCardCache[key];

        let promises = []

        for (let i = 0; i < indicatorsArray.length; i++) {
          const indicatorInfo = indicatorsArray[i];
          const indicatorStr = indicatorCache[indicatorInfo.label];
          if (indicatorStr.length !== 0) {
            promises.push(this.displayIndicator(indicatorStr, indicatorInfo));
            //this.displayIndicator(indicatorStr, indicatorInfo);
          }
        }

        Promise.all(promises).then((values) => {
          this.addBrowseOnClick();
        });

      } else if (delay === 0) {
        this.run();
      } else {
        setTimeout(() => {
          this.run();
        }, delay);
      }

      //if (delay === 0) {
      //  this.run();
      //} else {
      //  setTimeout(() => {
      //    this.run();
      //  }, delay);
      //}

    }


    async runOnIndicator(indicatorInfo) {

      let cardIdsNonNew = await this.ankiConnectHelper.query(indicatorInfo.nonNewQuery);
      let cardIdsNew = await this.ankiConnectHelper.query(indicatorInfo.newQuery);
      cardIdsNonNew.sort();
      cardIdsNew.sort();

      const maxNonNewOldest = {{ utils.opt("modules", "word-indicators", "max-non-new-oldest") }};
      const maxNonNewLatest = {{ utils.opt("modules", "word-indicators", "max-non-new-latest") }};
      const maxNewLatest = {{ utils.opt("modules", "word-indicators", "max-new-latest") }};

      let [cardIdsNonNewFiltered, cardIdsNewFiltered] = this.ankiConnectHelper.filterCards(
          cardIdsNonNew, cardIdsNew,
          maxNonNewOldest, maxNonNewLatest, maxNewLatest
      );

      if (!(key in similarWordsCardCache)) {
        similarWordsCardCache[key] = new IndicatorCache();
      }
      return this.displayIndicatorIfExists(cardIdsNonNewFiltered, cardIdsNewFiltered, indicatorInfo);
    }

    async run() {
      let promises = []
      for (const indicatorInfo of indicatorsArray) {
        promises.push(this.runOnIndicator(indicatorInfo));
      }

      Promise.all(promises).then((values) => {
        this.addBrowseOnClick();
      });
    }
  }

  return JPMNSameReadingIndicator;

})();

/// {% endset %}



/// {% set run %}

// only continues if kanji-hover is actually enabled
if ({{ utils.opt("modules", "word-indicators", "enabled") }}
    && {{ utils.opt("enable-ankiconnect-features") }}) {
  const sameReading = new JPMNSameReadingIndicator();
  const delay = {{ utils.opt("modules", "word-indicators", "load-delay") }};
  sameReading.runAfterDelay(delay);
}

/// {% endset %}

