from __future__ import annotations

import json
import argparse
from typing import Any
from copy import deepcopy
from abc import ABC
from dataclasses import dataclass

from json_minify import json_minify

from note_changes import Version, NOTE_CHANGES
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

    group.add_argument(
        "--to-version",
        type=str,
        default=None,
        help="updates the settings to the specified version",
    )

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
                for k2, v2 in self.flatten(v).items():
                    result[f"{k}.{k2}"] = v2
            elif isinstance(v, list):
                raise SyntaxError("cannot flatten list")
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

        for key, value in result_opts.items():
            find_str = '"{{ ' + key + ' }}"'
            replace_str = utils.javascript_format(value)

            result_template = result_template.replace(find_str, replace_str)

        return result_template


def main(args=None):

    if args is None:
        args = utils.get_args(utils.add_args, add_args)

    #config = utils.get_config(args)

    if args.to_version is not None:
        to_ver = Version(args.to_version)
        pass
    else:
        # latest version
        to_ver = NOTE_CHANGES[0].version

    from_ver = utils.get_version(args)






