TODO

# Limitations

- If you want frequencies, must backfill
- `PrimaryDefinition` field is a bit limited, cannot stylize the definition output as much
    as Yomichan:
        - first line cannot be removed
        - lists cannot be collapsed into a compact list
        - etc.
- `WordReadingHiragana` can contain katakana.
    This should ideally be 100% hiragana, but this is a very minor issue
    (the field is only used for word indicators)


# Setup

{{ fields_table("jp-mining-note fields", "jidoujisho's creator fields", "jidoujisho_export") }}


- additionally, highly recommend using a `jidoujisho` tag to all cards generated from jidoujisho
    (under the `Tags` creator field)
- currently does nothing, but may be useful for future compatability purposes
