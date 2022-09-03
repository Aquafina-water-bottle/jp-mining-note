

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
source ./bin/activate # linux only, see how to activate venv on your system below
pip3 install -r tools/requirements.txt
```

Further resources on how to run venv can be found in the official documentation
[here](https://docs.python.org/3/library/venv.html).


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

Testing:

```
cd tools
python3 -m pytest ./tests
```



# Modding the Note
TODO


## Tips and Tricks

#### Print statements
Anki doesn't come with a way to use `console.log()` normally, so I made one myself.

```
logger.error("message");
logger.warn("message");
logger.info("message");
_debug("message");
```

The above functions prints a message of the given log level to the info circle.
To see the message, hover over the info circle.

To use the `_debug` function, make sure that the `debug` option is set to `true`
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







