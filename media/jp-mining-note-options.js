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

    "play-sentence-audio": ["p"],

    "play-word-audio": ["w"],

    // Equivalent to clicking on the image.
    "toggle-image-zoom": ["z"],

    // Equivalent to hovering over the full sentence (back side)
    "toggle-sentence-furigana": [","],

    // Equivalent to hovering over the front display
    "toggle-front-display-furigana": [","],

    // Equivalent to toggling the hint show/hide
    "toggle-hint-display": ["."],

    "toggle-secondary-definitions-display": ["8"],

    "toggle-additional-notes-display": ["9"],

    "toggle-other-definitions-display": ["0"],
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

//const var JPMN_KEYBIND_SETTINGS = {
//  // Keybind to toggle between showing the sentence and word on click and hover cards.
//  // Equivalent to either clicking on the sentence/word on a click card,
//  // or hovering over the word on a hover card.
//  "toggle-hybrid-sentence": ["Shift", "n"],
//
//  // Keybind to toggle between showing the tested word in a raw sentence card.
//  // Equivalent to clicking on the "show" button.
//  // This is the same as the above because both should never happen at the same time.
//  "toggle-highlight-word": ["Shift", "n"],
//
//  "play-sentence-audio": ["p"],
//
//  "play-word-audio": ["w"],
//
//  // Equivalent to clicking on the image.
//  "toggle-image-zoom": ["z"],
//
//  // Equivalent to hovering over the full sentence (back side)
//  "toggle-sentence-furigana": [","],
//
//  // Equivalent to hovering over the front display
//  "toggle-front-display-furigana": [","],
//
//  // Equivalent to toggling the hint show/hide
//  "toggle-hint-display": ["."],
//
//  "toggle-secondary-definitions-display": ["8"],
//
//  "toggle-additional-notes-display": ["9"],
//
//  "toggle-other-definitions-display": ["0"],
//}
//
//
//const var JPMN_OTHER_SETTINGS = {
//  // 
//  "select-smallest-sentence": false;
//}

/*
const KB_TOGGLE_HYBRID_SENTENCE = ["Shift", "n"];

const KB_TOGGLE_HIGHLIGHT_WORD = ["Shift", "n"];

const KB_PLAY_SENTENCE_AUDIO = ["p"];

// Keybind to play the word audio (if available)
const KB_PLAY_WORD_AUDIO = ["w"];

// Keybind to zoom into the image (if available)
const KB_TOGGLE_IMAGE_ZOOM = ["z"];

// Keybind to toggle furigana on the full sentence (back side)
const KB_TOGGLE_SENTENCE_FURIGANA = [","];

// Keybind to toggle furigana on the display sentence
const KB_TOGGLE_DISPLAY_FURIGANA = [","];

// Keybind to toggle the hint being displayed or not (if available)
const KB_TOGGLE_HINT_DISPLAY = ["."];

// Keybind to toggle the "secondary definitions" field being displayed or not (if available)
const KB_TOGGLE_SECONDARY_DEFINITIONS_DISPLAY = ["8"];

// Keybind to toggle the "additional notes" field being displayed or not (if available)
const KB_TOGGLE_ADDITIONAL_NOTES_DISPLAY = ["9"];

// Keybind to toggle the "extra definitions" field being displayed or not (if available)
const KB_TOGGLE_EXTRA_DEFINITIONS_DISPLAY = ["0"];
*/

