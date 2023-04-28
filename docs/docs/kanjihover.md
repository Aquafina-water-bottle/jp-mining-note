Kanji Hover shows you if you have seen the kanji in previous cards or not.
This is useful if you want to check whether you have seen the reading
in a previous card, to differentiate between similar kanjis, etc.

Note that Kanji Hover does not search for words outside of your deck
of "JP Mining Note" types. This means if you have notes of any other type,
those notes will not be included in the resulting popup.

{{ img("kanji hover demo", "assets/ui/kanji_hover.gif") }}

# Interface

## Interface: New Cards

You may have noticed that some results are greyed out.
These represent words from cards that have not been reviewed yet.
Conversely, as non-greyed out results come from cards that you have already reviewed,
they should represent words that you already know.

(TODO image)


## Interface: Pitch Accents

Pitch accents are shown when you hover over a particular word
within the tooltip. You can change this to always be shown with
{{ rto("tooltips.displayPitchAccent") }}.

(TODO image)


## Interface: Sentence Search

If there are not enough results to display, the kanji is searched within the sentences of existing cards.

(TODO image)


## Interface: Open Card

You can click on the word to open the specified card within Anki's card browser.

(TODO image)

---

# Refresh Button
{{ feature_version("0.12.0.0") }}

TODO

- If editing `WordReading` field or some other card shown as the results,
    the changes will not show due to cache
- pressing the refresh button on the info circle + hovering over the kanji again
    should work


---

# Related Programs

!!! warning
    None of the above will work with jp-mining-note by default.
    In fact, it's almost guaranteed that Cade's Kanji Hover will conflict with
    this note's kanji hover ability, if placed directly in the word reading field.


## [Cade's Kanji Hover](https://cademcniven.com/projects/kanjihover/)

- Hover over a kanji to see its readings, meanings (english), and other info.
- This does not show example words from other cards.
- My implmentation of kanji hover was heavily inspired by this.


## [Hanzi Web for Anki](https://github.com/elizagamedev/anki-hanziweb)

- The end result of this is to JPMN's implementation of kanji hover,
    in the sense that it is used to see kanjis that have been used in other notes.
    However, it differs primarily in the fact that all the information must be
    mass-generated. This indeed has several advantages, such as being able to
    use the infomation on Android, where Anki-Connect isn't full supported.


## [KanjiEater's Kanji Connections](https://github.com/kanjieater/anki-plugin-heisigs-rtk)

- Ability to show kanjis with heisig's RTK keywords, as well as related vocabulary.
- Has stylization options to show maturity and difficulty (number of possible readings)
    for each individual kanji.


## [KanjiKeywordOverlay](https://github.com/fanatic84/KanjiKeywordOverlay)
- Shows kanji hover on info, based off of existing cards.
    Works similarly to KanjiEater's Kanji Connections add-on.


## [Anki-WaniKani-Hints](https://github.com/MattWeinberg24/Anki-WaniKani-Hints)
- Shows WaniKani information on kanji hover, which includes stories for radicals and pronunciations.


## [Glutanimate's Pop-up Dictionary](https://ankiweb.net/shared/info/153625306)
- An old add-on that searches highlighted text across all cards.
- Requires a download from file
- Also see
    [p1000's version](https://cdn.discordapp.com/attachments/778430038159655012/1086425849856790569/popup_dictionary.7z),
    which should work with jp-mining-note by default

