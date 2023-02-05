
This page is dedicated showing how to edit the note fields to change the card to your liking.


!!! note
    If you want to edit the user interface for all cards,
    see the [UI Customization](uicustomization.md) page.


# Definitions
**Binary Field:**
A field that checks whether it is filled or not with any value, say `1`.
The default is implied by the name of the field, and a value of "true" means that the field is filled.
For example, the `IsSentenceCard` field will turn the card into a sentence card if filled.
If it is not filled, then the card will be a word card.
To fill a field automatically, see
[here](faq.md#how-do-i-change-the-default-value-of-a-binary-field){:target="_blank"}.


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
<i><sup>Main Page: [Card Types](cardtypes.md)</sup></i>

The default card type is a vocab card,
where the tested content is simply the word.

To change the card to a sentence card, fill the `IsSentenceCard` binary field.

=== "Vocab card"
    {{ img("vocab card example", "assets/fieldref/word.png") }}
=== "Sentence card"
    {{ img("sentence card example", "assets/fieldref/sentence.png") }}


## AltDisplay: Changing the Displayed Content
<!-- TODO: real use cases that I use:
    - bolding specific parts in TSCs (say, to test a particular sentence)
    - replacing words with full kanji form
    - furigana for names
-->
Vocab cards show the `Word` field and sentence cards show the `Sentence` fields by default.
However, you can modify what is exactly shown in the front by using the `AltDisplay` field.

=== "Newline"
    <figure markdown>
      {{ img("altdisplay with newline", "assets/fieldref/altdisplay_newline.png") }}
      <figcaption>
        The previous sentence card looks a little ugly,
        because the sentence splits off at a strange point.
        To fix this, we add a newline at a sensible place (after the period) in the `AltDisplay` field.
      </figcaption>
    </figure>

=== "Last sentence only"
    <figure markdown>
      {{ img("altdisplay with only last sentence", "assets/fieldref/altdisplay_last_sent.png") }}
      <figcaption>
        Alternatively, we can simply test the last sentence, by removing the first sentence.
      </figcaption>
    </figure>



### AltDisplay: Furigana

One nice feature is that the `AltDisplay` has hoverable furigana text enabled by default.
In other words, you can use furigana in the field.
I personally use this to insert furigana for certain names, since I'm usually not
testing myself on how to read a name.

For example, the card below has the following HTML:
```html
上条[かみじょう] 恭介[きょうすけ]君のことお<b>慕い</b>してましたの
```

{{ img("altdisplay with furigana", "assets/fieldref/altdisplay_furigana.gif") }}

<br>


### AltDisplay: Final Notes

* The example with adding a newline to `AltDisplay` is somewhat contrived.
    More realistically, you would want to add the newline to the `Sentence` field.

    If you are using [AJT Furigana](setupanki.md#ajt-furigana),
    I recommend deleting the text within the `SentenceReading` field
    before editing the `Sentence` field, so the furigana can be automatically
    generated with the newly formatted `Sentence` field.

* If you are using a vocab card, you can use `AltDisplay`
    to show something that differs from the `Word` field.

* On Hybrid Card types, the `AltDisplay` field only affects the sentence, and not
    the front displayed word.

<br>



## Hints
Finally, you can include a customized hint to show at the front of the card, by using the `Hint` field.
This will show as a collapsible field at the front of card.

If you do not want the hint to be hidden by default, you can use the `HintNotHidden` field instead.

=== "Hint"
    {{ img("hint field demo", "assets/fieldref/hint.gif") }}
=== "HintNotHidden"
    {{ img("HintNotHidden field demo", "assets/fieldref/hint_not_hidden.png") }}

---



# Modifying the Back Side

The main two fields that one can add text to is
`PrimaryDefinition` and `AdditionalNotes`.
Bolding anything in these sections will highlight the word in a light yellow (or blue in light mode) tint,
to make the bolded text stand out more.

{{ img("", "assets/fieldref/bold.png") }}

<br>

## `PrimaryDefinition` field
The `PrimaryDefinition` field contains the main content, and should be the main field to edit
if one wants to put down more notes about the card.

<br>


## `AdditionalNotes` field
The `AdditionalNotes` field is useful if you want to write down even more notes,
but keep it in a collapsible field to reduce vertical space.

Here are some suggestions on how you can use this field:

* Recording the source where the scene came from
* Adding custom notes on the scene's context
* Recording the sentences surrounding the mined sentence

In general, this field should be used for any info that is not crucial
to understanding the tested content.



## Modifying Images & Pitch Accent
As there are plenty of ways to modify images and pitch accent,
they are discussed in their respective pages:

* [Images](images.md) (`Picture` and `PrimaryDefinitionPicture`)
* [Pitch Accent](autopa.md) (`PAOverride` and `PAOverrideText`)

---





# Testing Pitch Accent
This note type provides many options to target exactly what parts of pitch accent
you want to test yourself on.
By default, no special indicator is shown on whether pitch accent is tested or not.

To test for pitch accent, fill the `PAShowInfo` field.
You should see a circle to the left of the word or sentence.



## Pitch Accent Indicator
This circle you see is called the "Pitch Accent Indicator", or "PA Indicator" for short.
How this card indicates what pitch accent is tested is by the PA indicator's color.


{{ img("pitch accent indicators", "assets/fieldref/pa_indicators.png") }}


Here are what the colors represent:

* **Green:** The *entire sentence* is tested.
* **Blue:** Only the *word* is tested.
* **Red:** Pitch accent should *not be tested* in any way.

If you ever forget what the colors mean, you can hover your mouse over the circle to
get a description of what is being tested.

Alternatively, you can look at the top right of the screen and look at the value after the `/`.

{{ img("pitch accent indicator hover demo", "assets/fieldref/pa_indicator_hover.gif") }}


!!! note
    If the tested content is a sentence (card), but you want to only test for word pitch accent,
    you would not be able to see the word normally.
    To see the word that is tested, there is a button to toggle whether the word is highlighted or not.
    The content that is highlighted is exactly what is bolded in the `Sentence`
    (or `AltDisplay` / `AltDisplayPASentenceCard`) field, which is the added word by default.

    {{ img("show word button demo", "assets/fieldref/show_word_button.gif") }}


!!! note
    If your card is a vocab card, then full sentence is shown as a collapsed field by default.
    This is only here to check your hearing with your guessed pitch accent, when used
    in conjunction with the sentence play button.


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




# Other Fields

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


<br>

## `Comment` field
Similarly to the `Key` field, this field will not be used in any card template.
In other words, this is a place where you can write down notes without affecting the card itself.

<br>

## `FrequencySort` field

By default, this note type comes with a `FrequencySort` field,
which is the equivalent of Marv's `Frequency` field in
[this](https://github.com/MarvNC/JP-Resources#sorting-mined-anki-cards-by-frequency) guide.
Visit the aformentioned link (and scroll down to `Usage`)
to see how to sort and review your cards by frequency.


!!! note
    I personally use this field by re-ordering only some of the most common words in my deck,
    and then separating it with a step of 1.
    This ensures that every card in the deck will eventually be reached.


---

# Cloze Deletion Cards

!!! warning
    I recently realized that I attached the wrong name to these cards.
    These should be simply known as "Audio cards", i.e. word audio card or sentence audio card.
    Although "Cloze Deletion" will be used throughout the templates and documentation,
    it will be renamed to "Audio cards" when version `0.12.0.0` releases.

Cloze Deletion cards are, simply put, "fill-in-the-blank cards".
This allows you to create cards that tests word audio or sentence audio.

To create a cloze deletion card, simply fill in the `SeparateClozeDeletionCard` field.
The words that are hidden are exactly the words that are bolded in the `Sentence` (or `AltDisplay`) field.

To create a sentence audio card, copy/paste the sentence into `AltDisplay`, and bold the entire `AltDisplay` field (say, with `ctrl+a` and `ctrl+b`).
There's currently no shortcut to creating a sentence audio card.


{{ img("cloze deletion card", "assets/fieldref/cloze_deletion.png") }}



