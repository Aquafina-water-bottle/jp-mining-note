Welcome to my (hidden) personal setup page!
This section is very likely outdated and is not very easy to go through.

If you want to use this note type,
I recommend looking at **other pages of the wiki**.



# Texthooker CSS (Renji)
```
main > p {
  padding: 0rem !important;
}

main {
  padding-left: min(5%, 5rem) !important;
  padding-right: min(5%, 5rem) !important;
  font-family: "Noto Sans CJK JP" !important;
}
```

# Anki
plugins:

- `1344485230 1225470483 2055492159 580654285`
    - ajt furigana / ajt pitch accent / ankiconnect / local forvo
    - config under normal setup page
    - custom audio sources: `http://localhost:8770/?expression={expression}&reading={reading}`
- local audio plugin w/ sqlite
    - get audio zips from existing computer / backup
    ```
    .
    ├── jpod_alternate_files
    │   └── よむ - 読む.mp3
    │   └── ...
    ├── jpod_files
    │   └── よむ - 読む.mp3
    │   └── ...
    └── nhk16_files
        ├── audio
        │   └── 20170616125910.aac
        │   └── ...
        └── entries.json
    ```
- forvo plugin


# Yomichan

- import settings from an existing computer / backup drive
- [TMW dicts](https://learnjapanese.link/dictionaries)
- Yomichan settings →  "Popup Appearance":
  - "Compact glossaries": on
  - "Compact tags": off,



monolingual:

- hold shift: bilingual (at any level)
- mouseover: monolingual

monolingual shift:

- hold shift:
    - access monolingual at first level
    - bilingual at all other levels
- mouseover to access monolingual at other levels

bilingual:

- mouseover: bilingual

pa:

- hold shift: pitch accent and utilities


{% raw %}
```handlebars
{{~set "opt-first-definition-type" "monolingual" ~}}
{{~#set "ignored-dict-regex"~}} ^(新和英)$ {{~/set~}}
{{~set "opt-jmdict-list-format" false ~}} {{~! still using regular jmdict ~}}
```
{% endraw %}



<!--
{% set global_css %}

/*
 * ========
 *  global
 * ========
 */
button[title^="Add reading"] {
  display:none;
}
[data-sc-ortho="table"] td {
  text-align: center;
}
.headword-term ruby rt {
  user-select: none
}

/* Taken from: https://github.com/MarvNC/yomichan-dictionaries/#yomichan-css-for-kanji-dictionaries */
/* remove misc dict classifications/codepoints/stats */
.kanji-glyph-data {
  width: 100%
}
.kanji-glyph-data > tbody > tr:nth-child(n + 3) {
  display: none;
}

/* remove stroke diagram, freq, header for next entries */
div.entry[data-type='kanji']:nth-child(n + 2) .kanji-glyph-container,
div.entry[data-type='kanji']:nth-child(n + 2) [data-section-type='frequencies'],
div.entry[data-type='kanji']:nth-child(n + 2) table.kanji-glyph-data > tbody > tr:first-child {
  display: none;
}

/* remove 'No data found' */
.kanji-info-table-item-value-empty {
  display: none;
}


/* remove horizontal lines */
.entry + .entry[data-type='kanji'],
div#dictionary-entries > div.entry:nth-child(n + 2) .kanji-glyph-data > tbody > tr > * {
  border-top: none !important;
}

/*
 * ============
 *  global end
 * ============
 */

{% endset %}



{% set restrict_pitch_css %}

/* only shows the first 2 pitch dictionaries */
li.pronunciation-group:nth-child(n+3) {
  display: none;
}
/* makes 大辞泉 and NHK have white text, and all other pitch dictionaries have grey text */
.tag[data-category="pronunciation-dictionary"] {
  --tag-text-color: #c8bfdb;
}
.tag[data-details="大辞泉"], .tag[data-details="NHK"] {
  --tag-text-color: #FFFFFF;
}

{% endset %}

-->

## monolingual profile

- scale: 110%
- condition: modifier keys are shift

```css

{{ global_css }}

{{ restrict_pitch_css }}

li.definition-item[data-dictionary='NHK日本語発音アクセント新辞典'] {
  display: none;
}


li.definition-item[data-dictionary='JMdict (English)'] .gloss-list {
  opacity: 0;
}
li.definition-item[data-dictionary='JMdict (English)']:hover .gloss-list {
  opacity: 1;
}

li.definition-item[data-dictionary='新和英'] .gloss-list {
  opacity: 0;
}
li.definition-item[data-dictionary='新和英']:hover .gloss-list {
  opacity: 1;
}


li.definition-item[data-dictionary='日本語文法辞典(全集)'] .gloss-list {
  opacity: 0;
}
li.definition-item[data-dictionary='日本語文法辞典(全集)']:hover .gloss-list {
  opacity: 1;
}
```


## other monolingual profiles
```
URL - Matches Domain - doc.rust-jp.rs
    - tag: rust
    - scale: 90%
```

## bilingual profile

- scale: 100%
- NHK日本語発音アクセント新辞典 and シン・漢字遣い参考 should have lower priority compared to bilingual dicts
- condition: modifier keys are ctrl



```css

{{ global_css }}

{{ restrict_pitch_css }}

li.definition-item[data-dictionary='旺文社国語辞典 第十一版'] {
  display: none;
}
li.definition-item[data-dictionary='明鏡国語辞典'] {
  display: none;
}
li.definition-item[data-dictionary='明鏡国語辞典 第二版'] {
  display: none;
}
li.definition-item[data-dictionary='ハイブリッド新辞林'] {
  display: none;
}
li.definition-item[data-dictionary='新明解国語辞典 第五版'] {
  display: none;
}
li.definition-item[data-dictionary='デジタル大辞泉'] {
  display: none;
}
li.definition-item[data-dictionary='漢字源'] {
  display: none;
}
li.definition-item[data-dictionary='実用日本語表現辞典'] {
  display: none;
}
li.definition-item[data-dictionary='毎日のんびり日本語教師'] {
  display: none;
}
li.definition-item[data-dictionary='学研 四字熟語辞典'] {
  display: none;
}
li.definition-item[data-dictionary='新明解四字熟語辞典'] {
  display: none;
}
li.definition-item[data-dictionary='三省堂国語辞典　第七版'] {
  display: none;
}
li.definition-item[data-dictionary='大辞林 第三版'] {
  display: none;
}
li.definition-item[data-dictionary='新明解国語辞典　第七版'] {
  display: none;
}
li.definition-item[data-dictionary='surasura 擬声語'] {
  display: none;
}
li.definition-item[data-dictionary='surasura 擬声語'] {
  display: none;
}
li.definition-item[data-dictionary='大辞林 第三版'] {
  display: none;
}
li.definition-item[data-dictionary='日本語俗語辞書'] {
  display: none;
}



```

## PA and grammar profile

- scale: 100%

```css

{{ global_css }}



li.definition-item[data-dictionary='旺文社国語辞典 第十一版'] {
  display: none;
}
li.definition-item[data-dictionary='明鏡国語辞典'] {
  display: none;
}
li.definition-item[data-dictionary='明鏡国語辞典 第二版'] {
  display: none;
}
li.definition-item[data-dictionary='ハイブリッド新辞林'] {
  display: none;
}
li.definition-item[data-dictionary='新明解国語辞典 第五版'] {
  display: none;
}
li.definition-item[data-dictionary='デジタル大辞泉'] {
  display: none;
}
li.definition-item[data-dictionary='漢字源'] {
  display: none;
}
li.definition-item[data-dictionary='実用日本語表現辞典'] {
  display: none;
}
li.definition-item[data-dictionary='毎日のんびり日本語教師'] {
  display: none;
}
li.definition-item[data-dictionary='学研 四字熟語辞典'] {
  display: none;
}
li.definition-item[data-dictionary='新明解四字熟語辞典'] {
  display: none;
}
li.definition-item[data-dictionary='三省堂国語辞典　第七版'] {
  display: none;
}
li.definition-item[data-dictionary='大辞林 第三版'] {
  display: none;
}
li.definition-item[data-dictionary='新明解国語辞典　第七版'] {
  display: none;
}
li.definition-item[data-dictionary='surasura 擬声語'] {
  display: none;
}
li.definition-item[data-dictionary='surasura 擬声語'] {
  display: none;
}
li.definition-item[data-dictionary='大辞林 第三版'] {
  display: none;
}
li.definition-item[data-dictionary='日本語俗語辞書'] {
  display: none;
}

li.definition-item[data-dictionary='JMdict (English)'] {
  display: none;
}
li.definition-item[data-dictionary='新和英'] {
  display: none;
}

li.definition-item[data-dictionary='Nico/Pixiv'] {
  display: none;
}

```


## Phone profile
- 新和英 is not installed on the phone

```css

{{ global_css }}

{{ restrict_pitch_css }}

/* Only shows the first freq list */
span.frequency-group-item:nth-child(n+2) {
  display: none;
}


li.definition-item[data-dictionary='NHK日本語発音アクセント新辞典'] {
  display: none;
}


li.definition-item[data-dictionary='JMdict (English)'] .gloss-list {
  opacity: 0;
}
li.definition-item[data-dictionary='JMdict (English)']:hover .gloss-list {
  opacity: 1;
}

li.definition-item[data-dictionary='日本語文法辞典(全集)'] .gloss-list {
  opacity: 0;
}
li.definition-item[data-dictionary='日本語文法辞典(全集)']:hover .gloss-list {
  opacity: 1;
}

```


## Yomichan Fields

??? example

{% filter indent(4) %}
{{ personal_setup_table() }}
{% endfilter %}


# Discord

## Custom CSS
```css
:lang(ja), :lang(ja-JP) {
    --font-primary: Whitney, "Noto Sans CJK JP", "Hiragino Sans", "ヒラギノ角ゴ ProN W3","Hiragino Kaku Gothic ProN","メイリオ",Meiryo,Osaka,"MS PGothic","Helvetica Neue",Helvetica,Arial,sans-serif;
}

code {
    font-family: Ubuntu Mono, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif, Consolas,Andale Mono WT,Andale Mono,Lucida Console,Lucida Sans Typewriter,DejaVu Sans Mono,Bitstream Vera Sans Mono,Liberation Mono,Nimbus Mono L,Monaco,Courier New,Courier,monospace !important;
}
```



# Mobile Changes
- the following are notes of what to change for mobile support
- nothing is set in stone, etc. etc. things are likely not even implemented yet


# Other
- [TMW github source](https://github.com/shoui520/shoui520.github.io) since I keep losing this link









