import { Module, RunnableModule } from "../module"
import { getOption } from "../options"

/*


TODO:
- priority queue on whatever the latest card is
  - https://github.com/luciopaiva/heapify
  - https://stackoverflow.com/questions/42919469/efficient-way-to-implement-priority-queue-in-javascript
  - BEFORE IMPLEMENTING, ENSURE PROBLEM ACTUALLY EXISTS!!!
  - i.e. write without priority queue first and see if it works
- support for caching on front
- option to only cache on front for new cards
  - for issue where people can review cards very fast (faster than the sum of all sync actions)
- make sure all async actions are run after html render
  - to prevent the weird 50ms hack
- all things in one card should be ran as one group

- naive implementation:
  - run after the other, with option to not wait
  - order:
    - (front) after load -> word indicators -> kanji hover -> check duplicates
    - (back) after load -> kanji hover (don't wait) -> word indicators -> check duplicates

- should AsyncModule even be used? just use regular modules and display if exists in the og code

*/


// TODO whatever this is
//interface AsyncModule {
//  calc(): void;
//  display(): void;
//}
//
//type AsyncModuleInfo = {
//  asyncMod: AsyncModule;
//  display: boolean;
//}

//type RunType;


export class AsyncManager extends RunnableModule {

  //private modules: AsyncModuleInfo[] = [];

  constructor() {
    super('asyncManager')
  }

  addModule(module: RunnableModule) {
  }

  main() {
    // ...
  }
}
