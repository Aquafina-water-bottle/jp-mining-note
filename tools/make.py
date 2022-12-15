from __future__ import annotations

"""
- builds based on config

"""

import os
import shutil
import argparse
from enum import Enum
from distutils.dir_util import copy_tree

from jinja2 import (
    Environment,
    FileSystemLoader,
    select_autoescape,
    StrictUndefined,
    TemplateNotFound,
)
from json_minify import json_minify
import json

import utils


FRONT_FILENAME = "front.html"
BACK_FILENAME = "back.html"
CSS_FILENAME = "style.css"


def add_args(parser: argparse.ArgumentParser):
    group = parser.add_argument_group(title="make")
    group.add_argument("--to-release", action="store_true", default=False)


class GenerateType(Enum):
    JINJA = 1
    SASS = 2  # only one pass with `sass`
    COPY = 3
    CSS = 4  # two passes: first with jinja (to include css-folders), and the second with sass
    COPY_SCSS = 5


class TextContainer:
    card_types = ["main", "pa_sent", "pa_word", "cloze_deletion"]
    sides = ["front", "back"]

    # - class variable because TextContainer is always initialized in templates
    # - prevents repeatedly having to set the variable to the same thing
    #   on each initialization
    # - var set in the main function of this script
    # enabled_modules: list = []

    def __init__(self, module_name: str):
        self.module_name = module_name

        # matx[side][card]
        self.matx = [
            ([""] * len(TextContainer.card_types)) for _ in TextContainer.sides
        ]

    def _get_indices(self, card_type: str, side: str):
        assert card_type in TextContainer.card_types
        assert side in TextContainer.sides

        x = TextContainer.sides.index(side)
        y = TextContainer.card_types.index(card_type)

        return (x, y)

    def set(self, card_type: str, side: str, value: str):
        """
        sets specific (card_type, side) pair
        """
        x, y = self._get_indices(card_type, side)
        self.matx[x][y] = value

    def set_all(self, value: str):
        """
        sets for every card type and side
        """
        for card_type in TextContainer.card_types:
            for side in TextContainer.sides:
                x, y = self._get_indices(card_type, side)
                self.matx[x][y] = value

    def set_front(self, value: str):
        for card_type in TextContainer.card_types:
            x, y = self._get_indices(card_type, "front")
            self.matx[x][y] = value

    def set_back(self, value: str):
        for card_type in TextContainer.card_types:
            x, y = self._get_indices(card_type, "back")
            self.matx[x][y] = value

    def set_card_type(self, card_type: str, value: str):
        for side in TextContainer.sides:
            x, y = self._get_indices(card_type, side)
            self.matx[x][y] = value

    def _get(self, card_type: str, side: str) -> str:
        x, y = self._get_indices(card_type, side)
        return self.matx[x][y]

    def get(self, card_type: str, side: str, enabled_modules: list[str]) -> str:
        # if self.module_name in TextContainer.enabled_modules:
        #    return self._get(card_type, side)
        # return ""
        if self.module_name in enabled_modules:
            return self._get(card_type, side)
        return ""


class JavascriptContainer:
    def __init__(self, module_name):
        # Global variables, usually only used for cache.
        # It is extremely unlikely that you will use this.
        # Instead, please favor the `functions` variable.
        self.globals = TextContainer(module_name)

        # A place to define global classes and functions.
        # This is where the bulk of the existing code is,
        # as most existing code is wrapped as a self-contained module that returns a class.
        self.functions = TextContainer(module_name)

        # Equivalent to the main function of the module.
        # Put any code you want to run upon template load here.
        self.run = TextContainer(module_name)


class Translator:
    def __init__(self, languages: list[str], translations: dict[str, dict[str, str]]):
        self.languages = languages
        self.translations = translations

    def get(self, key) -> str:
        for lang in self.languages:
            if lang in self.translations and key in self.translations[lang]:
                return self.translations[lang][key]

        raise Exception(f"Cannot find translation for {key}.")


class Generator:
    """
    handles file generation with jinja2, sass, or just copying
    """

    def __init__(
        self,
        jinja_root_folders: list[str],
        config: utils.Config,
        to_release: bool = False,
    ):
        self.jinja_root_folders = jinja_root_folders
        self.loader = FileSystemLoader(jinja_root_folders)
        self.env = Environment(
            loader=self.loader,
            autoescape=select_autoescape(),
            undefined=StrictUndefined,
            extensions=["jinja2.ext.do"],
        )

        filters = {
            # https://eengstrom.github.io/musings/add-bitwise-operations-to-ansible-jinja2
            "bitwise_and": lambda x, y: x & y,
            "bitwise_or": lambda x, y: x | y,
            "bitwise_xor": lambda x, y: x ^ y,
            "bitwise_complement": lambda x: ~x,
            "bitwise_shift_left": lambda x, y: x << y,
            "bitwise_shift_right": lambda x, y: x >> y,
        }
        for k, v in filters.items():
            self.env.filters[k] = v

        self.sass_path = config("sass-path").item()
        self.to_release = to_release

        self.css_folders = config("compile-options", "css-folders").list()

        root_folder = utils.get_root_folder()
        translation_file_path = os.path.join(
            root_folder, config("translation-file").item()
        )

        with open(translation_file_path, encoding="utf-8") as f:
            translations = json.loads(json_minify(f.read()))

        languages = config("compile-options", "display-languages").list()
        translator = Translator(languages, translations)

        self.data = {
            # helper methods
            "NOTE_OPTS_JSON": utils.get_note_opts(config),
            "NOTE_OPTS": utils.get_note_opts(config, as_config=True),
            "NOTE_FILES": utils.get_note_config(),
            "COMPILE_OPTIONS": config("compile-options"),
            "TRANSLATOR": translator,
            # helper methods
            "get_directories_with_file": self.get_directories_with_file,
            # helper classes
            "JavascriptContainer": JavascriptContainer,
            "TextContainer": TextContainer,
            "_print": print,
        }

    def set_data(self, key, value):
        self.data[key] = value

    def get_directories_with_file(self, file_name):
        """
        returns all x if `scss/x/file_name` exists

        TODO: a non-hacky approach to adding custom scss

        preferable solution should have the following:
        - uses scss, not css
        - folders can be placed somewhere in the overrides folder
            - and preferably the same spot, i.e. overrides/scss/{folder}/...

        potential solutions:
        1. paste rendered template directly into css code, then render with scss
            - problem: potential un-wanted side-effects

        2. directly copy/paste the found file into build/tmp/
            - problem: does NOT take into account external files (i.e. common.scss)

        3. copy templates/scss -> build/tmp, and then copy overrides/scss -> build/tmp
            - should theoretically work, as it mimics the behavior of the existing loader
            - problem: feels hacky, skipping over the loading system entirely
            - currently the best solution I can think of

        4. raw css
            - problem: potentially unwanted side-effects if directly copy/paste
            - problem: not scss, and scss does help quite a bit
            - could be an external file using <link>?
                - won't work on fields and editor

        """
        CSS_ROOT = os.path.join(utils.get_root_folder(), "src", "scss")
        # CSS_ROOT = "scss"

        scss_folders = []
        for search_folder in self.jinja_root_folders:
            scss_folder = os.path.join(search_folder, "scss")
            if os.path.isdir(scss_folder):
                scss_folders.append(scss_folder)

        result = []
        for d in self.css_folders:
            for scss_root in scss_folders:
                path = os.path.join(scss_root, d, file_name)

                if os.path.isfile(path):
                    result.append(d)
                    # only allows one copy for each css_folder
                    break

            # valid code for testing via the loader
            # try:
            #    self.loader.get_source(self.env, path)
            #    result.append(f)
            # except TemplateNotFound as e:
            #    pass

        return result

    def generate(
        self,
        type: GenerateType,
        input_file: str,
        output_file: str,
        release_output: str,
    ):
        """
        input file is rooted at (repo root)/templates only for jinja types,
        otherwise rooted at (repo root).

        output rooted at (repo root)
        """

        # creates directories if it doesn't exist
        utils.gen_dirs(output_file)

        if type == GenerateType.JINJA:
            # the .replace() is a hack for the build to work on windows?
            template = self.env.get_template(input_file.replace("\\", "/"))
            result = template.render(self.data)

            with open(output_file, "w", encoding="utf-8") as file:
                file.write(result)

        elif type == GenerateType.SASS:
            command = f"{self.sass_path} {input_file} {output_file}"
            error_code = os.system(command)
            if error_code != 0:
                print(f"attempted sass command: `{command}`")
                raise Exception(f"sass failed with error code {error_code}")

        elif type == GenerateType.COPY:
            if os.path.isdir(input_file):
                copy_tree(input_file, output_file)
            else:
                shutil.copy(input_file, output_file)

        elif type == GenerateType.COPY_SCSS:
            # input is the templates folder (src)
            # output is tmp/scss

            # copies src/scss to tmp/scss

            for search_folder in self.jinja_root_folders:
                scss_folder = os.path.join(search_folder, "scss")
                if os.path.isdir(scss_folder):
                    copy_tree(scss_folder, output_file)

        else:
            raise Exception(f"invalid GenerateType: {type}")

        if self.to_release and release_output:
            utils.gen_dirs(release_output)
            shutil.copy(output_file, release_output)


def main(args=None):

    if args is None:
        args = utils.get_args(utils.add_args, add_args)
    if args.release:
        args.to_release = True

    config = utils.get_config(args)

    # search folders are: override, theme, src
    root_folder = utils.get_root_folder()
    templates_folder = os.path.join(root_folder, "src")
    overrides_folder = os.path.join(
        root_folder, config("templates-override-folder").item()
    )
    search_folders = [overrides_folder, templates_folder]

    theme_folder_item = config("templates-theme-folder").item()
    if theme_folder_item is not None:
        theme_folder = os.path.join(root_folder, "themes", theme_folder_item)
        search_folders.insert(1, theme_folder)

    # TextContainer.enabled_modules = config("compile-options", "enabled-modules").list()

    generator = Generator(
        search_folders,
        config,
        to_release=args.to_release,
    )
    generator.set_data("VERSION", utils.get_version(args))

    note_config = utils.get_note_config()

    # generates for each card type
    note_model_id = note_config("id").item()
    for card_model_id in note_config("templates").dict():
        for file_name in ("front.html", "back.html"):
            input_file = os.path.join(note_model_id, card_model_id, file_name)
            output_file = os.path.join(
                args.build_folder, note_model_id, card_model_id, file_name
            )

            generator.generate(
                GenerateType.JINJA,
                input_file,
                output_file,
                os.path.join(root_folder, note_model_id, card_model_id, file_name),
            )

    type_map = {
        "scss": GenerateType.SASS,
        "jinja": GenerateType.JINJA,
        "copy": GenerateType.COPY,
        "copy-scss": GenerateType.COPY_SCSS,
    }

    # generates each file in "build"
    for file_config in note_config("build").list_items():
        gen_type = type_map[file_config("type").item()]

        input_root = file_config.get_item_if_exists("input-dir", "")
        if input_root == "build":
            input_file = os.path.join(
                args.build_folder, file_config("input-file").item()
            )
        elif gen_type == GenerateType.JINJA:
            input_file = os.path.join(file_config("input-file").item())
        else:
            input_file = os.path.join(
                templates_folder, file_config("input-file").item()
            )

        output_file = os.path.join(args.build_folder, file_config("output-file").item())

        release_output = ""
        if file_config.get_item_if_exists("to-release", True):
            release_output = os.path.join(
                root_folder, file_config("output-file").item()
            )

        generator.generate(gen_type, input_file, output_file, release_output)


if __name__ == "__main__":
    main()
