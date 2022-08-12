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

# MODEL_NAME = "JP Mining Note"
TEMPLATE_NAMES = {
    "main": "Mining Card",
    "pa_sent": "PA Sentence Card",
    # "pa_word": "PA Word Card",
    # "cloze_deletion": "Cloze Deletion Card",
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
    group.add_argument(
        "--from-release",
        action="store_true",
        help="installs files directly from the release version files, "
        "rather than the build folder",
    )

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
                "Back": "Back html  {{Field2}}",
            }
        ],
    }


def to_base64_str(string: str) -> str:
    return base64.b64encode(bytes(string, "utf-8")).decode("utf-8")


# class NoteReader:
class NoteInstaller:
    def __init__(self, input_folder: str):
        self.input_folder = input_folder
        # self.note_model_id = note_model_id
        # self.templates = templates

    def read_css(self) -> str:
        # with open(os.path.join(self.input_folder, CSS_FILENAME), encoding="utf8") as f:
        input_path = os.path.join(self.input_folder, "style.css")
        with open(input_path, encoding="utf8") as f:
            return f.read()

    def get_templates(self, note_config) -> List[CardTemplate]:
        templates = []
        for template_id, template_config in note_config("templates").dict_items():
            template_name = template_config("name")
            dir_path = os.path.join(self.input_folder, template_id)

            with open(os.path.join(dir_path, FRONT_FILENAME), encoding="utf8") as front:
                front_contents = front.read()
            with open(os.path.join(dir_path, BACK_FILENAME), encoding="utf8") as back:
                back_contents = back.read()

            templates.append(CardTemplate(template_name, front_contents, back_contents))

        return templates

    def read_model(self, note_config) -> NoteType:
        model_name = note_config("model-name").item()

        return NoteType(
            name=model_name,
            css=self.read_css(),
            templates=self.get_templates(note_config),
        )

    # def read_options_file() -> str:
    #    with open(os.path.join("media", OPTIONS_FILENAME), encoding='utf8') as f:
    #        return f.read()
    #
    # def read_options_media() -> MediaFile:
    #    return MediaFile(name=OPTIONS_FILENAME, contents=to_base64_str(read_options_file()))

    # taken from https://github.com/Ajatt-Tools/AnkiNoteTypes/blob/main/antp/updater.py
    def format_templates(self, model: NoteType) -> Dict[str, Any]:
        return {
            "model": {
                "name": model.name,
                "templates": {
                    template.name: {"Front": template.front, "Back": template.back}
                    for template in model.templates
                },
            }
        }

    def format_styling(self, model: NoteType) -> Dict[str, Any]:
        return {"model": {"name": model.name, "css": model.css}}


    def install(self, note_config: utils.Config):
        model = self.read_model(note_config)
        print(invoke("updateModelTemplates", **self.format_templates(model)))
        print(invoke("updateModelStyling", **self.format_styling(model)))


class MediaInstaller:
    def __init__(self, input_folder: str):
        self.input_folder = input_folder

    def get_media_file(self, file_name, dir_name="media") -> MediaFile:
        with open(os.path.join(dir_name, file_name), encoding="utf8") as f:
            contents = f.read()
        return MediaFile(name=file_name, contents=to_base64_str(contents))

    def format_media(self, media: MediaFile) -> Dict[str, Any]:
        return {"filename": media.name, "data": media.contents}

    def send_media(self, media: MediaFile):
        print(invoke("storeMediaFile", **self.format_media(media)))

    def install(self, media_config: utils.Config):
        pass


def main(args=None):
    if args is None:
        args = utils.get_args(utils.add_args, add_args)
    config = utils.get_config(args)

    note_installer = NoteInstaller(args.folder)
    for note_model_id in config("notes").dict():
        # note_installer = NoteInstaller(
        #    args.folder,
        #    config("note", note_model_id),
        #    # config("note", note_model_id, "templates").dict(),
        # )
        note_installer.install(config("note", note_model_id))

    media_installer = MediaInstaller(args.folder)

    # model = reader.read_model()
    # send_note_type(model)

    #if args.install_options or args.install_all:
    #    options_media = reader.get_media_file(OPTIONS_FILENAME, dir_name=args.folder)
    #    send_media(options_media)

    #if args.install_media or args.install_all:
    #    options_media = reader.get_media_file(FIELD_FILENAME)
    #    send_media(options_media)


if __name__ == "__main__":
    main()
