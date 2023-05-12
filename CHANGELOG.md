# Changelog
The last 3 numbers (# in X.#.#.#) follow semantic versioning.


The first number (X in X.#.#.#) is an arbitrary number that I decide for
when the card passes a specific stage (i.e. 0 == pre-release, 1 = release, and
subsequent bumps are when the card has changed enough that a bump should be
signified.)


Historically, the 2nd number was bumped up for different reasons,
but now, the 2nd number will have a constant representation:
it is bumped when the Anki database schema becomes different
from the previous version.
This specifically happens when the fields are edited in any way
(renamed, moved, added, removed, etc.)

When the database schema changes, a user cannot automatically update their cards
by simply installing a new version of the .apkg package,
and must use `./install.py --update`.


## [0.12.0.0] - 2022-12-??

#### BREAKING
- Added fields:
    - `YomichanWordTags`
    - `AltDisplayAudioCard`
    - `IsHintCard`
    - `IsSentenceFirstCard`
    - `IsAudioCard`
    - `SeparateSentenceAudioCard`
    - `CardCache`
    - TODO is there more?
- Renamed fields:
    - `SeparateClozeDeletionCard` -> `SeparateAudioCard`
- Removed lenience calculation (height of the text box is no longer calculated) due to an internal javascript bug that I can't figure out how to resolve

- Options rework: Your current runtime options file will be completely invalid! See here to fix it: TODO

#### Features

- Themes:
    - Proper way of defining user settings in a more portable way
    - Allows custom html, CSS, compile-time options & runtime options
        - NOTE: currently doesn't allow custom javascript / typescript
    - See `themes` folder for some examples

- Mobile (and other screen sizes) now have 1st class support
    - Completely reworked the mobile design (TODO link?)
        - Info circle shows as a dialog instead of a popup, on mobile
        - Blockquotes are shown in togglable tags rather than collapsible fields
        - Image now shows to the right of the word, and play buttons to the bottom left of the card
    - Fixed silence playing not working on Ankidroid
    - Uses system fonts for Ankidroid in order to make loading times sane
    - Added a height media query to make the card smaller for lower screen resolutions
    - `cache.ts` was added to allow caching of kanji hover and word indicator results in the card itself
        - This means that kanji hover and word indicators have results on mobile!
    - Made kanji hover and word indicator results show better on mobile (via a popup at the bottom half of the screen)

- Backend Javascript rework: (TODO)
    - Javascript has been finally ported to Typescript & webpack
    - Added unit testing for various modules

- Builder & Options rework:
    - Flattened all compile-time options and runtime options.
    - Moved compile-time options to its own json file
    - Most config files now use .json5 for human readability purposes (and can be switched with json for portability)
        - Removed deprecated importlib in favor of these json config files

- JPMN Manager
    - A small Anki add-on was released specifically to install and update jp-mining-note.
        This prevents people from having to install Python and run scripts through command line.

- Added styles to the editor view:
    - Merge some editor fields into the same row
    - Group together related fields by separating them with a slightly larger gap
    - Moved a bunch of fields around to work with the newly grouped together fields

- Primary definition picture rework:
    - Cleaned up CSS and made CSS a lot more readable
    - Added ability to override the position of the picture through tags
    - Picture can now be positioned above the definition
    - Lenience value is now removed due to a bug I can't seem to fix (height px could not be read)
    - Increased the size of the PrimaryDefinitionPicture img by default if there is no text in PrimaryDefinition

- Sentence Parser:
    - Added the `autoHighlightWord` module, to [automatically highlight the word](https://aquafina-water-bottle.github.io/jp-mining-note/ui/#automatic-word-highlighting) if the word isn't highlighted
        - Works on both the display sentence and furigana sentence
        - Thanks to [Marv](https://github.com/MarvNC/JP-Resources#anki-automatically-highlight-in-sentence) for the idea and base implementation
    - Added option to fix the div list problem for sentences
    - Added better support for parsing the full sentence (from sentUtils)
        - i.e. searches the full sentence to remove quotes.
    - Added better compile-time and runtime options for how quotes are displayed / not displayed

- Auto Pitch Accent:
    - Pitch accent color groups are now applied to the graphs on each individual word
    - AJTWordPitch field can now be read to extract the pitch accent position info
        - This means that the field can be used as a pitch accent color group as a last resort fallback
    - Tweaked the pitch accent display so the downstep is a bit more obvious
    - Added support for automatic detection of kifuku accents on verbs (using `YomichanWordTags`)
    - Added an option to show the reading without pitch accent info if no pitch accent info was found
    - Words in the pitch accent should no longer wrap in between a word unexpectedly
    - Pitch accent coloring now affects the accent in the definitions by default
    - Pitch accent coloring is now shown in tooltips (kanji hover / word indicators)
    - Tone of certain colors were slightly changed so they stand out a bit more

- New Card Types:
    - Hint Sentence (`IsHintCard`)
        - Adds the sentence below the vocab (hover and click cards are also affected)
        - TODO link
    - Sentence First Sentence (`IsSentenceFirstCard`)
        - Adds the word below the sentence (so the reader must read the full sentence, but only tests on the word)
        - TODO link
    - Audio (`IsAudioCard`)
        - Allows testing of the entire sentence, or just the word
        - TODO link

- Pitch accent indicator:
    - Pitch accent indicator has been moved to the middle of the header (right above the word)
    - Ideally, pitch accent indicator should be to the left of the word as before (so the user can see it first, then test accordingly). However, this incurred too much dev time to support (many strange edge cases had to be supported, such as making sentences look good, etc.) and since it's a feature that I imagine most people don't use, I decided to move it to the header (even if it's a subpar solution) since it's much easier to maintain there.
    - Removed lots of html / css bloat pertaining to this pitch accent indicator

- Frequency display changes:
    - Frequency changed to show summary (the FreqSort field) by default instead of listing all frequencies
    - Added a dropdown feature for frequencies when there are too many frequencies
        - For the current display mode (`summary`), hides all other frequencies in the dropdown
        - For the legacy display mode (`list-all`), collapses after 4-6
    - Added "unknown" display on default values (where the value itself is hidden on mobile)

- Info Circle:
    - Added spacing between options in the info circle
    - Added clear cache option in info circle options (disabled by default)
    - Added tags display (default: only shown on the back side)
        - These can be clicked on to search for the tag
        - All data tags (tags used to modify the look of the card) are greyed by default
    - Display the card version here for mobile now

- Other (larger changes):
    - Added runtime options to simplify the definitions as an alternative to CSS
        - TODO link
    - Added way to translate the card (and added English and Japanese as pre-supported options)
        - TODO link
    - Added compile-time options to specify how ruby can be displayed in the full sentence
        - TODO link

- Other (smaller changes):
    - Added `jpmn-filled-if-word-is-hiragana` yomichan templates marker
    - Re-added way to specify whether newlines are removed or not, using css
    - Added support to remove the primary definition blockquote if nothing is there
    - Added a warning if `SentenceReading` is filled but `Sentence` isn't
    - Added a shadow around images shown on hover (images under `[Image]`) to better distinguish them between background objects
    - Added example external link for [textbender](https://github.com/elizagamedev/android-textbender)
        - Sends the raw sentence field by default
    - Added styling for inline `<code>` blocks. For example, the following sentence taken from the rust book
        is now formatted nicely:
        ```
        新しい言語を学ぶ際に、<code>Hello, world!</code>というテキストを画面に<b>出力</b>する小さなプログラムを書くことは伝統的なことなので、ここでも同じようにしましょう！
        ```
    - Kanji hover now searches sentences if there aren't enough results to be shown from just words
    - Kanji hover should no longer immediately activate on card flip (when the mouse is idling over the kanji),
        unless already cached
    - Logger class now supports better filtering of messages and better console output
    - Made the 頭高 (red) pitch accent color slightly deeper, to better differentiate it from 中高 (orange)
    - Word indicators now load on the front side of the card instead of the back
    - Custom scss folders can now be defined in overrides and themes
    - Added "data tags", i.e. tags that are greyed out in the info circle

#### Fixes
- Fixed img blur eye not being on the image for wider images
- Made all example urls use {{text:Word} instead of just {{Word}}
- Fixed some css variables accidentally pointing to others
- Fixed pa-indicator not being the proper size on sentences / TSCs
- Fixed `PrimaryDefinitionPicture` not acting like a float right when there's too much text
    - When text extends past to below the picture, it is expected that the text takes up the space below the picture
- (auto-pitch-accent module) Changed nasal assert to nasal warning
- Fixed cloze deletion cards with nested `<b>` tags not working properly
- Fixed highlight-word not properly escaping regex
- Fixed nasal replace regex not working sometimes (when character is escaped)

#### 0.12.0.0 Pre-release Changelog

<details>
<summary> Pre-release 7 </summary>

**Fixes**:
- `console.warn` and `console.error` breaking AnkiMobile (they are now disabled by default)

</details>



<details>
<summary> Pre-release 6 </summary>

**Features**:
- `--override-styling` flag for `install.py` to override user CSS
- Card cache script now supports command line arguments, making it usable to the public
- Constrained width of display sentence to be similar to the full sentence
- `cardCache.enabled` RTO (`CardCache` is now disabled on PC by default)
- `_modifyActions` in `runtime_opts.json` (not in `_jpmn-options.js`) so one can edit lists and dicts
    without having to replace the entire runtime option

**Fixes**:
- Un-bolded more things on mobile
- Audio buttons are now completely hidden on AnkiMobile
- `fixRubyPositioning.enabled` is now `false` for all devices (to fix AnkiMobile's uncentered furigana)
- Card refreshes now persist changes to kanji hover and word indicators for the session
- Keys in "overrides" RTO can now be properly overwritten with `runtime_opts.json` files

</details>




<details>
<summary> Pre-release 5 </summary>

**Features**:
- Added custom CSS section at the bottom of the template, that should be preserved between updates
- Runtime options are automatically replaced on 0.12.0.0 update
- Added warning when `SentenceReading` is not the same as `Reading`

**Fixes**:
- Sentence parser now doesn't add quotes on empty sentences (even if the mode is to add quotes)
- Removed newlines in mobile popup
- Removed bold weight in mobile popup
- Kanji hover on mobile display with ruby text but no kanji no longer shows raw html
- Ignore 2.1.62 error


</details>


<details>
<summary> Pre-release 4 </summary>

This pre-release primarily changes some internals with how word indicators work,
but should not have any outward affecting changes. As always, please let me know
if anything looks off.

**Features**:
- Implemented caching word indicators with cache.ts
- Reworked mobile tooltip (kanji hover, word indicators):
    - Added close button
    - Height is automatically fitted to the content
    - Additional height is added to the main card to allow scrolling past the tooltip
    - Kanji and word indicator is highlighted on selection
- cache.ts now writes for every 10 cards (just in case)


</details>


<details>
<summary> Pre-release 3 </summary>

**Fixes**:
- Fixed `img-yomichan-no-styling` not working as expected (it got stylized as a user image instead)
- Temporarily made info circle links point to pre-release docs instead of the standard docs, to prevent confusion
- Fixed ignoring wrong SentenceReading warning


</details>



<details>
<summary> Pre-release 2 </summary>

**Features**:
- Info circle shows as a dialog instead of a popup (mobile only)
- Added source map files to main card type, for easier debugging of production files
- Added "data tags", i.e. tags that are greyed out in the info circle
- Added runtime options to simplify the definitions as an alternative to CSS

**Fixes**:
- Custom scss folders are now applied in the correct order
- Frequencies popup no longer cuts off to the right on mobile
- Frequencies popup now has a smaller max width, to hopefully not takeup the entire width of the mobile screen
- Unbolded some text on mobile, to avoid lines in the kanji looking squished together

</details>




## [0.11.0.4] - 2023-04-10
#### Fixes
- Fixed the default config to now ignore two errors:
    - An [Anki internal error](https://forums.ankiweb.net/t/windows-console-error-uncaught-typeerror-cannot-read-properties-of-null-reading-style/29185)
        introduced in Anki 2.1.61 for Windows users:
        ```
        Uncaught TypeError: Cannot read properties of null (reading 'style')
            at Ar (reviewer.js:7:112035)
        ```
    - Fixed `ReferenceError: EFDRC is not defined` error not being properly ignored.

Due to implementation details, default config changes are **not propagated between updates**
(this will be changed in 0.12.0.0).
Therefore, if you experience either error, you must manually replace the `ignored-errors`
key in the
[runtime options](https://aquafina-water-bottle.github.io/jp-mining-note/runtimeoptions/#accessing-editing)
with the following:
```js
      // Errors that contain the following the following strings will be ignored and not displayed.
      "ignored-errors": [
        // This error is caused by the "Edit Field During Review (Cloze)" add-on.
        // However, this error only appears during the preview and edit cards template windows.
        // This error does not appear to actually affect any of the internal javascript within the card,
        // and is rather caused by the add-on itself.
        // Due to the card's error catcher, this previously-silent error is now caught and shown
        // in the card's error log, despite it not actually affecting anything.
        // Therefore, this error can be safely ignored.
        "ReferenceError: EFDRC is not defined",

        // Vanilla Anki 2.1.61 seems to introduce this error on Windows. It doesn't seem to affect
        // anything visible, so hopefully this is fine to ignore.
        // Related report: https://forums.ankiweb.net/t/29185
        "/_anki/js/reviewer.js:7:112035)"
      ],
```



## [0.11.0.3] - 2022-12-21
#### Fixes
- Fixed links having the wrong color on Anki v2.1.55
- Fixed kanji hover: replace method occasionally adds text when unnecessary


## [0.11.0.2] - 2022-11-21
#### Fixes
- Fixed `PAPositions` field erroring if edited with the standard templates
- Fixed `PAPositions` field not being properly parsed if it is just text (e.g. `[0]`)


## [0.11.0.1] - 2022-11-20
#### Fixes
- Fixed `TIME_PERFORMANCE` not defined error for click cards



## [0.11.0.0] - 2022-11-19
#### Breaking Changes
- Added fields: `PAOverrideText`, `PrimaryDefinitionPicture`, `WordReadingHiragana`

#### Features
- Modules:
    - Added similar words indicators (`word-indicators` module)
        - Indicators are shown for: same kanji, same reading, duplicates
    - Moved `info-circle-togglable-lock` to the `info-circle-utils` module
        - Added various mobile-related support to the info circle
    - Added `img-utils-minimal` as a counterpart to `img-utils` for people who want a lighter card
    - Revamped `auto-pitch-accent` module:
        - Added support for various formats in `PAOverride` (csv numbers, and text with downsteps)
        - Added source on hover support (hover over the pitch accent to see where the pitch was gotten from)
    - Added a way to fix ruby positioning for legacy Anki versions (`fix-ruby-positioning` module)
    - Added way to time the performance of the javascript (`time-performance` module)
- Added the `PrimaryDefinitionPicture` field
    - Specifies a picture that is always shown to the right of the primary definition
    - Can be technically anything else though, like a table, text, etc.
- Improved tooltips (affects `word-indicators` and `kanji-hover`):
    - Added pitch accent on tooltips
        - Enabled for both `kanji-hover` and `same-word-indicator` by default
        - Requires you to hover over the word/sentence for kanji-hover by default
    - Added logic to overflow between categories (e.g. 6 new & 0 old will now show 6 new instead of 2 new)
    - Added ability to click on words in a tooltip to view it within Anki
- Runtime options:
    - Added way to specify different values for mobile and PC
    - Combined `toggle-states-pc` and `toggle-states-mobile` -> `toggle-states`
    - Renamed `nsfw-toggle` -> `image-blur`
    - Added a new type of `viewport-width-is`
    - Added:
        - `modules.img-utils.add-image-if-contains-tags`
        - `modules.sent-utils.remove-final-period`
        - `modules.sent-utils.remove-final-period-on-altdisplay`
        - `modules.customize-open-fields.open-on-new-enabled`
        - `enable-ankiconnect-features`
- Changed error messages to be displayed in standard monospace font, for better readability
- Added compile-options to allow external links to be in the `PrimaryDefinition` field
- Revamped the documentation layout quite a bit, to now include tabs in the header
- Added the `jpmn-sentence-bolded-furigana-plain` header to yomichan templates
- Added the `dict-group__glossary--first-line` to the templates to allow the removal of the first line with css
- Ignore errors from batch functions by default

#### Fixes
- Fixed a bug on AnkiDroid where all javascript fails on the front side of the main card type
- Fixed keybinds not working on capslock / capital letters
- Made strings in queries escaped by default
- Fixed mora with the nasal marker not showing properly on tooltips
- Fixed `make.py` not working on windows (encoding errors, template files not found)
- Fixed AJT Word readings not being properly found on words split with "、"
- Removed `--highlight-bold-shadow` (variable is no longer added automatically in the fields with css injector)

#### Fixes (for new updates)
- Fixed number parser not handling non-integer values properly
- Properly handles undefined timer result
- Fixed balancing operation of tooltip filter cards (now uses integer div instead of float div)

#### Internal Changes
- Added a simple dependencies system for modules, so functions can be shared easier between modules
- Refactored AutoPA & KanjiHover classes to have most functions to be in the returned class itself
- Moved out multiple functions into a bunch of smaller sub-modules:
    - `jp-utils`: functions for dealing with the Japanese language itself (e.g. hiragana -> katakana)
    - `tooltip-builder`: creates tooltips for kanji-hover and word-indicators
    - `anki-connect-actions`: helper module to use anki-connect
    - `check-duplicate-key`: checks whether the key is a duplicate (moved from the `cardIsNew` function)
- Fixed a bug with item(javascript=True) when it returns a dictionary (now parses into json)
- Added color change when highlighting over URLs
- `kanji-hover` card cache is now cached in as an element instead of strings to improve performance
- Changed the implementation of the tooltip builder to use `hover-tooltip__sent-div` to remove the bold for a sentence instead of a regex replace (lol)
    - This allows custom CSS to re-bold the highlighted word in the sentence again
- Added some basic support to mobile (media queries on various screen widths)
    - Mobile is still not officially supported (not all desired features are implemented yet)
- Made the `img-utils` module a bit faster by grouping together the .offsetHeight calls + only calling them if necessary
    - Prevents unnecessary reflows
- Added a debug div within the info circle to display monospaced debug messages
- Added additional css to be able to remove the "(N/A)" display


## [0.10.3.0] - 2022-10-21

#### Features
- Added some documentation links to common errors / warnings that can appear
- Added compile options to specify external links as icons or text
- Added nsfw toggle to img-utils module
    - clickable inputs: info circle eye, image eye
- Clicking on the info circle now freezes the tooltip window
    - Togglable with the `info-circle-togglable-lock` option, enabled by default

#### Fixes
- Fixed a bug with one-mora 平板 words not showing the proper reading within the pitch accent field
- Added support to the old orthographic dictionary name for proper table alignment
- `customize-open-fields` module now works even if neither `PAGraphs` and `UtilityDictionaries` are present

#### Internal Changes
- Added an `isHtml` function param to `logger.warn` and `logger.error`
- Changed the `modules` from a list to dictionary (in order to make it easier to check if the module is enabled or not)
- Added a popup menu function (not very flexible currently, as it will not scale well with large messages)
- Added debugging levels from 0-5 (default is 3)


## [0.10.2.1] - 2022-10-15

#### Features
- ShareX image + clipboard hotkey now attempts to highlight the tested word within the clipboard

#### Fixes
- (hotkey.py) Updating the sentence from the clipboard no longer produces newlines
- Fixed a bug in the Yomichan templates that grabs the last found definition instead of the first
- Added a hack to ensure that triple-click no longer copies extra text in the texthooker page
- Example config now has modules ordered in the correct position

#### Internal Changes
- Source powershell code in jpresources is now syntax highlighted


## [0.10.2.0] - 2022-10-02
Final major update before public beta!

Note: changing the layout of the changelog from this point forward.

#### Features
- templates overrides folder option
- formal ability to separate css: ("css-folders") option in config
- full support for light mode
- automatic pitch accent coloring for the tested word (disabled by default)
- handlebars support to selection-text:
    - highlight a dictionary to override the PrimaryDefinition
    - highlight a section of the definition to override the PrimaryDefinition + bold it
        - if cannot find highlighted section, fallsback to normal selection-text
- `keybinds-enabled` compile-time option
- `hardcoded-runtime-options` compile-time option

#### Fixes
- `_field.css` not being included on export
- `EFDRC is not defined` error showing on the card
    - Added `ignored-errors` in config to ignore this error
- bolded `AJTWordPitch` field not being parsed properly
- fixed `always-filled-fields` and `never-filled-fields` not working properly with compile options

#### Internal Changes

- Added `NoteToUser` action class
- Added tests to some macros and field simulator
- added `_editor.css` on build and export
    - updated documentation

- changed example module to print hello world
- layout of templates: every variable in the `common.html` files were moved into
  individual files: `partials/variable_name.html`
    - allows users to override these partials easier (inspired by material mkdocs)
- combined legacy display with regular display in main card type
- cleaned up most of the python code (removed commented code, added type hinting, etc.)
- cleaned up scss a bit
    - separated exact functionality from the name, i.e. `bold-yellow` -> `highlight-bold`
- changed internal build system to work with custom css
- separated other_definitions partial into each blockquote's partial
- handlebars `jpmn-get-dict-type` function: no longer requires `[object Object]` in the `X-dict-regex` options
- changed `jpmn-frequencies` handlebars to match the other handlebars (removed outer class and inner2 class)
- removed attempts to remove newlines in various handlebars code within javascript
- renamed `any_of` -> `if_any` and `none_of` -> `if_none`
- changed compile options comment at the top to only include the compile-options section
    - moved `css-folders` to be under `compile-options` in `config.py`
- added try catch wrapper around errorStack to ensure the message gets called
- `--ignore-order` flag now ignores the MoveField action, and always adds fields at the end of the list

- fixed `_standardize_frequencies_styling` not working on all `inner2` classes in `batch.py`
- fixed `def_header` macro being defined twice for some reason
- field tests now properly runs (using `Verifier`)





## [0.10.1.0] - 2022-09-18
Primarily a back-end only update.

#### Added
- re-implemented compile time options for always-filled and never-filled
- comment at the top of all cards with the compile-time options

#### Changed
- cleaning up the code:
    - moved javascript code out into their own `modules` folder under `templates`
      (and included them in the compile time options)
        - added example module main.js
    - generalized "open extra info on new" into its own module
    - turned the logger definition a class, and changed the global logger object from `logger` to `LOGGER`
    - id `Display` -> `display`
    - replaced as many `let` statements with `const`
    - changed javascript modules to return classes, in the format of:
       ```
       const CLASS_NAME = (() => {
         // private variables and functions

         class CLASS_NAME {
           // public functions
         }

         return CLASS_NAME;
       })();
       ```
       - with their own individual logger objects
    - moved paIndicator to a main card only variable
    - added try/catches around each module's javascript "run" sections
       - if one module breaks, the entire card doesn't break
    - encapsulated all "run" code into main function

#### Fixed
- `replaceAll` -> `replace` with `g` flag, to support older versions of Anki (qt5)
- AJTWordPitch field not having the proper css for bolded words



## [0.10.0.1] - 2022-09-05

#### Added
- `search-for-ajt-word` js option

#### Changed
- Minor stylistic changes
    - JPDB's "X" emote changed to a non-colored version in Yomichan Templates
    - Changed margin-bottom of lists from 10px to 0.3em to better match font sizes

#### Fixed
- Clicking on inserted images not working
- Certain readings not converting to ruby properly due to manually inserted spaces (`&nbsp;`)
- Kanji Hover tooltip not having a max-width


## [0.10.0.0] - 2022-09-04

#### Changed (BREAKING)
- Added fields (`PAOverride`, `PAPositions`)
    - `PAPositions` requires updated Yomichan templates
- Renamed field `WordPitch` -> `AJTWordPitch`


#### Added
- Added support for showing pitch accent using only Yomichan's `pitch-accent-positions` template
    - as well as customly from AJT Pitch accent & ways to overwrite both
- Added fields (`PAOverride` and `PAPositions`)
- `jpmn-test-dict-type` and `jpmn-pitch-accent-positions` yomichan template markers
  to bottom.txt
- Uses `Sentence` if `SentenceReading` is empty
    - Option to warn if `SentenceReading` is empty
- Warning if `IsHoverCard` and `IsClickCard` are both filled
- Option to disable `searchImages` (for {{edit:FIELD}} compatability

#### Changed
- regex options in Yomichan templates to be more clear in documentation
    - added "ADD_x_DICTIONARIES_HERE" strings
- Backend javascript to be more modulized (so far, modulized auto pitch accent, kanji hover, images)

#### Fixed
- `??` operator not working on legacy anki versions (changed to use `nullish` function instead)
- duplicate key wrongly detecting the same note with different cards


## [0.9.1.1] - 2022-08-31
#### Fixed
- `media.css` now properly renamed to `_media.css`
- Fixed extra info not properly opening on some new cards


## [0.9.1.0] - 2022-08-30

#### Added
- Added `FrequencySort` field
- Settings:
    - Kanji hover query
    - Kanji hover enable/disable
    - Kanji hover activation mode (only run on first hover, or run as soon as the back-side is open)
- Frequency sort support in batch and yomichan templates
    - Note: not updating the yomichan templates does not break the card functionality,
      so this is not a breaking change
- Open extra info field on new feature
- Caps lock warning
- Options to specify max number of words per category in the kanji hover tooltip
- User inserted images now also change to the [Image] / hover / click to zoom property
  that Yomichan images have

#### Fixed
- Field simulator bug with move field
- Installing from scratch not working
- Cloze-deletion cards not having sentence audio at the front


## [0.9.0.0] - 2022-08-28

#### Changed (BREAKING)
- yomichan templates:
    - unified one option for monolingual / bilingual
    - added "unused dictionaries" section, takes priority over all other searches
    - removed "No pitch accent data" in favor of an empty field
    - added "JMDict Surface Forms" to utility dict and "日本語文法辞典" to bilingual dict regex
    - added a span around each dictionary glossary entry
- renamed `silence.wav` -> `_silence.wav`
- added an additional inner html field around the downstep arrow so css can automatically remove it
    - requires a change to the AJT pitch accent plugin config

#### Changed
- collapsable fields are now greyed out instead of gone (no option for this yet)
- added css to center elements in the orthographic forms dictionary
- removed prettier dependency, added JSON-minify dependency
- separated `config/example_config.py` into {
     `config/example_config.py`,
     `config/jpmn_opts.jsonc`,
     `tools/note_files.py` } to prevent having to regenerate the config file on version updates
- made install.py work when updating a card to:
    - edit existing fields in place
    - warn the user on updates outside anki (e.g. config changes, yomichan templates, etc.)
- added kanji hover (to display which kanjis were used in previous cards)


## [0.8.1.1] - 2022-08-15

#### Fixed
- settings variable not being defined causing an error
- a bug regarding sentences occasionally being off-center (due to the frequencies)


## [0.8.1.0] - 2022-08-14

#### Changed
- Options file layout (no longer breaking as every option has defaults now)
- Quotes now generate by default (and even if javascript fails to run entirely)

#### Removed
- Smallest sentence option (adds bloat, don't think people will use it when better alternatives exist)


## [0.8.0.0] - 2022-08-13

#### Changed (BREAKING)
- Changed the serif font family to NotoSerif
- Added bold variants to both serif and sans
- Requires an update to the media folder with the new font files

#### Added
- css to no longer select furigana (note: text is still copied on linux)
- stack trace to error messages
- initial sharex shortcuts (powershell scripts) to tools

#### Changed
- Completely reworked the backend generation of cards to use jinja2
- Renamed:
    - `refresh.py` -> `main.py`
    - `update.py` -> `install.py`
    - `generate.py` -> `make.py`
- Reworked the directory structure of the project

#### Fixed
- The async race condition (undid all changes to use script src)


## [0.7.0.1] - 2022-07-26

#### Fixed
- Changed the promise into an async / await function at the cost of code separation
    - Previous fix to promises didn't work upon any card flip...


## [0.7.0.0] - 2022-07-26

#### Changed (BREAKING)
- Changed `PADictionaries` -> `UtilityDictionaries`

#### Changed
- More changes to yomichan templates, still WIP
- Added options file to be automatically updated from ./update.py

#### Fixed
- Properly handled script (options file) asynchronously loading
- Properly handled the promise to not execute twice



## [0.6.0.1] - 2022-07-17

#### Fixed
- Generating pitch accent (sentence and word) cards despite not specifying to


## [0.6.0.0] - 2022-07-16

#### Changed (BREAKING)
- Changed `PADoNotShowInfo` -> `PAShowInfo` and reversed its role
    - Intention is to make PA not show by default,
      to avoid confusion for beginners and to make writing documentation easier

#### Added
- Basic support for light mode
- Option to override the play button on hybrid sentence cards



## [0.5.1.0] - 2022-07-16

#### Added
- Leech now shows as yellow on the info circle on the back side of cards

#### Changed
- Templates now use some global options to make things easier to change
- Pitch accent template now uses tags (I have no idea why they didn't before)

#### Fixed
- Quote left align working properly (now uses text-indent instead of flex div hackery)




## [0.5.0.0] - 2022-07-16
#### Changed (BREAKING)
- Renamed `Graph` -> `PAGraphs`
    - Format of data has been changed as well to include divs, css classes and dictionary names
- Renamed `Position` -> `PADictionaries`
    - Completely replaced the usage of this field:
      all previous filled instances of this field must be removed.

#### Changed
- Completely rewrite yomichan handlebars code
  - Primary definition now grabs the bilingual definition if no other dictionary exists
  - Removed italics on dictionary names that have japanese characters
    (effectively restricting it to jmdict only)

#### Added
- Better support for multiple pitch accent dictionaries (section under Extra Definitions)
  - Added the corresponding keybind (default "[")
  - Added corresponding yomichan handlebars code



## [0.4.0.0] - 2022-07-15
#### Changed (BREAKING)
- Renamed PADoNotShowInfoLegacy -> PADoNotShowInfo

#### Added
- Quote parsing:
  - Quotes are now right aligned with proper spacing (so the left quote covers the entire text box)
  - Quotes can be colored
    - PA indicator is automatically hidden with colored quotes
  - Support for custom automated quotes
- Implemented "isMobile" function in options
- Lowercase and uppercase keybinds are now supported
  - i.e. keybinds still work in case one accidentally presses capslock
- Implemented isMobile() in options

#### Dev notes
- Moved log messages into its own class
- Moved PA indicator into its own class
- Moved PA indicator to after the element with order 1 for css styling purposes


## [0.3.0.0] - 2022-07-11

#### Changed (BREAKING)
- Format of the settings file has been changed (javascript will break with the old settings format)

#### Changed
- Redid the settings format and made the settings easier to use
- Fixed sentence parsing not always selecting a sentence (PA cards, AltDisplay)

#### Fixed
- Positioning of the arrow on the info circle tooltip
- Info circle tooltip not remaining upon hovering on windows machines


## [0.2.2.1] - 2022-07-08
#### Fixed
- Made the info circle appear on all cards instead of just the main card
- Made the tooltip scale up to 500px width


## [0.2.2.0] - 2022-07-08
#### Added
- Implemented info circle with js fail errors, options warnings and general info


## [0.2.1.1] - 2022-07-08
#### Added
- CSS constuct to not repeat code with anki templates
- Added info circle icon

#### Fixed
- Removed old comments in options file
- show/hide highlight word button not working


## [0.2.1.0] - 2022-07-07
#### Added
- Implemented following js options:
    - select-smallest-sentence
    - play-word-audio
    - toggle-front-full-sentence-display
    - toggle-hint-display
    - toggle-secondary-definitions-display
    - toggle-additional-notes-display
    - toggle-extra-definitions-display

#### Fixed
- No image breaking javascript


## [0.2.0.0] - 2022-07-07
#### Changed (BREAKING)
- Moved options to separate media file.

#### Added
- Automatic way to add / update options file from the repo to the deck via update.py (with flag -o)

#### Fixed
- Fixed the Show/Hide (highlight word) button at the front from appearing on click/hover cards
- No longer shows the full sentence at the front when the card is a TSC
- Fixed process sentence function not working on pure TSCs


## [0.1.1.0] - 2022-06-28
#### Added
- Keybind functionality to the main card type for playing sentence
audio, toggling pitch accent word in a sentence card & toggling hybrid cards

#### Fixed
- Fixed the shift button not always working
- Fixed TSC field not properly changing the underline to solid when the
`IsSentenceCard` field is not filled, on click / hover cards


## [0.1.0.0] - 2022-06-25
#### Changed (BREAKING)
- Renamed field `ForceHighlightSentence` -> `IsTargetedSentenceCard`

#### Changed
- Changed the functionality of `ForceHighlightSentence` to be its own
individual `IsTargetedSentenceCard` (filling `IsSentenceCard` is now optional,
click and hover cards still use the field to create the (now renamed) click
TSCs and hover TSCs.
- Changed the versioning system from normal semantic versioning to X.(semantic
versioning)

#### Fixed
- Fixed having the "show" button on TSCs


## [0.0.1.1] - 2022-06-25
#### Added
- (WIP) Adding various support for mobile anki styles. PC styles should not be
affected.


## [0.0.1.0] - 2022-06-23
#### Added
- First official "version" attached to the card

