from __future__ import annotations

"""
both generates files and updates anki card template

this is primarily used for development purposes,
simply installing/updating the card should only require the ./install.py script
"""

import make
import install
import utils


def main():
    utils.assert_ankiconnect_running()

    args = utils.get_args(utils.add_args, make.add_args, install.add_args)

    # defaults to install from the build folder
    args.from_build = True
    args.update = True
    args.dev_read_json5 = True
    args.dev_emit_json = True

    make.main(args=args)
    install.main(args=args)


if __name__ == "__main__":
    main()
