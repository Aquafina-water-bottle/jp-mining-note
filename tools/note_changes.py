from __future__ import annotations

from dataclasses import dataclass

import os

from typing import Sequence, Optional
from json_handler import JsonHandler
from version import Version
import action
import batch
import utils


@dataclass
class NoteChange:
    version: Version
    actions: list[action.Action]
    post_actions: list[action.Action]
    fields: list[str]


# hard coded for now to prevent arbitrary code injection type things
ACTION_TYPE_TO_OBJECT_CLASS = {
    "BatchUpdate": action.BatchUpdate,
    "NoteToUser": action.NoteToUser,
    "RenameField": action.RenameField,
    "AddField": action.AddField,
    "MoveField": action.MoveField,
    "DeleteField": action.DeleteField,
    "SetField": action.SetField,
    "YomichanTemplatesChange": action.YomichanTemplatesChange,
    "YomichanFormatChange": action.YomichanFormatChange,
}


def parse_actions(actions_data):
    batch_func_str_to_func = {f.__name__: f for f in batch.PUBLIC_FUNCTIONS}

    # actions
    actions = []
    for action_data in actions_data:
        action_type = action_data["type"]
        action_obj_cls = ACTION_TYPE_TO_OBJECT_CLASS[action_type]

        if action_type == "BatchUpdate":
            # override the batch_func parameter with the one in batch.py
            params = action_data["params"]
            params["batch_func"] = batch_func_str_to_func[params["batch_func"]]
            action_obj = action_obj_cls(**params)

        elif "params" in action_data:
            params = action_data["params"]
            if isinstance(params, list):
                action_obj = action_obj_cls(*params)
            else:
                assert isinstance(params, dict)
                action_obj = action_obj_cls(**params)
        else:
            action_obj = action_obj_cls()

        actions.append(action_obj)

    return actions


def get_note_changes(
    json_handler: utils.JsonHandler, file_path: str | None = None
) -> tuple[NoteChange]:
    if file_path is None:
        file_path = os.path.join(utils.get_root_folder(), "data", "note_changes.json5")
    json_data = json_handler.read_file(file_path)

    previous_fields: list[str] | None = None

    # converts from json -> python objects
    # fills from bottom-up
    note_changes: list[NoteChange] = []

    for note_change_data in reversed(json_data["note_changes"]):
        version = Version.from_str(note_change_data["version"])

        actions = parse_actions(note_change_data["actions"])
        if "post_actions" in note_change_data:
            post_actions = parse_actions(note_change_data["post_actions"])
        else:
            post_actions = []

        # fields
        fields = note_change_data["fields"]

        if fields == "SAME":  # attempts to copy from previous
            if previous_fields is None:
                raise RuntimeError(
                    "Cannot use SAME fields without any fields to begin with"
                )
            fields = previous_fields.copy()  # shallow copy
        previous_fields = fields.copy()

        nc = NoteChange(version, actions, post_actions, fields)
        note_changes.append(nc)

    return tuple(reversed(note_changes))


def get_version_fields(
    note_changes: Sequence[NoteChange], current_ver: Version
) -> list[str]:
    original_fields = None

    for data in reversed(note_changes):
        ver = data.version
        if ver <= current_ver:
            # records last known fields_check
            original_fields = data.fields
        else:
            break

    assert original_fields is not None
    return original_fields


def get_expected_fields(version_str: Optional[str] = None) -> list[str]:
    json_handler = JsonHandler()
    # note_data = utils.get_note_data(json_handler)
    note_name = "JP Mining Note"
    if version_str is None:
        version_str = utils.get_version_from_anki(note_name)
    version = Version.from_str(version_str)
    note_changes = get_note_changes(json_handler)
    expected_fields = get_version_fields(note_changes, version)

    return expected_fields
