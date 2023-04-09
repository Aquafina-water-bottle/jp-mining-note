import { Module, RunnableModule } from '../module';
//import { getOption } from '../options';
import { getWordTags, isVerbOrIAdj, plainToKanaOnly, getTags } from '../utils';
import { getFieldValue } from '../fields';
import {
  convertHiraganaToKatakana,
  convertHiraganaToKatakanaWithLongVowelMarks,
  getMorae,
  katakanaRemoveLongVowelMarks,
} from '../jpUtils';

export type NoteInfoPA = {
  readonly tags: readonly string[];
  readonly PAOverrideText: string;
  readonly PAOverride: string;
  readonly PAPositions: string;
  readonly AJTWordPitch: string;
  readonly WordReading: string;
  readonly YomichanWordTags: string;
};


export type PAGroup = 'heiban' | 'atamadaka' | 'nakadaka' | 'odaka' | 'kifuku';
//type ValueOf<T> = T[keyof T];

type PAOverrideParseMethod = "integer" | "text";

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
} as const;


// searches for first bolded
// if no bolded -> returns first item
//function _getFirstBoldedOrFirstPos(posDataList: readonly PosData[]): PosData | null {
//  if (posDataList.length === 0) {
//    return null;
//  }
//
//  for (const posData of posDataList) {
//    if (posData.isBolded) {
//      return posData;
//    }
//  }
//
//  return posDataList[0];
//}

function _hasBoldedPos(posDataList: readonly PosData[]): boolean {
  for (const posData of posDataList) {
    if (posData.isBolded) {
      return true;
    }
  }
  return false;
}

const ajtWordSeps = /[・、]/g;

class PosData {
  pos: number;
  isBolded: boolean;
  allowAutoKifuku: boolean = true; // set to false for text format parsing
  separatorAfter: string | null = null;
  dictName: string | null = null;
  mora: string[] = [];

  // only set when converting PosData -> HTML (buildWordReading)
  paGroup: PAGroup | null = null;

  constructor(pos: number, isBolded = false) {
    this.pos = pos;
    this.isBolded = isBolded;
  }
}

class DispPosData {
  readonly dispHTML: string;
  readonly dictName: string | null;
  readonly mainPAGroup: PAGroup | null;

  constructor(dispHTML: string, dictName: string | null = null, paGroup: PAGroup | null = null) {
    this.dispHTML = dispHTML;
    this.dictName = dictName;
    this.mainPAGroup = paGroup;
  }
}

interface PitchParser {
  parse(): DispPosData | null;
}

// ==================
//  ParsePAPositions
// ==================

export class ParsePAPositions extends Module implements PitchParser {
  private readonly autopa: AutoPitchAccent;

  private readonly paPositions: string;
  private readonly wordReading: string;

  constructor(autopa: AutoPitchAccent, paPositions: string, wordReading: string) {
    super('sm:parsePAPositions');

    this.autopa = autopa;
    this.paPositions = paPositions;
    this.wordReading = wordReading;
  }

  parse(): DispPosData | null {
    // ensures the field is usable
    if (this.paPositions.length === 0) {
      return null;
    }

    // converts to html element for proper parsing
    const positionsEle = document.createElement('div');
    positionsEle.innerHTML = this.paPositions;

    try {
      if (
        positionsEle.children.length > 0 &&
        positionsEle.children[0] !== null &&
        positionsEle.children[0].nodeName === 'DIV' &&
        positionsEle.children[0].classList.contains('pa-positions__group')
      ) {
        return this.parseJPMN(positionsEle);
      }
    } catch (error) {
      // ignore error for now
      this.logger.debug(
        'Error in calcDispPosDataFromPositions -> calcDispPosDataFromJPMNPositions'
      );
    }

    // just search for any digit in the element
    let digit = this.paPositions.match(/\d+/);
    if (digit === null) {
      return null;
    }

    const posData = new PosData(Number(digit));
    const pitchHTML = this.autopa.buildPitchHTML([posData], this.wordReading);
    const paGroup = this.autopa.getMainPAGroup([posData], this.autopa.getOption("autoPitchAccent.coloredPitchAccent.multiplePitchesColorAsFirst.paPositions"));

    return new DispPosData(pitchHTML, 'PAPositions', paGroup);
  }

  private getDictInfoFromGroup(groupDiv: Element): [Element[], string] {
    let dictChildren = Array.from(groupDiv.children[1].children);
    let dictName = groupDiv.getAttribute('data-details') ?? 'unknown dictionary';
    return [dictChildren, dictName];
  }

  /* searches for a dictionary with a bolded entry. If not found, use the first dictionary */
  private getDictInfo(positionsEle: HTMLElement): [Element[], string] {
    // searches for a bolded element
    for (const groupDiv of positionsEle.children) {
      for (const liEle of groupDiv.children[1].children) {
        if (liEle.innerHTML.includes('<b>')) {
          return this.getDictInfoFromGroup(groupDiv);
        }
      }
    }

    // no bolded element was found: uses first element
    // children.length is guaranteed to be > 0 here!
    const groupDiv = positionsEle.children[0];
    return this.getDictInfoFromGroup(groupDiv);
  }

  private parseJPMN(positionsEle: HTMLElement): DispPosData {
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

    const displayMode = this.autopa.getOption('autoPitchAccent.paPositions.displayMode');
    let posDataList: PosData[] = [];
    if (displayMode === 'selected-result') {
      posDataList = this.parseJPMNSingularPos(positionsEle);
    } else if (displayMode === 'selected-dictionary') {
      posDataList = this.parseJPMNSingularDict(positionsEle);
    } else if (displayMode === 'all-results') {
      posDataList = this.parseJPMNAllDicts(positionsEle);
    } else {
      throw Error(`displayMode is invalid: ${displayMode}`);
    }

    const pitchHTML = this.autopa.buildPitchHTML(posDataList, this.wordReading);
    const paGroup = this.autopa.getMainPAGroup(posDataList, this.autopa.getOption(`autoPitchAccent.coloredPitchAccent.multiplePitchesColorAsFirst.paPositions`));
    return new DispPosData(pitchHTML, null, paGroup);
  }

  private getPosDataListFromDictChildren(
    dictChildren: readonly Element[],
    dictName: string
  ): PosData[] {
    let result: PosData[] = [];

    for (const c of dictChildren) {
      let digit = c.innerHTML.match(/\d+/);
      if (digit === null) {
        this.logger.debug(`Skipping invalid value? ${c.innerHTML}`);
        continue;
      }

      let bolded = c.innerHTML.includes('<b>');
      let posData = new PosData(Number(digit), bolded);
      posData.dictName = dictName;

      result.push(posData);
    }

    return result;
  }

  /* attempts to find first bolded. If not found: use first item */
  private parseJPMNSingularPos(positionsEle: HTMLElement): PosData[] {
    const [dictChildren, dictName] = this.getDictInfo(positionsEle);

    let firstDigit: number | null = null;

    for (const c of dictChildren) {
      let digit = c.innerHTML.match(/\d+/);
      if (digit === null) {
        this.logger.debug(`Skipping invalid value? ${c.innerHTML}`);
        continue;
      }

      if (firstDigit === null) {
        firstDigit = Number(digit);
      }

      if (c.innerHTML.includes('<b>')) {
        const posData = new PosData(Number(digit), true);
        posData.dictName = dictName;
        return [posData];
      }
    }

    if (firstDigit === null) {
      this.logger.warn('firstDigit is null?');
      return [];
    }

    const posData = new PosData(firstDigit, true);
    posData.dictName = dictName;
    return [posData];
  }

  /*
   * Attempts to find first dictionary with bolded entry.
   * If not found, use first dictionary.
   * Separates PosData from all entries.
   */
  private parseJPMNSingularDict(positionsEle: HTMLElement): PosData[] {
    const [dictChildren, dictName] = this.getDictInfo(positionsEle);
    return this.getPosDataListFromDictChildren(dictChildren, dictName);
  }

  /*
   * Gets PosData from all entries of all dictionaries.
   */
  private parseJPMNAllDicts(positionsEle: HTMLElement): PosData[] {
    let result: PosData[] = [];

    // TODO: should be unique pitches only
    for (const groupDiv of positionsEle.children) {
      const [dictChildren, dictName] = this.getDictInfoFromGroup(groupDiv);
      const dictPosDataList = this.getPosDataListFromDictChildren(dictChildren, dictName);
      result = result.concat(dictPosDataList);
    }

    return result;
  }
}

// =================
//  ParsePAOverride
// =================

export class ParsePAOverride extends Module implements PitchParser {
  private readonly autopa: AutoPitchAccent;

  private readonly paOverride: string;
  private readonly wordReading: string;

  constructor(autopa: AutoPitchAccent, paOverride: string, wordReading: string) {
    super('sm:parsePAOverride');

    this.autopa = autopa;
    this.paOverride = paOverride;
    this.wordReading = wordReading;
  }

  parse(): DispPosData | null {
    let [posDataList, parseMethod] = this.calcPosDataList();
    if (posDataList.length > 0 && parseMethod !== null) {
      const pitchHTML = this.autopa.buildPitchHTML(posDataList, this.wordReading);
      const paGroup = this.autopa.getMainPAGroup(posDataList, this.autopa.getOption(`autoPitchAccent.coloredPitchAccent.multiplePitchesColorAsFirst.paOverride.${parseMethod}`));
      return new DispPosData(pitchHTML, 'Pitch Accent Override', paGroup);
      //return new DispPosData(pitchHTML, 'Pitch Accent Override');
    }

    // uses whatever is in PAOverride as is without changes
    // this is to maintain backwards compatability
    this.logger.warn(
      `calcPosDataList returned list of 0 length for "${this.paOverride}". Using raw text...`
    );
    return new DispPosData(this.paOverride, 'Pitch Accent Override (Raw Text)');
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
   *
   * returns list of positions, or empty list if nothing found
   */
  private calcPosDataList(): [PosData[], PAOverrideParseMethod | null] {
    // requires html parser to calculate textContent
    const overrideEle = document.createElement('div');
    overrideEle.innerHTML = this.paOverride;

    const firstInteger = (overrideEle.textContent ?? "").trim().match(/^[-]?\d+/);

    if (firstInteger !== null) {
      return [this.parseIntCSV(), "integer"];
    } else {
      if (overrideEle.textContent === overrideEle.innerHTML) {
        return [this.parseTextFormat(), "text"];
      } else {
        this.logger.warn(`Invalid PA format: ${this.paOverride}`);
      }
    }

    return [[], null];
  }

  private parseIntCSV(): PosData[] {
    // attempts to get a CSV of integers
    // this makes many assumptions about the format:
    // - csv
    // - spaces removed doesn't affect html
    // - if bold: per element and not across elements

    let result = [];

    const searchHTML = this.paOverride.replace(/\s+/g, '');
    const posStrList = searchHTML.split(',');

    for (const pos of posStrList) {
      if (pos.includes('<b>')) {
        let integer = pos.match(/[-]?\d+/);
        let posData = new PosData(Number(integer), true);
        result.push(posData);
      } else {
        let posNumber = Number(pos);
        if (!Number.isNaN(posNumber)) {
          let posData = new PosData(Number(pos));
          result.push(posData);
        }
      }
    }

    return result;
  }

  private parseTextFormat(): PosData[] {
    let result = [];

    const separators = this.autopa.getOption('autoPitchAccent.paOverride.separators');
    const downsteps = this.autopa.getOption('autoPitchAccent.paOverride.downstepMarkers');
    const heiban = this.autopa.getOption('autoPitchAccent.paOverride.heibanMarkers');

    const separatorsRegex = RegExp('[' + separators.join('') + ']', 'g');

    // attempts to separate "・"
    // Bolded text and main pos (colored pitch accent) is not supported in this format.
    // Therefore, we use the text instead of the HTML
    const searchText = this.paOverride.replace(/\s+/g, ''); // remove whitespace
    const strList = searchText.split(separatorsRegex);
    const foundSeparators = searchText.match(separatorsRegex);

    for (const [i, word] of strList.entries()) {
      // moras here are only used for calculating the position of the downstep
      let moras = getMorae(word);

      // checks for where downstep (＼) exists
      let pos = null;
      let j = 0;
      while (j < moras.length) {
        const mora = moras[j];
        if (downsteps.includes(mora)) {
          if (pos !== null) {
            this.logger.warn(`More than one downstep marker used in ${word}`);
          } else {
            pos = j;
          }
          moras.splice(j, 1); // removes the element from the moras list
        } else {
          j++;
        }
      }

      if (heiban.includes(moras[moras.length - 1])) {
        moras.splice(moras.length - 1, 1);

        if (pos === null) {
          pos = 0;
        } else {
          this.logger.warn(`Cannot use both downstep and heiban markers in ${word}`);
          continue;
        }
      }

      // no downstep found: 平板 (0)
      if (pos === null) {
        if (this.autopa.getOption('autoPitchAccent.paOverride.heibanMarkerRequired')) {
          this.logger.warn(`Heiban marker not found in ${word}`);
          continue;
        } else {
          pos = 0;
        }
      }

      // calculates the display moras
      // differs from the above moras because by removing the downstep marker and
      // heiban marker, this allows the reading to be searchable within the
      // AJT word pitch
      const displayMoras = this.autopa.normalizeReadingGetMoras(moras.join(''));

      const posData = new PosData(pos);
      posData.mora = displayMoras;
      if (foundSeparators !== null && i < foundSeparators.length) {
        posData.separatorAfter = foundSeparators[i];
      }
      posData.allowAutoKifuku = false;

      result.push(posData);
    }
    return result;
  }
}

// ===================
//  ParseAJTWordPitch
// ===================

export class ParseAJTWordPitch extends Module implements PitchParser {
  private readonly autopa: AutoPitchAccent;

  private readonly ajtWordPitch: string;
  private readonly wordReading: string;
  private readonly removeNasal: boolean;

  constructor(autopa: AutoPitchAccent, ajtWordPitch: string, wordReading: string, removeNasal: boolean) {
    super('sm:parseAJTWordPitch');

    this.autopa = autopa;
    this.ajtWordPitch = ajtWordPitch;
    this.wordReading = wordReading;
    this.removeNasal = removeNasal;
  }

  getPosDataList(): PosData[] {
    let posDataList: PosData[] = [];

    // textContent to remove all markup (overline, devoiced, bold?)
    const d = document.createElement("div")
    d.innerHTML = this.ajtWordPitch;
    let searchText = d.textContent ?? "";
    searchText = searchText.replace(/°/g, ""); // remove all nasal markers
    searchText = searchText.replace(/&#42780;/g, 'ꜜ'); // normalizes text
    const searchWords = searchText.split(ajtWordSeps);

    // raw html to get the pure reading
    let searchHTML = this.ajtWordPitch;
    if (searchHTML.includes("<b>")) {
      this.logger.warn("AJTWordPitch field contains bold. This will be ignored by the parser.")
      searchHTML = searchHTML.replace(/<b>/g, '').replace(/<\/b>/g, '');
    }
    const searchWordsHTML = searchHTML.split(ajtWordSeps);
    if (searchWordsHTML.length !== searchWords.length) {
      throw Error("AJTWordPitch parser lists are of different length. Cannot parse.");
    }

    const foundSeparators = searchText.match(ajtWordSeps);
    const wordReadingKana = plainToKanaOnly(this.wordReading);
    const normalizedReading = convertHiraganaToKatakana(wordReadingKana);

    // moras -> look for downstep marker!
    for (let i = 0; i < searchWords.length; i++) {
      const w = searchWords[i];
      let h = searchWordsHTML[i];
      if (this.removeNasal) {
        h = this.autopa.removeNasalStr(h);
      }

      const searchMora = getMorae(w);

      // this finds the index of "ꜜ"
      // pos is -1 if not found (which translates to 0)
      let pos = searchMora.findIndex((x) => x === "ꜜ");
      if (pos === -1) {
        pos = 0;
      }

      // saves a few cycles by repeating the logic in removeAJTDownstep
      let ajtNormalizeSearch = this.autopa.removeAJTDownstep(w);
      ajtNormalizeSearch = katakanaRemoveLongVowelMarks(ajtNormalizeSearch);

      let posData = new PosData(pos)
      posData.mora = this.autopa.getMoraeOfAJTWord(h);
      if (ajtNormalizeSearch !== normalizedReading) {
        this.logger.debug(`cannot auto kifuku: ${ajtNormalizeSearch} | ${normalizedReading}`, 2);
        posData.allowAutoKifuku = false; // can only allow auto kifuku on the same word
      }
      posData.separatorAfter = foundSeparators?.at(i) ?? null;
      posDataList.push(posData);
    }

    return posDataList;
  }

  parse(): DispPosData | null {
    if (this.ajtWordPitch.length === 0) {
      return null;
    }

    let pitchHTML: string;
    let paGroup: PAGroup | null
    try {
      const posDataList = this.getPosDataList();
      pitchHTML = this.autopa.buildPitchHTML(posDataList);
      paGroup = this.autopa.getMainPAGroup(posDataList, this.autopa.getOption("autoPitchAccent.coloredPitchAccent.multiplePitchesColorAsFirst.ajtWordPitch"));
    } catch (error) {
      if (typeof error === "object" && error !== null && "stack" in error && typeof error.stack === "string") {
        this.logger.errorStack(error.stack)
      }
      this.logger.error('Error in generatePitchHTML, using raw AJTWordPitch instead');
      pitchHTML = this.ajtWordPitch;
      paGroup = null;
    }

    return new DispPosData(pitchHTML, "AJT Pitch Accent", paGroup);
  }
}

export type AutoPitchAccentArgs = {
  attemptGlobalColor?: boolean;
  showTitle?: boolean;
  removeNasal?: boolean;
  debugLevel?: number;
};

export class AutoPitchAccent extends RunnableModule {
  private readonly attemptGlobalColor: boolean;
  private readonly showTitle: boolean;
  private readonly removeNasal: boolean;
  private wordTags: string[] = [];
  private ajtHTML: null | string = null;
  private debugLevel: number;

  constructor(id?: string, args?: AutoPitchAccentArgs) {
    super('autoPitchAccent', id);

    this.attemptGlobalColor = args?.attemptGlobalColor ?? true;
    this.showTitle = args?.showTitle ?? true;
    this.removeNasal = args?.removeNasal ?? false;
    this.debugLevel = args?.debugLevel ?? 3;
  }

  private getDispPosDataOnEmpty(wordReading: string): DispPosData {
    this.logger.debug('Nothing found.');
    if (this.getOption('autoPitchAccent.showReadingIfNoPitch')) {
      let wordReadingKana = plainToKanaOnly(wordReading);
      return new DispPosData(wordReadingKana, 'WordReading');
    }
    return new DispPosData('', 'N/A');
  }

  removeNasalStr(str: string) {
    if (str.includes('nasal')) {
      // か行・が行
      const ka_gyou = 'カキクケコ';
      const ga_gyou = 'ガギグゲゴ'; // 濁点

      // 5 is length of the above 2 strings
      for (let i = 0; i < 5; i++) {
        str = str.replace(
          new RegExp(`${ka_gyou[i]}<span class="nasal">(°|&#176;)</span>`, 'g'),
          ga_gyou[i]
        );
      }
    }

    if (str.includes('nasal')) {
      this.logger.warn(`string after removeNasalStr still has nasal class: ${str}`);
    }
    return str;
  }

  getPAColorTag(tags: readonly string[]): PAGroup | null {
    for (const ct of Object.keys(COLOR_TAGS)) {
      if (tags.includes(ct)) {
        return COLOR_TAGS[ct as keyof typeof COLOR_TAGS];
      }
    }
    return null;
  }

  private paintDisplay(paGroup: PAGroup) {
    const wordClass = "pa-word-highlight-" + paGroup;
    const sentClass = "pa-sentence-highlight-" + paGroup;

    // adds to reading
    if (this.getOption("autoPitchAccent.coloredPitchAccent.color.wordReadingKanji")) {
      const readingEle = document.getElementById("dh_reading");
      readingEle?.classList.add(wordClass);
    }

    if (this.getOption("autoPitchAccent.coloredPitchAccent.color.testedContent")) {
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

    // full sentence (back side)
    if (this.getOption("autoPitchAccent.coloredPitchAccent.color.fullSentence")) {
      const fullSentEle = document.getElementById("full_sentence");
      fullSentEle?.classList.add(sentClass);
    }

    if (this.getOption("autoPitchAccent.coloredPitchAccent.color.definitions")) {
      const defs = document.querySelectorAll(".glossary-text")
      if (defs !== null) {
        for (const def of defs) {
          // uses setProperty instead to deal with custom dictionary bold / highlights
          (def as HTMLElement).style.setProperty('--highlight-bold-color', `var(--text-${paGroup})`);
        }
      }
    }
  }

  /*
   * Displays the dispPosData on the displayEle
   * - optionally paints the display with pitch accent colors
   */
  private useDispPosData(
    displayEle: HTMLElement,
    dispPosData: DispPosData,
    tags: readonly string[]
  ) {
    displayEle.innerHTML = dispPosData.dispHTML;
    if (this.showTitle && dispPosData.dictName !== null) {
      // TODO check if multiple titles?
      displayEle.setAttribute('title', dispPosData.dictName);
    }
    this.logger.debug(`result dictName: ${dispPosData.dictName}`, this.debugLevel);

    if (this.getOption('autoPitchAccent.coloredPitchAccent.enabled')) {

      if (this.attemptGlobalColor) {
        const paColorTag = this.getPAColorTag(tags);
        if (paColorTag !== null) {
          this.paintDisplay(paColorTag);
        } else if (dispPosData.mainPAGroup !== null) {
          this.paintDisplay(dispPosData.mainPAGroup);
        }
      }

      //if (
      //  this.getOption('autoPitchAccent.coloredPitchAccent.color.wordReadingPitchKana')
      //) {
      //  displayEle.classList.add('pa-word-highlight-pitch-kana');
      //}
      if (
        this.getOption(
          'autoPitchAccent.coloredPitchAccent.color.wordReadingPitchOverline'
        )
      ) {
        displayEle.classList.add('pa-word-highlight-pitch-overline');
      }
    }
  }

  /*
   * replaces all long katakana markers with the respective normal katakana symbol
   * also removes all ꜜ (remember that we can search for downsteps from the now empty div)
   */
  private getSearchAJTHTML(ajtHTML: string): string {
    let result = this.removeAJTDownstep(ajtHTML)

    // remove bold
    result = result.replace(/<b>/g, '');
    result = result.replace(/<\/b>/g, '');

    result = this.removeNasalStr(result);

    result = katakanaRemoveLongVowelMarks(result);

    return result;
  }

  // remove downsteps
  removeAJTDownstep(str: string) {
     return str.replace(/&#42780;/g, '').replace(/ꜜ/g, '');
  }

  private getAJTWordHTML(wordReadingKana: string): string | null {
    const normalizedReading = convertHiraganaToKatakana(wordReadingKana);
    // grabs the raw html split between the ・ characters
    // ASSUMPTION: no html element is split between the ・ characters
    // (apart from <b>, which are ignored)

    if (this.ajtHTML === null || this.ajtHTML.length === 0) {
      this.logger.debug(`ajtHTML is empty`);
      return null;
    }

    // normalizes the ajt search string
    const ajtHTMLSearch = this.getSearchAJTHTML(this.ajtHTML);
    // removes any bold in case it messes with the formatting
    const resultSearchHTML = this.ajtHTML.replace(/<b>/g, '').replace(/<\/b>/g, '');

    // temp used for textContent
    let temp = document.createElement('div');
    temp.innerHTML = ajtHTMLSearch;
    const searchString = temp.textContent ?? "";
    const wordSearch = searchString.split(ajtWordSeps);
    const idx = wordSearch.indexOf(normalizedReading);

    if (idx === -1) {
      this.logger.debug(
        `AJT word: ${normalizedReading} not found among [${wordSearch.join(', ')}]`
      );
      return null;
    }

    // if found, gets the word
    let result = null;
    if (wordSearch.length == 1) {
      result = resultSearchHTML;
    } else {
      const searchArr = resultSearchHTML.split(ajtWordSeps);
      if (idx >= searchArr.length) {
        this.logger.warn(
          `searchArr of length ${searchArr.length} cannot be indexed with ${idx}`
        );
        return null;
      }
      result = searchArr[idx];
    }

    if (this.removeNasal) {
      result = this.removeNasalStr(result);
    }

    return result;
  }

  // returns [normalized reading, uses ajt word]
  private getNormalizedReading(wordReadingKana: string): [string, boolean] {
    if (this.getOption('autoPitchAccent.searchForAJTWord')) {
      let ajtWordHTML = this.getAJTWordHTML(wordReadingKana);
      if (ajtWordHTML !== null) {
        return [ajtWordHTML, true];
      }
    }

    let normalizedReading = '';
    let readingDisplayMode = this.getOption('autoPitchAccent.readingDisplayMode');

    if (readingDisplayMode === 'word-reading') {
      normalizedReading = wordReadingKana;
    } else if (readingDisplayMode === 'katakana') {
      normalizedReading = convertHiraganaToKatakana(wordReadingKana);
    } else if (readingDisplayMode === 'katakana-with-long-vowel-marks') {
      normalizedReading = convertHiraganaToKatakanaWithLongVowelMarks(wordReadingKana);
    } else {
      throw Error(`readingDisplayMode of ${normalizedReading} is invalid.`);
    }

    return [normalizedReading, false];
  }

  /*
   * properly handles the overline / downstep / nasal parts that an ajtWordHTML contains
   */
  getMoraeOfAJTWord(ajtWordHTML: string) {
    let result: string[] = [];

    // temp element to store the flattened version of the ajt word div
    // and for converting into a list of moras
    const flattened = document.createElement('div');

    // temp element to iterate through childnodes of ajt word
    const temp = document.createElement('div');
    temp.innerHTML = ajtWordHTML;

    // removes pitch accent overline and downstep
    for (const c of temp.childNodes) {
      if (
        c.nodeName === 'SPAN' &&
        (c as HTMLSpanElement).classList.contains('pitchoverline')
      ) {
        for (const child of c.childNodes) {
          flattened.appendChild(child.cloneNode(true));
        }
      } else if (
        c.nodeName === 'SPAN' &&
        (c as HTMLSpanElement).classList.contains('downstep')
      ) {
        // skips
      } else {
        flattened.appendChild(c.cloneNode(true));
      }
    }

    // combines the devoiced character into one mora, if it can
    // (e.g. 神出鬼没 (しんしゅつきぼつ) only has the 2nd (し) devoiced, instead of (しゅ)
    // シ<span class="pitchoverline">ン<span class="nopron">シ</span>ュツキボツ</span>
    if (ajtWordHTML.includes('nopron')) {
      // crazy regex replace
      flattened.innerHTML = flattened.innerHTML.replace(
        /<span class="nopron">(.)<\/span>([ぁぃぅぇぉゃゅょゎァィゥェォャュョヮ])/g,
        '<span class="nopron">$1$2</span>'
      );
    }

    for (const c of flattened.childNodes) {
      if (c.nodeName === '#text') {
        const moras = getMorae((c as Text).data);
        result = result.concat(moras);
      } else if (
        c.nodeName === 'SPAN' &&
        (c as HTMLSpanElement).classList.contains('nasal')
      ) {
        // assumption: there already exists at least one element before
        // (the nasal marker can't come by itself)
        result[result.length - 1] =
          result[result.length - 1] + (c as HTMLSpanElement).outerHTML;
      } else if (
        c.nodeName === 'SPAN' &&
        (c as HTMLSpanElement).classList.contains('nopron')
      ) {
        // assumption: this is the nopron span
        result.push((c as HTMLSpanElement).outerHTML);
      } else {
        throw Error(`Unexpected flattened.childNode: ${c}`);
      }
    }

    return result;
  }

  normalizeReadingGetMoras(wordReadingKana: string): string[] {
    const [normalizedReading, isAJTWord] = this.getNormalizedReading(wordReadingKana);
    if (isAJTWord) {
      return this.getMoraeOfAJTWord(normalizedReading);
    }

    let result = getMorae(normalizedReading);
    return result;
  }

  /* returns null if nothing has to be done, otherwise gets paGroup */
  getMainPAGroup(posDataList: readonly PosData[], multiplePitchesColorAsFirst: boolean): null | PAGroup {
    if (!this.getOption('autoPitchAccent.coloredPitchAccent.enabled')) {
      return null;
    }
    if (posDataList.length > 1 && !multiplePitchesColorAsFirst) {
      return null;
    }

    let firstPAGroup: PAGroup | null = null;
    for (const posData of posDataList) {
      // gets first bolded
      if (posData.paGroup !== null && firstPAGroup === null) {
        firstPAGroup = posData.paGroup;
      }
      if (posData.isBolded && posData.paGroup !== null) {
        return posData.paGroup;
      }
    }
    // otherwise gets first non-null
    return firstPAGroup;
  }


  /*
   * builds the pitch HTML according to the posData list
   * - recall bold is inverted internally in the css (<b></b> tags will grey out characters!)
   */
  buildPitchHTML(posDataList: readonly PosData[], wordReading?: string): string {
    let result = [];

    // cache
    let hasBoldedPos = _hasBoldedPos(posDataList);

    // calculates all connectors
    // all connectors around bolded spans will be bolded themselves
    let connectors = [];
    const baseConnector = this.getOption('autoPitchAccent.paPositions.defaultConnector');
    for (const [i, posData] of posDataList.entries()) {
      if (i < posDataList.length - 1) {
        connectors.push(posData.separatorAfter ?? baseConnector);
      }
    }
    if (hasBoldedPos) {
      for (let i = 0; i < posDataList.length - 1; i++) {
        const previous = posDataList[i];
        const after = posDataList[i + 1];
        if (!previous.isBolded || !after.isBolded) {
          // neither are bolded -> bold will be added to both
          connectors[i] = `<b>${connectors[i]}</b>`;
        }
      }
    }

    // cache
    let readingMora = null;

    for (const [i, posData] of posDataList.entries()) {
      // uses the reading for the normal word instead of any special reading
      if (posData.mora.length === 0) {
        // generates cached morae
        if (readingMora === null) {
          if (wordReading === undefined) {
            throw Error(
              'wordReading is undefined, cannot parse posDataList'
            );
          }
          const wordReadingKana = plainToKanaOnly(wordReading);
          readingMora = this.normalizeReadingGetMoras(wordReadingKana);
        }
        posData.mora = Array.from(readingMora); // shallow copy
      }

      let wordPitchHTML = this.buildWordReading(posData);
      if (hasBoldedPos && !posData.isBolded) {
        wordPitchHTML = `<b>${wordPitchHTML}</b>`;
      }
      result.push(wordPitchHTML);
      if (i < connectors.length) {
        result.push(connectors[i]);
      }
    }

    return result.join('');
  }

  /*
   * - creates the span to show the pitch accent overline
   */
  buildWordReading(posData: PosData): string | null {
    const pos = posData.pos;
    let result = Array.from(posData.mora); // shallow copy
    const moraNum = result.length;

    if (result.length === 0) {
      this.logger.warn('Reading has 0 mora?');
      return null;
    }

    const kifukuList = this.getOption('autoPitchAccent.paOverride.kifukuOveride');

    // special case: 0 and length of moras === 1 (nothing needs to be done)
    // ASSUMPTION: the override kifuku value will NOT be 0 (you are insane if you do that)
    if (pos === 0 && result.length === 1) {
      return result[0];
    }

    const startOverline = '<span class="pitchoverline">';
    const stopOverline = `</span>`;
    const downstep =
      '<span class="downstep"><span class="downstep-inner">ꜜ</span></span>';
    let paGroup: PAGroup | null = null;

    if (kifukuList.includes(pos)) {
      if (result.length < 2) {
        // TODO potentially lift restriction?
        this.logger.warn('Cannot apply 起伏 on 1 mora word.');
      } else if (result.length == 2) {
        // equivalent to pos == 1
        result.splice(1, 0, stopOverline + downstep); // downstep after first mora
        result.splice(0, 0, startOverline); // overline starting at the very beginning
      } else {
        // equivalent to pos == #moras-1
        result.splice(-1, 0, stopOverline + downstep); // insert right before last index
        result.splice(1, 0, startOverline); // insert at index 1
      }
      paGroup = 'kifuku';
    } else if (pos === 0) {
      result.splice(1, 0, startOverline); // insert at index 1
      result.push(stopOverline);
      paGroup = 'heiban';
    } else if (pos === 1) {
      // start overline starts at the very beginning
      result.splice(pos, 0, stopOverline + downstep);
      result.splice(0, 0, startOverline); // insert at the very beginning
      paGroup = 'atamadaka';

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
      if (moraNum === 1) {
        paGroup = 'odaka';
      }
    } else if (pos < 0) {
      this.logger.warn(`Pitch Accent position (${pos}) is negative.`);
    } else {
      if (pos > result.length) {
        this.logger.warn(
          `Pitch Accent position (${pos}) is greater than number of moras (${result.length}).`
        );
      }
      // start overline starts over the 2nd mora
      result.splice(pos, 0, stopOverline + downstep);
      result.splice(1, 0, startOverline); // insert at index 1

      if (pos >= moraNum) {
        paGroup = 'odaka';
      } else {
        paGroup = 'nakadaka';
      }
    }

    // override paGroup
    // TODO custom tags to override even further?
    if (
      posData.allowAutoKifuku &&
      this.getOption('autoPitchAccent.paOverride.detectKifukuFromWordTags') &&
      pos >= 1 &&
      isVerbOrIAdj(this.wordTags)
    ) {
      paGroup = 'kifuku';
    }
    posData.paGroup = paGroup; // used for painting the display later

    const wordInnerHTML = result.join('');

    const wordSpan = document.createElement('span');
    wordSpan.innerHTML = wordInnerHTML;
    if (paGroup !== null) {
      wordSpan.classList.add(`pa-group-${paGroup}`);
    }
    // wraps each pitch as a "term", in order to prevent pitch accents wrapping
    wordSpan.classList.add("pitchterm");
    if (this.showTitle && posData.dictName !== null) {
      wordSpan.setAttribute('title', posData.dictName);
    }

    return wordSpan.outerHTML;
  }

  // main function
  addPosition(displayEle: HTMLElement, noteInfo: NoteInfoPA): DispPosData | null {
    // setting it early to not bubble up this field among all the functions...
    this.ajtHTML = noteInfo.AJTWordPitch;
    this.wordTags = getWordTags(noteInfo.YomichanWordTags);

    let dispPosData = null;

    // first checks PAOverrideText
    if (noteInfo.PAOverrideText.length !== 0) {
      dispPosData = new DispPosData(
        noteInfo.PAOverrideText,
        'Pitch Accent Override Text'
      );
    }

    // then checks PAOverride
    if (dispPosData === null && noteInfo.PAOverride.length !== 0) {
      const parser = new ParsePAOverride(
        this,
        noteInfo.PAOverride,
        noteInfo.WordReading
      );
      dispPosData = parser.parse();
    }

    // if still nothing (PAOverrideText, PAOverride), -> PAPositions
    if (dispPosData === null && noteInfo.PAPositions.length > 0) {
      const parser = new ParsePAPositions(
        this,
        noteInfo.PAPositions,
        noteInfo.WordReading
      );
      dispPosData = parser.parse();
    }

    // if still nothing (PAOverrideText, PAOverride, PAPositions) -> AJTWordPitch
    if (dispPosData === null && noteInfo.AJTWordPitch.length > 0) {
      const parser = new ParseAJTWordPitch(
        this,
        noteInfo.AJTWordPitch,
        noteInfo.WordReading,
        this.removeNasal,
      );
      dispPosData = parser.parse();
    }

    // absolutely 0 pitches can be found
    if (dispPosData === null) {
      dispPosData = this.getDispPosDataOnEmpty(noteInfo.WordReading);
    }

    this.useDispPosData(displayEle, dispPosData, noteInfo.tags);

    return dispPosData;
  }

  main() {
    const noteInfo: NoteInfoPA = {
      tags: getTags(),
      PAOverrideText: getFieldValue('PAOverrideText'),
      PAOverride: getFieldValue('PAOverride'),
      PAPositions: getFieldValue('PAPositions'),
      AJTWordPitch: getFieldValue('AJTWordPitch'),
      WordReading: getFieldValue('WordReading'),
      YomichanWordTags: getFieldValue('YomichanWordTags'),
    };

    const displayEle = document.getElementById('dh_word_pitch_text');
    if (displayEle !== null) {
      displayEle.removeAttribute('title');
      this.addPosition(displayEle, noteInfo);
    }
  }
}
