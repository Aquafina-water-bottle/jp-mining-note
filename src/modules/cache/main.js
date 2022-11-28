
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
    const x = document.getElementById("hidden_svg_settings_clear_cache")
    let result = x.children[0].cloneNode(true);
    return result;
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






