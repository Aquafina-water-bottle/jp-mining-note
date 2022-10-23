import os
import re
import enum

FIELDS = {
    "Key": {
        "auto_fill": True,
        "customize": False,
        "setup": "{expression}",
        "anime_cards_import": "front",
    },

    "Word": {
        "auto_fill": True,
        "customize": False,
        "setup": "{expression}",
        "anime_cards_import": "front",
    },

    "WordReading": {
        "auto_fill": True,
        "customize": False,
        "setup": "{furigana-plain}",
        "anime_cards_import": "Reading",
    },

    "PAOverride": {
        "auto_fill": False,
        "customize": False,
    },

    "AJTWordPitch": {
        "auto_fill": True,
        "customize": False,
    },

    "PrimaryDefinition": {
        "auto_fill": True,
        "customize": False,
        "setup": "{jpmn-primary-definition}",
        "anime_cards_import": "Glossary",
    },

    "Sentence": {
        "auto_fill": True,
        "customize": False,
        "setup": "{cloze-prefix}<b>{cloze-body}</b>{cloze-suffix}",
        "anime_cards_import": "Sentence",
    },

    "SentenceReading": {
        "auto_fill": True,
        "customize": False,
    },

    "AltDisplay": {
        "auto_fill": False,
        "customize": False,
    },

    "AltDisplayPASentenceCard": {
        "auto_fill": False,
        "customize": False,
    },

    "AdditionalNotes": {
        "auto_fill": False,
        "customize": False,
    },

    "IsSentenceCard": {
        "auto_fill": False,
        "customize": True,
    },

    "IsClickCard": {
        "auto_fill": False,
        "customize": True,
        "personal_setup": "1",
    },

    "IsHoverCard": {
        "auto_fill": False,
        "customize": True,
    },

    "IsTargetedSentenceCard": {
        "auto_fill": False,
        "customize": True,
    },

    "PAShowInfo": {
        "auto_fill": False,
        "customize": True,
        "personal_setup": "1",
    },

    "PATestOnlyWord": {
        "auto_fill": False,
        "customize": True,
        "personal_setup": "1",
    },

    "PADoNotTest": {
        "auto_fill": False,
        "customize": True,
    },

    "PASeparateWordCard": {
        "auto_fill": False,
        "customize": True,
    },

    "PASeparateSentenceCard": {
        "auto_fill": False,
        "customize": True,
    },

    "SeparateClozeDeletionCard": {
        "auto_fill": False,
        "customize": True,
    },

    "Hint": {
        "auto_fill": False,
        "customize": False,
    },

    "HintNotHidden": {
        "auto_fill": False,
        "customize": False,
        "anime_cards_import": "Hint",
    },

    "Picture": {
        "auto_fill": True,
        "customize": False,
        "anime_cards_import": "Picture",
    },

    "WordAudio": {
        "auto_fill": True,
        "customize": False,
        "setup": "{audio}",
        "anime_cards_import": "Audio",
    },

    "SentenceAudio": {
        "auto_fill": True,
        "customize": False,
        "anime_cards_import": "SentenceAudio",
    },

    "PAGraphs": {
        "auto_fill": True,
        "customize": False,
        "setup": "{jpmn-pitch-accent-graphs}",
        "anime_cards_import": "Graph",
    },

    "PAPositions": {
        "auto_fill": True,
        "customize": False,
        "setup": "{jpmn-pitch-accent-positions}",
    },

    "PASilence": {
        "auto_fill": True,
        "customize": False,
        "setup": "[sound:_silence.wav]",
    },

    # TODO un-comment for 0.11.0.0
    #"WordReadingHiragana": {
    #    "auto_fill": True,
    #    "customize": False,
    #    "setup": "{jpmn-word-reading-hiragana}",
    #},

    "FrequenciesStylized": {
        "auto_fill": True,
        "customize": False,
        "setup": "{jpmn-frequencies}",
    },

    "FrequencySort": {
        "auto_fill": True,
        "customize": False,
        "setup": "{jpmn-min-freq}",
    },

    "SecondaryDefinition": {
        "auto_fill": True,
        "customize": False,
        "setup": "{jpmn-secondary-definition}",
    },

    "ExtraDefinitions": {
        "auto_fill": True,
        "customize": False,
        "setup": "{jpmn-extra-definitions}",
    },

    "UtilityDictionaries": {
        "auto_fill": True,
        "customize": False,
        "setup": "{jpmn-utility-dictionaries}",
    },

    "Comment": {
        "auto_fill": False,
        "customize": False,
        "personal_setup": "DICTIONARY:「{_jpmn-get-primary-definition-dict}」<br>SELECTION:「{_jpmn-selection-text}」"
    },

}


rx_MORE_THAN_ONE_NEWLINE = re.compile(r"[\n]+")
rx_COMMENT = re.compile(r"\n\s*#.*")
rx_TRAILING_WHITESPACE = re.compile(r"\n\s*")
rx_SKIP_NEWLINE = re.compile(r"\s*`\s*\n")




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
    def link(url):
        # [url](url)
        return f"[{url}]({url})"

    @env.macro
    def feature_version(feature_version_str: str, unreleased=False):
        if unreleased:
            return f"""!!! warning
    New as of version `{feature_version_str}` (currently unreleased, and cannot be used)
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
                ", so this feature cannot be used unless you compile the templates from the master branch."


        return f"""<sup><i>New in version `{feature_version_str}` (latest version: `{current_version_str}`)</i></sup>"""





