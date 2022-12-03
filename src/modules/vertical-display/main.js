

/// {% set run %}

if ({{ utils.opt("modules", "vertical-display", "enabled") }}) {

  let addClasses = [];

  /// {% if note.side == "front" %}
  if ({{ utils.opt("modules", "vertical-display", "front-enabled") }}) {
    addClasses.push("card-wrapper--vertical-display");
  }
  /// {% endif %}

  /// {% if note.side == "back" %}
  if ({{ utils.opt("modules", "vertical-display", "back-enabled") }}) {
    addClasses.push("card-wrapper--vertical-display");

    if ({{ utils.opt("modules", "vertical-display", "back-toggle-enabled") }}) {
      addClasses.push("card-wrapper--vertical-display-toggle");
    }
  }
  /// {% endif %}

  if (addClasses.length > 0) {
    const ele = document.getElementById("card_wrapper");
    for (const c of addClasses) {
      ele.classList.toggle(c, true);
    }
  }

}

/// {% endset %}

