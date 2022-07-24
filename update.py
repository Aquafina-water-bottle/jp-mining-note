"""
https://github.com/Ajatt-Tools/AnkiNoteTypes/blob/main/antp/updater.py
https://github.com/FooSoft/anki-connect#model-actions
updateModelTemplates
"""

import os
import argparse
import base64
from dataclasses import dataclass

import json
import urllib.request
from typing import Any, Dict, List


NOTE_TYPES_DIR = "cards"
FRONT_FILENAME = "front.html"
BACK_FILENAME = "back.html"
CSS_FILEPATH = "cards/main/style.css"
OPTIONS_FILENAME = "jp-mining-note-options.js"
FIELD_FILENAME = "field.css"

MODEL_NAME = "JP Mining Note"
TEMPLATE_NAMES = {
    "main": "Mining Card",
    "pa_sentence": "PA Sentence Card",
    "pa_word": "PA Word Card",
    "cloze_deletion": "Cloze Deletion Card",
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



# taken from https://github.com/FooSoft/anki-connect#python
def request(action, **params):
    return {'action': action, 'params': params, 'version': 6}

def invoke(action, **params):
    requestJson = json.dumps(request(action, **params)).encode('utf-8')
    response = json.load(urllib.request.urlopen(urllib.request.Request('http://localhost:8765', requestJson)))
    if len(response) != 2:
        raise Exception('response has an unexpected number of fields')
    if 'error' not in response:
        raise Exception('response is missing required error field')
    if 'result' not in response:
        raise Exception('response is missing required result field')
    if response['error'] is not None:
        raise Exception(response['error'])
    return response['result']


# taken from https://github.com/Ajatt-Tools/AnkiNoteTypes/blob/main/antp/updater.py
def format_templates(model: NoteType) -> Dict[str, Any]:
    return {
        "model": {
            "name": model.name,
            "templates": {
                template.name: {"Front": template.front, "Back": template.back} for template in model.templates
            }
        }
    }

def format_styling(model: NoteType) -> Dict[str, Any]:
    return {
        "model": {
            "name": model.name,
            "css": model.css
        }
    }

def format_media(media: MediaFile) -> Dict[str, Any]:
    return {
        "filename": media.name,
        "data": media.contents
    }


def read_card_templates() -> List[CardTemplate]:
    templates = []
    for model_dir_name in TEMPLATE_NAMES:
        template_name = TEMPLATE_NAMES[model_dir_name]
        dir_path = os.path.join(NOTE_TYPES_DIR, model_dir_name)

        with open(os.path.join(dir_path, FRONT_FILENAME), encoding='utf8') as front:
            with open(os.path.join(dir_path, BACK_FILENAME), encoding='utf8') as back:
                templates.append(CardTemplate(template_name, front.read(), back.read()))

    return templates

def read_css() -> str:
    with open(CSS_FILEPATH, encoding='utf8') as f:
        return f.read()

def read_model() -> NoteType:
    return NoteType(name=MODEL_NAME, css=read_css(), templates=read_card_templates())


def to_base64_str(string: str) -> str:
    return base64.b64encode(bytes(string, "utf-8")).decode("utf-8")


#def read_options_file() -> str:
#    with open(os.path.join("media", OPTIONS_FILENAME), encoding='utf8') as f:
#        return f.read()
#
#def read_options_media() -> MediaFile:
#    return MediaFile(name=OPTIONS_FILENAME, contents=to_base64_str(read_options_file()))



def get_media_file(file_name) -> MediaFile:
    with open(os.path.join("media", file_name), encoding='utf8') as f:
        contents = f.read()
    return MediaFile(name=file_name, contents=to_base64_str(contents))


def send_note_type(model: NoteType):
    print(invoke("updateModelTemplates", **format_templates(model)))
    print(invoke("updateModelStyling", **format_styling(model)))

def send_media(media: MediaFile):
    print(invoke("storeMediaFile", **format_media(media)))



def get_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('-o', '--import-options', action="store_true")
    parser.add_argument('-m', '--import-media', action="store_true")
    parser.add_argument('-a', '--all', action="store_true")
    return parser.parse_args()

def main():
    args = get_args()

    model = read_model()
    send_note_type(model)

    if args.import_options or args.all:
        options_media = get_media_file(OPTIONS_FILENAME)
        send_media(options_media)

    if args.import_media or args.all:
        options_media = get_media_file(FIELD_FILENAME)
        send_media(options_media)


if __name__ == "__main__":
    main()

