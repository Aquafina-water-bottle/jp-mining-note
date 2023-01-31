import { LOGGER } from './logger';
import { compileOpts } from './consts';
import { CardSide, fieldAllExists, fieldNoneExist } from './utils';
import { getOption } from './options'

import { Keybinds } from './modules/keybinds';
import { MainCardUtils } from './modules/mainCardUtils';

import { SentenceParser } from './modules/sentenceParser';

import { AutoPitchAccent } from './modules/autoPitchAccent';
import { ImgStylizer } from './modules/imgStylizer';

import { KanjiHover } from './modules/kanjiHover';
import { CollapseDictionaries } from './modules/collapseDictionaries';
import { OpenCollapsedFields } from './modules/openCollapsedFields';
import { WordIndicators } from './modules/wordIndicators';
import { FreqUtils } from './modules/freqUtils';
import { WebSocketUtils } from './modules/webSocketUtils'

import { MobileUtils } from './modules/mobileUtils';
import { InfoCircleUtils } from './modules/infoCircleUtils';
import { FixRubyPositioning } from './modules/fixRubyPositioning';
import { CheckDuplicateKey } from './modules/checkDuplicateKey';
import {AsyncManager} from './modules/asyncManager';

export function main(cardSide: CardSide, cardType: string, noteType: string) {
  // ==========================================================================
  // = error handling =
  // ==========================================================================

  // on any javascript error: log it
  window.onerror = function (_msg, _url, _lineNo, _columnNo, error) {
    LOGGER.errorStack(error?.stack ?? 'Unknown runtime error');
    //LOGGER.error(error?.stack ?? 'Unknown runtime error');
  };

  // https://stackoverflow.com/a/55178672
  window.onunhandledrejection = function (errorEvent) {
    if (errorEvent.reason === 'AnkiConnect failed to issue request.') {
      let reason =
        errorEvent.reason +
        ' Click <a href="https://aquafina-water-bottle.github.io/jp-mining-note/faq/#error-ankiconnect-failed-to-issue-request">here</a> for basic troubleshooting.';
      LOGGER.error('Javascript handler error: ' + reason);
    } else {
      LOGGER.error('Javascript handler error: ' + errorEvent.reason);
    }
  };

  // ==========================================================================
  // = sanity checks =
  // ==========================================================================

  LOGGER.debug(`----------------------------DEBUG-LOGS----------------------------`);
  LOGGER.debug(`Hello world! cardType=${cardType} cardSide=${cardSide} noteType=${noteType}`);

  const optsScript = document.getElementById('jpmn_options_script');
  if (optsScript) {
    optsScript.onerror = () => {
      LOGGER.warn('Options file not found. Did you place the options file in the media directory?');
    };
  }

  if (
    !compileOpts['hardcodedRuntimeOptions'] &&
    (window as any).JPMNOptions === undefined
  ) {
    LOGGER.warn(
      'JPMNOptions was not defined in the options file. Was there an error? ' +
        'Click <a href="https://aquafina-water-bottle.github.io/jp-mining-note/faq/#warning-jpmnopts-was-not-defined-in-the-options-file-was-there-an-error">here</a> for basic troubleshooting.',
      { isHtml: true }
    );
  }

  if (fieldAllExists('IsHoverCard', 'IsClickCard')) {
    LOGGER.warn(
      'Both `IsHoverCard` and `IsClickCard` are filled. At most one should be filled at once.'
    );
  }

  if (fieldNoneExist('SentenceReading') && fieldAllExists('Sentence') && getOption("warnOnNoSentenceReading")) {
    LOGGER.warn("SentenceReading is not filled out. Using Sentence field instead.");
  }
  if (fieldNoneExist('Sentence') && fieldAllExists('SentenceReading') && getOption("warnIfFilledSentenceReadingWithEmptySentence")) {
    LOGGER.warn("`SentenceReading` is filled out, but the `Sentence` field is not. Is this a mistake?");
  }


  // ==========================================================================
  // = run modules =
  // ==========================================================================

  // don't think there's an automatic way to properly tree-shake without
  // copying/pasting code unfortunately
  // attempting to store and read things from an array doesn't seem to work!

  // TODO move module id to the constructor of the class

  if (compileOpts['enableModule.keybinds']) {
    new Keybinds().run();
  }

  if (cardType === "main") {
    new MainCardUtils().run();
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
    new ImgStylizer(cardSide).run();
  }

  if (cardSide === 'back') {
    // TODO async scheduler on some modules here
    // TODO separate these between async and synchronous somewhow?
    if (compileOpts['enableModule.collapseDictionaries']) {
      new CollapseDictionaries().run();
    }

    if (compileOpts['enableModule.openCollapsedFields']) {
      new OpenCollapsedFields().run();
    }

    if (compileOpts['enableModule.freqUtils']) {
      new FreqUtils().run();
    }
  }

  if (compileOpts['enableModule.webSocketUtils']) {
    new WebSocketUtils(cardSide).run();
  }


  if (compileOpts['enableModule.mobileUtils']) {
    new MobileUtils().run();
  }

  if (compileOpts['enableModule.infoCircleUtils']) {
    new InfoCircleUtils().run();
  }

  if (compileOpts['enableModule.fixRubyPositioning']) {
    new FixRubyPositioning().run();
  }

  if (compileOpts['enableModule.checkDuplicateKey']) {
    new CheckDuplicateKey().run();
  }


  const asyncManager = new AsyncManager();

  if (compileOpts['enableModule.kanjiHover']) {
    asyncManager.addModule(new KanjiHover());
  }
  if (compileOpts['enableModule.wordIndicators']) {
    asyncManager.addModule(new WordIndicators());
  }
  asyncManager.runModules();

}
