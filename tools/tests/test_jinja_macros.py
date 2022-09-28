import pytest
import os

from tools.make import Generator, GenerateType
import tools.make as make
import tools.utils as utils
import shutil


@pytest.fixture(scope="session", autouse=False)
def gen():

    root_folder = utils.get_root_folder()
    templates_folder = os.path.join(root_folder, "templates")
    tests_folder = os.path.join(root_folder, "tools", "tests", "jinja")
    config_path = os.path.join(root_folder, "config", "example_config.py")
    search_folders = [tests_folder, templates_folder]
    css_root = os.path.join(templates_folder, "scss")

    config = utils.get_config_from_path(config_path)

    generator = Generator(
        search_folders,
        config,
        css_root,
        to_release=False,
    )

    yield generator

    output_folder = os.path.join(
        root_folder, "tools", "tests", "jinja", "tests", "tmp"
    )
    if os.path.isdir(output_folder):
        shutil.rmtree(output_folder)


@pytest.fixture
def assert_files_eq():
    def assert_files_eq_func(gen: Generator, input_path, output_path):
        root_folder = utils.get_root_folder()

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

    return assert_files_eq_func


def test_if(gen, assert_files_eq):
    assert_files_eq(gen, "if.html", "if.html")

def test_if_compiled_away(gen, assert_files_eq):
    # definitely a hack
    gen.data["COMPILE_OPTIONS"].dict()["never-filled-fields"] = ["ExampleField"]
    assert_files_eq(gen, "if.html", "empty.html")


