import { getOption, type O } from './options';
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
  | 'wordIndicators'
  | 'webSocketUtils'
  | 'mobileUtils'
  | 'infoCircleUtils'
  | 'freqUtils'
  | 'fixRubyPositioning'
  | 'checkDuplicateKey'
  | 'blockquotes'
  | 'refreshCard';


type OptionsSubset = Partial<O>;

export abstract class Module {
  id: string;
  logger: Logger;

  private localOpts: OptionsSubset = {};

  constructor(id: string) {
    this.id = id;
    this.logger = new Logger(id);
  }

  /* sets the local option to be the specified value */
  overrideOption<K extends keyof O>(k: K, o: O[K]) {
    this.localOpts[k] = o;
  }

  /* similar to overrideOption, but accepts an entire set of key/value pairs */
  overrideOptions(options: OptionsSubset) {
    for (const key of Object.keys(options) as Array<keyof O>) {
      const o = options[key];
      if (typeof o !== 'undefined') {
        this.overrideOption(key, o);
      }
    }
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
    }
  }

  abstract main(): void;
}

// this is a generalized version of the below to allow more things
// to run in the AsyncManager
export interface AsyncManagerRunnableModule {
  setUseCache(useCache: boolean): void;
  run(): Promise<void>;
}

export abstract class RunnableAsyncModule
  extends RunnableModule
  implements AsyncManagerRunnableModule
{
  useCache: boolean = false;

  setUseCache(useCache: boolean) {
    this.useCache = useCache;
  }

  async run() {
    // to call run() except in an async context
    RunnableModule.prototype.run.call(this);
  }

  // still requires main() to be implemented!
}
