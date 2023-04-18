External links are usually found under the `Extra Info` section of the note,
to the top right corner.

TODO image

Naturally, these can be customized to your liking.


---


# Customize external links
{{ feature_version("0.10.3.0") }}

Custom external links can be specified under the `externalLinks` section
in the {{ CTOs }}.

Creating external links is is explained in the config file,
and there are plenty of commented-out examples that should work.



## Removing all external links
If you want to remove all external links, set `externalLinks` to `{}`
in the {{ CTOs }}.

For example:
```json
"externalLinks": {},
```


## Icons with multiple text characters

When using text instead of a picture, it is recommended that you use single characters
(e.g. one kanji) to represent the icon.

However, in the cases where you want to use more characters,
the default CSS rules causes the icon will use the minimum amount of space,
which may mis-aligned the surrounding icons.

??? example "Fixing this with SCSS <small>(click here)</small>"

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


# External links in primary definition
{{ feature_version("0.11.0.0") }}

External links usually appear in the "Extra Info" section.
If you wish to have the external links to be on the primary definition section,
set `externalLinksPosition` to `"Primary Definition"`
in the {{ CTOs }}.

{{ img("external links in primary definition", "assets/uicustomization/external_links_primary_def.png") }}

