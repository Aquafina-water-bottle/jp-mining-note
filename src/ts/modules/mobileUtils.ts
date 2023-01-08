import { RunnableModule } from '../module';
import { fieldAnyExist, isAndroid, isMobile } from '../utils';

export class MobileUtils extends RunnableModule {

  constructor() {
    super("mobileUtils");
  }

  main() {
    if (!isMobile()) {
      return;
    }

    //const logger = new Logger("mobileUtils")

    // removes the hover effect for mobile displays only
    if (fieldAnyExist('IsClickCard')) {
      document
        .getElementById('display')
        ?.classList.toggle('expression__hybrid--click-hover-effect', false);
    }

    if (isAndroid()) {
      // Stylizes the play button for ankidroid
      const betterPlayBtn = `<svg class="android-play-button-svg" viewBox="0 0 64 64" version="1.1"> <circle cx="32" cy="32" r="29"></circle> <path d="M56.502,32.301l-37.502,20.101l0.329,-40.804l37.173,20.703Z"></path> </svg>`;

      function generateSVG() {
        const x = document.createElement('span');
        x.innerHTML = betterPlayBtn;
        return x.children[0];
      }

      const eles = document.querySelectorAll('.android .replaybutton svg');
      for (const ele of eles) {
        ele?.parentNode?.replaceChild(generateSVG(), ele);
      }
    }
  }
}
