import { getOption, O } from './options';
import { Logger } from './logger';

// html elements: class private readonly
// runtime options: class private readonly
// actual constants (strings / numbers / etc): module constant
// this order prevents html elements / runtime options from being ran despite nothing using it

// required for run() -> getOption() to work
export type ModuleId =
  | 'keybinds'
  | 'mainCardUtils'
  | 'autoPitchAccent'
  | 'imgStylizer'
  | 'sentenceParser'
  | 'kanjiHover'
  | 'collapseDictionaries'
  | 'openCollapsedFields'
  | 'wordIndicators'
  | 'webSocketUtils'
  | 'mobileUtils'
  | 'infoCircleUtils'
  | 'freqUtils'
  | 'fixRubyPositioning'
  | 'checkDuplicateKey'
  | 'asyncManager';


// TODO: using OverrideValue<K> creates an error:
// > "Expression produces a union type that is too complex to represent"
// TODO: extend to use overrides if necessary
// [K in keyof O]?: O[K] | OverrideValueUnknown;
//type OptionsSubset = {
//  // all optional
//  [K in keyof O]?: O[K];
//};

type OptionsSubset = Partial<O>;

export abstract class Module {
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

  getOption<K extends keyof O>(k: K): O[K] {
    const x = this.localOpts[k];
    if (x !== undefined) {
      return x;
    }
    return getOption(k);
  }
}

export abstract class RunnableModule extends Module {
  rid: ModuleId; // runnable module id

  constructor(rid: ModuleId, id?: string) {
    super(id === undefined ? rid : id);
    this.rid = rid; // requires another set apparently
  }

  run() {
    try {
      if (getOption(`${this.rid}.enabled`)) {
        this.main();
      }
    } catch (error: any) {
      this.logger.errorStack(error.stack);
      //this.logger.error("Error occured in module");
      //this.logger.error(error.stack);
    }
  }

  abstract main(): void;
}
