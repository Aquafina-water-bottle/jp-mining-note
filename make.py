"""


- builds based on config

"""


# from jinja2 import Template

import os
import json
import shutil
import argparse
from enum import Enum
from pathlib import Path
from dataclasses import dataclass

from jinja2 import Environment, FileSystemLoader, select_autoescape, StrictUndefined

import utils

OPTIONS_FILENAME = "jp-mining-note-options.js"


def add_args(parser):
    group = parser.add_argument_group(title="build")
    group.add_argument("-p", "--enable-prettier", action="store_true", default=False)
    group.add_argument("--to-release", action="store_true", default=False)


def gen_dirs(file_path):
    Path(file_path).parent.mkdir(parents=True, exist_ok=True)


class GenerateType(Enum):
    JINJA = 1
    SASS = 2
    COPY = 3


class Generator:
    """
    handles file generation with jinja2, sass, or just copying
    """

    def __init__(
        self, jinja_root_folder: str, config, enable_prettier=False, to_release=False
    ):
        self.jinja_root_folder = jinja_root_folder
        self.env = Environment(
            loader=FileSystemLoader(jinja_root_folder),
            autoescape=select_autoescape(),
            undefined=StrictUndefined,
            # lstrip_blocks = True,
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

        self.get_render_data(config)
        self.sass_path = config("build-opts", "sass-path").item()
        self.enable_prettier = enable_prettier
        self.to_release = to_release

    def get_render_data(self, config):
        """
        gets rendering variables from config
        """
        optimize_opts = config("build-opts", "optimize-opts")
        with open("version.txt") as f:
            version = f.read().strip()

        self.data = {
            "ALWAYS_TRUE": optimize_opts("always-filled").list(),
            "ALWAYS_FALSE": optimize_opts("never-filled").list(),
            # "NOTE_OPTS": config("note_opts", get_dict=True),
            "NOTE_OPTS_JSON": json.dumps(config("note-opts").dict(), indent=2),
            # json_output =
            "VERSION": version,
            "NOTE_OPTS": config("note-opts"),
        }

    def generate(
        self,
        type: GenerateType,
        input_file: str,
        output_file: str,
        release_output: str,
        prettify=False,
    ):
        """
        input file is rooted at (repo root)/templates only for jinja types,
        otherwise rooted at (repo root).

        output rooted at (repo root)
        """

        # creates directories if it doesn't exist
        gen_dirs(output_file)

        if type == GenerateType.JINJA:
            template = self.env.get_template(input_file)
            result = template.render(self.data)
            # output_file_path = os.path.join(self.root_folder, output_file)

            with open(output_file, "w") as file:
                file.write(result)

            if self.enable_prettier and prettify:
                # TODO cross platform?
                os.system(f"npx prettier --write {output_file}")

        elif type == GenerateType.SASS:
            error_code = os.system(f"{self.sass_path} {input_file} {output_file}")
            if error_code != 0:
                raise Exception(f"sass failed with error code {error_code}")

        if self.to_release:
            gen_dirs(release_output)
            shutil.copy(output_file, release_output)


def main(root_folder: str = "templates", args=None):

    if args is None:
        args = utils.get_args(utils.add_args, add_args)
    if args.release:
        args.enable_prettier = True
        args.to_release = True

    config = utils.get_config(args)

    generator = Generator(
        root_folder,
        config,
        enable_prettier=args.enable_prettier,
        to_release=args.to_release,
    )

    for note_model_id in config("notes").dict():
        # generates for each template
        for card_model_id in config("notes", note_model_id, "templates").dict():
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
                    prettify=True,
                )

        # generates css file for each note
        generator.generate(
            GenerateType.SASS,
            os.path.join("templates", "scss", f"{note_model_id}.scss"),
            os.path.join(args.build_folder, note_model_id, "style.css"),
            os.path.join(note_model_id, "style.css"),
        )

        type_map = {
            "scss": GenerateType.SASS,
            "jinja": GenerateType.JINJA,
        }

        # generates each file in media-build
        for file_config in config("notes", note_model_id, "media-build").list_items():
            gen_type = type_map[file_config("type").item()]

            if gen_type == GenerateType.JINJA:
                input_file = os.path.join(file_config("input-file").item())
            else:
                input_file = os.path.join("templates", file_config("input-file").item())

            output_file = os.path.join(
                args.build_folder, "media", file_config("output-file").item()
            )

            generator.generate(
                gen_type,
                input_file,
                output_file,
                os.path.join("media", file_config("output-file").item()),
            )


if __name__ == "__main__":
    main(root_folder="templates")
