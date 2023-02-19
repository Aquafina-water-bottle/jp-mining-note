import { RunnableModule } from '../module';
import { getOption } from '../options';
import { fieldNoneExist, fieldAnyExist } from '../utils';

export class FreqUtils extends RunnableModule {
  private readonly freqDisplay = document.getElementById('frequencies_display');
  private readonly freqOverflow = document.getElementById('frequencies_overflow');
  private readonly freqOverflowText = document.getElementById(
    'frequencies_overflow_tooltip'
  );

  constructor() {
    super('freqUtils');
  }

  private listAll() {
    if (
      this.freqDisplay === null ||
      this.freqOverflow === null ||
      this.freqOverflowText === null
    ) {
      return;
    }

    const maxFreqCount = getOption('freqUtils.listAll.max');
    const overflowCount = getOption('freqUtils.listAll.overflow');
    const collapseFreqCount = maxFreqCount + overflowCount;
    const showSummaryMode = getOption('freqUtils.listAll.showSummaryMode');

    if (
      showSummaryMode === 'never' ||
      (showSummaryMode === 'if-frequencies-empty' &&
        this.freqOverflowText.children.length !== 0)
    ) {
      // only thing inside should be the summary stuff
      this.freqDisplay.innerHTML = '';
    }

    if (this.freqOverflowText.children.length <= collapseFreqCount) {
      // moves all from overflow -> frequencies
      // this if statement is required in order for the overflowCount variable to work!
      for (let i = this.freqOverflowText.children.length - 1; i >= 0; i--) {
        let child = this.freqOverflowText.children[i];
        this.freqDisplay.prepend(child);
      }
    } else {
      // only moves a limited amount of frequencies over
      let child = this.freqOverflowText.firstElementChild;
      while (child !== null && this.freqDisplay.children.length < maxFreqCount) {
        this.freqDisplay.prepend(child);
        child = this.freqOverflowText.firstElementChild;
      }
    }

    if (this.freqOverflowText.children.length === 0) {
      this.freqOverflow.classList.toggle('hidden', true);
    }
  }

  main() {
    if (getOption('freqUtils.displayMode') === 'list-all') {
      this.listAll();
    } else if (fieldNoneExist('FrequencySort') && fieldAnyExist('FrequenciesStylized')) {
      this.listAll();
    }
  }
}
