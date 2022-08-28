/// {% extends "jp-mining-note/base.js" %}

/// {% block js_functions %}
{{ super() }}

// creates a custom image container to hold yomichan images
function createImgContainer(imgName) {
  // creating this programmically:
  // <span class="glossary__image-container">
  //   <a class="glossary__image-hover-text" href='javascript:;'>[Image]</a>
  //   <img class="glossary__image-hover-media" src="${imgName}">
  // </span>

  var defSpan = document.createElement('span');
  defSpan.classList.add("glossary__image-container");

  var defAnc = document.createElement('a');
  defAnc.classList.add("glossary__image-hover-text");
  defAnc.href = "javascript:;'>[Image]";
  defAnc.textContent = "[Image]";

  var defImg = document.createElement('img');
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



// functions relating to kanji hover

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
    const nonNewQuery = (
      // creates
      `-Word:{{ T('Word') }} Word:*${character}* "card:${cardTypeName}"` +
      ` (-is:new OR (is:new flag:3))` + // not new, or new and green
      ` -(is:suspended flag:1)`); // not red (and suspended)
    const newQuery = (
      //`is:new -Word:{{ T('Word') }} Word:*${character}* Sentence:*${character}* "card:${cardTypeName}"`;
      `-Word:{{ T('Word') }} Word:*${character}* "card:${cardTypeName}"` +
      ` is:new` + // new
      ` -(is:suspended (flag:1 OR flag:3))`); // not suspended and neither red nor green

    //logger.warn(nonNewQuery)
    //logger.warn(newQuery)
    actions.push(constructFindCardAction(nonNewQuery))
    actions.push(constructFindCardAction(newQuery))
  }

  return await invoke("multi", {"actions": actions})
}

function filterCards(nonNewCardIds, newCardIds) {
  // TODO settings
  const nonNewEarliest = 2;
  const nonNewLatest = 2;
  const newLatest = 2;

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

  //let wrapper = document.createElement('div');

  let wordDiv = document.createElement('div');
  // TODO reading
  //let wordReading = card["fields"]["WordReading"]["value"];
  let re = / ?([^ >]+?)\[(.+?)\]/g

  //let wordReadingRuby = wordReading.replaceAll(re, function (matched) {
  //  logger.warn(matched);
  //  logger.warn(matched[1] + "--" + matched[2]);
  //  return `<ruby><rb>${matched[1]}</rb><rt>${matched[2]}</rt></ruby>`
  //});
  let wordReadingRuby = wordReading.replace(re, "<ruby><rb>$1</rb><rt>$2</rt></ruby>");
  //logger.warn(wordReadingRuby);
  wordReadingRuby = wordReadingRuby.replaceAll(character, `<b>${character}</b>`);

  wordDiv.innerHTML = wordReadingRuby;
  return wordDiv;

  //wrapper.appendChild(kanjiSpan);

  //return wrapper.innerHTML;
}

function buildSentDiv(sentence) {
  let sentenceSpan = document.createElement('span');

  let resultSent = sentence;
  //resultSent = resultSent.replace("<b>", "<u>");
  //resultSent = resultSent.replace("</b>", "</u>");
  resultSent = resultSent.replaceAll("<b>", "");
  resultSent = resultSent.replaceAll("</b>", "");
  sentenceSpan.innerHTML = resultSent;

  let openQuote = document.createElement('span');
  //openQuote.classList.add("sentence-quote--open");
  openQuote.innerText = "「";
  let closeQuote = document.createElement('span');
  //closeQuote.classList.add("sentence-quote--close");
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
  // TODO
  //cardDiv.classList.add("kanji-hover-text")

  // TODO reading
  //let wordDiv = document.createElement('div');
  //wordDiv.innerText = card["fields"]["Word"]["value"];
  //logger.warn(JSON.stringify(card["fields"]["Word"]));
  let wordDiv = buildWordDiv(character, card["fields"]["WordReading"]["value"]);
  //buildWordDiv(card["fields"]["WordReading"]["value"]);

  //let sentenceDiv = document.createElement('div');
  //sentenceDiv.innerHTML = card["fields"]["Sentence"]["value"];
  let sentenceDiv = buildSentDiv(card["fields"]["Sentence"]["value"]);
  //logger.warn(sentenceDiv.innerHTML);

  cardDiv.appendChild(wordDiv);
  cardDiv.appendChild(sentenceDiv);

  if (isNew) {
    cardDiv.classList.add("kanji-hover-tooltip--new");
  }

  return cardDiv;
}

function buildString(character, nonNewCardInfo, newCardInfo) {

  let wrapper = document.createElement('span');

  let kanjiSpan = document.createElement('span');
  kanjiSpan.classList.add("kanji-hover-text")
  kanjiSpan.innerText = character;

  tooltipSpan = document.createElement('span');
  tooltipSpan.classList.add("kanji-hover-tooltip")

  //logger.warn(character);
  for (let card of nonNewCardInfo) {
    //logger.warn(card);
    let cardDiv = buildCardDiv(character, card);
    tooltipSpan.appendChild(cardDiv);
  }
  for (let card of newCardInfo) {
    let cardDiv = buildCardDiv(character, card, isNew=true);
    tooltipSpan.appendChild(cardDiv);
  }


  // 0 length checks
  if (nonNewCardInfo.length + newCardInfo.length == 0) {
    tooltipSpan.innerText = "No other kanjis found.";
  }

  kanjiSpan.appendChild(tooltipSpan);

  wrapper.appendChild(kanjiSpan);

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


/// {% endblock %}




/// {% block js_run %}
{{ super() }}

// checks leech
let tags = "{{ T('Tags') }}".split(" ");
if (tags.includes("leech")) {
  logger.leech();
}


// a bit of a hack...
// The only reason why the downstep arrow exists in the first place is to make the downstep
// mark visible while editing the field in anki. Otherwise, there is no reason for it to exist.
//let wp = document.getElementById("dh_word_pitch");
//wp.innerHTML = wp.innerHTML.replace(/&#42780/g, "").replace(/ꜜ/g, "");


// kanji hover
// some code shamelessly stolen from cade's kanji hover:
// https://github.com/cademcniven/Kanji-Hover/blob/main/_kanjiHover.js

// element outside async function to prevent double-adding due to anki funkyness
let wordReading = document.getElementById("dh_reading");

// why isn't this built in already...
// computes a - b, given a and b are both sets
function set_difference(a, b) {
  return new Set([...a].filter(x => !b.has(x)));
}

(async function() {
  // kanji hover code

  return;
  let cacheKey = "{{ T('Key') }}.{{ T('WordReading') }}"
  if (cacheKey in kanjiHoverCardCache) {
    _debug("Card was cached")
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
      _debug(`Using cached kanji ${kanji}`)
      kanjiDict[kanji] = kanjiHoverCache[kanji][1];
      kanjiSet.delete(kanji);
    }
  }

  // only calls the api on the needed kanjis
  const kanjiArr = [...kanjiSet];
  const queryResults = await cardQueries(kanjiArr);
  const cardsInfo = await getCardsInfo(queryResults);

  _debug(`New kanjis: [${kanjiArr.join(", ")}]`)

  for (const [i, character] of kanjiArr.entries()) {
    let nonNewCardInfo = cardsInfo[i*2];
    let newCardInfo = cardsInfo[i*2 + 1];

    // attempts to insert string
    kanjiDict[character] = buildString(character, nonNewCardInfo, newCardInfo);
    wordReadings[character] = getWordReadings(nonNewCardInfo, newCardInfo);
  }

  let re = new RegExp(Object.keys(kanjiDict).join("|"), "gi");
  let resultHTML = readingHTML.replace(re, function (matched) {
    return kanjiDict[matched] ?? matched;
  });

  wordReading.innerHTML = resultHTML;

  // caches card
  kanjiHoverCardCache[cacheKey] = resultHTML;

  _debug(resultHTML);

  for (let character of kanjiArr) {
    kanjiHoverCache[character] = [wordReadings[character], kanjiDict[character]];
  }

})();


var modal = document.getElementById('modal');
var modalImg = document.getElementById("bigimg");

// restricting the max height of image to the definition box
var dhLeft = document.getElementById("dh_left");
var dhRight = document.getElementById("dh_right");
var heightLeft = dhLeft.offsetHeight;

if (dhRight) {
  dhRight.style.maxHeight = heightLeft + "px";

  // setting up the modal styles and clicking
  var dhImgContainer = document.getElementById("dh_img_container");
  var imgList = dhImgContainer.getElementsByTagName("img");

  if (imgList && imgList.length === 1) {
    var img = dhImgContainer.getElementsByTagName("img")[0];
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


// remove all jmdict english dict tags
//var glossaryEle = document.getElementById("primary_definition");
//glossaryEle.innerHTML = glossaryEle.innerHTML.replace(/, JMdict \(English\)/g, "");

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
}

//_debug(document.documentElement.innerHTML);

/// {% endblock %}
