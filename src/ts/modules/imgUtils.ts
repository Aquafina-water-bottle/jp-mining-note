import {compileOpts} from "../consts";
import { Module } from "../module"
import { getOption } from "../options"
import {CardSide} from "../utils";
import {ImgUtilsOther} from "../side-modules/imgUtilsOther";

export class ImgUtils extends Module {
  private readonly cardSide: CardSide;

  constructor(cardSide: CardSide) {
    super('imgUtils');
    this.cardSide = cardSide;
  }

  //stylizeImages(glossaryType, yomichanMode, userMode) {
  //}

  stylizeImagesPrimary() {
    // stylizeImages(...)
  }

  stylizeImagesOther() {
    // stylizeImages(...)
  }

  stylizeYomichanImages(mode) {
  }

  stylizeUserImages(mode) {
  }

  main() {

    if (this.cardSide === "front") {
      if (compileOpts["enableModule.imgUtils.imageBlur"]) {
      }
      return;
    }

    const imgEle = this.getDisplayImg();
    if (imgEle === null) {
      imgEle = this.attemptAddImageFromTags(getOption("imgUtils.addImageIfContainsTags"));
    }

    const dhRight = document.getElementById("dh_right");
    this.adjustHeight(dhRight);
    if (imgEle !== null) {
      this.adjustHeight(imgEle);
      this.addClickToZoom(imgEle)
    }

    this.editDisplayImage();

    if (getOption("imgUtils.stylizeImgsPrimaryDefinition.enabled")) {
      // covers primarydefinitionpicture (left & right!)
      stylizeImagesPrimary();
    }

    if (getOption("imgUtils.stylizeImgsGlossary.enabled")) {
      searchImagesOther();
    }

    markPrimaryDefPics();

    //if (READ_DHLEFT_HEIGHT || CALC_DEF_PIC_HEIGHT) {
    if (READ_DHLEFT_HEIGHT) {
      HEIGHT_LEFT = dhLeft === null ? 0 : dhLeft.offsetHeight;
      // TODO: primaryDefRawText.offsetHeight seems to always return 0
      //PIC_HEIGHT = primaryDefRight === null ? 0 : primaryDefRight.offsetHeight;
      //TEXT_HEIGHT = primaryDefRawText === null ? 0 : primaryDefRawText.offsetHeight;

      // adjusts the height after searchImages() so searchImages() can properly images
      // to primary def pic if necessary
    }

    // can be a fixed height, so not placed in the above block
    adjustHeight(dhRight);
    adjustHeight(image); // restricts max height here too

    // should be done after the search images function
    // so height is properly calculated with collapsed images
    if ({{ utils.opt("modules", "img-utils", "primary-definition-picture", "enabled") }}) {
      setDefPicPosition();
    }

  }
}
