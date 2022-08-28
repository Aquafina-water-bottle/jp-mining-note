
This entire section is dedicated to providing the minimal setup to properly create
cards with this note type.
Note that this setup is primarly PC based,
and requires **Anki** and **Yomichan** for the main card creation process.
I recommend using the latest version of Anki if possible.

If you are on PC (Windows, MacOS, Linux, etc.), **the following setup should work**.
Otherwise, see the following sections to see how the cards should be filled
with your card exporter:
* [Yomichan Fields](setup#yomichan-fields)
* [Anki Field Reference](usage#anki-field-reference)



# Getting the cards
(TODO) releases page

After you download the cards, import them by navigating to Anki by doing the following:

File (top left) →  Import...

With this, you should see multiple example cards in your anki deck.


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
            "generate_furigana_no_kanji": true,
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
<br>

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
            "&#42780;": "<span class=\"downstep\"><span class=\"downstep-inner\">&#42780;</span></span>",
            "class=\"overline\"": "style=\"text-decoration:overline;\" class=\"pitchoverline\""
        },
        "use_hiragana": false,
        "use_mecab": true
    }

</details>
<br>

#### AnkiConnect
[(Link)](https://ankiweb.net/shared/info/2055492159)
Required for Yomichan and most other Anki-related automated tasks to work.
I use the default config that comes with the plugin.


<!--
idk why this section is here

More info can be found in the official Anki Documentation
[here](https://docs.ankiweb.net/templates/intro.html?highlight=override#the-templates-screen).
-->


## Installing custom fonts
(TODO)

## Transfer existing notes
(TODO)
* [sound:silence.wav]
* mention important reference fields
* batch editing plugin?
    * section on batch editing


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

| Anki Fields | Yomichan Format |
|-------------|-----------------|
| Key | `{expression}` |
| Word | `{expression}` |
| WordReading | `{furigana-plain}` |
| WordPitch |  |
| PrimaryDefinition | `{jpmn-primary-definition}` |
| Sentence | `{cloze-prefix}<b>{cloze-body}</b>{cloze-suffix}` |
| SentenceReading |  |
| AltDisplay |  |
| AltDisplayPASentenceCard |  |
| AdditionalNotes |  |
| *IsSentenceCard |  |
| *IsClickCard |  |
| *IsHoverCard |  |
| *IsTargetedSentenceCard |  |
| *PAShowInfo |  |
| *PASeparateWordCard |  |
| *PASeparateSentenceCard |  |
| *PATestOnlyWord |  |
| *PADoNotTest |  |
| *SeparateClozeDeletionCard |  |
| Hint |  |
| HintNotHidden |  |
| Picture |  |
| WordAudio | `{audio}` |
| SentenceAudio |  |
| PAGraphs | `{jpmn-pitch-accent-graphs}` |
| PASilence | `[sound:_silence.wav]` |
| FrequenciesStylized | `{jpmn-frequencies}` |
| SecondaryDefinition | `{jpmn-secondary-definition}` |
| ExtraDefinitions | `{jpmn-extra-definitions}` |
| UtilityDictionaries | `{jpmn-utility-dictionaries}` |
| Comment |  |



The above fields will create, by default:
* A vocab card that does not test pitch accent
* Shows the first monolingual definition (if not found, uses the first bilingual definition)
* All other definitions in collapsable fields

Anything field with a * are binary fields, and **should be configured to each user's personal
preferences.** I personally like separating the pitch accent card by default, hence my normal setup
has the `PASeparateSentenceCard` field filled in (say, with `1` in Yomichan).
More info on how to configure the default values is shown (TODO)

Note that markers like `{jpmn-primary-definition}` is not provided by Yomichan by default.
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

* If you have existing template code already, I highly recommend
  **resetting the templates** (bottom right corner, red button)
  unless you know exactly what you are doing.
  If you are updating from a previous version of this card,
  absolutely reset the templates before moving on.

After resetting the templates,
**without** removing any of the existing template code,
add the following template code as follows:

1. Copy and paste the code below to the **top** of the default Yomichan template code:

   <details>
   <summary><i>Click here to show the template code to copy.</i></summary>


       {{~! NOTE: this MUST be put at the very top of the templates section! ~}}

       {{~! REGEX ~}}
       {{~! matches most JMdict dictionaries and 新和英 ~}}
       {{~#set "bilingual-dict-regex"~}} ^(([Jj][Mm][Dd]ict)(?! Surface Forms)(.*)|新和英.*|日本語文法辞典.*)(\[object Object\])?$ {{~/set~}}
       {{~#set "utility-dict-regex"~}} ^(NHK.*|シン・漢字遣い参考|JMDict Surface Forms)(\[object Object\])?$ {{~/set~}}
       {{~#set "ignored-dict-regex"~}} ^(ADD IGNORED DICTIONARIES HERE)(\[object Object\])?$ {{~/set~}}

       {{~! OPTIONS ~}}
       {{~! valid values: "bilingual", "monolingual" ~}}
       {{~#set "opt-first-definition-type" "bilingual"}}{{/set~}}





   </details>
   <br>

2. Copy and paste the code below to the **bottom** of the default Yomichan template code:

   <details>
   <summary><i>Click here to show the template code to copy.</i></summary>


       {{~! NOTE: this should be put at the very bottom of the templates section! ~}}

       {{~!
           ==================
            helper functions
           ==================
       ~}}

       {{#*inline "s"}}{{/inline}}

       {{~! categorizes into 3 types: "bilingual", "monolingual", or "pitch-accent" ~}}
       {{~#*inline "jpmn-get-dict-type"~}}
           {{~#if (op "!==" (regexMatch (get "ignored-dict-regex") "gu" dictionaryName) "")~}}
               ignored
           {{~else if (op "!==" (regexMatch (get "bilingual-dict-regex") "gu" dictionaryName) "")~}}
               bilingual
           {{~else if (op "!==" (regexMatch (get "utility-dict-regex") "gu" dictionaryName) "")~}}
               utility
           {{~else~}}
               {{~! assumed that anything else is a monolingual dictionary ~}}
               monolingual
           {{~/if~}}
       {{~/inline~}}


       {{~! primary def: first monolingual (or first bilingual if no monolingual dicts found) ~}}
       {{~#*inline "jpmn-get-primary-definition-dict"~}}
           {{~#scope~}}


               {{~#if (op "===" (get "opt-dictionary-export") "bilingual")~}}
                   {{~#set "first-definition-search-type-1" "bilingual"}}{{/set~}}
                   {{~#set "first-definition-search-type-2" "monolingual"}}{{/set~}}
               {{~else~}}
                   {{~#set "first-definition-search-type-1" "monolingual"}}{{/set~}}
                   {{~#set "first-definition-search-type-2" "bilingual"}}{{/set~}}
               {{~/if~}}


               {{~! first-dictionary === null <=> no valid dictionary was found ~}}
               {{~#set "first-dictionary" null}}{{/set~}}

               {{~#each definition.definitions~}}

                   {{~#set "test-dict-name"}}{{~> jpmn-get-dict-type . dictionaryName=dictionary ~}}{{/set~}}
                   {{~#if (op "===" (get "test-dict-name") (get "first-definition-search-type-1"))~}}
                       {{~#if (op "===" null (get "first-dictionary"))~}}
                           {{~#set "first-dictionary" dictionary~}}{{~/set~}}
                       {{~/if~}}
                   {{~/if~}}

               {{~/each~}}


               {{~! uses other dictionary type, last resort ~}}
               {{~#if (op "===" (get "first-dictionary") null)~}}

                   {{~#each definition.definitions~}}

                       {{~#set "test-dict-name"}}{{~> jpmn-get-dict-type . dictionaryName=dictionary ~}}{{/set~}}
                       {{~#if (op "===" (get "test-dict-name") (get "first-definition-search-type-2"))~}}
                           {{~#if (op "===" null (get "first-dictionary"))~}}
                               {{~#set "first-dictionary" dictionary~}}{{~/set~}}
                           {{~/if~}}
                       {{~/if~}}

                   {{~/each~}}

               {{~/if~}}

               {{~#get "first-dictionary"~}}{{~/get~}}

           {{~/scope~}}

       {{~/inline~}}


       {{~! custom glossary-single function for additional regex parsing per dictionary ~}}
       {{~! OVERRIDES brief and noDictionaryTag ~}}
       {{#*inline "jpmn-glossary-single"}}
           {{~#scope~}}
               {{~#if (op "===" dictionary "NHK日本語発音アクセント新辞典")~}}
                   {{~#regexReplace "<br> ・" "<br>" "g"~}}
                       {{~> jpmn-glossary-single-override . ~}}
                   {{~/regexReplace~}}
               {{~else~}}
                   {{~> jpmn-glossary-single-override . ~}}
               {{~/if~}}
           {{~/scope~}}
       {{/inline}}


       {{~! custom glossary-single function to add custom html around the dictionary and tags ~}}
       {{#*inline "jpmn-glossary-single-override"}}

           {{~#scope~}}

               <span class="dict-group__tag-list"> {{~s~}}

                   {{~! only italics if jp-characters-regex finds no matches ~}}
                   {{~#set "italics-start"}}{{/set~}}
                   {{~#set "italics-end"}}{{/set~}}

                   {{~#set "any" false}}{{/set~}}
                   {{~#each definitionTags~}}

                       <span class="dict-group__tag dict-group__tag--name"> {{~s~}}
                           <span class="dict-group__tag-inner"> {{~s~}}
                               {{~name~}}
                           </span> {{~s~}}
                       </span> {{~s~}}

                   {{~/each~}}
                   {{~#unless noDictionaryTag~}}

                       <span class="dict-group__tag dict-group__tag--dict"> {{~s~}}
                           <span class="dict-group__tag-inner"> {{~s~}}
                               {{~dictionary~}}
                           </span> {{~s~}}
                       </span> {{~s~}}

                   {{~/unless~}}
                   {{~#if (get "any")}}){{#get "italics-end"}}{{/get}} {{/if~}}

               </span> {{~s~}}

               <span class="dict-group__glossary"> {{~s~}}
                   {{~#each glossary}}{{#formatGlossary ../dictionary}}{{{.}}}{{/formatGlossary}}{{#unless @last}} | {{/unless}}{{/each~}}
               </span> {{~s~}}

           {{~/scope~}}

           {{~#if only~}}({{#each only}}{{.}}{{#unless @last}}, {{/unless}}{{/each}} only) {{/if~}}
       {{/inline}}


       {{~!
           =============
            frequencies
           =============
       ~}}

       {{#*inline "jpmn-frequencies"}}
           {{~#if (op ">" definition.frequencies.length 0)~}}
               <div class="frequencies">
               {{~#each definition.frequencies~}}
                   <div class="frequencies__group" data-details="{{~dictionary~}}"> {{~s~}}
                       <div class="frequencies__number"> {{~s~}}
                           <span class="frequencies__number-inner">{{~frequency~}}</span> {{~s~}}
                       </div> {{~s~}}
                       <div class="frequencies__dictionary"> {{~s~}}
                           <span class="frequencies__dictionary-inner"> {{~s~}}
                               <span class="frequencies__dictionary-inner2">{{~dictionary~}}</span> {{~s~}}
                           </span> {{~s~}}
                       </div> {{~s~}}
                   </div>
               {{~/each~}}
               </div>
           {{~/if~}}
       {{/inline}}


       {{~!
           ==============
            pitch accent
           ==============
       ~}}

       {{#*inline "jpmn-pitch-accent-graphs"}}
           {{~#if (op ">" pitchCount 0)~}}
               {{~#each pitches~}}
                   <div class="pa-graphs__group" data-details="{{dictionary}}"> {{~s~}}
                       <div class="pa-graphs__dictionary"> {{~s~}}
                           <div class="pa-graphs__dictionary-inner"> {{~s~}}
                               {{~dictionary~}}
                           </div> {{~s~}}
                       </div> {{~s~}}
                       <ol> {{~s~}}
                           {{~#each pitches~}}
                               <li>
                                   {{~> pitch-accent-item-disambiguation~}}

                                   {{~#scope~}}
                                       {{~#set "any" false}}{{/set~}}
                                       {{~#each tags~}}
                                           {{~#if (get "any")}}, {{else}}({{/if~}}
                                           {{name}}
                                           {{~#set "any" true}}{{/set~}}
                                       {{~/each~}}
                                       {{~#if (get "any")}}) {{/if~}}
                                   {{~/scope~}}

                                   {{~> pitch-accent-item format="graph"~}}
                               </li>
                           {{~/each~}}
                       </ol> {{~s~}}
                   </div>
               {{~/each~}}
           {{~/if~}}
       {{/inline}}


       {{~!
           ==============
            dictionaries
           ==============
       ~}}


       {{~! primary def: first monolingual (or first bilingual if no monolingual dicts found) ~}}
       {{~! does the reverse if opt-first-definition-type is "bilingual" ~}}
       {{~#*inline "jpmn-primary-definition"~}}

           {{~#scope~}}

               {{~#set "primary-dictionary"}}{{~> jpmn-get-primary-definition-dict . ~}}{{/set~}}

               {{~#if (op "!==" (get "primary-dictionary") "")~}}
                   <ol>
                   {{~#each definition.definitions~}}
                       {{~#if (op "===" dictionary (get "primary-dictionary"))~}}
                           <li data-details="{{~dictionary~}}">
                               {{~> jpmn-glossary-single . brief=../brief noDictionaryTag=../noDictionaryTag ~}}
                           </li>
                       {{~/if~}}
                   {{~/each~}}
                   </ol>
               {{~/if~}}

           {{~/scope~}}

       {{~/inline~}}


       {{~! extra def: bilingual defs (excluding primary def) ~}}
       {{~#*inline "jpmn-secondary-definition"~}}

           {{~#scope~}}

               {{~#set "primary-dictionary"}}{{~> jpmn-get-primary-definition-dict . ~}}{{/set~}}

               {{~#if (op "!==" (get "primary-dictionary") "")~}}

                   {{~! looks to see if another dictionary exists ~}}
                   {{~#set "valid-dict" false}}{{/set~}}

                   {{~#each definition.definitions~}}
                       {{~#set "test-dict-name"}}{{~> jpmn-get-dict-type . dictionaryName=dictionary ~}}{{/set~}}
                       {{~#if (op "&&" (op "===" (get "test-dict-name") "bilingual") (op "!==" (get "primary-dictionary") dictionary))~}}
                           {{~#set "valid-dict" true}}{{/set~}}
                       {{~/if~}}
                   {{~/each~}}

                   {{~#if (get "valid-dict") ~}}
                       <ol>
                       {{~#each definition.definitions~}}
                           {{~#set "test-dict-name"}}{{~> jpmn-get-dict-type . dictionaryName=dictionary ~}}{{/set~}}
                           {{~#if (op "&&" (op "===" (get "test-dict-name") "bilingual") (op "!==" (get "primary-dictionary") dictionary))~}}

                               <li data-details="{{~dictionary~}}">
                                   {{~> jpmn-glossary-single . brief=../brief noDictionaryTag=../noDictionaryTag ~}}
                               </li>

                           {{~/if~}}
                       {{~/each~}}
                       </ol>
                   {{~/if~}}
               {{~/if~}}

           {{~/scope~}}

       {{~/inline~}}


       {{~! extra def: monolingual defs (excluding primary def) ~}}
       {{~#*inline "jpmn-extra-definitions"~}}

           {{~#scope~}}

               {{~#set "primary-dictionary"}}{{~> jpmn-get-primary-definition-dict . ~}}{{/set~}}

               {{~#if (op "!==" (get "primary-dictionary") "")~}}

                   {{~! looks to see if another dictionary exists ~}}
                   {{~#set "valid-dict" false}}{{/set~}}

                   {{~#each definition.definitions~}}
                       {{~#set "test-dict-name"}}{{~> jpmn-get-dict-type . dictionaryName=dictionary ~}}{{/set~}}
                       {{~#if (op "&&" (op "===" (get "test-dict-name") "monolingual") (op "!==" (get "primary-dictionary") dictionary))~}}
                           {{~#set "valid-dict" true}}{{/set~}}
                       {{~/if~}}
                   {{~/each~}}

                   {{~#if (get "valid-dict") ~}}
                       <ol>
                       {{~#each definition.definitions~}}
                           {{~#set "test-dict-name"}}{{~> jpmn-get-dict-type . dictionaryName=dictionary ~}}{{/set~}}
                           {{~#if (op "&&" (op "===" (get "test-dict-name") "monolingual") (op "!==" (get "primary-dictionary") dictionary))~}}
                               <li data-details="{{~dictionary~}}">
                                   {{~> jpmn-glossary-single . brief=../brief noDictionaryTag=../noDictionaryTag ~}}
                               </li>
                           {{~/if~}}
                       {{~/each~}}
                       </ol>
                   {{~/if~}}
               {{~/if~}}

           {{~/scope~}}

       {{~/inline~}}



       {{~! pitch accent info: all pitch accent info dictionaries ~}}

       {{~#*inline "jpmn-utility-dictionaries"~}}

           {{~#scope~}}

               {{~! looks to see if another dictionary exists ~}}
               {{~#set "valid-dict" false}}{{/set~}}

               {{~#each definition.definitions~}}
                   {{~#set "test-dict-name"}}{{~> jpmn-get-dict-type . dictionaryName=dictionary ~}}{{/set~}}
                   {{~#if (op "===" (get "test-dict-name") "utility")~}}
                       {{~#set "valid-dict" true}}{{/set~}}
                   {{~/if~}}
               {{~/each~}}

               {{~#if (get "valid-dict") ~}}
                   <ol>
                   {{~#each definition.definitions~}}
                       {{~#set "test-dict-name"}}{{~> jpmn-get-dict-type . dictionaryName=dictionary ~}}{{/set~}}
                       {{~#if (op "===" (get "test-dict-name") "utility")~}}
                           <li data-details="{{~dictionary~}}">
                               {{~> jpmn-glossary-single . brief=../brief noDictionaryTag=../noDictionaryTag ~}}
                           </li>
                       {{~/if~}}
                   {{~/each~}}
                   </ol>
               {{~/if~}}

           {{~/scope~}}

       {{~/inline~}}




   </details>
   <br>


<!--
TODO test what happens with biliingual defs

By default, this will grab the monolingual definition in the primary definition field,
bilingual definitions in the secondary definition field, and monolingual definitions
in the extra definitions field.
-->

If you want to grab the monolingual definition first, change
```
{{~#set "opt-first-definition-type" "bilingual"}}{{/set~}}
```
to
```
{{~#set "opt-first-definition-type" "monolingual"}}{{/set~}}
```


Various other customizations can be easily done, such as:
- Various styling to the frequency list and pitch accent graph entries
- Specifying exactly which dictionaries are monolingual and bilingual

For more information on the templates used here, including **customization and troubleshooting**,
see the templates section [here](yomichantemplates).


## Other Yomichan Settings
* Again, if you have never used Yomichan before, I recommend checking out
  [this page](https://learnjapanese.moe/yomichan/).
* The layout of Yomichan **changes the appearance of the exported card**.
  To get exactly the same look as the sample images and cards type,
  use "Compact glossaries" turned on and "Compact tags" turned off,
  found under Yomichan settings →  "Popup Appearance".
* If you are planning on using the JMDict dictionary,
  I recommend downloading from the
  [official site](https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project)
  and using [yomichan-import](https://github.com/FooSoft/yomichan-import)
  to get the latest jmdict version available.
* [This](https://gist.github.com/Rudo2204/55f418885c2447ccbdc95b0511e20336)
  link has further template code, which creates markers for individual dictionaries.
  This has certain extended capabilities over my template code, such as removing the first line.
* Instructions on adding Forvo as an alternate audio source to Yomichan
  can be found [here](https://learnjapanese.moe/yomichan/#bonus-adding-forvo-extra-audio-source)



# Creating the Cards
I use a texthooker setup, which is able to extract subtitles or text into the browser.
Once the text is on the browser, you can use Yomichan to select the word and create the
Anki card.
This texthooker setup works for most games, and any show with subtitle file.
The texthooker process has already been explained in great detail by
many other smart people in the following links:
* [Texthooker basics](https://rentry.co/mining#browser)
* [Texthooker basics & Visual Novels](https://learnjapanese.moe/vn/#playing-visual-novels-to-learn-japanese)

The setup also works with video files if the video player supports automated copying of subtitles,
and if you have the correct subtitle files.
* MPV with either mpvacious or Immersive plugins supports this workflow, as detailed in the next section.
* Many anime subtitle files can be found under
[kitsuneko](https://kitsunekko.net/dirlist.php?dir=subtitles%2Fjapanese%2F).



# Automating Pictures and Sentence Audio
If you've made it this far, then congratulations!
Most fields of the cards have been automatically filled out, just from Yomichan alone!
Yomichan is able to automatically generate everything **EXCEPT** the pictures and sentence audio
from the media you are consuming.
Fortunately, that can be automated as well.

However, the tools to automate that will likely be slightly different for each individual
user as it depends on what media they consume, operating system / device, etc.
Instead of walking you through how to get these to work,
I will instead provide a list of resources you can use.
Of course, this list is incomplete, and there could be tools better suited for your workflow.


[**mpvacious**](https://github.com/Ajatt-Tools/mpvacious)
* Plugin for [MPV](https://mpv.io/), a cross platform media player. Personally tested.
* Given a subtitle file for a movie file, it can automatically add sentence audio and images with one `Ctrl+n` command.

[**Immersive**](https://github.com/Ben-Kerman/immersive)
* A powerful alternative to the mpvacious plugin above, with certain different capabilities.
* Can also be used to automatically extract sentence audio and pictures.

[**asbplayer**](https://github.com/killergerbah/asbplayer)
* Cross platform (chromium) browser video player. Personally tested.
* This also has card image and audio exporting capabilities.
* Works on video streaming sites as well.

[**Animebook**](https://github.com/animebook/animebook.github.io)
* Cross platform (chromium) browser video player.
* This also has card image and audio exporting capabilities.

[**ShareX**](https://getsharex.com/)
* Windows media recorder which can both take screenshots and record audio. Personally tested.
* This can be automated to add audio and pictures to the most recently added anki card
  by following the instructions
  [here](https://rentry.co/mining#sharex).
* Useful for things that don't have an easy way of getting audio, such as visual novels.

[**ames**](https://github.com/eshrh/ames)
* ShareX alternative for Linux. Personally tested.
* Primarily used to automate audio and picture extraction to the most recently added anki card.

[**jidoujisho**](https://github.com/lrorpilla/jidoujisho)
* Android reader and media player, which can also create Anki cards.
* Note that this app does NOT use Yomichan, which means that certain fields may not be filled automatically

[**mokuro**](https://github.com/kha-white/mokuro)
* This is not something that can automatically add images or audio to your cards,
  BUT it allows you to use popup-dictionaries like Yomichan on manga (an actual game-changer).


# Optional Yomichan & Anki Setup

## Audio Sources
TheMoeWay documents two setups for getting audio:
* If you have 3.5gb of free space, you can use
    [locally downloaded audio files](https://learnjapanese.moe/yomichan/#offline-audio-server).
    This is useful in two ways:
    * You are able to get word audio regardless of internet connection.
    * Card creation is significantly faster (for me personally, it reduced card creation time from around 5 seconds to less than half a second.)

  **Note:** that if you are using linux,
  unzip the files with the following command: `unzip -O shift-jis filename.zip`

  **Note:** There is an alternative setup for this with the files as described in The Moe Way discord server
  [here](http://discordapp.com/channels/617136488840429598/778430038159655012/984607054616481832).
  (TODO pastebin mirror)
  The main difference is that this uses sqlite,
  so the database is saved on the disk to prevent excessive memory caching
  (each time anki loads, about 250MB of data has to be loaded into memory for the original plugin to work.)
  * To use this, replace the python files with the ones linked above.
  * This requires Anki 2.1.50 or greater.

* [Forvo](https://learnjapanese.moe/yomichan/#bonus-adding-forvo-extra-audio-source)
    as a backup audio source, in case previous sources do not have audio.


## Anki Plugin(s)
These plugin(s) assist in card creation, but are ultimately optional.
* Paste Images As WebP [(link)](https://ankiweb.net/shared/info/1151815987)


## Separate Pitch Accent Deck
If you want card types to go to a different deck by default, you can change it by doing the following:

Browse (top middle)
→  Cards
→  Card Type selector (top of the screen)
→  (choose pitch accent card type)
→  Options
→  Deck Override


# Updating
(TODO steps on how to update)


# Conclusion
If everything is setup correctly, then the difficult part is finally done!
The cards can now be created at ease, and now all that's left is understanding how to
use and edit the card itself.
Head over to [Usage](usage) to see exactly that.


