
/// {% set globals %}


// contains all unique keys
var uniqueKeysCache = nullish(uniqueKeysCache, []);

/// {% endset %}


/// {% set functions %}


const JPMNCheckDuplicateKey = (() => {
  const logger = new JPMNLogger("check-duplicate-keys");

  class JPMNCheckDuplicateKey {
    constructor() {
      this.ankiConnectHelper = new JPMNAnkiConnectActions();
    }

    async run() {

      const key = document.getElementById("hidden_key").innerHTML;

      if (uniqueKeysCache.includes(key)) {
        logger.debug("Key is unique (cached result).")
        return;
      }

      const keyText = key.replace('"', '\\"');
      const cardTypeName = '{{ NOTE_FILES("templates", note.card_type, "name").item() }}';
      const noteName = '{{ NOTE_FILES("model-name").item() }}';

      const query = `"Key:${keyText}" "card:${cardTypeName}" "note:${noteName}"`;
      const result = await this.ankiConnectHelper.query(query);

      if (result.length === 0) {
        logger.warn("Cannot find own card?")
      } else if (result.length === 1) {
        uniqueKeysCache.push(key);
        logger.debug("Key is unique.")
      } else if (result.length === 2) {
        logger.warn("Duplicate key found. Please change the Key field value.")
      }


    }
  }

  return JPMNCheckDuplicateKey;

})();


/// {% endset %}







/// {% set run %}

if ({{ utils.opt("modules", "check-duplicate-key", "enabled") }}
    && {{ utils.opt("enable-ankiconnect-features") }}) {
  let checkDupeKey = new JPMNCheckDuplicateKey();
  checkDupeKey.run();
}

/// {% endset %}

