import os
import re

import math

FIELDS = {
    "Key": {
        "auto_fill": True,
        "binary_field": False,
        "reference": "fieldref.md#key-field",
        "setup": "{expression}",
        "anime_cards_import": "front",
    },

    "Word": {
        "auto_fill": True,
        "binary_field": False,
        #"reference": "cardtypes.md#vocab-card",
        "setup": "{expression}",
        "anime_cards_import": "front",
    },

    "WordReading": {
        "auto_fill": True,
        "binary_field": False,
        #"reference": "fieldref.md#",
        "setup": "{furigana-plain}",
        "anime_cards_import": "Reading",
    },

    "PAOverride": {
        "auto_fill": False,
        "binary_field": False,
        "reference": "autopa.md#how-pitch-accent-is-selected",
    },

    "AJTWordPitch": {
        "auto_fill": True,
        "binary_field": False,
        "reference": "setup.md#ajt-pitch-accent",
    },

    "PrimaryDefinition": {
        "auto_fill": True,
        "binary_field": False,
        "reference": "fieldref.md#modifying-the-back-side",
        "setup": "{jpmn-primary-definition}",
        "anime_cards_import": "Glossary",
    },

    "Sentence": {
        "auto_fill": True,
        "binary_field": False,
        #"reference": "fieldref.md#card-types",
        "setup": "{cloze-prefix}<b>{cloze-body}</b>{cloze-suffix}",
        "anime_cards_import": "Sentence",
    },

    "SentenceReading": {
        "auto_fill": True,
        "binary_field": False,
        "reference": "setup.md#ajt-furigana",
    },

    "AltDisplay": {
        "auto_fill": False,
        "binary_field": False,
        "reference": "fieldref.md#changing-the-displayed-content",
    },

    "AltDisplayPASentenceCard": {
        "auto_fill": False,
        "binary_field": False,
        "reference": "fieldref.md#modifying-pitch-accent-sentence-cards",
    },

    "AdditionalNotes": {
        "auto_fill": False,
        "binary_field": False,
        "reference": "fieldref.md#modifying-the-back-side",
    },

    "IsSentenceCard": {
        "auto_fill": False,
        "binary_field": True,
        "reference": "cardtypes.md#sentence-card",
    },

    "IsClickCard": {
        "auto_fill": False,
        "binary_field": True,
        "reference": "cardtypes.md#hybrid-cards",
        "personal_setup": "1",
    },

    "IsHoverCard": {
        "auto_fill": False,
        "binary_field": True,
        "reference": "cardtypes.md#hybrid-cards",
    },

    "IsTargetedSentenceCard": {
        "auto_fill": False,
        "binary_field": True,
        "reference": "cardtypes.md#targetted-sentence-card-tsc",
    },

    "PAShowInfo": {
        "auto_fill": False,
        "binary_field": True,
        "reference": "fieldref.md#testing-pitch-accent",
        "personal_setup": "1",
    },

    "PATestOnlyWord": {
        "auto_fill": False,
        "binary_field": True,
        "reference": "fieldref.md#selecting-the-pitch-accent",
        "personal_setup": "1",
    },

    "PADoNotTest": {
        "auto_fill": False,
        "binary_field": True,
        "reference": "fieldref.md#selecting-the-pitch-accent",
    },

    "PASeparateWordCard": {
        "auto_fill": False,
        "binary_field": True,
        "reference": "fieldref.md#selecting-the-pitch-accent",
    },

    "PASeparateSentenceCard": {
        "auto_fill": False,
        "binary_field": True,
        "reference": "fieldref.md#selecting-the-pitch-accent",
    },

    "SeparateClozeDeletionCard": {
        "auto_fill": False,
        "binary_field": True,
        "reference": "fieldref.md#cloze-deletion-cards",
    },

    "Hint": {
        "auto_fill": False,
        "binary_field": False,
        "reference": "fieldref.md#hints",
    },

    "HintNotHidden": {
        "auto_fill": False,
        "binary_field": False,
        "reference": "fieldref.md#hints",
        "anime_cards_import": "Hint",
    },

    "Picture": {
        "auto_fill": True,
        "binary_field": False,
        "reference": "images.md",
        "anime_cards_import": "Picture",
    },

    "WordAudio": {
        "auto_fill": True,
        "binary_field": False,
        #"reference": "fieldref.md#",
        "setup": "{audio}",
        "anime_cards_import": "Audio",
    },

    "SentenceAudio": {
        "auto_fill": True,
        "binary_field": False,
        #"reference": "fieldref.md#",
        "anime_cards_import": "SentenceAudio",
    },

    "PAGraphs": {
        "auto_fill": True,
        "binary_field": False,
        #"reference": "fieldref.md#",
        "setup": "{jpmn-pitch-accent-graphs}",
        "notes": "Do not edit this field.",
        "anime_cards_import": "Graph",
    },

    "PAPositions": {
        "auto_fill": True,
        "binary_field": False,
        "reference": "autopa.md#how-pitch-accent-is-selected",
        "notes": "Do not edit this field.",
        "setup": "{jpmn-pitch-accent-positions}",
    },

    "PASilence": {
        "auto_fill": True,
        "binary_field": False,
        "reference": "faq.md#what-is-the-point-of-the-pasilence-field",
        "notes": "Do not edit this field.",
        "setup": "[sound:_silence.wav]",
    },

    # TODO un-comment for 0.11.0.0
    #"WordReadingHiragana": {
    #    "auto_fill": True,
    #    "binary_field": False,
    #    "reference": "ui.md#same-reading-indicator",
    #    "setup": "{jpmn-word-reading-hiragana}",
    #},

    "FrequenciesStylized": {
        "auto_fill": True,
        "binary_field": False,
        #"reference": "fieldref.md#",
        "notes": "Do not edit this field.",
        "setup": "{jpmn-frequencies}",
    },

    "FrequencySort": {
        "auto_fill": True,
        "binary_field": False,
        "reference": "fieldref.md#sorting-by-frequency",
        "setup": "{jpmn-min-freq}",
    },

    "SecondaryDefinition": {
        "auto_fill": True,
        "binary_field": False,
        "reference": "yomichantemplates.md#expected-dictionary-placement",
        "setup": "{jpmn-secondary-definition}",
    },

    "ExtraDefinitions": {
        "auto_fill": True,
        "binary_field": False,
        "reference": "yomichantemplates.md#expected-dictionary-placement",
        "setup": "{jpmn-extra-definitions}",
    },

    "UtilityDictionaries": {
        "auto_fill": True,
        "binary_field": False,
        "reference": "yomichantemplates.md#expected-dictionary-placement",
        "setup": "{jpmn-utility-dictionaries}",
    },

    "Comment": {
        "auto_fill": False,
        "binary_field": False,
        "reference": "fieldref.md#comment-field",
        "personal_setup": "DICTIONARY:「{_jpmn-get-primary-definition-dict}」<br>SELECTION:「{_jpmn-selection-text}」"
    },

}


rx_MORE_THAN_ONE_NEWLINE = re.compile(r"[\n]+")
rx_COMMENT = re.compile(r"\n\s*#.*")
rx_TRAILING_WHITESPACE = re.compile(r"\n\s*")
rx_SKIP_NEWLINE = re.compile(r"\s*`\s*\n")


CHECKED_CHECKBOX = '<input type="checkbox" disabled="disabled" checked />'
UNCHECKED_CHECKBOX = '<input type="checkbox" disabled="disabled" />'



# copy/paste from tools/note_changes.py
class Version:
    # ints: tuple[int, int, int, int]

    def __init__(self, *args):
        assert len(args) == 4
        self.ints = tuple(args)

    @classmethod
    def from_str(cls, str_ver):
        assert str_ver.count(".") == 3
        assert str_ver.replace(".", "").isdigit()
        ints = tuple(int(i) for i in str_ver.split("."))
        return cls(*ints)

    def cmp(self, other):
        """
        returns:
        -1 if self < other
        1  if self > other
        0  if self == other
        """
        assert isinstance(other, Version), other

        for i, j in zip(self.ints, other.ints):
            if i < j:
                return -1
            if i > j:
                return 1

        return 0

    def __eq__(self, other):
        return self.cmp(other) == 0

    def __lt__(self, other):
        return self.cmp(other) == -1

    def __le__(self, other):
        return self < other or self == other

    def __ne__(self, other):
        return not (self == other)

    def __gt__(self, other):
        return not (self <= other)

    def __ge__(self, other):
        return not (self < other)

    def __repr__(self):
        return f"Version({', '.join(str(x) for x in self.ints)})"




def define_env(env):
    "Hook function"

    top = ""
    bottom = ""

    with open(
        os.path.join("..", "yomichan_templates", "top.txt")
    ) as f:
        top = f.read()

    with open(
        os.path.join(
            "..", "yomichan_templates", "bottom.txt"
        )
    ) as f:
        bottom = f.read()

    with open("../version.txt") as f:
        version = f.read().strip()

    data = {
        "FIELDS": FIELDS,
        "TOP_YOMICHAN": top,
        "BOTTOM_YOMICHAN": bottom,
        "VERSION": version,

        "CHECKED_CHECKBOX": CHECKED_CHECKBOX,
        "UNCHECKED_CHECKBOX": UNCHECKED_CHECKBOX,

        # runtime options file
        "RTO_FILE": '[runtime options](options.md#accessing-runtime-options-options){:target="_blank"}',
        "RTOs": '[runtime options](options.md#accessing-runtime-options-options){:target="_blank"}',
        "RTO": '[runtime option](options.md#accessing-runtime-options-options){:target="_blank"}',
        "CTO_FILE": '[compile-time options](options.md#accessing-compile-time-options){:target="_blank"}',
        "CTOs": '[compile-time options](options.md#accessing-compile-time-options){:target="_blank"}',
        "CTO": '[compile-time option](options.md#accessing-compile-time-options){:target="_blank"}',
    }

    for k, v in data.items():
        env.variables[k] = v


    @env.macro
    def sharex_post(sharex_code):
        """
        sharex_post_processing

        formats into a one line, still runnable in powershell
        """

        c = sharex_code

        # removes comments
        c = rx_COMMENT.sub("\n", c)

        # removes more than 1 newline
        c = rx_MORE_THAN_ONE_NEWLINE.sub("\n", c)

        # removes trailing whitespace
        c = rx_TRAILING_WHITESPACE.sub("\n", c)

        # removes the skip newline operator
        c = rx_SKIP_NEWLINE.sub("\n", c)

        # removes all newlines
        c = c.replace("\n", " ")

        c = c.strip()

        return c

    @env.macro
    def sharex_arg(sharex_code):
        """
        sharex_argument

        formats into a one line argument form
        """

        c = sharex_post(sharex_code)
        c = '-NoProfile -Command "' + c.replace('"', '\\"') + '"'

        return c

    @env.macro
    def img(alt_text, file_path, options=""):
        """
        clickable image
        """

        # ![alt text](file path)
        # [![alt text](file path)](file_path)
        if options:
            return "[![" + alt_text + "](" + file_path + "){ " + options + " } ](" + file_path + ")"

        return f"[![{alt_text}]({file_path})]({file_path})"


    @env.macro
    def link(url_str):
        # [url](url)
        return f"[{url_str}]({url_str})"

    @env.macro
    def url(url_str):
        return link(url_str)

    @env.macro
    def bleeding_edge_only(feature_version_str: str):
        with open("../version.txt") as f:
            current_version_str = f.read().strip()

        feature_ver = Version.from_str(feature_version_str)
        current_ver = Version.from_str(current_version_str)

        template = "(Only available on the [bleeding edge release](building.md))"
        if feature_ver > current_ver:
            return template.format(feature_version_str, current_version_str)
        return ""

    @env.macro
    def feature_version(feature_version_str: str, unreleased=False):
        if unreleased:
            return f"""!!! warning
    New as of version `{feature_version_str}` (currently unreleased, and **cannot be used**)
"""

        with open("../version.txt") as f:
            current_version_str = f.read().strip()

        feature_ver = Version.from_str(feature_version_str)
        current_ver = Version.from_str(current_version_str)
        if feature_ver > current_ver:
            return "!!! warning\n" \
                f"    New as of version `{feature_version_str}`. " \
                "This version is currently [bleeding edge](building.md)" \
                '{:target="_blank"}' \
                ", so this feature **cannot be used** unless you compile the templates from the master branch."


        return f"""<sup><i>New in version `{feature_version_str}` (latest version: `{current_version_str}`)</i></sup>"""

    @env.macro
    def _ceil(x):
        return math.ceil(x)

    #@env.macro
    #def field_quick_jump_table_cols(num_columns: int):

    #    rows = []

    #    # top row
    #    rows.append("|" + "|".join(["Field"]*num_columns) + "|")

    #    # sep row
    #    rows.append("|" + "|".join(["-"]*num_columns) + "|")

    #    col_len = math.ceil(len(FIELDS) / num_columns)

    #    field_ordered = tuple((k, v) for k, v in FIELDS.items())

    #    for i in range(col_len):
    #        row = []
    #        for j in range(num_columns):
    #            k = i + j*col_len

    #            if k >= len(field_ordered):
    #                ele = ""
    #            else:
    #                f = field_ordered[k]

    #                ele = f"[{f[0]}]({f[1]['reference']})" if 'reference' in f[1] else f[0]
    #                ele += " { .smaller-table-row }"

    #            row.append(ele)
    #        rows.append("|".join(row))

    #    return "\n".join(rows)

    @env.macro
    def field_quick_jump_table():

        rows = []

        # top row
        rows.append("| Field | Auto-Filled | Binary Field | Notes |")

        # sep row
        rows.append("|:-:|:-:|:-:|:-:|")

        for k, v in FIELDS.items():
            field = f"[{k}]({v['reference']})" if 'reference' in v else k
            auto_filled = CHECKED_CHECKBOX if v["auto_fill"] else UNCHECKED_CHECKBOX
            binary_field = CHECKED_CHECKBOX if v["binary_field"] else UNCHECKED_CHECKBOX
            notes = v.get("notes", "")

            elements = [field, auto_filled, binary_field, notes]
            elements = [e + " { .smaller-table-row }" if e else "" for e in elements]

            rows.append("|" + "|".join(elements) + "|")


        return "\n".join(rows)





