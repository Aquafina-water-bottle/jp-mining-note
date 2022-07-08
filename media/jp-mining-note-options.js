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

  my.keybindSettings = {
    // Keybind to toggle between showing the sentence and word on click and hover cards.
    // Equivalent to either clicking on the sentence/word on a click card,
    // or hovering over the word on a hover card.
    "toggle-hybrid-sentence": ["Shift", "n"],

    // Keybind to toggle between showing the tested word in a raw sentence card.
    // Equivalent to clicking on the "show" button.
    // This is the same as the above because both should never happen at the same time.
    "toggle-highlight-word": ["Shift", "n"],

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
  }

  my.settings = {
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
  }

  return my;
}(JPMNOpts || {}));
// {} is short for `new Object()`, think python dicts `{}`
// any variable in javascript can be automatically declared

