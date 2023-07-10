
# Individually Change Card Type

TODO copy/paste from quickstart

- can determine which fields are "binary fields" or not by the [Fields](fields.md) page



---


# Default Card Type

TODO video

If you want to change the card type for all new cards, you can simply
fill the field in [Yomichan's Anki Card Format](setupyomichan.md#yomichan-fields).

For example, if you want to set the default card type to be a sentence card:

* Navigate to Yomichan settings, and then to `Anki` →  `Configure Anki card format...`.
* Set `IsSentenceCard` to `1`.

This will set all new cards to be a sentence card by default.

However, what if you don't want *ALL* new cards to be sentence cards?
With the power of Yomichan handlebars, it is possible to selectively fill fields depending
on select properties of the target word.


## Is Hiragana
{{ feature_version("0.12.0.0") }}

> Helpers: `{jpmn-filled-if-word-is-hiragana}`・`{jpmn-filled-if-word-is-not-hiragana}`

If the word is purely comprised of hiragana,
you can create different card types by default using these helpers.

For example, let's say you want the default card to be a vocab card,
but want hiragana terms to be [TSCs](cardtypes.md#targeted-sentence-card).
To do exactly that, do the following:

* Navigate to Yomichan settings, and then to `Anki` →  `Configure Anki card format...`.
* Set `IsTargetedSentenceCard` to `{jpmn-filled-if-word-is-hiragana}`.

??? example "Example behavior <small>(click here)</small>"
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


## Is Grammar point
{{ feature_version("0.12.0.0") }}

> Helpers: `{jpmn-filled-if-grammar-point}`・`{jpmn-filled-if-not-grammar-point}`

These helpers check if the word exists in a
[grammar dictionary](https://github.com/aiko-tanaka/Grammar-Dictionaries).
Of course, this can only work if you have a grammar dictionary installed in the first place.

The exact list of grammar dictionaries can be customized with the `opt-grammar-override-dict-regex` option.


## Is Onomatopoeia
{{ feature_version("0.12.0.0") }}

> Helpers: `{jpmn-filled-if-on-mim}`・`{jpmn-filled-if-on-mim}`

These helpers check if a dictionary entry is an Onomatopoeia word.
It does this specifically by checking if the `on-mim` tag exists on any dictionary entry.
This design is unique to JMdict, so you must have a JMdict dictionary installed
in order for this helper to function.

---


# Batch Change Card Type

You may want to change the card type of many existing cards all at once.
For example, you may have cards imported into JPMN,
or cards that were simply not created by Yomichan in the first place.

!!! warning
    As always, before mass editing your collection, please
    [backup your Anki data](faq.md#how-do-i-backup-my-anki-data).

There are three ways of batch changing the card type:

=== "Batch Command"
    You can use the `fill_field` and `empty_field` {{ BATCH_CMDS }}.
    For example, the following batch commands fill and empty the `IsSentenceCard` field, respectively:
    ```aconf
    fill_field IsSentenceCard
    empty_field IsSentenceCard
    ```
    More info about these batch commands can be found [here](batch.md#available-batch-commands).
=== "Anki's Search & Replace"
    TODO
=== "Batch Editing Addon"
    You can use a [Batch Editing Addon](https://ankiweb.net/shared/info/291119185)
    to do the changes.


## Batch Change: Is Hiragana
If you used to have
[Marv's "Automatic Hint Sentence for Kana Cards"](https://github.com/MarvNC/JP-Resources#anki-automatic-hint-sentence-for-kana-cards)
setup, you might be interested in replicating that for old cards.
In order to do so, the `fill_field_if_hiragana` {{ BATCH_CMD }} is provided
to fill the provided field of all cards that have hiragana-only terms.

For example, the following batch command fills the `IsHintCard`,
which turns all cards with hiragana-only terms into [Hint Cards](cardtypes.md#hint-cards),
meaning a hint sentence is shown below the word.


```aconf
fill_field_if_hiragana IsHintCard
```

If you want to have this be the default for all new cards,
see [here](#is-hiragana).






