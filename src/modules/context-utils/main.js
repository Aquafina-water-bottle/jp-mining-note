


/// {% set functions %}

// ===============
//  Context Utils
// ===============
// UNUSED MODULE! Shouldn't be compiled into any card.

const JPMNContextUtils = (() => {

  const logger = new JPMNLogger("context-utils");

  const fullSentEle = document.getElementById("hidden_sentence");
  const contextEle = document.getElementById("glossary_text_context");

  const regFindBold = /<b>(?<word>.+)<\/b>/;

  class JPMNContextUtils {
    constructor() { }

    run() {
      const result = fullSentEle.innerHTML.match(regFindBold)
      if (result) {
        // TODO better algorithm that doesn't bold all matches
        const foundWord = result.groups.word

        const wordInContext = RegExp(foundWord, "g");
        const foundWordBolded = `<b>${foundWord}</b>`;

        contextEle.innerHTML = contextEle.innerHTML.replace(wordInContext, foundWordBolded);
      }
    }
  }


  return JPMNContextUtils;

})();

/// {% endset %}






/// {% set run %}

if ({{ utils.opt("modules", "context-utils", "enabled") }}) {
  const contextUtils = new JPMNContextUtils()
  contextUtils.run();
}

/// {% endset %}

