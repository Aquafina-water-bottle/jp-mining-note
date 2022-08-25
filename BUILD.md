NOTE: This document is primarily for developer use.
If you are looking to simply install the card, see the appropriate
wiki page here (TODO link to setup).


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

<!--

NO LONGER NEEDED

# Installs prettier, which is needed ONLY for release builds (required for contributing new code)
# Optional for debugging purposes and for personal usage.
npm ci

-->

In case you don't want to use a `venv` (highly recommended that you use venv!!),
you can install the following python packages:
```
pip3 install JSON-minify jinja2 black pytest
```

Additonal packages I use for development on my local system are:
```
pip3 install neovim anki aqt
```


Further resources on how to run venv can be found in the official documentation
[here](https://docs.python.org/3/library/venv.html).



Building and installing:
```
cd tools

# Builds into a temporary folder and installs
python3 ./main.py

# Build for release, if you want to contribute to the project
python3 ./make.py --release
```

Testing:

```
cd tools
python3 -m pytest ./tests
```


<!--
TODO: contributing (separate doc probably)
- use black to format all python files
- make sure tests run

-->

