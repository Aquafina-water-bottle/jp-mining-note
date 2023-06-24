import { RunnableModule } from '../module';
import { addOnShownHook, getCardSide, hybridClick, getPAIndicator } from '../utils';
import { fieldsAnyFilled, fieldsAllFilled } from '../fields';
import { translatorStrs } from '../consts';
import { getOption } from '../options';
import {type GlobalEventManager, hasKey} from '../globalEventManager';

// this function has to be moved out of the class in order for the kebind to run???
function toggleHighlightWord() {
  const sentenceShownAttr = 'data-sentence-shown';

  let paButton = document.getElementById('pa_button');
  let d = document.getElementById('display');
  if (paButton === null || d === null) {
    return;
  }

  if (paButton.hasAttribute(sentenceShownAttr)) {
    // (currently) shown -> hide
    paButton.removeAttribute(sentenceShownAttr);
    paButton.textContent = translatorStrs['show-word-button'];
    d.classList.toggle('highlight-bold', false);
  } else {
    // (currently) hidden -> show
    paButton.setAttribute(sentenceShownAttr, 'true');
    paButton.textContent = translatorStrs['hide-word-button'];
    d.classList.toggle('highlight-bold', true);
  }
}


function sentenceKeybinds(e: KeyboardEvent) {
  if (hasKey(e, getOption('keybinds.toggleHybridSentence'))) {
    hybridClick();
  }

  if (hasKey(e, getOption('keybinds.toggleHighlightWord'))) {
    toggleHighlightWord();
  }
}

export class MainCardUtils extends RunnableModule {
  private readonly globalEventManager;

  constructor(globalEventManager: GlobalEventManager) {
    super('mainCardUtils');

    this.globalEventManager = globalEventManager;
  }

  main() {
    this.globalEventManager.addKeybindFunc('sentenceKeybinds', sentenceKeybinds);

    if (
      getCardSide() === 'back' &&
      fieldsAllFilled('IsClickCard') &&
      getOption('clickCardRevealSentenceOnBackSide')
    ) {
      hybridClick();
    }

    if (fieldsAnyFilled('PAShowInfo')) {
      const paIndicators = document.querySelectorAll('.pa-indicator');
      for (const paInd of paIndicators) {
        let circ = paInd.children[0].children[0];
        let svgTitle = circ.children[0];

        svgTitle.textContent =
          translatorStrs['pa-indicator-prefix'] + getPAIndicator().tooltip;
        circ.classList.add(getPAIndicator().className);
      }

      let paButton = document.getElementById('pa_button');
      if (paButton !== null) {
        paButton.onclick = () => {
          toggleHighlightWord();
        };
      }
    }
  }
}
