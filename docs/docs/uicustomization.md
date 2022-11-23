
This page showcases many examples on how you can customize the user interface to your liking.
As there are many examples that you likely won't use,
I recommend quickly scanning through this page to see if there is anything you would like
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





# Hiding the first line of a definition
<sup>See also: [How to remove the numbers in the definition](#removing-the-numbers-in-the-primary-definition)</sup>

The first line of the definition has various elements that can be hidden with {{ CSS }}.

=== "Nothing hidden (default)"
    <figure markdown>
      {{ img("", "assets/uicustomization/first_line_css/full.png") }}
    </figure>

    * Nothing is hidden. This is the default behavior.



=== "Hide extra text"
    <figure markdown>
      {{ img("", "assets/uicustomization/first_line_css/dict_tag_only.png") }}
    </figure>

    * This hides all the text to the right of the dictionary tag.

    ??? example "CSS to hide extra text *(click here)*"

        1. Under `extra/style.scss`, add the following code:

            ```css
            /* hide the text after the 「旺文社国語辞典 第十一版」 dictionary tag */
            .glossary-text ol li[data-details="明鏡国語辞典 第二版"] .dict-group__glossary--first-line {
              display: none;
            }
            ```

        2. (Optional) Under `extra/field.scss`, add the following code:

            ```css
            /* greys out the text after the 「旺文社国語辞典 第十一版」 dictionary tag */
            anki-editable ol li[data-details="明鏡国語辞典 第二版"] .dict-group__glossary--first-line {
              color: var(--text-color--3);
            }
            ```

=== "Hide dictionary tag"
    <figure markdown>
      {{ img("", "assets/uicustomization/first_line_css/right_text_only.png") }}
    </figure>

    * Removes only the dictionary tag.
        This doesn't look very good on most dictionaries.

    ??? example "CSS to hide dictionary tag(s) *(click here)*"
        {{ feature_version("0.11.0.0") }}

        1. Under `extra/style.scss`, add the following code:
            ```css
            /* hide the 「旺文社国語辞典 第十一版」 dictionary */
            ol li[data-details="旺文社国語辞典 第十一版"] .dict-group__tag-list {
              display: none;
            }
            ```

        2. (Optional) Under `extra/field.scss`, add the following code:
            ```css
            /* greys out the 「旺文社国語辞典 第十一版」 dictionary */
            anki-editable ol li[data-details="旺文社国語辞典 第十一版"] .dict-group__tag-list {
              color: var(--text-color--3);
            }
            ```

=== "Hide entire first line"
    <figure markdown>
      {{ img("", "assets/uicustomization/first_line_css/first_line_hidden.png") }}
    </figure>

    * Hides the entire first line.
        This is a combination of the last two,
        meaning it hides the dictionary tag and the text to the right.

    ??? example "CSS to hide the entire first line *(click here)*"
        {{ feature_version("0.11.0.0") }}

        1. Under `extra/style.scss`, add the following code:

            ```css
            /* hide the first line for the 「旺文社国語辞典 第十一版」 dictionary */
            .glossary-text ol li[data-details="明鏡国語辞典 第二版"] {
              .dict-group__tag-list, .dict-group__glossary--first-line, .dict-group__glossary--first-line-break {
                display: none;
              }
            }

            ```

        2. (Optional) Under `extra/field.scss`, add the following code:

            ```css
            anki-editable ol li[data-details="明鏡国語辞典 第二版"] {
              .dict-group__tag-list, .dict-group__glossary--first-line, .dict-group__glossary--first-line-break {
                display: none;
              }
            }
            ```

        !!! note
            The above examples are scss, and not css.
            If you are using css, do not flatten the classes after the first line.

            Example Raw CSS:

            ```css
            .glossary-text ol li[data-details="明鏡国語辞典 第二版"] .dict-group__tag-list {
              display: none;
            }
            .glossary-text ol li[data-details="明鏡国語辞典 第二版"] .dict-group__glossary--first-line {
              display: none;
            }
            .glossary-text ol li[data-details="明鏡国語辞典 第二版"] .dict-group__glossary--first-line-break {
              display: none;
            }
            ```

---




# Removing the numbers in the primary definition

Currently, I am not aware of an easy way to only remove the numbers if there is only one
item (and having them remain for multple definitions) with only CSS.

The following {{ CSS }} completely nukes the numbers regardless of how many items there are in the list.


??? example "Instructions *(click here)*"

    1. Under `extra/style.scss`, add the following code:

        ```css
        .glossary-text--primary-definition ol {
          list-style: none;
          padding-left: 0em;
        }
        ```

---





# Automatically open collapsed fields

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
    {{ img("", "assets/uicustomization/open_fields/closed.png") }}

=== "Using example config (new card)"
    {{ img("", "assets/uicustomization/open_fields/open.png") }}

=== "Using example config (non-new card)"
    {{ img("", "assets/uicustomization/open_fields/partially_open.png") }}


---

# Greyed out empty fields

Collapsable fields that are empty are usually not shown at all.
This {{ RTO }} allows them to be shown (but greyed out) when empty.
```json
{
  "greyed-out-collapsable-fields-when-empty": ...
}
```

=== "Empty fields greyed out (`true`)"
    {{ img("", "assets/uicustomization/greyed_out_fields/grey.png") }}

=== "Empty fields not shown (`false`, default)"
    {{ img("", "assets/uicustomization/greyed_out_fields/hidden.png") }}


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


# Limiting number of dictionaries
This {{ CSS }} allows you to limit the number of displayed dictionaries shown in "Extra Definitions".


??? example "Instructions *(click here)*"
    1. Under `extra/style.scss`, add the following code:

        ```css
        /* max 4 definitions shown */
        .glossary-text--extra-definitions ol li:nth-child(n+5) {
          display: none;
        }
        ```

    2. (Optional) Under `extra/field.scss`, add the following code:

        ```css
        /* max 4 definitions shown */
        anki-editable[field="ExtraDefinitions"] ol li:nth-child(n+5) {
          color: var(--text-color--3);
        }
        ```
        This will grey out the definitions past the 4th definition in the editor.


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

---






# Highlight the word within the tooltips
{{ feature_version("0.11.0.0") }}

The word within the sentences are not highlighted by default.
This {{ CSS }} allows said words to be highlighted.


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






# Conclusion
Outside of the user interface, the note has plenty of fields you can use
to further modify the card. Head over to the [Field Reference](fieldref.md) page to see just that.
