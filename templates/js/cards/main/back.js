/// {% extends "js/base_back.js" %}
/// {% from "js/cards/main/base.js" import process_sentences with context %}

/// {% block js_run %}
  {{ super() }}
  {{ process_sentences }}

  // make sure the sentence is already 'clicked'
  /// {% call IF("IsClickCard") %}
    hybridClick()
  /// {% endcall %}
/// {% endblock %}
