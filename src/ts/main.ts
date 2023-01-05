import { LOGGER } from './logger';
import { compileOpts } from './consts';
import { CardSide, fieldAllExists, fieldNoneExist } from './utils';
import { getOption } from './options'

//import { TimePerformance } from "./timePerformance"
import { Keybinds } from './modules/keybinds';
import { MainCardUtils } from './modules/mainCardUtils';

import { SentUtils } from './modules/sentUtils';

import { AutoPitchAccent } from './modules/autoPitchAccent';
import { ImgUtilsMin } from './modules/imgUtilsMin';
import { ImgUtils } from './modules/imgUtils';

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

export function main(cardSide: CardSide, cardType: string, noteType: string) {
  // ==========================================================================
  // = error handling =
  // ==========================================================================

  // on any javascript error: log it
  window.onerror = function (_msg, _url, _lineNo, _columnNo, error) {
    // TODO implement errorStack
    //LOGGER.errorStack(error.stack);
    LOGGER.error(error?.stack ?? 'Unknown runtime error');
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

  LOGGER.debug(`------------------------------------------------------------------`);
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
    new Keybinds('keybinds').run();
  }

  if (cardType === "main") {
    new MainCardUtils('mainCardUtils').run();
  }

  if (compileOpts['enableModule.sentUtils']) {
    new SentUtils('sentUtils').run();
  }


  if (cardSide === 'back') {
    if (compileOpts['enableModule.autoPitchAccent']) {
      new AutoPitchAccent('autoPitchAccent').run();
    }

    if (compileOpts['enableModule.imgUtilsMin']) {
      new ImgUtilsMin('imgUtilsMin').run();
    } else if (compileOpts['enableModule.imgUtils']) {
      new ImgUtils('imgUtils').run();
    }

    // TODO async scheduler
    if (compileOpts['enableModule.kanjiHover']) {
      new KanjiHover('kanjiHover').run();
    }
    if (compileOpts['enableModule.wordIndicators']) {
      new WordIndicators('wordIndicators').run();
    }

    if (compileOpts['enableModule.collapseDictionaries']) {
      new CollapseDictionaries('collapseDictionaries').run();
    }

    if (compileOpts['enableModule.openCollapsedFields']) {
      new OpenCollapsedFields('openCollapsedFields').run();
    }

    if (compileOpts['enableModule.freqUtils']) {
      new FreqUtils('freqUtils').run();
    }
  }

  if (compileOpts['enableModule.webSocketUtils']) {
    new WebSocketUtils(cardSide).run();
  }


  if (compileOpts['enableModule.mobileUtils']) {
    new MobileUtils('mobileUtils').run();
  }

  if (compileOpts['enableModule.infoCircleUtils']) {
    new InfoCircleUtils().run();
  }

  if (compileOpts['enableModule.fixRubyPositioning']) {
    new FixRubyPositioning('fixRubyPositioning').run();
  }

  if (compileOpts['enableModule.checkDuplicateKey']) {
    new CheckDuplicateKey('checkDuplicateKey').run();
  }
}
