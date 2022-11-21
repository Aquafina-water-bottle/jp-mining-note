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
Usually, the word within the sentence is already bolded by Yomichan.
However, there are some cases where the word within the sentence may not be bold,
such as when external programs update the `Sentence` field.

By default, the note attempts to highlight the word within the sentence.

!!! warning
    It is not uncommon that the automatic highlighting fails to highlight the full word.
    For example, verb and i-adj. conjugations are not highlighted whatsoever.
    In order to keep the javascript lightweight, any improper highlighting
    *is considered as expected behavior*, and will not be changed.

    I recommend manually bolding the word if the word is incorrectly highlighted.

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



