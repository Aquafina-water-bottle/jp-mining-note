import { getOption } from '../options';
import { Module } from '../module';
import { VW } from '../utils';
import { compileOpts } from '../consts';
import { Logger } from '../logger';

export class ImgUtilsMin extends Module {

  main() {
    const logger = new Logger('imgUtilsMin');

    // restricting the max height of image to the definition box
    const dhImgContainer = document.getElementById('dh_img_container');
    const READ_DHLEFT_HEIGHT =
      VW > compileOpts['breakpoints.combinePicture'] &&
      getOption('imgUtils.resizeHeightMode') === 'auto-height';

    function adjustHeight(ele: HTMLElement) {
      if (READ_DHLEFT_HEIGHT) {
        ele.style.maxHeight = HEIGHT_LEFT + 'px';
      } else if (getOption('imgUtils.resizeHeightMode') === 'fixed') {
        const newHeight = getOption('imgUtils.resizeHeightFixedValue');
        ele.style.maxHeight = newHeight + 'px';
      }
    }

    if (dhImgContainer === null) {
      return;
    }

    let somethingDisplayed = dhImgContainer.innerHTML.length > 0;
    let HEIGHT_LEFT = 0;

    if (somethingDisplayed) {
      const dhLeft = document.getElementById('dh_left');
      const dhRight = document.getElementById('dh_right');

      if (dhLeft === null || dhRight === null) {
        return;
      }

      if (READ_DHLEFT_HEIGHT) {
        HEIGHT_LEFT = dhLeft.offsetHeight;
      }
      adjustHeight(dhRight);

      const imgList = dhImgContainer.getElementsByTagName('img');
      if (imgList && imgList.length) {
        if (imgList.length >= 2) {
          logger.warn(
            'There are more than 2 images in the Picture field. Use the PrimaryDefinitionPicture field if you wish to add more than one image.'
          );
        }

        let image = imgList[0];
        image.classList.add('dh-right__img');
        adjustHeight(image); // restricts max height here too
      }

      // minimal version: not clickable by default
      const imgClickClassName = 'dh-right__img-container--clickable';
      dhImgContainer.classList.remove(imgClickClassName);
    }
  }
}
