# import from arbitrary file path
# https://stackoverflow.com/a/19011259
#import types
#import importlib.machinery
#import importlib.util, sys
#
#
#def get_config(file_path):
#    #loader = importlib.machinery.SourceFileLoader('config', file_path)
#    #mod = types.ModuleType(loader.name)
#    #return loader.exec_module(mod)
#    modname = "config"
#    spec = importlib.util.spec_from_file_location(modname, file_path)
#    module = importlib.util.module_from_spec(spec)
#    sys.modules[modname] = module
#    return spec.loader.exec_module(module)


import importlib.util
import sys
import os.path
import shutil
import argparse
from pathlib import Path
from typing import TYPE_CHECKING, Callable


if TYPE_CHECKING:
    import types

EXAMPLE_CONFIG_PATH = "config/example_config.py"
DEFAULT_CONFIG_PATH = "config/config.py"



def add_args(parser):
    group = parser.add_argument_group(title="common")
    group.add_argument('-c', '--config-file', type=str)

def get_args(*args: Callable[[argparse.ArgumentParser], None]) -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    for add_args_func in args:
        add_args_func(parser)
    return parser.parse_args()



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
        spec.loader.exec_module(module)
    except FileNotFoundError as e:
        raise ImportError(f"{e.strerror}: {fname}") from e
    return module

def get_config(file_path=None):
    """
    creates the config file from the example config if it doesn't exist
    """

    if file_path is None:
        file_path = DEFAULT_CONFIG_PATH

        if not os.path.isfile(DEFAULT_CONFIG_PATH):
            if not os.path.isfile(EXAMPLE_CONFIG_PATH):
                raise Exception("Example config file does not exist")
            shutil.copy(EXAMPLE_CONFIG_PATH, DEFAULT_CONFIG_PATH)

    module = import_source_file(file_path, "config")
    if module is None:
        raise Exception("Module is None and cannot be imported")
    config = getattr(module, "CONFIG", None)
    if config is None:
        raise Exception("CONFIG variable is not defined in the config file")

    return config


if __name__ == "__main__":
    x = import_source_file(EXAMPLE_CONFIG_PATH, "config")
    print(x)
    print(getattr(x, "CONFIG", None))
    print(getattr(x, "not_a_variable", None))
    #print(x.CONFIG)

