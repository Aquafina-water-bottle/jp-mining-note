
# Overview

This section is dedicated to explaining how you can change
other Anki cards into this note format.

!!! note
    If you are simply importing old JPMN notes, updating JPMN will
    properly update all the notes in place.
    See [this section](updating.md) instead.

---

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

---


# Prerequisites

Before doing anything that affects your Anki collection in a major way
(for example, basically everything on this page),
please make a [complete backup](faq.md#how-do-i-backup-my-anki-data){:target="_blank"} of your collection.


!!! note
    Transferring your previous notes shouldn't change your media files at all.
    However I recommend exporting **with media** just in case, so long as you have the disk space for it.


<!--
As explained further below, you will likely need to batch edit your newly imported notes.
There are two ways you can do this:

1. If you have `python`, then you're already set.
2. Otherwise, you require a batch editing add-on. I recommend
    [this one](https://ankiweb.net/shared/info/291119185).
-->

---


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

---



# Mapping Fields
Here is where I can't give specific advice, as every note is different.
However, here are a few tips:

1. Map `Word` to `Key` and `Word`.

    Your card likely doesn't have a separate `Key` and `Word` field,
    and instead only contains one `Word` field.
    To import this correctly into JPMN, make sure JPMN's `Key` and `Word` field are exactly
    your old card's `Word` field.

1. Leave `AJTWordPitch` and `SentenceReading` empty.

    These fields can be empty as the AJT plugins
    can batch generate both word pitches and sentence furigana.

1. You may have some word pitch fields already in your card.
    Pitch accent graphs should be mapped to `PAGraphs`, and
    pitch accent positions should be mapped to `PAPositions`.

    Note that if you plan to use [colored pitch accent](autopa.md#colored-pitch-accent)
    on old cards, you must have a pitch accent positions field.[^2]

1. `FrequencySort` maps to the frequency value used to sort by frequency, which works exactly
    the same as Marv's `Frequency` field as documented in
    [this](https://github.com/MarvNC/JP-Resources#sorting-mined-anki-cards-by-frequency)
    page.

1. If you have a field that stores the source of the media, you can likely map that to `AdditionalNotes`.

1. I recommend **not** setting `FrequenciesStylized` to anything, even if you have a field for
    frequency lists[^1].


[^1]: `FrequenciesStylized` uses a custom set of handlebars to
    store the frequency info in a way that css styles can be easily applied without javascript.
    This differs heavily from the `{frequencies}` marker provided by Yomichan.
    Mapping an existing field that stores frequencies using `{frequencies}`
    to `FrequenciesStylized`
    will result in **incorrect display of data**.

    There is currently no convenience function to convert it to the proper format.

    Additionally, auto-generating frequency info (with the correct css, html, etc.)
    from arbitrary frequency lists does not seem trivial,
    and I currently provide no way of doing that
    (primarily because I'm not sure how to do it in the first place).
    If you know of a way or would like to help me out with doing this, please let me know!


[^2]: The current implementation of colored pitch accent cannot detect the pitch accent position
    from the svg graph, nor from the automatically generated pitch accent from `AJT Pitch Accent`.
    If you do not have a pitch accent positions field,
    the only way to have colored pitch accent on old cards
    is by manually setting the position for all affected cards.

    Of course, any new cards should have automatically generated pitch accent positions,
    so long as you have a Yomichan pitch accent dictionary installed.


An example with [Anime cards](https://animecards.site/ankicards/) is shown below.

??? example "Example for Anime Cards *(click here)*"

    {{ anime_cards_table() | indent(4) }}

    !!! note
        Anything not specified should be set to `(Nothing)`

---


# Batch Editing
After switching your notes, you will have to do the following few steps:

## (1) Porting formatted Sentence fields

If your sentence fields have been highlighted in a way that isn't using `<b>`,
then it will be incompatable with JPMN by default.

To see what the formatting of the sentence is,
[view the raw HTML](faq.md#how-do-i-edit-the-fields-raw-html){:target="_blank"}
of the `Sentence` field.

Sentences are usually formatted in one of three ways, as shown below:

=== "(1) Highlighted with `<b>`"
    If the tested content is highlighted with `<b>`, then it is already formatted correctly.
    You can **skip this step**.

    **Example:**
    ```html
    今日も、なんか、昼<b>爆睡</b>してしまったんので…
    ```


=== "(2) Nothing is highlighted"
    If the tested content is not highlighted in any way, there is unfortunately no easy
    way to add highlighting to existing sentences.
    As there is nothing to do, you can **skip this step**.

    **Example:**
    ```
    今日も、なんか、昼爆睡してしまったんので…
    ```


=== "(3) Highlighted, but not with `<b>`"
    If the tested content is highlighted with something that isn't `<b>`,
    then **continue with the following instructions** to change it.

    **Example:**
    ```html
    今日も、なんか、昼<span style="color: #ffc2c7">爆睡</span>してしまったんので…
    ```

    ??? example "Instructions to port formatted sentences *(click here)*"

        !!! note
            You may want to make another backup before doing the following, just in case.

        1. **Determine how the sentence is formatted.**

            We will be using the above for this example.
            This example highlights the word using a `<span>` with a custom color.
            ```html
            今日も、なんか、昼<span style="color: #ffc2c7">爆睡</span>してしまったんので…
            ```

            The above is created from the following Yomichan fields:
            ```
            {cloze-prefix}<span style="color: #ffc2c7">{cloze-body}</span>{cloze-suffix}
            ```

        2. **Testing the Conversion.**

            In the Anki card viewer, select only one of your old notes.

            Afterwards, right click the selection, and head over to:

            > `Notes` →  `Find and Replace...`

        3. **Setting the fields.**

            Set the `Find` field to something that can find your highlighted content.
            We will use the above as an example.

            It is extremely likely that you will have to change the `Find` field
            according to your note's sentence format.

            | Field name | Value |
            |:-|:-|
            | **Find:** { .smaller-table-row } | `<span style="color: #ffc2c7">(?P<t>.*?)</span>` { .smaller-table-row } |
            | **Replace With:** { .smaller-table-row } | `<b>$t</b>` { .smaller-table-row } |
            | **In:** { .smaller-table-row } | `Sentence` { .smaller-table-row } |
            | Selected notes only { .smaller-table-row } | Checked ({{ CHECKED_CHECKBOX }}) { .smaller-table-row } |
            | Ignore case { .smaller-table-row } | Unchecked ({{ UNCHECKED_CHECKBOX }}) { .smaller-table-row } |
            | Treat input as a<br>regular expression { .smaller-table-row } | Checked ({{ CHECKED_CHECKBOX }}) { .smaller-table-row } |

            ??? example "Example image *(click here)*"

                <figure markdown>
                {{ img("The above table in Anki", "assets/anki/fix_formatted_sentences.png") }}
                </figure>

        4. **Verify.**

            Press Ok, and then preview the card.

            If the highlight is yellow (or blue on light mode), then it it was successful!
            Repeat steps 2 and 3, except select all of the affected notes instead of just one.

            If it was not successful, you likely have to adjust the `Find` field.
            See
            [here](https://docs.ankiweb.net/searching.html?highlight=regex#regular-expressions)
            to see Anki's official documentation on regex.

<br>


## (2) Batch generate pitch accents and sentence furigana

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


<br>


## (3) Batch set `PASilence` field

This will ensure all `PASilence` are filled correctly.
See [here](faq.md#what-is-the-point-of-the-pasilence-field) to understand what this field does.

1. Head to the Card Browser window.
1. Right click a card, and then head to:

    > `Notes` →  `Find and Replace...`

1. Set the fields to the following:

    | Field name | Value |
    |:-|:-|
    | **Find:** { .smaller-table-row } | `.*`  { .smaller-table-row } |
    | **Replace With:** { .smaller-table-row } | `[sound:_silence.wav]` { .smaller-table-row } |
    | **In:** { .smaller-table-row } | `PASilence` (IMPORTANT!!! Don't forget to set this field) { .smaller-table-row } |
    | Selected notes only { .smaller-table-row } | Unchecked ({{ UNCHECKED_CHECKBOX }}) { .smaller-table-row } |
    | Ignore case { .smaller-table-row } | Unchecked ({{ UNCHECKED_CHECKBOX }}) { .smaller-table-row } |
    | Treat input as a<br>regular expression { .smaller-table-row } | Checked ({{ CHECKED_CHECKBOX }}) { .smaller-table-row } |

    ??? example "Example image *(click here)*"
        <figure markdown>
        {{ img("The above table in Anki", "assets/anki/bulk_add_silencewav.png") }}
        </figure>

<!--
_
-->

<!--

The following step differs if you are using `python` or the Batch Note Editing Add-on.


=== "Batch Editing Add-On"

    Within Anki, do the following:

    - Head over to `Edit` (top left corner) →  `Batch Edit...`.
    - Set the content to be `[sound:_silence.wav]`.
    - Set the field to be `PASilence`.
    - Click on **Replace**.

    See the official add-on video [here](https://youtu.be/iCZzcSnAeH4?t=31)
    for an example of how to do this.


=== "Python"
    ```
    # assuming you are at the root of the repo,
    # i.e. after the `git clone ...` and `cd jp-mining-note`
    cd ./tools

    # make sure you have Anki open and Anki-Connect installed!
    python3 ./batch.py -f "set_pasilence_field"
    ```
-->

<br>


## (4) (Optional) Formatting WordReading

Your `WordReading` field is likely formatted in one of three ways:

1. Kanji with furigana in brackets (Yomichan: `{furigana-plain}`).

    Example: 成[な]り 立[た]つ

1. Kanji with ruby text (Yomichan: `{furigana}`).

    Example: <ruby><rb>成</rb><rt>な</rt></ruby>り<ruby><rb>立</rb><rt>た</rt></ruby>つ

1. Kana only (Yomichan: `{reading}`).

    Example: なりたつ

If your `WordReading` is formatted in either of the first two ways, you can skip this step.

However, if your old cards only had a kana reading, then it might be nice
to have the `WordReading` as the kanji word with furigana.
You likely want the kanji word with the furigana, so the kanjis actually show
in the kanji hover tooltip.

??? example "Converting kana readings to furigana readings *(click here)*"

    The solution provided below is imperfect, but passable.
    This will format all of the `WordReading` fields to be `Word[WordReading]`,
    which means kana will repeated.
    For example, a card with `Word` as 成り立つ, and `WordReading` as なりたつ,
    will turn into: <ruby><rb>成り立つ</rb><rt>なりたつ</rt></ruby>

    To do this, you will have to run a Python script from the repository.
    For Windows users, see the first 3 steps for the Windows instructions
    [here](updating.md#running-the-script){:target="_blank"}
    if you haven't use Python before.

    Afterwards, [create a backup](faq.md#how-do-i-backup-my-anki-data) and run the following:
    ```bash
    python batch.py -f quick_fix_convert_kana_only_reading_all_notes
    ```

    The above will affect **ALL** notes.
    If you instead want to affect certain notes, add the `kanaonlyreading`
    tag to all affected notes, and then run:
    ```bash
    python batch.py -f quick_fix_convert_kana_only_reading_with_tag
    ```



<!--
### (5) (Optional) Batch set `WordReadingFurigana` field

The following automatically fills out the `WordReadingFurigana` field.

Filling out the `WordReadingFurigana` field will enable the usage of
the [Same Reading Indicator](ui.md#word-indicators)
on existing cards.

To do this, like with the above step, you will have to run a Python script.
Again, for Windows users, see the first 3 steps for the Windows instructions
[here](updating.md#running-the-script){:target="_blank"}
if you haven't use Python before.

The following script assumes that your `WordReading` field
is formatted as the first way (成[な]り 立[た]つ) on step 4.
This will not work if the `WordReading` field field is formatted
like the second
(<ruby><rb>成</rb><rt>な</rt></ruby>り<ruby><rb>立</rb><rt>た</rt></ruby>つ)
or third way
(なりたつ).


```
# assuming you are at the root of the repo,
# i.e. after the `git clone ...` and `cd jp-mining-note`
cd ./tools

pip3 install jaconv

# make sure you have Anki open and Anki-Connect installed!
python3 ./batch.py -f "fill_word_reading_hiragana_field"
```
-->

---


# Conclusion
If everything went smoothly,
then you have **successfully transferred your notes** to the JPMN template.
Enjoy reviewing your old cards with a new template!




