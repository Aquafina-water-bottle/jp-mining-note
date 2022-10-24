/// {% set globals %}

var sameReadingCardCache = nullish(sameReadingCardCache, {});

/// {% endset %}

/// {% set functions %}

/// {# {% include "jp-mining-note/partials/info_circle_svg.html" %} #}

const JPMNSameReadingIndicator = (() => {

  let enabled = false;

  const logger = new JPMNLogger("same-reading-indicator");
  const key = "{{ T('Key') }}";

  const indicatorNewClass = "dh-left__same-reading-indicator--new";
  const mainWordClass = "dh-left__same-reading-indicator-main-word";


  const indicatorDiv = document.getElementById("same_reading_indicator");
  const indicatorTooltipDiv = document.getElementById("same_reading_indicator_tooltip");

  const localPositionsEle = document.getElementById("hidden_pa_positions");
  const localAjtEle = document.getElementById("hidden_ajt_word_pitch");
  const localOverrideEle = document.getElementById("hidden_pa_override");
  const localReadingEle = document.getElementById("hidden_word_reading");

  class JPMNSameReadingIndicator {
    constructor() {
      const displayPitchAccent = {{ utils.opt("modules", "same-reading-indicator", "display-pitch-accent") }}
      const displayPitchAccentHover = {{ utils.opt("modules", "same-reading-indicator", "display-pitch-accent-hover-only") }}
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

    async displayIndicatorIfExists(nonNewCardIds, newCardIds) {
      if (nonNewCardIds.length === 0 && newCardIds.length === 0) {
        return;
      }
      logger.debug("Same reading found. Creating indicator...")

      const nonNewCardInfo = await this.ankiConnectHelper.cardsInfo(nonNewCardIds);
      const newCardInfo = await this.ankiConnectHelper.cardsInfo(newCardIds);
      const indicatorStr = this.buildString(nonNewCardInfo, newCardInfo);

      sameReadingCardCache[key] = indicatorStr;

      this.displayIndicator(indicatorStr);
    }

    async displayIndicator(indicatorStr) {

      const isNew = await this.ankiConnectHelper.cardIsNew();
      indicatorTooltipDiv.innerHTML = indicatorStr;
      if (isNew) {
        indicatorDiv.classList.add(indicatorNewClass);
      }
      indicatorDiv.style.display = "inline-block"; // doesn't matter because position is absolute

    }

    runAfterDelay(delay) {
      if (enabled) {
        logger.debug("Already enabled");
        return;
      }
      enabled = true;

      if (key in sameReadingCardCache) {
        logger.debug("Card was cached");
        const indicatorStr = sameReadingCardCache[key];
        this.displayIndicator(indicatorStr);
      } else if (delay === 0) {
        this.run();
      } else {
        setTimeout(() => {
          this.run();
        }, delay);
      }
    }

    async run() {
      let baseQuery = `-"Key:{{ T('Key') }}" "WordReadingHiragana:{{ T('WordReadingHiragana') }}"`;
      const nonNewQueryPartial = {{ utils.opt("modules", "same-reading-indicator", "non-new-query") }};
      const newQueryPartial = {{ utils.opt("modules", "same-reading-indicator", "new-query") }};

      const queryNonNew = `(${baseQuery}) ${nonNewQueryPartial}`;
      const queryNew = `(${baseQuery}) ${newQueryPartial}`;

      let cardIdsNonNew = await this.ankiConnectHelper.query(queryNonNew);
      let cardIdsNew = await this.ankiConnectHelper.query(queryNew);

      const maxNonNewOldest = {{ utils.opt("modules", "kanji-hover", "max-non-new-oldest") }};
      const maxNonNewLatest = {{ utils.opt("modules", "kanji-hover", "max-non-new-latest") }};
      const maxNewLatest = {{ utils.opt("modules", "kanji-hover", "max-new-latest") }};

      let [cardIdsNonNewFiltered, cardIdsNewFiltered] = this.ankiConnectHelper.filterCards(
          cardIdsNonNew, cardIdsNew,
          maxNonNewOldest, maxNonNewLatest, maxNewLatest
      );

      this.displayIndicatorIfExists(cardIdsNonNewFiltered, cardIdsNewFiltered);

    }
  }

  return JPMNSameReadingIndicator;

})();

/// {% endset %}



/// {% set run %}

// only continues if kanji-hover is actually enabled
if ({{ utils.opt("modules", "same-reading-indicator", "enabled") }}) {
  const sameReading = new JPMNSameReadingIndicator();
  sameReading.runAfterDelay(50);
}

/// {% endset %}

