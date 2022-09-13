/// {% set functions %}


/*
 * processes the sentence (if there is no altdisplay)
 * - removes newlines
 * - replaces bold with [...] if cloze deletion
 * - handles adding or replacing quotes if specified
 *
 * isAltDisplay=false
 */

const JPMN_SentUtils = (function () {

  let my = {};

  function processSentence(sentEle, isAltDisplay, isClozeDeletion) {
    if (typeof isAltDisplay === 'undefined') {
      logger.warn("isAltDisplay is undefined");
      isAltDisplay = false;
    }

    // removes linebreaks
    let result = sentEle.children[1].innerHTML;

    // cloze deletion replacing bold with [...]
    if (typeof isClozeDeletion !== "undefined" && isClozeDeletion) {
      result = result.replace(/<b>.*?<\/b>/g, "<b>[...]</b>");
    }

    if ((!isAltDisplay && {{ utils.opt("sentence", "remove-line-breaks") }})
        || isAltDisplay && {{ utils.opt("sentence", "remove-line-breaks-on-altdisplay") }}) {
      let noNewlines = result.replace(/<br>/g, "");

      result = noNewlines;
    }

    // removes leading and trailing white space (equiv. of strip() in python)
    result = result.trim();

    let validQuotes = {{ utils.opt("sentence", "quote-match-strings") }};
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
      (!isAltDisplay && {{ utils.opt("sentence", "auto-quote-sentence") }})
      || (isAltDisplay && {{ utils.opt("sentence", "auto-quote-alt-display-sentence") }})
    );
    if (!existingQuote && autoQuote) {
      /// {% if note.card_type == "pa_sent" %}
      openQuoteEle.innerText = {{ utils.opt("sentence", "pa-sent-auto-quote-open") }};
      closeQuoteEle.innerText = {{ utils.opt("sentence", "pa-sent-auto-quote-close") }};
      /// {% else %}
      openQuoteEle.innerText = {{ utils.opt("sentence", "auto-quote-open") }};
      closeQuoteEle.innerText = {{ utils.opt("sentence", "auto-quote-close") }};
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


    /// {% if note.card_type == "pa_sent" %}
    if ((existingQuote || autoQuote) && {{ utils.opt("sentence", "pa-sent-pa-indicator-color-quotes") }}) {
      openQuoteEle.classList.add("pa-indicator-color--sentence");
      closeQuoteEle.classList.add("pa-indicator-color--sentence");
    }
    /// {% endif %}

    /// {% if note.card_type == "main" %}
    /// {% call IF("PAShowInfo") %}
    if ((existingQuote || autoQuote) && {{ utils.opt("sentence", "pa-indicator-color-quotes") }}) {
      // TODO change this to a data-color-quotes tag within html
      // so it is sentence-div dependent
      note.colorQuotes = true;

      openQuoteEle.classList.add(paIndicator.className);
      closeQuoteEle.classList.add(paIndicator.className);

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


  function processSentences(isAltDisplay, isClozeDeletion) {
    if (!{{ utils.opt("sentence", "enabled") }}) {
      return;
    }

    let sentences = document.querySelectorAll(".expression--sentence")

    if (sentences !== null) {
      for (let sent of sentences) {
        processSentence(sent, isAltDisplay, isClozeDeletion);
      }
    }
  }

  my.run = processSentences;
  return my;

}());


/// {% endset %}


/// {% set run_main %}
{
  let isAltDisplay = !!'{{ utils.any_of_str("AltDisplay") }}';
  JPMN_SentUtils.run(isAltDisplay);
}
/// {% endset %}


/// {% set run_pa_sent %}
{
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

  JPMN_SentUtils.run(isAltDisplay);
}
/// {% endset %}




/// {% set run_cloze_deletion %}
{
  let isAltDisplay = false;
  /* {% call IF('AltDisplay') %} */
    isAltDisplay = false;
  /* {% endcall %} */

  JPMN_SentUtils.run(isAltDisplay, true);
}
/// {% endset %}



