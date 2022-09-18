{% from "modules/main.html" import modules with context %}

{%- for m in modules -%}
{%- if m.js is defined and m.js.globals.get(note.card_type, note.side) %}
// GLOBALS: {{ m.id }}
{{ m.js.globals.get(note.card_type, note.side) }}
{% endif -%}
{%- endfor -%}



(function () { // restricts ALL javascript to hidden scope

// "global" variables within the hidden scope
let note = (function () {
  let my = {};
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
        LOGGER.warn("Option " + keys.join(".") + " is not defined in the options file.");
      }
      return defaultVal;
    }
    obj = obj[key];
  }
  return obj;
};


{% if note.card_type != "pa_word" %}

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

{% endif %}{# note.card_type != "pa_word" #}


// START_BLOCK: js_functions
{% block js_functions %}
{% endblock %}
// END_BLOCK: js_functions

{% for m in modules -%}
{%- if m.js is defined %}

{{ m.js.functions.get(note.card_type, note.side) }}
{% endif -%}
{%- endfor %}


// a general function to implement all keybinds necessary by the card.
// NOTICE: we MUST use document.onkeyup instead of document.addEventListener(...)
// because functions persist and cannot be easily removed within anki,
// whereas .onkeyup = ... replaces the previous function with the current.
document.onkeyup = (e => {
  let keys = null;
  let ele = null;

  // START_BLOCK: js_keybind_settings
{% filter indent(width=2) -%}
{%- block js_keybind_settings -%}
{%- endblock -%}
{%- endfilter %}
  // END_BLOCK: js_keybind_settings

{% for m in modules -%}
{%- if m.js is defined and m.js.keybinds.get(note.card_type, note.side) -%}
{%- filter indent(width=2) %}
  // KEYBINDS: {{ m.id }}
  {{ m.js.keybinds.get(note.card_type, note.side) }}

{% endfilter %}
{% endif -%}
{%- endfor %}


  if (e.getModifierState && e.getModifierState('CapsLock')) {
    if (e.key === "CapsLock") {
      // either just enabled or disabled, not sure which one is which
      // it seems like normal browsers can't reach this point during (caps lock enabled -> caps lock disabled...)
      LOGGER.removeWarn("caps");
    } else if (!["Meta"].includes(e.key)) {
      LOGGER.debug(e.key);
      LOGGER.warn("Caps lock is enabled. Keybinds may not work as expected.", true, "caps")
    }
  } else {
    LOGGER.removeWarn("caps");
  }


  /// {% call IF("WordAudio") %}
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
      // TODO clean this up lmao
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


function main() {

  // sanity check
  if (typeof JPMNOpts === 'undefined') {
    LOGGER.warn("JPMNOpts was not defined in the options file. Was there an error?");
  }

  // START_BLOCK: js_run
{% filter indent(width=2) -%}
{%- block js_run -%}
{%- endblock -%}
{%- endfilter %}
  // END_BLOCK: js_run

{% for m in modules -%}
{%- if m.js is defined and m.js.run.get(note.card_type, note.side) %}
  try { // RUN: {{ m.id }}
    {%- filter indent(width=4) -%}
    {{ m.js.run.get(note.card_type, note.side) }}
    {%- endfilter %}
  } catch (error) {
    LOGGER.error(error);
  }

{% endif -%}
{%- endfor -%}

}



main();



}());
