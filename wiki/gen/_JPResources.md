{% import "sharex_input.ps1" as sharex %}
{% from "macros.html" import sharex_display with context %}


TODO flesh out!

- @ me on discord `Aquafina water bottle#3026`.
  I exist on the TheMoeWay and Refold (Japanese) servers.

- inspired by [marv's resources page](https://github.com/MarvNC/JP-Resources),
which has a bunch of different resources. Highly recommend checking it out!


{% raw %}
# CSS (Yomichan)

## general howto
- TODO how to add custom css
- inspect element is your friend if you want to figure out how to write your own custom css for elements you don't know the class / structure of


## Highlighting / copying the definition word without copying the furigana

```css
.headword-term ruby rt {
  user-select: none;
}
```

the above is general enough for anki cards too:
```css
ruby rt {
  user-select: none;
}
```
- tested on anki 2.1.54: only works on windows


## Reducing the number of frequency lists

```css
span.frequency-group-item:nth-child(n+5) {
    display: none;
}
```

(thanks Marv#5144, [og message](http://discordapp.com/channels/617136488840429598/778430038159655012/1012950954770960464))


## Reducing the number of pitch accent dictionaries

only shows the first 2 pitch accent dictionaries:
```css
li.pronunciation-group:nth-child(n+3) {
  display: none;
}
```


Make the pitch accent dictionary text a bit grey by default,
and to make specifically the "NHK" and "大辞泉" white (change these two
to any dictionary you find to be of higher quality)
```css
.tag[data-category="pronunciation-dictionary"] {
  --tag-text-color: #c8bfdb;
}
.tag[data-details="大辞泉"], .tag[data-details="NHK"] {
  --tag-text-color: #FFFFFF;
}
```

the above 2 combined:

https://cdn.discordapp.com/attachments/778430038159655012/998424187888734260/unknown.png

https://cdn.discordapp.com/attachments/778430038159655012/998424188203303033/unknown.png



## Hide the dictionary but allow it to be used by Anki

1. ensure that the dictionary is enabled in your profile
2. add the following css for the dictionary (has to be done for each individual dictionary)
```
li.definition-item[data-dictionary='DICTIONARY'] {
  display: none;
}
```


## Only see bilingual definitions on hover
```
li.definition-item[data-dictionary='DICTIONARY'] .gloss-list {
  opacity: 0;
}
li.definition-item[data-dictionary='DICTIONARY']:hover .gloss-list {
  opacity: 1;
}
```

example:
```
li.definition-item[data-dictionary='JMdict (English)'] .gloss-list {
  opacity: 0;
}
li.definition-item[data-dictionary='JMdict (English)']:hover .gloss-list {
  opacity: 1;
}

li.definition-item[data-dictionary='新和英'] .gloss-list {
  opacity: 0;
}
li.definition-item[data-dictionary='新和英']:hover .gloss-list {
  opacity: 1;
}


```


# CSS (General)

## Ensuring the open quote properly "quotes" the text

```css
.text {
  text-indent: -1em;
  padding-left: 1em;
}
```

https://cdn.discordapp.com/attachments/778430038159655012/997998961128390687/unknown.png

https://cdn.discordapp.com/attachments/778430038159655012/997998961463930950/unknown.png

example [jsfiddle](https://jsfiddle.net/Aquafina_water_bottle/5h8uxnko/12/)





# Yomichan Templates + Handlebars

## general howto
- TODO how to access handlebars
- TODO how to access format

## grab first pitch accent dictionary only

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

modified to match animecards (thanks An#7416)
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


[og message](https://discord.com/channels/617136488840429598/617228895573377054/998678002256855130)



copy/paste of above msg:
In Yomichan settings -> Anki -> Configure Anki Card Templates -> Then look for `End Pitch Accents` and paste it just above that -> Close

Then click Configure Anki card format -> If you're using  {pitch-accent-positions}, {pitch-accent-graphs}  or {pitch-accents}, you just replace
1. {pitch-accent-positions} with {pitch-accent-positions-single-dict}
2. {pitch-accent-graphs} with {pitch-accent-graphs-single-dict}
3. {pitch-accents} with {pitch-accents-single-dict}


## Automatically styling the highlighted word upon card creation
- yomichan format
- personally prefer bold over custom div
- can easily edit it in the anki field editor (ctrl+b to bold)
  as opposed to having to stylize with a div on each edit

#### option 1: bold
```
{cloze-prefix}<b>{cloze-body}</b>{cloze-suffix}
```
- simply bolds

#### option 2: bold + styling
```
{cloze-prefix}<b>{cloze-body}</b>{cloze-suffix}
```

css:
```css
b {
    color: #fffd9e;
}
```

or if your card is formatted like `<div class="sentence">{{Sentence}}</div>`:

```css
.sentence b {
    color: #fffd9e;

    /* if you want to make the word not bolded: */
    /*font-weight: normal;*/
}
```

#### option 3: custom div

```
{cloze-prefix}<span class="word-highlight">{cloze-body}</span>{cloze-suffix}
```

```css
.word-highlight {
    color: #fffd9e;
}
```



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
