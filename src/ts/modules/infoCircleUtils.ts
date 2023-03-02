import {invoke} from '../ankiConnectUtils';
import {translatorStrs} from '../consts';
import { RunnableModule } from '../module';
import { O, getOption } from '../options';
import { getCardSide, isMobile, popupMenuMessage, getTags } from '../utils';

const infoCircFrozen = 'info-circle--frozen';
const infoCircTogglable = 'info-circle-svg-wrapper--togglable';
const infoCircWrapperTogglable = 'info-circle-svg-wrapper--hoverable';
const infoCircHoverColor = 'info-circle--hover-color';

export class InfoCircleUtils extends RunnableModule {
  private readonly infoCirc = document.getElementById('info_circle');
  private readonly infoCircWrapper = document.getElementById('info_circle_wrapper');
  private readonly infoCircTags = document.getElementById('info_circle_text_tags');
  private readonly infoCircTagsText = document.getElementById('info_circle_text_tags_text');

  constructor() {
    super("infoCircleUtils");
  }

  main() {
    const isHoverable = getOption('infoCircleUtils.isHoverable');
    const togglableLockshowPopup = getOption('infoCircleUtils.togglableLock.showPopup');
    const togglableLockEnabled = getOption('infoCircleUtils.togglableLock.enabled');
    const enableAnkiconnectFeatures = getOption("enableAnkiconnectFeatures");

    let displayLeechTag = false;
    if (this.infoCircTags !== null && this.infoCircTagsText !== null) {
      const showTagsMode = getOption("infoCircleUtils.showTagsMode");
      if ((showTagsMode === "always") || (showTagsMode === "back" && getCardSide() === "back")) {
        for (const tag of getTags()) {
          const tagEle = document.createElement("span")
          tagEle.innerText = tag;
          if (enableAnkiconnectFeatures) {
            tagEle.onclick = () => {
              invoke('guiBrowse', { query: `tag:${tag}` });
            }
          }
          if (tag === "leech") {
            displayLeechTag = true;
          }
          tagEle.setAttribute("data-tag-value", tag);
          this.infoCircTagsText.appendChild(tagEle);
        }
        this.infoCircTags.classList.toggle("hidden", false);
      }
    }

    // not ran in the above loop to avoid coloring the info circle on the front side
    if (getCardSide() === "back" && getTags().includes("leech")) {
      this.logger.leech(!displayLeechTag);
    }

    if (this.infoCircWrapper === null || this.infoCirc === null) {
      return;
    }

    // clicks on the info circle to freeze the popup (good for debugging and all)
    if (togglableLockEnabled) {
      if (!isMobile()) {
        this.infoCircWrapper?.classList.toggle(infoCircTogglable, true);
      }

      this.infoCircWrapper.onclick = () => {
        if (this.infoCircWrapper === null || this.infoCirc === null) {
          return;
        }

        if (this.infoCirc.classList.contains(infoCircFrozen)) {
          this.infoCirc.classList.remove(infoCircFrozen);
          if (togglableLockshowPopup) {
            popupMenuMessage(`Info circle tooltip unlocked.`, true);
          }
        } else {
          this.infoCirc.classList.add(infoCircFrozen);
          if (togglableLockshowPopup) {
            popupMenuMessage(`Info circle tooltip locked.`, true);
          }
        }
      };
    }

    if (!isHoverable) {
      this.infoCircWrapper.classList.toggle(infoCircWrapperTogglable, false);
      this.infoCirc.classList.toggle(infoCircHoverColor, false);
    }
  }
}
