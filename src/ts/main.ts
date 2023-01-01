import { LOGGER } from './logger';
import { compileOpts } from './consts';
import { fieldExists } from './utils';

//import { TimePerformance } from "./timePerformance"
import { Keybinds } from './keybinds';

import { AutoPitchAccent } from './autoPitchAccent';
import { ImgUtilsMin } from './imgUtilsMin';
import { ImgUtils } from './imgUtils';

import { SentUtils } from './sentUtils';
import { AutoHighlightWord } from './autoHighlightWord';

import { KanjiHover } from './kanjiHover';
import { CollapseDictionaries } from './collapseDictionaries';
import { OpenCollapsedFields } from './openCollapsedFields';
import { WordIndicators } from './wordIndicators';

import { MobileUtils } from './mobileUtils';
import { InfoCircleUtils } from './infoCircleUtils';
import { FreqUtils } from './freqUtils';
import { FixRubyPositioning } from './fixRubyPositioning';
import { CheckDuplicateKey } from './checkDuplicateKey';

export function main(cardSide: string, cardType: string, noteType: string) {
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

  LOGGER.debug(`Hello world! cardType=${cardType} cardSide=${cardSide} noteType=${noteType}`);

  const optsScript = document.getElementById('jpmn_options_script');
  if (optsScript) {
    optsScript.onerror = () => {
      LOGGER.warn('Options file not found. Did you place the options file in the media directory?');
    };
  }

  if (
    !compileOpts['hardcodedRuntimeOptions'] &&
    typeof (window as any).JPMNOptions === 'undefined'
  ) {
    LOGGER.warn(
      'JPMNOptions was not defined in the options file. Was there an error? ' +
        'Click <a href="https://aquafina-water-bottle.github.io/jp-mining-note/faq/#warning-jpmnopts-was-not-defined-in-the-options-file-was-there-an-error">here</a> for basic troubleshooting.',
      { isHtml: true }
    );
  }

  if (fieldExists('IsHoverCard', 'IsClickCard')) {
    LOGGER.warn(
      'Both `IsHoverCard` and `IsClickCard` are filled. At most one should be filled at once.'
    );
  }

  // ==========================================================================
  // = run modules =
  // ==========================================================================

  // don't think there's an automatic way to properly tree-shake without
  // copying/pasting code unfortunately
  // attempting to store and read things from an array doesn't seem to work!

  if (compileOpts['enableModule.keybinds']) {
    new Keybinds('keybinds').run();
  }

  if (compileOpts['enableModule.mobileUtils']) {
    new MobileUtils('mobileUtils').run();
  }

  if (cardSide === 'back' && compileOpts['enableModule.autoPitchAccent']) {
    new AutoPitchAccent('autoPitchAccent').run();
  }

  if (cardSide === 'back' && compileOpts['enableModule.imgUtilsMin']) {
    new ImgUtilsMin('imgUtilsMin').run();
  }

  if (cardSide === 'back' && compileOpts['enableModule.imgUtils']) {
    new ImgUtils('imgUtils').run();
  }

  if (compileOpts['enableModule.sentUtils']) {
    new SentUtils('sentUtils').run();
  }

  if (compileOpts['enableModule.autoHighlightWord']) {
    new AutoHighlightWord('autoHighlightWord').run();
  }

  if (cardSide === 'back' && compileOpts['enableModule.kanjiHover']) {
    new KanjiHover('kanjiHover').run();
  }

  if (cardSide === 'back' && compileOpts['enableModule.collapseDictionaries']) {
    new CollapseDictionaries('collapseDictionaries').run();
  }

  if (cardSide === 'back' && compileOpts['enableModule.openCollapsedFields']) {
    new OpenCollapsedFields('openCollapsedFields').run();
  }

  if (cardSide === 'back' && compileOpts['enableModule.wordIndicators']) {
    new WordIndicators('wordIndicators').run();
  }

  if (compileOpts['enableModule.mobileUtils']) {
    new MobileUtils('mobileUtils').run();
  }

  if (compileOpts['enableModule.infoCircleUtils']) {
    new InfoCircleUtils('infoCircleUtils').run();
  }

  if (cardSide === 'back' && compileOpts['enableModule.freqUtils']) {
    new FreqUtils('freqUtils').run();
  }

  if (compileOpts['enableModule.fixRubyPositioning']) {
    new FixRubyPositioning('fixRubyPositioning').run();
  }

  if (compileOpts['enableModule.checkDuplicateKey']) {
    new CheckDuplicateKey('checkDuplicateKey').run();
  }
}
