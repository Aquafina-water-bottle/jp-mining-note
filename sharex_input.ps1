# ==============
#  common front
# ==============

{% set COMMON_FRONT %}
# (common begin)

function Run-Json {
    param( $json_map );

    $json = $json_map | ConvertTo-Json -Depth 5;
    $data = Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType `
        'application/json; charset=UTF-8' -Body $json;

    return $data;
};

# (common end)
{% endset %}


{% set BROWSE_CARD %}

function Anki-Browse {
    param( $query );

    Run-Json @{
        action = 'guiBrowse';
        version = 6;
        params = @{
            query = $query;
        }
    };
};


# (comment copied from mpvacious)
# AnkiConnect will fail to update the note if it's selected in the Anki Browser.
# https://github.com/FooSoft/anki-connect/issues/82
# Switch focus from the current note to avoid it.
#self.gui_browse("nid:1") -- impossible nid
Anki-Browse 'nid:1';

{% endset %}

# use Anki-Browse 'nid:$curr_id_card'; at the end of the code block to properly refresh





# ============
#  screenshot
# ============

#-NoProfile -Command "$medianame = \"%input\" | Split-Path -leaf; $data = Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType 'application/json; charset=UTF-8' -Body '{\"action\": \"findNotes\", \"version\": 6, \"params\": {\"query\":\"added:1\"}}'; $sortedlist = $data.result | Sort-Object -Descending {[Long]$_}; $noteid = $sortedlist[0]; Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType 'application/json; charset=UTF-8' -Body \"{`\"action`\": `\"updateNoteFields`\", `\"version`\": 6, `\"params`\": {`\"note`\":{`\"id`\":$noteid, `\"fields`\":{`\"Picture`\":`\"<img src=$medianame>`\"}}}}\"; if ($medianame -match \"(?<tag>.+)_.*\") { $tag = $matches['tag']; Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType 'application/json; charset=UTF-8' -Body \"{`\"action`\": `\"addTags`\", `\"version`\": 6, `\"params`\": {`\"notes`\":[$noteid], `\"tags`\":`\"$tag`\"}}\";}


{% set screenshot %}

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

{% endset %}





# ==========================
#  screenshot and clipboard
# ==========================

#-NoProfile -Command "$clipboard = (Get-Clipboard | where{$_ -ne \"\"}) -join \"<br>\"; $medianame = \"%input\" | Split-Path -leaf; $data = Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType 'application/json; charset=UTF-8' -Body '{\"action\": \"findNotes\", \"version\": 6, \"params\": {\"query\":\"added:1\"}}'; $sortedlist = $data.result | Sort-Object -Descending {[Long]$_}; $noteid = $sortedlist[0]; Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType 'application/json; charset=UTF-8' -Body \"{`\"action`\": `\"updateNoteFields`\", `\"version`\": 6, `\"params`\": {`\"note`\":{`\"id`\":$noteid, `\"fields`\":{`\"AdditionalNotes`\":`\"$clipboard`\", `\"Picture`\":`\"<img src=$medianame>`\"}}}}\"; if ($medianame -match \"(?<tag>.+)_.*\") { $tag = $matches['tag']; Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType 'application/json; charset=UTF-8' -Body \"{`\"action`\": `\"addTags`\", `\"version`\": 6, `\"params`\": {`\"notes`\":[$noteid], `\"tags`\":`\"$tag`\"}}\";}


{% set screenshot_and_clipboard %}


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


# attempts to bold the found word within the clipboard
$curr_note_data = Run-Json @{
    action = 'notesInfo';
    version = 6;
    params = @{
        notes = @($curr_note_id);
    }
};
$curr_note_sent = $curr_note_data.result.fields.Sentence.value;
$result_clipboard = $clipboard;
if ($curr_note_sent -match '<b>(?<bolded>.+)</b>') {
    $bolded = $matches['bolded'];
    # may not replace anything
    $result_clipboard = $clipboard.replace($bolded, "<b>$bolded</b>");
};



Run-Json @{
    action = 'updateNoteFields';
    version = 6;
    params = @{
        note = @{
            id = $curr_note_id;
            fields = @{
                Picture = "<img data-editor-shrink=`"true`" src=`"$media_name`">";
                AdditionalNotes = $result_clipboard;
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

{% endset %}





# =======
#  audio
# =======

#-NoProfile -Command "$medianame = \"%input\" | Split-Path -leaf; $data = Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType 'application/json; charset=UTF-8' -Body '{\"action\": \"findNotes\", \"version\": 6, \"params\": {\"query\":\"added:1\"}}'; $sortedlist = $data.result | Sort-Object -Descending {[Long]$_}; $noteid = $sortedlist[0]; Invoke-RestMethod -Uri http://127.0.0.1:8765 -Method Post -ContentType 'application/json; charset=UTF-8' -Body \"{`\"action`\": `\"updateNoteFields`\", `\"version`\": 6, `\"params`\": {`\"note`\":{`\"id`\":$noteid, `\"fields`\":{`\"SentenceAudio`\":`\"[sound:$medianame]`\"}}}}\"; "



{% set audio %}

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

{% endset %}






# =================
#  update sentence
# =================

{% set update_sentence %}


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

{% endset %}






# =========================
#  update additional notes
# =========================

{% set update_additional_notes %}


$clipboard = (Get-Clipboard | where{$_ -ne ""}) -join "<br>";

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
                AdditionalNotes = $result_sent;
            }
        }
    }
};

{% endset %}







# ====================
#  copy from previous
# ====================

{% set copy_from_previous %}


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

{% endset %}








# ===================
#  fix sent and freq
# ===================

{% set fix_sent_and_freq %}

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

{% endset %}
