This section documents how to use the jp-mining-note handlebars on any template
that **is not jp-mining-note**.
If you are using jp-mining-note, please see the
[Definitions](definitions.md)
page instead.


---


# Features

This handlebars package provides all of the features that comes with the standard jp-mining-note installation:

- A primary dictionary selector that automatically chooses the first bilingual or monolingual dictionary (depending on your settings)
- Ability to manually select a dictionary or highlight a definition, to override the primary dictionary selector
- Automatic separation of auxiliary dictionaries into monolingual and bilingual dictionaries
- Option to hide the first line of monolingual dictionaries
- Compatibility with [other portable handlebars](#compatability-with-other-handlebars)

The main difference between these handlebars and the handlebars used by jp-mining-note
is that some default settings have been manually changed,
so that definitions are exported in a minimalistic HTML format.
This minimal format (almost) completely conforms with the default Yomichan handlebars,
so it should work for any note type.

---


<!--
TODO
# Demos

As a proof of concept, the following demonstrates that the handlebars works on a diverse set of
Anki note templates, and will likely work on yours as well.

=== "Ajatt-Tools TSC"
=== "Anime Cards"
=== "Eminent v2.4"
=== "Rudnam's Template"


---
-->


# Setup Handlebars

Before doing anything, please
[make a backup of your Yomichan settings.](faq.md#how-do-i-backup-yomichan-settings)


??? example "Video demo <small>(click here)</small>"
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
        {{ plaintext_change_defaults(TOP_YOMICHAN) }}
        {% endfilter %}
        ```

2. Copy and paste the code below to the **bottom** of the default Yomichan template code:

    ??? examplecode "Click here to show the template code to copy."

        ```handlebars
        {% filter indent(width=8) -%}
        {{ BOTTOM_YOMICHAN }}
        {% endfilter %}
        ```

## Monolingual definitions
By default, the handlebars exports bilingual cards.
Set `opt-first-definition-type` to `monolingual` if you want monolingual Anki cards.
[See here for more info](definitions.md#primary-definition-selection-automatic).

---


# Setup Fields


??? example "Video demo TODO <small>(click here)</small>"
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
<i><sup>Main Page: [Definitions: Dictionary Placement](definitions.md#dictionary-placement)</sup></i>

The most important handlebars that this package introduces is `{jpmn-primary-definition}`.
This handlebars automatically selects the first monolingual or bilingual dictionary,
depending on the `opt-first-definition-type` option.

To summarize the introduced definition handlebars:

| Handlebars | Description |
|-|-|
| `{jpmn-primary-definition}` | The highest priority monolingual or bilingual dictionary (depending on the value of `opt-first-definition-type`). |
| `{jpmn-secondary-definition}` | All bilingual dictionaries outside of the one selected in the primary definition. |
| `{jpmn-extra-definitions}` | All monolingual dictionaries outside of the one selected in the primary definition. |
| `{jpmn-utility-dictionaries}` | All dictionaries that fall outside the category of bilingual or monolingual. For example, [JMnedict](https://github.com/Aquafina-water-bottle/jmdict-english-yomichan) or [JMdict Forms](https://github.com/Aquafina-water-bottle/jmdict-english-yomichan). |


If you want to select a different dictionary, highlight the dictionary, or a portion of the definition
before importing. This will override the primary definition with the selected dictionary / definition.

![type:video](assets/setupyomichan/selected_text.mp4)



## Frequency Sorting
This package introduces `{jpmn-frequency-sort}`, which behaves the exact same as
[Marv's `{freq}` handlebars](https://github.com/MarvNC/JP-Resources#sorting-mined-anki-cards-by-frequency).
The only difference is that the options are placed at the very top of the handlebars,
instead of within the function.

In other words, feel free to use this in the exact same way as you would with `{freq}`.




## Other handlebars
- TODO `jpmn-sentence-bolded-furigana-plain`
- TODO binary field handlebars
- link to appropriate yomichan template section


---


# Piaintext Options
This section describes all the plaintext options, which are all prefixed with `opt__plaintext__`.

- If you are not using jp-mining-note, all these options should be set to `true` by default.
    This means definitions are as minimal as possible in both internal HTML structure
    and in content.

- If you are using jp-mining-note, then all of these should be set to `false` by default.


If you are looking for information about the other options, please see the
[Definitions](definitions.md) page.


## `opt__plaintext__stylize-glossary`

Setting this option to `true` will no longer stylize the definition handlebars for jp-mining-note
usage, and instead stylizes it to be virtually the same as Yomichan's default HTML structure.

??? example "Differences between default Yomichan format and JPMN plaintext <small>(click here)</small>"
    There are a few minor differences between Yomichan's format and these non-stylized definitions:

    - The dictionary and tags are not italicized. This is to avoid seeing italic kanjis/kana.
    - The div that left-aligns the text is not present.
        If this breaks your card, (for example, the definition gets centered),
        try surrounding your definition field.
        For example, if your field name is `Definition`, then within your Anki card templates,
        surround `{{Definition}}` with the following:

        {% raw %}
        ```html
        <div style="text-align: left"> {{Definition}} </div>
        ```
        {% endraw %}

    - Dictionaries with only one entry is formatted as a list of one element by default.
        This is usually not desired. To disable this behavior and make the behavior more like
        Yomichan, set `opt__plaintext__one-dict-entry-only-no-list` to `true`.

    - The first line for most dictionaries are removed by default.
        This can be controlled with the following options:
        - `opt__plaintext__remove-first-line-enabled`
        - `opt-first-line-dicts-regex`


## `opt__plaintext__one-dict-entry-only-no-list`

If this is `true`, then a definition that only contains one dictionary entry will export
without being in a list.

For the following examples, we take the definition of 絨毯 from the
旺文社国語辞典 第十一版 dictionary.

=== "`true` (single definition has no list)"
    > 床の敷物にする厚い毛織物。カーペット。「床に―を敷く」 <br>
    > 《季・冬》
=== "`false` (single definition exported in list)"
    > 1. 床の敷物にする厚い毛織物。カーペット。「床に―を敷く」 <br>
    >   《季・冬》

!!! note
    If there are multiple definitions, then it is exported in a list format by default.
    This is almost never present in monolingual dictionaries, but almost always present for JMdict.
    For example, 地雷 (in the old JMdict dictionary) will always be exported as the following, regardless
    of the setting:

    > 1. (n, JMdict (English)) land mine
    > 1. (n, col, JMdict (English)) topic that sets someone off | sensitive topic | taboo topic | trigger
    > 1. (n, col, JMdict (English)) something that seems fine at first but turns out to be very bad (e.g. product, business) | booby trap | pitfall



## `opt__plaintext__remove-dictionary-tag`

Whether the dictionary tag is exported or not.

=== "`true` (no dictionary tag)"
    > じゅう‐たん【△絨△毯・△絨△緞】<br>
    > 床の敷物にする厚い毛織物。カーペット。「床に―を敷く」 <br>
    > 《季・冬》
=== "`false` (keep dictionary tag)"
    > (旺文社国語辞典 第十一版) じゅう‐たん【△絨△毯・△絨△緞】<br>
    > 床の敷物にする厚い毛織物。カーペット。「床に―を敷く」 <br>
    > 《季・冬》


## `opt__plaintext__remove-first-line-enabled`

Whether the first line is exported or not.

=== "`true` (first line removed)"
    > 床の敷物にする厚い毛織物。カーペット。「床に―を敷く」 <br>
    > 《季・冬》
=== "`false` (first line kept)"
    > じゅう‐たん【△絨△毯・△絨△緞】<br>
    > 床の敷物にする厚い毛織物。カーペット。「床に―を敷く」 <br>
    > 《季・冬》

This affects almost all dictionaries by default.
If you want to ignore certain dictionaries, use the `opt-first-line-dicts-regex` option
as described [here](definitions.md#when-html-can-break).

---








# Compatibility with other Handlebars

These handlebars are fully compatable SO LONG AS your other handlebars are based off of the most
recent set of default handlebars.
A non-example is the classic animecard's `{test}`.
`{test}` requires outdated handlebars in order to work,
and is therefore incompatible with these handlebars.

There are two reasons why these handlebars are compatible with most other handlebars:

- Everything is prefixed with `jpmn` (or `_jpmn`).
    These prefixes prevent the JPMN handlebars from overriding any other custom handlebars
    you may have defined.
- These handlebars do not modify the default handlebars code. This is in order to preserve
    the original handlebars functionality, and so other handlebars
    can rely on the original handlebars to work properly.



