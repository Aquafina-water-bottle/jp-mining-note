
TODO introduction

---

# Backfill Pitch Accents & Sentence Furigana { #backfill-pitch-accents-and-sentence-furigana }

TODO outdated! rerecord!

![type:video](assets/importing/batch_editing.mp4)

This requires the `AJT Japanese` addon to be [correctly setup](setupanki.md#ajt-japanese).

1. Head to the Card Browser window:

    > Main Window →  `Browse`

2. Select the desired notes.
    The following Anki query selects all notes without sentence furigana or without generated pitch accents:
    ```
    "note:JP Mining Note" (AJTWordPitch: OR SentenceReading:)
    ```
    Don't forget to ++ctrl+a++ to select all of the resulting cards!

3. Head over to:

    > `Edit` (top left corner) →  `AJT: Bulk-generate`.

---

# Backfill `WordAudio`

To backfill word audio, I recommend using the
[Local Audio Server for Yomichan](https://github.com/themoeway/local-audio-yomichan) add-on,
combined with DillonWall's
[Generate Batch Audio](https://github.com/DillonWall/generate-batch-audio-anki-addon) add-on.

To use the Generate Batch Audio add-on, simply select the desired notes in Anki's card browser,
and then navigate to:

> `Edit` →  `Generate Bulk Audio`

!!! tip
    You can use the following query within Anki's card browser to find all cards without word audio:
    ```
    "note:JP Mining Note" WordAudio:
    ```
    Don't forget to ++ctrl+a++ to select all of the resulting cards!

    <p></p> <!-- TODO why was this removed? seems like it has to do with mkdocs-video for some reason -->

The Generate Batch Audio add-on requires a few changes to its fields in order to work with JPMN:

- All URLs should have `{wordreading}` instead of `{reading}`.
- `Audio field` should be `WordAudio`.
- `Filter kana` should be `WordReading`.

An example is shown below:

{{ img("", "assets/batch_gen_audio_config.png") }}

---

# Backfill `FrequencySort`

`FrequencySort` behaves exactly the same as Marv's `Frequency` field as documented in
[Marv's JP Resources page](https://github.com/MarvNC/JP-Resources#sorting-mined-anki-cards-by-frequency)
page.

That page also contains instructions on
[how to backfill](https://github.com/MarvNC/JP-Resources#backfilling-old-cards)
the field if it is empty.

If you are following the command line instructions, use the following command:
```bash
python backfill.py "Word" --freq-field "FrequencySort" --query "FrequencySort: \"note:JP Mining Note\""
```


