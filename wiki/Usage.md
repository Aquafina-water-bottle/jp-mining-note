
This entire section is dedicated to testing exactly what you want, through card options and editing.
NOTE: This is still a WIP section as I figure out how to best present the features of this card.

# Definitions used
**Binary Field:**
A field that checks whether it is filled or not with any value, say `1`.
The default is implied by the name of the field, and a value of "true" means that the field is filled.
For example, the `IsSentenceCard` field will turn the card into a sentence card if filled.
If it is not filled, then the card will be a word card.
To fill a field automatically, see here (TODO).

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


# User Interface Summary
Most of the user interface is already shown off in the video demo in the README,
and I would recommend watching it before continuing.
However, to dispell any mysteries, here is a fully annotated summary of the user interface.


[[assets/eg_fushinnsha_diagram.png]]


Additional information on some parts of the UI is stated below:

## Info Circle
TODO flesh out + pictures

error (javascript error)
- should NOT appear, report as an issue if it does...

warn (caps lock enabled)
- can appear to present alerting info to the user

leech
- yellow

## Kanji Hover
TODO flesh out + pictures

[[assets/kanji_hover.gif]]

- by default, shows in 3 different categories:
- 2 oldest, not new (already reviewed before, in order of add date)
- 2 latest, not new (the latest 2 cards that you have reviewed, in order of add date)
- 2 oldest, new (the first 2 new cards that you will see with the kanji)
    - new cards are greyed out to show that you haven't reviewed the card yet (and may not know the word yet)

- makes the assumption that you are reviewing in order of add date (this may not be completely true)
    - and is completely un-true for people who are reviewing in order of frequency

- currently no way to order it in anything other than add date

## Word Pitch
The colors and what the lines mean are all described in the
official anki addon page as specified
[here](https://ankiweb.net/shared/info/1225470483).


<!--(WIP - currently a separate page)-->


<!--
# Card types
(WIP)

* figure out how to combine this section with the above to make the explanations more seamless
* might just explain the card types + features surrounding it

## Vocab
Only the tested word is shown at the front.
No changes have to be made to the fields to use a vocab card.
* tests reading and meaning for the word

## Sentence
The entire sentence is shown at the front.
* tests reading and meaning for entire sentence, as well as base form of the verb if applicable

(TODO) separate picture and make them all use the same card
| [[assets/vocab_vs_sentence_card.png]] |
| An example with a vocab card at the top and a sentence card at the bottom. |

## EXPERIMENTAL card types
This section and some other sections will be expanded in the future,
once I am happy with the resulting card types.
These are currently (bullet point) documented [here](experimental).

-->

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
To see the full list, see this section: TODO link

(TODO image, compile card types)


## Changing the Displayed Content
Vocab cards show the `Word` field and sentence cards show the `Sentence` fields by default.
However, you can modify what is exactly shown in the front by using the `AltDisplay` field.

| [[assets/nisemono_altdisplay_newline.png]] |
|:--:|
| For example, the previous sentence card looks a little ugly, because the sentence splits off at a strange point. In the `AltDisplay` field, we add a newline at a sensible place (after the period). |

| [[assets/nisemono_altdisplay_last_sent.png]] |
|:--:|
| Another example: if we want to only test the last sentence. |



<!--
For example, I personally use the `Sentence` field to contain text for the entire audio clip.
If I want to test only a portion of the sentence, I put what I want to test into the `AltDisplay` field.


| [[assets/altdisplay.png]] |
|:--:|
| Notice how the section at the bottom (`Sentence`) is different from the tested sentence at the top. |
- TODO change picture
- TODO write exactly what the value of `AltDisplay` is (within picture)
-->



One nice feature is that the `AltDisplay` has hoverable furigana text enabled by default.
In other words, you can use furigana in the field.
I personally use this to insert furigana for certain names, since I'm usually not
testing myself on how to read a name.



| [[assets/altdisplay_furigana.gif]] |
|:--:|
| The front display, with the `AltDisplay` containing the following HTML: <br> `上条[かみじょう] 恭介[きょうすけ]君のことお<b>慕い</b>してましたの` |

<!--
| [[assets/furigana_altdisplay.png]] |
|:--:|
| A picture of the front display, with the cursor over the text. |
- TODO change picture
- TODO write exactly what the value of `AltDisplay` is (within picture)
-->


Similarly, if you are using a vocab card, you can use `AltDisplay`
to show something that differs from the `Word` field.



**Note**: <br>
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

<!--
| [[assets/hint.png]] |
|:--:|
| Showcasing how hints are shown and hidden. Hints are hidden by default. |
- TODO change picture to gif
- TODO write exactly what the value of `Hint` is (within picture)
-->



If you do not want the hint to be hidden by default, you can use the `HintNotHidden` field instead.
<!--
- TODO picture
- TODO write exactly what the value of `HintNotHidden` is (within picture)
-->

[[assets/hint_not_hidden.png]]


# Modifying the Back Side
Not much has to be said about modifying the back side of the card.

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
TODO gif of hovering over the circle

<!--
| [[assets/pa_indicator_hover.png]] |
|:--:|
| The PA indicator when the cursor hovers over it. |
-->


**Note**: <br>
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


## Modifying Pitch Accent
Editing the content in `WordPitch` requires some special attention.
To preserve the style and get expected results, you must use `Ctrl + Shift + x` when editing the field,
and edit the html tags directly. Use other cards as examples of what the html should look like.

The `WordPitch` field may have more than one pitch accent for a given word.
To choose which pitch accent is correct to the sentence,
one can bold the unused pitch accents to grey them out.


| [[assets/bold_pa.png]] |
|:--:|
| The section on the left is bolded to grey it out. |

TODO replace image with something that shows the field being edited


## Modifying Pitch Accent Sentence Cards
The field `AltDisplayPASentenceCard` exists to customize the display of the
PA sentence card, if it exists.
It works similarly to `AltDisplay`, and takes priority over `AltDisplay`
in the PA sentence card.




# Options
There are many options that can be set within the options javascript file.
To edit this, navigate to your deck's media folder, and open the `_jpmn-options.js` file as a text file.
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
