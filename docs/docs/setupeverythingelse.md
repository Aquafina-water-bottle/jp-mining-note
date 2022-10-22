This page is dedicated to providing resources on how to do the following:

1. Getting the actual text to use Yomichan on.
1. Getting the pictures and/or sentence audio from the media.

There are plenty of well established resources out there on how to do just that,
ranging from software to written & video guides.
Instead of repeating what others have already said, those programs and guides
will be linked.

If you are looking to setup jp-mining-note, see [this](setup.md) page instead.

!!! warning

    If you are having troubles with any of the guides or programs below,
    I unfortunately will not be able to provide very detailed support.

    Instead, I would recommend that you contact the creators of the guides / programs,
    or the communities surrounding said guides / programs.

    Additionally, the guides listed here do not use JPMN, and instead link
    to other note types.
    This shouldn't be an issue as long as you change appropriate the field names.


# Getting the Text to Create the Cards

I use a texthooker setup, which is able to extract subtitles or text into the browser.
Once the text is on the browser, you can use Yomichan to select the word and create the
Anki card (click on the green plus button).

The classic texthooker setup works for most games, and any show with subtitle files.


## Texthooker pages (clipboard based)
These pages display the hooked content.
Most setups documented are for clipboard based texthooker pages.

* [Anacreon's Texthooker Page](https://anacreondjt.gitlab.io/docs/texthooker/) (recommended)
* [TMW's Texthooker Page](https://learnjapanese.moe/texthooker.html)

**Guides:**

* [stegatxins0's mining guide: Texthooker](https://rentry.co/mining#browser) (recommended)
* [TMW: Texthooker & Visual Novels](https://learnjapanese.moe/vn/#playing-visual-novels-to-learn-japanese)
* [Lazy Guide: Texthooker](https://rentry.co/lazyXel#clipboard-inserter)
* [Anime Cards: Texthooker & Visual Novels](https://animecards.site/visualnovels/)


## Texthooker pages (Websocket based)
Websocket based texthookers are generally faster, more reliable, and do not flood your clipboard.
However, it's not as popular as the clipboard based methods,
so there is usually less support.

When you use websocket-based texthooker pages, ensure that the program you use to grab
the text also uses websockets.
For example, if you want to use Textractor, use
[this](https://github.com/sadolit/textractor-websocket)
extension.

### [exSTATic](https://github.com/KamWithK/exSTATic/)
* Custom texthooker page, automatically collects stats for viewing

### Patch Instructions for existing clipboard-based texthookers

1. Download your favorite texthooker page into a raw html file.
1. Copy/paste the code below into the raw html file.
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
    ([Original discord message](https://discord.com/channels/617136488840429598/780870629426724864/952964914375442452), on [TMW server](https://learnjapanese.moe/join/). Thanks Zetta#3033 for the code.)
    </sup>

!!! note
    This was written for Anacreon's texthooker page.
    However, it will likely work for most other texthooker pages.



## Text from game-like content
* [Textractor](https://github.com/Artikash/Textractor) (recommended)
* [agent](https://github.com/0xDC00/agent)
    * This is a good fallback for when Textractor doesn't work

**Guides:**

* [TMW: Installing Visual Novels](https://learnjapanese.moe/vn-setup/)
* [TMW: Texthooker & Visual Novels](https://learnjapanese.moe/vn/#playing-visual-novels-to-learn-japanese)
* [Anime Cards: Texthooker & Visual Novels](https://animecards.site/visualnovels/) (slightly outdated compared to others)
* [Lazy Guide: Playing Visual Novels on Mobile](https://rentry.co/lazyXel#play-visual-novel-anywhere-with-yomichan-and-mining)
* [Playing Emulated DS, 3DS, PSP and Gameboy Advanced games on Android devices](https://docs.google.com/document/d/1iUfG_omRDaC3huup_XuAg1ztt2VSkezI2kL-O-Pf3-4/edit?usp=sharing)
    * Contact info: `OrangeLightX#2907` <!-- 1011824983351250965 -->
        on the Refold (JP) Discord server or [TMW server](https://learnjapanese.moe/join/)



## Text from videos
* [mpvacious](https://github.com/Ajatt-Tools/mpvacious) (recommended if you are using MPV)
* [Immersive](https://github.com/Ben-Kerman/immersive)
* [asbplayer](https://github.com/killergerbah/asbplayer) (Built-in texthooker page)
* [Animebook](https://github.com/animebook/animebook.github.io) (Built-in texthooker page)
* All of the above require subtitle files to function. Most anime subtitle files can be found under
    [kitsuneko](https://kitsunekko.net/dirlist.php?dir=subtitles%2Fjapanese%2F).

**Guides:**

* [Shiki's mining workflow](https://docs.google.com/document/d/e/2PACX-1vQuEAoZFoJbULZzCJ3_tW7ayT_DcQl9eDlrXMnuPGTwDk62r5fQrXak3ayxBsEgkL85_Z-YY5W4yUom/pub) (asbplayer)
    * Contact info: `boundary-of-emptiness#3065` <!-- 152563705345867778 -->
        on the Refold (JP) Discord server
* [Tigy01's mining workflow](https://docs.google.com/document/d/e/2PACX-1vTnCEECFTJ_DyBID0uIQ5AZkbrb5ynSmYgkdi6OVyvX-fs9X40btEbpSToTmsct5JzrQJ2e9wcrc6h-/pub) (asbplayer)
    * Contact info: `Tigy01#1231` <!-- 451194927515172864 -->
        on the Refold (JP) Discord server
* [Cade's sentence mining guide](https://cademcniven.com/posts/20210703/) (animebook)
    * Contact info: `eminent#8189` <!-- 126903585152827392 -->
        on [Perdition's server](https://discord.gg/uK4HeGN) or [TMW server](https://learnjapanese.moe/join/))



## Text from manga (Mokuro)
[mokuro](https://github.com/kha-white/mokuro) pre-processes manga, so you don't have to run
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
    especially for Linux users. Linux users can use the
    [automatic installer](https://github.com/pyenv/pyenv#automatic-installer).

- Make sure your directory is a string and not a number. For example, `mokuro ./01` on unix, and `mokuro .\01` on Windows.


## Text from local files (EPUBs, HTMLZ, PDF)
As long as you're not using a scan (image-based), the text should already be available.
The following are ways to view these files in a browser to Yomichan:

* [ッツ Ebook Reader](https://ttu-ebook.web.app/) (EPUBs, HTMLZ)
* [Mozilla's PDF Viewer](https://mozilla.github.io/pdf.js/web/viewer.html) (PDF)

**Guides:**

- Like with Mokuro,
    if you are on Android, this can be paired with
    [Anki Connect for Android](https://github.com/KamWithK/AnkiconnectAndroid)
    to create Anki cards.



---

# Automating Pictures and Sentence Audio

## [mpvacious](https://github.com/Ajatt-Tools/mpvacious)

* Add-on for [MPV](https://mpv.io/), a cross platform media player. Personally tested.
* Given a subtitle file for a movie file, it can automatically add sentence audio and images with one `Ctrl+n` command.
* You can now [extract the video clip itself](https://github.com/Ajatt-Tools/mpvacious/pull/78)
    instead of the picture.

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


## [Immersive](https://github.com/Ben-Kerman/immersive)

* A powerful alternative to the mpvacious add-on above, with certain different capabilities.
* Can also be used to automatically extract sentence audio and pictures.

!!! warning
    This is potentially outdated and/or abandoned.
    The most recent commit as of writing (2022/10/19) was done in 2022/01/27.

## [asbplayer](https://github.com/killergerbah/asbplayer)

* Cross platform (chromium) browser video player. Personally tested.
* This also has card image and audio exporting capabilities.
* Works on video streaming sites as well.
* Guides that use asbplayer:
    * [Shiki's mining workflow](https://docs.google.com/document/d/e/2PACX-1vQuEAoZFoJbULZzCJ3_tW7ayT_DcQl9eDlrXMnuPGTwDk62r5fQrXak3ayxBsEgkL85_Z-YY5W4yUom/pub)
    * [Tigy01's mining workflow](https://docs.google.com/document/d/e/2PACX-1vTnCEECFTJ_DyBID0uIQ5AZkbrb5ynSmYgkdi6OVyvX-fs9X40btEbpSToTmsct5JzrQJ2e9wcrc6h-/pub)

## [ShareX](https://getsharex.com/)

* Windows media recorder which can both take screenshots and record audio. Personally tested.
* Useful for things that don't have an easy way of getting audio, such as visual novels.
* Guides on connecting ShareX with your mining setup:
    * [stegatxins0's mining guide: ShareX](https://rentry.co/mining#sharex) (recommended)
        * The scripts written [here](jpresources.md#sharex-scripts)
            works by default with this note.
            These scripts are meant used with stegatxins0's setup.
    * [Xeliu's mining guide: ShareX](https://rentry.co/lazyXel#sharex)
        * ShareX setup is based off of stegatxins0's setup
    * [Anime Cards: Handling Media](https://animecards.site/media/)
        * Not recommended: introduces additional steps compared to the above two guides

## [ames](https://github.com/eshrh/ames)

* ShareX alternative for Linux. Personally tested.
* Primarily used to automate audio and picture extraction to the most recently added Anki card.

## [Animebook](https://github.com/animebook/animebook.github.io)

* Cross platform (chromium) browser video player.
* This also has card image and audio exporting capabilities.
* Guides that use Animebook:
    * [Cade's sentence mining guide](https://cademcniven.com/posts/20210703/)

## [jidoujisho](https://github.com/lrorpilla/jidoujisho)

* Android e-book reader and media player, which can also create Anki cards (among many, many other things).
* Note that this app does NOT use Yomichan, which means that certain fields may not be filled automatically.



