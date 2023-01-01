import { getOption } from './options';
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
  | 'autoHighlightWord'
  | 'kanjiHover'
  | 'collapseDictionaries'
  | 'openCollapsedFields'
  | 'wordIndicators'
  | 'mobileUtils'
  | 'infoCircleUtils'
  | 'freqUtils'
  | 'fixRubyPositioning'
  | 'checkDuplicateKey';

export abstract class SideModule {
  id: string;
  logger: Logger;

  constructor(id: string) {
    this.id = id;
    this.logger = new Logger(id);
  }

  abstract main(): void;
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
}
