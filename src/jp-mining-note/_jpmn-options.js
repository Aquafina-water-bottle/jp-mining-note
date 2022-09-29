// JPMN is short for JP Mining Note
var JPMNOpts = (function (my) {

  my.settings = {% filter indent(width=4) -%}
{{- NOTE_OPTS_JSON -}}
{%- endfilter %}
  return my;
}(JPMNOpts || {}));

