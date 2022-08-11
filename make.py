"""


- builds based on config

"""


# from jinja2 import Template

import os
import json
import argparse
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape, StrictUndefined

from dataclasses import dataclass

import utils

OPTIONS_FILENAME = "jp-mining-note-options.js"

# https://eengstrom.github.io/musings/add-bitwise-operations-to-ansible-jinja2


#@dataclass(frozen=True)
#class RenderFilePair:
#    src_file: str
#    dst_file: str
#    prettify: bool = False


def add_args(parser):
    group = parser.add_argument_group(title="build")
    # group.add_argument("--playground", action="store_true")
    # group.add_argument("--files", type=str, nargs=2, help="input and output files")
    group.add_argument("-p", "--enable-prettier", action="store_true", default=False)


class Generator:
    def __init__(self, root_folder: str, config, enable_prettier=False):
        self.root_folder = root_folder
        self.env = Environment(
            loader=FileSystemLoader(root_folder),
            autoescape=select_autoescape(),
            undefined=StrictUndefined,
            # lstrip_blocks = True,
        )

        filters = {
            "bitwise_and": self.bitwise_and,
            "bitwise_or": self.bitwise_or,
            "bitwise_xor": self.bitwise_xor,
            "bitwise_complement": self.bitwise_complement,
            "bitwise_shift_left": self.bitwise_shift_left,
            "bitwise_shift_right": self.bitwise_shift_right,
        }
        for k, v in filters.items():
            self.env.filters[k] = v

        self.get_render_data(config)
        self.enable_prettier = enable_prettier

    def get_render_data(self, config):
        """
        gets rendering variables from config
        """
        optimize_opts = config("build_opts", "optimize_opts")
        with open("version.txt") as f:
            version = f.read().strip()

        self.data = {
            "ALWAYS_TRUE": optimize_opts("always_filled"),
            "ALWAYS_FALSE": optimize_opts("never_filled"),
            #"NOTE_OPTS": config("note_opts", get_dict=True),
            "NOTE_OPTS": json.dumps(config("note_opts", get_dict=True), indent=2),
            #json_output = 
            "VERSION": version,
        }

    def bitwise_and(self, x, y):
        return x & y

    def bitwise_or(self, x, y):
        return x | y

    def bitwise_xor(self, x, y):
        return x ^ y

    def bitwise_complement(self, x):
        return ~x

    def bitwise_shift_left(self, x, b):
        return x << b

    def bitwise_shift_right(self, x, b):
        return x >> b

    def generate(self, input_file, output_file, prettify=False):
        """
        rooted at (repo root)/templates
        output rooted at (repo root)
        """
        template = self.env.get_template(input_file)
        result = template.render(self.data)
        # output_file_path = os.path.join(self.root_folder, output_file)

        # creates directories if it doesn't exist
        Path(output_file).parent.mkdir(parents=True, exist_ok=True)

        with open(output_file, "w") as file:
            file.write(result)

        if self.enable_prettier and prettify:
            # TODO cross platform?
            os.system(f"npx prettier --write {output_file}")

            with open(output_file) as f:
                result = f.read()

        return result





def main(root_folder: str = "templates", args=None):

    if args is None:
        args = utils.get_args(utils.add_args, add_args)
    if args.release:
        args.folder = os.path.join("cards")
        args.enable_prettier = True

    config = utils.get_config(args)

    generator = Generator(root_folder, config)

    dir_name = "cards"
    # dirs = [d for d in os.listdir(dir_name) if os.path.isdir(os.path.join(dir_name, d))]
    dirs = ["main", "pa_sent"]

    # https://stackoverflow.com/a/16505750
    # from lxml import etree, html

    # generates html files
    for d in dirs:
        for file_name in ("front.html", "back.html"):
            # for file_name in ["front.html"]:
            input_file = os.path.join("cards", d, file_name)
            output_file = os.path.join(args.folder, d, file_name)

            generator.generate(input_file, output_file, prettify=True)

            #if args.enable_prettier:
            #    # TODO cross platform?
            #    output_path = os.path.join(root_folder, output_file)
            #    os.system(f"npx prettier --write {output_path}")

                # with open(full_path) as f:
                #    document_root = html.fromstring(f.read())
                # with open(full_path, "w") as f:
                #    f.write(etree.tostring(document_root, encoding='unicode', pretty_print=True))

    # generates config file
    generator.generate(
        os.path.join(OPTIONS_FILENAME),
        os.path.join(args.folder, OPTIONS_FILENAME),
    )

    # generates css files
    generator.generate(
        os.path.join(OPTIONS_FILENAME),
        os.path.join(args.folder, OPTIONS_FILENAME),
    )


    # print(json_output)


# def main():
#    t = Templates()
#    dir_name = "./gen"
#
#    dirs = [d for d in os.listdir(dir_name) if os.path.isdir(os.path.join(dir_name, d))]
#
#    for d in dirs:
#        for file_name in ("front.html", "back.html"):
#            input_file = os.path.join("gen", d, file_name)
#            output_file = os.path.join("cards", d, file_name)
#            t.process(input_file, output_file)
#
# if __name__ == "__main__":
#    main()


if __name__ == "__main__":
    main(root_folder="templates")
    # test()
    # generate_cards()


# def main():
#    env = Environment(
#        loader = FileSystemLoader("templates"),
#        autoescape = select_autoescape(),
#        undefined = StrictUndefined,
#        variable_start_string = "{{{", # to distinguish it from anki's {{ }} strings
#        variable_end_string = "}}}",
#    )
#
#    template = env.get_template("mytemplate.html")
#
#    data = {
#        "hostname": "core-sw-waw-01",
#        "name_server_pri": "1.1.1.1",
#        "name_server_sec": "8.8.8.8",
#        "ntp_server_pri": "0.pool.ntp.org",
#        "ntp_server_sec": "1.pool.ntp.org",
#    }
#
#    print(template.render(data))
#
#
#
#
# def test_block():
#    env = Environment(
#        loader = FileSystemLoader("templates"),
#        autoescape = select_autoescape(),
#        undefined = StrictUndefined,
#        #variable_start_string = "{{{", # to distinguish it from anki's {{ }} strings
#        #variable_end_string = "}}}",
#    )
#
#    template = env.get_template("child.html")
#
#    data = {
#        "hostname": "core-sw-waw-01",
#        "name_server_pri": "1.1.1.1",
#        "name_server_sec": "8.8.8.8",
#        "ntp_server_pri": "0.pool.ntp.org",
#        "ntp_server_sec": "1.pool.ntp.org",
#    }
#
#    print(template.render(data))
