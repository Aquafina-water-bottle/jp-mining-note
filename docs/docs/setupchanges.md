
This page documents any changes to the setup as recorded in previous pages,
as well as any important handlebars and JPMN updates.
Most importantly, this documents the existance of breaking changes from external
programs and if there are fixes or workarounds for them.

If something breaks, and you suspect it's due to an external program updating,
please check here first! If you can't find any solution,
[please let me know!](faq.md#contact-info)


---

# 2023/??/?? (JPMN 0.12.0.0) { #v0-12-0-0 }

This version of jp-mining-note comes with many changes,
including an entire backend javascript rework.
See the [Updating](updating.md#overview) page on how to update the note.
Afterwards, see below for the other necessary changes that must be made to properly update the note.


<!--
## Field Font Size
TODO: batch commands

```
set_font_sizes
set_fonts_to_key_font
```

The fields within the note editor may look a bit off, due to the font and font sizes being wrong.
When Anki-Connect finally updates, these fonts will be changed automatically upon installation.
However, until then, it will have to be done manually.
All info about the field font sizes should be found in the [fields table](fields.md).

Additionally, all new fields will have the default font, which likely
does not display Japanese characters correctly.
Please set this to match your other fields.
-->



## Config Rework { #v0-12-0-0-config-rework }

<!--

You will get the following warning on all cards:
```
JPMNOptions was not defined in the options file. Was there an error?
```

This is because the `_jpmn-options.js` runtime options file has been completely reworked,
meaning your config will no longer work.
To fix your config file, do one of the following:

??? info "Option 1: JPMN Manager {{ CLICK_HERE }}"
    Run the following {{ BATCH_CMD }}:
    ```aconf
    replace_runtime_options_file_anki
    ```

??? info "Option 2: Command Line {{ CLICK_HERE }}"
    Run the following {{ BATCH_CMD }}:
    ```aconf
    python3 tools/batch.py replace_runtime_options_file
    ```

??? info "Option 3: Manually {{ CLICK_HERE }}"

    1. [Locate the `_jpmn-options.js` file](runtimeoptions.md#accessing-editing).
    1. Make a backup of this file, say, by copying the file into your `Documents` folder.
    1. Edit the file with your favorite text editor, and replace its contents entirely with the following:

        ```js title="_jpmn-options.js"
        {% filter indent(8) %}{{ JPMN_OPTIONS_EXAMPLE}}{% endfilter %}
        ```

Afterwards, re-add any runtime options you had changed before.
The runtime options file can be found [here](runtimeoptions.md#accessing-editing).
-->

The `_jpmn-options.js` runtime options file has been completely reworked,
meaning your config will no longer work.
With this update, the file has been replaced automatically.
The runtime options file can be found [here](runtimeoptions.md#accessing-editing).

If you have edited your runtime options before, you will need to re-enable them.
Common runtime-options (pitch accent coloring and image blur) are included as examples;
remove the comment to re-enable them.
To see all available runtime options, see
[Runtime Options: Available Options](runtimeoptions.md#available-options).

A backup of your previous runtime options should be made.
The location of the backup is different depending on the updating method used:

=== "JPMN Manager"
    ```
    Anki2/addons21/1732829476/user_files/backup
    ```
=== "Command Line"
    ```
    (repo root)/backup
    ```

!!! note
    For people using pitch accent coloring, the entire card is now highlighted with the pitch accent group.
    To restore the previous behavior, use these runtime options:

    ```json
    "autoPitchAccent.coloredPitchAccent.color.fullSentence": false,
    "autoPitchAccent.coloredPitchAccent.color.definitions": false,
    ```

## Updating Multiple Devices { #v0-12-0-0-multiple-devices }

A common issue with updating multiple devices (for example, updating your phone)
is that the new runtime options file may not be synced properly.
This will lead into one of two behaviors:

- On anything that is not AnkiMobile, you will get the following warning:
    ```
    JPMNOptions was not defined in the options file. Was there an error?
    ```
- On AnkiMobile, no javascript is ran, meaning the mobile tabs will not work.

The official documentation says that
[adding or removing a media file](https://docs.ankiweb.net/syncing.html?highlight=sync%20media#media)
should fix this issue.
However, I received various reports from people saying this does not work.
A [fool-proof workaround](https://forums.ankiweb.net/t/how-to-sync-updated-css-external-file/5455/3)
that is guaranteed to work is documented below.

=== "Batch Commands"
    1. Make sure all devices are synced.
    1. Run the following {{BATCH_CMD}}:

        ```move_runtime_options_file_to_temp```

    1. Sync to AnkiWeb (from the computer).
    1. Run the following {{BATCH_CMD}}:

        ```move_runtime_options_file_to_original```

    1. Sync to AnkiWeb (from the computer).
    1. On all other devices, sync from AnkiWeb.

=== "Manually"
    1. Make sure all devices are synced.
    1. Rename the `_jpmn-options.js` file to something different manually,
        i.e. `_jpmn-options-TEMP.js`.
    1. Sync to AnkiWeb (from the computer).
    1. Rename the temporary file (in the example above: `_jpmn-options-TEMP.js`)
        to the original name (`_jpmn-options.js`).
    1. Sync to AnkiWeb (from the computer).
    1. On all other devices, sync from AnkiWeb.


## Handlebars { #v0-12-0-0-handlebars }
Yomichan's Handlebars has been updated, with some new markers and features being added.

- To update Yomichan's Anki Card Format, see [here](updating.md#updating-yomichans-anki-card-format).
- To update your handlebars templates, see [here](updating.md#updating-yomichan-templates).

After updating the templates, the following fields must be changed:

- `FrequencySort`: `{jpmn-min-freq}` →  `{jpmn-frequency-sort}`
    - Newer users might already have this set correctly.
        In that case, you don't have to change anything.
- `YomichanWordTags`: `(empty)` →  `{tags}`
- See [here](updating.md#updating-yomichans-anki-card-format)
  for instructions on how to update Anki Card Format.


## AnkiConnectAndroid { #v0-12-0-0-ankiconnectandroid }
If you are using AnkiConnectAndroid, please repeat the steps above for updating Yomichan.
It will likely [error until updated](https://github.com/KamWithK/AnkiconnectAndroid#problem-on-card-add-i-get-incorrect-flds-argument).


<!--
### Handlebars: JMdict Extra
<i><sup>Main Page: [Setup Yomichan: Fixing JMdict Extra](setupyomichan.md#fixing-jmdict-extra)</sup></i>

A new version of JMdict was released for Yomichan, called
[JMdict Extra](https://github.com/Aquafina-water-bottle/jmdict-english-yomichan).
This version of JMdict contains many things ontop of the the definition, including
example sentences, antonyms, etc.

When exporting this dictionary with default settings,
the entries are sometimes displayed in list format instead of compact format.
If you want a consistently compact format, set the
`opt-jmdict-list-format` Yomichan template option to `true`.
For example:

{% raw %}
```handlebars
{{~set "opt-jmdict-list-format" true ~}}
```
{% endraw %}
-->


## Frequency Display { #v0-12-0-0-frequency-display }
The frequency at the top right now defaults to using the FrequencySort value.
This is because it is usually more useful to see a summary of the values,
instead of all the literal values itself.

- If you prefer the list display, see [Frequencies: List Mode](frequencies.md#list-mode).
    Also see [Frequencies: List Mode Maximum](frequencies.md#list-mode-maximum).
- If you prefer the frequency sort display but you don't have a frequency sort value,
    [backfill the frequencies](importing.md#backfill-the-frequencysort-field).
- If you prefer the frequency sort display but your frequency sort is somehow invalid:
    1. Clear out your `FrequencySort` field entirely through the following command:
        ```
        python3 tools/batch.py clear_field "FrequencySort"
        ```
    2.  [Backfill the frequencies](importing.md#backfill-the-frequencysort-field).




## Automatic Field Collapsing { #v0-12-0-0-automatic-field-collapsing }
For newer versions of Anki,
you can set a field to be collapsed by default by heading over to:

> (Note editor) →  `Fields...` →  `Collapse by default`

Feel free to automatially collapse any fields you don't use, or very rarely use.
The fields that are collapsed by default can be found [here](fields.md).

## Custom SCSS { #v0-12-0-0-custom-scss }
For people who are using custom SCSS (usually through `src/scss/extra`),
it is now recommended that the `extra` folder is moved to the `overrides/scss` folder.
This is purely a stylistic change, to better separate user-defined changes and source code.


## Final Steps { #v0-12-0-0-final-steps }
After changing everything, don't forget to [test that the card works!](updating.md#final-steps)
If you reached this point, then congratulations! You are finally done with updating the note!
Enjoy `0.12.x.x` and all its new features!


---


# 2023/04/07 (AJT Japanese Update)
AJT Japanese got updated to include automatic audio file downloading.
The [example config](setupanki.md#config-changes)
was updated to disable this by default, because having it enabled increased Anki startup time.
Feel free to re-enable this if you plan on using this feature.


---


# 2023/04/01 (Anki 2.1.61)
Anki 2.1.61 sets `Reduce motion` to be enabled by default. This breaks all animations in templates.
To re-enable animations in templates, please turn this option off.

Note that this is a temporary change on Anki's side, and [should be fixed at some point in the future](https://forums.ankiweb.net/t/reduce-motion-affecting-card-templates-bug-or-intentional/28973).

---

# 2023/03/18 (Handlebars 1.0.1)
The handlebars got an update to support other note types other than jp-mining-note.
Documentation has still not been released on the new options, so this update has not been
officially announced yet.

* See the full changelog [here](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/dev/yomichan_templates/CHANGELOG.md#v101).
* See how to update your handlebars [here](updating.md#updating-yomichan-templates).

---

# 2023/03/07 (AJT Anki Add-ons Update)
AJT Furigana and AJT Pitch Accent got combined into one add-on: AJT Japanese.
AJT Japanese takes the place of AJT Furigana, and should've be automatically updated.

To use this new add-on, the config must be updated.
This new config can be found [here](https://aquafina-water-bottle.github.io/jp-mining-note/setupanki/#ajt-japanese).

Additionally, please disable or remove the "AJT Pitch Accent" add-on, as it is now redundant
and may interfere with "AJT Japanese".

---

# 2023/02/22 (CSS Injector Update)
The CSS Injector was updated by the author, to support Anki versions 2.1.55 and above.
Any local version of CSS Injector should be removed,
and the AnkiWeb version should be used instead.
If you are already using the AnkiWeb version, nothing has to be done.

See the setup instructions [here](https://aquafina-water-bottle.github.io/jp-mining-note/setupanki/#css-injector).



---

# 2022/11/19 (JPMN 0.11.0.0) { #v0-11-0-0 }
- Yomichan's handlebars was updated. See how to update your handlebars [here](updating.md#updating-yomichan-templates).
- Yomichan's 'Anki Card Format' section was updated, and the following fields must be changed:
    - `WordReadingHiragana`: `(empty)` →  `{jpmn-word-reading-hiragana}`
    - See [here](https://aquafina-water-bottle.github.io/jp-mining-note/updating/#updating-yomichans-anki-card-format)
      for instructions on how to update Anki Card Format.
- If you are using the nsfw-toggle function, the option name was changed
  from `nsfw-toggle` to `image-blur`. Please change it in your runtime options
  to continue using it.
  [Example config](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/media/_jpmn-options.js)
- The way keybinds are specified has been changed (to allow keys to still function as expected
  even with CapsLock enabled.)
  Keybinds will no longer work until you update the runtime options values.
  For example, update `n` to `KeyN`.
  [Example config](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/media/_jpmn-options.js)

---

# Everything before

Lower versions of JPMN are not recorded here.
Full details of the changes can be found in the main
[changelog](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/CHANGELOG.md) instead.
