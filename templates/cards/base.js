

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

import {createOptions} from "./jp-mining-note-options.js";



(function () { // restricts ALL javascript to hidden scope


// TODO remove this at some point and replace with proper checks
var note = (function () {
  let my = {};
  my.colorQuotes = false;
  return my;
}());



var logger = (function () {
  let my = {};

  let _appendMsg = function(message, groupEle) {
    let msgEle = document.createElement('div');
    msgEle.classList.add("info-circle__message")
    if (Array.isArray(message)) {
      if (message.length > 0) {
        msgEle.textContent = message[0];

        for (let line of message.slice(1)) {
          let lineEle = document.createElement('div');
          lineEle.textContent = line;
          msgEle.appendChild(lineEle);
        }
      }

    } else {
      msgEle.textContent = message;
    }
    groupEle.appendChild(msgEle);
  }

  my.error = function(message) {
    var groupEle = document.getElementById("info_circle_text_error");
    _appendMsg(message, groupEle);
    var infoCirc = document.getElementById("info_circle");
    if (!infoCirc.classList.contains("info-circle-error")) {
      infoCirc.classList.add("info-circle-error")
    }
  }

  my.assert = function(condition, message) {
    if (!condition) {
      my.error("(assert) " + message);
    }
  }

  my.warn = function(message) {
    var groupEle = document.getElementById("info_circle_text_warning");
    _appendMsg(message, groupEle);
    var infoCirc = document.getElementById("info_circle");
    if (!infoCirc.classList.contains("info-circle-warning")) {
      infoCirc.classList.add("info-circle-warning")
    }
  }

  my.info = function(message) {
    var groupEle = document.getElementById("info_circle_text_info");
    _appendMsg(message, groupEle);
  }


  my.leech = function() {
    var groupEle = document.getElementById("info_circle_text_leech");
    _appendMsg("", groupEle);
    var infoCirc = document.getElementById("info_circle");
    if (!infoCirc.classList.contains("info-circle-leech")) {
      infoCirc.classList.add("info-circle-leech")
    }
  }

  return my;
}());


// on any javascript error: log it
window.onerror = function(msg, url, lineNo, columnNo, error) {
//window.onerror = function(msg) {
  //logger.error("Javascript error: `" + msg + "`" + "\n" + error.stack);
  let stackList = error.stack.split(" at ");
  for (let i = 1; i < stackList.length; i++) {
    stackList[i] = ">>> " + stackList[i];
  }
  logger.error(stackList);
}

// https://stackoverflow.com/a/55178672
window.onunhandledrejection = function(errorEvent) {
  logger.error("Javascript handler error: `" + errorEvent.reason + "`");
}








/*
 * class to read settings
 */

var settings = (function () {
  let my = {};

  /* defaultOpt=null */
  var _getSetting = function(settingStr, settingObj, defaultOpt) {
    if (typeof settingObj === "undefined" || !(settingStr in settingObj)) {
      logger.warn("Option `" + settingStr + "` is not defined in the options file.");
      if (typeof defaultOpt === "undefined") {
        return null;
      } else {
        return defaultOpt;
      }
    }
    return settingObj[settingStr];
  }

  my.keybind = function(settingStr, defaultOpt) {
    return _getSetting(settingStr, JPMNOpts.settings["keybinds"], defaultOpt);
  }

  my.sentence = function(settingStr, defaultOpt) {
    return _getSetting(settingStr, JPMNOpts.settings["sentence-module"], defaultOpt);
  }

  my.quote = function(settingStr, defaultOpt) {
    return _getSetting(settingStr, JPMNOpts.settings["sentence-module"]["quote-module"], defaultOpt);
  }

  my.general = function(settingStr, defaultOpt) {
    return _getSetting(settingStr, JPMNOpts.settings["general"], defaultOpt);
  }

  return my;

}());




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



var selectSentence = function(temp) {
  // only chooses the sentence around the bold characters
  var firstMatch = temp.indexOf("<b>");
  var lastMatch = temp.lastIndexOf("</b>");

  // list of valid terminators
  // "removeEnd": is removed if found at the end of a sentence
  var terminators = {
    ".": {removeEnd: true},
    "。": {removeEnd: true},
    "．": {removeEnd: true},
    "︒": {removeEnd: true},

    "!": {removeEnd: false},
    "?": {removeEnd: false},
    "！": {removeEnd: false},
    "？": {removeEnd: false},
    "…": {removeEnd: false},
    "︕": {removeEnd: false},
    "︖": {removeEnd: false},
    "︙": {removeEnd: false},
  }


  if (firstMatch !== -1 && lastMatch !== -1) {
    var beginIdx = firstMatch;
    var endIdx = lastMatch;

    for (; beginIdx >= 0; beginIdx--) {
      if (temp[beginIdx] in terminators) {
        var obj = terminators[temp[beginIdx]];
        beginIdx++;

        //console.log(beginIdx);
        //console.log(temp[beginIdx]);
        break;
      }
    }

    for (; endIdx < temp.length; endIdx++) {
      if (temp[endIdx] in terminators) {
        var obj = terminators[temp[endIdx]];
        if (obj.removeEnd) {
            endIdx--;
        }

        //console.log(endIdx);
        //console.log(temp[endIdx]);
        //console.log(obj.removeEnd);
        break;
      }
    }

    // clamp
    if (beginIdx < 0) {
      beginIdx = 0;
    }
    if (endIdx > temp.length-1) {
      endIdx = temp.length-1;
    }

    temp = temp.substring(beginIdx, endIdx+1)

    // re-adds quotes if necessary
    if (temp[0] !== "「") {
      temp = "「" + temp;
    }
    if (temp[temp.length-1] !== "」") {
      temp = temp + "」";
    }
  }

  return temp;
}



var processQuote = function(sentEle, sent, isAltDisplay) {
  let result = sent;
  let openQuote = null;
  let closeQuote = null;
  let validQuotes = settings.quote("quote-match-strings", [["「", "」"]])

  if (!isAltDisplay && settings.quote("auto-quote-sentence", true)) {
    let arr = settings.quote("auto-quote-sentence-strings", ["「", "」"])
    logger.assert(Array.isArray(arr), "expected array");
    logger.assert(arr.length === 2, "expected array of len 2");
    // this operation seems to be supported in anki!
    [openQuote, closeQuote] = arr;
  }

  // existing quotes override the default quotes, even on alt displays
  for (let quotePair of validQuotes) {
    if ((sent[0] === quotePair[0]) && (sent[sent.length-1] === quotePair[1])) {
      [openQuote, closeQuote] = quotePair;
      result = sent.slice(1, -1);
      break;
    }
  }


  // replaces the element (should only contain text) with the following:
  //
  // <(previous div or span)>
  //  <span> (open quote) </span>
  //  <span> (text) </span>
  //  <span> (close quote) </span>
  // </(previous div or span)>

  let textEle = document.createElement('span');
  textEle.innerHTML = result;

  let openQuoteEle = document.createElement('span');
  openQuoteEle.innerHTML = openQuote;

  let closeQuoteEle = document.createElement('span');
  closeQuoteEle.innerHTML = closeQuote;

  /// {% if note.card_type == "main" %}
    /// {% call IF("PAShowInfo") %}
      if (settings.quote("pa-indicator-color-quotes")) {
        note.colorQuotes = true;
        openQuoteEle.classList.add(paIndicator.className);
        closeQuoteEle.classList.add(paIndicator.className);

        /// {% call IF("IsHoverCard") %}
          var elem = document.querySelector(".expression__hybrid-wrapper");
          if (elem !== null) {
            elem.classList.add("expression__hybrid-wrapper--hover-remove-flag");
          }
        /// {% endcall %}

        // neither hover & click and is either one of TSC / sentence -> removes flag

        /// {% call utils.none_of_js("IsHoverCard", "IsClickCard") %}
          /// {% call utils.any_of_js("IsTargetedSentenceCard", "IsSentenceCard") %}
            var svgEle = document.getElementById("flag_box_svg");
            svgEle.style.display = "none";
          /// {% endcall %}
        /// {% endcall %}
      }
    /// {% endcall %}
  /// {% endif %}

  if (settings.quote("left-align-adjust-format")) {
    sentEle.classList.add("left-align-quote-format");
  }

  sentEle.innerText = "";
  sentEle.appendChild(openQuoteEle);
  sentEle.appendChild(textEle);
  sentEle.appendChild(closeQuoteEle);
}


/*
 * processes the sentence (if there is no altdisplay)
 * - removes newlines
 * - finds the shortest possible sentence around the bolded characters
 *   (if specified in the config)
 *
 * isAltDisplay=false
 */
var processSentence = function(sentEle, isAltDisplay, isClozeDeletion) {
  if (!settings.sentence("enabled", true)) {
    return;
  }

  if (typeof isAltDisplay === 'undefined') {
    isAltDisplay = false;
  }

  // removes linebreaks
  var result = sentEle.innerHTML;

  // cloze deletion replacing bold with [...]
  if (typeof isClozeDeletion !== "undefined" && isClozeDeletion) {
    result = result.replace(/<b>.*?<\/b>/g, "<b>[...]</b>");
  }

  if ((!isAltDisplay && settings.sentence("remove-line-breaks", true))
      || isAltDisplay && settings.sentence("remove-line-breaks-on-altdisplay", true)) {
    let noNewlines = result.replace(/<br>/g, "");

    // automatically removes newlines and other html elements
    // https://stackoverflow.com/a/54369605
    let charCount = [...sentEle.innerText.trim()].length;
    let maxCharCount = settings.sentence("remove-line-breaks-until-char-count", 0)

    if ((maxCharCount === 0) || (charCount <= maxCharCount)) {
      result = noNewlines;
    }
  }

  // removes leading and trailing white space (equiv. of strip() in python)
  result = result.trim();

  // selects the smallest containing sentence

  if (!isAltDisplay && settings.sentence("select-smallest-sentence", false)) {
    result = selectSentence(result);
  }

  if (settings.quote("enabled", true)) {
    result = processQuote(sentEle, result, isAltDisplay);
  } else {
    sentEle.innerHTML = result;
  }
}

/*
 * Toggles the display of any given details tag
 */
var toggleDetailsTag = function(ele) {
  if (ele.hasAttribute('open')) {
    ele.removeAttribute('open');
  } else {
    ele.setAttribute("open", "true");
  }
}


function processSentences(isAltDisplay, isClozeDeletion) {
  var sentences = document.querySelectorAll(".expression--sentence")

  if (sentences !== null) {
    for (let sent of sentences) {
      processSentence(sent, isAltDisplay, isClozeDeletion);
    }
  }
}




/// {% block js_functions %}
/// {% endblock %}





// shift to switch between sentence & word on click & hover cards
// NOTICE: we MUST use document.onkeyup instead of document.addEventListener(...)
// because functions persist and cannot be easily removed within anki,
// whereas .onkeyup = ... replaces the previous function with the current.
document.onkeyup = (e => {
  var keys = null;

  // tests for the existance of extraKeybindSettings
  //if (typeof extraKeybindSettings !== 'undefined') {
  //  extraKeybindSettings(e);
  //}

  /// {% block js_keybind_settings %}
  /// {% endblock %}


  /// {% call IF("WordAudio") %}
    keys = settings.keybind("play-word-audio");
    if (keys !== null && keys.includes(e.key)) {
      var elem = document.querySelector("#word-audio .soundLink, #word-audio .replaybutton");
      if (elem) {
        elem.click();
      }
    }
  /// {% endcall %}

  /// {% call IF("SentenceAudio") %}
    keys = settings.keybind("play-sentence-audio");
    if (keys !== null && keys.includes(e.key)) {

      var hSent = document.getElementById("hybrid-sentence");

      /// {% if note.card_type == "main" and note.side == "front" %}
      if (settings.general("hybrid-sentence-open-on-play-sentence", true)
          && '{{ utils.any_of_str("IsHoverCard", "IsClickCard") }}'
          && '{{ utils.any_of_str("IsTargetedSentenceCard", "IsSentenceCard") }}'
          && hSent !== null && !hSent.classList.contains("override-display-inline-block")) {
        // this somehow works even when hybridClick is undefined here, woah
        hybridClick();
      } else {
      /// {% endif %}
        var elem = document.querySelector("#sentence-audio .soundLink, #sentence-audio .replaybutton");
        if (elem) {
          elem.click();
        }
      /// {% if note.card_type == "main" and note.side == "front" %}
      }
      /// {% endif %}
    }
  /// {% endcall %}

  keys = settings.keybind("toggle-front-full-sentence-display");
  var ele = document.getElementById("full_sentence_front_details");
  if (keys !== null && ele && keys.includes(e.key)) {
    toggleDetailsTag(ele)
  }

  /// {% call IF("Hint") %}
    keys = settings.keybind("toggle-hint-display");
    var ele = document.getElementById("hint_details");
    if (keys !== null && ele && keys.includes(e.key)) {
      toggleDetailsTag(ele)
    }
  /// {% endcall %}

  /// {% if note.side == "back" %}
    /// {% call IF("SecondaryDefinition") %}
      keys = settings.keybind("toggle-secondary-definitions-display");
      var ele = document.getElementById("secondary_definition_details");
      if (keys !== null && ele && keys.includes(e.key)) {
        toggleDetailsTag(ele)
      }
    /// {% endcall %}

    /// {% call IF("AdditionalNotes") %}
      keys = settings.keybind("toggle-additional-notes-display");
      var ele = document.getElementById("additional_notes_details");
      if (keys !== null && ele && keys.includes(e.key)) {
        toggleDetailsTag(ele)
      }
    /// {% endcall %}

    /// {% call IF("ExtraDefinitions") %}
      keys = settings.keybind("toggle-extra-definitions-display");
      var ele = document.getElementById("extra_definitions_details");
      if (keys !== null && ele && keys.includes(e.key)) {
        toggleDetailsTag(ele)
      }
    /// {% endcall %}

    if ('{{ utils.any_of_str("PAGraphs", "UtilityDictionaries") }}') {
      keys = settings.keybind("toggle-extra-info-display");
      var ele = document.getElementById("extra_info_details");
      if (keys !== null && ele && keys.includes(e.key)) {
        toggleDetailsTag(ele)
      }
    }
  /// {% endif %}

})


//var OPTIONS_FILE = "jp-mining-note-options.js"; // const screws up anki for some reason lol
//var injectScript = (src) => {
//  return new Promise((resolve, reject) => {
//    const script = document.createElement('script');
//    script.src = src;
//    script.async = true;
//    script.onload = resolve;
//    script.onerror = function(errorEvent) {
//      // seems only to error if the options file is not found
//      // syntax errors trigger the sanity check section and javascript error section
//      logger.error("Options file not found! Make sure `" + OPTIONS_FILE + "` is placed in the media folder.");
//    }
//    document.head.appendChild(script);
//  });
//};


//(async () => {

//if (typeof JPMNOpts === 'undefined') {
//  await injectScript(OPTIONS_FILE);
//}

let JPMNOpts = createOptions();

// sanity check
if (typeof JPMNOpts === 'undefined') {
  logger.error("JPMNOpts was not defined in the options file. Was there an error?");
}

// removes extra info section if not necessary
var ele = document.querySelector(".pa-graphs");
if (ele !== null && ele.innerText.trim() === "No pitch accent data" &&
    !"{{ utils.any_of_str('UtilityDictionaries') }}") {
  document.getElementById("extra_info_details").style.display = "none";
}

/// {% block js_run %}
/// {% endblock %}

//})();




}());
