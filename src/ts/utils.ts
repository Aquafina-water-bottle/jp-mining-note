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
  | 'AdditionalNotes'
  | 'Hint'
  | 'HintNotHidden'
  | 'IsSentenceCard'
  | 'IsTargetedSentenceCard'
  | 'IsClickCard'
  | 'IsHoverCard'
  | 'IsHintCard'
  | 'PAShowInfo'
  | 'PATestOnlyWord'
  | 'PADoNotTest'
  | 'PASeparateWordCard'
  | 'PASeparateSentenceCard'
  | 'SeparateClozeDeletionCard'
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
  const x = document.getElementById(field + '_exists');
  if (x === null) {
    return false; // should ever be reached?
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

export const paIndicator: PAIndicator  = (function () {
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


