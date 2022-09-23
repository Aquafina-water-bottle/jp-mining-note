"""
https://github.com/Ajatt-Tools/AnkiNoteTypes/blob/main/antp/updater.py
https://github.com/FooSoft/anki-connect#model-actions
updateModelTemplates
"""

import os
import base64
import argparse
import datetime

from dataclasses import dataclass
from typing import Any, Dict, List

import utils
from utils import invoke

import action_runner as ar


FRONT_FILENAME = "front.html"
BACK_FILENAME = "back.html"
CSS_FILENAME = "style.css"
TIME_FORMAT = "%Y-%m-%d-%H-%M-%S"


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


def add_args(parser: argparse.ArgumentParser):
    group = parser.add_argument_group(title="install")
    group.add_argument("--install-options", action="store_true")
    group.add_argument(
        "-u",
        "--update",
        action="store_true",
        help="updates the note instead of installing it",
    )
    group.add_argument(
        "--from-build",
        action="store_true",
        help="installs files directly from the build folder, "
        "rather than the release files",
    )

    group.add_argument(
        "--ignore-note-changes",
        action="store_true",
        help="(dev option) bypasses the note changes section",
    )

    group.add_argument(
        "--from-version",
        type=str,
        default=None,
        help="Installs an older version of the card. "
        "This option only works on first install, and not when updating the note.",
    )

    group.add_argument(
        "--no-backup",
        type=str,
        default=None,
        help="Doesn't make a backup for your card. "
        "Note that it's still highly recommended to backup your cards the normal way (through Anki). "
        "This way of backing up is primarily for debugging purposes, and in case someone accidentally "
        "overwrites their note type.",
    )

    group.add_argument(
        "--ignore-order",
        action="store_true",
        help="does not check for order of fields when updating",
    )


class NoteUpdater:
    """
    updates (and backs up, if specified) the existing templates and css of the note
    """

    def __init__(
        self,
        input_folder: str,
        note_config: utils.Config,
        backup_folder: str | None = None,
    ):
        self.input_folder = input_folder
        self.backup_folder = backup_folder
        self.note_config = note_config

    def read_css(self) -> str:
        input_path = os.path.join(
            self.input_folder, str(self.note_config("id").item()), CSS_FILENAME
        )
        with open(input_path, encoding="utf8") as f:
            return f.read()

    def backup(self):
        """
        backs up as the following:

        - backup folder
           L Note name in Anki (e.g. "JP Mining Note")
              L style.css
              L Template name in Anki (e.g. "Mining Card")
                 L front.html
                 L back.html
              ...
        """
        assert self.backup_folder is not None
        model_name = self.note_config("model-name").item()
        if model_name not in invoke("modelNames"):
            print(f"Nothing to backup, {model_name} not installed")
            return

        # helper function to simply write the backup
        def write_backup(folder, file_name, contents):
            path = os.path.join(folder, file_name)
            utils.gen_dirs(path)
            with open(path, "w") as f:
                f.write(contents)

        templates = invoke("modelTemplates", modelName=model_name)
        for card_name, values in templates.items():
            front = values["Front"]
            back = values["Back"]
            folder = os.path.join(self.backup_folder, model_name, card_name)

            write_backup(folder, "front.html", front)
            write_backup(folder, "back.html", back)

        css_contents = invoke("modelStyling", modelName=model_name)["css"]
        folder = os.path.join(self.backup_folder, model_name)
        write_backup(folder, "style.css", css_contents)

    def get_templates(self) -> List[CardTemplate]:
        """
        gets the templates from the JPMN project
        """

        templates = []
        for template_id, template_config in self.note_config("templates").dict_items():
            template_name = template_config("name").item()
            dir_path = os.path.join(
                self.input_folder, str(self.note_config("id").item()), template_id
            )

            with open(os.path.join(dir_path, FRONT_FILENAME), encoding="utf8") as front:
                front_contents = front.read()
            with open(os.path.join(dir_path, BACK_FILENAME), encoding="utf8") as back:
                back_contents = back.read()

            templates.append(CardTemplate(template_name, front_contents, back_contents))

        return templates

    def read_model(self) -> NoteType:
        model_name = self.note_config("model-name").item()

        return NoteType(
            name=model_name,
            css=self.read_css(),
            templates=self.get_templates(),
        )

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

    def update(self):
        model = self.read_model()
        if invoke("updateModelTemplates", **self.format_templates(model)) is None:
            template_names = [t.name for t in model.templates]
            print(
                f"Updated {self.note_config('id').item()} templates {template_names} successfully."
            )
        if invoke("updateModelStyling", **self.format_styling(model)) is None:
            print(f"Updated {self.note_config('id').item()} css successfully.")


def b64_decode(contents):
    """
    turns b64 string into string
    """
    return base64.b64decode(contents).decode("utf-8")


def b64_encode(contents):
    """
    turns string into b64 string (as opposed to a binary object)
    """
    return base64.b64encode(contents).decode("utf-8")


class MediaInstaller:
    """
    updates (and backs up, if specified) arbitrary media files
    """

    def __init__(self, input_folder: str, static_folder: str, backup_folder: str):
        self.input_folder = input_folder
        self.static_folder = static_folder
        self.backup_folder = backup_folder

    def get_media_file(self, file_name, static=False) -> MediaFile:
        input_folder = self.static_folder if static else self.input_folder

        with open(os.path.join(input_folder, file_name), mode="rb") as f:
            contents = f.read()
        return MediaFile(
            name=file_name, contents=base64.b64encode(contents).decode("utf-8")
        )

    def backup(self, file_name):
        # attempts to file from anki
        contents_b64 = invoke("retrieveMediaFile", filename=file_name)
        if not contents_b64:
            # file doesn't exist in the first place, nothing to backup
            print(f"No backup is necessary: `{file_name}` doesn't exist")
            return

        contents = base64.b64decode(contents_b64).decode("utf-8")

        backup_file_path = os.path.join(self.backup_folder, file_name)
        print(f"Backing up `{file_name}` -> `{os.path.relpath(backup_file_path)}` ...")

        utils.gen_dirs(backup_file_path)
        with open(backup_file_path, mode="w") as f:
            f.write(contents)

    def format_media(self, media: MediaFile) -> Dict[str, Any]:
        return {
            "filename": media.name,
            "data": media.contents,
        }

    def send_media(self, media: MediaFile):
        if invoke("storeMediaFile", **self.format_media(media)) == media.name:
            print(f"Updated '{media.name}' media file successfully.")

    def media_exists(self, file_name: str):
        return bool(invoke("getMediaFilesNames", pattern=file_name))

    def install_from_list(self, file_list, **kwargs):
        for file in file_list:
            self.install(file, **kwargs)

    def install(self, file_name: str, static=False, backup=False):
        if static:
            # only adds if the media file doesn't already exist
            if self.media_exists(file_name):
                return
        if backup and self.media_exists(file_name):
            self.backup(file_name)

        media = self.get_media_file(file_name, static=static)
        self.send_media(media)


def main(args=None):
    utils.assert_ankiconnect_running()

    if args is None:
        args = utils.get_args(utils.add_args, add_args)

    note_config = utils.get_note_config()
    model_name = note_config("model-name").item()

    root_folder = utils.get_root_folder()
    search_folder = args.build_folder if args.from_build else root_folder

    media_folder = os.path.join(search_folder, "media")
    static_folder = os.path.join(root_folder, "media")
    backup_folder = os.path.join(
        root_folder, "backup", datetime.datetime.now().strftime(TIME_FORMAT)
    )
    media_backup_folder = os.path.join(backup_folder, "media")

    backup = not args.no_backup

    note_updater = NoteUpdater(search_folder, note_config, backup_folder)
    media_installer = MediaInstaller(media_folder, static_folder, media_backup_folder)

    is_installed = utils.note_is_installed(model_name)
    action_runner = None

    if is_installed:
        if not args.update:
            print(
                f"{model_name} is already installed. Did you mean to update?\n"
                "To update, run `python3 install.py --update`",
            )
            return

        # checks for note changes between versions
        if not args.ignore_note_changes:
            current_ver = ar.Version.from_str(utils.get_version_from_anki())
            new_ver = ar.Version.from_str(utils.get_version(args))
            action_runner = ar.ActionRunner(
                current_ver, new_ver, in_order=(not args.ignore_order)
            )  # also verifies field changes

            if action_runner.has_actions():
                if not action_runner.warn():  # == false
                    return

                # must run before the note templates gets updated, in case
                # the new templates use different fields / is otherwise somehow
                # incompatable with the previous model (will raise an error after installing)
                action_runner.run()

        if backup:
            print(f"Backing up {model_name}...")
            note_updater.backup()

        print(f"Updating {model_name}...")
        note_updater.update()

        for option_file in note_config("media-install", "options").list():
            if args.install_options or not media_installer.media_exists(option_file):
                media_installer.install(option_file, static=False, backup=backup)

    else:
        print(f"Installing {model_name}...")
        version = utils.get_version(args)
        install_path = os.path.join(
            root_folder, "all_versions", f"{version}-jpmn_example_cards.apkg"
        )
        invoke("importPackage", path=install_path)

    media_installer.install_from_list(
        note_config("media-install", "static").list(), static=True
    )

    media_installer.install_from_list(
        note_config("media-install", "dynamic").list(), static=False, backup=backup
    )

    if action_runner is not None and action_runner.has_actions():
        action_runner.post_message()


if __name__ == "__main__":
    main()
