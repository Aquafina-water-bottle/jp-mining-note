
Before committing and going through the setup process,
it would be best to make sure that the note aligns with exactly what you want.

---


# Supported Systems
The most important step is to see if jp-mining-note (JPMN) works on your device.

## Card Creation (Yomichan)
The card creation process requires a working instances of Yomichan, Anki-Connect, and Anki.

By default, this works on PC (Windows, Mac, Linux), and the instructions shown will be for PC.
However, with the proper setup, one can also create cards on the following platforms:

- [Android](setupyomichan.md#android-setup) (including Android based e-readers such as ONYX BOOX)
- [Kindle](setupyomichan.md#kindle-setup) (export to PC to create)

I'm not aware of a workflow for iOS that works with Yomichan.

!!! note
    JPMN currently requires Yomichan to create the Anki cards.
    As common as Yomichan is, this dependency to Yomichan can be considered a weakness.

    There are many popular setups out there that do not use Yomichan
    and instead have their own card exporter,
    such as
    [JL](https://github.com/rampaa/JL)
    and
    [jidoujisho](https://github.com/lrorpilla/jidoujisho).
    Although it is likely possible to replicate certain parts of the setup
    with these card exporters, it is almost guaranteed that select features
    will be missing.

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
JPMN is not tested on AnkiWeb,
and there are currently no plans to support AnkiWeb.

## Themes
Both light mode and dark mode are supported.
The note's theme changes accordingly with your Anki theme.

## Updating
If you ever wish to update the note, this can only be done on PC,
and cannot be done on mobile.
The note does not auto-update; it must be done manually.

---




<!--
superseeded by index.md?
principles still apply though, its just repeating some things from the landing page
-->

# Theme & Design Principles

## Made for Japanese Learning
The absolute fundamental goal of this note type is to **make learning Japanese easier**.
Every feature you see is to simply make this learning process easier and smoother.

## Minimalistic Design
This note is visually designed to be minimalistic because the fundamental goal is to learn Japanese,
not to have eye catching graphics.
The main focus is on the content, not the fluff.

## Minimal Dependencies
The only fundamental dependencies are `Yomichan` (to create the note) and the `Anki-Connect` add-on
(to export the note from `Yomichan`, update the note, and for certain features to work within the note).
Absolutely nothing else is required.
This helps with maintaining stability across various Anki versions.

## Modularized, Customizable & Extendable
This project ships with [built-in tools](runtimeoptions.md) to easily disable/enable features,
or even completely remove them from the base template via [compile-time options](compiletimeoptions.md).
Additionally, there are [many built-in ways](modding.md) to extend the note to suit your exact needs.

## Documentation First
What's the point of having a powerful tool if you don't know how to use it?
Lots of time and resources have been put into making sure that this note type is well documented
and updated so you can use it to the best of your ability.

## Free & Open Source
Everything here, including the documentation itself, is completely free and open source,
licensed under [MIT](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/LICENSE).
Rest easy knowing you will keep full ownership of your note, forever.

---


# Alternatives
There are many, many Anki templates out there in the wild.
[The following page](alternatives.md)
is my attempt to assemble together some of the the popular and/or interesting card templates.


---

# Setup
Excited to take this note on a whirl?

[Click here to set it up!](setup.md){ .md-button }

