"""
# applies changes from latest version to _jpmn-options.js
python3 jpmnopts_updater.py

# applies changes from given file to _jpmn-options.js
# primarily used for exporting theme settings
python3 jpmnopts_updater.py --dev-custom-changes "CHANGES_FILE"


# applies changes from latest version
python3 jpmnopts_updater.py --dev-update-json "ORIGINAL_FILE" --dev-update-json-output "OUTPUT_FILE"

# applies changes from given file
# primarily used for exporting theme settings
python3 jpmnopts_updater.py --dev-update-json "ORIGINAL_FILE" --dev-custom-changes "CHANGES_FILE" --dev-update-json-output "OUTPUT_FILE"
"""


from __future__ import annotations

import json
import argparse
from typing import Any
from copy import deepcopy
from abc import ABC
from dataclasses import dataclass

from json_minify import json_minify

from note_changes import Version, NoteChange, NOTE_CHANGES
import utils
import action


JSON = dict[str, Any]




def add_args(parser: argparse.ArgumentParser):
    group = parser.add_argument_group(title="jpmnopts_updater")
    #group.add_argument(
    #    "--to-latest",
    #    action="store_true",
    #    help="updates the settings to the latest version (default)",
    #)

    # use --dev-output-version lol
    #group.add_argument(
    #    "--to-version",
    #    type=str,
    #    default=None,
    #    help="updates the settings to the specified version",
    #)

    group.add_argument(
        "--dev-update-json",
        type=str,
        default=None,
        help="(dev option) updates the source json file for building",
    )

    group.add_argument(
        "--dev-update-json-output",
        type=str,
        default=None,
        help="(dev option) output file for the above",
    )







class JPMNOptsUpdater:
    def __init__(self, template: str, options: JSON):
        self.template = template
        self.options = options
        #self.actions = actions

    def flatten(self, json):
        """
        changes json {"a": {"b": "c", "e": "f"}} to {"a.b": "c", "a.e": "f"}
        """

        result = {}

        for k, v in json.items():
            if isinstance(v, dict):
                if "type" in v:
                    result[k] = v
                else:
                    for k2, v2 in self.flatten(v).items():
                        result[f"{k}.{k2}"] = v2
            #elif isinstance(v, list):
            #    raise SyntaxError(f"cannot flatten list {v}")
            else:
                # string, number, boolean
                result[k] = v

        return result


    def flatten_options(self):
        flat_templates = self.flatten(json.loads(json_minify(self.template)))
        result = {}

        for flat_key in flat_templates:

            found_item = True

            # attempts to visit
            item = self.options
            keys = flat_key.split(".")

            for k in keys:
                if k in item:
                    item = item[k]
                else:
                    found_item = False
                    print(f"jpmnopts_updater warning: did not find key {flat_key}")
                    break

            if not found_item:
                raise RuntimeError(f"Key not found: {flat_key}")

            # found full key / item pair
            result[flat_key] = item

        return result

    def apply_actions(self, options: JSON, actions: list[action.OptAction]):
        """
        - applies all actions to given options list
        - adds any options in self.options to result if doesn't already exist
        """
        result = deepcopy(options)

        for a in actions:
            if isinstance(a, action.MoveOptAction):
                if a.key_src in result:
                    result[a.key_dest] = result.pop(a.key_src)
                else:
                    print(f"jpmnopts_updater warning: cannot move {a.key_src} -> {a.key_dest}")
            elif isinstance(a, action.OverwriteValueOptAction):
                result[a.key] = a.value
            elif isinstance(a, action.ChangeDefaultValueOptAction):
                if result[a.key] == a.default_val:
                    result[a.key] = a.value

        for k in self.options:
            if k not in result:
                result[k] = self.options[k]

        return result

    def generate(self, user_options: JSON, actions: list[action.OptAction]):
        """
        - create options in format of k1. (...) .kn: v (flattened)
        - replaces all k1. (...) .kn instances in template string with value in options
        """

        result_template = self.template
        result_opts = self.apply_actions(user_options, actions)
        result_flattened = self.flatten(result_opts)

        for key, value in result_flattened.items():
            find_str = '"{{ ' + key + ' }}"'
            replace_str = utils.javascript_format(value)

            result_template = result_template.replace(find_str, replace_str)

        return result_template

def get_actions(current_ver: Version, new_ver: Version, note_changes: list[NoteChange]) -> list[action.OptAction]:
    result: list[NoteChange] = []

    if current_ver == new_ver:
        # nothing to do
        return []

    if current_ver > new_ver:
        print("Warning: current version is higher than the newer version?")
        return []

    for data in reversed(note_changes):
        ver = data.version
        # finds all versions that are > current_ver and <= new_ver
        if (ver > current_ver) and (ver <= new_ver):
            result.append(data)

        if ver > new_ver:
            break

    return sum((c.option_actions for c in result), start=[])


def main(args=None):

    if args is None:
        args = utils.get_args(utils.add_args, add_args)

    #config = utils.get_config(args)

    new_ver = Version.from_str(utils.get_version(args))
    current_ver = Version.from_str(utils.get_version_from_anki(args))

    actions = get_actions(current_ver, new_ver, NOTE_CHANGES)
    print(actions)
    return

    with open("src/jpmn_opts_template.jsonc") as f:
        template = f.read()
    with open("config/example_jpmn_opts.json") as f:
        options = json.load(f)

    upt = JPMNOptsUpdater(
        template,
        options,
    )

    if args.dev_update_json:
        input_path = args.dev_update_json
        output_path = args.dev_update_json_output if args.dev_update_json_output else input_path

        if input_path == output_path:
            x = input(f"WARNING: Overriding {input_path}.\n"
                "Please type 'yes' to confirm, or anything else to abort: ")

            if x != "yes":
                print("Aborting update...")
                return

        with open(input_path) as f:
            user_json = json.load(f)

        result = upt.generate(user_json, actions)
        with open(output_path, "w") as f:
            print(f"Writing to {output_path}...")
            f.write(result)





if __name__ == "__main__":
    main()




