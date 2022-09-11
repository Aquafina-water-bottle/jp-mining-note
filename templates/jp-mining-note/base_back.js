/// {% extends "jp-mining-note/base.js" %}

/// {% block js_functions %}
{{ super() }}


// placed outside due to anki's async weirdness
const extraInfoDetailsEle = document.getElementById("extra_info_details");

async function openExtraInfoIfNew() {

  // checks option first to see if it's enabled in the first place
  if ( !{{ utils.opt("open-extra-info-when-new") }}) {
    return;
  }

  // doesn't do anything if the element doesn't exist in the first place
  if (extraInfoDetailsEle === null) {
    return;
  }

  // cancels if not new
  // refreshes on every new check, b/c one cannot assume that a card
  // is no longer new once you see a new card
  // (editing a new card will consistently refresh the currently new card)
  const key = "{{ T('Key') }}";
  if (key in isNewCardCache && !isNewCardCache[key]) {
    _debug("(JPMN_ExtraInfo) Key in new card cache and is not new");
    return;
  }

  // requires that any of PAGraphs and UtilityDictionaries be filled to even open extra info
  if (!'{{ utils.any_of_str("PAGraphs", "UtilityDictionaries") }}') {
    _debug("(JPMN_ExtraInfo) Neither PAGraphs nor UtilityDictionaries exists");
    return;
  }

  _debug("(JPMN_ExtraInfo) Testing for new card...");

  function constructFindCardAction(query) {
    return {
      "action": "findCards",
      "params": {
        "query": query,
      }
    }
  }

  // constructs the multi findCards request for ankiconnect
  let actions = [];
  const cardTypeName = '{{ NOTE_FILES("templates", note.card_type, "name").item() }}';
  actions.push(constructFindCardAction(`"Key:${key}" "card:${cardTypeName}"`));
  actions.push(constructFindCardAction(`is:new "Key:${key}" "card:${cardTypeName}"`));

  const multi = await invoke("multi", {"actions": actions});
  const cards = multi[0];

  if (cards.length > 1) {
    logger.warn("Duplicate key found.");
    return;
  }
  if (cards.length == 0) {
    logger.error("(JPMN_ExtraInfo) Cannot find its own card?");
    return;
  }

  const isNew = (multi[1].length > 0);
  isNewCardCache[key] = isNew;

  if (isNew) {
    _debug("(JPMN_ExtraInfo) Card is new, opening extra info...");
    toggleDetailsTag(extraInfoDetailsEle);
  } else {
    _debug("(JPMN_ExtraInfo) Card is not new.");
  }
}





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


// option taken care of in the function itself
openExtraInfoIfNew();


// a bit of a hack...
// The only reason why the downstep arrow exists in the first place is to make the downstep
// mark visible while editing the field in anki. Otherwise, there is no reason for it to exist.
//let wp = document.getElementById("dh_word_pitch");
//wp.innerHTML = wp.innerHTML.replace(/&#42780/g, "").replace(/ꜜ/g, "");

// removes greyed out fields if they should be hidden
if ( !{{ utils.opt("greyed-out-collapsable-fields-when-empty") }}) {
  const elems = document.getElementsByClassName("glossary-details--grey");
  for (const x of elems) {
    x.style.display = "none";
  }
}




// remove all jmdict english dict tags
//var glossaryEle = document.getElementById("primary_definition");
//glossaryEle.innerHTML = glossaryEle.innerHTML.replace(/, JMdict \(English\)/g, "");



//_debug(document.documentElement.innerHTML);

/// {% endblock %}
