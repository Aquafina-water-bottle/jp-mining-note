# Don't run this unless you're the author of JPMN.
# This script is to create a release of JPMN.

python3 main.py --release --install-options --dev-ignore-note-changes
python3 export.py
python3 main.py --install-options
