Welcome to jp-mining-note's quick start page!
This page summarizes the main features that jp-mining-note has to offer,
as well as common changes that people may want to make with the note.

---

# UI Summary

## UI Summary: Front

(TODO image front)

The front side of the card was designed to be as minimal as possible.
Information such as tags, source, frequency, reading, audio, etc.
are not shown here, by design.

=== "**Tested content**"
    This can be a sentence, word, etc. depending on the [card type](cardtypes.md).

=== "**Card type**"
    This simply describes exactly what the card type is.

=== "**Info Circle**"
    Hovering over the info circle displays a tooltip that
    contains general infomation about the note type.
    When the info circle is not grey, this acts as a notifications window to the user. (TODO link)

    You may notice some buttons to the top left.
    These are explained here TODO.


## UI Summary: Back

(TODO image back)

Compared to the front side of the card, the back side was designed to
contain as much as information as possible.
However, only the important information is shown by default, while all the
auxilary information is hidden behind various tooltips and dropdowns.

=== "**Tested content**"
    The tested content is repeated on the back side of the card, and is separated by a line.

=== "**Frequency**"
    Contains the value in the `FrequencySort` field.
    Hovering over the dropdown to the right should show
    all other frequencies, found in the `FrequenciesStylized` field.

=== "**Word box**"
    Contains the word, its reading, its pitch accent, and the word/sentence audio,
    in that order.

=== "**Main image**"
    This is where the image from the `Picture` field appears.
    If there is no picture, then the word box takes up the entire spacethe word box takes up the entire space.

=== "**Primary Definition**"
    This is where the text in `PrimaryDefinition`, and optionally, the picture(s)
    in `PrimaryDefinitionPicture` appears.

=== "**Blockquotes**"
    In general, this contains all the other information and dictionaries from Yomichan.
    See [here TODO]() for more info.

<!--
See [here TODO]() to see the reasons why these design decisions were made.
-->



## UI Summary: Mobile
(TODO image, mark w/ numbers)

The interface for mobile should be mostly the same as the desktop.
However, there are a few important differences to note:

1. Instead of collapsing sections, these are replaced with tabs.
1. The sentence appears below the definition instead of above.
1. The audio buttons appear at the bottom left of the card, instead of right below the pitch accent.

See [here TODO]() to see the reasons why these design decisions were made.

---

<!--
TODO (move this to setup actually)

- android:
    - may have to uncomment @import statement
    - may have to adjust pitch accent for their device:
        ```
        .android {
          --pa-overline-height-above-text: 0.2em;
        }
        ```

---
-->

<!--
## Themes
If you don't like these layouts, jp-mining-note supports themes!
TODO showcase / link to main page.
-->


<!--

---

# Options
TODO Summarize compile time options and runtime options here

- what they are
- term will be used commonly through the documentation
- link to how to edit them
- example options in runtime cover most common options

-->


# Changing the Card Type
<i><sup>Main Page: [Changing Card Type](changingcardtype.md)</sup></i>

> Fields: `IsSentenceCard`, `IsTargetedSentenceCard`, etc.

- TODO changing card type
- TODO explanation: done within Anki, affects only one card
- TODO: example: sentence card
- TODO video

> (main window) -> `Browse` -> (select any created jp-mining-note card) -> fill a binary field with any character, say `1`

As you may have noticed, this only changes the card type of one individual card.

- If you want to change the card type for all new cards, see
    [here](changingcardtype.md#default-card-type).
- If you want to change the card type for all exising cards, see
    [here](changingcardtype.md#batch-change-card-type).


<!--
- TODO basic explanation of how it works + screenshot in Anki
    - example `IsSentenceCard`
- TODO link to Changing Card Type
- TODO how to make it default for new cards: Yomichan →  "Anki Card Format"
- TODO backfill batch commands: link to cardtypes.md
-->



---



# Selecting Definitions
<i><sup>Main Page: [Definitions: Primary Definition Selection (Manual)](definitions.md#primary-definition-selection-manual)</sup></i>

If you don't want to use the first bilingual/monolingual definition,
you can select the dictionary or text that you want to use.

![type:video](assets/setupyomichan/selected_text.mp4)

Here is exactly what's happening:

1. If nothing is selected, then the first dictionary is chosen just like normal.
1. If a dictionary is selected, then that dictionary will replace the first definition.
1. If a section of text is selected, then that dictionary will replace the first definition.
    Additionally, that section of text will be highlighted (bolded).

!!! note
    Selecting parts of a definition to bold the text does not always work,
    especially when used across text with formatting or newlines.
    See [this](definitions.md#primary-definition-selection-manual) for more details.

    With this being said, selecting the dictionary should always work.



---

# Simplify Definitions
{{ feature_version("0.12.0.0") }}

If you want to remove the list numbers, as well as the first line
of most definitions, set the following {{ RTO }}:

```json
"blockquotes.simplifyDefinitions.enabled": true,
```

TODO image comparison






---



# Kanji Hover
<i><sup>Main Page: [Kanji Hover](kanjihover.md)</sup></i>

Kanji hover shows you if you have seen the kanji in previous cards or not.
This is useful if you want to check whether you have seen the reading
in a previous card, to differentiate between similar kanjis, etc.

{{ img("kanji hover demo", "assets/ui/kanji_hover.gif") }}


!!! note
    Kanji hover does not show words outside of your collection.


---




# Word Indicators
<i><sup>Main Page: [Word Indicators](wordindicators.md)</sup></i>

{{ feature_version("0.11.0.0") }}

Indicators will be shown to the top-left of the reading when similar words
in your deck are found.

=== "同 (同じ)"
    (TODO image)

    This indicates the card is a duplicate.

=== "読 (読み方)"
    (TODO update image)

    {{ img("same reading indicator eg", "assets/ui/same_reading_indicator.gif") }}

    This shows cards with the same reading, **ignoring pitch accent**
    (also known as 同音異義語.)
    For example, the word 自身 is still shown,
    despite having a different pitch accent to 地震.

=== "字 (漢字)"
    (TODO image)

    This indicates that there are other card(s) with the same kanji,
    but different reading.


---




# Images in the Primary Definition
<i><sup>Main Page: [Images: Primary Definition Image TODO]()</sup></i>

=== "Default"

    (TODO gif)

    Images in the `PrimaryDefinition` field are collapsed by default.

=== "PrimaryDefinitionPicture"

    (TODO gif)

    The main way to have images not be collapsed is by pasting the desired images in the
    `PrimaryDefinitionPicture` field.

=== "Changing the Default"

    (TODO gif)

    However, you may want existing images in `PrimaryDefinition` to not be collapsed.
    To do this, there are two runtime options that you can set:

    * {{ rto("imgStylizer.glossary.primaryDef.mode.yomichan") }}
    * {{ rto("imgStylizer.glossary.primaryDef.mode.user") }}


---

# Image Blur
<i><sup>Main Page: [Images: Image Blur](images.md#image-blur)</sup></i>

The main image can be blurred on specific cards, if desired.

This behavior is **disabled by default**,
and must be manually enabled by setting the following {{ RTO }} to `true`:
```json
"imgStylizer.mainImage.blur.enabled": true,
```

After setting the {{ RTO }}, you can blur the image of any card by marking as NSFW.
To mark a card as NSFW, add any of the following tags to the card:

> `nsfw`・`NSFW`・`-NSFW`

<figure markdown>
  {{ img("example toggle blur gif", "assets/images/anki_blur/example.gif") }}
</figure>


---



# Pitch Accent
<i><sup>Main Page: [Pitch Accent](autopa.md)</sup></i>

This note template displays pitch accent using binary pitch over katakana by default.
If you don't know what pitch accent is, see [here](autopa.md#what-is-pitch-accent).


## Pitch Accent Modification

The displayed pitch accent is usually the first position found in `PAPositions`.
However, you can override this automatically chosen position using the `PAOverride` field.

TODO update video with interface

![type:video](assets/autopa/pa_override.mp4)




## Pitch Accent Coloring
<i><sup>Main Page: [Pitch Accent](autopa.md)</sup></i>

The card can be colored according to the pitch accent of the word, if desired.

This behavior is **disabled by default**,
and must be manually enabled by setting the following {{ RTO }} to `true`:
```json
"autoPitchAccent.coloredPitchAccent.enabled": true,
```

TODO update video with new colors + interface

![type:video](assets/autopa/pa_override_color.mp4)

---




# Other Common Changes

TODO description




## Adjusting Zoom
You can increase (or decrease) the size of the card,
(without affecting any of Anki's GUI)
with {{ C_CSS }}.

```css
:root {
  /* Times 1.1 of the original size.
   * If you want to make the note smaller, use a value below 1, like 0.9.
   */
  --zoom: 1.1;
}
```



## Adjusting Font Size

In case overall zoom isn't enough, you can adjust the font sizes for individual
sections of the card.

TODO list CSS variables





## Changing the display Language
{{ feature_version("0.12.0.0") }}

By default, the display language is in English.
Currently, Japanese and English are supported as display languages.

To change the display language (say, to Japanese), use the following {{ CTO }}:
```
"display-languages": ["jp", "en"],
```

!!! note
    Currently, only some text is supported.
    This means that various tooltips on hover, warning messages, etc.
    will still be in English.

---


# Sorting by Frequency
<i><sup>Main Page: [Frequencies: Sorting by Frequency](frequencies.md#sorting-by-frequency)</sup></i>
> Fields: `FrequencySort`

This note type comes with a `FrequencySort` field,
which is the equivalent of Marv's `Frequency` field in
[this](https://github.com/MarvNC/JP-Resources#sorting-mined-anki-cards-by-frequency) guide.
Visit the aformentioned link (and scroll down to `Usage`)
to see how to sort and review your cards by frequency.




---

# Field Summary

Some important fields that were not introduced above will be discussed below.

## Key
> Field: `Key`

*   This field contains the tested word.
    In other words, this contains the exact same content as the `Word`.
    However, this field is purposefully not displayed anywhere in the card template.
    This is to allow the user to modify the key if duplicates arise,
    while still being able to test the word.

    For example, if I were to test different usages of 上,
    I can change this key value to `上 (preposition)`, `上 (grammar)`,
    etc. and add a new card.

    It is expected that this `Key` field is unique;
    a warning will appear on cards that have a duplicate key.

## Primary Definition
> Field: `PrimaryDefinition`

*   This field contains the main content, and is the only
    block of text that is shown by default.
    This field should have everything you require to understand the tested content.

## Additional Notes
> Field: `AdditionalNotes`

*   This field is useful if you want to write down even more notes,
    but keep it in a collapsible field to space.

    Here are some suggestions on how you can use this field:

    * Recording the source where the scene came from
    * Adding custom notes on the scene's context
    * Recording the sentences surrounding the mined sentence

    In general, this field should be used for any info that is not crucial
    to understanding the tested content.


<!--

## Alternate Display Fields
> Fields: `AltDisplayWord`, `AltDisplaySentence`, and anything else that beings with `AltDisplay`

TODO

-->


# Conclusion

TODO conclusion




