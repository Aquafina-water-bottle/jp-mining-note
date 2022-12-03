/// {% extends "jp-mining-note/base.js" %}
/// {% import "jp-mining-note/main/js/common.js" as js_common with context %}


/// {% block js_functions %}
{{ super() }}
{{ js_common.functions }}

function toggleHighlightWord() {
  const SENTENCE_SHOWN_ATTRIBUTE = "data-sentence-shown";

  let paButton = document.getElementById("pa_button");
  let d = document.getElementById("display");

  if (paButton.hasAttribute(SENTENCE_SHOWN_ATTRIBUTE)) {
    // (currently) shown -> hide
    paButton.removeAttribute(SENTENCE_SHOWN_ATTRIBUTE);
    paButton.innerText = "{{ TRANSLATOR.get('show-word-button') }}";
    d.classList.remove("highlight-bold", false);
  } else {
    // (currently) hidden -> show
    paButton.setAttribute(SENTENCE_SHOWN_ATTRIBUTE, "true");
    paButton.innerText = "{{ TRANSLATOR.get('hide-word-button') }}";
    d.classList.toggle("highlight-bold", true);
  }
}

/// {% endblock %}



/// {% block js_run %}

{{ super() }}
{{ js_common.run }}

/// {% call IF("PAShowInfo") %}
{
  let paButton = document.getElementById("pa_button");
  if (paButton !== null) {
    paButton.onclick = toggleHighlightWord;
  }
}

{ // auto-plays silence
  let elem = document.querySelector("#pa_silence_audio .soundLink, #pa_silence_audio .replaybutton");
  if (elem) {
    elem.click();
  }
}

/// {% endcall %}


/// {% endblock %}
