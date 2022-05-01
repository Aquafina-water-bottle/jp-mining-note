# Anki Setup
For this card type to work, some Anki addons are required to connect to external sources and to auto-generate
certain fields.

## Required Anki Plugins
To download all the required plugins, copy and paste the following numbers into the Add-ons window.
(Tools →  Add-ons →  "Get Add-ons...")
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

<details>
<summary><i>Click here to see the full AJT Furigana config</i></summary>

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

</details>

#### AJT Pitch Accent
[(Link)](https://ankiweb.net/shared/info/1225470483)
Automatically adds pitch accent info given the word.
Note: Although I have two fields for Yomichan to import the pitch accent, I primarily use the
pitch accent info generated from this plugin because I personally find it easier to edit.
More about editing pitch accent in usage (TODO).

The important things to change in the config are `generate_on_note_add`,
`destination_fields`, `source_fields` `note_types`, and `styles`.

<details>
<summary><i>Click here to see the full AJT Pitch Accent config</i></summary>

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

</details>

#### AnkiConnect
[(Link)](https://ankiweb.net/shared/info/2055492159)
Required for Yomichan and most other Anki-related automated tasks to work.
I use the default config that comes with the plugin.


## Optional Anki Plugins

These plugins assist in card creation, but are ultimately optional.
* Paste Images As WebP [(link)](https://ankiweb.net/shared/info/1151815987)
* Yomichan Forvo Server [(link)](https://ankiweb.net/shared/info/580654285)

## Optional: Separate Pitch Accent Deck
If you want card types to go to a different deck by default, you can change it by doing the following:

Browse
→  Cards
→  Card Type selector (top of the screen)
→  (choose pitch accent card type)
→  Options
→  Deck Override

More info can be found in the official Anki Documentation
[here](https://docs.ankiweb.net/templates/intro.html?highlight=override#the-templates-screen).


# Yomichan Setup
[Yomichan](https://github.com/FooSoft/yomichan)
is the main program that will create the cards. You can download Yomichan as a Firefox extension
or under the Chrome web store.
This will go over the very basic Yomichan setup to work with this card type.

**If you have never used Yomichan before**, please see
[this page](https://learnjapanese.moe/yomichan/) first to get it working.

## Yomichan Fields
To edit the fields that Yomichan will automatically fill out, do the following:
* Navigate to Yomichan Settings.
* Go to the "Anki" section
* Select "Anki card format..."
* Set "Model" as `JP Mining Note`
* Copy and paste the following values into the fields:


|  Anki Fields               | Yomichan Format                                   |
|----------------------------|---------------------------------------------------|
|  Word                      | `{expression}`                                    |
|  WordReading               | `{furigana-plain}`                                |
|  WordPitch                 |                                                   |
|  PrimaryDefinition         | `{glossary-bilingual-first}`                      |
|  Sentence                  | `{cloze-prefix}<b>{cloze-body}</b>{cloze-suffix}` |
|  SentenceReading           |                                                   |
|  AltDisplay                |                                                   |
|  AltDisplayPASentenceCard  |                                                   |
|  AdditionalNotes           |                                                   |
|  Hint                      |                                                   |
| *IsSentenceCard            |                                                   |
| *PASeparateWordCard        |                                                   |
| *PASeparateSentenceCard    |                                                   |
| *PATestOnlyWord            |                                                   |
| *PADoNotTest               |                                                   |
| *PADoNotShowInfoLegacy     |                                                   |
| *SeparateClozeDeletionCard |                                                   |
|  Picture                   |                                                   |
|  WordAudio                 | `{audio}`                                         |
|  SentenceAudio             |                                                   |
|  Graph                     | `{pitch-accent-graphs}`                           |
|  Position                  | `{pitch-accent-positions}`                        |
|  PASilence                 | `[sound:silence.wav]`                             |
|  SecondaryDefinition       | `{glossary-monolingual-first}`                    |
|  ExtraDefinitions          | `{glossary-extra}`                                |
|  Comment                   |                                                   |

The above fields will create, by default:
* A vocab card that also tests for pitch accent
* Shows the bilingual definition by default, with monolingual definitions in collapsable fields

Anything field with a * are binary fields, and **should be configured to each user's personal
preferences.** I personally like separating the pitch accent card by default, hence my normal setup
has the `PASeparateSentenceCard` field filled in (say, with `1` in Yomichan).
More info on how to configure the default values is shown (TODO)

Markers like `{glossary-bilingual-first}` is not provided by Yomichan by default.
This will be explained in the section below.



## Yomichan Templates
Yomichan supports user inserted template code that allows the automatic
separation of bilingual and monolingual dictionary definitions,
among other things.
I created some templates to do exactly just that.

To make the new markers usable, do the following:
* Navigate to Yomichan Settings.
* Make sure that advanced settings are turned on (bottom left corner).
* Go to the "Anki" section
* Select "Configure Anki card templates..."
* Copy and paste the code below to the **bottom** of the default Yomichan template code:

<details>
<summary><i>Click here to show the template code to copy.</i></summary>

    {{~! first biliingual definition found ~}}
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
    {{~#*inline "glossary-monolingual-first"~}}

        {{~#scope~}}

            {{~#set "first-dictionary" null}}{{/set~}}

            {{~#set "valid-dict-found" false}}{{/set~}}
            {{~#each definition.definitions~}}
                {{~! CONDITION 1 ~}}

                {{~#if (op "!" (op "||" (op "===" dictionary "JMdict (English)") (op "===" dictionary "新和英") ) )~}}
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
                    {{~#if (op "!" (op "||" (op "===" dictionary "JMdict (English)") (op "===" dictionary "新和英") ) )~}}

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

</details>
<br>



#### What the markers do

`{glossary-bilingual-first}`:
Selects the first bilingual dictionary found.
This follows the order of how you order your dictionaries in yomichan.
In other words, the first definition shown on the Yomichan popup is the definition that is chosen here.
Note that this will contain **ALL definitions** in said dictionary.

`{glossary-monolingual-first}`:
Selects the first monolingual dictionary found.

`{glossary-extra}`:
All other dictionaries found that is not the first bilingual and first monolingual dictionary found.


**NOTE:** The template code works specifically for if the bilingual dictionaries you use are either
`JMdict (English)` or `新和英` (and must have exactly that tag).
If you are using other bilingual dictionaries, you will have to edit the template code
by stringing together `op` statements.
For example, to add a third monolingual dictionary with the tag of `AmazingDictionary`,
then you can do so by changing the conditions to the following:

```
(op "||" (op "===" dictionary "JMdict (English)") (op "===" dictionary "新和英") )
```
to
```
(op "||" (op "||" (op "===" dictionary "JMdict (English)") (op "===" dictionary "新和英") ) (op "===" dictionary "AmazingDictionary") )
```




## Other Yomichan Settings
* Again, if you have never used Yomichan before, I recommend checking out
  [this page](https://learnjapanese.moe/yomichan/).
* I personally use the "JMedict (English) Alternate" dictionary found in
  [this](https://learnjapanese.link/dictionaries) dictionary collection.
    * I also combine this with "Compact glossaries" turned on and "Compact tags" turned off,
      under Yomichan settings →  "Popup Appearance".
* [This](https://gist.github.com/Rudo2204/55f418885c2447ccbdc95b0511e20336)
  link has further template code, which creates markers for individual dictionaries.
  This has certain extended capabilities over my template code, such as removing the first line.
* I have written additional template code here (TODO) that has extended capabilities over the ones
  I provided above.
  Note that the code here is unmaintained, and may not work without fixing.
* Instructions on adding Forvo as an alternate audio source to Yomichan
  can be found [here](https://learnjapanese.moe/yomichan/#bonus-adding-forvo-extra-audio-source)



# Conclusion
* See usage.md to see how to create the cards



