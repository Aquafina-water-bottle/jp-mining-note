# Design Decisions

# PC Template Design Decisions

- everything should be available to the user even for words with very long definitions
    - the definitions are below everything specifically due to that
    - potential issue: people who speed through cards
    - potential solution: use theme
- front side has no guarantee to be consistent
    - thus, for vocab cards, the word is repeated again below the line
    - similarly, for sentence cards, the sentence is repeated again
    - also see: cardtypes.md
- word and pitch accent are on separate lines
    - because both can expand very far to the left/right
- minimize vertical space taken from word info / image
    - if certain elements are removed, can result in an uneven shape
    - however, this is preferable over an even shape because it minimizes vertical space
    - TODO option to have a consistent shape?


## Mobile Template Design Decisions

- make definition show up ASAP, i.e. by the first quarter of the screen
    - this means elements that were previously above the definition on the PC version, like the audio buttons, image, and sentence, is now below the definition

    - unfortunately, putting the sentence above the definition can easily take up a lot of room
        - the limited space for mobile users makes placing the definition above the sentence
            actually more important, otherwise the sentence can easily push down the bulk of the definition
            (and thus you must scroll to see the definition)
        - comes at the cost of potentially not being able to see the sentence without scrolling
    - the image is small by design
        - otherwise, will take up too much room or will require scrolling to see
        - goal is to always be able to immediately see the image on card flip

- mobile-friendly interface
    - replace collapsible sections with tabs for easier mobile navigation
    - prevents unnecessary scrolling



---


# `Comment` field
Similarly to the `Key` field, this field will not be used in any card template.
In other words, this is a place where you can write down notes without affecting the card itself.
I personally like using this field to test handlebars from Yomichan.

This is named `Comment` in reference to comments in code (comments do not change
the execution of the code).

---


<!--

# Fix Ruby Positioning <small>(for legacy Anki versions)</small> { #fix-ruby-positioning }
{{ feature_version("0.11.0.0") }}

If the furigana appears higher than normal on your card,
the following {{ RTO }} serves as a quick fix to lower the furigana:

```json
"fixRubyPositioning.enabled": true,
```

See the pictures below to compare between furigana positions.

=== "Higher than Normal"
    {{ img("", "assets/uicustomization/fixruby/qt5.png") }}

=== "Quick Fix"
    {{ img("", "assets/uicustomization/fixruby/quickfix.png") }}

=== "Normal"
    {{ img("", "assets/uicustomization/fixruby/normal.png") }}


## Why this happens

There are a few reasons why this can happen:

1. Your Anki version is 2.1.49 or below.
1. Your Anki version is 2.1.50 and above, but using the older Qt5 version.
1. You are using AnkiMobile.

If you have this issue with the desktop version of Anki,
it is recommended that you update a version with Qt6 support.
This will allow the furigana to behave as expected.

If you are unable to do that for any reason, or you are using AnkiMobile,
this option serves as a quick *but imperfect* fix to make the furigana lower.
This fix is imperfect because it adds even more spacing to the left and right than normal
if the furigana text is too long.

---

-->


# Remove the "(N/A)" on cards with no pitch accents
{{ feature_version("0.11.0.0") }}

If the word has no pitch accent, the pitch accent is usually displayed as `(N/A)`.
This indicator can be removed with the following {{ CSS }}:

```css
.dh-left__word-pitch-text:empty:before {
  content: ""
}
```

---





# Removing the furigana on the word reading

TODO image

The following {{ CSS }} removes the furigana on the word reading, while keeping
the furigana on the kanjis within hover.

```css
.dh-left__reading > ruby > rt {
  display: none;
}
```

---




# Changing colors
Most color changes can be done by simply editing a CSS variable.
These variables are shown at the very top of the main CSS sheet.
For example, the following changes the main accent color of the card:

```css
:root {
  --accent: #ff1fd1; /* hot pink */
}

.night_mode {
  --accent: #ff7777; /* light red */
}
```

!!! note
    To change any variable color for dark mode, you cannot use `:root`, even if you are only setting
    the color for night mode. You must use `.night_mode`.

    For example, doing the following will NOT change the accent for night mode:
    ```css
    :root {
      /* only changes light mode accent, and will NOT change dark mode accent! */
      --accent: #ff7777;
    }
    ```

    You must do this instead:
    ```css
    /* changes the color for both light and dark mode */
    :root {
      --accent: #ff7777;
    }
    .night_mode {
      --accent: #ff7777;
    }
    ```

---


# Removing the word / sentence at the top of the back side

{{ feature_version("0.12.0.0") }}

=== "Hidden tested content"
    TODO image
=== "Shown tested content <small>(default)</small>"
    TODO image

For users who are only using one card type
(e.g. only vocab cards with no sentence cards, TSCs, or anything else),
it might be better to remove the tested content and the line below it.

The tested content is shown at the back by default to allow the user to differentiate
between card types on both sides of the card.
However, this take up extra vertical space which is unnecessary if you are only using one card type.
This can be hidden with the following {{ CSS }}:

```css
.jpmn--back > .card-main .expression-wrapper {
  display: none;
}
.jpmn--back > .card-main .answer-border {
  display: none;
}
```






<!--
This page showcases many examples on how you can customize the user interface to your liking.
As there are many examples that you likely won't use,
I recommend quickly skimming through this page to see if there is anything you would like
your note to do.

!!! note
    * If you want to change something for a card-per-card basis, see the [Field Reference](fieldref.md) page.
    * These customizations make heavy use of {{ RTOs }} and {{ C_CSS }}.
-->


# Mobile Unbolded Text

By default, most text that would be bolded on desktop is unbolded in mobile.
This is because the bolded text makes the kanji feel much more squished together,
especially on Android where the custom bold font cannot be used.
Additionally, the bolded text is still highlighted in the accent color of the note,
so the text still stands out compared to other text.

If you want to bold the text again, use the following {{ CSS }}:

(TODO link to extra/style.scss and all)

```
@media (max-width: 620px) {
  :root {
    --bold-font-weight: bold;
  }
}
```

