
[**mpvacious**](https://github.com/Ajatt-Tools/mpvacious)
is a user script made for of [mpv](https://mpv.io/), a cross platform media player.
mpv itself can be used on pretty much anything, including streamed videos.
However, `mpvacious` was made for downloaded videos,
and almost certainly does not worked on streamed videos.

If you are looking to create cards using streamed videos, I recommend [asbplayer](setupasbplayer.md).

---

# Installation

Installation steps for mpvacious can be found
[here](https://github.com/Ajatt-Tools/mpvacious#installation).

You must install this under your
[mpv scripts folder](https://github.com/mpv-player/mpv/wiki/User-Scripts).
This `scripts` folder does not exist by default; it must be created manually.

<!--
For some reason, the standard tree format doesn't show up properly on browsers?
The dash is shown as two characters instead of one...
-->

??? example "Expected file structure {{CLICKHERE}}"

    === "Windows"
        ```
        C:/Users/Username/AppData/Roaming
        └─ mpv
            └─ scripts
                └─ mpvacious
                    ├─ ankiconnect.lua
                    ├─ main.lua
                    ├─ subs2srs.lua
                    └─ ...
        ```
    === "macOS and Linux"
        ```
        ~/.config
        └─ mpv
            └─ scripts
                └─ mpvacious
                    ├─ ankiconnect.lua
                    ├─ main.lua
                    ├─ subs2srs.lua
                    └─ ...
        ```

---

# Configuration

You will have to change [mpvacious's configuration](https://github.com/Ajatt-Tools/mpvacious#configuration)
in order for mpvacious to work with JPMN.

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

        ??? example "Example config file {{CLICKHERE}}"
            ```ini
            {{ MPVACIOUS_CONF | indent(12) }}
            ```

        Ensure that your file is indeed a .conf file when saved.
        If your file browser says that it is a text file, then
        the file was likely incorrectly saved as `subs2srs.conf.txt`.
        TODO exact instructions on renaming

    ??? example "Expected file structure {{CLICKHERE}}"
        ```
        C:/Users/Username/AppData/Roaming
        └─ mpv
            └─ script-opts
                └─ subs2srs.conf
        ```



=== "Mac / Linux (Terminal)"
    The following installs the correct configuration,
    along with all the recommended settings stated below.

    ```bash
    mkdir -p ~/.config/mpv/script-opts
    # TODO change this to the master branch eventually
    curl https://raw.githubusercontent.com/Aquafina-water-bottle/jp-mining-note/dev/docs/docs/assets/setupmpvacious/subs2srs.conf > ~/.config/mpv/script-opts/subs2srs.conf
    ```

Be sure to restart mpv after changing the config to make sure your configuration is applied.


The example configuration includes plenty of commonly changed settings by default.
In general, I recommend looking through the
[example configuration](https://github.com/Ajatt-Tools/mpvacious/blob/master/.github/RELEASE/subs2srs.conf)
to see if there are other options that you may want to change.

---

# Card Creation

To create JPMN cards with mpvacious:

- Create a card from Yomichan.
    The text is usually gotten via a
    [texthooker](setuptextmedia.md#getting-the-text-to-create-the-cards).
- Within mpv, navigate to the desired subtitle, and then press ++ctrl+m++.
    - If you instead want to add audio from multiple subtitles at a time:
        - Navigate to the beginning subtitle.
        - Press ++a+c++
        - Navigate to the ending subtitle.
        - Press ++m++.
- Much more can be found under [mpvacious's usage section](https://github.com/Ajatt-Tools/mpvacious#usage).

---


# Other

* A common issue with mpvacious is that
    the `SentenceReading` field may differ from the `Sentence` field,
    say, if you export multiple subtitles into one card.
    See the
    [FAQ](faq.md#the-sentencereading-field-is-not-updated-is-different-from-the-sentence-field)
    on how to fix it.

* You have to export the audio as `mp3` if you plan on using AnkiMobile (iOS), or AnkiWeb.


