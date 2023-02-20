
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

## Anki Desktop
Primary support is given to the latest stable Anki versions (2.1.54+ & Qt6).
Limited support will be given for older versions of Anki.
With that being said, JPMN should work for Anki versions 2.1.49+.

## Mobile (AnkiDroid and AnkiMobile)
Mobile support is slowly being worked on,[^1]
but JPMN (on mobile) is currently not stable.
Do not expect the note to work on mobile.
Therefore, if you *absolutely must* use Anki on mobile,
I recommend **not using this note**.


[^1]:
    Written as of 2022/10/31.

## AnkiWeb
There is no support for AnkiWeb,
and there are no plans to support AnkiWeb.

## Themes
Both light mode and dark mode are supported.
However, dark mode is recommended as the main theme of this note.

## Updating
If you ever wish to update the note, this can only be done on PC,
and cannot be done on mobile.
The note does not auto-update; you must manually update the note.

---




# Theme & Design Principles

## Made for Japanese Learning
The absolute fundamental goal of this note type is to **make learning Japanese easier**.
Every feature you see is to simply make this learning process easier and smoother.

## Minimalistic Design
This note is visually designed to be minimalistic because the fundamental goal is to learn Japanese,
not to have eye catching graphics.

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

