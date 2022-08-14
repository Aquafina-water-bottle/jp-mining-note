# import from arbitrary file path
# https://stackoverflow.com/a/19011259
# import types
# import importlib.machinery
# import importlib.util, sys
#
#
# def get_config(file_path):
#    #loader = importlib.machinery.SourceFileLoader('config', file_path)
#    #mod = types.ModuleType(loader.name)
#    #return loader.exec_module(mod)
#    modname = "config"
#    spec = importlib.util.spec_from_file_location(modname, file_path)
#    module = importlib.util.module_from_spec(spec)
#    sys.modules[modname] = module
#    return spec.loader.exec_module(module)

from __future__ import annotations

import importlib.util
import sys
import copy
import os.path
import shutil
import argparse
from pathlib import Path
from typing import TYPE_CHECKING, Callable, Any, Iterable


if TYPE_CHECKING:
    import types

EXAMPLE_CONFIG_PATH = "config/example_config.py"
DEFAULT_CONFIG_PATH = "config/config.py"


cached_config = None


def add_args(parser):
    group = parser.add_argument_group(title="common")
    group.add_argument("-c", "--config-file", type=str, default=None)
    group.add_argument(
        "--override-config",
        action="store_true",
        help="overrides the current config file with the example config, "
        "if no specific config file was specified.",
    )
    group.add_argument(
        "-r",
        "--release",
        action="store_true",
        default=False,
        help="uses the default options for when building for release",
    )
    group.add_argument(
        "-f",
        "--folder",
        type=str,
        default="build",
        help="output folder for the build process, and input folder for installation",
    )


def get_args(*args: Callable[[argparse.ArgumentParser], None]) -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    for add_args_func in args:
        add_args_func(parser)
    return parser.parse_args()


class Config:
    # def __init__(self, config_data: dict, description: str = ""):
    def __init__(self, data, path: list[int | str] = []):
        self.data = data
        # assert isinstance(self.data, dict)
        # self.desc = description
        self.path = copy.deepcopy(path)

    # def get_opt(self, *args):
    #    current_dict = self.data
    #    for key in args:
    #        if not isinstance(self.data, dict):
    #            raise RuntimeError(f"Argument {key} (from {args}) is not a dictionary")
    #        if key not in self.data:
    #            raise RuntimeError(f"Argument {key} (from {args}) not in config")
    #        current_dict = current_dict[key]

    #    if isinstance(current_dict, dict):
    #        return Config(current_dict)
    #    return current_dict

    def container(self) -> dict | list:
        assert isinstance(self.data, dict) or isinstance(self.data, list)
        return self.data

    def list(self) -> list:
        assert isinstance(self.data, list)
        return self.data

    def dict(self) -> dict:
        assert isinstance(self.data, dict)
        return self.data

    def item(self, javascript=False) -> Any:
        # assert not (isinstance(self.data, dict) or isinstance(self.data, list))
        if not javascript:
            return self.data
        var = self.data
        if var == True:
            return "true"
        elif var == False:
            return "false"
        elif isinstance(var, str):
            return f"'{var}'"
        return var

    def key(self) -> int | str:
        # assert not (isinstance(self.data, dict) or isinstance(self.data, list))
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
        result = self  # returns itself if no keys lol

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

            # if isinstance(result, dict):
            #    current_config = Config(
            #        #result, description=f"{current_config.desc}.{key}"
            #        result, path=self.path + [key]
            #    )
            current_config = Config(
                # result, description=f"{current_config.desc}.{key}"
                result,
                path=current_config.path + [key],
            )

            # elif i < len(keys) - 1:
            #    # ensures that current_config is always a config object
            #    raise RuntimeError(
            #        f"Key '{keys[i+1]}' is not in the data value "
            #        f"Config({current_config.path}.{key}). "
            #        "Ensure your config matches the example config!"
            #    )

        # if isinstance(result, dict) and not get_dict:
        #    return current_config
        # return result
        return current_config

    def __repr__(self):
        return f"Config({'.'.join([str(x) for x in self.path])})"


# TODO upgrade python to 3.10 so I can do str | Path
# https://stackoverflow.com/a/41595552
def import_source_file(fname: str, modname: str) -> "types.ModuleType":
    """
    Import a Python source file and return the loaded module.

    Args:
        fname: The full path to the source file.  It may container characters like `.`
            or `-`.
        modname: The name for the loaded module.  It may contain `.` and even characters
            that would normally not be allowed (e.g., `-`).
    Return:
        The imported module

    Raises:
        ImportError: If the file cannot be imported (e.g, if it's not a `.py` file or if
            it does not exist).
        Exception: Any exception that is raised while executing the module (e.g.,
            :exc:`SyntaxError).  These are errors made by the author of the module!
    """
    # https://docs.python.org/3/library/importlib.html#importing-a-source-file-directly
    spec = importlib.util.spec_from_file_location(modname, fname)
    if spec is None:
        raise ImportError(f"Could not load spec for module '{modname}' at: {fname}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[modname] = module
    try:
        assert spec.loader is not None
        spec.loader.exec_module(module)
    except FileNotFoundError as e:
        raise ImportError(f"{e.strerror}: {fname}") from e
    return module


def get_config_from_str(file_path: str):
    module = import_source_file(file_path, "config")
    if module is None:
        raise Exception("Module is None and cannot be imported")
    # config = getattr(module, "CONFIG", None)
    # if config is None:
    if not hasattr(module, "CONFIG"):
        raise Exception("CONFIG variable is not defined in the config file")

    return module.CONFIG


def get_config(args):
    """
    creates the config file from the example config if it doesn't exist
    """
    global cached_config  # lazy fix

    if cached_config is not None:
        return cached_config

    file_path = args.config_file

    if file_path is None:
        file_path = DEFAULT_CONFIG_PATH

        if args.release:
            file_path = EXAMPLE_CONFIG_PATH
            print(f"Building release: using the example config...")

        elif not os.path.isfile(DEFAULT_CONFIG_PATH) or args.override_config:
            print(f"Creating the config file under '{file_path}'...")
            if not os.path.isfile(EXAMPLE_CONFIG_PATH):
                raise Exception("Example config file does not exist")
            shutil.copy(EXAMPLE_CONFIG_PATH, DEFAULT_CONFIG_PATH)

    config_data = get_config_from_str(file_path)

    config = Config(config_data, path=["root"])
    cached_config = config
    return config


if __name__ == "__main__":
    # x = import_source_file(EXAMPLE_CONFIG_PATH, "config")
    # print(x)
    # print(getattr(x, "CONFIG", None))
    # print(getattr(x, "not_a_variable", None))

    args = get_args(add_args)
    config = get_config(args)
    # print(config("build_opts"))

    print(config("build-opts", "optimize-opts", "always-filled"))
    print(config("build-opts")("optimize-opts")("never-filled"))
    print(config("note-opts")("keybinds")("toggle-hybrid-sentence"))
    print(config("note-opts", "keybinds", "toggle-hybrid-sentence"))
    print(config("note-opts", "keybinds", "toggle-hybrid-sentence"))
    print(config("notes", "jp-mining-note", "media-build", 0))
    # print(config("note_opts", "keybinds", "toggle-hybrid-sentence", "a", "b"))
    # print(config("note_opts", "keybinds", "a"))

    # print(x.CONFIG)
