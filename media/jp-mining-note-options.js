
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
      "sentence-module": {
        "enabled": true,
        "select-smallest-sentence": false,
        "remove-line-breaks": true,
        "remove-line-breaks-until-char-count": {
          "type": "check-mobile",
          "mobile": 0,
          "not-mobile": 33
        },
        "remove-line-breaks-on-altdisplay": {
          "type": "check-mobile",
          "mobile": true,
          "not-mobile": false
        },
        "quote-module": {
          "enabled": true,
          "pa-indicator-color-quotes": {
            "type": "check-mobile",
            "mobile": true,
            "not-mobile": false
          },
          "left-align-adjust-format": true,
          "auto-quote-sentence": true,
          "auto-quote-sentence-strings": [
            "\u300c",
            "\u300d"
          ],
          "quote-match-strings": [
            [
              "\u300c",
              "\u300d"
            ],
            [
              "\u300e",
              "\u300f"
            ],
            [
              "\uff62",
              "\uff63"
            ]
          ]
        }
      },
      "general": {
        "hybrid-sentence-open-on-play-sentence": true
      }
    }


  return my;
}(JPMNOpts || {}));

export function createOptions() {
  return JPMNOpts;
}

