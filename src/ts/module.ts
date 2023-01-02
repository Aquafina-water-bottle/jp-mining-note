import { getOption, O } from './options';
import { Logger } from './logger';

// html elements: class private readonly
// runtime options: class private readonly
// actual constants (strings / numbers / etc): module constant
// this order prevents html elements / runtime options from being ran despite nothing using it

export type ModuleId =
  | 'keybinds'
  | 'mainCardUtils'
  | 'autoPitchAccent'
  | 'imgUtilsMin'
  | 'imgUtils'
  | 'sentUtils'
  | 'kanjiHover'
  | 'collapseDictionaries'
  | 'openCollapsedFields'
  | 'wordIndicators'
  | 'mobileUtils'
  | 'infoCircleUtils'
  | 'freqUtils'
  | 'fixRubyPositioning'
  | 'checkDuplicateKey';


// TODO: using OverrideValue<K> creates an error:
// > "Expression produces a union type that is too complex to represent"
// TODO: extend to use overrides if necessary
// [K in keyof O]?: O[K] | OverrideValueUnknown;
type OptionsSubset = {
  // all optional
  [K in keyof O]?: O[K];
};

export abstract class SideModule {
  id: string;
  logger: Logger;

  private localOpts: OptionsSubset = {};

  constructor(id: string) {
    this.id = id;
    this.logger = new Logger(id);
  }

  overrideOption<K extends keyof O>(k: K, o: O[K]) {
    this.localOpts[k] = o;
  }

  getOption<K extends keyof O>(k: K) {
    if (k in this.localOpts) {
      return this.localOpts[k];
    }
    return getOption(k);
  }
}

export abstract class Module extends SideModule {
  id: ModuleId;

  constructor(id: ModuleId) {
    super(id);
    this.id = id; // requires another set apparently
  }

  run() {
    if (getOption(`${this.id}.enabled`)) {
      this.main();
    }
  }

  abstract main(): void;
}
