import { LOGGER } from "./logger"
import { cardInfo } from './consts'


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

LOGGER.debug("Hello world! " + cardInfo.cardSide);

