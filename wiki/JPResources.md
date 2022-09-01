




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


