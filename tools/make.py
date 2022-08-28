"""


- builds based on config

"""

# from jinja2 import Template

import os
#import json
import shutil
#import argparse
from enum import Enum
#from dataclasses import dataclass

from jinja2 import Environment, FileSystemLoader, select_autoescape, StrictUndefined

import utils

#OPTIONS_FILENAME = "_jpmn-options.js"


def add_args(parser):
    group = parser.add_argument_group(title="make")
    #group.add_argument("-p", "--enable-prettier", action="store_true", default=False)
    group.add_argument("--to-release", action="store_true", default=False)


class GenerateType(Enum):
    JINJA = 1
    SASS = 2
    COPY = 3


class Generator:
    """
    handles file generation with jinja2, sass, or just copying
    """

    def __init__(
        self, jinja_root_folder: str, args, to_release=False
    ):
        self.jinja_root_folder = jinja_root_folder
        self.env = Environment(
            loader=FileSystemLoader(jinja_root_folder),
            autoescape=select_autoescape(),
            undefined=StrictUndefined,
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
            "ALWAYS_TRUE": [],
            "ALWAYS_FALSE": [],
            # "NOTE_OPTS": config("note_opts", get_dict=True),
            "NOTE_OPTS_JSON": utils.get_note_opts(config),
            # json_output =
            "VERSION": utils.get_version(args),
            #"NOTE_OPTS": config("note-opts"),
            "NOTE_OPTS": utils.get_note_opts(config, as_config=True),
            "NOTE_FILES": utils.get_note_config(),
            #"TEMPLATES": config("notes", "jp-mining-note", "templates"),
        }

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

    generator = Generator(
        templates_folder,
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
                os.path.join(note_model_id, card_model_id, file_name),
            )

    # generates css file for each note
    generator.generate(
        GenerateType.SASS,
        os.path.join(templates_folder, "scss", f"{note_model_id}.scss"),
        os.path.join(args.build_folder, note_model_id, "style.css"),
        os.path.join(note_model_id, "style.css"),
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
            os.path.join("media", file_config("output-file").item()),
        )

        if args.to_release:
            # also exports the existing cards
            import export

            export.main()


if __name__ == "__main__":
    # main(root_folder="templates")
    main()
