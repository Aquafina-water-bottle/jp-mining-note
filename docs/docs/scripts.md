{% import "sharex_input.ps1" as sharex %}
{% from "macros.html" import sharex_display with context %}



# ShareX Scripts
Many people have already documented how to setup your ShareX to work with Anki, such as:

* [stegatxins0](https://rentry.co/mining#sharex) (recommended)
* [Anime Cards](https://animecards.site/media/#setting-up-sharex)

Instead of re-telling the steps they have already showed,
I present **alternative ShareX scripts**
(the long one-liner to paste within the `Actions` argument section)
for stegatxins0's guide.

The following scripts have the following changes:

- They all work with jp-mining-note by default.
- They have been rewritten so it can be presented in human-readable format
    right below the one-liner.
- The one-liners can be re-compiled from the source code at your own discretion
    (by [building the documentation](/building.md#building-the-documentation)).
    All the powershell source code can be found
    [here](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/docs/docs/sharex_input.ps1).


---


## Screenshot and Clipboard Hotkey { .text-yellow }


### Features

- Adds the selected image to the note. This image is automatically shrunk
    (within the field viewer only, if you are using Anki versions 2.1.50+).
- Adds a tag to the note. The tag is exactly the window name of the current application.
- Sets the `AdditionalNotes` to the current clipboard. I use this for copying/pasting context
    (the lines surrounding the sentence).

### How-To

Follow the steps for setting up the
[screenshot hotkey](https://rentry.co/mining#hotkey-for-screenshot),
and use this script in place of step 8's `argument`.


{{ sharex_display(sharex.screenshot_and_clipboard) }}

---



## Screenshot (only) Hotkey { .text-yellow }

This is the same as the above, but without setting the `AdditionalNotes` field to the current clipboard.

{{ sharex_display(sharex.screenshot) }}

---



## Audio Hotkey { .text-yellow }

This script works *exactly the same* as stegatxins0's version,
except rewritten in a more readable format.
If you already have the audio hotkey setup, there is no reason to change the old script.

To use this, follow the steps for setting up the
[audio hotkey](https://rentry.co/mining#hotkey-for-audio),
and use this script in place of step 14's `Argument`.

{{ sharex_display(sharex.audio) }}

---




# Anki Scripts

These are a set of scripts that may help you to prevent doing repetitive actions when
adding notes.

Unlike the above, these scripts are not meant to be used with audio or picture files.
Rather, they are stand-alone scripts that modify the most recent cards added.

These scripts are written in two formats:
one that works automatically with your usual `ShareX` setup,
and one in Python for cross-platform portability.

!!! warning

    Do NOT view the card in the card browser when running any script,
    because if you do, the affected fields may not update.
    Close the card browser before running the scripts.

    However, you do not need to worry about this
    if you are running the python script with the `--enable-gui-browse` flag.


---


## How-To: Running with ShareX

As shown above, ShareX has the ability to run custom user scripts.
However, for ShareX to only run the script and do nothing else,
the hotkey must be configured with steps shown below.

!!! warning

    Depending on the popularity of these scripts, the ShareX versions may be deprecated
    in the future in favor of the easier to use/write/maintain Python versions.
    The only downside of using the Python script is that the user must have Python installed.


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
        - File Path: `C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe`
        - Argument: (the text in `Sharex Script` for the script you want to run)


!!! note
    If you are adding multiple scripts with ShareX, instead of re-doing all of the
    steps above, you can instead duplicate the keybind,
    and simply set the `Argument` of the action to a different script.


??? info "Explanation"

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



## How-To: Running with Python


!!! warning
    If you use the Python script as is within the repository without copying it to
    a different directory, this script will be updated every time you update the repository.

    It's always good practice to not blindly run people's code on your computer.
    Make sure you [trust the code](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/tools/hotkey.py), and double check after update!


If you don't want to use ShareX, or you are not using Windows,
you can simply run a python script with command line.

```bash
# Your python version should be 3.8 or higher.
# It may work for lower python versions, but I make no guarantee.
python3 /path/to/jp-mining-note/tools/hotkey.py -f FUNCTION_NAME
```

??? example "Examples <small>(click here)</small>"

    ```bash
    # default
    python3 /path/to/jp-mining-note/tools/hotkey.py -f update_sentence

    # opens card browser automatically
    python3 /path/to/jp-mining-note/tools/hotkey.py -f update_sentence --enable-gui-browse
    ```

If you want to use these as keybinds, I will leave it up to you to determine
how to do that (as there are too many different setups and programs that people can use to create keybinds).
However, some tips for ShareX and AutoKey are given below.


??? info "Instructions for running Python scripts in ShareX"

    If you want, you can even use the Python scripts with ShareX, so long as you have Python installed.
    To use Python with ShareX, follow all the steps
    (shown [above](jpresources.md#how-to-running-with-sharex)),
    until you set the action values.

    - The command should be the `DRIVE:\PATH\TO\python.exe` (instead of the path to `powershell.exe`).
    - The argument should be `DRIVE:\PATH\TO\jp-mining-note\tools\hotkey.py -f FUNCTION_NAME`
        (instead of the large one-liner.)

??? info "Instructions for AutoKey (Not AutoHotKey)"

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
{{ sharex_display(sharex.update_sentence) }}

---


## Update AdditionalNotes with Clipboard { .text-yellow }
> *Function Name*: `update_additional_notes`

This script does the exact same thing as the above script, but with
`AdditionalNotes` instead of `Sentence`.
The tested word, if found, is also automatically highlighted.

This is useful to copy/paste context for the sentence (the surrounding lines
around the sentence).

{{ sharex_display(sharex.update_additional_notes) }}


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

{{ sharex_display(sharex.copy_from_previous) }}

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


{{ sharex_display(sharex.fix_sent_and_freq) }}



