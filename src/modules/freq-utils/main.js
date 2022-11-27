
/// {% set functions %}

// =========
//  freq-utils
// =========

const JPMNFreqUtils = (() => {

  const logger = new JPMNLogger("freq-utils");

  const keyHTML = document.getElementById("hidden_key").innerHTML;
  const wordReadingHTML = document.getElementById("hidden_word_reading").innerHTML;
  const freqDisplay = document.getElementById("frequencies_display");
  const freqOverflow = document.getElementById("frequencies_overflow");
  const freqOverflowText = document.getElementById("frequencies_overflow_tooltip");
  const freqEle = document.getElementById("frequencies");

  //const cacheKey = `${keyHTML}.${wordReadingHTML}`
  const maxFreqCount = {{ utils.opt("modules", "freq-utils", "max") }};

  class JPMNFreqUtils {
    constructor() { }

    collapseFrequencies() {
      for (let i = freqDisplay.children.length-1; i > maxFreqCount-1; i--) {
        let child = freqDisplay.children[i];
        freqOverflowText.prepend(child);
        //freqOverflowText.appendChild(child);
      }

      freqOverflow.classList.toggle("hidden", false)

      //CACHE.set("frequenciesCache", cacheKey, freqEle.innerHTML)
    }

    run() {

      // it seems like using .innerHTML has worse performance than
      // just re-calculating everything again
      //if (CACHE.has("frequenciesCache", cacheKey)) {
      //  logger.debug("Using cached frequencies...");
      //  freqEle.innerHTML = CACHE.get("frequenciesCache", cacheKey);
      //  return;
      //}

      // subtract 1 because the overflow indicator is already in the group
      if (freqDisplay.children.length > maxFreqCount) {
        logger.debug("Collapsing frequencies...");
        this.collapseFrequencies();
      }

    }
  }


  return JPMNFreqUtils;

})();

/// {% endset %}






/// {% set run %}

if ({{ utils.opt("modules", "freq-utils", "enabled") }}) {
  const freqUtils = new JPMNFreqUtils();
  freqUtils.run();
}

/// {% endset %}

