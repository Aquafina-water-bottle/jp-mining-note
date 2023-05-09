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


## Troubleshooting & Support

If you are having troubles with any of the guides or programs below,
I unfortunately **will not** be able to provide very detailed support.

Instead, I would recommend that you contact the creators of the guides / programs,
or the communities surrounding said guides / programs.

Additionally, the guides listed here usually do not use JPMN, and instead link
to other note types.
This shouldn't be an issue as long as you change the appropriate the field names.


---

# Getting the Text to Create the Cards

I use a texthooker setup,
which is able to extract subtitles or text into the browser.
Once the text is on the browser, you can use Yomichan to select the word and create the
Anki card (by clicking on the green plus button).

The standard texthooker setup works for most games, and any show with subtitle files.


## Texthooker: Websocket based
These pages display the hooked content, where the hooked content is communicated
via Websockets.
Websocket based texthookers are better than the classic clipboard-based texthookers
in almost every aspect:

* They are generally faster and more reliable.
* They do not flood your clipboard.
* They do not require an extension that constantly polls the clipboard.

However, it requires more specialized coordination between programs.
Fortunately, most common workflows support websockets nowadays.

??? example "Resources <small>(click here)</small>"
    * [**Renji's Texthooker Page**](https://github.com/Renji-XD/texthooker-ui) <small>(recommended)</small>
        * Open source and more featureful alternative to the more popular Anacreon's texthooker page.
        * This texthooker page comes with built in support for both websockets and
            clipboard inserter plugins.
        * I use [these settings](jpresources.md#settings-css-for-renjis-texthooker)
            to make the text more compressed.

    * [**exSTATic**](https://github.com/KamWithK/exSTATic/) <small>(recommended for stats lovers)</small>
        * Its primary use is for automatic stats collection and visualizing said statistics.
        * Integrates seamlessly with many workflows, including non-texthooker related workflows.
        * Uses a custom texthooker page, which connects with Textractor with its own custom extension.
        * A video installation guide is available on the project's README page.

    **Supported Workflows:**

    - [**Textractor**](https://github.com/Artikash/Textractor) with [**textractor-websocket**](https://github.com/sadolit/textractor-websocket) or [**TextractorSender**](https://github.com/KamWithK/TextractorSender)
    - [**mpv**](https://mpv.io) with [**mpv_websocket**](https://github.com/kuroahna/mpv_websocket)

??? example "Legacy Resources <small>(click here)</small>"
    These resources are considered legacy, and I highly recommend using the
    standard resources above in favor of these.

    * [**Marv's Websocket Userscript**](https://github.com/MarvNC/texthooker-websocket)
        * A more featureful version of the patch below.
        * Written for Anacreon's texthooker page.

    * **Zetta's Custom Patch**

        * Patch Instructions for existing clipboard-based texthookers.
        * This patch is intended to be used in conjunction with
            [this Textractor extension](https://github.com/sadolit/textractor-websocket).
        * This patch was written for Anacreon's texthooker page.
            However, it will likely work for most other texthooker pages.

        ??? examplecode "Instructions to use the patch <small>(click here)</small>"

            !!! warning
                This is a monkey patch, even according to the author. Now that better alternatives
                have came out (see above), I recommend to use said alternatives.

            1. Download your favorite texthooker page into a raw html file.
            1. Copy/paste the code below to the very end of the raw html file.
            1. If you are currently viewing the page, refresh.

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




## Texthooker: Clipboard based
These pages display the hooked content, where the hooked content is communicated
via automated clipboard (copy/paste) tools.
Most classic setups documented are for clipboard based texthooker pages.

??? example "Resources <small>(click here)</small>"
    * [**Clipboard Inserter Redux (Extension)**](https://github.com/Onurtag/clipboard-inserter)
        * Updated version of the original Clipboard Inserter extension
        * Still using manifest v2, so this extension will be deprecated in the future unless updated
    * [**Lap Clipboard Inserter (Extension)**](https://github.com/laplus-sadness/lap-clipboard-inserter) <small>(Firefox)</small>
        * Rewritten version of the original Clipboard Inserter extension, to use manifest v3
        * Works on Firefox, but Chrome is
            [currently not supported](https://github.com/laplus-sadness/lap-clipboard-inserter#chrome).
            Use Clipboard Inserter Redux if you are using a chromium based browser.
    * [**Renji's Texthooker Page**](https://github.com/Renji-XD/texthooker-ui) <small>(recommended)</small>
        * Open source and more featureful alternative to the more popular Anacreon's texthooker page.
        * I use [these settings](jpresources.md#settings-css-for-renjis-texthooker)
            to make the text more compressed.

??? example "Guides <small>(click here)</small>"
    * [stegatxins0's mining guide: Texthooker](https://rentry.co/mining#browser) <small>(recommended)</small>
    * [TMW: Texthooker & Visual Novels](https://learnjapanese.moe/vn/#playing-visual-novels-to-learn-japanese)
    * [Lazy Guide: Texthooker](https://rentry.co/lazyXel#clipboard-inserter)
    * [Anime Cards: Texthooker & Visual Novels](https://animecards.site/visualnovels/)

??? example "Legacy Resources <small>(click here)</small>"
    These resources are considered legacy, and I highly recommend using the
    standard resources above in favor of these.

    * [**Original Clipboard Inserter (Extension)**](https://github.com/kmltml/clipboard-inserter) <small>(WARNING: NO LONGER MAINTAINED!)</small>
        * WARNING: [No longer works on Firefox](https://github.com/kmltml/clipboard-inserter/issues/14)
            as of Firefox version 107.0. Use either extensions above if you are using Firefox.
    * [**Anacreon's Texthooker Page**](https://anacreondjt.gitlab.io/docs/texthooker/)
    * [**TMW's Texthooker Page**](https://learnjapanese.moe/texthooker.html)

---



# Game-Like Content: Getting Text
The following are primarily for text-heavy games, such as visual novels.

??? example "Resources <small>(click here)</small>"
    * [Textractor](https://github.com/Artikash/Textractor) (recommended)
    * [agent](https://github.com/0xDC00/agent)
        * This is a good fallback for when Textractor doesn't work

??? example "Guides <small>(click here)</small>"
    * [TMW: Installing Visual Novels](https://learnjapanese.moe/vn-setup/)
    * [TMW: Texthooker & Visual Novels](https://learnjapanese.moe/vn/#playing-visual-novels-to-learn-japanese)
    * [Anime Cards: Texthooker & Visual Novels](https://animecards.site/visualnovels/) (slightly outdated compared to others)
    * [Lazy Guide: Playing Visual Novels on Mobile](https://rentry.co/lazyXel#play-visual-novel-anywhere-with-yomichan-and-mining)
    * [Playing Emulated DS, 3DS, PSP and Gameboy Advanced games on Android devices](https://docs.google.com/document/d/1iUfG_omRDaC3huup_XuAg1ztt2VSkezI2kL-O-Pf3-4/edit?usp=sharing)
        * Contact info: `OrangeLightX#2907` <!-- 1011824983351250965 -->
            on the Refold (JP) Discord server or {{ TMW_SERVER }}
    * See [this section](setuptextmedia.md#getting-images-sentence-audio-manually)
        to get sentence audio and images

---


# Video Content: Getting Text, Sentence Audio, Picture
Video content includes streamed content (Youtube, Netflix, etc.) and locally downloaded files.

??? example "Resources <small>(click here)</small>"
    * [**mpvacious**](https://github.com/Ajatt-Tools/mpvacious) (recommended for downloaded videos / if you are using mpv)
        * Add-on for [MPV](https://mpv.io/), a cross platform media player. Personally tested.
        * Basically universal codec support since it uses mpv.
        * This addon has capabilities to
            [extract the video clip itself](https://github.com/Ajatt-Tools/mpvacious/pull/78)
            as the form of a gif (autoplayable webp).
    * [**asbplayer**](https://github.com/killergerbah/asbplayer) (recommended for streamed sites)
        * Cross platform (chromium) browser video player. Personally tested.
        * Works on video streaming sites, as well as downloaded videos.
        * Does not require a texthooker: subtitles are displayed on the site itself.
        * Codec support is limited, and depends on the browser used.
    * [**Animebook**](https://github.com/animebook/animebook.github.io)
        * Cross platform (chromium) browser video player.
        * Does not require a texthooker: subtitles are displayed on the site itself.
        * Codec support is limited, and depends on the browser used.
    * All of the above require subtitle files to function.
        See
        [here](https://learnjapanese.moe/resources/#subtitles)
        and/or
        [here](https://gist.github.com/tatsumoto-ren/78ba4e5b7c53c7ed2c987015fa05cc2b)
        for some websites where you can get subtitles from.
    * One challenge for video content is that subtitles are usually not aligned properly
        if the subtitles are downloaded separately from the video.
        I've always used a combination of
        [mkvextract](https://mkvtoolnix.download/downloads.html)
        (to extract the subtitle file from the `.mkv` file)
        and
        [alass](https://github.com/kaegi/alass/)
        (to align the native subtitles with reference subtitles, usually in a different language)
        to get the job done.
        If you want more options, see
        [this page](https://zenith-raincoat-5cf.notion.site/Subtitles-0166a2d329474a43968bdbcb32739263).

    **Other:**

    * [jidoujisho](https://github.com/lrorpilla/jidoujisho)
        * Android e-book reader and media player. Advertises itself as an all-in-one app.
    * [Immersive](https://github.com/Ben-Kerman/immersive)
        * Add-on for MPV. Alternative to mpvacious.
        * WARNING: This is potentially outdated and/or abandoned.
            The most recent commit as of writing (2022/10/19) was done in 2022/01/27.
            This is listed here for completeness only.

??? example "Guides <small>(click here)</small>"
    * [mikumino's mining workflow](https://www.youtube.com/watch?v=B60cj69MSmA&ab_channel=mikumino) (asbplayer + jp-mining-note)
    * [Shiki's mining workflow](https://docs.google.com/document/d/e/2PACX-1vQuEAoZFoJbULZzCJ3_tW7ayT_DcQl9eDlrXMnuPGTwDk62r5fQrXak3ayxBsEgkL85_Z-YY5W4yUom/pub) (asbplayer)
        * Contact info: `boundary-of-emptiness#3065` <!-- 152563705345867778 -->
            on the Refold (JP) Discord server
    * [Tigy01's mining workflow](https://docs.google.com/document/d/e/2PACX-1vTnCEECFTJ_DyBID0uIQ5AZkbrb5ynSmYgkdi6OVyvX-fs9X40btEbpSToTmsct5JzrQJ2e9wcrc6h-/pub) (asbplayer)
        * Contact info: `Tigy01#1231` <!-- 451194927515172864 -->
            on the Refold (JP) Discord server
    * [Brian's "Sentence mining from Netflix and YouTube with asbplayer"](https://soyuz18.notion.site/Sentence-mining-from-Netflix-and-YouTube-with-asbplayer-83a03590cd8349ba81ca10340645b565#92ca8ce0251f4eeba89776950b8cef11)
    * [Cade's sentence mining guide](https://cademcniven.com/posts/20210703/) (animebook)
        * Contact info: `eminent#8189` <!-- 126903585152827392 -->
            on {{ PERDITION_SERVER }} or {{ TMW_SERVER }}




---


# Manga: Getting Text

??? example "mokuro (recommended)"
    [**mokuro**](https://github.com/kha-white/mokuro) pre-processes manga, so you don't have to run
    any OCR program afterwards.

    **Guides:**

    - [Lazy guide](https://rentry.co/lazyXel#manga-with-yomichan) (recommended)
        - (For Windows users) Make sure to check the "Add Python to Path" on install.
        - If you are using online processing (google colab), be sure that you are
          [using the gpu](https://www.tutorialspoint.com/google_colab/google_colab_using_free_gpu.htm)
          to speed up the process.
    - [Josuke's mokuro setup guide](https://docs.google.com/document/d/1ddUINNHZoln6wXGAiGiVpZb4QPtonEy-jgrT1zQbXow/edit?usp=sharing)
        - Contact info: `Josuke#7212` <!-- 190480221135306752 -->
            on the Refold (JP) Discord server
        - This doesn't include instructions on how to process online (whereas the Lazy guide does)

    **Other Resources:**

    - If you are on Android, this can be paired with
        [Anki Connect for Android](https://github.com/KamWithK/AnkiconnectAndroid)
        to create Anki cards.
    - [WeebAlt's RemoteMokuro setup](https://github.com/WeebAlt/RemoteMokuro)
        - This includes setup instructions on using Mokuro remotely (from google drive, i.e. no disk storage)
    - [leermangamokureado](https://leermangamokureado.duckdns.org/)
        is a site with various manga ran through mokuro.

    If any error occurs, check the following:

    - Check your Python version (`python --version`, or `python3 --version`).
        Python 3.10 is [not supported yet](https://github.com/kha-white/mokuro#installation).

        If your Python version is too old, I recommend using [pyenv](https://github.com/pyenv/pyenv)
        (for Linux users). Linux users can use the
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

??? example "Resources <small>(click here)</small>"
    * [**ッツ Ebook Reader**](https://reader.ttsu.app) (EPUBs, HTMLZ) (recommended)
    * [**Mozilla's PDF Viewer**](https://mozilla.github.io/pdf.js/web/viewer.html) (PDF)

    **Other:**

    * [jidoujisho](https://github.com/lrorpilla/jidoujisho)
        * Android e-book reader and media player. Advertises itself as an all-in-one app.
        * Uses [ッツ Ebook Reader](https://ttu-ebook.web.app/) as its backend.

??? example "Guides <small>(click here)</small>"
    - Like with Mokuro,
        if you are on Android, this can be paired with
        [Anki Connect for Android](https://github.com/KamWithK/AnkiconnectAndroid)
        to create Anki cards.

---

# Audio/Video with No Subtitles

[KanjiEater's AudiobookTextSync](https://github.com/kanjieater/AudiobookTextSync)
is a relatively new set of tools that generates subtitles using machine learned models.


---

# Getting Images & Sentence Audio Manually
Sometimes, there is no easy way to get the image and sentence audio other than with a screen recorder.
The primary example for this is game-like content.

Here are the two popular approaches to automatically adding the image and sentence audio:

??? example "ShareX (Windows)"

    [**ShareX**](https://getsharex.com/)

    * Windows media recorder which can both take screenshots and record audio. Personally tested.

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

??? example "Resource Lists <small>(click here)</small>"
    * [TheMoeWay](https://learnjapanese.moe/resources/)
    * [Tatsumoto](https://tatsumoto.neocities.org/blog/resources.html)
    * [itazuraneko](https://itazuraneko.neocities.org/index.html)
    * [kuzuri](https://kuzuri.neocities.org/resources.html)
    * [Refold (JP)](https://www.notion.so/Refold-Japanese-Content-Resources-WIP-9121097535e74f6ba501c93b1773e70c)
        ([Old Google doc](https://docs.google.com/document/d/1tQmoGwCJQqmjdmaQdigAG0Ph1ODSMsGhsD7qOhlUuc0/))
        ([Mirror](https://refold.link/japanese))
    * [Refold (General)](https://docs.google.com/document/d/1z_5VbwqKjuyaDH8l6BqhAPJdHWAfypz-3V7pHsWHr6A/) ([Mirror](https://refold.link/Tech_and_Tools))
    * [IgrecL/japanese](https://github.com/IgrecL/japanese)
    * [donkuri/learn-japanese](https://donkuri.github.io/learn-japanese/resources/)


---

# Notes on Various Programs

## [mpvacious](https://github.com/Ajatt-Tools/mpvacious)

* You will have to change the [configuration](https://github.com/Ajatt-Tools/mpvacious#configuration)
    in order for mpvacious to work with JPMN.

    ??? examplecode "Click here to see some basic config changes to get it working with JPMN."

        ```ini
        # Be sure to change deck_name to whatever your deck is!

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

        You may want to increase the picture and audio quality, as it's extremely low by default.
        I personally use the following:

        ```ini
        # Sane values are 16k-32k for opus, 64k-128k for mp3.
        audio_bitrate=32k

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

* A common issue with mpvacious is that
    the `SentenceReading` field may differ from the `Sentence` field,
    say, if you export multiple subtitles into one card.
    See the
    [FAQ](faq.md#the-sentencereading-field-is-not-updated-is-different-from-the-sentence-field)
    on how to fix it.

* To create cards with mpvacious, first add a card from Yomichan (usually via a texthooker),
    and then press `ctrl`+`m` in mpv.



## [asbplayer](https://github.com/killergerbah/asbplayer)

* To use asbplayer, add the card with Yomichan, and then update the created note with asbplayer.
    I recommend filling out the following fields as follows:

    ??? example "asbplayer fields <small>(click here)</small>"
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

* Any version of asbplayer released after
    [2023/01/16](https://github.com/killergerbah/asbplayer/issues/205) (version 0.25.0 or higher)
    will now preserve the bolded word within the sentence!
    However, asbplayer shares the same common issue with mpvacious, where
    the `SentenceReading` field may differ from the `Sentence` field.
    See the
    [FAQ](faq.md#the-sentencereading-field-is-not-updated-is-different-from-the-sentence-field)
    on how to fix it.


<!--

There are a few common issues that asbplayer users have, when creating cards with JPMN.

1. **The `Sentence` field has extra info.**

    This is because asbplayer requires you to use its internal `Sentence` field
    instead of Yomichan's automatically generated sentence.

    However, using this will naturally lead you to the second problem:

1. **The word in the `Sentence` field is not bolded.**

    asbplayer's generated sentence does NOT preserve the bold in the `Sentence` field.

    The note comes with a feature to
    [automatically highlight the word](ui.md#automatic-word-highlighting)
    within the sentence.
    However, this is an imperfect solution,
    and there is currently no easy way to add accurate highlighting to existing sentences.
    To guarantee accurate word highlights, your options include:

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

-->


