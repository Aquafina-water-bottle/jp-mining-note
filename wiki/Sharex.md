




# f1: screenshot and clipboard
- adds the image to the note
- adds a tag to the note (tag is exactly the window name of the current application)
- adds the clipboard to AdditionalNotes (I use this for copying/pasting context)

```
-NoProfile -Command "function Run-Json { param( $json_map ); $json = $json_map | ConvertTo-Json -Depth 5; $data = Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType 'application/json; charset=UTF-8' -Body $json; return $data; }; $clipboard = (Get-Clipboard | where{$_ -ne \"\"}) -join \"<br>\"; $media_name = '$input' | Split-Path -leaf; $added_notes = Run-Json @{ action = 'findNotes'; version = 6; params = @{ query = 'added:1'; } }; $sorted_list = $added_notes.result | Sort-Object -Descending {[Long]$_}; $curr_note_id = $sorted_list[0]; Run-Json @{ action = 'updateNoteFields'; version = 6; params = @{ note = @{ id = $curr_note_id; fields = @{ Picture = \"<img data-editor-shrink=`\"true`\" src=`\"$media_name`\">\"; AdditionalNotes = $clipboard; } } } }; if ($media_name -match '(?<tag>.+)_.*') { $tag = $matches['tag']; } Run-Json @{ action = 'addTags'; version = 6; params = @{ notes = @($curr_note_id); tags = $tag; } };"
```

temp field
```
function Run-Json { param( $json_map ); $json = $json_map | ConvertTo-Json -Depth 5; $data = Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType 'application/json; charset=UTF-8' -Body $json; return $data; }; $clipboard = (Get-Clipboard | where{$_ -ne ""}) -join "<br>"; $media_name = '$input' | Split-Path -leaf; $added_notes = Run-Json @{ action = 'findNotes'; version = 6; params = @{ query = 'added:1'; } }; $sorted_list = $added_notes.result | Sort-Object -Descending {[Long]$_}; $curr_note_id = $sorted_list[0]; Run-Json @{ action = 'updateNoteFields'; version = 6; params = @{ note = @{ id = $curr_note_id; fields = @{ Picture = "<img data-editor-shrink=`"true`" src=`"$media_name`">"; AdditionalNotes = $clipboard; } } } }; if ($media_name -match '(?<tag>.+)_.*') { $tag = $matches['tag']; } Run-Json @{ action = 'addTags'; version = 6; params = @{ notes = @($curr_note_id); tags = $tag; } };
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



# shift+f1: screenshot (only)
- the above without clipboard (adds image and tag)

```
-NoProfile -Command "function Run-Json { param( $json_map ); $json = $json_map | ConvertTo-Json -Depth 5; $data = Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType 'application/json; charset=UTF-8' -Body $json; return $data; }; $media_name = '$input' | Split-Path -leaf; $added_notes = Run-Json @{ action = 'findNotes'; version = 6; params = @{ query = 'added:1'; } }; $sorted_list = $added_notes.result | Sort-Object -Descending {[Long]$_}; $curr_note_id = $sorted_list[0]; Run-Json @{ action = 'updateNoteFields'; version = 6; params = @{ note = @{ id = $curr_note_id; fields = @{ Picture = \"<img data-editor-shrink=`\"true`\" src=`\"$media_name`\">\"; } } } }; if ($media_name -match '(?<tag>.+)_.*') { $tag = $matches['tag'] } Run-Json @{ action = 'addTags'; version = 6; params = @{ notes = @($curr_note_id); tags = $tag; } };"
```

temp field
```
function Run-Json { param( $json_map ); $json = $json_map | ConvertTo-Json -Depth 5; $data = Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType 'application/json; charset=UTF-8' -Body $json; return $data; }; $media_name = '$input' | Split-Path -leaf; $added_notes = Run-Json @{ action = 'findNotes'; version = 6; params = @{ query = 'added:1'; } }; $sorted_list = $added_notes.result | Sort-Object -Descending {[Long]$_}; $curr_note_id = $sorted_list[0]; Run-Json @{ action = 'updateNoteFields'; version = 6; params = @{ note = @{ id = $curr_note_id; fields = @{ Picture = "<img data-editor-shrink=`"true`" src=`"$media_name`">"; } } } }; if ($media_name -match '(?<tag>.+)_.*') { $tag = $matches['tag'] } Run-Json @{ action = 'addTags'; version = 6; params = @{ notes = @($curr_note_id); tags = $tag; } };
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



# f2: audio
- adds audio to anki

```
-NoProfile -Command "function Run-Json { param( $json_map ); $json = $json_map | ConvertTo-Json -Depth 5; $data = Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType 'application/json; charset=UTF-8' -Body $json; return $data; }; $media_name = '$input' | Split-Path -leaf; $added_notes = Run-Json @{ action = 'findNotes'; version = 6; params = @{ query = 'added:1'; } }; $sorted_list = $added_notes.result | Sort-Object -Descending {[Long]$_}; $curr_note_id = $sorted_list[0]; Run-Json @{ action = 'updateNoteFields'; version = 6; params = @{ note = @{ id = $curr_note_id; fields = @{ SentenceAudio = \"[sound:$media_name]\"; } } } };"
```

temp field
```
function Run-Json { param( $json_map ); $json = $json_map | ConvertTo-Json -Depth 5; $data = Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType 'application/json; charset=UTF-8' -Body $json; return $data; }; $media_name = '$input' | Split-Path -leaf; $added_notes = Run-Json @{ action = 'findNotes'; version = 6; params = @{ query = 'added:1'; } }; $sorted_list = $added_notes.result | Sort-Object -Descending {[Long]$_}; $curr_note_id = $sorted_list[0]; Run-Json @{ action = 'updateNoteFields'; version = 6; params = @{ note = @{ id = $curr_note_id; fields = @{ SentenceAudio = "[sound:$media_name]"; } } } };
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



# shift+f3: update sentence
- update the sentence without losing the bold (python script + clipboard)
- remove sentence reading
- good for when the sentence just doesn't match

```
-NoProfile -Command "function Run-Json { param( $json_map ); $json = $json_map | ConvertTo-Json -Depth 5; $data = Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType 'application/json; charset=UTF-8' -Body $json; return $data; }; $clipboard = (Get-Clipboard | where{$_ -ne ''}) -join ''; $added_notes = Run-Json @{ action = 'findNotes'; version = 6; params = @{ query = 'added:1'; } }; $sorted_list = $added_notes.result | Sort-Object -Descending {[Long]$_}; $curr_note_id = $sorted_list[0]; $curr_note_data = Run-Json @{ action = 'notesInfo'; version = 6; params = @{ notes = @($curr_note_id); } }; $curr_note_sent = $curr_note_data.result.fields.Sentence.value; $result_sent = ''; if ($curr_note_sent -match '<b>(?<bolded>.+)</b>') { $bolded = $matches['bolded']; $result_sent = $clipboard.replace($bolded, \"<b>$bolded</b>\"); } else { $result_sent = $clipboard; }; Run-Json @{ action = 'updateNoteFields'; version = 6; params = @{ note = @{ id = $curr_note_id; fields = @{ Sentence = $result_sent; SentenceReading = ''; } } } };"
```

temp field
```
function Run-Json { param( $json_map ); $json = $json_map | ConvertTo-Json -Depth 5; $data = Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType 'application/json; charset=UTF-8' -Body $json; return $data; }; $clipboard = (Get-Clipboard | where{$_ -ne ''}) -join ''; $added_notes = Run-Json @{ action = 'findNotes'; version = 6; params = @{ query = 'added:1'; } }; $sorted_list = $added_notes.result | Sort-Object -Descending {[Long]$_}; $curr_note_id = $sorted_list[0]; $curr_note_data = Run-Json @{ action = 'notesInfo'; version = 6; params = @{ notes = @($curr_note_id); } }; $curr_note_sent = $curr_note_data.result.fields.Sentence.value; $result_sent = ''; if ($curr_note_sent -match '<b>(?<bolded>.+)</b>') { $bolded = $matches['bolded']; $result_sent = $clipboard.replace($bolded, "<b>$bolded</b>"); } else { $result_sent = $clipboard; }; Run-Json @{ action = 'updateNoteFields'; version = 6; params = @{ note = @{ id = $curr_note_id; fields = @{ Sentence = $result_sent; SentenceReading = ''; } } } };
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



# ctrl+f3 - copy from previous:
- set additional notes and picture to previous card
- also copy all tags
- good for adding more than 1 sentence with the same text box

```
-NoProfile -Command "function Run-Json { param( $json_map ); $json = $json_map | ConvertTo-Json -Depth 5; $data = Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType 'application/json; charset=UTF-8' -Body $json; return $data; }; $added_notes = Run-Json @{ action = 'findNotes'; version = 6; params = @{ query = 'added:1'; } }; $sorted_list = $added_notes.result | Sort-Object -Descending {[Long]$_}; $prev_note_id = $sorted_list[1]; $curr_note_id = $sorted_list[0]; $prev_note_data = Run-Json @{ action = 'notesInfo'; version = 6; params = @{ notes = @($prev_note_id); } }; Run-Json @{ action = 'updateNoteFields'; version = 6; params = @{ note = @{ id = $curr_note_id; fields = @{ Picture = $prev_note_data.result.fields.Picture.value; AdditionalNotes = $prev_note_data.result.fields.AdditionalNotes.value; } } } }; foreach ($tag in $prev_note_data.result.tags) { Run-Json @{ action = 'addTags'; version = 6; params = @{ notes = @($curr_note_id); tags = $tag; } } };"
```

temp field
```
function Run-Json { param( $json_map ); $json = $json_map | ConvertTo-Json -Depth 5; $data = Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType 'application/json; charset=UTF-8' -Body $json; return $data; }; $added_notes = Run-Json @{ action = 'findNotes'; version = 6; params = @{ query = 'added:1'; } }; $sorted_list = $added_notes.result | Sort-Object -Descending {[Long]$_}; $prev_note_id = $sorted_list[1]; $curr_note_id = $sorted_list[0]; $prev_note_data = Run-Json @{ action = 'notesInfo'; version = 6; params = @{ notes = @($prev_note_id); } }; Run-Json @{ action = 'updateNoteFields'; version = 6; params = @{ note = @{ id = $curr_note_id; fields = @{ Picture = $prev_note_data.result.fields.Picture.value; AdditionalNotes = $prev_note_data.result.fields.AdditionalNotes.value; } } } }; foreach ($tag in $prev_note_data.result.tags) { Run-Json @{ action = 'addTags'; version = 6; params = @{ notes = @($curr_note_id); tags = $tag; } } };
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



# ctrl+shift+f2: fix sentence and freq
- update the previous note with the current's frequency, sentence & sentence reading
- remove current note !
- good for the orthographic dict!

```
-NoProfile -Command "function Run-Json { param( $json_map ); $json = $json_map | ConvertTo-Json -Depth 5; $data = Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType 'application/json; charset=UTF-8' -Body $json; return $data; }; $added_notes = Run-Json @{ action = 'findNotes'; version = 6; params = @{ query = 'added:1'; } }; $sorted_list = $added_notes.result | Sort-Object -Descending {[Long]$_}; $prev_note_id = $sorted_list[1]; $curr_note_id = $sorted_list[0]; $curr_note_data = Run-Json @{ action = 'notesInfo'; version = 6; params = @{ notes = @($curr_note_id); } }; Run-Json @{ action = 'updateNoteFields'; version = 6; params = @{ note = @{ id = $prev_note_id; fields = @{ FrequenciesStylized = $curr_note_data.result.fields.FrequenciesStylized.value; Sentence = $curr_note_data.result.fields.Sentence.value; SentenceReading = $curr_note_data.result.fields.SentenceReading.value; } } } }; Run-Json @{ action = 'deleteNotes'; version = 6; params = @{ notes = @($curr_note_id); } };"
```

temp field
```
function Run-Json { param( $json_map ); $json = $json_map | ConvertTo-Json -Depth 5; $data = Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType 'application/json; charset=UTF-8' -Body $json; return $data; }; $added_notes = Run-Json @{ action = 'findNotes'; version = 6; params = @{ query = 'added:1'; } }; $sorted_list = $added_notes.result | Sort-Object -Descending {[Long]$_}; $prev_note_id = $sorted_list[1]; $curr_note_id = $sorted_list[0]; $curr_note_data = Run-Json @{ action = 'notesInfo'; version = 6; params = @{ notes = @($curr_note_id); } }; Run-Json @{ action = 'updateNoteFields'; version = 6; params = @{ note = @{ id = $prev_note_id; fields = @{ FrequenciesStylized = $curr_note_data.result.fields.FrequenciesStylized.value; Sentence = $curr_note_data.result.fields.Sentence.value; SentenceReading = $curr_note_data.result.fields.SentenceReading.value; } } } }; Run-Json @{ action = 'deleteNotes'; version = 6; params = @{ notes = @($curr_note_id); } };
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

