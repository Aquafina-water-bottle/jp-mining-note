import os
import re
import sys
from dataclasses import dataclass

# from anki.collection import Collection

import utils

"""
goal of this script:
    - prevent having the user to manually update their anki card each time
    - automatically update yomichan-generated html when yomichan templates are updated
    - ease the process of converting their existing cards into this with bulk additions


TODO:
- bulk add
    - i.e. PASilence -> [silence.wav]

- sanitize
    - PASilence
    - provide options to auto-filling fields

- field modifications:
    - rename
    - reposition
    - deleting / adding
    - (stretch goal) description


- detection of version
    - way of specifying what to do for each major version bump

"""


def add_args(parser):
    group = parser.add_argument_group(title="update")

    group.add_argument(
        "--no-warn",
        action="store_true",
        help="does not warn when updating",
    )

    group.add_argument(
        "--initialize",
        action="store_true",
        help="Adds `[sound:silence.wav]` to the PASilence field of every card",
    )


#def get_anki_path():
#    home_path = os.path.expanduser("~")
#    # windows
#    if sys in {"win32", "cygwin"} and os.path.isdir(
#        path := os.path.join(home_path, "AppData", "Roaming", "Anki2")
#    ):
#        return path
#
#    if sys in {"linux", "darwin"} and os.path.isdir(
#        path := os.path.join(home_path, ".local", "share", "Anki2")
#    ):
#        return path


@dataclass
class Action:
    description: str
    edits_cards: bool = True


class DeckInitAction(Action):
    description = "Adds `[silence.wav]` to every PASilence field"


def main(args=None):
    if args is None:
        args = utils.get_args(utils.add_args, add_args)

    if not args.no_warn:
        print(
            "WARNING: The following actions WILL affect the cards of the current deck.\n"
            "Please make a backup (File -> Export -> Anki Collection Package before\n"
            "running this, just in case!\n"
            "If you have made a backup, please type 'yes' to confirm:"
        )
        x = input()
        if x != "yes":
            print("Aborting update...")
            return

    print("lolol")
    # anki_home = '/home/austin/.local/share/Anki2/test3'
    # WARNING: THIS IS THE MAIN DECK!!!
    # BACKUP ANY COLLECTION BEFORE RUNNING THIS SCRIPT ON IT
    # anki_home = "/home/austin/.local/share/Anki2/Japanese"
    # anki_collection_path = os.path.join(anki_home, "collection.anki2")

    # col = Collection(anki_collection_path, log=True)


if __name__ == "__main__":
    main()
