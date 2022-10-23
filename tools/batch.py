# import json
# import urllib.request

import re
import argparse

from utils import invoke

# def request(action, **params):
#    return {"action": action, "params": params, "version": 6}
#
#
# def invoke(action, **params):
#    requestJson = json.dumps(request(action, **params)).encode("utf-8")
#    response = json.load(
#        urllib.request.urlopen(
#            urllib.request.Request("http://localhost:8765", requestJson)
#        )
#    )
#    if len(response) != 2:
#        raise Exception("response has an unexpected number of fields")
#    if "error" not in response:
#        raise Exception("response is missing required error field")
#    if "result" not in response:
#        raise Exception("response is missing required result field")
#    if response["error"] is not None:
#        raise Exception(response["error"])
#    return response["result"]


# removes all no pitch accent data fields

rx_END_DIV = re.compile(r'</div>$')
rx_FREQ_INNER2 = re.compile(r'<span class="frequencies__dictionary-inner2">(.*?)</span>')
rx_FURIGANA = re.compile(r" ?([^ >]+?)\[(.+?)\]");

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
        "--fill-field",
        type=str,
        help="fills a specific field of all JPMN notes with a value",
    )

    parser.add_argument(
        "--empty-field",
        type=str,
        help="empties a specific field of all JPMN notes",
    )


    return parser.parse_args()


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
        action = {
            "action": "updateNoteFields",
            "params": {"note": {"id": nid, "fields": {"PAGraphs": ""}}},
        }

        actions.append(action)

    notes = invoke("multi", actions=actions)


def add_downstep_inner_span_tag():
    """
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

        action = {
            "action": "updateNoteFields",
            "params": {
                "note": {
                    "id": info["noteId"],
                    "fields": {
                        "WordPitch": field_val,
                    },
                }
            },
        }

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
        action = {
            "action": "updateNoteFields",
            "params": {
                "note": {
                    "id": nid,
                    "fields": {"PASilence": "[sound:_silence.wav]"},
                }
            },
        }

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

        action = {
            "action": "updateNoteFields",
            "params": {
                "note": {
                    "id": info["noteId"],
                    "fields": {
                        "FrequenciesStylized": field_val,
                    },
                }
            },
        }

        actions.append(action)

    notes = invoke("multi", actions=actions)


def add_sort_freq_legacy():
    """
    Batch adds sort frequencies based off of the legacy frequency html

    DO NOT USE THIS for any version of the card below 0.10.2.0.
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

        #return None
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
            action = {
                "action": "updateNoteFields",
                "params": {
                    "note": {
                        "id": info["noteId"],
                        "fields": {
                            "FrequencySort": str(min_freq),
                        },
                    }
                },
            }

            actions.append(action)

    # print(actions)
    notes = invoke("multi", actions=actions)


def fill_field(field_name):

    notes = invoke("findNotes", query=r'"note:JP Mining Note"')

    # creates multi request
    actions = []

    for nid in notes:
        action = {
            "action": "updateNoteFields",
            "params": {
                "note": {
                    "id": nid,
                    "fields": {field_name: "1"},
                }
            },
        }

        actions.append(action)

    notes = invoke("multi", actions=actions)


def empty_field(field_name):

    notes = invoke("findNotes", query=r'"note:JP Mining Note"')

    # creates multi request
    actions = []

    for nid in notes:
        action = {
            "action": "updateNoteFields",
            "params": {
                "note": {
                    "id": nid,
                    "fields": {field_name: ""},
                }
            },
        }

        actions.append(action)

    notes = invoke("multi", actions=actions)


def _standardize_frequencies_styling(freq):
    # updating legacy freq styling 0.10.1.0 -> 0.10.2.0:
    # example of legacy freq styling (0.10.1.0):
    # r"""<div class="frequencies"><div class="frequencies__group" data-details="Anime &amp; Jdrama Freq:"><div class="frequencies__number"><span class="frequencies__number-inner">6155</span></div><div class="frequencies__dictionary"><span class="frequencies__dictionary-inner"><span class="frequencies__dictionary-inner2">Anime &amp; Jdrama Freq:</span></span></div></div><div class="frequencies__group" data-details="Innocent Ranked"><div class="frequencies__number"><span class="frequencies__number-inner">3863</span></div><div class="frequencies__dictionary"><span class="frequencies__dictionary-inner"><span class="frequencies__dictionary-inner2">Innocent Ranked</span></span></div></div><div class="frequencies__group" data-details="JPDB"><div class="frequencies__number"><span class="frequencies__number-inner">8418</span></div><div class="frequencies__dictionary"><span class="frequencies__dictionary-inner"><span class="frequencies__dictionary-inner2">JPDB</span></span></div></div><div class="frequencies__group" data-details="JPDB"><div class="frequencies__number"><span class="frequencies__number-inner">37625㋕</span></div><div class="frequencies__dictionary"><span class="frequencies__dictionary-inner"><span class="frequencies__dictionary-inner2">JPDB</span></span></div></div><div class="frequencies__group" data-details="VN Freq Percent"><div class="frequencies__number"><span class="frequencies__number-inner">92.7</span></div><div class="frequencies__dictionary"><span class="frequencies__dictionary-inner"><span class="frequencies__dictionary-inner2">VN Freq Percent</span></span></div></div></div>"""

    DIV_FREQ = '<div class="frequencies">'
    if DIV_FREQ in freq:
        freq = freq.replace(DIV_FREQ, "")
        freq = rx_END_DIV.sub("", freq)

    freq = rx_FREQ_INNER2.sub(r'\1', freq, count=0)
    return freq


def standardize_frequencies_styling():
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
                    "fields": {"FrequenciesStylized": _standardize_frequencies_styling(field_val)},
                }
            },
        }

        actions.append(action)

    notes = invoke("multi", actions=actions)


def _get_kana_from_plain_reading(plain_reading):
    result = plain_reading.replace("&nbsp;", " ")
    result = rx_FURIGANA.sub(r'\2', result, count=0)
    result = result.strip()

    return result


def fill_word_reading_hiragana_field():
    #print(_get_kana_from_plain_reading("成[な]り 立[た]つ"))

    import jaconv

    query = r'"note:JP Mining Note" -WordReading:'
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
        # NOTE: doesn't convert long katakana marks unfortunately
        hiragana = jaconv.kata2hira(reading)

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
        #print(field_val, hiragana)

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
    query = r'"note:JP Mining Note" tag:kanaonlyreading'
    _quick_fix_convert_kana_only_reading(query)

def quick_fix_convert_kana_only_reading_all_notes():
    query = r'"note:JP Mining Note"'
    _quick_fix_convert_kana_only_reading(query)





def main():
    args = get_args()

    if args.function:
        assert args.function in globals(), f"function {args.function} does not exist"
        func = globals()[args.function]
        print(f"executing {args.function}")
        func()

    elif args.fill_field:
        fill_field(args.fill_field)

    elif args.empty_field:
        empty_field(args.empty_field)


if __name__ == "__main__":
    main()
