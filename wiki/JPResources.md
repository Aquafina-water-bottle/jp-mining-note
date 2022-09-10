



TODO flesh out!

- @ me on discord `Aquafina water bottle#3026`.
  I exist on the TheMoeWay and Refold (Japanese) servers.

- inspired by [marv's resources page](https://github.com/MarvNC/JP-Resources),
  which has a bunch of different but equally awesome resources.
  Highly recommend checking it out!


# Table of Contents
* [CSS (Yomichan)](jpresources#css-yomichan)
    * [How To](jpresources#how-to-add-custom-css-in-yomichan)
    * [Do not copy furigana](jpresources#copying-the-word-without-copying-the-furigana)
    * [Limiting the number of frequency lists](jpresources#limiting-the-number-of-frequency-lists)
    * [Limiting the number of pitch accent dictionaries](jpresources#limiting-the-number-of-pitch-accent-dictionaries)
    * [Hide the dictionary but allow it to be used by Anki](jpresources#hide-the-dictionary-but-allow-it-to-be-used-by-anki)
    * [Hide bilingual dictionaries until hover](jpresources#hide-bilingual-definitions-until-hover)
* [CSS (General)](jpresources#css-general)
    * [Ensuring the quote characters 「」 properly quotes the text]()
* [Yomichan Templates / Handlebars](jpresources#css-general)
    * How To ([Fields](jpresources#editing-yomichan-fields) and
          [Templates](jpresources#editing-yomichan-templates-handlebars))
    * [Grab only the first pitch accent dictionary](jpresources#grab-only-the-first-pitch-accent-dictionary)
    * [Automatically highlight the tested word within the sentence](jpresources#automatically-highlight-the-tested-word-within-the-sentence-upon-card-creation)
    * [Export only the selected text (only if text is selected)](jpresources#export-only-the-selected-text-only-if-text-is-selected)
    * [Further Reading](jpresources#further-reading)
* [ShareX](jpresources#sharex)




# CSS (Yomichan)

## How to add Custom CSS In Yomichan
To add custom CSS in Yomichan, do the following:
1. Head over to Yomichan settings (Yomichan extension marker -> cogwheel)
1. Go to `Appearance` →  `Configure custom CSS...`
1. Add the CSS to the top window.

[[assets/yomichan/howto_css.gif]]

## Copying the word without copying the furigana

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
- rule doesn't work on linux (tested on anki 2.1.54)
- works as normal on the browser though

<!--
TODO example gif
-->

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

## Ensuring the quote characters 「」 properly quotes the text

```css
.text {
  text-indent: -1em;
  padding-left: 1em;
}
```

[[assets/other/left_quote.png]] <br>
<sup>The first quote is the standard display without any custom CSS. The second quote is with the aforementioned CSS.</sup>

[(Example JSFiddle)](https://jsfiddle.net/Aquafina_water_bottle/5h8uxnko/12/)

<br>




# Yomichan Templates / Handlebars


## Editing Yomichan Fields
1. Navigate to Yomichan Settings.
1. Go to the `Anki` section.
1. Select `Anki card format...`.

[[assets/yomichan/howto_format.gif]]


## Editing Yomichan Templates (Handlebars)
1. Navigate to Yomichan Settings.
1. Make sure that advanced settings are turned on (bottom left corner).
1. Go to the `Anki` section
1. Select `Configure Anki card templates...`

[[assets/yomichan/howto_templates.gif]]

- TODO how to access handlebars
- TODO how to access format


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

<!-- https://discord.com/channels/617136488840429598/617228895573377054/998678002256855130 -->




## Automatically highlight the tested word within the sentence upon card creation

#### Option 1: Bold only
**Yomichan Fields**:
```
{cloze-prefix}<b>{cloze-body}</b>{cloze-suffix}
```


#### Option 2: Bold + Styling
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

#### Option 3: Custom div

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

* **Note**:
  I personally prefer using Option 2 (bolded) over a custom div
  because it makes editing the note easier.
  For example, if you want to edit the highlighted region, you only have to bold
  the desired region (say, with ctrl+b) instead of having to edit
  the raw HTML of the field (say, with ctrl+shift+x).


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

* **Note**:
  Related [Github issue](https://github.com/FooSoft/yomichan/issues/2097).



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

```
-NoProfile -Command "function Run-Json { param( $json_map ); $json = $json_map | ConvertTo-Json -Depth 5; $data = Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType 'application/json; charset=UTF-8' -Body $json; return $data; }; $clipboard = (Get-Clipboard | where{$_ -ne \"\"}) -join \"<br>\"; $media_name = '$input' | Split-Path -leaf; $added_notes = Run-Json @{ action = 'findNotes'; version = 6; params = @{ query = 'added:1'; } }; $sorted_list = $added_notes.result | Sort-Object -Descending {[Long]$_}; $curr_note_id = $sorted_list[0]; Run-Json @{ action = 'updateNoteFields'; version = 6; params = @{ note = @{ id = $curr_note_id; fields = @{ Picture = \"<img data-editor-shrink=`\"true`\" src=`\"$media_name`\">\"; AdditionalNotes = $clipboard; } } } }; if ($media_name -match '(?<tag>.+)_.*') { $tag = $matches['tag']; } Run-Json @{ action = 'addTags'; version = 6; params = @{ notes = @($curr_note_id); tags = $tag; } };"
```


<details>
<summary><i>Click here to see the original code.</i></summary>


    # (common begin)

    function Run-Json {
        param( $json_map );

        $json = $json_map | ConvertTo-Json -Depth 5;
        $data = Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType `
            'application/json; charset=UTF-8' -Body $json;

        return $data;
    };

    # (common end)



    $clipboard = (Get-Clipboard | where{$_ -ne ""}) -join "<br>";

    # gets only the file name
    $media_name = '$input' | Split-Path -leaf;

    $added_notes = Run-Json @{
        action = 'findNotes';
        version = 6;
        params = @{
            query = 'added:1';
        }
    };

    $sorted_list = $added_notes.result | Sort-Object -Descending {[Long]$_};

    $curr_note_id = $sorted_list[0];


    Run-Json @{
        action = 'updateNoteFields';
        version = 6;
        params = @{
            note = @{
                id = $curr_note_id;
                fields = @{
                    Picture = "<img data-editor-shrink=`"true`" src=`"$media_name`">";
                    AdditionalNotes = $clipboard;
                }
            }
        }
    };

    if ($media_name -match '(?<tag>.+)_.*') {
        $tag = $matches['tag'];
    }

    Run-Json @{
        action = 'addTags';
        version = 6;
        params = @{
            notes = @($curr_note_id);
            tags = $tag;
        }
    };



</details>
<br>



## shift+f1: screenshot (only)
- the above without clipboard (adds image and tag)

```
-NoProfile -Command "function Run-Json { param( $json_map ); $json = $json_map | ConvertTo-Json -Depth 5; $data = Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType 'application/json; charset=UTF-8' -Body $json; return $data; }; $media_name = '$input' | Split-Path -leaf; $added_notes = Run-Json @{ action = 'findNotes'; version = 6; params = @{ query = 'added:1'; } }; $sorted_list = $added_notes.result | Sort-Object -Descending {[Long]$_}; $curr_note_id = $sorted_list[0]; Run-Json @{ action = 'updateNoteFields'; version = 6; params = @{ note = @{ id = $curr_note_id; fields = @{ Picture = \"<img data-editor-shrink=`\"true`\" src=`\"$media_name`\">\"; } } } }; if ($media_name -match '(?<tag>.+)_.*') { $tag = $matches['tag'] } Run-Json @{ action = 'addTags'; version = 6; params = @{ notes = @($curr_note_id); tags = $tag; } };"
```


<details>
<summary><i>Click here to see the original code.</i></summary>


    # (common begin)

    function Run-Json {
        param( $json_map );

        $json = $json_map | ConvertTo-Json -Depth 5;
        $data = Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType `
            'application/json; charset=UTF-8' -Body $json;

        return $data;
    };

    # (common end)


    # gets only the file name
    $media_name = '$input' | Split-Path -leaf;

    $added_notes = Run-Json @{
        action = 'findNotes';
        version = 6;
        params = @{
            query = 'added:1';
        }
    };

    $sorted_list = $added_notes.result | Sort-Object -Descending {[Long]$_};

    $curr_note_id = $sorted_list[0];


    Run-Json @{
        action = 'updateNoteFields';
        version = 6;
        params = @{
            note = @{
                id = $curr_note_id;
                fields = @{
                    Picture = "<img data-editor-shrink=`"true`" src=`"$media_name`">";
                }
            }
        }
    };

    if ($media_name -match '(?<tag>.+)_.*') {
        $tag = $matches['tag']
    }

    Run-Json @{
        action = 'addTags';
        version = 6;
        params = @{
            notes = @($curr_note_id);
            tags = $tag;
        }
    };



</details>
<br>



## f2: audio
- adds audio to anki

```
-NoProfile -Command "function Run-Json { param( $json_map ); $json = $json_map | ConvertTo-Json -Depth 5; $data = Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType 'application/json; charset=UTF-8' -Body $json; return $data; }; $media_name = '$input' | Split-Path -leaf; $added_notes = Run-Json @{ action = 'findNotes'; version = 6; params = @{ query = 'added:1'; } }; $sorted_list = $added_notes.result | Sort-Object -Descending {[Long]$_}; $curr_note_id = $sorted_list[0]; Run-Json @{ action = 'updateNoteFields'; version = 6; params = @{ note = @{ id = $curr_note_id; fields = @{ SentenceAudio = \"[sound:$media_name]\"; } } } };"
```


<details>
<summary><i>Click here to see the original code.</i></summary>


    # (common begin)

    function Run-Json {
        param( $json_map );

        $json = $json_map | ConvertTo-Json -Depth 5;
        $data = Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType `
            'application/json; charset=UTF-8' -Body $json;

        return $data;
    };

    # (common end)


    # gets only the file name
    $media_name = '$input' | Split-Path -leaf;

    $added_notes = Run-Json @{
        action = 'findNotes';
        version = 6;
        params = @{
            query = 'added:1';
        }
    };

    $sorted_list = $added_notes.result | Sort-Object -Descending {[Long]$_};

    $curr_note_id = $sorted_list[0];


    Run-Json @{
        action = 'updateNoteFields';
        version = 6;
        params = @{
            note = @{
                id = $curr_note_id;
                fields = @{
                    SentenceAudio = "[sound:$media_name]";
                }
            }
        }
    };



</details>
<br>




## shift+f3: update sentence
- update the sentence without losing the bold (python script + clipboard)
- remove sentence reading
- good for when the sentence just doesn't match

```
-NoProfile -Command "function Run-Json { param( $json_map ); $json = $json_map | ConvertTo-Json -Depth 5; $data = Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType 'application/json; charset=UTF-8' -Body $json; return $data; }; $clipboard = (Get-Clipboard | where{$_ -ne ''}) -join ''; $added_notes = Run-Json @{ action = 'findNotes'; version = 6; params = @{ query = 'added:1'; } }; $sorted_list = $added_notes.result | Sort-Object -Descending {[Long]$_}; $curr_note_id = $sorted_list[0]; $curr_note_data = Run-Json @{ action = 'notesInfo'; version = 6; params = @{ notes = @($curr_note_id); } }; $curr_note_sent = $curr_note_data.result.fields.Sentence.value; $result_sent = ''; if ($curr_note_sent -match '<b>(?<bolded>.+)</b>') { $bolded = $matches['bolded']; $result_sent = $clipboard.replace($bolded, \"<b>$bolded</b>\"); } else { $result_sent = $clipboard; }; Run-Json @{ action = 'updateNoteFields'; version = 6; params = @{ note = @{ id = $curr_note_id; fields = @{ Sentence = $result_sent; SentenceReading = ''; } } } };"
```


<details>
<summary><i>Click here to see the original code.</i></summary>


    # (common begin)

    function Run-Json {
        param( $json_map );

        $json = $json_map | ConvertTo-Json -Depth 5;
        $data = Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType `
            'application/json; charset=UTF-8' -Body $json;

        return $data;
    };

    # (common end)



    $clipboard = (Get-Clipboard | where{$_ -ne ''}) -join '';

    $added_notes = Run-Json @{
        action = 'findNotes';
        version = 6;
        params = @{
            query = 'added:1';
        }
    };

    $sorted_list = $added_notes.result | Sort-Object -Descending {[Long]$_};

    $curr_note_id = $sorted_list[0];

    $curr_note_data = Run-Json @{
        action = 'notesInfo';
        version = 6;
        params = @{
            notes = @($curr_note_id);
        }
    };

    $curr_note_sent = $curr_note_data.result.fields.Sentence.value;
    $result_sent = '';

    if ($curr_note_sent -match '<b>(?<bolded>.+)</b>') {
        $bolded = $matches['bolded'];
        # may not replace anything
        $result_sent = $clipboard.replace($bolded, "<b>$bolded</b>");
    } else {
        # default
        $result_sent = $clipboard;
    };


    # updates current card with result_sent
    Run-Json @{
        action = 'updateNoteFields';
        version = 6;
        params = @{
            note = @{
                id = $curr_note_id;
                fields = @{
                    Sentence = $result_sent;
                    SentenceReading = '';
                }
            }
        }
    };



</details>
<br>



## ctrl+f3 - copy from previous:
- set additional notes and picture to previous card
- also copy all tags
- good for adding more than 1 sentence with the same text box

```
-NoProfile -Command "function Run-Json { param( $json_map ); $json = $json_map | ConvertTo-Json -Depth 5; $data = Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType 'application/json; charset=UTF-8' -Body $json; return $data; }; $added_notes = Run-Json @{ action = 'findNotes'; version = 6; params = @{ query = 'added:1'; } }; $sorted_list = $added_notes.result | Sort-Object -Descending {[Long]$_}; $prev_note_id = $sorted_list[1]; $curr_note_id = $sorted_list[0]; $prev_note_data = Run-Json @{ action = 'notesInfo'; version = 6; params = @{ notes = @($prev_note_id); } }; Run-Json @{ action = 'updateNoteFields'; version = 6; params = @{ note = @{ id = $curr_note_id; fields = @{ Picture = $prev_note_data.result.fields.Picture.value; AdditionalNotes = $prev_note_data.result.fields.AdditionalNotes.value; } } } }; foreach ($tag in $prev_note_data.result.tags) { Run-Json @{ action = 'addTags'; version = 6; params = @{ notes = @($curr_note_id); tags = $tag; } } };"
```


<details>
<summary><i>Click here to see the original code.</i></summary>


    # (common begin)

    function Run-Json {
        param( $json_map );

        $json = $json_map | ConvertTo-Json -Depth 5;
        $data = Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType `
            'application/json; charset=UTF-8' -Body $json;

        return $data;
    };

    # (common end)



    $added_notes = Run-Json @{
        action = 'findNotes';
        version = 6;
        params = @{
            query = 'added:1';
        }
    };

    $sorted_list = $added_notes.result | Sort-Object -Descending {[Long]$_};

    $prev_note_id = $sorted_list[1];
    $curr_note_id = $sorted_list[0];


    $prev_note_data = Run-Json @{
        action = 'notesInfo';
        version = 6;
        params = @{
            notes = @($prev_note_id);
        }
    };

    # copies picture & additional notes to current note
    Run-Json @{
        action = 'updateNoteFields';
        version = 6;
        params = @{
            note = @{
                id = $curr_note_id;
                fields = @{
                    Picture = $prev_note_data.result.fields.Picture.value;
                    AdditionalNotes = $prev_note_data.result.fields.AdditionalNotes.value;
                }
            }
        }
    };

    # copies tags
    foreach ($tag in $prev_note_data.result.tags) {
        Run-Json @{
            action = 'addTags';
            version = 6;
            params = @{
                notes = @($curr_note_id);
                tags = $tag;
            }
        }
    };



</details>
<br>



## ctrl+shift+f3: fix sentence and freq
- update the previous note with the current's frequency, sentence & sentence reading
- remove current note !
- good for the orthographic dict!

```
-NoProfile -Command "function Run-Json { param( $json_map ); $json = $json_map | ConvertTo-Json -Depth 5; $data = Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType 'application/json; charset=UTF-8' -Body $json; return $data; }; $added_notes = Run-Json @{ action = 'findNotes'; version = 6; params = @{ query = 'added:1'; } }; $sorted_list = $added_notes.result | Sort-Object -Descending {[Long]$_}; $prev_note_id = $sorted_list[1]; $curr_note_id = $sorted_list[0]; $curr_note_data = Run-Json @{ action = 'notesInfo'; version = 6; params = @{ notes = @($curr_note_id); } }; Run-Json @{ action = 'updateNoteFields'; version = 6; params = @{ note = @{ id = $prev_note_id; fields = @{ FrequenciesStylized = $curr_note_data.result.fields.FrequenciesStylized.value; Sentence = $curr_note_data.result.fields.Sentence.value; SentenceReading = $curr_note_data.result.fields.SentenceReading.value; } } } }; Run-Json @{ action = 'deleteNotes'; version = 6; params = @{ notes = @($curr_note_id); } };"
```


<details>
<summary><i>Click here to see the original code.</i></summary>


    # (common begin)

    function Run-Json {
        param( $json_map );

        $json = $json_map | ConvertTo-Json -Depth 5;
        $data = Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType `
            'application/json; charset=UTF-8' -Body $json;

        return $data;
    };

    # (common end)


    $added_notes = Run-Json @{
        action = 'findNotes';
        version = 6;
        params = @{
            query = 'added:1';
        }
    };

    $sorted_list = $added_notes.result | Sort-Object -Descending {[Long]$_};

    $prev_note_id = $sorted_list[1];
    $curr_note_id = $sorted_list[0];


    $curr_note_data = Run-Json @{
        action = 'notesInfo';
        version = 6;
        params = @{
            notes = @($curr_note_id);
        }
    };

    # copies frequency, sentence, sentence reading to previous note
    Run-Json @{
        action = 'updateNoteFields';
        version = 6;
        params = @{
            note = @{
                id = $prev_note_id;
                fields = @{
                    FrequenciesStylized = $curr_note_data.result.fields.FrequenciesStylized.value;
                    Sentence = $curr_note_data.result.fields.Sentence.value;
                    SentenceReading = $curr_note_data.result.fields.SentenceReading.value;
                }
            }
        }
    };

    # removes current note
    Run-Json @{
        action = 'deleteNotes';
        version = 6;
        params = @{
            notes = @($curr_note_id);
        }
    };



</details>
<br>







# Updated plugins for outdated plugins



## migaku
[migaku updated](https://github.com/MikeMoolenaar/Migaku-Japanese-Addon-Updated)
- fork of migaku to be updated for anki version 2.1.50+

[anki-jrp](https://github.com/Ben-Kerman/anki-jrp)
- completely stand-alone plugin from migaku with a completely different codebase
- only does one thing: adds pitch accent colors (along with furigana)


