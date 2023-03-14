This section documents how to use the jp-mining-note handlebars on any template
that **is not jp-mining-note**.
If you are using jp-mining-note, please see the
[Reference: Definitions](/definitions.md) and
[Reference: Yomichan Templates](/yomichantemplates.md)
pages instead.

TODO

# Features

All of the features that comes with the standard jp-mining-note installation:

- A primary dictionary selector that automatically chooses the first bilingual or monolingual dictionary (depending on your settings)
- Automatic separation of auxillary dictionaries into monolingual and bilingual dictionaries
- Ability to manually select a dictionary or highlight a definition, to override the primary dictionary selector
- Option to hide the first line of monolingual dictionaries
- HTML format is virtually the same as the default handlebars
- Compatability with [most other handlebars](#compatability-with-other-handlebars)


# Setup
1. Follow the setup instructions under the
    [Setup Yomichan: Yomichan Templates](/setupyomichan.md#yomichan-templates) section,
     as if you were installing jp-mining-note.
2. After setting up the templates, change the following options (this flips all non-jpmn options):
    {% raw %}
    ```handlebars
    {{~set "opt__non-jpmn__stylize-glossary" false ~}}
    {{~set "opt__non-jpmn__one-dict-entry-only-no-list" true ~}}
    {{~set "opt__non-jpmn__export-dictionary-tag" false ~}}
    {{~set "opt__non-jpmn__remove-first-line-enabled" true ~}}
    ```
    {% endraw %}

3. Below are a few common options that most people likely change:
    - [`opt-first-definition-type`](/definitions.md#automatic-selection-bilingual-or-monolingual):
        Whether the primary definition is monolingual or bilingual.
        Bilingual by default.
    - [`opt-selection-text-enabled`](/definitions.md#manual-selection):
        Whether you can select the definitions and dictionaries
        to override the primary definition. This is disabled by default.
    - [`opt-primary-def-one-dict-entry-only`](/definitions.md#exporting-only-one-dictionary-entry):
        Whether something with multiple dictionary entries
        has all entries exported into the primary definition, or only the first one.
        Exports all entries by default.


# Introduced Handlebars
- general info on the templates:
    - link to definitions page for more info (Dictionary Placement)
- general info on selecting the definition


# Options


# Compatability with other Handlebars
- compatability with other handlebars:
    - fully compatable SO LONG AS your other handlebars do not modify an existing function in place
    - everything is purposefully prefixed with `jpmn` (or `_jpmn`) to not interfere with other handlebars

# Other Info



