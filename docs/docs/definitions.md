
This page is dedicated to showcasing
how definitions can be easily chosen, overwritten and customized overall.


<!-- No longer true?
!!! note
    This page is primarily intended for monolingual dictionary users,
    as the sheer amount of possible monolingual dictionaries may require specific
    customizations for each individual dictionary.
-->

---


# Dictionary Placement

<!--
This section deals with how the custom Yomichan Templates categorizes dictionaries,
and how to properly customize them for your setup.


## Expected Dictionary Placement
-->

Dictionaries from Yomichan are sorted into the following fields:

<!--
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

    Some examples include:

    - [JMdict Forms](https://github.com/Aquafina-water-bottle/jmdict-english-yomichan)
    - [JMedict](https://github.com/Aquafina-water-bottle/jmdict-english-yomichan)

    !!! note
        This does not include pitch accent dictionaries, frequency lists, or kanji dictionaries,
        as these are not traditionally-formatted dictionaries.

-->


| Field | Description |
|-|-|
| PrimaryDefinition | The highest priority monolingual or bilingual dictionary (depending on the value of `opt-first-definition-type`). If you want to manually select a different dictionary, see [here](definitions.md#primary-definition-selection) |
| SecondaryDefinition | All bilingual dictionaries outside of the one selected in the primary definition. |
| ExtraDefinition | All monolingual dictionaries outside of the one selected in the primary definition. |
| UtilityDictionaries | All dictionaries that fall outside the category of bilingual or monolingual. For example, [JMnedict](https://github.com/Aquafina-water-bottle/jmdict-english-yomichan) or [JMdict Forms](https://github.com/Aquafina-water-bottle/jmdict-english-yomichan). |

The way that the dictionaries are sorted into the appropriate fields is by assigning
a category to each individual dictionary.



## Verifying Categories

You can check that your dictionaries are correctly categorized with the
`{jpmn-test-dict-type}` helper.
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



## Ignoring a Dictionary
If you want to see the dictionary on Yomichan but not have it show on Anki,
you can use the `ignored-dict-regex` option.

To see how to edit the option, see [the section below](#editing-the-dictionary-regex).

Conversely, if you want to not see the dictionary on Yomichan but want it to show up on Anki,
[see here](jpresources.md#hide-the-dictionary-but-allow-it-to-be-used-by-anki).



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
    `Amazing Dictionary` and `Amazing-Dictionary-2`, change
    `ADD_BILINGUAL_DICTIONARIES_HERE` to
    `Amazing Dictionary|Amazing-Dictionary-2`.

---




# Primary Definition Selection
The primary definition can either be selected automatically, or manually via highlighting
the dictionary name or a section of the definition.


## Primary Definition Selection: Automatic
The dictionary for the primary definition is the first bilingual dictionary
(that appears on Yomichan) by default.

This can be changed to the first monolingual dictionary by changing the following {{ YTCO }} to `monolingual`:

{% raw %}
```handlebars
{{~! valid values: "bilingual", "monolingual" ~}}
{{~set "opt-first-definition-type" "monolingual" ~}}
```
{% endraw %}

TODO re-record with only automatic


## Primary Definition Selection: Manual

TODO re-record with only manual

Sometimes, you may want to override the primary definition,
or highlight the definition that makes sense with the context.

This is enabled by default.
In case you want to disable this behavior, set `opt-selection-text-enabled` to `false`.

![type:video](assets/setupyomichan/selected_text.mp4)


This manual selection behavior does the following:

1. If nothing is selected, then the first dictionary is chosen just like normal.

1. If a dictionary is selected, then that dictionary will replace the first definition.

    To disable this, set `opt-selection-text-dictionary` to `false`.

1. If a section of text is selected, then that dictionary will replace the first definition.
    Additionally, that section of text will be highlighted (bolded).

    To disable this, set `opt-selection-text-glossary` to `false`.

    Additionally, if you do not want to use the entire dictionary, and prefer
    that *only* the selected text is shown in the first definition,
    then set `opt-selection-text-glossary-attempt-bold` to `false`.


## When Manual Selection Fails

In an ideal world, we would have access to exactly what dictionary was selected from
the handlebars. For example, a handlebars function could tell us if the n'th dictionary
was highlighted.
Unfortunately, we do not live in this ideal world, so we must get this information manually.

The handlebars algorithm runs thusly:

- If the selected text exactly matches any dictionary in the exported definition,
    then the dictionary entry is selected as the primary definition.
- Otherwise, we do the same search as the above, except we search through every dictionary's HTML (in Yomichan's order) for the selected text.
- If the selected text was found in some dictionary, then that dictionary is chosen.
    Otherwise, we fallback to the selected text itself.

Due to us having to find the information ourselves,
there are many edge-cases where this algorithm fails.

<!--
Although this may sound perfectly fine, the highlighted text is searched specifically
from the generated HTML of the definitions.
Additionally, the highlighted text is itself plaintext, and cannot store
any highlighted HTML.
In the case that automatic bolding fails, the highlighted text itself is simply used instead.
-->

<!--### 1. Selecting formatted text { #selecting-formatted-text}-->
<!--### 2. Same selected text appearing in multiple dictionaries { #same-selected-text-appearing-in-multiple-dictionaries }-->
<!--### 3. Selected text in HTML markup { #selecting-text-in-html-markup}-->

1. **Selecting formatted text**

    If you select formatted parts of text then automatic bolding will fail.
    An incomplete list of of formatted sections is shown below:

    ??? example "Line breaks"
        Line breaks cannot be properly captured by the selected text.

        === "Incorrect"
            <figure markdown>
            {{ img("", "assets/definitions/highlight_fail/toomaki_incorrect.png") }}
            </figure>
        === "Correct"
            <figure markdown>
            {{ img("", "assets/definitions/highlight_fail/toomaki_correct.png") }}
            </figure>

    ??? example "Furigana"
        Just like line breaks, furigana cannot be properly captured by the selected text.

        === "Incorrect"
            <figure markdown>
            {{ img("", "assets/definitions/highlight_fail/kinngyo_incorrect.png") }}
            </figure>
        === "Correct"
            <figure markdown>
            {{ img("", "assets/definitions/highlight_fail/kinngyo_correct.png") }}
            </figure>

    ??? example "List Items <small>(common with JMdict)</small>"
        Avoid highlighting multiple items in a list if you want automatic bolding to work.

        === "Incorrect"
            <figure markdown>
            {{ img("", "assets/definitions/highlight_fail/mirenn_incorrect.png") }}
            </figure>
        === "Correct"
            <figure markdown>
            {{ img("", "assets/definitions/highlight_fail/mirenn_correct.png") }}
            </figure>

2. **Same selected text appearing in multiple dictionaries**

    Manual selection may occasionally select the wrong dictionary,
    but this only happens if the selected text also appears in a dictionary above the selected text.

    For example, suppose you have two bilingual dictionaries. and for the word 蛸,
    you highlight the word "octopus" and create the card.
    Both bilingual dictionaries will list "octopus", so even if you highlight the word "octopus"
    in the second bilingual dictionary, only the first bilingual dictionary will be chosen.

    ??? example "Example: 蛸"
        <figure markdown>
        {{ img("", "assets/definitions/highlight_fail/tako.png") }}
        </figure>

    This is usually not a problem even if the same text appears in a dictionary above,
    because you'll be seeing the same definition regardless.
    However, if you still want a specific dictionary, highlight the dictionary tag
    [as shown above](#primary-definition-selection-manual).


3. **Selected text in HTML markup**

    There are very rare edge cases when the highlighted text can be found
    in the internal HTML markup, leading to invalid HTML and (almost certainly)
    the incorrect definition.

    ??? example "Example: 垣根"

        On the word 垣根, if you have the デジタル大辞泉 dictionary before JMdict
        in Yomichan and you highlight `border`,
        then デジタル大辞泉 will be incorrectly selected as the primary definition.

        <figure markdown>
        {{ img("", "assets/definitions/highlight_fail/kakine.png") }}
        </figure>

        <figure markdown>
        {{ img("", "assets/definitions/highlight_fail/kakine_def.png") }}
        </figure>

        This is due to a perfect storm of events:

        * Due to Yomichan's implementation details, definitions with images contain a
        `border` property in an internal style attribute.
        * デジタル大辞泉 indeed has images for the word 垣根.
        * デジタル大辞泉 is ordered before JMdict in Yomichan

        With all these three combined, デジタル大辞泉 is prioritized over JMdict,
        leading to an incorrect dictionary selected and invalid HTML.

        <figure markdown>
        {{ img("", "assets/definitions/highlight_fail/kakine_html.png") }}
        </figure>

## Usage on Yomichan's Search Page / Clipboard Page

On Yomichan's Search Page or Clipboard Page, the word is usually highlighted within the
example sentence when searching for the word. For example, the word 「人里離れた」 is highlighted
in the following image:

<figure markdown>
  {{ img("", "assets/yomichan/search_page_highlight.png") }}
</figure>

This highlighted word interferes with the definition selector used by the handlebars,
and may cause unexpected definitions to be selected as the primary definition instead.

In order to fix this, you have a few different options:

- Simply don't use the search page or clipboard page. Instead, you can use a
    [texthooker setup](setuptextmedia.md#getting-the-text-to-create-the-cards).
- Create a new Yomichan profile that matches the desired page(s),
    and disable `Selected matching text` within your new profile in the Yomichan settings.
    If you must use the search page or clipboard page,
    this is the recommended way to deal with the issue,
    as it has minimal impact on the rest of your workflow.
- Ensure you always manually select something in the definition.
- Simply disable the `opt-selection-text-glossary` handlebars option completely.

??? info "Explanation {{CLICKHERE}}"
    Under normal circumstances, i.e. within an embedded popup,
    the selected text in a sentence does not interfere with the handlebars, because the selected
    text is not within the popup itself.
    However, within the search page / clipboard page, the sentence and its selected text is found
    directly within the page itself.

    Internally, the handlebars to get the selected text cannot distinguish between whether the
    text is selected within a definition or somewhere else.
    As mentioned before, the handlebars has no way of actually knowing which dictionary entry
    or dictionary is selected, and must use [this algorithm](#when-manual-selection-fails)
    to search for the correct entry.
    With these two combined, **the selected text within the sentence is used to search the definition**.
    This may be especially confusing to see for people who remove
    the first line of monolingual dictionaries,
    because it is usually the first line of monolingual dictionaries that is matched and bolded.



<!--
This automatic bolding may not always work: if the highlighted text could not be automatically
detected from the custom template code, then it will fallback to simply
using the highlighted text (as if you used the `{selection-text}` helper).

This is most likely to fail if you select formatted parts of text,
such as (but not limited to):

- line breaks
- furigana (including subscripted or superscripted text)
- across multiple items in a list (common with JMdict)



## Where dictionary selection can fail

-->

---






# Simplifying the Definition

If you use a monolingual dictionary, there is usually a bunch of extra information in the first line.
Additionally, there is usually only one dictionary entry, making the list number redundant.
Both of these can be automatically hidden with the following {{ RTO }}:

```json
"blockquotes.simplifyDefinitions.enabled": true,
```

=== "Simple"
    {{ img("", "assets/definitions/simple_def/simple.png") }}
=== "Default"
    {{ img("", "assets/definitions/simple_def/normal.png") }}



## Simpifying the definition per blockquote

By default, if the above option is enabled,
all definitions within the Primary Definition, Secondary Definition
and Extra Definitions blockquotes are simplified.
One can grant finer control to only simplify definitions within these particular blockquotes:

```json
// Remember to enable this so the options can be used!
"blockquotes.simplifyDefinitions.enabled": true,

// The following controls precisely whether the simplifying definition is enabled
// or not for each block.
"blockquotes.simplifyDefinitions.primaryDefinition.enabled": true,
"blockquotes.simplifyDefinitions.secondaryDefinition.enabled": true,
"blockquotes.simplifyDefinitions.extraDefinitions.enabled": true,
```

<!--
TODO find examples that this is useful for...

## Card-by-Card Control

For some cards, this might not be valid. For example, consider the following definition:

> TODO example with redirect

Fortunately, you can force the first line of the definition to show by
adding the `line-show` tag to the card.

TODO image with tag, figure markdown

Similarly, if you want to show the list for a particular card,
you can add the `list-show` tag to the card.

TODO image with both tags.
-->


<!--


## CSS Simplifying Options


TODO is this necessary?


There are many ways to control exactly what content is removed, and in what way.


=== "Hide entire first line"
    <figure markdown>
      {{ img("", "assets/definitions/first_line_css/first_line_hidden.png") }}
    </figure>

    * Hides the entire first line.
        This is a combination of "Hide extra text" and "Hide dictionary tag",
        meaning it hides the dictionary tag and the text to the right.

    ??? example "CSS to hide the entire first line for all dictionaries <small>(click here)</small>"
        {{ feature_version("0.11.0.0") }}

        1. Under `extra/style.scss`, add the following code:

            === "CSS"
                ```css
                /* hide the first line for the all dictionaries */
                .glossary-text ol li .dict-group__tag-list {
                  display: none;
                }
                .glossary-text ol li .dict-group__glossary--first-line {
                  display: none;
                }
                .glossary-text ol li .dict-group__glossary--first-line-break {
                  display: none;
                }
                ```

            === "SCSS"
                ```css
                /* hide the first line for the all dictionaries */
                .glossary-text ol li {
                  .dict-group__tag-list, .dict-group__glossary--first-line, .dict-group__glossary--first-line-break {
                    display: none;
                  }
                }
                ```

        2. (Optional) Under `extra/field.scss`, add the following code:

            ```css
            anki-editable ol li {
              .dict-group__tag-list, .dict-group__glossary--first-line, .dict-group__glossary--first-line-break {
                display: none;
              }
            }
            ```


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

    ??? example "CSS to hide extra text <small>(click here)</small>"
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

    ??? example "CSS to hide dictionary tag(s) <small>(click here)</small>"

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

    ??? example "CSS to hide JMdict's dictionary tag <small>(click here)</small>"
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

-->


## Removing the first line: Algorithms Discussion

There are plenty of ways to remove the first line within the definition.
In order to better understand how these handlebars work as well as its pitfalls,
pretty much all possible options are listed below.

1. **Remove the first line completely, using Handlebars.**

    Advantanges:

    -   The biggest advantage this has is the exported definition is as clean and
        minimalistic it can possibly be.

    Disadvantages:

    -   This can lead to invalid HTML, because Handlebars does not expose
        a HTML parser. Additionally, removing the first line completely will
        remove info from the export.

1. **Use JavaScript within the note template to remove the first line.**

    Advantages:

    - No special handlebars are particularly required in order for this method to work,
        i.e. default handlebars can usually do the trick.
    - All info is present / not lost.
    - Anki's card reviewer is based off a web browser, so the JavaScript has access
        to a html parser. In other words, html should remain valid.
    - This approach should theoretically work on previously exported cards.

    Disadvantages:

    - The JavaScript algorithm must assume the definition is of a particular
        HTML structure, i.e. all `<ol>` elements contain a list of definitions.
        This is problematic if the user edits the field, as they can change it to
        pretty much whatever they want.
    - Javascript must be ran, which will slow down card loads.
    - This is not immediately portable between note types,
        because the JS must be copied/pasted for each note type.
    - If the user decides that they want to include the first line,
        it will likely be non-trivial to do so.
        Editing the raw HTML may be required to simply specify whether the
        first line should be removed or not.

1. **Wrap the first line with some HTML, using Handlebars.**

    Advantages:

    - This does not require JS to be run at all; Only special CSS has to be used.
        Note that internally, some extra JS is actually run in order to further filter
        between dictionaries (`blockquotes.simplifyDefinitions.dictsOverride.hideFirstLineMode`).
        However, this JS is faster than the above option, because the JS only adds CSS classes
        to particular elements, and does not do any string or HTML parsing.
    - All info is present / not lost.
    - This algorithm is relatively simple to implement.
    - Including the first line is slightly more intuitive compared to the 2nd option:
        Delete the `<li>` node and create a fresh node.

    Disadvantages:

    - Just like the first option, this can lead to invalid HTML.
    - This is technically not immediately portable, because the CSS must be copied/pasted for each note type.
    - This solution will not work on older cards exported with different handlebars, i.e. handlebars
        that do not wrap the first line.

    This is currently the chosen method for this note, primarily due to speed, no info loss and simplicity.
    The second option may be implemented in the future as a fallback, or for special case handling
    for specific dictionaries.



## When HTML can break
{{ feature_version("0.12.0.0") }}

As mentioned in the algorithms discussion, the method used by this note can lead to invalid HTML.
This is because the resulting HTML is parsed with regex in order to match that first line.
In computer science, it is recommended that
[you should not parse HTML with regex](https://stackoverflow.com/a/1732454),
because it is mathematically impossible to fully describe and parse HTML with regex.
Unfortunately, Yomichan's handlebars does not expose any HTML parser,
so we are left with using regex to parse our HTML.
Due to this, an unexpected dictionary format may cause the resulting export to
be invalid HTML.

If you do not plan on using this feature, you should set `opt-wrap-first-line-spans` to `false`
to remove the possibility of invalid HTML.


## Hide the first line for select dictionaries
{{ feature_version("0.12.0.0") }}

The following two options are useful if you want to ignore certain problematic dictionaries,
that do not play well with the regex above.

{% raw %}
```handlebars
{{~set "opt-first-line-regex-mode" "except"~}}
{{~#set "opt-first-line-dicts-regex"~}} ^(JMdict.*|Nico/Pixiv)$ {{~/set~}}
```
{% endraw %}

`opt-first-line-dicts-regex` specifies the list of dictionaries that should be ignored or kept.
Whether the dictionaries are ignored or kept is defined in `opt-first-line-regex-mode`
(`except` means that the specified dictionaries are ignored, and `only` means that only the
specified dictionaries can have their first lines removed.)

---








# Exporting only one dictionary entry

A "dictionary entry" in this context is the single section of text corresponding to a
number indicated by Yomichan, to the very far left.

In the following example, 旺文社国語辞典 第十一版 and 明鏡国語辞典 第二版 each have one single entry,
corresponding to `1` and `2` respectively.
`JMdict (English)` has two entries, corresponding to `3` and `4`.

<figure markdown>
{{ img("", "assets/definitions/fugou.png") }}
</figure>

As you may have noticed, it is almost never the case that monolingual dictionaries has
multiple dictionary entries.
Instead, most monolingual dictionaries store the definition as one gigantic entry.


<!--
A "dictionary entry" in this context is the single section of text corresponding to a
dictionary tag (with `Compact tags` turned off in Yomichan).

For example, recent version of the Yomichan JMdict dictionaries stores its definitions
as multiple entries.
It is almost never the case that monolingual dictionaries has multiple dictionary entries.
Instead, most monolingual dictionaries store the definition as one gigantic entry.
-->

By default, all dictionary entries are exported in the primary definition.
However, if `opt-primary-def-one-dict-entry-only` is set to `true`,
then only the first (or [manually selected](#manual-selection)) dictionary entry
will be imported into the primary definition.

=== "Export all entries <small>(default)</small>"
    {{ img("", "assets/definitions/fugou_multiple.png") }}

=== "Export one entry"
    {{ img("", "assets/definitions/fugou_single.png") }}

---






# Legacy JMdict Support

By default, JMdict is exported in a list format,
which allows the note's CSS to re-compact the list.
This is required over plaintext, because
[JMdict Extra](https://github.com/Aquafina-water-bottle/jmdict-english-yomichan)
cannot compact export a compact definition normally.
This is a [known issue](https://github.com/FooSoft/yomichan/issues/2297) with Yomichan's
default handlebars.

If you prefer using a legacy version of JMdict and prefer a full line of plaintext
instead of a CSS list, you can set `opt-jmdict-list-format` to `false`.









<!--
## Limiting number of dictionaries
As an alternative to the above, it is possible to simply remove the extra dictionaries
instead of collapsing them.


??? example "Instructions <small>(click here)</small>"
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





