var logger = (function (my) {
  let uniqueKeys = new Set();

  let _appendMsg = function(message, groupEle, key=null) {
    // I think this stops an infinite loop somewhere if you log a null for some reason...
    if (message === null) {
      message = "null";
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

  my.error = function(message) {
    let groupEle = document.getElementById("info_circle_text_error");
    _appendMsg(message, groupEle);
    let infoCirc = document.getElementById("info_circle");
    if (!infoCirc.classList.contains("info-circle-error")) {
      infoCirc.classList.add("info-circle-error")
    }
  }

  my.assert = function(condition, message) {
    if (!condition) {
      my.error("(assert) " + message);
    }
  }

  my.removeWarn = function(key) {
    // assumes that this is a unique warn message

    if (!uniqueKeys.has(key)) {
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

    uniqueKeys.delete(key);
  }

  // key defaults to the message if unique is true and key is null
  // key is ignored if unique == false
  my.warn = function(message, unique=true, key=null) {

    // skips any non-unique warns as defined by the key
    if (unique) {
      if (key === null) {
        key = message;
      }

      if (uniqueKeys.has(key)) {
        return;
      }
    }

    let groupEle = document.getElementById("info_circle_text_warning");
    _appendMsg(message, groupEle, key);
    let infoCirc = document.getElementById("info_circle");
    if (!infoCirc.classList.contains("info-circle-warning")) {
      infoCirc.classList.add("info-circle-warning")
    }

    if (key !== null) {
      uniqueKeys.add(key);
    }

  }

  my.info = function(message) {
    let groupEle = document.getElementById("info_circle_text_info");
    _appendMsg(message, groupEle);
  }


  my.leech = function() {
    let groupEle = document.getElementById("info_circle_text_leech");
    _appendMsg("", groupEle);
    let infoCirc = document.getElementById("info_circle");
    if (!infoCirc.classList.contains("info-circle-leech")) {
      infoCirc.classList.add("info-circle-leech")
    }
  }

  return my;
}(logger || {}));



// on any javascript error: log it
window.onerror = function(msg, url, lineNo, columnNo, error) {
//window.onerror = function(msg) {
  //logger.error("Javascript error: `" + msg + "`" + "\n" + error.stack);
  let stackList = error.stack.split(" at ");
  for (let i = 1; i < stackList.length; i++) {
    stackList[i] = ">>> " + stackList[i];
  }
  logger.error(stackList);
}

// https://stackoverflow.com/a/55178672
window.onunhandledrejection = function(errorEvent) {
  logger.error("Javascript handler error: `" + errorEvent.reason + "`");
}


function optionsNotFound() {
  logger.warn("Options file not found. Did you place the options file in the media directory?");
}


