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

  async function cardQueries(kanjiArr) {
    const cardTypeName = '{{ TEMPLATES(note.card_type, "name").item() }}';

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
      const nonNewQuery =
        `-is:new -Word:{{ T('Word') }} Word:*${character}* Sentence:*${character}* "card:${cardTypeName}"`;
      const newQuery =
        `is:new -Word:{{ T('Word') }} Word:*${character}* Sentence:*${character}* "card:${cardTypeName}"`;

      //logger.warn(nonNewQuery)
      //logger.warn(newQuery)
      actions.push(constructFindCardAction(nonNewQuery))
      actions.push(constructFindCardAction(newQuery))
    }

    return await invoke("multi", {"actions": actions})
  }

  function filterCards(nonNewCardIds, newCardIds) {
    // TODO settings
    const nonNewEarliest = 3;
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


/// {% endblock %}




/// {% block js_run %}
  {{ super() }}

  // checks leech
  var tags = "{{ T('Tags') }}".split(" ");
  if (tags.includes("leech")) {
    logger.leech();
  }


  // a bit of a hack...
  // The only reason why the downstep arrow exists in the first place is to make the downstep
  // mark visible while editing the field in anki. Otherwise, there is no reason for it to exist.
  var wp = document.getElementById("dh_word_pitch");
  wp.innerHTML = wp.innerHTML.replace(/&#42780/g, "").replace(/ꜜ/g, "");


  // kanji hover
  // some code shamelessly stolen from cade's kanji hover:
  // https://github.com/cademcniven/Kanji-Hover/blob/main/_kanjiHover.js

  // element outside async function to prevent double-adding due to anki funkyness
  let wordReading = document.getElementById("dh_reading");

  (async function() {

    var kanji = new Set()
    const regex = /([\u4E00-\u9FAF])(?![^<]*>|[^<>]*<\/g)/g;
    const matches = wordReading.innerHTML.matchAll(regex);
    for (const match of matches) {
      kanji.add(...match);
    }

    let kanjiArr = [...kanji];

    //const cardTypeName = '{{ TEMPLATES(note.card_type, "name").item() }}';

    //function constructFindCardAction(query) {
    //  return {
    //    "action": "findCards",
    //    "params": {
    //      "query": query,
    //    }
    //  }
    //}

    //// constructs the multi findCards request for ankiconnect
    //let actions = [];
    //for (const character of kanjiArr) {
    //  const nonNewQuery =
    //    `-is:new -Word:{{ T('Word') }} Word:*${character}* Sentence:*${character}* "card:${cardTypeName}"`;
    //  const newQuery =
    //    `is:new -Word:{{ T('Word') }} Word:*${character}* Sentence:*${character}* "card:${cardTypeName}"`;

    //  //logger.warn(nonNewQuery)
    //  //logger.warn(newQuery)
    //  actions.push(constructFindCardAction(nonNewQuery))
    //  actions.push(constructFindCardAction(newQuery))
    //}

    //const queryResults = await invoke("multi", {"actions": actions})
    const queryResults = await cardQueries(kanjiArr);

    // TODO settings
    //const nonNewEarliest = 3;
    //const nonNewLatest = 2;
    //const newLatest = 2;

    for (const [i, character] of kanjiArr.entries()) {
      // ids are equivalent to creation dates, so sorting ids is equivalent to
      // sorting to card creation date
      let nonNewCardIds = queryResults[i*2].sort();
      let newCardIds = queryResults[i*2 + 1].sort();
      [nonNewResultIds, newResultIds] = filterCards(nonNewCardIds, newCardIds)

      //// non new: gets the earliest and latest
      //let nonNewResultIds = []
      //if (nonNewCardIds.length > nonNewEarliest + nonNewLatest) {
      //  nonNewResultIds = [
      //    ...nonNewCardIds.slice(0, nonNewEarliest), // earliest
      //    ...nonNewCardIds.slice(-nonNewLatest, nonNewCardIds.length), // latest
      //  ];
      //} else {
      //  nonNewResultIds = [...nonNewCardIds];
      //}
      ////logger.warn(nonNewCardIds);
      ////logger.warn(nonNewResultIds);

      //// new: gets the earliest
      //let newResultIds = newCardIds.slice(0, newLatest);
      //logger.warn(newCardIds);
      //logger.warn(newResultIds);
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

/// {% endblock %}
