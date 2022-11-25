



/// {% set run %}

if ({{ utils.opt("modules", "fix-ruby-positioning", "enabled") }}) {
  // module not big enough to require a class

  const className = "fix-ruby-positioning";

  function addClassToEle(id) {
    const ele = document.getElementById(id);
    if (ele !== null) {
      ele.classList.toggle(className, true);
    }
  }

  addClassToEle("def_header");
  addClassToEle("full_sentence");
  addClassToEle("full_sentence_front");

  const expressions = document.querySelectorAll(".expression");
  if (expressions !== null) {
    for (const e of expressions) {
      e.classList.add(className);
    }
  }

}

/// {% endset %}

