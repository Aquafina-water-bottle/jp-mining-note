/// {% set functions %}

// =================
//  Tooltip Builder
// =================

// A required internal class used by other modules. Not used directly.
const JPMNTooltipBuilder = (() => {

  const logger = new JPMNLogger("tooltip-builder");

  class JPMNTooltipBuilder {
    constructor(displayPA=true) {
      this.autoPA = typeof JPMNAutoPA !== "undefined" ? new JPMNAutoPA(/*attemptColor=*/false, /*logLevelDecrease=*/1) : null;
      this.displayPA = displayPA;
    }

    _buildWordDiv(wordReading, character) {

      const wordDivWrapper = document.createElement('div');

      const wordEle = document.createElement('span');
      const re = / ?([^ >]+?)\[(.+?)\]/g

      let wordReadingRuby = wordReading.replace(/&nbsp;/g, " ");
      wordReadingRuby = wordReadingRuby.replace(re, "<ruby><rb>$1</rb><rt>$2</rt></ruby>");

      if (character !== null) {
        wordReadingRuby = wordReadingRuby.replace(new RegExp(character, "g"), `<b>${character}</b>`);
      }

      wordEle.innerHTML = wordReadingRuby;
      wordEle.classList.add("hover-tooltip__word-div");

      wordDivWrapper.appendChild(wordEle);

      return wordDivWrapper;
    }

    // taken directly from anki's implementation of { {furigana:...} }
    // https://github.com/ankitects/anki/blob/main/rslib/src/template_filters.rs
    buildWordDiv(wordReading, positionsHTML, ajtHTML, paOverrideHTML, character) {

      const wordDiv = this._buildWordDiv(wordReading, character);

      if (this.displayPA && this.autoPA) {
        const displayEle = document.createElement("span");
        displayEle.classList.add("hover-tooltip__pitch-accent");
        this.autoPA.addPosition(positionsHTML, ajtHTML, paOverrideHTML, wordReading, displayEle)

        wordDiv.appendChild(displayEle)
      }

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

      const wordDiv = this.buildWordDiv(
        card["fields"]["WordReading"]["value"],
        card["fields"]["PAPositions"]["value"],
        card["fields"]["AJTWordPitch"]["value"],
        card["fields"]["PAOverride"]["value"],
        character);

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
