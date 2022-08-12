/// {% extends "cards/base.js" %}
/// {% import "cards/main/common.js" as js_common with context %}


/// {% block js_functions %}
  {{ super() }}
  {{ js_common.functions }}

  function toggleHighlightWord() {
    var paButton = document.getElementById("pa-button");
    var d = document.getElementById("Display");

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
  var paButton = document.getElementById("pa-button");
  var d = document.getElementById("Display");
  if (paButton !== null) {
    //paButton.oncontextmenu = oncontextmenu = (event) => {
    //  event.preventDefault();
    //};
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
  /// {% endcall %}

/// {% endblock %}
