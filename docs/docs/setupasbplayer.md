TODO

[asbplayer](https://github.com/killergerbah/asbplayer)

* To use asbplayer, add the card with Yomichan, and then update the created note with asbplayer.
    I recommend filling out the following fields as follows:

    ??? example "asbplayer fields <small>(click here)</small>"
        | asbplayer field | JPMN field |
        |:-:|:-:|
        | Sentence Field   { .smaller-table-row} | `Sentence`        { .smaller-table-row} |
        | Definition Field { .smaller-table-row} | |
        | Word Field       { .smaller-table-row} | |
        | Audio Field      { .smaller-table-row} | `SentenceAudio`   { .smaller-table-row} |
        | Image Field      { .smaller-table-row} | `Picture`         { .smaller-table-row} |
        | Source Field     { .smaller-table-row} | `AdditionalNotes` { .smaller-table-row} |
        | URL Field        { .smaller-table-row} | `AdditionalNotes` { .smaller-table-row} |

        !!! note
            Chances are that you are using subtitles. However, if you are not using subtitles,
            it is fine to keep the Sentence Field empty.

* Any version of asbplayer released after
    [2023/01/16](https://github.com/killergerbah/asbplayer/issues/205) (version 0.25.0 or higher)
    will now preserve the bolded word within the sentence!
    However, asbplayer shares the same common issue with mpvacious, where
    the `SentenceReading` field may differ from the `Sentence` field.
    See the
    [FAQ](faq.md#the-sentencereading-field-is-not-updated-is-different-from-the-sentence-field)
    on how to fix it.

* To create cards with asbplayer, update last card (TODO ask for help with specific instructions)
