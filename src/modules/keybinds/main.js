


/// {% set functions %}

// ==========
//  Keybinds
// ==========

const JPMNKeybinds = (() => {

  const logger = new JPMNLogger("example");

  /*
   * Toggles the display of any given details tag
   */
  function toggleDetailsTag(ele) {
    if (ele === null) {
      return;
    }

    if (ele.hasAttribute('open')) {
      ele.removeAttribute('open');
    } else {
      ele.setAttribute("open", "true");
    }
  }

  function _hasKey(e, keys) {
    return (keys !== null && keys.includes(e.code));
  }

  function toggleDetailsTagOnKey(e, keys, ele) {
    if (_hasKey(e, keys) && ele !== null) {
      toggleDetailsTag(ele);
    }
  }


  class JPMNKeybinds {
    constructor() {
      this.funcs = {};
      this.addFunc("baseFunc", this.baseFunc);
      this.register();
    }

    addFunc(key, func) {
      this.funcs[key] = func;
    }


    // public interface for other modules to use
    hasKey(e, keys) {
      return _hasKey(e, keys);
    }

    baseFunc(e) {

      /// {% call IF("WordAudio") %}
      if (_hasKey(e, {{ utils.opt("keybinds", "play-word-audio") }})) {
        let ele = document.querySelector("#word-audio .soundLink, #word-audio .replaybutton");
        if (ele) {
          ele.click();
        }
      }
      /// {% endcall %}

      /// {% call IF("SentenceAudio") %}
      if (_hasKey(e, {{ utils.opt("keybinds", "play-sentence-audio") }})) {
        let hSent = document.getElementById("hybrid-sentence");

        /// {% if note.card_type == "main" and note.side == "front" %}
        if ({{ utils.opt("hybrid-sentence-open-on-play-sentence") }}
            && '{{ utils.any_of_str("IsHoverCard", "IsClickCard") }}'
            && '{{ utils.any_of_str("IsTargetedSentenceCard", "IsSentenceCard") }}'
            && hSent !== null && !hSent.classList.contains("override-display-inline-block")) {
          hybridClick();
        } else {
        /// {% endif %}
          let ele = document.querySelector("#sentence-audio .soundLink, #sentence-audio .replaybutton");
          if (ele) {
            ele.click();
          }
        /// {% if note.card_type == "main" and note.side == "front" %}
        }
        /// {% endif %}
      }
      /// {% endcall %}

      toggleDetailsTagOnKey(e,
        {{ utils.opt("keybinds", "toggle-front-full-sentence-display") }},
        document.getElementById("full_sentence_front_details")
      )

      /// {% call IF("Hint") %}
      toggleDetailsTagOnKey(e,
        {{ utils.opt("keybinds", "toggle-hint-display") }},
        document.getElementById("hint_details")
      )
      /// {% endcall %}


      /// {% if note.side == "back" %}
      /// {% call IF("SecondaryDefinition") %}
      toggleDetailsTagOnKey(e,
        {{ utils.opt("keybinds", "toggle-secondary-definitions-display") }},
        document.getElementById("secondary_definition_details")
      )
      /// {% endcall %}

      /// {% call IF("AdditionalNotes") %}
      toggleDetailsTagOnKey(e,
        {{ utils.opt("keybinds", "toggle-additional-notes-display") }},
        document.getElementById("additional_notes_details")
      )
      /// {% endcall %}

      /// {% call IF("ExtraDefinitions") %}
      toggleDetailsTagOnKey(e,
        {{ utils.opt("keybinds", "toggle-extra-definitions-display") }},
        document.getElementById("extra_definitions_details")
      )
      /// {% endcall %}

      toggleDetailsTagOnKey(e,
        {{ utils.opt("keybinds", "toggle-extra-info-display") }},
        document.getElementById("extra_info_details")
      )

      /// {% endif %} {# note.side == back #}
    }

    // sets the .onkeyup function to run all in this.funcs
    register() {

      // NOTICE: we MUST use document.onkeyup instead of document.addEventListener(...)
      // because functions persist and cannot be easily removed within anki,
      // whereas .onkeyup = ... replaces the previous function(s) with this function.
      document.onkeyup = (e => {
        logger.debug(`KeyboardEvent: code=${e.code}`, 0);

        for (const key of Object.keys(this.funcs)) {
          const func = this.funcs[key];
          logger.debug(`Running function ${key}`, 2);
          func(e);
        }
      });
    }

  }


  return JPMNKeybinds;

})();

const KEYBINDS = new JPMNKeybinds()

/// {% endset %}


