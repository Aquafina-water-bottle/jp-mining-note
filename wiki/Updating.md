

# Table of Contents
TODO
* [Updating the Card](updating#updating-the-card)
    * [Preliminary Steps](updating#preliminary-steps)
    * [Python Script Method](updating#python-script-method-recommended) (recommended)
    * [Manual Method](updating#manual-method) (not recommended)
    * [Final Steps](updating#final-steps)
* [Updating Yomichan Format](updating#updating-yomichans-anki-card-format)
* [Updating Yomichan Templates](updating#updating-yomichan-templates)


# Updating the Card
This section is dedicated to explaining how to update the card itself.
The supported and highly recommended way is by using a Python script.


## Preliminary steps
A **VERY BIG WARNING** up front: <br>
Updating your card will **DELETE ANY CUSTOM CHANGES** you might have made to the templates.

Please make a **complete backup** of your collection
(Main Window →  `File` (top left corner) →  `Export...` →  `Anki Collection Package`).


Note that it is expected that you know how to do basic command line related tasks.
If you're a Windows user, I provide more detailed instructions and external links
on how to do basic command line related tasks, as well as explicitly reduce the number
of command line instructions you have to run.
However, if you're a MacOS or Linux user, no special guidance will be given
in this documentation.


## Python Script Method (recommended)

<!--
If you know what `python` and `git` is, please skip this section
and go straight to the [summary section](updating#command-line-summary).
-->
The recommended way to install the note is by using a python script.
This will change the note in place, and gives you various options on how
the note will be changed.
Lastly, it will give you warnings on anything you have to change manually,
such as Yomichan Templates.


#### Anki-Connect: Dev Version
At the time of writing this (2022/09/07),
you will need the developer version of Anki-Connect,
because the Anki web version of Anki-Connect is too old
and does not have the required API calls that the installation script
will likely need (calls related to field editing).


<details>
<summary><i>Click here to see how to install the dev version of Anki-Connect.</i></summary>

<br>

> ##### Command Line Installation (Anki-Connect-Dev)
> Note: this method **only** works on MacOS and Linux systems.
> ```
> git clone https://github.com/FooSoft/anki-connect.git
> cd anki-connect
> ./link.sh
> ```
> Be sure to see the [final steps](updating#final-steps-anki-connect-dev) after installing.
>
>
> ##### Manual Installation (Anki-Connect-Dev)
> 1. Download the zip of the
>    [Anki-Connect repository](https://github.com/FooSoft/anki-connect), by
>    clicking on the green `Code` dropdown, and then download the zip by the `Download Zip` button.
>    After that, unzip the directory.
> 1. Copy the `plugin` folder (found inside `./anki-connect`), and paste
>    in the [addons folder](faq#where-is-the-x-folder-in-anki).
> 1. Rename `plugin` to `AnkiConnectDev`.
>
> In the end, the file structure should look something like below:
> ```
> Anki2
>  L addons21
>     L AnkiConnectDev
>        L __init__.py
>        L config.json
>        L config.md
>        L edit.py
>        ...
> ```
>
> Be sure to see the [final steps](updating#final-steps-anki-connect-dev) after installing.
>
> ##### Final steps (Anki-Connect-Dev)
> After installing `AnkiConnectDev`:
> 1. Disable the old Anki-Connect add-on.
> 1. Restart Anki to apply the changes.
>
> To confirm you have the dev version installed, check your list of installed add-ons in Anki.
> You should be able to see `AnkiConnectDev` in the aforementioned list.

</details>

<br>





#### Command Line
The cross-platform command line summary on how to update the note is shown below.
A more detailed set of instructions for Windows users can be
found [here](updating#windows-instructions).

```
# assuming you are at the root of the repo, i.e. after the following commands:
#  $ git clone https://github.com/Aquafina-water-bottle/jp-mining-note.git
#  $ cd jp-mining-note

# grabs the latest version of the master branch
git pull origin/master

cd ./tools

# Make sure you have Anki open and Anki-Connect installed!
# Also ensure that your python version is 3.10.6 or higher.
python3 ./install.py --update
```


#### Windows Instructions
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

<!--
#### Mac OS instructions
Unfortunately, I'm not very familiar with Mac OS, and I don't have a computer with Mac OS
to test this on.
However, the [command line summary section](updating#command-line-summary)
below should be the same regardless of operating system.

Make sure you have `Python` and `git` installed!


#### Linux instructions
You won't be getting any detailed instructions outside of the
[summary section](updating#command-line-summary) below,
but you probably already knew that, didn't you? ;)
-->


## Manual Method
To preface this section, this method is **not recommended**, and **very limited support** will
be given if you attempt this method.

Sometimes, you may be able to update the card simply by re-installing the newer version of the
`.apkg`.
However, this has the main caveat where
if any of the fields are added, renamed, repositioned or deleted between card versions,
this will **not work** (and instead add a new version of `JP Mining Note`,
e.g. named `JP Mining Note-b320fa`).
Additionally, if you manually edited any of the fields, then this method will not work.

To see if the fields have been changed, compare the
first two numbers in the version you want to install
to the first two numbers of the current card version. (TODO link FAQ)
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


## Final Steps
There may be further steps outside of just updating the card,
such as updating Yomichan's templates / format.
Further instructions on these are written below.



# Updating Yomichan's Anki Card Format

To update the Yomichan Format, the steps should be almost the same as the
one specified already in the [setup](setup#yomichan-fields).
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

* **WARNING**: <br>
  Doing the above WILL clear all the fields that you previously had, unless there
  is a matching field in that other card.

Here is how I recommend transitioning as smoothly as possible:
1. As always, create a [backup](setup#preliminary-steps) of your Yomichan settings, just in case.
1. After running `install.py --update`, create a temporary copy of the note by: <br>
    `Tools` <br>
    →  `Manage Note Types` <br>
    →  `Add` <br>
    →  (select `Clone: JP Mining Note`) <br>
    →  (name it to anything you want. For the following examples, it will be named `JP Mining Note (copy)`.) <br>
    →  `Ok`
1. Head over to Anki Card Format [as before](setup#yomichan-fields).
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


