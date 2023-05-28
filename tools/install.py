from __future__ import annotations


"""
https://github.com/Ajatt-Tools/AnkiNoteTypes/blob/main/antp/updater.py
https://github.com/FooSoft/anki-connect#model-actions
updateModelTemplates
"""

import os
import re
import base64
import shutil
import argparse
import traceback

from dataclasses import dataclass
from typing import Any, Dict, List

import utils
from utils import invoke

import action_runner as ar
import note_changes as nc


FRONT_FILENAME = "front.html"
BACK_FILENAME = "back.html"
CSS_FILENAME = "style.css"


CUSTOM_CSS_COMMENT = """
/*
 * Any CSS below the line should be preserved between updates.
 * If you plan on modifying the styles, please insert them below
 * the line below instead of directly modifying the CSS above.
 *
 * DO NOT CHANGE / REMOVE / REPOSITION THE LINE BELOW,
 * UNLESS YOU KNOW WHAT YOU ARE DOING!!!
 */
"""
CUSTOM_CSS_COMMENT_SEPARATOR = (
    "/* ================ jp-mining-note: INSERT CUSTOM CSS BELOW ================ */"
)
rx_CUSTOM_CSS_COMMENT_SEPARATOR = re.compile(
    r"""/\* ================ jp-mining-note: INSERT CUSTOM CSS BELOW ================ \*/(.*)""",
    re.DOTALL,
)  # DOTALL is so . matches newline


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
    path: str


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
        "--dev-ignore-note-changes",
        action="store_true",
        help="(dev option) bypasses the note changes section",
    )

    group.add_argument(
        "--dev-custom-note-changes",
        type=str,
        help="(dev option) input a custom note_changes json5 (or json) file",
    )

    group.add_argument(
        "--dev-do-not-verify",
        action="store_true",
        default=False,
        help="(dev option) bypasses the note changes section",
    )

    group.add_argument(
        "--dev-never-warn",
        action="store_true",
        default=False,
        help="(dev option) never warns the user even if there are note changes",
    )

    group.add_argument(
        "--dev-raise-anki-error",
        action="store_true",
        default=False,
        help="(dev option) raises errors instead of print & return",
    )

    group.add_argument(
        "--override-styling",
        action="store_true",
        default=False,
        help="overrides the css styling of the note, instead of trying to preserve user styles",
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
        "--backup-folder",
        type=str,
        default="backup",
        help="Backup folder path, starting from root.",
    )

    group.add_argument(
        "--ignore-order",
        action="store_true",
        help="Ignores the order of the fields list when updating. Adds the field to the end of the "
        "field list rather than in its designated spot. Ignores all MoveField actions.",
    )


class NoteUpdater:
    """
    updates (and backs up, if specified) the existing templates and css of the note
    """

    def __init__(
        self,
        input_folder: str,
        note_data: utils.Config,
        backup_folder: str | None = None,
        override_styling: bool = False,
    ):
        self.input_folder = input_folder
        self.backup_folder = backup_folder
        self.note_data = note_data
        self.override_styling = override_styling

    def read_css(self) -> str:
        input_path = os.path.join(
            self.input_folder, str(self.note_data("id").item()), CSS_FILENAME
        )
        with open(input_path, encoding="utf-8") as f:
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
        model_name = self.note_data("model-name").item()
        if model_name not in invoke("modelNames"):
            print(f"Nothing to backup, {model_name} not installed")
            return

        # helper function to simply write the backup
        def write_backup(folder, file_name, contents):
            path = os.path.join(folder, file_name)
            utils.gen_dirs(path)
            with open(path, "w", encoding="utf-8") as f:
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
        for template_id, template_config in self.note_data("templates").dict_items():
            template_name = template_config("name").item()
            dir_path = os.path.join(
                self.input_folder, str(self.note_data("id").item()), template_id
            )

            with open(
                os.path.join(dir_path, FRONT_FILENAME), encoding="utf-8"
            ) as front:
                front_contents = front.read()
            with open(os.path.join(dir_path, BACK_FILENAME), encoding="utf-8") as back:
                back_contents = back.read()

            templates.append(CardTemplate(template_name, front_contents, back_contents))

        return templates

    def read_built_model(self) -> NoteType:
        """
        reads the model from the build folder
        """
        model_name = self.note_data("model-name").item()

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

    def update_templates(self, model: NoteType):
        if invoke("updateModelTemplates", **self.format_templates(model)) is None:
            template_names = [t.name for t in model.templates]
            print(
                f"Updated {self.note_data('id').item()} templates {template_names} successfully."
            )

    def update_styling(self, model: NoteType):
        styling = model.css + CUSTOM_CSS_COMMENT + CUSTOM_CSS_COMMENT_SEPARATOR

        if self.override_styling:
            styling += "\n" * 10
        else:
            try:
                # attempts to use user styling
                # modelStyling returns dictionary of { "css": ... }
                card_styling = invoke("modelStyling", modelName=model.name)["css"]
                separator_search = rx_CUSTOM_CSS_COMMENT_SEPARATOR.search(card_styling)
                if separator_search is not None:
                    styling += separator_search.group(1)
            except Exception:
                msg = (
                    "Cannot get existing styling of note. "
                    "The note likely is not installed yet. "
                    "Skipping inline CSS update..."
                )
                print(msg)
                styling += "\n" * 10

        if (
            invoke("updateModelStyling", **self.format_styling(model.name, styling))
            is None
        ):
            print(f"Updated {self.note_data('id').item()} css successfully.")

    def format_styling(self, model_name: str, model_css: str) -> Dict[str, Any]:
        return {"model": {"name": model_name, "css": model_css}}

    def update(self):
        model = self.read_built_model()
        self.update_templates(model)
        self.update_styling(model)


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

    def __init__(
        self,
        input_folder: str,
        static_folder: str,
        backup_folder: str,
        attempt_copy: bool = True,
    ):
        self.input_folder = input_folder
        self.static_folder = static_folder
        self.backup_folder = backup_folder
        self.attempt_copy = attempt_copy
        self.media_dir = None
        self.attempted_get_media_dir = False

    def get_media_file(self, file_name, static=False) -> MediaFile:
        input_folder = self.static_folder if static else self.input_folder
        path = os.path.join(input_folder, file_name)
        with open(path, mode="rb") as f:
            contents = f.read()
        return MediaFile(name=file_name, contents=b64_encode(contents), path=path)

    def backup(self, file_name):
        try:
            # attempts to file from anki
            contents_b64 = invoke("retrieveMediaFile", filename=file_name)
            if not contents_b64:
                # file doesn't exist in the first place, nothing to backup
                print(f"No backup is necessary: `{file_name}` doesn't exist")
                return

            backup_file_path = os.path.join(self.backup_folder, file_name)
            # Originally, it was:
            # f"Backing up `{file_name}` -> `{os.path.relpath(backup_file_path)}` ..."
            # However, it seems like `os.path.relpath` causes errors for some Windows users for some reason???
            # Even if this is all wrapped with a try, it still fails in Anki????
            print(f"Backing up `{file_name}` -> `{backup_file_path}` ...")

            contents = b64_decode(contents_b64)

            utils.gen_dirs(backup_file_path)
            with open(backup_file_path, mode="w", encoding="utf-8") as f:
                f.write(contents)
        except Exception:
            traceback.print_exc()
            print(f"Cannot backup file: {file_name}. Skipping error...")

    def format_media(self, media: MediaFile) -> Dict[str, Any]:
        return {
            "filename": media.name,
            "data": media.contents,
        }

    def send_media(self, media: MediaFile):
        if invoke("storeMediaFile", **self.format_media(media)) == media.name:
            print(
                f"Updated '{media.name}' media file (via storeMediaFile) successfully."
            )

    def media_exists(self, file_name: str):
        return bool(invoke("getMediaFilesNames", pattern=file_name))

    def install_from_list(self, file_list, **kwargs):
        for file in file_list:
            self.install(file, **kwargs)

    def get_media_dir(self) -> str | None:
        if self.media_dir is None and not self.attempted_get_media_dir:
            try:
                self.media_dir = invoke("getMediaDirPath")
            except Exception:
                print("Could not get getMediaDirPath.")
                traceback.print_exc()
        self.attempted_get_media_dir = True
        return self.media_dir

    def attempt_copy_media_file(self, media: MediaFile):
        """
        Attempts to copy the actual media file, instead of using storeMediaFile.
        This should greatly improve performance.

        Returns whether the attempt was successful or not
        """
        if not self.attempt_copy:  # don't even try in the first place
            return False

        media_dir = self.get_media_dir()
        if media_dir is None:
            return False
        try:
            src = media.path
            dst = os.path.join(media_dir, media.name)
            shutil.copy(src, dst)
        except Exception:
            print("Could not get getMediaDirPath.")
            traceback.print_exc()
            return False
        print(f"Updated '{media.name}' media file successfully.")
        return True

    def install(self, file_name: str, static=False, backup=False):
        if static:
            # only adds if the media file doesn't already exist
            if self.media_exists(file_name):
                return
        if backup and self.media_exists(file_name):
            self.backup(file_name)

        media = self.get_media_file(file_name, static=static)
        if self.attempt_copy_media_file(media):  # success
            return

        self.send_media(media)


def main(args: argparse.Namespace | None = None) -> str | None:
    """
    - installs or updates the note, depending on the flag used
    - returns post message if there exists one
    """
    utils.assert_ankiconnect_running()

    if args is None:
        args = utils.get_args(utils.add_args, add_args)

    json_handler = utils.create_json_handler(args)
    note_data = utils.get_note_data(json_handler)
    model_name = note_data("model-name").item()

    root_folder = utils.get_root_folder()
    search_folder = args.build_folder if args.from_build else root_folder

    media_folder = os.path.join(search_folder, "media")
    static_folder = os.path.join(root_folder, "media")
    backup_folder = os.path.join(root_folder, args.backup_folder, utils.get_time_str())
    media_backup_folder = os.path.join(backup_folder, "media")

    backup = not args.no_backup

    note_updater = NoteUpdater(
        search_folder, note_data, backup_folder, args.override_styling
    )
    media_installer = MediaInstaller(media_folder, static_folder, media_backup_folder)

    is_installed = utils.note_is_installed(model_name)
    action_runner = None

    if is_installed:
        if not args.update:
            if args.dev_raise_anki_error:
                raise RuntimeError(
                    f"{model_name} is already installed. Did you mean to update?\n"
                )

            print(
                f"{model_name} is already installed. Did you mean to update?\n"
                "To update, run `python3 install.py --update`",
            )
            return

        # checks for note changes between versions
        if not args.dev_ignore_note_changes:
            current_ver = ar.Version.from_str(
                utils.get_version_from_anki(
                    note_data("model-name").item(), args.dev_input_version
                )
            )
            new_ver = ar.Version.from_str(utils.get_version(args))
            note_changes = nc.get_note_changes(
                json_handler, args.dev_custom_note_changes
            )
            action_runner = ar.ActionRunner(
                note_changes,
                current_ver,
                new_ver,
                in_order=(not args.ignore_order),
                verify=(not args.dev_do_not_verify),
            )  # also verifies field changes

            if action_runner.has_actions():
                if args.dev_never_warn:
                    pass
                elif not action_runner.warn():
                    return

                # must run before the note templates gets updated, in case
                # the new templates use different fields / is otherwise somehow
                # incompatable with the previous model (will raise an error after installing)
                print("Running actions. This may take a while...")
                action_runner.run()

        try:
            if backup:
                print(f"Backing up {model_name}...")
                note_updater.backup()
        except Exception:
            traceback.print_exc()
            print("Cannot backup note, skipping error...")

        print(f"Updating {model_name}...")
        note_updater.update()
        if action_runner:
            print("Running post actions...")
            action_runner.run_post()

        for option_file in note_data("media-install", "options").list():
            if args.install_options or not media_installer.media_exists(option_file):
                media_installer.install(option_file, static=False, backup=backup)

    else:
        if args.update and args.dev_raise_anki_error:
            raise RuntimeError(
                f"{model_name} cannot be found. Please check that your note\n"
                f"is named exactly '{model_name}'."
            )
        print(f"Installing {model_name}...")
        version = utils.get_version(args)
        install_path = os.path.join(
            root_folder, "all_versions", f"{version}-jpmn_example_cards.apkg"
        )
        invoke("importPackage", path=install_path)

    media_installer.install_from_list(
        note_data("media-install", "static").list(), static=True
    )

    media_installer.install_from_list(
        note_data("media-install", "dynamic").list(), static=False, backup=backup
    )

    if action_runner is not None and action_runner.has_actions():
        post_message = action_runner.get_post_message()
        print(post_message)
        return post_message


if __name__ == "__main__":
    main()
