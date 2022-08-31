# Importing Anki Cards
This section is dedicated to explaining how you can change
other Anki cards into this note format.

**Note:** <br>
If you are simply importing old JPMN notes, updating JPMN will
update all the notes in place.
To update JPMN, see [**this section**](updating).



# Introduction
Unfortunately, there are so many card formats out there that
it would be impossible to cover how to import from every format
with detailed rigor.
Instead, this section will give you some general tips
on operations that will likely be common across most or all formats.

Additionally, although you maybe able to import most of the card,
it is unlikely that you will have complete 100% full
functionality after importing the notes.
The biggest example is frequency list information,
as it requires special HTML + css formatting that can only be specified
in the Yomichan Templates section.


# Prerequisites
Before doing anything that affects your Anki collection in a major way,
please make a **complete backup** of your collection
(Main Window →  `File` (top left corner) →  `Export...` →  `Anki Collection Package`)

[[assets/anki/media_export.png]]

**Note**: <br>
Importing your previous notes shouldn't change your media files at all.
However I recommend exporting **with media** just in case, so long as you have the disk space for it.


As explained further below, you will likely need to batch edit your newly imported notes.
There are two ways you can do this:
1. If you have `python`, then you're already set.
2. Otherwise, you require a batch editing add-on. I recommend
    [this one](https://ankiweb.net/shared/info/291119185).


# Anki
Anki provides a feature to switch between note types, without affecting scheduling information.
To do this, follow the proceeding steps:
1. Head to the Card Browser window (Main Window →  `Browse`)
2. Select all the cards that you want to switch
   - Tip: ctrl+a selects all cards in the browser.
3. Right click the selection →  `Notes` →  `Change Note Type...`

(TODO gif)


# Mapping Fields
Here is where I can't give specific advice, as every note is different.
However, here are a few tips:

- Your card likely doesn't have a separate `Key` and `Word` field,
  and instead only contains one `Word` field.
  To import this correctly into JPMN, make sure JPMN's `Key` and `Word` field are exactly
  your old card's `Word` field.

- `WordPitch` and `SentenceReading` can be left empty, as the AJT plugins
  can batch generate both word pitches and sentence furigana.

- You may have some word pitch fields already in your card.
  The only thing you should import is the pitch accent graphs,
  into the `PAGraphs` field.
  PA positions and PA text should be ignored.

- You may have frequency list info already in your card.
  As a quick warning, although you are free to import that info
  it may not work as you would expect in the JPMN card.
  Because there's no standard way to store this data, there is no convenience function
  to convert it to the proper format.

- See the field reference (TODO link) for more information about other fields.


Here is an example with [Anime cards](https://animecards.site/ankicards/):
| jp-mining-note | Anime Card |
|------|-----|
| Key | front |
| Word | front |
| WordReading | Reading |
| WordPitch |  |
| PrimaryDefinition | Glossary |
| Sentence |  |
| SentenceReading |  |
| AltDisplay |  |
| AltDisplayPASentenceCard |  |
| AdditionalNotes |  |
| IsSentenceCard |  |
| IsClickCard |  |
| IsHoverCard |  |
| IsTargetedSentenceCard |  |
| PAShowInfo |  |
| PATestOnlyWord |  |
| PADoNotTest |  |
| PASeparateWordCard |  |
| PASeparateSentenceCard |  |
| SeparateClozeDeletionCard |  |
| Hint |  |
| HintNotHidden | Hint |
| Picture | Picture |
| WordAudio | WordAudio |
| SentenceAudio | SentenceAudio |
| PAGraphs | Graph |
| PASilence |  |
| FrequenciesStylized |  |
| FrequencySort |  |
| SecondaryDefinition |  |
| ExtraDefinitions |  |
| UtilityDictionaries |  |
| Comment |  |

<sup>Anything not specified should be set to `(Nothing)`</sup>


# Batch Editing
After swtitching your notes, you will have to do the following 3 things:

#### (1) Batch generate pitch accents

1. Head to the Card Browser window.
2. Select all of your newly imported notes.
    - Tip: the query `"note:JP Mining Note"` should reveal all of your newly imported notes.
      Make sure you include the double quotes in the query search.
3. Head over to `Edit` (top left corner) →  `Bulk-add pitch accents`.

(TODO gif)

#### (2) Batch generate sentence furigana
1. Head to the Card Browser window.
2. Select all of your newly imported notes.
3. Head over to `Edit` (top left corner) →  `Bulk-add furigana`.

#### (3) Batch set `PASilence` field

1. Head to the Card Browser window.
2. Select all of your newly imported notes.

The following step differs if you are using `python` or the Batch Note Editing Add-on.

If you are using `python`:
```
# assuming you are at the root of the repo,
# i.e. after the `git clone ...` and `cd jp-mining-note`
cd ./tools

# make sure you have Anki open and Anki-Connect installed!
python3 ./batch.py -f "set_pasilence_field"
```

Otherwise, if you are using the add-on, follow the instructions in the videos
- Head over to `Edit` (top left corner) →  `Batch Edit...`.
- Set the content to be `[sound:_silence.wav]`.
- Set the field to be `PASilence`.
- Click on **Replace**.

See the official add-on video [here](https://youtu.be/iCZzcSnAeH4?t=31)
for an example of how to do this.


# Final Notes
Auto-generating frequency info (with the correct css, html, etc.) doesn't seem trivial,
and I currently provide no way of doing that
(primarily because I'm not sure how to do it in the first place).
If you know of a way or would like to help me out with doing this, please let me know!

