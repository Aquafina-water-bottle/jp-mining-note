
# Overview
This page is dedicated to explaining how to update JPMN,
as well as provide basic support for required steps outside of Anki.

!!! warning

    Updating your card will **DELETE ANY CHANGES** you have made to the templates.

    Please make a [complete backup](faq.md#how-do-i-backup-my-anki-data)
    of your collection before continuing to update your note.

---

# Preliminary steps
Ensure that your note is named exactly `JP Mining Note`.
To do this, head over to:

> (Main Window) →  `Tools` →  `Manage Note Types`.

If your note is named differently, please rename it to `JP Mining Note`.

!!! note
    You can always change the name back after updating.

---

# Updating the Note

You can update the note in one of two ways:

1. Via an Anki Add-on
2. Via a Python script
    (recommended for people who know used `python` and `git` before)


{% set post_install %}
There may be further steps outside of just updating the card,
such as updating Yomichan's templates / format.
These should be recorded in the [Setup Changes](setupchanges.md) page.

Afterward seeing that page, please view the [final steps](updating.md#final-steps) section.
{% endset %}

??? info "Option 1: Via Anki Add-on *(click here)*"

    This add-on simply wraps around the python script mentioned below,
    and should do the exact same operations as running the script manually.

    1. Install the add-on with the following code: `TODO`
        - TODO actually write add-on...
        - If you already have this add-on installed, check for updates by TODO.
    1. Navigate to `Tools` →  `jp-mining-note` →  `Update`,
        and follow the instructions from there.

{% filter indent(4) %}
{{ post_install }}
{% endfilter %}


??? info "Option 2: Via Python Script *(click here)*"

    === "Windows"
        ```bat
        :: assuming you are at the root of the repo, i.e. after the following commands:
        ::  $ git clone https://github.com/Aquafina-water-bottle/jp-mining-note.git
        ::  $ cd jp-mining-note

        :: grabs the latest version of the master branch
        git pull origin/master

        :: Make sure you have Anki open and Anki-Connect installed!
        :: Also ensure that your python version is 3.10.6 or higher.
        python tools\install.py
        ```


    === "Linux & MacOS"
        ```bash
        # assuming you are at the root of the repo, i.e. after the following commands:
        #  $ git clone https://github.com/Aquafina-water-bottle/jp-mining-note.git
        #  $ cd jp-mining-note

        # grabs the latest version of the master branch
        git pull origin/master

        # Make sure you have Anki open and Anki-Connect installed!
        # Also ensure that your python version is 3.10.6 or higher.
        python3 tools/install.py
        ```

{% filter indent(4) %}
{{ post_install }}
{% endfilter %}


    <!--
    This will change the note in place, and gives you various options on how
    the note will be changed.
    Lastly, it will give you warnings on anything you have to change manually,
    such as Yomichan Templates.
    -->

<br>

??? question "Why can't I just copy/paste the templates, or just re-install the .apkg file to update the note?"

    In short, updating via Anki or Python performs many operations that cannot be done with
    a simple note transfer. Most importantly, there are operations
    (usually under [batch.py](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/tools/batch.py))
    that change the data within the actual fields themselves, and these are ran
    automatically on note update. If you attempt to update your note manually,
    these actions will not be ran, and can result in unwanted changes to your note!

    Additionally, many manual operations are done for you by updating the note.
    with Python, such as automatically creating and re-arranging new fields.

    If you still want to attempt manually updating the note, then there will be
    little to no support given.




<!--
=== "Windows"

    This section explains how to run the script on Windows if you have never used
    `python` or `git` before.

    1. Install [Python](https://www.python.org/) version 3.10.6 or above, if you haven't already.
        I recommend using the latest stable version if you have not downloaded Python before.

        Additionally, make sure the box for "Add Python to PATH" is checked.
        (This is a common error for people to make. Please pay attention to this step!)

    1. Get the latest version of the repository.
        The easiest way to do this is by heading to the
        [main repository](https://github.com/Aquafina-water-bottle/jp-mining-note),
        click on the green `Code` dropdown, and then download the zip by the `Download Zip` button.
        After that, unzip the directory.

    1. Open command prompt, and cd (change directory) into `jp-mining-note/tools`.
        If you don't know how to do that, see
        [this](https://www.howtogeek.com/659411/how-to-change-directories-in-command-prompt-on-windows-10/)
        or
        [this](https://www.itechtics.com/open-command-window-folder/#using-cmd-command-in-file-explorer-to-open-command-prompt-window).

    1. With your current directory being the `tools` directory, run the following command:
        ```bash
        python install.py --update
        ```
        Once you run the command, further instructions should be given to you through the command
        line interface.

-->

---

# Common Errors
This section will document common errors that occur when running the installation script.

<br>

## Anki-Connect is missing actions
Anki-Connect is likely outdated.
To fix this, remove and re-download Anki-Connect from the
[AnkiWeb page](https://ankiweb.net/shared/info/2055492159).

!!! note
    It seems that the `Check for Updates` occasionally fails to update the add-on,
    despite the fact that a newer version of the add-on exists.
    That is why I recommend re-downloading from the AnkiWeb page
    instead of using this feature.


<br>

## FieldVerifierException

{{ img("anki field window", "assets/anki/fields_window.png", 'align=right width="300"') }}

This class of errors means that the field list was edited at some point
after the installation or last update of JPMN.
The field list can be accessed by navigating to the following:

> (Main window) →  `Browse` →  `Fields...`.

The installation script is picky about fields and its order, and by default, the script will reject
any note type with modifications to the field list.

To fix this, there are a few cases to go through.

??? info "The field order has been changed."

    If the field order has been changed, and nothing else has been changed,
    you should be able to preserve your existing field list order by running the installation script
    with the `--ignore-order` flag (i.e. `python3 install.py --ignore-order`).

    Alternatively, you can simply re-order the fields back to their original position.

    !!! note
        If you use `--ignore-order`, all new fields will be added to the very end
        of the field list (i.e. under `Comment`).
        Additionally, any fields that were supposed to be repositioned will stay in place.
        It is up to you to move the fields to the appropriate places.

??? info "New field(s) have been created."

    You have two options. Neither of these will delete your existing field(s).

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
    See [here](moddingtips.md#field-list-editing)
    for more info on why they cannot be ignored.


---


<!--


# Updating: Manually

!!! warning
    This method is **not recommended whatsoever**. Furthermore, **very limited support** will
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
    [card version](faq.md#how-do-i-see-the-version-of-jp-mining-note)
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

-->



# Updating Yomichan's Anki Card Format

To update the Yomichan Format, the steps should be almost the same as the
one specified already in the [setup](setupyomichan.md#yomichan-fields).
The most important difference is that if a new field was added or a field has been renamed,
then **the field will not show up automatically in Yomichan**.


!!! warning
    Doing the above WILL clear all the fields that you previously had, unless there
    is a matching field in that other card.

<br>

## Refreshing Yomichan Fields

??? example "Video Demo *(click here)*"
    ![type:video](assets/updating/updating_yomichan_fields.mp4)

1. As always, create a [backup](faq.md#how-do-i-backup-yomichan-settings)
    of your Yomichan settings, just in case.
1. After installing the note update, create a temporary copy of the note by: <br>
    `Tools` <br>
    →  `Manage Note Types` <br>
    →  `Add` <br>
    →  Select `Clone: JP Mining Note` →  `Ok` <br>
    →  Name the note anything you want (the following examples will use `JP Mining Note copy`)  →  `Ok`<br>
    →  `Close`
1. If you are currently viewing Yomichan Settings, please refresh the page.
1. Head over to Anki Card Format [as before](setupyomichan.md#yomichan-fields).
1. In the top right corner, change `Model` to `JP Mining Note copy`,
    and then change it back to `JP Mining Note`.
    (If you don't see `JP Mining Note copy`, please refresh the page.)
1. Update the fields as specified.
    - It should be specified in the text you see when updating.
        However, you should also simply compare the table on the
        [setup page](setupyomichan.md#yomichan-fields) to your filled out fields.
1. Remove the temporary note: <br>
    `Tools` <br>
    →  `Manage Note Types` <br>
    →  (select `JP Mining Note copy`) <br>
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
Like the above, you can simply follow the steps already specified in [setup](setupyomichan.md#yomichan-templates).

Again, please make a [backup](faq.md#how-do-i-backup-yomichan-settings)
of your Yomichan settings just in case,
and again, please make sure you **reset the existing templates** (unless you know what you are doing).

Note that your Yomichan template options will be reset if you follow all the steps.
I recommend temporarily saving a copy of the Yomichan templates so you can easily
reset your Yomichan template options after updating.


---

# Updating the Runtime Options File
The {{ RTO_FILE }} does not automatically update with each note update,
as to not override the user's configuration on each update.
If the options file isn't updated, then the note will simply use the default value for the option.

However, if certain runtime options no longer work, you may have to update this file,
as it is possible for the configuration file layout to have changed between versions.
The most recent version of the options file can always be found
[here](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/media/_jpmn-options.js).
if you want to update it.


---

# Final Steps

By now, you should be done updating the note!
Please do the following checks to make sure everything properly works:

1. Preview an existing card, to ensure that nothing looks odd.
2. Create a new card and make sure nothing looks odd.

    ??? example "Example Japanese sentences to test card creation"

        「我ながら馬鹿馬鹿しいことを思いついたものだと嘆息しつつも、私は静かにベッドに近付く」
        { .jp-quote-text }

        「ジェラートを買うお金がないとは！給料日まで収入の当てもなし、自炊するしかありませんね」
        { .jp-quote-text }

        「これが少年誌だったら順位上がってるぞ。そしてトーナメント編でアニメ化決定だ」
        { .jp-quote-text }

        「あの時は、インターネット上で色んな質問ができるサイトに投稿したら、親切な人が商品名と売っている場所を教えてくれたんです」
        { .jp-quote-text }

        「第二次世界大戦における連合国軍の重要拠点です…」
        { .jp-quote-text }


