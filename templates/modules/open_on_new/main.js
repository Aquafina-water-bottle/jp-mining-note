
/// {% set globals %}

// note that this cache will NOT respect card review undos,
// but that should be a niche enough case to not warrent caching.
// maps key -> bool
var isNewCardCache = nullish(isNewCardCache, {});

/// {% endset %}






/// {% set functions %}

// ===================
//  Open Field on New
// ===================

const JPMNOpenOnNew = (() => {

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

  const logger = new JPMNLogger("open-on-new");
  let openOnNewEnabled = false;

  async function openOnNew() {
    if (openOnNewEnabled) {
      logger.debug("Open On New is already enabled");
      return;
    }
    openOnNewEnabled = true;

    const openFields = {{ utils.opt("modules", "open-on-new", "open-fields") }};
    let openFieldsEle = [];

    // doesn't do anything if the element doesn't exist in the first place
    //if (extraInfoDetailsEle === null) {
    //  return;
    //}
    for (f of openFields) {
      if (f in strToEle && strToEle[f] !== null) {
        openFieldsEle.push([f, strToEle[f]]);
      } else {
        logger.debug(`${f} field not found.`);
      }
    }

    if (openFieldsEle.length === 0) {
      logger.debug(`openFieldsEle contains 0 elements. Nothing to do.`);
      return;
    }

    // cancels if not new
    // refreshes on every new check, b/c one cannot assume that a card
    // is no longer new once you see a new card
    // (editing a new card will consistently refresh the currently new card)
    const key = "{{ T('Key') }}";
    if (key in isNewCardCache && !isNewCardCache[key]) {
      logger.debug("Key in new card cache and is not new.");
      return;
    }

    // requires that any of PAGraphs and UtilityDictionaries be filled to even open extra info
    if (!'{{ utils.any_of_str("PAGraphs", "UtilityDictionaries") }}') {
      logger.debug("Neither PAGraphs nor UtilityDictionaries exists");
      return;
    }

    logger.debug("Testing for new card...");

    function constructFindCardAction(query) {
      return {
        "action": "findCards",
        "params": {
          "query": query,
        }
      }
    }

    // constructs the multi findCards request for ankiconnect
    let actions = [];
    const cardTypeName = '{{ NOTE_FILES("templates", note.card_type, "name").item() }}';
    actions.push(constructFindCardAction(`"Key:${key}" "card:${cardTypeName}"`));
    actions.push(constructFindCardAction(`is:new "Key:${key}" "card:${cardTypeName}"`));

    const multi = await invoke("multi", {"actions": actions});
    const cards = multi[0];

    if (cards.length > 1) {
      logger.warn("Duplicate key found.");
      return;
    }
    if (cards.length == 0) {
      logger.error("Cannot find its own card?");
      return;
    }

    const isNew = (multi[1].length > 0);
    isNewCardCache[key] = isNew;

    if (isNew) {
      logger.debug("Card is new, opening fields...");
      for ([f, ele] of openFieldsEle) {
        logger.debug(`Opening ${f} field...`);
        toggleDetailsTag(ele);
      }
    } else {
      logger.debug("Card is not new.");
    }
  }



  class JPMNOpenOnNew {
    constructor() { }

    async run() {
      openOnNew();
    }
  }


  return JPMNOpenOnNew;

})();

/// {% endset %}






/// {% set run %}

if ({{ utils.opt("modules", "open-on-new", "enabled") }}) {
  const open_on_new = new JPMNOpenOnNew()
  open_on_new.run();
}

/// {% endset %}

