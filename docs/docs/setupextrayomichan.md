# Summary

This page contains a bunch of completely optional tips for making the best use of Yomichan.
It is expected that you have setup Yomichan properly before continuing with this page.

---


# Yomichan Appearance
If you want to follow my exact Yomichan popup appearance:

* Go to (Yomichan settings) →  `Popup Appearance`.
* Set `Compact glossaries` to ON.
* Set `Compact tags` to OFF.

There are also plenty of CSS customizations for Yomichan listed out
in the [JP Resources page](jpresources.md).

---





# JMdict

If you are planning on using the JMdict dictionary,
the ones provided from most sources
(TMW's google drive - The "JMdict Extra" version is fine, Matt's video on Yomichan,
and Yomichan's main github page)
are all somewhat outdated, which usually means less accurate definitions and less coverage.

To get the most recent version of JMdict,
download it from the
[official site](https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project)
(download `JMdict_e_examp.gz`)
and use [yomichan-import](https://github.com/FooSoft/yomichan-import)
to get the latest JMdict version available.

If you don't want to compile it from source, I provide a download link
[here](https://github.com/Aquafina-water-bottle/jmdict-english-yomichan),
which should only be a few months stale at most.

<!-- TODO github actions to re-compile it daily -->

---






# Other dictionaries

* [**JMdict Forms**](https://github.com/Aquafina-water-bottle/jmdict-english-yomichan)

    This is a dictionary placed in the `UtilityDictionaries` field by default.
    Although I don't use it when studying Anki, it helps to use this when creating Anki notes
    for monolingual definitions.

* I highly recommend getting some pitch accent dictionaries and frequency lists
    if you have not already, as these will be shown and used in the note type.
    See [TheMoeWay's folder](https://learnjapanese.link/dictionaries) to browse through some examples.

    I personally recommend NHK, 大辞泉, and アクセント辞典.

* [**JPDB frequency list**](https://github.com/MarvNC/jpdb-freq-list)

    I personally recommend using the JPDB frequency list as one of your frequency lists,
    because it has high word coverage, and seems very high quality (particularly for fiction content).

* [**JPDB Kanji dictionary**](https://github.com/MarvNC/yomichan-dictionaries/#jpdb-kanji)

    This dictionary is extremely useful to see the most popular words where a particular kanji is used.
    I like using this to see how rare a kanji is at a glance.

    This synergizes well with
    [kanji frequency dictionaries](https://github.com/MarvNC/yomichan-dictionaries/#kanji-frequency).





---



# Local Audio Server for Yomichan
See
[here](https://github.com/Aquafina-water-bottle/local-audio-yomichan)
if you want to be able to create Anki cards nearly instanteously,
and fetch audio without a working internet connection.

I personally recommend using this setup if you can.


