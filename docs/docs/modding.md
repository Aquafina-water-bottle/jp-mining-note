
NOTE: This document is primarily for developer use.
If you are looking to simply install the card, see the appropriate
wiki page here (TODO link to setup).


# Introduction
TODO


# Building
TODO

## Prerequisites:
- Python 3.10.6 or higher
    - I recommend [pyenv](https://github.com/pyenv/pyenv) to upgrade your python version if you're running linux.
- npm (only required for release builds / contributing)
- dart sass (dart version is required to use the latest features of sass)
- Anki 2.1.54 or higher
- Anki-connect addon

## Building & Installing

Note: you may have to use `python` instead of `python3`, and `pip` instead of `pip3`.

Setting up the system:
```
# initialization
git clone https://github.com/Aquafina-water-bottle/jp-mining-note.git
cd jp-mining-note
python3 -m venv .

# POSIX (bash/zsh) only.
# See how to activate venv on your system in the official documentation:
# https://docs.python.org/3/library/venv.html
source ./bin/activate

pip3 install -r tools/requirements.txt
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

Building and installing:
```
cd tools

# Builds into a temporary folder and installs
# WARNING: completely overrides current note that is installed
python3 ./main.py
```

Compile time options:
- after the first `./main.py`, a file `config/config.py` should exist
- edit this to your preferences and re-run `./main.py`


Running tests:
```
cd tools
python3 -m pytest ./tests
```




# Modding the Note
- templates are auto-generated
- modding the html directly will mean that you will lose your changes upon note update
- recommended approach is to use modules/runtime options

- modules:
    - TODO basic explanation
    - javascript-only modules do not require any edits to the raw html
    - some modules may still have to edit the raw html -> cannot update the note
        - edits are minimal so you should be able to re-add upon update
    - uses runtime options

- runtime options
    - options in javascript
    - can implement certain features only with runtime options and no modules
    - 

- what to use: modules / runtime options only
    - whichever you think is simpler to implement and to maintain
    - usually modules

- if you think your changes will be useful for others, highly recommend contributing your work!
    - especially since your changes will likely edit the raw html
    - contributing to the project + enabling the features on your system should guarantee that
      your additions aren't lost upon each update


## Themes
- TODO not implemented yet


## Where to add your feature?
- only care about this if you plan on contributing your feature btw


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





# Building the Documentation

- all documentation files are found under `(root)/docs`.
- if already done the above steps with the requirements.txt, all dependencies should already be installed
- main files should be found under docs/docs/PAGE.md

to preview the documentation:
```
mkdocs serve
```


!!! note
    - if not using requirements.txt / venv:
    ```
    pip3 install mkdocs mkdocs-video mkdocs-material mkdocs-macros-plugin
    ```



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







