from __future__ import annotations

import re
import argparse
from typing import Callable, Any

import pyperclip

from utils import invoke


rx_BOLD = re.compile(r"<b>(.+)</b>")



# function Anki-Browse {
#     param( $query );
#
#     Run-Json @{
#         action = 'guiBrowse';
#         version = 6;
#         params = @{
#             query = $query;
#         }
#     };
# };
def _browse_anki(query):
    invoke("guiBrowse", query=query)

def _get_sorted_list():
    # $added_notes = Run-Json @{
    #     action = 'findNotes';
    #     version = 6;
    #     params = @{
    #         query = 'added:1';
    #     }
    # };
    added_notes = invoke("findNotes", query="added:1")

    # $sorted_list = $added_notes.result | Sort-Object -Descending {[Long]$_};
    sorted_list = sorted(added_notes, reverse=True)

    return sorted_list


def _field_value(data, field_name):
    return data[0]["fields"][field_name]["value"]


def _update_field_clipboard(format_field_params: Callable[[str], dict[str, Any]], replace_newline="<br>"):
    # $clipboard = (Get-Clipboard | where{$_ -ne ''}) -join '';
    clipboard = pyperclip.paste().strip()
    clipboard = clipboard.replace("\n", replace_newline) # formatted for html

    curr_note_id = _get_sorted_list()[0]

    # $curr_note_data = Run-Json @{
    #     action = 'notesInfo';
    #     version = 6;
    #     params = @{
    #         notes = @($curr_note_id);
    #     }
    # };
    curr_note_data = invoke("notesInfo", notes=[curr_note_id])

    # $curr_note_sent = $curr_note_data.result.fields.Sentence.value;
    curr_note_sent = _field_value(curr_note_data, "Sentence")

    # $result_sent = '';
    # if ($curr_note_sent -match '<b>(?<bolded>.+)</b>') {
    #     $bolded = $matches['bolded'];
    #     # may not replace anything
    #     $result_sent = $clipboard.replace($bolded, "<b>$bolded</b>");
    # } else {
    #     # default
    #     $result_sent = $clipboard;
    # };
    result_sent = clipboard
    search_result = rx_BOLD.search(curr_note_sent)
    if search_result:
        bolded = search_result.group(1)
        result_sent = result_sent.replace(bolded, rf"<b>{bolded}</b>")

    print(f"「{curr_note_sent}」 -> 「{result_sent}」")

    # Run-Json @{
    #     action = 'updateNoteFields';
    #     version = 6;
    #     params = @{
    #         note = @{
    #             id = $curr_note_id;
    #             fields = @{
    #                 Sentence = $result_sent;
    #                 SentenceReading = '';
    #             }
    #         }
    #     }
    # };
    invoke(
        "updateNoteFields",
        note={
            "id": curr_note_id,
            # "fields": {"Sentence": result_sent, "SentenceReading": ""},
            "fields": format_field_params(result_sent),
        },
    )

    return curr_note_id


def update_sentence():
    return _update_field_clipboard(lambda x: {"Sentence": x, "SentenceReading": ""}, replace_newline="")


def update_additional_notes():
    return _update_field_clipboard(lambda x: {"AdditionalNotes": x})


def copy_from_previous():
    # $prev_note_id = $sorted_list[1];
    # $curr_note_id = $sorted_list[0];
    curr_note_id, prev_note_id = _get_sorted_list()[0:2]

    # $prev_note_data = Run-Json @{
    #     action = 'notesInfo';
    #     version = 6;
    #     params = @{
    #         notes = @($prev_note_id);
    #     }
    # };
    prev_note_data = invoke("notesInfo", notes=[prev_note_id])

    # # copies picture & additional notes to current note
    # Run-Json @{
    #     action = 'updateNoteFields';
    #     version = 6;
    #     params = @{
    #         note = @{
    #             id = $curr_note_id;
    #             fields = @{
    #                 Picture = $prev_note_data.result.fields.Picture.value;
    #                 AdditionalNotes = $prev_note_data.result.fields.AdditionalNotes.value;
    #             }
    #         }
    #     }
    # };
    invoke(
        "updateNoteFields",
        note={
            "id": curr_note_id,
            "fields": {
                "Picture": _field_value(prev_note_data, "Picture"),
                "AdditionalNotes": _field_value(prev_note_data, "AdditionalNotes"),
            },
        },
    )

    # # copies tags
    # foreach ($tag in $prev_note_data.result.tags) {
    #     Run-Json @{
    #         action = 'addTags';
    #         version = 6;
    #         params = @{
    #             notes = @($curr_note_id);
    #             tags = $tag;
    #         }
    #     }
    # };
    for tag in prev_note_data[0]["tags"]:
        invoke("addTags", notes=[curr_note_id], tags=tag)

    return curr_note_id


def fix_sent_and_freq():
    # $prev_note_id = $sorted_list[1];
    # $curr_note_id = $sorted_list[0];
    curr_note_id, prev_note_id = _get_sorted_list()[0:2]

    # $curr_note_data = Run-Json @{
    #     action = 'notesInfo';
    #     version = 6;
    #     params = @{
    #         notes = @($curr_note_id);
    #     }
    # };
    curr_note_data = invoke("notesInfo", notes=[curr_note_id])

    # # copies frequency, sentence, sentence reading to previous note
    # Run-Json @{
    #     action = 'updateNoteFields';
    #     version = 6;
    #     params = @{
    #         note = @{
    #             id = $prev_note_id;
    #             fields = @{
    #                 FrequenciesStylized = $curr_note_data.result.fields.FrequenciesStylized.value;
    #                 Sentence = $curr_note_data.result.fields.Sentence.value;
    #                 SentenceReading = $curr_note_data.result.fields.SentenceReading.value;
    #             }
    #         }
    #     }
    # };
    invoke(
        "updateNoteFields",
        note={
            "id": prev_note_id,
            "fields": {
                "FrequenciesStylized": _field_value(
                    curr_note_data, "FrequenciesStylized"
                ),
                "Sentence": _field_value(curr_note_data, "Sentence"),
                "SentenceReading": _field_value(curr_note_data, "SentenceReading"),
            },
        },
    )

    # # removes current note
    # Run-Json @{
    #     action = 'deleteNotes';
    #     version = 6;
    #     params = @{
    #         notes = @($curr_note_id);
    #     }
    # };
    invoke("deleteNotes", notes=[curr_note_id])

    return prev_note_id


def get_args():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-f",
        "--function",
        type=str,
        default=None,
        help="executes a specific function defined in this file",
    )

    parser.add_argument(
        "--enable-gui-browse",
        action="store_true",
        help="opens the newest card on run",
    )


    return parser.parse_args()


def main():
    args = get_args()

    # (comment copied from mpvacious)
    # AnkiConnect will fail to update the note if it's selected in the Anki Browser.
    # https://github.com/FooSoft/anki-connect/issues/82
    # Switch focus from the current note to avoid it.
    #
    #     self.gui_browse("nid:1") -- impossible nid (Lua)

    if args.enable_gui_browse:
        _browse_anki("nid:1")

    if args.function:
        assert args.function in globals(), f"function {args.function} does not exist"
        func = globals()[args.function]
        print(f"executing {args.function}")
        note_id = func()

        if args.enable_gui_browse:
            _browse_anki(f"nid:{note_id}")


if __name__ == "__main__":
    main()
