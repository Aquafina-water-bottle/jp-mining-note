This section documents how to use the jp-mining-note handlebars on any template
that **is not jp-mining-note**.
If you are using jp-mining-note, please see the
[Definitions](definitions.md) and
[Yomichan Templates](yomichantemplates.md)
pages instead.


---


# Features

All of the features that comes with the standard jp-mining-note installation:

- A primary dictionary selector that automatically chooses the first bilingual or monolingual dictionary (depending on your settings)
- Ability to manually select a dictionary or highlight a definition, to override the primary dictionary selector
- Automatic separation of auxillary dictionaries into monolingual and bilingual dictionaries
- Option to hide the first line of monolingual dictionaries
- Definition HTML format is virtually the same as the default handlebars
- Compatability with [other portable handlebars](#compatability-with-other-handlebars)


---


# Demos

As a proof of concept, the following demonstrates that the handlebars works on a diverse set of
Anki note templates, and will likely work on yours as well.

=== "Ajatt-Tools TSC"
=== "Anime Cards"
=== "Eminent v2.4"
=== "Rudnam's Template"


---


# Setup Handlebars

Before doing anything, please
[make a backup of your Yomichan settings.](faq.md#how-do-i-backup-yomichan-settings)


??? example "Video demo *(click here)*"
    ![type:video](assets/setupyomichan/import_yomichan_templates.mp4)

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
        {{ plaintext_true(TOP_YOMICHAN) }}
        {% endfilter %}
        ```

2. Copy and paste the code below to the **bottom** of the default Yomichan template code:

    ??? examplecode "Click here to show the template code to copy."

        ```handlebars
        {% filter indent(width=8) -%}
        {{ BOTTOM_YOMICHAN }}
        {% endfilter %}
        ```

Below are a few common options that most people likely change:

- `opt-first-definition-type`:
    By default, the handlebars exports bilingual cards.
    Set this to `monolingual` for monolingual Anki cards.
    [See here for more info](definitions.md#primary-definition-selection-automatic).

- `opt-primary-def-one-dict-entry-only`:
    This specifies whether something with multiple dictionary entries
    has all entries exported into the primary definition, or only the first one.
    Exports all entries by default.
    [See here for more info](definitions.md#exporting-only-one-dictionary-entry).


---


# Setup Fields


??? example "Video demo TODO *(click here)*"
    TODO video

1. Navigate to Yomichan Settings.
1. Go to the `Anki` section.
1. Select `Anki card format...`.
1. Under your definition field (`Glossary`, `VocabDef`, etc.),
    type `{jpmn-primary-definition}` into the input box.
1. If you have a field for bilingual definitions, set that field to `{jpmn-secondary-definition}`
1. If you have a field for all other definitions, set that field to `{jpmn-extra-definitions}`

---



# Introduced Handlebars

## Definitions
The most important handlebars that this package introduces is `{jpmn-primary-definition}`.
This handlebars automatically selects the first monolingual or bilingual dictionary,
depending on the `opt-first-definition-type` option.

If you want to select a different dictionary, set `opt-selection-text-enabled` TODO

- general info on the templates:
    - `{jpmn-primary-definition}`
    - `{jpmn-secondary-definition}`
    - `{jpmn-extra-definitions}`
    - `{jpmn-utility-dictionaries}`
    - link to definitions page for more info (Dictionary Placement)

- general info on selecting the definition

<br>

## Frequency Sorting
- alternative to marv's `freq`: `jpmn-frequency-sort`
    (it is literally the exact same as `freq`, but with the options moved to the top for convenience)

<br>


## Other handlebars
- TODO `jpmn-sentence-bolded-furigana-plain`
- TODO binary field handlebars
- link to appropriate yomichan template section


---


# Options
Information about the opther options should be scattered around in the
[Definitions](definitions.md) page.

## `opt__plaintext__stylize-glossary`

- main option you absolutely want to set to `false` to ensure that the HTML format
    is virtually the same as the default

- exceptions:
    - the dictionary and tags are not italicized, to prevent italic kanjis/kana from showing
    - the div that left aligns the text is not present
        - if this breaks your card, try surrounding your definition field, i.e. if your field name is `Definition`:
            {% raw %}
            ```html
            <div style="text-align: left"> {{Definition}} </div>
            ```
            {% endraw %}
    - dictionaries with only one entry is formatted as a list of one element by default
        - see the `opt__plaintext__one-dict-entry-only-no-list` option to disable this

- invalidates `opt-wrap-first-line-spans` entirely, users must now rely on
    `opt__plaintext__remove-first-line-enabled`

## `opt__plaintext__one-dict-entry-only-no-list`

- TODO

## `opt__plaintext__export-dictionary-tag`

- whether the dictionary tag is exported or not

## `opt__plaintext__remove-first-line-enabled`

- whether the first line of a dictionary is removed or not
- uses the same options from the [first line removal section](#first-line-removal-when-html-can-break)

---








# Compatability with other Handlebars
- compatability with other handlebars:
    - fully compatable SO LONG AS your other handlebars are based off of the most recent set of default handlebars
    - main example: classic animecard's `{test}` is based around outdated handlebars, and is therefore incompatible with these handlebars.
    - everything is purposefully prefixed with `jpmn` (or `_jpmn`) to not interfere with other handlebars
- e.g. you can use marv's `freq` handlebars by simply copy/pasting and using it as normal
    - since `freq` is not an existing marker




