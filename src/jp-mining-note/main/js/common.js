
/// {% set functions %}

function hybridClick() {
  const hSent = document.getElementById("hybrid-sentence");
  const hWord = document.getElementById("hybrid-word");
  const svgEle = document.getElementById("flag_box_svg");
  const circ = document.getElementById("pa_indicator_circle");

  if (hSent.classList.contains("override-display-inline-block")) {
    // currently showing sentence, change to word
    hWord.classList.remove("override-display-none");
    hSent.classList.remove("override-display-inline-block");
    if (circ !== null) {
      circ.setAttributeNS(null, "cx", "25");
      circ.setAttributeNS(null, "cy", "15");
    }

    // re-adds if colored quotes exist
    if (svgEle !== null && hSent.hasAttribute("data-color-quotes")) {
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

    // removes if colored quotes exist
    if (svgEle !== null && hSent.hasAttribute("data-color-quotes")) {
      svgEle.style.display = "none";
    }
  }
}

/// {% endset %}


/// {% set keybind_settings %}

keys = {{ utils.opt("keybinds", "toggle-hybrid-sentence") }};
if (keys !== null && keys.includes(e.key)) {
  let hSent = document.getElementById("hybrid-sentence");
  let hWord = document.getElementById("hybrid-word");
  if (hSent !== null && hWord !== null) {
    hybridClick();
  }
}

keys = {{ utils.opt("keybinds", "toggle-highlight-word") }};
if (keys !== null && keys.includes(e.key)) {
  let paButton = document.getElementById("pa-button");
  if (paButton !== null) {
    toggleHighlightWord();
  }
}

/// {% endset %}




/// {% set run %}

// required for the sentence utils module
var paIndicator;

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
/// {% endcall %}

{

  /// {% call IF("IsClickCard") %}
  let d = document.getElementById("display");
  d.onclick = hybridClick;
  /// {% endcall %}


  /// {% call IF("PAShowInfo") %}
  // ============================
  //  Word pitch indicator color
  // ============================
  // done in javascript to simplify templating logic
  let circ = document.getElementById("pa_indicator_circle");
  let svgTitle = document.getElementById("svg_title");

  if (svgTitle !== null) {
    svgTitle.textContent = "PA: " + paIndicator.tooltip;
  }

  circ.classList.add(paIndicator.className);
  /// {% endcall %}
}
/// {% endset %}







