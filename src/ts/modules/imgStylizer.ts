import { Module, RunnableModule } from '../module';
//import { ImgBlur } from "./imgBlur"
import { compileOpts, translatorStrs } from '../consts';
import { checkOptTags, getOption } from '../options';
import {
  arrContainsAnyOf,
  getCardSide,
  getTags,
  isMobile,
  popupMenuMessage,
} from '../utils';
import { fieldIsFilled } from '../fields';
import { InfoCircleSetting } from './infoCircleSetting';
import { getViewportWidth, adjustElements } from '../reflow';

type TagToImg = {
  tag: string;
  fileName: string;
};
type TagToImgList = TagToImg[];
type StylizeType = 'float' | 'collapse' | 'none';
type FloatImgPos = 'bottom' | 'top' | 'right' | 'auto';

type AddClickToImgArgs = {
  addClickClass?: boolean;
  imgEle?: HTMLImageElement;
};

/*
 * BackImgBlurController
 * ImgBlur
 * BackImgStylizer
 *
 * ImgStylizer
 */

const clsNoDefinition = 'glossary-primary-definition--no-definition';

const clsBlurFilterInit = 'img-blur-filter-init';
const clsBlurFilter = 'img-blur-filter';
const clsBlurFilterDisable = 'img-blur-filter-disable';

const clsImgClick = 'img-clickable';
const clsRightImg = 'dh-right__img';
const clsWordImgBoxHasImg = 'def-header--has-img';
const clsWordImgBoxNoImg = 'def-header--no-img';
const clsWordImgBoxTextImg = 'def-header--text-img'; // if it's text only, *has-img is still added!
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
      // ??? -> never blurred
      this.removeImgBlur();
      if (!this.imgBlur.cardIsMarked()) {
        // removes if necessary (non-marked image forced to be blurred -> no longer forced)
        // recall that the picture eye is always shown on marked cards
        this.hidePictureEye();
      }
    } else if (state === 1) {
      // ??? -> blur only if marked
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

    this.backImgStylizer.addClickToZoom(this.imgEle, { addClickClass: true });

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
    return arrContainsAnyOf(getTags(), getOption('imgStylizer.mainImage.blur.tags'));
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
  private readonly primaryDefBlockquote = document.getElementById(
    'primary_definition'
  ) as HTMLElement;
  private readonly wordImgBox = document.getElementById('def_header') as HTMLElement;

  readonly dhImgContainer = document.getElementById('dh_img_container') as HTMLElement;

  private readonly imgBlur: ImgBlur | null;

  constructor(imgBlur: ImgBlur | null) {
    super('sm:backImgStylizer');
    this.imgBlur = imgBlur;
  }

  private getDisplayImg(): HTMLImageElement | null {
    if (!fieldIsFilled('Picture')) {
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

  private attemptAddImageFromTags(): HTMLImageElement | null {
    // perhaps move to arguments?
    // for now, image stylizer will remain specifically for one card

    if (fieldIsFilled('Picture')) {
      // don't do anything if there's already something in the Picture field
      return null;
    }

    const tagToImgList = getOption(
      'imgStylizer.setMainImageFromTags'
    ) as unknown as TagToImgList;
    for (const tagToImg of tagToImgList) {
      const tag = tagToImg.tag;
      if (getTags().includes(tag)) {
        //if (arrContainsAnyOf(TAGS_LIST, tags)) {
        const fileName = tagToImg.fileName;

        const newImg = document.createElement('img');
        newImg.src = fileName;
        this.dhImgContainer.appendChild(newImg);
        this.wordImgBox.classList.toggle(clsWordImgBoxHasImg, true);
        this.wordImgBox.classList.toggle(clsWordImgBoxNoImg, false);
        //this.dhLeftAudioBtns.classList.toggle(clsAudioBtnsLeft, true);
        return newImg;
      }
    }

    return null;
  }

  private adjustForNoImg() {
    if (fieldIsFilled('Picture')) {
      // text only field!
      this.wordImgBox.classList.toggle(clsWordImgBoxTextImg, true);
    } else {
      // completely empty
      //this.wordImgBox.classList.toggle(clsWordImgBoxNoImg, true);
      // the above should already be done by templates
    }
  }

  addClickToZoom(ele: HTMLElement, args?: AddClickToImgArgs) {
    let imgEle: HTMLElement = ele;
    if (args !== undefined) {
      if (args.imgEle !== undefined) {
        imgEle = args.imgEle;
      }
      if (args.addClickClass) {
        // defaults to false
        imgEle.classList.toggle(clsImgClick, true);
      }
    }

    // we assume that ele is HTMLImageElement if there's no custom imgEle in the args
    ele.onclick = () => {
      this.modal.style.display = 'block';
      this.modalImg.src = (imgEle as HTMLImageElement).src;
    };
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

    const stylizeMode = checkOptTags(getTags(), [
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
    defAnc.textContent = translatorStrs['image-hover-text'];
    defAnc.setAttribute('data-suppress-link-hover', 'true');

    const defImg = document.createElement('img');
    defImg.classList.add('glossary__image-hover-media');
    defImg.src = imgName;

    this.addClickToZoom(defImg);
    this.addClickToZoom(defAnc, { imgEle: defImg });

    defSpan.appendChild(defAnc);
    defSpan.appendChild(defImg);

    if (isMobile()) {
      // always hidden on mobile, must tap text to see image
      //defImg.classList.toggle("hidden", true); // this doesn't work?
      defImg.style.display = 'none';
    }

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

    if (stylizeModeYomichan === 'none') {
      // force do-not-convert for all yomichan images
      const imgTags = Array.from(this.primaryDefRawText.getElementsByTagName('img'));
      for (const imgEle of imgTags) {
        if (imgEle.src.includes('yomichan_dictionary_media')) {
          imgEle.setAttribute('data-do-not-convert', 'true');
        }
      }
    } else {
      // looks for yomichan inserted images
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

  private stylizeOtherGlossaryPics() {
    const textNotPrimary =
      '.glossary-text--raw-text:not(.glossary-text--raw-text-primary)';
    const searchEles = Array.from(
      document.querySelectorAll(textNotPrimary)
    ) as HTMLElement[];
    for (const searchEle of searchEles) {
      this.convertYomichanImgs(searchEle, /*toFloat=*/ false);
    }
  }

  private getFloatImgPos(): FloatImgPos {
    let defaultPos = getOption('imgStylizer.glossary.floatImg.position');

    const floatImgPos = checkOptTags(getTags(), [
      ['imgStylizer.glossary.floatImg.overrideTags.bottom', 'bottom'],
      ['imgStylizer.glossary.floatImg.overrideTags.top', 'top'],
      ['imgStylizer.glossary.floatImg.overrideTags.right', 'right'],
    ]);

    if (floatImgPos === undefined) {
      return defaultPos as FloatImgPos;
    }
    return floatImgPos;
  }

  /* sets position, and make clickable to zoom */
  private stylizeFloatImg() {
    if (this.floatImgRight.innerHTML.length === 0) {
      this.logger.debug('PrimaryDefinitionPicture is empty. Nothing has to be done.', 2);
      return;
    }

    let floatImgPos = this.getFloatImgPos();

    // Overrides because if there is no text, and there is no override,
    // then the image will not show at all. There's no reason why an image
    // should be placed on the right if there's no definition anyways.
    if (
      floatImgPos === 'right' &&
      this.primaryDefBlockquote.classList.contains(clsNoDefinition)
    ) {
      floatImgPos = 'top';
    }

    this.logger.debug(`float image position: ${floatImgPos}`);

    // resets default
    if (floatImgPos === 'bottom') {
      this.primaryDefBlockquote.classList.add('glossary-blockquote--picture-below');
    } else if (floatImgPos === 'top') {
      this.primaryDefBlockquote.classList.add('glossary-blockquote--picture-above');
    } else if (floatImgPos === 'right') {
      this.primaryDefBlockquote.classList.toggle(
        'glossary-primary-definition--auto-no-lenience',
        false
      );
    }

    const imgList = Array.from(this.floatImgRight.getElementsByTagName('img')).concat(
      Array.from(this.floatImgLeft.getElementsByTagName('img'))
    );
    for (const imgEle of imgList) {
      this.addClickToZoom(imgEle, { addClickClass: true });
    }
  }

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
    if (imgEle === null) {
      imgEle = this.attemptAddImageFromTags();
    }

    adjustElements(imgEle, this.dhLeft, this.dhRight);

    if (imgEle === null) {
      this.adjustForNoImg();
    } else {
      this.addClickToZoom(imgEle, { addClickClass: true });
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
      this.stylizeFloatImg();
    }
  }
}

export class ImgStylizer extends RunnableModule {
  constructor() {
    super('imgStylizer');
  }

  // public interface to get image element
  getDisplayImg() {
    const dhImgContainer = document.getElementById('dh_img_container');
    if (dhImgContainer === null) {
      return null;
    }

    const imgEleList = dhImgContainer.getElementsByTagName('img');
    if (!imgEleList) {
      return;
    }

    return imgEleList[0];
  }

  main() {
    let imgBlur = null;

    if (getOption('imgStylizer.mainImage.blur.enabled')) {
      imgBlur = new ImgBlur();
      imgBlur.displaySetting();
    }

    // almost all the logic of this module is only done on the back side of the card anyways
    if (getCardSide() === 'back') {
      const backStylizer = new BackImgStylizer(imgBlur);
      backStylizer.main();
    }
  }
}
