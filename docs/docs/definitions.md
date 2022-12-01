

TODO see the following pages instead:

* [UI Customization](uicustomization.md)
* [Field Reference](fieldref.md)
* [Yomichan Template Options](yomichantemplates.md)




# Overview

This page is dedicated to showcasing
how definitions (and other collapsable fields)
can be easily chosen, overwritten and customized overall.



# Summary of Dictionary Placement
Dictionaries from Yomichan are sorted into the following fields:

* `PrimaryDefinition`
* `SecondaryDefinition`
* `ExtraDefinitions`
* `UtillityDictionaries`


TODO write the template code for 2nd way of organizing
before attempting to flesh this section out


1. Primary, Bilingual, Monolingual (default)

    * `PrimaryDefinition`:
        A dictionary specified by the user.

    * `SecondaryDefinition`:
        All bilingual dictionaries outside of the one in `PrimaryDefinition`

    * `ExtraDefinitions`:
        All monolingual dictionaries outside of the one in `PrimaryDefinition`

2. Primary, Secondary, Extra

{% filter indent(4) %}
{{ feature_version("0.11.1.0") }}
{% endfilter %}

    * `PrimaryDefinition`:
        A dictionary specified by the user.

    * `SecondaryDefinition`:
        A second dictionary specified by the user.

    * `ExtraDefinitions`:
        All dictionaries outside of the one in `PrimaryDefinition` and `SecondaryDefinition`.

For both modes, `UtilityDictionaries` will contain
all traditionally-formatted dictionaries that
do not belong in any of the above categories
(in other words, does not provide the meaning of the word).
An example is the
[JMdict Surface Forms](https://github.com/FooSoft/yomichan/issues/2183) dictionary.

This does not include pitch accent dictionaries, frequency lists, or kanji dictionaries,
as these are not traditionally-formatted dictionaries.

To switch between the modes, TODO.

---


# Primary Definition: Automatic Selection
For both selection modes, the dictionary for the primary definition is the
first bilingual dictionary by default.
This can be changed to the first monolingual dictionary
by changing the following {{ YTCO }}:

{% raw %}
```handlebars
{{~! valid values: "bilingual", "monolingual" ~}}
{{~#set "opt-first-definition-type" "monolingual"}}{{/set~}}
```
{% endraw %}

---




# Selecting Dictionaries

## Primary Definition: Manual Selection
Sometimes, you may want to override the primary definition,
or highlight the definition that makes sense with the context.

By default, selecting (highlighting) the text **will do nothing**,
to prevent any unexpected errors from happening.
However, the user can set the following {{ YCTO }} to allow selecting text to override the
automatic dictionary selection behavior:

{% raw %}
```handlebars
{{~! options related to selected text ~}}
{{set "opt-selection-text-enabled" true}}
```
{% endraw %}

![type:video](assets/setupyomichan/selected_text.mp4)


Setting this option will enable the following behavior:

1. If nothing is selected, then the first dictionary is chosen just like normal.

1. If a dictionary is selected, then that dictionary will replace the first definition.

    To disable this, set `opt-selection-text-dictionary` to `false`.

1. If a section of text is selected, then that dictionary will replace the first definition.
    Additionally, that section of text will be highlighted (bolded).

    To disable this, set `opt-selection-text-glossary` to `false`.

    Additionally, if you do not want to use the entire dictionary, and prefer
    that *only* the selected text is shown in the first definition,
    then set `opt-selection-text-glossary-attempt-bold` to `false`.


    ??? info "Where automatic bolding can fail *(click here)*"

        Automatic bolding may not always work: if the highlighted text could not be automatically
        detected from the custom template code, then it will fallback to simply
        using the highlighted text (as if you used the `{selection-text}` marker).

        This is most likely to fail if you select formatted parts of text,
        such as (but not limited to):

        - line breaks
        - furigana
        - across multiple items in a list (common with JMdict)

    ??? info "Where dictionary selection can fail *(click here)*"

        This may occasionally select the wrong dictionary,
        but this only happens if the selected text also appears in a dictionary above the selected text.

        For example, suppose you have two bilingual dictionaries. and for the word タコ,
        you highlight the word "octopus" and create the card.
        Both bilingual dictionaries will list "octopus", so even if you highlight the word "octopus"
        in the second bilingual dictionary, only the first bilingual dictionary will be chosen.

        This is usually not a problem even if the same text appears in a dictionary above
        because it's the same definition regardless.
        Additionally, monolingual dictionaries almost never have the exact same definition for the same word.
        However, if you still want a specific dictionary, highlight the dictionary tag
        [as shown above](#overriding-a-dictionary).


---



## Secondary Definition Selection
{{ feature_version("0.11.1.0") }}

TODO

<!--
As said in the summary, the secondary definition is selected differently
to specify
-->

---

## Categorization of Dictionaries

TODO

<!--
As mentioned above, the template code will automatically separate
-->



# UI Options


## Hiding the first line of a definition
<sup>See also: [How to remove the numbers in the definition](#removing-the-numbers-in-the-primary-definition)</sup>



{% macro oubunsha_msg(css) -%}
The following {{ css }} only affects only the dictionary with the tag 「旺文社国語辞典 第十一版」. To use this on more than one dictionary, copy/paste the {{ css }} multiple times, and replace the dictionary tag.
{% endmacro %}

{% set css_oubunsha -%}{{ oubunsha_msg("CSS") }}{% endset %}
{% set scss_oubunsha -%}{{ oubunsha_msg("SCSS") }}{% endset %}



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
        {{ feature_version("0.11.0.0") }}

        {{ css_oubunsha }}

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

        {{ css_oubunsha }}

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

    ??? example "CSS to hide JMdict's dictionary tag *(click here)*"
        If you are on a modern version of JMdict, the dictionary will contain additional tags
        to the right of the dictionary tag by default, such as (n), (vs), etc.
        The instructions above will remove all of these tags.

        You may want to only remove the dictionary tag without removing the other information tags.
        If your JMdict dictionary tag is exactly `JMdict (English)`, then this is already the
        default behavior.
        However, if your dictionary tag is different, do the following
        (you may have to replace `JMdict` with your exact JMdict dictionary tag):

        1. Under `extra/style.scss`, add the following code:
            ```css
            /* removes the dictionary entry for jmdict */
            .glossary-text ol li[data-details="JMdict"] .dict-group__tag-list .dict-group__tag--dict {
              display: none;
            }
            /* Makes JMDict italic */
            .glossary-text ol li[data-details="JMdict"] .dict-group__tag-list {
              font-style: italic;
            }
            ```

        2. (Optional) Under `extra/field.scss`, add the following code:
            ```css
            /* greys out dictionary entry for jmdict */
            anki-editable ol li[data-details="JMdict"] .dict-group__tag-list .dict-group__tag--dict {
              color: var(--text-color--3);
            }
            /* Makes JMDict italic */
            anki-editable ol li[data-details="JMdict"] .dict-group__tag-list {
              font-style: italic;
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

        {{ scss_oubunsha }}

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
            The above examples are SCSS, and not CSS.
            If you are using CSS, do not flatten the classes after the first line.

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






## Removing the numbers in the primary definition

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




## Limiting number of dictionaries
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



## Automatically open collapsed fields

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

## Greyed out empty fields

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



