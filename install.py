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
    #group.add_argument("-o", "--install-options", action="store_true")
    #group.add_argument("-m", "--install-media", action="store_true")
    #group.add_argument("-a", "--install-all", action="store_true")
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




#def to_base64_str(string: str) -> str:
#    return base64.b64encode(bytes(string, "utf-8")).decode("utf-8")


# class NoteReader:
class NoteInstaller:
    def __init__(self, input_folder: str):
        self.input_folder = input_folder
        # self.note_model_id = note_model_id
        # self.templates = templates

    def read_css(self, note_config: utils.Config) -> str:
        # with open(os.path.join(self.input_folder, CSS_FILENAME), encoding="utf8") as f:
        input_path = os.path.join(self.input_folder, str(note_config.key()), "style.css")
        with open(input_path, encoding="utf8") as f:
            return f.read()

    def get_templates(self, note_config: utils.Config) -> List[CardTemplate]:
        templates = []
        for template_id, template_config in note_config("templates").dict_items():
            template_name = template_config("name").item()
            dir_path = os.path.join(self.input_folder, str(note_config.key()), template_id)

            with open(os.path.join(dir_path, FRONT_FILENAME), encoding="utf8") as front:
                front_contents = front.read()
            with open(os.path.join(dir_path, BACK_FILENAME), encoding="utf8") as back:
                back_contents = back.read()

            templates.append(CardTemplate(template_name, front_contents, back_contents))

        return templates

    def read_model(self, note_config: utils.Config) -> NoteType:
        model_name = note_config("model-name").item()

        return NoteType(
            name=model_name,
            css=self.read_css(note_config),
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
        if invoke("updateModelTemplates", **self.format_templates(model)) is None:
            print(f"Updated {note_config.key()} templates successfully.")
        if invoke("updateModelStyling", **self.format_styling(model)) is None:
            print(f"Updated {note_config.key()} css successfully.")


class MediaInstaller:
    def __init__(self, input_folder: str):
        self.input_folder = input_folder
        #self.media_files = None:

    def get_media_file(self, file_name) -> MediaFile:
        with open(os.path.join(self.input_folder, file_name), mode="rb") as f:
            contents = f.read()
        #print(contents)
        return MediaFile(name=file_name, contents=base64.b64encode(contents).decode("utf-8"))

        #if binary:
        #else:
        #    with open(os.path.join(self.input_folder, file_name), encoding="utf8") as f:
        #        contents = f.read()
        #    return MediaFile(name=file_name, contents=to_base64_str(contents))

    def format_media(self, media: MediaFile) -> Dict[str, Any]:
        return {
            "filename": media.name,
            "data": media.contents,
        }

    def send_media(self, media: MediaFile):
        if invoke("storeMediaFile", **self.format_media(media)) == media.name:
            print(f"Updated '{media.name}' media file successfully.")


    def media_exists(self, file_name: str):
        #if self.media_files is None:
        return bool(invoke("getMediaFilesNames", **{"pattern": ""}))

    def install(self, file_name: str, static=False):
        if static:
            # only adds if the media file doesn't already exist
            if self.media_exists(file_name):
                return

        media = self.get_media_file(file_name)
        #return
        self.send_media(media)


def main(args=None):
    if args is None:
        args = utils.get_args(utils.add_args, add_args)
    #if args.release:
    #    args.from_release = True
    if __name__ == "__main__":
        args.from_release = True

    config = utils.get_config(args)

    static_media = set()
    dynamic_media = set()

    note_folder = "." if args.from_release else args.folder
    note_installer = NoteInstaller(note_folder)
    for note_config in config("notes").dict_values():
        # note_installer = NoteInstaller(
        #    args.folder,
        #    config("note", note_model_id),
        #    # config("note", note_model_id, "templates").dict(),
        # )
        note_installer.install(note_config)

        static_media |= set(note_config("media-install", "static").list())
        dynamic_media |= set(note_config("media-install", "dynamic").list())

    media_folder = "media" if args.from_release else os.path.join(args.folder, "media")
    media_installer = MediaInstaller(media_folder)

    for media_file in dynamic_media:
        media_installer.install(media_file, static=False)
    for media_file in static_media:
        media_installer.install(media_file, static=True)


    #media_installer.install("test_silence.wav", binary=True)
    #media_installer.install("NotoSerifJP-Bold.otf")


    # model = reader.read_model()
    # send_note_type(model)

    # if args.install_options or args.install_all:
    #    options_media = reader.get_media_file(OPTIONS_FILENAME, dir_name=args.folder)
    #    send_media(options_media)

    # if args.install_media or args.install_all:
    #    options_media = reader.get_media_file(FIELD_FILENAME)
    #    send_media(options_media)


if __name__ == "__main__":
    main()
