Welcome to my (hidden) personal setup page!
This will contain condense, usually point form information on how to get my exact setup,
and this section will be in continuous flux so long as I am learning japanese.

If you want to use this note type,
I recommend looking at the other pages of the wiki,
as points will be better explained.



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
```
{{~! NOTE: this MUST be put at the very top of the templates section! ~}}

{{~! REGEX ~}}
{{~! matches most JMdict dictionaries and 新和英 ~}}
{{~#set "bilingual-dict-regex"~}} ^(([Jj][Mm][Dd]ict)(?! Surface Forms)(.*)|新和英.*|日本語文法辞典.*)(\[object Object\])?$ {{~/set~}}
{{~#set "utility-dict-regex"~}} ^(NHK.*|シン・漢字遣い参考|JMDict Surface Forms)(\[object Object\])?$ {{~/set~}}
{{~#set "ignored-dict-regex"~}} ^(新和英.*)(\[object Object\])?$ {{~/set~}}

{{~! OPTIONS ~}}
{{~! valid values: "bilingual", "monolingual" ~}}
{{~#set "first-definition-type" "monolingual"}}{{/set~}}
```
{% endraw %}



## monolingual profile

- scale: 110%
- condition: modifier keys are shift

```css
/* global */
button[title^="Add reading"] {
  display:none;
}
[data-sc-ortho="table"] td {
  text-align: center;
}
.headword-term ruby rt {
  user-select: none
}


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


## bilingual profile

- scale: 100%
- NHK日本語発音アクセント新辞典 and シン・漢字遣い参考 should have lower priority compared to bilingual dicts
- condition: modifier keys are ctrl

```css
/* global */
button[title^="Add reading"] {
  display:none;
}
[data-sc-ortho="table"] td {
  text-align: center;
}
.headword-term ruby rt {
  user-select: none
}


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
```

## PA and grammar profile

- scale: 100%

```css
/* global */
button[title^="Add reading"] {
  display:none;
}
[data-sc-ortho="table"] td {
  text-align: center;
}
.headword-term ruby rt {
  user-select: none
}


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
li.definition-item[data-dictionary='JMdict (English)'] {
  display: none;
}
li.definition-item[data-dictionary='新和英'] {
  display: none;
}
```

## Yomichan Fields

{% macro getarg(f, v) -%}
  {%- set result = v.get("personal_setup", None) -%}
  {%- if result == None -%}
    {%- set result = v.get("setup", None) -%}
  {%- endif -%}
  {%- if result != None -%}
    `{{result}}` { .smaller-table-row }
  {%- endif -%}
{%- endmacro %}


| Anki Fields | Yomichan Format |
|-------------|-----------------|
{% for f, v in FIELDS.items() -%}
| {{ f }} { .smaller-table-row } | {{ getarg(f, v) }} |
{% endfor %}


