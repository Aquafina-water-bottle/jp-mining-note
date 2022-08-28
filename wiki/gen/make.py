import os
import re
import argparse

from jinja2 import Environment, FileSystemLoader, select_autoescape, StrictUndefined

from fields import FIELDS

rx_MORE_THAN_ONE_NEWLINE = re.compile(r"[\n]+")
rx_COMMENT = re.compile(r"\n\s*#.*")
rx_TRAILING_WHITESPACE = re.compile(r"\n\s*")
rx_SKIP_NEWLINE = re.compile(r"\s*`\s*\n")


class Generator:
    """
    handles file generation with jinja2, sass, or just copying
    """

    def __init__(self, jinja_root_folder: str = "", sharex_only=False):
        self.jinja_root_folder = jinja_root_folder
        self.env = Environment(
            loader=FileSystemLoader(jinja_root_folder),
            autoescape=select_autoescape(),
            undefined=StrictUndefined,
            # lstrip_blocks = True,
        )

        # filters = {
        #    # https://eengstrom.github.io/musings/add-bitwise-operations-to-ansible-jinja2
        #    "sharex_arg": self.sharex_argument,
        #    "sharex_post": self.sharex_post_processing,
        # }
        # for k, v in filters.items():
        #    self.env.filters[k] = v

        top = ""
        bottom = ""
        if not sharex_only:
            with open(
                os.path.join("..", "..", "yomichan_templates", "top.txt")
            ) as f:
                top = f.read()

            with open(
                os.path.join(
                    "..", "..", "yomichan_templates", "bottom.txt"
                )
            ) as f:
                bottom = f.read()

        self.data = {
            "FIELDS": FIELDS,
            "TOP_YOMICHAN": top,
            "BOTTOM_YOMICHAN": bottom,
            "sharex_arg": self.sharex_argument,
            "sharex_post": self.sharex_post_processing,
        }

    def generate(
        self,
        input_file: str,
        output_file: str,
    ):
        """
        input and output is rooted at (repo root)/gen by default (ran under (root)/gen)
        """

        print("creating output", output_file)

        template = self.env.get_template(input_file)
        result = template.render(self.data)
        # output_file_path = os.path.join(self.root_folder, output_file)

        # if sharex:
        #    self.sharex_post_processing(result)

        with open(output_file, "w") as file:
            file.write(result)

    def sharex_post_processing(self, sharex_code):
        """
        formats into a one line, still runnable in powershell
        """

        c = sharex_code

        # removes comments
        c = rx_COMMENT.sub("\n", c)

        # removes more than 1 newline
        c = rx_MORE_THAN_ONE_NEWLINE.sub("\n", c)

        # removes trailing whitespace
        c = rx_TRAILING_WHITESPACE.sub("\n", c)

        # removes the skip newline operator
        c = rx_SKIP_NEWLINE.sub("\n", c)

        # removes all newlines
        c = c.replace("\n", " ")

        c = c.strip()

        return c

    def sharex_argument(self, sharex_code):
        """
        formats into a one line argument form
        """

        c = self.sharex_post_processing(sharex_code)
        c = '-NoProfile -Command "' + c.replace('"', '\\"') + '"'

        return c


def get_args():
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "-s",
        "--sharex-only",
        action="store_true",
    )

    return parser.parse_args()


def main():
    args = get_args()

    generator = Generator(sharex_only=args.sharex_only)

    # TODO change to automated with _
    if args.sharex_only:
        files = ["_Sharex.md"]
    else:
        files = ["_Importing.md", "_Setup.md", "_PersonalSetup.md", "_Sharex.md"]

    for file in files:
        input_file = file
        output_file = os.path.join("..", file[1:])

        generator.generate(input_file, output_file)


if __name__ == "__main__":
    main()
