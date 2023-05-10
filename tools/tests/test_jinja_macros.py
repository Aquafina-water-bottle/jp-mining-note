import pytest
import os

from tools.make import Generator, GenerateType
from tools.json_handler import JsonHandler
import tools.make as make
import tools.utils as utils
import shutil


@pytest.fixture
def gen():
    root_folder = utils.get_root_folder()
    templates_folder = os.path.join(root_folder, "src")
    tests_folder = os.path.join(root_folder, "tools", "tests", "jinja")
    config_path = os.path.join(root_folder, utils.DEFAULT_CONFIG_PATH)
    search_folders = [tests_folder, templates_folder]
    json_handler = JsonHandler()

    config = utils.Config(json_handler.read_file(config_path), path=["root"])

    generator = Generator(
        search_folders,
        config,
        json_handler,
        to_release=False,
    )

    return generator


def assert_files_eq(gen: Generator, input_path, output_path, extra_data=None):
    root_folder = utils.get_root_folder()

    # definitely a hack
    if extra_data is not None:
        assert isinstance(extra_data, dict)
        for k, v in extra_data.items():
            gen.data["COMPILE_OPTIONS"].dict()[k] = v

    input_file = os.path.join("tests", "input", input_path)
    expected_file = os.path.join(
        root_folder, "tools", "tests", "jinja", "tests", "output", output_path
    )
    output_file = os.path.join(
        root_folder, "tools", "tests", "jinja", "tests", "tmp", output_path
    )

    gen.generate(GenerateType.JINJA, input_file, output_file, release_output="")

    with open(expected_file) as f1:
        with open(output_file) as f2:
            assert f1.read().strip() == f2.read().strip()

    output_folder = os.path.join(root_folder, "tools", "tests", "jinja", "tests", "tmp")
    if os.path.isdir(output_folder):
        shutil.rmtree(output_folder)


def test_if(gen):
    assert_files_eq(gen, "if.html", "if.html")


def test_if_compiled_away1(gen):
    assert_files_eq(
        gen, "if.html", "empty.html", {"neverFilledFields": ["ExampleField"]}
    )


def test_if_compiled_away2(gen):
    assert_files_eq(
        gen, "if.html", "hello.html", {"alwaysFilledFields": ["ExampleField"]}
    )


def test_ifnot(gen):
    assert_files_eq(gen, "ifnot.html", "ifnot.html")


def test_ifnot_compiled_away1(gen):
    assert_files_eq(
        gen, "ifnot.html", "hello.html", {"neverFilledFields": ["ExampleField"]}
    )


def test_ifnot_compiled_away2(gen):
    assert_files_eq(
        gen, "ifnot.html", "empty.html", {"alwaysFilledFields": ["ExampleField"]}
    )


def test_if_any(gen):
    assert_files_eq(gen, "if_any.html", "if_any.html")


def test_if_any_compiled_away1(gen):
    assert_files_eq(
        gen,
        "if_any.html",
        "if_any_no_examplefield.html",
        {"neverFilledFields": ["ExampleField"]},
    )


def test_if_any_compiled_away2(gen):
    # if one is always filled -> no need to check any other field
    assert_files_eq(
        gen, "if_any.html", "hello.html", {"alwaysFilledFields": ["ExampleField"]}
    )


def test_if_none(gen):
    assert_files_eq(gen, "if_none.html", "if_none.html")


def test_if_none_compiled_away1(gen):
    # if ExampleField is never filled, then skip check
    assert_files_eq(
        gen,
        "if_none.html",
        "if_none_only_examplefield2.html",
        {"neverFilledFields": ["ExampleField"]},
    )


def test_if_none_compiled_away2(gen):
    # if ExampleField is always filled, then this will return with nothing
    assert_files_eq(
        gen, "if_none.html", "empty.html", {"alwaysFilledFields": ["ExampleField"]}
    )


def test_any_of_str(gen):
    assert_files_eq(gen, "any_of_str.html", "any_of_str.html")


def test_any_of_str_compiled_away(gen):
    assert_files_eq(
        gen,
        "any_of_str.html",
        "any_of_str_always_filled.html",
        {"alwaysFilledFields": ["ExampleField"]},
    )
