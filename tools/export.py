import os

import utils


def main(args=None):
    if args is None:
        args = utils.get_args(utils.add_args)

    tools_folder = os.path.dirname(os.path.abspath(__file__))
    root_folder = os.path.join(tools_folder, "..")

    version = utils.get_version(args)

    path = os.path.join(
        root_folder, "all_versions", f"{version}-jpmn_example_cards.apkg"
    )
    utils.gen_dirs(path)

    export_params = {
        "deck": "JPMN-Examples",
        "path": path,
        "includeSched": False,
    }

    if not utils.invoke("exportPackage", **export_params):
        raise Exception("exportPackage returned False")


if __name__ == "__main__":
    main()
