# Display sentence vs Full sentence
We will use the following terms to differentiate between the different sentences present in this note:

* **Display sentence** refers to the sentence(s) shown at the front side of the card.
    Most topics on this page will be relating to the display sentence.
* **Full sentence** to refers to the sentence(s) shown at the back with furigana.
    This is called the "full sentence" as this is usually just the `Sentence`
    (or `SentenceReading`) field with minimal styling.


TODO image


---

# Sentence cards

If you are looking on how to make sentence cards or targeted sentence cards
(sentence cards where the tested word is bolded), see
[Card Types: Sentence Card](cardtypes.md#sentence-card)
and
[Card Types: Targeted Sentence Card](cardtypes.md#targeted-sentence-card)
respectively.

---

# Customize the display sentence

You can use the `AltDisplaySentence` field you ever wish to customize the display
sentence without modifying the full sentence (`Sentence` field),

<!-- TODO fieldref →  sentences -->


=== "Last sentence only"
    <figure markdown>
      {{ img("altdisplay with only last sentence", "assets/fieldref/altdisplay_last_sent.png") }}
    </figure>
    For example, we can use `AltDisplaySentence` to only test the last sentence.


=== "Furigana"
    <figure markdown>
    {{ img("altdisplay with furigana", "assets/fieldref/altdisplay_furigana.gif") }}
    </figure>

    One nice feature is that `AltDisplaySentence` has hoverable furigana text
    enabled by default. In other words, you can write furigana within the field.
    I personally use this to insert furigana for certain names, since I'm usually not
    testing myself on how to read a name.

    For example, the card below has the following HTML:
    ```html
    上条[かみじょう] 恭介[きょうすけ]君のことお<b>慕い</b>してましたの
    ```

=== "Kanjifying the word"
    <figure markdown>
      TODO image
    </figure>

    It is not uncommon for words to be written in kana, but have a kanji variant.
    Instead of modifying the `Sentence` field, you can copy the `Sentence` field
    into the `AltDisplaySentence` field, and then manually replace the kana
    with its kanji variant. This may be useful for any card type that isn't
    a vocab or audio card.

---

# Adding line breaks

TODO this is basically the only time I ever edit the `Sentence` field

- if you have furigana, make sure you refresh the `SentenceReading` field,
    i.e. with the `AJT Japanese` plugin




## Sentence Max Width Indicator

TODO `sentence-max-width` under `cssFolders`

- warning: experimental, may have weird bugs

---



# Automatic word highlighting

{{ feature_version("0.12.0.0") }}

Usually, the word within the sentence is already bolded by Yomichan.
However, there are some cases where the word within the sentence may not be bold,
such as when external programs update the `Sentence` field, or if you are using
imported cards.

By default, the note attempts to highlight the word within the sentence.

With that being said, it is not uncommon that the automatic highlighting
fails to highlight the full word.
For example, verb and i-adj. conjugations are not highlighted whatsoever.
In order to keep the javascript lightweight, any improper highlighting
*is considered as expected behavior*, and will not be changed or fixed.
I recommend manually bolding the word if the word is incorrectly highlighted.

??? example "Examples <small>(click here)</small>"
    Any text in red is not highlighted automatically.
    They are considered as examples of when automatic highlighting doesn't work.

    {% filter indent(4) %}{{ gen_auto_word_highlight_table() }}{% endfilter %}


!!! note
    Much of the base code was taken from
    [Marv's implementation](https://github.com/MarvNC/JP-Resources#anki-automatically-highlight-in-sentence)
    of the same thing.


---

# Removing sentence periods
The display sentence will have the period at the end of the sentence
removed by default.
If you want to keep the period, you can set the desired {{ RTOs }} to `false`:

```json
"sentenceParser.removeFinalPeriod.fullSent.quoted":     true, // (1)!
"sentenceParser.removeFinalPeriod.fullSent.unquoted":   false,
"sentenceParser.removeFinalPeriod.display.quoted":      true,
"sentenceParser.removeFinalPeriod.display.unquoted":    false,
"sentenceParser.removeFinalPeriod.altDisplay.quoted":   false,
"sentenceParser.removeFinalPeriod.altDisplay.unquoted": false,
```

1.  For example, `"sentenceParser.removeFinalPeriod.fullSent.quoted": true,`
    means that the final period is removed from the full sentence if it is quoted.
    The other options follow similarly.

TODO image



---

# Adding or removing quotes

The sentence display has quotes surrounding the sentence by default, to provide
a simple indicator to differentiate between a sentence and vocab card.

If you do not want quotes around the sentence, you can set the following {{ RTOs }} to `remove`:

```json
"sentenceParser.fullSent.quotes.processMode": "remove",
"sentenceParser.display.quotes.processMode": "add",
"sentenceParser.altDisplay.quotes.processMode": "as-is",
```

All available process modes are explained within the example config file.

If you want to add or remove quotes on a card-by-card basis,
add the `quote-add` tag or `quote-remove` tag to the card, respectively.


TODO image????

---


# `SentenceReading` Furigana Options
{{ feature_version("0.12.0.0") }}

By default, the furigana for the full sentence (on the back side of the card)
is shown on hover, given that this `SentenceReading` field is filled out.
If `SentenceReading` is not filled out, then the sentence will show as usual
(without furigana).

The following options change how the furigana is displayed within the full sentence,
if any exists.

!!! note
    These options do NOT affect furigana elsewhere, such as any in the displayed sentence.


## Furigana: When to show
{{ feature_version("0.12.0.0") }}

By default, furigana is shown on hover.
This can be changed to only be shown on click, or always/never shown.


=== "On click"
    TODO gif: show on click

    ??? example "Instructions <small>(click here)</small>"
        Change the following {{ CTO }}:

        ```json
        "fullSentenceRuby.displayMode": "click",
        ```

        This is commonly paired with the [hide furigana spacing](#sentencereading-hide-spacing) option,
        so furigana does not impede with the sentence whatsoever until toggled.


=== "On hover (default)"
    TODO gif: show on hover

    This is the default behavior.

    ??? example "Instructions <small>(click here)</small>"
        Change the following {{ CTO }}:

        ```json
        "fullSentenceRuby.displayMode": "hover",
        ```


=== "On hover and click"
    TODO gif: show on hover and click

    This allows furigana to be shown on hover, and toggled on click.

    ??? example "Instructions <small>(click here)</small>"
        Change the following {{ CTO }}:

        ```json
        "fullSentenceRuby.displayMode": "both",
        ```

=== "Always revealed"
    TODO gif: static with mouseover

    This is not recommended, because you should
    not be relying on furigana to understand Japanese.

    ??? example "Instructions <small>(click here)</small>"
        Change the following {{ CTO }}:

        ```json
        "fullSentenceRuby.displayMode": "always",
        ```

=== "Never revealed"
    TODO gif: static with mouseover

    If you are looking to not see furigana at all, feel free to use this option.
    However, I personally recommend toggling on click instead of removing furigana completely.

    ??? example "Instructions <small>(click here)</small>"
        Change the following {{ CTO }}:

        ```json
        "fullSentenceRuby.displayMode": "never",
        ```





## Furigana: Hide spacing
{{ feature_version("0.12.0.0") }}

Furigana that extends past the length of the kanji will add additional spacing around the kanjis,
which may be unpleasant to look at.

One solution to this is to simply hide the spacing until hover or click.
This has the unintentional consequence where kanjis can potentionally change position, or overflow
into the next line.
There is also a possibility that the entire sentence shifts over a bit to the left
due to (what I think is a) chromium based bug[^1].

[^1]: 
    See \#4 in the [minor visual bugs list](https://github.com/Aquafina-water-bottle/jp-mining-note/issues/1).


=== "Hide Spacing"
    TODO img

    ??? example "Instructions <small>(click here)</small>"
        Change the following {{ CTOs }}:

        ```json
        "fullSentenceRuby.fillMode": "font-size",
        "fullSentenceRuby.fillModeFontSizeTransition": true,
        ```


=== "Hide spacing with no transition"
    TODO img

    ??? example "Instructions <small>(click here)</small>"
        Change the following {{ CTOs }}:

        ```json
        "fullSentenceRuby.fillMode": "font-size",
        "fullSentenceRuby.fillModeFontSizeTransition": false,
        ```


=== "Keep spacing (default)"
    TODO img

    This is the default behavior.

    ??? example "Instructions <small>(click here)</small>"
        Change the following {{ CTO }}:

        ```json
        "fullSentenceRuby.fillMode": "opacity",
        ```


!!! note
    All of the examples above are shown with furigana on hover.
    They will also work with furigana on click.

---






# Generating Sentence Furigana

TODO AJT Japanese and `{jpmn-sentence-bolded-furigana-plain}`


## Furigana Generation: AJT Japanese
TODO


## Furigana Generation: Yomichan Marker
{{ feature_version("0.11.0.0") }}

> Marker: `{jpmn-sentence-bolded-furigana-plain}`

TODO add details on how to even use this

This automatically uses Yomichan's internal furigana generator to
add furigana to your sentence. Use this under `SentenceReading`.

This is useful if:

* You are not using [AJT Japanese](setupanki.md#ajt-japanese), or
* You are using a device that doesn't have AJT Japanese installed (say, a phone),
    and you do not want to bulk generate furigana after each session.





---

# Keeping and removing newlines within the display sentence
{{ feature_version("0.12.0.0") }}

You can add newlines to the `Sentence` field to make the full sentence
field have cleaner line breaks.
If you do this, you will need to regenerate the `SentenceReading`
field if you are using furigana.

However, these newlines are automatically removed from the display sentence
if the width of the screen is determined to be too small.
To override this option, you can use the following {{ C_CSS }}:

??? example "Instructions <small>(click here)</small>"

    === "Keep all newlines"

        1. Under `extra/style.scss`, add the following code:

            ```css
            .expression .expression-inner br {
              display: inline !important;
            }
            ```

    === "Remove all newlines"

        1. Under `extra/style.scss`, add the following code:

            ```css
            .expression .expression-inner br {
              display: none !important;
            }
            ```

    === "Remove all newlines when AltDisplay is not used"

        This only removes newlines when the `AltDisplay` (or `AltDisplayPASentenceCard`)
        field is not being used as the display sentence.

        1. Under `extra/style.scss`, add the following code:

            ```css
            .expression .expression-inner br {
              display: inline !important;
            }

            .expression .expression-inner:not(.expression-inner--altdisplay) br {
              display: none !important;
            }
            ```

