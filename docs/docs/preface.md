
Before committing and going through the setup process,
it would be best to make sure that the note aligns with exactly what you want.


# Supported Systems
The most important step is to see if jp-mining-note (JPMN) works on your device.

## Anki Desktop
Primary support is given to the latest Anki versions (and Qt6).
Limited support will be given for older versions of Anki.
With that being said, JPMN should work for Anki versions 2.1.49+.

## Mobile (AnkiDroid and AnkiMobile)
As of writing this,[^1] mobile versions of Anki are not yet supported.

There are plans of supporting AnkiDroid in the future.

As I do not have an iPhone to test AnkiMobile,
there are no plans to support AnkiMobile.

## Anki Web
There is no support for AnkiWeb,
and there are no plans to support AnkiWeb.

## Themes
The main theme of this card is with Anki's default dark mode.
As of writing this,[^1] light mode is not yet supported.

[^1]: As of 2022/09/17.




# Theme & Design Principles

## Made for Japanese Learning
The absolute fundamental goal of this note type is to **make learning Japanese easier**.
Every feature you see is to simply make this learning process easier and smoother.

## Minimalistic Design
This note is visually designed to be minimalistic because the fundamental goal is to learn Japanese,
not to have eye catching graphics.

## Minimal Dependencies
The only fundamental dependencies are `Yomichan` (to create the note) and the `Anki-Connect` add-on
(to export the note from `Yomichan`, download the note, and for certain features to work within the note).
Absolutely nothing else is required.
This helps with ensuring the lifespan of the note,
and to make the note more stable across various Anki versions.

## Free & Open Source
Everything here, including the documentation itself, is completely free and open source,
licensed under [MIT](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/LICENSE).
Rest easy knowing you will keep full ownership of your note, forever.

## Modularized, Customizable & Extendable
This project ships with built-in tools to easily disable/enable features,
or even completely remove them from the base template via compile-time options.
Additionally, there are many built-in ways to extend the note to suit your exact needs.




# Alternatives
Of course, there are many alternatives to this note type.
Below contains a non-exhaustive list of some of the note types that exist out there.
Feel free to go digging!

??? info "Click here to see example note types (for Japanese learning)."

    - [Anime Cards](https://animecards.site/ankicards/#anime-cardsword-context-cards)
      ([download](https://ankiweb.net/shared/info/151553357))
        - Vocab card template
    - [Lazy Guide's Modified Anime Card](https://rentry.co/lazyXel#anki)
    - [Xeliu's Modified Anime Card](https://rentry.co/mining#anki-settings) ([demo](https://i.imgur.com/3y3fGET.jpeg))

    - [Targeted sentence cards](https://tatsumoto.neocities.org/blog/discussing-various-card-templates.html#targeted-sentence-cards-or-mpvacious-cards)
      ([download](https://ankiweb.net/shared/info/1557722832))
        - My note type is a heavily modified (to the point of it being completely rewritten)
          version of this.
    - [AJATT-Tool's AnkiNoteTypes](https://github.com/Ajatt-Tools/AnkiNoteTypes)
        - A collection of user-created notes, most of which are based off of the above Targeted Sentence Cards

    - [Eminent Note Type](https://cademcniven.com/projects/notetype2/)
        - Has some interesting ways to display pitch accent and show kanji info

    - [Elax's note type](https://cdn.discordapp.com/attachments/778430038159655012/847595626257842226/AnimeCards.apkg)
      (demo
      [1](https://cdn.discordapp.com/attachments/778430038159655012/847595710199365642/anki_pn02gFA4g4.png),
      [2](https://cdn.discordapp.com/attachments/778430038159655012/847595755799838720/anki_WomdVVaIPj.png),
      [3](https://cdn.discordapp.com/attachments/778430038159655012/847595806805852180/anki_GdOvg6u5Qv.png),
      [4](https://cdn.discordapp.com/attachments/778430038159655012/847595848086716506/anki_YEvyqLJeF2.png))
        - Original message on TMW discord server
          [here](https://discord.com/channels/617136488840429598/778430038159655012/847595626220355584)
        - Can switch between vocab / sentence / vocab audio / sentence audio

    - [Tigy01's note type](https://docs.google.com/document/d/e/2PACX-1vTnCEECFTJ_DyBID0uIQ5AZkbrb5ynSmYgkdi6OVyvX-fs9X40btEbpSToTmsct5JzrQJ2e9wcrc6h-/pub)
        - Vocab card template

    - [MonnieBiloney's note types](https://docs.google.com/document/d/1MxoRIO88KlJlGttnXNVkDVoHfZUtJqwOT_arRSS5F7Y/edit)

??? info "Click here to see example note types (outside of Japanese learning)."

    - [Prettify](https://github.com/pranavdeshai/anki-prettify)
        - "Collection of customizable Anki flashcard templates with modern and clean themes."
    - [Modern Card Themes](https://github.com/b3nj5m1n/moderncardthemes)
    - [Anki Cards Templates SuperList](https://github.com/Troyciv/anki-templates-superlist)
    - [Raagaception's 12STD CBSE Deck (Science stream, PCM)](https://github.com/Raagaception/raagaception-12STD-CBSE-deck)


# Setup
Excited to take this note on a whirl? See the [setup](setup.md) page to see just that!

