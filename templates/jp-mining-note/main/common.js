/// {% set functions %}
function hybridClick() {
  let hSent = document.getElementById("hybrid-sentence");
  let hWord = document.getElementById("hybrid-word");
  let svgEle = document.getElementById("flag_box_svg");
  let circ = document.getElementById("svg_circle");


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

//keys = settings.keybind("toggle-hybrid-sentence");
keys = {{ utils.opt("keybinds", "toggle-hybrid-sentence") }};
if (keys !== null && keys.includes(e.key)) {
  let hSent = document.getElementById("hybrid-sentence");
  let hWord = document.getElementById("hybrid-word");
  if (hSent !== null && hWord !== null) {
    hybridClick();
  }
}

//keys = settings.keybind("toggle-highlight-word");
keys = {{ utils.opt("keybinds", "toggle-highlight-word") }};
if (keys !== null && keys.includes(e.key)) {
  let paButton = document.getElementById("pa-button");
  if (paButton !== null) {
    toggleHighlightWord();
  }
}

/// {% endset %}




/// {% set run %}
{
  let isAltDisplay = !!'{{ utils.any_of_str("AltDisplay") }}';
  processSentences(isAltDisplay);

  let d = document.getElementById("display");
  let circ = document.getElementById("svg_circle");
  let svgTitle = document.getElementById("svg_title");

  /// {% call IF("IsClickCard") %}
  d.onclick = hybridClick;
  /// {% endcall %}



  /// {% call IF("PAShowInfo") %}
  // different circle positions depending on whether it's a sentence or not.
  // More specifically, checks if the first character is "「",
  // and adjusts the position based on that

  if ('{{ utils.any_of_str("IsSentenceCard", "IsTargetedSentenceCard") }}' &&
      d.innerText.length > 0 && d.innerText[0] == "「") { // TODO: compatability with quote module
    circ.setAttributeNS(null, "cx", "35");
    circ.setAttributeNS(null, "cy", "11");
  }

  // ============================
  //  Word pitch indicator color
  // ============================
  // done in javascript to simplify templating logic
  if (svgTitle !== null) {
    svgTitle.textContent = "PA: " + paIndicator.tooltip;
  }

  circ.classList.add(paIndicator.className);
  /// {% endcall %}
}
/// {% endset %}







