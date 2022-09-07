

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

# Updating Yomichan's Anki Card Format

To update the Yomichan Format, the steps should be almost the same as the
one specified already in the [setup](setup#yomichan-fields).
However, there are some differences that you should keep in mind.

## Refreshing the Fields
The most important difference is that **if a new field was added**,
then the field will not show up automatically in Yomichan.
The only way to refresh the fields[^1]
is to change the `Model` at the top right hand corner to something else,
and then switching back to `JP Mining Note`.

[^1]:
    As of writing this (2022/09/06). Hopefully in the future, there will be a `refresh` button
    in Yomichan itself to avoid all this trouble.

* **WARNING**: <br>
  Doing the above WILL clear all the fields that you previously had, unless there
  is a matching field in that other card.

Here is how I recommend transitioning as smoothly as possible:
1. After running `install.py --update`, create a temporary copy of the note by: <br>
    `Tools` <br>
    →  `Manage Note Types` <br>
    →  `Add` <br>
    →  (select `Clone: JP Mining Note`) <br>
    →  (name it to anything you want. For the following examples, it will be named `JP Mining Note (copy)`.) <br>
    →  `Ok`
1. As always, create a [backup](setup#preliminary-steps) of your Yomichan settings, just in case.
1. Head over to Anki Card Format [as before](setup#yomichan-fields).
1. In the top right corner, change `Model` to `JP Mining Note (copy)`, and then back to `JP Mining Note`.
1. Update the fields as specified.
    - It will be both specified in the text you see when running `install.py --update`.
    - However, you should also simply compare the table on the setup page to your filled out fields.
1. Remove the temporary note: <br>
    `Tools` <br>
    →  `Manage Note Types` <br>
    →  (select `JP Mining Note (copy)`) <br>
    →  `Delete`

**Explanation**: <br>
Using the temporary copy of the updated card
means that fields that remain unchanged between the old card and new card
will be transferred automatically in the Yomichan Format.
If you simply choose some random model like `Basic`,
then almost none of the fields will be preserved, as the `Basic` card
does not have any matching fields with the `JP Mining Note` model.


# Updating Yomichan Templates
Like the above, you can simply follow the steps already specified in [setup](setup#yomichan-templates).
Again, please make sure you **reset the existing templates** (unless you know what you are doing),
and again, please make a [backup](setup#preliminary-steps) of your Yomichan settings just in case.


