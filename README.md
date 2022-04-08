VERY WIP Anki card type.

### TODO:
* Clean up the codebase
  * Use a consistent code style
  * Add more comments on style sheet
  * Use better variable names
* Add proper documentation:
  * Links to Anki documentation for specific vocab (i.e. notes vs cards)
  * What I test myself on for each type of card
  * Features
  * Fields
  * How to setup mandatory Anki plugins
  * How to setup Yomichan (templates and anki fields)
* Add sample cards

## Anki Fields Summary

|  Anki Fields               | Yomichan Format                                   |
|----------------------------|---------------------------------------------------|
|  Word                      | `{expression}`                                    |
|  WordReading               | `{furigana-plain}`                                |
|  WordPitch                 |                                                   |
|  PrimaryDefinition         | `{glossary-bilingual-first}`                      |
|  SecondaryDefinition       | `{glossary-monolingual-first}`                    |
|  Sentence                  | `{cloze-prefix}<b>{cloze-body}</b>{cloze-suffix}` |
|  SentenceReading           |                                                   |
|  AltDisplay                |                                                   |
|  AltDisplayPASentenceCard  |                                                   |
|  AdditionalNotes           |                                                   |
| *IsSentenceCard            |                                                   |
| *PASeparateWordCard        |                                                   |
| *PASeparateSentenceCard    | `1`                                               |
| *PATestOnlyWord            |                                                   |
| *PADoNotTest               |                                                   |
| *PADoNotShowInfoLegacy     |                                                   |
| *IsClozeDeletionCard       |                                                   |
|  Hint                      |                                                   |
|  Picture                   |                                                   |
|  WordAudio                 | `{audio}`                                         |
|  SentenceAudio             |                                                   |
|  Graph                     | `{pitch-accent-graphs}`                           |
|  Position                  | `{pitch-accent-positions}`                        |
|  PASilence                 | `[sound:silence.wav]`                             |
|  ExtraDefinitions          | `{glossary-extra}`                                |
|  Comment                   |                                                   |

