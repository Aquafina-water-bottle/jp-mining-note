
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
However, what if we don't want *ALL* new cards to be sentence cards?
With the power of Yomichan handlebars, we can selectively fill fields depending
on select properties of the target word.



## Is Hiragana
{{ feature_version("0.12.0.0") }}

> Markers: `{jpmn-filled-if-word-is-hiragana}`・`{jpmn-filled-if-word-is-not-hiragana}`

If the word is purely comprised of hiragana,
you can create different card types by default using these markers.

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

- TODO check if word exists in a grammar dictionary
- TODO only works if you have any grammar dictionary installed in the first place
    - TODO link these!
- TODO `opt-grammar-override-dict-regex`


## Is Onomatopoeia
{{ feature_version("0.12.0.0") }}

- TODO check if tag contains `on-mim` (only works if you have a modern JMdict Yomichan dictionary installed)


---


# Batch Change Card Type

- TODO explanation: may have old cards ported from previous cards, or cards not created by Yomichan


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
- hiragana: `fill_field_if_hiragana` batch command
- reminder: above will affect all cards, create a backup!
- 





