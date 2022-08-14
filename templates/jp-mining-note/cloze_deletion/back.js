/// {% extends "jp-mining-note/base_back.js" %}
/// {% import "jp-mining-note/cloze_deletion/common.js" as js_common with context %}



/// {% block js_functions %}
  {{ super() }}
  {{ js_common.functions }}
/// {% endblock %}


/// {% block js_keybind_settings %}
  {{ super() }}
  {{ js_common.keybind_settings }}
/// {% endblock %}


/// {% block js_run %}
  {{ super() }}
  {{ js_common.run }}
/// {% endblock %}
