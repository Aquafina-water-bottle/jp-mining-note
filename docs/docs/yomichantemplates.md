
Yomichan template options are options that are specified, as you may have guessed,
in Yomichan's templates.
These options are applied on card creation, so
changing these options will only affect cards created in the future.

---

# Accessing & Editing

TODO video

To access the Yomichan template options,
head to the Yomichan templates as normal:

1. Navigate to Yomichan Settings.
1. Make sure that advanced settings are turned on (bottom left corner).
1. Go to the `Anki` section
1. Select `Configure Anki card templates...`

The options should be available at the very top of the template code.



<!--
## Options

`opt-selection-text-enabled`

- disabled -> selection text is ignored
- enabled -> selection text (if exists) is processed according to the options below:

`opt-selection-text-dictionary`

- if the selected text is a dictionary, then replaces the PrimaryDefinition with said dictionary

`opt-selection-text-glossary`

- replaces the PrimaryDefinition with the selected text
- the dictionary that the selected text will not be detected, so the same dictionary
  should appear in one of the SecondaryDefinition or ExtraDefinition fields.
- if both `opt-selection-text-dictionary` and `opt-selection-text-glossary` are enabled,
  the `opt-selection-text-dictionary` option takes priority over `opt-selection-text-glossary`,
  i.e. the dictionary is searched first, then if not found the selected text is used

`opt-selection-text-glossary-attempt-bold`

- attempts to replace the PrimaryDefinition field with the full glossary value, with
  only the selected section highlighted
- do NOT rely on this working all the time: many factors can make it not work
  (especially if the highlighted text contains custom formatting or newlines)
- if could not be detected, falls back to the normal selected text
- `opt-selection-text-glossary` must be true for this option to have any effect

-->

