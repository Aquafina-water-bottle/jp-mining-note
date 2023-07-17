import { escapeQueryStr, invoke } from '../ankiConnectUtils';
import { getFieldValue } from '../fields';
import { RunnableAsyncModule } from '../module';
import { getOption } from '../options';
import { selectPersistStr } from '../spersist';
import { getModelName, getCardTypeName } from '../utils';

export class CheckDuplicateKey extends RunnableAsyncModule {
  // cache beforehand
  readonly key = getFieldValue('Key');
  readonly cardTypeName = getCardTypeName();
  readonly noteName = getModelName();

  constructor() {
    super('checkDuplicateKey');
  }

  async main() {
    if (!getOption('enableAnkiconnectFeatures')) {
      return;
    }

    const cacheKey = `checkDuplicateKey.${this.key}`;

    const persist = selectPersistStr();
    if (persist !== null && persist.has(cacheKey)) {
      this.logger.debug('Key is unique (cached result).');
      return;
    }

    // queries to check
    this.logger.debug('Checking if key is unique...');
    const keyText = escapeQueryStr(this.key);
    const queryStr = `"Key:${keyText}" "card:${this.cardTypeName}" "note:${this.noteName}"`;

    const result = (await invoke('findCards', { query: queryStr })) as Array<number>;

    if (result.length === 0) {
      this.logger.warn(
        `Cannot find own card. If you renamed your note, certain features will be missing. See <a href="https://aquafina-water-bottle.github.io/jp-mining-note-prerelease/faq/#warning-cannot-find-own-card">here</a> for more info`,
        { isHtml: true }
      );
    } else if (result.length === 1) {
      persist?.set(cacheKey, 'true');
      this.logger.debug('Key is unique.');
    } else if (result.length === 2) {
      this.logger.warn('Duplicate key found. Please change the Key field value.');
    }
  }
}
