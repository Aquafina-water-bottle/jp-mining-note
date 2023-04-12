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
  private readonly enableAnkiconnectFeatures = getOption("enableAnkiconnectFeatures");

  constructor() {
    super("infoCircleUtils");
  }

  partitionTags(): [string[], string[]] {
    // partitions tags into two different groups: data tags and media tags
    // data tags are greyed out and shown at the very end, where media tags are shown
    // at the beginning

    const dataTags: string[] = [];
    const mediaTags: string[] = [];

    const possibleDataTagsArr = (getOption("infoCircleUtils.jpmnDataTags") as string[]).concat(getOption("infoCircleUtils.userDataTags"))
    const possibleDataTags = new Set(possibleDataTagsArr);

    for (const tag of getTags()) {
      if (possibleDataTags.has(tag)) {
        dataTags.push(tag)
      } else {
        mediaTags.push(tag)
      }
    }

    return [dataTags, mediaTags];
  }

  createTagEle(tag: string, grey: boolean) {
    const tagEle = document.createElement("span")
    tagEle.innerText = tag;
    if (this.enableAnkiconnectFeatures) {
      tagEle.onclick = () => {
        invoke('guiBrowse', { query: `tag:${tag}` });
      }
    }
    tagEle.setAttribute("data-tag-value", tag);
    tagEle.classList.add("info-circle-tag");
    if (grey) {
      tagEle.classList.add("info-circle-tag--grey");
    }
    return tagEle;
  }

  main() {
    const isHoverable = getOption('infoCircleUtils.isHoverable');
    const togglableLockshowPopup = getOption('infoCircleUtils.togglableLock.showPopup');
    const togglableLockEnabled = getOption('infoCircleUtils.togglableLock.enabled');

    const [dataTags, mediaTags] = this.partitionTags();

    if (this.infoCircTags !== null && this.infoCircTagsText !== null) {
      const showTagsMode = getOption("infoCircleUtils.showTagsMode");
      if ((showTagsMode === "always") || (showTagsMode === "back" && getCardSide() === "back")) {
        for (const tag of mediaTags) {
          const tagEle = this.createTagEle(tag, false)
          this.infoCircTagsText.appendChild(tagEle);
        }
        for (const tag of dataTags) {
          const tagEle = this.createTagEle(tag, true)
          this.infoCircTagsText.appendChild(tagEle);
        }
        this.infoCircTags.classList.toggle("hidden", false);
      }
    }

    // not ran in the above loop to avoid coloring the info circle on the front side
    if (getCardSide() === "back" && getTags().includes("leech")) {
      this.logger.leech(false);
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
