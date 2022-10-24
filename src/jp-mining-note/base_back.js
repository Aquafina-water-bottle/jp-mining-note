/// {% extends "jp-mining-note/base.js" %}

/// {% block js_functions %}
{{ super() }}
/// {% endblock %}





/// {% block js_run %}
{{ super() }}

// checks leech
const tagsEle = document.getElementById("tags");
const tags = tagsEle.innerHTML.split(" ");
if (tags.includes("leech")) {
  LOGGER.leech();
}


/// {% call IFNOT("SentenceReading") %}
if ({{ utils.opt("no-sentence-reading-warn") }}) {
  LOGGER.warn("`SentenceReading` is not filled out. Using `Sentence` field instead.");
}
/// {% endcall %}


// removes greyed out fields if they should be hidden
if ( !{{ utils.opt("greyed-out-collapsable-fields-when-empty") }}) {
  const elems = document.getElementsByClassName("glossary-details--grey");
  for (const x of elems) {
    x.style.display = "none";
  }
}


/// {% endblock %}
