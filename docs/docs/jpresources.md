
A collection of tips and tricks, primarily related to CSS, Yomichan templates, and ShareX.
Other resources can be found to the left sidebar.

This page was inspired by [Marv's resources page](https://github.com/MarvNC/JP-Resources),
which has a bunch of different but equally awesome resources.
I highly recommend checking it out!


If you encounter any problems, have any questions, etc., feel free to contact
me on discord `Aquafina water bottle#3026`,
or [submit an issue](https://github.com/Aquafina-water-bottle/jp-mining-note/issues).
I exist on the [TheMoeWay]({{THEMOEWAY_LINK}}) and Refold (Japanese) servers.




---

# Master Project List
This contains the list of all my current projects that relate to learning Japanese.

* **[jp-mining-note](/jp-mining-note/)**

    jp-mining-note is a highly customizable Anki card template for studying Japanese,
    designed to be visually appealing and simple to use without sacrificing functionality.
    Easily paired with most automatic card creation workflows,
    this aims to make your experience with Anki as smooth as possible.

    * **[JPMN Manager](https://github.com/Aquafina-water-bottle/jpmn-manager)**

        JPMN Manager is a simple Anki add-on that makes it possible to seemlessly
        install and update jp-mining-note, and makes working with the note a little easier.

* **[Local Audio Server for Yomichan](https://github.com/themoeway/local-audio-yomichan)**

    This Anki add-on runs a local server of which Yomichan can fetch audio files from, using a database containing over 200,000 unique expressions. With this setup, you are able to create Anki cards nearly instantaneously, and get word audio without a working internet connection.

* **[JPMN Handlebars Package](jpmnhandlebars.md)**

    Instructions on how to use the JPMN handlebars for *any* note type, not just jp-mining-note.
    Most notably, these handlebars make it very easy to select and export
    dictionaries into Anki.

* **[All Anki note templates I can find](alternatives.md)**

    I catalogue all note templates I can possibly find
    (that isn't jp-mining-note, and made for learning Japanese) here.

* **[JMdict (English) for Yomichan](https://github.com/Aquafina-water-bottle/jmdict-english-yomichan)**

    This simply contains a Yomichan dictionary version of `JMdict (English)`
    from the [main website](https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project)
    (from files `JMdict_e` and `JMdict_e_examp`),
    compiled using [yomichan-import](https://github.com/FooSoft/yomichan-import).
    (Disclaimer: I did not make any of these tools.)

    This repository exists to simply give people a more up-to-date version of this dictionary,
    for people who don't want to compile the dictionary themselves.
    A more up-to-date version of JMdict usually provides better definitions and coverage
    compared to older versions, so I would recommend updating this dictionary every few months.

---


# CSS (Yomichan)

## How-To: Add Custom CSS In Yomichan

To add custom CSS in Yomichan, do the following:

1. Head over to Yomichan settings (Yomichan extension marker -> cogwheel)
1. Go to `Appearance` →  `Configure custom CSS...`
1. Add the CSS to the top section.
1. Close the window.

??? example "Demo <small>(click here)</small>"

    {{ img("how to add custom css to Yomichan", "assets/jpresources/yomichan/howto_css.gif") }}


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
<sup>(Thanks Marv#5144 for the CSS.
[Original message](http://discordapp.com/channels/617136488840429598/778430038159655012/1012950954770960464) on {{ TMW_SERVER }})</sup>

??? example "Demo <small>(click here)</small>"

    {{ img("limit frequencies demo", "assets/jpresources/yomichan/limit_frequencies.gif") }}

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

??? example "Demo <small>(click here)</small>"

    {{ img("limit pitch accent dictionaries demo", "assets/jpresources/yomichan/limit_pitch_accents.gif") }}


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

??? examplecode "Example CSS for JMdict <small>(click here)</small>"

    ```css
    li.definition-item[data-dictionary='JMdict (English)'] {
      display: none;
    }
    ```

??? example "Demo <small>(click here)</small>"

    {{ img("hide dictionary in Yomichan", "assets/jpresources/yomichan/hide_dictionary.gif") }}

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


??? examplecode "Example CSS for JMdict <small>(click here)</small>"
    ```css
    li.definition-item[data-dictionary='JMdict (English)'] .gloss-list {
      opacity: 0;
    }
    li.definition-item[data-dictionary='JMdict (English)']:hover .gloss-list {
      opacity: 1;
    }
    ```

??? example "Demo <small>(click here)</small>"

    {{ img("hide bilingual dictionaries until hover", "assets/jpresources/yomichan/bilingual_hover.gif") }}

---



## Remove the "Add Reading" button { .text-yellow }

This removes the small green button to add the reading.

```css
button[title^="Add reading"] {
  display:none;
}
```

??? example "Demo <small>(click here)</small>"

    <figure markdown>
      {{ img("remove add reading button", "assets/jpresources/yomichan/hide_add_reading.png") }}
      <figcaption>Left: without CSS. Right: with CSS.</figcaption>
    </figure>

---


## Coloring Dictionaries { .text-yellow }
Darius has some CSS [here](https://github.com/djahandarie/yomichan-dict-css)
that uniquely colors popular dictionaries.

---


# CSS (Other)

{{ img("left quote comparisons", "assets/jpresources/left_quote.png", 'align=right width="300"') }}

## Ensuring 「」 properly quotes the text { .text-yellow }

If your text contains quotes, the following CSS ensures that it is properly stylized:

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
2. In Discord Settings →  `Custom CSS` section, add the following:
    ```css
    :lang(ja), :lang(ja-JP) {
        --font-primary: "gg sans","YOUR-PREFERRED-FONT","Hiragino Sans","ヒラギノ角ゴ ProN W3","Hiragino Kaku Gothic ProN",メイリオ,Meiryo,Osaka,"MS PGothic","Noto Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
        --font-display: var(--font-primary);
    }
    ```

??? examplecode "Example CSS for Noto Sans <small>(click here)</small>"
    ```css
    :lang(ja), :lang(ja-JP) {
        --font-primary: "gg sans","Noto Sans CJK JP","Hiragino Sans","ヒラギノ角ゴ ProN W3","Hiragino Kaku Gothic ProN",メイリオ,Meiryo,Osaka,"MS PGothic","Noto Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
        --font-display: var(--font-primary);
    }
    ```

??? examplecode "Discord's default CSS <small>(click here)</small>"
    ```css
    :lang(ja), :lang(ja-JP) {
        --font-primary: "gg sans","Hiragino Sans","ヒラギノ角ゴ ProN W3","Hiragino Kaku Gothic ProN",メイリオ,Meiryo,Osaka,"MS PGothic","Noto Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
        --font-display: "gg sans","Hiragino Sans","ヒラギノ角ゴ ProN W3","Hiragino Kaku Gothic ProN",メイリオ,Meiryo,Osaka,"MS PGothic","Noto Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
    }
    ```

!!! note
    If you are using the browser version of Discord, you can also change the font with the
    [Stylus extension](https://github.com/openstyles/stylus).
    I personally don't use this, so I'll leave it to the user to figure out the settings. ;)

??? example "Changelog"

    - `22/12/01`: Changed `Whitney` to `gg sans` to match with Discord's new font
    - `22/12/05`: Added `--font-display`, added missing `Noto Sans` to all the fonts

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

??? example "Demo <small>(click here)</small>"

    {{ img("how to edit yomichan fields", "assets/jpresources/yomichan/howto_format.gif") }}

    The above showcases option 2 of
    [this example](jpresources.md#automatically-highlight-the-tested-word-within-the-sentence-upon-card-creation).

---

## How-To: Edit Yomichan Templates (Handlebars)
1. Navigate to Yomichan Settings.
1. Make sure that advanced settings are turned on (bottom left corner).
1. Go to the `Anki` section
1. Select `Configure Anki card templates...`

??? example "Demo <small>(click here)</small>"

    {{ img("how to edit yomichan templates", "assets/jpresources/yomichan/howto_templates.gif") }}

---


## Grab only the first pitch accent dictionary { .text-yellow }

Adds the following Yomichan Fields:

- `{pitch-accents-single-dict}`: Pitch accent in text (downstep) format
- `{pitch-accent-graphs-single-dict}`: Pitch accent in svg graph format
- `{pitch-accent-positions-single-dict}`: Pitch accent in positions (number) format


{% raw %}

??? examplecode "Template code <small>(click here)</small>"
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

??? examplecode "Modified version of the above for Anime Cards <small>(click here)</small>"

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
{% endraw %}

    <sup>
    (Thanks An#7416 for the template code.
    [Original message](https://discord.com/channels/617136488840429598/617228895573377054/998678002256855130)
    on {{ TMW_SERVER }}).
    </sup>




---



## Export only the selected text (only if text is selected) { .text-yellow }

> Adds: `{selection-text-or-glossary}`

!!! tip
    I recommend using `{jpmn-primary-definition}` from the [JPMN Handlebars Package](jpmnhandlebars.md)
    instead of this handlebars, because the handlebars package can do this and much more.

Allows you to export only a section of a glossary by highlighting over it,
and uses the glossary by default if you don't have anything highlighted.

??? examplecode "Template code <small>(click here)</small>"

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

> Adds: `{glossary-first}`

!!! tip
    I recommend using `{jpmn-primary-definition}` from the [JPMN Handlebars Package](jpmnhandlebars.md)
    instead of this handlebars, because the handlebars package can do this and much more.

The following grabs the first dictionary
(including every definition within said dictionary).

For further customization on how the first dictionary is selected
(say, for automatic bilingual / monolingual separation),
see the handlebars code used by jp-mining-note [here](setupyomichan.md#yomichan-templates).


??? examplecode "Template code <small>(click here)</small>"

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
        the desired region (say, with ++ctrl+b++) instead of having to edit
        the raw HTML of the field (say, with ++ctrl+shift+x++).

<sup>
See also: [How to automatically highlight the targetted word within the sentence
*for already existing cards*](https://github.com/MarvNC/JP-Resources#anki-automatically-highlight-in-sentence).
</sup>

---



## Plain-Style Sentence Furigana { .text-yellow }

> Adds: `{sentence-bolded-furigana-plain}`

This does the following:

- Generates plain style furigana on the sentence (e.g. 「 日本語[にほんご]」
- Bolds the added word


{% raw %}
To use this in Anki, add `furigana:` in front of the field within the template code.
For example, if your field is `SentenceReading`, use `{{furigana:SentenceReading}}`.

??? examplecode "Template code <small>(click here)</small>"
    ```handlebars
    {{#*inline "sentence-bolded-furigana-plain"}}
        {{~#if definition.cloze~}}

            {{~#regexReplace "(<span class=\"term\">)|(</span>)" "" "g"~}}
            {{~#regexReplace "<ruby>(.+?)<rt>(.+?)</rt></ruby>" " $1[$2]" "g"~}}

                {{~#if (hasMedia "textFurigana" definition.cloze.prefix)~}}
                    {{~#getMedia "textFurigana" definition.cloze.prefix escape=false}}{{/getMedia~}}
                {{~else~}}
                    {{~definition.cloze.prefix~}}
                {{~/if~}}

                <b>
                {{~#if (hasMedia "textFurigana" definition.cloze.body)~}}
                    {{~#getMedia "textFurigana" definition.cloze.body escape=false}}{{/getMedia~}}
                {{~else~}}
                    {{~definition.cloze.body~}}
                {{~/if~}}
                </b>

                {{~#if (hasMedia "textFurigana" definition.cloze.suffix)~}}
                    {{~#getMedia "textFurigana" definition.cloze.suffix escape=false}}{{/getMedia~}}
                {{~else~}}
                    {{~definition.cloze.suffix~}}
                {{~/if~}}

            {{~/regexReplace~}}
            {{~/regexReplace~}}

        {{~/if~}}
    {{/inline}}
    ```

    <sup>
    Thanks to [Skillesss](https://github.com/FooSoft/yomichan/issues/1952#issuecomment-922671489):
    for the base code and DaNautics#8833 for finding the above + removing the span classes
    </sup>

{% endraw %}

??? example "Comparisons to alternatives <small>(click here)</small>"

    - [AJT Furigana](https://ankiweb.net/shared/info/1344485230) can auto-generate furigana on card add
        and can add furigana to any text within a field even after a card add.
        However, generating furigana cannot be done within this addon on Android,
        as this is a PC add-on.

        Nonetheless, I recommend keeping AJT Furigana so furigana can be generated even after editing
        the sentence field.

    - The `{furigana}` marker provided by default in Yomichan does not generate plain style furigana,
        which makes editing furigana more difficult in Anki.




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



