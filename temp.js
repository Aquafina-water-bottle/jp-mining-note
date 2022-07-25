var logger = (function () {
  let my = {};

  let _appendMsg = function(message, groupEle) {
    var msgEle = document.createElement('div');
    msgEle.textContent = message;
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
}());


// on any javascript error: log it
window.onerror = function(msg, url, lineNo, columnNo, error) {
  logger.error("Javascript error: `" + msg + "`");
}


var injectScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = function(msg, url, lineNo, columnNo, error) {
      logger.error("Javascript error: `" + msg + "`");
      logger.error("B");
    }
    ;
    document.head.appendChild(script);
  });
};

(async () => {
  if (typeof JPMNOpts === 'undefined') {
    await injectScript('jp-mining-note-options.js');
  }
  if (typeof JPMNOpts === 'undefined') {
    logger.error("C");
  }
  logger.warn("A");
  var sentences = document.querySelectorAll(".expression--sentence")
  var isAltDisplay = false;
  if (sentences !== null) {
    for (var sent of sentences) {
      logger.warn("ASDF");
      logger.warn(settings.sentence("remove-line-breaks", true));
      processSentence(sent, isAltDisplay);
    }
  }
  //some code should be moved to here, but idk what exactly
})();

