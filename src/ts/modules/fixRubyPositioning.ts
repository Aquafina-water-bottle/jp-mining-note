import { RunnableModule } from "../module"

const className = "fix-ruby-positioning";

export class FixRubyPositioning extends RunnableModule {

  constructor() {
    super('fixRubyPositioning')
  }

  addClassToEle(id: string) {
    const ele = document.getElementById(id);
    if (ele !== null) {
      ele.classList.toggle(className, true);
    }
  }

  main() {
    this.addClassToEle("def_header");
    this.addClassToEle("full_sentence");
    this.addClassToEle("full_sentence_front");

    const expressions = document.querySelectorAll(".expression");
    if (expressions !== null) {
      for (const e of expressions) {
        e.classList.add(className);
      }
    }

  }
}
