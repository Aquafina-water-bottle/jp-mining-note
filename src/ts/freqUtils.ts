import { Module } from './module';
import { getOption } from './options';

export class FreqUtils extends Module {
  private readonly freqDisplay = document.getElementById('frequencies_display');
  private readonly freqOverflow = document.getElementById('frequencies_overflow');
  private readonly freqOverflowText = document.getElementById('frequencies_overflow_tooltip');

  private readonly maxFreqCount = getOption('freqUtils.max');
  private readonly overflowCount = getOption('freqUtils.overflow');
  private readonly collapseFreqCount = this.maxFreqCount + this.overflowCount;

  private collapseFrequencies() {
    if (this.freqDisplay === null || this.freqOverflow === null || this.freqOverflowText === null) {
      return;
    }

    for (let i = this.freqDisplay.children.length - 1; i > this.maxFreqCount - 1; i--) {
      let child = this.freqDisplay.children[i];
      this.freqOverflowText.prepend(child);
    }

    this.freqOverflow.classList.toggle('hidden', false);
  }

  run() {
    // it seems like using .innerHTML has worse performance than
    // just re-calculating everything again
    // subtract 1 because the overflow indicator is already in the group
    if (this.freqDisplay !== null && this.freqDisplay.children.length > this.collapseFreqCount) {
      this.logger.debug('Collapsing frequencies...');
      this.collapseFrequencies();
    }
  }
}
