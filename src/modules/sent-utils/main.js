/// {% set functions %}

// ================
//  Sentence Utils
// ================
//
// processes the sentence
// - removes newlines
// - replaces bold with [...] if cloze deletion
// - handles adding or replacing quotes if specified

const JPMNSentUtils = (() => {
  const logger = new JPMNLogger("sent-utils");



  class JPMNSentUtils {
    constructor(isAltDisplay, isClozeDeletion, paIndicator) {
      // TODO change isAltDisplay and isCloseDeletion to be set as an attribute
      // somewhere in the HTML rather than javascript

      this.isAltDisplay = isAltDisplay;
      this.isClozeDeletion = nullish(isClozeDeletion, false);
      this.paIndicator = nullish(paIndicator, null);

      this.autoHighlight = (
        typeof JPMNAutoHighlightWord !== "undefined"
        ? new JPMNAutoHighlightWord()
        : null
      );
      this.autoReplaces = []
      this.attemptedHighlight = false;

    }

    logOnBold(result, word, replace=null) {
      if (replace === null) {
        replace = word;
      }

      if (result.match(/<(b)>/)) {  // was able to bold something
        const msg = `Automatically highlighted word: ${replace}.`
        if ({{ utils.opt("modules", "sent-utils", "auto-highlight-word", "warn-on-auto-highlight") }}) {
          logger.warn(msg);
        } else {
          logger.debug(msg);
        }
      } else {
        if ({{ utils.opt("modules", "sent-utils", "auto-highlight-word", "warn-if-auto-highlight-fails") }}) {
          logger.warn(`Could not highlight word: ${word}.`);
        } else {
          logger.debug(`Could not highlight word: ${word}.`);
        }
      }
    }

    highlightWord(sentence) {
      let word = document.getElementById("hidden_word").innerHTML;
      let wordReadingKana = document.getElementById("hidden_word_reading_kana").innerHTML;
      let wordReadingHiragana = document.getElementById("hidden_word_reading_hiragana").innerHTML;

      let [result, replace] = this.autoHighlight.highlightWord(
        sentence, word, wordReadingKana, wordReadingHiragana
      );
      if (replace.length) {
        this.autoReplaces.push(replace);
      }

      this.logOnBold(result, word, replace);

      return result;
    }

    processSentence(sentEle, isAltDisplay, isClozeDeletion, paIndicator) {
      if (typeof isAltDisplay === 'undefined') {
        LOGGER.warn("isAltDisplay is undefined");
        isAltDisplay = false;
      }

      // ASSUMPTION: all sentence elements are formatted as [quote, sentence, quote]
      let result = sentEle.children[1].innerHTML;

      // removes leading and trailing white space (equiv. of strip() in python)
      result = result.trim();

      // cloze deletion replacing bold with [...]
      if (typeof isClozeDeletion !== "undefined" && isClozeDeletion) {
        result = result.replace(/<b>.*?<\/b>/g, "<b>[...]</b>");
      }

      // removes newlines{#
      //if ((!isAltDisplay && {{ utils.opt("modules", "sent-utils", "remove-line-breaks") }})
      //    || isAltDisplay && {{ utils.opt("modules", "sent-utils", "remove-line-breaks-on-altdisplay") }}) {
      //  //let noNewlines = result.replace(/<br>/g, "");
      //  //result = noNewlines;
      //  sentEle.classList.add("disable-newlines")
      //}
      //#}

      // removes the final period if exists
      if (({{ utils.opt("modules", "sent-utils", "remove-final-period") }} && !isAltDisplay)
        || ({{ utils.opt("modules", "sent-utils", "remove-final-period-on-altdisplay") }} && isAltDisplay)) {
        result = result.replace(/[｡。．\.]$/, "");
      }

      // automatically highlights the word if no bold was found
      if (
        ({{ utils.opt("modules", "sent-utils", "auto-highlight-word", "enabled") }})
        && !result.match(/<(b)>/)
        && this.autoHighlight !== null)
      {
        logger.debug("Attempting to highlight word...");
        result = this.highlightWord(result);
        this.attemptedHighlight = true;
      }

      let validQuotes = {{ utils.opt("modules", "sent-utils", "quote-match-strings") }};
      let existingQuote = false;

      let openQuoteEle = sentEle.children[0];
      let closeQuoteEle = sentEle.children[2];

      for (let quotePair of validQuotes) {
        if ((result[0] === quotePair[0]) && (result[result.length-1] === quotePair[1])) {

          // adds quote to surrounding divs
          let openQuote = null;
          let closeQuote = null;
          [openQuote, closeQuote] = quotePair;
          openQuoteEle.innerText = openQuote;
          closeQuoteEle.innerText = closeQuote;

          result = result.slice(1, -1);
          existingQuote = true;
          break;
        }
      }

      let autoQuote = (
        (!isAltDisplay && {{ utils.opt("modules", "sent-utils", "auto-quote-sentence") }})
        || (isAltDisplay && {{ utils.opt("modules", "sent-utils", "auto-quote-alt-display-sentence") }})
      );
      if (!existingQuote && autoQuote) {
        /// {% if note.card_type == "pa_sent" %}
        openQuoteEle.innerText = {{ utils.opt("modules", "sent-utils", "pa-sent-auto-quote-open") }};
        closeQuoteEle.innerText = {{ utils.opt("modules", "sent-utils", "pa-sent-auto-quote-close") }};
        /// {% else %}
        openQuoteEle.innerText = {{ utils.opt("modules", "sent-utils", "auto-quote-open") }};
        closeQuoteEle.innerText = {{ utils.opt("modules", "sent-utils", "auto-quote-close") }};
        /// {% endif %}
      }

      // no quotes are added
      if (!existingQuote && !autoQuote) {
        // note that it defaults to having quotes + auto align without this module being ran
        // hence why all these steps have to be done
        openQuoteEle.innerText = "";
        closeQuoteEle.innerText = "";

        sentEle.style["text-indent"] = "0em";
        sentEle.style["padding-left"] = "0em";
      }

      // removes the hover effect for mobile displays only
      ///
      /// {% call IF("IsClickCard") %}
      if (isMobile()) {
        document.getElementById("display").classList.toggle(
          "expression__hybrid--click-hover-effect", false);
      }
      /// {% endcall %}

      // data-color-quotes: INDICATOR if the sentence quotes are colored or not
      // - attribute doesn't exist by default
      // - if exists, then the quotes are colored
      // - added in the sections below:

      /// {% if note.card_type == "pa_sent" %}
      if ((existingQuote || autoQuote) && {{ utils.opt("modules", "sent-utils", "pa-sent-pa-indicator-color-quotes") }}) {
        openQuoteEle.classList.add("pa-indicator-color--sentence");
        closeQuoteEle.classList.add("pa-indicator-color--sentence");

        sentEle.setAttribute("data-color-quotes", "true");
      }
      /// {% endif %}

      /// {% if note.card_type == "main" %}
      /// {% call IF("PAShowInfo") %}


      if ((existingQuote || autoQuote) && {{ utils.opt("modules", "sent-utils", "pa-indicator-color-quotes") }}) {
        // data-color-quotes tag within html is sentence-div dependent (preferable over a global state)
        sentEle.setAttribute("data-color-quotes", "true");

        if (paIndicator !== null) {
          openQuoteEle.classList.add(paIndicator.className);
          closeQuoteEle.classList.add(paIndicator.className);
        }

        /// {% call IF("IsHoverCard") %}
        let elems = document.getElementsByClassName("expression__hybrid-wrapper");
        if (elems.length > 0) {
          elems[0].classList.add("expression__hybrid-wrapper--hover-remove-flag");
        }
        /// {% endcall %}

        // neither hover & click and is either one of TSC / sentence -> removes flag
        let svgEle = document.getElementById("flag_box_svg");

        /// {% call utils.if_none_js("IsHoverCard", "IsClickCard") %}
        /// {% call utils.if_any_js("IsTargetedSentenceCard", "IsSentenceCard") %}
        svgEle.style.display = "none";
        /// {% endcall %}
        /// {% endcall %}

        // ASSUMPTION: IsClickCard + back side of the main card -> reveals sentence
        // i.e. hybridClick() is automatically called
        // ASSUMPTION: hybridClick() is called BEFORE this section
        /// {% if note.side == "back" %}
        /// {% call IF("IsClickCard") %}
        svgEle.style.display = "none";
        /// {% endcall %}
        /// {% endif %}
      }
      /// {% endcall %}
      /// {% endif %}

      sentEle.children[1].innerHTML = result;

    }

    processFullSentence() {
      let fullSentEle = document.getElementById("full_sentence");
      if (fullSentEle === null) { // front side
        return;
      }

      let fullSent = fullSentEle.innerHTML;

      if (!fullSent.match(/<(b)>/)) {

        if (
          !this.attemptedHighlight
          && ({{ utils.opt("modules", "sent-utils", "auto-highlight-word", "enabled") }})
          && this.autoHighlight !== null)
        {
          // generates the highlighted word result
          logger.debug("Attempting to highlight word...");
          let sentHTML = document.getElementById("hidden_sentence").innerHTML;
          this.highlightWord(sentHTML);
          this.attemptedHighlight = true;
        }

        if (this.autoReplaces.length > 0) {  // attempt to bold

          const result = this.autoHighlight.highlightWordRuby(fullSent, Array.from(this.autoReplaces));

          let word = document.getElementById("hidden_word").innerHTML;
          this.logOnBold(result, word);

          fullSentEle.innerHTML = result;

        }

      }

    }


    run() {
      let sentences = document.querySelectorAll(".expression--sentence")

      if (sentences !== null) {
        for (let sent of sentences) {
          this.processSentence(sent, this.isAltDisplay, this.isClozeDeletion, this.paIndicator);
        }
      }

      this.processFullSentence();
    }
  }


  return JPMNSentUtils;

})();


/// {% endset %}


/// {% set run_main %}
if ({{ utils.opt("modules", "sent-utils", "enabled") }}) {

  let isAltDisplay = !!'{{ utils.any_of_str("AltDisplay") }}';
  let sent_utils = new JPMNSentUtils(isAltDisplay, false, paIndicator);
  sent_utils.run();

}
/// {% endset %}


/// {% set run_pa_sent %}
if ({{ utils.opt("modules", "sent-utils", "enabled") }}) {
  let isAltDisplay = false;
  /* {% call IF('AltDisplayPASentenceCard') %} */
    isAltDisplay = true;
  /* {% endcall %} */

  /* {% call IFNOT('AltDisplayPASentenceCard') %} */
    /* {% call IF('AltDisplay') %} */
    isAltDisplay = (
      /* {% call utils.if_none('IsClickCard', 'IsHoverCard', 'IsSentenceCard', 'IsTargetedSentenceCard') %} */
        false &&
      /* {% endcall %} */
      true ? true : false
    );
    /* {% endcall %} */

    /* {% call IFNOT('AltDisplay') %} */
      isAltDisplay = false;
    /* {% endcall %} */
  /* {% endcall %} */

  let sent_utils = new JPMNSentUtils(isAltDisplay);
  sent_utils.run();

}
/// {% endset %}




/// {% set run_cloze_deletion %}
if ({{ utils.opt("modules", "sent-utils", "enabled") }}) {
  let isAltDisplay = false;
  /* {% call IF('AltDisplay') %} */
    isAltDisplay = false;
  /* {% endcall %} */

  let sent_utils = new JPMNSentUtils(isAltDisplay, true);
  sent_utils.run();

}
/// {% endset %}



