import { RunnableModule } from "../module"
import { getCardKey, popupMenuMessage } from '../utils';
import { refreshAdjustElements } from '../reflow';
import { InfoCircleSetting } from './infoCircleSetting';
import { selectPersistAny } from '../spersist';
import {AsyncManager} from "./asyncManager";
import {ImgStylizer} from "./imgStylizer";

const settingId = 'info_circle_text_settings_refresh_card';

export class RefreshCard extends RunnableModule {
  private readonly setting = new InfoCircleSetting(settingId);
  private readonly persist = selectPersistAny();
  private imgStylizer: ImgStylizer | null = null;
  private asyncManager: AsyncManager | null = null;

  constructor() {
    super('refreshCard')
  }

  addImgStylizer(imgStylizer: ImgStylizer) {
    this.imgStylizer = imgStylizer;
  }

  addAsyncManager(asyncManager: AsyncManager) {
    this.asyncManager = asyncManager;
  }

  async refreshCard() {
    const refreshMutex = 'jpmn-asyncManager-refresh-mutex' + getCardKey();

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

    if (this.imgStylizer !== null) {
      refreshAdjustElements(this.imgStylizer);
    }

    await this.asyncManager?.runModules(true);

    if (this.persist !== null) {
      this.persist.pop(refreshMutex);
    }
  }

  main() {
    this.setting.initDisplay();
    this.setting.btn.onclick = () => {
      this.refreshCard();
    };
  }
}
