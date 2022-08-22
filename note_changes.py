from __future__ import annotations

import os
import re
import sys

# import aqt
# from aqt.main import AnkiQt
# from anki.collection import Collection
# from anki.models import ModelManager, NotetypeId


import utils
import action

"""
goal of this script:
    - prevent having the user to manually update their anki card each time
    - automatically update yomichan-generated html when yomichan templates are updated
    - ease the process of converting their existing cards into this with bulk additions


TODO:
- bulk add
    - i.e. PASilence -> [silence.wav]

- sanitize
    - PASilence
    - provide options to auto-filling fields

- field modifications:
    - rename
    - reposition
    - deleting / adding
    - (stretch goal) description


- detection of version
    - way of specifying what to do for each major version bump

"""


def add_args(parser):
    group = parser.add_argument_group(title="update")

    group.add_argument(
        "--no-warn",
        action="store_true",
        help="does not warn when updating",
    )

    group.add_argument(
        "--initialize",
        action="store_true",
        help="Adds `[sound:silence.wav]` to the PASilence field of every card",
    )


# def get_anki_path():
#    home_path = os.path.expanduser("~")
#    # windows
#    if sys in {"win32", "cygwin"} and os.path.isdir(
#        path := os.path.join(home_path, "AppData", "Roaming", "Anki2")
#    ):
#        return path
#
#    if sys in {"linux", "darwin"} and os.path.isdir(
#        path := os.path.join(home_path, ".local", "share", "Anki2")
#    ):
#        return path


class ActionRunner:
    def __init__(self, path: str, warn=True):
        self.path = path
        self.actions: list[action.Action] = []
        self.warn = warn

    def add(self, action):
        self.actions.append(action)

    # def window(self) -> AnkiQt:
    #    if aqt.mw is None:
    #        raise Exception("window is not available")
    #    return aqt.mw

    def run(self, note_name: str):

        if self.warn:
            print(
                "WARNING: The following actions WILL modify the deck and the notes inside of it.\n"
                "Please make a backup (File -> Export -> Anki Collection Package before\n"
                "running this, just in case!\n"
                "If you have made a backup, please type 'yes' to confirm:"
            )
            x = input()
            if x != "yes":
                print("Aborting update...")
                return

        # TODO anki connect related stuff

    #    self.run_with_anki(note_name)

    # def run_with_anki(self, note_name: str):

    # from anki.collection import Collection
    # from anki.models import ModelManager, NotetypeId

    # collection = self.window().col
    # col = Collection(self.path)
    # if col is None:
    #    raise Exception("collection is not available")

    ##col = self.collection()
    # note_type_id = col.models.id_for_name(note_name)
    # if note_type_id is None:
    #    raise Exception(f"Note type not found: {note_name}")

    # for action in self.actions:
    #    action.run(col, note_type_id)


class Version:
    ints: tuple[int, int, int, int]

    def __init__(self, *args):
        assert len(args) == 4
        self.ints = tuple(args)

    @classmethod
    def from_str(cls, str_ver):
        assert str_ver.count(".") == 3
        assert str_ver.replace(".", "").isdigit()
        ints = tuple(int(i) for i in str_ver.split("."))
        return cls(ints)

    def cmp(self, other):
        """
        returns:
        -1 if self < other
        1  if self > other
        0  if self == other
        """
        assert isinstance(other, Version)

        # ver_tuple = lambda x: tuple(int(i) for i in x.split("."))

        # ver1_tup = ver_tuple(ver1)
        # ver2_tup = ver_tuple(ver2)
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


class NoteChanges:
    """
    note changes that require editing the note type outside of template changes
    """

    CONFIG_CHANGES = {
        Version(0, 9, 0, 0): {
            "actions": [
                action.MoveField("PAShowInfo", 15),
                action.MoveField("PASeparateWordCard", 19),
                action.MoveField("PASeparateSentenceCard", 19),
                action.AddField("FrequencySort", 29),
                action.AJTPitchAccentconfigChange(),
            ],
            "fields_check": [
                "Key",
                "Word",
                "WordReading",
                "WordPitch",
                "PrimaryDefinition",
                "Sentence",
                "SentenceReading",
                "AltDisplay",
                "AltDisplayPASentenceCard",
                "AdditionalNotes",
                "IsSentenceCard",
                "IsClickCard",
                "IsHoverCard",
                "IsTargetedSentenceCard",
                "PAShowInfo",
                "PATestOnlyWord",
                "PADoNotTest",
                "PASeparateWordCard",
                "PASeparateSentenceCard",
                "SeparateClozeDeletionCard",
                "Hint",
                "HintNotHidden",
                "Picture",
                "WordAudio",
                "SentenceAudio",
                "PAGraphs",
                "PASilence",
                "FrequenciesStylized",
                "FrequencySort",
                "SecondaryDefinition",
                "ExtraDefinitions",
                "UtilityDictionaries",
                "Comment",
            ],
        },
        Version(0, 8, 1, 0): {
            "fields_check": [
                "Key",
                "Word",
                "WordReading",
                "WordPitch",
                "PrimaryDefinition",
                "Sentence",
                "SentenceReading",
                "AltDisplay",
                "AltDisplayPASentenceCard",
                "AdditionalNotes",
                "IsSentenceCard",
                "IsClickCard",
                "IsHoverCard",
                "IsTargetedSentenceCard",
                "PASeparateWordCard",
                "PASeparateSentenceCard",
                "PAShowInfo",
                "PATestOnlyWord",
                "PADoNotTest",
                "SeparateClozeDeletionCard",
                "Hint",
                "HintNotHidden",
                "Picture",
                "WordAudio",
                "SentenceAudio",
                "PAGraphs",
                "PASilence",
                "FrequenciesStylized",
                "SecondaryDefinition",
                "ExtraDefinitions",
                "UtilityDictionaries",
                "Comment",
            ],
        },
    }

    def __init__(self, current_ver, new_ver):
        pass

    def has_changes(self) -> bool:
        return False

    def change(self):
        pass


def main(args=None):
    if args is None:
        args = utils.get_args(utils.add_args, add_args)
    config = utils.get_config(args)

    changes = NoteChanges("0.2.0.0", "0.9.0.0")

    v3 = Version(3, 3, 3, 3)
    v4 = Version(3, 3, 3, 3)
    v3.cmp(v4)
    print(v3 < v4)
    print(v3 > v4)
    print(v3 == v4)
    print(v3 != v4)

    # runner = ActionRunner("temp", warn=not args.no_warn)

    # note_name = config("notes", "jp-mining-note", "model-name").item()

    # runner.run(note_name)

    print("lolol")
    # anki_home = '/home/austin/.local/share/Anki2/test3'
    # WARNING: THIS IS THE MAIN DECK!!!
    # BACKUP ANY COLLECTION BEFORE RUNNING THIS SCRIPT ON IT
    # anki_home = "/home/austin/.local/share/Anki2/Japanese"
    # anki_collection_path = os.path.join(anki_home, "collection.anki2")

    # col = Collection(anki_collection_path, log=True)


if __name__ == "__main__":
    main()
