Welcome to jp-mining-note's Quick Start page!
This page summarizes the main features that jp-mining-note has to offer.

# UI Summary

## UI Summary: Front

(TODO image front)

The front side of the card was designed to be as minimal as possible.
Information such as tags, source, frequency, reading, audio, etc.
is not shown here, by design.

=== "**Tested content**"
    This can be a sentence, word, etc. depending on the [card type](cardtypes.md)

=== "**Card type**"
    This simply describes exactly what the card type is.

=== "**Info Circle**"
    Hovering over the info circle displays a tooltip that
    contains general infomation about the note type.
    When the info circle is not grey, this acts as a notifications window to the user. (TODO link)

    You may notice some buttons to the top left.
    These are explained here TODO.

<br>

## UI Summary: Back

(TODO image back)

Compared to the front side of the card, the back side was designed to
contain as much as information as possible.
However, only the important information is shown by default, while all the
auxilary information is hidden behind tooltips and dropdowns.

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
    This is where the image from the `Picture` field appears (if an image exists in the first place).

=== "**Primary Definition**"
    This is where the text in `PrimaryDefinition`, and optionally, the picture(s)
    in `PrimaryDefinitionPicture` appears.

=== "**Text Sections**"
    In general, this contains all the other information and dictionaries from Yomichan.
    See [here TODO]() for more info.

<!--
See [here TODO]() to see the reasons why these design decisions were made.
-->

<br>


## UI Summary: Mobile
(TODO image, mark w/ numbers)

The interface for mobile should be mostly the same as the desktop.
However, there are a few important differences to note:

1. Instead of collapsing sections, these are replaced with tabs.
1. The sentence appears below the definition instead of above.
1. The audio buttons appear at the bottom left of the card, instead of right below the pitch accent.

See [here TODO]() to see the reasons why these design decisions were made.

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

# Themes
If you don't like these layouts, jp-mining-note supports themes!
TODO showcase / link to main page.


---

# Options
TODO Summarize compile time options and runtime options here


---

# Common Changes

TODO description

<br>


## Simplify definitions
{{ feature_version("0.11.0.0") }}

TODO summarize css in definitions.md and link



<br>



## Adjusting Zoom
You can increase (or decrease) the size of the card,
(without affecting any of Anki's GUI)
with {{ C_CSS }}.


??? example "Instructions *(click here)*"
    1. Under `extra/style.scss`, add the following code:

        ```css
        :root {
          /* Times 1.1 of the original size.
           * If you want to make the note smaller, use a value below 1, like 0.9.
           */
          --zoom: 1.1;
        }
        ```

<br>


## Adjusting Font Size

In case overall zoom isn't enough, you can adjust the font sizes for individual
sections of the card.

TODO list CSS variables




<br>

## Changing the display language
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


# Kanji Hover
<i><sup>Main Page: [Kanji Hover](kanjihover.md)</sup></i>

Kanji hover shows you if you have seen the kanji in previous cards or not.
This is useful if you want to check whether you have seen the reading
in a previous card, to differentiate between similar kanjis, etc.

{{ img("kanji hover demo", "assets/ui/kanji_hover.gif") }}


---




# Word Indicators
<i><sup>Main Page: [Word Indicators](wordindicators.md)</sup></i>

{{ feature_version("0.11.0.0") }}

Indicators will be shown to the top-left of the reading when similar words
in your deck are found.

=== "同 (同じ)"
    (TODO image)

    This indicates the card is a duplicate.

=== "音 (同音異義語)"
    (TODO update image)

    {{ img("same reading indicator eg", "assets/ui/same_reading_indicator.gif") }}

    This shows cards with the same reading, **ignoring pitch accent**.
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
<i><sup>Main Page: [Images: Image Blur TODO]()</sup></i>

The main image can be blurred on specific cards, if desired.

This behavior is **disabled by default**,
and must be manually enabled by setting the following {{ RTO }} to `true`:
```json
{
  "imgStylizer.mainImage.blur.enabled": true,
}
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

<br>

## Pitch Accent Modification

The displayed pitch accent is usually the first position found in `PAPositions`.
However, you can override this automatically chosen position using the `PAOverride` field.

TODO update video with interface

![type:video](assets/autopa/pa_override.mp4)



<br>

## Pitch Accent Coloring

The card can be colored according to the pitch accent of the word, if desired.

This behavior is **disabled by default**,
and must be manually enabled by setting the following {{ RTO }} to `true`:
```json
{
  "autoPitchAccent.coloredPitchAccent.enabled": true,
}
```

TODO update video with new colors + interface

![type:video](assets/autopa/pa_override_color.mp4)

---




# Selecting Definitions
<i><sup>Main Page: [Definitions: TODO](definitions.md)</sup></i>

- warning on jmdict!
- maybe move this to a separate page?


---

# Field Summary

Only important fields will be discussed below TODO

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

## Alternate Display Fields
> Fields: `AltDisplayWord`, `AltDisplaySentence`, and anything else that beings with `AltDisplay`

TODO


## Binary Fields
> Fields: `IsSentenceCard`, `IsTargetedSentenceCard`, etc.

- screenshot of yomichan



## Sorting by Frequency
> Fields: `FrequencySort`

*   This note type comes with a `FrequencySort` field,
    which is the equivalent of Marv's `Frequency` field in
    [this](https://github.com/MarvNC/JP-Resources#sorting-mined-anki-cards-by-frequency) guide.
    Visit the aformentioned link (and scroll down to `Usage`)
    to see how to sort and review your cards by frequency.



# Conclusion

TODO conclusion




