import {escapeQueryStr, invoke} from "../ankiConnectUtils";
import { getFieldValue } from "../fields";
import { RunnableAsyncModule } from "../module"
import { selectPersistStr } from '../spersist';
import {getModelName, getCardTypeName} from "../utils";

export class CheckDuplicateKey extends RunnableAsyncModule {
  // cache beforehand
  readonly key = getFieldValue("Key");
  readonly cardTypeName = getCardTypeName();
  readonly noteName = getModelName();


  constructor() {
    super('checkDuplicateKey')
  }

  async main() {
    const cacheKey = `checkDuplicateKey.${this.key}`;

    const persist = selectPersistStr();
    if (persist !== null && persist.has(cacheKey)) {
      this.logger.debug("Key is unique (cached result).")
      return;
    }

    // queries to check
    this.logger.debug("Key is unique (cached result).")
    const keyText = escapeQueryStr(this.key);
    const queryStr = `"Key:${keyText}" "card:${this.cardTypeName}" "note:${this.noteName}"`;

    const result = await invoke("findCards", {"query": queryStr}) as Array<number>;
    console.log("bro", queryStr, result);

    if (result.length === 0) {
      this.logger.warn("Cannot find own card?")
    } else if (result.length === 1) {
      persist?.set(cacheKey, "true");
      this.logger.debug("Key is unique.")
    } else if (result.length === 2) {
      this.logger.warn("Duplicate key found. Please change the Key field value.")
    }

  }
}
