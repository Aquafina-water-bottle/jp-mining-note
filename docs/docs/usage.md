
This entire section is dedicated to showcasing the user interface,
as well as how to use the fields and card options to change the card
to your liking.


# Definitions
**Binary Field:**
A field that checks whether it is filled or not with any value, say `1`.
The default is implied by the name of the field, and a value of "true" means that the field is filled.
For example, the `IsSentenceCard` field will turn the card into a sentence card if filled.
If it is not filled, then the card will be a word card.
To fill a field automatically, see [here](faq.md#how-do-i-change-the-default-value-of-a-binary-field).

To "toggle" a binary field means to either fill the value if is not filled yet,
or to remove the value if it is filled.
In other words, it means to flip the value of the field between empty and filled.

**PA:** Short for "Pitch Accent".

---



# User Interface
Most of the user interface is already shown off in the video demo in the README,
and I would recommend watching it before continuing.
However, to dispell any mysteries, here is a fully annotated summary of the user interface.


{{ img("UI annotated summary", "assets/eg_fushinnsha_diagram.png") }}


Additional information on some parts of the UI is stated below:

## Info Circle
On hover, the info circle on the top left corner just shows some basic info.

TODO gif

However, it serves as a sort of notification system to the user, when it has a color.

### Error
TODO gif

This should only appear when some javascript code fails.
In other words, this should **not** appear normally.
If you get this without modifying the note in any way,
please report this as an issue!

### Warning
TODO gif

This serves to warn the user about something.
It can appear without breaking the functionality of the card.
In other words, you can choose to ignore it.

### Leech

TODO gif

When the card is a leech, the circle is highlighted yellow
(only on the back side) to indicate that it is a leech.



<!--(not to be confused with [Cade's kanji hover](https://cademcniven.com/projects/kanjihover/))-->
## Kanji Hover
<i><sup>Main page: [Kanji Hover](kanjihover.md)</sup></i>

Kanji hover shows you if you have seen the kanji in previous cards or not.
By default, it searches for the kanji within the "Word" field,
only for notes of the same type (JP Mining Note).

{{ img("kanji hover demo", "assets/kanji_hover.gif") }}

Notice how some results are greyed out.
Those results are results from cards that have not been reviewed yet.
Conversely, as non-greyed out results come from cards that you have already reviewed,
they should represent words that you already know.


!!! note
    The maximum number of results, as well as the exact queries themselves,
    can be changed in the [options file](runtimeoptions.md).


## Word Pitch
The colors and what the lines mean are all described in the
official anki addon page as specified
[here](https://ankiweb.net/shared/info/1225470483).


## Images
TODO non bullet point

- click to zoom (the obvious feature)
- yomichan inserted images + user inserted images get changed to be similar to how yomichan displays images
- TODO gif

---



# Modifying the Front Side (Tested Content)
The front side is exactly the content that we want to test ourselves on.
Naturally, since we can test ourselves on many aspects of the word, there are
many ways to change this tested content.


## Card types
The default card type is a vocab card,
where the tested content is simply the word.

{{ img("vocab card example", "assets/nisemono_word.png") }}

To change the card to a sentence card, toggle the `IsSentenceCard` binary field.

{{ img("sentence card example", "assets/nisemono_sentence.png") }}

There are many other card types that this note supports.
To see the full list, see [this section](cardtypes.md).

{{ img("card types compilation", "assets/card_types_1_pic.png") }}


## Changing the Displayed Content
Vocab cards show the `Word` field and sentence cards show the `Sentence` fields by default.
However, you can modify what is exactly shown in the front by using the `AltDisplay` field.

For example, the previous sentence card looks a little ugly,
because the sentence splits off at a strange point.
In the `AltDisplay` field, we add a newline at a sensible place (after the period)
to get the following:

{{ img("altdisplay with newline", "assets/nisemono_altdisplay_newline.png") }}


Another example is shown below, when we want to only test the last sentence:

{{ img("altdisplay with only last sentence", "assets/nisemono_altdisplay_last_sent.png") }}




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

{{ img("hint field demo", "assets/hint.gif") }}



If you do not want the hint to be hidden by default, you can use the `HintNotHidden` field instead.

{{ img("HintNotHidden field demo", "assets/hint_not_hidden.png") }}

---



# Modifying the Back Side
Not much has to be said about modifying the back side of the card,
outside of modifying pitch accent.

* The `PrimaryDefinition` field contains the main content, and should be the main field to edit
    if one wants to put down more notes about the card.
    I personally use this to write down grammar point explanations, sentence pitch accent info, etc.
    on top of the defintions.

* The `AdditionalNotes` field is useful if you want to put down even more notes,
    but keep it in a collapsible field to reduce vertical space.
    I personally use it to write down the context of the scene,
    and other notes that aren't completely crutial to understanding the tested content.

* Bolding anything in these sections will highlight the word in a light yellow tint,
    to make the bold stand out more.

{{ img("", "assets/nisemono_modify_back_side.png") }}


## Modifying Pitch Accent
<i><sup>Main page: [Auto Pitch Accent](autopa.md)</sup></i>

The displayed pitch accent is usually the first position found in `PAPositions`.
However, you can override this automatically chosen position using the `PAOverride` field.

TODO gif (change 偽者 to 0, 1, 2, 4)

More information and customization, including automatically coloring the word
with Migaku colors, can be found in the main page linked above.


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

---



# Testing Pitch Accent
This note type provides many options to target exactly what parts of pitch accent
you want to test yourself on.
By default, pitch accent is not tested.

To test for pitch accent, fill the `PAShowInfo` field.
You should see a circle to the left of the word or sentence.


TODO annotated image for testing pitch accent


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

---



# Cloze Deletion Cards
Cloze deletion cards are simply a fancy way of saying "fill-in-the-blank cards".
To test yourself, you simply check if you can hear the correct word in the missing sections.

To create a cloze deletion card, simply fill in the `SeparateClozeDeletionCard` field.
The words that are hidden are exactly the words that are bolded in the `Sentence` (or `AltDisplay`) field.


{{ img("cloze deletion card", "assets/cloze_deletion.png") }}


