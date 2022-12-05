{% from "modules/main.html" import modules with context %}

/// {% set functions %}

function hybridClick() {
  const toggleEle = document.getElementById("hybrid_click_toggle");
  if (toggleEle !== null) {
    toggleEle.checked = !toggleEle.checked;
  }
}


{% if "keybinds" in modules.keys() %}

  function sentenceKeybinds(e) {
    if (KEYBINDS.hasKey(e, {{ utils.opt("keybinds", "toggle-hybrid-sentence") }})) {
      hybridClick();
    }

    if (KEYBINDS.hasKey(e, {{ utils.opt("keybinds", "toggle-highlight-word") }})) {
      let paButton = document.getElementById("pa_button");
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




/// {% set run %}
{

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







