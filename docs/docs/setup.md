
# Overview

A full sentence mining workflow requires two main parts:

1. Text to make the cards from.
1. The card exporter, to create cards from the text.
    * And optionally, the image and sentence audio from the media (if the media has either).

These next few sections
([Installing](setup.md), [Anki](setupanki.md) and [Yomichan](setupyomichan.md))
are all dedicated to providing the
<span class="text-yellow">**minimal setup**</span>
to setup the card exporter to create cards with this note type.

Getting the text (the first part)
and getting the image and sentence audio (the optional part of part two)
are not heavily focused on within this site,
but can be found under [Setup: Text & Media](setuptextmedia.md)
page.


!!! note
    There's quite a few things to setup to use this note.
    If you ever get lost, remember that this site has a search bar!

---

# Installing Anki

Download and install Anki from [the official website](https://apps.ankiweb.net/) if you haven't already.
I recommend downloading the latest version, to avoid having to do extra steps during the setup.

---

# Installing jp-mining-note
There are three ways of installing the note:

1. Via **JPMN Manager**, a small Anki add-on that can install and update jp-mining-note.
    *If you don't know which method to choose, choose this one*.
2. Via **command line**.
    This method is recommended for people who are familiar with `git` and `python`,
    and don't want to download another Anki add-on.
3. **Manually**, using Anki.
    This tends to be more error-prone due to having many more potential points of failure.
    Therefore, I wouldn't recommend installing the note this way.
    It should only be used if the first two options didn't work.


??? info "Option 1: JPMN Manager <small>(click here)</small>"

    1.  To install any Anki add-on, navigate to:

        > (Main Window) →  `Tools` →  `Add-ons` →  `Get Add-ons...`

        From here, you can install
        [JPMN Manager](https://ankiweb.net/shared/info/{{ JPMN_MGR_CODE }})
        and
        [Anki-Connect](https://ankiweb.net/shared/info/2055492159)
        by using the following add-on codes:
        ```
        {{ JPMN_MGR_CODE }} 2055492159
        ```

    1. Restart Anki, to load the new add-ons.
    1. Within Anki, navigate to the following:

        > (Main Window) →  `Tools` →  `JPMN Manager` →  `Install jp-mining-note`

        This will install latest stable version of the note,
        as well as the fonts required for the note to work. <br>
        Note: Installing jp-mining-note might take a while, and Anki may appear frozen.

    ![type:video](assets/setup/jpmn_manager-0.12.0.0-prerelease-3.mp4)

??? info "Option 2: Command Line <small>(click here)</small>"

    === "Windows"

        ```bat
        git clone "https://github.com/Aquafina-water-bottle/jp-mining-note.git"
        cd jp-mining-note

        :: Ensure you have Anki open, and with Anki-Connect running
        :: Also ensure that you have python 3.9+ installed.
        :: It *MAY* work with lower versions of python, but I make no such guarantee. ;)
        python tools\install.py
        ```

    === "MacOS & Linux"

        ```bash
        git clone "https://github.com/Aquafina-water-bottle/jp-mining-note.git"
        cd jp-mining-note

        # Ensure you have Anki open, and with Anki-Connect running
        # Also ensure that you have python 3.9+ installed.
        # It *MAY* work with lower versions of python, but I make no such guarantee. ;)

        # You may have to use `python3` instead of `python`.
        python tools/install.py
        ```

    `install.py` will install latest stable version of the note,
    as well as the fonts required for the note to work.

??? info "Option 3: Manually <small>(click here)</small>"


    1. Go to the
        [releases page](https://github.com/Aquafina-water-bottle/jp-mining-note/releases)
        and download the cards from the latest release.
        You should download the `{version}-jpmn_example_cards.apkg` file.
    2. After you download the cards, import them by navigating to Anki by doing the following:

        > `File` (top left corner) →  `Import...`

    3. By default, the custom fonts do not come with the `.apkg` file.
        To install these fonts, head over to this repository's
        [media folder](https://github.com/Aquafina-water-bottle/jp-mining-note/tree/master/media)
        and download the 4 `.otf` files.
    4. Move the `.otf` files into the [media folder](faq.md#where-is-the-x-folder-in-anki){:target="_blank"}
        of your profile (`Anki2/PROFILENAME/collections.media`).

    ![type:video](assets/setup/manual_import-0.9.1.1.mp4)


---


# Verifying the Note Works
You should see a deck `JPMN-Examples` in your collection.
View one of the cards and make sure the card looks similar to the one below:

=== "Dark Theme"

    {{ img("Example card", "assets/fushinnsha/dark_back.png") }}

=== "Light Theme"

    {{ img("Example card", "assets/fushinnsha/light_back.png") }}

Please check the following in particular:

1. The fonts should match with the above example.

    If the fonts don't match, try restarting Anki.
    If the fonts still don't match, the note was likely installed manually.
    Please verify you manually installed the fonts and placed them in the correct folder
    (see steps 3 and 4).

    {{ img("normal info circle example", "assets/info_circle/normal_example.png", 'align=right') }}

1. Notice how at the top left corner, the info circle (the "i" encased within the circle)
    is the default grey color.

    If this circle is red or orange, there may be something wrong with the template.
    Please see [this](faq.md#errors-warnings){:target="_blank"} section for basic troubleshooting.

1. Clicking on the image to zoom should work out of the box.

    Kanji hover may not work yet. If it doesn't work,
    read the Anki-Connect setup instructions on the next page.

    If the image suddenly appears without a zoom animation,
    then you must [enable animations on Anki](setupanki.md#enable-animations).

1. If the furigana on your card seems to appear higher above the kanji compared to the picture,
    see the [Fix Ruby Positioning](other.md#fix-ruby-positioning) option.


---

# Anki Setup

This note requires some additional setup to Anki.
In particular, some add-ons are required for the note to work.

[Click here see how to setup Anki!](setupanki.md){ .md-button }

