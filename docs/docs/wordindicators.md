{{ feature_version("0.11.0.0") }}

Indicators will be shown to the top-left of the reading when similar words
in your deck are found.

=== "同 (同じ)"
    This indicates the card is a duplicate.

    (TODO image)

=== "読 (読み方)"
    This shows cards with the same reading, **ignoring pitch accent**
    (also known as 同音異義語.)
    For example, the word 自身 is still shown,
    despite having a different pitch accent to 地震.

    (TODO update image)

    {{ img("same reading indicator eg", "assets/ui/same_reading_indicator.gif") }}

=== "字 (漢字)"
    This indicates that there are other card(s) with the same kanji,
    but different reading.

    (TODO image)



---


# Interface

This indicator will be yellow (or blue on light mode) for new cards only.
After the first review, the indicator will be the same color as the default info circle (grey).


## Interface: New Cards

Just like with [Kanji Hover](kanjihover.md), new cards are greyed out.

(TODO image)


## Interface: Pitch Accents

Unlike Kanji Hover, pitch accents are automatically shown
(without having to hover over the word), to emphasize the importance
of different word pitches on similar words.

(TODO image)

## Interface: Open Card

Just like with Kanji Hover, you can click on the word to open the
specified card within Anki's card browser.

(TODO image)

---


# Refresh Button

TODO
- Connected with Kanji Hover: editing some other card shown in the results
    will not show due to cache
- pressing the refresh button on the info circle should fix


---

# Prefetching Results

TODO safe mode


