
TODO

[mpvacious](https://github.com/Ajatt-Tools/mpvacious)

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


