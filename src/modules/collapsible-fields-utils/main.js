





/// {% set functions %}

// ==============================
//  Configure Collapsible Fields
// ==============================

const JPMNCollapsibleFields = (() => {

  // placed outside due to anki's async weirdness
  const primaryDefinitionDetailsEle = document.getElementById("primary_definition_details");
  const secondaryDefinitionDetailsEle = document.getElementById("secondary_definition_details");
  const additionalNotesDetailsEle = document.getElementById("additional_notes_details");
  const extraDefinitionsDetailsEle = document.getElementById("extra_definitions_details");
  const extraInfoDetailsEle = document.getElementById("extra_info_details");

  const strToEle = {
    "Primary Definition": primaryDefinitionDetailsEle,
    "Secondary Definition": secondaryDefinitionDetailsEle,
    "Additional Notes": additionalNotesDetailsEle,
    "Extra Definitions": extraDefinitionsDetailsEle,
    "Extra Info": extraInfoDetailsEle,
  }

  const collapsedFieldsInfo = ({{ utils.opt("modules", "collapsible-fields-utils", "collapse-dictionaries", "fields") }});
  const useFirstLine = ({{ utils.opt("modules", "collapsible-fields-utils", "collapse-dictionaries", "use-first-line") }});



  const logger = new JPMNLogger("collapsible-field-utils");
  let openOnNewEnabled = false;

  function openDetailsTag(ele) {
    ele.setAttribute("open", "true");
  }

  function getFieldEles(fields) {
    let fieldsEle = [];

    // doesn't do anything if the element doesn't exist in the first place
    for (f of fields) {
      if (f in strToEle && strToEle[f] !== null) {
        fieldsEle.push([f, strToEle[f]]);
      } else {
        logger.debug(`${f} field not found.`);
      }
    }

    return fieldsEle;

  }

  function openAlways() {
    const openFields = {{ utils.opt("modules", "collapsible-fields-utils", "open") }};
    let openFieldsEle = getFieldEles(openFields);

    for ([f, ele] of openFieldsEle) {
      logger.debug(`Opening ${f} field (always opened)...`);
      openDetailsTag(ele);
    }
  }

  async function openOnNew(ankiconnectHelper) {

    if (openOnNewEnabled) {
      logger.debug("Open On New is already enabled");
      return;
    }
    openOnNewEnabled = true;

    {% if "time-performance" in modules.keys() %}
    let tpID = "async collapsible-fields-utils";
    TIME_PERFORMANCE.start(tpID);
    {% endif %}

    const openFields = {{ utils.opt("modules", "collapsible-fields-utils", "open-on-new") }};
    let openFieldsEle = getFieldEles(openFields);

    if (openFieldsEle.length === 0) {
      logger.debug(`openFieldsEle contains 0 elements. Nothing to do.`);
      return [];
    }

    if (openFieldsEle.length === 0) {
      logger.debug(`openFieldsEle contains 0 elements. Nothing to do.`);
      return;
    }

    const isNew = await ankiconnectHelper.cardIsNew();

    if (isNew) {
      logger.debug("Card is new, opening fields...");
      for ([f, ele] of openFieldsEle) {
        logger.debug(`Opening ${f} field...`);
        openDetailsTag(ele);
      }
    } else {
      logger.debug("Card is not new.");
    }

    {% if "time-performance" in modules.keys() %}
    TIME_PERFORMANCE.stop(tpID, true);
    TIME_PERFORMANCE.reset(tpID);
    {% endif %}

  }


  function dictShouldBeCollapsed(field, dictName, i) {
    const info = collapsedFieldsInfo[field];
    const max = info["collapse-after-max-number"];
    const collapseDictList = info["collapse-specific-dictionaries"];
    const ignoreDictList = info["do-not-collapse-specific-dictionaries"];

    const collapseMax = (max !== -1 && i >= max);
    const collapseDict = collapseDictList.includes(dictName);
    const ignoreDict = ignoreDictList.includes(dictName);

    return ((collapseMax || collapseDict) && !ignoreDict);
  }

  function changetoCollapsedDict(ele) {
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


    const detailsEle = document.createElement("details");
    const summaryEle = document.createElement("summary");
    const divEle = document.createElement("div");
    summaryEle.classList.toggle("glossary-text__summary", true);
    detailsEle.classList.toggle("glossary-text__details", true);
    divEle.classList.toggle("glossary-text__details-div", true);


    if (useFirstLine) {
      const dictTag = ele.querySelector("span.dict-group__tag-list");
      const firstLineEle = ele.querySelector("span.dict-group__glossary--first-line");
      if (dictTag !== null) {
        summaryEle.appendChild(dictTag);
      }
      if (firstLineEle !== null) {
        summaryEle.appendChild(firstLineEle);
      }
    } else {
      summaryEle.innerText = ele.getAttribute("data-details");
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
      const ele = strToEle[fStr];
      if (ele === null) {
        continue;
      }
      const olList = ele.getElementsByTagName("ol")
      for (olEle of olList) {
        for (const [i, child] of Array.from(olEle.children).entries()) {
          if (child.tagName === "LI" && child.hasAttribute("data-details")) {
            const dictName = child.getAttribute("data-details");
            if (dictShouldBeCollapsed(fStr, dictName, i)) {
              logger.debug(`Collapsing ${dictName} in ${fStr}...`)
              changetoCollapsedDict(child);
            }
          }
        }
      }
    }
  }



  class JPMNCollapsibleFields {
    constructor() {
      this.ankiconnectHelper = new JPMNAnkiConnectActions();
    }

    run() {
      openAlways();
      if ({{ utils.opt("modules", "collapsible-fields-utils", "collapse-dictionaries", "enabled") }}) {
        collapseDictionaries();
      }

      if ({{ utils.opt("modules", "collapsible-fields-utils", "open-on-new-enabled") }}
          && {{ utils.opt("enable-ankiconnect-features") }}) {
        openOnNew(this.ankiconnectHelper);
      }
    }
  }


  return JPMNCollapsibleFields;

})();

/// {% endset %}






/// {% set run %}

if ({{ utils.opt("modules", "collapsible-fields-utils", "enabled") }}) {
  const open_on_new = new JPMNCollapsibleFields()
  open_on_new.run();
}

/// {% endset %}

