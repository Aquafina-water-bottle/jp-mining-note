# Don't run this unless you're the author of JPMN.
# This script is to create a release of JPMN.

# Checklist when making a new release:
# - Update CHANGELOG.md
# - Change version.txt
# - Run this script
# - git commit / git push
# - make release on Github with binary and changelog
# - git fetch (to update tag)
# - mkdocs gh-deploy (to update "latest version" sections)
# - jpmn-manager:
#    - ./build.sh
#    - ./package.sh VERSION
#    - update ankiweb

python3 tools/main.py --release --install-options --dev-ignore-note-changes
python3 tools/export.py
python3 tools/main.py --install-options
