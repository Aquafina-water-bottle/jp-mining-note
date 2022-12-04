





/// {% set functions %}

// =========================
//  Open Collapsible Fields
// ==========================

const JPMNOpenCollapsedFields = (() => {

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


  const logger = new JPMNLogger("open-collapsed-fields");
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
    const openFields = {{ utils.opt("modules", "open-collapsed-fields", "open") }};
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
    let tpID = "async open-collapsed-fields";
    TIME_PERFORMANCE.start(tpID);
    {% endif %}

    const openFields = {{ utils.opt("modules", "open-collapsed-fields", "open-on-new") }};
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


  class JPMNOpenCollapsedFields {
    constructor() {
      this.ankiconnectHelper = new JPMNAnkiConnectActions();
    }

    run() {
      openAlways();

      if ({{ utils.opt("modules", "open-collapsed-fields", "open-on-new-enabled") }}
          && {{ utils.opt("enable-ankiconnect-features") }}) {
        openOnNew(this.ankiconnectHelper);
      }
    }
  }


  return JPMNOpenCollapsedFields;

})();

/// {% endset %}






/// {% set run %}

if ({{ utils.opt("modules", "open-collapsed-fields", "enabled") }}) {
  const openOnNew = new JPMNOpenCollapsedFields();
  openOnNew.run();
}

/// {% endset %}

