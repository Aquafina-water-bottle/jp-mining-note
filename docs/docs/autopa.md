

This page is dedicated to explaining the details of the `auto-pitch-accent` module.
If you want a quick summary of how to set the the pitch accent in the card,
see the [usage page](usage.md#modifying-pitch-accent).


<!--
TODO link some videos / resources on what pitch accent even is
-->


# How Pitch Accent is Selected

Pitch accent is selected based on the following priority:

## (1) `PAOverride` number
- format is any integer (i.e. `0`, `1`, `3`, etc.)
    - represents mora on which the downstep happens (`0` means no downstep / 平板)
- `-1` sets the downstep to be right before the last mora
    - other negative numbers won't work (`-1` is a special number for the 起伏 pattern)
- primary way to set/override the pitch accent

## (2) `PAOverride` raw text
- set to whatever you want to be displayed
- example is the 不審者 example card (TODO picture)

## (3) `PAPositions` field
- first bolded text found this will be chosen
- otherwise first pitch in first dictionary is chosen
- this is usually the pitch that is shown on cards

## (4) `AJTWordPitch` field
- occasionally, pitch accent info not found in your Yomichan dictionaries can show up
  in the auto-generated `AJTWordPitch` field
- in this case, as there is no other option, `AJTWordPitch` field is used

!!! note
    If the module is disabled in [options file](runtimeoptions.md){:target="_blank"},
    the displayed pitch accent will be exactly what is shown in `AJTWordPitch` (or `PAOverride`).

# How the Reading is Selected
- AJT word pitch by default
    - can include devoiced and nasal info
    - usually katakana with long vowel marks
        - some words don't have long vowel marks (i.e. adjectives ending with 〜しい will be displayed as 〜シイ and not 〜シー)
    - ajt word reading must match the reading found in `WordReading`, otherwise this field is ignored
        - some pre-processing is done to turn this reading into hiragana to be properly searched


Otherwise, the card uses the reading from `WordReading` in katakana.
This reading can be changed to hiragana, katakana, or katakana with long vowel marks
in [options file](runtimeoptions.md){:target="_blank"}:

```
"auto-pitch-accent": {

  // 0: hiragana
  // 1: katakana
  // 2: katakana with long vowel marks
  "reading-display-mode": 1,

  ...
}
```



# Colored Pitch Accent

The reading, word and pitch overline can be automatically colored
in Migaku style colors.
This automatic coloring behavior is **disabled by default**,
and must be enabled in the [options file](runtimeoptions.md){:target="_blank"}:

```
"colored-pitch-accent": {
  "enabled": true,

  ...
}
```
![type:video](assets/pa_override_color.mp4)

!!! note

    The 起伏 pattern is not automatically detected.
    To use this color, you must manually set the `PAOverride` field to `-1`.

## Colored Pitch Accent Summary

| Anki Tag  | 日本語 | Example              | Reading      |
|: ------- :|: ---- :|: ------------------ :|: ---------- :|
| heiban    | 平板   | 自然 {.pa-heiban}    | しぜん￣     |
| atamadaka | 頭高   | 人生 {.pa-atamadaka} | じ＼んせい   |
| nakadaka  | 中高   | 弱点 {.pa-nakadaka}  | じゃくて＼ん |
| odaka     | 尾高   | 道具 {.pa-odaka}     | どうぐ＼     |
| kifuku    | 起伏   | 驚く {.pa-kifuku}    | おどろ＼く   |


## Position Selection
In most all cases, the position should be automatically found
and the word can be colored.
However, there are two cases where the position cannot be automatically calculated:

1. `PAPositions` is not filled, but `AJTWordPitch` is.
2. `PAOverride` is a non-integer value.


## Override Colors
To manually set the color, the main way (as described above) is by manually setting `PAOverride`
to the correct number number.
However, if you are using a non-integer value in `PAOverride` to override the entire display,
you must add the correct tag to your note.

The exact tags that can be used are shown in the
[summary table](autopa.md#colored-pitch-accent-summary) above,
under the `Anki Tag` and 日本語 sections.
For example, the tag can be `heiban`, `平板`, etc.



!!! note

    The tag *only* overrides the pitch accent color, and does not affect the pitch
    accent representation itself.

    This fact can be useful for certain exceptions,
    such as how 通る is [1] instead of [2].
    If you want to use the 起伏 pattern on 通る, you will have to set
    the `PAOverride` value to `1`, and then add the `起伏` tag.

    TODO image of above (without tag, with tag)




# Pitch Accent Styling Details

- TODO outdated
- TODO only if you care about the exact text value
- TODO what bold does


Editing the content in `WordPitch` requires some special attention.
To preserve the style and get expected results, you must use `Ctrl + Shift + x` when editing the field,
and edit the html tags directly. Use other cards as examples of what the html should look like.

TODO more details + example (華)

- TODO replace with positions :eyes:

example of something that has all possible formats (bold, overline, downstep, nasal, devoiced)
```html
チュ<span style="text-decoration:overline;" class="pitchoverline">ーカ<span class="nasal">°</span></span><span class="downstep"><span class="downstep-inner">ꜜ</span></span><span class="nopron">ク</span>セイ<b>・チュ<span style="text-decoration:overline;" class="pitchoverline">ーカ<span class="nasal">°</span><span class="nopron">ク</span></span><span class="downstep"><span class="downstep-inner">ꜜ</span></span>セイ</b>
```


The `WordPitch` field may have more than one pitch accent for a given word.
To choose which pitch accent is correct to the sentence,
one can bold the unused pitch accents to grey them out.


<figure markdown>
{{ img("word pitch with bolded field to grey out", "assets/bold_pa.png") }}
</figure>



## Bolding the last downstep

{{ img("word pitch ", "assets/downstep_not_bolded.png", 'align=right width="300"') }}

- TODO doesn't work by default with basic `ctrl+b` attempts
- seems to be a weird quirk with css injector
- only solution I know of atm is to edit the raw html and move the `</b>` to the very end of the html


previous:
```html
<span style="text-decoration:overline;" class="pitchoverline">ナ</span><span class="downstep"><span class="downstep-inner">ꜜ</span></span>サケ<b>・ナ<span style="text-decoration:overline;" class="pitchoverline">サケ</span></b><span class="downstep"><span class="downstep-inner">ꜜ</span></span>
```

after editing the raw html:
```html
<span style="text-decoration:overline;" class="pitchoverline">ナ</span><span class="downstep"><span class="downstep-inner">ꜜ</span></span>サケ<b>・ナ<span style="text-decoration:overline;" class="pitchoverline">サケ</span><span class="downstep"><span class="downstep-inner">ꜜ</span></span></b>
```



