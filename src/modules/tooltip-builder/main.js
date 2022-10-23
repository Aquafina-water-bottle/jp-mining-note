/// {% set functions %}

// =================
//  Tooltip Builder
// =================

// A required internal class used by other modules. Not used directly.
const JPMNTooltipBuilder = (() => {
  // taken directly from anki's implementation of { {furigana:...} }
  // https://github.com/ankitects/anki/blob/main/rslib/src/template_filters.rs
  function buildWordDiv(character, wordReading) {

    const wordDiv = document.createElement('div');
    const re = / ?([^ >]+?)\[(.+?)\]/g

    //let wordReadingRuby = wordReading.replaceAll("&nbsp;", " ");
    let wordReadingRuby = wordReading.replace(/&nbsp;/g, " ");
    wordReadingRuby = wordReadingRuby.replace(re, "<ruby><rb>$1</rb><rt>$2</rt></ruby>");
    //wordReadingRuby = wordReadingRuby.replaceAll(character, `<b>${character}</b>`);
    wordReadingRuby = wordReadingRuby.replace(new RegExp(character, "g"), `<b>${character}</b>`);

    wordDiv.innerHTML = wordReadingRuby;
    return wordDiv;
  }

  function buildSentDiv(sentence) {
    const sentenceSpan = document.createElement('span');

    let resultSent = sentence;
    //resultSent = resultSent.replaceAll("<b>", "");
    //resultSent = resultSent.replaceAll("</b>", "");
    resultSent = resultSent.replace(/<b>/g, "");
    resultSent = resultSent.replace(/<\/b>/g, "");
    sentenceSpan.innerHTML = resultSent;

    const openQuote = document.createElement('span');
    openQuote.innerText = "「";
    const closeQuote = document.createElement('span');
    closeQuote.innerText = "」";


    const sentenceDiv = document.createElement('div');
    sentenceDiv.classList.add("left-align-quote");

    sentenceDiv.appendChild(openQuote);
    sentenceDiv.appendChild(sentenceSpan);
    sentenceDiv.appendChild(closeQuote);

    return sentenceDiv;
  }

  function _buildCardDiv(character, card, isNew=false) {
    const cardDiv = document.createElement('div');
    const wordDiv = buildWordDiv(character, card["fields"]["WordReading"]["value"]);
    const sentenceDiv = buildSentDiv(card["fields"]["Sentence"]["value"]);

    cardDiv.appendChild(wordDiv);
    cardDiv.appendChild(sentenceDiv);

    if (isNew) {
      cardDiv.classList.add("kanji-hover-tooltip--new");
    }

    return cardDiv;
  }

  class JPMNTooltipBuilder {
    constructor() {}

    buildCardDiv(character, card, isNew=false) {
      return _buildCardDiv(character, card, isNew);
    }
  }


  return JPMNTooltipBuilder;

})();

/// {% endset %}
