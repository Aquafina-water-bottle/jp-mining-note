
/// {% set functions %}

// ===================
//  Info Circle Utils
// ===================

const JPMNInfoCircleUtils = (() => {

  const logger = new JPMNLogger("info-circle-utils");

  // private functions and variables here
  // ...

  class JPMNInfoCircleUtils {
    constructor() { }

    run() {

      let infoCirc = document.getElementById("info_circle");
      let infoCircWrapper = document.getElementById("info_circle_wrapper");

      // clicks on the info circle to freeze the popup (good for debugging and all)
      if ({{ utils.opt("modules", "info-circle-utils", "togglable-lock", "enabled") }}) {

        const showPopup = {{ utils.opt("modules", "info-circle-utils", "togglable-lock", "show-popup") }};

        //function addLockFunc(clickEle, circEle, displayName, frozenClassName, togglableClassName, showPopup) {
        //  if (clickEle === null || circEle === null) {
        //    return;
        //  }

        //  clickEle.classList.add(togglableClassName);
        //  clickEle.onclick = function() {
        //    if (circEle.classList.contains(frozenClassName)) {
        //      circEle.classList.remove(frozenClassName);
        //      if (showPopup) {
        //        popupMenuMessage(`${displayName} unlocked.`, true);
        //      }
        //    } else {
        //      circEle.classList.add(frozenClassName);
        //      if (showPopup) {
        //        popupMenuMessage(`${displayName} locked.`, true);
        //      }
        //    }
        //  }

        //}

        // main info circle
        const infoCircFrozen = "info-circle--frozen";
        const infoCircTogglable = "info-circle-svg-wrapper--togglable";
        //addLockFunc(infoCircWrapper, infoCirc, "Info circle tooltip", infoCircFrozen, infoCircTogglable, showPopup);

        //if (infoCircWrapper === null || infoCirc === null) {
        //  return;
        //}

        if (!isMobile()) {
          infoCircWrapper.classList.toggle(infoCircTogglable, true);
        }

        infoCircWrapper.onclick = function() {
          if (infoCirc.classList.contains(infoCircFrozen)) {
            infoCirc.classList.remove(infoCircFrozen);
            if (showPopup) {
              popupMenuMessage(`Info circle tooltip unlocked.`, true);
            }
          } else {
            infoCirc.classList.add(infoCircFrozen);
            if (showPopup) {
              popupMenuMessage(`Info circle tooltip locked.`, true);
            }
          }
        }
      }

      if (!{{ utils.opt("modules", "info-circle-utils", "is-hoverable") }}) {
        infoCircWrapper.classList.toggle("info-circle-svg-wrapper--hoverable", false);
        infoCirc.classList.toggle("info-circle--hover-color", false);
      }

    }
  }


  return JPMNInfoCircleUtils;

})();

/// {% endset %}






/// {% set run %}

if ({{ utils.opt("modules", "info-circle-utils", "enabled") }}) {
  const infoCircleUtils = new JPMNInfoCircleUtils()
  infoCircleUtils.run();
}

/// {% endset %}

