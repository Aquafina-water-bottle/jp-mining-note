# Overview

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

# Hints
You can include a customized hint to show at the front of any card, by using the `Hint` field.
This will show as a collapsible field at the front of card.

If you do not want the hint to be hidden by default, you can use the `HintNotHidden` field instead.

=== "Hint"
    {{ img("hint field demo", "assets/fieldref/hint.gif") }}
=== "HintNotHidden"
    {{ img("HintNotHidden field demo", "assets/fieldref/hint_not_hidden.png") }}

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



# Targeted Sentence Card (TSC)

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
(or the `AltDisplay`) field.

!!! note
    Before version `0.12.0.0`, these were misnamed as "Cloze Deletion Cards, and the field was misnamed as `IsClozeDeletionCard`".

---


# Sentence Audio Cards
{{ feature_version("0.12.0.0") }}

(TODO image)

This is simply a regular audio card, but the entire sentence is tested.

**Indicator:** The displayed text is exactly <span class="jpmn-highlight">**「...」**</span>

**How to test:** <br>

1. The audio should be automatically played on the front side of the card.
    With this audio, test yourself on the meaning and reading of the entire sentence.

**How to create:** <br>
Fill the `IsAudioCard` and `IsSentenceCard` field.

---







# Hybrid Cards

Hybrid cards are a group of card types that attempt to combine the power of
sentence cards and vocab cards into one.
They all have the distinct feature that the word is shown at the front,
while the sentence is hidden but can be shown through some natural means.
Additionally, all hybrid cards have some form of underline beneath
the tested word, to differentiate it between a vocab card.

The primary reason why this exists is to prevent
context-based memories.
For example, in a TSC or sentence card,
you may only remember the tested word due to its surrounding context.


!!! note "Notes"
    * For all forms of hybrid cards, you can press `n` to toggle
        whether the sentence is shown or not.

    * The "How to test" sections are simply recommended ways of testing,
        and are by no means the required way of testing yourself.
        Feel free to test yourself differently depending on whatever you think works the best.

<br>

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



<br>

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




<br>

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



<br>

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


<br>

## Hybrid TSC

{{ img("", "assets/cardtypes/hover_tsc.gif") }}

Similarly to the normal TSC, if you want to use the hover sentence card or click sentence card
to only test a specific portion of the sentence, you can bold the desired
selection of the sentence and fill `IsTargetedSentenceCard`.

The above example is a Hover TSC, with the last sentence bolded.


## Hybrid Hint Card
{{ feature_version("0.12.0.0") }}

=== "Hover Hint"
    TODO image

=== "Click Hint"
    TODO image

Similarly to a normal hint card, filling the `IsHintCard`
allows the hybrid card type to reveal the sentence below the word (instead of replacing the word).
You would test this like any normal hybrid card,
because this is simply a change in the style of how the information is displayed.

---




# Hint Cards

Hint cards are a group of card types that display the sentence
below the word.
This acts as a better alternative compared to manually adding the sentence
in the `Hint` (or `HintNotHidden`) field.


<br>

## Hint Vocab Card
{{ feature_version("0.12.0.0") }}

TODO img

A hint vocab card is simply a vocab card that shows the sentence below the word.
The tested content is the word itself, so you would test yourself as if it were a
[TSC](#targeted-sentence-card-tsc) or
[Hover Vocab card](#hover-vocab-card).


**How to create:** <br>
Fill the `IsHintCard` field.

<br>


## Hint Vocab Card (highlighted)
{{ feature_version("0.12.0.0") }}

TODO img

This is exactly the same as the Hint Vocab Card,
except the word within the sentence is automatically highlighted.
This is tested the exact same as the Hint Vocab Card.

The reason why a highlighted word is not the default is because I found that I was focusing
too heavily on the highlighted word instead of the word itself.
To guarantee that you do not see the sentence unless you actually want to,
see [hybrid cards](#hybrid-ards).

**How to create:** <br>
Fill the `IsHintCard` and `IsTargetedSentenceCard` fields.

<br>

## Hint Sentence Card
{{ feature_version("0.12.0.0") }}

TODO img

A hint sentence card is very similar to a Hint Vocab card,
except the tested content is the entire sentence.
This is indicated by the fact that the word is colored.

This is tested exactly like a [Hover Sentence Card](#hover-sentence-card).


**How to create:** <br>
Fill the `IsHintCard` and `IsSentenceCard` fields.

<br>

## Hint TSCs

TODO img

Similarily to the normal TSC, this can be used to only test yourself on a specific
portion of the sentence.
This is tested exactly like a [Hover TSC](#hybrid-tsc).

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


<br>

## Sentence-First TSCs
{{ feature_version("0.12.0.0") }}

(TODO image)

Just like a TSC, if you only want to read one specific portion of the sentence,
you can highlight that specific portion.

It is expected that you use the `IsAltDisplay` field to set the custom highlight.
There is no reason to use this with the default highlighted word
(because you would then test it exactly the same as a normal TSC).

**How to create:** <br>
Fill the `IsSentenceFirstCard` and `IsTargetedSentenceCard` fields.

<br>


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





# Testing Pitch Accent
TODO UPDATE IMAGES!!

No particular card type specifies how you should test pitch accent.
This is because customizing how you should test pitch accent is a common feature of all card types.

By default, no special indicator is shown on whether pitch accent is tested or not,
so you are free to choose either to test the pitch accent on all cards, or no cards.

To test for pitch accent, fill the `PAShowInfo` field.
You should see a circle to the left of the word or sentence.

<br>


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

<br>


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


# Personal Commentary

- TODO
- lots of opinions out there on what card type people should use
    - recognize that this section is also purely opinion based
    - I encourage you to test & decide this for yourself instead of blindly listening to what people say (including me!)
- I do not claim to definitively state that there is a best card type
    - reason why there are so many card types in the first place is due to personal experimentation on which works best for me
    - even from writing this, my opinion may change in the future as I experiment more with different card types / determine which types have the best long-term retention/value/etc.

With that being said, here is currently what I have found out from testing out most of these card types:

**TSCs and (plain) hover cards are not good general card types, because they form too many context-based memories.**

-   I find myself not knowing the word until I read the surrounding context, which defeats the purpose
    of testing myself on the word.
    If you want to test this yourself, try using hover cards for a while,
    and see if you only remember what the word means when you hover over the word.

    This is especially evident during immersion, because I notice that I usually do not remember
    the word whatsoever when the card was tested as a TSC or hover card.

**Do not use hybrid sentence cards.**

-   The problem with hybrid sentence cards is that they test too many different things,
    breaking the standard i+1 principle.

    I previously tried to use these as a cheap excuse to test the word,
    and then one or two things around it.
    Because of that, I find myself often failing the card due to only one of the two or three things
    in the card.

    Additionally, when mixed with other card types, I find myself forgetting to
    read the sentence anyways, because it requires user interaction to
    see the sentence behind it.
    There is no way to override regular keybinds (like space) to show the sentence
    beforehand (without add-ons), and according to the Anki documentation,
    [this was by design](https://faqs.ankiweb.net/can-i-reveal-parts-of-a-card-one-at-a-time.html).

    Instead of using hybrid sentence cards, make a firm decision on what you want to test.
    If there are too many unknowns but you still want to test the sentence / have the context,
    do one of the following:

    - Simply suspend / delete the card.
    - Provide definitions for other unknowns under the `Hint` field.
        You can try using hint cards, TSCs, sentence-first cards, or even plain old sentence cards.

**Do not use many card types at once.**

-   One strong point of this note is that it allows you to make many card types.
    At the same time, this can be considered a weakness, because using too many card types
    will likely cause confusion when reviewing.
    Although it's fine to test different card types every now and then,
    most cards should be from the same small group of card types.


As of writing, I'm testing out the following card types, so I don't have any strong opinions on these yet:

- Hint cards
- Sentence-first cards
- Audio cards



