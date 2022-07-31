/// {% set functions %}
  function hybridClick() {
    var hSent = document.getElementById("hybrid-sentence");
    var hWord = document.getElementById("hybrid-word");
    var svgEle = document.getElementById("flag_box_svg");
    var circ = document.getElementById("svg_circle");


    if (hSent.classList.contains("override-display-inline-block")) {
      // currently showing sentence, change to word
      hWord.classList.remove("override-display-none");
      hSent.classList.remove("override-display-inline-block");
      if (circ !== null) {
        circ.setAttributeNS(null, "cx", "25");
        circ.setAttributeNS(null, "cy", "15");
      }
      // re-adds if quote module enabled
      if (svgEle !== null && note.colorQuotes) {
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
      if (svgEle !== null && note.colorQuotes) {
        svgEle.style.display = "none";
      }
    }
  }

/// {% endset %}


/// {% set keybind_settings %}

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

/// {% endset %}




/// {% set run %}
  var sentences = document.querySelectorAll(".expression--sentence")
  var isAltDisplay = false;
  var isClozeDeletion = false;

  isAltDisplay = !!'{{ utils.any_of_str("AltDisplay") }}';

  if (sentences !== null) {
    for (var sent of sentences) {
      processSentence(sent, isAltDisplay);
    }
  }

  /// {% call IF("IsClickCard") %}
  var d = document.getElementById("Display");
  d.onclick = hybridClick;
  /// {% endcall %}



  /// {% call IF("PAShowInfo") %}
  // different circle positions depending on whether it's a sentence or not.
  // More specifically, checks if the first character is "「",
  // and adjusts the position based on that

  var circ = document.getElementById("svg_circle");
  var d = document.getElementById("Display");
  if ('{{ utils.any_of_str("IsSentenceCard", "IsTargetedSentenceCard") }}' &&
      d.innerText.length > 0 && d.innerText[0] == "「") { // TODO: compatability with quote module
    circ.setAttributeNS(null, "cx", "35");
    circ.setAttributeNS(null, "cy", "11");
  }

  // ============================
  //  Word pitch indicator color
  // ============================
  // done in javascript to simplify templating logic
  var svgTitle = document.getElementById("svg_title");
  if (svgTitle !== null) {
    svgTitle.textContent = "PA: " + paIndicator.tooltip;
  }

  var circ = document.getElementById("svg_circle");
  circ.classList.add(paIndicator.className);
  /// {% endcall %}


/// {% endset %}







