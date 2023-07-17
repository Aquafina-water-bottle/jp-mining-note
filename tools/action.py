from __future__ import annotations

import traceback
from abc import ABC
from dataclasses import dataclass, field
from typing import Callable

from utils import invoke


@dataclass
class Action(ABC):
    description: str = field(init=False)
    edits_cards: bool = field(init=False)
    ankiconnect_actions: set[str] = field(init=False)

    def run(self, **args):
        pass

    # I have to define it for every object??? just having it here doesn't work
    # pretty sure it has to do with dataclass somehow
    # def __hash__(self) -> int:
    #    return hash(id(self))


@dataclass
class UserAction(Action):
    unique: bool = field(init=False)

    def run(self, **args):
        pass


@dataclass
class SetField(Action):
    field_name: str
    value: str

    def __post_init__(self):
        self.description = f"Sets the field `{self.field_name}` -> `{self.value}`"
        self.edits_cards = True
        self.ankiconnect_actions = {"findNotes", "updateNoteFields", "multi"}

    def run(self, **args):
        notes = invoke("findNotes", query=r'"note:JP Mining Note"')

        # creates multi request
        actions = []

        for nid in notes:
            action = {
                "action": "updateNoteFields",
                "params": {
                    "note": {
                        "id": nid,
                        "fields": {self.field_name: self.value},
                    }
                },
            }

            actions.append(action)

        return invoke("multi", actions=actions)

    def __hash__(self) -> int:
        return hash(id(self))


@dataclass
class RenameField(Action):
    old_field_name: str
    new_field_name: str

    def __post_init__(self):
        self.ankiconnect_actions = {"modelFieldRename"}
        self.description = (
            f"Renames the field `{self.old_field_name}` to {self.new_field_name}"
        )
        self.edits_cards = True

    def run(self, **args):
        return invoke(
            "modelFieldRename",
            modelName="JP Mining Note",
            oldFieldName=self.old_field_name,
            newFieldName=self.new_field_name,
        )

    def __hash__(self) -> int:
        return hash(id(self))


@dataclass
class MoveField(Action):
    field_name: str
    index: int

    def __post_init__(self):
        self.ankiconnect_actions = {"modelFieldReposition"}
        self.description = f"Moves the field `{self.field_name}` to index {self.index}"
        self.edits_cards = True

    def run(self, **args):
        # if not in order: this should be completely ignored
        if args.get("in_order", True):
            return invoke(
                "modelFieldReposition",
                modelName="JP Mining Note",
                fieldName=self.field_name,
                index=self.index,
            )

    def __hash__(self) -> int:
        return hash(id(self))


@dataclass
class AddField(Action):
    field_name: str
    index: int

    def __post_init__(self):
        self.ankiconnect_actions = {"modelFieldAdd", "modelFieldNames"}
        self.description = (
            f"Creates the field `{self.field_name}` at index {self.index}"
        )
        self.edits_cards = True

    def run(self, **args):
        if args.get("in_order", True):
            index = self.index
        else:
            index = len(invoke("modelFieldNames", modelName="JP Mining Note"))

        return invoke(
            "modelFieldAdd",
            modelName="JP Mining Note",
            fieldName=self.field_name,
            index=index,
        )

    def __hash__(self) -> int:
        return hash(id(self))


@dataclass
class DeleteField(Action):
    field_name: str

    def __post_init__(self):
        self.ankiconnect_actions = {"modelFieldRemove"}
        self.description = f"Deletes the field `{self.field_name}`"
        self.edits_cards = True

    def run(self, **args):
        return invoke(
            "modelFieldRemove",
            modelName="JP Mining Note",
            fieldName=self.field_name,
        )

    def __hash__(self) -> int:
        return hash(id(self))


@dataclass
class ChangeFieldFontSize(Action):
    field_name: str
    font_size: int

    def __post_init__(self):
        raise NotImplementedError()

        # self.ankiconnect_actions = {"modelFieldAdd", "modelFieldNames"}
        self.ankiconnect_actions = set()
        self.description = f"(TODO) Sets the font size of field `{self.field_name}` to {self.font_size}"
        self.edits_cards = True

    def run(self, **args):
        raise NotImplementedError()

    def __hash__(self) -> int:
        return hash(id(self))


@dataclass
class YomichanTemplatesChange(UserAction):
    def __post_init__(self):
        self.description = (
            "Update Yomichan's 'Anki Card Templates' section.\n"
            "See: https://aquafina-water-bottle.github.io/jp-mining-note/updating/#updating-yomichan-templates"
        )
        self.edits_cards = False
        self.unique = True
        self.ankiconnect_actions = set()

    def __hash__(self) -> int:
        return hash(id(self))


@dataclass
class YomichanFormatChange(UserAction):
    field: str
    previous_value: str
    new_value: str

    def __post_init__(self):
        self.description = (
            "Update Yomichan's 'Anki Card format' section "
            f"{self.field}: `{self.previous_value}` -> `{self.new_value}`.\n"
            "See https://aquafina-water-bottle.github.io/jp-mining-note/updating/#updating-yomichans-anki-card-format"
        )
        self.edits_cards = False
        self.unique = False
        self.ankiconnect_actions = set()

    def __hash__(self) -> int:
        return hash(id(self))


@dataclass
class AJTPitchAccentConfigChange(UserAction):
    additional_desc: str

    def __post_init__(self):
        self.description = (
            f"Update the AJT Pitch Accent config: {self.additional_desc}.\n"
            "See https://aquafina-water-bottle.github.io/jp-mining-note/setup/#ajt-pitch-accent"
        )
        self.edits_cards = False
        self.unique = False
        self.ankiconnect_actions = set()

    def __hash__(self) -> int:
        return hash(id(self))


@dataclass
class AJTFuriganaconfigChange(UserAction):
    additional_desc: str

    def __post_init__(self):
        self.description = (
            f"Update to the AJT Furigana config: {self.additional_desc}.\n"
            "See https://aquafina-water-bottle.github.io/jp-mining-note/setup/#ajt-furigana."
        )
        self.edits_cards = False
        self.unique = False
        self.ankiconnect_actions = set()

    def __hash__(self) -> int:
        return hash(id(self))


@dataclass
class BatchUpdate(Action):
    batch_func: Callable[[], None]
    description: str
    ankiconnect_actions: set[str]
    edits_cards = True
    fail_on_error = False

    def run(self, **args):
        if self.fail_on_error:
            self.batch_func()
        else:
            try:
                self.batch_func()
            except Exception:
                traceback.print_exc()
                print(
                    "Batch update failed. Please report this to the developer! Skipping error..."
                )

    def __hash__(self) -> int:
        return hash(id(self))


@dataclass
class NoteToUser(UserAction):
    description: str

    def __post_init__(self):
        self.edits_cards = False
        self.unique = False
        self.ankiconnect_actions = set()

    def __hash__(self) -> int:
        return hash(id(self))


if __name__ == "__main__":

    def f():
        pass

    print(BatchUpdate(batch_func=f, ankiconnect_actions=set(), description="test"))
