
[**asbplayer**](https://github.com/killergerbah/asbplayer)
is a browser-based media player and Chrome extension,
used for subtitle sentence mining and video playing.
asbplayer works on both video streaming sites and downloaded videos.
However, [codec support for downloaded videos is limited](https://github.com/killergerbah/asbplayer#browser-compatibility), and is purely dependent on the browser used.

If you are looking to create cards using downloaded videos, I recommend [mpvacious](setupmpvacious.md).

---

# Existing Guides
There are a bunch of existing guides out there for asbplayer.
A few are listed below.

* [mikumino's mining workflow](https://www.youtube.com/watch?v=B60cj69MSmA) (asbplayer + jp-mining-note)
* [asbplayer's list of community guides](https://github.com/killergerbah/asbplayer#community-guides)
* [Shiki's mining workflow](https://docs.google.com/document/d/e/2PACX-1vQuEAoZFoJbULZzCJ3_tW7ayT_DcQl9eDlrXMnuPGTwDk62r5fQrXak3ayxBsEgkL85_Z-YY5W4yUom/pub) (asbplayer)
    * Contact info: `boundary-of-emptiness#3065` <!-- 152563705345867778 -->
        on the Refold (JP) Discord server
* [Tigy01's mining workflow](https://docs.google.com/document/d/e/2PACX-1vTnCEECFTJ_DyBID0uIQ5AZkbrb5ynSmYgkdi6OVyvX-fs9X40btEbpSToTmsct5JzrQJ2e9wcrc6h-/pub) (asbplayer)
    * Contact info: `Tigy01#1231` <!-- 451194927515172864 -->
        on the Refold (JP) Discord server
* [Brian's "Sentence mining from Netflix and YouTube with asbplayer"](https://soyuz18.notion.site/Sentence-mining-from-Netflix-and-YouTube-with-asbplayer-83a03590cd8349ba81ca10340645b565#92ca8ce0251f4eeba89776950b8cef11)

---

# Installation

Install the extension from asbplayer's
[releases page](https://github.com/killergerbah/asbplayer/releases/latest).

---

# Configuration

asbplayer's settings can be found [here](https://killergerbah.github.io/asbplayer/?view=settings).

I recommend filling out the following fields as follows:

| asbplayer field | JPMN field |
|:-:|:-:|
| Sentence Field   { .smaller-table-row} | `Sentence`        { .smaller-table-row} |
| Definition Field { .smaller-table-row} | |
| Word Field       { .smaller-table-row} | |
| Audio Field      { .smaller-table-row} | `SentenceAudio`   { .smaller-table-row} |
| Image Field      { .smaller-table-row} | `Picture`         { .smaller-table-row} |
| Source Field     { .smaller-table-row} | `AdditionalNotes` { .smaller-table-row} |
| URL Field        { .smaller-table-row} | `AdditionalNotes` { .smaller-table-row} |


---

# Card Creation

To create JPMN cards with asbplayer:

- [Attach asbplayer to the desired video](https://github.com/killergerbah/asbplayer#syncing-with-streaming-video),
    or
    [drag/drop a downloaded video into the asbplayer site](https://github.com/killergerbah/asbplayer#loading-files).
- Create the card with Yomichan
- Capture the audio (TODO specific instructions! What default keybinds?)
- Update the last card (TODO is this the exact text?)


---

# Other

* A common issue with asbplayer is that
    the `SentenceReading` field may differ from the `Sentence` field.
    See the
    [FAQ](faq.md#the-sentencereading-field-is-not-updated-is-different-from-the-sentence-field)
    on how to fix it.

* You have to export the audio as `mp3` if you plan on using AnkiMobile (iOS), or AnkiWeb.

