/**
 * controls the display of the mobile popup (bottom half of the screen)
 */

import {Module} from "./module";
import {translatorStrs} from "./consts";
import {WordIndicator} from "./modules/wordIndicators";

export class MobilePopup extends Module {
  private readonly ele = document.getElementById('mobile_popup') as HTMLElement | null;
  private readonly textEle = document.getElementById('mobile_popup_text') as HTMLElement | null;
  //private readonly titleEle = document.getElementById('mobile_popup_title') as HTMLElement | null;
  //private readonly titleTextEle = document.getElementById('mobile_popup_title_text') as HTMLElement | null;
  private readonly titleCloseEle = document.getElementById('mobile_popup_title_close') as HTMLElement | null;
  private readonly wrapperEle = document.getElementById('mobile_popup_wrapper') as HTMLElement | null;
  private readonly mainEle = document.querySelector(".card-main") as HTMLElement | null;
  private wordIndsGroupEle: HTMLElement | null = null;
  private kanjiEles: Array<Element> | null = null;

  // gets the actual tooltip contents, since the current output is
  getKanjiHoverTooltip(hoverHTML: string): string {
    // TODO cache?
    // NOTE: this is highly dependent on the output of the kanji hover popup!

    // temporary element to do html parsing on
    const temp = document.createElement('span');
    temp.innerHTML = hoverHTML;
    const contents = temp.querySelector('.hover-tooltip-wrapper > .hover-tooltip');
    return contents?.innerHTML ?? '';
  }

  resetSelectionIndicators() {
    const eles = this.wordIndsGroupEle?.querySelectorAll(".card-description__word-indicator")
    if (eles !== undefined) {
      for (const ele of eles) {
        // remove any highlight, if exists
        ele.classList.toggle("card-description__word-indicator--selected", false);
      }
    }

    if (this.kanjiEles !== null) {
      for (const ele of this.kanjiEles) {
        ele.classList.toggle("dh-left__reading--kanji-selected", false);
      }
    }
  }

  adjustCardHeight(mainEle: HTMLElement, popupEle: HTMLElement, wrapperEle: HTMLElement) {
    // adjusts the card height so the user can scroll up to the top of the popup window
    // ASSUMPTION: this function is ran AFTER the text is set

    // forces a reflow, but this is not ran in card initialization, so this is a safe performance hit
    const wrapperHeight = wrapperEle.offsetHeight;
    const popupHeight = popupEle.offsetHeight;

    mainEle.style.marginBottom = `calc(${wrapperHeight/2 + popupHeight/2}px + 2vh)`; // 2vh is for any additional padding
  }

  resetCardHeight(mainEle: HTMLElement) {
    mainEle.style.removeProperty("margin-bottom")
  }

  setupWordIndicator(ind: WordIndicator, groupEle: HTMLElement | null, tooltipHTML: string) {
    // ASSUMPTION: this function is only called if tooltipHTML has actual content in it (len > 0)

    this.wordIndsGroupEle = groupEle;

    const indEle = ind.infoCircIndicatorEle; // shorthand
    if (indEle === null || groupEle === null) {
      this.logger.warn(`Cannot display indicator: ${ind.label}`)
      return;
    }
    indEle.classList.toggle("hidden", false);

    indEle.onclick = () => {
      this.resetSelectionIndicators();

      if (this.ele === null || this.wrapperEle === null || this.mainEle === null || this.textEle === null) {
        return;
      }
      const previousIndLabel = this.ele.querySelector("[data-word-indicator-search]")?.getAttribute("data-word-indicator-search");

      const baseEle = document.createElement("div");
      const label = ind.label;
      baseEle.setAttribute("data-word-indicator-search", label);

      if (this.wrapperEle.classList.contains('hidden') || (previousIndLabel !== null && previousIndLabel !== label)) {
        // hidden -> shown
        baseEle.innerHTML = tooltipHTML;
        this.wrapperEle.classList.toggle('hidden', false);

        // show tooltip
        this.textEle.innerHTML = ""
        this.textEle.appendChild(baseEle);
        this.adjustCardHeight(this.mainEle, this.ele, this.wrapperEle);

        // visually select
        indEle.classList.toggle("card-description__word-indicator--selected", true);
      } else {
        // shown -> hidden
        this.wrapperEle.classList.toggle('hidden', true);
        this.resetCardHeight(this.mainEle);
      }
    }
  }

  setupKanjiHover(
    kanjiToHoverHTML: Record<string, string>,
    wordReadingEle: HTMLElement,
    wordReadingRubyHTML: string
  ) {
    if (Object.keys(kanjiToHoverHTML).length > 0) {
      const re = new RegExp(Object.keys(kanjiToHoverHTML).join('|'), 'gi');
      const resultHTML = wordReadingRubyHTML.replace(re, function (matched) {
        return `<span data-kanji-hover="${matched}">${matched}</span>`;
      });
      wordReadingEle.innerHTML = resultHTML;
    }

    // onclick listeners to show popup
    const kanjiEles = wordReadingEle.querySelectorAll('span[data-kanji-hover]');
    this.kanjiEles = Array.from(kanjiEles);

    for (const kanjiEle of kanjiEles) {
      (kanjiEle as HTMLElement).onclick = () => {
        this.resetSelectionIndicators();

        if (this.ele === null || this.wrapperEle === null || this.mainEle === null || this.textEle === null) {
          this.logger.warn(`Cannot display kanji for kanji hover`)
          return;
        }

        const previousKanji = this.ele.querySelector("[data-kanji-search]")?.getAttribute("data-kanji-search");

        const baseEle = document.createElement("div");
        const kanji = kanjiEle.getAttribute('data-kanji-hover');
        baseEle.setAttribute("data-kanji-search", kanji ?? "");

        // TODO generalize this, i.e. X button, etc.
        if (this.wrapperEle.classList.contains('hidden') || (previousKanji !== null && previousKanji !== kanji)) {
          // hidden -> shown
          if (kanji !== null && kanji in kanjiToHoverHTML) {
            baseEle.innerHTML = this.getKanjiHoverTooltip(kanjiToHoverHTML[kanji]);
          }
          this.wrapperEle.classList.toggle('hidden', false);

          // shows text
          this.textEle.innerHTML = ""
          this.textEle.appendChild(baseEle);
          this.adjustCardHeight(this.mainEle, this.ele, this.wrapperEle);

          // visually select
          kanjiEle.classList.toggle("dh-left__reading--kanji-selected", true);
        } else {
          // shown -> hidden
          this.wrapperEle.classList.toggle('hidden', true);
          this.resetCardHeight(this.mainEle);
        }
      };
    }

    if (this.titleCloseEle !== null) {
      this.titleCloseEle.onclick = () => {
        // shown -> hidden
        this.resetSelectionIndicators();
        this.wrapperEle?.classList.toggle('hidden', true);
        if (this.mainEle !== null) {
          this.resetCardHeight(this.mainEle);
        }
      }
    }
  }
}
