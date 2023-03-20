import { Module, AsyncManagerRunnableModule } from '../module';
import { getOption } from '../options';
import { popupMenuMessage } from '../utils';

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
  - the following doesn't work??? will likely still have to use the 50ms hack

      window.addEventListener("load", (event) => {
        console.log("AAA");
      });

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

export class AsyncManager extends Module {
  //private modules: AsyncModuleInfo[] = [];
  private modules: AsyncManagerRunnableModule[] = [];

  constructor() {
    super('sm:asyncManager');
  }

  addFunction(func: (...args : any[]) => any) {
    // wraps function with temporary module to run
    // what am I looking at here
    const funcModule: AsyncManagerRunnableModule = {
      setUseCache: (_: boolean) => { },
      run: () => new Promise((resolve) => {
        func(),
        resolve(void 0);
      })
    }
    this.modules.push(funcModule);
  }

  addModule(mod: AsyncManagerRunnableModule) {
    this.modules.push(mod);
  }

  async runModules(refresh = false) {
    for (const mod of this.modules) {
      // runs them in order, mostly bypassing the default asynchronous behavior
      mod.setUseCache(!refresh);
      await mod.run();
    }
    if (refresh) {
      popupMenuMessage('Card successfully refreshed!');
    }
  }

  // this function can be ran with the refresh button!
  // note that runModules() can be run multiple times asynchronously.
  // Each module has to implement all the necessary safeguards for this.
  async runModulesDelay() {
    const delay: number = getOption('asyncManager.initialDelay');
    if (delay === 0) {
      this.runModules();
    } else {
      // THIS IS A HACK because document.onload cannot be overwritten
      // so instead, we delay it by some amount of time instead to 'mimic'
      // the document being loaded before running these.
      setTimeout(() => {
        this.runModules();
      }, delay);
    }

  }
}
