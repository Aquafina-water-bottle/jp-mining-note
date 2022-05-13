# ALL templates defined below must follow the corresponding format:

class TemplatesRaw:
    hint = r"""
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

{{#HintNotHidden}}
  <div class="center-box-1 hint">
    <div class="center-box-2">
      <div class="bold-yellow">{{HintNotHidden}}</div>
    </div>
  </div>
{{/HintNotHidden}}
"""

    full_sentence_front = r"""
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
"""

    main_front = r"""
<div class="card-description">
  Mining Card:

  {{#IsSentenceCard}}
      Sentence
  {{/IsSentenceCard}}

  {{^IsSentenceCard}}
      Word
  {{/IsSentenceCard}}

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

        {{#IsSentenceCard}}
            Sentence
        {{/IsSentenceCard}}

        {{^IsSentenceCard}}
            Word
        {{/IsSentenceCard}}

      {{/PATestOnlyWord}} {{/PASeparateSentenceCard}}

    {{/PASeparateWordCard}} {{/PADoNotTest}}

  {{/PADoNotShowInfoLegacy}}
</div>





<!-- legacy display -->
{{#PADoNotShowInfoLegacy}}

  <!-- priority is on the alternate display sentence -->
  {{#AltDisplay}}
    {{#IsSentenceCard}}
      <div class="expression expression--single" id="Display">{{furigana:AltDisplay}}</div>
    {{/IsSentenceCard}}

    {{^IsSentenceCard}}
      <div class="expression expression--single expression--word" id="Display">{{furigana:AltDisplay}}</div>
    {{/IsSentenceCard}}
  {{/AltDisplay}}


  <!-- no alt display sentence, not listening card -->
  {{^AltDisplay}}
    {{#IsSentenceCard}}
      <div class="expression expression--single" id="Display">「{{Sentence}}」</div>
    {{/IsSentenceCard}}

    {{^IsSentenceCard}}
      <div class="expression expression--single expression--word" id="Display">{{Word}}</div>
    {{/IsSentenceCard}}
  {{/AltDisplay}}

{{/PADoNotShowInfoLegacy}}


<!-- regular display -->
{{^PADoNotShowInfoLegacy}}
  <div class="expression-box">

    <div class="flag-box">
      <svg xmlns="http://www.w3.org/2000/svg" focusable="false" viewBox="0 0 50 50"
        style="display:inline-block;vertical-align:middle;height:1.5em;">
        <circle id="svg_circle" class="flag-box__circle" cx="25" cy="15" r="7">
          <title id=svg_title></title>
        </circle>
      </svg>
    </div>

    {{#IsSentenceCard}}
      <!--
        different circle positions depending on whether it's a sentence or not.
        More specifically, checks if the first character is "「",
        and adjusts the position based on that
      -->
      <script>
        var circ = document.getElementById("svg_circle");
        var d = document.getElementById("Display");
        if (d.innerText.length > 0 && d.innerText[0] == "「") {
          circ.setAttributeNS(null, "cx", "35");
          circ.setAttributeNS(null, "cy", "11");
        }
      </script>
    {{/IsSentenceCard}}

    <script>
      // ============================
      //  Word pitch indicator color
      // ============================
      // done in javascript to simplify templating logic
      // however, special characters in the field like " can break the code
      var svgTitle = document.getElementById("svg_title");
      var styleClass = "";

      if ("{{PADoNotTest}}{{PASeparateWordCard}}") {
        // PADoNotTest or PASeparateWordCard
        styleClass = "flag-box__circle--none";
        svgTitle.textContent = "PA: Do not test";
      } else {
        if ("{{PASeparateSentenceCard}}{{PATestOnlyWord}}") {
          // either PASeparateSentenceCard or PATestOnlyWord
          styleClass = "flag-box__circle--word";
          svgTitle.textContent = "PA: Word";
        } else {
          styleClass = "flag-box__circle--all";
          svgTitle.textContent = "PA: Sentence";
        }

        // ~(isSentenceCard) overrides color (should 'test all')
        if (!"{{IsSentenceCard}}") {
          styleClass = "flag-box__circle--all"
        }
      }

      var circ = document.getElementById("svg_circle");
      circ.classList.add(styleClass);
    </script>



    <!-- priority is on the alternate display sentence -->
    {{#AltDisplay}}
      {{#IsSentenceCard}}
        <div class="expression" id="Display">{{furigana:AltDisplay}}</div>
      {{/IsSentenceCard}}

      {{^IsSentenceCard}}
        <div class="expression expression--word" id="Display">{{furigana:AltDisplay}}</div>
      {{/IsSentenceCard}}
    {{/AltDisplay}}


    <!-- no alt display sentence, not listening card -->
    {{^AltDisplay}}
      {{#IsSentenceCard}}
        <div class="expression" id="Display">「{{Sentence}}」</div>
      {{/IsSentenceCard}}

      {{^IsSentenceCard}}
        <div class="expression expression--word" id="Display">{{Word}}</div>
      {{/IsSentenceCard}}
    {{/AltDisplay}}

  </div>

{{/PADoNotShowInfoLegacy}}
"""

    pa_sent_front = r"""
<div class="card-description">
  PA Sentence Card
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
"""

    pa_word_front = r"""
<div class="card-description">
  PA Word Card
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
"""

    cloze_deletion_front = r"""
<div class="card-description">
  Mining Card: Cloze Deletion
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
"""

    # back side

    answer_border = r"""
<center>
  <div class="answer-border"></div>
</center>
"""

    full_sentence = r"""
<div class="center-box-1">
  <div class="center-box-2">
    <div class="full-sentence bold-yellow" id="full_sentence">
        {{furigana:SentenceReading}}
    </div>
  </div>
</div>
"""

    primary_definition = r"""
<blockquote class="glossary-blockquote bold-yellow" id="primary_definition">
  {{furigana:PrimaryDefinition}}
</blockquote>
"""

    other_definitions = r"""
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
"""

    # image zooming and jmedit replace
    modal_and_common_js = r"""
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
"""

    play_sentence_only_js = r"""
<script>
  // THIS IS A HACK to play sentence audio first and to not autoplay the word audio
  var elem = document.querySelector("#audio_play_first .soundLink, #audio_play_first .replaybutton");
  if (elem) {
    elem.click();
  }
</script>
"""


