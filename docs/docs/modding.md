
<!--
If you are looking to simply install the card, see the appropriate
wiki page here (TODO link to setup).
-->

# Introduction
This page describes all the ways of modding your note,
and goes into depth on the ways you can mod your note without losing your changes upon updates.


!!! note

    This document is primarily for developer use.
    It is assumed that you have knowledge of basic command line.
    The instructions listed below will be primarily Linux based as well.
    Notes for other operating systems may be shown.


# Modding: The Obvious Way
Throughout the documentation and within the templates alone, you will likely
see warning messages to not edit the templates directly unless you are willing
to lose your changes when you update the note.

The most obvious way to mod the note is directly in the pre-built template downloaded.
If you are completely fine with losing your changes upon each update,
and don't want to take advantages of certain tools that comes with this note
(such as compile-time options),
then you can simply edit the template and ignore the rest of this page.



# Project Description
The Anki card template is generated through `jinja` templates,
which is a popular templating engine for `Python`.
All of these templates are located under the `(root)/templates` folder.

The Anki templates are generated through a combination of
`sass` (for css) and `jinja` (for everything else)
through the `tools/make.py` script.

You must build the note to use compile-time options,
as compile-time options are applied upon note building.


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



# Building

## Prerequisites:
- Python 3.10.6 or higher
    - I recommend [pyenv](https://github.com/pyenv/pyenv) to upgrade your python version
      if you're running linux. and have a lower version of Python.
- dart sass (dart version is required to use the latest features of sass)
- Anki 2.1.54 or higher
- Anki-connect addon

## Initialization

```
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

Disabling the venv:
```
deactivate
```

Resetting the venv:
```
# run this only if you're already in a venv
deactivate

rm -r bin lib
python3 -m venv .
source ./bin/activate
pip3 install -r tools/requirements.txt
```


!!! note
    The `master` branch is the bleeding edge version of the note.
    If you want to build a more stable version of the note, do the following:
    ```
    git fetch
    git checkout tags/TAG_NAME

    # or if you want to create a new branch as well:
    git checkout tags/TAG_NAME -b BRANCH_NAME

    # to return back to the master branch:
    git checkout master
    ```


!!! note

    In case you don't want to use a `venv` (highly recommended that you use venv!!),
    you can install the following python packages:
    ```
    pip3 install JSON-minify jinja2 black pytest
    ```

<!--
Additional packages I use for development on my local system are:
```
pip3 install neovim anki aqt
```
-->

## Building and Installing


```
cd tools

# Builds into a temporary folder and installs
# WARNING: completely overrides current note that is installed
python3 ./main.py
```


Running the ./main.py script is equivalent of running:
```
# builds the note into the ./build folder
python3 make.py

# installs the note from the ./build folder
python3 install.py --from-build --update
```


## Running Tests
```
cd tools
python3 -m pytest ./tests
```

## Building the Documentation

- all documentation files are found under `(root)/docs`.
- if already done the above steps with the requirements.txt, all dependencies should already be installed
- main files should be found under docs/docs/PAGE.md

to preview the documentation:
```
mkdocs serve
```


!!! note
    If you are not using requirements.txt and venv, you can install the
    dependencies manually here:
    ```
    pip3 install mkdocs mkdocs-video mkdocs-material mkdocs-macros-plugin mkdocs-git-revision-date-localized-plugin
    ```
<!-- TODO update requirements.txt to include last git-revision requirement -->



# Modding the Note

After running `main.py` (or `make.py`), a new file `config/config.py` should appear.
The main compile-time options can be found in this file.

{% raw %}
## Always filled & Never filled fields
You can set a field to act as if it has always been filled, or it has never been filled.
This will remove the conditional Anki templates
(`{{#FIELD}}` and `{{^FIELD}}` markers) for the specified fields.
For example, if your `compile-options` is:

```
"always-filled-fields": ["A"],
"never-filled-fields": ["B"],
...
```

and your card template is:
```
{{#A}} A is filled {{/A}}
{{^A}} A is not filled {{/A}}
{{#B}} B is filled {{/B}}
{{^B}} B is not filled {{/B}}
{{#C}} C is filled {{/C}}
{{^C}} C is not filled {{/C}}
```

then upon card build, the resulting card template will be:
```
A is filled
B is not filled
{{#C}} C is filled {{/C}}
{{^C}} C is not filled {{/C}}
```
{% endraw %}

## Modules
- TODO basic explanation
- primary use is for javascript
- javascript-only modules do not require any edits to the raw html
- some modules may still have to edit the raw html -> cannot update the note
    - edits are minimal so you should be able to re-add upon update
- uses runtime options

## Extra Javascript
TODO: not implemented

- primarily for testing, not for production use
- appends whatever javascript you want to the very end of the anonymous function

## Custom CSS
- allows for custom themes / minor user customizations
- can override variables, etc.
- simply appends the css at the very end of the existing css
- make new folder under `scss` (e.g. `scss/extra`) and add to `css-folders` in config.py, e.g.
    ```
    "css-folders": ["default", "dictionaries", "extra"],
    ```

## Template Overrides
- `overrides` folder (or whatever folder you specify under `templates-override-folder` in config.py)
- same format as existing `templates` folder


## Make your changes shown!
If you think your changes will be useful for others,
I highly recommend contributing your work to this project!

TODO

<!--
- especially since your changes will likely edit the raw html
- contributing to the project + enabling the features on your system should guarantee that
  your additions aren't lost upon each update
-->


<!--
# Modding the Note

- runtime options
    - options in javascript
    - can implement certain features only with runtime options and no modules
    - TODO write this in a separate page

- what to use: modules / runtime options only
    - whichever you think is simpler to implement and to maintain
    - usually modules


## Where to add your feature?
- only care about this if you plan on contributing your feature btw
-->




## Yomichan Templates CSS


example generated html for frequencies:


```html

<div class="frequencies">
  <div class="frequencies__group" data-details="Anime &amp; Jdrama Freq:">
    <div class="frequencies__number"><span class="frequencies__number-inner">3128</span></div>
    <div class="frequencies__dictionary">
      <span class="frequencies__dictionary-inner"><span class="frequencies__dictionary-inner2">Anime &amp; Jdrama Freq:</span></span>
    </div>
  </div>
  <div class="frequencies__group" data-details="Innocent Ranked">
    <div class="frequencies__number"><span class="frequencies__number-inner">6230</span></div>
    <div class="frequencies__dictionary">
      <span class="frequencies__dictionary-inner"><span class="frequencies__dictionary-inner2">Innocent Ranked</span></span>
    </div>
  </div>
  <!-- etc. -->
</div>
```


example generated html for pitch accent positions:
```html
<!-- surrounded by <div class="pa-positions"> in Anki template -->

<div class="pa-positions__group" data-details="NHK">
  <div class="pa-positions__dictionary"><div class="pa-positions__dictionary-inner">NHK</div></div>
  <ol>
    <li>
      <span style="display: inline;"><span>[</span><span>0</span><span>]</span></span>
    </li>
    <li>
      <span style="display: inline;"><span>[</span><span>3</span><span>]</span></span>
    </li>
  </ol>
</div>
<div class="pa-positions__group" data-details="大辞泉">
  <div class="pa-positions__dictionary"><div class="pa-positions__dictionary-inner">大辞泉</div></div>
  <ol>
    <li>
      <span style="display: inline;"><span>[</span><span>0</span><span>]</span></span>
    </li>
  </ol>
</div>
<!-- etc. -->

```


example generated html for pitch accent graphs:
```html
<!-- surrounded by <div class="pa-graphs"> in Anki template -->

<div class="pa-graphs__group" data-details="NHK">
  <div class="pa-graphs__dictionary"><div class="pa-graphs__dictionary-inner">NHK</div></div>
  <ol>
    <li>
      <svg> ... </svg> <!-- Yomichan's generated SVG -->
    </li>
  </ol>
</div>
<div class="pa-graphs__group" data-details="大辞泉">
  <div class="pa-graphs__dictionary"><div class="pa-graphs__dictionary-inner">大辞泉</div></div>
  <ol>
    <li>
      <svg> ... </svg> <!-- Yomichan's generated SVG -->
    </li>
  </ol>
</div>
<!-- etc... -->
```


## Tips and Tricks

### Print statements
Anki doesn't come with a way to use `console.log()` normally, so I made one myself.

```javascript
// global logger
LOGGER.error("message");
LOGGER.warn("message");
LOGGER.info("message");
LOGGER.debug("message");

// module-specific logger
const logger = JPMNLogger("module-name");
logger.error("message");
logger.warn("message");
logger.info("message");
logger.debug("message");
```

The above functions prints a message of the given log level to the info circle.
To see the message, hover over the info circle.

To use the `debug` function, make sure that the `debug` option is set to `true`
in the javascript options.



# Modding Yomichan Templates
TODO transfer yomichan templates section here






# Contributing
TODO separate page

- before:
    - highly prefer if you contact me before-hand with the changes you want to make

- during:
    - attempt to match style around the code

- final steps:
    - use black to format all python files (TODO script)
    - make sure tests run (maybe CI at some point, might be overkill atm though lmao)
    - update documentation (see wiki/ folder)


```

# Build for release, if you want to contribute to the project
python3 ./make.py --release

```




<!--
# Making an Issue
TODO

- prefer chats over issues (a lot easier / faster to get things done)

- if only specific cards OR modified version of note, please export + send
    - when in doubt, send it regardless ;)
- provide as much details as you can, including:
    - anki version
    - operating system
    - screenshots, if applicable
    - how to reproduce the behavior & expected behavior
- TODO issue.md template would be cool
-->







