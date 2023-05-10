import { LOGGER } from '../logger';
import { getOption } from '../options';
import { hybridClick, getCardSide, getCardType } from '../utils';
import { fieldsAnyFilled } from '../fields';

//export class Keybinds extends RunnableModule {
//
//  constructor() {
//    super('keybinds')
//  }
//
//  main() {
//    // ...
//  }
//}

type KeybindFunc = (e: KeyboardEvent) => void;

// https://stackoverflow.com/questions/59459312/using-globalthis-in-typescript
declare global {
  var keybindFuncs: Record<string, KeybindFunc>;
}

export function newKeybinds() {
  globalThis.keybindFuncs = {};
  addKeybindFunc('baseFunc', constructBaseFunc());
  register();
}

export function addKeybindFunc(key: string, func: KeybindFunc) {
  globalThis.keybindFuncs[key] = func;
}

function constructBaseFunc(): KeybindFunc {
  function _baseFunc(e: KeyboardEvent) {
    if (hasKey(e, getOption('keybinds.playWordAudio'))) {
      let ele = document.querySelector(
        '#word-audio .soundLink, #word-audio .replaybutton'
      );
      if (ele) {
        (ele as HTMLAnchorElement).click();
      }
    }

    if (hasKey(e, getOption('keybinds.playSentenceAudio'))) {
      const toggleEle = document.getElementById(
        'hybrid_click_toggle'
      ) as HTMLInputElement | null;

      if (
        getCardSide() === 'front' &&
        getCardType() === 'main' &&
        getOption('hybridSentenceOpenOnPlaySentence') &&
        fieldsAnyFilled('IsHoverCard', 'IsClickCard') &&
        fieldsAnyFilled('IsTargetedSentenceCard', 'IsSentenceCard') &&
        toggleEle !== null &&
        !toggleEle.checked
      ) {
        hybridClick();
      } else {
        let ele = document.querySelector(
          '#sentence_audio .soundLink, #sentence_audio .replaybutton'
        );
        if (ele) {
          (ele as HTMLAnchorElement).click();
        }
      }
    }

    toggleDetailsTagOnKey(
      e,
      getOption('keybinds.toggleFrontFullSentenceDisplay'),
      document.getElementById('full_sentence_front_details')
    );

    toggleDetailsTagOnKey(
      e,
      getOption('keybinds.toggleHintDisplay'),
      document.getElementById('hint_details')
    );

    toggleDetailsTagOnKey(
      e,
      getOption('keybinds.toggleSecondaryDefinitionsDisplay'),
      document.getElementById('secondary_definition_details')
    );

    toggleDetailsTagOnKey(
      e,
      getOption('keybinds.toggleAdditionalNotesDisplay'),
      document.getElementById('additional_notes_details')
    );

    toggleDetailsTagOnKey(
      e,
      getOption('keybinds.toggleExtraDefinitionsDisplay'),
      document.getElementById('extra_definitions_details')
    );

    toggleDetailsTagOnKey(
      e,
      getOption('keybinds.toggleExtraInfoDisplay'),
      document.getElementById('extra_info_details')
    );
  }

  return _baseFunc;
}

// sets the .onkeyup function to run all in this.funcs
export function register() {
  // NOTICE: we MUST use document.onkeyup instead of document.addEventListener(...)
  // because functions persist and cannot be easily removed within anki,
  // whereas .onkeyup = ... replaces the previous function(s) with this function.
  document.onkeyup = (e) => {
    LOGGER.debug(`KeyboardEvent: code=${e.code}`, 0);

    for (const [key, func] of Object.entries(globalThis.keybindFuncs)) {
      LOGGER.debug(`(keybinds.ts) Running function ${key}`, 1);
      func(e);
    }
  };
}

/*
 * Toggles the display of any given details tag
 */
function toggleDetailsTag(ele: HTMLElement) {
  if (ele === null) {
    return;
  }

  if (ele.hasAttribute('open')) {
    ele.removeAttribute('open');
  } else {
    ele.setAttribute('open', 'true');
  }
}

export function hasKey(e: KeyboardEvent, keys: string[] | null = null) {
  return keys !== null && keys.includes(e.code);
}

function toggleDetailsTagOnKey(
  e: KeyboardEvent,
  keys: string[],
  ele: HTMLElement | null
) {
  if (hasKey(e, keys) && ele !== null) {
    toggleDetailsTag(ele);
  }
}
