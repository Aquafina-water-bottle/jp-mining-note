
/* quick fix for legacy anki versions (replaces ?? operator) */
function nullish(a, b) {
  if ((typeof a === "undefined") || (a === null)) {
    return b;
  }
  return a;
}



function getSetting(keys, defaultVal) {
  if (typeof JPMNOpts === "undefined") {
    return defaultVal;
  }

  let keyList = ["settings"].concat(keys);

  let obj = JPMNOpts;
  for (let key of keyList) {
    if (!(key in obj)) {

      // checks if we need to warn, manual search
      if ("settings" in JPMNOpts && "debug" in JPMNOpts["settings"] && JPMNOpts["settings"]["debug"]) {
        LOGGER.warn("Option " + keys.join(".") + " is not defined in the options file.");
      }
      return defaultVal;
    }
    obj = obj[key];
  }
  return obj;
};


var JPMNLogger = (() => {
  class JPMNLogger {
    constructor(name=null) {
      this._name = name;
      this._uniqueKeys = new Set();
    }


    error(message) {
      let groupEle = document.getElementById("info_circle_text_error");
      this._appendMsg(message, groupEle);
      let infoCirc = document.getElementById("info_circle");
      if (!infoCirc.classList.contains("info-circle-error")) {
        infoCirc.classList.add("info-circle-error")
      }
    }

    errorStack(stack) {
      let ignoredErrors = {{ utils.opt("ignored-errors") }};
      for (substr of ignoredErrors) {
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
      if (groupEle.children.length === 0 && infoCirc.classList.contains("info-circle-warning")) {
        infoCirc.classList.remove("info-circle-warning")
      }

      this._uniqueKeys.delete(key);
    }

    // key defaults to the message if unique is true and key is null
    // key is ignored if unique == false
    warn(message, unique=true, key=null) {

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
      this._appendMsg(message, groupEle, key);
      let infoCirc = document.getElementById("info_circle");
      if (!infoCirc.classList.contains("info-circle-warning")) {
        infoCirc.classList.add("info-circle-warning");
      }

      if (key !== null) {
        this._uniqueKeys.add(key);
      }

    }

    info(message) {
      let groupEle = document.getElementById("info_circle_text_info");
      this._appendMsg(message, groupEle);
    }

    debug(message) {
      if ({{ utils.opt("debug") }}) {
        this.info(message);
      }
    }

    leech() {
      let groupEle = document.getElementById("info_circle_text_leech");
      this._appendMsg("", groupEle);
      let infoCirc = document.getElementById("info_circle");
      if (!infoCirc.classList.contains("info-circle-leech")) {
        infoCirc.classList.add("info-circle-leech");
      }
    }

    _appendMsg(message, groupEle, key=null) {
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
        msgEle.textContent = message;
      }
      groupEle.appendChild(msgEle);
    }

  }

  return JPMNLogger;
})();



/* global logger object for any javascript outside of modules that needs logging */
var LOGGER = nullish(LOGGER, new JPMNLogger());

/* TEMPORARY logger for legacy code to work */
//var logger = nullish(logger, new JPMNLogger("DEPRECATED"));


// on any javascript error: log it
window.onerror = function(msg, url, lineNo, columnNo, error) {
  LOGGER.errorStack(error.stack);
}

// https://stackoverflow.com/a/55178672
window.onunhandledrejection = function(errorEvent) {
  LOGGER.error("Javascript handler error: `" + errorEvent.reason + "`");
}


function optionsNotFound() {
  LOGGER.warn("Options file not found. Did you place the options file in the media directory?");
}


