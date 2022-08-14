
// NOTE: This config is auto generated!
// It is recommend to generate the config instead of editing this directly
// to ensure everything works as expected.

// JPMN is short for JP Mining Note
var JPMNOpts = (function (my) {

  //var isMobile = function() {
  //  // TODO what about non-android?
  //  var UA = navigator.userAgent;
  //  var isAndroid = /Android/i.test(UA);
  //  return isAndroid;
  //}

  //// Example: ifMobile("A", "B") will return "A" if ran on a mobile device, and "B" if not.
  //var ifMobile = function(a, b) {
  //  return isMobile() ? a : b;
  //}

  my.settings =

    {
      "keybinds": {
        "toggle-hybrid-sentence": [
          "n"
        ],
        "toggle-highlight-word": [
          "n"
        ],
        "toggle-front-full-sentence-display": [
          "'"
        ],
        "play-sentence-audio": [
          "p"
        ],
        "play-word-audio": [
          "w"
        ],
        "toggle-image-zoom": [
          "z"
        ],
        "toggle-sentence-furigana": [
          ","
        ],
        "toggle-front-display-furigana": [
          ","
        ],
        "toggle-hint-display": [
          "."
        ],
        "toggle-secondary-definitions-display": [
          "8"
        ],
        "toggle-additional-notes-display": [
          "9"
        ],
        "toggle-extra-definitions-display": [
          "0"
        ],
        "toggle-extra-info-display": [
          "["
        ]
      },
      "sentence": {
        "enabled": true,
        "remove-line-breaks": true,
        "remove-line-breaks-until-char-count": 30,
        "remove-line-breaks-on-altdisplay": false,
        "pa-indicator-color-quotes": true,
        "auto-quote-sentence": true,
        "auto-quote-alt-display-sentence": false,
        "auto-quote-open": "\u300c",
        "auto-quote-close": "\u300d",
        "quote-match-strings": [
          [
            "\u300c",
            "\u300d"
          ],
          [
            "\u300e",
            "\u300f"
          ]
        ]
      },
      "general": {
        "hybrid-sentence-open-on-play-sentence": true
      }
    }


  return my;
}(JPMNOpts || {}));

//export function createOptions() {
//  return JPMNOpts;
//}

