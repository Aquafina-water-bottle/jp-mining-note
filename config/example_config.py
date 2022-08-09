"""
Config file used for both build.py and install.py
"""

CONFIG = {

  "build_settings": {
    "optimize": False,

    "optimize_settings": {
      "always_filled": [
        #"AltDisplay",
        #"AltDisplayPASentenceCard",
        #"AdditionalNotes",

        #"IsSentenceCard",
        #"IsClickCard",
        #"IsHoverCard",
        #"IsTargetedSentenceCard",
        #"PASeparateWordCard",
        #"PASeparateSentenceCard",
        #"PAShowInfo",
        #"PATestOnlyWord",
        #"PADoNotTest",
        #"SeparateClozeDeletionCard",

        #"Hint",
        #"HintNotHidden",
        #"Picture",
        #"SentenceAudio",
        #"SecondaryDefinition",
        #"ExtraDefinitions",
        #"UtilityDictionaries",
      ],

      "never_filled": [
        #"AltDisplay",
        #"AltDisplayPASentenceCard",
        #"AdditionalNotes",

        #"IsSentenceCard",
        #"IsClickCard",
        #"IsHoverCard",
        #"IsTargetedSentenceCard",
        #"PASeparateWordCard",
        #"PASeparateSentenceCard",
        #"PAShowInfo",
        #"PATestOnlyWord",
        #"PADoNotTest",
        #"SeparateClozeDeletionCard",

        #"Hint",
        #"HintNotHidden",
        #"Picture",
        #"SentenceAudio",
        #"SecondaryDefinition",
        #"ExtraDefinitions",
        #"UtilityDictionaries",
      ],
    },


    # Global options for the JP Mining Note type.
    "javascript_settings": {

      # RESERVED KEYS (by anki):
      # - e (edit)
      # - r (replay)
      # - t (stats)
      # - y (sync)
      # - i (card info)
      # - o (options)
      # - a (add)
      # - s (idk exactly what this does tbh)
      # - d (deck)
      # - f (filtered deck options)
      # - v (play recorded voice)
      # - b (browse)
      # - m (menu)
      # - 1, 2, 3, 4 (again, hard, good, easy)
      # - 5 (pause audio)
      # - 6 (audio -5s)
      # - 7 (audio +5s)
      # - space (good)
      # - enter (good)
      #
      # RESERVED KEYS (by AJT Flexible grading):
      # - u (undo)
      # - h, j, k, l: hard / again / good / easy
      #
      # FREE KEYS:
      # - (left)  q w g z x c
      # - (right) p n 8 9 0 , . ; ' [ ]
      "keybinds": {
        # Keybind to toggle between showing the sentence and word on click and hover cards.
        # Equivalent to either clicking on the sentence/word on a click card,
        # or hovering over the word on a hover card.
        "toggle-hybrid-sentence": ["n"],

        # Keybind to toggle between showing the tested word in a raw sentence card.
        # Equivalent to clicking on the "show" button.
        # This is the same as the above because both should never happen at the same time.
        "toggle-highlight-word": ["n"],

        # Keybind to toggle a vocab card's full sentence display (front side).
        # Techinically can be Shift / n as it doesn't interfere with the other two above.
        "toggle-front-full-sentence-display": ["'"],

        "play-sentence-audio": ["p"],

        "play-word-audio": ["w"],

        # Equivalent to clicking on the image.
        # TODO: Implement
        "toggle-image-zoom": ["z"],

        # Equivalent to hovering over the full sentence (back side)
        # TODO: Implement
        "toggle-sentence-furigana": [","],

        # Equivalent to hovering over the front display.
        # Also toggles the furigana on the vocab card's full sentence section (front side)
        # if available.
        # TODO: Implement
        "toggle-front-display-furigana": [","],

        # Equivalent to toggling the hint show/hide
        "toggle-hint-display": ["."],

        "toggle-secondary-definitions-display": ["8"],

        "toggle-additional-notes-display": ["9"],

        "toggle-extra-definitions-display": ["0"],

        "toggle-extra-info-display": ["["],
      },

      "sentence-module": {
        # Automatic processing to sentences
        "enabled": True,

        # if the AltDisplay field is not filled, it attempts to choose the
        # smallest possible sentence, similar to Yomichan's internal sentence parser.
        #
        # For example, if the sentence field was:
        #
        #   飛行機のチケット！そんなの空席待ちとかしないでいいから！ね？
        #
        # and the bolded part was "飛行機", then only
        #
        #   飛行機のチケット！
        #
        # would be selected.
        "select-smallest-sentence": False,

        # Removes all line breaks on the sentence if AltDisplay is not filled
        "remove-line-breaks": True,

        # removes line count specifically if the text is <= (specified number) characters in length.
        # 0 means that newlines are ALWAYS removed.
        "remove-line-breaks-until-char-count": "ifMobile(0, 33)",

        # Removes all line breaks on the AltDisplay sentence
        "remove-line-breaks-on-altdisplay": "ifMobile(true, false)",

        # =========================
        #  Quote Processing Module
        # =========================
        "quote-module": {
          "enabled": True,

          # Formats sentences such that the first quote encompasses the entire sentence,
          # like so:
          #
          # 「そーすっと、こんな風に、相手は頭突きを警戒して
          # 　自然と上体を引くのよさ」
          "pa-indicator-color-quotes": "ifMobile(true, false)",

          # automatically adds quotes to the sentence if AltDisplay is not filled
          "left-align-adjust-format": True,

          "auto-quote-sentence": True,
          "auto-quote-sentence-strings": ["「", "」"],

          "quote-match-strings": [
            ["「", "」"],
            ["『", "』"],
            ["｢", "｣"],
          ],

        }
      },

      # Overrides the play keybind button to show the sentence if the
      # card is a hybrid sentence AND the sentence is not currently being shown.
      # Only affects the front side.
      "general": {
        "hybrid-sentence-open-on-play-sentence": True,
      }

    },
  },

  "install_settings": {

    # list of note types to install
    "notes": [
      { # jp-mining-note
        "model_name": "JP Mining Note",
        "template_names": {
          "main": "Mining Card",
          "pa_sentence": "PA Sentence Card",
          "pa_word": "PA Word Card",
          "cloze_deletion": "Cloze Deletion Card",
        }
      },
    ]
  }
}
