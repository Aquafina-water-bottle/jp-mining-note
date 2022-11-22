This page is dedicated to showcasing various aspects of the
common user interface.


# Summary
Most of the user interface is already shown off in the [GUI demo](/jp-mining-note/#demos){:target="_blank"},
and I would recommend watching it before continuing.

However, to dispell any mysteries, here is a fully annotated summary of the user interface.

{{ img("UI annotated summary", "assets/eg_fushinnsha_diagram.png") }}

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
      {{ img("info circle example", "assets/info_circle.gif") }}
      <figcaption>
        On hover, the info circle on the top left corner just shows some basic info.
        However, it also serves as a notification system to the user, when it has a color.
      </figcaption>
    </figure>

=== "Error"
    <figure markdown>
      {{ img("info circle error example", "assets/info_circle_error.gif") }}
      <figcaption>
        This should only appear when some javascript code fails.
        In other words, this should **not** appear under normal circumstances.
        If you get this without modifying the note in any way,
        please see [this section](faq.md#errors-warnings){:target="_blank"} for basic troubleshooting.
      </figcaption>
    </figure>

=== "Warning"
    <figure markdown>
      {{ img("info circle error example", "assets/info_circle_warning.gif") }}
      <figcaption>
        This serves to warn the user about something.
        It can appear without completely breaking the functionality of the card.
        In other words, you can choose to ignore it.
      </figcaption>
    </figure>

=== "Leech"
    <figure markdown>
      {{ img("info circle error example", "assets/info_circle_leech.gif") }}
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

{{ img("kanji hover demo", "assets/kanji_hover.gif") }}

You may have noticed that some results are greyed out.
These represent words from cards that have not been reviewed yet.
Conversely, as non-greyed out results come from cards that you have already reviewed,
they should represent words that you already know.

Additionally, pitch accents are also shown when you hover over a particular word
within the tooltip.
{{ bleeding_edge_only("0.11.0.0")}}

See [here](tooltipresults.md) for information on how the examples are chosen,
and how to customize it.

??? example "Related Programs *(click here)*"

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
- 漢 (short for 漢字) indicates that there are other card(s) with the same kanji, but different reading.

{{ img("same reading indicator eg", "assets/same_reading_indicator.gif") }}

As you can see from the above, the query ignores pitch accent.
The word 自身 is still shown, despite having a different pitch accent
compared to 地震.


<!--
This is a handy tool to help the user differentiate between words with the same readings.
One practical use case is verifying if your card is not a duplicate version of a previous card.
For example, if you have two cards 言いふらす and 言い触らす,
the indicator will show that both words exists, so you can safely suspend one of the cards.
-->

!!! note
    This indicator will be yellow (or blue on light mode) for new cards only.
    After the first review, the indicator will be the same color as the default info circle (grey).


Results are greyed out if the word is from a new card, just like for Kanji Hover.

See [here](tooltipresults.md) for information on how the examples are chosen,
and how to customize it.

---

# Images

See the [Images](images.md) page for information on the following:

* Blurring images
* Specifying default images
* Automatically formatting pictures within the definition

---

# Pitch Accent
See the [Pitch Accent](autopa.md) page for information on the following:

* Pitch accent notation
* Automatic pitch accent coloring

---



# External Links
{{ feature_version("0.10.3.0") }}

External links are shown as icons in the `Extra Info` collapsable field by default.
By default, hovering over them will show the url.
Click on the desired icon to visit to the desired site.

{{ img("external links demo", "assets/external_links.gif") }}

## External Links in Primary Definition
{{ feature_version("0.11.0.0") }}

If you wish to have the external links to be on the primary definition section,
set `external-links-position` to `"Primary Definition"`
in the {{ CTO_FILE }}.

??? example "Example image *(click here)*"
    {{ img("external links in primary definition", "assets/external_links_primary_def.png") }}


## Custom External Links
Custom external links can be specified under the `external-links` section
in the {{ CTO_FILE }}.

Creating external links is self explanatory and is explained further in the config file.
Additionally, some commented-out examples are provided within the file.

!!! note
    If you want to remove all external links, set `external-links` to `{}`.
    For example:
    ```
    "external-links": {},
    ```

## Icons With Multiple Text Characters

When using text instead of a picture, it is recommended that you use single characters
(e.g. one kanji) to represent the icon.

However, in the cases where you want to use more characters,
the default CSS rules causes the icon will use the minimum amount of space,
which may mis-aligned the surrounding icons.

??? example "Instructions on how to to adjust these icons *(click here)*"

    Using the [custom SCSS](customcss.md), you can specify
    the amount of space it takes (in terms of number of icons):

    ```scss
    @use "../base/common" as common;

    .glossary__external-links a[data-details="DICTIONARY_ID"] { // (1)!
      width: common.maxWidthForXIcons(2);
    }
    ```

    {% raw %}
    1.  The DICTIONARY_ID are the key values of `external-links`.
        For example, the id of the `jpdb.io` entry below is exactly `jpdb.io`.
        ```json
        "jpdb.io": {
            "icon-type": "image",
            "icon-image-light": "_icon_jpdb_lightmode.png",
            "icon-image-dark":  "_icon_jpdb_darkmode.png",
            "url": "https://jpdb.io/search?q={{text:Word}}"
        }
        ```
    {% endraw %}


    !!! warning
        This SCSS code is **NOT CSS**.
        This cannot be added directly to the template's style sheet in Anki.
        Please see the link above to see how to use custom SCSS.

    An example of this can be found in `src/scss/dictionaries/style.scss`

---



# Automatic Word Highlighting

{{ feature_version("0.11.1.0") }}

Usually, the word within the sentence is already bolded by Yomichan.
However, there are some cases where the word within the sentence may not be bold,
such as when external programs update the `Sentence` field, or if you are using
imported cards.

By default, the note attempts to highlight the word within the sentence.

With that being said, it is not uncommon that the automatic highlighting
fails to highlight the full word.
For example, verb and i-adj. conjugations are not highlighted whatsoever.
In order to keep the javascript lightweight, any improper highlighting
*is considered as expected behavior*, and will not be changed or fixed.
I recommend manually bolding the word if the word is incorrectly highlighted.

??? example "Examples *(click here)*"
    Any text in red is not highlighted automatically.
    They are considered as examples of when automatic highlighting doesn't work.

    {% filter indent(4) %}{{ gen_auto_word_highlight_table() }}{% endfilter %}


!!! note
    Much of the base code was taken from
    [Marv's implementation](https://github.com/MarvNC/JP-Resources#anki-automatically-highlight-in-sentence)
    of the same thing.


---


# Various UI Runtime Options

Various {{ RTO_FILE }} affect the user interface.
Some are documented below.


## Fix Ruby Positioning (For Legacy Anki Versions)
{{ feature_version("0.11.0.0") }}

If the furigana appears higher than normal on your card,
the following {{ RTO }} serves as a quick fix to lower the furigana:

```json
{
  "fix-ruby-positioning": ...
}
```

See the pictures below to compare between furigana positions.

=== "Higher than Normal"
    {{ img("", "assets/furigana/qt5.png") }}

=== "Quick Fix"
    {{ img("", "assets/furigana/quickfix.png") }}

=== "Normal"
    {{ img("", "assets/furigana/normal.png") }}


### Why this happens

There are a few reasons why this can happen:

1. Your Anki version is 2.1.49 or below.
1. Your Anki version is 2.1.50 and above, but using the older Qt5 version.
1. You are using AnkiMobile.

If you have this issue with the desktop version of Anki,
it is recommended that you update a version with Qt6 support.
This will allow the furigana to behave as expected.

If you are unable to do that for any reason, or you are using AnkiMobile,
this option serves as a quick *but imperfect* fix to make the furigana lower.
This fix is imperfect because it adds even more spacing to the left and right than normal
if the furigana text is too long.





<br>


## Automatically Open Collapsed Fields

Collapsed fields are collapsed by default.
These fields can be set to be automatically opened
under the following {{ RTO }}:

```json
{
  "modules": {
    "customize-open-fields": {
      ...
    }
  }
}
```

??? example "Example Config *(click here)*"
    ```json
    "customize-open-fields": {
      "enabled": false,

      // Force a field to be always open
      "open": [
        "Secondary Definition"
      ],

      // Opens the specified collapsable field if the card is new.
      "open-on-new-enabled": {
        "type": "pc-mobile",
        "pc": true,
        "mobile": false
      },

      "open-on-new": [
        "Extra Info"
      ]
    }
    ```

=== "Default"
    {{ img("", "assets/open_fields/closed.png") }}

=== "Using example config (new card)"
    {{ img("", "assets/open_fields/open.png") }}

=== "Using example config (non-new card)"
    {{ img("", "assets/open_fields/partially_open.png") }}


## Greyed Out Empty Fields

Collapsable fields that are empty are usually not shown at all.
This {{ RTO }} allows them to be shown (but greyed out) when empty.
```json
{
  "greyed-out-collapsable-fields-when-empty": ...
}
```

=== "Empty fields greyed out (`true`)"
    {{ img("", "assets/greyed_out_fields/grey.png") }}

=== "Empty fields not shown (`false`, default)"
    {{ img("", "assets/greyed_out_fields/hidden.png") }}




# Conclusion
Outside of the user interface, the note has plenty of fields you can use
to further modify the card. Head over to the [Field Reference](fieldref.md) page to see just that.


