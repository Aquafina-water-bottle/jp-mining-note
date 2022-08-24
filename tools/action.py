from abc import ABC
from dataclasses import dataclass, field


@dataclass
class Action(ABC):
    description: str = field(init=False)
    # edits_cards: bool = field(init=False)

    def run(self):
        pass


@dataclass
class GlobalAction(Action, ABC):
    description: str = field(init=False)
    # edits_cards: bool = field(init=False)

    def run(self):
        pass


@dataclass
class SetField(Action):
    field_name: str
    value: str

    def __post_init__(self):
        self.description = f"Sets the field `{self.field_name}` -> `{self.value}`"

    def run(self):
        pass


@dataclass
class MoveField(Action):
    field_name: str
    index: int

    def __post_init__(self):
        self.description = f"Moves the field `{self.field_name}` to index {self.index}"

    def run(self):
        pass

    #    models = col.models()

    #    ntdict = models.get(ntid)
    #    assert ntdict is not None

    #    field_map = models.field_map(ntdict)
    #    field = field_map[self.field_name][1]

    #    print(ntdict, field, self.index)

    # models.reposition_field(ntdict, field, self.index)
    # models.add_field(


@dataclass
class AddField(Action):
    field_name: str
    index: int

    def __post_init__(self):
        self.description = (
            f"Creates the field `{self.field_name}` at index {self.index}"
        )


@dataclass
class DeleteField(Action):
    field_name: str

    def __post_init__(self):
        self.description = f"Deletes the field `{self.field_name}`"


@dataclass
class ConfigLayoutChange(GlobalAction):
    def __post_init__(self):
        self.description = f"Requires an update to the config file"


@dataclass
class YomichanTemplatesChange(GlobalAction):
    def __post_init__(self):
        self.description = f"Requires an update to the yomichan templates"


@dataclass
class AJTPitchAccentconfigChange(GlobalAction):
    def __post_init__(self):
        self.description = f"Requires an update to the AJT Pitch Accent config"


@dataclass
class AJTFuriganaconfigChange(GlobalAction):
    def __post_init__(self):
        self.description = f"Requires an update to the AJT Furigana config"
