



/// {% set run %}

if ({{ utils.opt("modules", "fix-ruby-positioning", "enabled") }}) {
  // module not big enough to require a class

  const className = "fix-ruby-positioning";
  const defHeader = document.getElementById("def_header");
  if (defHeader !== null) {
    defHeader.classList.add(className);
  }

  const expressions = document.querySelectorAll(".expression");
  if (expressions !== null) {
    for (const e of expressions) {
      e.classList.add(className);
    }
  }

}

/// {% endset %}

