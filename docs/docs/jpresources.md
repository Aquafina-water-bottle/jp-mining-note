{% import "sharex_input.ps1" as sharex %}
{% from "macros.html" import sharex_display with context %}


A collection of tips and tricks, primarily related to CSS, Yomichan templates, and ShareX.

This page was inspired by [Marv's resources page](https://github.com/MarvNC/JP-Resources),
which has a bunch of different but equally awesome resources.
I highly recommend checking it out!


If you encounter any problems, have any questions, etc., feel free to contact
me on discord `Aquafina water bottle#3026`,
or [submit an issue](https://github.com/Aquafina-water-bottle/jp-mining-note/issues).
I exist on the [TheMoeWay](https://learnjapanese.moe/join/) and Refold (Japanese) servers.


<!--
TODO for typos, link how to build docs


For fixing typos and making things clearer, it would especially help if you
fork [the main repository](https://github.com/Aquafina-water-bottle/jp-mining-note)
(not the dedicated wiki repository!)
and make a pull request!
(Edit the `wiki/gen/_JPResources.md`
file [here](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/wiki/gen/_JPResources.md).)

Otherwise, if you encounter any problems, feel free to contact
me on discord `Aquafina water bottle#3026`, or submit an issue.
I exist on the TheMoeWay and Refold (Japanese) servers.
-->



---

# CSS (Yomichan)

## How-To: Add Custom CSS In Yomichan

To add custom CSS in Yomichan, do the following:

1. Head over to Yomichan settings (Yomichan extension marker -> cogwheel)
1. Go to `Appearance` →  `Configure custom CSS...`
1. Add the CSS to the top section.
1. Close the window.

??? example "Demo *(click here)*"

    {{ img("how to add custom css to Yomichan", "assets/yomichan/howto_css.gif") }}


---




## Not selecting or copying furigana { .text-yellow }
If you want to select / copy the main word within Yomichan without copying the furigana,
you can use the following CSS:

```css
.headword-term ruby rt {
  user-select: none;
}
```

!!! note
    The above is actually general enough to use for Anki cards itself, say with the following CSS:
    ```css
    ruby rt {
      user-select: none;
    }
    ```

---


## Limiting the number of frequency lists { .text-yellow }

```css
/* Only shows the first 2 frequency lists */
span.frequency-group-item:nth-child(n+3) {
  display: none;
}
```
<sup>(Thanks Marv#5144 for the CSS)</sup>
<!-- http://discordapp.com/channels/617136488840429598/778430038159655012/1012950954770960464 -->

??? example "Demo *(click here)*"

    {{ img("limit frequencies demo", "assets/yomichan/limit_frequencies.gif") }}

---



## Limiting the number of pitch accent dictionaries { .text-yellow }


The following CSS displays only the first 2 pitch accent dictionaries:
```css
/* Only shows the first 2 pitch accent dictionaries */
li.pronunciation-group:nth-child(n+3) {
  display: none;
}
```

Make the pitch accent dictionary text a bit grey by default,
and to make specifically the "NHK" and "大辞泉" white (change these two
to any dictionary you find to be of higher quality)
```css
/* Greys out all pitch accent dictionary names */
/* Sets NHK and 大辞泉 pitch accent dictionaries to a white name */
.tag[data-category="pronunciation-dictionary"] {
  --tag-text-color: #c8bfdb;
}
.tag[data-details="大辞泉"], .tag[data-details="NHK"] {
  --tag-text-color: #FFFFFF;
}
```

??? example "Demo *(click here)*"

    {{ img("limit pitch accent dictionaries demo", "assets/yomichan/limit_pitch_accents.gif") }}


---



## Hide the dictionary, but allow it to be used by Anki { .text-yellow }

The default way to hide a dictionary is by disabling the dictionary
under Yomichan's `Dictionaries` section.
However, if you disable the dictionary, you cannot export it into Anki,
which is a problem if you are using a bilingual profile but you want to export
monolingual definitions.

**Steps**:

1. Ensure that the dictionary is enabled in your Yomichan profile.
1. Add the following CSS for the desired dictionaries (this has to be done for each individual dictionary):

```css
li.definition-item[data-dictionary='DICTIONARY'] {
  display: none;
}
```

??? examplecode "Example CSS for JMdict *(click here)*"

    ```css
    li.definition-item[data-dictionary='JMdict (English)'] {
      display: none;
    }
    ```

??? example "Demo *(click here)*"

    {{ img("hide dictionary in Yomichan", "assets/yomichan/hide_dictionary.gif") }}

---


## Hide bilingual definitions until hover { .text-yellow }

Add the following CSS for the desired dictionaries (this has to be done for each individual dictionary):
```css
li.definition-item[data-dictionary='DICTIONARY'] .gloss-list {
  opacity: 0;
}
li.definition-item[data-dictionary='DICTIONARY']:hover .gloss-list {
  opacity: 1;
}
```


??? examplecode "Example CSS for JMdict *(click here)*"
    ```css
    li.definition-item[data-dictionary='JMdict (English)'] .gloss-list {
      opacity: 0;
    }
    li.definition-item[data-dictionary='JMdict (English)']:hover .gloss-list {
      opacity: 1;
    }
    ```

??? example "Demo *(click here)*"

    {{ img("hide bilingual dictionaries until hover", "assets/yomichan/bilingual_hover.gif") }}

---



## Remove the "Add Reading" button { .text-yellow }

This removes the small green button to add the reading.

```css
button[title^="Add reading"] {
  display:none;
}
```

??? example "Demo *(click here)*"

    <figure markdown>
      {{ img("remove add reading button", "assets/yomichan/hide_add_reading.png") }}
      <figcaption>Left: without CSS. Right: with CSS.</figcaption>
    </figure>

---



# CSS (Other)

## Ensuring 「」 properly quotes the text { .text-yellow }

{{ img("left quote comparisons", "assets/other/left_quote.png", 'align=right width="300"') }}

```css
.jp-quote-text {
  text-indent: -1em;
  padding-left: 1em;
}
```

On the example to the right, the first quote is the standard display without any custom CSS.
The second quote is with the aforementioned CSS.

An example JSFiddle can be found [here](https://jsfiddle.net/Aquafina_water_bottle/5h8uxnko/14/).

---


## Changing the Japanese font on Discord { .text-yellow }

!!! note
    Discord's codebase is always subject to change, so this method
    may not work in the future.

1. Get [BetterDiscord](https://betterdiscord.app/) so you can use custom CSS.
2. In Discord Settings -> `Custom CSS` section, add the following:
    ```css
    :lang(ja), :lang(ja-JP) {
        --font-primary: Whitney,YOUR-PREFERRED-FONT,"Hiragino Sans","ヒラギノ角ゴ ProN W3","Hiragino Kaku Gothic ProN",メイリオ,Meiryo,Osaka,"MS PGothic","Helvetica Neue",Helvetica,Arial,sans-serif;
    }
    ```

??? examplecode "Example CSS for Noto Sans *(click here)*"
    ```css
    :lang(ja), :lang(ja-JP) {
        --font-primary: Whitney,"Noto Sans CJK JP","Hiragino Sans","ヒラギノ角ゴ ProN W3","Hiragino Kaku Gothic ProN","メイリオ",Meiryo,Osaka,"MS PGothic","Helvetica Neue",Helvetica,Arial,sans-serif;
    }
    ```

??? examplecode "Discord's default CSS *(click here)*"
    ```css
    :lang(ja), :lang(ja-JP) {
        --font-primary: Whitney,"Hiragino Sans","ヒラギノ角ゴ ProN W3","Hiragino Kaku Gothic ProN",メイリオ,Meiryo,Osaka,"MS PGothic","Helvetica Neue",Helvetica,Arial,sans-serif;
    }
    ```

!!! note
    If you are using the browser version of Discord, you can also change the font with the
    [Stylus extension](https://github.com/openstyles/stylus).
    I personally don't use this, so I'll leave it to the user to figure out the settings. ;)

---



# Yomichan Templates / Handlebars

!!! note
    If you are using the jp-mining-note template,
    most things here will likely not be useful for you 
    as the Yomichan templates that comes with the note
    already contains most of these features and more.


## How-To: Edit Yomichan Fields
1. Navigate to Yomichan Settings.
1. Go to the `Anki` section.
1. Select `Anki card format...`.

??? example "Demo *(click here)*"

    {{ img("how to edit yomichan fields", "assets/yomichan/howto_format.gif") }}

    The above showcases option 2 of
    [this example](jpresources.md#automatically-highlight-the-tested-word-within-the-sentence-upon-card-creation).

---

## How-To: Edit Yomichan Templates (Handlebars)
1. Navigate to Yomichan Settings.
1. Make sure that advanced settings are turned on (bottom left corner).
1. Go to the `Anki` section
1. Select `Configure Anki card templates...`

??? example "Demo *(click here)*"

    {{ img("how to edit yomichan templates", "assets/yomichan/howto_templates.gif") }}

---


## Grab only the first pitch accent dictionary { .text-yellow }

Adds the following Yomichan Fields:

- `{pitch-accents-single-dict}`: Pitch accent in text (downstep) format
- `{pitch-accent-graphs-single-dict}`: Pitch accent in svg graph format
- `{pitch-accent-positions-single-dict}`: Pitch accent in positions (number) format


{% raw %}

??? examplecode "Template code *(click here)*"
    ```handlebars
    {{#*inline "pitch-accent-list-single-dict"}}
        {{~#if (op ">" pitchCount 1)~}}<ol>{{~/if~}}
        {{~#eachUpTo pitches 1~}}
            {{~#each pitches~}}
                {{~#if (op ">" ../../pitchCount 1)~}}<li>{{~/if~}}
                    {{~> pitch-accent-item-disambiguation~}}
                    {{~> pitch-accent-item format=../../format~}}
                {{~#if (op ">" ../../pitchCount 1)~}}</li>{{~/if~}}
            {{~/each~}}
        {{~else~}}
            No pitch accent data
        {{~/eachUpTo~}}
    {{/inline}}

    {{#*inline "pitch-accents-single-dict"}}
        {{~> pitch-accent-list-single-dict format='text'~}}
    {{/inline}}

    {{#*inline "pitch-accent-graphs-single-dict"}}
        {{~> pitch-accent-list-single-dict format='graph'~}}
    {{/inline}}

    {{#*inline "pitch-accent-positions-single-dict"}}
        {{~> pitch-accent-list-single-dict format='position'~}}
    {{/inline}}
    ```

??? examplecode "Modified version of the above for Anime Cards *(click here)*"

    ```handlebars
    {{#*inline "pitch-accent-list-single-dict"}}
        {{~#if (op ">" pitchCount 1)~}}{{~/if~}}
        {{~#eachUpTo pitches 1~}}
            {{~#each pitches~}}
                {{~#if (op ">" ../../pitchCount 1)~}}{{~/if~}}
                    {{~> pitch-accent-item-disambiguation~}}
                    {{~> pitch-accent-item format=../../format~}}
                {{~#if (op ">" ../../pitchCount 1)~}}{{~/if~}}
            {{~/each~}}
        {{~else~}}
        {{~/eachUpTo~}}
    {{/inline}}

    {{#*inline "pitch-accents-single-dict"}}
        {{~> pitch-accent-list-single-dict format='text'~}}
    {{/inline}}

    {{#*inline "pitch-accent-graphs-single-dict"}}
        {{~> pitch-accent-list-single-dict format='graph'~}}
    {{/inline}}

    {{#*inline "pitch-accent-positions-single-dict"}}
        {{#regexReplace "<(.|\n)*?>" ""}}{{~> pitch-accent-list-single-dict format='position'~}}{{/regexReplace}}
    {{/inline}}
    ```

    <!-- https://discord.com/channels/617136488840429598/617228895573377054/998678002256855130 -->
    Thanks An#7416 for the template code.

{% endraw %}


---



## Export only the selected text (only if text is selected) { .text-yellow }

> Adds: `{selection-text-or-glossary}`

Allows you to export only a section of a glossary by highlighting over it,
and uses the glossary by default if you don't have anything highlighted.

??? examplecode "Template code *(click here)*"

    {% raw %}
    ```handlebars
    {{#*inline "selection-text-or-glossary"}}
        {{~#if (op "!==" (getMedia "selectionText") "")~}}
            {{~#getMedia "selectionText"}}{{/getMedia~}}
        {{~else~}}
            {{~> glossary ~}}
        {{/if~}}
    {{/inline}}
    ```
    {% endraw %}

!!! note
    Related [Github issue](https://github.com/FooSoft/yomichan/issues/2097).

---


## Grab only the first dictionary { .text-yellow }

> Adds: `{first-dictionary}`

The following grabs the first dictionary
(including every definition within said dictionary).

For further customization on how the first dictionary is selected
(say, for automatic bilingual / monolingual separation),
see the handlebars code used by jp-mining-note [here](setup.md#yomichan-templates).


??? examplecode "Template code *(click here)*"

    {% raw %}
    ```handlebars
    {{~#*inline "glossary-first"~}}

        {{~#scope~}}

            {{~#set "first-dictionary" null}}{{/set~}}

            {{~#each definition.definitions~}}
                {{~#if (op "===" null (get "first-dictionary"))~}}
                    {{~#set "first-dictionary" dictionary~}}{{~/set~}}
                {{~/if~}}
            {{~/each~}}

            {{~#if (op "!==" null (get "first-dictionary"))~}}
                <div style="text-align: left;"><ol>
                {{~#each definition.definitions~}}
                    {{~#if (op "===" dictionary (get "first-dictionary"))~}}
                        <li>{{~> glossary-single . brief=../brief noDictionaryTag=../noDictionaryTag ~}}</li>
                    {{~/if~}}
                {{~/each~}}
                </ol></div>
            {{~/if~}}

        {{~/scope~}}

    {{~/inline~}}
    ```
    {% endraw %}

---



## Automatically highlight the tested word within the sentence upon card creation { .text-yellow }

??? info "Option 1: Bold only"
    **Yomichan Fields**:
    ```
    {cloze-prefix}<b>{cloze-body}</b>{cloze-suffix}
    ```


??? info "Option 2: Bold + Styling (recommended)"

    **Yomichan Fields**:
    ```
    {cloze-prefix}<b>{cloze-body}</b>{cloze-suffix}
    ```

    **Anki Note CSS** (the `Styling` page under the editing card templates page):
    ```css
    b {
        color: #fffd9e; /* bright yellow */
    }
    ```

    If your card template is formatted like
    `<div class="sentence">{{Sentence}}</div>`:
    ```css
    .sentence b {
        color: #fffd9e; /* bright yellow */

        /* if you want to make the word not bolded, un-comment the following */
        /*font-weight: normal;*/
    }
    ```

??? info "Option 3: Custom div"

    **Yomichan Fields**:
    ```
    {cloze-prefix}<span class="word-highlight">{cloze-body}</span>{cloze-suffix}
    ```

    **Anki Note CSS**:
    ```css
    .word-highlight {
        color: #fffd9e;
    }
    ```

    !!! note
        I personally prefer using Option 2 (bold + styling) over a custom div
        because it makes editing the note easier.
        For example, if you want to edit the highlighted region, you only have to bold
        the desired region (say, with ctrl+b) instead of having to edit
        the raw HTML of the field (say, with ctrl+shift+x).

---




## Further Reading
Official documentation om Yomichan's templates:

- [Yomichan template helper functions](https://github.com/FooSoft/yomichan/blob/master/docs/templates.md)
- [Yomichan template structure](https://github.com/FooSoft/yomichan/blob/master/docs/interfaces/dictionary-entry.ts)

Example template code can be found here:

- Markers for individual dictionaries:
    [here](https://gist.github.com/Rudo2204/55f418885c2447ccbdc95b0511e20336)
    - This has certain extended capabilities over my template code, such as removing the first line.

- Template code for this note:
    [here](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/yomichan_templates/top.txt) and
    [here](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/yomichan_templates/bottom.txt)

- Old template code for this note (NO LONGER USED / MAINTAINED):
    [here](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/yomichan_templates/old.txt)

---


# ShareX Scripts
Many people have already documented how to setup your ShareX to work with Anki, such as:

* [stegatxins0](https://rentry.co/mining#sharex) (recommended)
* [Anime Cards](https://animecards.site/media/#setting-up-sharex)

Instead of re-telling the steps they have already showed,
I present **alternative ShareX scripts**
(the long one-liner to paste within the `Actions` argument section)
for stegatxins0's guide.

The following scripts have the following changes:

- They all with jp-mining-note by default.
- They have been rewritten so it can be presented in human-readable format
    right below the one-liner.
- The one-liners can be re-compiled from the source code at your own discretion
    (by [building the documentation](building.md#building-the-documentation)).
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

{% set checked_checkbox = '<input type="checkbox" disabled="disabled" checked />' %}

1. Under the main window, go to `Hotkey Settings`, and add a new hotkey.
2. Click on the settings icon (of the newly added hotkey).
3. In the `Task` tab (to the left):
    - Set: `Task` to `Screen capture` →  `Capture active window`
    - Check `Override After Capture Tasks` ({{ checked_checkbox }})
    - Under `After Capture`, un-check everything, and check the following:
        - `Save Image to File`
        - `Perform Actions`
        - `Delete Locally`
4. In the `Actions` tab (to the left):
    - Check `Override Actions` ({{ checked_checkbox }})
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

??? example "Examples *(click here)*"

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
    as shown [here](importing.md#1-batch-generate-pitch-accents-and-sentence-furigana).

??? info "How-To: Fix incorrectly-bolded words *(click here)*"

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

        ??? example "Demo *(click here)*"
            {{ img("Add the definition from the popup dictionary", "assets/other/incorrect_bold.png") }}

    2. Copy the desired sentence.

    3. Run this script.

    !!! note
        It is assumed that you have
        [multiple popups enabled](https://learnjapanese.moe/monolingual/#optimizing-yomichan-settings).


??? info "How the bolded word is preserved *(click here)*"

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

    「スペルド族への恐怖は恐らくこの世界に<b class="text-yellow">根づいている</b>んだろう」
    { .jp-quote-text }

    「ルーはたくさんあるので、今<b class="text-yellow">お代わり</b>をお持ちしますね」
    { .jp-quote-text }

    「ただ、一つだけ<b class="text-yellow">釘をささせて</b>もらうけど…貴方がこれから何をするにしても、仕事は今まで通りこなしてもらうわよ？」
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

---






# Other Random Resources

!!! note
    Most things here have been moved to the [Setup: Everything Else](setupeverythingelse.md) page

## Mikagu pitch accent alternatives
- [migaku updated](https://github.com/MikeMoolenaar/Migaku-Japanese-Addon-Updated)
    - Fork of migaku to be updated for anki version 2.1.50+
- [anki-jrp](https://github.com/Ben-Kerman/anki-jrp)
    - Completely stand-alone plugin from migaku with a completely different codebase
    - Only does one thing: adds pitch accent colors (along with furigana)



