


/// {% set functions %}

// ==========================
//  Auto Select Pitch Accent
// ==========================
// sets the pitch accent section to be whatever you specify it
// by the pitch accent position number

const JPMNAutoPA = (() => {

  class DispPosData {
    constructor() {
      this.posHTML = null;
      //this.posList = null;
      //this.posData = null;
      this.posDataList = [];
      this.dict = null;
      this.readingMora = [];
    }

    hasData() {
      //return (this.posHTML !== null) || (this.posList !== null);
      return (this.posHTML !== null) || (this.posDataList.length > 0);
    }

    toString() {
      return `DispPosData(dict="${this.dict}", posHTML="${this.posHTML}", posDataList=${this.posDataList})`;
    }

    // searches for first bolded
    // if no bolded -> returns first item
    getFirstPos() {
      if (this.posDataList.length === 0) {
        return null;
      }

      for (const posData of this.posDataList) {
        if (posData.bolded) {
          return posData;
        }
      }

      return this.posDataList[0];
    }

    hasBoldedPos() {
      for (const posData of this.posDataList) {
        if (posData.bolded) {
          return true;
        }
      }
      return false;
    }

  }


  class PosData {
    constructor(pos, bolded=false, mainPos=false) {
      this.pos = pos;
      this.bolded = bolded;
      this.mainPos = mainPos;
      this.readingMora = [];
      this.separator = null;
    }

    toString() {
      let data = ""
      if (this.bolded) {
        data += "*";
      }
      data += this.pos;
      if (this.readingMora.length) {
        data += ` | ${this.readingMora}`;
      }
      return `PosData(${data})`;
    }
  }

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

    //const tagsEle = document.getElementById("tags");
    //const tags = tagsEle.innerText.split(" ");
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
      if (TAGS_LIST.includes(ct)) {
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
        for (const sent of sentences) {
          sent.classList.add(sentClass);
        }
      }

      // adds to display word
      const words = document.querySelectorAll(".expression--word")
      if (words !== null) {
        for (const word of words) {
          word.classList.add(wordClass);
        }
      }
    }

    // changes pitch accent overline
    if ({{ utils.opt("modules", "auto-pitch-accent", "colored-pitch-accent", "color-overline") }}) {
      const wordPitchEle = document.getElementById("dh_word_pitch");
      wordPitchEle.style.setProperty('--pa-overline-color', `var(--text-${type})`);
    }

    if ({{ utils.opt("modules", "auto-pitch-accent", "colored-pitch-accent", "color-full-sentence") }}) {
      const fullSentEle = document.getElementById("full_sentence");
      fullSentEle.classList.add(sentClass);
    }

    if ({{ utils.opt("modules", "auto-pitch-accent", "colored-pitch-accent", "color-definitions") }}) {
      const defs = document.querySelectorAll(".glossary-text")
      if (defs !== null) {
        for (const def of defs) {
          //def.classList.add(sentClass);
          // uses setProperty instead to deal with custom dictionary bold / highlights
          def.style.setProperty('--highlight-bold-color', `var(--text-${type})`);
        }
      }
    }

  }

  class JPMNAutoPA {

    constructor(attemptColor=true, logLevelDecrease=0, showTitle=true, removeNasal=false) {
      // attempts to color according to pitch accent groups
      this.attemptColor = (attemptColor &&
          {{ utils.opt("modules", "auto-pitch-accent", "colored-pitch-accent", "enabled") }});

      this.jpUtils = new JPMNJPUtils();
      this.logLvl = 3 - logLevelDecrease;
      this.showTitle = showTitle;
      this.removeNasal = removeNasal;
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

    /* takes a list of children, separates positions into bolded and unbolded */
    calcPositionsFromChildren(searchChildren) {
      let result = [];
      let foundBold = false;

      for (const c of searchChildren) {
        let digit = c.innerHTML.match(/\d+/);
        if (digit === null) {
          logger.debug(`Skipping invalid value? ${c.innerHTML}`, this.logLvl);
          continue;
        }

        let bolded = c.innerHTML.includes("<b>");
        let posData = new PosData(Number(digit), bolded);

        if (bolded && !foundBold) {
          posData.mainPos = true;
          foundBold = true;
        }

        result.push(posData);
      }

      // bolds first entry if if:
      // - bold not found
      // - only one entry found
      // - if two entries found and option allows it
      const setFirstPitchMain = {{ utils.opt("modules", "auto-pitch-accent", "pa-positions", "set-first-pitch-as-main") }};
      if (!foundBold && ((result.length > 1 && setFirstPitchMain) || (result.length === 1))) {
        result[0].mainPos = true;
      }

      return result;
    }

    /* takes a list of children, attempts to find first bolded, if not found: use first item */
    calcMainPosFromChildren(searchChildren) {
      let firstDigit = null;

      for (const c of searchChildren) {
        let digit = c.innerHTML.match(/\d+/);
        if (digit === null) {
          logger.debug(`Skipping invalid value? ${c.innerHTML}`, this.logLvl);
          continue;
        }

        if (firstDigit === null) {
          firstDigit = Number(digit);
        }

        if (c.innerHTML.includes("<b>")) {
          return new PosData(Number(digit), true, true);
        }
      }

      return new PosData(firstDigit, false, true);
    }

    calcDispPosDataFromJPMNPositions() {
      // stylized by jpmn standards, walks through

      // <div class="pa-positions__group" data-details="NHK"> <!-- === groupDiv -->
      //   <div class="pa-positions__dictionary"><div class="pa-positions__dictionary-inner">NHK</div></div>
      //   <ol> <!-- === groupDiv.children[1] -->
      //     <li>
      //       <span style="display: inline;"><span>[</span><span>1</span><span>]</span></span>
      //     </li>
      //   </ol>
      // </div>
      // ...

      let result = new DispPosData();
      let searchChildren = null;

      // searches for a bolded element
      for (const groupDiv of this.positionsEle.children) {
        for (const liEle of groupDiv.children[1].children) {
          if (liEle.innerHTML.includes("<b>")) {
            searchChildren = groupDiv.children[1].children;
            result.dict = groupDiv.getAttribute("data-details");
            break;
          }
        }

        if (searchChildren !== null) {
          break;
        }
      }

      if (searchChildren === null) {
        const groupDiv = this.positionsEle.children[0];
        result.dict = groupDiv.getAttribute("data-details");
        searchChildren = groupDiv.children[1].children;
      }

      if ({{ utils.opt("modules", "auto-pitch-accent", "pa-positions", "display-entire-dictionary") }}) {
        result.posDataList = this.calcPositionsFromChildren(searchChildren);
      } else {
        result.posDataList = [this.calcMainPosFromChildren(searchChildren)];
      }
      return result;
    }


    /*
     * calculates display data from the PAPositions field
     *
     * - iterates through all lists to find the first list with bold
     * - if nothing bolded, picks first list found
     *
     * - returns first pitch accent, or entire list (depending on the RTO)
     */
    calcDispPosDataFromPositions() {
      // ensures the field is usable
      if (this.positionsEle === null || this.positionsEle.innerHTML.length === 0
          || this.positionsEle.children.length === 0) {
        return new DispPosData();
      }

      if ((this.positionsEle.children[0] !== null)
          && (this.positionsEle.children[0].nodeName === "DIV")
          && (this.positionsEle.children[0].classList.contains("pa-positions__group"))
      ) {
        return this.calcDispPosDataFromJPMNPositions();
      }

      // just search for any digit in the element
      let searchHTML = this.positionsEle.innerHTML;
      let digit = searchHTML.match(/\d+/);
      if (digit === null) {
        return new DispPosData();
      }

      let result = new DispPosData();
      let posData = new PosData(Number(digit));
      posData.mainPos = true;
      result.posDataList.push(posData)
      result.dict = "PAPositions";
      return result;
    }


    removeNasalStr(string) {
      if (string.includes("nasal")) {

        const unmarked = "カキクケコ";
        const marked = "ガギグゲゴ"; // I actually don't know what the two ticks are called

        // 5 is length of unmarked and marked
        for (let i = 0; i < 5; i++) {
          string = string.replace(new RegExp(`${unmarked[i]}<span class="nasal">°</span>`, "g"), marked[i]);
        }
      }

      logger.assert(!string.includes("nasal"));
      return string;
    }


    normalizeAJTHTML() {
      // replaces all long katakana markers with the respective normal katakana symbol
      // also removes all ꜜ (remember that we can search for downsteps from the now empty div)

      let result = this.ajtEle.innerHTML.replace(/&#42780/g, "").replace(/ꜜ/g, "");
      result = result.replace(/<b>/g, "");
      result = result.replace(/<\/b>/g, "");

      result = this.removeNasalStr(result);

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



    getMoraeOfAJTWord(ajtWord) {

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
          /<span class="nopron">(.)<\/span>([ぁぃぅぇぉゃゅょゎァィゥェォャュョヮ])/g,
          '<span class="nopron">$1$2<\/span>'
        );
      }

      for (const x of temp2.childNodes) {
        if (x.nodeName === "#text") {
          const moras = this.jpUtils.getMorae(x.data);
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
      const wordSearch = searchString.split(/[・、]/g);
      const idx = wordSearch.indexOf(normalizedReading);

      if (idx === -1) {
        logger.debug(`AJT word: ${normalizedReading} not found among [${wordSearch.join(", ")}]`, this.logLvl);
        return null;
      }

      let result = null;
      if (wordSearch.length == 1) {
        result = resultSearchHTML;
      } else {
        // otherwise searches on the raw html
        let startIdx = 0;
        let endIdx = 0;
        let currentWord = 0;
        for (const [i, c] of [...resultSearchHTML].entries()) {
          if (c === "・" || c === "、") {
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

        result = resultSearchHTML.substring(startIdx, endIdx);
      }

      if (this.removeNasal) {
        result = this.removeNasalStr(result);
      }

      return result;
    }

    parseIntegerList() {
      // attempts to get a CSV of digit
      // this makes many assumptions about the format:
      // - csv
      // - spaces removed doesn't affect html
      // - if bold: per element and not across elements

      let result = []
      let foundBold = false;

      let searchHTML = this.overrideEle.innerHTML.replace(/\s+/g, "")
      const posStrList = searchHTML.split(",");

      for (const pos of posStrList) {
        if (pos.includes("<b>")) {
          let integer = pos.match(/[-]?\d+/);
          let posData = new PosData(Number(integer), true);
          if (!foundBold) {
            foundBold = true;
            posData.mainPos = true;
          }
          result.push(posData);

        } else {
          let posNumber = Number(pos)
          if (!Number.isNaN(posNumber)) {
            let posData = new PosData(Number(pos));
            result.push(posData);
          }
        }
      }

      if (!foundBold && result.length > 0) {
        result[0].mainPos = true;
      }

      return result;
    }


    parseTextFormat() {
      let result = []

      const separators = {{ utils.opt("modules", "auto-pitch-accent", "pa-override", "separators") }};
      const downsteps = {{ utils.opt("modules", "auto-pitch-accent", "pa-override", "downstep-markers") }};
      const heiban = {{ utils.opt("modules", "auto-pitch-accent", "pa-override", "heiban-markers") }};

      const separatorsRegex = RegExp("[" + separators.join("") + "]", "g");

      // attempts to separate "・"
      // Bolded text and main pos (colored pitch accent) is not supported in this format.
      // Therefore, we use the text instead of the HTML
      let searchText = this.overrideEle.innerText.replace(/\s+/g, "")
      let strList = searchText.split(separatorsRegex);
      let foundSeparators = searchText.match(separatorsRegex);

      for (const [i, word] of strList.entries()) {
        // moras here are only used for calculating the position of the downstep
        let moras = this.jpUtils.getMorae(word);

        // checks for where downstep (＼) exists
        let pos = null;
        let j = 0;
        while (j < moras.length) {
          const mora = moras[j];
          if (downsteps.includes(mora)) {
            if (pos !== null) {
              if ({{ utils.opt("modules", "auto-pitch-accent", "pa-override", "warn-on-invalid-format") }}) {
                logger.warn(`More than one downstep marker used in ${word}`);
              }
            } else {
              pos = j;
            }
            moras.splice(j, 1); // removes the element from the moras list
          } else {
            j++;
          }
        }

        if (heiban.includes(moras[moras.length-1])) {
          moras.splice(moras.length-1, 1);

          if (pos === null) {
            pos = 0;
          } else {
            if ({{ utils.opt("modules", "auto-pitch-accent", "pa-override", "warn-on-invalid-format") }}) {
              logger.warn(`Cannot use both downstep and heiban markers in ${word}`);
            }
            continue;
          }
        }

        // no downstep found: 平板 (0)
        if (pos === null) {
          if ({{ utils.opt("modules", "auto-pitch-accent", "pa-override", "heiban-marker-required") }}) {
            logger.warn(`Heiban marker not found in ${word}`);
            continue;
          } else {
            pos = 0;
          }
        }

        // calculates the display moras
        // differs from the above moras because by removing the downstep marker and
        // heiban marker, this allows the reading to be searchable within the
        // AJT word pitch
        const displayMoras = this.normalizeReadingGetMoras(moras.join(""));

        let posData = new PosData(pos);
        posData.readingMora = displayMoras;
        if (foundSeparators !== null && i < foundSeparators.length) {
          posData.separator = foundSeparators[i];
        }

        result.push(posData);
      }

      const setFirstPitchMain = {{ utils.opt("modules", "auto-pitch-accent", "pa-override", "text-format-set-first-pitch-as-main") }};
      if (result.length === 1 || (result.length > 1 && setFirstPitchMain)) {
        result[0].mainPos = true;
      }

      return result;

    }

    /*
     * supported formats:
     * - csv integers
     * - text separated with "・" and downstep marked with ＼
     * - integers allow bolded characters, text does not
     *    - what the bold does is notably different from the edge case of AJT Word pitch
     * - for simplicity, formats cannot be mixed in one field!
     *    - number detected -> attempt to parse as csv numbers
     *    - number not detected -> attempt to parse as text with "・" and "＼"
     *
     * examples:
     *     1
     *     -1
     *     1, 3, 4, 5
     *     1,<b>3</b>, 4,5
     *     じ＼んせい
     *     ここ＼ろ・こころ＼
     *     <b>ここ＼ろ</b>・こころ＼
     *
     * returns list of positions, or empty list if nothing found
     */
    calcPosDataListFromOverride() {

      // removes whitespace
      let result = []
      const firstInteger = this.overrideEle.innerText.match(/^[-]?\d+/);

      if (firstInteger !== null) {
        result = this.parseIntegerList();
      } else if (this.overrideEle.innerText === this.overrideEle.innerHTML) {
        result = this.parseTextFormat();
      } else {
        if ({{ utils.opt("modules", "auto-pitch-accent", "pa-override", "warn-on-invalid-format") }}) {
          logger.warn(`Invalid PA format: ${this.overrideEle.innerText}`);
        }
      }

      return result;

    }

    // returns [normalized reading, uses ajt word]
    getNormalizeReading(readingKana) {
      if ({{ utils.opt("modules", "auto-pitch-accent", "search-for-ajt-word") }}) {
        let ajtWord = this.getAJTWord(readingKana);
        if (ajtWord !== null) {
          return [ajtWord, true];
        }
      }

      let normalizedReading = null;
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

      return [normalizedReading, false]

    }

    normalizeReadingGetMoras(readingKana) {

      const [normalizedReading, isAJTWord] = this.getNormalizeReading(readingKana);
      if (isAJTWord) {
        logger.debug("Using AJT Word", this.logLvl);
        return this.getMoraeOfAJTWord(normalizedReading);
      }

      logger.debug(`Using reading from WordReading field`, this.logLvl);
      let result = this.jpUtils.getMorae(normalizedReading);
      logger.debug(`Moras: ${normalizedReading} -> ${result.join(", ")}`, this.logLvl);

      return result;
    }

    paintDisplayWithPosData(posData) {
      if (applyPAColorTags()) {
        return;
      }

      const kifukuList = {{ utils.opt("modules", "auto-pitch-accent", "pa-override", "kifuku-override") }};

      // colors it with the first valid pitch found
      if (kifukuList.includes(posData.pos)) {
        // 起伏 (undulation, usually reserved for い-adjs / non-する verbs)
        paintDisplay("kifuku");
      } else if (posData.pos === 0) {
        // 平板 (e.g. 自然 - しぜん￣)
        paintDisplay("heiban");
      } else if (posData.pos >= posData.readingMora.length) {
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
      } else if (posData.pos === 1) {
        // 頭高 (e.g. 僕 - ぼ＼く)
        paintDisplay("atamadaka");
      } else {
        // 中高 (e.g. 不審者 - ふし＼んしゃ)
        paintDisplay("nakadaka");
      }

    }


    /* builds pitch accent span, may contain multiple pitches */
    buildReading(dispPosData) {
      let result = [];

      // cache
      let moras = null;
      let hasBoldedPos = dispPosData.hasBoldedPos();

      // calculates connectors if bolded
      // all connectors around bolded spans will be bolded themselves
      let connectors = [];

      // builds standard connectors
      const baseConnector = {{ utils.opt("modules", "auto-pitch-accent", "pa-positions", "default-connector") }};

      for (const [i, posData] of dispPosData.posDataList.entries()) {
        if (i < dispPosData.posDataList.length-1) {
          if (posData.separator === null) {
            connectors.push(baseConnector);
          } else {
            connectors.push(posData.separator);
          }
        }
      }

      if (hasBoldedPos) {
        //const boldedConnector = `<b>${connector}</b>`;
        for (let i = 0; i < dispPosData.posDataList.length-1; i++) {
          const previous = dispPosData.posDataList[i];
          const after = dispPosData.posDataList[i+1];
          if (!previous.bolded || !after.bolded) { // neither are bolded -> bold will be added to both
            connectors[i] = `<b>${connectors[i]}</b>`;
          }
        }
      }

      for (const [i, posData] of dispPosData.posDataList.entries()) {

        // uses the reading for the normal word instead of any special reading
        if (posData.readingMora.length === 0) {
          // generates cached moras
          if (moras === null) {
            const readingKana = this.getReadingKana();
            moras = this.normalizeReadingGetMoras(readingKana);
          }
          posData.readingMora = Array.from(moras); // shallow copy
        }

        let wordReading = this.buildWordReading(posData, hasBoldedPos && !posData.bolded);
        result.push(wordReading);
        if (i < connectors.length) {
          result.push(connectors[i]);
        }
      }

      return result.join("");

    }


    /*
     * - creates the span to show the pitch accent overline
     * - addBold adds the <b></b> tags around the span, which greys out the span
     */
    buildWordReading(posData, addBold=false) {
      logger.debug(posData, this.logLvl);

      const pos = posData.pos;
      let result = Array.from(posData.readingMora); // shallow copy

      if (result.length === 0) {
        logger.warn("Reading has 0 mora?");
        return;
      }

      const kifukuList = {{ utils.opt("modules", "auto-pitch-accent", "pa-override", "kifuku-override") }};

      if (this.attemptColor && posData.mainPos) {
        this.paintDisplayWithPosData(posData);
      }

      // special case: 0 and length of moras === 1 (nothing needs to be done)
      // ASSUMPTION: the override kifuku value will NOT be 0 (you are insane if you do that)
      if (pos === 0 && result.length === 1) {
        return result[0];
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

      let resultHTML = result.join("");
      if (addBold) {
        resultHTML = `<b>${resultHTML}</b>`;
      }
      return resultHTML;
    }



    // main function
    addPosition(positionsEle, ajtEle, overrideEle, overrideTextEle, readingEle, displayEle) {
      // priority:
      // - PA Override number
      // - PA Override raw text
      // - PA Positions
      // - AJT Word Pitch
      //

      this.positionsEle = createDivIfStr(positionsEle);
      this.ajtEle = createDivIfStr(ajtEle);
      this.overrideEle = createDivIfStr(overrideEle);
      this.overrideTextEle = createDivIfStr(overrideTextEle);
      this.readingEle = createDivIfStr(readingEle);
      this.displayEle = createDivIfStr(displayEle);

      let posResult = null;
      let dispPosData = new DispPosData();

      // first checks PAOverrideText
      if (this.overrideTextEle.innerHTML.length !== 0) {
        dispPosData.posHTML = this.overrideTextEle.innerHTML;
        dispPosData.dict = "Pitch Accent Override Text";

      // then checks PAOverride
      } else if (this.overrideEle.innerHTML.length !== 0) {
        let posDataList = this.calcPosDataListFromOverride();
        if (posDataList.length > 0) {
          dispPosData.posDataList = posDataList;
          dispPosData.dict = "Pitch Accent Override";
        } else {
          // uses whatever is in PAOverride as is without changes
          // this is to maintain backwards compatability
          dispPosData.posHTML = this.overrideEle.innerHTML;
          dispPosData.dict = "Pitch Accent Override (Raw Text)";

          if ({{ utils.opt("modules", "auto-pitch-accent", "pa-override", "warn-on-invalid-format") }}) {
            logger.warn(`Cannot parse PAOverride "${this.overrideEle.innerText}". Using raw text...`);
          }
        }

      } else {
        // if still nothing, then check PAPositions field
        dispPosData = this.calcDispPosDataFromPositions();
      }

      // if still nothing from PAOverrideText, PAOverride, or PAPositions
      if (!dispPosData.hasData()) {
        // last resort: AJT pitch accent
        if (this.ajtEle.innerHTML.length !== 0) {
          dispPosData.posHTML = this.ajtEle.innerHTML;
          if (this.removeNasal) {
            dispPosData.posHTML = this.removeNasalStr(dispPosData.posHTML);
          }
          dispPosData.dict = "AJT Pitch Accent";
        } else {
          logger.debug("Nothing found.", this.logLvl);
          dispPosData.posHTML = "";
          dispPosData.dict = "N/A";
        }
      }

      if (dispPosData.posHTML !== null) {
        // ASSUMPTION: posHTML is filled <=> no numbers to use
        displayEle.innerHTML = dispPosData.posHTML;

        if ({{ utils.opt("modules", "auto-pitch-accent", "colored-pitch-accent", "enabled") }}) {
          applyPAColorTags();
        }

      } else {
        // positions have been found!
        const readingHTML = this.buildReading(dispPosData);
        displayEle.innerHTML = readingHTML;
      }

      if (this.showTitle) {
        displayEle.setAttribute("title", dispPosData.dict);
      }
      logger.debug(dispPosData.dict, this.logLvl);
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
  const overrideTextEle = document.getElementById("hidden_pa_override_text");
  const readingEle = document.getElementById("hidden_word_reading");
  const displayEle = document.getElementById("dh_word_pitch_text");

  const autoPA = new JPMNAutoPA();
  autoPA.addPosition(positionsEle, ajtEle, overrideEle, overrideTextEle, readingEle, displayEle);
}

/// {% endset %}
