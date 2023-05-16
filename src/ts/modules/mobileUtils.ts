import { RunnableModule } from '../module';
import { isAndroid, isMobile } from '../utils';
import { fieldsAnyFilled } from '../fields';

export class MobileUtils extends RunnableModule {
  constructor() {
    super('mobileUtils');
  }

  main() {
    if (!isMobile()) {
      return;
    }

    // removes the hover effect for mobile displays only
    if (fieldsAnyFilled('IsClickCard')) {
      document
        .getElementById('display')
        ?.classList.toggle('expression__hybrid--click-hover-effect', false);
    }

    if (isAndroid()) {
      const textBenderDef = document.querySelector(`.glossary__external-links a[data-details="yomichan-textbender-definition"]`) as HTMLAnchorElement | null;
      if (textBenderDef) {
        // grabs all bolded text in the definition, if it exists
        let boldText = ""
        for (const boldTextEle of document.querySelectorAll(`#primary_definition_raw_text b`)) {
          boldText += boldTextEle.textContent;
        }
        if (boldText.length > 0) { // bold text was actually found
          textBenderDef.href = `textbender://x?x=${boldText}`;
        }
      }
    }
  }
}
