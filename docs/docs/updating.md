

# Updating the Card
This section is dedicated to explaining how to update the card itself.

!!! warning

    Updating your card will **DELETE ANY CHANGES** you have made to the templates.

    Please make a [complete backup](faq.md#how-do-i-backup-my-anki-data)
    of your collection before continuing to update your note.


## Method 1: Python Script (recommended)

The recommended way to install the note is by using a python script.
This will change the note in place, and gives you various options on how
the note will be changed.
Lastly, it will give you warnings on anything you have to change manually,
such as Yomichan Templates.

??? question "Why can't I just copy/paste the templates, or just re-install the .apkg file to update the note?"

    It's not uncommon for updates to contain many changes outside of just the templates
    alone. For example, required Yomichan settings, add-on config changes,
    or sometimes even the data within the note fields must be changed.
    Additionally, the field list is changed somewhat frequently.

    Although settings outside of Anki cannot be changed automatically,
    almost all settings within Anki are automatically updated
    with the python script.
    Additionally, the python script will give you plenty of instructions on
    exactly how to update any Yomichan setting or add-on config change.

    Finally, installing the .apkg file when the field list is in any way different
    will actually create a new version of the note
    instead of replacing the old note, which may prove to be an even bigger hassle.


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

### Preliminary steps
Ensure that your note is named exactly `JP Mining Note`.
To do this, head over to:

> (Main Window) →  `Tools` →  `Manage Note Types`.

If your note is named differently, please rename it to `JP Mining Note`.
If you have two different versions (for example: `JP Mining Note` and `JP Mining Note-f263ae`),
then 

!!! note
    You can always change the name back after updating.


### Running the Script

=== "Command Line"

    The cross platform command line summary is shown below.

    A more user friendly set of instructions for Windows users
    is also available on the second tab,
    for people who have never used `python` or `git` before.

    ```bash
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
        ```bash
        python install.py --update
        ```
        Once you run the command, further instructions should be given to you through the command
        line interface.


## Common Errors
This section will document common errors that occur when running the `/install.py` script.

### Anki-Connect is missing actions
Anki-Connect is likely outdated.
To fix this, remove and re-download Anki-Connect from the
[AnkiWeb page](https://ankiweb.net/shared/info/2055492159).

!!! note
    It seems that the `Check for Updates` occasionally fails to update the add-on,
    despite the fact that a newer version of the add-on exists.
    That is why I recommend re-downloading from the AnkiWeb page
    instead of using this feature.


### FieldVerifierException

{{ img("anki field window", "assets/anki/fields_window.png", 'align=right width="300"') }}

This class of errors means that the field list was edited at some point
after the installation or last update of JPMN.
The field list can be accessed by navigating to the following:

> (Main window) →  `Browse` →  `Fields...`.

The `install.py` is picky about fields and its order, and the script will automatically reject
any note type with modifications to the field list.

To fix this, there are a few cases to go through.

??? info "The field order has been changed."

    If the field order has been changed, and nothing else has been changed,
    you should be able to preserve your existing field list order by running the installation script
    with the `--ignore-order` flag (i.e. `python3 install.py --ignore-order`).

    Alternatively, you can simply re-order the fields back to their original position.

    !!! note
        All new fields will be added to the very end of the field list (i.e. under `Comment`).
        Additionally, any fields that were supposed to be repositioned will stay in place.
        It is up to you to move the fields to the appropriate places.

??? info "New field(s) have been created."

    You have two options.

    1. If you want to preserve your existing field list order, then you can run the script
        with the `--ignore-order` flag, like above.

    2. If you want to have the field list order match exactly with the current note,
        then re-order all the new fields to be below the last `Comment` field.
        Of course, this can be a temporary move; you can move the fields back to their previous positions
        after the update.

        !!! note
            On rare occasions, you might have added a field that serves the same purpose as a field that
            will be created on update.
            If so, rename your field to the field that will be added, and move the field under the
            `Comment` field.

            For example, if your note doesn't have `PAPositions` but you added a field `Positions`
            that fulfills the same purpose, then rename `Positions` to `PAPositions`.


??? info "Field(s) were removed or renamed."

    Unfortunately, there is no way to ignore removed or renamed fields.
    If you removed a field, please re-add the field.
    Likewise, if you renamed a field, please rename it back to the original name.
    See [here](modding.md#field-editing){:target="_blank"} for more info on why they cannot be ignored.





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
    [card version](faq.md/#how-do-you-see-the-currently-installed-version-of-this-note){:target="_blank"}.
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

Finally, if new fields were added, you likely have to change the font and font sizes of said fields.

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

(TODO video)

1. As always, create a [backup](faq.md#how-do-i-backup-yomichan-settings){:target="_blank"}
    of your Yomichan settings, just in case.
1. After running `install.py --update`, create a temporary copy of the note by: <br>
    `Tools` <br>
    →  `Manage Note Types` <br>
    →  `Add` <br>
    →  (select `Clone: JP Mining Note`) <br>
    →  (name it to anything you want. For the following examples, it will be named `JP Mining Note (copy)`.) <br>
    →  `Ok`
1. Head over to Anki Card Format [as before](setup.md#yomichan-fields){:target="_blank"}.
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
Like the above, you can simply follow the steps already specified in [setup](setup.md#yomichan-templates){:target="_blank"}.
Again, please make sure you **reset the existing templates** (unless you know what you are doing),
and again, please make a [backup](faq.md#how-do-i-backup-yomichan-settings){:target="_blank"} of your Yomichan settings just in case.



# Updating the Runtime Options File
The [runtime options file](runtimeoptions.md) is not updated by default, because default options are built-in
within the note itself for each option.
If you want to update this file, see the repository's
[example options file](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/media/_jpmn-options.js).

