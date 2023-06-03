
[**mpvacious**](https://github.com/Ajatt-Tools/mpvacious)

TODO

---

# Installation

<!-- TODO more detailed steps? -->

Installation steps should be found [here](https://github.com/Ajatt-Tools/mpvacious#installation).

For Windows users, you must install this under your
[mpv scripts folder](https://github.com/mpv-player/mpv/wiki/User-Scripts).
The `scripts` folder does not exist by default; it must be created manually.

---

# Configuration

You will have to change [mpvacious's configuration](https://github.com/Ajatt-Tools/mpvacious#configuration)
in order for mpvacious to work with JPMN.

## Creating the configuration

!!! note
    In case nothing works, always make sure to check the
    [official documentation](https://github.com/Ajatt-Tools/mpvacious#configuration),
    as it is guaranteed to have the latest instructions if they ever change.

=== "Windows"

    1. Navigate to `%APPDATA%\Roaming`
        You can access this by opening the file manager, and
        typing `%APPDATA%\Roaming` in the location field.
    1. Create the `mpv` folder if it doesn't exist, and open the folder.
    1. Create the `script-opts` folder if it doesn't exist, and open the folder.
        By now, you should be under:
        ```
        %APPDATA%\Roaming\mpv\script-opts
        ```
    1. Create a text file with your favorite text editor.
        If you do not have any custom text editor downloaded,
        notepad should work.
        TODO exact steps on creating the text file
    1. Copy/paste the following, and save as `subs2srs.conf`:
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
        Ensure that your file is indeed a .conf file when saved.
        If your file browser says that it is a text file, then
        the file was likely incorrectly saved as `subs2srs.conf.txt`.
        TODO exact instructions on renaming


=== "Mac / Linux (Terminal)"
    The following installs the correct configuration,
    along with all the recommended settings stated below.

    ```bash
    mkdir -p ~/.config/mpv/script-opts
    # TODO change this to the master branch eventually
    curl https://raw.githubusercontent.com/Aquafina-water-bottle/jp-mining-note/dev/docs/docs/assets/setupmpvacious/subs2srs.conf > ~/.config/mpv/script-opts/subs2srs.conf
    ```

Be sure to restart mpv after changing the config to make sure your configuration is applied.


## Other configuration changes

* You may want to increase the picture and audio quality, as it's extremely low by default.
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

* By default, you can see secondary subs (usually subtitles in your native language)
    if you hover to the top 15% of the screen. If you don't want to see this, use the following:
    ```
    secondary_sub_visibility=auto
    ```

* You might not want the Anki browser to appear every time you add the card.
    In that case, use the following:
    ```
    disable_gui_browse=yes
    ```

* In general, I recommend looking through the
    [example configuration](https://github.com/Ajatt-Tools/mpvacious/blob/master/.github/RELEASE/subs2srs.conf)
    to see if there are other options that you may want to change.

---


# Other

* A common issue with mpvacious is that
    the `SentenceReading` field may differ from the `Sentence` field,
    say, if you export multiple subtitles into one card.
    See the
    [FAQ](faq.md#the-sentencereading-field-is-not-updated-is-different-from-the-sentence-field)
    on how to fix it.

* To create cards with mpvacious, first add a card from Yomichan (usually via a texthooker),
    and then press `ctrl`+`m` in mpv.


