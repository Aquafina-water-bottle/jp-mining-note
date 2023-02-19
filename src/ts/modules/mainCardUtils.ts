import { RunnableModule } from '../module';
import { fieldAnyExist, hybridClick, paIndicator } from '../utils';
import { translatorStrs } from '../consts';
import {addKeybindFunc, hasKey} from './keybinds';
import {getOption} from '../options';

export class MainCardUtils extends RunnableModule {

  constructor() {
    super("mainCardUtils");
  }

  private toggleHighlightWord() {
    const sentenceShownAttr = "data-sentence-shown";

    let paButton = document.getElementById("pa_button");
    let d = document.getElementById("display");
    if (paButton === null || d === null) {
      return;
    }

    if (paButton.hasAttribute(sentenceShownAttr)) {
      // (currently) shown -> hide
      paButton.removeAttribute(sentenceShownAttr);
      paButton.textContent = translatorStrs['show-word-button'];
      d.classList.toggle("highlight-bold", false);

    } else {
      // (currently) hidden -> show
      paButton.setAttribute(sentenceShownAttr, "true");
      paButton.textContent = translatorStrs['hide-word-button'];
      d.classList.toggle("highlight-bold", true);
    }
  }


  // TODO how to do keybinds???
  private sentenceKeybinds(e: KeyboardEvent) {
    if (hasKey(e, getOption("keybinds.toggleHybridSentence"))) {
      hybridClick();
    }

    if (hasKey(e, getOption("keybinds.toggleHighlightWord"))) {
      let paButton = document.getElementById("pa_button");
      if (paButton !== null) {
        this.toggleHighlightWord();
      }
    }
  }

  main() {
    addKeybindFunc("sentenceKeybinds", this.sentenceKeybinds);

    if (fieldAnyExist('PAShowInfo')) {
      const paIndicators = document.querySelectorAll('.pa-indicator');
      for (const paInd of paIndicators) {
        let circ = paInd.children[0].children[0];
        let svgTitle = circ.children[0];

        svgTitle.textContent =
          translatorStrs['pa-indicator-prefix'] + paIndicator.tooltip;
        circ.classList.add(paIndicator.className);
      }

      let paButton = document.getElementById("pa_button");
      if (paButton !== null) {
        paButton.onclick = this.toggleHighlightWord;
      }

      // auto-plays silence
      let elem = document.querySelector("#pa_silence_audio .soundLink, #pa_silence_audio .replaybutton");
      if (elem) {
        (elem as HTMLAnchorElement).click();
      }

    }
  }
}
