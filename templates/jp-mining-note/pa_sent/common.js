/// {% set functions %}

/// {% endset %}


/// {% set keybind_settings %}

/// {% endset %}




/// {% set run %}

//var sentences = document.querySelectorAll(".expression--sentence")
//var isAltDisplay = false;
//var isClozeDeletion = false;

//isAltDisplay = !!'{{ utils.any_of_str("AltDisplay") }}';

var isAltDisplay = false;
/* {% call IF('AltDisplayPASentenceCard') %} */
  isAltDisplay = true;
/* {% endcall %} */

/* {% call IFNOT('AltDisplayPASentenceCard') %} */
  /* {% call IF('AltDisplay') %} */
  isAltDisplay = (
    /* {% call utils.none_of('IsClickCard', 'IsHoverCard', 'IsSentenceCard', 'IsTargetedSentenceCard') %} */
      false &&
    /* {% endcall %} */
    true ? true : false
  );
  /* {% endcall %} */

  /* {% call IFNOT('AltDisplay') %} */
    isAltDisplay = false;
  /* {% endcall %} */
/* {% endcall %} */

processSentences(isAltDisplay);


/// {% endset %}







