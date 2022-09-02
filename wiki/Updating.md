

# Updating The Card
- TODO
- warning: will completely wipe out any custom changes to the card that you made (backup yet again)
- look at the first 2 numbers: if they're higher, then you can't manually update
- main supported way is a python script: 

```
# assuming you are at the root of the repo,
# i.e. after the `git clone ...` and `cd jp-mining-note`

git fetch origin/master
git merge origin/master

cd ./tools

# make sure you have Anki open and Anki-Connect installed!
python3 ./install.py --upgrade
```

## Updating Yomichan Format
- TODO
- (going to look into contributing a refresh button...)
- new fields requires you to basically refresh the card fields in yomichan
- no obvious way of doing it: only way I know of is to switch between card types
- will likely lose almost all your fields & you will have to refill
    - make sure you make a backup of your yomichan settings before doing anything,
      especially if they differ from the original setup
- follow the steps in setup to re-fill the fields

## Updating Yomichan Templates
- TODO
- follow the steps in setup
- if you haven't edited the templates past the initial setup, please reset the templates

