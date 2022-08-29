/// {% set functions %}

/// {% endset %}


/// {% set keybind_settings %}

/// {% endset %}




/// {% set run %}
{
  let isAltDisplay = false;
  /* {% call IF('AltDisplay') %} */
    isAltDisplay = false;
  /* {% endcall %} */

  processSentences(isAltDisplay, true);
}

/// {% endset %}







