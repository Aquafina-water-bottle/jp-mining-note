
This section is dedicated to explaining how you can change
other Anki cards into this note format.

!!! note
    If you are simply importing old JPMN notes, updating JPMN will
    properly update all the notes in place.
    See [this section](updating) instead.



# Introduction
Unfortunately, there are so many card formats out there that
it would be impossible to cover how to import from every format
with detailed rigor.
Instead, this section will give you some general tips
on operations that will likely be common across most or all formats,
as well as present a small example for Anime Cards.

Additionally, although you maybe able to import most of the card,
it is unlikely that you will have complete 100% full
functionality after importing the notes.
The biggest example is frequency list information,
as it requires special HTML + css formatting that can only be specified
in the Yomichan Templates section.


# Prerequisites

Before doing anything that affects your Anki collection in a major way,
please make a [complete backup](faq.md#how-do-i-backup-my-anki-data){:target="_blank"} of your collection.


!!! note
    Transferring your previous notes shouldn't change your media files at all.
    However I recommend exporting **with media** just in case, so long as you have the disk space for it.


As explained further below, you will likely need to batch edit your newly imported notes.
There are two ways you can do this:

1. If you have `python`, then you're already set.
2. Otherwise, you require a batch editing add-on. I recommend
    [this one](https://ankiweb.net/shared/info/291119185).


# Anki
Anki provides a feature to switch between note types, without affecting scheduling information.
To do this, follow the proceeding steps:

1. Head to the Card Browser window:

    > Main Window →  `Browse`

2. Select all the cards that you want to switch.

    !!! note "Tip"
        `ctrl+a` selects all cards in the browser.

3. Right click the selection →  `Notes` →  `Change Note Type...`

![type:video](assets/anki/change_notetype.mp4)



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
    Pitch accent graphs should be mapped to `PAGraphs`, and
    pitch accent positions should be mapped to `PAPositions`.

- You may have frequency list info already in your card.
    Although you are free to import that info into `FrequenciesStylized`,
    it will **likely not work as you would expect** in the JPMN card.
    Because there's no standard way to store this data, there is no convenience function
    to convert it to the proper format.

- `FrequencySort` maps to the frequency value used to sort by frequency, similarly to
  [this](https://github.com/MarvNC/JP-Resources#sorting-mined-anki-cards-by-frequency).

- If you have a field that stores the source of the media, you can likely map that to `AdditionalNotes`.


An example with [Anime cards](https://animecards.site/ankicards/) is shown below.

??? example "Click here to see the example for Anime Cards."

    | Anki Fields | Yomichan Format |
    |-------------|-----------------|
    {% for f, v in FIELDS.items() -%}
    | {{ f }} { .smaller-table-row } | {{ v["anime_cards_import"] + " { .smaller-table-row }" if "anime_cards_import" in v else "" }} |
    {% endfor %}

    !!! note
        Anything not specified should be set to `(Nothing)`


# Batch Editing
After switching your notes, you will have to do the following 2 things:

### (1) Batch generate pitch accents and sentence furigana

![type:video](assets/anki/batch_editing.mp4)


1. Head to the Card Browser window:

    > Main Window →  `Browse`

2. Select all of your newly imported notes.

    !!! note "Tip"
        The following query should reveal all of your newly imported notes.
        Make sure you include the double quotes in the query search.
        ```
        "note:JP Mining Note"
        ```
        Afterwards, you can do `ctrl+a` to select all of the resulting cards.

3. Head over to:

    > `Edit` (top left corner) →  `Bulk-add pitch accents`.

4. Again, head over to:

    > `Edit` (top left corner) →  `Bulk-add furigana`.




### (2) Batch set `PASilence` field

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


