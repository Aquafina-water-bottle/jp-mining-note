from __future__ import annotations

import re
import copy
import json
import os.path
import argparse
import datetime
import urllib.request
import urllib.error

from pathlib import Path
from typing import Callable, Any, Iterable, Optional

from json_handler import JsonHandler

USER_CONFIG_PATH = "config/config.json5"
DEFAULT_CONFIG_PATH = "config/default_config.json5"
TIME_FORMAT = "%Y-%m-%d-%H-%M-%S"

rx_GET_VERSION = re.compile(
    r"JP Mining Note: Version (\d+\.\d+\.\d+\.\d+(-prerelease-\d+)?)"
)


JSON = dict[str, Any]


cached_config = None


def add_args(parser: argparse.ArgumentParser):
    group = parser.add_argument_group(title="common")
    group.add_argument("-c", "--config-file", type=str, default=None)

    group.add_argument(
        "-r",
        "--release",
        action="store_true",
        default=False,
        help="uses the default options for when building for release",
    )

    group.add_argument(
        "-f",
        "--build-folder",
        type=str,
        default="build",
        help="output folder for the build process, and input folder for installation",
    )

    group.add_argument(
        "--dev-input-version",
        type=str,
        default=None,
        help="(dev option) custom input version to be used instead of the current version in the "
        "existing Anki note"
        # help="Installs an older version of the card. "
        # "This option only works on first install, and not when updating the note.",
    )

    group.add_argument(
        "--dev-output-version",
        type=str,
        default=None,
        help="(dev option) custom output version to be used instead of version.txt",
    )

    group.add_argument(
        "--dev-read-json5",
        action="store_true",
        default=False,
        help="(dev option) read json5 config files instead of json files",
    )

    group.add_argument(
        "--dev-emit-json",
        action="store_true",
        default=False,
        help="(dev option) emits json files whenever reading a json5 file",
    )


def get_args(
    *add_args_funcs: Callable[[argparse.ArgumentParser], None]
) -> argparse.Namespace:
    # exit_on_error is False if custom args are given
    parser = argparse.ArgumentParser()
    for add_args_func in add_args_funcs:
        add_args_func(parser)
    return parser.parse_args()


class Config:
    """
    Wrapper around a dictionary object to pretty-print paths if they don't exist,
    and to provide ease-of-access methods to access chains of key/value pairs
    """

    def __init__(self, data: Any, path: list[int | str] = []):
        self.data = data
        self.path = copy.deepcopy(path)

    def container(self) -> dict | list:
        assert isinstance(self.data, dict) or isinstance(self.data, list)
        return self.data

    def list(self) -> list:
        assert isinstance(self.data, list)
        return self.data

    def dict(self) -> dict:
        assert isinstance(self.data, dict)
        return self.data

    def get_item_if_exists(self, key, default) -> Any:
        assert isinstance(self.data, dict)
        return self.data.get(key, default)

    def item(self, javascript=False) -> Any:
        if not javascript:
            return self.data
        var = self.data
        if var is True:
            return "true"
        elif var is False:
            return "false"
        elif var is None:
            return "null"
        elif isinstance(var, str):
            return f"'{var}'"
        elif isinstance(var, dict):
            return json.dumps(var)
        return var

    def key(self) -> int | str:
        return self.path[-1]

    def dict_values(self) -> Iterable[Config]:
        assert isinstance(self.data, dict)
        for key in self.data.keys():
            yield Config(self.data[key], self.path + [key])

    def dict_items(self) -> Iterable[tuple["str", Config]]:
        assert isinstance(self.data, dict)
        for key in self.data.keys():
            yield key, Config(self.data[key], self.path + [key])

    def list_items(self) -> Iterable[Config]:
        assert isinstance(self.data, list)
        for i, item in enumerate(self.data):
            yield Config(item, self.path + [i])

    def __call__(self, *keys: str | int) -> Config:
        """
        - returns a config object if dictionary
        - otherwise returns the expected object (list, str, int, etc.)
        - automatically detects errors with unknown keys

        can be called either way:
        >>> config("note_opts")("keybinds")("toggle-hybrid-sentence")
        >>> config("note_opts", "keybinds", "toggle-hybrid-sentence")
        """
        result = self  # returns itself if no keys

        current_config = self
        for i, key in enumerate(keys):
            if not (isinstance(self.data, dict) or isinstance(self.data, list)):
                raise RuntimeError(
                    f"Key '{key}' is not in the data value {current_config}. "
                    "Ensure your config matches the example config!"
                )

            if not (
                (isinstance(current_config.item(), dict) and key in current_config.data)
                or (
                    isinstance(current_config.item(), list)
                    and isinstance(key, int)
                    and key < len(current_config.data)
                )
            ):
                raise RuntimeError(f"Key '{key}' is not in {repr(current_config)}")
            result = current_config.data[key]

            current_config = Config(
                result,
                path=current_config.path + [key],
            )

        return current_config

    def get_path(self):
        return ".".join([str(x) for x in self.path])

    def __repr__(self):
        return f"Config({self.get_path()})"


# taken from https://github.com/FooSoft/anki-connect#python
def request(action: str, **params):
    return {"action": action, "params": params, "version": 6}


def invoke(action: str, **params):
    requestJson = json.dumps(request(action, **params)).encode("utf-8")
    response = json.load(
        urllib.request.urlopen(
            urllib.request.Request("http://localhost:8765", requestJson)
        )
    )
    if len(response) != 2:
        raise Exception("response has an unexpected number of fields")
    if "error" not in response:
        raise Exception("response is missing required error field")
    if "result" not in response:
        raise Exception("response is missing required result field")
    if response["error"] is not None:
        raise Exception(response["error"])
    return response["result"]


def defaults(*dicts: dict, strict=False):
    """
    Gets keys, with the highest priority being the first dictionary.
    This is basically Lodash's _.defaults() method, as this only goes one layer deep

    `strict` means that it will error if the key was not found in the last dictionary
    """

    result = {}
    for d in dicts:
        for k, v in d.items():
            if strict and k not in dicts[-1]:
                print(json.dumps(dicts[-1], indent=2))
                raise KeyError(f"{k} not in default options")

            if k not in result:
                result[k] = v
    return result


def _get_opts_all(name, config: Config, json_handler: JsonHandler) -> JSON:
    # attempts to get note options from the following places:
    # - config
    # - theme
    # - default (error if not found)

    # import pyjson5
    # TODO use json handler!!!! what on earth is this

    root_folder = get_root_folder()

    # gets default settings
    default_opts_file = os.path.join(root_folder, "data", f"{name}_opts.json5")
    default_opts = json_handler.read_file(default_opts_file)
    # with open(default_opts_file, encoding="utf-8") as f:
    #    default_opts = pyjson5.load(f)

    # gets theme settings
    theme_folder = config("theme-folder").item()
    theme_opts = {}
    if theme_folder is not None:
        theme_opts_file = os.path.join(
            root_folder, "themes", theme_folder, f"{name}_opts.json5"
        )
        if os.path.isfile(theme_opts_file):
            theme_opts = json_handler.read_file(theme_opts_file)
            # with open(theme_opts_file, encoding="utf-8") as f:
            #    theme_opts = pyjson5.load(f)

    # gets user settings
    user_opts = {}
    user_opts_file = os.path.join(root_folder, config(f"{name}-options-path").item())
    if os.path.isfile(user_opts_file):
        user_opts = json_handler.read_file(user_opts_file)
        # with open(user_opts_file, encoding="utf-8") as f:
        #    user_opts = pyjson5.load(f)

    # TODO convert this to some sort of actual object instead of a dict?
    return {
        "user": user_opts,
        "themes": theme_opts,
        "default": default_opts,
    }


def get_runtime_opts_all(config: Config, json_handler: JsonHandler) -> JSON:
    return _get_opts_all("runtime", config, json_handler)


def get_compile_opts_all(config: Config, json_handler: JsonHandler) -> JSON:
    return _get_opts_all("compile", config, json_handler)


def apply_runtime_opts(
    src: dict[str, Any], dst: dict[str, Any], overrides: dict[str, Any]
):
    """
    applies all runtime options from src -> dst (modifies in place)
    - also applies all overrides found from src -> overrides (modifies in place)
    - dst can be an empty dictionary, so things from src are applied properly
    - TODO: get "_modifyActions" working
        - can modify lists and dictionaries in place
        - should be key -> list, i.e. _modifyActions: { "kanjiHover.enabled": [ ... ] }
        - logic should be implemented in compile-time for optimization, but also
            implemented in JS for usage in the true _jpmn-options.js file
    """
    pass


def get_rto_overrides(json_handler: JsonHandler):
    root_folder = get_root_folder()
    rto_overrides_file = os.path.join(root_folder, "data", f"rto_overrides.json5")
    return json_handler.read_file(rto_overrides_file)


def get_runtime_opts(config: Config, json_handler: JsonHandler) -> Config:
    # requires separation of { type: ... } (override) values into the "overrides"
    # section to be usable by typescript
    # NOTE: existing keys in overrides should be correctly overwwritten by themes/user RTOs!

    runtime_opts = get_runtime_opts_all(config, json_handler)
    result = copy.deepcopy(runtime_opts["default"])
    rto_overrides = get_rto_overrides(json_handler)

    def _is_override_value(val):
        return isinstance(val, dict) and "type" in val

    # extra should NOT have "overrides"
    if config("theme-override-user-options").item():
        extra = defaults(runtime_opts["themes"], runtime_opts["user"])
    else:
        extra = defaults(runtime_opts["user"], runtime_opts["themes"])
    for k, v in extra.items():
        if k not in result:
            # TODO more detailed error message
            print(json.dumps(runtime_opts["default"], indent=2))
            raise KeyError(f"{k} not in default options")

        if _is_override_value(v):
            result["overrides"][k] = v
        else:
            result[k] = v

    return Config(result)


def get_compile_opts(config: Config, json_handler: JsonHandler) -> Config:
    compile_opts = get_compile_opts_all(config, json_handler)
    if config("theme-override-user-options").item():
        vals = (compile_opts["themes"], compile_opts["user"], compile_opts["default"])
    else:
        vals = (compile_opts["user"], compile_opts["themes"], compile_opts["default"])

    return Config(defaults(*vals, strict=True))


def handle_custom_version(ver: str) -> str:
    # if ver == "latest":
    #    return str(NOTE_CHANGES[0].version)
    return ver


def get_version(args) -> str:
    """
    gets version of the jp mining note within the repo
    """

    if args.dev_output_version is not None:
        return handle_custom_version(args.dev_output_version)

    root_folder = get_root_folder()
    with open(os.path.join(root_folder, "version.txt")) as f:
        version = f.read().strip()

    return version


def note_is_installed(note_name) -> bool:
    result = invoke("modelNames")
    return note_name in result


def get_version_from_template_side(template_side: str, error=False) -> str | None:
    match = rx_GET_VERSION.search(template_side)

    if match is None:
        if error:
            raise RuntimeError("Cannot find jpmn version from template side")
        else:
            return None
    return match.group(1)


def get_version_from_anki(
    model_name: str, dev_input_version: Optional[str] = None
) -> str:
    """
    gets version of the jp mining note from the installed note in anki
    """

    if dev_input_version is not None:
        return handle_custom_version(dev_input_version)

    result = invoke(
        "modelTemplates",
        modelName=model_name,
    )

    assert result.keys()

    # doesn't matter which card it is
    # TODO: check all sides before erroring
    side = list(result.values())[0]["Front"]
    jpmn_version = get_version_from_template_side(side)

    assert jpmn_version is not None
    return jpmn_version


def get_config(args: argparse.Namespace, json_handler: JsonHandler) -> Config:
    """
    creates the config file from the example config if it doesn't exist
    """
    global cached_config  # lazy fix

    if cached_config is not None:
        return cached_config

    root_folder = get_root_folder()

    override_path = args.config_file
    user_config_path = os.path.join(root_folder, USER_CONFIG_PATH)
    default_config_path = os.path.join(root_folder, DEFAULT_CONFIG_PATH)

    user_config_json = {}
    default_config_json = json_handler.read_file(default_config_path)

    # first condition: overidden config
    # second condition: release build uses default config (unless overidden for some reason)
    #   and tests to see if the user config exists in the first place
    # otherwise, no user config exists -> use the default only
    if override_path is not None:
        user_config_json = json_handler.read_file(override_path)
    elif not args.release and os.path.isfile(user_config_path):
        user_config_json = json_handler.read_file(user_config_path)

    # simple override
    config_json = defaults(user_config_json, default_config_json, strict=True)
    config = Config(config_json, path=["root"])

    cached_config = config
    return config


def create_json_handler(args: argparse.Namespace):
    # we emit json by default on release builds
    return JsonHandler(
        args.dev_read_json5, True if args.release else args.dev_emit_json
    )


def get_note_data(json_handler: JsonHandler) -> Config:
    path = os.path.join(get_root_folder(), "data/note_data.json5")
    data = json_handler.read_file(path)
    return Config(data)


def gen_dirs(file_path: str):
    """
    generates all directories for a file path if the directories don't exist
    """
    Path(file_path).parent.mkdir(parents=True, exist_ok=True)


def get_root_folder() -> str:
    """
    grabs the repository root folder
    """

    tools_folder = os.path.dirname(os.path.abspath(__file__))
    root_folder = os.path.realpath(os.path.join(tools_folder, ".."))

    return root_folder


def javascript_format(data):
    if data is True:
        return "true"
    elif data is False:
        return "false"
    elif data is None:
        return "null"
    elif isinstance(data, str):
        return '"' + data.replace("\\", "\\\\").replace('"', '\\"') + '"'
    elif isinstance(data, dict) or isinstance(data, list):
        return json.dumps(data)
    return str(data)


def assert_ankiconnect_running():
    try:
        invoke("version")
    except urllib.error.URLError as e:
        raise Exception(
            "Ankiconnect is not running. Is Anki open, and is Ankiconnect installed and enabled?"
        )


def get_time_str():
    return datetime.datetime.now().strftime(TIME_FORMAT)


if __name__ == "__main__":
    # write temporary tests here
    pass
