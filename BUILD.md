

TODO write out all the steps properly (venv, requirements.txt, package_lock.json)


Main scripts used:
- `make.py` creates all the files and places them in the correct directories
- `install.py` takes those files and installs them into Anki
- `main.py` runs both `make.py` and `install.py`


Compiling for testing purposes:
```
python3 ./make.py
```

Compiling for release build:
```
python3 ./make.py --release
```

Testing release build:
```
python3 ./install.py --from-release
```
