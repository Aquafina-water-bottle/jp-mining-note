from __future__ import annotations

import re
import json
import argparse
import urllib.request
import urllib.error
from typing import Callable, Any, Optional, Type


# copied/pasted from utils to not require any weird utils dependencies


# taken from https://github.com/FooSoft/anki-connect#python
def request(action: str, **params):
    return {"action": action, "params": params, "version": 6}


def invoke(action: str, **params):
    requestJson = json.dumps(request(action, **params)).encode("utf-8")
    response = json.load(
        urllib.request.urlopen(
            urllib.request.Request("http://localhost:8765", requestJson)
        )
    )
    if len(response) != 2:
        raise Exception("response has an unexpected number of fields")
    if "error" not in response:
        raise Exception("response is missing required error field")
    if "result" not in response:
        raise Exception("response is missing required result field")
    if response["error"] is not None:
        raise Exception(response["error"])
    return response["result"]


rx_BOLD = re.compile(r"<b>(.+)</b>")


def _browse_anki(query):
    invoke("guiBrowse", query=query)


def _get_sorted_list() -> list[str]:
    added_notes = invoke("findNotes", query="added:1")

    # sorts from newest to oldest
    sorted_list = sorted(added_notes, reverse=True)

    return sorted_list


def _field_value(data, field_name) -> str:
    return data[0]["fields"][field_name]["value"]


def add_image():
    pass


def _update_field_clipboard(
    format_field_params: Callable[[str], dict[str, Any]], replace_newline="<br>"
):
    import pyperclip


    clipboard = pyperclip.paste().strip()
    clipboard = clipboard.replace("\n", replace_newline)  # formatted for html

    curr_note_id = _get_sorted_list()[0]

    curr_note_data = invoke("notesInfo", notes=[curr_note_id])

    curr_note_sent = _field_value(curr_note_data, "Sentence")

    # attempts to bold sentence
    result_sent = clipboard
    search_result = rx_BOLD.search(curr_note_sent)
    if search_result:
        bolded = search_result.group(1)
        result_sent = result_sent.replace(bolded, rf"<b>{bolded}</b>")

    # print(f"「{curr_note_sent}」 -> 「{result_sent}」")

    invoke(
        "updateNoteFields",
        note={
            "id": curr_note_id,
            "fields": format_field_params(result_sent),
        },
    )

    return curr_note_id


def update_sentence():
    return _update_field_clipboard(
        lambda x: {"Sentence": x, "SentenceReading": ""}, replace_newline=""
    )


def update_additional_notes():
    return _update_field_clipboard(lambda x: {"AdditionalNotes": x})


def copy_from_previous():
    curr_note_id, prev_note_id = _get_sorted_list()[0:2]
    prev_note_data = invoke("notesInfo", notes=[prev_note_id])

    # copies picture & additional notes to current note
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

    # copies tags
    for tag in prev_note_data[0]["tags"]:
        invoke("addTags", notes=[curr_note_id], tags=tag)

    return curr_note_id


def fix_sent_and_freq():
    """
    copies the following from the previous note to current note:
    - Frequency
    - Sentence
    - SentenceReading
    - tags

    and deletes current note
    """
    curr_note_id, prev_note_id = _get_sorted_list()[0:2]
    curr_note_data = invoke("notesInfo", notes=[curr_note_id])

    fields = {
        "FrequenciesStylized": _field_value(curr_note_data, "FrequenciesStylized"),
        "Sentence": _field_value(curr_note_data, "Sentence"),
        "SentenceReading": _field_value(curr_note_data, "SentenceReading"),
        "AltDisplayClozeDeletionCard": _field_value(
            curr_note_data, "AltDisplayClozeDeletionCard"
        ),
    }

    # copies frequency, sentence, sentence reading to previous note
    invoke(
        "updateNoteFields",
        note={
            "id": prev_note_id,
            "fields": fields,
        },
    )

    # copies tags from current to previous note
    for tag in curr_note_data[0]["tags"]:
        invoke("addTags", notes=[prev_note_id], tags=tag)

    # removes current note
    invoke("deleteNotes", notes=[curr_note_id])

    return prev_note_id


def _bold_entire_sentence(sentence):
    result_sent = sentence.replace("<b>", "").replace("</b>", "")
    result_sent = f"<b>{result_sent}</b>"
    return result_sent



# NOTE: ideally, this would be best done with google.Fire, but this would introduce
# a dependency...
FUNC_ARGS: dict[Callable, dict[str, Type]] = {
    #fill_field: {"field_name": str},
}

FUNC_KWARGS: dict[Callable, dict[str, tuple[Type, Any]]] = {
    #fill_field: {"value": (str, "1"), "query": (str, None)},
}

PUBLIC_FUNCTIONS = [
    add_image,
    update_sentence,
    update_additional_notes,
    copy_from_previous,
    fix_sent_and_freq,
]


def get_args(public_functions: list[Callable], args: Optional[list[str]] = None):
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--enable-gui-browse",
        action="store_true",
        help="opens the newest card on run",
    )

    subparsers = parser.add_subparsers()

    for f in public_functions:
        subparser = subparsers.add_parser(f.__name__, help=f.__doc__)
        subparser.set_defaults(func=f)

        if f in FUNC_ARGS:
            for arg, ty in FUNC_ARGS[f].items():
                subparser.add_argument(
                    arg,
                    type=ty,
                )

        if f in FUNC_KWARGS:
            for arg, (ty, default) in FUNC_KWARGS[f].items():
                subparser.add_argument("--" + arg, type=ty, default=default)

    if args is None:
        return parser.parse_args()
    return parser.parse_args(args)





def main():
    args = get_args(PUBLIC_FUNCTIONS)

    # (comment copied from mpvacious)
    # AnkiConnect will fail to update the note if it's selected in the Anki Browser.
    # https://github.com/FooSoft/anki-connect/issues/82
    # Switch focus from the current note to avoid it.
    #
    #     self.gui_browse("nid:1") -- impossible nid (Lua)

    if args.enable_gui_browse:
        _browse_anki("nid:1")

    if "func" in args:
        func_args = vars(args)
        func = func_args.pop("func")
        note_id = func(**func_args)

        if args.enable_gui_browse and note_id is not None:
            _browse_anki(f"nid:{note_id}")


if __name__ == "__main__":
    main()
