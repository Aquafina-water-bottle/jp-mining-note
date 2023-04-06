
This page documents any changes to the setup as recorded in previous pages,
as well as any important handlebars and JPMN updates.
Most importantly, this documents the existance of breaking changes from external
programs and if there are fixes or workarounds for them.

If something breaks, and you suspect it's due to an external program updating,
please check here first! If you can't find any solution,
[please let me know!](faq.md#contact-info)


---

# 2023/??/?? (JPMN 0.12.0.0)

This version of jp-mining-note comes with many changes,
including an entire backend javascript rework.
See the [Updating](updating.md#overview) page on how to update the note.
Afterwards, see below for the other necessary changes that must be made to properly update the note.

## Config Rework

The `_jpmn-options.js` runtime options file has been completely reworked, meaning
any changes to your config will no longer work.
To fix your config file, do the following steps:

1. [Locate the `_jpmn-options.js` file](runtimeoptions.md#accessing-editing).
1. Make a backup of this file, say, by copying the file into your `Documents` folder.
1. Edit the file, and replace its contents entirely with the [example config](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/media/_jpmn-options.js).
    - TODO REMOVE THIS: link above is currently outdated because master
    - actual link you should use is this: [https://github.com/Aquafina-water-bottle/jp-mining-note/blob/webpack/src/jp-mining-note/_jpmn-options.js](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/webpack/src/jp-mining-note/_jpmn-options.js)
1. Re-add any runtime options you had changed before.


## Handlebars
Yomichan's 'Anki Card Format' section was updated, and the following fields must be changed:

- `FrequencySort`: `{jpmn-min-freq}` →  `{jpmn-frequency-sort}`
    - Newer users might already have this set correctly.
        In that case, you don't have to change anything.
- `YomichanWordTags`: `(empty)` →  `{tags}`
- See [here](updating.md#updating-yomichans-anki-card-format)
  for instructions on how to update Anki Card Format.

## Frequency Display
The frequency at the top right now defaults to using the FrequencySort value.
This is because it is usually more useful to see a summary of the values,
instead of all the literal values itself.
If you prefer the list display, see [here](frequencies.md#list-mode).

## Greyed out collapsible fields
Collapsible fields are now greyed out by default, instead of removed entirely.
If you want to hide these collapsible fields, see [here](blockquotes.md#hide-empty-collapsed-fields).

## Final Steps
After changing everything, don't forget to [test that the card works!](updating.md#final-steps)


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

---

# 2023/02/22 (CSS Injector Update)
The CSS Injector was updated by the author, to support Anki versions 2.1.55 and above.
Any local version of CSS Injector should be removed,
and the AnkiWeb version should be used instead.
If you are already using the AnkiWeb version, nothing has to be done.

See the setup instructions [here](https://aquafina-water-bottle.github.io/jp-mining-note/setupanki/#css-injector).



---

# 2022/11/19 (JPMN 0.11.0.0)
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

Lower versions of JPMN are not recorded here.
Full details of the changes can be found in the main
[changelog](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/CHANGELOG.md) instead.
