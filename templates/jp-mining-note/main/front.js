/// {% extends "jp-mining-note/base.js" %}
/// {% import "jp-mining-note/main/common.js" as js_common with context %}


/// {% block js_functions %}
{{ super() }}
{{ js_common.functions }}

function toggleHighlightWord() {
  let paButton = document.getElementById("pa-button");
  let d = document.getElementById("display");

  if (paButton.innerText == "Show") {
    paButton.innerText = "Hide";
    d.classList.add("bold-yellow");
  } else {
    paButton.innerText = "Show";
    if (d.classList.contains("bold-yellow")) {
      d.classList.remove("bold-yellow");
    }
  }
}

/// {% endblock %}


/// {% block js_keybind_settings %}
{{ super() }}
{{ js_common.keybind_settings }}
/// {% endblock %}


/// {% block js_run %}

{{ super() }}
{{ js_common.run }}

/// {% call IF("PAShowInfo") %}
{
  let paButton = document.getElementById("pa-button");
  let d = document.getElementById("display");
  if (paButton !== null) {
    paButton.onclick = () => {
      if (paButton.innerText == "Show") {
        paButton.innerText = "Hide";
        d.classList.add("bold-yellow");
      } else {
        paButton.innerText = "Show";
        if (d.classList.contains("bold-yellow")) {
          d.classList.remove("bold-yellow");
        }
      }
    }
  }
}
/// {% endcall %}

/// {% endblock %}
