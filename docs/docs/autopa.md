
This page is dedicated to showcasing
how pitch accent is displayed,
and various ways to edit said display.


# What Is Pitch Accent?

Here is a (slightly modified) excerpt taken from the
[AJT Pitch Accent add-on page](https://ankiweb.net/shared/info/1225470483)
that explains the notation well:

!!! quote
    For more information on the Japanese pitch accent, I would like to refer you to
    [this wikipedia article](http://en.wikipedia.org/wiki/Japanese_pitch_accent).
    In short, the following notations can be found:

    - **Overline**: Indicates "High" pitch (see "Binary pitch" in Wikipedia article).
    - **Overline downstep**: usually means stressing the mora/syllable before.
    - **Red circle mark**: Nasal pronunciation.

        For example, げ would be a nasal け,
        and would represented as け<span class="nasal">°</span>.

    - **Blue color**: Devoiced mora (barely pronounced at all).

        For example, <span class="nopron">ヒ</span> would be closer to h than hi. <br>
        Likewise, <span class="nopron">ク</span> would be more like a k than ku.

---


# Specifying Pitch Accent

The displayed pitch accent is usually the first position found in `PAPositions`.
However, you can override this automatically chosen position using the `PAOverride` field.

![type:video](assets/pa_override.mp4)

The demo above covers the most basic usage of `PAOverride`,
which should suffice for most people.

The rest of the page covers the details on exactly how `PAOverride` works,
and all the ways to customize how the pitch accent is displayed.


---

# Colored Pitch Accent

The reading, word and pitch overline can be automatically colored
in Migaku style colors, according to the pitch accent.

This automatic coloring behavior is **disabled by default**,
and must be enabled in the {{ RTO_FILE }}:

??? examplecode "Enabling colored pitch accent *(click here)*"
    ```json
    "auto-pitch-accent": {
      "enabled": true, // (1)!
      "colored-pitch-accent": {
        "enabled": true,
        // ...
      }
      // ...
    }
    ```

    1.  The `auto-pitch-accent` module must be enabled to use colored pitch accent.

![type:video](assets/pa_override_color.mp4)

!!! note

    The 起伏 pattern is not automatically detected.
    To use this color, you must manually set the `PAOverride` field to `-1`.

<br>

## Pitch Accent Groups

| Anki Tag  | 日本語 | Example              | Reading      |
|: ------- :|: ---- :|: ------------------ :|: ---------- :|
| heiban    | 平板   | 自然 {.pa-heiban}    | しぜん￣     |
| atamadaka | 頭高   | 人生 {.pa-atamadaka} | じ＼んせい   |
| nakadaka  | 中高   | 弱点 {.pa-nakadaka}  | じゃくて＼ん |
| odaka     | 尾高   | 道具 {.pa-odaka}     | どうぐ＼     |
| kifuku    | 起伏   | 驚く {.pa-kifuku}    | おどろ＼く   |


<br>

## Position Selection
In most all cases, the position should be automatically found
and the word can be colored.
However, there are two cases where the position cannot be automatically calculated:

TODO rewrite with new `PAOverride`

1. `PAPositions` is not filled, but `AJTWordPitch` is.
2. `PAOverride` is a non-integer value.


<br>


## Override Pitch Accent Group
To manually set the pitch accent group, the main way (as described above) is by manually setting `PAOverride`
to the correct number number.
However, if you are using a non-integer value in `PAOverride` to override the entire display,
you must add the correct tag to your note, to add the correct color.

TODO rewrite with new `PAOverride`


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

---






# How Pitch Accent is Selected

Pitch accent is selected based on the following priority:

1. [PAOverrideText](autopa.md#1-paoverridetext)
1. [PAOverride](autopa.md#2-paoverride)
1. [PAPositions](autopa.md#3-papositions)
1. [AJTWordPitch](autopa.md#4-ajtwordpitch)

The first field that is non-empty will be the field that is used to display the pitch accent.

!!! note 
    When the `auto-pitch-accent` module is disabled,
    the priority changes to the following:

    1. `PAOverrideText`
    1. `PAOverride`
    1. `AJTWordPitch`

    Of course, as the module is disabled, `PAOverride` will not be parsed in any way.
    More info on this on the [`PAOverride` field](autopa.md#paoverride-field) section below.


---

# (1) PAOverrideText
{{ feature_version("0.11.0.0") }}

If the `PAOverrideText` field is filled, then this field is displayed exactly as is,
without any changes or parsing.

(TODO example images collapsed section)


---

# (2) PAOverride
The `PAOverride` allows for two primary formats: positions and text format.
If the field contents cannot be parsed in either of these formats,
then the field is displayed without any special formatting.
This will act just like `PAOverrideText`.


<!--
For a quick summary of how you can use this field, 
see wha

??? example "Example Summary"
    test

    | PAOverride | Result |
    |-|-|
    | (blank with no default)            | TODO |
    | `0`                                | TODO |
    | `1`                                | TODO |
    | `-1`                               | TODO |
    | `0,1,3`                            | TODO |
    | `0,<b>1</b>,3`                     | TODO |
    | じ＼んせい                         | TODO |
    | いきお＼い                         | TODO |
    | どうぐ＼                           | TODO |
    | しんちょう￣                       | TODO |
    | どく＼、くらう￣、さら￣           | TODO |
    | ちゅうが＼くせい・ちゅうがく＼せい | TODO |
-->

<br>


## (2.1) PAOverride: Positions Format

When the `PAOverride` field contains any number, that number will be considered
as the downstep position, and be rendered as such.
The number `-1` represents the 起伏 pattern, and can be used to set the
downstep to be after the second last mora.

**Examples** (on the 偽者 card):

| PAOverride | Result | Notes |
|-|-|-|
| `0`            | TODO | |
| `1`            | TODO | |
| `-1`           | TODO | 起伏 |



### Multiple Numbers
{{ feature_version("0.11.0.0") }}

Multiple numbers can be used, as long as they are separated by commas.
This is useful on certain words with devoiced mora, where the pitch accent
can be multiple positions with little real distinction.

Additionally, individual numbers can be bolded to grey out the other positions.
This is useful to highlight the correct pitch accent among all possiblities.

**Examples** (on the 偽者 card):

| PAOverride | Result | Notes |
|-|-|-|
| `0,1,3`        | TODO | |
| `0 , 1,3`      | TODO | The parser ignores all whitespace. |
| `0,<b>1</b>,3` | TODO | |


!!! note "Restrictions on bolded numbers"
    Multiple numbers cannot be bolded together.
    If you want to bold multiple numbers, they have to be bolded individually.
    Additionally, commas cannot be bolded.

    For example, `0,<b>1</b>,<b>2</b>,3` is valid,
    but `0,<b>1,2</b>,3` and `0,<b>1,</b>2,3` are invalid.


<br>


## (2.2) PAOverride: Text Format
{{ feature_version("0.11.0.0") }}

??? info "How To Type Special Characters *(click here)*"

    This section requires you to type certain special characters.
    You can type these characters on any standard IME.

    | Characters | Result |
    |:-:|:-:|
    | `\`           { .smaller-table-row } | ＼ { .smaller-table-row } |
    | `うえ` (`ue`) { .smaller-table-row } | ￣ { .smaller-table-row } |
    | `,`           { .smaller-table-row } | 、 { .smaller-table-row } |
    | `/`           { .smaller-table-row } | ・ { .smaller-table-row } |



If no number is found within the `PAOverride` field, the contents
will be parsed using this format.

To define any pitch accent in text format, use 「＼」 to specify downstep.
For example, 人生 should be written as 「じ＼んせい」.

For words with no downstep (平板型), the 「￣」 character must be placed
at the end of the word.
For example, 身長 should be written as 「しんちょう￣」.

!!! note
    The restriction that 平板 words require the ￣ symbol at the end can be removed
    using the following {{ RTO }}:

    ```
    TODO
    ```

    This would allow any words without any downstep marker to be rendered as 平板.
    Using the above example, one can instead type 身長 as 「しんちょう」.


Using this text format will ignore the original reading of the tested word,
allowing you to write the pitch accent of any word you want.

**Examples**:

| PAOverride | Result |
|-|-|
| じ＼んせい    | TODO |
| いきお＼い    | TODO |
| どうぐ＼      | TODO |
| しんちょう￣  | TODO |


### Multiple Words
Multiple words can be defined, as long as they are separated with either the
「・」 or 「、」 characters.

This is particularly useful on expressions with multiple words, such as 「毒を食らわば皿」.


**Examples**:

| PAOverride | Result |
|-|-|
| どく＼、くらう￣、さら￣    | TODO |
| ちゅうが＼くせい・ちゅうがく＼せい  | TODO |


!!! note
    This renderer will not accept any field with formatting.
    This means that bold, italics, overlines, etc. cannot be present in the field.
    For example, the input `<b>にせもの</b>` will be rejected.

<br>

## (2.3) PAOverride: Raw Text
As a last case resort, if the input of this field cannot be parsed as either of the two,
the exact contents of `PAOverride` will be displayed.
This will behave exactly the same as `PAOverrideText`.



---

# (3) PAPositions

This field is automatically filled out as long as Yomichan has pitch accent dictionaries,
and the tested word is covered in said dictionary.

By default, the first pitch of the first dictionary is shown.

TODO image + example field


<br>

## Show All Possibilities in Dictionary
{{ feature_version("0.11.0.0") }}

Sometimes, pitch accent dictionaries show multiple pitch accents for a word.
However, only the first pitch accent is shown by default.

If you want to show all of the pitch accents in the first dictionary,
use the following {{ RTO }}:

```
{
  "modules": {
    "auto-pitch-accent": {
      // default: true
      "only-display-main-entry": false,
    }
  }
}
```

If you want to select the correct pitch accent, bold that position.

TODO image comparisons:

- true
- false
- true + bold
- false + bold

!!! note
    This option only works on cards formatted with JPMN's `{jpmn-pitch-accent-positions}` marker.
    This means this option will not work on old cards that were imported to the `JPMN` format.

---


# (4) AJTWordPitch
If you have the optional [AJT Pitch Accent](setupanki.md#ajt-pitch-accent)
add-on installed and correctly configured,
then this field is automatically generated on all cards.

This is used as a fallback option, in case your installed pitch accent dictionaries
does not cover the tested content, but this add-on does.


---


<!--
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
    If the module is disabled in {{ RTO_FILE }},
    the displayed pitch accent will be exactly what is shown in `AJTWordPitch` (or `PAOverride`).

??? example "(TODO) How pitch accent is selected for version 0.11.0.0"

    1. `PAOverrideText`
        - anything

    1. `PAOverride` integer(s)
        - any integer in csv format
        - can be bolded to grey out others
        - bold currently cannot be across numbers
        - examples:
            - `1`
            - `1, 2`
            - `-1, 2`
            - `0,1,2,3`
            - `0,1,<b>2</b>,3`
        - non-examples:
            - `0,<b>1,2</b>,3`
            - `0,<b>1,</b>2,3`
            - `0,a`

    1. `PAOverride` text
        - accepts anything WITHOUT formatting (no bold, etc)
        - downsteps are marked with 「＼」
        - (optional) 平板 words can be markd with 「￣」at the very end
        - words are separated with 「・」 or 「、」
        - examples:
            - ちゅうが＼くせい・ちゅうがく＼せい
            - どく＼、くらう、さら
            - ジ＼ンセイ
            - ぞうき＼ん
            - ねる
            - ねる￣

    1. `PAOverride`: anything else
        - if it doesn't fit any of the above (text with formatting), it is shown as is without changes
            - acts exactly like `PAOverrideText`

    1. `PAPositions`

    1. `AJTWordPitch`

??? example "(TODO) How pitch accent is selected for version 0.11.0.0, when module is disabled"

    1. `PAOverrideText`
    1. `PAOverride`
    1. `AJTWordPitch`

    all of the fields will be shown as is without formatting
    (since no javascript is available to format it)


## Showing Multiple Pitch Accents

-->




# How the Reading is Selected

(TODO)

- AJT word pitch by default
    - can include devoiced and nasal info
    - usually katakana with long vowel marks
        - some words don't have long vowel marks (i.e. adjectives ending with 〜しい will be displayed as 〜シイ and not 〜シー)
    - ajt word reading must match the reading found in `WordReading`, otherwise this field is ignored
        - some pre-processing is done to turn this reading into hiragana to be properly searched


Otherwise, the card uses the reading from `WordReading` in katakana.
This reading can be changed to hiragana, katakana, or katakana with long vowel marks
in {{ RTO_FILE }}:

```
{
  "modules": {
    "auto-pitch-accent": {
      // 0: hiragana
      // 1: katakana
      // 2: katakana with long vowel marks
      "reading-display-mode": 1,
    }
  }
}
```


---


# Pitch Accent Styling Details

- TODO outdated
- TODO only if you care about the exact text value
- TODO what bold does


Editing the content in `AJTWordPitch` requires some special attention.
To preserve the style and get expected results, you must use `Ctrl + Shift + x` when editing the field,
and edit the html tags directly. Use other cards as examples of what the html should look like.

TODO more details + example (華)

- TODO replace with positions :eyes:

example of something that has all possible formats (bold, overline, downstep, nasal, devoiced)
```html
チュ<span style="text-decoration:overline;" class="pitchoverline">ーカ<span class="nasal">°</span></span><span class="downstep"><span class="downstep-inner">ꜜ</span></span><span class="nopron">ク</span>セイ<b>・チュ<span style="text-decoration:overline;" class="pitchoverline">ーカ<span class="nasal">°</span><span class="nopron">ク</span></span><span class="downstep"><span class="downstep-inner">ꜜ</span></span>セイ</b>
```


The `AJTWordPitch` field may have more than one pitch accent for a given word.
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



