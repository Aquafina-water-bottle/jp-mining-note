
This entire section is dedicated to showcasing the user interface,
as well as how to use the fields and card options to change the card
to your liking.


# Table of Contents
1. [Definitions](usage#definitions)
1. [UI Summary](usage#user-interface-summary)
1. [Modifying: Front](usage#modifying-the-front-side-tested-content)
1. [Modifying: Back](usage#modifying-the-back-side)
1. [Modifying: Other](usage#modifying-other-aspects-of-the-card)
1. [Testing Pitch Accent](usage#testing-pitch-accent)
1. [Options](usage#javascript-options)
1. [Cloze Deletion Cards](usage#cloze-deletion-cards)



# Definitions used
**Binary Field:**
A field that checks whether it is filled or not with any value, say `1`.
The default is implied by the name of the field, and a value of "true" means that the field is filled.
For example, the `IsSentenceCard` field will turn the card into a sentence card if filled.
If it is not filled, then the card will be a word card.
To fill a field automatically, see [here](faq#how-do-i-change-the-default-value-of-a-binary-field).

To "toggle" a binary field means to either fill the value if is not filled yet,
or to remove the value if it is filled.
In other words, it means to flip the value of the field between empty and filled.

<!--**Note vs Card** (Anki fundamentals):
In a nutshell, a note is a collection of fillable fields.
One note can create multiple cards, and cards are the actual things you see and study off of.
See the official Anki documentation
[here](https://docs.ankiweb.net/getting-started.html#key-concepts)
for additional information.-->

**PA:** Short for "Pitch Accent".


# User Interface
Most of the user interface is already shown off in the video demo in the README,
and I would recommend watching it before continuing.
However, to dispell any mysteries, here is a fully annotated summary of the user interface.


[[assets/eg_fushinnsha_diagram.png]]


Additional information on some parts of the UI is stated below:

## Info Circle
On hover, the info circle on the top left corner just shows some basic info.

TODO gif

However, it serves as a sort of notification system to the user, when it has a color.

#### Error
TODO gif

This should only appear when some javascript code fails.
In other words, this should **not** appear normally.
If you get this without modifying the note in any way,
please report this as an issue!

#### Warning
TODO gif

This serves to warn the user about something.
It can appear without breaking the functionality of the card.
In other words, you can choose to ignore it.

#### Leech

TODO gif

When the card is a leech, the circle is highlighted yellow
(only on the back side) to indicate that it is a leech.



<!--(not to be confused with [Cade's kanji hover](https://cademcniven.com/projects/kanjihover/))-->
## Kanji Hover
Kanji hover shows you if you have seen the kanji in previous cards or not.
By default, it searches for the kanji within the "Word" field,
only for notes of the same type (JP Mining Note).

[[assets/kanji_hover.gif]]


To explain exactly how the results are being shown,
the words are searched and moved into 3 categories:
- The two oldest, not new cards (already reviewed before, in order of add date)
- The two latest, not new cards (the most recent two cards that you have reviewed, in order of add date)
- The two oldest, new cards (the first 2 new cards that you will see with the kanji)

The last category (the new cards) are greyed out to show that you haven't reviewed
the card yet (i.e. you may not know the word yet).
Conversely, the first two categories (the non-new cards) represent words that you likely already
know, so they are not greyed out.

* **Note**: <br>
  The number of results per category can be changed in the
  [options file](usage#javascript-options).



#### Results Sorting
The above makes the assumption that you are reviewing in order of creation date,
rather than the time of first review, to save resources.
In other words, if you re-ordered your cards to be different from the add-date,
then the kanji hover will not be able to recognize that.

For people who review in order of frequency only, then the assumption above is completely broken.

Unfortunately, there is currently no way to order the results by anything
other than by the creation date.


#### Suspended Cards
Some assumptions are made about suspended cards.
For example, suspended cards flagged as `green` are counted in the "non-new" cards category
(known words), and suspended cards flagged as `red` are counted as words that you
do not know AND will not study in the future (not shown in any category).
This can be changed in the [options file](usage#javascript-options).


## Word Pitch
The colors and what the lines mean are all described in the
official anki addon page as specified
[here](https://ankiweb.net/shared/info/1225470483).


## Images
TODO non bullet point

- click to zoom (the obvious feature)
- yomichan inserted images + user inserted images get changed to be similar to how yomichan displays images
- TODO gif


# Modifying the Front Side (Tested Content)
The front side is exactly the content that we want to test ourselves on.
Naturally, since we can test ourselves on many aspects of the word, there are
many ways to change this tested content.


## Card types
The default card type is a vocab card,
where the tested content is simply the word.

| [[assets/nisemono_word.png]] |
|:--:|
| A vocab card. |

To change the card to a sentence card, toggle the `IsSentenceCard` binary field.

| [[assets/nisemono_sentence.png]] |
|:--:|
| A sentence card. |

There are many other card types that this note supports.
To see the full list, see [this section](cardtypes).

[[assets/card_types_1_pic.png]]


## Changing the Displayed Content
Vocab cards show the `Word` field and sentence cards show the `Sentence` fields by default.
However, you can modify what is exactly shown in the front by using the `AltDisplay` field.

| [[assets/nisemono_altdisplay_newline.png]] |
|:--:|
| For example, the previous sentence card looks a little ugly, because the sentence splits off at a strange point. In the `AltDisplay` field, we add a newline at a sensible place (after the period). |

| [[assets/nisemono_altdisplay_last_sent.png]] |
|:--:|
| Another example: if we want to only test the last sentence. |




One nice feature is that the `AltDisplay` has hoverable furigana text enabled by default.
In other words, you can use furigana in the field.
I personally use this to insert furigana for certain names, since I'm usually not
testing myself on how to read a name.



| [[assets/altdisplay_furigana.gif]] |
|:--:|
| The front display, with the `AltDisplay` containing the following HTML: <br> `上条[かみじょう] 恭介[きょうすけ]君のことお<b>慕い</b>してましたの` |

Similarly, if you are using a vocab card, you can use `AltDisplay`
to show something that differs from the `Word` field.



* **Note**: <br>
  On Hybrid Card types, the `AltDisplay` field only affects the sentence, and not
  the front displayed word.

<!-- apparently this syntax isn't available in the wikis...
> **Note** <br>
> On Hybrid Card types, the `AltDisplay` field only affects the sentence, and not
> the front displayed word.
 -->


## Hints
Finally, you can include a customized hint to show at the front of the card, by using the `Hint` field.
This will show as a collapsible field at the front of card.

[[assets/hint.gif]]



If you do not want the hint to be hidden by default, you can use the `HintNotHidden` field instead.

[[assets/hint_not_hidden.png]]


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

[[assets/nisemono_modify_back_side.png]]


## Modifying Pitch Accent

TODO update
- primary field to edit is `PAOverride`
- takes in the inputs:
    - number (position), or
    - text: whatever you want it to show
- for most people, the number will suffice
- TODO gif


#### Auto Selected Pitch Accent
- TODO details on exactly how the displayed pitch accent is displayed

priority:
- PA Override number
- PA Override raw text
- PA Positions
- AJT Word Pitch

if module disabled:
- only shows AJT Word Pitch

reading:
- AJT word pitch by default
- can be changed to hiragana / katakana / katakana with long vowel marks
- ajt word pitch is katakana with long vowel marks (most of the time)
    - some words don't have long vowel marks (i.e. adjectives ending with 〜しい will be displayed as 〜シイ and not 〜シー)


#### Pitch Accent Styling Details
- TODO outdated
- TODO only if you care about the exact text value
- TODO what bold does


Editing the content in `WordPitch` requires some special attention.
To preserve the style and get expected results, you must use `Ctrl + Shift + x` when editing the field,
and edit the html tags directly. Use other cards as examples of what the html should look like.

TODO more details + example (華)
- TODO replace with positions :eyes:

example of something that has all possible formats (bold, overline, downstep, nasal, devoiced)
```html
チュ<span style="text-decoration:overline;" class="pitchoverline">ーカ<span class="nasal">°</span></span><span class="downstep"><span class="downstep-inner">ꜜ</span></span><span class="nopron">ク</span>セイ<b>・チュ<span style="text-decoration:overline;" class="pitchoverline">ーカ<span class="nasal">°</span><span class="nopron">ク</span></span><span class="downstep"><span class="downstep-inner">ꜜ</span></span>セイ</b>
```


The `WordPitch` field may have more than one pitch accent for a given word.
To choose which pitch accent is correct to the sentence,
one can bold the unused pitch accents to grey them out.


| [[assets/bold_pa.png]] |
|:--:|
| The section on the left is bolded to grey it out. |



# Modifying Other Aspects of the Card

## `Key` field
This contains the tested word.
In other words, this contains the exact same content as the field below,
but this field is specifically not used in the card template.
This is to allow the user to modify the key if duplicates arise,
while still being able to test the word.

For example, if I were to test different usages of 上,
I can change this key value to `上 (proposition)`, `上 (grammar)`,
etc. and add a new card.

It is expected that this `Key` field is unique;
a warning will appear on a card that has a duplicate key.

## `Comment` field
Similarly to the `Key` field, this field will not be used in any card template.
In other words, this is a place where you can write down notes without affecting the card itself.




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


| [[assets/pa_indicators.png]] |
|:--:|
| The possible types of PA indicators. |

<!--
| [[assets/pa_indicator_circles.png]] |
|:--:|
| The possible circles to the left of the display. |
-->


Here are what the colors represent:

* **Green:** The *entire sentence* is tested.
* **Blue:** Only the *word* is tested.
* **Red:** Pitch accent should *not be tested* in any way.

If you ever forget what the colors mean, you can hover your mouse over the circle to
get a description of what is being tested.

Alternatively, you can look at the top right of the screen and look at the value after the `/`.

[[assets/pa_indicator_hover.gif]]

<!--
| [[assets/pa_indicator_hover.png]] |
|:--:|
| The PA indicator when the cursor hovers over it. |
-->


* **Note**: <br>
  If the tested content is a sentence (card), but you want to only test for word pitch accent,
  you would not be able to see the word normally.
  To see the word that is tested, there is a button to toggle whether the word is highlighted or not.
  The content that is highlighted is exactly what is bolded in the `Sentence`
  (or `AltDisplay` / `AltDisplayPASentenceCard`) field, which is the added word by default.

[[assets/show_word_button.gif]]


## Selecting the Pitch Accent

The following shows how to fill in the proper fields to test pitch accent:

| Filled fields | PA Indicator | Separated Cards |
|-|-|-|
| (None, default) | (Doesn't exist) |     |
| `PAShowInfo` | Green (sentence) or blue (word), depending on the tested content |     |
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




# (Javascript) Options
There are many options that can be set within the (javascript) options file.
To edit this, navigate to your deck's [media folder](https://docs.ankiweb.net/files.html#file-locations),
and open the `_jpmn-options.js` file as a text file.
The contents of the file should look something like the following:


```
var JPMNOpts = (function (my) {
  my.settings = {
    ... // a bunch of settings
  }
  return my;
}(JPMNOpts || {}));
```

I recommend going through this file and selecting the options that best fits your workflow.
As each setting is already documented in the file,
the settings will not be documented here other than for showing off some pictures:

TODO pictures.



# Cloze Deletion Cards
Cloze deletion cards are simply a fancy way of saying "fill-in-the-blank cards".
To test yourself, you simply check if you can hear the correct word in the missing sections.

To create a cloze deletion card, simply fill in the `SeparateClozeDeletionCard` field.
The words that are hidden are exactly the words that are bolded in the `Sentence` (or `AltDisplay`) field.


| [[assets/cloze_deletion.png]] |
|:--:|
| The highlighted word(s) are automatically hidden. |



<!--
# Miscellaneous Notes
* The contents of `Comment` does not appear in any card.
  You can use this to write down anything that you don't want to be shown in any card.
* The `Positions` field is populated with the pitch accent positions
  (indicates the mora of which the downstep happens).
  Although filled, this is currently UNUSED, and can be safely removed without any adverse effects.
* You might have noticed that there are multiple fields to display pitch accent.
  The main field that is used is the `WordPitch` field,
  because it is the easiest to edit.
  The reason for the other fields (`Graph` and `Position`) is to confirm that the
  pitch accent generated in `WordPitch` is "correct", in case of any doubts.

  -->
