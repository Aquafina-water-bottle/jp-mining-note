
# Overview

A full sentence mining workflow requires two main parts:

1. Text to make the cards from.
1. The card exporter, to create cards from the text.
    * And optionally, the image and sentence audio from the media (if the media has either).

This page is dedicated to providing the
<span class="text-yellow">**minimal setup**</span>
to create cards with this note type (part two),
on PC.

Part one (getting the text)
and the optional part of part two (getting the image and sentence audio)
are not documented on this page;
they instead documented under the [Setup: Everything Else](setupeverythingelse.md)
page.


---


# Prerequisites
It is highly recommend that you are using the latest Anki version
(or as close as you can get to the latest Anki version), as the note is primarily tested
and maintained on the latest versions of Anki.
Additionally, it is recommended to use the Qt6 version of Anki if possible.

!!! note
    Worst case scenario, if any essential add-ons no longer work,
    you can always downgrade back to your current version.

Similarly, if you downloaded Yomichan from a file, try updating that as well.
(Most users should have installed it from their browser's extension page, in which case
nothing has to be done).

Finally, notice that this website contains a search bar!
If you have a problem at any point, you might find the solution by searching for it.

---



# Installing the Card
There are two ways of installing the card:


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
        - `File` (top left corner) →  `Import...`
    3. By default, the custom fonts do not come with the `.apkg` file.
        To install these fonts, head over to this repository's
        [media folder](https://github.com/Aquafina-water-bottle/jp-mining-note/tree/master/media)
        and download the 4 `.otf` files.
    4. Move the `.otf` files into the [media folder](faq.md#where-is-the-x-folder-in-anki){:target="_blank"}
        of your profile (`Anki2/PROFILENAME/collections.media`).

    ![type:video](assets/anki/manual_import-0.9.1.1.mp4)



## Verifying the Note Works
You should see a deck `JPMN-Examples` in your collection.
View one of the cards and make sure the card looks similar to the one below:

=== "Dark Theme"

    {{ img("Example card", "assets/eg_fushinnsha.png") }}

=== "Light Theme"

    {{ img("Example light theme card", "assets/eg_fushinnsha_light.png") }}

Please check the following in particular:

1. The fonts should match with the above example.

    If the fonts don't match, the note was likely installed with "Option 2: The Manual Way".
    Please verify you manually installed the fonts and placed them in the correct folder
    (see steps 3 and 4).

    {{ img("test", "assets/info_circle.png", 'align=right') }}

1. Notice how at the top left corner, the info circle (the "i" encased within the circle)
    is the default grey color.

    If this circle is red or orange, there is likely something wrong with the template.
    Please see [this](faq.md#errors-warnings){:target="_blank"} section for basic troubleshooting.

1. Clicking on the image to zoom should work out of the box.
    Kanji hover may not work yet. If it doesn't work,
    read the Anki-Connect setup instructions below.

1. If the furigana on your card seems to appear higher above the kanji compared to the picture,
    this is likely because you are using the older Qt5 version of Anki.
    Unfortunately, as this seems like a quirk of Qt5, there does not seem to be a way to fix it
    outside of upgrading Anki from a Qt5 version to a Qt6 version.


---

# Anki Setup

## Updating Anki
If you are updating Anki from an older version, this section aims to give some
general tips on updating Anki.
If you aren't upgrading Anki from an older version, you can skip this section.

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


## Dark Mode
Although light mode is supported, the recommended theme for this note is dark mode.

The note automatically adjusts according to Anki's theme.
To change Anki's theme, head over to:
> `Tools` →  `Preferences` →  `Basic` →  `Theme (dropdown)`


{{ img("install Anki addons", "assets/anki/dark_mode.png") }}


<br>

## Anki Add-ons
There are certain add-ons that must be installed for this note type to work.

<!--
There are also certain add-ons that will **not** be supported by this note type.
Please disable them and restart Anki before continuing.
-->

### Conflicting Add-ons
There are no conflicting add-ons, since I'm not aware of any currently.
Let me know if you find one!


### Downloading Add-ons
To download an add-on, copy the add-on's code, and navigate to the following to paste the code: <br>
> `Tools` →  `Add-ons` →  `Get Add-ons...`

{{ img("install Anki addons", "assets/anki/addons_install.png") }}

<br>

## Required Anki Add-ons

### [Anki-Connect](https://ankiweb.net/shared/info/2055492159)

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
    disable them in the [runtime options](runtimeoptions.md){:target="_blank"}.

<br>

## Optional Add-ons
These are a set of optional, but useful add-ons that can easily work with the card.
If this is your first time here, I recommend skimming through the descriptions
and choosing the add-ons that seem appealing for you.

!!! note
    Make sure to head over to the [final steps](setup.md#final-steps) section afterwards!


<br>


### [CSS Injector](https://ankiweb.net/shared/info/181103283)

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




### [AJT Furigana](https://ankiweb.net/shared/info/1344485230)

> Code: `1344485230`

Alternative and up-to-date version of JapaneseSupport.
Automatically generates furigana upon Yomichan card creation.

This add-on is optional, because the card will simply show the sentence without
furigana (on hover) if there is no furigana generated sentence.

#### Config Changes

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



#### Additional Info
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

### [AJT Pitch Accent](https://ankiweb.net/shared/info/1225470483)

> Code: `1225470483`

Automatically adds pitch accent info given the word.

For the purposes of the card,
the only purpose that this add-on serves is the following:

- Adds devoiced and nasal information to the existing reading.
- If your Yomichan pitch accent dictionaries did not contain any pitch accent info for the word
  but the add-on does, then it will use the add-on data.


#### Config Changes
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

<br>



## Final Steps
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

# Yomichan Setup
[Yomichan](https://github.com/FooSoft/yomichan)
is the main program that will create the cards. You can download Yomichan as a Firefox extension
or under the Chrome web store.

This section will go over the minimal Yomichan setup to work with this card type.

**If you have never used Yomichan before**, please see
[this page](https://learnjapanese.moe/yomichan/) first to get it working.


## Preliminary Steps
If you have used Yomichan before, please make a
[backup of your settings](faq.md#how-do-i-backup-yomichan-settings){:target="_blank"}
(just in case).


## Yomichan Fields
To edit the fields that Yomichan will automatically fill out, do the following:

![type:video](assets/yomichan/yomichan_anki_format.mp4)

1. Navigate to Yomichan Settings.
1. Go to the `Anki` section.
1. Select `Anki card format...`.
1. Set "Model" as `JP Mining Note`.
1. Copy and paste the following values into the fields
   (the custom markers won't be available in the dropdown arrow):


??? example "Click here to see the fields to copy and paste."

    | Anki Fields | Yomichan Format |
    |-------------|-----------------|
    {% for f, v in FIELDS.items() -%}
    | {{ "*" if v["customize"] else "" }}{{ f }} { .smaller-table-row } | {{ "`" + v["setup"] + "` { .smaller-table-row }" if "setup" in v else "" }} |
    {% endfor %}



The above fields will create, by default,
a basic **vocab card** in **bilingual format**,
with all other definitions in collapsable fields.

!!! note
    Anything field marked with `*` are binary fields, and
    **should be configured to each user's personal preferences.**
    To change the default value of any of the fields, simply fill
    the field in within the aforementioned `Anki card format...` section.

The custom markers like `{jpmn-primary-definition}` is not provided by Yomichan by default.
See the section below to make these markers usable.

<br>



## Yomichan Templates
Yomichan supports user inserted template code that allows the automatic
separation of bilingual and monolingual dictionary definitions, custom stylization, etc.
This note type makes heavy use of these custom templates.

To make the new markers usable, do the following:

![type:video](assets/yomichan/import_yomichan_templates.mp4)

1. Navigate to Yomichan Settings.
1. Make sure that advanced settings are turned on (bottom left corner).
1. Go to the `Anki` section
1. Select `Configure Anki card templates...`
1. If you have existing template code already, I highly recommend
   **resetting the templates** (bottom right corner, red button)
   unless you know exactly what you are doing.

After resetting the templates,
**without** removing any of the existing template code,
add the following template code as follows:

1. Copy and paste the code below to the **top** of the default Yomichan template code:

    ??? examplecode "Click here to show the template code to copy."

        ```handlebars
        {% filter indent(width=8) -%}
        {{ TOP_YOMICHAN }}
        {% endfilter %}
        ```

2. Copy and paste the code below to the **bottom** of the default Yomichan template code:

    ??? examplecode "Click here to show the template code to copy."

        ```handlebars
        {% filter indent(width=8) -%}
        {{ BOTTOM_YOMICHAN }}
        {% endfilter %}
        ```

## Make an example card!
At this point, you should be able to make cards with Yomichan!

??? example "Click here to show some example Japanese sentences."

    「や、いらっしゃい。ま、毒を食らわば皿までって言うしね。あ、違うか。乗り掛かった船？」
    { .jp-quote-text }

    「なによぅ…甲斐甲斐しく会いに来た女に対して、最初に言うセリフがそれ？」
    { .jp-quote-text }

    「あの時逃げ出した私の罰…あの時の汚辱は今ここで、全部そそいでやるんだ…」
    { .jp-quote-text }

    「貴方なんなんです？なにか、妙に銃口慣れしていますね…若者特有の空威張りという訳でもなさそうですし…」
    { .jp-quote-text }

{{ img("adding a card with Yomichan", "assets/yomichan/add_card.gif") }}

Obviously, just Yomichan alone doesn't fill every field.
Notably, the picture and sentence audio is missing.

Outside of that, there are some final settings you can adjust within the Yomichan templates
if the card doesn't look quite right.

<br>


## Yomichan Templates Options

### Monolingual Definition
<i><sup>Main page: [Yomichan Template Options (Categorization of Dictionaries)](yomichantemplates.md#categorization-of-dictionaries)</sup></i>

If you want the first definition you see (the `PrimaryDefinition` field) to be monolingual,
change the following line at the top of the templates code:

{% raw %}
```handlebars
{{~#set "opt-first-definition-type" "bilingual"}}{{/set~}}
```
to
```handlebars
{{~#set "opt-first-definition-type" "monolingual"}}{{/set~}}
```
{% endraw %}


!!! note

    If you are using monolingual dictionaries, on your first few cards,
    please check that your dictionaries are in the expected places.
    Extra bilingual definitions should be under `Secondary Definition`,
    and extra monolingual definitions should be under `Extra Definitions`.

    If your dictionaries are ending up in the wrong sections,
    then it is likely a problem with how the template code categorizes the dictionaries.
    See [here](yomichantemplates.md#categorization-of-dictionaries){:target="_blank"} for more info.


### Selected Text as the Definition
<i><sup>Main page: [Yomichan Template Options (Selected Text)](yomichantemplates.md#selected-text)</sup></i>


If you want to select the text to use instead of the definition,
simply set `opt-selection-text-enabled` to `true`.

![type:video](assets/yomichan/selected_text.mp4)

By default, this enable the following behavior:

1. If nothing is selected, then the first dictionary is chosen just like normal.
1. If a dictionary is selected, then that dictionary will replace the first definition.
1. If a section of text is selected, then that dictionary will replace the first definition.
    Additionally, that section of text will be highlighted (bolded).

!!! note
    Selecting parts of a definition to bold the text does not always work,
    especially when used across text with formatting or newlines.
    See [this](yomichantemplates.md#overriding-the-definition){:target="_blank"} for more details.

    With this being said, selecting the dictionary should always work.

---





# Other

## Yomichan Appearance
If you want to follow my exact Yomichan popup appearance, set the following
under (Yomichan settings) →  `Popup Appearance`:

* Set `Compact glossaries` to ON.
* Set `Compact tags` to OFF.

There are also plenty of css customizations for Yomichan listed out
in the [various resources page](jpresources.md){:target="_blank"}.

## JMdict
If you are planning on using the JMdict dictionary,
the ones provided from most sources
(TMW's google drive, Matt's video on Yomichan, and Yomichan's main github page)
are all somewhat outdated, which usually means less accurate definitions and less coverage.

To get the most recent version of JMdict,
download it from the
[official site](https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project)
and using [yomichan-import](https://github.com/FooSoft/yomichan-import)
to get the latest JMdict version available.

If you don't want to compile it from source, I provide a download link
[here](https://github.com/Aquafina-water-bottle/jmdict-english-yomichan),
which should only be a few months stale at most.

<!-- TODO github actions to re-compile it daily -->


## JMdict Surface Forms
[(Link)](https://github.com/FooSoft/yomichan/issues/2183)

This is a dictionary placed in the `UtilityDictionaries` field by default.
Although I don't use it when studying Anki, it helps to use this when creating Anki notes
for monolingual definitions.
See [this section](jpresources.md#orthographic-variants-fix-sentence-and-frequency){:target="_blank"}
for more information.


## Additional Anki add-on(s)
These add-on(s) assist in card creation, but are ultimately optional.

* Paste Images As WebP [(link)](https://ankiweb.net/shared/info/1151815987)


## Separate Pitch Accent Deck
If you want card types to go to a different deck by default, you can change it by doing the following:

??? example "Click here to reveal instructions"

    `Browse` (top middle) <br>
    →  `Cards...` (around the middle of the screen, right above first field of the note. This is NOT the `Cards` dropdown menu at the top right corner) <br>
    →  `Card Type` dropdown (top of the screen) <br>
    →  (choose pitch accent card type) <br>
    →  `Options` (the first `Options` you see at the very top of the screen) <br>
    →  `Deck Override...`

---



# Enjoy your new one-click cards!

If you've made it this far, then congratulations!
Most fields of the cards have been automatically filled out, just from Yomichan alone!

If you already have a sentence mining workflow set up,
outside of some potentially minor tweaks to your current workflow (i.e. to match the field names),
**you are now finished**!
All that's left is understanding how to use and edit the card itself.
See the [User Interface](ui.md) and [Usage](usage.md) pages to see exactly that.



# Wait! I don't have a workflow setup yet!

If you're new to sentence mining, there are likely some things things
that you would like to set up. These include:

1. Getting the actual text to use Yomichan on.
1. Getting the pictures and/or sentence audio from the media into the card.

Head over to the [Setup: Everything Else](setupeverythingelse.md) page to see exactly that.


