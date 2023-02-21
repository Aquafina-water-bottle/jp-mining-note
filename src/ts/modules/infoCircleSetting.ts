import { Module } from '../module';
//import { O, getOption } from '../options';
import {selectPersist, SPersistInterface} from '../spersist';
//import { Persistence } from '../persistence';
import { throwOnNotFound } from '../utils';

type InfoCircleSettingId =
  | 'info_circle_text_settings_img_blur_toggle'
  | 'info_circle_text_settings_websocket_toggle'
  | 'info_circle_text_settings_refresh_card'
  | 'info_circle_text_settings_clear_cache';

export class InfoCircleSetting extends Module {
  private readonly infoCircSettings: HTMLElement = throwOnNotFound(
    'info_circle_text_settings'
  );
  private readonly infoCircSettingsBorder: HTMLElement = throwOnNotFound(
    'info_circle_text_settings_border'
  );

  readonly btn: HTMLElement;
  private readonly persistKey?: string;
  private readonly persist = selectPersist("sessionStorage", "window");

  constructor(settingId: InfoCircleSettingId, persistKey?: string) {
    super(`sm:infoCircleSetting:${settingId}`);
    this.btn = throwOnNotFound(settingId);
    this.persistKey = persistKey;
  }

  getNextState(): number | undefined {
    const result = this.getCurrentState();
    if (result === undefined) {
      return undefined;
    }

    let next = (result + 1) % this.btn.children.length;
    return next;
  }

  getCurrentState(): number | undefined {
    // find child that isn't hidden
    if (this.btn.children.length <= 1) {
      this.logger.warn('Cannot toggle setting with <= 1 children');
      return undefined;
    }

    let result: number | null = null;
    for (let i = 0; i < this.btn.children.length; i++) {
      const c = this.btn.children[i];
      if (!c.classList.contains('hidden')) {
        result = i;
        break;
      }
    }

    if (result === null) {
      this.logger.warn('Cannot toggle setting with all hidden children');
      return undefined;
    }

    return result;
  }

  toggleDisplay(): number | undefined {
    // find child that isn't hidden

    let next = this.getNextState();
    if (next === undefined) {
      return undefined;
    }
    return this.displayAs(next);
  }

  // assumes that one can indeed toggle the display
  displayAs(next: number): number {
    // next is now an int
    let current = next - 1 === -1 ? this.btn.children.length - 1 : next - 1;

    if (this.persist !== null && this.persistKey !== undefined) {
      this.persist.set(this.persistKey, `${next}`);
    }

    this.btn.children[current].classList.toggle('hidden', true);
    this.btn.children[next].classList.toggle('hidden', false);
    return next;
  }

  // inits the setting icon to be whatever is stored in persistence (if any)
  // opt is used to get the default
  // optional defaultState: if defaultState is undefined, then there are no states
  initDisplay(defaultState?: number): number | undefined {
    this.infoCircSettings.classList.toggle('hidden', false);
    this.infoCircSettingsBorder.classList.toggle('hidden', false);
    this.btn.classList.toggle('hidden', false);

    if (defaultState === undefined) {
      this.btn.children[0].classList.toggle('hidden', false);
      return undefined;
    }

    let state: number = defaultState;

    // checks persistence
    if (this.persist !== null) {
      if (this.persistKey !== undefined && defaultState !== undefined) {
        if (!this.persist.has(this.persistKey)) {
          this.persist.set(this.persistKey, `${defaultState}`);
        }
        state = Number(this.persist.get(this.persistKey));
      }
    } else {
      // TODO togglable warn
      this.logger.warn('Persistence is not available. Using default state...');
    }

    // state is exactly what child should be visible
    this.btn.children[state].classList.toggle('hidden', false);

    return state;
  }
}
