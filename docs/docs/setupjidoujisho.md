TODO actually test this app out, and update the fields / limitations as necessary

# Limitations

## Major
None that I am aware of.

## Minor
- `Sentence`: The tested word won't be automatically bolded on export (TODO: will be possible
    if/when handlebars is implemented)
- `PrimaryDefinition` field is a bit limited, cannot stylize the definition output as much
    as Yomichan, such as:
    - The first line / dictionary name cannot be removed
    - Lists cannot be collapsed into a compact list
- Pitch accent display is generated from AJT Japanese, and there is no control on card export.
    - Note that pitch accent can still be [overwritten per card](autopa.md#specifying-pitch-accent)
        when necessary.
    - Also note that you should be able to see the exported pitch accent within `PAGraphs`.
        This can be used as a reference if you want to override the pitch accent.

## Extremely Minor
- `SentenceReading` and `AJTWordPitch`: cannot be automatically generated on card export.
    These must be batch filled later, on PC.
- `FrequenciesStylized`: List of frequencies cannot be exported, only the sort value can
- `WordReadingHiragana` can contain katakana.
    This should ideally be 100% hiragana, but this is a very minor issue
    (TODO explanation: the field is only used for word indicator queries, not pre-processed
    in order to optimize for speed, so must be processed when card is added. katakana
    can interfere with the process, but it is very unlikely to have a katakana-reading word
    to have the same reading as a hiragana-reading word)



# Setup

{{ fields_table("jp-mining-note fields", "jidoujisho's creator fields", "jidoujisho_export") }}


- additionally, highly recommend using a `jidoujisho` tag to all cards generated from jidoujisho
    (under the `Tags` creator field?)
- currently does nothing, but may be useful for future compatability purposes

# Notes
- Binary fields can use any arbitrary field, like `Term`. The content of the field doesn't matter, what matters is that the field is filled.
