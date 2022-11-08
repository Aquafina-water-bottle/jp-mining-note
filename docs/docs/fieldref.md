
This page is dedicated showing
how to edit the note fields to change the card to your liking.


# Definitions
**Binary Field:**
A field that checks whether it is filled or not with any value, say `1`.
The default is implied by the name of the field, and a value of "true" means that the field is filled.
For example, the `IsSentenceCard` field will turn the card into a sentence card if filled.
If it is not filled, then the card will be a word card.
To fill a field automatically, see
[here](faq.md#how-do-i-change-the-default-value-of-a-binary-field){:target="_blank"}.

<!--
To "toggle" a binary field means to either fill the value if is not filled yet,
or to remove the value if it is filled.
In other words, it means to flip the value of the field between empty and filled.
-->

**PA:** Short for "Pitch Accent".

---


# Quick Jump

The table below provides quick links to most of the fields found with the card,
as well as some general info on each field.
Fields without links are assumed to be either obvious (and do not require documentation),
or not meant to be edited.


??? example "Click here to reveal the field list"

    !!! note
        `Auto-filled` represents fields that should be automatically filled out from Yomichan
        and Anki add-ons.


    {{ field_quick_jump_table() | indent(4)}}

---





# Modifying the Front Side (Tested Content)
The front side is exactly the content that we want to test ourselves on.
Naturally, since we can test ourselves on many aspects of the word, there are
many ways to change this tested content.


## Card types
<i><sup>Full list: [Card Types](cardtypes.md)</sup></i>

The default card type is a vocab card,
where the tested content is simply the word.

To change the card to a sentence card, fill the `IsSentenceCard` binary field.

=== "Vocab card"
    {{ img("vocab card example", "assets/nisemono_word.png") }}
=== "Sentence card"
    {{ img("sentence card example", "assets/nisemono_sentence.png") }}


## Changing the Displayed Content
Vocab cards show the `Word` field and sentence cards show the `Sentence` fields by default.
However, you can modify what is exactly shown in the front by using the `AltDisplay` field.

=== "Newline"
    <figure markdown>
      {{ img("altdisplay with newline", "assets/nisemono_altdisplay_newline.png") }}
      <figcaption>
        The previous sentence card looks a little ugly,
        because the sentence splits off at a strange point.
        To fix this, we add a newline at a sensible place (after the period) in the `AltDisplay` field.
      </figcaption>
    </figure>

=== "Last sentence only"
    <figure markdown>
      {{ img("altdisplay with only last sentence", "assets/nisemono_altdisplay_last_sent.png") }}
      <figcaption>
        Alternatively, we can simply test the last sentence, by removing the first sentence.
      </figcaption>
    </figure>


One nice feature is that the `AltDisplay` has hoverable furigana text enabled by default.
In other words, you can use furigana in the field.
I personally use this to insert furigana for certain names, since I'm usually not
testing myself on how to read a name.

For example, the card below has the following HTML:
```html
上条[かみじょう] 恭介[きょうすけ]君のことお<b>慕い</b>してましたの
```

{{ img("altdisplay with furigana", "assets/altdisplay_furigana.gif") }}


!!! note
    If you are using a vocab card, you can use `AltDisplay`
    to show something that differs from the `Word` field.

!!! note
    On Hybrid Card types, the `AltDisplay` field only affects the sentence, and not
    the front displayed word.



## Hints
Finally, you can include a customized hint to show at the front of the card, by using the `Hint` field.
This will show as a collapsible field at the front of card.

If you do not want the hint to be hidden by default, you can use the `HintNotHidden` field instead.

=== "Hint"
    {{ img("hint field demo", "assets/hint.gif") }}
=== "HintNotHidden"
    {{ img("HintNotHidden field demo", "assets/hint_not_hidden.png") }}

---



# Modifying the Back Side
* The `PrimaryDefinition` field contains the main content, and should be the main field to edit
    if one wants to put down more notes about the card.

* The `AdditionalNotes` field is useful if you want to put down even more notes,
    but keep it in a collapsible field to reduce vertical space.

    Here are some ways you can use this field:

    * Recording the source of the media
    * Notes on the scene's context
    * The text surrounding the sentence
    * In general, any info that is not crutial to understanding the tested content

* Bolding anything in these sections will highlight the word in a light yellow tint,
    to make the bold stand out more.

{{ img("", "assets/nisemono_modify_back_side.png") }}


## Modifying Images and Pitch Accent
As there are plenty of ways to modify images and pitch accent,
they are discussed in their respective pages:

* [Images](images.md)
* [Pitch Accent](autopa.md)

---



# Modifying Other Aspects of the Card

## `Key` field
This contains the tested word.
In other words, this contains the exact same content as the field below,
but this field is specifically not used in the card template.
This is to allow the user to modify the key if duplicates arise,
while still being able to test the word.

For example, if I were to test different usages of 上,
I can change this key value to `上 (preposition)`, `上 (grammar)`,
etc. and add a new card.

It is expected that this `Key` field is unique;
a warning will appear on cards that have a duplicate key.

## `Comment` field
Similarly to the `Key` field, this field will not be used in any card template.
In other words, this is a place where you can write down notes without affecting the card itself.

## `Picture` field
As an aside, you can put text in this field instead of a picture, and it should still work.
This is useful if you forgot to add the picture, or just don't want to add the picture
in the first place.

---


# Sorting by Frequency

By default, this note type comes with a `FrequencySort` field,
which is the equivalent of Marv's `Frequency` field in
[this](https://github.com/MarvNC/JP-Resources#sorting-mined-anki-cards-by-frequency) guide.
Visit the aformentioned link (and scroll down to `Usage`)
to see how to sort and review your cards by frequency.

---





# Testing Pitch Accent
This note type provides many options to target exactly what parts of pitch accent
you want to test yourself on.
By default, pitch accent is not tested.

To test for pitch accent, fill the `PAShowInfo` field.
You should see a circle to the left of the word or sentence.



## Pitch Accent Indicator
This circle you see is called the "Pitch Accent Indicator", or "PA Indicator" for short.
How this card indicates what pitch accent is tested is by the PA indicator's color.


{{ img("pitch accent indicators", "assets/pa_indicators.png") }}


Here are what the colors represent:

* **Green:** The *entire sentence* is tested.
* **Blue:** Only the *word* is tested.
* **Red:** Pitch accent should *not be tested* in any way.

If you ever forget what the colors mean, you can hover your mouse over the circle to
get a description of what is being tested.

Alternatively, you can look at the top right of the screen and look at the value after the `/`.

{{ img("pitch accent indicator hover demo", "assets/pa_indicator_hover.gif") }}


!!! note
    If the tested content is a sentence (card), but you want to only test for word pitch accent,
    you would not be able to see the word normally.
    To see the word that is tested, there is a button to toggle whether the word is highlighted or not.
    The content that is highlighted is exactly what is bolded in the `Sentence`
    (or `AltDisplay` / `AltDisplayPASentenceCard`) field, which is the added word by default.

    {{ img("show word button demo", "assets/show_word_button.gif") }}


## Selecting the Pitch Accent

The following shows how to fill in the proper fields to test pitch accent:


| Filled fields | PA Indicator | Separated Cards |
|-|-|-|
| (None, default) | (Doesn't exist) |     |
| `PAShowInfo` | Green (sentence) or blue (word), <br> depending on the tested content |     |
| `PAShowInfo` & <br> `PADoNotTest` | Red (not tested) |     |
| `PAShowInfo` & <br> `PATestOnlyWord` | Blue (word) |     |
| `PAShowInfo` & <br> `PASeparateWordCard` | Red (not tested) | Word |
| `PAShowInfo` & <br> `PASeparateSentenceCard` | Blue (word) | Sentence |
| `PAShowInfo` & <br> `PASeparateWordCard` & <br> `PASeparateSentenceCard` | Red (not tested) | Word & Sentence |

To clarify some of the above:

* By default, if only `PAShowInfo` is filled, then the entire display is tested
    * For vocab cards, targeted sentence cards, and hybrid vocab cards,
      only the word PA is tested (PA indicator: blue).
    * For sentence cards and hybrid sentence,
      the entire sentence PA is tested (PA indicator: green).
* To test just the word pitch accent, fill the `PATestOnlyWord` field.
* To create completely separate cards to just test pitch accent on,
  use the fields `PASeparateSentenceCard` and/or `PASeparateWordCard`.
* If a PA word card is created, then the default card does not test pitch accent.
  Similarly, if a PA sentence card is created, then the default card only tests the word pitch accent.



## Modifying Pitch Accent Sentence Cards
The field `AltDisplayPASentenceCard` exists to customize the display of the
PA sentence card, if it exists.
It works similarly to `AltDisplay`, and takes priority over `AltDisplay`
in the PA sentence card.



## Colored Quotes Instead of PA Indicator
(TODO)


Runtime Options:

```
"modules": {
  "sent-utils": {
    "pa-indicator-color-quotes": ...
  }
}
```

TODO picture comparisons between word PA indicator in quotes / word PA with PA indicator


---



# Cloze Deletion Cards
In other words, "fill-in-the-blank cards". This allows you to create cards
that tests word audio or sentence audio.

To create a cloze deletion card, simply fill in the `SeparateClozeDeletionCard` field.
The words that are hidden are exactly the words that are bolded in the `Sentence` (or `AltDisplay`) field.

To create a sentence audio card, copy/paste the sentence into `AltDisplay`, and bold the entire `AltDisplay` field (say, with `ctrl+a` and `ctrl+b`).
There's currently no shortcut to creating a sentence audio card.

TODO: IsSentenceCard -> tests entire sentence, not filled -> currently as is

{{ img("cloze deletion card", "assets/cloze_deletion.png") }}



