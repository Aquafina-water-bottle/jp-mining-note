/// {% set globals %}

var sameReadingCardCache = nullish(sameReadingCardCache, {});

/// {% endset %}

/// {% set functions %}

/// {# {% include "jp-mining-note/partials/info_circle_svg.html" %} #}

const JPMNSameReadingIndicator = (() => {

  let enabled = false;

  const logger = new JPMNLogger("same-reading-indicator");
  const key = "{{ T('Key') }}";

  class JPMNSameReadingIndicator {
    constructor() {
      this.ankiConnectHelper = new JPMNAnkiConnectActions();
      this.tooltipBuilder = new JPMNTooltipBuilder();
    }

    buildString(nonNewCardInfo, newCardInfo) {

      let count = 0;
      let tooltipSpan = document.createElement('span');

      for (const card of nonNewCardInfo) {
        const cardDiv = this.tooltipBuilder.buildCardDiv(card, null);
        if (count >= 1) {
          cardDiv.classList.add("kanji-hover-tooltip--not-first");
        }
        count++;

        tooltipSpan.appendChild(cardDiv);
      }

      for (const card of newCardInfo) {
        const cardDiv = this.tooltipBuilder.buildCardDiv(card, null, true);
        if (count >= 1) {
          cardDiv.classList.add("kanji-hover-tooltip--not-first");
        }
        count++;

        tooltipSpan.appendChild(cardDiv);
      }

      return tooltipSpan.innerHTML;

    }

    async displayIndicatorIfExists(nonNewCardIds, newCardIds) {
      if (nonNewCardIds.length === 0 && newCardIds.length === 0) {
        return;
      }
      logger.debug("Same reading exists!")

      const nonNewCardInfo = await this.ankiConnectHelper.cardsInfo(nonNewCardIds);
      const newCardInfo = await this.ankiConnectHelper.cardsInfo(newCardIds);
      const indicatorStr = this.buildString(nonNewCardInfo, newCardInfo);

      const indicatorDiv = document.getElementById("same_reading_indicator");
      const indicatorTooltipDiv = document.getElementById("same_reading_indicator_tooltip");
      indicatorTooltipDiv.innerHTML = indicatorStr;
      indicatorDiv.style.display = "inline-block"; // doesn't matter because position is absolute
    }

    runAfterDelay(delay) {
      if (enabled) {
        logger.debug("Already enabled");
        return;
      }
      enabled = true;

      if (key in sameReadingCardCache) {
        const [nonNewCardInfo, newCardInfo] = sameReadingCardCache[key];
        displayIndicator(nonNewCardInfo, newCardInfo);
      } else if (delay === 0) {
        this.run();
      } else {
        setTimeout(() => {
          this.run();
        }, delay);
      }
    }

    async run() {
      const queryNonNew = `-is:new -"Key:${key}" WordReadingHiragana:{{ T('WordReadingHiragana') }}`;
      const queryNew = `is:new -"Key:${key}" WordReadingHiragana:{{ T('WordReadingHiragana') }}`;
      let cardIdsNonNew = await this.ankiConnectHelper.query(queryNonNew)
      let cardIdsNew = await this.ankiConnectHelper.query(queryNew)

      const maxNonNewOldest = 2;
      const maxNonNewLatest = 2;
      const maxNewLatest = 2;

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
  sameReading.runAfterDelay(100);
}

/// {% endset %}

