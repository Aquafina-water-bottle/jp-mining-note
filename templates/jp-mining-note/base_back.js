/// {% extends "jp-mining-note/base.js" %}

/// {% block js_functions %}
{{ super() }}


// placed outside due to anki's async weirdness
let extraInfoDetailsEle = document.getElementById("extra_info_details");

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





// =============
//  kanji hover
// =============


// element outside async function to prevent double-adding due to anki funkyness
let wordReading = document.getElementById("dh_reading");
let kanjiHoverEnabled = false;


let JPMN_KanjiHover = (function () {
  let my = {};

  // multi query result, in the format of
  // [kanji 1 (non-new), kanji 1 (new), kanji 2 (non-new), kanji 2 (new), etc.]
  async function cardQueries(kanjiArr) {
    const cardTypeName = '{{ NOTE_FILES("templates", note.card_type, "name").item() }}';

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
    for (const character of kanjiArr) {
      const baseQuery = (
        `(-"Key:{{ T('Key') }}" -"WordReading:{{ T('WordReading') }}"`
        + `Word:*${character}* "card:${cardTypeName}") `
      );
      const nonNewQuery = baseQuery + {{ utils.opt("kanji-hover", "non-new-query") }};
      const newQuery = baseQuery + {{ utils.opt("kanji-hover", "new-query") }};

      //logger.warn(nonNewQuery)
      //logger.warn(newQuery)
      actions.push(constructFindCardAction(nonNewQuery))
      actions.push(constructFindCardAction(newQuery))
    }

    return await invoke("multi", {"actions": actions})
  }

  function filterCards(nonNewCardIds, newCardIds) {
    const nonNewEarliest = {{ utils.opt("kanji-hover", "max-non-new-oldest") }};
    const nonNewLatest = {{ utils.opt("kanji-hover", "max-non-new-latest") }};
    const newLatest = {{ utils.opt("kanji-hover", "max-new-latest") }};

    // non new: gets the earliest and latest
    let nonNewResultIds = []
    if (nonNewCardIds.length > nonNewEarliest + nonNewLatest) {
      nonNewResultIds = [
        ...nonNewCardIds.slice(0, nonNewEarliest), // earliest
        ...nonNewCardIds.slice(-nonNewLatest, nonNewCardIds.length), // latest
      ];
    } else {
      nonNewResultIds = [...nonNewCardIds];
    }

    let newResultIds = newCardIds.slice(0, newLatest);

    return [nonNewResultIds, newResultIds];
  }



  async function getCardsInfo(queryResults) {
    function constructCardsInfoAction(idList) {
      return {
        "action": "cardsInfo",
        "params": {
          "cards": idList,
        }
      }
    }

    let actions = [];
    logger.assert(queryResults.length % 2 == 0, "query results not even");

    //for (const [i, character] of kanjiArr.entries()) {
    for (let i = 0; i < queryResults.length/2; i++) {
      // ids are equivalent to creation dates, so sorting ids is equivalent to
      // sorting to card creation date
      let nonNewCardIds = queryResults[i*2].sort();
      let newCardIds = queryResults[i*2 + 1].sort();
      let [nonNewResultIds, newResultIds] = filterCards(nonNewCardIds, newCardIds)

      // creates a multi request of the following format:
      // [cardInfo (nonNewCardIds, kanji 1), cardInfo (newCardIds, kanji 1), etc.]

      actions.push(constructCardsInfoAction(nonNewResultIds))
      actions.push(constructCardsInfoAction(newResultIds))
    }

    return await invoke("multi", {"actions": actions})
  }


  // taken directly from anki's implementation of { {furigana:...} }
  // https://github.com/ankitects/anki/blob/main/rslib/src/template_filters.rs
  function buildWordDiv(character, wordReading) {

    let wordDiv = document.createElement('div');
    let re = / ?([^ >]+?)\[(.+?)\]/g

    //let wordReadingRuby = wordReading.replaceAll("&nbsp;", " ");
    let wordReadingRuby = wordReading.replace(/&nbsp;/g, " ");
    wordReadingRuby = wordReadingRuby.replace(re, "<ruby><rb>$1</rb><rt>$2</rt></ruby>");
    //wordReadingRuby = wordReadingRuby.replaceAll(character, `<b>${character}</b>`);
    wordReadingRuby = wordReadingRuby.replace(new RegExp(character, "g"), `<b>${character}</b>`);

    wordDiv.innerHTML = wordReadingRuby;
    return wordDiv;
  }

  function buildSentDiv(sentence) {
    let sentenceSpan = document.createElement('span');

    let resultSent = sentence;
    //resultSent = resultSent.replaceAll("<b>", "");
    //resultSent = resultSent.replaceAll("</b>", "");
    resultSent = resultSent.replace(/<b>/g, "");
    resultSent = resultSent.replace(/<\/b>/g, "");
    sentenceSpan.innerHTML = resultSent;

    let openQuote = document.createElement('span');
    openQuote.innerText = "「";
    let closeQuote = document.createElement('span');
    closeQuote.innerText = "」";


    let sentenceDiv = document.createElement('div');
    sentenceDiv.classList.add("left-align-quote");

    sentenceDiv.appendChild(openQuote);
    sentenceDiv.appendChild(sentenceSpan);
    sentenceDiv.appendChild(closeQuote);

    return sentenceDiv;
  }

  function buildCardDiv(character, card, isNew=false) {
    let cardDiv = document.createElement('div');
    let wordDiv = buildWordDiv(character, card["fields"]["WordReading"]["value"]);

    let sentenceDiv = buildSentDiv(card["fields"]["Sentence"]["value"]);

    cardDiv.appendChild(wordDiv);
    cardDiv.appendChild(sentenceDiv);

    if (isNew) {
      cardDiv.classList.add("kanji-hover-tooltip--new");
    }

    return cardDiv;
  }

  function buildString(character, nonNewCardInfo, newCardInfo) {

    /*
     * <span class="kanji-hover-wrapper">
     *   <span class="kanji-hover-text"> (kanji) </span>
     *   <span class="kanji-hover-tooltip-wrapper">
     *     <span class="kanji-hover-tooltip"> ... </span>
     *   </span>
     * </span>
     *
     */

    // wrapper element that isn't used, to get the inner html
    let wrapper = document.createElement('span');

    let kanjiHoverWrapper = document.createElement('span');
    kanjiHoverWrapper.classList.add("kanji-hover-wrapper");


    let kanjiSpan = document.createElement('span');
    kanjiSpan.classList.add("kanji-hover-text");
    kanjiSpan.innerText = character;

    tooltipWrapperSpan = document.createElement('span');
    tooltipWrapperSpan.classList.add("kanji-hover-tooltip-wrapper");

    tooltipSpan = document.createElement('span');
    tooltipSpan.classList.add("kanji-hover-tooltip");

    //logger.warn(character);
    let count = 0;


    for (let card of nonNewCardInfo) {
      //logger.warn(card);
      let cardDiv = buildCardDiv(character, card);
      if (count >= 1) {
        cardDiv.classList.add("kanji-hover-tooltip--not-first");
      }
      count++;

      tooltipSpan.appendChild(cardDiv);
    }

    for (let card of newCardInfo) {
      let cardDiv = buildCardDiv(character, card, isNew=true);
      if (count >= 1) {
        cardDiv.classList.add("kanji-hover-tooltip--not-first");
      }
      count++;

      tooltipSpan.appendChild(cardDiv);
    }


    // 0 length checks
    if (nonNewCardInfo.length + newCardInfo.length == 0) {
      tooltipSpan.innerText = "No other kanjis found.";
    }

    tooltipWrapperSpan.appendChild(tooltipSpan)
    kanjiHoverWrapper.appendChild(kanjiSpan);
    kanjiHoverWrapper.appendChild(tooltipWrapperSpan);
    wrapper.appendChild(kanjiHoverWrapper);

    return wrapper.innerHTML;
  }


  function getWordReadings(nonNewCardInfo, newCardInfo) {
    let wordsArr = []

    for (let card of nonNewCardInfo) {
      wordsArr.push(card["fields"]["WordReading"]["value"])
    }
    for (let card of newCardInfo) {
      wordsArr.push(card["fields"]["WordReading"]["value"])
    }

    //logger.warn(wordsArr.join(" "));
    return wordsArr;
  }



  // kanji hover
  // some code shamelessly stolen from cade's kanji hover:
  // https://github.com/cademcniven/Kanji-Hover/blob/main/_kanjiHover.js

  async function kanjiHover() {

    if (kanjiHoverEnabled) {
      _debug("(JPMN_Kanji) Kanji hover is already enabled");
      return;
    }
    kanjiHoverEnabled = true;

    // realistically, key should be good enough since we assume that key has no duplicates
    // however, just in case, wordreading is added
    let cacheKey = "{{ T('Key') }}.{{ T('WordReading') }}"
    if (cacheKey in kanjiHoverCardCache) {
      _debug("(JPMN_Kanji) Card was cached")
      wordReading.innerHTML = kanjiHoverCardCache[cacheKey];
      //logger.info(`using cached card ${cacheKey}`);
      return;
    }

    let readingHTML = wordReading.innerHTML;

    // uses cache if it already exists
    let kanjiSet = new Set() // set of kanjis that requires api calls
    const regex = /([\u4E00-\u9FAF])(?![^<]*>|[^<>]*<\/g)/g;
    const matches = readingHTML.matchAll(regex);
    for (const match of matches) {
      kanjiSet.add(...match);
    }

    let kanjiDict = {};
    let wordReadings = {}; // used only for the cache

    // attempts to fill out the kanji dict with cached entries
    for (let kanji of [...kanjiSet]) {
      // also checks that the current word is not used
      if ((kanji in kanjiHoverCache) && !(kanjiHoverCache[kanji][0].includes("{{ T('WordReading') }}"))) {
        _debug(`(JPMN_Kanji) Using cached kanji ${kanji}`)
        kanjiDict[kanji] = kanjiHoverCache[kanji][1];
        kanjiSet.delete(kanji);
      }
    }

    // only calls the api on the needed kanjis
    const kanjiArr = [...kanjiSet];
    const queryResults = await cardQueries(kanjiArr);
    const cardsInfo = await getCardsInfo(queryResults);

    _debug(`(JPMN_Kanji) New kanjis: [${kanjiArr.join(", ")}]`)

    for (const [i, character] of kanjiArr.entries()) {
      let nonNewCardInfo = cardsInfo[i*2];
      let newCardInfo = cardsInfo[i*2 + 1];

      // attempts to insert string
      kanjiDict[character] = buildString(character, nonNewCardInfo, newCardInfo);
      wordReadings[character] = getWordReadings(nonNewCardInfo, newCardInfo);
    }

    let re = new RegExp(Object.keys(kanjiDict).join("|"), "gi");
    let resultHTML = readingHTML.replace(re, function (matched) {
      //return kanjiDict[matched] ?? matched;
      return nullish(kanjiDict[matched], matched);
    });

    wordReading.innerHTML = resultHTML;

    // caches card
    kanjiHoverCardCache[cacheKey] = resultHTML;

    //_debug(resultHTML);

    for (let character of kanjiArr) {
      kanjiHoverCache[character] = [wordReadings[character], kanjiDict[character]];
    }

  }

  my.run = kanjiHover;
  return my;

}());



// ==========================
//  Auto Select Pitch Accent
// ==========================
// sets the pitch accent section to be whatever you specify it
// by the pitch accent position number

let JPMN_AutoPA = (function () {

  let my = {};

  const ele = document.getElementById("hidden_pa_positions");
  const eleAJT = document.getElementById("hidden_ajt_word_pitch");
  const eleOverride = document.getElementById("hidden_pa_override");
  const eleDisp = document.getElementById("dh_word_pitch");

  // returns null if cannot find anything
  // otherwise, returns (position (int), dict_name (str))
  // dict_name can be null
  function getPosition() {
    let digit = null;

    if (ele === null) {
      return null;
    }

    // first checks pa override
    digit = eleOverride.innerText.match(/\d+/)
    if (digit !== null) {
      return [Number(digit), "override"];
    }

    let searchHTML = null;
    let dictName = null;
    if ((ele.children.length > 0)
        && (ele.children[0] !== null)
        && (ele.children[0].nodeName === "DIV")
        && (ele.children[0].classList.contains("pa-positions__group"))
    ) {
      // stylized by jpmn standards, walks through

      // <div class="pa-positions__group" data-details="NHK">
      //   <div class="pa-positions__dictionary"><div class="pa-positions__dictionary-inner">NHK</div></div>
      //   <ol>
      //     <li>
      //       <span style="display: inline;"><span>[</span><span>1</span><span>]</span></span>
      //     </li>
      //   </ol>
      // </div>
      // ...

      dictName = ele.children[0].getAttribute("data-details");

      // searches for a bolded element
      let first = true;
      let found = false;
      for (let groupDiv of ele.children) {
        for (let liEle of groupDiv.children[1].children) {
          if (first) {
            first = false;
            searchHTML = liEle.innerHTML;
          }
          if (liEle.innerHTML.includes("<b>")) {
            searchHTML = liEle.innerHTML;
            dictName = groupDiv.getAttribute("data-details") + " (bold)";
            found = true;
            break;
          }
        }

        if (found) {
          break;
        }
      }

    } else {
      // just search for any digit in the element
      searchHTML = ele.innerHTML;
    }

    digit = searchHTML.match(/\d+/);
    if (digit === null) {
      return null;
    }

    return [Number(digit), dictName];
  }

  // taken directly from anki's implementation of { {kana:...} }
  // https://github.com/ankitects/anki/blob/main/rslib/src/template_filters.rs
  function getReadingKana() {
    const readingStr = document.getElementById("hidden_word_reading").innerHTML;

    const re = / ?([^ >]+?)\[(.+?)\]/g

    //let result = readingStr.replaceAll("&nbsp;", " ");
    let result = readingStr.replace(/&nbsp;/g, " ");
    result = readingStr.replace(re, "$2");
    //wordReadingRuby = wordReadingRuby.replaceAll(character, `<b>${character}</b>`);

    return result;
  }

  const EXTENDED_VOWELS = {
    "ア": "ナタサカワラヤマハャパバダザガ",
    "イ": "ニチシキリミヒピビヂジギ" + "ネテセケレメヘペベデゼゲ",
    "ウ": "ヌツスクルユムフュプブヅズグ" + "ノトソコヲロヨモホョポボドゾゴ",
    "エ": "ネテセケレメヘペベデゼゲ",
    "オ": "ノトソコヲロヨモホョポボドゾゴ",
  };

  // function name gore :sob:
  function convertHiraganaToKatakanaWithLongVowelMarks(reading) {
    // converts to katakana and changes vowels to extended vowel form
    let katakana = convertHiraganaToKatakana(reading);
    let result = [...katakana];

    for (let i = 1; i < result.length; i++) {
      if (result[i] in EXTENDED_VOWELS && EXTENDED_VOWELS[result[i]].includes(result[i-1])) {
        result[i] = "ー";
      }
    }

    return result.join("");
  }


  function getMoras(readingKana) {
    // creates div
    const ignoredKana = "ょゅゃョュャ";
    const len = [...readingKana].length;

    // I think the plural of mora is mora, but oh well
    let moras = [];

    let currentPos = 0;
    while (currentPos < len) {
      // checks next kana to see if it's a combined mora (i.e. きょ)
      // ignoredKana.includes(...) <=> ... in ignoredKana
      if (currentPos !== (len-1) && ignoredKana.includes(readingKana[currentPos+1])) {
        moras.push(readingKana.substring(currentPos, currentPos+2));
        currentPos++;
      } else {
        moras.push(readingKana[currentPos])
      }
      currentPos++;
    }

    return moras;
  }


  const LONG_VOWEL_MARKER_TO_VOWEL = {
    "アナタサカワラヤマハャパバダザガ": "ア",
    "イニチシキリミヒピビヂジギ":       "イ",
    "ウヌツスクルユムフュプブヅズグ":   "ウ",
    "エネテセケレメヘペベデゼゲ":       "イ", // "エ",
    "ノトソコヲロヨモホョポボドゾゴ":   "ウ", // "オ",
    "オ": "オ", // "オ",
  }

  function normalizeAJTHTML() {
    // replaces all long katakana markers with the respective normal katakana symbol
    // also removes all ꜜ (remember that we can search for downsteps from the now empty div)

    let result = eleAJT.innerHTML.replace(/&#42780/g, "").replace(/ꜜ/g, "");

    // replaces all nasal entries
    if (result.includes("nasal")) {
      const unmarked = "カキクケコ";
      const marked = "ガギグゲゴ"; // I actually don't know what the two ticks are called

      for (let i = 0; i < 5; i++) {
        result = result.replace(new RegExp(`${unmarked[i]}<span class="nasal">°</span>`, "g"), marked[i]);
      }
    }
    logger.assert(!result.includes("nasal"));

    result = [...result];


    let first = null;
    let second = null;

    for (const [i, c] of result.entries()) {
      if (isCodePointInRange(c.codePointAt(0), KATAKANA_RANGE)) {
        if (first === null) {
          first = c;
        } else if (second === null) {
          second = c;
        } else {
          // pushes back
          first = second;
          second = c;
        }

        if (first !== null && second !== null && second === "ー") {
          let found = false;
          for (const [searchStr, vowel] of Object.entries(LONG_VOWEL_MARKER_TO_VOWEL)) {
            if (searchStr.includes(first)) {
              result[i] = vowel;
              found = true;
              break;
            }
          }

          if (!found) {
            _debug(`(JPMN_AutoPA) Cannot find replacement! ${first} ${second}`);
          }
        }
      }
    }

    return result.join("");
  }


  function getAJTWord(hiraganaReading) {
    const normalizedReading = convertHiraganaToKatakana(hiraganaReading);
    // grabs the raw html split between the ・ characters
    // ASSUMPTION: no html element is split between the ・ characters
    // (apart from <b>, which are ignored)

    if (eleAJT.innerHTML.length === 0) {
      _debug(`(JPMN_AutoPA) AJT word: empty field`);
      return null;
    }

    // normalizes the ajt search string
    const ajtHTML = normalizeAJTHTML();
    //_debug(`ajt html: ${ajtHTML}`)

    // temp used for innerText
    let temp = document.createElement("div");
    temp.innerHTML = ajtHTML;
    const searchString = temp.innerText;
    const wordSearch = searchString.split("・");
    const idx = wordSearch.indexOf(normalizedReading)

    if (idx === -1) {
      _debug(`(JPMN_AutoPA) AJT word: ${normalizedReading} not found among [${wordSearch.join(", ")}]`);
      return null;
    }

    if (wordSearch.length === 1) {
      return eleAJT.innerHTML;
    }

    // otherwise searches on the raw html
    let startIdx = 0;
    let endIdx = 0;
    let currentWord = 0;
    for (const [i, c] of [...eleAJT.innerHTML].entries()) {
      if (c === "・") {
        currentWord += 1;

        if (currentWord === idx) {
          startIdx = i+1;
        } else if (currentWord === idx+1) {
          endIdx = i;
          break
        }
      }
    }

    if (endIdx === 0) {
      endIdx = eleAJT.innerHTML.length
    }

    result = eleAJT.innerHTML.substring(startIdx, endIdx);
    // removes any bold in case it messes with the formatting
    result = result.replace(/<b>/g, "");
    result = result.replace(/<\/b>/g, "");

    //_debug(`(JPMN_AutoPA) ajt word: ${result}`);
    //_debug(`(JPMN_AutoPA) Found AJT word`);
    return result;
  }


  function buildReadingSpan(pos, readingKana) {
    // creates the span to show the pitch accent overline
    // (and attempts to get any existing nasal / devoiced things from the AJT pitch accent plugin)

    let ajtWord = null;
    if ({{ utils.opt("auto-select-pitch-accent", "search-for-ajt-word") }}) {
      ajtWord = getAJTWord(readingKana);
    }

    let result = [];

    if (ajtWord !== null) {
      _debug("(JPMN_AutoPA) Using AJT Word");
      let temp = document.createElement("div");
      let temp2 = document.createElement("div");
      temp.innerHTML = ajtWord;

      // removes pitch accent overline and downstep
      for (let x of temp.childNodes) {
        if (x.nodeName === "SPAN" && x.classList.contains("pitchoverline")) {
          for (const child of x.childNodes) {
            temp2.appendChild(child.cloneNode(true));
          }
        } else if (x.nodeName === "SPAN" && x.classList.contains("downstep")) {
          // skips
        } else {
          temp2.appendChild(x.cloneNode(true));
        }
      }

      // combines the devoiced character into one mora, if it can
      // (e.g. 神出鬼没 (しんしゅつきぼつ) only has the 2nd (し) devoiced, instead of (しゅ)
      // シ<span class="pitchoverline">ン<span class="nopron">シ</span>ュツキボツ</span>
      if (ajtWord.includes("nopron")) {
        // crazy regex replace
        temp2.innerHTML = temp2.innerHTML.replace(
          /<span class="nopron">(.)<\/span>([ュャョ])/g,
          '<span class="nopron">$1$2<\/span>'
        );
      }

      for (let x of temp2.childNodes) {
        if (x.nodeName === "#text") {
          let moras = getMoras(x.data);
          result = result.concat(moras);
        } else if (x.nodeName === "SPAN" && x.classList.contains("nasal")) {
          // assumption: there already exists at least one element before
          // (the nasal marker can't come by itself)
          result[result.length-1] = result[result.length-1] + x.outerHTML;
        } else {
          // assumption: this is the nopron span
          result.push(x.outerHTML);
        }
      }
      //_debug(`result: ${result.join(", ")}`);

    } else {
      _debug(`(JPMN_AutoPA) Using reading from WordReading field`);
      //result = moras.slice(); // shallow copy

      let normalizedReading = null;
      switch ({{ utils.opt("auto-select-pitch-accent", "reading-display-mode") }}) {
        case 0:
          normalizedReading = readingKana;
          break;

        case 1:
          normalizedReading = convertHiraganaToKatakana(readingKana);
          break;

        case 2:
          normalizedReading = convertHiraganaToKatakanaWithLongVowelMarks(readingKana);
          break;

        default:
          throw 'Invalid option for auto-select-pitch-accent.reading-display-mode';
      }

      result = getMoras(normalizedReading);

      _debug(`(JPMN_AutoPA) Moras: ${normalizedReading} -> ${result.join(", ")}`);
    }

    if (result.length === 0) {
      logger.warn("(JPMN_AutoPA) Reading has length of 0?");
      return;
    }

    // special case: 0 and length of moras === 1 (nothing needs to be done)
    if (pos === 0 && result.length === 1) {
      return readingKana;
    }

    const startOverline = '<span class="pitchoverline">';
    const stopOverline = `</span>`;
    const downstep = '<span class="downstep"><span class="downstep-inner">ꜜ</span></span>';

    if (pos === 0) {
      result.splice(1, 0, startOverline); // insert at index 1
      result.push(stopOverline)
    } else if (pos === 1) {
      // start overline starts at the very beginning
      result.splice(pos, 0, stopOverline + downstep);
      result.splice(0, 0, startOverline); // insert at the very beginning
    } else {
      // start overline starts over the 2nd mora
      result.splice(pos, 0, stopOverline + downstep);
      result.splice(1, 0, startOverline); // insert at the very beginning
    }

    result = result.join("");
    return result;

  }

  // main function
  function addPosition() {
    // priority:
    // - PA Override number
    // - PA Override raw text
    // - PA Positions
    // - AJT Word Pitch

    // first checks pa override
    let posResult = null;
    if (eleOverride.innerHTML.length !== 0) {
      let digit = eleOverride.innerText.match(/\d+/)
      if (digit !== null) {
        posResult = [Number(digit), "Override (Position)"];
      } else {
        eleDisp.innerHTML = eleOverride.innerHTML;
        posResult = [null, "Override (Text)"];
      }
    } else {
      // if no PA override, checks PAPositions field
      posResult = getPosition();
    }

    // if no PAPositions or PA Override, then check AJTWordPitch
    if (posResult === null) {
      // last resort: AJT pitch accent
      if (eleAJT.innerHTML.length !== 0) {
        eleDisp.innerHTML = eleAJT.innerHTML;
        posResult = [null, "AJT Pitch Accent"];
      } else {
        _debug("(JPMN_AutoPA) Nothing found.");
        eleDisp.innerText = "(N/A)";
        return;
      }
    }

    const [pos, dictName] = posResult;
    const readingKana = getReadingKana();
    _debug(`(JPMN_AutoPA) pos/dict/reading: ${pos} ${dictName} ${readingKana}`);

    // if pos is null, then the display element has already been set
    if (pos === null) {
      return;
    }

    const readingSpanHTML = buildReadingSpan(pos, readingKana);
    eleDisp.innerHTML = readingSpanHTML;

    //if (dictName !== null) {
    //  // TODO
    //}

    //_debug(`(JPMN_AutoPA) result html: ${eleDisp.innerHTML}`);

  }

  my.run = addPosition;
  return my;

}());




let JPMN_ImgUtils = (function () {

  let my = {};

  let modal = document.getElementById('modal');
  let modalImg = document.getElementById("bigimg");

  // creates a custom image container to hold yomichan images
  function createImgContainer(imgName) {
    // creating this programmically:
    // <span class="glossary__image-container">
    //   <a class="glossary__image-hover-text" href='javascript:;'</a>
    //   <img class="glossary__image-hover-media" src="${imgName}">
    // </span>

    let defSpan = document.createElement('span');
    defSpan.classList.add("glossary__image-container");

    let defAnc = document.createElement('a');
    defAnc.classList.add("glossary__image-hover-text");
    defAnc.href = "javascript:;";
    defAnc.textContent = "[Image]";

    let defImg = document.createElement('img');
    defImg.classList.add("glossary__image-hover-media");
    defImg.src = imgName;

    defImg.onclick = function() {
      modal.style.display = "block";
      modalImg.src = this.src;
    }

    defAnc.onclick = function() {
      modal.style.display = "block";
      modalImg.src = defImg.src;
    }

    defSpan.appendChild(defAnc);
    defSpan.appendChild(defImg);

    return defSpan;
  }


  function editDisplayImage() {
    // edits the display image width/height
    // makes the display image clickable to zoom
    // makes the modal clickable to un-zoom

    // restricting the max height of image to the definition box
    let dhLeft = document.getElementById("dh_left");
    let dhRight = document.getElementById("dh_right");
    let heightLeft = dhLeft.offsetHeight;

    if (dhRight) {
      dhRight.style.maxHeight = heightLeft + "px";

      // setting up the modal styles and clicking
      let dhImgContainer = document.getElementById("dh_img_container");
      let imgList = dhImgContainer.getElementsByTagName("img");

      if (imgList && imgList.length === 1) {
        let img = dhImgContainer.getElementsByTagName("img")[0];
        img.classList.add("dh-right__img");
        img.style.maxHeight = heightLeft + "px"; // restricts max height here too

        img.onclick = function() {
          modal.style.display = "block";
          modalImg.src = this.src;
        }

      } else { // otherwise we hope that there are 0 images here
        // support for no images here: remove the fade-in / fade-out on text
        // the slightly hacky method is just to remove the class all together lol
        dhImgContainer.className = "";
      }
    }


    // close the modal upon click
    modal.onclick = function() {
      bigimg.classList.add("modal-img__zoom-out");
      modal.classList.add("modal-img__zoom-out");
      setTimeout(function() {
        modal.style.display = "none";
        bigimg.className = "modal-img";
        modal.className = "modal";
      }, 200);
    }

  }

  function searchImages() {

    // goes through each blockquote and searches for yomichan inserted images
    let imageSearchElements = document.getElementsByTagName("blockquote");
    for (let searchEle of imageSearchElements) {
      let anchorTags = searchEle.getElementsByTagName("a");
      for (let atag of anchorTags) {
        let imgFileName = atag.getAttribute("href");
        if (imgFileName && imgFileName.substring(0, 25) === "yomichan_dictionary_media") {
          let fragment = createImgContainer(imgFileName);
          atag.parentNode.replaceChild(fragment, atag);
        }
      }

      // looks for user inserted images
      let imgTags = searchEle.getElementsByTagName("img");
      for (let imgEle of imgTags) {
        if (!imgEle.classList.contains("glossary__image-hover-media")) { // created by us
          let fragment = createImgContainer(imgEle.src);
          imgEle.parentNode.replaceChild(fragment, imgEle);
        }
      }
    }
  }

  function run() {
    editDisplayImage();

    // may have to disable this for template {edit:} functionality
    if ({{ utils.opt("image-utilities", "stylize-images-in-glossary") }}) {
      searchImages();
    }
  }


  my.run = run;
  return my;

}());


/// {% endblock %}





/// {% block js_run %}
{{ super() }}

// checks leech
let tags = "{{ T('Tags') }}".split(" ");
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
  let elems = document.getElementsByClassName("glossary-details--grey");
  for (let x of elems) {
    x.style.display = "none";
  }
}


// only continues if kanji-hover is actually enabled
if ({{ utils.opt("kanji-hover", "enabled") }}) {
  if ({{ utils.opt("kanji-hover", "mode") }} === 0) {
    JPMN_KanjiHover.run();
  } else { // === 1
    wordReading.onmouseover = function() {
      // replaces the function with a null function to avoid calling this function
      wordReading.onmouseover = function() {}
      JPMN_KanjiHover.run();
    }
  }
}

if ({{ utils.opt("auto-select-pitch-accent", "enabled") }}) {
  JPMN_AutoPA.run();
}

// ran after the auto pitch accent to properly calculate the height of the left div
if ({{ utils.opt("image-utilities", "enabled") }}) {
  JPMN_ImgUtils.run();
}


// remove all jmdict english dict tags
//var glossaryEle = document.getElementById("primary_definition");
//glossaryEle.innerHTML = glossaryEle.innerHTML.replace(/, JMdict \(English\)/g, "");



//_debug(document.documentElement.innerHTML);

/// {% endblock %}
