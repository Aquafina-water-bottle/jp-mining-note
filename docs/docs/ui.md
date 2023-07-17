This page is dedicated to showcasing various aspects of the
common user interface.


# Summary
Most of the user interface is already shown off in the [GUI demo](/jp-mining-note/#demos){:target="_blank"},
and I would recommend watching it before continuing.

However, to dispell any mysteries, here is a fully annotated summary of the user interface.

{{ img("UI annotated summary", "assets/fushinnsha/diagram.png") }}

Additional information on some parts of the UI is stated below.

---

# Keybinds
This note ships with some keybinds to do basic actions.

| Keybind | What it does |
|:-:|-|
| `p` { .smaller-table-row } | Play sentence audio                  { .smaller-table-row } |
| `w` { .smaller-table-row } | Play word audio                      { .smaller-table-row } |
| `8` { .smaller-table-row } | Toggles `Secondary Definition` field { .smaller-table-row } |
| `9` { .smaller-table-row } | Toggles `Additional Notes` field     { .smaller-table-row } |
| `0` { .smaller-table-row } | Toggles `Extra Definitions` field    { .smaller-table-row } |
| `[` { .smaller-table-row } | Toggles `Extra Info` field           { .smaller-table-row } |


See the {{ RTO_FILE }}
if you would like to edit / disable any keybind,
and/or to view the full list of keybinds.

---


# Info Circle

=== "Default"
    <figure markdown>
      {{ img("info circle example", "assets/info_circle/info.gif") }}
      <figcaption>
        On hover, the info circle on the top left corner just shows some basic info.
        However, it also serves as a notification system to the user, when it has a color.
      </figcaption>
    </figure>

=== "Error"
    <figure markdown>
      {{ img("info circle error example", "assets/info_circle/error.gif") }}
      <figcaption>
        This should only appear when some javascript code fails.
        In other words, this should **not** appear under normal circumstances.
        If you get this without modifying the note in any way,
        please see [this section](faq.md#errors-warnings){:target="_blank"} for basic troubleshooting.
      </figcaption>
    </figure>

=== "Warning"
    <figure markdown>
      {{ img("info circle error example", "assets/info_circle/warning.gif") }}
      <figcaption>
        This serves to warn the user about something.
        It can appear without completely breaking the functionality of the card.
        In other words, you can choose to ignore it.
      </figcaption>
    </figure>

=== "Leech"
    <figure markdown>
      {{ img("info circle error example", "assets/info_circle/leech.gif") }}
      <figcaption>
        When the card is a leech, the circle is highlighted yellow (or blue in light mode)
        to indicate that it is a leech.
        This is only shown on the back side of the card.
      </figcaption>
    </figure>




## Locking the Info Circle

{{ feature_version("0.10.3.0") }}

You can toggle (click on) the info circle to lock the tooltip in place.
This may be useful for copying/pasting errors and other debugging purposes.

---


# Kanji Hover
Kanji hover shows you if you have seen the kanji in previous cards or not.
This is useful if you want to check whether you have seen the reading
in a previous card, to differentiate between similar kanjis, etc.

By default, it searches for the kanji within the "Word" field,
within "JP Mining Note" types.

{{ img("kanji hover demo", "assets/ui/kanji_hover.gif") }}


**Various Details:**

* You may have noticed that some results are greyed out.
    These represent words from cards that have not been reviewed yet.
    Conversely, as non-greyed out results come from cards that you have already reviewed,
    they should represent words that you already know.

* Pitch accents are shown when you hover over a particular word
    within the tooltip. You can change this to always be shown in the {{ RTOs }}.

* You can click on the word to open the specified card within Anki's card browser.


See [here](tooltipresults.md) for information on how the examples are chosen,
and how to customize it.

??? example "Related Programs <small>(click here)</small>"

    [**Cade's Kanji Hover**](https://cademcniven.com/projects/kanjihover/)

    - Hover over a kanji to see its readings, meanings (english), and other info.
    - This does not show example words from other cards.
    - My implmentation of kanji hover was heavily inspired by this.


    [**Hanzi Web for Anki**](https://github.com/elizagamedev/anki-hanziweb)

    - The end result of this is to this note's implementation of kanji-hover,
        in the sense that it is used to see kanjis that have been used in other notes.
        However, it differs primarily in the fact that all the information must be
        mass-generated. This indeed has several advantages, such as being able to
        use the infomation on Android, where Anki-Connect isn't full supported.


    [**KanjiEater's Kanji Connections**](https://github.com/kanjieater/anki-plugin-heisigs-rtk)

    - Ability to show kanjis with heisig's RTK keywords, as well as related vocabulary.
        Similar to Hanzi Web for Anki.

    !!! warning
        None of the above will work with jp-mining-note by default.
        In fact, it's almost guaranteed that Cade's Kanji Hover will conflict with
        this note's kanji hover ability.




---

# Word Indicators
{{ feature_version("0.11.0.0") }}

Indicators will be shown to the top-left of the reading when similar words in your deck are found.
The indicators are as follows:

- 同 (short for 同じ) indicates that the card is a duplicate.
- 読 (short for 読み方) indicates that there are other card(s) with the same reading (ignoring pitch accent).
    In Japanese, these words are 同音異義語.
    I consider this the most useful of the three.
- 漢 (short for 漢字) indicates that there are other card(s) with the same kanji, but different reading.

{{ img("same reading indicator eg", "assets/ui/same_reading_indicator.gif") }}

As you can see from the above, the query ignores pitch accent.
The word 自身 is still shown, despite having a different pitch accent
compared to 地震.


!!! note
    This indicator will be yellow (or blue on light mode) for new cards only.
    After the first review, the indicator will be the same color as the default info circle (grey).

The tooltip behaves very similarly properties to Kanji hover's tooltip:

* New cards are greyed out.
* You can click on words to open them in Anki's card browser.
* Pitch accent is shown without requiring the user to hover over the word by default.
    This is different from Kanji hover's tooltip.

See [here](tooltipresults.md) for information on how the examples are chosen,
and how to customize it.

---

# Images & Pitch Accent

See the [Images](images.md) page for information on the following:

* Blurring images
* Specifying default images
* Automatically formatting pictures within the definition

See the [Pitch Accent](autopa.md) page for information on the following:

* Pitch accent notation
* Automatic pitch accent coloring
* How to override the pitch accent of any word

---


# External Links
{{ feature_version("0.10.3.0") }}

External links are shown as icons in the `Extra Info` collapsable field by default.
By default, hovering over them will show the url.
Click on the desired icon to visit to the desired site.

{{ img("external links demo", "assets/ui/external_links.gif") }}

See also: [UI Customization (External Links)](uicustomization.md#external-links).

---


# Conclusion
This page shows various aspects of the user interface, but says
little about actually modifying it.
Head over to the [UI Customization](uicustomization.md) page to see just that.


