
// NOTE: This config is auto generated!
// It is recommend to generate the config instead of editing this directly
// to ensure everything works as expected.

// JPMN is short for JP Mining Note
var JPMNOpts = (function (my) {

  //var isMobile = function() {
  //  // TODO what about non-android?
  //  var UA = navigator.userAgent;
  //  var isAndroid = /Android/i.test(UA);
  //  return isAndroid;
  //}

  //// Example: ifMobile("A", "B") will return "A" if ran on a mobile device, and "B" if not.
  //var ifMobile = function(a, b) {
  //  return isMobile() ? a : b;
  //}

  my.settings =
{% filter indent(width=4) %}
{{ NOTE_OPTS }}
{% endfilter %}

  return my;
}(JPMNOpts || {}));

//export function createOptions() {
//  return JPMNOpts;
//}


