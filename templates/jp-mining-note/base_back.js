/// {% extends "jp-mining-note/base.js" %}

/// {% block js_functions %}
{{ super() }}






// https://github.com/FooSoft/anki-connect#javascript
function invoke(action, params={}) {
  let version = 6;
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('error', () => reject('failed to issue request'));
    xhr.addEventListener('load', () => {
      try {
        const response = JSON.parse(xhr.responseText);
        if (Object.getOwnPropertyNames(response).length != 2) {
          throw 'response has an unexpected number of fields';
        }
        if (!response.hasOwnProperty('error')) {
          throw 'response is missing required error field';
        }
        if (!response.hasOwnProperty('result')) {
          throw 'response is missing required result field';
        }
        if (response.error) {
          throw response.error;
        }
        resolve(response.result);
      } catch (e) {
        reject(e);
      }
    });

    xhr.open('POST', 'http://127.0.0.1:8765');
    xhr.send(JSON.stringify({action, version, params}));
  });
}



const HIRAGANA_CONVERSION_RANGE = [0x3041, 0x3096];
const KATAKANA_CONVERSION_RANGE = [0x30a1, 0x30f6];
const KATAKANA_RANGE = [0x30a0, 0x30ff];

// copied/pasted directly from yomichan
// https://github.com/FooSoft/yomichan/blob/master/ext/js/language/sandbox/japanese-util.js
// I have no idea what is going on tbh but it seems to work
function isCodePointInRange(codePoint, [min, max]) {
  return (codePoint >= min && codePoint <= max);
}

function convertHiraganaToKatakana(text) {
  let result = '';
  const offset = (KATAKANA_CONVERSION_RANGE[0] - HIRAGANA_CONVERSION_RANGE[0]);
  for (let char of text) {
    const codePoint = char.codePointAt(0);
    if (isCodePointInRange(codePoint, HIRAGANA_CONVERSION_RANGE)) {
      char = String.fromCodePoint(codePoint + offset);
    }
    result += char;
  }
  return result;
}









/// {% endblock %}





/// {% block js_run %}
{{ super() }}

// checks leech
const tagsEle = document.getElementById("tags");
const tags = tagsEle.innerHTML.split(" ");
if (tags.includes("leech")) {
  logger.leech();
}


// checks that both `IsHoverCard` and `IsClickCard` are both not activated
/// {% call IF("IsHoverCard") %}
/// {% call IF("IsClickCard") %}
logger.warn("Both `IsHoverCard` and `IsClickCard` are filled. At most one should be filled at once.");
/// {% endcall %}
/// {% endcall %}


/// {% call IFNOT("SentenceReading") %}
if ({{ utils.opt("no-sentence-reading-warn") }}) {
  logger.warn("`SentenceReading` is not filled out. Using `Sentence` field instead.");
}
/// {% endcall %}


// removes greyed out fields if they should be hidden
if ( !{{ utils.opt("greyed-out-collapsable-fields-when-empty") }}) {
  const elems = document.getElementsByClassName("glossary-details--grey");
  for (const x of elems) {
    x.style.display = "none";
  }
}


/// {% endblock %}
