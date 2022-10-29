
# Introduction
Throughout the documentation, you will likely run across the term "runtime options" mentioned,
and be linked to this exact page.

Binary fields are options that can be set per card.
However, runtime options are options that are applied globally
to every JPMN card.

!!! note
    This is called "runtime options" to differentiate between
    [compile-time options](building.md#technical-summary),
    which are also options that are applied globally.


## Accessing the Options

To access the options, navigate to your profile's
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

All options can take special values, which are always formatted as the following:

```json
{
  "type": "IDENTIFIER_STRING",
  // other options ...
},
```

Currently, the only type that exists is `pc-mobile`.


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

??? examplecode "Example (TODO) *(click here)*"
    The following specifies something to be enabled only on PC.

    This returns `true` for PC, and `false` for mobile.

    ```json
    "enabled": {
      "type": "pc-mobile",
      "pc": true,
      "mobile": false
    },
    ```

---


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


## Greyed out fields

> `greyed-out-collapsable-fields-when-empty`

??? example "Example (TODO) *(click here)*"

    TODO picture comparisons empty fields / empty fields but greyed out

<br>



## Automatically Open Collapsed Fields

> `modules` →  `customize-open-fields`

??? example "Example (TODO) *(click here)*"

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

<br>







## Add Image on Specific Tags
{{ feature_version("0.11.0.0") }}

> `modules` →  `img-utils` →  `add-image-if-contains-tags`


??? example "Example (TODO) *(click here)*"

    ```
    "add-image-if-contains-tags": [
      {
        "tags": ["青春ブタ野郎・LN1"],
        "file-name": "_青春ブタ野郎-LN1.png"
      }
    ],
    ```

    TODO example gif

<br>



## Fix Ruby Positioning (on Legacy Anki Versions)
{{ feature_version("0.11.0.0") }}

> `fix-ruby-positioning`

??? example "Example (TODO) *(click here)*"

    TODO show comparison pictures between the two in various situations
    (think image-blur side-by-side picture comparisons)

<br>




## Colored Quotes Instead of PA Indicator
> `modules` →  `sent-utils` →  `pa-indicator-color-quotes`

TODO picture comparisons between word PA indicator in quotes / word PA with PA indicator

---



# Troubleshooting
If you have any error, or an option is simply not working, please check the following:

1. There are commas and double-quotes in the correct places.

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

2. If an option is not working,
    ensure that the
    [options file is updated](updating.md#updating-the-runtime-options-file).
    The option may have been renamed.



