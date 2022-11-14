
Runtime options are card options that are applied globally to all JPMN cards.
This differs from binary fields,
as binary options are options that only affects the one note.

---

# Accessing & Editing

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


---


# Special Option Values

{{ feature_version("0.11.0.0") }}

All runtime options can take special values, which are always formatted as the following:

```json
{
  "type": "IDENTIFIER_STRING",
  // other options ...
},
```

For example, take any key-value pair, such as:
```json
"enabled": true,
```

This can be changed to:
```json
"enabled": {
  "type": "..."
  // other options...
},
```




<br>

## `pc-mobile` Type

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

??? examplecode "Example *(click here)*"

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

<br>

## `viewport-width-is` Type

The `viewport-width-is` type allows you to specify different values depending
on the screen width.
Note that the viewport width is read for each card flip.
This means that viewport width changes after resizing a window will not be detected,
and will only be updated when you flip the side or go to a new card.


This is formatted as the following:

```json
{
  "type": "viewport-width-is",
  "value": AN_INTEGER, // measured in pixels
  "greater": VALUE_FOR_GREATER, // the value used if the current width is greater than "value"
  "lesser": VALUE_FOR_LESSER // the value used if the current width is lesser than (or equal to) "value"
},
```

??? examplecode "Example *(click here)*"

    This will enable `pa-indicator-color-quotes`
    on screens that have a viewport width of 1300 pixels or less.

    ```json
    "pa-indicator-color-quotes": {
      "type": "viewport-width-is",
      "value": 1300,
      "greater": false,
      "lesser": true
    },
    ```

---


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

1.  If an error is saying that an option doesn't exist, just like for the above, ensure
    that the [runtime options file is updated](updating.md#updating-the-runtime-options-file).

    <!--
    If you are getting this error while compiling, also ensure that the
    [compile-time options file is updated](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/config/example_config.py).
    -->










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
    More information on modules can be found [here](modules.md).

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



