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
    constructor(paIndicator) {
      // TODO change isAltDisplay and isCloseDeletion to be set as an attribute
      // somewhere in the HTML rather than javascript

      this.paIndicator = nullish(paIndicator, null);

      this.autoHighlight = (
        typeof JPMNAutoHighlightWord !== "undefined"
        ? new JPMNAutoHighlightWord()
        : null
      );
      this.autoReplaces = []
      this.attemptedHighlight = false;

    }

    logOnBold(result, word, location, replace=null) {
      if (replace === null) {
        replace = word;
      }

      if (result.match(/<(b)>/)) {  // was able to bold something
        const msg = `Automatically highlighted word in ${location}: ${replace}.`
        if ({{ utils.opt("modules", "sent-utils", "auto-highlight-word", "warn-on-auto-highlight") }}) {
          logger.warn(msg);
        } else {
          logger.debug(msg);
        }
      } else {
        const msg = `Could not highlight word in ${location}: ${word}.`
        if ({{ utils.opt("modules", "sent-utils", "auto-highlight-word", "warn-if-auto-highlight-fails") }}) {
          logger.warn(msg);
        } else {
          logger.debug(msg);
        }
      }
    }

    highlightWord(sentence, location) {
      if (
        ({{ utils.opt("modules", "sent-utils", "auto-highlight-word", "enabled") }})
        && !sentence.match(/<(b)>/)
        && this.autoHighlight !== null)
      {

        logger.debug(`Attempting to highlight word in ${location}...`);
        this.attemptedHighlight = true;

        let word = document.getElementById("hidden_word").innerHTML;
        let wordReadingKana = document.getElementById("hidden_word_reading_kana").innerHTML;
        let wordReadingHiragana = document.getElementById("hidden_word_reading_hiragana").innerHTML;

        let [result, replace] = this.autoHighlight.highlightWord(
          sentence, word, wordReadingKana, wordReadingHiragana
        );
        if (replace.length) {
          this.autoReplaces.push(replace);
        }

        this.logOnBold(result, word, location, replace);

        return result;
      } else {
        logger.debug(`Not attempting to highlight word in ${location}.`);
        return sentence;
      }
    }

    /*
     * returns the quotes if found, otherwise returns an empty array
     */
    getQuotes(sentence) {
      let validQuotes = {{ utils.opt("modules", "sent-utils", "quote-match-strings") }};

      for (let quotePair of validQuotes) {
        if ((sentence[0] === quotePair[0]) && (sentence[sentence.length-1] === quotePair[1])) {
          return Array.from(quotePair);
        }
      }

      return [];
    }

    processSentence(sentEle, paIndicator) {

      // ASSUMPTION: all sentence elements are formatted as [quote, sentence, quote]
      let result = sentEle.children[1].children[0].innerHTML;
      let isAltDisplay = sentEle.children[1].children[0].classList.contains("expression-inner--altdisplay");
      let isClozeDeletion = sentEle.children[1].children[0].classList.contains("expression-inner--cloze-deletion");

      // removes leading and trailing white space (equiv. of strip() in python)
      result = result.trim();

      // cloze deletion replacing bold with [...]
      if (typeof isClozeDeletion !== "undefined" && isClozeDeletion) {
        result = result.replace(/<b>.*?<\/b>/g, "<b>[...]</b>");
      }

      // removes the final period if exists
      if (({{ utils.opt("modules", "sent-utils", "remove-final-period") }} && !isAltDisplay)
        || ({{ utils.opt("modules", "sent-utils", "remove-final-period-on-altdisplay") }} && isAltDisplay)) {
        result = result.replace(/[｡。．\.]$/, "");
      }

      // automatically highlights the word if no bold was found
      result = this.highlightWord(result, "display-sentence");

      let validQuotes = {{ utils.opt("modules", "sent-utils", "quote-match-strings") }};
      let existingQuote = false;

      let openQuoteEle = sentEle.children[0];
      let closeQuoteEle = sentEle.children[2];

      let quotePair = this.getQuotes(result);
      if (quotePair.length) {

        let [openQuote, closeQuote] = quotePair;
        openQuoteEle.innerText = openQuote;
        closeQuoteEle.innerText = closeQuote;

        result = result.slice(1, -1);
        existingQuote = true;
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
        if ({{ utils.opt("click-card-sentence-reveal-on-back-side") }}) {
          svgEle.style.display = "none";
        }
        /// {% endcall %}
        /// {% endif %}
      }
      /// {% endcall %}
      /// {% endif %}

      sentEle.children[1].children[0].innerHTML = result;

    }

    processFullSentence() {
      let fullSentEle = document.getElementById("full_sentence");
      if (fullSentEle === null || fullSentEle.innerHTML.trim().length === 0) { // front side or empty
        return;
      }

      let fullSent = fullSentEle.innerHTML;

      if (!fullSent.match(/<(b)>/)) {
        if (!this.attemptedHighlight) {
          // attempts to generates the highlighted word result
          let sentHTML = document.getElementById("hidden_sentence").innerHTML;
          this.highlightWord(sentHTML, "hidden-full-sentence");
          this.attemptedHighlight = true;
        }

        if (this.autoReplaces.length > 0) {  // attempt to bold
          const [result, matchResult] = this.autoHighlight.highlightWordRuby(fullSent, this.autoReplaces);
          let word = document.getElementById("hidden_word").innerHTML;
          this.logOnBold(result, word, "full-sentence", matchResult)
          fullSentEle.innerHTML = result;
        }
      }

      // checks for quotes
      let quotePair = this.getQuotes(fullSentEle.innerHTML.trim());
      if (quotePair.length) {
        fullSentEle.classList.toggle("left-align-quote", true);
      }
    }


    run() {

      if ({{ utils.opt("modules", "sent-utils", "enable-display-sentence-processing") }}) {
        let sentences = document.querySelectorAll(".expression--sentence")

        if (sentences !== null) {
          for (let sent of sentences) {
            this.processSentence(sent, this.paIndicator);
          }
        }
      }

      if ({{ utils.opt("modules", "sent-utils", "enable-full-sentence-processing") }}) {
        this.processFullSentence();
      }

      if ({{ utils.opt("modules", "sent-utils", "always-hide-full-sentence-front") }}) {
        const frontSent = document.getElementById("full_sentence_front_details");
        if (frontSent !== null) {
          frontSent.classList.toggle("hidden", true);
        }
      }
    }
  }


  return JPMNSentUtils;

})();


/// {% endset %}


/// {% set run_main %}
if ({{ utils.opt("modules", "sent-utils", "enabled") }}) {
  let sent_utils = new JPMNSentUtils(paIndicator);
  sent_utils.run();
}
/// {% endset %}


/// {% set run %}
if ({{ utils.opt("modules", "sent-utils", "enabled") }}) {
  let sent_utils = new JPMNSentUtils();
  sent_utils.run();
}
/// {% endset %}


