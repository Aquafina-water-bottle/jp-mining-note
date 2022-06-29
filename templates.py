
with open("version.txt") as file:
    version = file.read().strip()


#class TemplatesRaw:
TEMPLATES = {

"version":

rf"""
<div class="card-description-ver">Mining Card: Version {version}</div>
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
  <details class="hint">
    <summary>Hint</summary>
    <div class="center-box-1">
      <div class="center-box-2">
        <div class="bold-yellow">{{Hint}}</div>
      </div>
    </div>
  </details>
{{/Hint}}
""",



"process_sent_js":

r"""
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
""",


# processes display sentence
"process_sent":


r"""

/* processes the sentence (if there is no altdisplay)
 * - removes newlines
 * - finds the shortest possible sentence around the bolded characters
 */

// removes linebreaks
var temp = sent.innerHTML.replace(/<br>/g, "");

// removes leading and trailing white space (equiv. of strip() in python)
temp = temp.trim();

// selects the smallest containing sentence
//temp = selectSentence(temp);


sent.innerHTML = temp;
""",



"full_sentence_front":

r"""
<details>
  <summary class=glossary-details>Full Sentence</summary>
  <div class="center-box-1">
    <div class="center-box-2">
      <div class="full-sentence bold-yellow" id="full_sentence_front">
        {{furigana:SentenceReading}}
      </div>
    </div>
  </div>
</details>
""",



"main_front":

r"""

<script>
  /*
   * Options for the main card.
   *
   * Options are set around the "AJT Flexible Grading" addon, where h, j, k and l keys
   * are used to grade cards. In other words, all keybinds here should be usable
   * by the right hand.
   *
   * TODO move to a separate js file (say, "options.js") and update documentation
   */

  // Keybind to toggle between showing the sentence and word on click and hover cards.
  // Equivalent to either clicking on the sentence/word on a click card,
  // or hovering over the word on a hover card.
  const KB_TOGGLE_HYBRID_SENTENCE = ["Shift", "n"];

  // Keybind to toggle between showing the tested word in a raw sentence card.
  // Equivalent to clicking on the "show" button.
  // This is the same as the above because both should never happen at the same time.
  const KB_TOGGLE_HIGHLIGHT_WORD = ["Shift", "n,"];

  // Keybind to play the sentence audio (if available)
  const KB_PLAY_SENTENCE_AUDIO = ["p"];

  // Keybind to play the word audio (if available)
  const KB_PLAY_WORD_AUDIO = ["w", "o"];

  // Keybind to zoom into the image (if available)
  const KB_TOGGLE_IMAGE_ZOOM = ["i"];

  // Keybind to toggle furigana on the full sentence
  const KB_TOGGLE_FURIGANA = ["f", "m"];
</script>


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

  /

  {{#PADoNotShowInfoLegacy}}
    Legacy
  {{/PADoNotShowInfoLegacy}}

  <!-- not legacy card -->
  {{^PADoNotShowInfoLegacy}}

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

  {{/PADoNotShowInfoLegacy}}

  {{VERSION}}
</div>





<!-- legacy display -->
{{#PADoNotShowInfoLegacy}}

  <!-- priority is on the alternate display sentence -->

  {{#IsHoverCard}}
    <!-- fallback card card html
      in css: default hybrid css, but with hover instead of click -->
    <div class="expression__hybrid-wrapper">
      <div class="expression expression--single expression__hybrid expression__hybrid--hover" id="Display">
        <span class="expression__hybrid-sentence
                     {{^IsSentenceCard}} bold-yellow {{/IsSentenceCard}}
                     {{#IsTargetedSentenceCard}} bold-yellow {{/IsTargetedSentenceCard}}"
              id="hybrid-sentence">
          {{#AltDisplay}}
            {{furigana:AltDisplay}}
          {{/AltDisplay}}
          {{^AltDisplay}}
            「{{Sentence}}」
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
          <span class="expression__hybrid-sentence
                       {{^IsSentenceCard}} bold-yellow {{/IsSentenceCard}}
                       {{#IsTargetedSentenceCard}} bold-yellow {{/IsTargetedSentenceCard}}"
                id="hybrid-sentence">
            {{#AltDisplay}}
              {{furigana:AltDisplay}}
            {{/AltDisplay}}
            {{^AltDisplay}}
              「{{Sentence}}」
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
        <div class="expression expression--single bold-yellow" id="Display">
          {{#AltDisplay}}
            {{furigana:AltDisplay}}
          {{/AltDisplay}}
          {{^AltDisplay}}
            「{{Sentence}}」
          {{/AltDisplay}}
        </div>
      {{/IsTargetedSentenceCard}}

      {{^IsTargetedSentenceCard}}
        {{#IsSentenceCard}}
          <div class="expression expression--single" id="Display">
            {{#AltDisplay}}
              {{furigana:AltDisplay}}
            {{/AltDisplay}}
            {{^AltDisplay}}
              「{{Sentence}}」
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

{{/PADoNotShowInfoLegacy}}


<!-- regular display -->
{{^PADoNotShowInfoLegacy}}
  <div class="expression expression-box">

    <div class="flag-box">
      <svg xmlns="http://www.w3.org/2000/svg" focusable="false" viewBox="0 0 50 50"
        style="display:inline-block;vertical-align:middle;height:1.5em;">
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
      if ("{{IsSentenceCard}}" &&
          d.innerText.length > 0 && d.innerText[0] == "「") {
        circ.setAttributeNS(null, "cx", "35");
        circ.setAttributeNS(null, "cy", "11");
      }
    </script>

    <script>
      // ============================
      //  Word pitch indicator color
      // ============================
      // done in javascript to simplify templating logic
      // however, special characters in the field like " can break the code
      var svgTitle = document.getElementById("svg_title");
      var styleClass = "";

      if ("{{PADoNotTest}}{{PASeparateWordCard}}") {
        // PADoNotTest or PASeparateWordCard -> nothing is tested
        styleClass = "flag-box__circle--none";
        svgTitle.textContent = "PA: Do not test";
      } else if ("{{PASeparateSentenceCard}}{{PATestOnlyWord}}") {
        // either PASeparateSentenceCard or PATestOnlyWord -> only word is tested
        styleClass = "flag-box__circle--word";
        svgTitle.textContent = "PA: Word";
      } else if ("{{IsSentenceCard}}") {
        // sentence card but no pitch accent indicators are overridden
        styleClass = "flag-box__circle--sentence";
        svgTitle.textContent = "PA: Sentence";
      } else {
        // regular word card
        styleClass = "flag-box__circle--word";
        svgTitle.textContent = "PA: Word";
      }

      var circ = document.getElementById("svg_circle");
      circ.classList.add(styleClass);
    </script>



    <!-- priority is on the alternate display sentence -->


    {{#IsHoverCard}}
      <!-- fallback card card html
        in css: default hybrid css, but with hover instead of click -->
      <div class="expression__hybrid-wrapper">
        <div class="expression expression__hybrid expression__hybrid--hover" id="Display">
          <span class="expression__hybrid-sentence
                       {{^IsSentenceCard}} bold-yellow {{/IsSentenceCard}}
                       {{#IsTargetedSentenceCard}} bold-yellow {{/IsTargetedSentenceCard}}"
                id="hybrid-sentence">
            {{#AltDisplay}}
              {{furigana:AltDisplay}}
            {{/AltDisplay}}
            {{^AltDisplay}}
              「{{Sentence}}」
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
            <span class="expression__hybrid-sentence
                         {{^IsSentenceCard}} bold-yellow {{/IsSentenceCard}}
                         {{#IsTargetedSentenceCard}} bold-yellow {{/IsTargetedSentenceCard}}"
                id="hybrid-sentence">
              {{#AltDisplay}}
                {{furigana:AltDisplay}}
              {{/AltDisplay}}
              {{^AltDisplay}}
                「{{Sentence}}」
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
          <div class="expression bold-yellow" id="Display">
            {{#AltDisplay}}
              {{furigana:AltDisplay}}
            {{/AltDisplay}}
            {{^AltDisplay}}
              「{{Sentence}}」
            {{/AltDisplay}}
          </div>
        {{/IsTargetedSentenceCard}}

        {{^IsTargetedSentenceCard}}
          {{#IsSentenceCard}}
            <div class="expression" id="Display">
              {{#AltDisplay}}
                {{furigana:AltDisplay}}
              {{/AltDisplay}}
              {{^AltDisplay}}
                「{{Sentence}}」
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


  </div> <!-- expression box -->

{{/PADoNotShowInfoLegacy}}


<script>
var hybridClick = function() {
  var hSent = document.getElementById("hybrid-sentence");
  var hWord = document.getElementById("hybrid-word");
  var circ = document.getElementById("svg_circle");
  if (hSent.classList.contains("override-display-inline-block")) {
    // currently showing sentence
    hWord.classList.remove("override-display-none");
    hSent.classList.remove("override-display-inline-block");
    if (circ !== null) {
      circ.setAttributeNS(null, "cx", "25");
      circ.setAttributeNS(null, "cy", "15");
    }
  } else {
    // currently showing word
    hWord.classList.add("override-display-none");
    hSent.classList.add("override-display-inline-block");
    if (circ !== null) { // sentence
      if (hSent.innerText.length > 0 && hSent.innerText[0] == "「") {
        circ.setAttributeNS(null, "cx", "35");
        circ.setAttributeNS(null, "cy", "11");
      }
    }
  }
}


// shift to switch between sentence & word on click & hover cards
// NOTICE: we MUST use document.onkeyup instead of document.addEventListener(...)
// because functions persist and cannot be easily removed within anki,
// whereas .onkeyup = ... replaces the previous function with the current.
document.onkeyup = (e => {
  var hSent = document.getElementById("hybrid-sentence");
  var hWord = document.getElementById("hybrid-word");
  var paButton = document.getElementById("pa-button");

  if (hSent && hWord && KB_TOGGLE_HYBRID_SENTENCE.includes(e.key)) {
    hybridClick();
  }
  if (paButton && KB_TOGGLE_HIGHLIGHT_WORD.includes(e.key)) {
    toggleHighlightWord();
  }
  {{#SentenceAudio}}
    if (KB_PLAY_SENTENCE_AUDIO.includes(e.key)) {
      var elem = document.querySelector("#sentence-audio .soundLink, #sentence-audio .replaybutton");
      if (elem) {
        elem.click();
      }
    }
  {{/SentenceAudio}}
})


</script>

{{#IsClickCard}}
  <script>
    var d = document.getElementById("Display");
    d.onclick = hybridClick;
  </script>
{{/IsClickCard}}

{{^AltDisplay}}
  <script>
    {{PROCESS_SENT_JS}}

    var sent = null;
    if ("{{IsClickCard}}{{IsHoverCard}}") {
      sent = document.getElementById("hybrid-sentence");
    } else if ("{{IsSentenceCard}}") {
      sent = document.getElementById("Display");
    }
    if (sent !== null) {
      {{PROCESS_SENT}}
    }
  </script>
{{/AltDisplay}}
""",



"pa_sent_front":

r"""
<div class="card-description">
  PA Sentence
  {{VERSION}}
</div>

<!-- note that for the PA separate sentence card, the front is ALWAYS a sentence -->
<!-- priority: AltDisplayPASentenceCard -> AltDisplay -> Sentence -->

<!-- option 1: AltDisplayPASentenceCard -->
{{#AltDisplayPASentenceCard}}
  <div class="expression expression--single" id="Display">{{furigana:AltDisplayPASentenceCard}}</div>
{{/AltDisplayPASentenceCard}}


{{^AltDisplayPASentenceCard}}
  <!-- option 2: AltDisplay (only if the original card is a sentence card) -->
  <!--IsSentenceCard and AltDisplay -->
  {{#IsSentenceCard}} {{#AltDisplay}}
      <div class="expression expression--single" id="Display">{{furigana:AltDisplay}}</div>
  {{/AltDisplay}} {{/IsSentenceCard}}

  <!-- option 3: Sentence -->
  <!-- opposite of above ~(IsSentenceCard ^ AltDisplay) -->
  {{#IsSentenceCard}} {{^AltDisplay}}
    <div class="expression expression--single" id="Display">「{{Sentence}}」</div>
  {{/AltDisplay}} {{/IsSentenceCard}}
  {{^IsSentenceCard}} {{#AltDisplay}}
    <div class="expression expression--single" id="Display">「{{Sentence}}」</div>
  {{/AltDisplay}} {{/IsSentenceCard}}
  {{^IsSentenceCard}} {{^AltDisplay}}
    <div class="expression expression--single" id="Display">「{{Sentence}}」</div>
  {{/AltDisplay}} {{/IsSentenceCard}}

{{/AltDisplayPASentenceCard}}

{{^AltDisplay}}
  <script>
    {{PROCESS_SENT_JS}}

    sent = document.getElementById("Display");
    if (sent !== null) {
      {{PROCESS_SENT}}
    }
  </script>
{{/AltDisplay}}
""",



"pa_word_front":

r"""
<div class="card-description">
  PA Word
  {{VERSION}}
</div>

<!-- note that for the PA separate word card, the front is ALWAYS a word -->
<!-- priority: AltDisplay -> Word -->

<!-- option 1: AltDisplay (only if the original card is not a sentence card) -->
{{^IsSentenceCard}} {{#AltDisplay}}
  <div class="expression expression--single expression--word" id="Display">{{furigana:AltDisplay}}</div>
{{/AltDisplay}} {{/IsSentenceCard}}

<!-- option 2: Word -->
<!-- opposite of above ~(~IsSentenceCard ^ AltDisplay) -->
{{#IsSentenceCard}} {{#AltDisplay}}
  <div class="expression expression--single expression--word" id="Display">{{Word}}</div>
{{/AltDisplay}} {{/IsSentenceCard}}
{{#IsSentenceCard}} {{^AltDisplay}}
  <div class="expression expression--single expression--word" id="Display">{{Word}}</div>
{{/AltDisplay}} {{/IsSentenceCard}}
{{^IsSentenceCard}} {{^AltDisplay}}
  <div class="expression expression--single expression--word" id="Display">{{Word}}</div>
{{/AltDisplay}} {{/IsSentenceCard}}

{{^AltDisplay}}
  <script>
    sent = document.getElementById("Display");
    if (sent !== null) {
      {{PROCESS_SENT}}
    }
  </script>
{{/AltDisplay}}
""",




"cloze_deletion_front":

r"""
<div class="card-description">
  Cloze Deletion
  {{VERSION}}
</div>


<!-- defaults to alt display -->
{{#AltDisplay}}
  <div class="expression expression--single bold-yellow" id="Display">{{furigana:AltDisplay}}</div>
{{/AltDisplay}}

{{^AltDisplay}}
  <div class="expression expression--single bold-yellow" id="Display">「{{Sentence}}」</div>
{{/AltDisplay}}

<script>
  // I tried figuring out a way to do this with CSS, but I can't find a non-hacky way of doing so.
  // Problem: if css is display:none, anything with :after is also not displayed
  // Only working css-only solution I found was by moving the text to -9999
  // - above is hacky because copy/pastes will still copy the text
  var d = document.getElementById("Display");
  d.innerHTML = d.innerHTML.replace(/<b>.*?<\/b>/g, "<b>[...]</b>");
</script>

{{^AltDisplay}}
  <script>
    sent = document.getElementById("Display");
    if (sent !== null) {
      {{PROCESS_SENT}}
    }
  </script>
{{/AltDisplay}}
""",


# back side
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
  <details class="glossary-details">
    <summary>Secondary Definition</summary>
    <blockquote class="glossary-blockquote bold-yellow">
    {{SecondaryDefinition}}
    </blockquote>
  </details>
{{/SecondaryDefinition}}

{{#AdditionalNotes}}
  <details class="glossary-details glossary-details--small">
    <summary>Additional Notes</summary>
    <blockquote class="glossary-blockquote glossary-blockquote--small bold-yellow">
    {{AdditionalNotes}}
    </blockquote>
  </details>
{{/AdditionalNotes}}


{{#ExtraDefinitions}}
  <details class="glossary-details glossary-details--small">
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
  dhRight.style.maxHeight = heightLeft + "px";


  // setting up the modal styles and clicking
  var dhImgContainer = document.getElementById("dh_img_container");
  var imgList = dhImgContainer.getElementsByTagName("img");

  if (imgList.length == 1) {
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
      if (imgFileName && imgFileName.substring(0, 25) == "yomichan_dictionary_media") {
        var fragment = createImgContainer(imgFileName);
        atag.parentNode.replaceChild(fragment, atag);
      }
    }
  }
</script>
""",



"play_sentence_only_js":

r"""
<script>
  // THIS IS A HACK to play sentence audio first and to not autoplay the word audio
  var elem = document.querySelector("#audio_play_first .soundLink, #audio_play_first .replaybutton");
  if (elem) {
    elem.click();
  }
</script>
"""

}
