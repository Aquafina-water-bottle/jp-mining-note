from abc import ABC
from dataclasses import dataclass, field
import batch
from typing import Callable

from utils import invoke


@dataclass
class Action(ABC):
    description: str = field(init=False)
    edits_cards: bool = field(init=False)
    ankiconnect_actions: set[str] = field(init=False)

    def run(self):
        pass


@dataclass
class UserAction(Action):
    # edits_cards: bool = field(init=False)
    unique: bool = field(init=False)

    def run(self):
        pass


@dataclass
class SetField(Action):
    field_name: str
    value: str

    def __post_init__(self):
        self.description = f"Sets the field `{self.field_name}` -> `{self.value}`"
        self.edits_cards = True
        self.ankiconnect_actions = {"findNotes", "updateNoteFields", "multi"}

    def run(self):
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

    def run(self):
        return invoke(
            "modelFieldRename",
            modelName="JP Mining Note",
            oldFieldName=self.old_field_name,
            newFieldName=self.new_field_name,
        )


@dataclass
class MoveField(Action):
    field_name: str
    index: int

    def __post_init__(self):
        self.ankiconnect_actions = {"modelFieldReposition"}
        self.description = f"Moves the field `{self.field_name}` to index {self.index}"
        self.edits_cards = True

    def run(self):
        return invoke(
            "modelFieldReposition",
            modelName="JP Mining Note",
            fieldName=self.field_name,
            index=self.index,
        )


@dataclass
class AddField(Action):
    field_name: str
    index: int  # -1 if doesn't exist

    def __post_init__(self):
        self.ankiconnect_actions = {"modelFieldAdd"}
        self.description = (
            f"Creates the field `{self.field_name}` at index {self.index}"
        )
        self.edits_cards = True

    def run(self):
        return invoke(
            "modelFieldAdd",
            modelName="JP Mining Note",
            fieldName=self.field_name,
            index=self.index,
        )


@dataclass
class DeleteField(Action):
    field_name: str

    def __post_init__(self):
        self.ankiconnect_actions = {"modelFieldRemove"}
        self.description = f"Deletes the field `{self.field_name}`"
        self.edits_cards = True

    def run(self):
        return invoke(
            "modelFieldRemove",
            modelName="JP Mining Note",
            fieldName=self.field_name,
        )


# @dataclass
# class ConfigLayoutChange(GlobalAction):
#    def __post_init__(self):
#        self.description = f"Requires an update to the config file"


@dataclass
class YomichanTemplatesChange(UserAction):
    def __post_init__(self):
        self.description = "Update Yomichan's 'Anki Card Templates' section (https://github.com/Aquafina-water-bottle/jp-mining-note/wiki/setup#yomichan-templates)"
        self.edits_cards = False
        self.unique = True
        self.ankiconnect_actions = set()


@dataclass
class YomichanFormatChange(UserAction):
    field: str
    previous_value: str
    new_value: str

    def __post_init__(self):
        self.description = f"Update Yomichan's 'Anki Card format' section ({self.field}: `{self.previous_value}` -> `{self.new_value}`)"
        self.edits_cards = False
        self.unique = False
        self.ankiconnect_actions = set()

@dataclass
class AJTPitchAccentConfigChange(UserAction):
    additional_desc: str

    def __post_init__(self):
        self.description = f"Update the AJT Pitch Accent config: {self.additional_desc} (https://github.com/Aquafina-water-bottle/jp-mining-note/wiki/setup#ajt-pitch-accent)"
        self.edits_cards = False
        self.unique = False
        self.ankiconnect_actions = set()


@dataclass
class AJTFuriganaconfigChange(UserAction):
    additional_desc: str

    def __post_init__(self):
        self.description = "Update to the AJT Furigana config: {self.additional_desc} (https://github.com/Aquafina-water-bottle/jp-mining-note/wiki/setup#ajt-furigana)"
        self.edits_cards = False
        self.unique = False
        self.ankiconnect_actions = set()


@dataclass
class BatchUpdate(Action):
    batch_func: Callable[[], None]
    description: str
    ankiconnect_actions: set[str]
    edits_cards = True

    def run(self):
        self.batch_func()


if __name__ == "__main__":

    def f():
        pass

    print(BatchUpdate(batch_func=f, ankiconnect_actions=set(), description="test"))

