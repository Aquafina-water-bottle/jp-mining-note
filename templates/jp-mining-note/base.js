

// import settings as a global variable
// https://forums.ankiweb.net/t/how-to-include-external-files-in-your-template-js-css-etc-guide/11719

//function getAnkiPrefix() {
//  // TODO cross-platform support
//  // "https://appassets.androidplatform.net" ?
//  return "./";
//}
//
//var OPTIONS_FILE = "jp-mining-note-options.js"; // const screws up anki for some reason lol

// import statements cannot be contained in a function, if statement, etc.
//import {createOptions} from getAnkiPrefix() + OPTIONS_FILE;

//import {createOptions} from "./jp-mining-note-options.js";



// global cache for an entire card's kanji hover html
// maps key.word_reading -> html string
var kanjiHoverCardCache = kanjiHoverCardCache ?? {};

// maps kanji -> [{set of used words}, html string]
var kanjiHoverCache = kanjiHoverCache ?? {};


(function () { // restricts ALL javascript to hidden scope

// "global" variables within the hidden scope
let note = (function () {
  let my = {};
  my.colorQuotes = false;
  return my;
}());



function getSetting(keys, defaultVal) {
  if (typeof JPMNOpts === "undefined") {
    return defaultVal;
  }

  let keyList = ["settings"].concat(keys);

  let obj = JPMNOpts;
  for (let key of keyList) {
    if (!(key in obj)) {

      // checks if we need to warn, manual search
      if ("settings" in JPMNOpts && "debug" in JPMNOpts["settings"] && JPMNOpts["settings"]["debug"]) {
        logger.warn("Option " + keys.join(".") + " is not defined in the options file.");
      }
      return defaultVal;
    }
    obj = obj[key];
  }
  return obj;
};


function _debug(message) {
  if ({{ utils.opt("debug") }}) {
    logger.info(message);
  }
}



// global variable to set the PA indicator color (as a css class)
/// {% call IF("PAShowInfo") %}
var paIndicator = (function () {
  let my = {};
  my.type = null;
  my.className = null;
  my.tooltip = null;

  if ('{{ utils.any_of_str("PADoNotTest", "PASeparateWordCard") }}') {
    my.type = "none";
  } else if ('{{ utils.any_of_str("PASeparateSentenceCard", "PATestOnlyWord") }}') {
    my.type = "word";
  } else if ('{{ utils.any_of_str("IsSentenceCard") }}') {
    my.type = "sentence";
  } else {
    my.type = "word";
  }

  my.className = "pa-indicator-color--" + my.type;

  if (my.type === "none") {
    my.tooltip = "Do not test"
  } else if (my.type == "word") {
    my.tooltip = "Word"
  } else { // sentence
    my.tooltip = "Sentence"
  }

  return my;
}());
/// {% endcall %} // PAShowInfo


/// {% if note.card_type != "pa_word" %}


/*
 * processes the sentence (if there is no altdisplay)
 * - removes newlines
 * - replaces bold with [...] if cloze deletion
 * - handles adding or replacing quotes if specified
 *
 * isAltDisplay=false
 */
function processSentence(sentEle, isAltDisplay, isClozeDeletion) {
  if (!{{ utils.opt("sentence", "enabled") }}) {
    return;
  }

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

    // automatically removes newlines and other html elements
    // https://stackoverflow.com/a/54369605
    //let charCount = [...sentEle.innerText.trim()].length;
    //let maxCharCount = { utils.opt("sentence", "remove-line-breaks-until-char-count") }

    //if ((maxCharCount === 0) || (charCount <= maxCharCount)) {
    //  result = noNewlines;
    //}

    result = noNewlines;
  }

  // removes leading and trailing white space (equiv. of strip() in python)
  result = result.trim();

  // selects the smallest containing sentence

  //if (!isAltDisplay && settings.sentence("select-smallest-sentence")) {
  //  result = selectSentence(result);
  //}

  //if (settings.quote("enabled", true)) {
  //  result = processQuote(sentEle, result, isAltDisplay);
  //} else {
  //  sentEle.innerHTML = result;
  //}

  //var processQuote = function(sentEle, sent, isAltDisplay) {
  //let result = sent;

  //let openQuote = null;
  //let closeQuote = null;
  //let validQuotes = settings.quote("quote-match-strings", [["「", "」"]])


  // if existing quotes:
  //     remove from sentence
  //     add to quote spans
  // if no existing quotes and if autoquote:
  //     add autoquote open / close to quote spans (if different)
  // if color quotes:
  //     add color quote class to outer divs
  

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
    // defaults to having quotes, in case javascript fails to load for some reason
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

    /// {% call utils.none_of_js("IsHoverCard", "IsClickCard") %}
    /// {% call utils.any_of_js("IsTargetedSentenceCard", "IsSentenceCard") %}
    let svgEle = document.getElementById("flag_box_svg");
    svgEle.style.display = "none";
    /// {% endcall %}
    /// {% endcall %}
  }
  /// {% endcall %}
  /// {% endif %}

  sentEle.children[1].innerHTML = result;
}

/*
 * Toggles the display of any given details tag
 */
function toggleDetailsTag(ele) {
  if (ele.hasAttribute('open')) {
    ele.removeAttribute('open');
  } else {
    ele.setAttribute("open", "true");
  }
}


function processSentences(isAltDisplay, isClozeDeletion) {
  let sentences = document.querySelectorAll(".expression--sentence")

  if (sentences !== null) {
    for (let sent of sentences) {
      processSentence(sent, isAltDisplay, isClozeDeletion);
    }
  }
}


/// {% endif %} /// note.card_type != "pa_word"



/// {% block js_functions %}
/// {% endblock %}





// shift to switch between sentence & word on click & hover cards
// NOTICE: we MUST use document.onkeyup instead of document.addEventListener(...)
// because functions persist and cannot be easily removed within anki,
// whereas .onkeyup = ... replaces the previous function with the current.
document.onkeyup = (e => {
  let keys = null;
  let ele = null;

  // tests for the existance of extraKeybindSettings
  //if (typeof extraKeybindSettings !== 'undefined') {
  //  extraKeybindSettings(e);
  //}

  /// {% filter indent(width=2) %}
  /// {% block js_keybind_settings %}
  /// {% endblock %}
  /// {% endfilter %}


  /// {% call IF("WordAudio") %}
  //keys = settings.keybind("play-word-audio");
  keys = {{ utils.opt("keybinds", "play-word-audio") }};

  if (keys !== null && keys.includes(e.key)) {
    ele = document.querySelector("#word-audio .soundLink, #word-audio .replaybutton");
    if (ele) {
      ele.click();
    }
  }
  /// {% endcall %}

  /// {% call IF("SentenceAudio") %}
  keys = {{ utils.opt("keybinds", "play-sentence-audio") }};
  if (keys !== null && keys.includes(e.key)) {

    let hSent = document.getElementById("hybrid-sentence");

    /// {% if note.card_type == "main" and note.side == "front" %}
    if ({{ utils.opt("hybrid-sentence-open-on-play-sentence") }}
        && '{{ utils.any_of_str("IsHoverCard", "IsClickCard") }}'
        && '{{ utils.any_of_str("IsTargetedSentenceCard", "IsSentenceCard") }}'
        && hSent !== null && !hSent.classList.contains("override-display-inline-block")) {
      // this somehow works even when hybridClick is undefined here, woah
      hybridClick();
    } else {
    /// {% endif %}
      ele = document.querySelector("#sentence-audio .soundLink, #sentence-audio .replaybutton");
      if (ele) {
        ele.click();
      }
    /// {% if note.card_type == "main" and note.side == "front" %}
    }
    /// {% endif %}
  }
  /// {% endcall %}

  keys = {{ utils.opt("keybinds", "toggle-front-full-sentence-display") }};
  ele = document.getElementById("full_sentence_front_details");
  if (keys !== null && ele && keys.includes(e.key)) {
    toggleDetailsTag(ele)
  }

  /// {% call IF("Hint") %}
  keys = {{ utils.opt("keybinds", "toggle-hint-display") }};
  ele = document.getElementById("hint_details");
  if (keys !== null && ele && keys.includes(e.key)) {
    toggleDetailsTag(ele)
  }
  /// {% endcall %}

  /// {% if note.side == "back" %}
  /// {% call IF("SecondaryDefinition") %}
  keys = {{ utils.opt("keybinds", "toggle-secondary-definitions-display") }};
  ele = document.getElementById("secondary_definition_details");
  if (keys !== null && ele && keys.includes(e.key)) {
    toggleDetailsTag(ele)
  }
  /// {% endcall %}

  /// {% call IF("AdditionalNotes") %}
  keys = {{ utils.opt("keybinds", "toggle-additional-notes-display") }};
  ele = document.getElementById("additional_notes_details");
  if (keys !== null && ele && keys.includes(e.key)) {
    toggleDetailsTag(ele)
  }
  /// {% endcall %}

  /// {% call IF("ExtraDefinitions") %}
  keys = {{ utils.opt("keybinds", "toggle-extra-definitions-display") }};
  ele = document.getElementById("extra_definitions_details");
  if (keys !== null && ele && keys.includes(e.key)) {
    toggleDetailsTag(ele)
  }
  /// {% endcall %}

  if ('{{ utils.any_of_str("PAGraphs", "UtilityDictionaries") }}') {
    keys = {{ utils.opt("keybinds", "toggle-extra-info-display") }};
    ele = document.getElementById("extra_info_details");
    if (keys !== null && ele && keys.includes(e.key)) {
      toggleDetailsTag(ele)
    }
  }
  /// {% endif %} {# note.side == back #}

})


// sanity check
if (typeof JPMNOpts === 'undefined') {
  logger.warn("JPMNOpts was not defined in the options file. Was there an error?");
}

/// {% block js_run %}
/// {% endblock %}

//})();


}());
