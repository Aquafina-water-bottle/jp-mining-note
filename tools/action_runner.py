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

# import os
# import re
# import sys
import copy
from pprint import pprint

# import aqt
# from aqt.main import AnkiQt
# from anki.collection import Collection
# from anki.models import ModelManager, NotetypeId


import utils
from action import Action, UserAction, RenameField, MoveField, AddField, DeleteField
from note_changes import NOTE_CHANGES, Version, NoteChange

# import note_changes
from typing import Any


def add_args(parser):
    group = parser.add_argument_group(title="actions")

    #group.add_argument(
    #    "--no-warn",
    #    action="store_true",
    #    help="does not warn when updating",
    #)

    #group.add_argument(
    #    "--initialize",
    #    action="store_true",
    #    help="Adds `[sound:_silence.wav]` to the PASilence field of every card",
    #)


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

    def __init__(self, original_fields: list[str]):
        self.original_fields = original_fields
        self.simulated_fields = copy.deepcopy(self.original_fields)

    def _rename_field(self, old_field_name, new_field_name):
        assert old_field_name in self.simulated_fields

        i = self.simulated_fields.index(old_field_name)
        self.simulated_fields[i] = new_field_name

    def _move_field(self, field_name, index):
        TEMP_FIELD = "TEMP_FIELD_NAME"
        assert field_name in self.simulated_fields

        self.simulated_fields.remove(field_name)
        self.simulated_fields.insert(index, TEMP_FIELD)
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


class Verifier:
    def __init__(self, original_fields, new_fields, in_order=True):
        self.original_fields = original_fields
        self.new_fields = new_fields
        self.in_order = in_order
        self.anki_fields = None

    def get_anki_fields(self):
        if self.anki_fields is None:
            self.anki_fields = utils.invoke(
                "modelFieldNames", modelName="JP Mining Note"
            )

        return self.anki_fields

    def naive_diff_list(self, list1, list2, title1, title2):
        """
        called "naive diff" as it diffs naive-ly per line, without checking for groups of lines
        that are the same
        """

        # extends the list to the longest length
        max_len = max(len(list1), len(list2))
        for l in (list1, list2):
            l += ["" * (max_len - len(l))]

        # gets max length for each item in both lists
        max1 = max(len(x) for x in list1)
        max2 = max(len(x) for x in list1)

        str_format = "{:<" + str(max1) + "} {:<" + str(max2) + "}"

        # naive diff (compares per line without any line group matching
        print("    " + str_format.format(title1, title2))
        for x, y in zip(list1, list2):
            print(">>> " if x != y else "    ", end="")
            print(str_format.format(x, y))

    def naive_diff_set(self, set1, set2, title1, title2):
        if set1 != set2:
            print(f"Fields in {title1} that aren't in {title2}: {set1-set2}")
            print(f"Fields in {title2} that aren't in {title1}: {set2-set1}")

    # def verify_in_order(self, a, b, ):

    # def verify_no_order(self):

    #    x = set(self.simulated_fields)
    #    y = set(new_fields)
    #    if x != y:
    #        naive_diff(x, y, "Simulated", "Expected")
    #        raise Exception("Fields are different")

    def verify_initial_fields(self):
        # makes sure that the anki fields are the same
        anki_fields = self.get_anki_fields()

        # allows extra fields added by the user past the original fields
        # only done if order matters
        if self.in_order:
            first_anki_fields = anki_fields[: len(self.original_fields)]

            if first_anki_fields != self.original_fields:
                self.naive_diff_list(
                    first_anki_fields,
                    self.original_fields,
                    "Anki",
                    "Expected (Initial)",
                )
                raise Exception("Anki fields are different")

        else:
            # allows fields in anki that are not in the expected beginning,
            # BUT does not allow expected fields not in anki at the current moment
            # (i.e. you can't delete fields)
            anki_fields = set(anki_fields)
            original_fields = set(self.original_fields)

            if original_fields - anki_fields:
                raise Exception(
                    "Expected fields do not appear in Anki's fields list: "
                    f"{original_fields - anki_fields} "
                )

    def verify_simulator(self, actions):
        # test simulator
        simulator = FieldEditSimulator(original_fields=self.original_fields)
        simulator.simulate(actions)

        if self.in_order:
            if simulator.simulated_fields != self.new_fields:
                self.naive_diff_list(
                    simulator.simulated_fields, self.new_fields, "Simulated", "Expected"
                )
                raise Exception("Simulated fields do not match expected fields")
        else:
            x = set(simulator.simulated_fields)
            y = set(self.new_fields)
            if x != y:
                self.naive_diff_set(x, y, "Simulated", "Expected")
                raise Exception("Simulated fields do not match expected fields")

        # simulator.verify(new_fields=new_fields)

    def verify_api_reflect(self, actions):
        # test actions from ankiconnect
        ankiconnect_actions = set().union(
            *[action.ankiconnect_actions for action in actions]
        )

        api_actions = utils.invoke(
            "apiReflect", scopes=["actions"], actions=list(ankiconnect_actions)
        )["actions"]

        if len(ankiconnect_actions) != len(api_actions):
            print("Anki-Connect is missing the following actions:")
            for a in ankiconnect_actions:
                if a not in api_actions:
                    print("    " + a)
            raise Exception(
                "Anki-Connect is missing actions. "
                "Please update to the newest version of Anki-Connect."
            )

    def verify(self, actions):
        """
        verifies that:
        - fields in anki are the same
        - all actions are available from the currently installed anki connect
        - changes to fields are correct through the simulator
        """

        self.verify_initial_fields()
        self.verify_api_reflect(actions)
        self.verify_simulator(actions)

    def verify_post(self):
        # makes sure that the anki fields are the same
        anki_fields = utils.invoke("modelFieldNames", modelName="JP Mining Note")

        if self.in_order:
            # allows extra fields added by the user past the original fields
            first_anki_fields = anki_fields[: len(self.new_fields)]

            if anki_fields != first_anki_fields:
                self.naive_diff_list(first_anki_fields, self.new_fields, "Anki", "Expected (After)")
                raise Exception("Anki fields are different")
        else:

            # allows fields in anki that are not in the expected beginning,
            # BUT does not allow expected fields to not be in anki at the current moment
            # (i.e. you can't delete fields)
            anki_fields = set(anki_fields)
            new_fields = set(self.new_fields)

            if new_fields - anki_fields:
                raise Exception(
                    "Expected fields do not appear in Anki's fields list: "
                    f"{new_fields - anki_fields} "
                )



class ActionRunner:
    def __init__(self, current_ver: Version, new_ver: Version, in_order=True, note_changes=NOTE_CHANGES):
        """
        applies changes specified in the range (current_ver, new_ver]

        - verifies field changes by default
        """

        self.changes: list[NoteChange] = []
        self.edits_cards = False
        self.requires_user_action = False

        self.original_fields = None
        self.new_fields = None
        self.in_order = in_order
        self.verifier: Verifier | None = None

        if current_ver == new_ver:
            # nothing to do
            return

        if current_ver > new_ver:
            print("Warning: current version is higher than the newer version?")
            return

        for data in reversed(note_changes):
            ver = data.version
            if ver <= current_ver:
                # records last known fields_check
                self.original_fields = data.fields

            # finds all versions that are > current_ver and <= new_ver
            if (ver > current_ver) and (ver <= new_ver):
                self.changes.append(data)
                self.new_fields = data.fields

            if ver > new_ver:
                break

        # basic error checking
        assert self.original_fields is not None

        if not self.changes:  # if self.changes is empty
            return

        if self.new_fields is not None:
            self.verifier = Verifier(self.original_fields, self.new_fields, in_order=self.in_order)
            actions = sum((c.actions for c in self.changes), start=[])
            self.verifier.verify(actions)

        # sees if actions edits the cards
        for data in self.changes:
            for action in data.actions:
                if action.edits_cards:
                    self.edits_cards = True
                if isinstance(action, UserAction):
                    self.requires_user_action = True
                if self.edits_cards and self.requires_user_action:
                    return  # saves some cycles

    # def verify(self, original_fields, new_fields, in_order=True):

    ## makes sure that the anki fields are the same
    # field_names = utils.invoke("modelFieldNames", modelName="JP Mining Note")

    ## allows extra fields added by the user past the original fields
    ## only done if order matters
    # if in_order:
    #    first_fields = field_names[: len(original_fields)]

    #    if field_names != first_fields:
    #        naive_diff(first_fields, original_fields, "Anki", "Expected (Before)")
    #        raise Exception("Anki fields are different")

    # else:
    #    # allows fields in anki that are not in the expected beginning,
    #    # BUT does not allow expected fields not in anki at the current moment
    #    # (i.e. you can't delete fields)
    #    pass

    ## test simulator
    # simulator = FieldEditSimulator(original_fields=original_fields)
    # actions = sum((data.actions for data in self.changes), start=[])
    # simulator.simulate(actions)
    # simulator.verify(new_fields=new_fields)

    ## test actions from ankiconnect
    # ankiconnect_actions = set().union(
    #    *[action.ankiconnect_actions for action in actions]
    # )

    # api_actions = utils.invoke(
    #    "apiReflect", scopes=["actions"], actions=list(ankiconnect_actions)
    # )["actions"]

    # if len(ankiconnect_actions) != len(api_actions):
    #    print("Anki-Connect is missing the following actions:")
    #    for a in ankiconnect_actions:
    #        if a not in api_actions:
    #            print("    " + a)
    #    raise Exception(
    #        "Anki-Connect is missing actions. "
    #        "Please update to the newest version of Anki-Connect."
    #    )

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
            if not isinstance(action, UserAction):
                desc_list.append("    " + action.description)

        return "\n".join(desc_list)

    def get_user_actions_desc(self) -> str:
        desc_list = []

        desc_list.append(f"Required changes that must be done by the user:")

        user_changes_unique = set()  # stores classes that should be unique

        for data in self.changes:
            for action in data.actions:
                if isinstance(action, UserAction):
                    if action.unique:
                        if action.__class__ not in user_changes_unique:
                            user_changes_unique.add(action.__class__)
                            desc_list.append("    " + action.description)
                    else:
                        desc_list.append("    " + action.description)

        return "\n".join(desc_list)

    def get_actions_desc(self) -> str:
        desc_list = []

        for data in self.changes:
            desc_list.append(self.get_version_actions_desc(data))

        if self.requires_user_action:
            user_changes_desc = self.get_user_actions_desc()
            assert user_changes_desc
            desc_list.append(user_changes_desc)

        return "\n\n".join(desc_list)

    def has_actions(self) -> bool:
        return bool(self.changes)

    def warn(self) -> bool:
        """
        false if user doesn't want to run, true otherwise

        should only be ran if has actions
        """

        print(self.get_actions_desc())
        print()
        print()

        if self.edits_cards and self.requires_user_action:
            x = input(
                "WARNING: The above actions WILL modify the deck and the notes inside of it.\n"
                "Please make a backup (File -> Export -> Anki Collection Package) before\n"
                "running this, just in case!\n"
                "Please also ensure that Anki is open, but the card browser is not open.\n"
                "\n"
                "There are also required user actions that this script cannot perform.\n"
                "\n"
                "If you have made a backup, please type 'yes' to confirm, or anything else to abort: "
            )
        elif self.edits_cards and not self.requires_user_action:
            x = input(
                "WARNING: The above actions WILL modify the deck and the notes inside of it.\n"
                "Please make a backup (File -> Export -> Anki Collection Package) before\n"
                "running this, just in case!\n"
                "Please also ensure that Anki is open, but the card browser is not open.\n"
                "\n"
                "If you have made a backup, please type 'yes' to confirm, or anything else to abort: "
            )
        elif not self.edits_cards and self.requires_user_action:
            x = input(
                "WARNING: There are required user actions that must be done by the user.\n"
                "Please update each section specified above after this note is done updating.\n"
                "Please also ensure that Anki is open, but the card browser is not open.\n"
                "\n"
                "Type 'yes' to acknowledge, or anything else to abort: "
            )
        else:
            raise Exception("are there no actions?")

        if x != "yes":
            print("Aborting update...")
            return False
        return True

    def run(self):
        # hack to ensure that updateNoteFields fields will work
        #utils.invoke("guiBrowse", query="nid:1")
        for data in self.changes:
            for action in data.actions:
                action.run()

        if self.new_fields is not None and self.verifier is not None:
            self.verifier.verify_post()

            ## makes sure that the anki fields are the same
            #field_names = utils.invoke("modelFieldNames", modelName="JP Mining Note")
            ## allows extra fields added by the user past the original fields
            #first_fields = field_names[: len(self.new_fields)]

            #if field_names != first_fields:
            #    self.naive_diff_list(first_fields, self.new_fields, "Anki", "Expected (After)")
            #    raise Exception("Anki fields are different")

    def post_message(self):
        if self.requires_user_action:
            print()
            print("Make sure you don't forget to do the following actions afterwards:")
            print(self.get_user_actions_desc())

        # for action in self.actions:
        #    print(f"Running action {action}...")
        #    action.run()


def main(args=None):
    if args is None:
        args = utils.get_args(utils.add_args, add_args)
    config = utils.get_config(args)

    # action_runner = ActionRunner()
    # current_ver = Version.from_str(utils.get_version_from_anki())
    ##new_ver = Version.from_str(utils.get_version())
    # new_ver = Version(0, 9, 0, 0)
    # action_runner.get_note_changes(current_ver, new_ver)
    # print(action_runner.get_actions_desc())

    # if action_runner.has_actions():
    #    action_runner.run()

    ## action_runner.get_note_changes(V"0.2.0.0", "0.9.0.0")

    # v3 = Version(3, 3, 3, 3)
    # v4 = Version(3, 3, 3, 3)
    # v3.cmp(v4)
    # print(v3 < v4)
    # print(v3 > v4)
    # print(v3 == v4)
    # print(v3 != v4)

    # runner = ActionRunner("temp", warn=not args.no_warn)

    # note_name = config("notes", "jp-mining-note", "model-name").item()

    # runner.run(note_name)

    # from copy import deepcopy

    # s = FieldEditSimulator(NOTE_CHANGES[-1].fields)
    # f1 = deepcopy(s.simulated_fields)
    # s._move_field("PAShowInfo", 15-1)
    # f2 = deepcopy(s.simulated_fields)
    # s._move_field("PASeparateWordCard", 19-1)
    # f3 = deepcopy(s.simulated_fields)

    # for (i, a, b, c) in zip(range(len(f1)), f1, f2, f3):
    #    str_format = "{:<3} {:<25} {:<25} {:<25}"
    #    print(str_format.format(i, a, b, c))

    # return

    s = FieldEditSimulator(NOTE_CHANGES[-1].fields)
    actions = sum((data.actions for data in NOTE_CHANGES), start=[])
    # print(actions)
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
