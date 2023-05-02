from dataclasses import dataclass
import os
import re

import math
import pyjson5
from typing import Optional




@dataclass
class Field:
    name: str
    font: int # font size
    auto_fill: bool # whether this field should be auto-filled by some program (i.e. Yomichan, mpvacious, etc.)
    binary_field: bool

    # exact text used for Yomichan's "Anki Card Format"
    setup: Optional[str] = None

    # personal setup of the above
    personal_setup: Optional[str] = None

    # what animecards field maps to this card
    anime_cards_import: Optional[str] = None

    # when this field was introduced
    version: Optional[bool] = None

    # additional notes on the field
    notes: Optional[str] = None

    # whether it is collapsed by default or not
    default_collapsed: Optional[bool] = None



# copy/paste from tools/note_changes.py
class Version:
    def __init__(
        self,
        main: int,
        major: int,
        minor: int,
        patch: int,
        pre_release: int | None = None,
    ):
        self.ints = (main, major, minor, patch)
        self.pre_release: int | None = pre_release

    @classmethod
    def from_str(cls, str_ver):
        """
        standard:
            x.x.x.x

        prerelease:
            x.x.x.x-prerelease-1
        """
        assert str_ver.count(".") == 3
        #assert str_ver.replace(".", "").isdigit()
        elements = str_ver.split(".")
        main = int(elements[0])
        major = int(elements[1])
        minor = int(elements[2])

        patch = elements[3]
        PREREL_SEP = "-prerelease-"
        if PREREL_SEP in patch:
            patch, pre_release = (int(x) for x in patch.split(PREREL_SEP))
            return cls(main, major, minor, patch, pre_release=pre_release)
        else:
            patch = int(patch)

        return cls(main, major, minor, patch)

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

        #if self.pre_release is not None and other.pre_release is not None:
        #    return 1 if (self.pre_release > other.pre_release) else -1
        #elif self.pre_release is not None:  # self < other
        #    return -1
        #elif other.pre_release is not None:  # self > other
        #    return 1
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
        return f"Version({self})"

    def __str__(self):
        return f"({'.'.join(str(x) for x in self.ints)}{'' if self.pre_release is None else '-prerelease-' + str(self.pre_release)})"






# TODO do not hardcode this!!!
with open("../version.txt") as f:
    CURRENT_VERSION_STR = f.read().strip()
#CURRENT_VERSION_STR = "0.12.0.0"

CURRENT_VER = Version.from_str(CURRENT_VERSION_STR)


def get_root_folder():
    tools_folder = os.path.dirname(os.path.abspath(__file__))
    root_folder = os.path.join(tools_folder, "..")

    return root_folder


def get_fields() -> list[Field]:
    fields = []
    file_path = os.path.join(get_root_folder(), "data", "fields.json5")
    with open(file_path) as f:
        for json_data in pyjson5.load(f)["fields"]:
            field = Field(**json_data)
            fields.append(field)

    return fields


def get_fields_in_cur_version() -> list[Field]:
    """
    gets all fields that exist in the current version
    """
    result_fields = []
    for field in get_fields():

        # skips the element altogether if not in current version
        if field.version is not None:
            ver = field.version
            feature_ver = Version.from_str(ver)
            if feature_ver > CURRENT_VER:
                continue
            result_fields.append(field)
        else:
            result_fields.append(field)
    return result_fields


def get_checked(x, show_string=False, show_unchecked=True):
    if show_string:
        checked = f"Checked ({CHECKED_CHECKBOX})"
        unchecked = f"Unchecked ({UNCHECKED_CHECKBOX})"
    else:
        checked = f"{CHECKED_CHECKBOX}"
        unchecked = f"{UNCHECKED_CHECKBOX}"
    if not show_unchecked:
        unchecked = ""

    if x:
        return checked
    return unchecked


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


def define_env_vars(env):
    top = ""
    bottom = ""

    with open(os.path.join("..", "yomichan_templates", "top.txt")) as f:
        top = f.read()

    with open(os.path.join("..", "yomichan_templates", "bottom.txt")) as f:
        bottom = f.read()

    with open(os.path.join("..", "src", "jp-mining-note", "_jpmn-options.js")) as f:
        runtime_opts_ex = f.read()


    with open("../version.txt") as f:
        version = f.read().strip()

    data = {
        #"FIELDS": FIELDS,
        "TOP_YOMICHAN": top,
        "BOTTOM_YOMICHAN": bottom,
        "JPMN_OPTIONS_EXAMPLE": runtime_opts_ex,
        "VERSION": version,
        "CHECKED_CHECKBOX": CHECKED_CHECKBOX,
        "UNCHECKED_CHECKBOX": UNCHECKED_CHECKBOX,
        "RegexTableArgs": RegexTableArgs,
        # runtime options file
        "RTO_FILE": '[runtime options](runtimeoptions.md)',
        "RTOs": '[runtime options](runtimeoptions.md)',
        "RTO": '[runtime option](runtimeoptions.md)',
        "rto": lambda x: f"`RTO:{x}`", # TODO automatically link
        "C_CSS": '[custom CSS](customcss.md)',
        "CSS": '[CSS](customcss.md)',
        "CTO_FILE": '[compile-time options](compiletimeoptions.md)',
        "CTOs": '[compile-time options](compiletimeoptions.md)',
        "CTO": '[compile-time option](compiletimeoptions.md)',
        "YTCOs": '[Yomichan template options](yomichantemplates.md)',
        "YTCO": '[Yomichan template option](yomichantemplates.md)',
        "TMW_SERVER": "[TMW server](https://learnjapanese.moe/join/)",
        "THEMOEWAY_LINK": "https://learnjapanese.moe/join/",
        "TMW_LINK": "https://learnjapanese.moe/join/",
        "REFOLD_SERVER": "[Refold (JP) Server](https://refold.la/join)",
        "PERDITION_SERVER": "[Perdition's server](https://discord.gg/uK4HeGN)",
        "PERDITION_LINK": "https://discord.gg/uK4HeGN",
        "BATCH_CMD": "[batch command](batch.md)",
        "BATCH_CMDS": "[batch commands](batch.md)",
        "CLICK_HERE": "<small>(click here)</small>",
        "CLICKHERE": "<small>(click here)</small>",
        "JPMN_MGR_CODE": "1732829476",

    }

    for k, v in data.items():
        env.variables[k] = v


def define_env(env):
    "Hook function"
    define_env_vars(env)


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

        template = "(Only available on the [bleeding edge release](building.md))"
        if feature_ver > CURRENT_VER:
            return template.format(feature_version_str, CURRENT_VERSION_STR)
        return ""

    @env.macro
    def feature_version(feature_version_str: str, unreleased=False):
        if unreleased:
            return f"""!!! warning
    New as of version `{feature_version_str}` (currently unreleased, and **cannot be used**)
"""

        feature_ver = Version.from_str(feature_version_str)
        if feature_ver > CURRENT_VER:
            return (
                "!!! warning\n"
                f"    New as of version `{feature_version_str}`. "
                "This version is currently [bleeding edge](building.md)"
                ", so this feature **cannot be used** unless you compile the templates from the dev branch."
            )

        return f"""<sup><i>New in version `{feature_version_str}` (latest version: `{CURRENT_VERSION_STR}`)</i></sup>"""

    @env.macro
    def _ceil(x):
        return math.ceil(x)

    @env.macro
    def plaintext_change_defaults(top_yomichan: str):
        lines = []
        for line in top_yomichan.splitlines(keepends=False):

            # override lines
            if line.startswith('{{~set "opt__plaintext__'):
                line = line.replace('false ~}}', 'true ~}} {{~! jpmn default: false ~}}')
            elif line.strip() == '{{~set "opt-primary-def-one-dict-entry-only" false ~}}':
                line = '{{~set "opt-primary-def-one-dict-entry-only" true ~}} {{~! jpmn default: false ~}}'
            elif line.strip() == '{{~set "opt-jmdict-list-format" true ~}}':
                line = '{{~set "opt-jmdict-list-format" false ~}} {{~! jpmn default: true ~}}'

            lines.append(line)
        return "\n".join(lines)

    @env.macro
    def field_quick_jump_table():

        rows = []

        # top row
        rows.append("| Field | Auto-Filled | Binary Field | Notes |")

        # sep row
        rows.append("|:-:|:-:|:-:|:-:|")

        for field in get_fields():
            auto_filled = CHECKED_CHECKBOX if field.auto_fill else UNCHECKED_CHECKBOX
            binary_field = CHECKED_CHECKBOX if field.binary_field else UNCHECKED_CHECKBOX
            notes = "" if field.notes is None else field.notes

            elements = [field.name, auto_filled, binary_field, notes]
            elements = [e + " { .smaller-table-row }" if e else "" for e in elements]

            rows.append("|" + "|".join(elements) + "|")

        return "\n".join(rows)

    @env.macro
    def yomichan_fields_table():
        rows = []

        # top row
        rows.append("| Anki Fields | Yomichan Format |")

        # sep row
        rows.append("|-|-|")

        for field in get_fields():

            anki_field = ("*" if field.binary_field else "") + field.name
            yomichan_format = ""
            if field.setup is not None:
                yomichan_format = "`" + str(field.setup) + "`"

            elements = [anki_field, yomichan_format]
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

        for field in get_fields_in_cur_version():
            ac_field = "" if field.anime_cards_import is None else field.anime_cards_import

            elements = [field.name, ac_field]
            elements = [e + " { .smaller-table-row }" if e else "" for e in elements]
            rows.append("|" + "|".join(elements) + "|")

        return "\n".join(rows)

    @env.macro
    def personal_setup_table():
        rows = []

        # top row
        rows.append("| Anki Fields | Yomichan Format |")

        # sep row
        rows.append("|-|-|")

        for field in get_fields_in_cur_version():

            result = ""
            if field.personal_setup is not None:
                result = field.personal_setup
            elif field.setup is not None:
                result = field.setup

            elements = [field.name, result]
            elements = [e + " { .smaller-table-row }" if e else "" for e in elements]
            rows.append("|" + "|".join(elements) + "|")

        return "\n".join(rows)

    @env.macro
    def gen_fields_info_table():
        rows = []

        # top row
        rows.append("| Fields | Font Size | Collapsed | Binary | Notes |")

        # sep row
        rows.append("|-|:-:|:-:|:-:|-|")

        for field in get_fields_in_cur_version():

            #field_name = f"**{field.name}**"
            field_name = field.name
            font_size = f"`{field.font}`"
            collapsed = get_checked(field.default_collapsed, show_unchecked=False)
            binary = get_checked(field.binary_field, show_unchecked=False)

            if field.notes is not None:
                notes = field.notes
            elif field.version is not None:
                notes = f"New in `v{field.version}`"
            else:
                notes = ""

            elements = [field_name, font_size, collapsed, binary, notes]
            elements = [e + " { .smaller-table-row }" if e else "" for e in elements]
            rows.append("|" + "|".join(elements) + "|")

        return "\n".join(rows)



    @env.macro
    def gen_regex_table(args: RegexTableArgs):

        format_args = (
            args.find,
            args.replace,
            args.field,
            get_checked(args.selected_notes_only, show_string=True),
            get_checked(args.ignore_case, show_string=True),
            get_checked(args.input_is_regex, show_string=True),
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


