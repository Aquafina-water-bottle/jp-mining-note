/// {% extends "js/base.js" %}
/// {% import "js/main/base.js" as js_main_base with context %}


/// {% block js_functions %}
  {{ super() }}
  {{ js_main_base.functions }}

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
  {{ js_main_base.keybind_settings }}
/// {% endblock %}


/// {% block js_run %}
  {{ super() }}
  {{ js_main_base.run }}

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
