import { LOGGER } from './logger';
import { translatorStrs } from './consts';

export type Field =
  | 'Key'
  | 'Word'
  | 'WordReading'
  | 'PAOverride'
  | 'PAOverrideText'
  | 'AJTWordPitch'
  | 'PrimaryDefinition'
  | 'PrimaryDefinitionPicture'
  | 'Sentence'
  | 'SentenceReading'
  | 'AltDisplay'
  | 'AltDisplayPASentenceCard'
  | 'AltDisplayAudioCard'
  | 'AdditionalNotes'
  | 'Hint'
  | 'HintNotHidden'
  | 'IsSentenceCard'
  | 'IsTargetedSentenceCard'
  | 'IsClickCard'
  | 'IsHoverCard'
  | 'IsHintCard'
  | 'IsSentenceFirstCard'
  | 'IsAudioCard'
  | 'PAShowInfo'
  | 'PATestOnlyWord'
  | 'PADoNotTest'
  | 'PASeparateWordCard'
  | 'PASeparateSentenceCard'
  | 'SeparateAudioCard'
  | 'SeparateSentenceAudioCard'
  | 'Picture'
  | 'WordAudio'
  | 'SentenceAudio'
  | 'PAGraphs'
  | 'PAPositions'
  | 'FrequenciesStylized'
  | 'FrequencySort'
  | 'PASilence'
  | 'WordReadingHiragana'
  | 'YomichanWordTags'
  | 'SecondaryDefinition'
  | 'ExtraDefinitions'
  | 'UtilityDictionaries'
  | 'Comment';

export type NoteInfo = {
  readonly tags: string[];
  readonly fields: {
    readonly Field: {
      readonly value: string;
    };
  };
};

export type CardSide = "front" | "back";



export const VW = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

export const TAGS_LIST: readonly string[] = (() => {
  let tagsList = '{{Tags}}'.split(' ');
  if (tagsList.length === 1 && tagsList[0] === '') {
    return [];
  }
  return tagsList;
})();

export function popupMenuMessage(message: string, isHTML = false) {
  let popupMenu = document.getElementById('popup_menu');

  if (popupMenu === null) {
    LOGGER.warn('popup menu cannot be found?');
    return;
  }

  // creates message
  const popupMessageDiv = document.createElement('div');
  if (isHTML) {
    popupMessageDiv.innerHTML = message;
  } else {
    popupMessageDiv.innerText = message;
  }
  popupMessageDiv.classList.add('popup-menu--animate');

  popupMenu.appendChild(popupMessageDiv);

  // kills the popup after the animations play
  setTimeout(() => {
    popupMenu?.removeChild(popupMessageDiv);
    LOGGER.debug(`Removed popup: "${message}"`, 2);
  }, 1000 * (0.6 + 3 + 0.75));
}

function _fieldExists(field: Field): boolean {
  const x = document.getElementById(`hidden_field_exists_${field}`);
  if (x === null) {
    LOGGER.warn(`_fieldExists(${field}) could not find element`);
    return false; // shouldn't ever be reached?
  }
  return (x.innerHTML.length !== 0)
}

/* if every field exists */
export function fieldAllExists(...fields: Field[]) {
  for (const field of fields) {
    if (!_fieldExists(field)) {
      return false;
    }
  }
  return true;
}

/* if any field exists */
export function fieldAnyExist(...fields: Field[]) {
  for (const field of fields) {
    if (_fieldExists(field)) {
      return true;
    }
  }
  return false;
}

export function getFieldValue(field: Field): string {
  const x = document.getElementById(`hidden_field_${field}`);
  if (x === null) {
    LOGGER.warn(`getFieldValue(${field}) could not find element`);
    return "";
  }
  return x.innerHTML;
}

export function fieldNoneExist(...fields: Field[]) {
  return !fieldAnyExist(...fields);
}

export function isMobile() {
  return document.documentElement.classList.contains('mobile');
}

export function isAndroid() {
  return document.documentElement.classList.contains('android');
}

export function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function escapeReplacement(str: string) {
    return str.replace(/\$/g, '$$$$');
}

// why isn't this builtin :(?
export function countOccurancesInString(str: string, substr: string): number {
  return ( str.match(escapeRegExp(substr)) ?? [] ).length;
}

export function arrContainsAnyOf<T>(mainArr: readonly T[], testArr: readonly T[]): boolean {
  for (const x of testArr) {
    if (mainArr.includes(x)) {
      return true;
    }
  }
  return false;
}



type PAIndicatorType = "none" | "word" | "sentence";
type PAIndicatorClass = "pa-indicator-color--none" | "pa-indicator-color--word" | "pa-indicator-color--sentence";

export type PAIndicator = {
  type: PAIndicatorType,
  className: PAIndicatorClass,
  tooltip: string,
}

export const paIndicator: PAIndicator = (function () {
  let type: PAIndicatorType | null = null;
  let tooltip = null;

  if (getCardType() === "pa_sent") {
    type = "sentence";
  } else if (fieldAnyExist("PADoNotTest", "PASeparateWordCard")) {
    type = "none";
  } else if (fieldAnyExist("PASeparateSentenceCard", "PATestOnlyWord")) {
    type = "word";
  } else if (fieldAnyExist("IsSentenceCard")) {
    type = "sentence";
  } else {
    type = "word";
  }

  let className: PAIndicatorClass = `pa-indicator-color--${type}`;

  if (type === "none") {
    tooltip = translatorStrs['pa-indicator-do-not-test']
  } else if (type == "word") {
    tooltip = translatorStrs['pa-indicator-word']
  } else { // sentence
    tooltip = translatorStrs['pa-indicator-sentence']
  }

  return {
    type: type,
    className: className,
    tooltip: tooltip,
  }
}());


export function getCardType() {
  return document.getElementById("hidden_card_type")?.innerHTML;
}
export function getCardSide() {
  return document.getElementById("hidden_card_side")?.innerHTML;
}
export function getNoteType() {
  return document.getElementById("hidden_note_type")?.innerHTML;
}


function _plainToX(str: string, filter: string) {
  const re = / ?([^ >]+?)\[(.+?)\]/g;
  let result = str.replace(/&nbsp;/g, " ");
  return result.replace(re, filter);
}

/* equivalent to anki's furigana: filter */
export function plainToRuby(str: string) {
  return _plainToX(str, "<ruby><rb>$1</rb><rt>$2</rt></ruby>")
}

/* equivalent to anki's kana: filter */
export function plainToKanaOnly(str: string) {
  return _plainToX(str, "$2")
}

/* equivalent to anki's kanji: filter */
export function plainToKanjiOnly(str: string) {
  return _plainToX(str, "$1")
}


export function throwOnNotFound(id: string): HTMLElement {
  const result = document.getElementById(id);
  if (result === null) {
    throw Error(`${id} cannot be found`);
  }
  return result;
}

export function getWordTags(wordTagsStr: string): string[] {
  if (wordTagsStr.length === 0) {
    return [];
  }
  return wordTagsStr.split(", ");
}

// all verb tags that isn't 'vs'
const ALL_VERB_TAGS = new Set(["v_unspec", "v1", "v1_s", "v2a_s", "v2b_k", "v2b_s", "v2d_k", "v2d_s", "v2g_k", "v2g_s", "v2h_k", "v2h_s", "v2k_k", "v2k_s", "v2m_k", "v2m_s", "v2n_s", "v2r_k", "v2r_s", "v2s_s", "v2t_k", "v2t_s", "v2w_s", "v2y_k", "v2y_s", "v2z_s", "v4b", "v4g", "v4h", "v4k", "v4m", "v4n", "v4r", "v4s", "v4t", "v5aru", "v5b", "v5g", "v5k", "v5k_s", "v5m", "v5n", "v5r", "v5r_i", "v5s", "v5t", "v5u", "v5u_s", "v5uru", "vi", "vk", "vn", "vr", "vs_c", "vs_i", "vs_s", "vt", "vz"]);

export function isVerb(wordTags: string[]) {
  for (const t of wordTags) {
    if (ALL_VERB_TAGS.has(t)) {
      return true;
    }
  }
  return false;
}

