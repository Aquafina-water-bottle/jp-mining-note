/*
 * select persist
 * Internal implemenetation of Anki Persist that allows selection of the default mode.
 * If this were to be made more public facing, it might be best to change the
 * method names to be the exact same as the original...
 */

//import { LOGGER } from './logger';

export type SPersistType = 'window' | 'sessionStorage';

const _persistenceKey = 'github.com/Aquafina-water-bottle/jp-mining-note/';

export interface SPersistInterface {
  //isAvailable(): boolean;

  /*
   * Checks whether persistence stores the key or not.
   */
  has(key: string): boolean;

  /*
   * Retrieves the value associated with the key. If no value
   * is associated to the given key, null is returned.
export function selectPersist(types: SPeristType[] = ["sessionStorage", "window"]): SPersistItemInterface | null {   */
  get(key: string): null | any;

  /* Persists the key-value pair. */
  set(key: string, value: any): void;

  ///* Removes the key-value pair, and returns the value. */
  pop(key: string): any;

  ///* Retrieves all keys in storage. */
  //keys(): string[];

  ///* Removes all previously persisted key-value pairs. */
  //clear(): void;

  /* Whether persistence can only store string */
  onlyStoresStrings(): boolean;

  getType(): SPersistType;
}

//interface SPersistGlobalInterface {
//  /* Removes all previously persisted key-value pairs. */
//  clear(): void;
//
//  isAvailable(): boolean;
//}

export class SPersistSessionStorage implements SPersistInterface {
  constructor() {}

  isAvailable() {
    return (
      globalThis.sessionStorage !== null && typeof globalThis.sessionStorage === 'object'
    );
  }

  has(key: string) {
    return globalThis.sessionStorage.getItem(_persistenceKey + key) !== null;
  }

  get(key: string): null | any {
    return globalThis.sessionStorage.getItem(_persistenceKey + key);
  }

  set(key: string, value: string) {
    globalThis.sessionStorage.setItem(_persistenceKey + key, value);
  }

  pop(key: string): any {
    const item = this.get(key);
    globalThis.sessionStorage.removeItem(_persistenceKey + key);
    return item;
  }

  onlyStoresStrings() {
    return true;
  }

  getType(): SPersistType {
    return 'sessionStorage';
  }
}

class SPersistObj implements SPersistInterface {
  private storage: Record<string, any>;

  constructor(obj: object) {
    (obj as any)[_persistenceKey] = {}
    this.storage = (obj as any)[_persistenceKey];
  }

  //isAvailable() {
  //  return this.storage !== null && typeof this.storage === 'object';
  //}

  has(key: string) {
    return key in this.storage;
  }

  get(key: string): null | any {
    if (this.has(key)) {
      return this.storage[key];
    }
    return null;
  }

  set(key: string, value: any) {
    this.storage[key] = value;
  }

  pop(key: string): any {
    const item = this.storage[key]
    delete this.storage[key]
    return item;
  }

  onlyStoresStrings() {
    return false;
  }

  getType(): SPersistType {
    return 'window';
  }
}

type PersistObjs = {
  sessionStorage: null | SPersistInterface,
  window: null | SPersistInterface,
}

const persistObjs: PersistObjs = {
  sessionStorage: null,
  window: null,
};

export function manuallyCreateObjPersist() {
  // WARNING: you very very very likely don't want to call this function
  // outside this module unless you know what you are doing!

  if ("window" in globalThis && !('_SPersist_windowKey' in window)) {
    if (typeof (window as any).py === 'object') {
      return; // nothing to do
    }
    console.log("Manually created .py persist...");
    (window as any).py = {};
    (window as any)._SPersist_windowKey = new SPersistObj((window as any).py);
    calculatePersists();
  }
}

function calculatePersists() {
  console.log("spersist control")
  // wrappers to ensure that these are defined only once
  if (
    "window" in globalThis &&
    !('_SPersist_sessionStorage' in window) &&
    globalThis.sessionStorage !== null &&
    typeof globalThis.sessionStorage === 'object'
  ) {
    (window as any)._SPersist_sessionStorage = new SPersistSessionStorage();
    console.log("Initializing _SPersist_sessionStorage")
  }

  if ("window" in globalThis && !('_SPersist_windowKey' in window)) {
    if (typeof (window as any).py === 'object') {
      //LOGGER.debug('Initializing _SPersist_windowKey.py');
      console.log("Initializing _SPersist_windowKey.py");
      (window as any)._SPersist_windowKey = new SPersistObj((window as any).py);
    } else if (typeof (window as any).qt === 'object') {
      //LOGGER.debug('Initializing _SPersist_windowKey.qt');
      console.log('Initializing _SPersist_windowKey.qt');
      (window as any)._SPersist_windowKey = new SPersistObj((window as any).qt);
    }
  }

  persistObjs.sessionStorage = "window" in globalThis ? (window as any)._SPersist_sessionStorage : null;
  persistObjs.window = "window" in globalThis ? (window as any)._SPersist_windowKey : null;
}
calculatePersists();

export function recalculatePersists() {
}

/* this function removes the need for isAvailable(), since it will be null if not available */
export function selectPersist(...types: SPersistType[]): SPersistInterface | null {
  if (types.length === 0) {
    types = ["sessionStorage", "window"];
  }
  for (const t of types) {
    const persist = persistObjs[t]
    if (typeof persist !== 'undefined') {
      return persistObjs[t];
    }
  }
  return null;
}

// TODO deprecate selectPersist with these two methods
export function selectPersistStr(): SPersistInterface | null {
  return selectPersist("sessionStorage", "window");
}

export function selectPersistObj(): SPersistInterface | null {
  return selectPersist("window");
}

export function selectPersistAny(): SPersistInterface | null {
  return selectPersist("sessionStorage", "window");
}

//export function clearAllPersists() {
//  for (const persistObj of Object.values(persistObjs)) {
//    if (persistObj.isAvailable()) {
//      persistObj.clear();
//    }
//  }
//}
