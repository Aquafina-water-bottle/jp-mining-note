var logger = (function (my) {

  let _appendMsg = function(message, groupEle) {
    let msgEle = document.createElement('div');
    msgEle.classList.add("info-circle__message")
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
    var groupEle = document.getElementById("info_circle_text_error");
    _appendMsg(message, groupEle);
    var infoCirc = document.getElementById("info_circle");
    if (!infoCirc.classList.contains("info-circle-error")) {
      infoCirc.classList.add("info-circle-error")
    }
  }

  my.assert = function(condition, message) {
    if (!condition) {
      my.error("(assert) " + message);
    }
  }

  my.warn = function(message) {
    var groupEle = document.getElementById("info_circle_text_warning");
    _appendMsg(message, groupEle);
    var infoCirc = document.getElementById("info_circle");
    if (!infoCirc.classList.contains("info-circle-warning")) {
      infoCirc.classList.add("info-circle-warning")
    }
  }

  my.info = function(message) {
    var groupEle = document.getElementById("info_circle_text_info");
    _appendMsg(message, groupEle);
  }


  my.leech = function() {
    var groupEle = document.getElementById("info_circle_text_leech");
    _appendMsg("", groupEle);
    var infoCirc = document.getElementById("info_circle");
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


