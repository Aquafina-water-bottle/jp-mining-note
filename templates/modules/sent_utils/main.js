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

  function processSentence(sentEle, isAltDisplay, isClozeDeletion, paIndicator) {
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

    // removes newlines
    if ((!isAltDisplay && {{ utils.opt("modules", "sent-utils", "remove-line-breaks") }})
        || isAltDisplay && {{ utils.opt("modules", "sent-utils", "remove-line-breaks-on-altdisplay") }}) {
      let noNewlines = result.replace(/<br>/g, "");

      result = noNewlines;
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

    // moves pa-indicator position
    if (!existingQuote && !autoQuote) {
      const circ = document.getElementById("pa_indicator_circle");
      if (circ !== null) {
        circ.setAttributeNS(null, "cx", "35");
        circ.setAttributeNS(null, "cy", "11");
      }
    }

    if ((existingQuote || autoQuote) && {{ utils.opt("modules", "sent-utils", "pa-indicator-color-quotes") }}) {
      // TODO change this to a data-color-quotes tag within html
      // so it is sentence-div dependent
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

      /// {% call utils.none_of_js("IsHoverCard", "IsClickCard") %}
      /// {% call utils.any_of_js("IsTargetedSentenceCard", "IsSentenceCard") %}
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


  class JPMNSentUtils {
    constructor(isAltDisplay, isClozeDeletion, paIndicator) {
      this.isAltDisplay = isAltDisplay;
      this.isClozeDeletion = nullish(isClozeDeletion, false);
      this.paIndicator = nullish(paIndicator, null);
    }

    run() {
      let sentences = document.querySelectorAll(".expression--sentence")

      if (sentences !== null) {
        for (let sent of sentences) {
          processSentence(sent, this.isAltDisplay, this.isClozeDeletion, this.paIndicator);
        }
      }
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
      /* {% call utils.none_of('IsClickCard', 'IsHoverCard', 'IsSentenceCard', 'IsTargetedSentenceCard') %} */
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



