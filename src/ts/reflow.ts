// manager to get viewport width and viewport height
// this is here in order to prevent unnecessary reflows on each card open!

import {LOGGER} from "./logger";
import {selectPersistStr, SPersistInterface} from "./spersist";


const widthKey = "jpmn.reflow.widthKey";
//const heightKey = "jpmn.reflow.heightKey";

type TimeoutValue = ReturnType<typeof setTimeout>;

function getVWForceReflow(): number {
  LOGGER.debug("Running getVWForceReflow...");
  return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
}

//function _getVHForceReflow(): number {
//  return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
//}

function setWidthCache(persist: SPersistInterface) {
  const VW = getVWForceReflow();
  persist.set(widthKey, VW.toString());
}


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
  const persist = selectPersistStr()
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

export function getViewportWidth(): number {
  return getViewportWidthFromCache();
}
//export function getViewportHeight(): number {
//  return 0;
//}
