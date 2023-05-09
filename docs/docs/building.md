



# Technical Summary
The Anki card template is generated through `jinja` templates,
which is a popular templating engine for `Python`.
All of these templates are located under the `(root)/src` folder.

The Anki templates are generated through a combination of
`sass` (for CSS), `jinja` (for HTML generation),
and `npm` (Webpack + TypeScript) for JavaScript generation.
All of this is managed through the `tools/make.py` script.

**You must build the note to use any compile-time options**.

Additionally, if you want to use bleeding edge features
(the absolute latest features, which maybe riddled with bugs),
you must build and install the note from the `dev` branch.
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
      if you're running Linux.
- [git](https://git-scm.com/downloads)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/)
- [Anki-Connect](https://github.com/FooSoft/anki-connect#anki-connect)
- Anki 2.1.54+ or higher




## Initialization (git)

First, you must clone the repository onto your drive.

```bash
# on fresh installs
git clone https://github.com/Aquafina-water-bottle/jp-mining-note.git
cd jp-mining-note

# alternatively, if you already have the repository on your system:
git pull origin master
```

The `master` branch is the stable version of the note.

If you want to build the pre-release version of the note,
use the `dev` branch. For example, do the following:
```bash
git fetch
git checkout dev
```



## Initialization (venv)

The following creates a custom python environment with `venv`,
so that packages aren't installed into your global python environment.

```bash
# assuming you are under the root folder, usu. jp-mining-note

# You may have to use `python` instead of `python3`, and `pip` instead of `pip3`.
python3 -m venv .venv

# The following is for POSIX (bash/zsh) only.
# See how to activate venv on your system in the official documentation:
# https://docs.python.org/3/library/venv.html
source ./.venv/bin/activate

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

    rm -r ./venv
    python3 -m venv .venv
    source ./.venv/bin/activate
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
            pyjson5 jinja2 black pytest \
            mkdocs mkdocs-video mkdocs-material mkdocs-macros-plugin mkdocs-redirects \
            mkdocs-git-revision-date-localized-plugin
    ```

<!--
# personal setup
pip3 install neovim anki aqt
-->


## Initialization (npm)

The following installs all the required dependencies for generating the note's JavaScript.

```bash
# installs a clean state of the dependencies
npm ci
```





## Building and Installing

After setting up `venv` and `npm`, you are ready to build and install the note.

```bash

# Builds the note into the (root)/build folder, and installs.
# WARNING: completely overrides current note that is installed!
# Please make a backup of your collection before doing this!
python3 tools/main.py
```

<!--
!!! warning
    If you are attempting to (build and) install the bleeding edge (`dev`) version of the note
    at ALL, use the `--dev-output-version="0.12.0.0"` flag on the
    `install.py` (or `main.py`) script. For example:
    ```
    python3 main.py --dev-output-version="0.12.0.0"
    ```

    There are also some related notes for the current dev build:

    - If you're on 2.1.54 or below, you'll want to add `legacy-anki_2-1-54` to the `css-folders` of the config.py, i.e.
    ```
    "css-folders": ["base", "responsive", "dictionaries", "editor-fields", "legacy-anki_2-1-54", "theme", "extra"],
    ```

    - The font size of some fields aren't automatically changed yet, so you'll have to adjust them manually in order for it to look nice:
    ```
    "WordReadingHiragana": 10,
    "PrimaryDefinitionPicture": 20, # default
    "PAOverrideText": 20, # default
    "YomichanWordTags": 10,
    "IsHintCard": 10,
    ```

    - In addition to the above, you would likely want to match the font family with all the other fields,
        as the font family for new fields is not updated either.

!!! note
    Running the `main.py` script is exactly equivalent of running the above two commands.

-->


!!! note
    If you are attempting to (build and) install the bleeding edge version of the note
    on an Anki profile that does NOT already have the note installed,
    you have to run the installation script twice.
    For example:

    ```
    python3 tools/main.py
    python3 tools/main.py
    ```


Additional things you can do with the project are shown below.


## Running Tests
```bash
cd tools
python3 -m pytest ./tests
```


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


