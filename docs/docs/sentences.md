UNUSED DOCUMENT FOR NOW

# Definitions
We will use the following terms to differentiate between the different sentences present in this note:

* "Display sentence" refer to the sentence(s) shown at the front side of the card.
    Most topics on this page will be relating to the display sentence.
* "Full sentence" to refer to the sentence(s) shown at the back with furigana.


TODO image


---

# Sentence Cards

<i><sup>Main Page: [Card Types](cardtypes.md)</sup></i>

=== "Vocab card"
    <figure markdown>
    {{ img("vocab card example", "assets/nisemono_word_blank.png") }}
      <figcaption>
        The default card type is a vocab card,
        where the tested content is simply the word.
      </figcaption>
    </figure>

=== "Sentence card"
    <figure markdown>
    {{ img("sentence card example", "assets/nisemono_sentence_blank.png") }}
      <figcaption>
        To change the card to a sentence card, fill the `IsSentenceCard` binary field.
      </figcaption>
    </figure>

=== "Targeted Sentence card"
    <figure markdown>
    {{ img("sentence card example", "assets/nisemono_tsc.png") }}
      <figcaption>
        This is a card where the word is highlighted within the sentence.
        To do this, fill the `IsTargetedSentenceCard` binary field.
      </figcaption>
    </figure>


---


# Automatic Word Highlighting

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

??? example "Examples *(click here)*"
    Any text in red is not highlighted automatically.
    They are considered as examples of when automatic highlighting doesn't work.

    {% filter indent(4) %}{{ gen_auto_word_highlight_table() }}{% endfilter %}


!!! note
    Much of the base code was taken from
    [Marv's implementation](https://github.com/MarvNC/JP-Resources#anki-automatically-highlight-in-sentence)
    of the same thing.


---

# Removing Sentence Periods
The display sentence will have the period at the end of the sentence
removed by default.
If you want to keep the period, you can set the following {{ RTOs }} to `false`:

```
{
  "modules": {
    "sent-utils": {
      // removes the 「。」 character (and other periods) if it is the last character of the sentence
      "remove-final-period": false, // default: true
      "remove-final-period-on-altdisplay": false, // default: false
    }
  }
}
```

TODO image


---

# Removing Sentence Quotes

TODO tags on customizing it!

The sentence display has quotes surrounding the sentence by default, to provide
an easy indicator to differentiate between a sentence and vocab card.

If you want to remove the quotes, you can set the following {{ RTOs }} to `false`:

```
{
  "modules": {
    "sent-utils": {
      // automatically adds quotes to the sentence (if not alt display)
      "auto-quote-sentence": false, // default: true

      // automatically adds quotes to the sentence (if alt display)
      "auto-quote-alt-display-sentence": false, // default: true
    }
  }
}
```


TODO image



# SentenceReading Furigana Options

By default, the furigana for the full sentence (on the back side of the card) is shown on hover.
The following options change how the furigana is displayed.

---

## SentenceReading: When to show furigana

{{ feature_version("0.12.0.0") }}

By default, furigana is shown on hover.
This can be changed to only be shown on click, or always/never shown.


=== "On click"
    TODO gif: show on click

    ??? example "Instructions *(click here)*"
        Change the following {{ CTO }}:

        ```json
        "full-sentence-ruby": {
            "display-mode": "click",
        }
        ```

        This is commonly paired with the [hide furigana spacing](#sentencereading-hide-spacing) option,
        so furigana does not impede with the sentence whatsoever until toggled.


=== "On hover (default)"
    TODO gif: show on hover

    This is the default behavior.

    ??? example "Instructions *(click here)*"
        Change the following {{ CTO }}:

        ```json
        "full-sentence-ruby": {
            "display-mode": "hover",
        }
        ```

=== "Always revealed"
    TODO gif: static with mouseover

    This is not recommended, because you should
    not be relying on furigana to understand Japanese.

    ??? example "Instructions *(click here)*"
        Change the following {{ CTO }}:

        ```json
        "full-sentence-ruby": {
            "display-mode": "always",
        }
        ```

=== "Never revealed"
    TODO gif: static with mouseover

    If you are looking to not see furigana at all, feel free to use this option.
    However, I personally recommend toggling on click instead of removing furigana completely.

    ??? example "Instructions *(click here)*"
        Change the following {{ CTO }}:

        ```json
        "full-sentence-ruby": {
            "display-mode": "never",
        }
        ```



---


## SentenceReading: Hide spacing

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

    ??? example "Instructions *(click here)*"
        Change the following {{ CTOs }}:

        ```json
        "full-sentence-ruby": {
            "fill-mode": "font-size",
            "fill-mode-font-size-transition": True,
        }
        ```


=== "Hide spacing with no transition"
    TODO img

    ??? example "Instructions *(click here)*"
        Change the following {{ CTOs }}:

        ```json
        "full-sentence-ruby": {
            "fill-mode": "font-size",
            "fill-mode-font-size-transition": False,
        }
        ```


=== "Keep spacing (default)"
    TODO img

    This is the default behavior.

    ??? example "Instructions *(click here)*"
        Change the following {{ CTO }}:

        ```json
        "full-sentence-ruby": {
            "fill-mode": "opacity",
        }
        ```


!!! note
    All of the examples above are shown with furigana on hover.
    They will also work with furigana on click.

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

??? example "Instructions *(click here)*"

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

---




