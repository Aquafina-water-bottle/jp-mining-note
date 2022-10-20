
# Overview

After [building the note](building.md),
a new file `config/config.py` should appear.
The compile-time options can be found in this file.
To use these compile-time options, edit the `config.py` file,
and then re-build the note.


!!! warning
    Do not edit the `config/example_config.py` file.
    The example config file can be updated at any time,
    so if you update the example config, it may result in unnecessary merge conflicts.


## Optimized Vocab Card Example
An example set of compile-time options to create a more optimized vocab card is shown below.

??? examplecode "Vocab card compile-time options example"

    ```json
    "compile-options": {
        "keybinds-enabled": False,

        "hardcoded-runtime-options": True,

        "always-filled-fields": [],

        "never-filled-fields": [
            "PAShowInfo", "PATestOnlyWord", "PADoNotTest",
            "PASeparateWordCard", "PASeparateSentenceCard", "AltDisplayPASentenceCard",
            "SeparateClozeDeletionCard",
            "IsClickCard", "IsHoverCard", "IsSentenceCard", "IsTargetedSentenceCard",
        ],

        "enabled-modules": [
            # HIGHLY RECOMMENDED to have this enabled if you want a nice looking card
            # (unless you are not using images in your cards of course)
            "img-utils",

            #"sent-utils",
            #"kanji-hover",
            #"auto-pitch-accent",
            #"open_on_new",
        ],
    }
    ```


# Always filled & Never filled fields
{% raw %}
You can set a field to act as if it has always been filled, or it has never been filled,
using the `always-filled-fields` and `never-filled-fields` options.
This will remove the conditional Anki templates
(`{{#FIELD}}` and `{{^FIELD}}` markers) for the specified fields.


??? example

    If your `compile-options` is:

    ```
    "compile-options": {
        ...
        "always-filled-fields": ["A"],
        "never-filled-fields": ["B"],
        ...
    }
    ```

    and your card template is:
    ```
    {{#A}} A is filled {{/A}}
    {{^A}} A is not filled {{/A}}
    {{#B}} B is filled {{/B}}
    {{^B}} B is not filled {{/B}}
    {{#C}} C is filled {{/C}}
    {{^C}} C is not filled {{/C}}
    ```

    then upon card build, the resulting card template will be:
    ```
    A is filled
    B is not filled
    {{#C}} C is filled {{/C}}
    {{^C}} C is not filled {{/C}}
    ```
    {% endraw %}


This usually renders the actual field value useless. In other words, filling the field
for a note will have no effect on the cards.


!!! warning

    Do not delete the field from the fields list!
    See [here](modding.md#field-editing) for more details.




# Custom Runtime Options
The runtime options file (default: `config/jpmn_opts.jsonc`)
can be specified at build time.
It is highly recommended that you create your own runtime options file,
so you can edit the options at build time.

Here is how you can create and use a custom runtime options file:

1. Create the local runtime options file (e.g. `user_jpmn_opts.jsonc`)

    ```bash
    cd config
    cp jpmn_opts.jsonc user_jpmn_opts.jsonc
    ```

2. Change `opts-path` under `config/config.py`:

    ```
    "opts-path": "user_jpmn_opts.jsonc",
    ```

3. (optional) Make the runtime options hard-coded to remove the file dependency
    during runtime, by changing the following setting in `config/config.py`:
    ```
    "compile-options": {
        "hardcoded-runtime-options": True,
    }
    ```

4. Build and install the note as normal.

    !!! note

        If you are not using hard-coded runtime options
        and you have edited the contents of the local runtime options file,
        please run the installation script with `--install-options`
        to replace the existing options file in Anki's media folder.


# Custom External Links
{{ feature_version("0.10.3.0") }}

Custom external links can be specified under the `external-links` section.

Creating external links is self explanatory and is explained further in the config file.
Additionally, some commented-out examples are provided within the file.

If you want to remove all external links, do the following:
```
"external-links": {},
```

## Multiple Character Icons

When using text instead of a picture, it is recommended that you use single characters
(e.g. one kanji) to represent the icon.

However, in the cases where you want to use more characters,
the default CSS rules causes the icon will use the minimum amount of space,
which may mis-aligned the surrounding icons.

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





# Conclusion

Although compile-time options are useful for various simple tasks,
they may not give you everything you want.
See the [modding](modding.md) page to see how to make changes to your heart's content.





