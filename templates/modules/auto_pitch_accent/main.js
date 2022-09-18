


/// {% set functions %}

// ==========================
//  Auto Select Pitch Accent
// ==========================
// sets the pitch accent section to be whatever you specify it
// by the pitch accent position number

const JPMNAutoPA = (() => {


  const logger = new JPMNLogger("auto-pitch-accent");

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
      for (const groupDiv of ele.children) {
        for (const liEle of groupDiv.children[1].children) {
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
    const katakana = convertHiraganaToKatakana(reading);
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

      // 5 is length of unmarked and marked
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
            logger.debug(`Cannot find replacement! ${first} ${second}`);
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
      logger.debug(`AJT word: empty field`);
      return null;
    }

    // normalizes the ajt search string
    const ajtHTML = normalizeAJTHTML();

    // temp used for innerText
    let temp = document.createElement("div");
    temp.innerHTML = ajtHTML;
    const searchString = temp.innerText;
    const wordSearch = searchString.split("・");
    const idx = wordSearch.indexOf(normalizedReading)

    if (idx === -1) {
      logger.debug(`AJT word: ${normalizedReading} not found among [${wordSearch.join(", ")}]`);
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

    return result;
  }


  function buildReadingSpan(pos, readingKana) {
    // creates the span to show the pitch accent overline
    // (and attempts to get any existing nasal / devoiced things from the AJT pitch accent plugin)

    let ajtWord = null;
    if ({{ utils.opt("modules", "auto-pitch-accent", "search-for-ajt-word") }}) {
      ajtWord = getAJTWord(readingKana);
    }

    let result = [];

    if (ajtWord !== null) {
      logger.debug("Using AJT Word");

      // temp element to iterate through childnodes of ajt word
      const temp = document.createElement("div");

      // temp element to store the flattened version of the ajt word div
      // and for converting into a list of moras
      const temp2 = document.createElement("div");
      temp.innerHTML = ajtWord;

      // removes pitch accent overline and downstep
      for (const x of temp.childNodes) {
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

      for (const x of temp2.childNodes) {
        if (x.nodeName === "#text") {
          const moras = getMoras(x.data);
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

    } else {
      logger.debug(`Using reading from WordReading field`);

      let normalizedReading = null;
      switch ({{ utils.opt("modules", "auto-pitch-accent", "reading-display-mode") }}) {
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
          throw 'Invalid option for modules.auto-pitch-accent.reading-display-mode';
      }

      result = getMoras(normalizedReading);

      logger.debug(`Moras: ${normalizedReading} -> ${result.join(", ")}`);
    }

    if (result.length === 0) {
      logger.warn("Reading has length of 0?");
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
      const digit = eleOverride.innerText.match(/\d+/)
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
        logger.debug("Nothing found.");
        eleDisp.innerText = "(N/A)";
        return;
      }
    }

    const [pos, dictName] = posResult;
    const readingKana = getReadingKana();
    logger.debug(`pos/dict/reading: ${pos} ${dictName} ${readingKana}`);

    // if pos is null, then the display element has already been set
    if (pos === null) {
      return;
    }

    const readingSpanHTML = buildReadingSpan(pos, readingKana);
    eleDisp.innerHTML = readingSpanHTML;

    //if (dictName !== null) {
    //  // TODO
    //}

  }

  class JPMNAutoPA {

    constructor() {}

    run() {
      addPosition();
    }
  }


  return JPMNAutoPA;

})();

/// {% endset %}





/// {% set run %}

if ({{ utils.opt("modules", "auto-pitch-accent", "enabled") }}) {
  const auto_pa = new JPMNAutoPA();
  auto_pa.run();
}

/// {% endset %}
