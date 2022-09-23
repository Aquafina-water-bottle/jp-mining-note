"""


- builds based on config

"""

# from jinja2 import Template

import os

import json
import shutil

# import argparse
from enum import Enum
from dataclasses import dataclass

# from dataclasses import dataclass

from jinja2 import Environment, FileSystemLoader, select_autoescape, StrictUndefined, pass_context

import utils

# OPTIONS_FILENAME = "_jpmn-options.js"


def add_args(parser):
    group = parser.add_argument_group(title="make")
    # group.add_argument("-p", "--enable-prettier", action="store_true", default=False)
    group.add_argument("--to-release", action="store_true", default=False)


class GenerateType(Enum):
    JINJA = 1
    SASS = 2
    COPY = 3


class TextContainer:
    card_types = ["main", "pa_sent", "pa_word", "cloze_deletion"]
    sides = ["front", "back"]
    enabled_modules: list | None = None # added in the main function of this script

    def __init__(self, module_name):
        self.module_name = module_name

        # matx[side][card]
        self.matx = [([""] * len(TextContainer.card_types)) for _ in TextContainer.sides]

    def _get_indices(self, card_type, side):
        assert card_type in TextContainer.card_types
        assert side in TextContainer.sides

        x = TextContainer.sides.index(side)
        y = TextContainer.card_types.index(card_type)

        return (x, y)

    def set(self, card_type, side, value):
        """
        sets specific (card_type, side) pair
        """
        x, y = self._get_indices(card_type, side)
        self.matx[x][y] = value

    def set_all(self, value):
        for card_type in TextContainer.card_types:
            for side in TextContainer.sides:
                x, y = self._get_indices(card_type, side)
                self.matx[x][y] = value

    def set_front(self, value):
        for card_type in TextContainer.card_types:
            x, y = self._get_indices(card_type, "front")
            self.matx[x][y] = value

    def set_back(self, value):
        for card_type in TextContainer.card_types:
            x, y = self._get_indices(card_type, "back")
            self.matx[x][y] = value

    def set_card_type(self, card_type, value):
        for side in TextContainer.sides:
            x, y = self._get_indices(card_type, side)
            self.matx[x][y] = value

    def _get(self, card_type, side):
        x, y = self._get_indices(card_type, side)
        return self.matx[x][y]

    def get(self, card_type, side):
        if self.module_name in TextContainer.enabled_modules:
            return self._get(card_type, side)
        return ""



class JavascriptContainer:
    def __init__(self, module_name):
        self.globals = TextContainer(module_name)
        self.functions = TextContainer(module_name)
        self.keybinds = TextContainer(module_name)
        self.run = TextContainer(module_name)


#class ModuleContainer:
#    def __init__(self):
#        self.modules = []
#
#    def add_modules(self, all_modules, enabled_modules):
#        for m in all_modules:
#            if m.id in enabled_modules:
#                print("A", m)
#                self.modules.append(m)
#
#    def __getattr__(self):
#        pass



class Generator:
    """
    handles file generation with jinja2, sass, or just copying
    """

    def __init__(self, jinja_root_folders: list[str], args, to_release=False):
        self.jinja_root_folders = jinja_root_folders
        self.env = Environment(
            loader=FileSystemLoader(jinja_root_folders),
            autoescape=select_autoescape(),
            undefined=StrictUndefined,
            extensions=["jinja2.ext.do"],
            # lstrip_blocks = True,
        )

        config = utils.get_config(args)

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

        self.data = {
            # "ALWAYS_TRUE": optimize_opts("always-filled").list(),
            # "ALWAYS_FALSE": optimize_opts("never-filled").list(),
            #"ALWAYS_TRUE": [],
            #"ALWAYS_FALSE": [],
            # "NOTE_OPTS": config("note_opts", get_dict=True),
            "NOTE_OPTS_JSON": utils.get_note_opts(config),
            # json_output =
            "VERSION": utils.get_version(args),
            # "NOTE_OPTS": config("note-opts"),
            "NOTE_OPTS": utils.get_note_opts(config, as_config=True),
            "NOTE_FILES": utils.get_note_config(),
            "COMPILE_OPTIONS": config("compile-options"),

            "JavascriptContainer": JavascriptContainer,
            "TextContainer": TextContainer,
            #"ModuleContainer": ModuleContainer,
            # "TEMPLATES": config("notes", "jp-mining-note", "templates"),
        }

    @pass_context
    def wtf(self, context, var):
        #result = do_something(value)
        return context.vars[var]


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
            template = self.env.get_template(input_file)
            result = template.render(self.data)
            # output_file_path = os.path.join(self.root_folder, output_file)

            with open(output_file, "w") as file:
                file.write(result)

        elif type == GenerateType.SASS:
            error_code = os.system(f"{self.sass_path} {input_file} {output_file}")
            if error_code != 0:
                raise Exception(f"sass failed with error code {error_code}")

        elif type == GenerateType.COPY:
            shutil.copy(input_file, output_file)

        if self.to_release:
            utils.gen_dirs(release_output)
            shutil.copy(output_file, release_output)


# def main(root_folder: str = "templates", args=None):
def main(args=None):

    if args is None:
        args = utils.get_args(utils.add_args, add_args)
    if args.release:
        args.to_release = True

    config = utils.get_config(args)

    root_folder = utils.get_root_folder()
    templates_folder = os.path.join(root_folder, "templates")
    overrides_folder = os.path.join(root_folder, config("templates-override-folder").item())
    search_folders = [overrides_folder, templates_folder]

    TextContainer.enabled_modules = config("compile-options", "enabled-modules").list()

    generator = Generator(
        search_folders,
        args,
        to_release=args.to_release,
    )

    note_config = utils.get_note_config()

    # generates for each template
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

    # generates css file for each note
    generator.generate(
        GenerateType.SASS,
        os.path.join(templates_folder, "scss", f"{note_model_id}.scss"),
        os.path.join(args.build_folder, note_model_id, "style.css"),
        os.path.join(root_folder, note_model_id, "style.css"),
    )

    type_map = {
        "scss": GenerateType.SASS,
        "jinja": GenerateType.JINJA,
        "copy": GenerateType.COPY,
    }

    # generates each file in media-build
    for file_config in note_config("media-build").list_items():
        gen_type = type_map[file_config("type").item()]

        if gen_type == GenerateType.JINJA:
            input_file = os.path.join(file_config("input-file").item())
        else:
            input_file = os.path.join(
                templates_folder, file_config("input-file").item()
            )

        output_file = os.path.join(
            args.build_folder, "media", file_config("output-file").item()
        )

        generator.generate(
            gen_type,
            input_file,
            output_file,
            os.path.join(root_folder, "media", file_config("output-file").item()),
        )


if __name__ == "__main__":
    # main(root_folder="templates")
    main()
    #x = TextContainer()
    #print(x.matx)

