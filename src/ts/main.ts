import { LOGGER } from './logger';
import { compileOpts } from './consts';
import {
  addOnShownHook,
  BASE_DOCS_URL,
  playAudio,
  isMobile,
  type AudioId,
  type CardSide,
} from './utils';
import { fieldsAllFilled, fieldsAllEmpty } from './fields';
import { getOption } from './options';

//import { newKeybinds } from './modules/keybinds';
import { MainCardUtils } from './modules/mainCardUtils';

import { SentenceParser } from './modules/sentenceParser';

import { AutoPitchAccent } from './modules/autoPitchAccent';
import { ImgStylizer } from './modules/imgStylizer';

import { KanjiHover } from './modules/kanjiHover';
import { WordIndicators } from './modules/wordIndicators';
import { FreqUtils } from './modules/freqUtils';

import { MobileUtils } from './modules/mobileUtils';
import { MobilePopup } from './mobilePopup';
import { InfoCircleUtils } from './modules/infoCircleUtils';
import { FixRubyPositioning } from './modules/fixRubyPositioning';

import { CheckDuplicateKey } from './modules/checkDuplicateKey';
import { AsyncManager } from './modules/asyncManager';
import { Blockquotes } from './modules/blockquotes';
import { RefreshCard } from './modules/refreshCard';
import { cardIsNew } from './isNew';
import { getViewportWidth } from './reflow';
import { CardCache } from './modules/cardCache';
import {GlobalEventManager} from './globalEventManager';

export function main(cardSide: CardSide, cardType: string, noteType: string) {
  // ==========================================================================
  // = error handling =
  // ==========================================================================

  // on any javascript error: log it
  window.onerror = function (msg, url, lineNo, columnNo, error) {
    LOGGER.errorStack(
      error?.stack ?? 'Unknown runtime error',
      `${msg}`,
      url,
      lineNo,
      columnNo
    );
  };

  // https://stackoverflow.com/a/55178672
  window.onunhandledrejection = function (errorEvent) {
    if (errorEvent.reason === 'AnkiConnect failed to issue request.') {
      let reason =
        errorEvent.reason +
        ` Click <a href="${BASE_DOCS_URL}/#error-ankiconnect-failed-to-issue-request">here</a> for basic troubleshooting.`;
      LOGGER.error('Javascript handler error: ' + reason);
    } else {
      LOGGER.error('Javascript handler error: ' + errorEvent.reason);
    }
  };

  // ==========================================================================
  // = audio playing =
  // ==========================================================================

  // Checks for mobile because at least on Android, audio playback won't work unless
  // onShownHook is used. It'll pretty much freeze the card if attempted...
  function playAudioFunc(func: (id: AudioId) => void, id: AudioId) {
    if (isMobile()) {
      addOnShownHook(() => {
        func(id);
      });
    } else {
      // Ideally, we would want to play the function
      func(id);
    }
  }

  if (cardSide === 'front') {
    playAudioFunc(playAudio, 'pa_silence_audio');
  } else {
    // back side
    // NOTE: this is definitely a bit of a hack, because the first audio still attempts to play
    // immediately after the card load, meaning the word audio maybe repeated.
    const audioPlaybackMode = getOption('audioPlaybackMode');
    if (audioPlaybackMode == 'sentence') {
      playAudioFunc(playAudio, 'sentence_audio');
    } else if (audioPlaybackMode == 'word') {
      playAudioFunc(playAudio, 'word_audio');
    }
  }

  // ==========================================================================
  // = sanity checks =
  // ==========================================================================

  LOGGER.debug(
    `JPMN(${cardType}, ${cardSide}, ${noteType})`
  );

  const optsScript = document.getElementById('jpmn_options_script');
  if (optsScript) {
    optsScript.onerror = () => {
      LOGGER.warn(
        'Options file not found. Did you place the options file in the media directory?'
      );
    };
  }

  if (
    !compileOpts['hardcodedRuntimeOptions'] &&
    (window as any).JPMNOptions === undefined
  ) {
    LOGGER.warn(
      'JPMNOptions was not defined in the options file. Was there an error? ' +
        `Click <a href="${BASE_DOCS_URL}/faq/#warning-jpmnopts-was-not-defined-in-the-options-file-was-there-an-error">here</a> for basic troubleshooting.`,
      { isHtml: true }
    );
  }

  if (fieldsAllFilled('IsHoverCard', 'IsClickCard')) {
    LOGGER.warn(
      'Both `IsHoverCard` and `IsClickCard` are filled. At most one should be filled at once.'
    );
  }

  if (fieldsAllEmpty('SentenceReading') && fieldsAllFilled('Sentence')) {
    LOGGER.warn('SentenceReading is not filled out. Using Sentence field instead.');
  }
  if (fieldsAllEmpty('Sentence') && fieldsAllFilled('SentenceReading')) {
    LOGGER.warn(
      '`SentenceReading` is filled out, but the `Sentence` field is not. Is this a mistake?'
    );
  }

  // ==========================================================================
  // = run modules =
  // ==========================================================================

  // don't think there's an automatic way to properly tree-shake without
  // copying/pasting code unfortunately
  // attempting to store and read things from an array doesn't seem to work!

  const refreshCard = new RefreshCard();
  const globalEventManager = new GlobalEventManager();

  //newKeybinds();
  if (cardType === 'main') {
    new MainCardUtils(globalEventManager).run();
  }

  if (compileOpts['enableModule.sentenceParser']) {
    new SentenceParser().run();
  }

  if (cardSide === 'back') {
    if (compileOpts['enableModule.autoPitchAccent']) {
      new AutoPitchAccent().run();
    }
  }

  // right after auto pitch accent to prevent even more unnecessary reflow changes
  // potentially caused by modules below
  if (compileOpts['enableModule.imgStylizer']) {
    const imgStylizer = new ImgStylizer(globalEventManager);
    imgStylizer.run();
    refreshCard.addImgStylizer(imgStylizer);
  }

  if (cardSide === 'back') {
    if (compileOpts['enableModule.freqUtils']) {
      new FreqUtils().run();
    }

    // very last to ensure that definitions are properly populated
    if (compileOpts['enableModule.blockquotes']) {
      new Blockquotes().run();
    }
  }

  // depends on sentenceParser, for textbender sentence
  if (compileOpts['enableModule.mobileUtils']) {
    new MobileUtils().run();
  }

  let mobilePopup: MobilePopup | null = null;
  if (
    compileOpts['enableModule.mobilePopup'] &&
    getViewportWidth() < compileOpts['breakpoints.width.combinePicture']
  ) {
    mobilePopup = new MobilePopup('mobilePopup');
  }

  if (compileOpts['enableModule.infoCircleUtils']) {
    new InfoCircleUtils().run();
  }

  if (compileOpts['enableModule.fixRubyPositioning']) {
    new FixRubyPositioning().run();
  }

  const asyncManager = new AsyncManager();
  refreshCard.addAsyncManager(asyncManager);
  refreshCard.run();

  if (cardSide === 'front') {
    // only necessary to cache at the front side
    // the backside will call cardIsNew() as normal
    const cardIsNewFuncWrapper = () => {
      cardIsNew(cardSide);
    };
    asyncManager.addFunction(cardIsNewFuncWrapper);
  }

  const cardCache = new CardCache();

  if (compileOpts['enableModule.kanjiHover']) {
    asyncManager.addModule(new KanjiHover(cardCache, mobilePopup));
  }
  if (compileOpts['enableModule.wordIndicators']) {
    asyncManager.addModule(new WordIndicators(cardCache, mobilePopup));
  }
  if (cardSide === 'back' && compileOpts['enableModule.checkDuplicateKey']) {
    // only necessary at the back to avoid distractions at the front
    asyncManager.addModule(new CheckDuplicateKey());
  }

  addOnShownHook(() => {
    asyncManager.runModulesDelay();
  });

  LOGGER.debug('Success! End of main() reached.');
}
