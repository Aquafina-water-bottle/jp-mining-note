from abc import ABC
from dataclasses import dataclass, field
import batch
from typing import Callable

from utils import invoke


@dataclass
class Action(ABC):
    description: str = field(init=False)
    edits_cards: bool = field(init=False)

    def run(self):
        pass


@dataclass
class GlobalAction(Action):
    # edits_cards: bool = field(init=False)
    key: str = field(init=False)

    def run(self):
        pass


@dataclass
class SetField(Action):
    field_name: str
    value: str

    def __post_init__(self):
        self.description = f"Sets the field `{self.field_name}` -> `{self.value}`"
        self.edits_cards = True

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
class YomichanTemplatesChange(GlobalAction):
    def __post_init__(self):
        self.description = "Requires an update to the Yomichan 'Anki Card Templates' section"
        self.edits_cards = False
        self.key = self.__class__.__name__ # is there an easier way of doing this w/out copying/pasting?


@dataclass
class YomichanFormatChange(GlobalAction):
    def __post_init__(self):
        self.description = "Requires an update to the Yomichan 'Anki Card format' section"
        self.edits_cards = False
        self.key = self.__class__.__name__ # is there an easier way of doing this w/out copying/pasting?

@dataclass
class AJTPitchAccentconfigChange(GlobalAction):
    def __post_init__(self):
        self.description = "Requires an update to the AJT Pitch Accent config"
        self.edits_cards = False
        self.key = self.__class__.__name__ # is there an easier way of doing this w/out copying/pasting?


@dataclass
class AJTFuriganaconfigChange(GlobalAction):
    def __post_init__(self):
        self.description = "Requires an update to the AJT Furigana config"
        self.edits_cards = False
        self.key = self.__class__.__name__ # is there an easier way of doing this w/out copying/pasting?


@dataclass
class BatchUpdate(Action):
    batch_func: Callable[[], None]
    description: str
    edits_cards = True

    def run(self):
        self.batch_func()


if __name__ == "__main__":

    def f():
        pass

    print(BatchUpdate(batch_func=f, description="test"))
