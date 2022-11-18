# Overview

This page is dedicated to providing resources on how to do the following:

1. Getting the actual text to use Yomichan on.
1. Getting the pictures and/or sentence audio from the media.

There are plenty of well established resources out there on how to do just that,
ranging from software to written & video guides.
Instead of repeating what others have already said, those programs and guides
will be linked.

If you are looking to setup jp-mining-note, see [this](setup.md) page instead.

!!! note
    If you already have a sentence mining workflow, you can likely
    skip to [this section](#notes-on-various-programs).

---

## Troubleshooting & Support

If you are having troubles with any of the guides or programs below,
I unfortunately **will not** be able to provide very detailed support.

Instead, I would recommend that you contact the creators of the guides / programs,
or the communities surrounding said guides / programs.

Additionally, the guides listed here do not use JPMN, and instead link
to other note types.
This shouldn't be an issue as long as you change the appropriate the field names.


---

# Getting the Text to Create the Cards

I use a texthooker setup, which is able to extract subtitles or text into the browser.
Once the text is on the browser, you can use Yomichan to select the word and create the
Anki card (click on the green plus button).

The classic texthooker setup works for most games, and any show with subtitle files.


## Texthooker pages (clipboard based)
These pages display the hooked content.
Most setups documented are for clipboard based texthooker pages.

??? example "Resources *(click here)*"
    * [Anacreon's Texthooker Page](https://anacreondjt.gitlab.io/docs/texthooker/) (recommended)
    * [TMW's Texthooker Page](https://learnjapanese.moe/texthooker.html)

??? example "Guides *(click here)*"
    * [stegatxins0's mining guide: Texthooker](https://rentry.co/mining#browser) (recommended)
    * [TMW: Texthooker & Visual Novels](https://learnjapanese.moe/vn/#playing-visual-novels-to-learn-japanese)
    * [Lazy Guide: Texthooker](https://rentry.co/lazyXel#clipboard-inserter)
    * [Anime Cards: Texthooker & Visual Novels](https://animecards.site/visualnovels/)


---


## Texthooker pages (Websocket based)
Websocket based texthookers are generally faster, more reliable, and do not flood your clipboard.
However, there is usually less support and requires more specialized coordination between programs.

Both of the options below are intended to be used with
[Textractor](https://github.com/Artikash/Textractor).

??? example "exSTATic"

    [**exSTATic**](https://github.com/KamWithK/exSTATic/)

    * Its primary use is for automatic stats collection. Integrates seamlessly with many workflows.
    * Uses a custom texthooker page, which connects with Textractor with its own custom extension.
    * A video installation guide is available on the project's README page.

??? example "Custom Patch"

    Patch Instructions for existing clipboard-based texthookers.
    This patch is primarily intended to be used in conjunction with
    [this Textractor extension](https://github.com/sadolit/textractor-websocket).

    1. Download your favorite texthooker page into a raw html file.
    1. Copy/paste the code below to the very end of the raw html file.
    1. If you are currently viewing the page, refresh.

    ??? examplecode "Click here to reveal the patch"
        ```javascript
        <script>
          let socket = null;
          let wsStatusElem = null;

          const createStatusElem = () => {
            wsStatusElem = document.createElement("span")
            let node = document.getElementById('menu').firstChild
            wsStatusElem.setAttribute("class", "menuitem")
            wsStatusElem.addEventListener('click', (e) => {
              if(wsStatusElem.innerText == "Reconnect") {
                connect()
              }
            })
            node.insertBefore(wsStatusElem, node.firstChild)
          }

          const updateStatus = (connected) => {
            if(wsStatusElem === null) { createStatusElem() }
            wsStatusElem.innerText = connected ? "Connected" : "Reconnect"
            wsStatusElem.style.cssText = "margin-right: 1.5em; display: inline-block;"
            wsStatusElem.style.cssText += connected ? "color:rgb(24, 255, 24);" : "color:rgb(255, 24, 24);"
          }

          const connect = () => {
            socket = new WebSocket("ws://localhost:6677/")
            socket.onopen = (e) => { updateStatus(true) }
            socket.onclose = (e) => { updateStatus(false) }
            socket.onerror = (e) => { updateStatus(false); console.log(`[error] ${e.message}`) }
            socket.onmessage = (e) => {
              let container = document.getElementById('textlog')
              let textNode = document.createElement("p")
              textNode.innerText = e.data
              document.body.insertBefore(textNode, null)
            }
          }
          connect()
        </script>
        ```
        <sup>
        ([Original discord message](https://discord.com/channels/617136488840429598/780870629426724864/952964914375442452), on {{ TMW_SERVER }}. Thanks Zetta#3033 for the code.)
        </sup>

    !!! note
        This patch was written for Anacreon's texthooker page.
        However, it will likely work for most other texthooker pages.


---


# Game-Like Content: Getting Text
The following are primarily for text-heavy games, such as visual novels.

??? example "Resources *(click here)*"
    * [Textractor](https://github.com/Artikash/Textractor) (recommended)
    * [agent](https://github.com/0xDC00/agent)
        * This is a good fallback for when Textractor doesn't work

??? example "Guides *(click here)*"
    * [TMW: Installing Visual Novels](https://learnjapanese.moe/vn-setup/)
    * [TMW: Texthooker & Visual Novels](https://learnjapanese.moe/vn/#playing-visual-novels-to-learn-japanese)
    * [Anime Cards: Texthooker & Visual Novels](https://animecards.site/visualnovels/) (slightly outdated compared to others)
    * [Lazy Guide: Playing Visual Novels on Mobile](https://rentry.co/lazyXel#play-visual-novel-anywhere-with-yomichan-and-mining)
    * [Playing Emulated DS, 3DS, PSP and Gameboy Advanced games on Android devices](https://docs.google.com/document/d/1iUfG_omRDaC3huup_XuAg1ztt2VSkezI2kL-O-Pf3-4/edit?usp=sharing)
        * Contact info: `OrangeLightX#2907` <!-- 1011824983351250965 -->
            on the Refold (JP) Discord server or {{ TMW_SERVER }}
    * See [this section](setupeverythingelse.md#getting-images-sentence-audio-manually)
        to get sentence audio and images

---


# Video Content: Getting Text, Sentence Audio, Picture
Video content includes streamed content (Youtube, Netflix, etc.) and locally downloaded files.

??? example "Resources *(click here)*"
    * [**mpvacious**](https://github.com/Ajatt-Tools/mpvacious) (recommended if you are using MPV)
        * Add-on for [MPV](https://mpv.io/), a cross platform media player. Personally tested.
        * Basically universal codec support.
    * [**asbplayer**](https://github.com/killergerbah/asbplayer)
        * Cross platform (chromium) browser video player. Personally tested.
        * Codec support is based on the browser used.
        * Works on video streaming sites as well.
    * [**Animebook**](https://github.com/animebook/animebook.github.io)
        * Cross platform (chromium) browser video player.
        * Codec support is based on the browser used.
    * All of the above require subtitle files to function. Most anime subtitle files can be found under
        [kitsuneko](https://kitsunekko.net/dirlist.php?dir=subtitles%2Fjapanese%2F).

    **Other:**

    * [jidoujisho](https://github.com/lrorpilla/jidoujisho)
        * Android e-book reader and media player. Advertises itself as an all-in-one app.
        * See [this note on jidoujisho](#jidoujisho).
    * [Immersive](https://github.com/Ben-Kerman/immersive)
        * Add-on for MPV. Alternative to mpvacious.
        * WARNING: This is potentially outdated and/or abandoned.
            The most recent commit as of writing (2022/10/19) was done in 2022/01/27.
            This is listed here for completeness only.

??? example "Guides *(click here)*"
    * [Shiki's mining workflow](https://docs.google.com/document/d/e/2PACX-1vQuEAoZFoJbULZzCJ3_tW7ayT_DcQl9eDlrXMnuPGTwDk62r5fQrXak3ayxBsEgkL85_Z-YY5W4yUom/pub) (asbplayer)
        * Contact info: `boundary-of-emptiness#3065` <!-- 152563705345867778 -->
            on the Refold (JP) Discord server
    * [Tigy01's mining workflow](https://docs.google.com/document/d/e/2PACX-1vTnCEECFTJ_DyBID0uIQ5AZkbrb5ynSmYgkdi6OVyvX-fs9X40btEbpSToTmsct5JzrQJ2e9wcrc6h-/pub) (asbplayer)
        * Contact info: `Tigy01#1231` <!-- 451194927515172864 -->
            on the Refold (JP) Discord server
    * [Cade's sentence mining guide](https://cademcniven.com/posts/20210703/) (animebook)
        * Contact info: `eminent#8189` <!-- 126903585152827392 -->
            on {{ PERDITION_SERVER }} or {{ TMW_SERVER }}

---


# Manga: Getting Text

??? example "mokuro (recommended)"
    [**mokuro**](https://github.com/kha-white/mokuro) pre-processes manga, so you don't have to run
    any OCR program afterwards.

    **Guides:**

    - [Lazy guide (recommended)](https://rentry.co/lazyXel#manga-with-yomichan)
        - (For Windows users) Make sure to check the "Add Python to Path" on install.
        - If you are using online processing (google colab), be sure that you are
          [using the gpu](https://www.tutorialspoint.com/google_colab/google_colab_using_free_gpu.htm)
          to speed up the process.
    - [Josuke's mokuro setup guide](https://docs.google.com/document/d/1ddUINNHZoln6wXGAiGiVpZb4QPtonEy-jgrT1zQbXow/edit?usp=sharing)
        - Contact info: `Josuke#7212` <!-- 190480221135306752 -->
            on the Refold (JP) Discord server
        - This doesn't include instructions on how to process online (whereas the Lazy guide does)
    - If you are on Android, this can be paired with
        [Anki Connect for Android](https://github.com/KamWithK/AnkiconnectAndroid)
        to create Anki cards.

    If any error occurs, check the following:

    - Check your Python version (`python --version`, or `python3 --version`).
        Python 3.10 is [not supported yet](https://github.com/kha-white/mokuro#installation).

        If your Python version is too old, I recommend using [pyenv](https://github.com/pyenv/pyenv),
        for Linux users. Linux users can use the
        [automatic installer](https://github.com/pyenv/pyenv#automatic-installer).
        For Windows users, it should be sufficient to uninstall `mokuro`, install a newer version of Python,
        and then re-install mokuro with the newer version.

    - Make sure your directory is a string and not a number. For example, `mokuro ./01` on unix, and `mokuro .\01` on Windows.

??? example "Manga OCR"
    [**Manga OCR**](https://github.com/kha-white/manga-ocr) allows you to automatically OCR any image.
    As the name suggests, this works best on manga.

    **Guides:**

    - [Lazy guide (Windows)](https://rentry.co/lazyXel#manga-ocr)



---


# Books (EPUBs, HTMLZ, PDF)
As long as you're not using a scan (image-based), the text should already be available.
Below will list a few ways to view these files in a browser to Yomichan.

??? example "Resources *(click here)*"
    * [ッツ Ebook Reader](https://ttu-ebook.web.app/) (EPUBs, HTMLZ) (recommended)
    * [Mozilla's PDF Viewer](https://mozilla.github.io/pdf.js/web/viewer.html) (PDF)

    **Other:**

    * [jidoujisho](https://github.com/lrorpilla/jidoujisho)
        * Android e-book reader and media player. Advertises itself as an all-in-one app.
        * Uses [ッツ Ebook Reader](https://ttu-ebook.web.app/) as its backend.
        * See [this note on jidoujisho](#jidoujisho).

??? example "Guides *(click here)*"
    - Like with Mokuro,
        if you are on Android, this can be paired with
        [Anki Connect for Android](https://github.com/KamWithK/AnkiconnectAndroid)
        to create Anki cards.

---

# Getting Images & Sentence Audio Manually
Sometimes, there is no easy way to get the image and sentence audio other than with a screen recorder.
The primary example for this is game-like content.

Here are the two popular approaches to automatically adding the image and sentence audio:

??? example "ShareX (Windows)"

    [**ShareX**](https://getsharex.com/)

    <!--
    * Windows media recorder which can both take screenshots and record audio. Personally tested.
    * Useful for things that don't have an easy way of getting audio, such as visual novels.
    -->

    **Guides:**

    * [stegatxins0's mining guide: ShareX](https://rentry.co/mining#sharex) (recommended)
        * The scripts written [here](jpresources.md#sharex-scripts)
            works by default with this note.
            These scripts are meant used with stegatxins0's setup.
    * [Xeliu's mining guide: ShareX](https://rentry.co/lazyXel#sharex)
        * ShareX setup is based off of stegatxins0's setup
    * [Anime Cards: Handling Media](https://animecards.site/media/)
        * Not recommended: introduces additional steps compared to the above two guides

??? example "ames (Linux)"

    [**ames**](https://github.com/eshrh/ames)

    * ShareX alternative for Linux. Personally tested.
    * Primarily used to automate audio and picture extraction to the most recently added Anki card.


---

# Resource Lists
Other websites have significantly larger resource lists that may prove useful for you.

??? example "Resource Lists *(click here)*"
    * [TMW](https://learnjapanese.moe/resources/)
    * [Tatsumoto](https://tatsumoto.neocities.org/blog/resources.html)
    * [itazuraneko](https://itazuraneko.neocities.org/library/librarymain.html)
    * [Refold (JP)](https://docs.google.com/document/d/1tQmoGwCJQqmjdmaQdigAG0Ph1ODSMsGhsD7qOhlUuc0/) ([Mirror](https://refold.link/japanese))
    * [Refold (General)](https://docs.google.com/document/d/1z_5VbwqKjuyaDH8l6BqhAPJdHWAfypz-3V7pHsWHr6A/) ([Mirror](https://refold.link/Tech_and_Tools))


---

# Notes on Various Programs

## [mpvacious](https://github.com/Ajatt-Tools/mpvacious)

* You will have to change the [configuration](https://github.com/Ajatt-Tools/mpvacious#configuration)
    in order for mpvacious to work with JPMN.

    ??? examplecode "Click here to see some basic config changes to get it working with JPMN."

        ```ini
        # Model names are listed in `Tools -> Manage note types` menu in Anki.
        model_name=JP Mining Note

        # Field names as they appear in the selected note type.
        # If you set `audio_field` or `image_field` empty,
        # the corresponding media file will not be created.
        sentence_field=Sentence
        #secondary_field=SentEng  # Not used by the note. This is ignored entirely.
        audio_field=SentenceAudio
        image_field=Picture
        ```

        You may want to increase the picture quality, as it's extremely low by default.
        I personally use the following:

        ```ini
        # Quality of produced image files. 0 = lowest, 100=highest.
        #snapshot_quality=15
        snapshot_quality=50

        # Image dimensions
        # If either (but not both) of the width or height parameters is -2,
        # the value will be calculated preserving the aspect-ratio.
        #snapshot_width=-2
        #snapshot_height=200
        snapshot_width=800
        snapshot_height=-2
        ```

    !!! info
        When creating the config file, ensure that the config file is placed in the correct folder.
        This `script-opts` folder does not exist by default.
        You will likely have to create the folder.

        Additionally, be sure to restart MPV after changing the config to apply the changes.

* The `SentenceReading` field may differ from the `Sentence` field,
    if you export multiple lines of a subtitle in one card.
    Because of this, you will likely want to
    [disable automatic furigana generation on card add](faq.md#how-do-i-disable-furigana-on-card-generation).

    If you still want furigana on your cards,
    [bulk generate it](faq.md#how-do-i-bulk-generate-furigana) after each session.

* This addon has capabilities to
    [extract the video clip itself](https://github.com/Ajatt-Tools/mpvacious/pull/78)
    instead of the picture.
    However, this note does not support video clips yet.

---

## [asbplayer](https://github.com/killergerbah/asbplayer)

* To use asbplayer, add the card with Yomichan, and then update the created note with asbplayer.
    I recommend filling out the following fields as follows:

    ??? example "asbplayer Fields *(click here)*"
        | asbplayer field | JPMN field |
        |:-:|:-:|
        | Sentence Field   { .smaller-table-row} | `Sentence`        { .smaller-table-row} |
        | Definition Field { .smaller-table-row} | |
        | Word Field       { .smaller-table-row} | |
        | Audio Field      { .smaller-table-row} | `SentenceAudio`   { .smaller-table-row} |
        | Image Field      { .smaller-table-row} | `Picture`         { .smaller-table-row} |
        | Source Field     { .smaller-table-row} | `AdditionalNotes` { .smaller-table-row} |
        | URL Field        { .smaller-table-row} | `AdditionalNotes` { .smaller-table-row} |

        !!! note
            Chances are that you are using subtitles. However, if you are not using subtitles,
            it is fine to keep the Sentence Field empty.


There are a few common issues that asbplayer users have, when creating cards with JPMN.

1. **The `Sentence` field has extra info.**

    This is because asbplayer requires you to use its internal `Sentence` field
    instead of Yomichan's automatically generated sentence.

    However, using this will naturally lead you to the second problem:

1. **The word in the `Sentence` field is not bolded.**

    asbplayer's generated sentence does NOT preserve the bold in the `Sentence` field.
    Unfortunately, there is no easy way to fix this.
    Your options include:

    1. Manually bolding the word in Anki.
    1. Updating the sentence with [this script](jpresources.md#update-sentence-with-clipboard)
        (instead of using asbplayer's sentence field).
        This script must be ran after each card add.
    1. Using a different program altogether,
        such as [mpvacious](https://github.com/Ajatt-Tools/mpvacious).

1. **The `SentenceReading` differs from the `Sentence` field, or has extra text.**

    This relates to the first problem: Yomichan's automatically generated sentence
    differs from asbplayer's sentence field.

    To fix this,
    [disable automatic furigana generation on card add](faq.md#how-do-i-disable-furigana-on-card-generation).

    If you still want furigana on your cards,
    [bulk generate it](faq.md#how-do-i-bulk-generate-furigana) after each session.


---

## [jidoujisho](https://github.com/lrorpilla/jidoujisho)

I'm not very sure how the Anki card generation works for this app,
since this app does not use Yomichan.

The custom handlebars used by JPMN does a lot of heavy lifting
and has plenty of customizations specifically to work JPMN.
Unfortunately, this handlebars is not very portable between programs.

If you want to use this app, I leave it to the reader to figure out the specifics
of creating the cards.

