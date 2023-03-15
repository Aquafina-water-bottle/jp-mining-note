This section documents how to use the jp-mining-note handlebars on any template
that **is not jp-mining-note**.
If you are using jp-mining-note, please see the
[Reference: Definitions](definitions.md) and
[Reference: Yomichan Templates](yomichantemplates.md)
pages instead.

TODO

# Features

All of the features that comes with the standard jp-mining-note installation:

- A primary dictionary selector that automatically chooses the first bilingual or monolingual dictionary (depending on your settings)
- Ability to manually select a dictionary or highlight a definition, to override the primary dictionary selector
- Automatic separation of auxillary dictionaries into monolingual and bilingual dictionaries
- Option to hide the first line of monolingual dictionaries
- Resulting HTML format is virtually the same as the default handlebars
- Compatability with [other portable handlebars](#compatability-with-other-handlebars)


# Setup
1. Follow the setup instructions under the
    [Setup Yomichan: Yomichan Templates](setupyomichan.md#yomichan-templates) section,
     as if you were installing jp-mining-note.
2. After setting up the templates, change the following Yomichan template options
    (this flips all plaintext options, in order to use plaintext):
    {% raw %}
    ```handlebars
    {{~set "opt__plaintext__stylize-glossary" false ~}}
    {{~set "opt__plaintext__one-dict-entry-only-no-list" true ~}}
    {{~set "opt__plaintext__export-dictionary-tag" false ~}}
    {{~set "opt__plaintext__remove-first-line-enabled" true ~}}
    ```
    {% endraw %}

3. Below are a few common options that most people likely change:
    - [`opt-first-definition-type`](definitions.md#automatic-selection-bilingual-or-monolingual):
        Whether the primary definition is monolingual or bilingual.
        Bilingual by default.
    - [`opt-selection-text-enabled`](definitions.md#manual-selection):
        Whether you can select the definitions and dictionaries
        to override the primary definition. This is disabled by default.
    - [`opt-primary-def-one-dict-entry-only`](definitions.md#exporting-only-one-dictionary-entry):
        Whether something with multiple dictionary entries
        has all entries exported into the primary definition, or only the first one.
        Exports all entries by default.


# Introduced Handlebars

## Definitions
- general info on the templates:
    - `{jpmn-primary-definition}`
    - `{jpmn-secondary-definition}`
    - `{jpmn-extra-definitions}`
    - link to definitions page for more info (Dictionary Placement)

- general info on selecting the definition

## Frequency Sorting
- alternative to marv's `freq`: `jpmn-frequency-sort`
    (it is literally the exact same as `freq`, but with the options moved to the top for convenience)

## Furigana Sentence
- TODO `jpmn-sentence-bolded-furigana-plain`
- link to appropriate yomichan template section

# Options
For infomation about the options available,
first see [Definitions: Plaintext Options](definitions.md#plaintext-options).

Information about the opther options should be scattered around in the
[Definitions](definitions.md) page.


# Compatability with other Handlebars
- compatability with other handlebars:
    - fully compatable SO LONG AS your other handlebars do not modify an existing marker in place
    - examples:
        - if the required markers come from an outdated set of default handlebars (i.e. classic animecard's `{test}`)
        - if a default marker was explicitly changed (i.e. eminent note 2.4 handlebars with `{expression}`)
            - TODO contact before releasing in order to fix this!!!
    - everything is purposefully prefixed with `jpmn` (or `_jpmn`) to not interfere with other handlebars
- e.g. you can use marv's `freq` handlebars by simply copy/pasting and using it as normal
    - since `freq` is not an existing marker



