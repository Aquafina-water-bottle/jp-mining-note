import { LOGGER } from './logger';
import { fields } from './consts'

export type Field = keyof typeof fields;

let fieldFilledCache: Partial<Record<Field, boolean>> = {};

export function cacheFieldFilled(field: Field, value: boolean) {
  fieldFilledCache[field] = value;
}

export function fieldIsFilled(field: Field): boolean {
  const cachedValue = fieldFilledCache[field];
  if (cachedValue !== undefined) {
    return cachedValue;
  }
  const x = document.getElementById(`hidden_field_exists_${field}`);
  if (x === null) {
    LOGGER.warn(`fieldIsFilled(${field}) could not find element`);
    return false; // shouldn't ever be reached?
  }
  return x.innerHTML.length !== 0;
}

/* if every field exists */
export function fieldsAllFilled(...fields: Field[]) {
  for (const field of fields) {
    if (!fieldIsFilled(field)) {
      return false;
    }
  }
  return true;
}

/* if any field exists */
export function fieldsAnyFilled(...fields: Field[]) {
  for (const field of fields) {
    if (fieldIsFilled(field)) {
      return true;
    }
  }
  return false;
}

export function fieldsAllEmpty(...fields: Field[]) {
  return !fieldsAnyFilled(...fields);
}

// per card
let fieldValueCache: Partial<Record<Field, string>> = {};

// specifically to cache for asynchronous functions
// (when the getElementById can return a different elemnt)
export function cacheFieldValue(field: Field) {
  const cacheValue = fieldValueCache[field];
  if (cacheValue !== undefined) {
    return; // already cached
  }
  const value = getFieldValue(field);
  fieldValueCache[field] = value;
}

export function getFieldValue(field: Field): string {
  const cacheValue = fieldValueCache[field];
  if (cacheValue !== undefined) {
    return cacheValue;
  }

  const x = document.getElementById(`hidden_field_${field}`);
  if (x === null) {
    LOGGER.warn(`getFieldValue(${field}) could not find element`);
    return '';
  }
  return x.innerHTML;
}

// NOTE: not currently cached!!!
// Should this be cached at some point?
export function getFieldValueEle(field: Field): HTMLElement | null {
  const x = document.getElementById(`hidden_field_${field}`);
  if (x === null) {
    LOGGER.warn(`getFieldValueEle(${field}) could not find element`);
    return null;
  }
  return x;
}

/*
 * This is prefixed with `_` to indicate that this should not be used under normal circumstances.
 * These values should be reset after each card flip normally, but has to be manually reset
 * with cache.ts
 */
export function _resetGlobalState() {
  fieldValueCache = {};
  fieldFilledCache = {};
}
