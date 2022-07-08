# Changelog
- The last 3 numbers (# in X.#.#.#) follow semantic versioning.
Following semantic versioning, the 2nd number is bumped when any
BREAKING changes occur (field rename, field addition, field deletion).
"Breaking" in this case, is defined when someone cannot update their cards
with the `refresh.py` script without changing something else first.
- The first number (X in X.#.#.#) is an arbitrary number that I decide for
when the card passes a specific stage (i.e. 0 == pre-release, 1 = release, and
subsequent bumps are when the card has changed enough that a bump should be
signified.)

## [0.2.1.1] - 2022-07-08
#### Added
- css constuct to not repeat code with anki templates
- added info circle

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

