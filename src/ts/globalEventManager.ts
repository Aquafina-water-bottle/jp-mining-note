import {Module} from "./module";
import {setWidthCache} from "./reflow";
import {selectPersistStr} from "./spersist";
import { hybridClick, getCardSide, getCardType, playAudio } from './utils';
import { fieldsAnyFilled } from './fields';
import { getOption } from './options';

/**
 * Wraps around a few window.onX or document.onX functions,
 * to better handle these particular global cases.
 * This class is necessary because we cannot use the trivial addEventListener,
 * as these handlers ARE PERSISTED between notes!!!
 * This is because Anki usually implements the card reviewer as a persistent browser.
 */
export type KeybindFunc = (e: KeyboardEvent) => void;
export type WindowResizeFunc = (e: UIEvent) => void;

type TimeoutValue = ReturnType<typeof setTimeout>;


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

function baseKeybindFunc(e: KeyboardEvent) {
  if (hasKey(e, getOption('keybinds.playWordAudio'))) {
    playAudio('word_audio');
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
      playAudio('sentence_audio');
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


export class GlobalEventManager extends Module {
  private readonly keybindFuncs: Record<string, KeybindFunc> = {};
  private readonly windowResizeFuncs: Record<string, WindowResizeFunc> = {};

  private windowResizeTimeout: TimeoutValue | null = null; // holder for timeout id

  constructor() {
    super('gEventManager');
    this.register();
  }

  addKeybindFunc(key: string, func: KeybindFunc) {
    this.keybindFuncs[key] = func;
  }

  addWindowResizeFunc(key: string, func: WindowResizeFunc) {
    this.windowResizeFuncs[key] = func;
  }

  /**
   * Sets all .onX functions.
   * Note: There's no reason not to register early, since the keybindFuncs, windowResizeFuncs, etc.
   * will be read dynamically anyways
   */
  register() {
    document.onkeyup = (e) => {
      this.logger.debug(`KeyboardEvent: code=${e.code}`, 0);

      baseKeybindFunc(e)

      for (const [key, func] of Object.entries(this.keybindFuncs)) {
        this.logger.debug(`Running keybind function ${key}`, 1);
        func(e);
      }
    };


    // window.onresize
    const delay = 500; // delay after event is "complete" to run callback
    const persist = selectPersistStr();
    if (persist !== null) {

      window.onresize = (e) => {
        // clear the timeout
        if (this.windowResizeTimeout !== null) {
          clearTimeout(this.windowResizeTimeout);
        }
        // start timing for event "completion"
        this.windowResizeTimeout = setTimeout(() => {

          setWidthCache(persist)
          this.logger.debug(`onResizeEvent`, 0);

          for (const [key, func] of Object.entries(this.windowResizeFuncs)) {
            this.logger.debug(`Running windowResize function ${key}`, 1);
            func(e);
          }

        }, delay);
      };

    }

  }
}
