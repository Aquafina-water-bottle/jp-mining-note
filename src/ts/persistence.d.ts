export namespace Persistence {
  /* Removes all previously persisted key-value pairs. */
  function clear(): void;

  /* Retrieves the value associated with the key. If no value is associated to the given key, null is returned. */
  function getItem(key: string): any;

  /* Retrieves the value associated with a default key. */
  function getItem(): any;

  /* Persists the key-value pair.*/
  function setItem(key: string, value: any): void;

  /* Persists the value using a default key. */
  function setItem(value: any): void;

  /* Removes the value associated with the key. If no value is associated to the given key, nothing happens. */
  function removeItem(key: string): void;

  /* Removes the value associated with a default key. */
  function removeItem(): void;

  /* Retrieves all keys in storage. */
  function getAllKeys(): string[];
}
