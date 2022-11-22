
# Updating Anki

It is highly recommended that you are using the latest
[Anki version](faq.md#how-do-i-see-the-version-of-anki)
(or as close as you can get to the latest Anki version).
This includes using the Qt6 version instead of Qt5 if possible.

Using the latest version of Anki is recommended for the following reasons:

* The note is primarily tested and maintained on the latest versions of Anki.
* There are a few minor but known bugs that this note type has with older Anki versions.
    These bugs do not exist in newer Anki versions.

Worst case scenario, if any essential add-ons no longer work,
**you can always downgrade back** to your current version.

If you aren't upgrading Anki from an older version,
you can skip the rest of this section.

??? example "Tips on Updating Anki *(click here)*"

    <h4>Official Documentation</h4>

    The official documentation on how to install and upgrade Anki is shown below:

    > [Windows](https://docs.ankiweb.net/platform/windows/installing.html)・[MacOS](https://docs.ankiweb.net/platform/mac/installing.html)・[Linux](https://docs.ankiweb.net/platform/linux/installing.html)

    Note that for all three, there are additional sections in the table of contents to the left
    that could be helpful.


    <h4>Add-ons Breaking</h4>

    If an add-on (that worked in a previous version of Anki) no longer works, you have a few options you can try:

    - As a sanity check, click the `Check for Updates` button on Anki's `Addons` window.
    - Check that the add-on supports the current version of Anki in the official AnkiWeb page.
        If the page says that the current Anki version is supported,
        try reinstalling it again from AnkiWeb.

        Occasionally, the `Check for Updates` button doesn't properly work,
        so this method ensures that your addon is actually updated.

---


# Dark Mode
Although light mode is supported, the recommended theme for this note is dark mode.

The note automatically adjusts according to Anki's theme.
To change Anki's theme, head over to:
> `Tools` →  `Preferences` →  `Basic` →  `Theme (dropdown)`


{{ img("install Anki addons", "assets/anki/dark_mode.png") }}

!!! note
    The note's theme currently cannot be forced to be a particular
    theme without changing Anki's settings.


---

# Anki Add-ons
There are certain add-ons that must be installed for this note type to work.

<!--
There are also certain add-ons that will **not** be supported by this note type.
Please disable them and restart Anki before continuing.
-->

## Conflicting Add-ons
There are no conflicting add-ons, since I'm not aware of any currently.
Let me know if you find one!

## Downloading Add-ons
To download an add-on, copy the add-on's code, and navigate to the following to paste the code: <br>
> `Tools` →  `Add-ons` →  `Get Add-ons...`

{{ img("install Anki addons", "assets/anki/addons_install.png") }}

---

# Required Add-ons

## [Anki-Connect](https://ankiweb.net/shared/info/2055492159)

> Code: `2055492159`

Required for Yomichan and most other Anki-related automated tasks to work.
I use the default config that comes with the add-on.

!!! note "Note for Anki versions 2.1.49 and below"

    Anki versions 2.1.49 and below require a hack to the Anki-Connect
    config for certain features within the card to work.
    In particular, Anki-Connect is used for the "Kanji Hover" feature and the
    "Open Fields on New Card" feature.

    To make those features work,
    add `"null"` to the `webCorsOriginList` list in the Anki-Connect config file.
    An example of how the config should look is shown below:

    ```
    "webCorsOriginList": [
        "http://localhost",
        "null"
    ]
    ```

    Of course, this [isn't very safe](https://w3c.github.io/webappsec-cors-for-developers/#avoid-returning-access-control-allow-origin-null)
    and it is highly recommended that you upgrade Anki to avoid this problem.

    If you aren't interested in those features, you can skip this step and
    disable them in the {{ RTO_FILE }}.

---

# Optional Add-ons
These are a set of optional, but useful add-ons that can easily work with the card.
If this is your first time here, I recommend skimming through the descriptions
and choosing the add-ons that seem appealing for you.

!!! note
    Make sure to head over to the [final steps](setupanki.md#final-steps-after-installing-add-ons) section afterwards!


<br>


## [CSS Injector](https://ankiweb.net/shared/info/181103283)

> Code: `181103283`

I *strongly* recommend using this, because
if you don't use this, the fields within the Anki field editor
won't have certain stylizations that makes the field actually interpretable.

{{ img("CSS Injector comparison", "assets/css_injector.png") }}

There are two ways of using css injector with this note type:



{% set css_injector_preliminary %}
As a preliminary step, you will have to remove the empty `field.css` and `editor.css` files
that comes with the add-on.
That can be done through command line (below), or you can simply navigate to the
`Anki2/addons21/181103283/user_files` folder
(within the [addons folder](faq.md#where-is-the-x-folder-in-anki){:target="_blank"})
and delete both `css` files.
{% endset %}



??? info "Option 1: Automatically updates with the card (recommended)"

    === "Windows"
        {% filter indent(8) -%}
        {{ css_injector_preliminary }}
        {% endfilter %}

        ```bat
        :: be sure to change USERNAME to your computer username!

        del "C:\Users\USERNAME\AppData\Roaming\Anki2\addons21\181103283\user_files\field.css"
        del "C:\Users\USERNAME\AppData\Roaming\Anki2\addons21\181103283\user_files\editor.css"
        ```

        Afterwards, open command prompt with elevated permissions.

        !!! note
            Be sure to open command prompt, and not PowerShell.
            If you've never used command prompt before, see
            [this](https://www.howtogeek.com/194041/how-to-open-the-command-prompt-as-administrator-in-windows-8.1/).

        With command prompt opened, run the following command:

        ```bat
        :: be sure to change USERNAME to your computer username and PROFILENAME to your Anki profile.
        :: There are **two** USERNAME's to replace, and **one** PROFILENAME to replace
        :: in the commands below.
        :: Make sure to replace all the fields!

        mklink "C:\Users\USERNAME\AppData\Roaming\Anki2\addons21\181103283\user_files\field.css" "C:\Users\USERNAME\AppData\Roaming\Anki2\PROFILENAME\collection.media\_field.css"
        mklink "C:\Users\USERNAME\AppData\Roaming\Anki2\addons21\181103283\user_files\editor.css" "C:\Users\USERNAME\AppData\Roaming\Anki2\PROFILENAME\collection.media\_editor.css"
        ```

    === "MacOS"
        {% filter indent(8) -%}
        {{ css_injector_preliminary }}
        {% endfilter %}

        ```bash
        rm "~/Library/Application Support/Anki2/addons21/181103283/user_files/field.css"
        rm "~/Library/Application Support/Anki2/addons21/181103283/user_files/editor.css"
        ```

        Afterwards, run the following command:
        ```bash
        # be sure to change `PROFILENAME` to your Anki profile
        ln -s "~/Library/Application Support/Anki2/PROFILENAME/collection.media/_field.css" "~/Library/Application Support/Anki2/addons21/181103283/user_files/field.css"
        ln -s "~/Library/Application Support/Anki2/PROFILENAME/collection.media/_editor.css" "~/Library/Application Support/Anki2/addons21/181103283/user_files/editor.css"
        ```

    === "Linux"
        {% filter indent(8) -%}
        {{ css_injector_preliminary }}
        {% endfilter %}

        ```bash
        rm "~/.local/share/Anki2/addons21/181103283/user_files/field.css"
        rm "~/.local/share/Anki2/addons21/181103283/user_files/editor.css"
        ```

        Afterwards, run the following command:
        ```bash
        # be sure to change `PROFILENAME` to your Anki profile
        ln -s "~/.local/share/Anki2/PROFILENAME/collection.media/_field.css" "~/.local/share/Anki2/addons21/181103283/user_files/field.css"
        ln -s "~/.local/share/Anki2/PROFILENAME/collection.media/_editor.css" "~/.local/share/Anki2/addons21/181103283/user_files/editor.css"
        ```


??? info "Option 2: Manually without respecting updates"

    1. Navigate to css injector [addon folder](faq.md#where-is-the-x-folder-in-anki){:target="_blank"}
        (`Anki2/addons21/181103283/user_files`)
    2. Remove the existing `field.css` and `editor.css` files
    3. Copy the `_field.css` file and `_editor.css` file
        (found under your profile's [media folder](faq.md#where-is-the-x-folder-in-anki){:target="_blank"})
        into the css injector add-on directory.
    4. Rename `_field.css` to `field.css`.
    4. Rename `_editor.css` to `editor.css`.

    !!! note

        If either of the two css files ever update,
        you will have to manually copy and rename the file again.

<br>




## [AJT Furigana](https://ankiweb.net/shared/info/1344485230)

> Code: `1344485230`

Alternative and up-to-date version of JapaneseSupport.
Automatically generates furigana upon Yomichan card creation.

This add-on is optional, because the card will simply show the sentence without
furigana (on hover) if there is no furigana generated sentence.

### Config Changes

The config of the add-on must be changed to work with this note.

To change the config of any Anki add-on, head over to:

> `Tools` →  `Add-ons` →  (select the add-on) →  `Config`.

??? examplecode "Click here to see the full AJT Furigana config"

    The important things to change in the config are:

    * `generate_on_note_add`
    * `fields`
    * `note_types`

    ```json
    {
        "context_menu": {
            "generate_furigana": true,
            "generate_furigana_no_kanji": true,
            "to_hiragana": true,
            "to_katakana": true
        },
        "fields": [ // (1)!
            {
                "destination": "SentenceReading",
                "source": "Sentence"
            }
        ],
        "furigana_suffix": " (furigana)",
        "generate_on_note_add": true, // (2)!
        "note_types": [ // (3)!
            "jp"
        ],
        "skip_numbers": false,
        "skip_words": "",
        "toolbar": {
            "clean_furigana_button": {
                "enable": false,
                "shortcut": "Alt+u",
                "text": "削"
            },
            "furigana_button": {
                "enable": false,
                "shortcut": "Alt+o",
                "text": "振"
            }
        }
    }
    ```

    1.  We change the field names to match this note type.

    2.  This ensures that the pitch accent is added upon initial note creation.
        Note that this is technically optional.
        If you are likely to change the sentence after adding the note,
        then it is possible to leave this as `false`,
        and bulk add the furigana later.

    3.  Similarly to the `fields` change, we change this to properly detect this note type.



### Additional Info
Furigana generation is occasionally incorrect,
so if you plan on using furigana regularly, you should double-check the readings
to make sure they are correct.

??? info "JapaneseSupport v.s. AJT Furigana"

    If you use [JapaneseSupport](https://ankiweb.net/shared/info/3918629684), bolded words and other styles within a field
    are not transferred over from the original field to the reading field.
    Additionally, JapaneseSupport does not have an option to automatically add
    the reading upon card creation.
    AJT Furigana supports both of those of those features.



<br>

## [AJT Pitch Accent](https://ankiweb.net/shared/info/1225470483)

> Code: `1225470483`

Automatically adds pitch accent info given the word.

For the purposes of the card,
the only purpose that this add-on serves is the following:

- Adds devoiced and nasal information to the existing reading.
- If your Yomichan pitch accent dictionaries did not contain any pitch accent info for the word
  but the add-on does, then it will use the add-on data.


### Config Changes
Like with AJT Furigana, the config of the add-on must be changed to work with this note.


??? examplecode "Click here to see the full AJT Pitch Accent config"

    The important things to change in the config are:

    * `generate_on_note_add`
    * `destination_fields`
    * `source_fields`
    * `note_types`
    * `styles`


    ```json
    {
        "destination_fields": [
            "AJTWordPitch"
        ],
        "generate_on_note_add": true, // (1)!
        "kana_lookups": true,
        "lookup_shortcut": "Ctrl+8",
        "note_types": [
            "jp"
        ],
        "regenerate_readings": false,
        "skip_words": "へ,か,よ,ん,だ,び,の,や,ね,ば,て,と,た,が,に,な,は,も,ます,から,いる,たち,てる,う,ましょ,たい,です",
        "source_fields": [
            "Word"
        ],
        "styles": { // (2)!
            "&#42780;": "<span class=\"downstep\"><span class=\"downstep-inner\">&#42780;</span></span>",
            "class=\"overline\"": "style=\"text-decoration:overline;\" class=\"pitchoverline\""
        },
        "use_hiragana": false,
        "use_mecab": true
    }
    ```

    1.  We change `generate_on_note_add` and `note_types` for the exact same reasons as the
        AJT Furigana Config section.
        The `destination_fields` and `source_fields` options are changed similarily to the
        `fields` option in the AJT Furigana Config section.

    2. `styles` adds custom stylization that creates the pitch accent lines and downsteps as you see
        in the example note.
        Without this, the default styles will look like the word
        you see in the official add-on page.

---



# Final Steps: After Installing Add-ons
After the above setup, **make sure to restart Anki** for the add-ons and config changes to take effect.
If the css injector add-on is installed correctly, your Anki field editor should now have color!

Additionally, now that Anki-Connect is installed, kanji hover should also be functioning.
Hover over a kanji within the word reading to make sure that a popup appears.
In particular, the 者 kanji in the example 偽者 and 不審者 cards should point to each other.


---


# Transfer Existing Notes
If you wish to transfer existing cards into this note type,
please see [this page](importing.md){:target="_blank"}.

---



# Updating the Note
If you wish to update the note, follow the steps in [this page](updating.md){:target="_blank"}.

Be assured that this note doesn't auto-update,
and you have to manually update the note if you want it to update.


---

# Setting up Yomichan

Of course, you can have an Anki template, but what's the point of it
if you can't make cards with it?

We will use Yomichan to create these cards.

[Click here see how to setup Yomichan!](setupyomichan.md){ .md-button }





