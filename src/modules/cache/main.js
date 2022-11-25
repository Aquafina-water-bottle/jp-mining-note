
/// {% set globals %}

// it seems like that this stores objects properly compared to Persistence
var _JPMN_CACHE_GLOBAL = nullish(_JPMN_CACHE_GLOBAL, {});

/// {% endset %}






/// {% set functions %}

// =======
//  Cache
// =======
// Wrapper around a global variable

const JPMNCache = (() => {

  const logger = new JPMNLogger("cache");

  function generateClearCacheSVG() {
    const svgStr = '<svg id="settings_clear_cache" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3H9M7 6h10v13H7V6m2 2v9h2V8H9m4 0v9h2V8h-2Z"/><title>Clear the cache</title></svg>';

    const x = document.createElement("span");
    x.innerHTML = svgStr;
    return x.children[0];
  }


  class JPMNCache {
    constructor() {
      if ({{ utils.opt("modules", "cache", "clear-cache-button") }}) {
        this._addClearCacheSetting();
      }
    }

    _addClearCacheSetting() {
      const infoCircleSettings = document.getElementById("info_circle_text_settings");

      // visual interface to clear the cache
      let settingsClearCache = generateClearCacheSVG();
      infoCircleSettings.appendChild(settingsClearCache);

      settingsClearCache.onclick = function() {
        if (typeof CACHE !== "undefined") {
          CACHE.clear();
          popupMenuMessage("Cache has been cleared.");
        }
      }

    }

    _keyName(dictKey, key) {
      // somewhat ensures a unique name to the Persistence key,
      // in case others are using Persistence

      return `JPMN_KEY.${dictKey}.${key}`;
    }

    set(dictKey, key, value) {
      const persistKey = this._keyName(dictKey, key);
      logger.debug(`Setting ${persistKey}...`, 0);
      _JPMN_CACHE_GLOBAL[persistKey] = value;
    }

    has(dictKey, key) {
      const persistKey = this._keyName(dictKey, key);
      logger.debug(`Testing ${persistKey}...`, 0);
      return (persistKey in _JPMN_CACHE_GLOBAL);
    }

    get(dictKey, key) {
      const persistKey = this._keyName(dictKey, key);
      logger.debug(`Getting ${persistKey}...`, 0);

      if (persistKey in _JPMN_CACHE_GLOBAL) {
        return _JPMN_CACHE_GLOBAL[persistKey];
      }
      return null;

    }

    clear() {
      logger.debug(`Clearing cache...`, 0);
      for (const key of Object.keys(_JPMN_CACHE_GLOBAL)) {
        delete _JPMN_CACHE_GLOBAL[key];
      }
    }

    remove(dictKey, key) {
      const persistKey = this._keyName(dictKey, key);

      logger.debug(`Removing key: ${persistKey}...`, 0);
      delete _JPMN_CACHE_GLOBAL[persistKey];
    }

  }

  return JPMNCache;

})();
let CACHE = new JPMNCache();

/// {% endset %}






