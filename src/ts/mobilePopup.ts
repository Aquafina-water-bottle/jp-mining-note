/**
 * controls the display of the mobile popup (bottom half of the screen)
 */
export class MobilePopup {
  private readonly ele = document.getElementById('mobile_popup') as HTMLElement | null;

  transformKanjiHover(hoverHTML: string): string {
    // TODO cache
    // NOTE: this is highly dependent on the output of the kanji hover popup!

    // temporary element to do html parsing on
    const temp = document.createElement('span');
    temp.innerHTML = hoverHTML;
    const contents = temp.querySelector('.hover-tooltip-wrapper > .hover-tooltip');
    return contents?.innerHTML ?? '';
  }

  displayKanjiHover(
    kanjiToHoverHTML: Record<string, string>,
    wordReadingEle: HTMLElement,
    wordReadingRubyHTML: string
  ) {
    const re = new RegExp(Object.keys(kanjiToHoverHTML).join('|'), 'gi');
    const resultHTML = wordReadingRubyHTML.replace(re, function (matched) {
      return `<span data-kanji-hover="${matched}">${matched}</span>`;
    });

    wordReadingEle.innerHTML = resultHTML;

    // onclick listeners to show popup
    const kanjiEles = wordReadingEle.querySelectorAll('span[data-kanji-hover]');
    for (const kanjiEle of kanjiEles) {
      (kanjiEle as HTMLElement).onclick = () => {
        if (this.ele === null) {
          return;
        }

        const previousKanji = this.ele.querySelector(".mobile-popup--kanji-hover")?.getAttribute("data-kanji");
        this.ele.innerHTML = ""

        const baseEle = document.createElement("div");
        baseEle.classList.add("mobile-popup--kanji-hover");
        const kanji = kanjiEle.getAttribute('data-kanji-hover');
        baseEle.setAttribute("data-kanji", kanji ?? "");

        // TODO generalize this, i.e. X button, etc.
        if (this.ele.classList.contains('hidden') || (previousKanji !== null && previousKanji !== kanji)) {
          // hidden -> shown
          if (kanji !== null && kanji in kanjiToHoverHTML) {
            baseEle.innerHTML = this.transformKanjiHover(kanjiToHoverHTML[kanji]);
          }
          this.ele.classList.toggle('hidden', false);
        } else {
          // shown -> hidden
          this.ele.classList.toggle('hidden', true);
        }
        this.ele.appendChild(baseEle);
      };
    }
  }
}
