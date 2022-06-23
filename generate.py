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
from typing import Dict, List
from copy import deepcopy

#from templates import TemplatesRaw
from templates import TEMPLATES



class Templates:
    def __init__(self):
        #self.raw = TemplatesRaw()
        self.raw = TEMPLATES
        self.t = {} # templates cache
        self.rxs = re.compile(r"(\s*){{(\w+)}}") # regex search

        # O(n^2)
        for k, v in self.raw.items():
            lines = v.strip().splitlines()
            result_lines = self.insert_template(lines, self.t)
            self.t[k] = result_lines

            #for k2, v2 in self.t.values():
            #    updated_template

        # https://stackoverflow.com/a/4522706
        #for i in [v for v in dir(self.raw)
        #        if not (v.startswith("__") or callable(getattr(self.raw, v)))]:
        #    template = getattr(self.raw, i).strip()
        #    self.t[i] = template.splitlines()

    def process(self, input_file: str, output_file: str):
        r"""
        goes through each line, and detects lines that are only of format
            `\s{{TEMPLATE_NAME}}`
        and inserts the templates while preserving said tab spacing
        """
        with open(input_file) as fp:
            lines = fp.read().splitlines()

        lines = self.insert_template(lines, self.t)
        #for i, l in enumerate(lines):
        #    match = re.match(self.rxs, l)
        #    if match:
        #        tab_space, key = match.groups()
        #        if key.lower() in self.t:
        #            # replaces line with template
        #            new_template = "\n".join([tab_space + lt for lt in self.t[key.lower()]])
        #            lines[i] = new_template

        with open(output_file, "w") as fp:
            fp.write("\n".join(lines))

    def insert_template(self, input_lines: List[str], template_dict: Dict[str, List[str]]) -> List[str]:
        r"""
        goes through each line, and detects lines that are only of format
            `\s{{TEMPLATE_NAME}}`
        and inserts the templates while preserving said tab spacing
        """
        result_lines = deepcopy(input_lines)

        for i, l in enumerate(result_lines):
            match = re.match(self.rxs, l)
            if match:
                tab_space, key = match.groups()
                if key.lower() in template_dict:
                    # replaces line with template
                    new_template = "\n".join([(tab_space + lt if lt else "") for lt in self.t[key.lower()]])
                    result_lines[i] = new_template

        return result_lines


#file_names = [
#    "main/front.html",
#    "main/back.html",
#    "pa_sentence/front.html",
#    "pa_sentence/back.html",
#    "pa_word/front.html",
#    "pa_word/back.html",
#    "cloze_deletion/front.html",
#    "cloze_deletion/back.html",
#    ]



def main():
    t = Templates()
    dir_name = "./gen"

    dirs = [d for d in os.listdir(dir_name) if os.path.isdir(os.path.join(dir_name, d))]

    for d in dirs:
        for file_name in ("front.html", "back.html"):
            input_file = os.path.join("gen", d, file_name)
            output_file = os.path.join("cards", d, file_name)
            t.process(input_file, output_file)

if __name__ == "__main__":
    main()

