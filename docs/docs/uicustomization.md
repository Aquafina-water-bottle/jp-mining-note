
This page showcases many examples on how you can customize the user interface to your liking.
As there are many examples that you likely won't use,
I recommend quickly skimming through this page to see if there is anything you would like
your note to do.

!!! note
    * If you want to change something for a card-per-card basis, see the [Field Reference](fieldref.md) page.
    * These customizations make heavy use of {{ RTOs }} and {{ C_CSS }}.

---

# Fix Ruby Positioning (for legacy Anki versions)
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
    {{ img("", "assets/uicustomization/fixruby/qt5.png") }}

=== "Quick Fix"
    {{ img("", "assets/uicustomization/fixruby/quickfix.png") }}

=== "Normal"
    {{ img("", "assets/uicustomization/fixruby/normal.png") }}


## Why this happens

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

---






# External Links

---

## External links in primary definition
{{ feature_version("0.11.0.0") }}

External links usually appear in the "Extra Info" section.
If you wish to have the external links to be on the primary definition section,
set `external-links-position` to `"Primary Definition"`
in the {{ CTO_FILE }}.

{{ img("external links in primary definition", "assets/uicustomization/external_links_primary_def.png") }}

---


## Customize external links
{{ feature_version("0.10.3.0") }}

Custom external links can be specified under the `external-links` section
in the {{ CTO_FILE }}.

Creating external links is self explanatory and is explained further in the config file.
Additionally, some commented-out examples are provided within the file.


??? info "Remove all external links *(click here)*"
    If you want to remove all external links, set `external-links` to `{}`
    in the {{ CTO_FILE }}.

    For example:
    ```
    "external-links": {},
    ```

??? info "Icons with multiple text characters *(click here)*"

    When using text instead of a picture, it is recommended that you use single characters
    (e.g. one kanji) to represent the icon.

    However, in the cases where you want to use more characters,
    the default CSS rules causes the icon will use the minimum amount of space,
    which may mis-aligned the surrounding icons.


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


# Adjusting Zoom
You can increase (or decrease) the size of the card,
(without affecting any of Anki's GUI)
with {{ C_CSS }}.


??? example "Instructions *(click here)*"
    1. Under `extra/style.scss`, add the following code:

        ```css
        :root {
          /* Times 1.1 of the original size.
           * If you want to make the note smaller, use a value below 1, like 0.9.
           */
          --zoom: 1.1;
        }
        ```

---


# Limiting number of frequencies
This {{ CSS }} allows you to limit the number of frequencies shown at the top right corner.

??? example "Instructions *(click here)*"
    1. Under `extra/style.scss`, add the following code:

        ```css
        /* max 5 frequencies shown */
        .frequencies div.frequencies__group:nth-child(n+6) {
          display: none;
        }
        ```

    2. (Optional) Under `extra/field.scss`, add the following code:

        ```css
        /* max 5 frequencies shown */
        anki-editable[field="FrequenciesStylized"] div.frequencies__group:nth-child(n+6) {
          color: var(--text-color--3);
        }
        ```
        This will grey out the frequencies past the 5th frequency in the editor.


??? example "TODO: ONLY VERSION `0.11.1.0` and over, NOT RELEASED YET"
    By default, a maximum of 4 frequencies are shown.
    Any more frequency list entries will appear in a dropdown arrow
    to the right of the frequencies.

    You can edit the following {{ RTO }} to adjust this number:
    ```json
    {
      "modules": {
        "freq-utils": {
          "max": 4
        }
      }
    }
    ```


---



# Changing the display language
{{ feature_version("0.11.1.0") }}

By default, the display language is in English.
Currently, Japanese and English are supported as display languages.

To change the display language (say, to Japanese), use the following {{ CTO }}:
```
"display-languages": ["jp", "en"],
```

!!! note
    Currently, only some text is supported.
    This means that various tooltips on hover, warning messages, etc.
    will still be in English.

---



# SentenceReading Furigana Options

By default, the furigana for the full sentence (on the back side of the card) is shown on hover.
The following options change how the furigana is displayed.

<br>

## SentenceReading: When to show furigana

{{ feature_version("0.11.1.0") }}

By default, furigana is shown on hover.
This can be changed to only be shown on click, or always/never shown.


=== "On click"
    TODO gif: show on click

    ??? example "Instructions *(click here)*"
        Change the following {{ CTO }}:

        ```json
        "full-sentence-ruby": {
            "display-mode": "click",
        }
        ```

        This is commonly paired with the [hide furigana spacing](#sentencereading-hide-spacing) option,
        so furigana does not impede with the sentence whatsoever until toggled.


=== "On hover (default)"
    TODO gif: show on hover

    This is the default behavior.

    ??? example "Instructions *(click here)*"
        Change the following {{ CTO }}:

        ```json
        "full-sentence-ruby": {
            "display-mode": "hover",
        }
        ```

=== "Always revealed"
    TODO gif: static with mouseover

    This is not recommended, because you should
    not be relying on furigana to understand Japanese.

    ??? example "Instructions *(click here)*"
        Change the following {{ CTO }}:

        ```json
        "full-sentence-ruby": {
            "display-mode": "always",
        }
        ```

=== "Never revealed"
    TODO gif: static with mouseover

    If you are looking to not see furigana at all, feel free to use this option.
    However, I personally recommend toggling on click instead of removing furigana completely.

    ??? example "Instructions *(click here)*"
        Change the following {{ CTO }}:

        ```json
        "full-sentence-ruby": {
            "display-mode": "never",
        }
        ```



<br>


## SentenceReading: Hide spacing

{{ feature_version("0.11.1.0") }}

Furigana that extends past the length of the kanji will add additional spacing around the kanjis,
which is unpleasant for some people to look at.

One solution to this is to simply hide the spacing until hover or click.
This has the unintentional consequence where kanjis can potentionally change position, or overflow
into the next line.
There is also a possibility that the entire sentence shifts over a bit to the left
due to (what I think is a) chromium based bug[^1].

[^1]: 
    See \#4 in the [minor visual bugs list](https://github.com/Aquafina-water-bottle/jp-mining-note/issues/1).


=== "Hide Spacing"
    TODO img

    ??? example "Instructions *(click here)*"
        Change the following {{ CTOs }}:

        ```json
        "full-sentence-ruby": {
            "fill-mode": "font-size",
            "fill-mode-font-size-transition": True,
        }
        ```


=== "Hide spacing with no transition"
    TODO img

    ??? example "Instructions *(click here)*"
        Change the following {{ CTOs }}:

        ```json
        "full-sentence-ruby": {
            "fill-mode": "font-size",
            "fill-mode-font-size-transition": False,
        }
        ```


=== "Keep spacing (default)"
    TODO img

    This is the default behavior.

    ??? example "Instructions *(click here)*"
        Change the following {{ CTO }}:

        ```json
        "full-sentence-ruby": {
            "fill-mode": "opacity",
        }
        ```


!!! note
    All of the examples above are shown with furigana on hover.
    They will also work with furigana on click.



---











# Highlight the word within the tooltips
{{ feature_version("0.11.0.0") }}

Within the tooltips, the word is not highlighted by default.
This {{ CSS }} allows the words to be highlighted within the sentence.


=== "Highlighted"
    {{ img("", "assets/uicustomization/tooltip/highlighted.png") }}


=== "Not Highlighted (default)"
    {{ img("", "assets/uicustomization/tooltip/not_highlighted.png") }}


??? example "Instructions *(click here)*"

    1. Under `extra/style.scss`, add the following code:

        ```css
        .hover-tooltip .hover-tooltip__sent-div b {
          font-weight: bold;
          color: var(--accent);
        }
        ```

---


# Remove the "(N/A)" on cards with no pitch accents
{{ feature_version("0.11.0.0") }}

If the word has no pitch accent, the pitch accent is usually displayed as `(N/A)`.
This indicator can be removed with the following {{ CSS }}:

??? example "Instructions *(click here)*"

    1. Under `extra/style.scss`, add the following code:

        ```css
        .dh-left__word-pitch-text:empty:before {
          content: ""
        }
        ```

---




# Keeping and removing newlines within the display sentence
{{ feature_version("0.11.1.0") }}

You can add newlines to the `Sentence` field to make the full sentence
field have cleaner line breaks.
If you do this, you will need to regenerate the `SentenceReading`
field if you are using furigana.

However, these newlines are automatically removed from the display sentence
if the width of the screen is determined to be too small.
To override this option, you can use the following {{ C_CSS }}:

??? example "Instructions *(click here)*"

    === "Keep all newlines"

        1. Under `extra/style.scss`, add the following code:

            ```css
            .expression .expression-inner br {
              display: inline !important;
            }
            ```

    === "Remove all newlines"

        1. Under `extra/style.scss`, add the following code:

            ```css
            .expression .expression-inner br {
              display: none !important;
            }
            ```

    === "Remove all newlines when AltDisplay is not used"

        This only removes newlines when the `AltDisplay` (or `AltDisplayPASentenceCard`)
        field is not being used as the display sentence.

        1. Under `extra/style.scss`, add the following code:

            ```css
            .expression .expression-inner br {
              display: inline !important;
            }

            .expression .expression-inner:not(.expression-inner--altdisplay) br {
              display: none !important;
            }
            ```

---





# Removing the furigana on the word reading

The following {{ CSS }} removes the furigana on the word reading, while keeping
the furigana on the kanjis within hover.

??? example "Instructions *(click here)*"

    1. Under `extra/style.scss`, add the following code:

        ```css
        .dh-left__reading ruby rt {
          display: none;
        }
        .hover-tooltip__word-div ruby rt {
          display: block;
        }
        ```

---




# Changing colors
Most color changes can be done by simply editing a CSS variable.
These variables are shown at the very top of the main CSS sheet.
For example, the following changes the main accent color of the card:

??? example "Instructions *(click here)*"

    1. Under `extra/style.scss`, add the following code:

        ```css
        :root {
          --accent: #ff1fd1; /* hot pink */
        }

        .night_mode {
          --accent: #ff7777; /* light red */
        }
        ```

    !!! note
        To change any variable color for dark mode, you cannot use `:root`, even if you are only setting
        the color for night mode. You must use `.night_mode`.

        For example, doing the following will NOT change the accent for night mode:
        ```css
        :root {
          /* only changes light mode accent, and will NOT change dark mode accent! */
          --accent: #ff7777;
        }
        ```

        You must do this instead:
        ```css
        /* changes the color for both light and dark mode */
        :root {
          --accent: #ff7777;
        }
        .night_mode {
          --accent: #ff7777;
        }
        ```

---


# Removing the word / sentence at the top of the back side

{{ feature_version("0.11.1.0") }}

For users who are only using one card type
(e.g. only vocab cards with no sentence cards, TSCs, or anything else),
it might be better to remove the tested content and the line below it.

The tested content is shown at the back by default to allow the user to differentiate
between card types on both sides of the card.
However, this take up extra vertical space which is unnecessary if you are only using one card type.

??? example "Instructions *(click here)*"

    Use the following {{ CSS }}:

    1. Under `extra/style.scss`, add the following code:

        ```css
        .card-main--back .expression-wrapper {
          display: none;
        }
        ```

---




# Conclusion
Outside of the user interface, the note has plenty of fields you can use
to further modify the card. Head over to the [Field Reference](fieldref.md) page to see just that.
