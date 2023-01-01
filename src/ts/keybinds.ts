import { Module, ModuleId } from "./module"
import { Logger } from "./logger"
import { getOption } from "./options"

const id = "keybinds";
const logger = new Logger(id);

export class Keybinds extends Module {

  constructor(id: ModuleId) {
    super(id);
    this.id = id;
  }

  run() {
    // ...
  }
}
