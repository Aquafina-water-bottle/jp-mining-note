"""
both generates files and updates anki card template
"""

import build
import install
import utils

def main():
    args = utils.get_args(utils.add_args, build.add_args, install.add_args)

    build.main(args=args)
    install.main(args=args)

if __name__ == "__main__":
    main()

