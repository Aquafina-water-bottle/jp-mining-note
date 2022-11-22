
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
but can be found under [Setup: Everything Else](setupeverythingelse.md)
page.


!!! note
    There's quite a few things to setup to use this note.
    If you ever get lost, remember that this site has a search bar!

---

# Installing Anki

Download and install Anki from [the official website](https://apps.ankiweb.net/) if you haven't already.
I recommend downloading the latest version.

---

# Installing jp-mining-note
There are two ways of installing the note:



??? info "Option 1: The Automatic Way *(click here)*"

    If you know what `git` and `python` is, here's all you have to do:

    === "Windows"

        ```bat
        git clone "https://github.com/Aquafina-water-bottle/jp-mining-note.git"
        cd jp-mining-note

        :: Ensure you have Anki open, and with anki-connect running
        :: Also ensure that you have python 3.10+ installed.
        :: It *MAY* work with lower versions of python, but I make no such guarantee. ;)
        python tools\install.py
        ```

    === "MacOS & Linux"

        ```bash
        git clone "https://github.com/Aquafina-water-bottle/jp-mining-note.git"
        cd jp-mining-note

        # Ensure you have Anki open, and with anki-connect running
        # Also ensure that you have python 3.10+ installed.
        # It *MAY* work with lower versions of python, but I make no such guarantee. ;)

        # You may have to use `python3` instead of `python`.
        python tools/install.py
        ```

    The above does the following:

    - Installs the latest stable version of the note
    - Installs the fonts required for the note

    If the above made no sense to you,
    or you just want to install this normally,
    see the second option below.


??? info "Option 2: The Manual Way *(click here)*"


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

    ![type:video](assets/anki/manual_import-0.9.1.1.mp4)


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
    If the fonts still don't match, the note was likely installed with "Option 2: The Manual Way".
    Please verify you manually installed the fonts and placed them in the correct folder
    (see steps 3 and 4).

    {{ img("test", "assets/info_circle.png", 'align=right') }}

1. Notice how at the top left corner, the info circle (the "i" encased within the circle)
    is the default grey color.

    If this circle is red or orange, there may be something wrong with the template.
    Please see [this](faq.md#errors-warnings){:target="_blank"} section for basic troubleshooting.

1. Clicking on the image to zoom should work out of the box.

    Kanji hover may not work yet. If it doesn't work,
    read the Anki-Connect setup instructions on the next page.

1. If the furigana on your card seems to appear higher above the kanji compared to the picture,
    see the [Fix Ruby Positioning](ui.md#fix-ruby-positioning-for-legacy-anki-versions) option.


---

# Anki Setup

This note requires some additional setup to Anki.
In particular, some add-ons are required for the note to work.

[Click here see how to setup Anki!](setupanki.md){ .md-button }

