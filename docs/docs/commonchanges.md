
# Fix Ruby Positioning (for legacy Anki versions)
{{ feature_version("0.11.0.0") }}

If the furigana appears higher than normal on your card,
the following {{ RTO }} serves as a quick fix to lower the furigana:

```json
{
  "fix-ruby-positioning": ...
}
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







# Adjusting Zoom
You can increase (or decrease) the size of the card,
(without affecting any of Anki's GUI)
with {{ C_CSS }}.


??? example "Instructions *(click here)*"
    1. Under `extra/style.scss`, add the following code:

        ```css
        :root {
          /* Times 1.1 of the original size.
           * If you want to make the note smaller, use a value below 1, like 0.9.
           */
          --zoom: 1.1;
        }
        ```

---



# Changing the display language
{{ feature_version("0.11.1.0") }}

By default, the display language is in English.
Currently, Japanese and English are supported as display languages.

To change the display language (say, to Japanese), use the following {{ CTO }}:
```
"display-languages": ["jp", "en"],
```

!!! note
    Currently, only some text is supported.
    This means that various tooltips on hover, warning messages, etc.
    will still be in English.

---


