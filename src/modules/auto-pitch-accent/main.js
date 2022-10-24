


/// {% set functions %}

// ==========================
//  Auto Select Pitch Accent
// ==========================
// sets the pitch accent section to be whatever you specify it
// by the pitch accent position number

const JPMNAutoPA = (() => {

  const logger = new JPMNLogger("auto-pitch-accent");

  //const ele = document.getElementById("hidden_pa_positions");
  //const eleAJT = document.getElementById("hidden_ajt_word_pitch");
  //const eleOverride = document.getElementById("hidden_pa_override");
  //const eleDisp = document.getElementById("dh_word_pitch");


  function createDivIfStr(x) { /* just as a wrapper function */
    if (typeof x === 'string' || x instanceof String) {
      let ele = document.createElement('div');
      ele.innerHTML = x;
      return ele;
    }
    return x;
  }



  function applyPAColorTags() {
    // applies color tags as well if they exist

    const tagsEle = document.getElementById("tags");
    const tags = tagsEle.innerText.split(" ");
    const COLOR_TAGS = {
      "平板": "heiban",
      "heiban": "heiban",

      "頭高": "atamadaka",
      "atamadaka": "atamadaka",

      "中高": "nakadaka",
      "nakadaka": "nakadaka",

      "尾高": "odaka",
      "odaka": "odaka",

      "起伏": "kifuku",
      "kifuku": "kifuku",
    }

    for (ct of Object.keys(COLOR_TAGS)) {
      if (tags.includes(ct)) {
        paintDisplay(COLOR_TAGS[ct]);
        return true;
      }
    }
    return false;
  }

  function paintDisplay(type) {
    const wordClass = `pa-word-highlight-${type}`;
    const sentClass = `pa-sentence-highlight-${type}`;

    // adds to reading
    if ({{ utils.opt("modules", "auto-pitch-accent", "colored-pitch-accent", "color-reading") }}) {
      const readingEle = document.getElementById("dh_reading");
      readingEle.classList.add(wordClass);
    }

    if ({{ utils.opt("modules", "auto-pitch-accent", "colored-pitch-accent", "color-display") }}) {
      // adds to display sentence
      // .highlight-bold is added to the query to ensure that we are not highlighting
      // a sentence that wasn't highlighted already.
      const sentences = document.querySelectorAll(".expression--sentence.highlight-bold")
      if (sentences !== null) {
        for (let sent of sentences) {
          sent.classList.add(sentClass);
        }
      }

      // adds to display word
      const words = document.querySelectorAll(".expression--word")
      if (words !== null) {
        for (let word of words) {
          word.classList.add(wordClass);
        }
      }
    }

    // changes pitch accent overline
    if ({{ utils.opt("modules", "auto-pitch-accent", "colored-pitch-accent", "color-overline") }}) {
      const wordPitchEle = document.getElementById("dh_word_pitch");
      wordPitchEle.style.setProperty('--pa-overline-color', `var(--text-${type})`);
    }
  }

  class JPMNAutoPA {

    constructor(attemptColor=true, logLevelDecrease=0) {
      this.attemptColor = attemptColor; // attempts to color according to pitch accent groups
      this.jpUtils = new JPMNJPUtils();
      this.logLvl = 3 - logLevelDecrease;
    }


    // taken directly from anki's implementation of { {kana:...} }
    // https://github.com/ankitects/anki/blob/main/rslib/src/template_filters.rs
    getReadingKana() {
      const readingStr = this.readingEle.innerHTML;

      const re = / ?([^ >]+?)\[(.+?)\]/g

      //let result = readingStr.replaceAll("&nbsp;", " ");
      let result = readingStr.replace(/&nbsp;/g, " ");
      result = readingStr.replace(re, "$2");

      return result;
    }


    // returns null if cannot find anything
    // otherwise, returns (position (int), dict_name (str))
    // dict_name can be null
    getPosition() {
      let digit = null;

      if (this.positionsEle === null) {
        return null;
      }

      // first checks pa override
      digit = this.overrideEle.innerText.match(/\d+/)
      if (digit !== null) {
        return [Number(digit), "override"];
      }

      let searchHTML = null;
      let dictName = null;
      if ((this.positionsEle.children.length > 0)
          && (this.positionsEle.children[0] !== null)
          && (this.positionsEle.children[0].nodeName === "DIV")
          && (this.positionsEle.children[0].classList.contains("pa-positions__group"))
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

        dictName = this.positionsEle.children[0].getAttribute("data-details");

        // searches for a bolded element
        let first = true;
        let found = false;
        for (const groupDiv of this.positionsEle.children) {
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
        searchHTML = this.positionsEle.innerHTML;
      }

      digit = searchHTML.match(/\d+/);
      if (digit === null) {
        return null;
      }

      return [Number(digit), dictName];
    }



    normalizeAJTHTML() {
      // replaces all long katakana markers with the respective normal katakana symbol
      // also removes all ꜜ (remember that we can search for downsteps from the now empty div)

      let result = this.ajtEle.innerHTML.replace(/&#42780/g, "").replace(/ꜜ/g, "");
      result = result.replace(/<b>/g, "");
      result = result.replace(/<\/b>/g, "");

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
        if (this.jpUtils.isCodePointInRange(c.codePointAt(0), this.jpUtils.KATAKANA_RANGE)) {
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
            for (const [searchStr, vowel] of Object.entries(this.jpUtils.LONG_VOWEL_MARKER_TO_VOWEL)) {
              if (searchStr.includes(first)) {
                result[i] = vowel;
                found = true;
                break;
              }
            }

            if (!found) {
              logger.debug(`Cannot find replacement! ${first} ${second}`, this.logLvl);
            }
          }
        }
      }

      return result.join("");
    }



    getMorasOfAJTWord(ajtWord) {

      let result = [];

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
          const moras = this.jpUtils.getMoras(x.data);
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

      return result;

    }


    getAJTWord(hiraganaReading) {
      const normalizedReading = this.jpUtils.convertHiraganaToKatakana(hiraganaReading);
      // grabs the raw html split between the ・ characters
      // ASSUMPTION: no html element is split between the ・ characters
      // (apart from <b>, which are ignored)

      if (this.ajtEle.innerHTML.length === 0) {
        logger.debug(`AJT word: empty field`, this.logLvl);
        return null;
      }

      // normalizes the ajt search string
      const ajtHTML = this.normalizeAJTHTML();
      // removes any bold in case it messes with the formatting
      const resultSearchHTML = this.ajtEle.innerHTML.replace(/<b>/g, "").replace(/<\/b>/g, "");

      // temp used for innerText
      let temp = document.createElement("div");
      temp.innerHTML = ajtHTML;
      const searchString = temp.innerText;
      const wordSearch = searchString.split("・");
      const idx = wordSearch.indexOf(normalizedReading)

      if (idx === -1) {
        logger.debug(`AJT word: ${normalizedReading} not found among [${wordSearch.join(", ")}]`, this.logLvl);
        return null;
      }

      if (wordSearch.length === 1) {
        return resultSearchHTML;
      }

      // otherwise searches on the raw html
      let startIdx = 0;
      let endIdx = 0;
      let currentWord = 0;
      for (const [i, c] of [...resultSearchHTML].entries()) {
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
        endIdx = resultSearchHTML.length
      }

      let result = resultSearchHTML.substring(startIdx, endIdx);

      return result;
    }


    buildReadingSpan(pos, readingKana) {
      // creates the span to show the pitch accent overline
      // (and attempts to get any existing nasal / devoiced things from the AJT pitch accent plugin)

      let ajtWord = null;
      if ({{ utils.opt("modules", "auto-pitch-accent", "search-for-ajt-word") }}) {
        ajtWord = this.getAJTWord(readingKana);
      }

      let result = [];
      let normalizedReading = null;

      if (ajtWord !== null) {
        logger.debug("Using AJT Word", this.logLvl);
        result = this.getMorasOfAJTWord(ajtWord);
      } else {
        logger.debug(`Using reading from WordReading field`, this.logLvl);

        switch ({{ utils.opt("modules", "auto-pitch-accent", "reading-display-mode") }}) {
          case 0:
            normalizedReading = readingKana;
            break;

          case 1:
            normalizedReading = this.jpUtils.convertHiraganaToKatakana(readingKana);
            break;

          case 2:
            normalizedReading = this.jpUtils.convertHiraganaToKatakanaWithLongVowelMarks(readingKana);
            break;

          default:
            throw 'Invalid option for modules.auto-pitch-accent.reading-display-mode';
        }

        result = this.jpUtils.getMoras(normalizedReading);

        logger.debug(`Moras: ${normalizedReading} -> ${result.join(", ")}`, this.logLvl);
      }

      if (result.length === 0) {
        logger.warn("Reading has length of 0?");
        return;
      }

      const kifukuList = {{ utils.opt("modules", "auto-pitch-accent", "kifuku-override") }};

      // attempts to color word
      if ({{ utils.opt("modules", "auto-pitch-accent", "colored-pitch-accent", "enabled") }} && this.attemptColor) {
        if (!applyPAColorTags()) {
          if (kifukuList.includes(pos)) {
            // 起伏 (undulation, usually reserved for い-adjs / non-する verbs)
            paintDisplay("kifuku");
          } else if (pos === 0) {
            // 平板 (e.g. 自然 - しぜん￣)
            paintDisplay("heiban");
          } else if (pos >= result.length) {
            // 尾高 (e.g. 頭 - あたま＼)
            // - pos should never be strictly greater than length of moras,
            //   but the condition is here just in case of mis-input.
            // - ASSUMPTION: we categorize 1 mora long words with a downstep as 尾高,
            //   e.g. 木 (き＼).
            // - NOTE: I asked whether 1 mora words with downsteps are 頭高・尾高
            //   in TMW server and got this response (thanks NotOrange#0654):
            //    > They are generally considered 尾高. I believe it to be because
            //    > the definition of 尾高 is when the drop is on a particle rather
            //    > than another mora of the same word. There are, however, good
            //    > arguments for categorising them as 頭高 that I'm partial towards.
            //    > One being that it makes for far fewer exceptions regarding the
            //    > 平板-ifying effect の often has on 尾高 words that single-mora
            //    > words are regular exceptions to.
            paintDisplay("odaka");
          } else if (pos === 1) {
            // 頭高 (e.g. 僕 - ぼ＼く)
            paintDisplay("atamadaka");
          } else {
            // 中高 (e.g. 不審者 - ふし＼んしゃ)
            paintDisplay("nakadaka");
          }
        }
      }

      // special case: 0 and length of moras === 1 (nothing needs to be done)
      // ASSUMPTION: the override kifuku value will NOT be 0 (you are insane if you do that)
      if (pos === 0 && result.length === 1) {
        return normalizedReading;
      }

      const startOverline = '<span class="pitchoverline">';
      const stopOverline = `</span>`;
      const downstep = '<span class="downstep"><span class="downstep-inner">ꜜ</span></span>';

      if (kifukuList.includes(pos)) {
        if (result.length < 2) {
          logger.warn("Cannot apply 起伏 on word with less than 2 moras.");
        } else if (result.length == 2) { // equivalent to pos == 1
          result.splice(1, 0, stopOverline + downstep); // downstep after first mora
          result.splice(0, 0, startOverline); // overline starting at the very beginning
        } else { // equivalent to pos == #moras-1
          result.splice(-1, 0, stopOverline + downstep); // insert right before last index
          result.splice(1, 0, startOverline); // insert at index 1
        }
      } else if (pos === 0) {
        result.splice(1, 0, startOverline); // insert at index 1
        result.push(stopOverline)
      } else if (pos === 1) {
        // start overline starts at the very beginning
        result.splice(pos, 0, stopOverline + downstep);
        result.splice(0, 0, startOverline); // insert at the very beginning
      } else if (pos < 0) {
        logger.warn(`Pitch Accent position (${pos}) is negative.`);
      } else {
        if (pos > result.length) {
          logger.warn(`Pitch Accent position (${pos}) is greater than number of moras (${result.length}).`);
        }
        // start overline starts over the 2nd mora
        result.splice(pos, 0, stopOverline + downstep);
        result.splice(1, 0, startOverline); // insert at index 1
      }

      result = result.join("");
      return result;

    }


    // main function
    addPosition(positionsEle, ajtEle, overrideEle, readingEle, displayEle) {
      // priority:
      // - PA Override number
      // - PA Override raw text
      // - PA Positions
      // - AJT Word Pitch
      //

      this.positionsEle = createDivIfStr(positionsEle);
      this.ajtEle = createDivIfStr(ajtEle);
      this.overrideEle = createDivIfStr(overrideEle);
      this.readingEle = createDivIfStr(readingEle);
      this.displayEle = createDivIfStr(displayEle);

      // first checks pa override
      let posResult = null;
      if (this.overrideEle.innerHTML.length !== 0) {
        const digit = this.overrideEle.innerText.match(/^[-]?\d+$/);
        if (digit !== null) {
          posResult = [Number(digit), "Override (Position)"];
        } else {
          displayEle.innerHTML = this.overrideEle.innerHTML;
          posResult = [null, "Override (Text)"];
        }
      } else {
        // if no PA override, checks PAPositions field
        posResult = this.getPosition();
      }

      // if no PAPositions or PA Override, then check AJTWordPitch
      if (posResult === null) {
        // last resort: AJT pitch accent
        if (this.ajtEle.innerHTML.length !== 0) {
          displayEle.innerHTML = this.ajtEle.innerHTML;
          posResult = [null, "AJT Pitch Accent"];
        } else {
          logger.debug("Nothing found.", this.logLvl);
          displayEle.innerText = "(N/A)";
          return;
        }
      }

      const [pos, dictName] = posResult;
      const readingKana = this.getReadingKana();
      logger.debug(`pos/dict/reading: ${pos} ${dictName} ${readingKana}`, this.logLvl);

      // if pos is null, then the display element has already been set
      if (pos === null) {
        if ({{ utils.opt("modules", "auto-pitch-accent", "colored-pitch-accent", "enabled") }}) {
          applyPAColorTags();
        }
        return;
      }

      const readingSpanHTML = this.buildReadingSpan(pos, readingKana);
      displayEle.innerHTML = readingSpanHTML;

      //if (dictName !== null) {
      //  // TODO
      //}

    }

  }


  return JPMNAutoPA;

})();

/// {% endset %}





/// {% set run %}

if ({{ utils.opt("modules", "auto-pitch-accent", "enabled") }}) {

  const positionsEle = document.getElementById("hidden_pa_positions");
  const ajtEle = document.getElementById("hidden_ajt_word_pitch");
  const overrideEle = document.getElementById("hidden_pa_override");
  const readingEle = document.getElementById("hidden_word_reading");
  const displayEle = document.getElementById("dh_word_pitch");

  const autoPA = new JPMNAutoPA();
  autoPA.addPosition(positionsEle, ajtEle, overrideEle, readingEle, displayEle);
}

/// {% endset %}
