"""
...because my code with templates requires more templates...

This generates all the html files under root/cards/, with custom templates
as defined under the Templates class.

These templates are used to reduce code repetition and make editing cards
significantly faster. For example, all the hint fields are copied/pasted
throughout every card, and having one {{HINT}} field is significantly
better than having to copy/paste the hint code to every card.


(run from the root folder)
"""

import os
import re

from templates import TemplatesRaw


class Templates:
    def __init__(self):
        self.raw = TemplatesRaw()
        self.t = {} # templates cache
        self.rxs = re.compile(r"(\s*){{(\w+)}}") # regex search

        # https://stackoverflow.com/a/4522706
        for i in [v for v in dir(self.raw)
                if not (v.startswith("__") or callable(getattr(self.raw, v)))]:
            template = getattr(self.raw, i).strip()
            self.t[i] = template.splitlines()

    def process(self, input_file, output_file):
        r"""
        goes through each line, and detects lines that are only of format
            `\s{{TEMPLATE_NAME}}`
        and inserts the templates while preserving said tab spacing
        """
        with open(input_file) as fp:
            lines = fp.read().splitlines()
        for i, l in enumerate(lines):
            match = re.match(self.rxs, l)
            if match:
                tab_space, key = match.groups()
                if key.lower() in self.t:
                    # replaces line with template
                    new_template = "\n".join([tab_space + lt for lt in self.t[key.lower()]])
                    lines[i] = new_template

        with open(output_file, "w") as fp:
            fp.write("\n".join(lines))


file_names = [
    "main/front.html",
    "main/back.html",
    "pa_sentence/front.html",
    "pa_sentence/back.html",
    "pa_word/front.html",
    "pa_word/back.html",
    "cloze_deletion/front.html",
    "cloze_deletion/back.html",
    ]


def main():
    t = Templates()
    for f in file_names:
        input_file = os.path.join("gen", f)
        output_file = os.path.join("cards", f)
        t.process(input_file, output_file)

if __name__ == "__main__":
    main()
