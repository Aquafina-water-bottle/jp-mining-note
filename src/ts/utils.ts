import { LOGGER } from './logger';
import { translatorStrs } from './consts';
import {getFieldValue, fieldsAnyFilled, fieldIsFilled, Field } from './fields';

// TODO: move this to a different file? why is this even here?
export type NoteInfo = {
  readonly noteId: number;
  readonly modelName: string;
  readonly tags: string[];
  readonly fields: Record<Field, {value: string}>
};

export type CardInfo = {
  // TODO: incomplete!
  readonly cardId: number;
  readonly due: number;
  readonly fields: Record<Field, {value: string}>
};


export type CardSide = "front" | "back";


//export const VW = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

let _tagsList: null | readonly string[] = null;

export function getTags() {
  if (_tagsList === null) {
    let tags = '{{Tags}}'.split(' ');
    if (tags.length === 1 && tags[0] === '') {
      _tagsList = [];
    } else {
      _tagsList = tags;
    }
  }
  return _tagsList;
}

// all verb tags that isn't 'vs'
const ALL_VERB_OR_IADJ_TAGS = new Set(["v_unspec", "v1", "v1_s", "v2a_s", "v2b_k", "v2b_s", "v2d_k", "v2d_s", "v2g_k", "v2g_s", "v2h_k", "v2h_s", "v2k_k", "v2k_s", "v2m_k", "v2m_s", "v2n_s", "v2r_k", "v2r_s", "v2s_s", "v2t_k", "v2t_s", "v2w_s", "v2y_k", "v2y_s", "v2z_s", "v4b", "v4g", "v4h", "v4k", "v4m", "v4n", "v4r", "v4s", "v4t", "v5aru", "v5b", "v5g", "v5k", "v5k_s", "v5m", "v5n", "v5r", "v5r_i", "v5s", "v5t", "v5u", "v5u_s", "v5uru", "vi", "vk", "vn", "vr", "vs_c", "vs_i", "vs_s", "vt", "vz", "adj-i"]);

// A key string that should be almost guaranteed to be unique per card.
// If a card has the same key and sentence, it's safe to guess that the card
// is functionally the same anways.
// Useful for usage in persistance, etc.
//let cardKey: string | null = null;
//export function getCardKey() {
//  if (cardKey !== null) {
//    cardKey = `${getFieldValue("Key")}.${getFieldValue("Sentence")}`;
//  }
//  return cardKey;
//}
let _cardKey: string | null = null;
export function getCardKey() {
  if (_cardKey !== null) {
    return _cardKey;
  }
  _cardKey = `${getFieldValue("Key")}.${getFieldValue("Sentence")}`;
  return _cardKey;
}

/*
 * This is prefixed with `_` to indicate that this should not be used under normal circumstances.
 * These values should be reset after each card flip normally, but has to be manually reset
 * with cache.ts
 */
export function _resetGlobalState() {
  _cardKey = null;
  _tagsList = null;
}

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
    popupMessageDiv.textContent = message;
  }
  popupMessageDiv.classList.add('popup-menu--animate');

  popupMenu.appendChild(popupMessageDiv);

  // kills the popup after the animations play
  setTimeout(() => {
    popupMenu?.removeChild(popupMessageDiv);
    LOGGER.debug(`Removed popup: "${message}"`, 2);
  }, 1000 * (0.6 + 3 + 0.75));
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


let _paIndicator: PAIndicator | null = null;

export function getPAIndicator() {
  if (_paIndicator !== null) {
    return _paIndicator;
  }

  let type: PAIndicatorType | null = null;
  let tooltip = null;

  if (getCardType() === "pa_sent") {
    type = "sentence";
  } else if (fieldIsFilled("IsAudioCard")) { // ignores word cards and sentence cards for now, TODO?
    if (fieldIsFilled("PADoNotTest")) {
      type = "none";
    } else if (fieldIsFilled("PATestOnlyWord")) {
      type = "word";
    //} else if (fieldIsFilled("IsSentenceCard")) {
    //  type = "sentence";
    } else {
      type = "sentence";
    }
  } else if (fieldsAnyFilled("PADoNotTest", "PASeparateWordCard")) {
    type = "none";
  } else if (fieldsAnyFilled("PASeparateSentenceCard", "PATestOnlyWord")) {
    type = "word";
  } else if (fieldsAnyFilled("IsSentenceCard")) {
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

  _paIndicator = {
    type: type,
    className: className,
    tooltip: tooltip,
  }

  return _paIndicator
}


export function getCardType() {
  return document.getElementById("hidden_card_type")?.innerHTML;
}
export function getCardTypeName() {
  return document.getElementById("hidden_card_type_name")?.innerHTML;
}
export function getCardSide() {
  return document.getElementById("hidden_card_side")?.innerHTML as CardSide | undefined;
}
export function getNoteType() {
  return document.getElementById("hidden_note_type")?.innerHTML;
}
export function getModelName() {
  return document.getElementById("hidden_model_name")?.innerHTML;
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


export function isVerbOrIAdj(wordTags: string[]) {
  for (const t of wordTags) {
    if (ALL_VERB_OR_IADJ_TAGS.has(t)) {
      return true;
    }
  }
  return false;
}




function filterCardsReduce1(
  aMaxFirst: number,
  aMaxLast: number,
  bMaxFirst: number,
  bMaxLast: number,
  aArrLen: number,
  bArrLen: number
) {
  let flip = true;
  while (aMaxFirst + aMaxLast > aArrLen && bMaxFirst + bMaxLast < bArrLen) {
    if (flip && aMaxFirst > 0) {
      aMaxFirst -= 1;
      bMaxFirst += 1;
    } else if (aMaxLast > 0) {
      aMaxLast -= 1;
      bMaxLast += 1;
    }
    flip = !flip;
  }

  return [aMaxFirst, aMaxLast, bMaxFirst, bMaxLast];
}

function filterCardsReduce2(tempTotal: number, limit: number) {
  if (tempTotal === 0) { // nothing to do
    limit = 0;
  } else if (tempTotal >= limit) { // can remove total limit
    tempTotal -= limit;
  } else { // tempTotal !== 0 && tempTotal < limit
    limit = tempTotal; // gets remaining amount
    tempTotal = 0;
  }
  return [tempTotal, limit]

}

export function filterCards(
  a: number[][],
  b: number[][],
  aMaxFirst: number,
  aMaxLast: number,
  bMaxFirst: number,
  bMaxLast: number
): [number[][], number[][]] {
  if (a.length !== b.length) {
    throw Error(`Invalid lengths: ${a.length} vs ${b.length}`);
  }

  // store original values
  const aMaxFirstOG = aMaxFirst;
  const aMaxLastOG = aMaxLast;
  const bMaxFirstOG = bMaxFirst;
  const bMaxLastOG = bMaxLast;

  let totalLimits = aMaxFirst + aMaxLast + bMaxFirst + bMaxLast;

  // result
  let aRes: number[][] = [];
  let bRes: number[][] = [];

  // attempts to use all in a_arr and b_arr to fill all of the resulting 2 arrays
  for (let i = 0; i < a.length; i++) {
    const aArr = Array.from(a[i]).sort();
    const bArr = Array.from(b[i]).sort();

    //console.log("filter1", aMaxFirst, aMaxLast, bMaxFirst, bMaxLast, totalLimits, aArr.length, bArr.length);

    // spreads out the limits to each other if necessary
    // only spreads out the limits if the other array can handle it!
    // expensive (O(n) instead of constant) but it's guaranteed to work
    [aMaxFirst, aMaxLast, bMaxFirst, bMaxLast] = filterCardsReduce1(
      aMaxFirst,
      aMaxLast,
      bMaxFirst,
      bMaxLast,
      aArr.length,
      bArr.length,
    );

    //console.log("filter2", aMaxFirst, aMaxLast, bMaxFirst, bMaxLast, totalLimits);

    [bMaxFirst, bMaxLast, aMaxFirst, aMaxLast] = filterCardsReduce1(
      bMaxFirst,
      bMaxLast,
      aMaxFirst,
      aMaxLast,
      bArr.length,
      aArr.length,
    );

    //console.log("filter3", aMaxFirst, aMaxLast, bMaxFirst, bMaxLast, totalLimits);

    if (aArr.length > aMaxFirst + aMaxLast) {
      if (aMaxLast === 0) {
        aRes.push([...aArr.slice(0, aMaxFirst)]);
      } else {
        aRes.push([...aArr.slice(0, aMaxFirst), ...aArr.slice(-aMaxLast, aArr.length)]);
      }
      totalLimits -= (aMaxFirst + aMaxLast)
    } else {
      aRes.push(Array.from(aArr));
      totalLimits -= (aArr.length)
    }

    if (bArr.length > bMaxFirst + bMaxLast) {
      if (bMaxLast === 0) {
        bRes.push([...bArr.slice(0, bMaxFirst)]);
      } else {
        bRes.push([...bArr.slice(0, bMaxFirst), ...bArr.slice(-bMaxLast, bArr.length)]);
      }
      totalLimits -= (bMaxFirst + bMaxLast)
    } else {
      bRes.push(Array.from(bArr));
      totalLimits -= (bArr.length)
    }

    //console.log("filter4", aMaxFirst, aMaxLast, bMaxFirst, bMaxLast, totalLimits);

    // we CANNOT break the loop here because we must add the remaining (empty) arrays
    // to aRes and bRes it seems

    // bubbles up all remaining limits in the following priority:
    // aMaxFirst, aMaxLast, bMaxFirst, bMaxLast
    let tempTotal = totalLimits;
    [tempTotal, aMaxFirst] = filterCardsReduce2(tempTotal, aMaxFirstOG);
    [tempTotal, aMaxLast] = filterCardsReduce2(tempTotal, aMaxLastOG);
    [tempTotal, bMaxFirst] = filterCardsReduce2(tempTotal, bMaxFirstOG);
    [tempTotal, bMaxLast] = filterCardsReduce2(tempTotal, bMaxLastOG);

    //console.log("filter5", aMaxFirst, aMaxLast, bMaxFirst, bMaxLast, totalLimits);
  }

  return [aRes, bRes];
}

export function hybridClick() {
  const toggleEle = document.getElementById('hybrid_click_toggle') as HTMLInputElement;
  if (toggleEle !== null) {
    toggleEle.checked = !toggleEle.checked;
  }
}


/* taken from Anki: https://github.com/ankitects/anki/blob/09a946574b2c4410d772330ee03e2235fdf4799a/ts/reviewer/index.ts */
type Callback = () => void | Promise<void>;

export function addOnShownHook(callback: Callback) {
  let onShownHook: Callback[] | undefined = (window as any).onShownHook;
  if (onShownHook !== undefined && Array.isArray(onShownHook)) {
    onShownHook.push(callback);
  } else {
    console.log("(playSilence) onShownHook is invalid or doesn't exist");
  }
}


export function cardCacheExpired(cardCacheEle: HTMLElement) {
  const writeTimeStr = cardCacheEle?.querySelector(`[data-cache-write-time]`)?.getAttribute("data-cache-write-time")
  const expiryDurationStr = cardCacheEle?.querySelector(`[data-cache-expires]`)?.getAttribute("data-cache-expires")
  if (!writeTimeStr || !expiryDurationStr) { // skip if any are null/undefined
    return;
  }
  const writeTime = Number(writeTimeStr);
  const expiryDurationDays = Number(expiryDurationStr);

  // 24/1 hour/day
  // 60/1 -> minute/hour
  // 60/1 -> second/minute
  // 1000/1 -> ms/s
  const expiryDuration = expiryDurationDays * 1000 * 60 * 60 * 24; // milliseconds
  // caching expired result is likely not worth it here
  const isExpired = (expiryDuration + writeTime < Date.now());
  return isExpired;
}

