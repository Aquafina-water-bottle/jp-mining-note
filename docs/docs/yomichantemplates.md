
This page contains extra info on how the custom Yomichan Templates works,
and how to customize it even further.


---

# Categorization of Dictionaries
This section deals with how the custom Yomichan Templates categorizes dictionaries,
and how to properly customize them for your setup.


<br>

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


<br>

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


<br>

## Ignoring a Dictionary
If you want to see the dictionary on Yomichan but not have it show on Anki,
you can use the `ignored-dict-regex` option.

To see how to edit the option, see [the section below](yomichantemplates.md#editing-the-dictionary-regex).

Conversely, if you want to not see the dictionary on Yomichan but want it to show up on Anki,
[see here](jpresources.md#hide-the-dictionary-but-allow-it-to-be-used-by-anki){:target="_blank"}.


<br>

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

By default, selecting (highlighting) the text **will do nothing**,
to prevent any unexpected errors from happening.
However, the user can set some options to allow selecting text to override the
automatic dictionary selection behavior.


![type:video](assets/setupyomichan/selected_text.mp4)


## Enabling Selected Text
> `opt-selection-text-enabled`

Under the template options, set `opt-selection-text-enabled` to `true`.
This allows you to do various things by selecting the text, as shown below.


<br>

## Overriding a Dictionary
> `opt-selection-text-dictionary`

By enabling this option, you can highlight over any dictionary tag
to overrides the first definition you see with that dictionary.
This is enabled by default.


<br>

## Overriding the Definition
> `opt-selection-text-glossary`

By enabling this option, you can select a portion of the definition to automatically bold.
The dictionary containing the bolded selection will be used as the primary definition
(first definition shown).
This is enabled by default.

If you do not want to use the entire dictionary, and prefer
that *only* the selected text is shown in the first definition,
set `opt-selection-text-glossary-attempt-bold` to `false`.


??? info "Where automatic bolding can fail *(click here)*"

    Automatic bolding may not always work: if the highlighted text could not be automatically
    detected from the custom template code, then it will fallback to simply
    using the highlighted text (as if you used the `{selection-text}` marker).

    This is most likely to fail if you select formatted parts of text,
    such as (but not limited to):

    - line breaks
    - furigana
    - across multiple items in a list (common with JMdict)

??? info "Where dictionary selection can fail *(click here)*"

    This may occasionally select the wrong dictionary,
    but this only happens if the selected text also appears in a dictionary above the selected text.

    For example, suppose you have two bilingual dictionaries. and for the word タコ,
    you highlight the word "octopus" and create the card.
    Both bilingual dictionaries will list "octopus", so even if you highlight the word "octopus"
    in the second bilingual dictionary, only the first bilingual dictionary will be chosen.

    This is usually not a problem even if the same text appears in a dictionary above
    because it's the same definition regardless.
    Additionally, monolingual dictionaries almost never have the exact same definition for the same word.
    However, if you still want a specific dictionary, highlight the dictionary tag
    [as shown above](#overriding-a-dictionary).



---

# Custom Markers

Additional markers can be used under the
[Yomichan Fields](setupyomichan.md#yomichan-fields)
to further customize what happens during card creation time.


## Custom card types on hiragana-only cards
{{ feature_version("0.11.1.0") }}

> `{jpmn-filled-if-word-is-hiragana}`・`{jpmn-filled-if-word-is-not-hiragana}`

If the word is purely comprised of hiragana,
you can create different card types by default using these markers.

For example, let's say you want the default card to be a vocab card,
but want hiragana terms to be [TSCs](cardtypes.md#targeted-sentence-card-tsc).
To do this, follow the steps below:

* Navigate to Yomichan settings, and then to `Anki` →  `Configure Anki card format...`.
* Set `IsTargetedSentenceCard` to `{jpmn-filled-if-word-is-hiragana}`.

??? example "Example behavior *(click here)*"
    | Example word | `{jpmn-filled-if-word-is-hiragana}` | `{jpmn-filled-if-word-is-not-hiragana}` |
    |:-:|:-:|:-:|
    | ふらっと | 1 |   |
    | トイレ   |   | 1 |
    | 成り立つ |   | 1 |
    | ぶつぶつ | 1 |   |
    | ブツブツ |   | 1 |


!!! note
    This was inspired by
    [Marv's hint sentence for kana cards](https://github.com/MarvNC/JP-Resources#anki-automatic-hint-sentence-for-kana-cards).


## Automatic furigana without AJT Furigana
> `{jpmn-sentence-bolded-furigana-plain}`

This automatically uses Yomichan's internal furigana generator to
add furigana to your sentence. Use this under `SentenceReading`.

This is useful if:

* You are not using [AJT Furigana](setupanki.md#ajt-furigana), or
* You are using a device that doesn't have AJT Furigana installed (say, a phone),
    and you do not want to bulk generate furigana after each session.




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

