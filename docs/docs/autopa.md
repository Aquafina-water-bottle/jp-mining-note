
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

## When Pitch Is Not Automatically Colored
Pitch accent coloring requires a numeric position value somewhere within the card.
This is usually found in one of two places:

* `PAPositions`
* `PAOverride`

Usually, `PAPositions` is automatically filled.

In the cases where pitch accent coloring does not work as expected, your two main options are:

1. Using `PAOverride` with [a number](autopa.md#specifying-pitch-accent) (recommended).
2. Force the pitch accent group with tags (see below).

<br>


## Override Pitch Accent Group
In some extremely rare cases, you must set manually set the pitch accent group,
if the available options do not work.
To do this, add the appropriate tag to the card.


The exact tags that can be used are shown in the
[summary table](autopa.md#pitch-accent-groups) above,
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
    More info on this can be found in the [PAOverride field](#2-paoverride) section below.


---

# (1) PAOverrideText
{{ feature_version("0.11.0.0") }}

If the `PAOverrideText` field is filled, then this field is displayed exactly as is,
without any changes or parsing.
This provides the most flexibility, but the least ease of usage.

<figure markdown>
  {{ img("hello world as PA", "assets/pa/helloworld.png") }}
  <figcaption>
    PAOverrideText with: "Hello world!"
  </figcaption>
</figure>


---

# (2) PAOverride
The `PAOverride` allows for two primary formats: positions and text format.
If the field contents cannot be parsed in either of these formats,
then the field is displayed without any special formatting.
This will act just like `PAOverrideText`.


<br>


## (2.1) PAOverride: Positions Format

When the `PAOverride` field contains any number, that number will be considered
as the downstep position, and be rendered as such.
The number `-1` represents the 起伏 pattern, and can be used to set the
downstep to be after the second last mora.

**Examples** (on the 偽者 card):

| PAOverride | Result | Notes |
|-|-|-|
| `0`            | <span class="pitchaccent">ニ<span class="pitchoverline">セモノ</span></span> | |
| `1`            | <span class="pitchaccent"><span class="pitchoverline">ニ</span><span class="downstep"><span class="downstep-inner">ꜜ</span></span>セモノ</span> | |
| `-1`           | <span class="pitchaccent">ニ<span class="pitchoverline">セモ</span><span class="downstep"><span class="downstep-inner">ꜜ</span></span>ノ</span> | 起伏 |



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
| `0,2,4`        | <span class="pitchaccent">ニ<span class="pitchoverline">セモノ</span>・ニ<span class="pitchoverline">セ</span><span class="downstep"><span class="downstep-inner">ꜜ</span></span>モノ・ニ<span class="pitchoverline">セモノ</span><span class="downstep"><span class="downstep-inner">ꜜ</span></span></span> | |
| `0 ,2, 4`      | <span class="pitchaccent">ニ<span class="pitchoverline">セモノ</span>・ニ<span class="pitchoverline">セ</span><span class="downstep"><span class="downstep-inner">ꜜ</span></span>モノ・ニ<span class="pitchoverline">セモノ</span><span class="downstep"><span class="downstep-inner">ꜜ</span></span></span> | The parser ignores all whitespace. |
| `<b>0</b>,2,4` | <span class="pitchaccent">ニ<span class="pitchoverline">セモノ</span><b>・</b><b>ニ<span class="pitchoverline">セ</span><span class="downstep"><span class="downstep-inner">ꜜ</span></span>モノ</b><b>・</b><b>ニ<span class="pitchoverline">セモノ</span><span class="downstep"><span class="downstep-inner">ꜜ</span></span></b></span> | |


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

??? info "Removing the required ￣ symbol *(click here)*"
    The restriction that 平板 words require the ￣ symbol at the end can be removed
    using the following {{ RTO }}:

    ```json
    {
      "modules": {
        "auto-pitch-accent": {
          "pa-override": {
            // set to false (default: true)
            "heiban-marker-required": false,
          }
        }
      }
    }
    ```

    This would allow any words without any downstep marker to be rendered as 平板.
    Using the above example, one can instead type 身長 as 「しんちょう」.


<!--
Using this text format will ignore the original reading of the tested word,
allowing you to write the pitch accent of any word you want.
-->


**Examples**:

| PAOverride | Result |
|-|-|
| じ＼んせい    | <span class="pitchaccent"><span class="pitchoverline">ジ</span><span class="downstep"><span class="downstep-inner">ꜜ</span></span>ンセイ</span> |
| いきお＼い    | <span class="pitchaccent">イ<span class="pitchoverline">キオ</span><span class="downstep"><span class="downstep-inner">ꜜ</span></span>イ</span> |
| どうぐ＼      | <span class="pitchaccent">ド<span class="pitchoverline">ウグ</span><span class="downstep"><span class="downstep-inner">ꜜ</span></span></span> |
| しんちょう￣  | <span class="pitchaccent">シ<span class="pitchoverline">ンチョウ</span></span> |




### Multiple Words
Multiple words can be defined, as long as they are separated with either the
「・」 or 「、」 characters.

This is particularly useful on expressions with multiple words, such as 「毒を食らわば皿まで」.


**Examples**:

| PAOverride | Result |
|-|-|
| どく＼、くらう￣、さら￣    | <span class="pitchaccent">ド<span class="pitchoverline">ク</span><span class="downstep"><span class="downstep-inner">ꜜ</span></span>、ク<span class="pitchoverline">ラウ</span>、サ<span class="pitchoverline">ラ</span></span> |
| ち＼か・ちか＼  | <span class="pitchaccent"><span class="pitchoverline">チ</span><span class="downstep"><span class="downstep-inner">ꜜ</span></span>カ・チ<span class="pitchoverline">カ</span><span class="downstep"><span class="downstep-inner">ꜜ</span></span></span> |


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


<br>

## Show All Possibilities in Dictionary
{{ feature_version("0.11.0.0") }}

Sometimes, pitch accent dictionaries show multiple pitch accents for a word.
However, only the first pitch accent is shown by default.

=== "One entry (default)"
    {{ img("", "assets/papositions/one_unbolded.png") }}

=== "All entries"
    {{ img("", "assets/papositions/multiple_unbolded.png") }}

=== "One entry + bold"
    {{ img("", "assets/papositions/one_bolded.png") }}

=== "All entries + bold"
    {{ img("", "assets/papositions/multiple_bolded.png") }}


If you want to show all of the pitch accent entries (in the first dictionary),
use the following {{ RTO }}:

```json
{
  "modules": {
    "auto-pitch-accent": {
      "pa-positions": {
        // default: true
        "display-entire-dictionary": false
      }
    }
  }
}
```

If you want to select the correct pitch accent, bold that position in `PAPositions`
(or simply use `PAOverride` as described [above](#21-paoverride-positions-format))

<!--
As an example, the word below has two pitch accents specified
under PAPositions: [0] and [3].
-->


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



# How the Reading is Selected

The reading consists of the actual kana that is shown on the card.
By default, the word reading is selected based on the following priority:

1. `AJTWordPitch`
1. `WordReading`


<br>

## Reading: AJTWordPitch
Usually, the reading is selected from `AJTWordPitch`.
This has a few features over the raw word reading:

* `AJTWordPitch` usually includes devoiced and nasal info, whereas `WordReading` does not.
* Readings are katakana, and cannot be changed to hiragana.

!!! note
    If you do not want the reading in `AJTWordPitch` to be used,
    change the following {{ RTO }} to `false`:

    ```json
    {
      "modules": {
        "auto-pitch-accent": {
          // set to false (default: true)
          "search-for-ajt-word": false,
        }
      }
    }
    ```


<br>

## Reading: WordReading
If the word cannot be found under `AJTWordPitch`, then the default reading
in `WordReading` is used, and displayed in katakana.

Unlike `AJTWordPitch`, this reading can be changed to hiragana, katakana,
or katakana with long vowel marks in the {{ RTO_FILE }}:

```json
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

This covers some details if you are directly using `PAOverrideText`,
and want to have a similar format to the generated pitch accent.
You very likely won't be doing this.

* The generated style is exactly the generated style of the AJTWordPitch field.
    To display the style properly, copy and edit the HTML tags directly.

* If you want to grey out other words, you will have to use the bold `<b>` tag.
    However, you must wrap **the greyed out words** with the `<b>` tag.

    This is the opposite of what would expect from everything
    in this page, but the behavior is this way due to restrictions in the current
    CSS specification.

* Example with all possible styles:
    ```html
    チュ<span style="text-decoration:overline;" class="pitchoverline">ーカ<span class="nasal">°</span></span><span class="downstep"><span class="downstep-inner">ꜜ</span></span><span class="nopron">ク</span>セイ<b>・チュ<span style="text-decoration:overline;" class="pitchoverline">ーカ<span class="nasal">°</span><span class="nopron">ク</span></span><span class="downstep"><span class="downstep-inner">ꜜ</span></span>セイ</b>
    ```


