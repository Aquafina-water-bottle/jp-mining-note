from __future__ import annotations

import json
from typing import Any
from copy import deepcopy
from abc import ABC
from dataclasses import dataclass

from json_minify import json_minify

from utils import javascript_format


JSON = dict[str, Any]

@dataclass
class OptAction(ABC):
    pass



# additions and deletions do not have to be accounted for
# as they will be automatically added / removed naturally due to the
# updated nature of the template string

@dataclass
class MoveOptAction(OptAction):
    key_src: str
    key_dest: str

@dataclass
class OverwriteValueOptAction(OptAction):
    key: str
    value: str

@dataclass
class ChangeDefaultValueOptAction(OptAction):
    key: str
    value: str
    default_val: str


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

    def apply_actions(self, options: JSON, actions: list[OptAction]):
        """
        - applies all actions to given options list
        - adds any options in self.options to result if doesn't already exist
        """
        result = deepcopy(options)

        for a in actions:
            if isinstance(a, MoveOptAction):
                if a.key_src in result:
                    result[a.key_dest] = result.pop(a.key_src)
                else:
                    print(f"jpmnopts_updater warning: cannot move {a.key_src} -> {a.key_dest}")
            elif isinstance(a, OverwriteValueOptAction):
                result[a.key] = a.value
            elif isinstance(a, ChangeDefaultValueOptAction):
                if result[a.key] == a.default_val:
                    result[a.key] = a.value

        for k in self.options:
            if k not in result:
                result[k] = self.options[k]

        return result

    def generate(self, user_options: JSON, actions: list[OptAction]):
        """
        - create options in format of k1. (...) .kn: v (flattened)
        - replaces all k1. (...) .kn instances in template string with value in options
        """

        result_template = self.template
        result_opts = self.apply_actions(user_options, actions)

        for key, value in result_opts.items():
            find_str = '"{{ ' + key + ' }}"'
            replace_str = javascript_format(value)

            result_template = result_template.replace(find_str, replace_str)

        return result_template

