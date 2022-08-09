/*
 * Options for the JP Mining Note type.
 *
 * The default options are set around the "AJT Flexible Grading" addon,
 * where h, j, k and l keys are used to grade cards, so almost all options can be used
 * by the right hand.
 *
 *
 *
 * RESERVED KEYS (by anki):
 * - e (edit)
 * - r (replay)
 * - t (stats)
 * - y (sync)
 * - i (card info)
 * - o (options)
 * - a (add)
 * - s (idk exactly what this does tbh)
 * - d (deck)
 * - f (filtered deck options)
 * - v (play recorded voice)
 * - b (browse)
 * - m (menu)
 * - 1, 2, 3, 4 (again, hard, good, easy)
 * - 5 (pause audio)
 * - 6 (audio -5s)
 * - 7 (audio +5s)
 * - space (good)
 * - enter (good)
 *
 * RESERVED KEYS (by AJT Flexible grading):
 * - u (undo)
 * - h, j, k, l: hard / again / good / easy
 *
 * FREE KEYS:
 * - (left)  q w g z x c
 * - (right) p n 8 9 0 , . ; ' [ ]
 */

// TODO update documentation (wiki)
// https://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html
// https://stackoverflow.com/a/8812159
// JPMN is short for JP Mining Note
var JPMNOpts = (function (my) {
  // private variables/functions can be defined with `var varname = ...`
  // globals are defined with `my.varname = ...`

  var isMobile = function() {
    // TODO what about non-android?
    var UA = navigator.userAgent;
    var isAndroid = /Android/i.test(UA);
    return isAndroid;
  }

  // Example: ifMobile("A", "B") will return "A" if ran on a mobile device, and "B" if not.
  var ifMobile = function(a, b) {
    return isMobile() ? a : b;
  }

  my.settings = {

    "keybinds": {
      // Keybind to toggle between showing the sentence and word on click and hover cards.
      // Equivalent to either clicking on the sentence/word on a click card,
      // or hovering over the word on a hover card.
      "toggle-hybrid-sentence": ["n"],

      // Keybind to toggle between showing the tested word in a raw sentence card.
      // Equivalent to clicking on the "show" button.
      // This is the same as the above because both should never happen at the same time.
      "toggle-highlight-word": ["n"],

      // Keybind to toggle a vocab card's full sentence display (front side).
      // Techinically can be Shift / n as it doesn't interfere with the other two above.
      "toggle-front-full-sentence-display": ["'"],

      "play-sentence-audio": ["p"],

      "play-word-audio": ["w"],

      // Equivalent to clicking on the image.
      // TODO: Implement
      "toggle-image-zoom": ["z"],

      // Equivalent to hovering over the full sentence (back side)
      // TODO: Implement
      "toggle-sentence-furigana": [","],

      // Equivalent to hovering over the front display.
      // Also toggles the furigana on the vocab card's full sentence section (front side) if available.
      // TODO: Implement
      "toggle-front-display-furigana": [","],

      // Equivalent to toggling the hint show/hide
      "toggle-hint-display": ["."],

      "toggle-secondary-definitions-display": ["8"],

      "toggle-additional-notes-display": ["9"],

      "toggle-extra-definitions-display": ["0"],

      "toggle-extra-info-display": ["["],
    },


    "sentence-module": {
      // Automatic processing to sentences
      "enabled": true,

      // if the AltDisplay field is not filled, it attempts to choose the
      // smallest possible sentence, similar to Yomichan's internal sentence parser.
      //
      // For example, if the sentence field was:
      //
      //   飛行機のチケット！そんなの空席待ちとかしないでいいから！ね？
      //
      // and the bolded part was "飛行機", then only
      //
      //   飛行機のチケット！
      //
      // would be selected.
      "select-smallest-sentence": false,

      // Removes all line breaks on the sentence if AltDisplay is not filled
      "remove-line-breaks": true,

      // removes line count specifically if the text is <= (specified number) characters in length.
      // 0 means that newlines are ALWAYS removed.
      "remove-line-breaks-until-char-count": ifMobile(0, 33),

      // Removes all line breaks on the AltDisplay sentence
      "remove-line-breaks-on-altdisplay": ifMobile(true, false),


      // =========================
      //  Quote Processing Module
      // =========================

      "quote-module": {
        "enabled": true,

        "pa-indicator-color-quotes": ifMobile(true, false),

        // Formats sentences such that the first quote encompasses the entire sentence,
        // like so:
        //
        // 「そーすっと、こんな風に、相手は頭突きを警戒して
        // 　自然と上体を引くのよさ」
        "left-align-adjust-format": true,

        // automatically adds quotes to the sentence if AltDisplay is not filled
        "auto-quote-sentence": true,
        "auto-quote-sentence-strings": ["「", "」"],

        "quote-match-strings": [
          ["「", "」"],
          ["『", "』"],
          ["｢", "｣"],
        ],

      }

    },

    "general": {
      // Overrides the play keybind button to show the sentence if the
      // card is a hybrid sentence AND the sentence is not currently being shown.
      // Only affects the front side.
      "hybrid-sentence-open-on-play-sentence": true,
    }

  }

  return my;
}(JPMNOpts || {}));

export function createOptions() {
  return JPMNOpts;
}


// {} is short for `new Object()`, think python dicts `{}`
// any variable in javascript can be automatically declared

