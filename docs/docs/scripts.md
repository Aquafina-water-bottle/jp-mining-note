
This page serves as a collection of small Anki-related scripts primarily for the usage
automating repetitive tasks with hotkeys.

It is separated into two main sections:

- ShareX Hotkeys: Hotkeys meant to be specifically used with media files generated from [ShareX](https://getsharex.com/).
- Anki Hotkeys: General purpose hotkeys that act on the most recent card(s). Does not require media files to operate.

TODO demo


!!! note
    The ShareX hotkeys are originally based off of
    [Stegatxins0's Mining Setup](https://github.com/Aquafina-water-bottle/stegatxins0-mining/).
    That was itself originally based off of
    [AnimeCard's ShareX Setup](https://animecards.site/media/#setting-up-sharex).

---

# ShareX Hotkeys

Windows users can use [ShareX](https://getsharex.com/) as a general purpose tool
to automatically add images and audio to your most recently created card.
There are two main hotkeys that this setup introduces:

- A screenshot hotkey
- An audio hotkey

!!! note
    If you are using Linux, I recommend using [ames](https://github.com/eshrh/ames) instead of ShareX.
    Unfortunately, I'm not aware of a good solution for macOS users.


## Feature Summary

- Audio is automatically normalized, and attempts to remove silence at the beginning of the audio.
- Images are saved as webp, to save disk space.
- The screenshot hotkey automatically adds the Window name as a tag to the card.
- Work with any note type, given that the correct flags are provided.
    By default, these work with jp-mining-note and AnimeCards.
- Instead of using PowerShell, this setup uses Python. Unfortunately, this is a little bit more
    difficult to setup for the average user, but using Python makes it much easier to
    develop and maintain the underlying scripts. Most people, including myself,
    know Python much more than PowerShell.
    Additionally, Python is generally cross platform and easy enough to setup on all operating systems.


## ShareX Hotkeys Prerequisites

To use these hotkeys with ShareX, you must have the following installed:

- [ShareX](https://getsharex.com/)
- [Python](https://www.python.org/) (Python 3.10 or above should work)
- [Anki-Connect](https://ankiweb.net/shared/info/2055492159) (You probably have this installed already if you're using Yomichan or jp-mining-note).
- `hotkey.py` (see below)

The `hotkey.py` file can be downloaded in any of the following ways:

??? info "Option 1: JPMN Manager {{CLICKHERE}}"
    If you have [JPMN Manager](https://ankiweb.net/shared/info/{{ JPMN_MGR_CODE }}) installed,
    then this script is already available to you!
    It is located under the [Anki folder](faq.md#where-is-the-x-folder-in-anki):
    ```
    Anki2/addons21/{{JPMN_MGR_CODE}}/tools/hotkey.py
    ```

??? info "Option 2: With `git` {{CLICKHERE}}"
    For `git` users, simply clone the JPMN repository in somewhere you'll remember:
    ```
    git clone https://github.com/Aquafina-water-bottle/jp-mining-note.git
    ```
    The hotkey.py file will be found under `(repo root)/tools/hotkey.py`.
    <!-- extra paragraph required due to mkdocs-video for some reason -->
    <p></p>

??? info "Option 3: Manually {{CLICKHERE}}"
    If none of the above works / you don't know what `git` is:

    - Navigate to a folder you'll remember.
    - Right click on some blank space, and then create a new text file (`New` -> `Text Document`). Name this text file `hotkey.py`.
    - [Copy the script text](https://raw.githubusercontent.com/Aquafina-water-bottle/jp-mining-note/dev/tools/hotkey.py) into the new text file, and save (`Ctrl+S`).
    TODO gif!



## ShareX Screenshot Hotkey

1. **Create the hotkey**:
    - Open ShareX, if you haven't already.
    - On the sidebar to the left, click on `Hotkey settings...`.
        (TODO image)
    - Within the Hotkey Settings window, click `Add`.
        (TODO image)
    - Set the task to be `Screen capture` -> `Capture region`.
    - Set the hotkey value to whatever you want. For example, `F6`.

    (TODO gif)

1. **Change the hotkey settings**:

    1. Click on the gear of your new `Capture Region` hotkey.
        (TODO image)

    1. Navigate to the `Task` tab.
        - Check `Override after capture settings` ({{ CHECKED_CHECKBOX }})
        - Navigate to the capture tasks dropdown, and only have the following two items selected:
            - Save image to file
            - Perform actions
            (TODO image)
        - Check `Override screenshots folder` ({{ CHECKED_CHECKBOX }})
        - Click `Browse` and select your Anki collection media location.
            Your media location can be found under:
            ```
            C:\Users\YOUR_USER_NAME\AppData\Roaming\Anki2\YOUR_ANKI_PROFILE_NAME\collection.media
            ```
            Tip: An easy way to navigate to this is by entering `%APPDATA%` in the path of the file browser.
        - To make it easier for you to remember what this hotkey does,
            set the `Description` to `anki-screenshot`.
        Your `Task` tab should now look something like this:
        (TODO image)

    1. Navigate to the `General` tab.
        - Check `Override general settings` ({{ CHECKED_CHECKBOX }})
        (TODO image)

    1. Navigate to the `General` -> `Notifications` tab.
        - Uncheck `Play sound after capture is made` ({{ UNCHECKED_CHECKBOX }})
        - Uncheck `Play sound after task is completed` ({{ UNCHECKED_CHECKBOX }})
        The sound on screenshot is removed so one can take a screenshot while recording the audio,
        without having the screenshot sound affect the recording.
        (TODO image)

1. **Add the `ffmpeg-to-webp` action**:

    > **Explanation:**
    > This action saves the image as a webp image, to reduce file space while retaining the same quality.
    > Unfortunately, as of writing this,
    > [ShareX does not support webp natively](https://github.com/ShareX/ShareX/issues/6090),
    > so this action must be explicitly defined to save the image as a webp.

    - Navigate to the `Actions` tab.
    - Check `Override actions` ({{ CHECKED_CHECKBOX }})
    - Click `Add...`.
    - A new window should pop up. Under this new window, fill out the following values:

        ??? example "ffmpeg-to-webp action {{CLICKHERE}}"

            - **Name**: `ffmpeg-to-webp`
            - **File path**:
                ```
                C:\Program Files\ShareX\ffmpeg.exe
                ```
            - **Argument**:
                ```
                -i "$input" -quality 95 "$output"
                ```
            - **Output file name extension**:
                ```
                webp
                ```
            - Check `Hidden window` ({{ CHECKED_CHECKBOX }})
            - Check `Delete input file` ({{ CHECKED_CHECKBOX }})

            (TODO image)

1. **Add the `card-add-image` action**:

    > **Explanation:**
    > This adds the image to the Anki card itself, using Anki-Connect and Python.

    - Under the `Actions` tab, click `Add...`.
    - A new window should pop up. Under this new window, fill out the following values:

        ??? example "card-add-image action {{CLICKHERE}}"

            - **Name**: `card-add-image`
            - **File path**: (change the path to your exact path to `python.exe`)
                ```
                C:\PATH\TO\YOUR\PYTHON\EXECUTABLE\python.exe
                ```
                - Your `python.exe` file is usually under `C:\PythonXX\python.exe`,
                    where `XX` is the version number.
                    If you can't find it, you can always search for `python.exe` on the search bar,
                    and then [copying the full path](https://www.howtogeek.com/670447/how-to-copy-the-full-path-of-a-file-on-windows-10/) of the file.
            - **Argument**: (change the path to your exact path to `hotkey.py`)
                ```
                C:\PATH\TO\YOUR\HOTKEY\FILE\hotkey.py set_picture "$input"
                ```
                - This is the `hotkey.py` file from the [prerequisites](#prerequisites) step.
            - Check `Hidden window` ({{ CHECKED_CHECKBOX }})

            (TODO image)

    !!! note "Picture field"
        The expected name of the picture field is exactly `Picture`.
        If your card uses a different field name, say `Image`, then the `--field-name` flag must be used
        (change `Image` to whatever your field name is):
        ```
        C:\PATH\TO\YOUR\HOTKEY\FILE\hotkey.py set_picture "$input" --field-name Image
        ```

        TODO gif

1. **Test the hotkey**:
    TODO


## ShareX Screenshot Hotkey (NSFW)
For people using jp-mining-note or using
[Marv's Anki Card Blur](https://github.com/MarvNC/JP-Resources#anki-card-blur),
you might want to setup a different hotkey to specifically tag the card as NSFW when adding the image.

The following hotkey does the same as the above, while also adding the `-NSFW` tag to the card.

1. Duplicate the screenshot hotkey above, and set the hotkey to something else (i.e. Shift+F6)
1. Navigate to the `Actions` tab.
    - Select `card-add-image` action.
    - Change the `Argument` to the following:
        ```
        C:\PATH\TO\YOUR\HOTKEY\FILE\hotkey.py set_picture "$input" --nsfw True
        ```

TODO gif



## ShareX Audio Hotkey

1. **Create the hotkey**:
    - Open ShareX, if you haven't already.
    - On the sidebar to the left, click on `Hotkey settings...`.
        (TODO image)
    - Within the Hotkey Settings window, click `Add`.
    - Set the task to be `Screen record` -> `Start/Stop screen recording using pre configured region`.
    - Set the hotkey value to whatever you want. For example, `F7`.

    (TODO gif)

1. **Change the hotkey settings**:

    1. Click on the gear of your new `Start/Stop screen recording ...` hotkey.
        (TODO image)

    1. Navigate to the `Task` tab.
        - Check `Override after capture settings` ({{ CHECKED_CHECKBOX }})
        - Navigate to the capture tasks dropdown, and only have the following two items selected:
            - Save image to file
            - Perform actions
        - Check `Override screenshots folder` ({{ CHECKED_CHECKBOX }})
        - Click `Browse` and select your Anki collection media location.
            Your media location can be found under:
            ```
            C:\Users\YOUR_USER_NAME\AppData\Roaming\Anki2\YOUR_ANKI_PROFILE_NAME\collection.media
            ```
            This should be the exact same folder as the `anki-screenshot` hotkey.
        - To make it easier for you to remember what this hotkey does,
            set the `Description` to `anki-audio`.

        Your `Task` tab should now look something like this:
        (TODO image)

    1. Navigate to the `Capture` tab.
        - Check `Override capture settings` ({{ CHECKED_CHECKBOX }})
        - Click `Select region`, and select anywhere on the screen.
            This region would preferably not overlap with whatever you want to capture.
            If it does and you attempt to screenshot while using the audio hotkey,
            then the dotted region marked by ShareX will be captured as well.
        (TODO image)

    1. Navigate to the `Capture` -> `Screen recorder` tab. Within this, tab, click on the `Screen recording options...` button to open a new window.
        - Press the `Install recorder devices` button
        - Set `Video source` to `None`
        - Set `Audio source` to `virtual-audio-capturer`
        - Set `Audio codec` to `Opus` (This will be configurable later)
        - Click on the `Opus` tab right underneath `Audio codec`, and ensure the quality is set to `128k`.
        - Close this new window.

1. **Add the process audio action(s)**:

    > **Explanation:**
    > This adds a ffmpeg call to normalize the audio and remove the beginning silence.
    > Ideally, we would put these audio filters in the `Screen recording options` custom commands box.
    > Unfortunately, if placed there, the flags to normalize the audio ends up cutting off the audio.
    > Therefore, this action is required to accurately run the desired audio filters.

    You have two options:

    1. **Store as Opus.**
        The [Opus](https://opus-codec.org/) audio codec provides much better quality at lower bitrates
        (which saves a lot of space and makes syncing large collections faster).
        **However, Opus is NOT compatible with AnkiMobile (iOS), Android 4, and AnkiWeb.**
        If you use any of these, please use the 2nd option (MP3 audio) below.
    2. **Store as MP3.**
        Older and less efficient codec, but needed for compatibility with pretty much all devices.

    ??? info "Option 1. Opus {{CLICKHERE}}"
        > **Explanation:**
        > ShareX does not natively support storing audio as .wav or .flac files.
        > ShareX does not provide a simply way to copy a file.
        > FFmpeg does not allow us to read and write to the exact same file.
        > Finally, ShareX cannot run the audio filters in the `Screen recording options` custom commands box,
        > as mentioned above.
        > With all these limitations, the only way to store it as opus while running the audio filters is
        > to first convert the file to something else (we use .wav), and then
        > re-convert it back to opus again while applying the audio filters.

        - Navigate to the `Actions` tab.
        - Check `Override actions` ({{ CHECKED_CHECKBOX }})
        - Create the first action, by clicking `Add...`.
            A new window should pop up. Under this new window, fill out the following values:

            ??? example "ffmpeg-process-audio-wav action {{CLICKHERE}}"
                - **Name**: `ffmpeg-process-audio-wav`
                - **File path**:
                    ```
                    C:\Program Files\ShareX\ffmpeg.exe
                    ```
                - **Argument**:
                    ```
                    -y -i "$input" "$output"
                    ```
                - **Output file name extension**:
                    ```
                    wav
                    ```
                - Check `Hidden window` ({{ CHECKED_CHECKBOX }})
                - Check `Delete input file` ({{ CHECKED_CHECKBOX }})

                (TODO image)

        - Close the above `ffmpeg-process-audio-wav` action window.
        - Create the second action, by clicking `Add...`.
            A new window should pop up. Under this new window, fill out the following values:

            ??? example "ffmpeg-process-audio-opus action {{CLICKHERE}}"
                - **Name**: `ffmpeg-process-audio-opus`
                - **File path**:
                    ```
                    C:\Program Files\ShareX\ffmpeg.exe
                    ```
                - **Argument**:
                    ```
                    -y -c:a opus -i "$input" -af "silenceremove=1:0:-50dB, loudnorm=I=-16:TP=-6.2:LRA=11:dual_mono=true" -b:a 64k "$output"
                    ```
                - **Output file name extension**:
                    ```
                    opus
                    ```
                - Check `Hidden window` ({{ CHECKED_CHECKBOX }})
                - Check `Delete input file` ({{ CHECKED_CHECKBOX }})

                (TODO image)


    ??? info "Option 2. MP3 {{CLICKHERE}}"

        - Navigate to the `Actions` tab.
        - Check `Override actions` ({{ CHECKED_CHECKBOX }})
        - Click `Add...`.
        - A new window should pop up. Under this new window, fill out the following values:

            ??? example "ffmpeg-process-audio-mp3 action {{CLICKHERE}}"
                - **Name**: `ffmpeg-process-audio-mp3`
                - **File path**:
                    ```
                    C:\Program Files\ShareX\ffmpeg.exe
                    ```
                - **Argument**:
                    ```
                    -y -i "$input" -af "silenceremove=1:0:-50dB, loudnorm=I=-16:TP=-6.2:LRA=11:dual_mono=true" -q:a 3 "$output"
                    ```
                - **Output file name extension**:
                    ```
                    mp3
                    ```
                - Check `Hidden window` ({{ CHECKED_CHECKBOX }})
                - Check `Delete input file` ({{ CHECKED_CHECKBOX }})

                (TODO image)

1. **Add the `card-add-audio` action**:

    This adds the image to the Anki card itself.

    - Under the `Actions` tab, click `Add...`.
    - A new window should pop up. Under this new window, fill out the following values:

        ??? example "card-add-audio action {{CLICKHERE}}"

            - **Name**: `card-add-audio`
            - **File path**: (change the path to your exact path to `python.exe`)
                ```
                C:\PATH\TO\YOUR\PYTHON\EXECUTABLE\python.exe
                ```
            - **Argument**: (change the path to your exact path to `hotkey.py`)
                ```
                C:\PATH\TO\YOUR\HOTKEY\FILE\hotkey.py set_audio "$input"
                ```
                - These paths should be the exact same as the `card-add-audio` action
                    within the `anki-screenshot` hotkey.
            - Check `Hidden window` ({{ CHECKED_CHECKBOX }})

            (TODO image)

    !!! note "Sentence Audio field"
        The expected name of the sentence audio field is exactly `SentenceAudio`.
        If your card uses a different field name, say `SentAudio`, then the `--field-name` flag must be used
        (change `SentAudio` to whatever your field name is):
        ```
        "$input" set_audio --field-name SentAudio
        ```

        TODO gif


## Troubleshooting
-   Do NOT view the card in the card browser when running any script,
    because if you do, the affected fields may not update.
    Close the card browser before running the scripts.

    However, you do not need to worry about this
    if you are running the python script with the `--enable-gui-browse` flag.



---

# Other Hotkeys

These are a set of scripts that may help you to prevent doing repetitive actions when
adding notes.

Unlike the above, these scripts are not meant to be used with audio or picture files.
Rather, they are stand-alone scripts that modify the most recent cards added.

These scripts are written in two formats:
one that works automatically with your usual `ShareX` setup,
and one in Python for cross-platform portability.

---


## How-To: Running with ShareX

As shown above, ShareX has the ability to run custom user scripts.
However, for ShareX to only run the script and do nothing else,
the hotkey must be configured with steps shown below.

<!--

!!! warning

    Depending on the popularity of these scripts, the ShareX versions may be deprecated
    in the future in favor of the easier to use/write/maintain Python versions.
    The only downside of using the Python script is that the user must have Python installed.

-->


### Steps

(TODO video)

1. Under the main window, go to `Hotkey Settings`, and add a new hotkey.
2. Click on the settings icon (of the newly added hotkey).
3. In the `Task` tab (to the left):
    - Set: `Task` to `Screen capture` →  `Capture active window`
    - Check `Override After Capture Tasks` ({{ CHECKED_CHECKBOX }})
    - Under `After Capture`, un-check everything, and check the following:
        - `Save Image to File`
        - `Perform Actions`
        - `Delete Locally`
4. In the `Actions` tab (to the left):
    - Check `Override Actions` ({{ CHECKED_CHECKBOX }})
    - Uncheck all existing actions.
    - Add a new action by clicking on `Add`.
    - Set the following values of the action:
        - File Path: `C:\PATH\TO\python.exe`
        - Argument: `C:\PATH\TO\YOUR\HOTKEY\FILE\hotkey.py FUNCTION_NAME`


!!! note
    If you are adding multiple scripts with ShareX, instead of re-doing all of the
    steps above, you can instead duplicate the keybind,
    and simply set the `Argument` of the action to a different function name.


??? info "Explanation of the setup {{CLICKHERE}}"

    The reason that the `After Capture` settings include `Save Image to File`
    and `Delete Locally` is because without those settings, the `Perform Actions`
    section doesn't appear to run.
    Fortunately, the combination of `Save Image to File`
    and `Delete Locally` means the hotkey does the following:

    - Saves the image file
    - Runs the custom script
    - Deletes the image file

    In other words, the image file is only temporarily created,
    and then deleted immediately after running the script.
    This effectively means that ShareX is only running the script
    whenever the keybind is used.

---



## How-To: Running with Command Line

If you don't want to use ShareX, or you are not using Windows,
you can simply run a python script with command line.

```bash
# Your python version should be 3.9 or higher.
# It may work for lower python versions, but I make no guarantee.
python3 /path/to/jp-mining-note/tools/hotkey.py FUNCTION_NAME
```

??? example "Examples <small>(click here)</small>"

    ```bash
    # default
    python3 /path/to/jp-mining-note/tools/hotkey.py update_sentence

    # opens card browser automatically
    python3 /path/to/jp-mining-note/tools/hotkey.py update_sentence --enable-gui-browse
    ```

If you want to use these as keybinds, I will leave it up to you to determine
how to do that (as there are too many different setups and programs that people can use to create keybinds).
However, some tips for ShareX and AutoKey are given below.


## How-To: Running with AutoKey <small>(Not AutoHotKey)</small> { #how-to-running-with-autokey data-toc-label="How-To: Running with AutoKey" }
If you are using [AutoKey](https://github.com/autokey/autokey) for Linux, it should be possible to do the following instead:

1. Go to: <br>
    `Settings` <br>
    →  `Configure AutoKey` <br>
    →  `Script Engine` <br>
    →  `User Module file` <br>
    →  (add the `jp-mining-note/tools` directory)

2. Create a `script` type hotkey,

3. Within the script, run any function thusly:
    ```py
    import hotkey
    hotkey.FUNCTION_NAME()
    ```

    Example:
    ```py
    import hotkey
    hotkey.update_sentence()
    ```

    Example with GUI:
    ```py
    import hotkey
    hotkey._browse_anki("nid:1")
    note_id = hotkey.update_sentence()
    hotkey._browse_anki(f"nid:{note_id}")
    ```

---



<!-- shift + f3 -->
## Update Sentence with Clipboard { .text-yellow }
> *Function Name*: `update_sentence`

This script updates the sentence with the current clipboard (while preserving the bolded word),
and removes the `SentenceReading` field (of the newest note added).

This script is useful when Yomichan's parsed sentence does not match the recorded audio.
This is also useful for when Yomichan's word parser doesn't match the word itself (steps shown below).

!!! note
    After running this script, you must manually generate the `SentenceReading` field
    if you want the furigana reading.
    Of course, this can be done in bulk at any point,
    as shown [here](faq.md#how-do-i-bulk-generate-furigana).

??? info "How-To: Fix incorrectly-bolded words <small>(click here)</small>"

    As an example, The target word 希望 in the sentence 「入部希望なんですけど…」
    will be parsed by Yomichan as the following:
    ```
    入部<b>希望な</b>んですけど…
    ```

    Within the original popup, you can add two versions of the word by default:

    1. The one with JMdict only.
        Adding this word will add the sentence with incorrect bolding.
    2. The one with everything else other than JMdict.
        Adding this word will have the correct bold, but will be missing some definitions.

    To add the above sentence that solves both problems (no weird bold, and contains all definitions),
    do NOT add the word within the sentence.
    Instead, do the following:

    1. Highlight over the header word itself (or the word in the orthographic forms dictionary),
        and add that word instead.

        ??? example "Demo <small>(click here)</small>"
            {{ img("Add the definition from the popup dictionary", "assets/jpresources/incorrect_bold.png") }}

    2. Copy the desired sentence.

    3. Run this script.

    !!! note
        It is assumed that you have
        [multiple popups enabled](https://learnjapanese.moe/monolingual/#optimizing-yomichan-settings).


??? info "How the bolded word is preserved <small>(click here)</small>"

    The bolded word is preserved if the exact content within the bolded word is found within the clipboard,
    which should be almost always the case.

    For example, assume the added sentence is the following:
    ```html
    さては<b>偽者</b>だな！
    ```

    As long as the clipboard contains the word 「偽者」, then the bold is preserved.
    For example, the following clipboard contents will preserve the bold:
    ```
    かわいげのある女じゃない。さては偽者だな！
    ```
TODO `sharex_display(sharex.update_sentence)`

---


## Update AdditionalNotes with Clipboard { .text-yellow }
> *Function Name*: `update_additional_notes`

This script does the exact same thing as the above script, but with
`AdditionalNotes` instead of `Sentence`.
The tested word, if found, is also automatically highlighted.

This is useful to copy/paste context for the sentence (the surrounding lines
around the sentence).

TODO `sharex_display(sharex.update_additional_notes)`


---



<!-- ctrl + f3 -->
## Copy from Previous Card { .text-yellow }
> *Function Name*: `copy_from_previous`

This script does the following:

- Set the `AdditionalNotes` and `Picture` field of the newest card to the previous (second-newest) card's fields.
- Copies all the tags of the previous card.

This is useful for when you are adding more than one sentence with the same text box
of a visual novel, as it prevents you from having to run the screenshot hotkey.

### How to use
1. Create a card from the first unknown word in the text box.
1. Create a card from the second unknown word in the text box.
1. Run this script.

TODO `sharex_display(sharex.copy_from_previous)`

---



<!-- ctrl + shift + f3 -->
## Orthographic Variants: Fix Sentence and Frequency { .text-yellow }
> *Function Name*: `fix_sent_and_freq`

This script does the following:

- Sets the previous note's fields to the newest note's fields:
    - `FrequencyStylized`
    - `Sentence`
    - `SentenceReading`
- Deletes the newest note

This is useful for when you want to add the the word within the
[Orthographic Variants](https://github.com/FooSoft/yomichan/issues/2183) dictionary.
The Orthographics Variants dictionary is extremely useful for monolingual definitions,
where dictionaries only contain entries for more kanjified words.

In practice, I've personally found numerous examples of this in everyday media,
so this has helped me immensely.

??? example "Examples (to test the dictionary on)"

    「スペルド族への恐怖は恐らくこの世界に<b class="jpmn-highlight">根づいている</b>んだろう」
    { .jp-quote-text }

    「ルーはたくさんあるので、今<b class="jpmn-highlight">お代わり</b>をお持ちしますね」
    { .jp-quote-text }

    「ただ、一つだけ<b class="jpmn-highlight">釘をささせて</b>もらうけど…貴方がこれから何をするにしても、仕事は今まで通りこなしてもらうわよ？」
    { .jp-quote-text }

    It is assumed that you have
    [multiple popups enabled](https://learnjapanese.moe/monolingual/#optimizing-yomichan-settings)
    for monolingual definitions, so you can easily look up the word in the
    Orthographic Forms dictionary.

### How to use
1. Create a card from the word in the Orthographic Variants dictionary.
1. Create a card from the word in original sentence.
1. Run this script.



---


# Deprecated Scripts

These contain powershell code for some scripts above.
This powershell code has been replaced with Python scripts for easier maintainability

{% import "sharex_input.ps1" as sharex %}
{% from "macros.html" import sharex_display with context %}

??? info "Screenshot and Clipboard Hotkey"

    Follow the steps for setting up the
    [screenshot hotkey](https://rentry.co/mining#hotkey-for-screenshot),
    and use this script in place of step 8's `argument`.

    {{ sharex_display(sharex.screenshot_and_clipboard) | indent(4) }}

??? info "Screenshot (only) Hotkey"

    This is the same as the above, but without setting the `AdditionalNotes` field to the current clipboard.

    {{ sharex_display(sharex.screenshot) | indent(4) }}

??? info "Audio Hotkey"

    This script works *exactly the same* as stegatxins0's version,
    except rewritten in a more readable format.
    If you already have the audio hotkey setup, there is no reason to change the old script.

    To use this, follow the steps for setting up the
    [audio hotkey](https://rentry.co/mining#hotkey-for-audio),
    and use this script in place of step 14's `Argument`.

    {{ sharex_display(sharex.audio) | indent(4) }}

??? info "Update Sentence with Clipboard"
    {{ sharex_display(sharex.update_sentence) | indent(4) }}

??? info "Update AdditionalNotes with Clipboard"
    {{ sharex_display(sharex.update_additional_notes) | indent(4) }}

??? info "Copy from Previous Card"
    {{ sharex_display(sharex.copy_from_previous) | indent(4) }}

??? info "Orthographic Variants: Fix Sentence and Frequency"
    {{ sharex_display(sharex.fix_sent_and_freq) | indent(4) }}

