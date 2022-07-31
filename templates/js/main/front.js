/// {% extends "js/base.js" %}
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
/// {% endblock %}
