import { LOGGER } from "./logger"

export type Field = (
  "Key"
  | "Word"
  | "WordReading"
  | "PAOverride"
  | "PAOverrideText"
  | "AJTWordPitch"
  | "PrimaryDefinition"
  | "PrimaryDefinitionPicture"
  | "Sentence"
  | "SentenceReading"
  | "AltDisplay"
  | "AltDisplayPASentenceCard"
  | "AdditionalNotes"
  | "Hint"
  | "HintNotHidden"
  | "IsSentenceCard"
  | "IsTargetedSentenceCard"
  | "IsClickCard"
  | "IsHoverCard"
  | "IsHintCard"
  | "PAShowInfo"
  | "PATestOnlyWord"
  | "PADoNotTest"
  | "PASeparateWordCard"
  | "PASeparateSentenceCard"
  | "SeparateClozeDeletionCard"
  | "Picture"
  | "WordAudio"
  | "SentenceAudio"
  | "PAGraphs"
  | "PAPositions"
  | "FrequenciesStylized"
  | "FrequencySort"
  | "PASilence"
  | "WordReadingHiragana"
  | "YomichanWordTags"
  | "SecondaryDefinition"
  | "ExtraDefinitions"
  | "UtilityDictionaries"
  | "Comment"
)

export const VW = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)

export const TAGS_LIST: readonly string[] = (() => {
  let tagsList = "{{Tags}}".split(" ");
  if (tagsList.length === 1 && tagsList[0] === "") {
    return [];
  }
  return tagsList;
})();

export function popupMenuMessage(message: string, isHTML=false) {
  let popupMenu = document.getElementById("popup_menu");

  if (popupMenu === null) {
    LOGGER.warn("popup menu cannot be found?");
    return;
  }

  // creates message
  const popupMessageDiv = document.createElement("div");
  if (isHTML) {
    popupMessageDiv.innerHTML = message;
  } else {
    popupMessageDiv.innerText = message;
  }
  popupMessageDiv.classList.add("popup-menu--animate");

  popupMenu.appendChild(popupMessageDiv);

  // kills the popup after the animations play
  setTimeout(() => {
    popupMenu?.removeChild(popupMessageDiv);
    LOGGER.debug(`Removed popup: "${message}"`, 2);
  }, 1000*(0.6+3+0.75))
}

function _fieldExists(field: Field): boolean {
  return !!(document.getElementById(field + "_exists")?.innerHTML);
}

export function fieldExists(...fields: Field[]) {
  for (const field of fields) {
    if (!_fieldExists(field)) {
      return false;
    }
  }
  return true;
}

export function isMobile() {
  return document.documentElement.classList.contains('mobile');
}

export function isAndroid() {
  return document.documentElement.classList.contains('android');
}

