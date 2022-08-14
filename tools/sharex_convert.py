"""
TODO:
    - this code is hot garbage: change this to use jinja and decouple the code from the documentation
"""

import re
from dataclasses import dataclass

rx_MORE_THAN_ONE_NEWLINE = re.compile(r"[\n]+")
rx_COMMENT = re.compile(r"\n\s*#.*\n")
rx_TRAILING_WHITESPACE = re.compile(r"\n\s*")
rx_SKIP_NEWLINE = re.compile(r"\s*`\s*\n")

BEFORE_MARKER = 0
MARKER = 1
CODE = 2

@dataclass
class Binding:
    marker: str
    info: str
    code: str



def main():
    with open("sharex.md") as file:
        contents = file.read()

    bindings = {}
    lines = contents.splitlines()
    state = BEFORE_MARKER
    code = []
    info = []

    for line in lines:
        if line.startswith("#") and state == BEFORE_MARKER:
            marker = line[line.index("#")+1:].strip()
            state = MARKER
        elif line.startswith("```"):
            if state == CODE:
                state = BEFORE_MARKER
                bindings[marker] = Binding(marker, "\n".join(info), "\n".join(code))
                code.clear()
                info.clear()
            else:
                state = CODE
        elif state == MARKER:
            info.append(line)
        elif state == CODE:
            code.append(line)

    #print(bindings)

    common = bindings.pop("COMMON:")
    for k in bindings:
        b = bindings[k]
        b.code = common.code + "\n" + b.code

    for k in bindings:
        b = bindings[k]
        b.code = rx_MORE_THAN_ONE_NEWLINE.sub("\n", b.code)
        b.code = rx_COMMENT.sub("\n", b.code)
        b.code = rx_TRAILING_WHITESPACE.sub("\n", b.code)
        b.code = rx_SKIP_NEWLINE.sub("\n", b.code)
        b.code = b.code.replace("\n", " ")
        b.code = b.code.strip()


    with open("sharex_output.md", "w") as file:
        for k in bindings:
            b = bindings[k]
            file.write("# " + b.marker + "\n")
            file.write(b.info + "\n")
            file.write("```\n-NoProfile -Command \"" + b.code.replace('"', '\\"') + "\"\n```\n\n")

    #print(bindings[list(bindings.keys())[0]])

if __name__ == "__main__":
    main()

