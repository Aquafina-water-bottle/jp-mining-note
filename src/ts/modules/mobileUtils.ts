import { RunnableModule } from '../module';
import { isMobile } from '../utils';
import { fieldsAnyFilled, getFieldValue } from '../fields';

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
  }
}
