

<!--
```
templates
 L jp-mining-note
 L macros
    - general macros used throughout the note generation template.
 L modules
    - primarily javascript
    - used to separate collections of code that can be added / removed to the note at will.
 L scss    # contains all the css generated
```
-->



# Technical Summary
The Anki card template is generated through `jinja` templates,
which is a popular templating engine for `Python`.
All of these templates are located under the `(root)/src` folder.

The Anki templates are generated through a combination of
`sass` (for css) and `jinja` (for everything else),
through the `tools/make.py` script.

You **must build the note to use compile-time options**.

Additionally, if you want to use bleeding edge features
(the absolute latest features, which are potentially riddled with bugs),
you must build and install the note from the `master` branch.
More info about this is shown later.


!!! note

    The instructions listed below will be primarily Linux based.
    Notes for other operating systems may be shown, but are not guaranteed.

    It is also assumed that you have knowledge of basic command line.

---


# Building

## Prerequisites
- Python 3.10.6 or higher
    - I recommend [pyenv](https://github.com/pyenv/pyenv) to upgrade your python version
      if you're running linux. and have a lower version of Python.
- [sass](https://sass-lang.com/dart-sass) (dart implementation)
    - The dart implementation is required to use the latest features of sass.
- Anki 2.1.49 or higher (2.1.54+ is highly recommended)
- Anki-Connect addon


<br>

## Initialization

The following creates a custom python environment with `venv`,
so that packages aren't installed into your global python environment.

```bash
git clone https://github.com/Aquafina-water-bottle/jp-mining-note.git
cd jp-mining-note
# alternatively, if you already have the repository on your system:
git pull origin/master

# You may have to use `python` instead of `python3`, and `pip` instead of `pip3`.
python3 -m venv .

# The following is for POSIX (bash/zsh) only.
# See how to activate venv on your system in the official documentation:
# https://docs.python.org/3/library/venv.html
source ./bin/activate

pip3 install -r tools/requirements.txt
```

Some additional options with `venv` are shown below.

??? examplecode "Disabling the venv"
    ```bash
    deactivate
    ```

??? examplecode "Resetting the venv"

    ```bash
    # run this only if you're already in a venv
    deactivate

    rm -r bin lib
    python3 -m venv .
    source ./bin/activate
    pip3 install -r tools/requirements.txt
    ```

??? examplecode "Don't want to use venv?"

    It is **highly recommended that you use venv**, or something else that isolates
    the python environment.

    However, in case you don't want to use `venv`,
    you can manually install the dependencies
    (including dependencies for building documentation):
    ```bash
    pip3 install \
            JSON-minify jinja2 black pytest \
            mkdocs mkdocs-video mkdocs-material mkdocs-macros-plugin \
            mkdocs-git-revision-date-localized-plugin
    ```

<!--
# personal setup
pip3 install neovim anki aqt
-->


!!! note

    The `master` branch is the bleeding edge version of the note.

    If you want to build a more stable version of the note, do the following:
    ```bash
    git fetch
    git checkout tags/VERSION

    # or if you want to create a new branch as well:
    git checkout tags/VERSION -b BRANCH_NAME

    # to return back to the master branch, after you're done building:
    git checkout master
    ```

<br>

## Building and Installing

After setting up the `venv`, you are ready to build and install the note.

```bash
cd tools

# builds the note into the ./build folder
python3 make.py

# installs the note from the ./build folder
# WARNING: completely overrides current note that is installed
python3 install.py --from-build --update
```

!!! note
    Running the `main.py` script is exactly equivalent of running the above two commands.


!!! note
    If you are attempting to (build and) install the bleeding edge version of the note
    on an Anki profile that does NOT already have the note installed,
    you have to run the installation script twice.
    For example:

    ```
    python3 make.py
    python3 install.py --from-build --update
    python3 install.py --from-build --update
    ```


Additional things you can do with the project are shown below.

<br>

## Running Tests
```bash
cd tools
python3 -m pytest ./tests
```

<br>

## Building the Documentation

To "build" the documentation, all you have to do is the following:
```bash
cd docs

# you should now be in (root)/docs, where the mkdocs.yml is.
mkdocs serve
```

This will allow you to preview the website (usually at `http://127.0.0.1:8000/jp-mining-note/`).


If you are looking to edit the documentation, all related files should be found
under this `docs` folder.
The important markdown files are found under:
```
(root)
  L docs
     L docs
        L index.md # the home page
        L preface.md
        L setup.md
        L ...
     L mkdocs.yml
```

---


# Common Errors

(TODO) Fill this out as people start working with this note


