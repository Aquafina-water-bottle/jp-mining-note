// JPMN is short for JP Mining Note
var JPMNOpts = (function (my) {

  my.settings = {
      // RESERVED KEYS (by anki):
      // - e (edit)
      // - r (replay)
      // - t (stats)
      // - y (sync)
      // - i (card info)
      // - o (options)
      // - a (add)
      // - s (idk exactly what this does tbh)
      // - d (deck)
      // - f (filtered deck options)
      // - v (play recorded voice)
      // - b (browse)
      // - m (menu)
      // - 1, 2, 3, 4 (again, hard, good, easy)
      // - 5 (pause audio)
      // - 6 (audio -5s)
      // - 7 (audio +5s)
      // - space (good)
      // - enter (good)
      //
      // RESERVED KEYS (by AJT Flexible grading):
      // - u (undo)
      // - h, j, k, l: hard / again / good / easy
      //
      // FREE KEYS:
      // - (left)  q w g z x c
      // - (right) p n 8 9 0 , . ; ' [ ]
      "keybinds": {
        // Keybind to toggle between showing the sentence and word on click and hover cards.
        // Equivalent to either clicking on the sentence/word on a click card,
        // or hovering over the word on a hover card.
        "toggle-hybrid-sentence": ["KeyN"],

        // Keybind to toggle between showing the tested word in a raw sentence card.
        // Equivalent to clicking on the "show" button.
        // This is the same as the above because both should never happen at the same time.
        "toggle-highlight-word": ["KeyN"],

        // Keybind to toggle a vocab card's full sentence display (front side).
        // Techinically can be Shift / n as it doesn't interfere with the other two above.
        "toggle-front-full-sentence-display": ["Quote"],

        "play-sentence-audio": ["KeyP"],

        "play-word-audio": ["KeyW"],

        // Equivalent to toggling the hint show/hide
        "toggle-hint-display": ["Period"],

        "toggle-secondary-definitions-display": ["Digit8"],

        "toggle-additional-notes-display": ["Digit9"],

        "toggle-extra-definitions-display": ["Digit0"],

        "toggle-extra-info-display": ["BracketLeft"]
      },


      "modules": {

        // "enabled" is not featured here, as it is enabled/disabled via compile time options only.
        "time-performance": {
          "debug-level": 4,
          "precision": 3,

          "time-modules": true,

          "display-full": true,

          // options: "mostRecent" or "currentSideAvg"
          "sort-func": "currentSideAvg"
        },

        // Automatic processing to sentences
        "sent-utils": {
          "enabled": true,

          // TODO make this an option somewhere again
          // current implementation:
          // - no regard with whether AltDisplay is being used
          // - purely CSS

          //// Removes all line breaks on the regular sentence (if AltDisplay is not filled)
          //"remove-line-breaks": {
          //  "type": "viewport-width-is",
          //  "value": 1300,
          //  "greater": false,
          //  "lesser": true
          //},

          //// Removes all line breaks on the AltDisplay sentence
          //"remove-line-breaks-on-altdisplay": {
          //  "type": "viewport-width-is",
          //  "value": 1300,
          //  "greater": false,
          //  "lesser": true
          //},

          // removes the 「。」 character if it is the last character of the sentence
          "remove-final-period": true,
          "remove-final-period-on-altdisplay": false,

          // colors the quotes instead of showing a pitch accent indicator
          // if this is enabled
          "pa-indicator-color-quotes": {
            "type": "viewport-width-is",
            "value": 1300,
            "greater": false,
            "lesser": true
          },

          // automatically colors the quote with the sentence pa indicator color,
          // on PA sentence cards
          "pa-sent-pa-indicator-color-quotes": {
            "type": "viewport-width-is",
            "value": 1300,
            "greater": false,
            "lesser": true
          },

          // automatically adds quotes to the sentence (if not alt display)
          "auto-quote-sentence": true,

          // automatically adds quotes to the sentence (if alt display)
          "auto-quote-alt-display-sentence": true,

          // the quote pair to automatically add to the sentence
          // NOTE: these are the quotes that are used by default on all sentences even
          // if this module is disabled.
          "auto-quote-open": "「",
          "auto-quote-close": "」",

          // the quote pair to automatically add to the sentence if it's a PA sentence card
          "pa-sent-auto-quote-open": "『",
          "pa-sent-auto-quote-close": "』",

          // quotes to search for on existing sentences,
          // to not double-quote a sentence that already has quotes on it
          "quote-match-strings": [
            ["「", "」"],
            ["『", "』"]
          ]
        },


        // Hover over a kanji in the word reading to see if it has been used
        // in previous cards or not.
        "kanji-hover": {
          "enabled": true,

          // 0: loads every time, slower to reveal the back side of the card
          // 1: loads only upon hover, has a small delay upon first hovering over a word
          "mode": 1,

          // The delay (in milliseconds) of which this module is loaded.
          //
          // NOTE: A delay with mode == 1 means that the hover function is added after that delay.
          //     There will be no additional delay after hovering (some delay will still exist
          //     due to querying AnkiConnect for information)
          "load-delay": 300,

          // Displays the pitch accent to the right of the word
          "display-pitch-accent": true,

          // Only displays the pitch accent if the word is hovered over
          "display-pitch-accent-hover-only": true,

          // If set to true, words are able to be clicked to browse within the Anki browser
          "click-word-to-browse": true,

          // all queries will have the following at the beginning:
          // (-"Key:{{Key}}" Word:*${character}* "card:${cardTypeName}" "-WordReading:{{WordReading}}")

          // not new, or new + green + suspended
          // not flagged as red and suspended
          "non-new-query": "(-is:new OR (is:suspended is:new flag:3)) -(is:suspended flag:1)",

          // new
          // not suspended, and neither flagged as red or green
          "new-query": "is:new -(is:suspended (flag:1 OR flag:3))",

          // maximum number of words per category
          "max-non-new-oldest": 2,
          "max-non-new-latest": 2,
          "max-new-latest": 2
        },


        // Automatically selects and displays pitch accent based off of the related fields.
        "auto-pitch-accent": {
          "enabled": true,

          // the reading display to show if nothing is generated by the AJT Pitch Accent plugin
          // (by default, it attempts to find the word within the AJTWordPitch field,
          //  which is usually katakana with long vowel marks.)
          // 0: hiragana
          // 1: katakana
          // 2: katakana with long vowel marks
          "reading-display-mode": 1,

          // whether to search for the ajt word, given the field is filled out
          "search-for-ajt-word": true,

          "pa-positions": {

            // When set to false, only displays the first entry within the first dictionary.
            // - The main entry can be overwritten by bolding an entry in `PAPositions`.
            // When set to true, all pitch accents within the first dictionary is shown.
            // - Bolding an entry will grey out other entries.
            "display-entire-dictionary": false,

            // the character that connects pitch accents when the above option
            // `display-entire-dictionary` is set to true (and can then show a list of pitch accents)
            "default-connector": "・",

            // Given that `display-entire-dictionary` is true and multiple results are shown,
            // this determines whether the first pitch is set to the "main position".
            // The main position determines the color of the pitch accent, if `colored-pitch-accent` is enabled.
            "set-first-pitch-as-main": true
          },

          // various options for the formatting of the `PAOverride` field
          "pa-override": {

            "separators": ["・", "、"],
            "downstep-markers": ["＼"],
            "heiban-markers": ["￣"],

            // shows a warning when PAOverride has an incorrect format
            "warn-on-invalid-format": true,

            // If PAOverride is using the text format + there are multiple entries,
            // whether the first entry is set as the main pitch or not.
            // The main position determines the color of the pitch accent, if `colored-pitch-accent` is enabled.
            "text-format-set-first-pitch-as-main": false,

            // whether the heiban marker is required to specify heiban words
            "heiban-marker-required": true,

            // Undulation/kifuku (起伏) value, to set the pattern to kifuku
            // (used in the PAOverride field).
            // This sets the downstep be right before the last mora, and colors the word
            // purple if colored-pitch-accent is enabled.
            // Note that these values must be numbers and they CANNOT be strings.
            "kifuku-override": [-1]
          },

          // Whether to color the tested word by pitch accent class or not.
          // Generally: 平板 is blue, 頭高 is red, 中高 is orange and 尾高 is green.
          // The exact colors can be changed in the css.
          // NOTE: There are certain cases where the position cannot be inferred.
          //  See here for more details:
          //  https://aquafina-water-bottle.github.io/jp-mining-note/autopa/#colored-pitch-accent
          "colored-pitch-accent": {
            "enabled": false,

            // Word reading
            "color-reading": true,

            // Tested content (word or sentence).
            // NOTE: this preserves the semantics of whether the sentence
            //     had a highlighted word in the first place. For example,
            //     a sentence card will NOT have the word within the sentence colored,
            //     but a TSC will have the word colored.
            "color-display": true,

            // Pitch accent overline
            "color-overline": true
          }
        },


        // image utilities
        "img-utils": {
          // HIGHLY recommend to be enabled as this doesn't take much javascript
          // and makes things look infinitely better
          "enabled": true,

          // Replaces all images in the glossary (definition) sections
          // with an internal representation similar to how Yomichan displays images:
          // an `[Image]` text where you can see the image upon hover, and with click to zoom.
          "stylize-images-in-glossary": true,

          "primary-definition-picture": {
            // Where to place the `PrimaryDefinitionPicture` field contents
            //  within the primary definition section.
            // Valid options (case sensitive): "auto", "bottom", "right"
            "position": "auto",

            // A constant that allows the picture to be placed to the right even if
            // the text height is X times smaller than the picture.
            // For example, a value of 1 will only allow the picture to be placed to the right
            // if the text height is equal or greater than the height of the picture.
            "position-lenience": 2,

            // Tags to override auto positioning
            // Case sensitive
            "tags-bottom": ["img-bottom", "jpmn-img-buttom"],
            "tags-right": ["img-right", "jpmn-img-right"]
          },

          // Sets the image to the specified file if it contains the specified tags.
          // This may be useful for people who primarily make cards from novels,
          // and want to add the cover of the book to all of their notes.
          // This is a fall-back option that is used when the `Picture` field is empty.
          // NOTE: Remember to add the file to the media folder in order for this to work!
          "add-image-if-contains-tags": [
            // EXAMPLES:

            // This adds the image `_sample_image.png` if the card has the tag `sample_tag`.
            //{
            //  "tags": ["sample_tag"],
            //  "file-name": "_sample_image.png"
            //},

            // This adds the image `_contains_both_tags.png` if the card has both tags
            // `something` and `something2`.
            //{
            //  "tags": ["something", "something2"],
            //  "file-name": "_contains_both_tags.png"
            //}
          ],

          "image-blur": {
            // allows the user to mark any card as NSFW, and adds various
            // GUI elements to faciliate just that.
            "enabled": false,

            // what tags can be used to toggle the card between nsfw / not nsfw
            // case sensitive
            "tags": ["NSFW", "nsfw", "-NSFW"],

            // Sets whether nsfw images are blurred by default or not.
            //
            // Available states:
            //  0: all images will not be blurred (even if marked as NSFW)
            //  1: only images marked as NSFW will be blurred by default
            //  2: all images will be blurred regardless of whether it is marked as NSFW or not
            //
            // The first number of the list is the default state. The states cycle from left -> right
            // For example, if the list was [1, 2, 0], it would start at state 1, and clicking on the
            // settings eye will set it to state 2, state 0, state 1, state 2.
            //

            "toggle-states": {
              "type": "pc-mobile",
              "pc": [1, 2, 0],     // default for non-mobile devices (usually PC)
              "mobile": [1, 2, 0]  // default for mobile devices
              //"mobile": [0, 1, 2], // defaults to never blurred
            }
          }

        },


        // Options to set a collapsable field to be open or not
        "customize-open-fields": {
          "enabled": false,

          // Force a field to be always open
          "open": [
            // `Primary Definition` only affects cloze-deletion cards, as the primary definition field there is
            // indeed collapsed by default.

            //"Primary Definition",
            //"Secondary Definition",
            //"Additional Notes",
            //"Extra Definitions",
            //"Extra Info"
          ],

          // Opens the specified collapsable field if the card is new.
          "open-on-new-enabled": true,

          // Ensure that `open-on-new-enabled` is true, for this to work.
          "open-on-new": [
            // `Primary Definition` only affects cloze-deletion cards, as the primary definition field there is
            // indeed collapsed by default.

            //"Primary Definition",
            //"Secondary Definition",
            //"Additional Notes",
            //"Extra Definitions",
            //"Extra Info"
          ]
        },

        // Shows an indicator for duplicates, words with the same reading, and words with the same kanji
        "word-indicators": {
          "enabled": true,

          // The delay (in milliseconds) of which this module is loaded.
          // - 1 second is 1000ms
          // - A delay of 0 means that it is loaded instantly.
          // - NOTE: It is recommended for this to be higher than 0, as a delay of 0 appears to visibly
          //   increase the loading time of the back side of any card.
          "load-delay": 50,

          // Displays the pitch accent to the right of the word
          "display-pitch-accent": true,

          // Only displays the pitch accent if the word is hovered over
          "display-pitch-accent-hover-only": false,

          // if set to true, words are able to be clicked to browse within the Anki browser
          "click-word-to-browse": true,

          // not new, or new + green + suspended
          // not flagged as red and suspended
          "non-new-query": "(-is:new OR (is:suspended is:new flag:3)) -(is:suspended flag:1)",

          // new
          // not suspended, and neither flagged as red or green
          "new-query": "is:new -(is:suspended (flag:1 OR flag:3))",

          // maximum number of words per category
          "max-non-new-oldest": 2,
          "max-non-new-latest": 2,
          "max-new-latest": 2

        },


        // Allows extra features of the info-circle to be used
        "info-circle-utils": {
          // Ihe info circle will always be shown regardless.
          // Enabling this module just allows the use of extra features.
          "enabled": true,

          // Whether the user can lock the tooltip by clicking on the info-circle or not
          "togglable-lock": {
            "enabled": true,

            // Whether the popup shows when toggled
            "show-popup": {
              "type": "pc-mobile",
              "pc": true,
              "mobile": false
            }
          },

          // Whether the info circle is hoverable (to show tooltip)
          "is-hoverable": {
            "type": "pc-mobile",
            "pc": true,
            "mobile": false
          }
        },


        // Quick-fixes the ruby text positioning by moving it closer to the word,
        // at the cost of taking up extra space to the left/right if necessary
        // (more so than the normal <ruby> rendering.
        //
        // IMPORTANT:
        //     This module does NOT need to be enabled on Anki versions using Qt6.
        //     This should only be enabled for Anki versions using Qt5, and AnkiMobile.
        "fix-ruby-positioning": {
          "enabled": {
            "type": "pc-mobile",
            "pc": false,
            "mobile": false
          }
        },

        "check-duplicate-key": {
          "enabled": true
        }


      },


      // Errors that contain the following the following strings will be ignored and not displayed.
      "ignored-errors": [
        // This error is caused by the "Edit Field During Review (Cloze)" add-on.
        // However, this error only appears during the preview and edit cards template windows.
        // This error does not appear to actually affect any of the internal javascript within the card,
        // and is rather caused by the add-on itself.
        // Due to the card's error catcher, this previously-silent error is now caught and shown
        // in the card's error log, despite it not actually affecting anything.
        // Therefore, this error can be safely ignored.
        "ReferenceError: EFDRC is not defined",

        // Vanilla Anki 2.1.61 seems to introduce this error on Windows. It doesn't seem to affect
        // anything visible, so hopefully this is fine to ignore.
        // Related report: https://forums.ankiweb.net/t/29185
        "/_anki/js/reviewer.js:7:112035)"
      ],

      // Overrides the play keybind button to show the sentence if the
      // card is a hybrid sentence AND the sentence is not currently being shown.
      // Only affects the front side.
      "hybrid-sentence-open-on-play-sentence": true,

      // By default, the indicator for collapsable fields are completely removed.
      // Making this true keeps the indicator, but greys out the text to show that
      // it cannot be opened.
      "greyed-out-collapsable-fields-when-empty": false,

      // Warn if using the `Sentence` field instead of the `SentenceReading` field
      "no-sentence-reading-warn": false,

      // Whether Anki-Connect features are enabled or disabled
      // Anki-Connect features are disabled on mobile because
      // the full Anki-Connect add-on is PC only, and cannot be downloaded on mobile.
      "enable-ankiconnect-features": {
        "type": "pc-mobile",
        "pc": true,
        "mobile": false
      },

      // The debug level for debug messages on how long modules and various parts of javascript take to run.
      // Performance logging is compiled out by default.
      "log-performance-debug-level": 4,

      // (Developer option) Used to show debug messages when debugging the card.
      // Use the `LOGGER.debug()` (or `logger.debug()`) function in javascript to write debug messages.
      // Set to any number higher than 5 to disable.
      // 0 produces the most debug messages, 5 produces the least debug messages.
      "debug-level": 6
    }

  return my;
}(JPMNOpts || {}));
