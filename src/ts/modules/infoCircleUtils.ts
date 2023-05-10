import { invoke } from '../ankiConnectUtils';
import { compileOpts, translatorStrs } from '../consts';
import { RunnableModule } from '../module';
import { O, getOption } from '../options';
import { getViewportWidth } from '../reflow';
import { getCardSide, isMobile, popupMenuMessage, getTags } from '../utils';

const infoCircFrozen = 'info-circle--frozen';
const infoCircTogglable = 'info-circle-svg-wrapper--togglable';
const infoCircWrapperTogglable = 'info-circle-svg-wrapper--hoverable';
const infoCircHoverColor = 'info-circle--hover-color';
const infoCircZoomOut = 'info-circle-text-wrapper--zoom-out';

export class InfoCircleUtils extends RunnableModule {
  private readonly infoCirc = document.getElementById('info_circle');
  private readonly infoCircWrapper = document.getElementById('info_circle_wrapper');
  private readonly infoCircTextWrapper = document.getElementById(
    'info_circle_text_wrapper'
  );
  private readonly infoCircTags = document.getElementById('info_circle_text_tags');
  private readonly infoCircTagsText = document.getElementById(
    'info_circle_text_tags_text'
  );
  private readonly enableAnkiconnectFeatures = getOption('enableAnkiconnectFeatures');

  constructor() {
    super('infoCircleUtils');
  }

  partitionTags(): [string[], string[]] {
    // partitions tags into two different groups: data tags and media tags
    // data tags are greyed out and shown at the very end, where media tags are shown
    // at the beginning

    const dataTags: string[] = [];
    const mediaTags: string[] = [];

    const possibleDataTags = new Set(getOption('infoCircleUtils.dataTags') as string[]);

    for (const tag of getTags()) {
      if (possibleDataTags.has(tag)) {
        dataTags.push(tag);
      } else {
        mediaTags.push(tag);
      }
    }

    return [dataTags, mediaTags];
  }

  createTagEle(tag: string, grey: boolean) {
    const tagEle = document.createElement('span');
    tagEle.innerText = tag;
    if (this.enableAnkiconnectFeatures) {
      tagEle.onclick = () => {
        invoke('guiBrowse', { query: `tag:${tag}` });
      };
    }
    tagEle.setAttribute('data-tag-value', tag);
    tagEle.classList.add('info-circle-tag');
    if (grey) {
      tagEle.classList.add('info-circle-tag--grey');
    }
    return tagEle;
  }

  // clicks on the info circle to freeze the popup (good for debugging and all)
  setToggleClick() {
    if (
      this.infoCircWrapper === null ||
      this.infoCirc === null ||
      this.infoCircTextWrapper === null
    ) {
      return;
    }

    const _isMobile = isMobile();
    const vwMobile = getViewportWidth() < compileOpts['breakpoints.width.combinePicture'];

    // functions to toggle the info circle through clicks
    const freeze = () => {
      this.infoCirc?.classList.add(infoCircFrozen);
      if (!_isMobile) {
        popupMenuMessage(`Info circle tooltip locked.`, true);
      }
    };
    const unfreeze = () => {
      this.infoCirc?.classList.remove(infoCircFrozen);
      if (!_isMobile) {
        popupMenuMessage(`Info circle tooltip unlocked.`, true);
      }
    };

    if (vwMobile) {
      // disables when clicking on background
      this.infoCircTextWrapper.onclick = (e: Event) => {
        if (e.target === e.currentTarget) {
          this.infoCirc?.classList.add(infoCircZoomOut);

          setTimeout(() => {
            this.infoCirc?.classList.remove(infoCircZoomOut);
            unfreeze();
          }, 200);
        }
      };
    }

    if (!_isMobile) {
      // touch display
      this.infoCircWrapper?.classList.toggle(infoCircTogglable, true);
    }

    // can toggle on pc and mobile
    this.infoCircWrapper.onclick = () => {
      if (this.infoCircWrapper === null || this.infoCirc === null) {
        return;
      }

      if (this.infoCirc.classList.contains(infoCircFrozen)) {
        unfreeze();
      } else {
        freeze();
      }
    };
  }

  main() {
    //const isHoverable = getOption('infoCircleUtils.isHoverable');
    //const togglableLockEnabled = getOption('infoCircleUtils.togglableLock.enabled');

    const [dataTags, mediaTags] = this.partitionTags();

    if (this.infoCircTags !== null && this.infoCircTagsText !== null) {
      const showTagsMode = getOption('infoCircleUtils.showTagsMode');
      if (
        showTagsMode === 'always' ||
        (showTagsMode === 'back' && getCardSide() === 'back')
      ) {
        for (const tag of mediaTags) {
          const tagEle = this.createTagEle(tag, false);
          this.infoCircTagsText.appendChild(tagEle);
        }
        for (const tag of dataTags) {
          const tagEle = this.createTagEle(tag, true);
          this.infoCircTagsText.appendChild(tagEle);
        }
        this.infoCircTags.classList.toggle('hidden', false);
      }
    }

    // not ran in the above loop to avoid coloring the info circle on the front side
    if (getCardSide() === 'back' && getTags().includes('leech')) {
      this.logger.leech(false);
    }

    this.setToggleClick();

    if (isMobile()) {
      // makes the info circle NOT hoverable to display
      this.infoCircWrapper?.classList.toggle(infoCircWrapperTogglable, false);
      this.infoCirc?.classList.toggle(infoCircHoverColor, false);
    }
  }
}
