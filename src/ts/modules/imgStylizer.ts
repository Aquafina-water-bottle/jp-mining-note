import { Module, RunnableModule } from '../module';
//import { ImgBlur } from "./imgBlur"
import { compileOpts } from '../consts';
import { getOption } from '../options';
import { arrContainsAnyOf, CardSide, popupMenuMessage, TAGS_LIST, VW } from '../utils';
import { InfoCircleSetting } from './infoCircleSetting';

type TagToImg = {
  tags: string[];
  fileName: string;
};
type TagToImgList = TagToImg[];

class ImgBlur extends Module {
  private readonly setting = new InfoCircleSetting(settingId, persistKey);

  constructor() {
    super('sm:imgBlur');
  }

  imgBlurDisplaySetting() {
    // internally, states are represented as numbers
    const defaultStateMap = {
      "never": 0,
      "only-tagged": 1,
      "always": 2,
    }
    const defaultStateStr = getOption('imgStylizer.mainImage.blur.startState');
    let defaultState = 0;
    if (defaultStateStr in defaultStateMap) {
      defaultState = defaultStateMap[defaultStateStr as keyof typeof defaultStateMap];
    }

    let state = this.setting.initDisplay(defaultState);

    // toggle state
    this.setting.btn.onclick = () => {
      const newState = this.setting.getNextState();
      if (newState === 0) {
        popupMenuMessage("No images will be blurred.");
      } else if (newState === 1) {
        popupMenuMessage("Tagged images will be blurred.");
      } else if (newState === 2) {
        popupMenuMessage("All images will be blurred.");
      } else { // 2
        this.logger.warn(`Invalid image state: ${newState}`)
        return;
      }
      this.setting.displayAs(newState);
    };

  }
}

const clsContainsImg = 'dh-right--contains-image';
const clsAudioBtnsLeft = 'dh-left__audio-buttons--left';
const clsImgClick = 'dh-right__img-container--clickable';
const clsRightImg = 'dh-right__img';

const settingId = 'info_circle_text_settings_img_blur_toggle';
const persistKey = 'jpmn-img-blur';

class BackImgStylizer extends Module {
  private readonly cardTags = TAGS_LIST;

  // these shouldn't ever be null...
  // TODO rename def-header? "header" makes 0 sense here lol
  // "word box" makes more sense?
  private readonly dhRight = document.getElementById('dh_right') as HTMLElement;
  private readonly dhLeft = document.getElementById('dh_left') as HTMLElement;
  private readonly dhLeftAudioBtns = document.getElementById(
    'dh_left_audio_buttons'
  ) as HTMLElement;
  private readonly dhImgContainer = document.getElementById(
    'dh_img_container'
  ) as HTMLElement;
  private readonly modal = document.getElementById('modal') as HTMLElement;
  private readonly modalImg = document.getElementById('bigimg') as HTMLImageElement;

  private readonly imgBlur: ImgBlur | null;
  private readonly READ_DHLEFT_HEIGHT = VW > compileOpts['breakpoints.combinePicture'];

  private heightLeft: number | null = null;

  constructor(imgBlur: ImgBlur | null) {
    super('sm:backImgStylizer');
    this.imgBlur = imgBlur;
  }

  private readHeightLeft() {
    // this is a performance bottleneck!
    // forced reflow happens here if used
    this.heightLeft = this.dhLeft === null ? 0 : this.dhLeft.offsetHeight;
  }

  private getHeightLeft() {
    if (this.heightLeft === null) {
      this.readHeightLeft();
    }
    return this.heightLeft;
  }

  private adjustHeight(ele: HTMLElement) {
    this.logger.debug('adjustHeight');
    console.log(ele);
    if (ele === null) {
      return;
    }

    if (this.READ_DHLEFT_HEIGHT) {
      ele.style.maxHeight = this.getHeightLeft() + 'px';
    } else if (getOption('imgStylizer.mainImage.resizeHeightMode') === 'fixed') {
      ele.style.maxHeight =
        getOption('imgStylizer.mainImage.resizeHeightFixedValue') + 'px';
    }
  }

  private getDisplayImg(): HTMLImageElement | null {
    if (!this.hasDisplayImg()) {
      return null;
    }

    const imgList = Array.from(this.dhImgContainer.getElementsByTagName('img'));

    if (imgList && imgList.length > 0) {
      if (imgList.length >= 2) {
        this.logger.warn(
          'There are more than 2 images in the Picture field. Use the PrimaryDefinitionPicture field if you wish to add more than one image.'
        );
      }
      return imgList[0];
    }

    return null;
  }

  private hasDisplayImg() {
    return this.dhImgContainer.innerHTML.length > 0; // TODO check this function to make sure it works
  }

  private attemptAddImageFromTags(): HTMLImageElement | null {
    // perhaps move to arguments?
    // for now, image stylizer will remain specifically for one card

    if (this.hasDisplayImg()) {
      return null;
    }

    const tagToImgList = getOption(
      'imgStylizer.setMainImageFromTags'
    ) as unknown as TagToImgList;
    for (const tagToImg of tagToImgList) {
      const tags = tagToImg.tags;
      if (arrContainsAnyOf(this.cardTags, tags)) {
        const fileName = tagToImg.fileName;

        const newImg = document.createElement('img');
        newImg.src = fileName;
        this.dhImgContainer.appendChild(newImg);
        this.dhRight.classList.toggle(clsContainsImg, true);
        this.dhLeftAudioBtns.classList.toggle(clsAudioBtnsLeft, true);
        return newImg;
      }
    }

    return null;
  }

  private adjustForNoImg() {
    // TODO nothing is necessary it seems!
  }

  private addClickToZoom(ele: HTMLImageElement) {
    this.dhImgContainer.classList.toggle(clsImgClick, true);

    ele.onclick = () => {
      this.modal.style.display = 'block';
      this.modalImg.src = ele.src;
    };
  }

  private setCanBlur(ele: HTMLElement) {}

  private stylizePrimaryDefGlossaryPics() {}

  private stylizeOtherGlossaryPics() {}

  private setFloatImgPosition() {}

  private modalInit() {
    // close the modal upon click
    this.modal.onclick = () => {
      this.modalImg.classList.add('modal-img__zoom-out');
      this.modal.classList.add('modal-img__zoom-out');

      setTimeout(() => {
        this.modal.style.display = 'none';
        this.modalImg.className = 'modal-img';
        this.modal.className = 'modal';
      }, 200);
    };
  }

  main() {
    let imgEle = this.getDisplayImg();
    this.adjustHeight(this.dhRight);

    if (imgEle === null) {
      imgEle = this.attemptAddImageFromTags();
    }

    if (imgEle === null) {
      this.adjustForNoImg();
    } else {
      this.adjustHeight(imgEle);
      this.addClickToZoom(imgEle);
      imgEle.classList.add(clsRightImg);

      if (getOption('imgStylizer.mainImage.blur.enabled')) {
        this.setCanBlur(imgEle);
      }
    }

    this.modalInit();

    if (getOption('imgStylizer.glossary.primaryDef.enabled')) {
      this.stylizePrimaryDefGlossaryPics();
    }

    if (getOption('imgStylizer.glossary.other.enabled')) {
      this.stylizeOtherGlossaryPics();
    }

    if (getOption('imgStylizer.glossary.floatImg.enabled')) {
      // covers primarydefinitionpicture (left & right!)
      this.setFloatImgPosition();
    }
  }
}

export class ImgStylizer extends RunnableModule {
  private readonly cardSide: CardSide;

  constructor(cardSide: CardSide) {
    super('imgStylizer');
    this.cardSide = cardSide;
  }

  main() {
    let imgBlur = null;

    if (getOption('imgStylizer.mainImage.blur.enabled')) {
      imgBlur = new ImgBlur();
      imgBlur.imgBlurDisplaySetting();
    }

    // almost all the logic of this module is only done on the back side of the card anyways
    if (this.cardSide === 'back') {
      const backStylizer = new BackImgStylizer(imgBlur);
      backStylizer.main();
    }
  }
}
