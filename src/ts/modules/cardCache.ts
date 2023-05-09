import { Module } from '../module';
import { getFieldValueEle } from '../fields';
import {getOption} from '../options';

export class CardCache extends Module {
  private readonly cardCacheEle: HTMLElement | null;
  constructor() {
    super('sm:cardCache');
    this.cardCacheEle = getFieldValueEle('CardCache');
  }

  shouldUse(): boolean {
    return (
      getOption("cardCache.enabled")
      && this.cardCacheEle !== null
      && !this.isExpired()
    );
  }

  getWordIndsData() {
    return this.cardCacheEle?.querySelector(
      `[data-cache-type="word-indicators"]`
    );
  }

  getKanjiHoverData() {
    return this.cardCacheEle?.querySelector(`[data-cache-type="kanji-hover"]`);
  }

  isExpired() {
    const writeTimeStr = this.cardCacheEle?.querySelector(`[data-cache-write-time]`)?.getAttribute("data-cache-write-time")
    const expiryDurationStr = this.cardCacheEle?.querySelector(`[data-cache-expires]`)?.getAttribute("data-cache-expires")
    if (!writeTimeStr || !expiryDurationStr) { // skip if any are null/undefined
      return;
    }
    const writeTime = Number(writeTimeStr);
    const expiryDurationDays = Number(expiryDurationStr);

    // 24/1 hour/day
    // 60/1 -> minute/hour
    // 60/1 -> second/minute
    // 1000/1 -> ms/s
    const expiryDuration = expiryDurationDays * 1000 * 60 * 60 * 24; // milliseconds
    // caching expired result is likely not worth it here
    const isExpired = (expiryDuration + writeTime < Date.now());
    return isExpired;
  }

}
