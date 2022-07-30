/// {% set process_sentences %}
  var sentences = document.querySelectorAll(".expression--sentence")
  var isAltDisplay = false;
  var isClozeDeletion = false;

  isAltDisplay = !!'{{ utils.any_of_str("AltDisplay") }}';

  if (sentences !== null) {
    for (var sent of sentences) {
      processSentence(sent, isAltDisplay);
    }
  }
/// {% endset %}



