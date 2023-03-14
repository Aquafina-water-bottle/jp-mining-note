
This page is dedicated to showcasing
how definitions can be easily chosen, overwritten and customized overall.


!!! note
    This page is primarily intended for monolingual dictionary users,
    as the sheer amount of possible monolingual dictionaries may require specific
    customizations for each individual dictionary.

---


# Dictionary Placement
This section deals with how the custom Yomichan Templates categorizes dictionaries,
and how to properly customize them for your setup.


## Expected Dictionary Placement
Dictionaries from Yomichan are sorted into the following fields:

* `PrimaryDefinition`:
    A dictionary specified by the user. Bilingual by default.

    This can be changed [in many different ways](#primary-definition-selection).

* `SecondaryDefinition`:
    All bilingual dictionaries outside of the one in `PrimaryDefinition`

* `ExtraDefinitions`:
    All monolingual dictionaries outside of the one in `PrimaryDefinition`

* `UtilityDictionaries`:
    All traditionally-formatted dictionaries that
    do not belong in any of the above categories
    (in other words, does not provide the meaning of the word).

    An example is the
    [JMdict Surface Forms](https://github.com/FooSoft/yomichan/issues/2183) dictionary

    !!! note
        This does not include pitch accent dictionaries, frequency lists, or kanji dictionaries,
        as these are not traditionally-formatted dictionaries.


The way that the dictionaries are sorted into the appropriate fields is by assigning
a category to each individual dictionary.


<br>

## Verifying Categories

You can check that your dictionaries are correctly categorized with the
`{jpmn-test-dict-type}` marker.
Under the Anki Templates code, replace `Card field` with `{jpmn-test-dict-type}` and press `Test`.

{{ img("checking dictionary categories", "assets/definitions/test_dictionary_categorization.gif") }}

An example output of the above (on the word 結構) is the following:
```
「旺文社国語辞典 第十一版」: monolingual
「明鏡国語辞典 第二版」: monolingual
「ハイブリッド新辞林」: monolingual
「新明解国語辞典 第五版」: monolingual
「デジタル大辞泉」: monolingual
「NHK日本語発音アクセント新辞典」: utility
「JMDict Surface Forms」: utility
「JMdict (English)」: bilingual
「JMdict (English)」: bilingual
「JMdict (English)」: bilingual
「JMdict (English)」: bilingual
「JMdict (English)」: bilingual
「新和英」: bilingual
```


If a dictionary is miscategorized,
you will have to edit `bilingual-dict-regex` or `utility-dict-regex`
at the top of the template code.
Monolingual dictionaries are considered to be dictionaries that aren't either
of the two above, so no handlebars code has to be changed if one were to
use more monolingual dictionaries.

To see how to edit the regex, go to [this section](#editing-the-dictionary-regex).


<br>

## Ignoring a Dictionary
If you want to see the dictionary on Yomichan but not have it show on Anki,
you can use the `ignored-dict-regex` option.

To see how to edit the option, see [the section below](#editing-the-dictionary-regex).

Conversely, if you want to not see the dictionary on Yomichan but want it to show up on Anki,
[see here](jpresources.md#hide-the-dictionary-but-allow-it-to-be-used-by-anki){:target="_blank"}.

!!! note
    It is recommended to not use this option, so you have as much information as possible
    within the note.
    If you wish to not see a dictionary, it might be easier to
    [collapse the dictionary](#collapsing-dictionaries).


<br>

## Editing the dictionary regex

To modify a regex string:

1. Determine the exact tag your dictionary has.
    To see this, take a word that has a definition in the desired dictionary, and test
    `{jpmn-test-dict-type}` like above.
    The string inside the quotes 「」 is exactly the tag of the dictionary.

2. Add the dictionary tag to the string, by replacing `ADD_x_DICTIONARIES_HERE`.
    For example, if your bilingual dictionary tag is `Amazing Dictionary`, change
    `ADD_BILINGUAL_DICTIONARIES_HERE` to
    `Amazing Dictionary`.

    If you want to add more than one dictionary, they have to be joined with the `|` character.
    For example, if you want to add the bilingual dictionaries
    `Amazing Dictionary` and `Somewhat-Okay-Dictionary`, change
    `ADD_BILINGUAL_DICTIONARIES_HERE` to
    `Amazing Dictionary|Somewhat-Okay-Dictionary`.

    {% raw %}
    For completeness, here is the modified line for the second example:
    ```handlebars
    {{~#set "bilingual-dict-regex"~}} ^(([Jj][Mm][Dd]ict)(?! Surface Forms)(.*)|新和英.*|日本語文法辞典.*|Amazing Dictionary|Somewhat-Okay-Dictionary)$ {{~/set~}}
    ```
    {% endraw %}

---




# Primary Definition Selection

## Automatic Selection (Bilingual or Monolingual)

The dictionary for the primary definition is the first bilingual dictionary
(that appears on Yomichan) by default.

This can be changed to the first monolingual dictionary by changing the following {{ YTCO }} to `monolingual`:

{% raw %}
```handlebars
{{~! valid values: "bilingual", "monolingual" ~}}
{{~#set "opt-first-definition-type" "monolingual"}}{{/set~}}
```
{% endraw %}

---


## Manual Selection
Sometimes, you may want to override the primary definition,
or highlight the definition that makes sense with the context.

By default, selecting (highlighting) the text **will do nothing**,
to prevent any unexpected errors from happening.
However, the user can set the following {{ YTCO }} to allow selecting text to override the
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






# Hiding the first line of a definition
<sup>See also: [How to remove the numbers in the definition](#removing-the-numbers-in-the-primary-definition)</sup>



{% macro oubunsha_msg(css) -%}
The following {{ css }} only affects only the dictionary with the tag 「旺文社国語辞典 第十一版」. To use this on more than one dictionary, copy/paste the {{ css }} multiple times, and replace the dictionary tag.
{% endmacro %}

{% set css_oubunsha -%}{{ oubunsha_msg("CSS") }}{% endset %}
{% set scss_oubunsha -%}{{ oubunsha_msg("SCSS") }}{% endset %}



The first line of the definition has various elements that can be hidden with {{ CSS }}.

=== "Nothing hidden (default)"
    <figure markdown>
      {{ img("", "assets/definitions/first_line_css/full.png") }}
    </figure>

    * Nothing is hidden. This is the default behavior.



=== "Hide extra text"
    <figure markdown>
      {{ img("", "assets/definitions/first_line_css/dict_tag_only.png") }}
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
      {{ img("", "assets/definitions/first_line_css/right_text_only.png") }}
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
      {{ img("", "assets/definitions/first_line_css/first_line_hidden.png") }}
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


## When HTML can break

TODO `opt-wrap-first-line-spans`

<br>

## Select dictionaries to remove the first line

TODO `opt-first-line-regex-mode` and `opt-first-line-dicts-regex`

{% raw %}
```
{{~set "opt-first-line-regex-mode" "except"~}}
{{~#set "opt-first-line-dicts-regex"~}} ^(JMdict.*|Nico/Pixiv)$ {{~/set~}}
```
{% endraw %}




---






# Removing the numbers in the primary definition

TODO image

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



<!--
## Collapsing dictionaries
{{ feature_version("0.12.0.0") }}

This allows you collapse dictionaries within the
Secondary Definition or Extra Definitions section.

TODO gif

??? example "Instructions *(click here)*"

    ```json
    {
      "modules": {
        "collapse-dictionaries": {
          "enabled": true,
          // ...
        }
      }
    }
    ```

!!! note

    There are many options for the above the above module,
    such as overriding what dictionaries should be collapsed or not.
    These will not be documented here, but will be documented in the
    runtime options file.

---

-->




# Exporting only one dictionary entry

A "dictionary entry" in this context is the single section of text corresponding to a
dictionary tag (with `Compact tags` turned off in Yomichan).

For example, recent version of the Yomichan JMdict dictionaries stores its definitions
as multiple entries.
It is almost never the case that monolingual dictionaries has multiple dictionary entries.
Instead, most monolingual dictionaries store the definition as one gigantic entry.

=== "Multiple Entries"
    TODO
=== "Only one entry"
    TODO


By default, all dictionary entries are exported in the primary definition.
However, if `opt-primary-def-one-dict-entry-only` is set to `true`,
then only the first (or [manually selected](#manual-selection)) dictionary entry
will be imported into the primary definition.

=== "Export all entries (default)"
    TODO

=== "Export one entry"
    TODO

    This uses the following option:
    {% raw %}
    ```handlebars
    {{~set "opt-primary-def-one-dict-entry-only" true ~}}
    ```
    {% endraw %}


---






# JMdict (Extra) Support

> `opt-jmdict-list-format`

TODO

This is an option because there are many version of JMdict Yomichan dictionaries,
so it is impossible to automatically detect whether you are using the extra version or not.

---






# Non-JPMN Options

!!! warning
    TODO not meant for people using jp-mining-note! The above allows you to do
    the exact same thing and more!

??? example "Reveal Non-JPMN Options *(click here)*"

    <h2>`opt__non-jpmn__stylize-glossary`</h2>

    - main option you absolutely want to set to `false` to ensure that the HTML format
        is virtually the same as the default

    - exceptions:
        - the dictionary and tags are not italicized, to prevent italic kanjis/kana from showing
        - the div that left aligns the text is not present
            - if this breaks your card, try surrounding your definition field, i.e. if your field name is `Definition`:
                {% raw %}
                ```html
                <div style="text-align: left"> {{Definition}} </div>
                ```
                {% endraw %}
        - dictionaries with only one entry be formatted as a list of one element by default
            - see the `opt__non-jpmn__one-dict-entry-only-no-list` option to disable this

    - invalidates `opt-wrap-first-line-spans` entirely, users must now rely on
        `opt__non-jpmn__remove-first-line-enabled`

    <h2>`opt__non-jpmn__one-dict-entry-only-no-list`</h2>

    - TODO

    <h2>`opt__non-jpmn__export-dictionary-tag`</h2>

    - whether the dictionary tag is exported or not

    <h2>`opt__non-jpmn__remove-first-line-enabled`</h2>

    - whether the first line of a dictionary is removed or not
    - uses the same options from the [first line removal section](#first-line-removal-when-html-can-break)












<!--
## Limiting number of dictionaries
As an alternative to the above, it is possible to simply remove the extra dictionaries
instead of collapsing them.


??? example "Instructions *(click here)*"
    Use the following {{ CSS }}:

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

-->





