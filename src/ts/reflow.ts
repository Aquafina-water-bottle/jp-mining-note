// manager to get viewport width and viewport height
// this is here in order to prevent unnecessary reflows on each card open!

import { LOGGER } from './logger';
import { selectPersistStr, SPersistInterface } from './spersist';
import { getOption } from './options';
import { compileOpts } from './consts';
import {ImgStylizer} from './modules/imgStylizer';

const widthKey = 'jpmn.reflow.widthKey';
//const heightKey = "jpmn.reflow.heightKey";

type TimeoutValue = ReturnType<typeof setTimeout>;

function getVWForceReflow(): number {
  LOGGER.debug('Running getVWForceReflow...');
  //return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  return document.documentElement.clientWidth || 0;
}

//function _getVHForceReflow(): number {
//  return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
//}

function setWidthCache(persist: SPersistInterface) {
  const VW = getVWForceReflow();
  persist.set(widthKey, VW.toString());
}

// TODO potentially turn this into a module to add the imgStylizer thing (to refresh layout)
function setResizeListener(persist: SPersistInterface) {
  let timeout: TimeoutValue | null = null; // holder for timeout id
  let delay = 500; // delay after event is "complete" to run callback

  window.onresize = (event) => {
    // clear the timeout
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    // start timing for event "completion"
    timeout = setTimeout(() => {
      setWidthCache(persist);
    }, delay);
  };
}

function getViewportWidthFromCache(): number {
  const persist = selectPersistStr();
  if (persist === null) {
    return getVWForceReflow();
  } else {
    if (!persist.has(widthKey)) {
      setWidthCache(persist);
      setResizeListener(persist);
    }
    return Number(persist.get(widthKey));
  }
}

function pxToNumber(px: string): number {
  if (!px.endsWith('px')) {
    throw Error(`pxToNumber: cannot convert to number (${px})`);
  }
  return Number(px.substring(0, px.length - 2));
}

// NOTE: adjust width only! assumes a sane height, and decreases if necessary
function adjustMobile(
  imgEle: HTMLImageElement | null,
  wordBoxEle: HTMLElement,
  imgBoxEle: HTMLElement
) {

  if (imgEle === null) {
    // nothing needs to be adjust if no image
    return;
  }

  // does a lot of height/width reads here
  // as all reads are grouped, only one forced reflow should happen
  const dhReading = document.getElementById('dh_reading') as HTMLElement;
  const dhWordPitch = document.getElementById('dh_word_pitch') as HTMLElement;
  //const cardDiv = document.querySelector(".card") as HTMLElement;

  // scrollWidth ensures it gets the width of the overflowed text
  const dhLeftWidth = wordBoxEle.scrollWidth;
  //const dhLeftOffsetWidth = wordBoxEle.offsetWidth; // width of the div without overflowed text
  const dhReadingHeight = dhReading.scrollHeight;
  const dhWordPitchWidth = dhWordPitch.offsetWidth; // saves width if necessary (if word overflows past screen)
  const VW = getViewportWidth();

  const dhLeftStyle = getComputedStyle(wordBoxEle);
  const ftWidth = pxToNumber(dhLeftStyle.getPropertyValue('--folder-tab-width'));
  const ftMarginLeft = pxToNumber(
    dhLeftStyle.getPropertyValue('--folder-tab-margin-left')
  );
  const ftFullWidth = ftMarginLeft * 2 + ftWidth;

  // TODO convert from rem?
  // I'm not sure how to convert --mobile-border (0.5rem) into pixels
  // however, 0.5rem === 8px, so this will be used here for now.
  // - computedstyle will return the string 0.5rem...
  const border = 8;
  // same with this
  const imageMargin = 8;

  const cardWidth = VW - border * 2;
  if (dhLeftWidth >= cardWidth) {
    wordBoxEle.classList.toggle('dh-left--word-past-screen', true);
    dhWordPitch.style.setProperty('max-width', `${dhWordPitchWidth}px`);
  }

  if (dhLeftWidth > ftFullWidth) {
    wordBoxEle.classList.toggle('dh-left--word-past-tab', true);
  }

  // hardcoded min
  // when using dhLeftWidth, we assume that dhLeftWidth will never change,
  // but this assumption breaks when pitch accent is longer than the word!

  // 100vw is the full card width
  // border * 2: actual border + gap between word box + image box
  // 2 * var(--dh-right-image-gap): additional padding around the image
  // ${dhLeftWidth}px: self explanatory
  const maxWidthCSS = `max(100vw - ${
    border * 3
  }px - (2 * var(--dh-right-image-gap)) - ${dhLeftWidth}px, 128px)`;
  imgBoxEle.style.setProperty('max-width', maxWidthCSS);
  imgEle.style.setProperty('max-width', maxWidthCSS); // ensures the max-width doesn't pass the image

  let imgLoaded = false;
  const adjustWordOverflow = (imgEle: HTMLImageElement) => {
    // ensure this is only called once per card
    if (imgLoaded) {
      return;
    }
    imgLoaded = true;

    // goal: determine if word overflows into image element
    // wordBoxEle.scrollWidth: ensures that scrollbar isn't gotten
    // VW is max viewport width
    // -imgEle.scrollWidth: self explanatory
    // border * 2: left/right border of the card
    // imageMargin: only subtract the image margin of one side (because we want to maintain this gap)
    if (dhLeftWidth >= VW || wordBoxEle.scrollWidth > VW - imgEle.scrollWidth - border * 2 - imageMargin) {
      // magic number 5 to make it slightly more separated from the word above
      imgBoxEle.style.setProperty('margin-top', `${dhReadingHeight + 5}px`);
      dhWordPitch.style.setProperty('text-align', `left`);
    }
  };

  if (imgEle !== null) {
    // THIS IS A RACE CONDITION
    imgEle.onload = () => {
      adjustWordOverflow(imgEle);
      LOGGER.debug("adjustWordOverflow: imgEle.onload")
    };
    if (imgEle.complete) { // this is usually true despite imgEle.onload being called???
      LOGGER.debug("adjustWordOverflow: imgEle.complete")
      adjustWordOverflow(imgEle);
    }
  }
}

function setHeight(
  imgEle: HTMLImageElement | null,
  imgBoxEle: HTMLElement,
  height: number
) {
  if (imgEle !== null) {
    imgEle.style.maxHeight = height + 'px';
  }
  imgBoxEle.style.maxHeight = height + 'px';
}

// resets everything for card refreshes
function resetProperties(
  imgEle: HTMLImageElement | null,
  wordBoxEle: HTMLElement,
  imgBoxEle: HTMLElement,
) {
  // we are using js
  const dhRight = document.getElementById('dh_right');
  dhRight?.classList.toggle("dh-right--no-js", false);

  // resets setHeight
  imgEle?.style.removeProperty("max-height");
  imgBoxEle.style.removeProperty("max-height");

  // resets adjustMobile
  const dhWordPitch = document.getElementById('dh_word_pitch');
  dhWordPitch?.style.removeProperty("max-width");
  dhWordPitch?.style.removeProperty("text-align");
  imgBoxEle.style.removeProperty('max-width');
  imgBoxEle.style.removeProperty('margin-top');
  imgEle?.style.removeProperty('max-width');
}

/*
 * adjust sizes of various elements within the word-img-box
 * - can be called with refresh card
 */
export function adjustElements(
  imgEle: HTMLImageElement | null,
  wordBoxEle: HTMLElement,
  imgBoxEle: HTMLElement,
) {
  resetProperties(imgEle, wordBoxEle, imgBoxEle);

  if (getViewportWidth() > compileOpts['breakpoints.width.combinePicture']) { // pc
    if (getOption('imgStylizer.mainImage.resizeHeightMode') === 'auto-height') {
      const wordBoxEleHeight = wordBoxEle.offsetHeight;
      setHeight(imgEle, imgBoxEle, wordBoxEleHeight);
    } else if (getOption('imgStylizer.mainImage.resizeHeightMode') === 'fixed') {
      const height = getOption('imgStylizer.mainImage.resizeHeightFixedValue');
      setHeight(imgEle, imgBoxEle, height);
    }
  } else if (getOption("imgStylizer.mainImage.resizeOnMobile")) {
    // mobile
    adjustMobile(imgEle, wordBoxEle, imgBoxEle);
  }
}

export function refreshAdjustElements(imgStylizer: ImgStylizer) {
  const wordBoxEle = document.getElementById('dh_left');
  const imgBoxEle = document.getElementById('dh_right');
  if (wordBoxEle !== null && imgBoxEle !== null) {
    const imgEle = imgStylizer?.getDisplayImg() ?? null;
    adjustElements(imgEle, wordBoxEle, imgBoxEle);
  }
}

export function getViewportWidth(): number {
  return getViewportWidthFromCache();
}
//export function getViewportHeight(): number {
//  return 0;
//}
