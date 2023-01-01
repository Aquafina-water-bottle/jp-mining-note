import { Module} from "./module"
import { getOption } from "./options"
import { isMobile, popupMenuMessage } from "./utils"

const infoCircFrozen = "info-circle--frozen";
const infoCircTogglable = "info-circle-svg-wrapper--togglable";
const infoCircWrapperTogglable = "info-circle-svg-wrapper--hoverable";
const infoCircHoverColor = "info-circle--hover-color"


export class InfoCircleUtils extends Module {

  private readonly infoCirc = document.getElementById("info_circle");
  private readonly infoCircWrapper = document.getElementById("info_circle_wrapper");

  private readonly isHoverable = getOption("infoCircleUtils.isHoverable");
  private readonly togglableLockshowPopup = getOption("infoCircleUtils.togglableLock.showPopup");
  private readonly togglableLockEnabled = getOption("infoCircleUtils.togglableLock.enabled");

  run() {

    if (this.infoCircWrapper === null || this.infoCirc === null) {
      return;
    }

    // clicks on the info circle to freeze the popup (good for debugging and all)
    if (this.togglableLockEnabled) {

      if (!isMobile()) {
        this.infoCircWrapper?.classList.toggle(infoCircTogglable, true);
      }

      this.infoCircWrapper.onclick = (() => {

        if (this.infoCircWrapper === null || this.infoCirc === null) {
          return;
        }

        if (this.infoCirc.classList.contains(infoCircFrozen)) {
          this.infoCirc.classList.remove(infoCircFrozen);
          if (this.togglableLockshowPopup) {
            popupMenuMessage(`Info circle tooltip unlocked.`, true);
          }
        } else {
          this.infoCirc.classList.add(infoCircFrozen);
          if (this.togglableLockshowPopup) {
            popupMenuMessage(`Info circle tooltip locked.`, true);
          }
        }
      })

    }

    if (!this.isHoverable) {
      this.infoCircWrapper.classList.toggle(infoCircWrapperTogglable, false);
      this.infoCirc.classList.toggle(infoCircHoverColor, false);
    }

  }

}
