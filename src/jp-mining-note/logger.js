
/* quick fix for legacy anki versions (replaces ?? operator) */
function nullish(a, b) {
  if ((typeof a === "undefined") || (a === null)) {
    return b;
  }
  return a;
}

function isMobile() {
  return document.documentElement.classList.contains('mobile');
}

function getKeyPath(keys) {
  if (typeof keys === "string") {
    return keys;
  }
  return keys.join(".");
}

// placed outside as a global variable
var VW = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)

// keys can be a string, or array of strings
function parseSetting(obj, keys) {
  // checks for an object with "type"
  // https://stackoverflow.com/a/8511350
  if (
    typeof obj === 'object' &&
    !Array.isArray(obj) &&
    obj !== null &&
    "type" in obj
  ) {
    if (obj.type === "pc-mobile") {
      if (isMobile()) {
        return obj["mobile"];
      } else {
        return obj["pc"];
      }
    } else if (obj.type === "viewport-width-is") {
      if (VW > obj["value"]) {
        return obj["greater"];
      } else {
        return obj["lesser"];
      }

    } else {
      LOGGER.warn(`Unknown type ${obj.type} for Option ${getKeyPath(keys)}. Using the entire object instead...`);
      return obj;
    }
  }

  return obj;
}


/// {% if not COMPILE_OPTIONS("hardcoded-runtime-options").item() %}
function getSetting(keys, defaultVal) {
  if (typeof JPMNOpts === "undefined") {
    return parseSetting(defaultVal, keys);
  }

  let keyList = ["settings"].concat(keys);

  let obj = JPMNOpts;
  for (let key of keyList) {
    if (!(key in obj)) {

      // checks if we need to warn, manual search
      if ("settings" in JPMNOpts && "debug" in JPMNOpts["settings"] && JPMNOpts["settings"]["debug"]) {
        LOGGER.warn("Option " + keys.join(".") + " is not defined in the options file.");
      }
      return parseSetting(defaultVal, keys);
    }
    obj = obj[key];
  }

  return parseSetting(obj, keys);
};
/// {% endif %} {# COMPILE_OPTIONS("hardcoded-runtime-options").item() #}


var JPMNLogger = (() => {
  class JPMNLogger {
    constructor(name=null) {
      this._name = name;
      this._uniqueKeys = new Set();
    }


    error(message, isHtml=false) {
      let groupEle = document.getElementById("info_circle_text_error");
      this._appendMsg(message, groupEle, isHtml);
      let infoCirc = document.getElementById("info_circle");
      infoCirc.classList.toggle("info-circle-error", true)
    }

    errorStack(stack) {
      try {
        let ignoredErrors = {{ utils.opt("ignored-errors") }};
        for (let substr of ignoredErrors) {
          if (stack.includes(substr)) {
            // ignores
            return;
          }
        }

        let stackList = stack.split(" at ");
        for (let i = 1; i < stackList.length; i++) {
          stackList[i] = ">>> " + stackList[i];
        }
        this.error(stackList);
      } catch (e) {
        // in case the above fails for some reason
        // better to throw an error that is not as prettily formatted
        // than to essentially have it go missing
        this.error(stack);
      }

    }


    assert(condition, message) {
      if (!condition) {
        this.error("(assert) " + message);
      }
    }

    removeWarn(key) {
      // assumes that this is a unique warn message

      if (!this._uniqueKeys.has(key)) {
        return;
      }

      let groupEle = document.getElementById("info_circle_text_warning");
      for (let e of groupEle.children) {
        if (e.getAttribute("data-key") === key) {
          groupEle.removeChild(e);
        }
      }

      let infoCirc = document.getElementById("info_circle");
      if (groupEle.children.length === 0) {
        infoCirc.classList.toggle("info-circle-warning", false)
      }

      this._uniqueKeys.delete(key);
    }

    // key defaults to the message if unique is true and key is null
    // key is ignored if unique == false
    // TODO extend functionality of uniqueness to other logger functions
    // TODO change to args struct
    warn(message, isHtml=false, unique=false, key=null) {

      // skips any non-unique warns as defined by the key
      if (unique) {
        if (key === null) {
          key = message;
        }

        if (this._uniqueKeys.has(key)) {
          return;
        }
      }

      let groupEle = document.getElementById("info_circle_text_warning");
      this._appendMsg(message, groupEle, isHtml, key);
      let infoCirc = document.getElementById("info_circle");
      infoCirc.classList.toggle("info-circle-warning", true);

      if (key !== null) {
        this._uniqueKeys.add(key);
      }

    }

    info(message) {
      let groupEle = document.getElementById("info_circle_text_info");
      this._appendMsg(message, groupEle);
    }

    // higher the level -> more severe
    // i.e. lower levels == more messages
    // currently goes from 0 - 5:
    debug(message, level=3) {
      if (level >= {{ utils.opt("debug-level") }}) {
        if ({{ utils.opt("debug-to-console") }}) {
          console.log(message);
        } else {
          let groupEle = document.getElementById("info_circle_text_debug");
          this._appendMsg(message, groupEle);
        }
      }
    }

    leech() {
      let groupEle = document.getElementById("info_circle_text_leech");
      this._appendMsg("", groupEle);
      let infoCirc = document.getElementById("info_circle");
      infoCirc.classList.toggle("info-circle-leech", true);
    }

    _appendMsg(message, groupEle, isHtml=false, key=null) {
      // I think this stops an infinite loop somewhere if you log a null for some reason...
      if (message === null) {
        message = "null";
      }

      if (this._name !== null) {
        message = `(${this._name}) ${message}`;
      }

      let msgEle = document.createElement('div');
      msgEle.classList.add("info-circle__message")
      if (key !== null) {
        msgEle.setAttribute("data-key", key);
      }

      if (Array.isArray(message)) {
        if (message.length > 0) {
          msgEle.textContent = message[0];

          for (let line of message.slice(1)) {
            let lineEle = document.createElement('div');
            lineEle.textContent = line;
            msgEle.appendChild(lineEle);
          }
        }

      } else {
        if (isHtml) {
          msgEle.innerHTML = message;
        } else {
          msgEle.textContent = message;
        }
      }
      groupEle.appendChild(msgEle);
    }

  }

  return JPMNLogger;
})();


/* global logger object for any javascript outside of modules that needs logging */
var LOGGER = new JPMNLogger();


// on any javascript error: log it
window.onerror = function(msg, url, lineNo, columnNo, error) {
  LOGGER.errorStack(error.stack);
}

// https://stackoverflow.com/a/55178672
window.onunhandledrejection = function(errorEvent) {
  if (errorEvent.reason === "AnkiConnect failed to issue request.") {
    let reason = errorEvent.reason + ' Click <a href="https://aquafina-water-bottle.github.io/jp-mining-note/faq/#error-ankiconnect-failed-to-issue-request">here</a> for basic troubleshooting.';
    LOGGER.error("Javascript handler error: " + reason, /*isHtml=*/true);
  } else {
    LOGGER.error("Javascript handler error: " + errorEvent.reason);
  }
}


function optionsNotFound() {
  LOGGER.warn("Options file not found. Did you place the options file in the media directory?");
}


