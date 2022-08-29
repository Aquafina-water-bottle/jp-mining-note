#import json
#import urllib.request

import argparse

from utils import invoke

#def request(action, **params):
#    return {"action": action, "params": params, "version": 6}
#
#
#def invoke(action, **params):
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




def get_args():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-f",
        "--function",
        type=str,
        default=None,
        help="executes a specific function defined in this file",
    )
    return parser.parse_args()


# def batch_field(field_name: str, lmbda):
def clear_pitch_accent_data():
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


# def batch_field(field_name: str, lmbda):
def rename_silence_wav():
    notes = invoke(
        "findNotes", query=r'"note:JP Mining Note"'
    )

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

    notes = invoke("findNotes", query=r'"FrequenciesStylized:*>VN Freq<*" OR "FrequenciesStylized:*data-details=\"VN Freq\"*"')
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


def add_sort_freq():
    # pip3 install beautifulsoup4
    from bs4 import BeautifulSoup

    def parse_str(html_str, ignored):
        soup = BeautifulSoup(html_str, 'html.parser')

        assert soup.div is not None

        freqs = []
        for x in soup.div.children:
            if x["data-details"] not in ignored:
                freq = int("".join(c for c in str(x.div.span.get_text()) if c.isdigit()))
                freqs.append(freq)

        if freqs:
            return min(freqs)

        return None


    ignored = ["VN Freq Percent"]

    notes = invoke("findNotes", query=r'-FrequenciesStylized:')
    notes_info = invoke("notesInfo", notes=notes)

    actions = []
    for info in notes_info:
        field_val = info["fields"]["FrequenciesStylized"]["value"]
        #print("parsing", info["fields"]["Key"]["value"])

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

    #print(actions)
    notes = invoke("multi", actions=actions)




def main():
    # clear_pitch_accent_data()
    # add_downstep_inner_span_tag()
    #rename_silence_wav()
    args = get_args()

    if args.function:
        assert args.function in globals(), f"function {args.function} does not exist"
        func = globals()[args.function]
        print(f"executing {args.function}")
        func()


    pass


if __name__ == "__main__":
    main()
