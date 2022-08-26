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


from __future__ import annotations

import os
import re
import sys

# import aqt
# from aqt.main import AnkiQt
# from anki.collection import Collection
# from anki.models import ModelManager, NotetypeId


import utils
from action import Action, GlobalAction


def add_args(parser):
    group = parser.add_argument_group(title="actions")

    group.add_argument(
        "--no-warn",
        action="store_true",
        help="does not warn when updating",
    )

    group.add_argument(
        "--initialize",
        action="store_true",
        help="Adds `[sound:_silence.wav]` to the PASilence field of every card",
    )


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
        return cls(*ints)

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
    # def __init__(self, path: str, warn=True):
    def __init__(self, warn=True):
        # self.path = path
        self.actions: list[Action] = []
        self.global_actions: list[GlobalAction] = []
        self.warn = warn

    def add(self, action):
        if isinstance(action, GlobalAction):
            self.global_actions.append(action)
        else:
            self.actions.append(action)

    def get_note_changes(self, current_ver: Version, new_ver: Version):
        """
        applies changes specified in the range (current_ver, new_ver]
        """
        pass

    def clear(self):
        self.actions.clear()
        self.global_actions.clear()

    def get_actions_desc(self) -> str:
        desc_list = []
        if self.actions:
            desc_list.append("Automatic Changes:")
            desc_list = ["    " + action.description for action in self.actions]

        if self.global_actions:
            desc_list.append("Manual Changes:")
            desc_list = ["    " + action.description for action in self.global_actions]

        return "\n".join(desc_list)

    def verify_actions(self):
        """
        verifies that the field editing actions do what they are supposed to do

        raises an error if verify check failed
        """
        pass

    def has_actions(self) -> bool:
        return bool(self.actions) or bool(self.global_actions)

    # def window(self) -> AnkiQt:
    #    if aqt.mw is None:
    #        raise Exception("window is not available")
    #    return aqt.mw

    #def run(self, note_name: str):
    def run(self):

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

        for action in self.actions:
            print(f"Running action {action}...")
            action.run()


def main(args=None):
    if args is None:
        args = utils.get_args(utils.add_args, add_args)
    config = utils.get_config(args)

    action_runner = ActionRunner()
    current_ver = Version.from_str(utils.get_version_from_anki())
    new_ver = Version.from_str(utils.get_version())
    action_runner.get_note_changes(current_ver, new_ver)

    if action_runner.has_actions():
        action_runner.run()

    #action_runner.get_note_changes(V"0.2.0.0", "0.9.0.0")

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
