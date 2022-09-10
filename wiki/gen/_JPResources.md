{% import "sharex_input.ps1" as sharex %}
{% from "macros.html" import sharex_display with context %}


<!--
This page was automatically generated from gen/_JPResources.md.
If you are planning on editing this page, please edit the file above!
-->

This page was inspired by [Marv's resources page](https://github.com/MarvNC/JP-Resources),
which has a bunch of different but equally awesome resources.
I highly recommend checking it out!

For fixing typos and making things clearer, it would especially help if you
fork [the main repository](https://github.com/Aquafina-water-bottle/jp-mining-note)
(not the dedicated wiki repository!)
and make a pull request!
(Edit the `wiki/gen/_JPResources.md`
file [here](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/wiki/gen/_JPResources.md).)

Otherwise, if you encounter any problems, feel free to contact
me on discord `Aquafina water bottle#3026`, or submit an issue.
I exist on the TheMoeWay and Refold (Japanese) servers.



# Table of Contents
* [CSS (Yomichan)](jpresources#css-yomichan)
    * [How To](jpresources#how-to-add-custom-css-in-yomichan)
    * [Do not copy furigana](jpresources#copying-the-word-without-copying-the-furigana)
    * [Limiting the number of frequency lists](jpresources#limiting-the-number-of-frequency-lists)
    * [Limiting the number of pitch accent dictionaries](jpresources#limiting-the-number-of-pitch-accent-dictionaries)
    * [Hide the dictionary but allow it to be used by Anki](jpresources#hide-the-dictionary-but-allow-it-to-be-used-by-anki)
    * [Hide bilingual dictionaries until hover](jpresources#hide-bilingual-definitions-until-hover)
* [CSS (General)](jpresources#css-general)
    * [Ensuring 「」 properly quotes the text](jpresources#ensuring--properly-quotes-the-text)
* [Yomichan Templates / Handlebars](jpresources#css-general)
    * How To ([Fields](jpresources#editing-yomichan-fields) and
          [Templates](jpresources#editing-yomichan-templates-handlebars))
    * [Grab only the first pitch accent dictionary](jpresources#grab-only-the-first-pitch-accent-dictionary)
    * [Automatically highlight the tested word within the sentence](jpresources#automatically-highlight-the-tested-word-within-the-sentence-upon-card-creation)
    * [Export only the selected text (only if text is selected)](jpresources#export-only-the-selected-text-only-if-text-is-selected)
    * [Further Reading](jpresources#further-reading)
* [ShareX](jpresources#sharex)



{% raw %}
# CSS (Yomichan)

## How to add Custom CSS In Yomichan
To add custom CSS in Yomichan, do the following:
1. Head over to Yomichan settings (Yomichan extension marker -> cogwheel)
1. Go to `Appearance` →  `Configure custom CSS...`
1. Add the CSS to the top section.
1. Close the window.

[[assets/yomichan/howto_css.gif]]

<br>




## Copying the word without copying the furigana
If you want to copy the main word within Yomichan without copying the furigana,
you can use the following CSS:

```css
.headword-term ruby rt {
  user-select: none;
}
```

* **Note**: <br>
  The above is actually general enough to use for Anki cards itself, say with the following CSS:
  ```css
  ruby rt {
    user-select: none;
  }
  ```
  Unfortunately, the above doesn't seem to work on Linux (tested on Ubuntu / Xfce, Anki Qt6 2.1.54).

<br>


## Limiting the number of frequency lists

```css
/* Only shows the first 2 frequency lists */
span.frequency-group-item:nth-child(n+3) {
    display: none;
}
```
<sup>(Thanks Marv#5144 for the CSS)</sup>
<!-- http://discordapp.com/channels/617136488840429598/778430038159655012/1012950954770960464 -->

[[assets/yomichan/limit_frequencies.gif]]

<br>



## Limiting the number of pitch accent dictionaries


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

[[assets/yomichan/limit_pitch_accents.gif]]


<br>



## Hide the dictionary, but allow it to be used by Anki

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

<details>
<summary><i>Click here to see an example.</i></summary>

```css
li.definition-item[data-dictionary='JMdict (English)'] {
  display: none;
}
```

</details>

[[assets/yomichan/hide_dictionary.gif]]

<br>


## Hide bilingual definitions until hover

Add the following CSS for the desired dictionaries (this has to be done for each individual dictionary):
```css
li.definition-item[data-dictionary='DICTIONARY'] .gloss-list {
  opacity: 0;
}
li.definition-item[data-dictionary='DICTIONARY']:hover .gloss-list {
  opacity: 1;
}
```


<details>
<summary><i>Click here to see an example.</i></summary>

```css
li.definition-item[data-dictionary='JMdict (English)'] .gloss-list {
  opacity: 0;
}
li.definition-item[data-dictionary='JMdict (English)']:hover .gloss-list {
  opacity: 1;
}
```

</details>

[[assets/yomichan/bilingual_hover.gif]]

<br>



# CSS (General)

## Ensuring 「」 properly quotes the text

```css
.text {
  text-indent: -1em;
  padding-left: 1em;
}
```

[[assets/other/left_quote.png]] <br>
<sup>The first quote is the standard display without any custom CSS. The second quote is with the aforementioned CSS.</sup>

(example JSFiddle [here](https://jsfiddle.net/Aquafina_water_bottle/5h8uxnko/14/))

<br>




# Yomichan Templates / Handlebars


## Editing Yomichan Fields
1. Navigate to Yomichan Settings.
1. Go to the `Anki` section.
1. Select `Anki card format...`.

[[assets/yomichan/howto_format.gif]]

<br>

## Editing Yomichan Templates (Handlebars)
1. Navigate to Yomichan Settings.
1. Make sure that advanced settings are turned on (bottom left corner).
1. Go to the `Anki` section
1. Select `Configure Anki card templates...`

[[assets/yomichan/howto_templates.gif]]

<br>


## Grab only the first pitch accent dictionary

Add the following template code to Yomichan Templates:
```
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

You can now use the following in Yomichan Fields:
```
{pitch-accents-single-dict}
{pitch-accent-graphs-single-dict}
{pitch-accent-positions-single-dict}
```


<!-- https://discord.com/channels/617136488840429598/617228895573377054/998678002256855130 -->

<details>
<summary><i>Click here to see an modified version for Anime Cards (thanks An#7416).</i></summary>

```
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

</details>

<br>



## Automatically highlight the tested word within the sentence upon card creation

#### Option 1: Bold only

##### Yomichan Fields:
```
{cloze-prefix}<b>{cloze-body}</b>{cloze-suffix}
```


#### Option 2: Bold + Styling
##### Yomichan Fields:
```
{cloze-prefix}<b>{cloze-body}</b>{cloze-suffix}
```

##### Anki Note CSS:
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

#### Option 3: Custom div

##### Yomichan Fields:
```
{cloze-prefix}<span class="word-highlight">{cloze-body}</span>{cloze-suffix}
```

##### Anki Note CSS:
```css
.word-highlight {
    color: #fffd9e;
}
```

* **Note**: <br>
  I personally prefer using Option 2 (bolded) over a custom div
  because it makes editing the note easier.
  For example, if you want to edit the highlighted region, you only have to bold
  the desired region (say, with ctrl+b) instead of having to edit
  the raw HTML of the field (say, with ctrl+shift+x).

<br>



## Export only the selected text (only if text is selected)

Allows you to export only a section of a glossary by highlighting over it,
and uses the glossary by default if you don't have anything highlighted.
```
{{#*inline "selection-text"}}
    {{~#if (op "!==" (getMedia "selectionText") "")~}}
        {{~#getMedia "selectionText"}}{{/getMedia~}}
    {{~else~}}
        {{~> glossary ~}}
    {{/if~}}
{{/inline}}
```

* **Note**: <br>
  Related [Github issue](https://github.com/FooSoft/yomichan/issues/2097).

<br>


## Further Reading
The documentation I used:
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

{% endraw %}

<br>


# Sharex
- TODO make non-point form
- alternate code for sharex following [this setup](https://rentry.co/mining)
- note that f3 keybinds do NOT record media, requires slightly different setup
    - TODO document
    - iirc grabs current window picture + deletes after (the only purpose of the f3 keybinds
      is to execute ankiconnect calls in powershell)
- 1 liners are generated from [this file](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/wiki/gen/make.py)

## f1: screenshot and clipboard
- adds the image to the note
- adds a tag to the note (tag is exactly the window name of the current application)
- adds the clipboard to AdditionalNotes (I use this for copying/pasting context)

{{ sharex_display(sharex.screenshot_and_clipboard) }}

## shift+f1: screenshot (only)
- the above without clipboard (adds image and tag)

{{ sharex_display(sharex.screenshot) }}

## f2: audio
- adds audio to anki

{{ sharex_display(sharex.audio) }}


## shift+f3: update sentence
- update the sentence without losing the bold (python script + clipboard)
- remove sentence reading
- good for when the sentence just doesn't match

{{ sharex_display(sharex.update_sentence) }}

## ctrl+f3 - copy from previous:
- set additional notes and picture to previous card
- also copy all tags
- good for adding more than 1 sentence with the same text box

{{ sharex_display(sharex.copy_from_previous) }}

## ctrl+shift+f3: fix sentence and freq
- update the previous note with the current's frequency, sentence & sentence reading
- remove current note !
- good for the orthographic dict!

{{ sharex_display(sharex.fix_sent_and_freq) }}



{% raw %}

# Updated plugins for outdated plugins



## migaku
[migaku updated](https://github.com/MikeMoolenaar/Migaku-Japanese-Addon-Updated)
- fork of migaku to be updated for anki version 2.1.50+

[anki-jrp](https://github.com/Ben-Kerman/anki-jrp)
- completely stand-alone plugin from migaku with a completely different codebase
- only does one thing: adds pitch accent colors (along with furigana)


{% endraw %}
