
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


## Modifying Pitch Accent Sentence Cards
The field `AltDisplayPASentenceCard` exists to customize the display of the
PA sentence card, if it exists.
It works similarly to `AltDisplay`, and takes priority over `AltDisplay`
in the PA sentence card.






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

