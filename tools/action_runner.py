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

#import os
#import re
#import sys
import copy
from pprint import pprint

# import aqt
# from aqt.main import AnkiQt
# from anki.collection import Collection
# from anki.models import ModelManager, NotetypeId


import utils
from action import Action, GlobalAction, RenameField, MoveField, AddField, DeleteField
from note_changes import NOTE_CHANGES, Version, NoteChange
#import note_changes
from typing import Any


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


def naive_diff(list1, list2, title1, title2):
    # extends the list to the longest length
    max_len = max(len(list1), len(list2))
    for l in (list1, list2):
        l += ["" * (max_len - len(l))]

    # gets max length for each item in both lists
    max1 = max(len(x) for x in list1)
    max2 = max(len(x) for x in list1)

    str_format = "{:<" + str(max1) + "} {:<" + str(max2) + "}"

    # naive diff (compares per line without any line group matching
    print ("    " + str_format.format(title1, title2))
    for x, y in zip(list1, list2):
        print(">>> " if x != y else "    ", end="")
        print(str_format.format(x, y))



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


class FieldEditSimulator:
    """
    class to absolutely make sure that the field editing logic is sound

    note:
        allows the user to set the fields by themselves, i.e:
        >>> simulator = FieldEditSimulator(...)
        >>> simulator.original_fields = ...
    """
    def __init__(
        self, original_fields: list[str]
    ):
        self.original_fields = original_fields
        self.simulated_fields = copy.deepcopy(self.original_fields)

    def _rename_field(self, old_field_name, new_field_name):
        assert old_field_name in self.simulated_fields

        i = self.simulated_fields.index(old_field_name)
        self.simulated_fields[i] = new_field_name

    def _move_field(self, field_name, index):
        TEMP_FIELD = "TEMP_FIELD_NAME"
        assert field_name in self.simulated_fields

        self.simulated_fields.insert(index, TEMP_FIELD)
        self.simulated_fields.remove(field_name)
        i = self.simulated_fields.index(TEMP_FIELD)
        self.simulated_fields[i] = field_name

    def _add_field(self, field_name, index):
        if field_name not in self.simulated_fields:
            self.simulated_fields.append(field_name)

        if index != -1:
            self._move_field(field_name, index)

    def _delete_field(self, field_name):
        assert field_name in self.simulated_fields
        self.simulated_fields.remove(field_name)


    def simulate(self, actions, reset=True):
        # reset simulated fields
        if reset:
            self.simulated_fields = copy.deepcopy(self.original_fields)

        for action in actions:
            if isinstance(action, RenameField):
                self._rename_field(action.old_field_name, action.new_field_name)

            elif isinstance(action, MoveField):
                self._move_field(action.field_name, action.index)

            elif isinstance(action, AddField):
                self._add_field(action.field_name, action.index)

            elif isinstance(action, DeleteField):
                self._delete_field(action.field_name)

    def verify(self, new_fields):
        if self.simulated_fields != new_fields:
            naive_diff(self.simulated_fields, new_fields, "Simulated", "Expected")
            raise Exception("Fields are different")


class ActionRunner:
    def __init__(self, warn=True):
        self.changes: list[NoteChange] = []
        #self.warn = warn

    def get_note_changes(self, current_ver: Version, new_ver: Version):
        """
        applies changes specified in the range (current_ver, new_ver]

        - verifies field changes by default
        """

        self._get_note_changes(current_ver, new_ver, NOTE_CHANGES)

    def _get_note_changes(
        self, current_ver: Version, new_ver: Version, note_changes: list[NoteChange]
    ):

        self.clear()

        if current_ver == new_ver:
            # nothing to do
            return

        if current_ver > new_ver:
            print("Warning: current version is higher than the newer version?")
            return

        original_fields = None
        new_fields = None

        for data in reversed(note_changes):
            ver = data.version
            if ver <= current_ver:
                # records last known fields_check
                original_fields = data.fields

            # finds all versions that are > current_ver and <= new_ver
            if (ver > current_ver) and (ver <= new_ver):
                self.changes.append(data)
                new_fields = data.fields

            if (ver > new_ver):
                break

        # basic error checking
        assert original_fields is not None

        if not self.changes: # if self.changes is empty
            return

        if new_fields is not None:
            # verifies that fields are correct
            self.verify(original_fields, new_fields)

    def verify(self, original_fields, new_fields):
        """
        verifies that:
        - fields in anki are the same
        - changes to fields are correct through the simulator
        """
        # makes sure that the anki fields are the same

        field_names = utils.invoke("modelFieldNames", modelName="JP Mining Note")
        # allows extra fields added by the user past the original fields
        first_fields = field_names[:len(original_fields)]

        if field_names != first_fields:
            naive_diff(first_fields, field_names, "Anki", "Expected")
            raise Exception("Anki fields are different")

        simulator = FieldEditSimulator(original_fields=original_fields)
        actions = sum((data.actions for data in self.changes), start=[])
        simulator.simulate(actions)
        simulator.verify(new_fields=new_fields)

    def clear(self):
        self.changes.clear()

    def get_version_actions_desc(self, data: NoteChange) -> str:
        """
        description w/out global changes
        """

        desc_list = []

        version = data.version
        desc_list.append(f"Changes from version {version}:")

        for action in data.actions:
            if not isinstance(action, GlobalAction):
                desc_list.append("    " + action.description)

        return "\n".join(desc_list)

    def get_global_actions_desc(self) -> str:
        desc_list = []

        desc_list.append(f"Global changes:")

        global_changes_keys = set()

        for data in self.changes:
            for action in data.actions:
                if isinstance(action, GlobalAction) and action.key not in global_changes_keys:
                    global_changes_keys.add(action.key)
                    desc_list.append("    " + action.description)

        return "\n".join(desc_list)


    def get_actions_desc(self) -> str:
        desc_list = []

        for data in self.changes:
            desc_list.append(self.get_version_actions_desc(data))

        global_changes_desc = self.get_global_actions_desc()
        if global_changes_desc:
            desc_list.append(global_changes_desc)


        return "\n\n".join(desc_list)

    def has_actions(self) -> bool:
        return bool(self.changes)

    def warn(self) -> bool:
        """
        false if user doesn't want to run, true otherwise
        """

        print(self.get_actions_desc())
        print()

        print(
            "WARNING: The above actions WILL modify the deck and the notes inside of it.\n"
            "Please make a backup (File -> Export -> Anki Collection Package before\n"
            "running this, just in case!\n"
            "If you have made a backup, please type 'yes' to confirm, or anything else to abort:"
        )
        x = input()
        if x != "yes":
            print("Aborting update...")
            return False
        return True

    def run(self):
        for data in self.changes:
            for action in data.actions:
                action.run()

    def post_message(self):
        print("Make sure you don't forget to do the following actions afterwards:")
        print(self.get_global_actions_desc())

        #for action in self.actions:
        #    print(f"Running action {action}...")
        #    action.run()


def main(args=None):
    if args is None:
        args = utils.get_args(utils.add_args, add_args)
    config = utils.get_config(args)

    #action_runner = ActionRunner()
    #current_ver = Version.from_str(utils.get_version_from_anki())
    ##new_ver = Version.from_str(utils.get_version())
    #new_ver = Version(0, 9, 0, 0)
    #action_runner.get_note_changes(current_ver, new_ver)
    #print(action_runner.get_actions_desc())

    #if action_runner.has_actions():
    #    action_runner.run()

    ## action_runner.get_note_changes(V"0.2.0.0", "0.9.0.0")

    #v3 = Version(3, 3, 3, 3)
    #v4 = Version(3, 3, 3, 3)
    #v3.cmp(v4)
    #print(v3 < v4)
    #print(v3 > v4)
    #print(v3 == v4)
    #print(v3 != v4)

    # runner = ActionRunner("temp", warn=not args.no_warn)

    # note_name = config("notes", "jp-mining-note", "model-name").item()

    # runner.run(note_name)

    s = FieldEditSimulator(NOTE_CHANGES[-1].fields)
    actions = sum((data.actions for data in NOTE_CHANGES), start=[])
    #print(actions)
    s.simulate(actions)
    s.verify(NOTE_CHANGES[0].fields)


    # anki_home = '/home/austin/.local/share/Anki2/test3'
    # WARNING: THIS IS THE MAIN DECK!!!
    # BACKUP ANY COLLECTION BEFORE RUNNING THIS SCRIPT ON IT
    # anki_home = "/home/austin/.local/share/Anki2/Japanese"
    # anki_collection_path = os.path.join(anki_home, "collection.anki2")

    # col = Collection(anki_collection_path, log=True)


if __name__ == "__main__":
    main()
