
# New to Anki?

If you have never used Anki before, I recommend using
[fsrs4anki](https://github.com/open-spaced-repetition/fsrs4anki)
to get more optimized settings than the default settings.

That article showcases only one way of setting up Anki's settings for language learning.
Feel free to view some other examples [here](setupother.md#various-anki-resources).

---


# Updating Anki

It is highly recommended that you are using the latest (stable)
[Anki version](faq.md#how-do-i-see-the-version-of-anki)
(or as close as you can get to the latest Anki version).
This includes using the Qt6 version instead of Qt5 if possible.

Using the latest version of Anki is recommended for the following reasons:

* The note is primarily tested and maintained on the latest versions of Anki.
* There are a few minor but known bugs that this note type has with older Anki versions.
    These bugs do not exist in newer Anki versions.

Worst case scenario, if any essential add-ons no longer work,
**you can always downgrade back** to a previous version.

If you aren't upgrading Anki from an older version,
you can skip the rest of this section.

??? example "Tips on Updating Anki <small>(click here)</small>"

    **Official Documentation**:

    -   The official documentation on how to install and upgrade Anki is shown below:

        > [Windows](https://docs.ankiweb.net/platform/windows/installing.html)・[MacOS](https://docs.ankiweb.net/platform/mac/installing.html)・[Linux](https://docs.ankiweb.net/platform/linux/installing.html)

        Note that for all three, there are additional sections in the table of contents to the left
        that could be helpful.


    **Add-ons Breaking**:

    -   If an add-on (that worked in a previous version of Anki) no longer works, you have a few options you can try:

        - As a sanity check, click the `Check for Updates` button on Anki's `Addons` window.
        - Check that the add-on supports the current version of Anki in the official AnkiWeb page.
            If the page says that the current Anki version is supported,
            try reinstalling it again from AnkiWeb.

            Occasionally, the `Check for Updates` button doesn't properly work,
            so this method ensures that your addon is actually updated.

---


# Enable Animations
Starting Anki 2.1.61, animations are disabled by default.
The note works best with animations enabled.
To enable animations, head over to:
> `Tools` →  `Preferences` →  `Appearance` →  `Reduce Motion` →  `(unchecked)`

!!! note
    The reason why animations are disabled by default is to workaround an internal
    Anki bug. In the future, animations will be enabled by default again. [^1]

[^1]:  [https://forums.ankiweb.net/t/reduce-motion-affecting-card-templates-bug-or-intentional/28973](https://forums.ankiweb.net/t/reduce-motion-affecting-card-templates-bug-or-intentional/28973)


---


# Fixing your Editor Fonts

By default, your editor fonts may not show Japanese characters correctly.

- TODO test on 直す card
- TODO link to TheMoeWay
- TODO batch command: `set_fonts_to_key_font`


---


# Dark Mode
Although light mode is supported, the recommended theme for this note is dark mode.
With that being said, changing the theme is completely optional.

The note automatically adjusts according to Anki's theme.
To change Anki's theme, head over to:
> `Tools` →  `Preferences` →  `Basic` →  `Theme (dropdown)`


{{ img("install Anki addons", "assets/setupanki/dark_mode.png") }}

!!! note
    The note's theme currently cannot be forced to be a particular
    theme without changing Anki's settings.


---

# Anki Add-ons
There are certain add-ons that must be installed for this note type to work.


## Downloading Add-ons
To download an add-on, copy the add-on's code, and navigate to the following to paste the code: <br>
> `Tools` →  `Add-ons` →  `Get Add-ons...`

{{ img("install Anki addons", "assets/setupanki/addons_install.png") }}

---

# Required Add-ons

## [Anki-Connect](https://ankiweb.net/shared/info/2055492159)

> Code: `2055492159`

Required for Yomichan and most other Anki-related automated tasks to work.
I use the default config that comes with the add-on.

If you installed JPMN Manager, you likely already have this installed.

??? note "Note for Anki versions 2.1.49 and below {{CLICK_HERE}}"

    This is left for legacy purposes, because jp-mining-note
    no longer officially supports versions 2.1.49 or below.

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



## [CSS Injector](https://ankiweb.net/shared/info/181103283)

> Code: `181103283`

<!--
## CSS Injector

> Code: (N/A, offline download. See below for more details.)
-->

I *strongly* recommend using this, because
if you don't use this, the fields within the Anki field editor
won't have certain stylizations that makes the field actually interpretable.

{{ img("CSS Injector comparison", "assets/setupanki/css_injector.png") }}

<!--
!!! note
    As of writing this (2023/02/06), the author has still not updated their add-on
    to work with Anki versions 2.1.55 and over.
    Therefore, these set of instructions are for an offline version
    that has a hotfix applied from
    [this PR](https://github.com/kleinerpirat/anki-css-injector/pull/3),
    until the author finally decides to update his add-on.

To download this add-on, head over to [this page](https://github.com/Aquafina-water-bottle/anki-css-injector/releases/tag/v2023-02-06.1),
and download the `2023-02-06_anki-css-injector.ankiaddon` file.
From there, head over to Anki, and navigate to the following: <br>
> `Tools` →  `Add-ons` →  `Install from file...`
-->


There are two ways of using css injector with this note type:

{#{% set css_injector_addon_id %}anki_css_injector{% endset %}#}
{% set css_injector_addon_id %}181103283{% endset %}


{% set css_injector_preliminary %}
As a preliminary step, you will have to remove the empty `field.css` and `editor.css` files
that comes with the add-on.
That can be done through command line (below), or you can simply navigate to the
`Anki2/addons21/{{css_injector_addon_id}}/user_files`
folder
(within the [addons folder](faq.md#where-is-the-x-folder-in-anki))
and delete both `css` files.
{% endset %}



??? info "Option 1: Automatically updates with the card (recommended)"

    === "Windows"
        {% filter indent(8) -%}
        {{ css_injector_preliminary }}
        {% endfilter %}

        ```bat
        :: be sure to change USERNAME to your computer username!

        del "C:\Users\USERNAME\AppData\Roaming\Anki2\addons21\{{css_injector_addon_id}}\user_files\field.css"
        del "C:\Users\USERNAME\AppData\Roaming\Anki2\addons21\{{css_injector_addon_id}}\user_files\editor.css"
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

        mklink "C:\Users\USERNAME\AppData\Roaming\Anki2\addons21\{{css_injector_addon_id}}\user_files\field.css" "C:\Users\USERNAME\AppData\Roaming\Anki2\PROFILENAME\collection.media\_field.css"
        mklink "C:\Users\USERNAME\AppData\Roaming\Anki2\addons21\{{css_injector_addon_id}}\user_files\editor.css" "C:\Users\USERNAME\AppData\Roaming\Anki2\PROFILENAME\collection.media\_editor.css"
        ```

    === "MacOS"
        {% filter indent(8) -%}
        {{ css_injector_preliminary }}
        {% endfilter %}

        ```bash
        rm "$HOME/Library/Application Support/Anki2/addons21/{{css_injector_addon_id}}/user_files/field.css"
        rm "$HOME/Library/Application Support/Anki2/addons21/{{css_injector_addon_id}}/user_files/editor.css"
        ```

        Afterwards, run the following command:
        ```bash
        # be sure to change `PROFILENAME` to your Anki profile
        ln -s "$HOME/Library/Application Support/Anki2/PROFILENAME/collection.media/_field.css" "$HOME/Library/Application Support/Anki2/addons21/{{css_injector_addon_id}}/user_files/field.css"
        ln -s "$HOME/Library/Application Support/Anki2/PROFILENAME/collection.media/_editor.css" "$HOME/Library/Application Support/Anki2/addons21/{{css_injector_addon_id}}/user_files/editor.css"
        ```

    === "Linux"
        {% filter indent(8) -%}
        {{ css_injector_preliminary }}
        {% endfilter %}

        ```bash
        rm "$HOME/.local/share/Anki2/addons21/{{css_injector_addon_id}}/user_files/field.css"
        rm "$HOME/.local/share/Anki2/addons21/{{css_injector_addon_id}}/user_files/editor.css"
        ```

        Afterwards, run the following command:
        ```bash
        # be sure to change `PROFILENAME` to your Anki profile
        ln -s "$HOME/.local/share/Anki2/PROFILENAME/collection.media/_field.css" "$HOME/.local/share/Anki2/addons21/{{css_injector_addon_id}}/user_files/field.css"
        ln -s "$HOME/.local/share/Anki2/PROFILENAME/collection.media/_editor.css" "$HOME/.local/share/Anki2/addons21/{{css_injector_addon_id}}/user_files/editor.css"
        ```


??? info "Option 2: Manually without respecting updates"

    1. Navigate to css injector [addon folder](faq.md#where-is-the-x-folder-in-anki)
        (`Anki2/addons21/{{css_injector_addon_id}}/user_files`)
    2. Remove the existing `field.css` and `editor.css` files
    3. Copy the `_field.css` file and `_editor.css` file
        (found under your profile's [media folder](faq.md#where-is-the-x-folder-in-anki))
        into the css injector add-on directory.
    4. Rename `_field.css` to `field.css`.
    4. Rename `_editor.css` to `editor.css`.

    !!! note

        If either of the two css files ever update,
        you will have to manually copy and rename the file again.




## [AJT Japanese](https://ankiweb.net/shared/info/1344485230)

> Code: `1344485230`

!!! warning
    As of writing this (2023/04/28), AJT Japanese is only guaranteed to work on
    Anki versions 2.1.60 and above, because it is no longer maintained on previous versions.
    If you are using an older version of Anki, please update Anki or do not use this add-on.

This is an add-on that automatically adds furigana and pitch accents to
cards upon Yomichan card creation.
Previously known as `AJT Furigana`, and now comes packaged with `AJT Pitch Accent`.

If this add-on is not used, then the following features will be missing:

- Automatically generated furigana
- Devoiced and nasal information to pitch accents
- Less coverage on pitch accents
    - If your Yomichan pitch accent dictionaries did not contain any pitch accent info for the word
      but the add-on does, then it will use the add-on data.
      This will likely happen for expressions containing more than one word.
      Fortunately, AJT Japanese can usually detect the existence of multiple words,
      and add the pitch accent for each individual word.

### Config Changes

The config of the add-on must be changed to work with this note.

To change the config of any Anki add-on, head over to:

> `Tools` →  `Add-ons` →  (select the add-on) →  `Config`.

An example config is shown below that you can copy/paste.

??? examplecode "Click here to see the full AJT Japanese config"

    The important things to change in the config are:

    * `generate_on_note_add`
    * `fields`
    * `profiles`
    * `pitch_accent.reading_separator`
    * `pitch_accent.word_separator`
    * `pitch_accent.maximum_results`

    ```json
    {
      "generate_on_note_add": true, // (1)!
      "regenerate_readings": false,
      "cache_lookups": 1024,
      "last_file_save_location": "",
      "styles": { // (2)!
          "&#42780;": "<span class=\"downstep\"><span class=\"downstep-inner\">&#42780;</span></span>",
          "class=\"overline\"": "style=\"text-decoration:overline;\" class=\"pitchoverline\""
      },
      "profiles": [ // (3)!
        {
          "name": "Add furigana for sentence",
          "note_type": "JP Mining Note",
          "source": "Sentence",
          "destination": "SentenceReading",
          "mode": "furigana",
          "split_morphemes": true
        },
        {
          "name": "Add furigana for word -- UNUSED BY jp-mining-note",
          "note_type": "AJT_JAPANESE_IGNORE_PROFILE",
          "source": "VocabKanji",
          "destination": "VocabFurigana",
          "mode": "furigana",
          "split_morphemes": false
        },
        {
          "name": "Add pitch accent html",
          "note_type": "JP Mining Note",
          "source": "Word",
          "destination": "AJTWordPitch",
          "mode": "pitch",
          "output_format": "html",
          "split_morphemes": false
        },
        {
          "name": "Add audio for word -- UNUSED BY jp-mining-note",
          "note_type": "AJT_JAPANESE_IGNORE_PROFILE",
          "source": "VocabKanji",
          "destination": "VocabAudio",
          "mode": "audio",
          "split_morphemes": false
        }
      ],
      "pitch_accent": {
        "lookup_shortcut": "Ctrl+8",
        "output_hiragana": false,
        "kana_lookups": true,
        "skip_numbers": true,
        "reading_separator": "・", // (4)!
        "word_separator": "、",
        "blocklisted_words": "こと,へ,か,よ,ん,だ,び,の,や,ね,ば,て,と,た,が,に,な,は,も,ます,から,いる,たち,てる,う,ましょ,たい,する,です,ない",
        "maximum_results": 100, // (5)!
        "discard_mode": "discard_extra"
      },
      "furigana": {
        "skip_numbers": true,
        "prefer_literal_pronunciation": false,
        "reading_separator": ", ",
        "blocklisted_words": "人",
        "mecab_only": "彼,猫,首,母,顔,木,頭,私,弟,空,体,行く",
        "counters": "つ,月,日,人,筋,隻,丁,品,番,枚,時,回,円,万,歳,限,万人",
        "maximum_results": 1, // (6)!
        "discard_mode": "discard_extra"
      },
      "context_menu": {
        "generate_furigana": true,
        "to_katakana": true,
        "to_hiragana": true,
        "literal_pronunciation": true
      },
      "toolbar": { // (7)!
        "regenerate_all_button": {
          "enabled": false,
          "shortcut": "Alt+P",
          "text": "再"
        },
        "furigana_button": {
          "enabled": false,
          "shortcut": "",
          "text": "振"
        },
      "hiragana_button": {
          "enabled": false,
          "shortcut": "",
          "text": "平"
        },
        "clean_furigana_button": {
          "enabled": false,
          "shortcut": "",
          "text": "削"
        }
      },
      "audio_sources": [
        {
          "enabled": false, // (8)!
          "name": "NHK-2016",
          "url": "https://github.com/Ajatt-Tools/nhk_2016_pronunciations_index/releases/download/v1.0/NHK_extended.zip"
        },
        {
          "enabled": false,
          "name": "NHK-1998",
          "url": "https://github.com/Ajatt-Tools/nhk_1998_pronunciations_index/releases/download/v1.0/NHK_main.zip"
        }
      ],
      "audio_settings": {
        "dictionary_download_timeout": 30,
        "audio_download_timeout": 6,
        "attempts": 4,
        "maximum_results": 99,
        "ignore_inflections": false,
        "stop_if_one_source_has_results": false
      }
    }
    ```

    1.  This ensures that the pitch accent and furigana is added upon initial note creation.
        Note that this is technically optional.
        If you are likely to change the sentence after adding the note,
        then it is possible to leave this as `false`,
        and bulk add the furigana later.
        However, this will also disable automatic generation of pitch accents.

    2. `styles` adds custom stylization that creates the pitch accent lines and downsteps as you see
        in the example note.
        Without this, the default styles will look like the word
        you see in the official add-on page.

    3. The `Add pitch accent number` and `Add furigana for word` profiles are not used.
        In order to disable them, the note type is set to `AJT_JAPANESE_IGNORE_PROFILE`,
        which only matches note types containing the string `AJT_JAPANESE_IGNORE_PROFILE`.
        It is very unlikely that your Anki notes will unintentionally contain this string.

    4. This makes the separators behave like the old version, and has to be changed to this
        for the default config of jp-mining-note to work.

    5. This is set to a high number in order for many pitch accents to be displayed for long expressions.
        This is fine because the pitch accent display is usually overwritten by
        the `PAPositions` field, so it's rare to see the `AJTWordPitch` field results anyways.
        Additionally, a higher number increases the sample size for the internal
        auto-pitch-accent module, to better search for devoiced and nasal markers.

    6. (Optional) This is to restrict the generated furigana to only show one reading.
        Feel free to leave this as the default (`3`).

    7.  (Optional) I personally have the buttons removed because I don't want it to clutter
        up the editor toolbar.
        Feel free to have these enabled.

    8.  (Optional) These are disabled because it slows down Anki's startup time.
        Additionally, the note does not use this feature.
        If you want to use this feature, feel free to enable these.



### Additional Info
Furigana generation is occasionally incorrect,
so if you plan on using furigana regularly, you should double-check the readings
to make sure they are correct.

??? info "JapaneseSupport v.s. AJT Japanese (Furigana)"

    If you use [JapaneseSupport](https://ankiweb.net/shared/info/3918629684), bolded words and other styles within a field
    are not transferred over from the original field to the reading field.
    Additionally, JapaneseSupport does not have an option to automatically add
    the reading upon card creation.
    AJT Japanese supports both of those of those features.

---


# Final Steps: After Installing Add-ons
After the above setup, **make sure to restart Anki** for the add-ons and config changes to take effect.
If the css injector add-on is installed correctly, your Anki field editor should now have color!

Additionally, now that Anki-Connect is installed, kanji hover should also be functioning.
Hover over a kanji within the word reading to make sure that a popup appears.
In particular, the 者 kanji in the example 偽者 and 不審者 cards should point to each other.


!!! note
    Hovering over the other kanjis will display a `Kanji not found.` message,
    because the template only searches for kanjis within existing jp-mining-note cards.

    If you wish to see usages of the kanji within words outside of your deck,
    I highly recommend using Marv's
    [JPDB Kanji Yomichan Dictionary](https://github.com/MarvNC/yomichan-dictionaries/#jpdb-kanji).

---


# Transfer Existing Notes
If you wish to transfer existing cards into this note type
(say, to make kanji hover work on existing cards),
please see [this page](importing.md).

---



# Updating the Note
If you wish to update the note, follow the steps in [this page](updating.md).

This note does not auto-update. This should keep your setup stable,
as long as you do not update Anki.

When updating Anki, don't forget to check if there is a new version of this note available,
because this note should update along with Anki.


---

# Setting up Yomichan

Of course, you can have an Anki template, but what's the point of it
if you can't make cards with it?

We will use Yomichan to create these cards.

[Click here see how to setup Yomichan!](setupyomichan.md){ .md-button }





