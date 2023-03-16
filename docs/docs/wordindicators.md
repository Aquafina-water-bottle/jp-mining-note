{{ feature_version("0.11.0.0") }}

Indicators will be shown to the top-left of the reading when similar words
in your deck are found.

=== "同 (同じ)"
    (TODO image)

    This indicates the card is a duplicate.

=== "音 (同音異義語)"
    (TODO update image)

    {{ img("same reading indicator eg", "assets/ui/same_reading_indicator.gif") }}

    This shows cards with the same reading, **ignoring pitch accent**.
    For example, the word 自身 is still shown,
    despite having a different pitch accent to 地震.

=== "字 (漢字)"
    (TODO image)

    This indicates that there are other card(s) with the same kanji,
    but different reading.




# Interface

This indicator will be yellow (or blue on light mode) for new cards only.
After the first review, the indicator will be the same color as the default info circle (grey).


=== "New Cards"

    (TODO image)

    Just like with [Kanji Hover](kanjihover.md), new cards are greyed out.


=== "Pitch Accents"

    (TODO image)

    Unlike Kanji Hover, pitch accents are automatically shown
    (without having to hover over the word), to emphasize the importance
    of different word pitches on similar words.

=== "Open Card"

    (TODO image)

    Just like with Kanji Hover, you can click on the word to open the
    specified card within Anki's card browser.


