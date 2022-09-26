

# Updating the Card
This section is dedicated to explaining how to update the card itself.

!!! warning
    Updating your card will **DELETE ANY CHANGES** you have made to the templates.

    Please make a **complete backup** of your collection
    (Main Window →  `File` (top left corner) →  `Export...` →  `Anki Collection Package`).


## Method 1: Python Script (recommended)

The recommended way to install the note is by using a python script.
This will change the note in place, and gives you various options on how
the note will be changed.
Lastly, it will give you warnings on anything you have to change manually,
such as Yomichan Templates.


<!-- It's updated now!!! (writing as of 2022/09/25) -->

<!--
### Anki-Connect: Dev Version
At the time of writing this (2022/09/07),
you will need the developer version of Anki-Connect,
because the Anki web version of Anki-Connect is too old
and does not have the required API calls that the installation script
will likely need (calls related to field editing).



??? info "Click here to see how to install the dev version of Anki-Connect."

    You can install Anki-Connect-Dev in one of two ways:


    === "Manual Installation"
        1. Download the zip of the
           [Anki-Connect repository](https://github.com/FooSoft/anki-connect), by
           clicking on the green `Code` dropdown, and then download the zip by the `Download Zip` button.
           After that, unzip the directory.
        1. Copy the `plugin` folder (found inside `./anki-connect`), and paste
           in the [addons folder](faq.md#where-is-the-x-folder-in-anki).
        1. Rename `plugin` to `AnkiConnectDev`.

        In the end, the file structure should look something like below:
        ```
        Anki2
         L addons21
            L AnkiConnectDev
               L __init__.py
               L config.json
               L config.md
               L edit.py
               ...
        ```

    === "Command Line Installation (MacOS and Linux ONLY)"

        ```
        git clone https://github.com/FooSoft/anki-connect.git
        cd anki-connect
        ./link.sh
        ```


    After installing `AnkiConnectDev`:

    1. Disable the old Anki-Connect add-on.
    1. Restart Anki to apply the changes.

    To confirm you have the dev version installed, check your list of installed add-ons in Anki.
    You should be able to see `AnkiConnectDev` in the aforementioned list.
-->

### Running the Script

After installing Anki-Connect-Dev, you can now run the python script:

=== "Command Line"

    The cross platform command line summary is shown below.

    A more user friendly set of instructions for Windows users
    is also available on the second tab,
    for people who have never used `python` or `git` before.

    ```
    # assuming you are at the root of the repo, i.e. after the following commands:
    #  $ git clone https://github.com/Aquafina-water-bottle/jp-mining-note.git
    #  $ cd jp-mining-note

    # grabs the latest version of the master branch
    git pull origin/master

    cd tools

    # Make sure you have Anki open and Anki-Connect installed!
    # Also ensure that your python version is 3.10.6 or higher.
    # Note: Linux users may have to use `python3` instead of `python`.
    python install.py --update
    ```

=== "Windows"

    This section explains how to run the script on Windows if you have never used
    `python` or `git` before.

    1. Install [Python](https://www.python.org/).
        Any version above 3.10.6 should suffice.

        Make sure the box for "Add Python to PATH" is checked.
        (This is a common error for people to make. Please pay attention to this step!)

    1. Get the latest version of the repository.
        The easiest way to do this is by heading to the
        [main repository](https://github.com/Aquafina-water-bottle/jp-mining-note),
        click on the green `Code` dropdown, and then download the zip by the `Download Zip` button.
        After that, unzip the directory.

    1. Open command prompt, and cd (change directory) into `jp-mining-note/tools`.
        If you don't know how to do that, see
        [here](https://www.howtogeek.com/659411/how-to-change-directories-in-command-prompt-on-windows-10/).

    1. With your current directory being the `tools` directory, run the following command:
        ```
        python install.py --update
        ```
        Once you run the command, further instructions should be given to you through the command
        line interface.


### Common Errors
This section will document common errors that occur when running the `/install.py` script.

(TODO)

#### Anki-Connect is missing actions
- re-download anki-connect from ankiweb

#### Anki fields are different
- updating script is very picky about fields, including order

- if added field(s):
    - if field matches newly-added field
        - e.g. if your note doesn't have `PAPositions` but you added a field `Positions` that fulfills the same purpose, then rename `Positions` to `PAPositions`
    - option 1: move fields under `Comment`
        - all fields under `Comment` are ignored
    - option 2: use `--ignore-order` flag (i.e. `install.py --update --ignore-order`

- if removed field:
    - re-add the field
    - don't do this next time
    - if you don't want to use the field, move field under `Comment` and run with `--ignore-order` flag

- if renamed field:
    - rename back to the original
    - again with the above, don't do this next time

- if fields are in the wrong order:
    - either manually re-order it, or run with `--ignore-order`

- see the [modding](modding.md#field-editing) page for more details.

#### Simulated fields do not match expected fields
- see above

#### Expected fields do not appear in Anki's fields list
- see above


---

## Method 2: Manually

!!! warning
    This method is **not recommended**. Furthermore, **very limited support** will
    be given if you attempt this method.

??? info "Click here to see the steps on how to update the note manually."

    Sometimes, you may be able to update the card simply by re-installing the newer version of the
    `.apkg`.
    However, this has the main caveat where
    if any of the fields are added, renamed, repositioned or deleted between card versions,
    this will **not work** (and instead add a new version of `JP Mining Note`,
    e.g. named `JP Mining Note-b320fa`).
    Additionally, if you manually edited any of the fields, then this method will not work.

    To see if the fields have been changed, compare the
    first two numbers in the version you want to install
    to the first two numbers of the current
    [card version](faq.md/#how-do-you-see-the-currently-installed-version-of-this-note).
    If the first two numbers match, then you are likely safe to manually update the card.

    If they don't match, then you MAY be able to get away with installing it anyways and transferring
    the old note types to the new note type.
    For example, a possible way to update the note is:

    1. Install the new version of the note.
    1. Select all the cards you want to transfer to the version, and change note type.
    1. Remove the old note type.
    1. Rename the new note type to the old note type name (`JP Mining Note`).
    See the changelog to see how the fields have changed and how you have to map the old fields
    to the new fields.

---

## Final Steps
There may be further steps outside of just updating the card,
such as updating Yomichan's templates / format.
Further instructions on these are written below.

---



# Updating Yomichan's Anki Card Format

To update the Yomichan Format, the steps should be almost the same as the
one specified already in the [setup](setup.md#yomichan-fields).
However, there are some differences that you should keep in mind.

## Refreshing the Fields
The most important difference is that if a new field was added or a field has been renamed,
then **the field will not show up automatically in Yomichan**.
The only way to refresh the fields as of writing this (2022/09/06)
is to change the `Model` at the top right hand corner to something else,
and then switching back to `JP Mining Note`.

<!--
Hopefully in the future, there will be a `refresh` button in Yomichan itself to avoid all this trouble.
-->

!!! warning
    Doing the above WILL clear all the fields that you previously had, unless there
    is a matching field in that other card.

Here is how I recommend transitioning as smoothly as possible:

1. As always, create a [backup](faq.md#how-do-i-backup-yomichan-settings)
    of your Yomichan settings, just in case.
1. After running `install.py --update`, create a temporary copy of the note by: <br>
    `Tools` <br>
    →  `Manage Note Types` <br>
    →  `Add` <br>
    →  (select `Clone: JP Mining Note`) <br>
    →  (name it to anything you want. For the following examples, it will be named `JP Mining Note (copy)`.) <br>
    →  `Ok`
1. Head over to Anki Card Format [as before](setup.md#yomichan-fields).
1. In the top right corner, change `Model` to `JP Mining Note (copy)`,
   and then change it back to `JP Mining Note`.
1. Update the fields as specified.
    - It will be both specified in the text you see when running `install.py --update`.
    - However, you should also simply compare the table on the setup page to your filled out fields.
1. Remove the temporary note: <br>
    `Tools` <br>
    →  `Manage Note Types` <br>
    →  (select `JP Mining Note (copy)`) <br>
    →  `Delete`

!!! info "Explanation"
    Using the temporary copy of the updated card
    means that fields that remain unchanged between the old card and new card
    will be transferred automatically in the Yomichan Format.
    If you simply choose some random model like `Basic`,
    then almost none of the fields will be preserved, as the `Basic` card
    does not have any matching fields with the `JP Mining Note` model.

---


# Updating Yomichan Templates
Like the above, you can simply follow the steps already specified in [setup](setup.md#yomichan-templates).
Again, please make sure you **reset the existing templates** (unless you know what you are doing),
and again, please make a [backup](faq.md#how-do-i-backup-yomichan-settings) of your Yomichan settings just in case.



# Updating the Options File
The options file is not updated by default, because default options are built-in
within the note itself for each option.
If you want to update this file, see the repository's
[example options file](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/media/_jpmn-options.js).

