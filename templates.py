
with open("version.txt") as file:
    version = file.read().strip()


#class TemplatesRaw:
TEMPLATES = {

# ==================
#  helper templates
# ==================
# i.e. templates used within templates used in this file
"version":

rf"""
<div class="card-description-ver">JP Mining Note: Version {version}</div>
""",


"global_js_top_main":

r"""
<script>
  var note = (function () {
    let my = {};
    my.cardType = "main";
    return my;
  }());
</script>
""",


"global_js_top_pa_word":

r"""
<script>
  var note = (function () {
    let my = {};
    my.cardType = "pa_word";
    return my;
  }());
</script>
""",


"global_js_top_pa_sent":

r"""
<script>
  var note = (function () {
    let my = {};
    my.cardType = "pa_sent";
    return my;
  }());
</script>
""",


"global_js_top_cloze_deletion":

r"""
<script>
  var note = (function () {
    let my = {};
    my.cardType = "cloze_deletion";
    return my;
  }());
</script>
""",


"global_js_top":

r"""
<script>
  var logger = (function () {
    let my = {};

    let _appendMsg = function(message, groupEle) {
      var msgEle = document.createElement('div');
      msgEle.textContent = message;
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

    return my;
  }());


  // on any javascript error: log it
  window.onerror = function(msg, url, lineNo, columnNo, error) {
    logger.error("Javascript error: `" + msg + "`");
  }
</script>


<!--
  it is expected that this file exists!
  placed after the logging javascript to log any possible errors in the imports
-->
<script src="jp-mining-note-options.js"></script>



<script>

  /*
   * class to read settings
   */

  if (typeof JPMNOpts === 'undefined') {
    logger.error("Error in the options file, or options file not found! Make sure `jp-mining-note-options.js` is placed in the media folder.");
  }

  var settings = (function () {
    let my = {};

    /* defaultOpt=null */
    var _getSetting = function(settingStr, settingObj, defaultOpt) {
      if (!(settingStr in settingObj)) {
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

    return my;

  }());




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


  // global variable to set the PA indicator color (as a css class)
  var paIndicator = (function () {
    let my = {};
    my.type = null;
    my.className = null;
    my.tooltip = null;

    if ("{{PADoNotTest}}{{PASeparateWordCard}}") {
      // PADoNotTest or PASeparateWordCard -> nothing is tested
      my.type = "none";
    } else if ("{{PASeparateSentenceCard}}{{PATestOnlyWord}}") {
      // either PASeparateSentenceCard or PATestOnlyWord -> only word is tested
      my.type = "word";
    } else if ("{{IsSentenceCard}}") {
      // sentence card but no pitch accent indicators are overridden
      my.type = "sentence";
    } else {
      // regular word card
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


  var processQuote = function(sentEle, sent, isAltDisplay) {
    let result = sent;
    let left = null;
    let right = null;
    let validQuotes = settings.quote("quote-match-strings", [["「", "」"]])

    if (!isAltDisplay && settings.quote("auto-quote-sentence", true)) {
      // this operation seems to be supported in anki!
      let arr = settings.quote("auto-quote-sentence-strings", ["「", "」"])
      logger.assert(Array.isArray(arr), "expected array");
      logger.assert(arr.length === 2, "expected array of len 2");
      [left, right] = arr;
    }

    // existing quotes override the default quotes, even on alt displays
    for (let quotePair of validQuotes) {
      if ((sent[0] === quotePair[0]) && (sent[sent.length-1] === quotePair[1])) {
        [left, right] = quotePair;
        result = sent.slice(1, -1);
        break;
      }
    }

    if (left === null) { // implies right === null
      // does nothing: no quotes!
      return result;
    }

    //if (!settings.quote("pa-indicator-color-quotes") && !settings.quote("left-align-adjust-format")) {
    //}

    // replaces the element (should only contain text) with the following:
    //
    // <(previous div or span)>
    //  <span style="display: flex;">
    //    <span> (open quote) </span>
    //    <span> (text) <span> (close quote) </span> </span>
    //  </span>
    // </(previous div or span)>

    let wrapperEle = document.createElement('span');
    if (settings.quote("left-align-adjust-format")) {
      wrapperEle.style.display = "flex";
    }

    let leftQuoteEle = document.createElement('span');
    leftQuoteEle.innerHTML = left;

    let rightQuoteEle = document.createElement('span');
    rightQuoteEle.innerHTML = right;

    {{^PADoNotShowInfo}}
      if (note.cardType === "main" && settings.quote("pa-indicator-color-quotes")) {
        leftQuoteEle.classList.add(paIndicator.className);
        rightQuoteEle.classList.add(paIndicator.className);

        // affects on hover cards
        {{#IsHoverCard}}
          var elem = document.querySelector(".expression__hybrid-wrapper");
          if (elem !== null) {
            elem.classList.add("expression__hybrid-wrapper--hover");
          }
        {{/IsHoverCard}}

        {{^IsHoverCard}} {{^IsClickCard}}
        if ("{{IsTargetedSentenceCard}}{{IsSentenceCard}}") {
          var svgEle = document.getElementById("flag_box_svg");
          svgEle.style.display = "none";
        }
        {{/IsClickCard}} {{/IsHoverCard}}
      }
    {{/PADoNotShowInfo}}

    let textEle = document.createElement('span');
    textEle.innerHTML = result;
    textEle.appendChild(rightQuoteEle)

    sentEle.innerText = "";
    wrapperEle.appendChild(leftQuoteEle);
    wrapperEle.appendChild(textEle);
    sentEle.appendChild(wrapperEle);

    return result;
  }


  /*
   * processes the sentence (if there is no altdisplay)
   * - removes newlines
   * - finds the shortest possible sentence around the bolded characters
   *   (if specified in the config)
   *
   * isAltDisplay=false
   */
  var processSentence = function(sentEle, isAltDisplay) {
    if (!settings.sentence("enabled", true)) {
      return;
    }

    if (typeof isAltDisplay === 'undefined') {
      isAltDisplay = false;
    }

    // removes linebreaks
    var result = sentEle.innerHTML;

    if (!isAltDisplay && settings.sentence("remove-line-breaks", true)) {
      result = result.replace(/<br>/g, "");
    } else if (isAltDisplay && settings.sentence("remove-line-breaks-on-altdisplay", true)) {
      result = result.replace(/<br>/g, "");
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


</script>
""",


"info_circle":

r"""
<span class="info-circle" id="info_circle">
  <span class="info-circle-svg-wrapper">
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="#585858" class="bi bi-info-circle" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
    </svg>
  </span>

  <span class="info-circle-text-wrapper">
    <span class="info-circle-text" id="info_circle_text">
      <div class="info-circle-text-error" id="info_circle_text_error"></div>
      <div class="info-circle-text-warning" id="info_circle_text_warning"></div>
      <div class="info-circle-text-info" id="info_circle_text_info">
        <div>
          Need help? View the
          <a href="https://github.com/Aquafina-water-bottle/jp-mining-note/wiki">documentation</a>.
        </div>
        <div>
          Have an issue?
          <a href="https://github.com/Aquafina-water-bottle/jp-mining-note/issues">Report it here</a>.
        </div>
        <div>
          View the
          <a href="https://github.com/Aquafina-water-bottle/jp-mining-note">source code</a>.
        </div>
      </div>
    </span>
  </span>
</span>


""",



"full_sentence_front":

r"""
<details class="glossary-details" id="full_sentence_front_details">
  <summary>Full Sentence</summary>
  <div class="center-box-1">
    <div class="center-box-2">
      <div class="full-sentence bold-yellow" id="full_sentence_front">
        {{furigana:SentenceReading}}
      </div>
    </div>
  </div>
</details>
""",



"play_sentence_only_js":

r"""
<script>
  // THIS IS A HACK to play sentence audio first and to not autoplay the word audio
  var elem = document.querySelector("#sentence-audio .soundLink, #sentence-audio .replaybutton");
  if (elem) {
    elem.click();
  }
</script>
""",


"play_silence_only_js":

r"""
<script>
  // THIS IS A HACK: this hack is to not auto-play the audio at the front of the card
  // https://forums.ankiweb.net/t/disabling-audio-autoplay-for-certain-fields/6318/3
  // https://forums.ankiweb.net/t/controlling-display-and-function-of-audio-buttons/10234
  var elem = document.querySelector("#pa-silence-audio .soundLink, #pa-silence-audio .replaybutton");
  if (elem) {
    elem.click();
  }
</script>
""",


"sentence_audio_no_autoplay":

r"""
<span id="pa-silence-audio" style="display:none">{{PASilence}}</span>
{{#SentenceAudio}}
<div id="sentence-audio"> {{SentenceAudio}} </div>
{{/SentenceAudio}}

{{PLAY_SILENCE_ONLY_JS}}
""",



"kb_global_inline_js":
"""

// shift to switch between sentence & word on click & hover cards
// NOTICE: we MUST use document.onkeyup instead of document.addEventListener(...)
// because functions persist and cannot be easily removed within anki,
// whereas .onkeyup = ... replaces the previous function with the current.
document.onkeyup = (e => {
  var keys = null;

  // tests for the existance of extraKeybindSettings
  if (typeof extraKeybindSettings !== 'undefined') {
    extraKeybindSettings(e);
  }

  {{#WordAudio}}
    keys = settings.keybind("play-word-audio");
    if (keys !== null && keys.includes(e.key)) {
      var elem = document.querySelector("#word-audio .soundLink, #word-audio .replaybutton");
      if (elem) {
        elem.click();
      }
    }
  {{/WordAudio}}

  {{#SentenceAudio}}
    keys = settings.keybind("play-sentence-audio");
    if (keys !== null && keys.includes(e.key)) {
      var elem = document.querySelector("#sentence-audio .soundLink, #sentence-audio .replaybutton");
      if (elem) {
        elem.click();
      }
    }
  {{/SentenceAudio}}

  keys = settings.keybind("toggle-front-full-sentence-display");
  var ele = document.getElementById("full_sentence_front_details");
  if (keys !== null && ele && keys.includes(e.key)) {
    toggleDetailsTag(ele)
  }

  {{#Hint}}
    keys = settings.keybind("toggle-hint-display");
    var ele = document.getElementById("hint_details");
    if (keys !== null && ele && keys.includes(e.key)) {
      toggleDetailsTag(ele)
    }
  {{/Hint}}

  {{#SecondaryDefinition}}
    keys = settings.keybind("toggle-secondary-definitions-display");
    var ele = document.getElementById("secondary_definition_details");
    if (keys !== null && ele && keys.includes(e.key)) {
      toggleDetailsTag(ele)
    }
  {{/SecondaryDefinition}}

  {{#AdditionalNotes}}
    keys = settings.keybind("toggle-additional-notes-display");
    var ele = document.getElementById("additional_notes_details");
    if (keys !== null && ele && keys.includes(e.key)) {
      toggleDetailsTag(ele)
    }
  {{/AdditionalNotes}}

  {{#ExtraDefinitions}}
    keys = settings.keybind("toggle-extra-definitions-display");
    var ele = document.getElementById("extra_definitions_details");
    if (keys !== null && ele && keys.includes(e.key)) {
      toggleDetailsTag(ele)
    }
  {{/ExtraDefinitions}}
})
""",


"hint":

r"""
{{#HintNotHidden}}
  <div class="center-box-1 hint">
    <div class="center-box-2">
      <div class="bold-yellow">{{HintNotHidden}}</div>
    </div>
  </div>
{{/HintNotHidden}}

<!-- https://stackoverflow.com/questions/1269589/css-center-block-but-align-contents-to-the-left -->
<!-- tl;dr wrap anything you want centered + left justified with center-box-1 and center-box-2 -->
{{#Hint}}
  <details class="hint" id="hint_details">
    <summary>Hint</summary>
    <div class="center-box-1">
      <div class="center-box-2">
        <div class="bold-yellow">{{Hint}}</div>
      </div>
    </div>
  </details>
{{/Hint}}
""",


"global_js_bottom":

r"""
<script>
  {{KB_GLOBAL_INLINE_JS}}
</script>
""",



# =================
#  main front side
# =================
"main_front":

r"""
{{GLOBAL_JS_TOP_MAIN}}

{{GLOBAL_JS_TOP}}

<div class="card-description">
  {{#IsHoverCard}}
    Hover ({{#IsSentenceCard}}Sentence{{/IsSentenceCard}}{{^IsSentenceCard}}Word{{/IsSentenceCard}})
  {{/IsHoverCard}}

  {{^IsHoverCard}}

    {{#IsClickCard}}
      Click ({{#IsSentenceCard}}Sentence{{/IsSentenceCard}}{{^IsSentenceCard}}Word{{/IsSentenceCard}})
    {{/IsClickCard}}

    {{^IsClickCard}}
      {{#IsTargetedSentenceCard}}
        TSC
      {{/IsTargetedSentenceCard}}
      {{^IsTargetedSentenceCard}}
        {{#IsSentenceCard}}
          {{^IsTargetedSentenceCard}}
            Sentence
          {{/IsTargetedSentenceCard}}
        {{/IsSentenceCard}}
      {{/IsTargetedSentenceCard}}

      {{^IsSentenceCard}}
          Word
      {{/IsSentenceCard}}
    {{/IsClickCard}}
  {{/IsHoverCard}}

  <!-- not legacy card -->
  {{^PADoNotShowInfo}}

    /

    <!--
    anki doesn't allow "or" logic in templates,
    so I replicate it by repeating things a bunch of times...

        A v B  = (A ^ ~B) v (~A ^ B) v (A ^ B)
        ~(A v B) =  ~A ^ ~B
    For more readable logic, check the "Word pitch indicator color" javascript code
    -->

    <!-- PADoNotTest or PASeparateWordCard == none -->
    {{#PADoNotTest}} {{#PASeparateWordCard}}
      None
    {{/PASeparateWordCard}} {{/PADoNotTest}}
    {{^PADoNotTest}} {{#PASeparateWordCard}}
      None
    {{/PASeparateWordCard}} {{/PADoNotTest}}
    {{#PADoNotTest}} {{^PASeparateWordCard}}
      None
    {{/PASeparateWordCard}} {{/PADoNotTest}}

    <!-- neither PADoNotTest, PASeparateWordCard are filled -->
    <!-- we then test the PA somewhere -->
    {{^PADoNotTest}} {{^PASeparateWordCard}}

      <!-- PASeparateSentenceCard or PATestOnlyWord == word -->
      {{#PASeparateSentenceCard}} {{^PATestOnlyWord}}
        Word
      {{/PATestOnlyWord}} {{/PASeparateSentenceCard}}
      {{^PASeparateSentenceCard}} {{#PATestOnlyWord}}
        Word
      {{/PATestOnlyWord}} {{/PASeparateSentenceCard}}
      {{#PASeparateSentenceCard}} {{#PATestOnlyWord}}
        Word
      {{/PATestOnlyWord}} {{/PASeparateSentenceCard}}

      <!-- if none of the above, then we test the default value -->
      {{^PASeparateSentenceCard}} {{^PATestOnlyWord}}

        <!-- note that hybrid cards only test the word -->
        {{#IsSentenceCard}}
            Sentence
        {{/IsSentenceCard}}

        {{^IsSentenceCard}}
            Word
        {{/IsSentenceCard}}

      {{/PATestOnlyWord}} {{/PASeparateSentenceCard}}

    {{/PASeparateWordCard}} {{/PADoNotTest}}

  {{/PADoNotShowInfo}}

  {{INFO_CIRCLE}}

  {{VERSION}}
</div>





<!-- legacy display -->
{{#PADoNotShowInfo}}

  <!-- priority is on the alternate display sentence -->

  {{#IsHoverCard}}
    <!-- fallback card card html
      in css: default hybrid css, but with hover instead of click -->
    <div class="expression__hybrid-wrapper">
      <div class="expression expression--single expression__hybrid expression__hybrid--hover" id="Display">
        <span class="expression--sentence expression__hybrid-sentence expression
                     {{^IsSentenceCard}} bold-yellow {{/IsSentenceCard}}
                     {{#IsTargetedSentenceCard}} bold-yellow {{/IsTargetedSentenceCard}}"
              id="hybrid-sentence">
          {{#AltDisplay}}
            {{furigana:AltDisplay}}
          {{/AltDisplay}}
          {{^AltDisplay}}
            {{Sentence}}
          {{/AltDisplay}}
        </span>
        <span class="expression--word expression__hybrid-word
            {{#IsTargetedSentenceCard}} expression__hybrid-word--sentence-underline {{/IsTargetedSentenceCard}}
            {{^IsTargetedSentenceCard}}
              {{#IsSentenceCard}} expression__hybrid-word--sentence-underline {{/IsSentenceCard}}
              {{^IsSentenceCard}} expression__hybrid-word--word-underline {{/IsSentenceCard}}
            {{/IsTargetedSentenceCard}}
            expression__hybrid-word--hover-indicator"
            id="hybrid-word">
          {{Word}}
        </span>
      </div>
    </div>
  {{/IsHoverCard}}

  {{^IsHoverCard}}

    {{#IsClickCard}}
      <!-- hybrid (sentence or word) card html
        in css: default hybrid css, with click -->
      <div class="expression__hybrid-wrapper">
        <div class="expression expression--single expression__hybrid expression__hybrid--click" id="Display">
          <span class="expression--sentence expression__hybrid-sentence
                       {{^IsSentenceCard}} bold-yellow {{/IsSentenceCard}}
                       {{#IsTargetedSentenceCard}} bold-yellow {{/IsTargetedSentenceCard}}"
                id="hybrid-sentence">
            {{#AltDisplay}}
              {{furigana:AltDisplay}}
            {{/AltDisplay}}
            {{^AltDisplay}}
              {{Sentence}}
            {{/AltDisplay}}
          </span>
          <span class="expression--word expression__hybrid-word
              {{#IsTargetedSentenceCard}} expression__hybrid-word--sentence-underline {{/IsTargetedSentenceCard}}
              {{^IsTargetedSentenceCard}}
                {{#IsSentenceCard}} expression__hybrid-word--sentence-underline {{/IsSentenceCard}}
                {{^IsSentenceCard}} expression__hybrid-word--word-underline {{/IsSentenceCard}}
              {{/IsTargetedSentenceCard}}
              expression__hybrid-word--click-indicator"
              id="hybrid-word">
            {{Word}}
          </span>
        </div>
      </div>
    {{/IsClickCard}}

    {{^IsClickCard}}

      {{#IsTargetedSentenceCard}}
        <div class="expression expression--sentence expression--single bold-yellow" id="Display">
          {{#AltDisplay}}
            {{furigana:AltDisplay}}
          {{/AltDisplay}}
          {{^AltDisplay}}
            {{Sentence}}
          {{/AltDisplay}}
        </div>
      {{/IsTargetedSentenceCard}}

      {{^IsTargetedSentenceCard}}
        {{#IsSentenceCard}}
          <div class="expression expression--sentence expression--single" id="Display">
            {{#AltDisplay}}
              {{furigana:AltDisplay}}
            {{/AltDisplay}}
            {{^AltDisplay}}
              {{Sentence}}
            {{/AltDisplay}}
          </div>
        {{/IsSentenceCard}}

        {{^IsSentenceCard}}
          <div class="expression expression--single expression--word" id="Display">
            {{#AltDisplay}}
              {{furigana:AltDisplay}}
            {{/AltDisplay}}
            {{^AltDisplay}}
              {{Word}}
            {{/AltDisplay}}
          </div>
        {{/IsSentenceCard}}
      {{/IsTargetedSentenceCard}}

    {{/IsClickCard}}

  {{/IsHoverCard}}

{{/PADoNotShowInfo}}


<!-- regular display -->
{{^PADoNotShowInfo}}
  <div class="expression expression-box">

    <!-- priority is on the alternate display sentence -->


    {{#IsHoverCard}}
      <!-- fallback card card html
        in css: default hybrid css, but with hover instead of click -->
      <div class="expression__hybrid-wrapper">
        <div class="expression expression__hybrid expression__hybrid--hover" id="Display">
          <span class="expression--sentence expression__hybrid-sentence
                       {{^IsSentenceCard}} bold-yellow {{/IsSentenceCard}}
                       {{#IsTargetedSentenceCard}} bold-yellow {{/IsTargetedSentenceCard}}"
                id="hybrid-sentence">
            {{#AltDisplay}}
              {{furigana:AltDisplay}}
            {{/AltDisplay}}
            {{^AltDisplay}}
              {{Sentence}}
            {{/AltDisplay}}
          </span>
          <span class="expression--word expression__hybrid-word
              {{#IsTargetedSentenceCard}} expression__hybrid-word--sentence-underline {{/IsTargetedSentenceCard}}
              {{^IsTargetedSentenceCard}}
                {{#IsSentenceCard}} expression__hybrid-word--sentence-underline {{/IsSentenceCard}}
                {{^IsSentenceCard}} expression__hybrid-word--word-underline {{/IsSentenceCard}}
              {{/IsTargetedSentenceCard}}
              expression__hybrid-word--hover-indicator"
              id="hybrid-word">
            {{Word}}
          </span>
        </div>

      </div>

    {{/IsHoverCard}}

    {{^IsHoverCard}}

      {{#IsClickCard}}
        <!-- hybrid (sentence or word) card html
          in css: default hybrid css, with click -->
        <div class="expression__hybrid-wrapper">
          <div class="expression expression__hybrid expression__hybrid--click" id="Display">
            <span class="expression--sentence expression__hybrid-sentence
                         {{^IsSentenceCard}} bold-yellow {{/IsSentenceCard}}
                         {{#IsTargetedSentenceCard}} bold-yellow {{/IsTargetedSentenceCard}}"
                id="hybrid-sentence">
              {{#AltDisplay}}
                {{furigana:AltDisplay}}
              {{/AltDisplay}}
              {{^AltDisplay}}
                {{Sentence}}
              {{/AltDisplay}}
            </span>
            <span class="expression--word expression__hybrid-word
                {{#IsTargetedSentenceCard}} expression__hybrid-word--sentence-underline {{/IsTargetedSentenceCard}}
                {{^IsTargetedSentenceCard}}
                  {{#IsSentenceCard}} expression__hybrid-word--sentence-underline {{/IsSentenceCard}}
                  {{^IsSentenceCard}} expression__hybrid-word--word-underline {{/IsSentenceCard}}
                {{/IsTargetedSentenceCard}}
                expression__hybrid-word--click-indicator"
                id="hybrid-word">
              {{Word}}
            </span>
          </div>
        </div>
      {{/IsClickCard}}

      {{^IsClickCard}}

        {{#IsTargetedSentenceCard}}
          <div class="expression expression--sentence bold-yellow" id="Display">
            {{#AltDisplay}}
              {{furigana:AltDisplay}}
            {{/AltDisplay}}
            {{^AltDisplay}}
              {{Sentence}}
            {{/AltDisplay}}
          </div>
        {{/IsTargetedSentenceCard}}

        {{^IsTargetedSentenceCard}}
          {{#IsSentenceCard}}
            <div class="expression expression--sentence" id="Display">
              {{#AltDisplay}}
                {{furigana:AltDisplay}}
              {{/AltDisplay}}
              {{^AltDisplay}}
                {{Sentence}}
              {{/AltDisplay}}
            </div>
          {{/IsSentenceCard}}

          {{^IsSentenceCard}}
            <div class="expression expression--word" id="Display">
              {{#AltDisplay}}
                {{furigana:AltDisplay}}
              {{/AltDisplay}}
              {{^AltDisplay}}
                {{Word}}
              {{/AltDisplay}}
            </div>
          {{/IsSentenceCard}}
        {{/IsTargetedSentenceCard}}

      {{/IsClickCard}}

    {{/IsHoverCard}}


    <!-- appears to the left -->
    <div class="flag-box">
      <svg xmlns="http://www.w3.org/2000/svg" focusable="false" viewBox="0 0 50 50"
        class="flag-box__svg" id="flag_box_svg">
        <circle id="svg_circle" class="flag-box__circle" cx="25" cy="15" r="7">
          <title id=svg_title></title>
        </circle>
      </svg>
    </div>

    <!--
      different circle positions depending on whether it's a sentence or not.
      More specifically, checks if the first character is "「",
      and adjusts the position based on that
    -->
    <script>
      var circ = document.getElementById("svg_circle");
      var d = document.getElementById("Display");
      if ("{{IsSentenceCard}}{{IsTargetedSentenceCard}}" &&
          d.innerText.length > 0 && d.innerText[0] == "「") {
        circ.setAttributeNS(null, "cx", "35");
        circ.setAttributeNS(null, "cy", "11");
      }

      // ============================
      //  Word pitch indicator color
      // ============================
      // done in javascript to simplify templating logic
      // however, special characters in the field like " can break the code
      var svgTitle = document.getElementById("svg_title");
      if (svgTitle !== null) {
        svgTitle.textContent = "PA: " + paIndicator.tooltip;
      }

      var circ = document.getElementById("svg_circle");
      circ.classList.add(paIndicator.className);
    </script>




  </div> <!-- expression box -->

{{/PADoNotShowInfo}}


<script>
  var hybridClick = function() {
    var hSent = document.getElementById("hybrid-sentence");
    var hWord = document.getElementById("hybrid-word");
    var svgEle = document.getElementById("flag_box_svg");
    var circ = document.getElementById("svg_circle");

    var colorQuotes = (document.querySelector("." + paIndicator.className) !== null);


    if (hSent.classList.contains("override-display-inline-block")) {
      // currently showing sentence, change to word
      hWord.classList.remove("override-display-none");
      hSent.classList.remove("override-display-inline-block");
      if (circ !== null) {
        circ.setAttributeNS(null, "cx", "25");
        circ.setAttributeNS(null, "cy", "15");
      }
      // re-adds if quote module enabled
      if (svgEle !== null && colorQuotes) {
        svgEle.style.display = "initial";
      }

    } else {
      // currently showing word, change to sentence
      hWord.classList.add("override-display-none");
      hSent.classList.add("override-display-inline-block");
      if (circ !== null) { // sentence
        if (hSent.innerText.length > 0 && hSent.innerText[0] === "「") {
          circ.setAttributeNS(null, "cx", "35");
          circ.setAttributeNS(null, "cy", "11");
        }
      }
      // removes if quote module enabled
      if (svgEle !== null && colorQuotes) {
        svgEle.style.display = "none";
      }
    }
  }

  var extraKeybindSettings = function(e) {
    var keys = null;

    keys = settings.keybind("toggle-hybrid-sentence");
    var hSent = document.getElementById("hybrid-sentence");
    var hWord = document.getElementById("hybrid-word");
    if (keys !== null && hSent && hWord && keys.includes(e.key)) {
      hybridClick();
    }

    keys = settings.keybind("toggle-highlight-word");
    var paButton = document.getElementById("pa-button");
    if (keys !== null && paButton && keys.includes(e.key)) {
      toggleHighlightWord();
    }
  }

  var sentences = document.querySelectorAll(".expression--sentence")
  var isAltDisplay = {{#AltDisplay}} true || {{/AltDisplay}} false ? true : false;
  if (sentences !== null) {
    for (var sent of sentences) {
      processSentence(sent, isAltDisplay);
    }
  }

</script>

{{#IsClickCard}}
  <script>
    var d = document.getElementById("Display");
    d.onclick = hybridClick;
  </script>
{{/IsClickCard}}

""",



"pa_sent_front":

r"""
{{GLOBAL_JS_TOP_PA_SENT}}

{{GLOBAL_JS_TOP}}

<div class="card-description">
  PA Sentence

  {{INFO_CIRCLE}}

  {{VERSION}}
</div>

<!-- note that for the PA separate sentence card, the front is ALWAYS a sentence -->
<!-- priority: AltDisplayPASentenceCard -> AltDisplay -> Sentence -->

<!-- option 1: AltDisplayPASentenceCard -->
{{#AltDisplayPASentenceCard}}
  <div class="expression expression--single expression--sentence" id="Display">{{furigana:AltDisplayPASentenceCard}}</div>
{{/AltDisplayPASentenceCard}}


{{^AltDisplayPASentenceCard}}
  {{#AltDisplay}}

    <div class="outer-display1
        {{^IsClickCard}} {{^IsHoverCard}} {{^IsSentenceCard}} {{^IsTargetedSentenceCard}}
          outer-display2
        {{/IsTargetedSentenceCard}} {{/IsSentenceCard}} {{/IsHoverCard}} {{/IsClickCard}}"
      id="Display">

      <!-- option 2: AltDisplay (only if the original card is a (sentence card or TSC or click or hybrid)) -->
      <!-- if any of (click, hover, sentence, TSC) -->
      <div class="expression expression--single expression--sentence inner-display1">
        {{furigana:AltDisplay}}
      </div>

      <!-- if none of (click, hover, sentence, TSC) -->
      <div class="expression expression--single expression--sentence inner-display2">
        {{Sentence}}
      </div>
    </div>

  {{/AltDisplay}}

  {{^AltDisplay}}
    <div class="expression expression--single expression--sentence" id="Display">{{Sentence}}</div>
  {{/AltDisplay}}


{{/AltDisplayPASentenceCard}}


<script>
  var isAltDisplay = (
    {{#AltDisplayPASentenceCard}} true {{/AltDisplayPASentenceCard}}
    {{^AltDisplayPASentenceCard}}
      {{#AltDisplay}}
        {{^IsClickCard}} {{^IsHoverCard}} {{^IsSentenceCard}} {{^IsTargetedSentenceCard}}
          false &&
        {{/IsTargetedSentenceCard}} {{/IsSentenceCard}} {{/IsHoverCard}} {{/IsClickCard}}
        true ? true : false
      {{/AltDisplay}}
      {{^AltDisplay}}
        false
      {{/AltDisplay}}
    {{/AltDisplayPASentenceCard}});

  var sentences = document.querySelectorAll(".expression--sentence");
  if (sentences !== null) {
    for (var sent of sentences) {
      processSentence(sent, isAltDisplay);
    }
  }
</script>
""",



"pa_word_front":

r"""
{{GLOBAL_JS_TOP_PA_WORD}}

{{GLOBAL_JS_TOP}}

<div class="card-description">
  PA Word

  {{INFO_CIRCLE}}

  {{VERSION}}
</div>

<!-- note that for the PA separate word card, the front is ALWAYS a word -->
<!-- priority: AltDisplay -> Word -->

<!-- option 1: AltDisplay (only if the original card is not a sentence card or hybrid card) -->
<div class="outer-display1
    {{^IsClickCard}} {{^IsHoverCard}} {{^IsSentenceCard}} {{^IsTargetedSentenceCard}} {{#AltDisplay}}
      outer-display2
    {{/AltDisplay}} {{/IsTargetedSentenceCard}} {{/IsSentenceCard}} {{/IsHoverCard}} {{/IsClickCard}}"
  id="Display">

  <!-- if NOT (altdisplay, AND none of (click, hover, sentence, TSC)) -->
  <div class="expression expression--single expression--word inner-display1">
    {{Word}}
  </div>

  <!-- if altdisplay, AND none of (click, hover, sentence, TSC) -->
  <div class="expression expression--single expression--word inner-display2">
    {{furigana:AltDisplay}}
  </div>
</div>
""",




"cloze_deletion_front":

r"""
{{GLOBAL_JS_TOP_CLOZE_DELETION}}

{{GLOBAL_JS_TOP}}

<div class="card-description">
  Cloze Deletion

  {{INFO_CIRCLE}}

  {{VERSION}}
</div>


<!-- defaults to alt display -->
{{#AltDisplay}}
  <div class="expression expression--single expression--sentence bold-yellow" id="Display">{{furigana:AltDisplay}}</div>
{{/AltDisplay}}

{{^AltDisplay}}
  <div class="expression expression--single expression--sentence bold-yellow" id="Display">{{Sentence}}</div>
{{/AltDisplay}}

<script>
  // I tried figuring out a way to do this with CSS, but I can't find a non-hacky way of doing so.
  // Problem: if css is display:none, anything with :after is also not displayed
  // Only working css-only solution I found was by moving the text to -9999
  // - above is hacky because copy/pastes will still copy the text
  var d = document.getElementById("Display");
  d.innerHTML = d.innerHTML.replace(/<b>.*?<\/b>/g, "<b>[...]</b>");

  var sentences = document.querySelectorAll(".expression--sentence")
  var isAltDisplay = {{#AltDisplay}} true || {{/AltDisplay}} false ? true : false;
  if (sentences !== null) {
    for (var sent of sentences) {
      processSentence(sent, isAltDisplay);
    }
  }
</script>
""",


# ===========
#  back side
# ===========
"frequencies_back":

r"""
{{#FrequenciesStylized}}
  {{FrequenciesStylized}}
{{/FrequenciesStylized}}
""",



"answer_border":

r"""
<center>
  <div class="answer-border"></div>
</center>
""",


"full_sentence":

r"""
<div class="center-box-1">
  <div class="center-box-2">
    <div class="full-sentence bold-yellow" id="full_sentence">
        {{furigana:SentenceReading}}
    </div>
  </div>
</div>
""",



"primary_definition":

r"""
<blockquote class="glossary-blockquote bold-yellow" id="primary_definition">
  {{furigana:PrimaryDefinition}}
</blockquote>
""",


"other_definitions":

r"""
{{#SecondaryDefinition}}
  <details class="glossary-details" id="secondary_definition_details">
    <summary>Secondary Definition</summary>
    <blockquote class="glossary-blockquote bold-yellow">
    {{SecondaryDefinition}}
    </blockquote>
  </details>
{{/SecondaryDefinition}}

{{#AdditionalNotes}}
  <details class="glossary-details glossary-details--small" id="additional_notes_details">
    <summary>Additional Notes</summary>
    <blockquote class="glossary-blockquote glossary-blockquote--small bold-yellow">
    {{AdditionalNotes}}
    </blockquote>
  </details>
{{/AdditionalNotes}}


{{#ExtraDefinitions}}
  <details class="glossary-details glossary-details--small" id="extra_definitions_details">
    <summary>Extra Definitions</summary>
    <blockquote class="glossary-blockquote glossary-blockquote--small bold-yellow">
    {{ExtraDefinitions}}
    </blockquote>
  </details>
{{/ExtraDefinitions}}
""",



# image zooming and jmedit replace
"modal_and_common_js":

r"""
<!--
  https://codeconvey.com/html-image-zoom-on-click/
  http://www.liangshunet.com/en/202005/743233073.htm
  https://stackoverflow.com/questions/8449933/how-to-transition-css-display-opacity-properties
  https://www.javascripttutorial.net/dom/css/add-styles-to-an-element/
  https://stackoverflow.com/questions/507138/how-to-add-a-class-to-a-given-element
-->
<!-- The Modal -->
<div id="modal" class="modal">
  <img class="modal-img" id="bigimg">
</div>

<script>
  var modal = document.getElementById('modal');
  var modalImg = document.getElementById("bigimg");

  // restricting the max height of image to the definition box
  var dhLeft = document.getElementById("dh_left");
  var dhRight = document.getElementById("dh_right");
  var heightLeft = dhLeft.offsetHeight;

  if (dhRight) {
    dhRight.style.maxHeight = heightLeft + "px";

    // setting up the modal styles and clicking
    var dhImgContainer = document.getElementById("dh_img_container");
    var imgList = dhImgContainer.getElementsByTagName("img");

    if (imgList && imgList.length === 1) {
      var img = dhImgContainer.getElementsByTagName("img")[0];
      img.classList.add("dh-right__img");
      img.style.maxHeight = heightLeft + "px"; // restricts max height here too

      img.onclick = function() {
        modal.style.display = "block";
        modalImg.src = this.src;
      }

    } else { // otherwise we hope that there are 0 images here
      // support for no images here: remove the fade-in / fade-out on text
      // the slightly hacky method is just to remove the class all together lol
      dhImgContainer.className = "";
    }
  }


  // close the modal upon click
  modal.onclick = function() {
    bigimg.classList.add("modal-img__zoom-out");
    modal.classList.add("modal-img__zoom-out");
    setTimeout(function() {
      modal.style.display = "none";
      bigimg.className = "modal-img";
      modal.className = "modal";
    }, 200);
  }

  // creates a custom image container to hold yomichan images
  function createImgContainer(imgName) {
    // creating this programmically:
    // <span class="glossary__image-container">
    //   <a class="glossary__image-hover-text" href='javascript:;'>[Image]</a>
    //   <img class="glossary__image-hover-media" src="${imgName}">
    // </span>

    var defSpan = document.createElement('span');
    defSpan.classList.add("glossary__image-container");

    var defAnc = document.createElement('a');
    defAnc.classList.add("glossary__image-hover-text");
    defAnc.href = "javascript:;'>[Image]";
    defAnc.textContent = "[Image]";

    var defImg = document.createElement('img');
    defImg.classList.add("glossary__image-hover-media");
    defImg.src = imgName;

    defImg.onclick = function() {
      modal.style.display = "block";
      modalImg.src = this.src;
    }

    defAnc.onclick = function() {
      modal.style.display = "block";
      modalImg.src = defImg.src;
    }

    defSpan.appendChild(defAnc);
    defSpan.appendChild(defImg);

    return defSpan;
  }

  // remove all jmdict english dict tags
  var glossaryEle = document.getElementById("primary_definition");
  glossaryEle.innerHTML = glossaryEle.innerHTML.replace(/, JMdict \(English\)/g, "");

  // goes through each blockquote and searches for yomichan inserted images
  var imageSearchElements = document.getElementsByTagName("blockquote");
  for (var searchEle of imageSearchElements) {
    anchorTags = searchEle.getElementsByTagName("a");
    for (var atag of anchorTags) {
      var imgFileName = atag.getAttribute("href");
      if (imgFileName && imgFileName.substring(0, 25) === "yomichan_dictionary_media") {
        var fragment = createImgContainer(imgFileName);
        atag.parentNode.replaceChild(fragment, atag);
      }
    }
  }
</script>
""",



}
