Throughout the documentation, you will likely run across the term
"runtime options" and "compile-time" options,
and be linked to this exact page.

Binary fields are options that can be set per card.
However, runtime options and compile-time options are card options that are applied globally
to every JPMN card.

The difference between runtime options and compile-time options is that
compile-time options require you to [build the note](building.md) on your machine
to use.
Runtime options can be accessed and changed without having to build the note.

---

# Runtime Options

## Accessing Runtime Options

To access the runtime options, navigate to your profile's
[media folder](faq.md#where-is-the-x-folder-in-anki){:target="_blank"},
and open the `_jpmn-options.js` file as a text file.

The contents of the file should look something like the following:
```javascript
var JPMNOpts = (function (my) {
  my.settings = {
    // ... (a bunch of settings)
  }
  return my;
}(JPMNOpts || {}));
```

!!! note

    To open the file as a text file on Windows, right click the file and select `Edit`.
    Do not double-click the file.

TODO add demo for windows to opening the file & editing






<!--
# Notation
TODO

- arrow indicates `{}` or `[]`
- option paths should ALWAYS be found in the example config file TODO link
- if you can't find the option in your file, ensure your options file is updated with the example config file


example:

> `modules` →  `img-utils` →  `add-image-if-contains-tags`

is placed under:

```
{
  "modules": [
    "img-utils": {
      "add-image-if-contains-tags": ...
    }
  ]
}
```
-->

<!--
Compile time options will be differentiated by using a `(C)` at the front.

TODO only use this notation if necessary...

> (C) `modules` →  `img-utils` →  `add-image-if-contains-tags`
-->





## Special Option Values

{{ feature_version("0.11.0.0") }}

All runtime options can take special values, which are always formatted as the following:

```json
{
  "type": "IDENTIFIER_STRING",
  // other options ...
},
```

Currently, the only type that exists is `pc-mobile`.


### `pc-mobile` Type

The `pc-mobile` type allows you to specify different values depending if
you are using Anki on a mobile device, or PC (non-mobile).

This is formatted as the following:

```json
{
  "type": "pc-mobile",
  "pc": VALUE_FOR_PC,
  "mobile": VALUE_FOR_MOBILE
},
```

??? examplecode "Example (TODO) *(click here)*"

    Take a sample key-value pair:
    ```json
    "enabled": true,
    ```

    The value can be changed to be `true` for PC, and `false` for mobile.

    ```json
    "enabled": {
      "type": "pc-mobile",
      "pc": true,
      "mobile": false
    },
    ```

---


<!--
# Options

I highly recommend going through this file and selecting the options that best fits your workflow.
As each setting is already documented in the file,
**the settings will not be documented here**.
Instead, a small number of hand selected settings will be showcased below,
to give you a taste of what is available.

TODO flesh out below


!!! note
    You may have noticed that most options are separated into groups within something called `modules`.
    This is an internal design choice to allow separation of code easier.
    More information on modules can be found [here](modding.md#custom-js-modules).

-->

<!--
## Modules
Many javascript heavy code are separated into modules by default.
These can be enabled and disabled at the user's will if the user
wants to sacrifice functionality for a slightly faster card.

Some examples include:

- kanji-hover
- [auto-pitch-accent](autopa.md)
- sent-utils (basic sentence processing)
- img-utils (basic image processing)

These modules likely also also have their own collection of settings
to modify the behavior of said module.
-->


# Compile-Time Options

## Accessing Compile-Time Options

To access the compile-time options, [build the note](building.md).

After building the note, a new file `config/config.py` should appear.
The compile-time options can be found in this file.

To use these compile-time options, edit the `config.py` file,
and then re-build the note.


!!! warning
    Do not edit the `config/example_config.py` file.
    The example config file can be updated at any time,
    so if you update the example config through git,
    it may result in unnecessary merge conflicts.




## Always filled & Never filled fields
{% raw %}
Using compile-time options,
one can set a field to act as if it has always been filled, or it has never been filled,
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


### Optimized Vocab Card Example
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
            "img-utils-minimal",
        ],
    }
    ```


# Troubleshooting

TODO record specific errors

If you have any error, or an option is simply not working, please check the following:

1. There are commas and double-quotes in the [correct places](https://www.json.org/json-en.html).

    ??? examplecode "Example *(click here)*"
        ```json
        "add-image-if-contains-tags": [
          {
            "tags": ["sample_tag"], // <-- HERE
            "file-name": "_sample_image.png"
          }, // <-- HERE
          {
            "tags": ["something", "something2"], // <-- HERE
            "file-name": "_contains_both_tags.png"
          }
        ], // <-- HERE

        // ...
        ```

1. If a runtime option is not working,
    ensure that the
    [runtime options file is updated](updating.md#updating-the-runtime-options-file).
    The option may have been renamed or repositioned.

1.  Similarily, if an error is saying that an option doesn't exist, ensure
    that the [runtime options file is updated](updating.md#updating-the-runtime-options-file).

    If you are getting this error while compiling, also ensure that the
    [compile-time options file is updated](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/config/example_config.py).





