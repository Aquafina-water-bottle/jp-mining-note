# TODO combine all this into one file (json?)
# combine with docs main.py
# combine with typescript Field type perhaps too

from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Optional
from json_handler import JsonHandler

import utils

@dataclass
class Field:
    name: str
    font: int # font size
    auto_fill: bool # whether this field should be auto-filled by some program (i.e. Yomichan, mpvacious, etc.)
    binary_field: bool

    # exact text used for Yomichan's "Anki Card Format"
    setup: Optional[str] = None

    # personal setup of the above
    personal_setup: Optional[str] = None

    # what animecards field maps to this card
    anime_cards_import: Optional[str] = None

    # when this field was introduced
    version: Optional[bool] = None

    # additional notes on the field
    notes: Optional[str] = None

    # whether it is collapsed by default or not
    default_collapsed: Optional[bool] = None


def get_fields(json_handler: JsonHandler):
    fields = []
    file_path = os.path.join(utils.get_root_folder(), "data", "fields.json5")
    for json_data in json_handler.read_file(file_path)["fields"]:
        field = Field(**json_data)
        fields.append(field)

    return fields


if __name__ == "__main__":
    json_handler = JsonHandler(True, True)
    print(get_fields(json_handler))

