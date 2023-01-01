import { LOGGER } from "./logger"
import { compileOpts } from "./consts"

import { ImgUtilsMin } from "./imgUtilsMin"


export type ModelInfo = {
  cardSide: string,
  cardType: string,
  noteType: string,
}


export function main(modelInfo: ModelInfo) {
  // on any javascript error: log it
  window.onerror = function(_msg, _url, _lineNo, _columnNo, error) {
    //LOGGER.errorStack(error.stack);
    LOGGER.error(error?.stack ?? "Unknown runtime error");
  }

  // https://stackoverflow.com/a/55178672
  window.onunhandledrejection = function(errorEvent) {
    if (errorEvent.reason === "AnkiConnect failed to issue request.") {
      let reason = errorEvent.reason + ' Click <a href="https://aquafina-water-bottle.github.io/jp-mining-note/faq/#error-ankiconnect-failed-to-issue-request">here</a> for basic troubleshooting.';
      LOGGER.error("Javascript handler error: " + reason);
    } else {
      LOGGER.error("Javascript handler error: " + errorEvent.reason);
    }
  }

  const optsScript = document.getElementById("jpmn_options_script");
  if (optsScript) {
    optsScript.onerror = () => {
      LOGGER.warn("Options file not found. Did you place the options file in the media directory?")
    };
  }

  LOGGER.debug(`Hello world! ${modelInfo.cardSide} ${modelInfo.cardType}`);

  // don't think there's an automatic way to properly tree-shake without
  // copying/pasting code unfortunately
  // attempting to store and read things from an array doesn't seem to work!

  if (compileOpts["enableModule.imgUtilsMin"]) {
    (new ImgUtilsMin).run();
  }


}

