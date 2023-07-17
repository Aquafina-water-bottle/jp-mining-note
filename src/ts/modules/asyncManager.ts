import { Module, type AsyncManagerRunnableModule } from '../module';
import { getOption } from '../options';
import { popupMenuMessage } from '../utils';

export class AsyncManager extends Module {
  //private modules: AsyncModuleInfo[] = [];
  private modules: AsyncManagerRunnableModule[] = [];

  constructor() {
    super('sm:asyncManager');
  }

  addFunction(func: (...args: any[]) => any) {
    // wraps function with temporary module to run
    // what am I looking at here
    const funcModule: AsyncManagerRunnableModule = {
      setUseCache: (_: boolean) => {},
      run: () =>
        new Promise((resolve) => {
          func(), resolve(void 0);
        }),
    };
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
