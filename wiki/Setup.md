
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



# Installing the Card
There are two ways of installing the card:


## The Automatic Way
If you know what `git` and `python` is, here's all you have to do:

```
git clone https://github.com/Aquafina-water-bottle/jp-mining-note.git
cd ./jp-mining-note
# Ensure you have Anki open, and with anki-connect running
# Also ensure that you have python 3.10+ installed.
# It *MAY* work with lower versions of python, but I make no such guarantee. ;)
python ./tools/install.py
```

The above does the following:
- Installs the latest version of the note
- Installs the required fonts


## The Normal Way
If the above made literally no sense to you,
or you just want to install this normally,
here's the normal way of installing the cards:

1. Go to the [releases page](https://github.com/Aquafina-water-bottle/jp-mining-note/releases)
    and download the cards from the latest release.
    You should download the `{version}-jpmn_example_cards.apkg` file.
2. After you download the cards, import them by navigating to Anki by doing the following:
    - `File` (top left corner) →  `Import...`
3. By default, the custom fonts do not come with the `.apkg` file.
    To install these fonts, head over to this
    repository's [media folder](https://github.com/Aquafina-water-bottle/jp-mining-note/tree/master/media)
    and download the 4 `.otf` files.
4. Move the `.otf` files into the media folder of your deck.
    This folder should be located under:
    - (windows) `C:\Users\{username}\AppData\Roaming\Anki2\{deck_name}\collecion.media`
    - (nix) `~/.local/share/Anki2/{deck_name}/collection.media`

(TODO gif)


## Final Steps
You should see a deck `JPMN-Examples` in your collection.
View one of the cards and make sure the card looks similar to the one below:

[[assets/eg_fushinnsha.png]]


<br>

# Anki Setup
For this card type to work, some Anki addons are required to connect to external sources and to auto-generate
certain fields.

## Required Anki Plugins
To download all the required plugins, copy and paste the following numbers into the Add-ons window.
(`Tools` →  `Add-ons` →  `Get Add-ons...`)
```
1344485230 1225470483 2055492159 181103283
```

[[assets/anki/addons_install.png]]


**Note**: <br>
You will have to restart Anki after downloading and after editing the configuration
file for the changes to take effect.

After installing the add-ons, you will have to change the configs of the add-ons
to work with this note type.
Continue reading to see the required config changes.

#### AJT Furigana
[(Link)](https://ankiweb.net/shared/info/1344485230)
Alternative and up-to-date version of JapaneseSupport.
Automatically generates furigana upon yomichan card creation.

**Note**:
Furigana generation is occasionally incorrect,
so if you plan on using these regularly, you should double-check the readings
to make sure they are correct.

**Config Changes**: <br>
To change the config of any Anki add-on, head over to
`Tools` →  `Add-ons` →  (select the add-on) →  `Config`.

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

To explain the changes:
- `generate_on_note_add` ensures that the pitch accent is added upon initial note creation.
- The change to `fields` changes the field names to match this note type.
- Similarily, the `note_types` changes makes the add-on work with this specific note type.


<br>

#### AJT Pitch Accent
[(Link)](https://ankiweb.net/shared/info/1225470483)
Automatically adds pitch accent info given the word.

**Note**: <br>
Although I have a field for Yomichan to import the pitch accent graph (`PAGraphs`), I primarily use the
pitch accent info generated from this plugin because I personally find it easier to edit.
You can read more about editing pitch accent in the [usage page](setup#modifying-pitch-accent).


**Config Changes**: <br>
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

To explain the changes:
- `generate_on_note_add` and `note_types` are changed similarly in the previous section.
- `destination_fields` and `source_fields` are changed similarily to `fields` in the previous section.
- `styles` adds custom stylization that creates the pitch accent lines and downsteps as you see
    in the example note.


#### AnkiConnect
[(Link)](https://ankiweb.net/shared/info/2055492159)
Required for Yomichan and most other Anki-related automated tasks to work.
I use the default config that comes with the plugin.

<br>

#### CSS Injector
[(Link)](https://ankiweb.net/shared/info/181103283)
This plugin is not strictly necessary.
However, if you don't use this, the fields within the Anki field editor
won't have certain stylizations that makes the field actually interpretable,
so I *strongly* recommend using this.

[[assets/css_injector.png]]

There are two ways of using css injector with this note type:

1. Automatically updates with the card (recommended)
    - As a preliminary step, you will have to remove the empty `field.css` file
      that comes with the plugin.
      That can be done through command line (below), or you can simply navigate to the
      `addons21\181103283\user_files` folder and delete `field.css`.

      ```
      # windows command
      # be sure to change USERNAME to your computer username!
      rm "C:\Users\USERNAME\AppData\Roaming\Anki2\addons21\181103283\user_files\field.css"

      # nix command
      rm "~/.local/share/Anki2/addons21/181103283/user_files/field.css"
      ```

    - For Windows users, run these two commands in command prompt with elevated permissions (be sure to change `USERNAME` to your computer username and `PROFILENAME` to your Anki profile):

      ```
      mklink "C:\Users\USERNAME\AppData\Roaming\Anki2\addons21\181103283\user_files\field.css" "C:\Users\USERNAME\AppData\Roaming\Anki2\PROFILENAME\collection.media\_field.css"
      ```
      **Note**: <br>
      There are two `USERNAME`'s to replace, and one `PROFILENAME` to replace in the above command.
      Make sure to replace all the fields!

      **Note**: <br>
      If you've never used command prompt before, check
      [this](https://www.howtogeek.com/194041/how-to-open-the-command-prompt-as-administrator-in-windows-8.1/).

    - For nix users, run the following command (be sure to change `PROFILENAME` to your Anki profile):

      ```
      ln -s "~/.local/share/Anki2/PROFILENAME/collection.media/_field.css" "~/.local/share/Anki2/addons21/181103283/user_files/field.css"
      ```

2. Manually without respecting updates:
    1. Navigate to css injector plugin directory (`Anki2/addons21/181103283/user_files`)
    2. Remove the existing `field.css` file
    3. Manually copy the `_field.css` file (found under your profile's `media` directory)
       into the css injector plugin directory
    4. Rename `_field.css` into `field.css`.

    **Note**: <br>
    If the `_field.css` file ever updates, you will have to manually copy and rename the file again
    into the correct position.


#### Final Steps
After the above setup, make sure to restart Anki for the plugins and config changes to take effect.
If the css injector add-on is installed correctly, your Anki field editor should now have color!

<br>


# Transfer existing notes
If you wish to transfer existing cards into this note type,
please see [this page](importing).

<br>



# Updating the Note
If you wish to update the note, follow the steps in [this page](updating) (TODO, WIP PAGE).

**Note**: <br>
This note doesn't auto-update, as it is extremely likely that people will be editing the note
type for their own setups.
Plus, who even likes Windows updates? ;)



<br>

# Yomichan Setup
[Yomichan](https://github.com/FooSoft/yomichan)
is the main program that will create the cards. You can download Yomichan as a Firefox extension
or under the Chrome web store.
This will go over the very basic Yomichan setup to work with this card type.

**If you have never used Yomichan before**, please see
[this page](https://learnjapanese.moe/yomichan/) first to get it working.


## Preliminary Steps
If you have used Yomichan before, please make a backup of your settings (just in case):
* Navigate to Yomichan Settings.
* Go to the "Backup" section
* Select "Export Settings"

[[assets/yomichan/import_settings.gif]]


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
| *PATestOnlyWord |  |
| *PADoNotTest |  |
| *PASeparateWordCard |  |
| *PASeparateSentenceCard |  |
| *SeparateClozeDeletionCard |  |
| Hint |  |
| HintNotHidden |  |
| Picture |  |
| WordAudio | `{audio}` |
| SentenceAudio |  |
| PAGraphs | `{jpmn-pitch-accent-graphs}` |
| PASilence | `[sound:_silence.wav]` |
| FrequenciesStylized | `{jpmn-frequencies}` |
| FrequencySort | `{jpmn-min-freq}` |
| SecondaryDefinition | `{jpmn-secondary-definition}` |
| ExtraDefinitions | `{jpmn-extra-definitions}` |
| UtilityDictionaries | `{jpmn-utility-dictionaries}` |
| Comment |  |



<!--
(TODO gif)
[[assets/anki/media_export.png]]
-->


The above fields will create, by default:
* A vocab card that does not test pitch accent
* Shows the first monolingual definition (if not found, uses the first bilingual definition)
* All other definitions in collapsable fields

Anything field with a * are binary fields, and
**should be configured to each user's personal preferences.**
More info on how to configure the default values is shown (TODO)

Note that markers like `{jpmn-primary-definition}` is not provided by Yomichan by default.
See the section below to make these markers usable.



## Yomichan Templates
Yomichan supports user inserted template code that allows the automatic
separation of bilingual and monolingual dictionary definitions,
among many other things.

**Note**: <br>
For a full video example of the steps below,
see [here](https://user-images.githubusercontent.com/17107540/187789174-f7f71429-1990-49aa-b99a-0aa74e4ff12c.mp4).

To make the new markers usable, do the following:
* Navigate to Yomichan Settings.
* Make sure that advanced settings are turned on (bottom left corner).
* Go to the "Anki" section
* Select "Configure Anki card templates..."
* If you have existing template code already, I highly recommend
  **resetting the templates** (bottom right corner, red button)
  unless you know exactly what you are doing.

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


               {{~#if (op "===" (get "opt-first-definition-type") "bilingual")~}}
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

       {{~! taken from here: https://github.com/MarvNC/JP-Resources#sorting-mined-anki-cards-by-frequency ~}}
       {{#*inline "jpmn-min-freq"}}
           {{~#scope~}}
               {{~#set "min-freq" 0}}{{/set~}}
                   {{#each definition.frequencies}}
                       {{~#if (op "||" (op "===" (get "min-freq") 0) (op ">" (op "+" (get "min-freq")) (op "+" (regexMatch "\d" "g" this.frequency))))}}
                           {{~#set "min-freq" (op "+" (regexMatch "\d" "g" this.frequency))}}{{/set~}}
                       {{~/if~}}
                   {{/each}}
               {{get "min-freq"}}
           {{~/scope~}}
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



If you want the first definition you see (PrimaryDefinition) to be monolingual,
change the following line:
```
{{~#set "opt-first-definition-type" "bilingual"}}{{/set~}}
```
to
```
{{~#set "opt-first-definition-type" "monolingual"}}{{/set~}}
```



(TODO gif)


Various other customizations can be easily done, such as:
- Various styling to the frequency list and pitch accent graph entries
- Specifying exactly which dictionaries are monolingual and bilingual

For more information on the templates used here, including **customization and troubleshooting**,
see the templates section [here](yomichantemplates).


## Other Yomichan Settings
* Again, if you have never used Yomichan before, I recommend checking out
  [this page](https://learnjapanese.moe/yomichan/).
<!--* The layout of Yomichan **changes the appearance of the exported card**.
  To get exactly the same look as the sample images and cards type,
  use "Compact glossaries" turned on and "Compact tags" turned off,
  found under Yomichan settings →  "Popup Appearance".-->
* If you are planning on using the JMDict dictionary,
  I recommend downloading from the
  [official site](https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project)
  and using [yomichan-import](https://github.com/FooSoft/yomichan-import)
  to get the latest jmdict version available.
  This is because other sources could have older definitions,
  which usually means less accurate definitions.
* [This](https://gist.github.com/Rudo2204/55f418885c2447ccbdc95b0511e20336)
  link has further template code, which creates markers for individual dictionaries.
  This has certain extended capabilities over my template code, such as removing the first line.
* Instructions on adding Forvo as an alternate audio source to Yomichan
  can be found [here](https://learnjapanese.moe/yomichan/#bonus-adding-forvo-extra-audio-source)



# Creating the Cards
I use a texthooker setup, which is able to extract subtitles or text into the browser.
Once the text is on the browser, you can use Yomichan to select the word and create the
Anki card (click on the green plus button).
Here's an excerpt of text you can test Yomichan on:

「や、いらっしゃい。ま、毒を食らわば皿までって言うしね。あ、違うか。乗り掛かった船？」

(TODO gif)

The classic texthooker setup works for most games, and any show with subtitle file.
This texthooker process has already been explained in great detail by
many other smart people in the following links:
* [Texthooker basics](https://rentry.co/mining#browser)
* [Texthooker basics & Visual Novels](https://learnjapanese.moe/vn/#playing-visual-novels-to-learn-japanese)

The setup also works with video files if the video player supports automated copying of subtitles,
and if you have the correct subtitle files.
* MPV with either `mpvacious` or `Immersive` plugins supports this workflow, as detailed in the next section.
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

`Browse` (top middle) <br>
→  `Cards...` (right above the `Key` field, NOT the `Cards` dropdown menu at the top right corner) <br>
→  `Card Type` dropdown (top of the screen) <br>
→  (choose pitch accent card type) <br>
→  `Options` (the first `Options` you see at the very top of the screen) <br>
→  `Deck Override...`


# Updating
(TODO steps on how to update)


# Conclusion
If everything is setup correctly, then the difficult part is finally done!
The cards can now be created at ease, and now all that's left is understanding how to
use and edit the card itself.
Head over to [Usage](usage) to see exactly that.


