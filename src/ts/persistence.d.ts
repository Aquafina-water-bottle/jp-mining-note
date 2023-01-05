export namespace Persistence {
  /* Removes all previously persisted key-value pairs. */
  function clear(): void;

  function isAvailable(): boolean;

  /* Retrieves the value associated with the key. If no value is associated to the given key, null is returned. */
  function getItem(key: string): string;

  /* Retrieves the value associated with a default key. */
  function getItem(): string;

  /* Persists the key-value pair. */
  function setItem(key: string, value: string): void;

  /* Persists the value using a default key. */
  function setItem(value: any): void;

  /* Removes the value associated with the key. If no value is associated to the given key, nothing happens. */
  function removeItem(key: string): void;

  /* Removes the value associated with a default key. */
  function removeItem(): void;

  /* Retrieves all keys in storage. */
  function getAllKeys(): string[];

  /* Whether persistence can only store string */
  function onlyStoresString(): boolean;
}
