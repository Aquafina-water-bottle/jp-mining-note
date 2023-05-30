"""
goal of this script:
- prevent having the user to manually update their anki card each time
- automatically update yomichan-generated html when yomichan templates are updated
- ease the process of converting their existing cards into this with bulk additions
"""


from __future__ import annotations

import copy
import traceback

import utils
from action import Action, UserAction, RenameField, MoveField, AddField, DeleteField

# from note_changes import NOTE_CHANGES, Version, NoteChange
import note_changes as nc
from version import Version


class FieldVerifierException(Exception):
    def __init__(self, message):
        docs_link = "\n - Did you mean to run this with '--ignore-order'?\n - For more info, see here: https://aquafina-water-bottle.github.io/jp-mining-note/updating/#fieldverifierexception"
        super().__init__(message + docs_link)


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

    def _rename_field(self, old_field_name: str, new_field_name: str):
        assert old_field_name in self.simulated_fields
        if new_field_name in self.simulated_fields:
            raise FieldVerifierException(
                f"Cannot rename field {old_field_name} -> {new_field_name}: {new_field_name} field already exists"
            )

        i = self.simulated_fields.index(old_field_name)
        self.simulated_fields[i] = new_field_name

    def _move_field(self, field_name: str, index: int):
        TEMP_FIELD = "TEMP_FIELD_NAME"
        assert field_name in self.simulated_fields

        self.simulated_fields.remove(field_name)
        self.simulated_fields.insert(index, TEMP_FIELD)
        i = self.simulated_fields.index(TEMP_FIELD)
        self.simulated_fields[i] = field_name

    def _add_field(self, field_name: str, index: int):
        if field_name not in self.simulated_fields:
            self.simulated_fields.append(field_name)

        if index != -1:
            self._move_field(field_name, index)

    def _delete_field(self, field_name: str):
        assert field_name in self.simulated_fields
        self.simulated_fields.remove(field_name)

    def simulate(self, actions: list[Action], reset: bool = True):
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
    def __init__(
        self, original_fields: list[str], new_fields: list[str], in_order: bool = True
    ):
        self.original_fields = original_fields
        self.new_fields = new_fields
        self.in_order = in_order
        self.anki_fields: None | list[str] = None

    def get_anki_fields(self) -> list[str]:
        if self.anki_fields is None:
            self.anki_fields = utils.invoke(
                "modelFieldNames", modelName="JP Mining Note"
            )

        return self.anki_fields

    def naive_diff_list(
        self, list1: list, list2: list, title1: str, title2: str
    ) -> str:
        """
        called "naive diff" as it diffs naive-ly per line, without checking for groups of lines
        that are the same
        """
        # Python has difflib but difflib isn't used because it doesn't have a way to
        # format it between columns it seems

        # extends the list to the longest length
        max_len = max(len(list1), len(list2))
        for l in (list1, list2):
            l += ["" * (max_len - len(l))]

        # gets max length for each item in both lists
        max1 = max(len(x) for x in list1)
        max2 = max(len(x) for x in list1)

        str_format = "{:<" + str(max1) + "} {:<" + str(max2) + "}"

        # naive diff (compares per line without any line group matching
        msg = ""
        msg += "    " + str_format.format(title1, title2) + "\n"
        for x, y in zip(list1, list2):
            msg += ">>> " if x != y else "    "
            msg += str_format.format(x, y) + "\n"
        print(msg)  # TODO: optinal print?
        return msg

    def naive_diff_set(self, set1: set, set2: set, title1: str, title2: str) -> str:
        msg = f"Fields in {title1} that aren't in {title2}: {set1-set2}\n"
        msg += f"Fields in {title2} that aren't in {title1}: {set2-set1}"
        print(msg)  # TODO: optinal print?
        return msg

    def verify_initial_fields(self):
        # makes sure that the anki fields are the same
        anki_fields = self.get_anki_fields()

        # allows extra fields added by the user past the original fields
        # only done if order matters
        if self.in_order:
            first_anki_fields = anki_fields[: len(self.original_fields)]

            if first_anki_fields != self.original_fields:
                # for x in difflib.context_diff(
                #    first_anki_fields,
                #    self.original_fields,
                #    fromfile="Anki",
                #    tofile="Expected (Initial)",
                #    n=3,
                # ):
                #    print(x)
                # exit(1)

                self.naive_diff_list(
                    first_anki_fields,
                    self.original_fields,
                    "Anki",
                    "Expected (Initial)",
                )
                raise FieldVerifierException("Anki fields are different")

        else:
            # allows fields in anki that are not in the expected beginning,
            # BUT does not allow expected fields not in anki at the current moment
            # (i.e. you can't delete fields)
            anki_fields = set(anki_fields)
            original_fields = set(self.original_fields)

            if original_fields - anki_fields:
                raise FieldVerifierException(
                    "Expected fields do not appear in Anki's fields list: "
                    f"{original_fields - anki_fields} "
                )

    def verify_simulator(self, actions: list[Action]):
        # test simulator
        simulator = FieldEditSimulator(original_fields=self.original_fields)
        simulator.simulate(actions)

        if self.in_order:
            if simulator.simulated_fields != self.new_fields:
                # for x in difflib.context_diff(
                #    simulator.simulated_fields,
                #    self.new_fields,
                #    fromfile="Simulated",
                #    tofile="Expected",
                #    n=1000,
                # ):
                #    print(x)
                # exit(1)

                self.naive_diff_list(
                    simulator.simulated_fields, self.new_fields, "Simulated", "Expected"
                )
                raise FieldVerifierException(
                    "Simulated fields do not match expected fields"
                )
        else:
            x = set(simulator.simulated_fields)
            y = set(self.new_fields)
            if x != y:
                self.naive_diff_set(x, y, "Simulated", "Expected")
                raise FieldVerifierException(
                    "Simulated fields do not match expected fields"
                )

        # simulator.verify(new_fields=new_fields)

    def verify_api_reflect(self, actions: list[Action]):
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

    def verify(self, actions: list[Action]):
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
                self.naive_diff_list(
                    first_anki_fields, self.new_fields, "Anki", "Expected (After)"
                )
                raise FieldVerifierException("Anki fields are different")
        else:
            # allows fields in anki that are not in the expected beginning,
            # BUT does not allow expected fields to not be in anki at the current moment
            # (i.e. you can't delete fields)
            anki_fields = set(anki_fields)
            new_fields = set(self.new_fields)

            if new_fields - anki_fields:
                raise FieldVerifierException(
                    "Expected fields do not appear in Anki's fields list: "
                    f"{new_fields - anki_fields} "
                )


# @dataclass
# class ActionRunnable:
#    """
#    not a very good name, but not sure what a good name is
#    """
#    action: Action
#    should_run: bool

# @dataclass
# class ActionMetadata:
#    """
#    not a very good name, but not sure what a good name is
#    """
#    should_run: bool
#    index: int # start from 0


class ActionRunner:
    def __init__(
        self,
        note_changes: tuple[nc.NoteChange],
        current_ver: Version,
        new_ver: Version,
        in_order=True,
        verify=True,
        # select_note_changes: list[int] | None=None,
    ):
        """
        applies changes specified in the range (current_ver, new_ver]

        - verifies field changes by default
        """

        self.changes: list[nc.NoteChange] = []
        self.post_changes: list[nc.NoteChange] = []

        self.edits_cards: bool = False
        self.requires_user_action: bool = False

        self.original_fields: None | list[str] = None
        self.new_fields: None | list[str] = None
        self.in_order: bool = in_order
        self.verifier: Verifier | None = None

        self.action_args = {"in_order": in_order}

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
        assert self.original_fields is not None, current_ver

        if not self.changes:  # if self.changes is empty
            return

        if verify:
            if self.new_fields is not None:
                self.verifier = Verifier(
                    self.original_fields, self.new_fields, in_order=self.in_order
                )
                actions = self.get_filtered_actions()
                self.verifier.verify(actions)
                post_actions = self.get_filtered_post_actions()
                self.verifier.verify_api_reflect(post_actions)

        # sees if actions edits the cards
        for action in self.get_filtered_actions():
            if action.edits_cards:
                self.edits_cards = True
            if isinstance(action, UserAction):
                self.requires_user_action = True
            if self.edits_cards and self.requires_user_action:
                return  # saves some cycles

    def get_filtered_actions(self) -> list[Action]:
        """
        simply flattens the actions from the changes.
        """
        result = []
        for c in self.changes:
            for a in c.actions:
                result.append(a)
        return result

    def get_filtered_post_actions(self) -> list[Action]:
        """
        simply flattens the actions from the changes.
        """
        result = []
        for c in self.changes:
            for a in c.post_actions:
                result.append(a)
        return result

    def clear(self):
        self.changes.clear()

    def indent(self, desc: str, indent: str = "    ", start: str = "  - ") -> str:
        return start + desc.replace("\n", "\n" + indent)

    def get_version_actions_desc(self, data: nc.NoteChange) -> str:
        """
        description w/out global changes
        """

        desc_list = []

        version = data.version
        desc_list.append(f"Changes from {version}:")

        for action in data.actions:
            # metadata = self.action_metadata[action]
            # if metadata.should_run and not isinstance(action, UserAction):
            if not isinstance(action, UserAction):
                # num_disp = "{:02d}: ".format(metadata.index+1)
                # desc_list.append(self.indent(action.description, start=num_disp))
                desc_list.append(self.indent(action.description))

        return "\n".join(desc_list)

    def get_user_actions_desc(self) -> str:
        desc_list = []

        desc_list.append(f"Required changes that must be done by the user:")

        user_changes_unique = set()  # stores classes that should be unique

        for data in self.changes:
            for action in data.actions:
                # metadata = self.action_metadata[action]
                # if metadata.should_run and isinstance(action, UserAction):
                if isinstance(action, UserAction):
                    # num_disp = "{:02d}: ".format(metadata.index+1)
                    if action.unique:
                        if action.__class__ not in user_changes_unique:
                            user_changes_unique.add(action.__class__)
                            # desc_list.append(self.indent(action.description, start=num_disp))
                            desc_list.append(self.indent(action.description))
                    else:
                        # desc_list.append(self.indent(action.description, start=num_disp))
                        desc_list.append(self.indent(action.description))

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
                "There are also required user actions that this script cannot perform,\n"
                "shown above. Please perform these actions after running this script.\n"
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
                "Please perform these actions after running this script.\n"
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
        for data in self.changes:
            for action in data.actions:
                action.run(**self.action_args)

        if self.new_fields is not None and self.verifier is not None:
            try:
                self.verifier.verify_post()
            except Exception:
                traceback.print_exc()
                print("Post-field check failed, skipping error...")

    def run_post(self):
        for data in self.changes:
            for action in data.post_actions:
                action.run(**self.action_args)

    def get_post_message(self) -> str | None:
        if self.requires_user_action:
            return (
                "Make sure you don't forget to do the following actions afterwards:\n"
                f"{self.get_user_actions_desc()}"
            )


if __name__ == "__main__":
    pass
