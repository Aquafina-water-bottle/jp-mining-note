
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

  class JPMNCache {
    constructor() { }

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
  }

  return JPMNCache;

})();
let CACHE = new JPMNCache();

/// {% endset %}






