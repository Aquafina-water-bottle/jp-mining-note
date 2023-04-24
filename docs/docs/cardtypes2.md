# Hints
You can include a customized hint to show at the front of any card, by using the `Hint` field.
This will show as a collapsible field at the front of card.

If you do not want the hint to be hidden by default, you can use the `HintNotHidden` field instead.

=== "Hint"
    {{ img("hint field demo", "assets/fieldref/hint.gif") }}
=== "HintNotHidden"
    {{ img("HintNotHidden field demo", "assets/fieldref/hint_not_hidden.png") }}

---





# Testing Pitch Accent
TODO UPDATE IMAGES!!

No particular card type specifies how you should test pitch accent.
This is because customizing how you should test pitch accent is a common feature of all card types.

By default, no special indicator is shown on whether pitch accent is tested or not,
so you are free to choose either to test the pitch accent on all cards, or no cards.

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
    * For vocab cards, targeted sentence cards, and reveal vocab cards,
      only the word PA is tested (PA indicator: blue).
    * For sentence cards and reveal sentence cards,
      the entire sentence PA is tested (PA indicator: green).
* To test just the word pitch accent, fill the `PATestOnlyWord` field.
* To create completely separate cards to just test pitch accent on,
  use the fields `PASeparateSentenceCard` and/or `PASeparateWordCard`.
* If a PA word card is created, then the default card does not test pitch accent.
  Similarly, if a PA sentence card is created, then the default card only tests the word pitch accent.






<!--

---

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

    TODO reword this better!!!!

**Do not use reveal sentence cards.**

-   The problem with reveal sentence cards is that they test too many different things,
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

    Instead of using reveal sentence cards, make a firm decision on what you want to test.
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


-->


