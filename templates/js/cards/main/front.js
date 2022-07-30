/// {% extends "js/base.js" %}
/// {% from "js/cards/main/base.js" import process_sentences with context %}

/// {% block js_run %}
  {{ super() }}
  {{ process_sentences }}
/// {% endblock %}
