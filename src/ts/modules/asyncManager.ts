import { Module, RunnableModule, RunnableAsyncModule } from '../module';
import { getOption } from '../options';
import { selectPersist, SPersistInterface } from '../spersist';
import { CARD_KEY, popupMenuMessage } from '../utils';
import { InfoCircleSetting } from './infoCircleSetting';

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

const settingId = 'info_circle_text_settings_refresh_card';

export class AsyncManager extends Module {
  //private modules: AsyncModuleInfo[] = [];
  private modules: RunnableAsyncModule[] = [];
  private readonly persist = selectPersist();
  private readonly setting = new InfoCircleSetting(settingId);

  constructor() {
    super('sm:asyncManager');
    this.setting.initDisplay();
    this.setting.btn.onclick = () => {
      this.refreshCard();
    }
  }

  addModule(mod: RunnableAsyncModule) {
    this.modules.push(mod);
  }

  async refreshCard() {
    const refreshMutex = 'jpmn-asyncManager-refresh-mutex' + CARD_KEY;

    if (this.persist === null) {
      this.logger.warn(
        'Persistence is not available. Refreshing the card will not check whether the async processes are currently running.'
      );
    } else if (this.persist.has(refreshMutex)) {
      // TODO make popup look good
      popupMenuMessage('Async processes are already running. Card cannot be refreshed.');
      return;
    } else {
      this.persist.set(refreshMutex, 'running');
    }

    popupMenuMessage('Refreshing card...');
    await this.runModules(true);

    if (this.persist !== null) {
      this.persist.pop(refreshMutex);
    }
  }

  // this function can be ran with the refresh button!
  // note that runModules() can be run multiple times asynchronously.
  // Each module has to implement all the necessary safeguards for this.
  async runModules(refresh = false) {
    // THIS IS A HACK because document.onload cannot be overwritten
    // so instead, we delay it by some amount of time instead to 'mimic'
    // the document being loaded before running these.
    setTimeout(async () => {
      for (const mod of this.modules) {
        // runs them in order, mostly bypassing the default asynchronous behavior
        mod.setUseCache(!refresh);
        await mod.run();
      }
      if (refresh) {
        popupMenuMessage('Card successfully refreshed!');
      }
    }, getOption('asyncManager.initialDelay'));
  }
}
