
Runtime options are card options that are applied globally to all JPMN cards.
This differs from binary fields,
as binary fields are options that only affects the one card.

---

# Accessing & Editing

??? example "Video demo {{ CLICK_HERE }}"
    ![type:video](assets/runtimeoptions/open_rto.mp4)

To access the runtime options, navigate to your profile's
[media folder](faq.md#where-is-the-x-folder-in-anki),
and open the `_jpmn-options.js` file with your favorite text editor.

The contents of the file should look something like the following:
```javascript
window.JPMNOptions = {
  // Add your runtime options here.

  // ...

}
```

<!--
!!! note

    To open the file as a text file on Windows, right click the file and select `Edit`.
    Do not double-click the file.
-->

---

# Adding Options

You can add a runtime option anywhere between the two outer-most curly brackets.
For example:

```javascript
window.JPMNOptions = {
  // Add your runtime options here.

  "autoPitchAccent.coloredPitchAccent.enabled": true,
  // ...
}
```

!!! note
    You should only add options that you want to override.
    This is to allow the default options to change, which usually
    only happens if the old option is no longer valid due to implementation details.
    In the rare occasion that default options do change, they will be recorded under the
    [Setup Changes](setupchanges.md) page.

---

# Available options

All available options can be found in the
[runtime_opts.json5](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/dev/data/runtime_opts.json5)
file. (TODO not dev branch!)

You can safely copy/paste anything there (outside of `overrides`) into your runtime options file.

!!! warning
    This `json5` file is, strictly speaking, NOT an example configuration file.
    There are a few differences between the `runtime_opts.json5` file
    and the actual `_jpmn-opts.js` configuration file:

    1. `runtime_opts.json5` does not have the `window.JPMNOptions` variable set at the very top.
    2. `runtime_opts.json5` has an additional `overrides` key at the very bottom.
        This `overrides` key is an implementation detail, and should NOT be used anywhere in the true configuration file.

        The `overrides` key contains a dictionary that overrides the true value
        of the original key/value pair defined.
        For example,
        ```
        "kanjiHover.enabled": true,
        "overrides": {
            "kanjiHover.enabled": false,
        }
        ```

        renders in the built card as:
        ```
        "kanjiHover.enabled": false,
        ```


## Override Options
TODO link to tooltipresults? or visa versa?

There are a few option groups that can be used to override other options:

- `tooltips.overrideOptions.sentenceParser`
- `tooltips.overrideOptions.autoPitchAccent`
- `kanjiHover.overrideOptions.tooltips`
- `wordIndicators.overrideOptions.tooltips`

The tooltips internally use an instance of the sentence parser and auto pitch accent
modules to display the content.
However, one may want to display content differently in tooltips than in
the regular card.
If that is desired, these override options can be used to exactly define
what options are used by the internal
sentence parser, auto pitch accent and/or tooltips modules.




---


# Special Option Values

{{ feature_version("0.11.0.0") }}

All runtime options are formatted as a key/value pair.
A simple example is the following:

```json
"kanjiHover.enabled": true,
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
"kanjiHover.enabled": {
  "type": "isPC",
  "resultTrue": true, // kanji hover is enabled on PC
  "resultFalse": false, // kanji hover is not enabled on non-PC devices, i.e. mobile
},
```

A full list of special option types is shown below.
The source code for these can be found under
[src/ts/options.ts](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/dev/src/ts/options.ts).
(TODO not dev branch)





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




## `isiPhoneiPad`

TODO





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
  "resultTrue": ...,
  "resultFalse": ...,
},
```

TODO `MATH_OP` and `WIDTH`


## `viewportWidthBreakpoint`
{{ feature_version("0.12.0.0") }}

```json
"key": {
  "type": "viewportWidthBreakpoint",
  "args": {
    "op": MATH_OP,
    "value": BREAKPOINT_VAR,
  },
  "resultTrue": ...,
  "resultFalse": ...,
},
```

`BREAKPOINT_VAR` can be one of:

- `displaySentenceShrink`
- `displaySentenceRemoveNewlines`
- `maxWidthBackside` (tablet)
- `combinePicture` (mobile)


## `cardType`

TODO




## `cardSide`

TODO





## `fieldsAllEmpty`

TODO





## `fieldsAllFilled`

TODO





## `fieldsAnyFilled`

TODO







---


# Troubleshooting

TODO record specific errors

If you have any error, or an option is simply not working, please check the following:

1. If a runtime option is not working,
    or you get an error saying that an option doesn't exist,
    you may have an outdated option.
    Please check that your option is indeed recorded in the
    [available options](#available-options).



