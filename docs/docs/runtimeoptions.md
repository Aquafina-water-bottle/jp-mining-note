
Runtime options are card options that are applied globally to all JPMN cards.
This differs from binary fields,
as binary options are options that only affects the one note.

---

# Accessing & Editing

To access the runtime options, navigate to your profile's
[media folder](faq.md#where-is-the-x-folder-in-anki),
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

All runtime options are formatted as a key/value pair.
A simple example is the following:

```json
{
  // ...
  "kanjiHover.enabled": true,
  // ...
}
```

In the above example, the key is `kanjiHover.enabled`, whereas the value is `true`.

All runtime options can take special values, which are always formatted as the following:

```json
{
  "type": "IDENTIFIER_STRING",
  // potentially extra arguments in "args": { ... }
  "resultTrue": VALUE,
  "resultFalse": VALUE,
},
```

For example, we can change the above `kanjiHover.enabled` to use this special value,
with type type of `isMobile`:

This can be changed to:
```json
{
  "kanjiHover.enabled": {
    "type": "isPC",
    "resultTrue": true, // kanji hover is enabled on PC
    "resultFalse": false, // kanji hover is not enabled on non-PC devices, i.e. mobile
  },
}
```

A full list of special option types is shown below.




<br>

## `isMobile` and `isPC`

{{ feature_version("0.12.0.0") }}

The `isMobile` and `isPC` type allows you to specify different values depending if
you are using Anki on a mobile device, or PC (non-mobile).

```json
"key": {
  "type": "isMobile",
  "resultTrue": VALUE_IF_MOBILE,
  "resultFalse": VALUE_IF_PC,
},
```

`isPC` is the exact opposite of `isMobile`, and be used similarly.

```json
"key": {
  "type": "isPC",
  "resultTrue": VALUE_IF_PC,
  "resultFalse": VALUE_IF_MOBILE,
},
```

<br>



## `isiPhoneiPad`

TODO

<br>




## `viewportWidth`

{{ feature_version("0.12.0.0") }}

The `viewportWidth` type allows you to specify different values depending
on the screen width.
Note that the viewport width is read for each card flip.
This means that viewport width changes after resizing a window will not be detected,
and will only be updated when you flip the side or go to a new card.


This is formatted as the following:

```json
"key": {
  "type": "viewportWidth",
  "args": {
    "op": MATH_OP,
    "value": WIDTH,
  },
  "resultTrue": VALUE_IF_PC,
  "resultFalse": VALUE_IF_MOBILE,
},
```

TODO `MATH_OP` and `WIDTH`

<br>

## `cardType`

TODO

<br>



## `cardSide`

TODO

<br>




## `fieldsAllEmpty`

TODO

<br>




## `fieldsAllFilled`

TODO

<br>




## `fieldsAnyFilled`

TODO







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



