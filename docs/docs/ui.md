This entire section is dedicated to showcasing various aspects of the
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
        please see [this section](faq.md#errors){:target="_blank"} for basic troubleshooting.
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

# Same Reading Indicator
{{ feature_version("0.11.0.0") }}

When there are multiple words with the same reading in your Anki collection,
an indicator will be shown.

This is a handy tool to help the user differentiate between words with the same readings.
One practical use case is verifying if your card is not a duplicate version of a previous card.
For example, if you have two cards 言いふらす and 言い触らす,
the indicator will show that both words exists, so you can safely suspend one of the cards.


This indicator will be yellow (or blue on light mode) for new cards only.
After the first review, the indicator will be the same color as the default info circle (grey).

{{ img("same reading indicator eg", "assets/same_reading_indicator.gif") }}

As you can see from the above, the query ignores pitch accent.
The word 自身 is still shown, despite having a different pitch accent
compared to 地震.

Results are greyed out if the word is from a new card, just like for Kanji Hover.

See [here](tooltipresults.md) for information on how the examples are chosen,
and how to customize it.

---

# Word Pitch

Here is a (slightly modified) excerpt taken from the
[AJT Pitch Accent add-on page](https://ankiweb.net/shared/info/1225470483)
that explains the notation well:

!!! quote
    For more information on the Japanese pitch accent, I would like to refer you to
    [this wikipedia article](http://en.wikipedia.org/wiki/Japanese_pitch_accent).
    In short, the following notations can be found:

    - **Overline**: Indicates "High" pitch (see "Binary pitch" in Wikipedia article).
    - **Overline downstep**: usually means stressing the mora/syllable before.
    - **Red circle mark**: Nasal pronunciation.

        For example, げ would be a nasal け,
        and would represented as け<span class="nasal">°</span>.

    - **Blue color**: barely pronounced at all.

        For example, <span class="nopron">ヒ</span> would be closer to h than hi. <br>
        Likewise, <span class="nopron">ク</span> would be more like a k than ku.



## Colored Pitch Accent
<i><sup>Main page: [Auto Pitch Accent (Colored Pitch Accent)](autopa.md#colored-pitch-accent)</sup></i>

Pitch accent can already be set very easily by writing the position in `PAOverride`.
Moreover, the reading, word and pitch overline can be automatically colored
in Migaku style colors according to the main pitch accent groups.

This automatic coloring behavior is **disabled by default**,
and must be enabled in the {{ RTO_FILE }}:

??? examplecode "Enabling colored pitch accent *(click here)*"
    ```json
    "auto-pitch-accent": {
      "enabled": true, // (1)!
      "colored-pitch-accent": {
        "enabled": true,
        // ...
      }
      // ...
    }
    ```

    1.  The `auto-pitch-accent` module must be enabled to use colored pitch accent.

![type:video](assets/pa_override_color.mp4)

---

# Images

This note type allows you to do many things to images,
including blurring images, specifying default images, and
automatically formatting pictures within the definition.

See [this page](images.md) for more information on images.

---



# External Links
{{ feature_version("0.10.3.0") }}

External links are shown as icons in the `Extra Info` collapsable field by default.
Clicking on them will send you to the specified web page.

TODO gif demo with hover

## External Links in Primary Definition
{{ feature_version("0.11.0.0") }}

If you wish to have the external links to be on the primary definition section,
set `external-links-position` to `"Primary Definition"`.
in the {{ CTO_FILE }}.

TODO image


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

    Using the [custom SCSS](modding.md#custom-css), you can specify
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








# Options

(TODO)


## Fix Ruby Positioning (For Legacy Anki Versions)
{{ feature_version("0.11.0.0") }}

(TODO)

Runtime Options:

```
"fix-ruby-positioning": ...
```


TODO show comparison pictures between the two in various situations
(think image-blur side-by-side picture comparisons)

<br>


## Automatically Open Collapsed Fields

- TODO rename `fields` -> `sections` or something

(TODO)

Runtime Options:


```
"modules": {
  "customize-open-fields": {
    ...
  }
}
```


TODO gif

```
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


## Greyed Out Fields

Collapsable fields that usually aren't shown can be greyed out instead of completely disappearing.

This is configurable in the {{ RTO_FILE }}:
```
"greyed-out-collapsable-fields-when-empty": ...
```

=== "Greyed Out"
    {{ img("", "assets/fushinnsha/greyed_out_fields_grey.png") }}

=== "Not Shown (default)"
    {{ img("", "assets/fushinnsha/greyed_out_fields_hidden.png") }}





# Conclusion
Outside of the user interface, the note has plenty of fields you can use
to further modify the card. Head over to the [Field Reference](fieldref.md) page to see just that.


