
TODO gif showing the main features of the card type

Documentation currently under the [wiki](https://github.com/Aquafina-water-bottle/jp-mining-note/wiki).
Documentation is still WIP but is mostly done.

## Main Features (Card Creation Workflow)
* All cards are **automatically created** and populated within seconds, with:
   * Definitions (with **automatic separation** of bilingual and monolingual definitions, using any combination of dictionaries)
   * Word pitch accent, audio, and frequency list information
   * The selected sentence with the tested word automatically highlighted
   * Automatically generated furigana on the selected sentence
   * (Optional) scene image and sentence audio

## Main Features (Card Features)
* Supports **both sentence and vocab** cards
* Supports (currently experimental) card types:
  [TSC](https://tatsumoto.neocities.org/blog/discussing-various-card-templates.html#targeted-sentence-cards-or-mpvacious-cards),
  [Fallback Cards](https://tatsumoto.neocities.org/blog/discussing-various-card-templates.html#fallback-cards),
  [Hybrid Cards](https://github.com/Aquafina-water-bottle/jp-mining-note/wiki/Experimental#hybrid-vocab-card))
* Support for **cloze-deletion** card types
* Support for **both monolingual and bilingual** definitions
* Support for various ways of **testing pitch accent**
   * Word level pitch accent
   * Sentence level pitch accent
   * Test the pitch accent in the same card or with different cards
   * Or don't test it at all!
* Customizable front display to show and test anything you want
* Optional hint (front-side)
* Collapsible fields to hide non-crucial info (back-side)
* Displays furigana (on mouse hover), frequency list information, and word pitch accent info
* Click on any image to zoom in (in a similar style to Discord)

## Limitations
* No support for mobile
* Stylization is for my personal anki theme (default dark mode) and screen resolution (1920x1080). TODO use em units rather than px units
* See customization section (TODO link) for further points


## TODO:
* Add proper documentation:
  * Links to Anki documentation for specific vocab (i.e. notes vs cards)
  * What I test myself on for each type of card
  * Features
  * Fields
  * How to setup mandatory Anki plugins
  * How to setup Yomichan (templates and anki fields)
* Add sample cards to releases



