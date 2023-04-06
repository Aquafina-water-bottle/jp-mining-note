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
??? examplecode "Yomichan Template Options"
    ```handlebars
    {{~! NOTE: this MUST be put at the very top of the templates section! ~}}


    {{~! ================ Dictionary Categorization Options ================= ~}}

    {{~! valid values: "bilingual", "monolingual" ~}}
    {{~set "opt-first-definition-type" "monolingual" ~}}

    {{~! matches most JMdict dictionaries, 新和英 and 日本語文法辞典(全集)~}}
    {{~#set "bilingual-dict-regex"~}} ^(([Jj][Mm][Dd]ict)(?! Surface Forms)(.*)|新和英|日本語文法辞典\(全集\)|ADD_BILINGUAL_DICTIONARIES_HERE)$ {{~/set~}}
    {{~#set "utility-dict-regex"~}} ^(NHK日本語発音アクセント新辞典|シン・漢字遣い参考|[Jj][Mm][Dd]ict( Surface)? Forms)$ {{~/set~}}
    {{~#set "ignored-dict-regex"~}} ^(新和英)$ {{~/set~}}


    {{~! ====================== Selected Text Options ======================= ~}}

    {{set "opt-selection-text-enabled"               true}}
    {{set "opt-selection-text-dictionary"            true}}
    {{set "opt-selection-text-glossary"              true}}
    {{set "opt-selection-text-glossary-attempt-bold" true}}


    {{~! ==================== Frequency Sorting Options ===================== ~}}
    {{~! See here for the official documentation on how these options work:
        https://github.com/MarvNC/JP-Resources#freq-settings ~}}

    {{~#set "opt-ignored-freq-dict-regex"~}} ^(JLPT_Level)$ {{~/set~}}
    {{~#set "opt-keep-freqs-past-first-regex"~}} ^()$ {{~/set~}}
    {{~set "opt-no-freq-default-value" 9999999 ~}}
    {{~set "opt-freq-sorting-method" "harmonic" ~}} {{~! "min", "first", "avg", "harmonic" ~}}

    {{~set "opt-grammar-override" true ~}}
    {{~set "opt-grammar-override-value" 0 ~}}
    {{~#set "opt-grammar-override-dict-regex"~}} ^(日本語文法辞典\(全集\)|毎日のんびり日本語教師|JLPT文法解説まとめ|どんなときどう使う 日本語表現文型辞典|絵でわかる日本語)$ {{~/set~}}





    {{~! ============== ORIGINAL YOMICHAN TEMPLATE CODE BELOW ============== ~}}
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
-->

## monolingual profile

- scale: 110%
- condition: modifier keys are shift

??? examplecode "CSS"
    ```css

{% filter indent(4) %}
{{ global_css }}
{% endfilter %}


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


??? examplecode "CSS"
    ```css

{% filter indent(4) %}
{{ global_css }}
{% endfilter %}

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

??? examplecode "CSS"
    ```css

{% filter indent(4) %}
{{ global_css }}
{% endfilter %}


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
    li.definition-item[data-dictionary='学研 四字熟語辞典'] {
      display: none;
    }
    li.definition-item[data-dictionary='新明解四字熟語辞典'] {
      display: none;
    }

    li.definition-item[data-dictionary='JMdict (English)'] {
      display: none;
    }
    li.definition-item[data-dictionary='新和英'] {
      display: none;
    }
    ```


## Phone profile

- because it's a phone, less dictionaries are going to be installed (for performance reasons)
    - anki cards and searches will be less detailed than the ideal max

??? example "List of dictionaries"

    - [x] 旺文社国語辞典 第十一版 rev.OUKOKU11_1.6
    - [x] 明鏡国語辞典 第二版 rev.MEIKYO2.v1
    - [ ] ハイブリッド新辞林 rev.shinjirin
    - [ ] 新明解国語辞典 第五版 rev.Shinmeikai5
    - [ ] デジタル大辞泉 rev.daijisen_20210506;2021-07-27
    - [x] 実用日本語表現辞典 rev.jitsuyou1
    - [x] 毎日のんびり日本語教師 rev.nihongo_no_sensei_v_1.03 ;2022-04-30;embedded urls, p of speech indicators(N5-N0)

    - [x] 新明解四字熟語辞典 rev.shinmeikai_yojijukugo;2021-07-12
    - [x] 毎日のんびり日本語教師 rev.nihongo_no_sensei_v_1.03 ;2022-04-30;embedded urls, p of speech indicators(N5-N0)
    - [ ] NHK日本語発音アクセント新辞典 rev.1.0-->
    - [x] JMDict Surface Forms rev.JMdict 2022-07-19
    - [x] JMdict (English) rev.jmdict4
    - [ ] 新和英 rev.Shinwaei1
    - [x] 日本語文法辞典(全集) rev.DOJG_v1.01;2022-04-30;better formatting
    - [x] Anime & Jdrama Freq: rev.frequency1
    - [ ] Innocent Ranked rev.frequency1
    - [x] JPDB rev.JPDB_by-frequency-global_2022-05-10T03:27:02.930Z
    - [x] VN Freq rev.frequency1
    - [x] KANJIDIC (English) rev.kanjidic2
    - [x] NHK rev.pitch_1.0.1.1
    - [x] 大辞泉 rev.pitch_1.0.0.1
    - [ ] アクセント辞典 rev.pitch1
    - [x] Kanjium rev.pitch1



??? examplecode "CSS"
    ```css

{% filter indent(4) %}
{{ global_css }}
{% endfilter %}


    /* Only shows the first 2 frequency lists */
    span.frequency-group-item:nth-child(n+3) {
      display: none;
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









