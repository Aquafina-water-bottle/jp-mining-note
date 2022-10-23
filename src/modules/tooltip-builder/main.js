/// {% set functions %}

// =================
//  Tooltip Builder
// =================

// A required internal class used by other modules. Not used directly.
const JPMNTooltipBuilder = (() => {
  class JPMNTooltipBuilder {
    constructor() {}

    // taken directly from anki's implementation of { {furigana:...} }
    // https://github.com/ankitects/anki/blob/main/rslib/src/template_filters.rs
    buildWordDiv(wordReading, character) {

      const wordDiv = document.createElement('div');
      const re = / ?([^ >]+?)\[(.+?)\]/g

      let wordReadingRuby = wordReading.replace(/&nbsp;/g, " ");
      wordReadingRuby = wordReadingRuby.replace(re, "<ruby><rb>$1</rb><rt>$2</rt></ruby>");

      if (character !== null) {
        wordReadingRuby = wordReadingRuby.replace(new RegExp(character, "g"), `<b>${character}</b>`);
      }

      wordDiv.innerHTML = wordReadingRuby;
      return wordDiv;
    }

    buildSentDiv(sentence) {
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

    buildCardDiv(card, character, isNew=false) {
      const cardDiv = document.createElement('div');
      const wordDiv = this.buildWordDiv(card["fields"]["WordReading"]["value"], character);
      const sentenceDiv = this.buildSentDiv(card["fields"]["Sentence"]["value"]);

      cardDiv.appendChild(wordDiv);
      cardDiv.appendChild(sentenceDiv);

      if (isNew) {
        cardDiv.classList.add("hover-tooltip--new");
      }

      return cardDiv;
    }

    //buildCardDiv(card, character, isNew=false) {
    //  return _buildCardDiv(card, character, isNew);
    //}
  }


  return JPMNTooltipBuilder;

})();

/// {% endset %}
