"""
https://github.com/Ajatt-Tools/AnkiNoteTypes/blob/main/antp/updater.py
https://github.com/FooSoft/anki-connect#model-actions
updateModelTemplates
"""

import os
import base64
from dataclasses import dataclass

import json
import urllib.request
from typing import Any, Dict, List

import utils


# NOTE_TYPES_DIR = "cards"
FRONT_FILENAME = "front.html"
BACK_FILENAME = "back.html"
CSS_FILEPATH = "cards/style.css"
# CSS_FILENAME = "style.css"

OPTIONS_FILENAME = "jp-mining-note-options.js"
FIELD_FILENAME = "field.css"

MODEL_NAME = "JP Mining Note"
TEMPLATE_NAMES = {
    "main": "Mining Card",
    "pa_sent": "PA Sentence Card",
    #"pa_word": "PA Word Card",
    #"cloze_deletion": "Cloze Deletion Card",
}


@dataclass(frozen=True)
class CardTemplate:
    name: str
    front: str
    back: str


@dataclass(frozen=True)
class NoteType:
    name: str
    css: str
    templates: List[CardTemplate]


@dataclass(frozen=True)
class MediaFile:
    name: str
    contents: str


def add_args(parser):
    group = parser.add_argument_group(title="install")
    group.add_argument("-o", "--install-options", action="store_true")
    group.add_argument("-m", "--install-media", action="store_true")
    group.add_argument("-a", "--install-all", action="store_true")

    # TODO implement
    # force update version
    group.add_argument("--force", action="store_true")


# taken from https://github.com/FooSoft/anki-connect#python
def request(action, **params):
    return {"action": action, "params": params, "version": 6}


def invoke(action, **params):
    requestJson = json.dumps(request(action, **params)).encode("utf-8")
    response = json.load(
        urllib.request.urlopen(
            urllib.request.Request("http://localhost:8765", requestJson)
        )
    )
    if len(response) != 2:
        raise Exception("response has an unexpected number of fields")
    if "error" not in response:
        raise Exception("response is missing required error field")
    if "result" not in response:
        raise Exception("response is missing required result field")
    if response["error"] is not None:
        raise Exception(response["error"])
    return response["result"]


# taken from https://github.com/Ajatt-Tools/AnkiNoteTypes/blob/main/antp/updater.py
def format_templates(model: NoteType) -> Dict[str, Any]:
    return {
        "model": {
            "name": model.name,
            "templates": {
                template.name: {"Front": template.front, "Back": template.back}
                for template in model.templates
            },
        }
    }


def format_styling(model: NoteType) -> Dict[str, Any]:
    return {"model": {"name": model.name, "css": model.css}}


def format_media(media: MediaFile) -> Dict[str, Any]:
    return {"filename": media.name, "data": media.contents}

def format_create_model(model: NoteType) -> Dict[str, Any]:
    return {
        "modelName": "newModelName",
        "inOrderFields": ["Field1", "Field2", "Field3"],
        "css": "Optional CSS with default to builtin css",
        "isCloze": False,
        "cardTemplates": [
            {
                "Name": "My Card 1",
                "Front": "Front html {{Field1}}",
                "Back": "Back html  {{Field2}}"
            }
        ]
    }


def send_note_type(model: NoteType):
    print(invoke("updateModelTemplates", **format_templates(model)))
    print(invoke("updateModelStyling", **format_styling(model)))


def send_media(media: MediaFile):
    print(invoke("storeMediaFile", **format_media(media)))


class NoteReader:
    def __init__(self, input_folder, template_names):
        self.input_folder = input_folder
        self.template_names = template_names

    def read_card_templates(self) -> List[CardTemplate]:
        templates = []
        # TODO change to template_names
        for model_dir_name in TEMPLATE_NAMES:
            template_name = TEMPLATE_NAMES[model_dir_name]
            dir_path = os.path.join(self.input_folder, model_dir_name)

            with open(os.path.join(dir_path, FRONT_FILENAME), encoding="utf8") as front:
                with open(
                    os.path.join(dir_path, BACK_FILENAME), encoding="utf8"
                ) as back:
                    templates.append(
                        CardTemplate(template_name, front.read(), back.read())
                    )

        return templates

    def read_css(self) -> str:
        #with open(os.path.join(self.input_folder, CSS_FILENAME), encoding="utf8") as f:
        with open(CSS_FILEPATH, encoding="utf8") as f:
            return f.read()

    def read_model(self) -> NoteType:
        return NoteType(
            name=MODEL_NAME, css=self.read_css(), templates=self.read_card_templates()
        )

    def to_base64_str(self, string: str) -> str:
        return base64.b64encode(bytes(string, "utf-8")).decode("utf-8")

    # def read_options_file() -> str:
    #    with open(os.path.join("media", OPTIONS_FILENAME), encoding='utf8') as f:
    #        return f.read()
    #
    # def read_options_media() -> MediaFile:
    #    return MediaFile(name=OPTIONS_FILENAME, contents=to_base64_str(read_options_file()))

    def get_media_file(self, file_name, dir_name="media") -> MediaFile:
        with open(os.path.join(dir_name, file_name), encoding="utf8") as f:
            contents = f.read()
        return MediaFile(name=file_name, contents=self.to_base64_str(contents))


def main(args=None):
    if args is None:
        args = utils.get_args(utils.add_args, add_args)
    config = utils.get_config(args)

    reader = NoteReader(args.folder, config("install_opts", "template_names"))

    model = reader.read_model()
    send_note_type(model)

    if args.install_options or args.install_all:
        options_media = reader.get_media_file(OPTIONS_FILENAME, dir_name=args.folder)
        send_media(options_media)

    if args.install_media or args.install_all:
        options_media = reader.get_media_file(FIELD_FILENAME)
        send_media(options_media)


if __name__ == "__main__":
    main()
