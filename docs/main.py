from dataclasses import dataclass
import os
import re

import math


#"auto_fill": bool,
#"binary_field": bool,
#"reference": str
#"setup": str
#"version": str
#"anime_cards_import": str
#"personal_setup": str

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
        "setup": "{expression}",
        "anime_cards_import": "front",
    },
    "WordReading": {
        "auto_fill": True,
        "binary_field": False,
        "setup": "{furigana-plain}",
        "anime_cards_import": "Reading",
    },
    "PAOverride": {
        "auto_fill": False,
        "binary_field": False,
        "reference": "autopa.md#how-pitch-accent-is-selected",
    },
    "PAOverrideText": {
        "auto_fill": False,
        "binary_field": False,
        "reference": "autopa.md#how-pitch-accent-is-selected",
        "version": "0.11.0.0",
    },
    "AJTWordPitch": {
        "auto_fill": True,
        "binary_field": False,
        "reference": "autopa.md#how-pitch-accent-is-selected",
    },
    "PrimaryDefinition": {
        "auto_fill": True,
        "binary_field": False,
        "reference": "images.md#main-image",
        "setup": "{jpmn-primary-definition}",
        "anime_cards_import": "Glossary",
    },
    "PrimaryDefinitionPicture": {
        "auto_fill": False,
        "binary_field": False,
        "reference": "images.md#the-primarydefinitionpicture-field",
        "version": "0.11.0.0",
    },
    "Sentence": {
        "auto_fill": True,
        "binary_field": False,
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
        "personal_setup": "{jpmn-filled-if-word-is-not-hiragana}",
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
        "personal_setup": "{jpmn-filled-if-word-is-hiragana}",
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
        "setup": "{audio}",
        "anime_cards_import": "Audio",
    },
    "SentenceAudio": {
        "auto_fill": True,
        "binary_field": False,
        "anime_cards_import": "SentenceAudio",
    },
    "PAGraphs": {
        "auto_fill": True,
        "binary_field": False,
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
    "WordReadingHiragana": {
        "auto_fill": True,
        "binary_field": False,
        "reference": "ui.md#word-indicators",
        "setup": "{jpmn-word-reading-hiragana}",
        "version": "0.11.0.0",
    },
    "FrequenciesStylized": {
        "auto_fill": True,
        "binary_field": False,
        "notes": "Do not edit this field.",
        "setup": "{jpmn-frequencies}",
    },
    "FrequencySort": {
        "auto_fill": True,
        "binary_field": False,
        "reference": "fieldref.md#frequencysort-field",
        "setup": "{jpmn-min-freq}",
    },
    "YomichanWordTags": {
        "auto_fill": True,
        "binary_field": False,
        "setup": "{tags}",
        "version": "0.12.0.0",
    },
    "SecondaryDefinition": {
        "auto_fill": True,
        "binary_field": False,
        "reference": "definitions.md#expected-dictionary-placement",
        "setup": "{jpmn-secondary-definition}",
    },
    "ExtraDefinitions": {
        "auto_fill": True,
        "binary_field": False,
        "reference": "definitions.md#expected-dictionary-placement",
        "setup": "{jpmn-extra-definitions}",
    },
    "UtilityDictionaries": {
        "auto_fill": True,
        "binary_field": False,
        "reference": "definitions.md#expected-dictionary-placement",
        "setup": "{jpmn-utility-dictionaries}",
    },
    "Comment": {
        "auto_fill": False,
        "binary_field": False,
        "reference": "fieldref.md#comment-field",
        "personal_setup": "DICTIONARY:「{_jpmn-get-primary-definition-dict}」<br>SELECTION:「{_jpmn-selection-text}」",
    },
}


rx_MORE_THAN_ONE_NEWLINE = re.compile(r"[\n]+")
rx_COMMENT = re.compile(r"\n\s*#.*")
rx_TRAILING_WHITESPACE = re.compile(r"\n\s*")
rx_SKIP_NEWLINE = re.compile(r"\s*`\s*\n")


CHECKED_CHECKBOX = '<input type="checkbox" disabled="disabled" checked />'
UNCHECKED_CHECKBOX = '<input type="checkbox" disabled="disabled" />'


REGEX_TABLE_TEMPLATE = """
| Field name | Value |
|:-|:-|
| **Find:** { .smaller-table-row } | %s  { .smaller-table-row } |
| **Replace With:** { .smaller-table-row } | %s { .smaller-table-row } |
| **In:** { .smaller-table-row } | %s { .smaller-table-row } |
| Selected notes only { .smaller-table-row } | %s { .smaller-table-row } |
| Ignore case { .smaller-table-row } | %s { .smaller-table-row } |
| Treat input as a<br>regular expression { .smaller-table-row } | %s { .smaller-table-row } |
"""


@dataclass
class RegexTableArgs:
    find: str
    replace: str
    field: str
    selected_notes_only: bool = True
    ignore_case: bool = False
    input_is_regex: bool = True


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

    with open("../version.txt") as f:
        CURRENT_VERSION_STR = f.read().strip()

    with open(os.path.join("..", "yomichan_templates", "top.txt")) as f:
        top = f.read()

    with open(os.path.join("..", "yomichan_templates", "bottom.txt")) as f:
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
        "RegexTableArgs": RegexTableArgs,
        # runtime options file
        "RTO_FILE": '[runtime options](runtimeoptions.md){:target="_blank"}',
        "RTOs": '[runtime options](runtimeoptions.md){:target="_blank"}',
        "RTO": '[runtime option](runtimeoptions.md){:target="_blank"}',
        "C_CSS": '[custom CSS](customcss.md){:target="_blank"}',
        "CSS": '[CSS](customcss.md){:target="_blank"}',
        "CTO_FILE": '[compile-time options](compiletimeoptions.md){:target="_blank"}',
        "CTOs": '[compile-time options](compiletimeoptions.md){:target="_blank"}',
        "CTO": '[compile-time option](compiletimeoptions.md){:target="_blank"}',
        "YTCOs": '[Yomichan template options](yomichantemplates.md){:target="_blank"}',
        "YTCO": '[Yomichan template option](yomichantemplates.md){:target="_blank"}',
        "TMW_SERVER": "[TMW server](https://learnjapanese.moe/join/)",
        "THEMOEWAY_LINK": "https://learnjapanese.moe/join/",
        "PERDITION_SERVER": "[Perdition's server](https://discord.gg/uK4HeGN)",
        "PERDITION_LINK": "https://discord.gg/uK4HeGN",
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
            return (
                "[!["
                + alt_text
                + "]("
                + file_path
                + "){ "
                + options
                + " } ]("
                + file_path
                + ")"
            )

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
        feature_ver = Version.from_str(feature_version_str)
        current_ver = Version.from_str(CURRENT_VERSION_STR)

        template = "(Only available on the [bleeding edge release](building.md))"
        if feature_ver > current_ver:
            return template.format(feature_version_str, CURRENT_VERSION_STR)
        return ""

    @env.macro
    def feature_version(feature_version_str: str, unreleased=False):
        if unreleased:
            return f"""!!! warning
    New as of version `{feature_version_str}` (currently unreleased, and **cannot be used**)
"""

        feature_ver = Version.from_str(feature_version_str)
        current_ver = Version.from_str(CURRENT_VERSION_STR)
        if feature_ver > current_ver:
            return (
                "!!! warning\n"
                f"    New as of version `{feature_version_str}`. "
                "This version is currently [bleeding edge](building.md)"
                '{:target="_blank"}'
                ", so this feature **cannot be used** unless you compile the templates from the dev branch."
            )

        return f"""<sup><i>New in version `{feature_version_str}` (latest version: `{CURRENT_VERSION_STR}`)</i></sup>"""

    @env.macro
    def _ceil(x):
        return math.ceil(x)

    # @env.macro
    # def field_quick_jump_table_cols(num_columns: int):

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
            field = f"[{k}]({v['reference']})" if "reference" in v else k
            auto_filled = CHECKED_CHECKBOX if v["auto_fill"] else UNCHECKED_CHECKBOX
            binary_field = CHECKED_CHECKBOX if v["binary_field"] else UNCHECKED_CHECKBOX
            notes = v.get("notes", "")

            elements = [field, auto_filled, binary_field, notes]
            elements = [e + " { .smaller-table-row }" if e else "" for e in elements]

            rows.append("|" + "|".join(elements) + "|")

        return "\n".join(rows)

    @env.macro
    def yomichan_fields_table():
        rows = []

        # top row
        rows.append("| Anki Fields | Yomichan Format | Notes |")

        # sep row
        rows.append("|-|-|-|")

        current_ver = Version.from_str(CURRENT_VERSION_STR)

        for k, v in FIELDS.items():

            anki_field = ("*" if v["binary_field"] else "") + k
            yomichan_format = ""
            if "setup" in v:
                yomichan_format = f"`{v['setup']}`"
            notes = ""

            if "version" in v:
                ver = v["version"]
                feature_ver = Version.from_str(ver)
                if feature_ver > current_ver:
                    # anki_field = f'~~{anki_field}~~'
                    # yomichan_format = f'~~{yomichan_format}~~' if yomichan_format else ""
                    # notes = f"New in version `{ver}` (currently not available)"
                    continue  # skips the element altogether

                notes = f"New in version `{ver}`"

            elements = [anki_field, yomichan_format, notes]
            elements = [e + " { .smaller-table-row }" if e else "" for e in elements]
            rows.append("|" + "|".join(elements) + "|")

        return "\n".join(rows)

    @env.macro
    def anime_cards_table():
        rows = []

        # top row
        rows.append("| jp-mining-note fields | Anime Cards Fields |")

        # sep row
        rows.append("|-|-|")

        current_ver = Version.from_str(CURRENT_VERSION_STR)

        for k, v in FIELDS.items():

            # skips the element altogether if not in current version
            if "version" in v:
                ver = v["version"]
                feature_ver = Version.from_str(ver)
                if feature_ver > current_ver:
                    continue

            jpmn_field = k
            ac_field = v.get("anime_cards_import", "")  # anime card field

            elements = [jpmn_field, ac_field]
            elements = [e + " { .smaller-table-row }" if e else "" for e in elements]
            rows.append("|" + "|".join(elements) + "|")

        return "\n".join(rows)

    @env.macro
    def gen_regex_table(args: RegexTableArgs):
        get_checked = (
            lambda x: f"Checked ({CHECKED_CHECKBOX})"
            if x
            else f"Unchecked ({UNCHECKED_CHECKBOX})"
        )

        format_args = (
            args.find,
            args.replace,
            args.field,
            get_checked(args.selected_notes_only),
            get_checked(args.ignore_case),
            get_checked(args.input_is_regex),
        )

        return REGEX_TABLE_TEMPLATE % format_args

    @env.macro
    def gen_auto_word_highlight_table():
        data = [
            {
                "word": "<ruby><rb>投稿</rb><rt>とうこう</rt></ruby>",
                "result": "あの時は、インターネット上で色んな質問ができるサイトに<b>投稿</b>したら、親切な人が商品名と売っている場所を教えてくれたんです",
            },
            {
                "word": "<ruby><rb>一先</rb><rt>ひとま</rt></ruby>ず",
                "result": "ふー…これで<b>ひとまず</b>は大丈夫そうね…",
            },
            {
                "word": "<ruby><rb>獣</rb><rt>けだもの</rt></ruby>",
                "result": "その場合…『嫌っ！この<b>ケダモノ</b>！』と暴れた方が、風見さんはお好みでしょうか？",
            },
            {
                "word": "<ruby><rb>甲斐甲斐</rb><rt>かいがい</rt></ruby>しい",
                "result": 'なによぅ…<b>甲斐甲斐し</b><b class="error">く</b>会いに来た女に対して、最初に言うセリフがそれ？',
            },
            {
                "word": "<ruby><rb>山</rb><rt>やま</rt></ruby>ごもり",
                "result": "では、わたしも今から<b>山ごもり</b>の修行を始めます",
            },
            {
                "word": "<ruby><rb>山籠</rb><rt>やまごも</rt></ruby>り",
                "result": 'では、わたしも今から<b>山</b><b class="error">ごもり</b>の修行を始めます',
            },
            {
                "word": "<ruby><rb>抜</rb><rt>ぬ</rt></ruby>きん<ruby><rb>出</rb><rt>ぬ</rt></ruby>る",
                "result": '“すごい”ですから、良くも悪くも、<b>抜きん出</b><b class="error">ている</b>という意味にはなると思います',
            },

        ]

        rows = []
        rows.append("| WordReading | Sentence Result |")
        rows.append("|:-:|-|")

        for x in data:
            word = x["word"] + " {.smaller-table-row}"
            #sent = "「" + x["sent"] + "」 {.jp-quote-text .smaller-table-row}"
            result = "「" + x["result"] + "」 {.highlight-bold .jp-quote-text .smaller-table-row}"
            notes = x["notes"] + " {.smaller-table-row}" if "notes" in x else ""

            #row = "|".join([word, sent, result])
            row = "|".join([word, result])
            rows.append(row)

        return "\n".join(rows)




