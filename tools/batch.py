from __future__ import annotations

import os
import re
import argparse

import utils
from utils import invoke
from typing import Callable, Type, Any, Optional
import action_runner as ac
import note_changes as nc
import fields as flds
import install as instl
from jp_utils import kata2hira, is_hiragana, distribute_furigana, segments_to_plain_furigana


rx_END_DIV = re.compile(r"</div>$")
rx_FREQ_INNER2 = re.compile(
    r'<span class="frequencies__dictionary-inner2">(.*?)</span>'
)
rx_FURIGANA = re.compile(r" ?([^ >]+?)\[(.+?)\]")
rx_INTEGER_ONLY = re.compile(r"^-?\d+$")
rx_HTML = re.compile("<.*?>")
#rx_SOUND_TAG = re.compile(r"\[sound:([^]]+)\]") # captures just the file name
rx_SOUND_TAG = re.compile(r"\[sound:[^]]+\]")
rx_RUBY = re.compile(r"<ruby>(<rb>)?(?P<kanji>.*?)(</rb>)?<rt>(?P<furigana>.*?)</rt></ruby>")




# ==================
#  Helper functions
# ==================


def batch(query):
    def decorator(func):
        def wrapper(**kwargs):
            print("Querying notes...")
            notes = invoke("findNotes", query=query)

            print(f"Getting {len(notes)} notes info...")
            notes_info = invoke("notesInfo", notes=notes)

            print(f"Running {func.__name__}...")
            actions = func(notes_info, **kwargs)

            print(f"Updating {len(actions)} notes...")
            notes = invoke("multi", actions=actions)

        return wrapper

    return decorator


def _update_note_action(nid: int, **fields):
    return {
        "action": "updateNoteFields",
        "params": {"note": {"id": nid, "fields": fields}},
    }


def _get_kana_from_plain_reading(plain_reading):
    result = plain_reading.replace("&nbsp;", " ")
    result = rx_FURIGANA.sub(r"\2", result, count=0)
    result = result.strip()

    return result



# =================
#  Batch functions
# =================


def clear_pitch_accent_data():
    """
    removes all `No pitch accent data` fields
    """

    notes = invoke(
        "findNotes", query=r'"note:JP Mining Note" "PAGraphs:*No pitch accent data*"'
    )

    # creates multi request
    actions = []

    for nid in notes:
        action = _update_note_action(nid, PAGraphs="")
        actions.append(action)

    notes = invoke("multi", actions=actions)


def add_downstep_inner_span_tag():
    """
    (0.8.x.x -> 0.9.0.0)
    adds the inner span tag to all pitch accents
    """

    # notes = invoke("findNotes", query=r'"note:JP Mining Note" -WordPitch: added:3')
    notes = invoke("findNotes", query=r'"note:JP Mining Note" -WordPitch:')
    notes_info = invoke("notesInfo", notes=notes)

    # creates multi request
    actions = []

    for info in notes_info:
        field_val = info["fields"]["WordPitch"]["value"]

        SPAN_DOWNSTEP_EMPTY = '<span class="downstep" style="">ꜜ</span>'
        SPAN_DOWNSTEP_ARROW = '<span class="downstep">ꜜ</span>'
        SPAN_DOWNSTEP_UCODE = '<span class="downstep">&#42780;</span>'
        SPAN_DOWNSTEP_INNER = (
            '<span class="downstep"><span class="downstep-inner">&#42780;</span></span>'
        )

        # skips if the downstep-inner class is already found: nothing has to be done
        if "downstep-inner" in field_val:
            continue

        # cleaning up ig
        field_val = field_val.replace(SPAN_DOWNSTEP_EMPTY, SPAN_DOWNSTEP_UCODE)
        field_val = field_val.replace(SPAN_DOWNSTEP_ARROW, SPAN_DOWNSTEP_UCODE)

        # count1 = field_val.count('<span class="downstep">ꜜ</span>')
        # count2 = field_val.count("ꜜ")
        # if count1 != count2:
        #    print(info["fields"]["Key"]["value"], field_val, count1, count2)
        span_ucode_count = field_val.count(SPAN_DOWNSTEP_UCODE)
        previous_count = field_val.count("&#42780;")
        assert span_ucode_count == previous_count, (
            info["fields"]["Key"]["value"],
            field_val,
            span_ucode_count,
            previous_count,
        )

        field_val = field_val.replace(SPAN_DOWNSTEP_UCODE, SPAN_DOWNSTEP_INNER)
        new_count = field_val.count("&#42780;")
        assert previous_count == new_count

        # print(info["fields"]["Key"]["value"], field_val)

        nid = info["noteId"]
        action = _update_note_action(nid, WordPitch=field_val)

        actions.append(action)

    notes = invoke("multi", actions=actions)


def set_pasilence_field():
    """
    sets the `PASilence` field to `[sound:_silence.wav`]
    """

    notes = invoke("findNotes", query=r'"note:JP Mining Note"')

    # creates multi request
    actions = []

    for nid in notes:
        action = _update_note_action(nid, PASilence="[sound:_silence.wav]")
        actions.append(action)

    notes = invoke("multi", actions=actions)


def rename_vn_freq():
    """
    renames `VN Freq` -> `VN Freq Percent` in FrequenciesStylized
    """

    notes = invoke(
        "findNotes",
        query=r'"FrequenciesStylized:*>VN Freq<*" OR "FrequenciesStylized:*data-details=\"VN Freq\"*"',
    )
    notes_info = invoke("notesInfo", notes=notes)

    actions = []
    for info in notes_info:
        field_val = info["fields"]["FrequenciesStylized"]["value"]
        field_val = field_val.replace(">VN Freq<", ">VN Freq Percent<")
        field_val = field_val.replace('"VN Freq"', '"VN Freq Percent"')

        nid = info["noteId"]
        action = _update_note_action(nid, FrequenciesStylized=field_val)
        actions.append(action)

    notes = invoke("multi", actions=actions)


def add_sort_freq_legacy():
    """
    Batch adds sort frequencies based off of the legacy frequency html format.
    DO NOT USE THIS for any version of the card below 0.10.2.0.

    Requires BeautifulSoup.
    """

    # pip3 install beautifulsoup4
    from bs4 import BeautifulSoup

    def parse_str(html_str, ignored):
        soup = BeautifulSoup(html_str, "html.parser")

        assert soup.div is not None

        freqs = []
        for x in soup.div.children:
            if x["data-details"] not in ignored:
                freq = int(
                    "".join(c for c in str(x.div.span.get_text()) if c.isdigit())
                )
                freqs.append(freq)

        if freqs:
            return min(freqs)

        # return None
        return 0

    ignored = ["VN Freq Percent"]

    notes = invoke("findNotes", query=r"-FrequenciesStylized:")
    notes_info = invoke("notesInfo", notes=notes)

    actions = []
    for info in notes_info:
        field_val = info["fields"]["FrequenciesStylized"]["value"]
        # print("parsing", info["fields"]["Key"]["value"])

        min_freq = parse_str(field_val, ignored)
        if min_freq is not None:
            nid = info["noteId"]
            action = _update_note_action(nid, FrequencySort=str(min_freq))
            actions.append(action)

    # print(actions)
    notes = invoke("multi", actions=actions)


def fill_field(field_name: str, value: str = "1", query: Optional[str] = None):
    """
    batch set the field to `1`
    """

    print(f"Querying notes...")
    if query is None:
        query = '"note:JP Mining Note"'
    notes = invoke("findNotes", query=query)

    # creates multi request
    print(f"Creating actions...")
    actions = []

    for nid in notes:
        action = _update_note_action(nid, **{field_name: value})
        actions.append(action)

    print(f"Filling {len(notes)} notes with {repr(value)}...")
    notes = invoke("multi", actions=actions)


def empty_field(field_name: str, query: Optional[str] = None):
    """
    batch empties the field
    """

    print(f"Querying notes...")
    if query is None:
        query = f'"note:JP Mining Note" -"{field_name}:"'
    notes = invoke("findNotes", query=query)

    # creates multi request
    print(f"Creating actions...")
    actions = []

    for nid in notes:
        action = _update_note_action(nid, **{field_name: ""})
        actions.append(action)

    print(f"Emptying {len(notes)} notes...")
    notes = invoke("multi", actions=actions)


def add_to_field(field_name: str, value: str, query: Optional[str] = None):
    """
    concatenates the given value to the existing field value
    """

    print("Querying notes...")
    if query is None:
        query = '"note:JP Mining Note"'
    notes = invoke("findNotes", query=query)

    print("Getting notes info...")
    notes_info = invoke("notesInfo", notes=notes)

    print(f"Adding '{value}' to {field_name}...")
    actions = []
    for info in notes_info:
        nid = info["noteId"]
        field_val = info["fields"][field_name]["value"]
        action = _update_note_action(nid, **{field_name: field_val + value})
        actions.append(action)

    print("Updating notes...")
    notes = invoke("multi", actions=actions)



def copy_field(src: str, dest: str, query: Optional[str] = None):
    """
    copies the field contents of src to dest
    """

    print("Querying notes...")
    if query is None:
        query = '"note:JP Mining Note"'
    notes = invoke("findNotes", query=query)

    print("Getting notes info...")
    notes_info = invoke("notesInfo", notes=notes)

    print(f"Copying field {src} to {dest}...")
    actions = []
    for info in notes_info:
        nid = info["noteId"]
        field_val = info["fields"][src]["value"]
        action = _update_note_action(nid, **{dest: field_val})
        actions.append(action)

    print("Updating notes...")
    notes = invoke("multi", actions=actions)


def _standardize_frequencies_styling(freq):
    # updating legacy freq styling 0.10.1.0 -> 0.10.2.0:
    # example of legacy freq styling (0.10.1.0):
    # r"""<div class="frequencies"><div class="frequencies__group" data-details="Anime &amp; Jdrama Freq:"><div class="frequencies__number"><span class="frequencies__number-inner">6155</span></div><div class="frequencies__dictionary"><span class="frequencies__dictionary-inner"><span class="frequencies__dictionary-inner2">Anime &amp; Jdrama Freq:</span></span></div></div><div class="frequencies__group" data-details="Innocent Ranked"><div class="frequencies__number"><span class="frequencies__number-inner">3863</span></div><div class="frequencies__dictionary"><span class="frequencies__dictionary-inner"><span class="frequencies__dictionary-inner2">Innocent Ranked</span></span></div></div><div class="frequencies__group" data-details="JPDB"><div class="frequencies__number"><span class="frequencies__number-inner">8418</span></div><div class="frequencies__dictionary"><span class="frequencies__dictionary-inner"><span class="frequencies__dictionary-inner2">JPDB</span></span></div></div><div class="frequencies__group" data-details="JPDB"><div class="frequencies__number"><span class="frequencies__number-inner">37625㋕</span></div><div class="frequencies__dictionary"><span class="frequencies__dictionary-inner"><span class="frequencies__dictionary-inner2">JPDB</span></span></div></div><div class="frequencies__group" data-details="VN Freq Percent"><div class="frequencies__number"><span class="frequencies__number-inner">92.7</span></div><div class="frequencies__dictionary"><span class="frequencies__dictionary-inner"><span class="frequencies__dictionary-inner2">VN Freq Percent</span></span></div></div></div>"""

    DIV_FREQ = '<div class="frequencies">'
    if DIV_FREQ in freq:
        freq = freq.replace(DIV_FREQ, "")
        freq = rx_END_DIV.sub("", freq)

    freq = rx_FREQ_INNER2.sub(r"\1", freq, count=0)
    return freq


def standardize_frequencies_styling():
    """
    (0.10.1.0 -> 0.10.2.0)
    removes the surrounding <div class="frequencies"> within the FrequenciesStylized field.
    """

    query = r'"FrequenciesStylized:*<div class=\"frequencies\">*" OR "FrequenciesStylized:*<span class=\"frequencies__dictionary-inner2\">*"'

    notes = invoke("findNotes", query=query)
    notes_info = invoke("notesInfo", notes=notes)

    actions = []
    for info in notes_info:
        field_val = info["fields"]["FrequenciesStylized"]["value"]

        action = {
            "action": "updateNoteFields",
            "params": {
                "note": {
                    "id": info["noteId"],
                    "fields": {
                        "FrequenciesStylized": _standardize_frequencies_styling(
                            field_val
                        )
                    },
                }
            },
        }

        actions.append(action)

    notes = invoke("multi", actions=actions)


def fill_word_reading_hiragana_field():
    """
    populates the WordReadingHiragana field by the WordReading field
    """

    # print(_get_kana_from_plain_reading("成[な]り 立[た]つ"))

    query = r'"note:JP Mining Note" -WordReading: WordReadingHiragana:'
    print("Querying notes...")
    notes = invoke("findNotes", query=query)
    print("Getting notes info...")
    notes_info = invoke("notesInfo", notes=notes)

    print("Converting kanji reading -> hiragana reading...")
    actions = []
    for info in notes_info:
        field_val = info["fields"]["WordReading"]["value"]
        reading = _get_kana_from_plain_reading(field_val)
        # standardizes all katakana -> hiragana
        hiragana = kata2hira(reading)

        action = {
            "action": "updateNoteFields",
            "params": {
                "note": {
                    "id": info["noteId"],
                    "fields": {"WordReadingHiragana": hiragana},
                }
            },
        }

        actions.append(action)
        # print(field_val, hiragana)

    print("Updating notes...")
    notes = invoke("multi", actions=actions)


def _quick_fix_convert_kana_only_reading(query):
    print("Querying notes...")
    notes = invoke("findNotes", query=query)
    print("Getting notes info...")
    notes_info = invoke("notesInfo", notes=notes)

    print("Converting WordReading -> Word[WordReading]")
    actions = []
    for info in notes_info:
        word_field = info["fields"]["Word"]["value"]
        word_reading_field = info["fields"]["WordReading"]["value"]
        result = f"{word_field}[{word_reading_field}]"

        action = {
            "action": "updateNoteFields",
            "params": {
                "note": {
                    "id": info["noteId"],
                    "fields": {"WordReading": result},
                }
            },
        }

        actions.append(action)
        print(result)

    print("Updating notes...")
    notes = invoke("multi", actions=actions)


def quick_fix_convert_kana_only_reading_with_tag():
    """
    converts the WordReading field to the `Word[WordReading]` format
    (only for notes with tag:kanareadingonly)

    DEPRECATED for 0.12.0.0!
    """

    query = r'"note:JP Mining Note" tag:kanaonlyreading'
    _quick_fix_convert_kana_only_reading(query)


def quick_fix_convert_kana_only_reading_all_notes():
    """
    converts the WordReading field to the `Word[WordReading]` format
    (for all notes)
    """
    query = r'"note:JP Mining Note"'
    _quick_fix_convert_kana_only_reading(query)


def clean_word_reading_field(query: Optional[str] = None):
    """
    Converts the WordReading field to the plain furigana (Word[WordReading]) format,
    given the WordReading is either plain kana, or raw ruby text.
    """
    print("Querying notes...")
    if query is None:
        query = r'"note:JP Mining Note"'
    notes = invoke("findNotes", query=query)
    print("Getting notes info...")
    notes_info = invoke("notesInfo", notes=notes)

    print("Converting WordReading -> Word[WordReading]")
    actions = []
    for info in notes_info:
        word_field = info["fields"]["Word"]["value"].strip()
        word_reading_field = info["fields"]["WordReading"]["value"].strip()

        # Sanity checks
        if word_field == word_reading_field:
            continue
        if "[" in word_reading_field or "]" in word_reading_field:
            continue # nothing to do, it's already plain furigana!

        if "<ruby>" in word_reading_field:
            result = rx_RUBY.sub(r" \g<kanji>[\g<furigana>]", word_reading_field)
        else:
            result = segments_to_plain_furigana(distribute_furigana(word_field, word_reading_field))

        action = {
            "action": "updateNoteFields",
            "params": {
                "note": {
                    "id": info["noteId"],
                    "fields": {"WordReading": result},
                }
            },
        }

        actions.append(action)
        print(word_reading_field, "->", result)

    print("Updating notes...")
    notes = invoke("multi", actions=actions)


def separate_pa_override_field():
    """
    (0.10.2.0 -> 0.11.0.0)
    If the PAOverride field is exactly a digit, then keep in PAOverride.
    Otherwise, move to PAOverrideText
    """

    query = r'"note:JP Mining Note" -PAOverride:'
    print("Querying notes...")
    notes = invoke("findNotes", query=query)
    print("Getting notes info...")
    notes_info = invoke("notesInfo", notes=notes)

    print("Separating PAOverride field...")
    actions = []
    for info in notes_info:
        field_val = info["fields"]["PAOverride"]["value"]

        if not rx_INTEGER_ONLY.match(field_val.strip()):
            action = {
                "action": "updateNoteFields",
                "params": {
                    "note": {
                        "id": info["noteId"],
                        "fields": {"PAOverride": "", "PAOverrideText": field_val},
                    }
                },
            }

            actions.append(action)
            # print(info["fields"]["Key"]["value"], field_val)

    print("Updating notes...")
    notes = invoke("multi", actions=actions)


def remove_bolded_text_ajtwordpitch():
    """
    (0.11.x.x -> 0.12.0.0)
    Removes bolded text in AJTWordPitch

    TODO
    """

    query = r'"note:JP Mining Note" (AJTWordPitch:*<b>* OR AJTWordPitch:*</b>*)'
    print("Querying notes...")
    notes = invoke("findNotes", query=query)
    print("Getting notes info...")
    notes_info = invoke("notesInfo", notes=notes)

    print("Removing bolded text...")
    actions = []
    for info in notes_info:
        ajt_word_pitch = info["fields"]["AJTWordPitch"]["value"]
        pa_override = info["fields"]["PAOverride"]["value"]
        pa_override_text = info["fields"]["PAOverrideText"]["value"]
        pa_positions = info["fields"]["PAPositions"]["value"]

        field_updates = {
            "AJTWordPitch": ajt_word_pitch.replace("<b>", "").replace("</b>", ""),
        }
        if (pa_positions + pa_override_text + pa_override).strip() == "":
            # empty, i.e. only ajt_word_pitch is currently used!
            # safe to set PAOverrideText
            field_updates["PAOverrideText"] = ajt_word_pitch

        action = {
            "action": "updateNoteFields",
            "params": {
                "note": {
                    "id": info["noteId"],
                    "fields": field_updates,
                }
            },
        }
        # print(field_updates)

        actions.append(action)

    print("Updating notes...")
    notes = invoke("multi", actions=actions)


def combine_backup_xelieu():
    """
    (0.11.x.x -> 0.12.0.0)
    adhoc function to transfer Xelieu's notes to JPMN, combining monolingual fields properly
    """

    query = r'"note:Mining Format" Glossary:'
    print("Querying monolingual notes...")
    notes = invoke("findNotes", query=query)
    print("Getting notes info...")
    notes_info = invoke("notesInfo", notes=notes)

    print("Combining monolingual & bilingual fields...")
    bilingual_fields = ["JMDict", "Kenkyusha"]
    monolingual_fields = [
        "Shinjirin",
        "Oukoku",
        "Daijisen",
        "Meikyou",
        "Jitsuyou",
        "Shinmeikai",
    ]

    def combine_defs(defs):
        return "<ol>" + "".join(f"<li>{x}</li>" for x in defs) + "</ol>"

    actions = []
    for info in notes_info:
        glossary_sel_txt = info["fields"]["Glossary-Selected"]["value"]
        bilingual_def_txt = info["fields"]["Glossary"]["value"]

        bilingual_defs = [info["fields"][x]["value"].strip() for x in bilingual_fields]
        bilingual_defs = [
            x for x in bilingual_defs if x
        ]  # filters out all empty fields

        monolingual_defs = [
            info["fields"][x]["value"].strip() for x in monolingual_fields
        ]
        monolingual_defs = [
            x for x in monolingual_defs if x
        ]  # filters out all empty fields

        if glossary_sel_txt:  # almost always bilingual according to bilingual_def_txt
            primary_def_txt = glossary_sel_txt
            secondary_def_txt = bilingual_def_txt
            extra_defs_txt = combine_defs(monolingual_defs)

        elif bilingual_def_txt:
            primary_def_txt = bilingual_def_txt
            secondary_def_txt = ""
            extra_defs_txt = combine_defs(monolingual_defs)

        else:
            primary_def_txt = monolingual_defs[0] if monolingual_defs else ""
            secondary_def_txt = combine_defs(bilingual_defs)
            extra_defs = monolingual_defs[1:]
            if len(extra_defs) == 0:
                extra_defs_txt = ""
            else:
                extra_defs_txt = (
                    "<ol>" + "".join(f"<li>{x}</li>" for x in extra_defs) + "</ol>"
                )

        action = {
            "action": "updateNoteFields",
            "params": {
                "note": {
                    "id": info["noteId"],
                    "fields": {
                        "PrimaryDefinition": primary_def_txt,
                        "SecondaryDefinition": secondary_def_txt,
                        "ExtraDefinitions": extra_defs_txt,
                    },
                }
            },
        }

        actions.append(action)

    user_input = input(
        f"Will update {len(actions)} notes. Type 'yes' once you switched to JPMN deck.\n> "
    )
    if user_input != "yes":
        print("Input was not 'yes', exiting...")
        return
    notes = invoke("multi", actions=actions)


def remove_html(field_name: str):
    """
    naively removes all HTML from a particular field, with this regex: <.*?>
    """

    print("Querying notes...")
    query = f'"note:JP Mining Note" "{field_name}:*<*"'  # only queries notes with that HTML field
    notes = invoke("findNotes", query=query)

    print(f"Getting {len(notes)} notes info...")
    notes_info = invoke("notesInfo", notes=notes)

    print(f"Removing HTML from {field_name}...")
    actions = []
    for info in notes_info:
        nid = info["noteId"]
        field_val = info["fields"][field_name]["value"]
        field_val = re.sub(rx_HTML, "", field_val)
        action = _update_note_action(nid, **{field_name: field_val})
        actions.append(action)

    print(f"Updating {len(actions)} notes...")
    notes = invoke("multi", actions=actions)


def _construct_set_font_size(field: str, font_size: int):
    return {
        "action": "modelFieldSetFontSize",
        "version": 6,
        "params": {
            "modelName": "JP Mining Note",
            "fieldName": field,
            "fontSize": font_size,
        },
    }


def set_font_sizes() -> str | None:
    """
    sets the font size to be the expected font size for all fields
    """
    json_handler = utils.JsonHandler()
    fields = flds.get_fields(json_handler)
    anki_fields = set(utils.invoke("modelFieldNames", modelName="JP Mining Note"))
    actions = []

    for f in fields:
        if f.name in anki_fields:
            action = _construct_set_font_size(f.name, f.font)
            actions.append(action)

    invoke("multi", actions=actions)


def _construct_set_font(field: str, font: str):
    return {
        "action": "modelFieldSetFont",
        "version": 6,
        "params": {"modelName": "JP Mining Note", "fieldName": field, "font": font},
    }


def set_fonts_to_key_font() -> str | None:
    """
    sets the font name for all fields to be the exact same as whatever
    is set for the 'Key' field
    """
    fonts = utils.invoke("modelFieldFonts", modelName="JP Mining Note")
    anki_fields = utils.invoke("modelFieldNames", modelName="JP Mining Note")
    key_font = fonts["Key"]["font"]
    actions = []

    for f in anki_fields:
        action = _construct_set_font(f, key_font)
        actions.append(action)

    invoke("multi", actions=actions)


def verify_fields(version: Optional[str] = None) -> str | None:
    """
    checks that the fields are all there, in the correct order
    """
    expected_fields = nc.get_expected_fields(version)
    anki_fields = utils.invoke("modelFieldNames", modelName="JP Mining Note")
    v = ac.Verifier(anki_fields, expected_fields)
    fields_equal = expected_fields == anki_fields

    if not fields_equal:
        return v.naive_diff_list(anki_fields, expected_fields, "Anki", "Expected")


def _construct_add_field(field: str, index: int):
    return {
        "action": "modelFieldAdd",
        "version": 6,
        "params": {"modelName": "JP Mining Note", "fieldName": field, "index": index},
    }


def _construct_reposition_field(field: str, index: int):
    return {
        "action": "modelFieldReposition",
        "version": 6,
        "params": {"modelName": "JP Mining Note", "fieldName": field, "index": index},
    }


def _reorder_or_add_fields(construct_action: Callable, version=None):
    expected_fields = nc.get_expected_fields(version)

    # manually runs all the actions manually, no call to ActionRunner
    actions = []
    for i, field in enumerate(expected_fields):
        action = construct_action(field, i)
        actions.append(action)

    invoke("multi", actions=actions)


def reposition_fields(version=None):
    """
    repositions all existing fields in the fields list
    """
    _reorder_or_add_fields(_construct_reposition_field, version)


def add_fields(version=None):
    """
    adds all missing fields for the given version
    """
    _reorder_or_add_fields(_construct_add_field, version)


def _replace_runtime_options_file(backup_folder: str):
    """
    replace _jpmn-options.js with the example config
    """
    root_folder = utils.get_root_folder()
    input_folder = os.path.join(root_folder, "media")
    static_folder = os.path.join(root_folder, "media")
    media_installer = instl.MediaInstaller(input_folder, static_folder, backup_folder)
    media_installer.install("_jpmn-options.js", backup=True)


def replace_runtime_options_file():
    root_folder = utils.get_root_folder()
    user_files_path = os.path.join(root_folder, "user_files")
    if os.path.isdir(
        user_files_path
    ):  # if user_files exists, then we are very likely using jpmn-manager
        backup_folder = os.path.join(user_files_path, "backup", utils.get_time_str())
    else:
        backup_folder = os.path.join(root_folder, "backup", utils.get_time_str())
    _replace_runtime_options_file(backup_folder)


def _move_runtime_options_file(to_temp: bool):
    TEMP_FILE = "_jpmn-options-TEMP.js"
    OG_FILE = "_jpmn-options.js"
    media_dir_path = invoke("getMediaDirPath")
    temp_path = os.path.join(media_dir_path, TEMP_FILE)
    og_path = os.path.join(media_dir_path, OG_FILE)

    if to_temp:  # og -> temp
        if os.path.isfile(og_path):
            os.rename(og_path, temp_path)
            return "Please sync, and then run 'move_runtime_options_file_to_original'"
        raise RuntimeError(
            "Original runtime options file could not be found. Cannot move to temp file."
        )
    else:  # temp -> og
        if os.path.isfile(temp_path):
            os.rename(temp_path, og_path)
            return "Please sync again. The options file should be properly updated on all machines after syncing on said machines."
        raise RuntimeError(
            "Original runtime options file could not be found. Cannot move back to original file."
        )


def move_runtime_options_file_to_temp():
    return _move_runtime_options_file(to_temp=True)


def move_runtime_options_file_to_original():
    return _move_runtime_options_file(to_temp=False)


def fill_field_if_hiragana(field_name: str, value: str = "1", query: str | None = None):
    """
    fills the field_name with '1' if the Word field is purely hiragana
    """

    print(f"Querying notes...")
    if query is None:
        query = '"note:JP Mining Note"'

    notes = invoke("findNotes", query=query)
    notes_info = invoke("notesInfo", notes=notes)

    print(f"Creating actions...")
    actions = []
    for info in notes_info:
        nid = info["noteId"]
        field_val = info["fields"]["Word"]["value"]
        if is_hiragana(field_val):
            action = _update_note_action(nid, **{field_name: value})
            actions.append(action)

    print(f"Filling {len(actions)} notes with {repr(value)}...")
    notes = invoke("multi", actions=actions)


def get_new_due_cards(limit: int, as_query=True):
    print(f"Querying cards...")
    query = '"note:JP Mining Note" is:new -is:suspended'
    cards = invoke("findCards", query=query)

    print(f"Getting {len(cards)} cards info...")
    cards_info = invoke("cardsInfo", cards=cards)

    print(f"Sorting cards...")
    new_due_cards = sorted(cards_info, key=lambda x: x["due"])[:limit]

    ids = [x["cardId"] for x in new_due_cards]
    if as_query:
        result = " OR ".join([f"cid:{id}" for id in ids])
    else:
        result = ids
    print(result)
    return result


def cleanup():
    set_pasilence_field()
    clean_word_reading_field() # must be placed before fill_word_reading_hiragana_field
    fill_word_reading_hiragana_field() # expects plain furigana format in WordReading
    split_audio()
    split_picture()


def split_audio():
    """
    Splits two audio files from WordAudio -> WordAudio, SentenceAudio
    TODO: More options?
    """
    search_field = "WordAudio"
    #first_field = "WordAudio"

    print(f"Querying notes...")
    query = f'"note:JP Mining Note" -{search_field}: SentenceAudio:'
    notes = invoke("findNotes", query=query)

    print(f"Getting {len(notes)} notes info...")
    notes_info = invoke("notesInfo", notes=notes)

    print(f"Creating actions...")
    actions = []
    for info in notes_info:
        nid = info["noteId"]
        field_val = info["fields"][search_field]["value"]

        results = rx_SOUND_TAG.findall(field_val)
        if len(results) != 2:
            continue
        word_audio, sentence_audio = results

        action = _update_note_action(nid, **{"WordAudio": word_audio, "SentenceAudio": sentence_audio})
        actions.append(action)

    print(f"Updating {len(actions)} notes...")
    notes = invoke("multi", actions=actions)


def split_picture():
    """
    Splits two or more image files from Picture -> Picture, PrimaryDefinitionPicture
    TODO: More options?

    Requires beautifulsoup4, which should come with Anki by default.
    """

    try:
        # pip3 install beautifulsoup4
        from bs4 import BeautifulSoup
    except ImportError:
        BeautifulSoup = None

    if BeautifulSoup is None:
        print("Cannot run split_picture, beautifulsoup4 is not installed")
        return

    print(f"Querying notes...")
    query = f'"note:JP Mining Note" -Picture: PrimaryDefinitionPicture:'
    notes = invoke("findNotes", query=query)

    print(f"Getting {len(notes)} notes info...")
    notes_info = invoke("notesInfo", notes=notes)

    print(f"Creating actions...")
    actions = []
    for info in notes_info:
        nid = info["noteId"]
        field_val = info["fields"]["Picture"]["value"]

        soup = BeautifulSoup(field_val, "html.parser")
        images = [str(x) for x in soup.find_all("img")]
        if len(images) == 0:
            continue # nothing to do
        if len(images) == 1:
            # currently nothing to do. Might be useful to set the field eventually though,
            # to get rid of extra stuff like extraneous <br>'s?
            continue

        primary_pic = images[0]
        other_pics = images[1:]

        action = _update_note_action(nid, **{"Picture": primary_pic, "PrimaryDefinitionPicture": "".join(other_pics)})
        actions.append(action)

    print(f"Updating {len(actions)} notes...")
    notes = invoke("multi", actions=actions)


# NOTE: ideally, this would be best done with google.Fire, but this would introduce
# a dependency...
FUNC_ARGS: dict[Callable, dict[str, Type]] = {
    fill_field: {"field_name": str},
    empty_field: {"field_name": str},
    add_to_field: {
        "field_name": str,
        "value": str
    },
    copy_field: {
        "src": str,
        "dest": str,
    },
    remove_html: {"field_name": str},
    fill_field_if_hiragana: {"field_name": str},
    get_new_due_cards: {"limit": int},
}

FUNC_KWARGS: dict[Callable, dict[str, tuple[Type, Any]]] = {
    fill_field: {"value": (str, "1"), "query": (str, None)},
    empty_field: {"query": (str, None)},
    add_to_field: {"query": (str, None)},
    copy_field: {"query": (str, None)},
    verify_fields: {"version": (str, None)},
    reposition_fields: {"version": (str, None)},
    add_fields: {"version": (str, None)},
    fill_field_if_hiragana: {"value": (str, "1"), "query": (str, None)},
    clean_word_reading_field: {"query": (str, None)}
}


# functions available for the anki addon (should be everything but the xelieu function)
PUBLIC_FUNCTIONS_ANKI = [
    clear_pitch_accent_data,
    add_downstep_inner_span_tag,
    set_pasilence_field,
    rename_vn_freq,
    add_sort_freq_legacy,
    fill_field,
    empty_field,
    add_to_field,
    standardize_frequencies_styling,
    fill_word_reading_hiragana_field,
    quick_fix_convert_kana_only_reading_with_tag,
    quick_fix_convert_kana_only_reading_all_notes,
    clean_word_reading_field,
    separate_pa_override_field,
    remove_bolded_text_ajtwordpitch,
    # combine_backup_xelieu,
    copy_field,
    remove_html,
    verify_fields,
    reposition_fields,
    add_fields,
    set_font_sizes,
    set_fonts_to_key_font,
    replace_runtime_options_file,
    fill_field_if_hiragana,
    get_new_due_cards,
    move_runtime_options_file_to_temp,
    move_runtime_options_file_to_original,
    cleanup,
    split_audio,
    split_picture,
]


PUBLIC_FUNCTIONS = PUBLIC_FUNCTIONS_ANKI + [combine_backup_xelieu]

#PUBLIC_FUNCTIONS = [
#    clear_pitch_accent_data,
#    add_downstep_inner_span_tag,
#    set_pasilence_field,
#    rename_vn_freq,
#    add_sort_freq_legacy,
#    fill_field,
#    empty_field,
#    standardize_frequencies_styling,
#    fill_word_reading_hiragana_field,
#    quick_fix_convert_kana_only_reading_with_tag,
#    quick_fix_convert_kana_only_reading_all_notes,
#    clean_word_reading_field,
#    separate_pa_override_field,
#    remove_bolded_text_ajtwordpitch,
#    combine_backup_xelieu,
#    copy_field,
#    remove_html,
#    verify_fields,
#    reposition_fields,
#    add_fields,
#    set_font_sizes,
#    set_fonts_to_key_font,
#    replace_runtime_options_file,
#    fill_field_if_hiragana,
#    get_new_due_cards,
#    move_runtime_options_file_to_temp,
#    move_runtime_options_file_to_original,
#    cleanup,
#    split_audio,
#    split_picture,
#]


def get_args(public_functions: list[Callable], args: Optional[list[str]] = None):
    parser = argparse.ArgumentParser()

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
                subparser.add_argument(
                    "--" + arg.replace("_", "-"), type=ty, default=default
                )

    if args is None:
        return parser.parse_args()
    return parser.parse_args(args)


def main():
    args = get_args(PUBLIC_FUNCTIONS)
    if "func" in args:
        func_args = vars(args)
        func = func_args.pop("func")
        result = func(**func_args)
        if result is not None:
            print(result)


if __name__ == "__main__":
    main()
