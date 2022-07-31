/// {% extends "js/base_back.js" %}
/// {% import "js/main/base.js" as js_main_base with context %}


/// {% block js_functions %}
  {{ super() }}
  {{ js_main_base.functions }}
/// {% endblock %}


/// {% block js_keybind_settings %}
  {{ super() }}
  {{ js_main_base.keybind_settings }}
/// {% endblock %}


/// {% block js_run %}
  {{ super() }}
  {{ js_main_base.run }}

  // make sure the sentence is already 'clicked'
  /// {% call IF("IsClickCard") %}
    hybridClick()
  /// {% endcall %}

  // removes extra info section if not necessary
  var ele = document.querySelector(".pa-graphs");
  if (ele !== null && ele.innerText.trim() === "No pitch accent data" &&
      !"{{ utils.any_of_str('UtilityDictionaries') }}") {
    document.getElementById("extra_info_details").style.display = "none";
  }

/// {% endblock %}
