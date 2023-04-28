---
hide:
  - footer
---

Welcome to jp-mining-note's documentation!

=== "GUI"
    ![type:video](https://user-images.githubusercontent.com/17107540/187550103-7e50c317-9074-4c7c-a499-fa4ddc89e419.mp4)

    TODO gif so it autoplays

=== "Front | Dark"
    {{ img("", "assets/fushinnsha/dark_front.png") }}
=== "Back | Dark"
    {{ img("", "assets/fushinnsha/dark_back.png") }}
=== "Front | Light"
    {{ img("", "assets/fushinnsha/light_front.png") }}
=== "Back | Light"
    {{ img("", "assets/fushinnsha/light_back.png") }}


[Click here to get started!](preface.md){ .md-button }

---

# TODO: 0.12.0.0

## CSS TODO and bugfixes and small refactors
- ~~Mobile kanji hover and word indicators (using cache.js)~~

- fix yellow bold thing in pitch accent tooltips

- fix warning message for when JPMN Options is not defined
- add global variable for base documentation url - switch to prerelease temporarily

- CSS compile options
    - compile option for ruby to show on word instead of on the entire sentence
    - somehow simplify the editor css, for people to edit fields easier?

- add regex search so one can add CSS below a certain line, and have that be unchanging throughout!
    - i.e.
        ```css
        /*
         * Any CSS below should be preserved between updates.
         * If you plan on modifying the styles, please insert them below
         * the line below instead of directly modifying the CSS above.
         */
        /* ================ INSERT CUSTOM CSS BELOW ================ */
        ```
    - take care of this in the updater
    - add skeleton docs


## Scattered TODO

- compile option to collapse primary definition
- option to hide the text for sentence audio cards? CSS option?
- make selectPersist private and use other methods
- add runtime option for blockquotes.simplifyDefinitions: set for each definition

- known issues (likely won't fix, record somewhere):
    - info circle popup can go outside of the screen on tablet displays
    - same with kanji hover
    - scrollbar for mobile popup doesn't exist

- cache.ts CLI flags:
    - library?
    - # of days due ahead
    - # of days valid
    - when to write (default to every 10 cards)
- kanji hover should show X number of hidden

- add some runtime option to insert and remove entries from arrays / dictionaries somehow???

- rename def-header -> word-box-img (wbi)
    - dh_left -> word-box
    - dh_right -> main-img
- make sure card type string is accurate with new card types

- AND and OR operators for options.ts


## Everything else

- Attempt to remove most `TODO`s from typescript code
- Make template better for developers:
    - Ability to somehow inject custom typescript?
    - Separate more things into partials
    - Redo 132 theme with things above
- Documentation


---

<br>

You might be wondering, what's so special about this template?

<br>

---

# Made for Japanese Learning
The absolute fundamental goal of this note type is to <span class="jpmn-highlight">**make learning Japanese easier**</span>.
Every feature you see is to simply make this learning process easier and smoother.

=== "Kanji Hover"
    Easily determine if you have seen the kanji before, and see the context it was used in.

    TODO video

    <i><sup>[→  Kanji Hover](kanjihover.md)</sup></i>

=== "Word Indicators"
    See if you've learned any words that have the same reading, kanji, or both!

    TODO video

    <i><sup>[→  Word Indicators](wordindicators.md)</sup></i>

=== "Set Pitch Accent"
    Does the word have the wrong pitch accent?
    You can easily override it with just one number.

    TODO video

    <i><sup>[→  Pitch Accent: How Pitch Accent is Selected](autopa.md#how-pitch-accent-is-selected)</sup></i>

=== "Bilingual & Monolingual Support"
    Seamlessly switch between creating monolingual and bilingual cards.

    TODO video

    <i><sup>[→  Definitions: Primary Definition Selection](definitions.md#primary-definition-selection-automatic)</sup></i>


# Mobile Support
Use the exact same template on both mobile and PC, without worry.

TODO image of the same card on mobile and PC


# Highly Customizable
A lot of effort has been put into making jp-mining-note as customizable as possible,
in order to fit the extremely diverse needs of the Japanese learning community.


=== "Colored Pitch Accent"
    Automatically color the card with Migaku style colors.

    TODO video

    <i><sup>[→  Pitch Accent: Colored Pitch Accent](autopa.md#colored-pitch-accent)</sup></i>

=== "Image Blur"
    Blur the main image on a card-by-card basis.

    TODO video

    <i><sup>[→  Images: Image Blur](images.md#image-blur)</sup></i>

=== "Simple Definitions"
    Most monolingual dictionaries have extra info outside of the definition,
    and some people consider this distracting / unsightly.
    This note provides many ways on simplifying the definition by removing that info.

    TODO video

    <i><sup>[→  Definitions](definitions.md#hiding-the-first-line-of-a-definition)</sup></i>

=== "Card Types"
    Choose between a multitude of available build-in card types:
    vocab cards, sentence cards, audio cards, or anything in between.

    ![type:video](https://user-images.githubusercontent.com/17107540/192704142-d8587e82-3c90-4754-a23d-7b7ffff9a164.mp4)

    <i><sup>[→  Card Types](cardtypes.md)</sup></i>

=== "Custom Themes"
    You can even customize the overall theme using built-in tools!

    TODO video

    <i><sup>[→  TODO]()</sup></i>


# It's just Yomichan!
The card is created from the popular Yomichan setup that you're likely already familiar with.
Cards are created instantly, no extra steps necessary.

TODO change video
![type:video](https://user-images.githubusercontent.com/17107540/192704164-dd075092-58da-4964-9ddf-d89627f60d3c.mp4)


<!--
TODO video should be:
- card creation

-->


---

# Interested in using this template?

[Click here to get started!](preface.md){ .md-button }

