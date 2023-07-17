# Preface

Previously, this note type only had vocab and sentence cards.
Although I was originally fine with this,
I started to realize some issues with only having these two card types:

* Vocab cards that require context have to be turned into sentence cards, and
* Sentence cards take a very long time to review, and can create context-based memories.

I found that many vocab cards had to be turned into sentence cards, since either the
context was fundamental to understanding the definition, or there were other parts
of the sentence that I wanted to test.
This lead to many sentence cards, which naturally meant that Anki sessions lasted longer.

I attempted to tackle these exact issues by introducing new card types
outside of the fundamental vocab and sentence cards.


{{ img("", "assets/cardtypes/all_card_types.png") }}


---

# Changing Card Type
The rest of this page will document all card types that this note can create,
and will use certain terminology such as "filling a field".
If you do not know what this means, see the
[quickstart page](quickstart.md#changing-the-card-type) on just that.


---

# Vocab Card

{{ img("", "assets/cardtypes/word.png") }}

A vocab card simply shows the target word at the front.
You test yourself on the reading and definition of the word.

**How to create:** <br>
This is the default card type.
Nothing has to be done for the card to be a vocab card.

---



# Sentence Card

{{ img("", "assets/cardtypes/sentence.png") }}

A sentence card simply shows the entire sentence at the front.
You test yourself on the reading and meaning of the entire sentence.

**How to create:** <br>
Fill the `IsSentenceCard` field.

---



# Targeted Sentence Card <small>(TSC)</small> { #targeted-sentence-card data-toc-label="Targeted Sentence Card" }

{{ img("", "assets/cardtypes/tsc.png") }}

A targeted sentence card is a special case of the sentence card.
The sentence is shown at the front, but only the highlighted content (only the word by default)
is tested.
This allows you to have all the information and context of the sentence,
but you don't have to waste your time testing other parts of the sentence.

This card type was originally defined
[here](https://tatsumoto.neocities.org/blog/discussing-various-card-templates.html#targeted-sentence-cards-or-mpvacious-cards).

**How to create:** <br>
Fill the `IsTargetedSentenceCard` field.

---



# Audio Cards
{{ feature_version("0.12.0.0") }}

(TODO new image)

{{ img("cloze deletion card", "assets/fieldref/cloze_deletion.png") }}

Audio cards allows you to create cards that tests word or sentence audio.

**Indicator:** The sentence contains <span class="jpmn-highlight">**[...]**</span>

**How to test:** <br>

1. The audio should be automatically played on the front side of the card.
    With this audio, test yourself on the meaning and reading of the unknown section.

**How to create:** <br>
Fill the `IsAudioCard` field.
The word(s) that are hidden are exactly the words that are bolded in the `Sentence`
(or the `AltDisplaySentence`) field.

!!! note
    Before version `0.12.0.0`, these were misnamed as "Cloze Deletion Cards, and the field was misnamed as `IsClozeDeletionCard`".

---


# Sentence Audio Cards
{{ feature_version("0.12.0.0") }}

(TODO image)

This is simply a regular audio card, but the entire sentence is tested.

**Indicator:** The displayed text is exactly 「<span class="jpmn-highlight">**？**</span>」

**How to test:** <br>

1. The audio should be automatically played on the front side of the card.
    With this audio, test yourself on the meaning and reading of the entire sentence.

**How to create:** <br>
Fill the `IsAudioCard` and `IsSentenceCard` field.

---







# Reveal Cards

Reveal cards (previously known as hybrid cards) are a group of card types that
have the distinct feature that the word is shown at the front,
while the sentence is hidden but can be shown through some natural means.
Additionally, all reveal cards have some form of underline beneath
the tested word, to differentiate it between a vocab card.

The primary reason why this exists is to prevent
context-based memories.
For example, in a TSC or sentence card,
you may only remember the tested word due to its surrounding context.


!!! note "Notes"
    * For all forms of reveal cards, you can press `n` to toggle
        whether the sentence is shown or not.

    * The "How to test" sections are simply recommended ways of testing,
        and are by no means the required way of testing yourself.
        Feel free to test yourself differently depending on whatever you think works the best.


## Hover Vocab Card

{{ img("", "assets/cardtypes/hover_word.gif") }}

A hover vocab word shows the tested word at the front.
When you hover over the word,
you can see the full sentence, with the tested word highlighted.

This acts similarly to a vocab card.
However, you are given the option to see the full sentence without failing the card.

This is also known as the [fallback card](https://tatsumoto.neocities.org/blog/discussing-various-card-templates.html#fallback-cards).

**Indicator:** Grey & dotted underline under the word.

**How to test:** <br>

1. Attempt to guess the reading and definition of the word without hovering over the word.
2. If you are able to guess both the reading and definition of the word, flip the card.
3. Otherwise, hover over the word and guess the reading and definition of the word
    with the entire sentence.

**How to create:** <br>
Fill the `IsHoverCard` field.




## Click Vocab Card

{{ img("", "assets/cardtypes/click_word.gif") }}

A click vocab word shows the tested word at the front.
When you click on the word, you can see the full sentence,
with the tested word highlighted.

This card acts as an intermediary between the hover vocab card and the vocab card itself.
You must guess the reading **BEFORE** revealing the sentence,
but you can use the sentence to guess the definition.

**Indicator:** Grey & dashed underline under the word.

**How to test:** <br>

1. Attempt to guess the reading of the word without hovering over the word.
    If you are unable to guess the reading of the word before revealing the entire sentence,
    then the card must be **marked as a fail**.
2. After guessing the reading of the word, you can optionally click on the word
    to reveal the entire sentence to guess the definition.
    * In other words, if you can only guess the definition by reading the sentence,
        then the card should still be passed.

**How to create:** <br>
Fill the `IsClickCard` field.





## Hover Sentence Card

{{ img("", "assets/cardtypes/hover_sentence.gif") }}

This acts similarly to the hover vocab card.
However, the tested content is the entire sentence,
so you must hover over the word to test the entire sentence.

**Indicator:** Colored word & dotted underline under the word.

**How to test:** <br>

1. Attempt to guess the reading and definition of the word without hovering over the word.
2. Regardless of whether you are able to guess the reading and definition of the word,
    hover over the word and test yourself on the sentence (as if it was a sentence card).

**How to create:** <br>
Fill the `IsHoverCard` and `IsSentenceCard` fields.




## Click Sentence Card

{{ img("", "assets/cardtypes/click_sentence.gif") }}

This acts similar to the click vocab card.
However, similarly to the hover sentence card, the tested content is the entire display,
so you must click the word to test the entire display

**Indicator:** Colored word & dashed underline under the word.

**How to test:** <br>

1. Attempt to guess the reading of the word without hovering over the word.
    If you are unable to guess the reading of the word before revealing the entire sentence,
    then the card must be **marked as a fail**.
2. After guessing the reading of the word, click on the word
    to reveal the entire sentence, and test yourself on the sentence (as if it was a sentence card).

**How to create:** <br>
Fill the `IsClickCard` and `IsSentenceCard` fields.



## Reveal TSC

{{ img("", "assets/cardtypes/hover_tsc.gif") }}

Similarly to the normal TSC, if you want to use the hover sentence card or click sentence card
to only test a specific portion of the sentence, you can bold the desired
selection of the sentence and fill `IsTargetedSentenceCard`.

The above example is a Hover TSC, with the last sentence bolded.


## Reveal Hint Card
{{ feature_version("0.12.0.0") }}

=== "Hover Hint"
    TODO image

=== "Click Hint"
    TODO image

Similarly to a normal hint card, filling the `IsHintCard`
allows the reveal card type to reveal the sentence below the word (instead of replacing the word).
You would test this like any normal reveal card,
because this is simply a change in the style of how the information is displayed.

---




# Hint Cards

Hint cards are a group of card types that display the sentence
below the word.
This acts as a better alternative compared to manually adding the sentence
in the `Hint` (or `HintNotHidden`) field.



## Hint Vocab Card
{{ feature_version("0.12.0.0") }}

TODO img

A hint vocab card is simply a vocab card that shows the sentence below the word.
The tested content is the word itself, so you would test yourself as if it were a
[TSC](#targeted-sentence-card) or
[Hover Vocab card](#hover-vocab-card).


**How to create:** <br>
Fill the `IsHintCard` field.



## Hint Vocab Card (highlighted)
{{ feature_version("0.12.0.0") }}

TODO img

This is exactly the same as the Hint Vocab Card,
except the word within the sentence is automatically highlighted.
This is tested the exact same as the Hint Vocab Card.

The reason why a highlighted word is not the default is because I found that I was focusing
too heavily on the highlighted word instead of the word itself.
To guarantee that you do not see the sentence unless you actually want to,
see [reveal cards](#reveal-cards).

**How to create:** <br>
Fill the `IsHintCard` and `IsTargetedSentenceCard` fields.


## Hint Sentence Card
{{ feature_version("0.12.0.0") }}

TODO img

A hint sentence card is very similar to a Hint Vocab card,
except the tested content is the entire sentence.
This is indicated by the fact that the word is colored.

This is tested exactly like a [Hover Sentence Card](#hover-sentence-card).


**How to create:** <br>
Fill the `IsHintCard` and `IsSentenceCard` fields.


## Hint TSCs

TODO img

Similarily to the normal TSC, this can be used to only test yourself on a specific
portion of the sentence.
This is tested exactly like a [Hover TSC](#reveal-tsc).

**How to create:** <br>
Fill the `IsHintCard`, `IsSentenceCard` and `IsTargetedSentenceCard` fields.

!!! note
    For all other card types, only `IsTargetedSentenceCard` has to be filled
    to create a TSC.
    However, for hint cards, both `IsSentenceCard` and `IsTargetedSentenceCard`
    must be filled out.


---


# Sentence-First Cards
{{ feature_version("0.12.0.0") }}

(TODO image)

Sentence-first cards are a group of cards that
show the sentence first, and then show the tested word below.
For these cards, you must read the entire sentence,
but you only test yourself on the tested word.
This differs from TSCs, because with TSCs, you do not need to read the entire sentence.

**How to create:** <br>
Fill the `IsSentenceFirstCard` field.



## Sentence-First TSCs
{{ feature_version("0.12.0.0") }}

(TODO image)

Just like a TSC, if you only want to read one specific portion of the sentence,
you can highlight that specific portion.

It is expected that you use the `AltDisplaySentence` field to set the custom highlight.
There is no reason to use this with the default highlighted word
(because you would then test it exactly the same as a normal TSC).

**How to create:** <br>
Fill the `IsSentenceFirstCard` and `IsTargetedSentenceCard` fields.



## Sentence-First Cards: Hiding the word
{{ feature_version("0.12.0.0") }}

=== "Hide until hover"
    TODO image

=== "Hide until click"
    TODO image

If you do not wish to see the word accidentally before reading the entire sentence,
one can use the `IsHoverCard` or `IsClickCard` to hide the word
until you hover over or click on the sentence, respectively.

You would test yourself on these just like any other sentence-first card.

---



# Card Creation Summary

{% set cm = "🗸  { .smaller-table-row }" %}

The top row contains shorthands for the actual field names used:

- Sent: `IsSentenceCard`
- TSC: `IsTargetedSentenceCard`
- Click: `IsClickCard`
- Hover: `IsHoverCard`
- Audio: `IsAudioCard`
- Hint: `IsHintCard`
- Sent-First: `IsSentenceFirstCard`


**Card Creation Summary (Common Cards)**

| Sent   | TSC    | Click  | Hover  | Audio  | Result (Card Type)                          |
|:------:|:------:|:------:|:------:|:------:|---------------------------------------------|
|        |        |        |        |        | Vocab Card           { .smaller-table-row } |
| {{cm}} |        |        |        |        | Sentence Card        { .smaller-table-row } |
|        | {{cm}} |        |        |        | TSC                  { .smaller-table-row } |
|        |        | {{cm}} |        |        | Click Vocab          { .smaller-table-row } |
| {{cm}} |        | {{cm}} |        |        | Click Sentence       { .smaller-table-row } |
|        | {{cm}} | {{cm}} |        |        | Click TSC            { .smaller-table-row } |
|        |        |        | {{cm}} |        | Hover Vocab          { .smaller-table-row } |
| {{cm}} |        |        | {{cm}} |        | Hover Sentence       { .smaller-table-row } |
|        | {{cm}} |        | {{cm}} |        | Hover TSC            { .smaller-table-row } |
|        |        |        |        | {{cm}} | Audio Card           { .smaller-table-row } |
| {{cm}} |        |        |        | {{cm}} | Sentence Audio Card  { .smaller-table-row } |



**Card Creation Summary (Hint Cards)**

This table assumes you have `IsHintCard` filled.

| Hint   | Sent   | TSC    | Click  | Hover  | Result (Card Type)                          |
|:------:|:------:|:------:|:------:|:------:|---------------------------------------------|
| {{cm}} |        |        |        |        | Hint Vocab Card      { .smaller-table-row } |
| {{cm}} |        | {{cm}} |        |        | Hint Vocab Card (highlighted) { .smaller-table-row } |
| {{cm}} | {{cm}} |        |        |        | Hint Sentence Card   { .smaller-table-row } |
| {{cm}} | {{cm}} | {{cm}} |        |        | Hint TSC             { .smaller-table-row } |
| {{cm}} |        |        | {{cm}} |        | Click Hint Vocab     { .smaller-table-row } |
| {{cm}} | {{cm}} |        | {{cm}} |        | Click Hint Sentence  { .smaller-table-row } |
| {{cm}} |        | {{cm}} | {{cm}} |        | Click Hint TSC       { .smaller-table-row } |
| {{cm}} |        |        |        | {{cm}} | Hover Hint Vocab     { .smaller-table-row } |
| {{cm}} | {{cm}} |        |        | {{cm}} | Hover Hint Sentence  { .smaller-table-row } |
| {{cm}} |        | {{cm}} |        | {{cm}} | Hover Hint TSC       { .smaller-table-row } |

**Card Creation Summary (Sentence-First Cards)**

This table assumes you have `IsSentenceFirst` filled.

| Sent-First | TSC    | Click  | Hover  | Result (Card Type)                          |
|:----------:|:------:|:------:|:------:|---------------------------------------------|
| {{cm}}     |        |        |        | Sentence-First Card       { .smaller-table-row } |
| {{cm}}     | {{cm}} |        |        | Sentence-First TSC        { .smaller-table-row } |
| {{cm}}     |        | {{cm}} |        | Click Sentence-First Card { .smaller-table-row } |
| {{cm}}     | {{cm}} | {{cm}} |        | Click Sentence-First TSC  { .smaller-table-row } |
| {{cm}}     |        |        | {{cm}} | Hover Sentence-First Card { .smaller-table-row } |
| {{cm}}     | {{cm}} |        | {{cm}} | Hover Sentence-First TSC  { .smaller-table-row } |


