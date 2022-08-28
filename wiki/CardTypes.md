
<!--

**Summary:** <br>

**How to test:** <br>

**How to create:** <br>

-->

# Motivation
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
outside of the simple vocab and sentence cards.


# Card types

This entire section is dedicated to showcasing all the various card types
that this note has to offer.


## Common Features
TODO REMOVE THIS SECTION

Before going into the specific card types,
this section will apply to all card types, and explain the features and reasoning behind them.

- All card types have an optional **hint** field.
    This hint field can contain anything you want, and can be used without failing the card.

- All card types will have the sentence audio button at the front (if sentence audio is available.)
    The purpose of this button is to check if the reading is correct after you guess the reading.
    Unless the card type is a cloze-deletion card, you **MUST** test yourself on the normal
    tested content of the card **BEFORE** pressing this button.
    If you realize that you were wrong after hearing the sentence audio, you must still
    mark the card as incorrect.

- Vocab cards will also have a collapsable field to reveal the entire sentence.
    Like the above, the purpose of this is to check the reading of the word after you guess it,
    and you should only use this **AFTER** you test yourself fully on the word.

- Pitch accent can also be tested for all of the note types.
    This is explained in detail here (TODO).



## Vocab Card

(TODO update picture)

| [[assets/nisemono_front.png]] |
|:--:|
| Example vocab card (front) |

A vocab card simply shows the target word at the front.
You test yourself on the reading and definition of the word.

**How to create:** <br>
This is the default card type.
Nothing has to be done for the card to be a vocab card.



## Sentence Card

(TODO example picture)

A sentence card simply shows the entire sentence at the front.
You test yourself on the reading and meaning of the entire sentence.

**How to create:** <br>
Fill the `IsSentenceCard` field.





## Hover Vocab Card

(TODO gif)

A hover vocab word shows the tested word at the front.
When you hover over the word,
you can see the full sentence, with the tested word highlighted.

This acts similarly to a vocab card.
However, you are given the option to see the full sentence without failing the card.

This is also known as the fallback card (TODO).

**Indicator:** Yellow & dashed underline under the word.

**How to test:** <br>
1. Attempt to guess the reading and definition of the word without hovering over the word.
2. If you are able to guess both the reading and definition of the word, flip the card.
3. Otherwise, hover over the word and guess the reading and definition of the word
    with the entire sentence.

**How to create:** <br>
Fill the `IsHoverCard` field.

**Note:** <br>
For all forms of hover cards, you can press "shift" to toggle whether the sentence is shown or not.



## Click Vocab Card

(TODO gif)

A click vocab word shows the tested word at the front.
When you click on the word, you can see the full sentence,
with the tested word highlighted.

This card acts as an intermediary between the hover vocab card and the vocab card itself.
You must guess the reading **BEFORE** revealing the sentence,
but you can use the sentence to guess the definition.

**Indicator:** White & dashed underline under the word.

**How to test:** <br>
1. Attempt to guess the reading of the word without hovering over the word.
    If you are unable to guess the reading of the word before revealing the entire sentence,
    then the card must be **marked as a fail**.
2. After guessing the reading of the word, you can optionally click on the word
    to reveal the entire sentence to guess the definition.
    * In other words, if you can only guess the definition by reading the sentence,
        then the card should still be passed.

Notice that this is different from the hover vocab card,
because you are **not** allowed to see the sentence when guessing the reading.

**How to create:** <br>
Fill the `IsClickCard` field.





## Hover Sentence Card

(TODO gif)

This acts similarly to the hover vocab card.
However, the tested content is the display,
so you must hover over the word to test the entire display.

**Indicator:** Yellow & solid underline under the word.

**How to test:** <br>
1. Attempt to guess the reading and definition of the word without hovering over the word.
2. Regardless of whether you are able to guess the reading and definition of the word,
    hover over the word and test yourself on the sentence (as if it was a sentence card).

**How to create:** <br>
Fill the `IsHoverCard` and `IsSentenceCard` fields.
If one wants to test a particular section of a sentence,
bold the desired selection of the sentence and fill in the `ForceSentenceHighlight` field.


## Click Sentence Card

(TODO gif)

This acts similar to the click vocab card.
However, similarly to the hover sentence card, the tested content is the entire display,
so you must click the word to test the entire display

**Indicator:** White & solid underline under the word.

**How to test:** <br>
1. Attempt to guess the reading of the word without hovering over the word.
    If you are unable to guess the reading of the word before revealing the entire sentence,
    then the card must be **marked as a fail**.
2. After guessing the reading of the word, click on the word
    to reveal the entire sentence, and test yourself on the sentence (as if it was a sentence card).

**How to create:** <br>
Fill the `IsClickCard` and `IsSentenceCard` fields.
If one wants to test a particular section of a sentence,
bold the desired selection of the sentence and fill in the `ForceSentenceHighlight` field.




## Targetted Sentence Card (TSC)

(TODO picture)

<!--
A targetted sentence card shows the entire sentence at the front,
but has the tested word highlighted.
Only the highlighted word is tested.
-->
A targetted sentence card is a special case of the sentence card.
The sentence is shown at the front, but only the highlighted content (usually just the word)
is tested.

This was originally defined here (TODO).

Note that this is really just a special case of the normal sentence card,
where the highlighted content is only the tested word.

**How to create:** <br>
Fill the `IsSentenceCard` and `ForceSentenceHighlight` field.







# Card Creation Summary

| IsSentenceCard | ForceSentenceHighlight | IsClickCard | IsHoverCard | Result (Card Type) |
|----------------|------------------------|-------------|-------------|--------------------|
|                |                        |             |             | Vocab Card         |
| x              |                        |             |             | Sentence Card      |
| x              | x                      |             |             | TSC                |
|                |                        | x           |             | Click Vocab        |
| x              |                        | x           |             | Click Sentence     |
|                |                        |             | x           | Hover Vocab        |
| x              |                        |             | x           | Hover Sentence     |


# Motivation behind each card type
(TODO)

## Vocab Card

## Sentence Card

## Hover Vocab Card

## Click Vocab Card

## Hover Sentence Card

## Click Sentence Card

## Targetted Sentence Card


# Conclusion
This note type has many available ways to test the unknown content.
On the question of what card type you should use,
ultimately, I have my own opinions, and
[many](http://www.alljapaneseallthetime.com/blog/10000-sentences-why/)
[others](https://refold.la/roadmap/stage-2/a/basic-sentence-mining#Mine-Sentences-Not-Words)
[have](https://learnjapanese.moe/guide/#mining)
[their](https://animecards.site/ankicards/#sentence-cards-vs-anime-cards)
[own](https://tatsumoto.neocities.org/blog/discussing-various-card-templates.html#targeted-sentence-cards-or-mpvacious-cards).
My personal recommendation is to **try all of them out** and see which works best for you.


