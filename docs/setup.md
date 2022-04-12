
# Anki Setup
For this card type to work, some Anki addons are required to connect to external sources and to auto-generate
certain fields.

## Required Anki Plugins
To download all the required plugins, copy and paste the following numbers into the Add-ons window.
(Tools -> Add-ons -> "Get Add-ons...")
```
1344485230 1225470483 2055492159
```
Further details on each of the plugins and the required config changes are listed below.

#### AJT Furigana
[(Link)](https://ankiweb.net/shared/info/1344485230)
Alternative and up-to-date version of JapaneseSupport.
Automatically generates furigana upon yomichan card creation.
Note that furigana generation is occasionally incorrect, so you should double-check the readings
to make sure they are correct.

The important things to change in the config are `generate_on_note_add`, `fields` and `note_types`.
Here is my full config:
```
{
    "context_menu": {
        "generate_furigana": true,
        "to_hiragana": true,
        "to_katakana": true
    },
    "fields": [
        {
            "destination": "SentenceReading",
            "source": "Sentence"
        }
    ],
    "furigana_suffix": " (furigana)",
    "generate_on_note_add": true,
    "note_types": [
        "jp"
    ],
    "skip_numbers": false,
    "skip_words": "",
    "toolbar": {
        "clean_furigana_button": {
            "enable": false,
            "shortcut": "Alt+u",
            "text": "削"
        },
        "furigana_button": {
            "enable": false,
            "shortcut": "Alt+o",
            "text": "振"
        }
    }
}
```

#### AJT Pitch Accent
[(Link)](https://ankiweb.net/shared/info/1225470483)
Automatically adds pitch accent info given the word.
Note: Although I have two fields for Yomichan to import the pitch accent, I primarily use the
pitch accent info generated from this plugin because I personally find it easier to edit.
More about editing pitch accent in usage (TODO).

The important things to change in the config are `generate_on_note_add`,
`destination_fields`, `source_fields` and `styles`.
Here is my full config:
```
{
    "destination_fields": [
        "WordPitch"
    ],
    "generate_on_note_add": true,
    "kana_lookups": true,
    "lookup_shortcut": "Ctrl+8",
    "note_types": [
        "jp"
    ],
    "regenerate_readings": false,
    "skip_words": "へ,か,よ,ん,だ,び,の,や,ね,ば,て,と,た,が,に,な,は,も,ます,から,いる,たち,てる,う,ましょ,たい,です",
    "source_fields": [
        "Word"
    ],
    "styles": {
        "&#42780;": "<span class=\"downstep\">&#42780;</span>",
        "class=\"overline\"": "style=\"text-decoration:overline;\" class=\"pitchoverline\""
    },
    "use_hiragana": false,
    "use_mecab": true
}
```

#### AnkiConnect
[(Link)](https://ankiweb.net/shared/info/2055492159)
Required for Yomichan and most other Anki-related automated tasks to work.
I use the default config that comes with the plugin.


## Optional Anki Plugins

These plugins assist in card creation, but are ultimately optional.
* Paste Images As WebP [(link)](https://ankiweb.net/shared/info/1151815987)
* Yomichan Forvo Server [(link)](https://ankiweb.net/shared/info/580654285)

These are the plugins I use outside of the main card creation process.
* Adjust Sound Volume [(link)](https://ankiweb.net/shared/info/2123044452)
* AJT Flexible Grading [(link)](https://ankiweb.net/shared/info/1715096333)
* AJT Mortician [(link)](https://ankiweb.net/shared/info/1255924302)
* True Retention by Card Maturity Simplified [(link)](https://ankiweb.net/shared/info/1779060522)

## Optional: Separate Pitch Accent Deck
* Make all new cards to be created in a separate deck by default
* Browse -> Cards -> (top) Card Type selector -> (choose pitch accent card type) -> Options -> Deck Override


# Yomichan Setup

## Yomichan Fields
The following setup creates the following:
* A vocab card that also tests for pitch accent
* A sentence pitch accent card
* Shows the bilingual definition by default, with monolingual definitions in collapsable fields

See customization (TODO) to change the default values.

|  Anki Fields               | Yomichan Format                                   |
|----------------------------|---------------------------------------------------|
|  Word                      | `{expression}`                                    |
|  WordReading               | `{furigana-plain}`                                |
|  WordPitch                 |                                                   |
|  PrimaryDefinition         | `{glossary-bilingual-first}`                      |
|  SecondaryDefinition       | `{glossary-monolingual-first}`                    |
|  Sentence                  | `{cloze-prefix}<b>{cloze-body}</b>{cloze-suffix}` |
|  SentenceReading           |                                                   |
|  AltDisplay                |                                                   |
|  AltDisplayPASentenceCard  |                                                   |
|  AdditionalNotes           |                                                   |
|  Hint                      |                                                   |
| *IsSentenceCard            |                                                   |
| *PASeparateWordCard        |                                                   |
| *PASeparateSentenceCard    | `1`                                               |
| *PATestOnlyWord            |                                                   |
| *PADoNotTest               |                                                   |
| *PADoNotShowInfoLegacy     |                                                   |
| *IsClozeDeletionCard       |                                                   |
|  Picture                   |                                                   |
|  WordAudio                 | `{audio}`                                         |
|  SentenceAudio             |                                                   |
|  Graph                     | `{pitch-accent-graphs}`                           |
|  Position                  | `{pitch-accent-positions}`                        |
|  PASilence                 | `[sound:silence.wav]`                             |
|  ExtraDefinitions          | `{glossary-extra}`                                |
|  Comment                   |                                                   |

Anything field with a * are binary fields, and should be configured to each user's personal
usages. I personally like separating the pitch accent card by default, hence why I have
the `PASeparateSentenceCard` field filled in.



## Yomichan Templates
* TODO finish & explanation
* TODO separate into different link as to not take up that much space lmao (or some sort of spoiler)

```
{{~! first biliingual definition found ~}}
{{~! (A) what I use ~}}
{{~#*inline "glossary-bilingual-first"~}}

    {{~#scope~}}

        {{~#set "first-dictionary" null}}{{/set~}}

        {{~#set "valid-dict-found" false}}{{/set~}}
        {{~#each definition.definitions~}}
            {{~! CONDITION 1 ~}}
            {{~#if (op "||" (op "===" dictionary "JMdict (English)") (op "===" dictionary "新和英") )~}}
                {{~#set "valid-dict-found" true}}{{/set~}}

                {{~#if (op "===" null (get "first-dictionary"))~}}
                    {{~#set "first-dictionary" dictionary~}}{{~/set~}}
                {{~/if~}}

            {{~/if~}}
        {{~/each~}}

        {{~#if (get "valid-dict-found")~}}
            <div style="text-align: left;"><ol>
            {{~#each definition.definitions~}}
                {{~! CONDITION 2 ~}}
                {{~#if (op "||" (op "===" dictionary "JMdict (English)") (op "===" dictionary "新和英") )~}}

                    {{~#if (op "===" dictionary (get "first-dictionary"))~}}
                        <li>{{~> glossary-single . brief=../brief noDictionaryTag=../noDictionaryTag ~}}</li>
                    {{~/if~}}
                {{~/if~}}
            {{~/each~}}
            </ol></div>
        {{~/if~}}

    {{~/scope~}}

{{~/inline~}}



{{~! first mononlingual definition ~}}
{{~! (B) what I use ~}}
{{~#*inline "glossary-monolingual-first"~}}

    {{~#scope~}}

        {{~#set "first-dictionary" null}}{{/set~}}

        {{~#set "valid-dict-found" false}}{{/set~}}
        {{~#each definition.definitions~}}
            {{~! CONDITION 1 ~}}
            {{~#if (op "&&" (op "!==" dictionary "JMdict (English)") (op "!==" dictionary "新和英") )~}}
                {{~#set "valid-dict-found" true}}{{/set~}}

                {{~#if (op "===" null (get "first-dictionary"))~}}
                    {{~#set "first-dictionary" dictionary~}}{{~/set~}}
                {{~/if~}}

            {{~/if~}}
        {{~/each~}}

        {{~#if (get "valid-dict-found")~}}
            <div style="text-align: left;"><ol>
            {{~#each definition.definitions~}}
                {{~! CONDITION 2 ~}}
                {{~#if (op "&&" (op "!==" dictionary "JMdict (English)") (op "!==" dictionary "新和英") )~}}

                    {{~#if (op "===" dictionary (get "first-dictionary"))~}}
                        <li>{{~> glossary-single . brief=../brief noDictionaryTag=../noDictionaryTag ~}}</li>
                    {{~/if~}}
                {{~/if~}}
            {{~/each~}}
            </ol></div>
        {{~/if~}}

    {{~/scope~}}

{{~/inline~}}


{{~! everything BUT the first bilingual and first monolingual definition ~}}
{{~! (C) what I use ~}}
{{~#*inline "glossary-extra"~}}

    {{~#scope~}}

        {{~#set "first-monolingual-dict" null}}{{/set~}}
        {{~#set "first-bilingual-dict" null}}{{/set~}}

        {{~#set "valid-dict-found" false}}{{/set~}}
        {{~#each definition.definitions~}}
            {{~! CONDITION 1 ~}}

            {{~#if (op "||" (op "===" dictionary "JMdict (English)") (op "===" dictionary "新和英") )~}}

                {{~#if (op "===" null (get "first-bilingual-dict"))~}}
                    {{~#set "first-bilingual-dict" dictionary~}}{{~/set~}}
                {{~else~}}
                    {{~#set "valid-dict-found" true}}{{/set~}}
                {{~/if~}}

            {{~else~}}

                {{~#if (op "===" null (get "first-monolingual-dict"))~}}
                    {{~#set "first-monolingual-dict" dictionary~}}{{~/set~}}
                {{~else~}}
                    {{~#set "valid-dict-found" true}}{{/set~}}
                {{~/if~}}

            {{~/if~}}

        {{~/each~}}

        {{~#if (get "valid-dict-found")~}}
            <div style="text-align: left;"><ol>
            {{~#each definition.definitions~}}
                {{~! not the first monolingual/bilingual dicts found ~}}
                {{~#if (op "&&" (op "!==" dictionary (get "first-bilingual-dict")) (op "!==" dictionary (get "first-monolingual-dict")) )~}}
                    <li>{{~> glossary-single . brief=../brief noDictionaryTag=../noDictionaryTag ~}}</li>
                {{~/if~}}
            {{~/each~}}
            </ol></div>
        {{~/if~}}

    {{~/scope~}}

{{~/inline~}}

```

## Other Yomichan Settings
* TODO link moeway yomichan stuffs
* TODO compact viewing to export things in compact form
* TODO link moeway single definition / single dictionary handlebars code
* forvo: https://learnjapanese.moe/yomichan/#bonus-adding-forvo-extra-audio-source



# Conclusion
* See usage.md to see how to create the cards



