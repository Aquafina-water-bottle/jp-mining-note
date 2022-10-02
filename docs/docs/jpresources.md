{% import "sharex_input.ps1" as sharex %}
{% from "macros.html" import sharex_display with context %}


A collection of tips and tricks, primarily related to CSS and Yomichan templates.

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
    Unfortunately, the above doesn't seem to work on Linux (tested on Ubuntu / Xfce, Anki Qt6 2.1.54).

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

??? quote "Click here to see an example."

    ```css
    li.definition-item[data-dictionary='JMdict (English)'] {
      display: none;
    }
    ```

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


??? quote "Click here to see an example."
    ```css
    li.definition-item[data-dictionary='JMdict (English)'] .gloss-list {
      opacity: 0;
    }
    li.definition-item[data-dictionary='JMdict (English)']:hover .gloss-list {
      opacity: 1;
    }
    ```

{{ img("hide bilingual dictionaries until hover", "assets/yomichan/bilingual_hover.gif") }}

---



## Remove the "Add Reading" button { .text-yellow }

```css
button[title^="Add reading"] {
  display:none;
}
```

<figure markdown>
  {{ img("remove add reading button", "assets/yomichan/hide_add_reading.png") }}
  <figcaption>Left: without CSS. Right: with CSS.</figcaption>
</figure>

---



# CSS (Other)

## Ensuring 「」 properly quotes the text { .text-yellow }

{{ img("left quote comparisons", "assets/other/left_quote.png", 'align=right width="300"') }}

```css
.text {
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

??? quote "Click here to see an example."
    ```css
    :lang(ja), :lang(ja-JP) {
        --font-primary: Whitney,"Noto Sans CJK JP","Hiragino Sans","ヒラギノ角ゴ ProN W3","Hiragino Kaku Gothic ProN","メイリオ",Meiryo,Osaka,"MS PGothic","Helvetica Neue",Helvetica,Arial,sans-serif;
    }
    ```

??? quote "Click here to see Discord's default CSS."
    ```css
    :lang(ja), :lang(ja-JP) {
        --font-primary: Whitney,"Hiragino Sans","ヒラギノ角ゴ ProN W3","Hiragino Kaku Gothic ProN",メイリオ,Meiryo,Osaka,"MS PGothic","Helvetica Neue",Helvetica,Arial,sans-serif;
    }
    ```

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

{{ img("how to edit yomichan fields", "assets/yomichan/howto_format.gif") }}
<sup> Note that the above showcases option 2 of
[this example](jpresources.md#automatically-highlight-the-tested-word-within-the-sentence-upon-card-creation).
</sup>

<br>

## How-To: Edit Yomichan Templates (Handlebars)
1. Navigate to Yomichan Settings.
1. Make sure that advanced settings are turned on (bottom left corner).
1. Go to the `Anki` section
1. Select `Configure Anki card templates...`

{{ img("how to edit yomichan templates", "assets/yomichan/howto_templates.gif") }}

---


## Grab only the first pitch accent dictionary { .text-yellow }

{% raw %}
Add the following template code to Yomichan templates:
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
{% endraw %}


You can now use the following in Yomichan Fields:
```
{pitch-accents-single-dict}
{pitch-accent-graphs-single-dict}
{pitch-accent-positions-single-dict}
```


<!-- https://discord.com/channels/617136488840429598/617228895573377054/998678002256855130 -->

{% raw %}
??? quote "Click here to see a modified version for Anime Cards."

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

    <sup>(Thanks An#7416 for the template code)</sup>
{% endraw %}


---



## Automatically highlight the tested word within the sentence upon card creation { .text-yellow }

!!! info "(Option 1) Bold only"
    **Yomichan Fields**:
    ```
    {cloze-prefix}<b>{cloze-body}</b>{cloze-suffix}
    ```


!!! info "(Option 2) Bold + Styling"

    **Yomichan Fields**:
    ```
    {cloze-prefix}<b>{cloze-body}</b>{cloze-suffix}
    ```

    **Anki Note CSS**:
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

!!! info "(Option 3) Custom div"

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



## Export only the selected text (only if text is selected) { .text-yellow }

Allows you to export only a section of a glossary by highlighting over it,
and uses the glossary by default if you don't have anything highlighted.
{% raw %}
```
{{#*inline "selection-text"}}
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
The following grabs the first dictionary,
but with every definition within said dictionary.

For further customization on how the first dictionary is selected
(say, for automatic bilingual / monolingual separation),
see the handlebars code used by JPMN [here](setup.md#yomichan-templates).


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


# ShareX Commands
Many people have already documented how to setup your ShareX to work with Anki, such as:

* [stegatxins0](https://rentry.co/mining#sharex) (recommended)
* [Anime Cards](https://animecards.site/media/#setting-up-sharex)

Instead of repeating the steps they already showed,
I present alternative and additional ShareX commnds for stegatxins0's guide
(the long command to paste within the `Actions` section).

The following commands have the following advantages / changes:

- They have been all rewritten to work with jp-mining-note by default
- The source code is readable and presented below the one-liner
- The one-liners can be re-compiled from the source code at your own discretion
  (by [building the documentation](building.md#building-the-documentation))

<!--
- TODO document
- iirc grabs current window picture + deletes after (the only purpose of the f3 keybinds
    is to execute ankiconnect calls in powershell)
-->

---


## Screenshot and Clipboard Hotkey { .text-yellow }


### Features

- Adds the selected image to the note. This image is automatically shrunk within the field viewer only.
    Otherwise, the screens
- Adds a tag to the note. The tag is exactly the window name of the current application.
- Sets the `AdditionalNotes` to the current clipboard. I use this for copying/pasting context

### How-To

Follow the steps for setting up the
[screenshot hotkey](https://rentry.co/mining#hotkey-for-screenshot),
and use this command in place of step 8's `argument`.


{{ sharex_display(sharex.screenshot_and_clipboard) }}

---



## Screenshot (only) Hotkey { .text-yellow }

This is the same as the above, but without setting the `AdditionalNotes` field to the current clipboard.

{{ sharex_display(sharex.screenshot) }}

---



## Audio Hotkey { .text-yellow }

This command works *exactly the same* as stegatxins0's version,
except rewritten in a more readable format.
If you already have the audio hotkey setup, there is no reason to change the old command.

To use this, follow the steps for setting up the
[audio hotkey](https://rentry.co/mining#hotkey-for-audio),
and use this script in place of step 14's `Argument`.

{{ sharex_display(sharex.audio) }}

---




# Arbitrary Scripts

The following scripts are written in two formats:
one that works automatically with your usual `ShareX` setup,
and one in Python for cross-platform portability.

## How-To: Running with ShareX
TODO

## How-To: Running with Python
TODO


<!-- shift + f3 -->
## Update Sentence with Clipboard { .text-yellow }
This script updates the sentence with the clipboard, preserves the bolded word,
and removes the `SentenceReading` field.

!!! note
    After running this script, you must manually generate the `SentenceReading` field
    if you want the furigana reading.
    Of course, this can be done in bulk at any point,
    as shown [here](importing.md#1-batch-generate-pitch-accents-and-sentence-furigana).

This script is useful when Yomichan's parsed sentence does not match the recorded audio.
This is also useful for when Yomichan's word parser doesn't match the word itself (steps shown below).

??? info "How-To: Fix incorrectly-bolded words *(click here)*"

    For example, the target word 希望 in the sentence 「入部希望なんですけど…」
    will be parsed by Yomichan as the following:
    ```
    入部<b>希望な</b>んですけど…
    ```

    To add the above sentence in the 2nd example while preserving the bolded word,
    do NOT add the word within the sentence.
    Instead, add the header word itself within the popup dictionary,
    and then run this script.

    TODO screenshot


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

### ShareX Command

{{ sharex_display(sharex.update_sentence) }}

### Python Command

TODO

---


<!-- ??? -->
## Update AdditionalNotes with Clipboard { .text-yellow }
This script does the exact same thing as the above script, but with `AdditionalNotes` instead.

### ShareX Command

{{ sharex_display(sharex.update_additional_notes) }}

### Python Command

TODO


---



<!-- ctrl + f3 -->
## Copy from Previous Card { .text-yellow }

This script does the following:

- Set the `AdditionalNotes` and `Picture` field of the current card to the previous card's fields.
- Copies all the tags of the previous card.

This is useful for when you are adding more than one sentence with the same text box
of a visual novel, as it prevents you from having to run the screenshot hotkey.

### ShareX Command

{{ sharex_display(sharex.copy_from_previous) }}

### Python Command

TODO

---



<!-- ctrl + shift + f3 -->
## Orthographic Variants: Fix Sentence and Frequency { .text-yellow }

This script does the following:

- Sets the previous note's fields with the current card's fields:
    - `FrequencyStylized`
    - `Sentence`
    - `SentenceReading`
- Deletes the current note

This is useful for when you want to add the the word within the
[Orthographic Variants](https://github.com/FooSoft/yomichan/issues/2183) dictionary.
The Orthographics Variants dictionary is extremely useful for monolingual definitions,
as explained in the above link:

!!! quote
    This is useful for when you search for a word like 思うツボ, but your favorite dictionaries only contain entries for 思う壺.

In practice, I've personally found numerous examples of this in everyday media,
so this has helped me immensely.


### ShareX Command

{{ sharex_display(sharex.fix_sent_and_freq) }}

### Python Command

TODO

---






# Other Random Resources

* [Animecards Yomichan setup](https://animecards.site/yomichansetup/)
    * [Their Anki note type](https://ankiweb.net/shared/info/151553357)
* [TheMoeWay Yomichan setup](https://learnjapanese.moe/yomichan/)
* [Cade's guide to optimizing Anki](https://cademcniven.com/posts/20210410/)


## Mining guides

* [Xelieu's mining guide](https://rentry.co/lazyXel) (Windows, Android)
* [stegatxins0's mining guide](https://rentry.co/mining) (Windows, Kindle)
* [Anime Cards & mining guides](https://animecards.site/) (Multiple platforms)
* [Shiki's mining workflow](https://docs.google.com/document/d/e/2PACX-1vQuEAoZFoJbULZzCJ3_tW7ayT_DcQl9eDlrXMnuPGTwDk62r5fQrXak3ayxBsEgkL85_Z-YY5W4yUom/pub) (cross platform with `asbplayer`)
* [Tigy01's mining workflow](https://docs.google.com/document/d/e/2PACX-1vTnCEECFTJ_DyBID0uIQ5AZkbrb5ynSmYgkdi6OVyvX-fs9X40btEbpSToTmsct5JzrQJ2e9wcrc6h-/pub)  (cross platform with `asbplayer`)

## Mikagu pitch accent alternatives
- [migaku updated](https://github.com/MikeMoolenaar/Migaku-Japanese-Addon-Updated)
    - Fork of migaku to be updated for anki version 2.1.50+
- [anki-jrp](https://github.com/Ben-Kerman/anki-jrp)
    - Completely stand-alone plugin from migaku with a completely different codebase
    - Only does one thing: adds pitch accent colors (along with furigana)


## How to Mokuro
- [main mokuro page](https://github.com/kha-white/mokuro)
- [lazy guide (recommend)](https://rentry.co/lazyXel#manga-with-yomichan)
    - (windows users) make sure to check the "add python to path" on install
    - make sure online processing (google colab) is
      [using the gpu](https://www.tutorialspoint.com/google_colab/google_colab_using_free_gpu.htm)
      to speed up the process
<!-- credit: Josuke#7212 / 190480221135306752 -->
- [basic setup guide](https://docs.google.com/document/d/1ddUINNHZoln6wXGAiGiVpZb4QPtonEy-jgrT1zQbXow/edit?usp=sharing)
    - doesn't include how to process online, compared to the one above



