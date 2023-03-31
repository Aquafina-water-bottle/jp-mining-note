

/// {% set functions %}


const JPMNCheckDuplicateKey = (() => {
  const logger = new JPMNLogger("check-duplicate-keys");
  const key = document.getElementById("hidden_key").innerHTML;

  class JPMNCheckDuplicateKey {
    constructor() {
      this.ankiConnectHelper = new JPMNAnkiConnectActions();
    }

    async run() {

      //if (uniqueKeysCache.includes(key)) {
      if (CACHE.has("uniqueKeysCache", key)) {
        logger.debug("Key is unique (cached result).")
        return;
      }

      const keyText = this.ankiConnectHelper.escapeStr(key);
      const cardTypeName = '{{ NOTE_DATA("templates", note.card_type, "name").item() }}';
      const noteName = '{{ NOTE_DATA("model-name").item() }}';

      const query = `"Key:${keyText}" "card:${cardTypeName}" "note:${noteName}"`;
      const result = await this.ankiConnectHelper.query(query, /*cache=*/false);

      if (result.length === 0) {
        logger.warn("Cannot find own card?")
      } else if (result.length === 1) {
        CACHE.set("uniqueKeysCache", key, true);
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
  let delay = 1000;

  setTimeout(() => {
    checkDupeKey.run();
  }, delay);
}

/// {% endset %}

