
Before committing and going through the setup process,
it would be best to make sure that the note aligns with exactly what you want.


# Supported Systems
The most important step is to see if jp-mining-note (JPMN) works on your device.

## Card Creation (Yomichan)
The card creation process is primarily done on PC (Windows, Mac, Linux).
However, with the
[proper setup](https://github.com/KamWithK/AnkiconnectAndroid),
cards can be created on Android.
I'm not aware of a workflow for iOS that works with Yomichan.

## Anki Desktop
Primary support is given to the latest Anki versions (2.1.54+ & Qt6).
Limited support will be given for older versions of Anki.
With that being said, JPMN should work for Anki versions 2.1.49+.

## Mobile (AnkiDroid and AnkiMobile)
As of writing this,[^1] mobile versions of Anki are **not yet supported**.

[^1]: As of 2022/09/25.

There are plans of supporting AnkiDroid and AnkiMobile in the future.

<!--
TODO uncomment this when mobile is officially supported

!!! warning
    AnkiMobile will likely have more bugs compared to AnkiDroid,
    as I do not have an iPhone to test AnkiMobile.
    Please report any issue you find!

-->

## AnkiWeb
There is no support for AnkiWeb,
and there are no plans to support AnkiWeb.

## Themes
Both light mode and dark mode are supported.
However, dark mode is recommended as the main theme of this note.





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
This helps with maintaining stability across various Anki versions.

## Modularized, Customizable & Extendable
This project ships with [built-in tools](modding.md) to easily disable/enable features,
or even completely remove them from the base template via compile-time options.
Additionally, there are many built-in ways to extend the note to suit your exact needs.

## Free & Open Source
Everything here, including the documentation itself, is completely free and open source,
licensed under [MIT](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/LICENSE).
Rest easy knowing you will keep full ownership of your note, forever.



# Alternatives
There are many, many Anki templates out there in the wild.
[The following page](alternatives.md)
is my attempt to assemble together some of the the popular and/or interesting card templates.


# Setup
Excited to take this note on a whirl? See the [setup](setup.md) page to see just that!

