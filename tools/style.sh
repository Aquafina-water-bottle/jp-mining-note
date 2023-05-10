# run in project root, i.e. ./tools/style.sh

npx prettier --config .prettierrc.json5 --write src/ts/
black tools/
