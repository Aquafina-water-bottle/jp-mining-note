
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


{{ img("", "assets/card_types_1_pic.png") }}


---


# Vocab Card

{{ img("", "assets/nisemono_word_blank.png") }}

A vocab card simply shows the target word at the front.
You test yourself on the reading and definition of the word.

**How to create:** <br>
This is the default card type.
Nothing has to be done for the card to be a vocab card.

---



# Sentence Card

{{ img("", "assets/nisemono_sentence_blank.png") }}

A sentence card simply shows the entire sentence at the front.
You test yourself on the reading and meaning of the entire sentence.

**How to create:** <br>
Fill the `IsSentenceCard` field.

---



# Targetted Sentence Card (TSC)

{{ img("", "assets/nisemono_tsc.png") }}

A targetted sentence card is a special case of the sentence card.
The sentence is shown at the front, but only the highlighted content (only the word by default)
is tested.
This allows you to have all the information and context of the sentence,
but you don't have to waste your time testing other parts of the sentence.

This card type was originally defined
[here](https://tatsumoto.neocities.org/blog/discussing-various-card-templates.html#targeted-sentence-cards-or-mpvacious-cards).

**How to create:** <br>
Fill the `IsTargetedSentenceCard` field.

---




# Hybrid Cards

Hybrid cards are a group of card types that attempt to combine the power of
sentence cards and vocab cards into one.
They all have the distinct feature that the word is shown at the front,
but the sentence can be shown through some natural means.
Additionally, all hybrid cards have some form of underline beneath
the tested word, to differentiate it between a vocab card.

The primary reason why this exists is to prevent
context-based memories.
For example, in a TSC or sentence card,
you may only remember the tested word due to its surrounding context.


!!! note
    For all forms of hybrid cards, you can press "n" to toggle
    whether the sentence is shown or not.


## Hover Vocab Card

{{ img("", "assets/nisemono_hover_word.gif") }}

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



<br>

## Click Vocab Card

{{ img("", "assets/nisemono_click_word.gif") }}

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




<br>

## Hover Sentence Card

{{ img("", "assets/nisemono_hover_sentence.gif") }}

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



<br>

## Click Sentence Card

{{ img("", "assets/nisemono_click_sentence.gif") }}

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


<br>

## Hybrid TSC

{{ img("", "assets/nisemono_hover_tsc.gif") }}

Similarly to the normal TSC, if you want to use the hover sentence card or click sentence card
to only test a specific portion of the sentence, you can bold the desired
selection of the sentence and fill `IsTargetedSentenceCard`.

The above example is a Hover TSC, with the last sentence was bolded.

---




# Card Creation Summary

| IsSentenceCard | IsTargetedSentenceCard | IsClickCard | IsHoverCard | Result (Card Type) |
|:--------------:|:----------------------:|:-----------:|:-----------:|--------------------|
|                |                        |             |             | Vocab Card         |
| x              |                        |             |             | Sentence Card      |
|                | x                      |             |             | TSC                |
|                |                        | x           |             | Click Vocab        |
| x              |                        | x           |             | Click Sentence     |
|                | x                      | x           |             | Click TSC          |
|                |                        |             | x           | Hover Vocab        |
| x              |                        |             | x           | Hover Sentence     |
|                | x                      |             | x           | Hover TSC          |


