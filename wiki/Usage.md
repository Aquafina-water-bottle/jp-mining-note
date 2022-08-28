
This entire section is dedicated to testing exactly what you want, through card options and editing.
NOTE: This is still a WIP section as I figure out how to best present the features of this card.

# Definitions used
**Binary Field:**
A field that checks whether it is filled or not with any value, say `1`.
The default is implied by the name of the field, and a value of "true" means that the field is filled.
For example, the `IsSentenceCard` field will turn the card into a sentence card if filled.
If it is not filled, then the card will be a word card.
To fill a field automatically, see here (TODO).

**Note vs Card** (Anki fundamentals):
In a nutshell, a note is a collection of fillable fields.
One note can create multiple cards, and cards are the actual things you see and study off of.
See the official Anki documentation
[here](https://docs.ankiweb.net/getting-started.html#key-concepts)
for additional information.

**PA:** Short for "Pitch Accent".


# Card types
(WIP - currently a separate page)

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

# Modifying the Front Side
The default card type is a vocab card.
* To change the card to a sentence card, toggle the `IsSentenceCard` field.


## Full control over the display
Vocab cards show the `Word` field and sentence cards show the `Sentence` fields by default.
However, you can modify what is exactly shown in the front by using the `AltDisplay` field.
For example, I personally use the `Sentence` field to contain text for the entire audio clip.
If I want to test only a portion of the sentence, I put what I want to test into the `AltDisplay` field.


| [[assets/altdisplay.png]] |
|:--:|
| Notice how the section at the bottom (`Sentence`) is different from the tested sentence at the top. |



One nice feature is that the `AltDisplay` has hoverable furigana text enabled by default.
In other words, you can use furigana in the field.
I personally use this to insert furigana for certain names, since I'm usually not
testing myself on how to read a name.


| [[assets/furigana_altdisplay.png]] |
|:--:|
| A picture of the front display, with the cursor over the text. |


Similarly, if you are using a vocab card, you can use `AltDisplay`
to show something that differs from the `Word` field.


## Hints
Finally, you can include a customized hint to show at the front of the card, by using the `Hint` field.
This will show as a collapsible field at the front of card.


| [[assets/hint.png]] |
|:--:|
| Showcasing how hints are shown and hidden. Hints are hidden by default. |


If you do not want the hint to be hidden by default, you can use the `HintNotHidden` field instead.


# Modifying the Back Side
Not much has to be said about modifying the back side of the card.

The `PrimaryDefinition` field contains the main content, and should be the main field to edit
if one wants to put down more notes about the card.
I personally use this to write down important grammar points, pitch accent info, etc.
on top of the defintions.

The `AdditionalNotes` field is useful if you want to put down even more notes,
but keep it in a collapsible field to reduce vertical space.
I personally use it to write down the context of the scene,
and other notes that aren't completely crutial to understanding the tested content.



# Testing Pitch Accent
This note type provides many options to target exactly what parts of pitch accent
you want to test yourself on. Let's start out with the basics...


## "Wait, I don't want to test pitch accent!!"
If you do not want to test pitch accent,
all you have to do is fill the `PADoNotShowInfoLegacy` by default.
This will remove the PA indicator at the front of the card,
and you can now safely ignore this entire section.


## "Of course I want to test pitch accent!"
Great! There are two main levels of pitch accent that can be tested with this note,
and that is word level and sentence level pitch accent.
How this card indicates what pitch accent is tested is by the PA indicator, which is a colored circle
to the left of the sentence or word.


| [[assets/pa_indicator_circles.png]] |
|:--:|
| The possible circles to the left of the display. |


Here are what the colors represent:

* **Green:** The *entire sentence* is tested.
* **Blue:** Only the *word* is tested.
* **Red:** Pitch accent should *not be tested* in any way.

If you ever forget what the colors mean, you can hover your mouse over the circle to
get a description of what is being tested.

| [[assets/pa_indicator_hover.png]] |
|:--:|
| The PA indicator when the cursor hovers over it. |

Alternatively, you can look at the top right of the screen and look at the value after the `/`.

(TODO show the top right screen)


Notice that if the tested content is a sentence (card), you would not be able to see the word normally.
To see the word that is tested, there is a button to toggle whether the word is highlighted or not.
The content that is highlighted is exactly what is bolded in the `Sentence`
(or `AltDisplay` / `AltDisplayPASentenceCard`) field, which is the added word by default.

(TODO picture)


Finally, here is how to select what pitch accent being tested:
* By default, the entire display is tested.
    * For basic vocab and sentence cards, the meaning of "the entire display" is trivial.
    * Targetted sentence cards, click vocab cards and hover vocab cards will only test the word pitch accent.
    * Click sentence cards and hover sentence cards will test the entire sentence pitch accent.
* To test just the word pitch accent, fill the `PATestOnlyWord` field.
* To create completely separate cards to just test pitch accent on,
  use the fields `PASeparateSentenceCard` and/or `PASeparateWordCard`.
* **NOTE:** if a PA word card is created, then the default card does not test pitch accent.
  Similarly, if a PA sentence card is created, then the default card only tests the word pitch accent.


#### What Pitch Accent is tested (summary)
The following shows how to fill in the proper fields to test pitch accent:

| Filled fields | PA Indicator | Separated Cards |
|-|-|-|
| (None, default) | Green (sentence) or blue (word), depending on the tested content |     |
| PADoNotShowInfoLegacy | Completely removed |     |
| PADoNotTest | Red (not tested) |     |
| PATestOnlyWord | Blue (word) |     |
| PASeparateWordCard | Red (not tested) | Word |
| PASeparateSentenceCard | Blue (word) | Sentence |
| PASeparateWordCard & <br> PASeparateSentenceCard | Red (not tested) | Word & Sentence |


#### Modifying Pitch Accent
Editing the content in `WordPitch` requires some special attention.
To preserve the style and get expected results, you must use `Ctrl + Shift + x` when editing the field,
and edit the html tags directly. Use other cards as examples of what the html should look like.

The `WordPitch` field may have more than one pitch accent for a given word.
To choose which pitch accent is correct to the sentence,
one can bold the unused pitch accents to grey them out.


#### Modifying Pitch Accent Sentence Cards
The field `AltDisplayPASentenceCard` exists to customize the display of the
PA sentence card, if it exists.
It works similarly to `AltDisplay`, and takes priority over `AltDisplay`
in the PA sentence card.



| [[assets/bold_pa.png]] |
|:--:|
| The section on the left is bolded to grey it out. |



# Cloze Deletion Cards
Cloze deletion cards are simply a fancy way of saying "fill-in-the-blank cards".
To test yourself, you simply check if you can hear the correct word in the missing sections.

To create a cloze deletion card, simply fill in the `SeparateClozeDeletionCard` field.
The words that are hidden are exactly the words that are bolded in the `Sentence` field.


| [[assets/cloze_deletion_front.png]] |
|:--:|
| The highlighted words are automatically hidden. Note that this cards has two hidden words. |


| [[assets/cloze_deletion_back.png]] |
|:--:|
| The back side of the card. Note that I edited the reading field to include two words. |



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

