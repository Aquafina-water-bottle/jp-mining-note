import { Module, RunnableModule } from '../module';
//import { ImgBlur } from "./imgBlur"
import { compileOpts, translatorStrs } from '../consts';
import { checkOptTags, getOption } from '../options';
import {
  arrContainsAnyOf,
  CardSide,
  isMobile,
  popupMenuMessage,
  TAGS_LIST,
  VW,
} from '../utils';
import { InfoCircleSetting } from './infoCircleSetting';

type TagToImg = {
  tags: string[];
  fileName: string;
};
type TagToImgList = TagToImg[];
type StylizeType = 'float' | 'collapse' | 'none';

/*
 * BackImgBlurController
 * ImgBlur
 * BackImgStylizer
 *
 * ImgStylizer
 */

const clsPrimDefRawImg = 'glossary-primary-definition__raw-img';
const clsNoDefinition = 'glossary-primary-definition--no-definition';

const clsBlurFilterInit = 'img-blur-filter-init';
const clsBlurFilter = 'img-blur-filter';
const clsBlurFilterDisable = 'img-blur-filter-disable';

const clsContainsImg = 'dh-right--contains-image';
const clsAudioBtnsLeft = 'dh-left__audio-buttons--left';
const clsImgClick = 'dh-right__img-container--clickable';
const clsRightImg = 'dh-right__img';
const clsShowEye = 'dh-right__show-eye';

const settingId = 'info_circle_text_settings_img_blur_toggle';
const persistKey = 'jpmn-img-blur';

// TODO? this is probably better implemented within HTML/css
// like how the info circle settings work
const EYE_PATH_RAW =
  'M12 9a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5 5 5 0 0 1 5-5 5 5 0 0 1 5 5 5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5Z';
const EYE_OFF_PATH_RAW =
  'M11.83 9 15 12.16V12a3 3 0 0 0-3-3h-.17m-4.3.8 1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22 21 20.73 3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7Z';

class BackImgBlurController extends Module {
  private readonly backImgStylizer: BackImgStylizer;
  private readonly imgBlur: ImgBlur;

  private readonly dhImgBlur = document.getElementById(
    'dh_img_container_blur_wrapper'
  ) as HTMLElement;
  private readonly imgEye = document.getElementById('img_svg_eye') as HTMLElement;
  private readonly imgEle: HTMLImageElement;

  private imgCurrentlyBlurred: boolean = false;

  constructor(
    backImgStylizer: BackImgStylizer,
    imgBlur: ImgBlur,
    imgEle: HTMLImageElement
  ) {
    super('sm:backImgBlurController');
    this.backImgStylizer = backImgStylizer;
    this.imgBlur = imgBlur;
    this.imgEle = imgEle;
  }

  initImageBlur() {
    const state = this.imgBlur.setting.getCurrentState();
    if (state !== undefined) {
      this.setImageBlurToState(state, true);
    }

    this.imgEye.onclick = () => {
      if (this.imgCurrentlyBlurred) {
        // should be blurred -> not blurred
        this.removeImgBlur();
      } else {
        // not blurred -> should be blurred
        this.addImgBlur();
      }
    };
  }

  // shows / hides the picture eye entirely
  hidePictureEye() {
    this.dhImgBlur.classList.toggle(clsShowEye, false);
  }
  showPictureEye() {
    this.dhImgBlur.classList.toggle(clsShowEye, true);
  }

  // toggles the visibile state of the eye
  pictureEyeBlur() {
    this.imgEye.children[0].setAttributeNS(null, 'd', EYE_OFF_PATH_RAW);
  }
  pictureEyeNoBlur() {
    this.imgEye.children[0].setAttributeNS(null, 'd', EYE_PATH_RAW);
  }

  setImageBlurToState(state: number, init = false) {
    if (state === 0) {
      // always blurred -> never blurred
      this.removeImgBlur();
      if (!this.imgBlur.cardIsMarked()) {
        // removes if necessary (non-marked image forced to be blurred -> no longer forced)
        // recall that the picture eye is always shown on marked cards
        this.hidePictureEye();
      }
    } else if (state === 1) {
      // never blurred -> blur only if marked
      if (!this.imgBlur.cardIsMarked()) {
        // NOTE: can reach here on init as well
        this.removeImgBlur();
        this.hidePictureEye();
      } else if (!this.imgCurrentlyBlurred && this.imgBlur.cardIsMarked()) {
        this.addImgBlur(init);
      }
    } else if (state === 2) {
      // ??? -> always blurred
      this.addImgBlur(init);
    } else {
      this.logger.warn(`Invalid image blur state: ${state}`);
    }
  }

  addImgBlur(init = false) {
    // removes disable filter
    this.dhImgBlur.classList.toggle(clsBlurFilterDisable, false);

    // adds blur, prevents animation from playing on init
    if (init) {
      this.dhImgBlur.classList.toggle(clsBlurFilterInit, true);
    } else {
      this.dhImgBlur.classList.toggle(clsBlurFilter, true);
    }

    this.backImgStylizer.removeClickToZoom(this.imgEle);

    this.showPictureEye();
    this.pictureEyeBlur();

    this.imgCurrentlyBlurred = true;
  }

  removeImgBlur() {
    // adds disable filter
    this.dhImgBlur.classList.toggle(clsBlurFilterDisable, true);

    // removes blur filter
    this.dhImgBlur.classList.toggle(clsBlurFilterInit, false);
    this.dhImgBlur.classList.toggle(clsBlurFilter, false);

    this.backImgStylizer.addClickToZoom(this.imgEle);

    this.pictureEyeNoBlur();

    this.imgCurrentlyBlurred = false;
  }
}

class ImgBlur extends Module {
  readonly setting = new InfoCircleSetting(settingId, persistKey);

  private controller: BackImgBlurController | null = null;

  constructor() {
    super('sm:imgBlur');
  }

  setController(controller: BackImgBlurController) {
    this.controller = controller;
  }

  cardIsMarked() {
    return arrContainsAnyOf(TAGS_LIST, getOption('imgStylizer.mainImage.blur.tags'));
  }

  displaySetting() {
    // internally, states are represented as numbers
    const defaultStateMap = {
      never: 0,
      'only-tagged': 1,
      always: 2,
    };
    const defaultStateStr = getOption('imgStylizer.mainImage.blur.startState');
    let defaultState = 0;
    if (defaultStateStr in defaultStateMap) {
      defaultState = defaultStateMap[defaultStateStr as keyof typeof defaultStateMap];
    }

    // init
    this.setting.initDisplay(defaultState);

    // toggle state
    this.setting.btn.onclick = () => {
      const newState = this.setting.getNextState();
      if (newState === 0) {
        popupMenuMessage('No images will be blurred.');
      } else if (newState === 1) {
        popupMenuMessage('Tagged images will be blurred.');
      } else if (newState === 2) {
        popupMenuMessage('All images will be blurred.');
      } else {
        // 2
        this.logger.warn(`Invalid image blur state: ${newState}`);
        return;
      }
      this.setting.displayAs(newState);

      if (this.controller !== null) {
        this.controller?.setImageBlurToState(newState);
      }
    };
  }
}

class BackImgStylizer extends Module {
  //private readonly cardTags = TAGS_LIST;

  // these shouldn't ever be null...
  // TODO rename def-header? "header" makes 0 sense here lol
  // "word box" makes more sense?
  private readonly dhRight = document.getElementById('dh_right') as HTMLElement;
  private readonly dhLeft = document.getElementById('dh_left') as HTMLElement;
  private readonly dhLeftAudioBtns = document.getElementById(
    'dh_left_audio_buttons'
  ) as HTMLElement;
  private readonly modal = document.getElementById('modal') as HTMLElement;
  private readonly modalImg = document.getElementById('bigimg') as HTMLImageElement;
  private readonly floatImgRight = document.getElementById(
    'primary_definition_right_img'
  ) as HTMLImageElement;
  private readonly floatImgLeft = document.getElementById(
    'primary_definition_left_img'
  ) as HTMLImageElement;
  private readonly primaryDefRawText = document.getElementById(
    'primary_definition_raw_text'
  ) as HTMLImageElement;
  readonly dhImgContainer = document.getElementById('dh_img_container') as HTMLElement;

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
      if (arrContainsAnyOf(TAGS_LIST, tags)) {
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

  addClickToZoom(ele: HTMLElement, imgEle?: HTMLImageElement) {
    this.dhImgContainer.classList.toggle(clsImgClick, true);

    if (imgEle === undefined) {
      // seems like typescript requires some code repetition here
      // likely due to impure function shenanigans
      ele.onclick = () => {
        this.modal.style.display = 'block';
        this.modalImg.src = (ele as HTMLImageElement).src;
      };
    } else {
      ele.onclick = () => {
        this.modal.style.display = 'block';
        this.modalImg.src = imgEle.src;
      };
    }
  }

  removeClickToZoom(ele: HTMLImageElement) {
    this.dhImgContainer.classList.toggle(clsImgClick, false);
    ele.onclick = () => null;
  }

  private setCanBlur(imgEle: HTMLImageElement) {
    if (this.imgBlur === null) {
      return; // nothing to do!
    }
    const controller = new BackImgBlurController(this, this.imgBlur, imgEle);
    this.imgBlur.setController(controller);
    controller.initImageBlur();
  }

  private getStylizeMode(modeType: 'yomichan' | 'user'): StylizeType {
    let defaultMode = getOption(`imgStylizer.glossary.primaryDef.mode.${modeType}`);

    const stylizeMode = checkOptTags(TAGS_LIST, [
      [`imgStylizer.glossary.primaryDef.mode.${modeType}.tagOverride.float`, 'float'],
      [
        `imgStylizer.glossary.primaryDef.mode.${modeType}.tagOverride.collapse`,
        'collapse',
      ],
      [`imgStylizer.glossary.primaryDef.mode.${modeType}.tagOverride.none`, 'none'],
      ['imgStylizer.glossary.primaryDef.mode.general.tagOverride.float', 'float'],
      ['imgStylizer.glossary.primaryDef.mode.general.tagOverride.collapse', 'collapse'],
      ['imgStylizer.glossary.primaryDef.mode.general.tagOverride.none', 'none'],
    ]);

    if (stylizeMode === undefined) {
      return defaultMode as StylizeType;
    }
    return stylizeMode;
  }

  private createImgContainer(imgName: string) {
    // creating this programmically:
    // <span class="glossary__image-container">
    //   <a class="glossary__image-hover-text" href='javascript:;'</a>
    //   <img class="glossary__image-hover-media" src="${imgName}">
    // </span>

    const defSpan = document.createElement('span');
    defSpan.classList.add('glossary__image-container');

    const defAnc = document.createElement('a');
    defAnc.classList.add('glossary__image-hover-text');
    defAnc.href = 'javascript:;';
    defAnc.textContent = translatorStrs["image-hover-text"];
    defAnc.setAttribute('data-suppress-link-hover', 'true');

    const defImg = document.createElement('img');
    defImg.classList.add('glossary__image-hover-media');
    defImg.src = imgName;

    this.addClickToZoom(defImg);

    if (!isMobile()) {
      // prevents clicking on the image link to zoom (on mobile)
      this.addClickToZoom(defAnc, defImg);
    }

    defSpan.appendChild(defAnc);
    defSpan.appendChild(defImg);

    return defSpan;
  }

  private convertYomichanImgs(searchEle: HTMLElement, toFloat = false) {
    const anchorTags = searchEle.getElementsByTagName('a');
    for (const atag of Array.from(anchorTags)) {
      const imgFileName = atag.getAttribute('href');
      if (imgFileName && imgFileName.substring(0, 25) === 'yomichan_dictionary_media') {
        this.logger.debug(
          `Converting yomichan image ${imgFileName} (toFloat=${toFloat})...`
        );

        if (toFloat) {
          const imgEle = document.createElement('img');
          imgEle.src = imgFileName;

          this.floatImgRight.appendChild(imgEle.cloneNode(true));
          this.floatImgLeft.appendChild(imgEle); // moves element away

          atag.parentNode?.removeChild(atag);
        } else {
          const fragment = this.createImgContainer(imgFileName);
          atag.parentNode?.replaceChild(fragment, atag);
        }
      }
    }
  }

  private stylizePrimaryDefGlossaryPics() {
    const stylizeModeUser = this.getStylizeMode('user');
    const stylizeModeYomichan = this.getStylizeMode('yomichan');

    // looks for yomichan inserted images
    if (stylizeModeYomichan !== 'none') {
      this.convertYomichanImgs(this.primaryDefRawText, stylizeModeYomichan === 'float');
    }

    // looks for user inserted images
    if (stylizeModeUser !== 'none') {
      const imgTags = Array.from(this.primaryDefRawText.getElementsByTagName('img'));
      for (const imgEle of imgTags) {
        if (
          imgEle.classList.contains('glossary__image-hover-media') || // already converted
          imgEle.getAttribute('data-do-not-convert') // does not require converting
        ) {
          continue;
        }

        this.logger.debug(
          `Converting user-inserted image ${imgEle.src} with mode ${stylizeModeUser}...`
        );

        if (stylizeModeUser === 'collapse') {
          const fragment = this.createImgContainer(imgEle.src);
          imgEle.parentNode?.replaceChild(fragment, imgEle);
        } else {
          this.floatImgRight.appendChild(imgEle.cloneNode(true));
          this.floatImgLeft.appendChild(imgEle); // moves element away
        }
      }
    }
  }

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
      imgBlur.displaySetting();
    }

    // almost all the logic of this module is only done on the back side of the card anyways
    if (this.cardSide === 'back') {
      const backStylizer = new BackImgStylizer(imgBlur);
      backStylizer.main();
    }
  }
}
