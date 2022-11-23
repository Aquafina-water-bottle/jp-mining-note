
This page contains extra info on how the custom Yomichan Templates works,
and how to customize it even further.


# Categorization of Dictionaries
This section deals with how the custom Yomichan Templates categorizes dictionaries,
and how to properly customize them for your setup.


## Expected Dictionary Placement
Dictionaries from Yomichan are sorted in to the following fields:

* `PrimaryDefinition`:
    A dictionary specified by the user. Bilingual by default.

    This can be changed in many different ways.
    See [here](setupyomichan.md#yomichan-templates-options)
    for a summary of these methods.

* `SecondaryDefinition`:
    All bilingual dictionaries outside of the one in `PrimaryDefinition`

* `ExtraDefinitions`:
    All monolingual dictionaries outside of the one in `PrimaryDefinition`

* `UtilityDictionaries`:
    All traditionally-formatted dictionaries that
    do not belong in any of the above categories
    (in other words, does not provide the meaning of the word).

    An example is the
    [JMdict Surface Forms](https://github.com/FooSoft/yomichan/issues/2183) dictionary

    !!! note
        This does not include pitch accent dictionaries, frequency lists, or kanji dictionaries,
        as these are not traditionally-formatted dictionaries.


The way that the dictionaries are sorted into the appropriate fields is by assigning
a category to each individual dictionary.


## Verifying Categories

You can check that your dictionaries are correctly categorized with the
`{jpmn-test-dict-type}` marker.
Under the Anki Templates code, replace `Card field` with `{jpmn-test-dict-type}` and press `Test`.

{{ img("checking dictionary categories", "assets/yomichantemplates/test_dictionary_categorization.gif") }}

An example output of the above (on the word 結構) is the following:
```
「旺文社国語辞典 第十一版」: monolingual
「明鏡国語辞典 第二版」: monolingual
「ハイブリッド新辞林」: monolingual
「新明解国語辞典 第五版」: monolingual
「デジタル大辞泉」: monolingual
「NHK日本語発音アクセント新辞典」: utility
「JMDict Surface Forms」: utility
「JMdict (English)」: bilingual
「JMdict (English)」: bilingual
「JMdict (English)」: bilingual
「JMdict (English)」: bilingual
「JMdict (English)」: bilingual
「新和英」: bilingual
```


If a dictionary is miscategorized,
you will have to edit `bilingual-dict-regex` or `utility-dict-regex`
at the top of the template code.
Monolingual dictionaries are considered to be dictionaries that aren't either
of the two above, so no handlebars code has to be changed if one were to
use more monolingual dictionaries.

To see how to edit the regex, go to [this section](yomichantemplates.md#editing-the-dictionary-regex).


## Ignoring a Dictionary
If you want to see the dictionary on Yomichan but not have it show on Anki,
you can use the `ignored-dict-regex` option.

To see how to edit the option, see [the section below](yomichantemplates.md#editing-the-dictionary-regex).

Conversely, if you want to not see the dictionary on Yomichan but want it to show up on Anki,
[see here](jpresources.md#hide-the-dictionary-but-allow-it-to-be-used-by-anki){:target="_blank"}.


## Editing the dictionary regex

To modify a regex string:

1. Determine the exact tag your dictionary has.
    To see this, take a word that has a definition in the desired dictionary, and test
    `{jpmn-test-dict-type}` like above.
    The string inside the quotes 「」 is exactly the tag of the dictionary.

2. Add the dictionary tag to the string, by replacing `ADD_x_DICTIONARIES_HERE`.
    For example, if your bilingual dictionary tag is `Amazing Dictionary`, change
    `ADD_BILINGUAL_DICTIONARIES_HERE` to
    `Amazing Dictionary`.

    If you want to add more than one dictionary, they have to be joined with the `|` character.
    For example, if you want to add the bilingual dictionaries
    `Amazing Dictionary` and `Somewhat-Okay-Dictionary`, change
    `ADD_BILINGUAL_DICTIONARIES_HERE` to
    `Amazing Dictionary|Somewhat-Okay-Dictionary`.

    {% raw %}
    For completeness, here is the modified line for the second example:
    ```handlebars
    {{~#set "bilingual-dict-regex"~}} ^(([Jj][Mm][Dd]ict)(?! Surface Forms)(.*)|新和英.*|日本語文法辞典.*|Amazing Dictionary|Somewhat-Okay-Dictionary)$ {{~/set~}}
    ```
    {% endraw %}


---





# Selected Text

TODO flesh out and layout info better


## Overriding a Dictionary
Highlighting a dictionary overrides the first definition you see with that dictionary.
This is togglable by `opt-selection-text-dictionary`.

## Overriding the Definition
If you select a portion of the definition, the template code will
use the dictionary containing the selected definition,
and bold the selected portion.
This is togglable by `opt-selection-text-glossary`.

!!! note

    This is not guaranteed to work: if the highlighted text could not be automatically
    detected from the custom template code, then it will fallback to simply
    using the highlighted text.

    This is most likely to fail if you select formatted parts of text,
    such as (but not limited to):

    - line breaks
    - furigana
    - across multiple items in a list (common with JMdict)


If you do not want to use the entire dictionary, and prefer
that *only* the selected text is shown in the first definition,
set `opt-selection-text-glossary-attempt-bold` to `false`.

TODO gif



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



---

# Other Customizations

{{ feature_version("0.11.1.0") }}

`jpmn-filled-if-word-is-hiragana`

- use this marker in any field to fill it if the term is hiragana only
- for example, under Yomichan's "Anki card format", set `IsTargetedSentenceCard` to `{jpmn-filled-if-word-is-hiragana}` if you want the card type to be a TSC for hiragana only terms
- behavior:
    - empty for words such as: トイレ、成り立つ、ブツブツ
    - filled for words such as: ぶつぶつ、ぽつり
- inspired by [Marv's hint sentence for kana cards](https://github.com/MarvNC/JP-Resources#anki-automatic-hint-sentence-for-kana-cards)





