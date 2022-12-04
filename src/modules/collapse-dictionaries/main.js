





/// {% set functions %}

// ==============================
//  Configure Collapsible Fields
// ==============================

const JPMNCollapseDictionaries = (() => {

  // placed outside due to anki's async weirdness
  //const primaryDefinitionDetailsEle = document.getElementById("primary_definition_details");
  const secondaryDefinitionDetailsEle = document.getElementById("secondary_definition_details");
  //const additionalNotesDetailsEle = document.getElementById("additional_notes_details");
  const extraDefinitionsDetailsEle = document.getElementById("extra_definitions_details");
  //const extraInfoDetailsEle = document.getElementById("extra_info_details");

  const strToEle = {
    //"Primary Definition": primaryDefinitionDetailsEle,
    "Secondary Definition": secondaryDefinitionDetailsEle,
    //"Additional Notes": additionalNotesDetailsEle,
    "Extra Definitions": extraDefinitionsDetailsEle,
    //"Extra Info": extraInfoDetailsEle,
  }


  const COLLAPSIBLE_OPEN = "collapsible-open"
  const COLLAPSIBLE_CLOSED = "collapsible-closed"
  const NOT_COLLAPSIBLE = "none"


  const logger = new JPMNLogger("collapsible-field-utils");

  // to not query the util.opt for each dictionary
  function generateOpts(fName) {
    let _max = -1;
    let _defaultMode = "";

    if (fName === "Secondary Definition") {
      _max = {{ utils.opt("modules", "collapse-dictionaries",
          "collapse-after-max-number", "secondary-definition") }};
      _defaultMode = {{ utils.opt("modules", "collapse-dictionaries",
          "default-mode", "secondary-definition") }};
    } else {
      _max = {{ utils.opt("modules", "collapse-dictionaries",
          "collapse-after-max-number", "extra-definitions") }};
      _defaultMode = {{ utils.opt("modules", "collapse-dictionaries",
          "default-mode", "extra-definitions") }};
    }

    return {
      max: _max,
      defaultMode: _defaultMode,

      alwaysCollapsibleOpen: {{ utils.opt("modules", "collapse-dictionaries",
          "dictionary-options", "always-collapsible-open") }},

      alwaysCollapsibleClosed: {{ utils.opt("modules", "collapse-dictionaries",
          "dictionary-options", "always-collapsible-closed") }},

      dictsNoTransform: {{ utils.opt("modules", "collapse-dictionaries",
          "dictionary-options", "never-collapsible") }},

      dictsOnlyName: {{ utils.opt("modules", "collapse-dictionaries",
          "dictionary-options", "only-display-dictionary-name") }},

    }
  }

  //function dictShouldTransform(dictName, opts) {
  //  if (opts.dictsNoTransform.includes(dictName)) {
  //    return false;
  //  }
  //
  //  // these 2 options override the default
  //  const collapseDict = opts.alwaysCollapsibleOpen.includes(dictName);
  //  const openDict = opts.alwaysCollapsibleClosed.includes(dictName);
  //
  //  const doNotTransformDefault = (opts.max === -2);
  //  const doNotTransform = doNotTransformDefault && !(collapseDict || openDict);
  //  return !doNotTransform;
  //}


  // returns: COLLAPSIBLE_OPEN, COLLAPSIBLE_CLOSED, NOT_COLLAPSIBLE
  function getDictMode(dictName, i, opts) {
    if (opts.dictsNoTransform.includes(dictName)) {
      return NOT_COLLAPSIBLE;
    }
    if (opts.alwaysCollapsibleClosed.includes(dictName)) {
      return COLLAPSIBLE_CLOSED;
    }
    if (opts.alwaysCollapsibleOpen.includes(dictName)) {
      return COLLAPSIBLE_OPEN;
    }

    if (opts.max !== -1 && i >= opts.max) {
      return COLLAPSIBLE_CLOSED;
    }

    // falls back to default
    if (![COLLAPSIBLE_OPEN, COLLAPSIBLE_CLOSED, NOT_COLLAPSIBLE].includes(opts.defaultMode)) {
      logger.warn(`Invalid default mode ${opts.defaultMode}. Using ${COLLAPSIBLE_OPEN}...`)
      return COLLAPSIBLE_OPEN;
    }
    return opts.defaultMode;

  }

  //function dictShouldBeOpen(dictName, i, opts) {
  //  const collapseMax = (opts.max !== -1 && i >= opts.max);
  //  const collapseDict = opts.alwaysCollapsibleOpen.includes(dictName);
  //  const openDict = opts.alwaysCollapsibleClosed.includes(dictName);

  //  const shouldCollapse = ((collapseMax || collapseDict) && !openDict);
  //  return !shouldCollapse;
  //}

  function changetoCollapsedDict(ele, dictName, isOpen, useName) {
    /*
     * <li data-details"..."> ... </li>
     *
     * to
     *
     * <li data-details"...">
     *   <details class="glossary-text__details">
     *     <summary>dictionary name</summary>
     *     <div class="glossary-text__details-div"> ... </div>
     *   </details>
     * </li>
     *
     */

    // additional pre-processing to see if we can indeed use the first line
    // checks if newlines are in the first line (shouldn't happen unless it's a glitch!)
    const firstLineEle = ele.querySelector("span.dict-group__glossary--first-line");
    const dictTag = ele.querySelector("span.dict-group__tag-list");
    if (dictTag === null) {
      logger.debug(`dictionary tag ele is null for ${dictName}`, 2);
      useName = true;

    } else if (firstLineEle === null) {
      logger.debug(`first line ele is null for ${dictName}`, 2);
      useName = true;

    } else if (firstLineEle.innerHTML.includes("<br>")) {
      logger.debug(`incorrectly formatted dictionary: ${dictName}`, 5)
      useName = true;
    }
    //} else {
    //  const glossaryEle = ele.querySelector("span.dict-group__glossary");
    //  if (glossaryEle.childNodes.length === 1) { // assumes firstLineEle !== null
    //    // there is nothing to collapse, it is already one line!
    //    logger.debug(`ignoring only one line ${dictName}`, 2);
    //    return
    //  }
    //}


    const detailsEle = document.createElement("details");
    const summaryEle = document.createElement("summary");
    const divEle = document.createElement("div");
    summaryEle.classList.toggle("glossary-text__summary", true);
    detailsEle.classList.toggle("glossary-text__details", true);
    divEle.classList.toggle("glossary-text__details-div", true);

    if (isOpen) {
      detailsEle.setAttribute("open", "true");
    }

    if (useName) {
      summaryEle.innerText = `(${dictName})`;
    } else {
      summaryEle.appendChild(dictTag);
      summaryEle.appendChild(firstLineEle);
    }

    for (let i = ele.childNodes.length-1; i >= 0; i--) {
      let child = ele.childNodes[i];
      divEle.prepend(child);
    }

    detailsEle.append(summaryEle);
    detailsEle.append(divEle);
    ele.appendChild(detailsEle);
  }


  function collapseDictionaries() {
    const affectedFields = ["Secondary Definition", "Extra Definitions"];


    for (const fStr of affectedFields) {
      const opts = generateOpts(fStr);

      const ele = strToEle[fStr];
      if (ele === null) {
        continue;
      }

      const olList = ele.getElementsByTagName("ol")
      for (olEle of olList) {
        for (const [i, child] of Array.from(olEle.children).entries()) {
          if (child.tagName === "LI" && child.hasAttribute("data-details")) {
            const dictName = child.getAttribute("data-details");

            //if (dictName !== null && dictShouldTransform(dictName, opts)) {
            //  const isOpen = dictShouldBeOpen(dictName, i, opts)
            //  const useName = opts.dictsOnlyName.includes(dictName);
            //  logger.debug(`Collapsing ${dictName} in ${fStr} (open: ${isOpen})`, 2)
            //  changetoCollapsedDict(child, dictName, isOpen, useName);
            //}

            if (dictName !== null) {
              const dictMode = getDictMode(dictName, i, opts);
              if (dictMode === NOT_COLLAPSIBLE) {
                continue
              }

              const isOpen = (dictMode === COLLAPSIBLE_OPEN)
              const useName = opts.dictsOnlyName.includes(dictName);
              logger.debug(`Collapsing ${dictName} in ${fStr} (open: ${isOpen})`, 2)

              changetoCollapsedDict(child, dictName, isOpen, useName);
            }

          }
        }
      }
    }
  }



  class JPMNCollapseDictionaries {
    constructor() {
      this.ankiconnectHelper = new JPMNAnkiConnectActions();
    }

    run() {
      collapseDictionaries();
    }
  }


  return JPMNCollapseDictionaries;

})();

/// {% endset %}






/// {% set run %}

if ({{ utils.opt("modules", "collapse-dictionaries", "enabled") }}) {
  const collapseDicts = new JPMNCollapseDictionaries();
  collapseDicts.run();
}

/// {% endset %}

