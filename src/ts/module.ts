import { getOption } from './options';
import { Logger } from './logger';

// html elements: class private readonly
// runtime options: class private readonly
// actual constants (strings / numbers / etc): module constant
// this order prevents html elements / runtime options from being ran despite nothing using it

export type ModuleId =
  | 'timePerformance'
  | 'keybinds'
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

export abstract class Module {
  id: ModuleId;
  logger: Logger;

  constructor(id: ModuleId) {
    this.id = id;
    this.logger = new Logger(id);
  }
  abstract run(): void;

  main() {
    if (getOption(`${this.id}.enabled`)) {
      this.main();
    }
  }
}
