
This entire section is dedicated to providing the minimal setup to properly create
cards with this note type.
Note that this setup is primarly PC based,
and requires **Anki** and **Yomichan** for the main card creation process.

<!--
If you are on PC (Windows, MacOS, Linux, etc.), **the following setup should work**.
Otherwise, see the following sections to see how the cards should be filled
with your card exporter:
* [Yomichan Fields](setup#yomichan-fields)
* [Anki Field Reference](usage#anki-field-reference)
-->



# Table of Contents
1. [Prerequisites](setup#prerequisites)
1. [Installing](setup#installing-the-card)
1. [Anki Setup](setup#anki-setup)
1. [Updating the Note](setup#updating-the-note)
1. [Yomichan Setup](setup#yomichan-setup)
1. [Card Creation](setup#creating-the-cards)
1. [Pictures and Audio](setup#automating-pictures-and-sentence-audio)
1. [Other](setup#other)
1. [Conclusion](setup#conclusion)



# Prerequisites
It is highly recommend that you are using the latest Anki version
(or as close as you can get to the latest Anki version), as the note is primarily tested
and maintained on the latest versions of Anki.

Worst case scenario, if any essential add-ons no longer work,
you can downgrade back to your current version.

Similarly, if you downloaded Yomichan from a file, I recommend updating that as well.
(Most users should have installed it from their browser's extension page, in which case
nothing has to be done).


# Installing the Card
There are two ways of installing the card:


## (1) The Automatic Way
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
- Installs the fonts required for the note


## (2) The Normal Way
If the above made literally no sense to you,
or you just want to install this normally,
see below:

* **Note**: <br>
    **Full video example** of the steps below for Linux (Ubuntu) [here](https://user-images.githubusercontent.com/17107540/187803236-9aef0c7f-50ec-4c60-8666-65dd5bb8ace8.mp4))

1. Go to the [releases page](https://github.com/Aquafina-water-bottle/jp-mining-note/releases)
    and download the cards from the latest release.
    You should download the `{version}-jpmn_example_cards.apkg` file.
2. After you download the cards, import them by navigating to Anki by doing the following:
    - `File` (top left corner) →  `Import...`
3. By default, the custom fonts do not come with the `.apkg` file.
    To install these fonts, head over to this
    repository's [media folder](https://github.com/Aquafina-water-bottle/jp-mining-note/tree/master/media)
    and download the 4 `.otf` files.
4. Move the `.otf` files into the [media folder](https://docs.ankiweb.net/files.html#file-locations)
    of your profile (`Anki2/PROFILENAME/collections.media`).



## Verifying the Note Works
You should see a deck `JPMN-Examples` in your collection.
View one of the cards and make sure the card looks similar to the one below:

[[assets/eg_fushinnsha.png]]

Please check the following in particular:
- The fonts should match very similarly with the above example.
- Notice how at the top left corner, the info circle (the "i" encased within the circle)
  is the default grey color.
  If this is red, that means something is wrong with the note.
  Please see [this](faq-general-troubleshooting) section for basic troubleshooting.
- Clicking on the image to zoom should work out of the box.


<br>

# Anki Setup
For this card type to work, some Anki add-ons are required to connect to external sources and to auto-generate
certain fields.

There are also certain add-ons that will **not** be supported by this note type.
Please disable them and restart Anki before continuing.


## Conflicting add-ons
- None since I'm not aware of any currently. Let me know if you find one!


## Required Anki add-ons
To download all the required add-ons, copy and paste the following numbers into the Add-ons window.
(`Tools` →  `Add-ons` →  `Get Add-ons...`)
```
2055492159 181103283
```

[[assets/anki/addons_install.png]]


<!--
* **Note**: <br>
  You will have to restart Anki after downloading and after editing the configuration
  file for the changes to take effect.
-->

After installing the add-ons, you will have to change the configs of the add-ons
to work with this note type.
Continue reading to see the required config changes.


#### Anki-Connect
[(Official page)](https://ankiweb.net/shared/info/2055492159) Code: `2055492159` <br>
Required for Yomichan and most other Anki-related automated tasks to work.
I use the default config that comes with the add-on.

<br>

#### CSS Injector
[(Official page)](https://ankiweb.net/shared/info/181103283) Code: `181103283` <br>
This add-on is not strictly necessary.
However, if you don't use this, the fields within the Anki field editor
won't have certain stylizations that makes the field actually interpretable,
so I *strongly* recommend using this.

[[assets/css_injector.png]]

There are two ways of using css injector with this note type:

##### (1) Automatically updates with the card (recommended)
As a preliminary step, you will have to remove the empty `field.css` file
that comes with the add-on.
That can be done through command line (below), or you can simply navigate to the
`Anki2/addons21/181103283/user_files` folder and delete `field.css`.

```
# windows command
# be sure to change USERNAME to your computer username!
del "C:\Users\USERNAME\AppData\Roaming\Anki2\addons21\181103283\user_files\field.css"

# mac command
rm "~/Library/Application Support/Anki2/addons21/181103283/user_files/field.css"

# linux command
rm "~/.local/share/Anki2/addons21/181103283/user_files/field.css"
```

For **Windows** users, run these two commands in command prompt with elevated permissions
(be sure to change `USERNAME` to your computer username and `PROFILENAME` to your Anki profile):

```
mklink "C:\Users\USERNAME\AppData\Roaming\Anki2\addons21\181103283\user_files\field.css" "C:\Users\USERNAME\AppData\Roaming\Anki2\PROFILENAME\collection.media\_field.css"
```
* **Note**: <br>
  There are two `USERNAME`'s to replace, and one `PROFILENAME` to replace in the above command.
  Make sure to replace all the fields!

* **Note**: <br>
  If you've never used command prompt before, check
  [this](https://www.howtogeek.com/194041/how-to-open-the-command-prompt-as-administrator-in-windows-8.1/).


For **Mac** users, run the following command (be sure to change `PROFILENAME` to your Anki profile):
```
ln -s "~/Library/Application Support/Anki2/PROFILENAME/collection.media/_field.css" "~/Library/Application Support/Anki2/addons21/181103283/user_files/field.css"
```

For **Linux** users, run the following command (be sure to change `PROFILENAME` to your Anki profile):

```
ln -s "~/.local/share/Anki2/PROFILENAME/collection.media/_field.css" "~/.local/share/Anki2/addons21/181103283/user_files/field.css"
```

##### (2) Manually without respecting updates:
1. Navigate to css injector add-on directory (`Anki2/addons21/181103283/user_files`)
2. Remove the existing `field.css` file
3. Manually copy the `_field.css` file (found under your profile's `media` directory)
   into the css injector add-on directory
4. Rename `_field.css` into `field.css`.

* **Note**: <br>
  If the `_field.css` file ever updates, you will have to manually copy and rename the file again
  into the correct position.



## Optional Add-ons
These are a set of optional, but useful add-ons that can easily work with the card.


#### AJT Furigana
[(Official page)](https://ankiweb.net/shared/info/1344485230) Code: `1344485230` <br>
Alternative and up-to-date version of JapaneseSupport.
Automatically generates furigana upon Yomichan card creation.

This add-on is optional, because the card will simply show the sentence without
furigana if there is no furigana generated sentence.

* **Note**: <br>
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

<br>

To explain the changes:
- `generate_on_note_add` ensures that the pitch accent is added upon initial note creation.
- The change to `fields` changes the field names to match this note type.
- Similarily, the `note_types` changes makes the add-on work with this specific note type.


<br>

#### AJT Pitch Accent
[(Official page)](https://ankiweb.net/shared/info/1225470483) Code: `1225470483` <br>
Automatically adds pitch accent info given the word.

For the purposes of the card,
the only purpose that this add-on serves is the following:
- Adds devoiced and nasal information to the existing reading.
- If your Yomichan pitch accent dictionaries did not contain any pitch accent info for the word
  but the add-on does, then it will use the add-on data.

<!--
* **Note**: <br>
  Although I have a field for Yomichan to import the pitch accent graph (`PAGraphs`), I primarily use the
  pitch accent info generated from this add-on because I personally find it easier to edit.
  You can read more about editing pitch accent in the [usage page](usage#modifying-pitch-accent).
-->

**Config Changes**: <br>
The important things to change in the config are `generate_on_note_add`,
`destination_fields`, `source_fields` `note_types`, and `styles`.

<details>
<summary><i>Click here to see the full AJT Pitch Accent config</i></summary>

    {
        "destination_fields": [
            "AJTWordPitch"
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

<br>



## Final Steps
After the above setup, **make sure to restart Anki** for the add-ons and config changes to take effect.
If the css injector add-on is installed correctly, your Anki field editor should now have color!

Additionally, now that Anki-Connect is installed, kanji hover should also be functioning.
Hover over a kanji within the word reading to make sure that a popup appears.
In particular, the 者 kanji in the example 偽者 and 不審者 cards should point to each other.

<br>


# Transfer Existing Notes
If you wish to transfer existing cards into this note type,
please see [this page](importing).

<br>



# Updating the Note
If you wish to update the note, follow the steps in [this page](updating).

Be assured that this note doesn't auto-update,
and you have to manually update the note if you want it to update.


<br>

# Yomichan Setup
[Yomichan](https://github.com/FooSoft/yomichan)
is the main program that will create the cards. You can download Yomichan as a Firefox extension
or under the Chrome web store.

This section will go over the minimal Yomichan setup to work with this card type.

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

* **Note**: <br>
    **Full video example** of the steps below [here](https://user-images.githubusercontent.com/17107540/188249030-b1bab33b-49d9-45b8-ba7b-78fbe39e5950.mp4).

1. Navigate to Yomichan Settings.
1. Go to the "Anki" section
1. Select "Anki card format..."
1. Set "Model" as `JP Mining Note`
1. Copy and paste the following values into the fields
   (the custom markers won't be available in the dropdown arrow):

| Anki Fields | Yomichan Format |
|-------------|-----------------|
{% for f, v in FIELDS.items() -%}
| {{ "*" if v["customize"] else "" }}{{ f }} | {{ "`" + v["setup"] + "`" if "setup" in v else "" }} |
{% endfor %}


The above fields will create, by default,
a basic **vocab card** in **bilingual format**,
with all other definitions in collapsable fields.

* **Note**: <br>
  Anything field marked with `*` are binary fields, and
  **should be configured to each user's personal preferences.**
  To change the default value of any of the fields, simply fill
  the field in within the aforementioned `Anki card format...` section.

The custom markers like `{jpmn-primary-definition}` is not provided by Yomichan by default.
See the section below to make these markers usable.



## Yomichan Templates
Yomichan supports user inserted template code that allows the automatic
separation of bilingual and monolingual dictionary definitions, custom stylization, etc.
This note type makes heavy use of these custom templates.

* **Note**: <br>
    **Full video example** of the steps below [here](https://user-images.githubusercontent.com/17107540/187789174-f7f71429-1990-49aa-b99a-0aa74e4ff12c.mp4).

To make the new markers usable, do the following:
1. Navigate to Yomichan Settings.
1. Make sure that advanced settings are turned on (bottom left corner).
1. Go to the "Anki" section
1. Select "Configure Anki card templates..."
1. If you have existing template code already, I highly recommend
   **resetting the templates** (bottom right corner, red button)
   unless you know exactly what you are doing.

After resetting the templates,
**without** removing any of the existing template code,
add the following template code as follows:

1. Copy and paste the code below to the **top** of the default Yomichan template code:

   <details>
   <summary><i>Click here to show the template code to copy.</i></summary>

{% filter indent(width=7) %}
{{ TOP_YOMICHAN }}
{% endfilter %}

   </details>
   <br>

2. Copy and paste the code below to the **bottom** of the default Yomichan template code:

   <details>
   <summary><i>Click here to show the template code to copy.</i></summary>

{% filter indent(width=7) %}
{{ BOTTOM_YOMICHAN }}
{% endfilter %}

   </details>
   <br>


## Make an example card!
At this point, you should be able to make an example card with Yomichan!

Here's an excerpt of text you can test Yomichan on:

「や、いらっしゃい。ま、毒を食らわば皿までって言うしね。あ、違うか。乗り掛かった船？」

[[assets/yomichan/add_card.gif]]

Obviously, just Yomichan alone doesn't fill every field.
Notably, the picture and sentence audio is missing.

Outside of that, there are some final settings you can adjust within the Yomichan templates
if the card doesn't look quite right.


{%- raw %}
## Yomichan Templates Settings

#### Monolingual Definition

If you want the first definition you see (the `PrimaryDefinition` field) to be monolingual,
change the following line at the top of the templates code:

```
{{~#set "opt-first-definition-type" "bilingual"}}{{/set~}}
```
to
```
{{~#set "opt-first-definition-type" "monolingual"}}{{/set~}}
```



#### Categorization of Dictionaries
If your dictionaries are ending up in the wrong sections,
then it is likely a problem with how the template code categorizes the dictionaries.
If you made a card above, check that your dictionaries are in the expected places.

The foolproof way to check that your dictionaries are correctly categorized is with the
`{jpmn-test-dict-type}` (new as of 0.9.1.2) marker.
Under the Anki Templates code, replace `Card field` with `{jpmn-test-dict-type}` and press `Test`.

[[assets/yomichan/test_dictionary_categorization.gif]]

An example output of the above (on the word 結構) is the following:
```
「旺文社国語辞典 第十一版」: monolingual
「明鏡国語辞典 第二版」: monolingual
「ハイブリッド新辞林」: monolingual
「新明解国語辞典 第五版」: monolingual
「デジタル大辞泉」: monolingual
「NHK日本語発音アクセント新辞典」: utility
「JMDict Surface Forms」: utility
「JMdict (English)」: bilingual
「JMdict (English)」: bilingual
「JMdict (English)」: bilingual
「JMdict (English)」: bilingual
「JMdict (English)」: bilingual
「新和英」: bilingual
```


<!--
The template code **only works** if the bilingual dictionaries
and utility dictionaries are explicitly specified in the templates.

In other words, (as of writing this)
if you use bilingual dictionaries that are not `JMdict` or `新和英`,
or you use a Yomichan dictionary for pitch accent that isn't
`NHK日本語発音アクセント新辞典`,
then you will have to add your dictionary to the handlebars code.
-->


If a dictionary is miscategorized,
you will have to edit `bilingual-dict-regex` or `utility-dict-regex`
at the top of the template code.
Monolingual dictionaries are considered to be dictionaries that aren't either
of the two above, so no handlebars code has to be changed if one were to
use more monolingual dictionaries.

To see how to edit the regex, go to [this section](setup#editing-the-dictionary-regex).


#### Ignoring a Dictionary
If you want to see the dictionary on Yomichan but not have it show on Anki,
you can use the `ignored-dict-regex` option.

To see how to edit the option, see [the section below](setup#editing-the-dictionary-regex).

Conversely, if you want to not see the dictionary on Yomichan but want it to show up on Anki,
[see here](jpresources#hide-the-dictionary-but-allow-it-to-be-used-by-anki).


#### Editing the dictionary regex

To modify a regex string:

1. Determine the exact tag your dictionary has.
   To see this, take a word that has a definition in the desired dictionary, and test
   `{jpmn-test-dict-type}` like above.
   The string inside the quotes 「」 is exactly the tag of the dictionary.

   <!--
   An easy way to see this is by getting a word that is defined in the dictionary and
   exporting it into Anki.
   Within Anki, the dictionary tag should appear in parenthesis before the definition.
   -->

2. Add the dictionary tag to the string, by replacing `ADD_x_DICTIONARIES_HERE`.
   For example, if your bilingual dictionary tag is `Amazing Dictionary`, change
   `ADD_BILINGUAL_DICTIONARIES_HERE` to
   `Amazing Dictionary`.

   If you want to add more than one dictionary, they have to be joined with the `|` character.
   For example, if you want to add the bilingual dictionaries
   `Amazing Dictionary` and `Somewhat-Okay-Dictionary`, change
   `ADD_BILINGUAL_DICTIONARIES_HERE` to
   `Amazing Dictionary|Somewhat-Okay-Dictionary`.

   For completeness, here is the modified line for the second example:
   ```
   {{~#set "bilingual-dict-regex"~}} ^(([Jj][Mm][Dd]ict)(?! Surface Forms)(.*)|新和英.*|日本語文法辞典.*|Amazing Dictionary|Somewhat-Okay-Dictionary)(\[object Object\])?$ {{~/set~}}
   ```


<!--
Various other customizations can be easily done, such as:
- Various styling to the frequency list and pitch accent graph entries
- Specifying exactly which dictionaries are monolingual and bilingual
For more information on the templates used here, including **customization and troubleshooting**,
see the templates section [here](yomichantemplates).
-->

{% endraw %}



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

The classic texthooker setup works for most games, and any show with subtitle file.
This texthooker process has already been explained in great detail by
many other smart people in the following links:
* [Texthooker basics](https://rentry.co/mining#browser)
* [Texthooker basics & Visual Novels](https://learnjapanese.moe/vn/#playing-visual-novels-to-learn-japanese)

The setup also works with video files if the video player supports automated copying of subtitles,
and if you have the correct subtitle files.
* MPV with either `mpvacious` or `Immersive` add-ons supports this workflow, as detailed in the next section.
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
* add-on for [MPV](https://mpv.io/), a cross platform media player. Personally tested.
* Given a subtitle file for a movie file, it can automatically add sentence audio and images with one `Ctrl+n` command.

[**Immersive**](https://github.com/Ben-Kerman/immersive)
* A powerful alternative to the mpvacious add-on above, with certain different capabilities.
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


<!-- TODO move this somewhere else, or just straight up remove it :eyes:

# Optional Yomichan & Anki Setup

## Audio Sources
TheMoeWay documents two setups for getting audio:
* If you have 3.5gb of free space, you can use
    [locally downloaded audio files](https://learnjapanese.moe/yomichan/#offline-audio-server).
    This is useful in two ways:
    * You are able to get word audio regardless of internet connection.
    * Card creation is significantly faster (for me personally, it reduced card creation time from around 5 seconds to less than half a second.)

  **Note:** that if you are using Linux,
  unzip the files with the following command: `unzip -O shift-jis filename.zip`

  TODO document alternative setup with sqlite

  **Note:** There is an alternative setup for this with the files as described in The Moe Way discord server
  [here](http://discordapp.com/channels/617136488840429598/778430038159655012/984607054616481832).
  (TODO pastebin mirror)
  The main difference is that this uses sqlite,
  so the database is saved on the disk to prevent excessive memory caching
  (each time anki loads, about 250MB of data has to be loaded into memory for the original add-on to work.)
  * To use this, replace the python files with the ones linked above.
  * This requires Anki 2.1.50 or greater.

* [Forvo](https://learnjapanese.moe/yomichan/#bonus-adding-forvo-extra-audio-source)
    as a backup audio source, in case previous sources do not have audio.

-->


# Other

## Anki add-on(s)
These add-on(s) assist in card creation, but are ultimately optional.
* Paste Images As WebP [(link)](https://ankiweb.net/shared/info/1151815987)


## Separate Pitch Accent Deck
If you want card types to go to a different deck by default, you can change it by doing the following:

`Browse` (top middle) <br>
→  `Cards...` (around the middle of the screen, right above first field of the note. This is NOT the `Cards` dropdown menu at the top right corner) <br>
→  `Card Type` dropdown (top of the screen) <br>
→  (choose pitch accent card type) <br>
→  `Options` (the first `Options` you see at the very top of the screen) <br>
→  `Deck Override...`


# Conclusion
If everything is setup correctly, then the difficult part is finally done!
The cards can now be created at ease, and now all that's left is understanding how to
use and edit the card itself.
Head over to [Usage](usage) to see exactly that.



