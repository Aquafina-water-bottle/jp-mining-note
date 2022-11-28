{% from "modules/main.html" import modules with context %}

/// {% set functions %}

function hybridClick() {
  {% if "time-performance" in modules.keys() %}
  TIME_PERFORMANCE.start("hybridClick");
  {% endif %}

  const hSent = document.getElementById("hybrid-sentence");
  const hWord = document.getElementById("hybrid-word");
  const svgEle = document.getElementById("flag_box_svg");
  const paInd = document.getElementById("pa_indicator");

  if (hSent.classList.contains("override-display-inline-block")) {
    // currently showing sentence, change to word
    hWord.classList.toggle("override-display-none", false);
    hSent.classList.toggle("override-display-inline-block", false);
    paInd.classList.toggle("pa-indicator--sentence", false)

    // re-adds if colored quotes exist
    if (svgEle !== null && hSent.hasAttribute("data-color-quotes")) {
      svgEle.style.display = "initial";
    }

  } else {
    // currently showing word, change to sentence
    hWord.classList.toggle("override-display-none", true);
    hSent.classList.toggle("override-display-inline-block", true);
    paInd.classList.toggle("pa-indicator--sentence", true)

    // removes if colored quotes exist
    if (svgEle !== null && hSent.hasAttribute("data-color-quotes")) {
      svgEle.style.display = "none";
    }
  }

  {% if "time-performance" in modules.keys() %}
  TIME_PERFORMANCE.stop("hybridClick");
  {% endif %}
}


{% if "keybinds" in modules.keys() %}

  function sentenceKeybinds(e) {
    if (KEYBINDS.hasKey(e, {{ utils.opt("keybinds", "toggle-hybrid-sentence") }})) {
      let hSent = document.getElementById("hybrid-sentence");
      let hWord = document.getElementById("hybrid-word");
      if (hSent !== null && hWord !== null) {
        hybridClick();
      }
    }

    if (KEYBINDS.hasKey(e, {{ utils.opt("keybinds", "toggle-highlight-word") }})) {
      let paButton = document.getElementById("pa-button");
      if (paButton !== null) {
        toggleHighlightWord();
      }
    }
  }

  KEYBINDS.addFunc("sentenceKeybinds", sentenceKeybinds);

{% endif %}


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
    my.tooltip = "{{ TRANSLATOR.get('pa-indicator-do-not-test') }}"
  } else if (my.type == "word") {
    my.tooltip = "{{ TRANSLATOR.get('pa-indicator-word') }}"
  } else { // sentence
    my.tooltip = "{{ TRANSLATOR.get('pa-indicator-sentence') }}"
  }

  return my;
}());
/// {% endcall %}


/// {% endset %}


/// {% set keybind_settings %}

keys = {{ utils.opt("keybinds", "toggle-hybrid-sentence") }};
if (keys !== null && keys.includes(e.code)) {
  let hSent = document.getElementById("hybrid-sentence");
  let hWord = document.getElementById("hybrid-word");
  if (hSent !== null && hWord !== null) {
    hybridClick();
  }
}

keys = {{ utils.opt("keybinds", "toggle-highlight-word") }};
if (keys !== null && keys.includes(e.code)) {
  let paButton = document.getElementById("pa-button");
  if (paButton !== null) {
    toggleHighlightWord();
  }
}

/// {% endset %}




/// {% set run %}
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
    svgTitle.textContent = "{{ TRANSLATOR.get('pa-indicator-prefix') }}" + paIndicator.tooltip;
  }

  circ.classList.add(paIndicator.className);
  /// {% endcall %}
}
/// {% endset %}







