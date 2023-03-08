
Yomichan template options are options that are specified, as you may have guessed,
in Yomichan's templates.
These options are applied on card creation, so
changing these options will only affect cards created in the future.

---

# Accessing & Editing

To access the Yomichan template options,
head to the Yomichan templates as normal:

1. Navigate to Yomichan Settings.
1. Make sure that advanced settings are turned on (bottom left corner).
1. Go to the `Anki` section
1. Select `Configure Anki card templates...`

The options should be available at the very top of the template code.


---

# Custom Markers

Additional markers can be used under the
[Yomichan Fields](setupyomichan.md#yomichan-fields)
to further customize what happens during card creation time.

<br>

## Custom card types on hiragana-only cards
{{ feature_version("0.11.1.0") }}

> Markers: `{jpmn-filled-if-word-is-hiragana}`・`{jpmn-filled-if-word-is-not-hiragana}`

If the word is purely comprised of hiragana,
you can create different card types by default using these markers.

For example, let's say you want the default card to be a vocab card,
but want hiragana terms to be [TSCs](cardtypes.md#targeted-sentence-card-tsc).
To do exactly that, do the following:

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

<br>

## Automatic furigana without AJT Japanese
{{ feature_version("0.11.0.0") }}

> Marker: `{jpmn-sentence-bolded-furigana-plain}`

This automatically uses Yomichan's internal furigana generator to
add furigana to your sentence. Use this under `SentenceReading`.

This is useful if:

* You are not using [AJT Japanese](setupanki.md#ajt-japanese), or
* You are using a device that doesn't have AJT Japanese installed (say, a phone),
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

