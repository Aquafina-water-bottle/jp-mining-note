
Before committing and going through the setup process,
it would be best to make sure that the note aligns with exactly what you want.

---


# Why you would NOT want to use jp-mining-note
- You have an existing setup and are happy with it.
- You want to study only from pre-made decks
    (or are not willing to spend the time to import notes into this template).
- You want to use this template to study something outside of Japanese.
- You want an extremely minimal template, with little/no javascript.
- You do not like its overall layout, and are not willing to customize the note to suit your needs.[^1]
- You are not comfortable with bearing a slightly higher maintenance cost than most other setups.[^2]

# Why you would want to use jp-mining-note
<!-- I don't like trying to "sell" people the note. If you like it, you like it. If you don't, you don't. -->
- You agree with [jp-mining-note's philosophy](principles.md).


# Alternatives
There are many, many Anki templates out there in the wild.
[This page](alternatives.md)
is my attempt to assemble together some of the the popular and/or interesting card templates.

If you are not satisfied with this template, or are not interested in using this template,
feel free to refer to the above list of alternatives.
Of course, you can always create one from scratch, or modify any of these notes
to your heart's content.



---

# Supported Systems
The most important step is to see if jp-mining-note (JPMN) works on your device.

## Card Creation (Yomichan)
The card creation process requires a working instance of Yomichan, Anki-Connect, and Anki.

By default, this works on PC (Windows, Mac, Linux), and the instructions shown will be for PC.
However, with the proper setup, one can also create cards on the following platforms:

- [Android](setupandroid.md) (including Android based e-readers such as ONYX BOOX)
- [Kindle](setupkindle.md) (export a list of sentences to the PC to manually create)

I'm not aware of a workflow for iOS that works with Yomichan.

!!! note
    JPMN currently requires Yomichan to create the Anki cards.
    As common as Yomichan is, this dependency to Yomichan can be considered a weakness
    (especially now that Yomichan is no longer getting updates).

    There are many popular setups out there that do not use Yomichan
    and instead have their own card exporter,
    such as
    [JL](https://github.com/rampaa/JL)
    and
    [jidoujisho](https://github.com/lrorpilla/jidoujisho).

    It is almost guaranteed that one can create JPMN cards with these card exporters.
    However, it is also almost guaranteed that various minor features will likely be missing.

    In the future, more workarounds will be developed to work with alternative card exporters.

## Anki Desktop
This note supports Anki versions 2.1.50 and above, with
primary support given to the latest stable Anki versions (2.1.61+ & Qt6).

It is important to note that **this note is no longer supported for Anki versions 2.1.49 or older**.
There are certain features that are known to break on these versions.

## Mobile (AnkiDroid and AnkiMobile)
JPMN finally supports AnkiDroid and AnkiMobile,
and comes with a new interface specifically designed for mobile devices.

However, there are some limitations on mobile. Mainly, anything requiring
Anki-Connect within the note (kanji hover and word indicators) will not work.
The current workaround is to [cache the tooltip results](tooltipresults.md#cache-tooltip-results).

## AnkiWeb
JPMN is not tested on AnkiWeb, and there are currently no plans to support AnkiWeb.

## Themes
Both light mode and dark mode are supported.
The note's theme changes accordingly with your Anki theme.

## Updating
If you ever wish to update the note, this can only be done on PC,
and cannot be done on mobile.
The note does not auto-update; it must be done manually.



---

# Setup
Excited to take this note on a whirl?

[Click here to set it up!](setup.md){ .md-button }




[^1]:
    Most minor things, such as colors, font size, etc. can be customized fairly easily with {{C_CSS}}.
    However, customizing the overall layout
    (i.e. customizing where the image is placed relative to the word),
    requires a lot more technical skill.
    Alternatively, if plan on using a custom theme within the `themes` folder,
    these require you to build the note, which at least requires basic knowlwedge of command line.

[^2]:
    In general, this template is a little more fragile than other templates due to its
    heavy usage of JavaScript.
    This is combined with updates to Anki and external add-ons.
    These updates have been known to break a bit more compared to other setups,
    and usually require some user intervention to deal with (whether it is updating the note,
    or manually changing some settings outside the note).
    If something breaks and a fix is released, they will usually be recorded under
    [Setup Changes](setupchanges.md).

    Note that updating the template itself has been smoothlined as much as possible,
    due to JPMN Manager.

