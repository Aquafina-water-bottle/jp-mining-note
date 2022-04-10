
# Anki Setup
* TODO required plugins and their configs

## Required Anki Plugins

#### AJT Furigana
Alternative and up-to-date version of JapaneseSupport.
Automatically adds furigana from one field to another.

[Link] (TODO)

Config:
```
TODO
```

#### AJT Pitch Accent
Automatically adds pitch accent info given the word.

[Link] (TODO)

Config:
```
TODO
```

#### AnkiConnect
Required for Yomichan and most other Anki-related automated tasks to work.

[Link] (TODO)


## Optional Anki Plugins
These are the plugins I use outside of card creation.

* Adjust Sound Volume
* AJT Flexible Grading
* AJT Mortician
* Paste Images As WebP
* Yomichan Forvo Server


## Optional: Separate Pitch Accent Deck
* Make all new cards to be created in a separate deck by default
* Browse -> Cards -> (top) Card Type selector -> (choose pitch accent card type) -> Options -> Deck Override


# Yomichan Setup

## Yomichan Fields
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



