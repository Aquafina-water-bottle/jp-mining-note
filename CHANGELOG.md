# Changelog
The last 3 numbers (# in X.#.#.#) follow semantic versioning.

Historically, the 2nd number was bumped up for different reasons,
but now, the 2nd number will have a constant representation:
it is bumped when the Anki database schema becomes different
from the previous version.
This specifically happens when the fields are edited in any way
(renamed, moved, added, removed, etc.)

When the database schema changes, a user cannot automatically update their cards
by simply installing a new version of the .apkg package,
and must use `./install.py --update`.


<!--
Following semantic versioning, the 2nd number is bumped when any
BREAKING changes occur.

"Breaking" in this case, is defined when someone has to perform any action
outside of running `./install.py --update` for the card to work properly.

The following are examples breaking changes:
- Changes to anki plugin configs
- Changes to yomichan templates / format
-->


The first number (X in X.#.#.#) is an arbitrary number that I decide for
when the card passes a specific stage (i.e. 0 == pre-release, 1 = release, and
subsequent bumps are when the card has changed enough that a bump should be
signified.)


## [0.10.0.0] - 2022-09-04

#### Changed (BREAKING)
- Added fields (`PAOverride`, `PAPositions`)
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

