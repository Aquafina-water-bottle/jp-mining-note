This section explains what the templates used for this note type do.
The template code can be found
[here](setup#yomichan-templates) (or for the raw files:
[here](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/yomichan_templates/top.txt) and
[here](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/yomichan_templates/bottom.txt)).


# Definitions
**PA dictionary** (pitch accent dictionary): <br>
Your standard pitch accent dictionary for Yomichan.
Imports and shows pitch accent as normal.


<!--
**YPA dictionary** (pitch accent dictionary for Yomichan):  <br>
This is a pitch accent dictionary that is stylized as a normal Yomichan dictionary (i.e. for definitions),
but it is used to display pitch accent information.
An example can be found [here](https://mega.nz/file/rlIURS5I#oSbcIN3gK7dJLpggf3mN6JHFNazdpI5690uCE-H2eY8).

It's very likely that you won't be using something like this.
-->


**Utility Dictionary**: <br>
There are some dictionaries that don't actually provide the definition of the word,
but serve some other purpose.
Some examples include:
- The NHK Pitch Accent dictionary (except in regular yomichan dictionary form instead of PA dictionary form)
- [JMDict Surface forms](https://github.com/FooSoft/yomichan/issues/2183):
  A dictionary to show alternate spellings of a word, if there are any.

These dictionaries are all grouped together into what I call a "Utility Dictionary".

[[assets/yomichan/pa_utility_dicts.png]]


# What the markers do

### `{jpmn-primary-definition}`
Contains the definitions from the first selected dictionary.

The logic to select the first dictionary works like the following:
- Attempts to get the first bilingual dictionary.
- If there is no bilingual dictionary, then attempts to get the first monolingual dictionary.

This follows the order of how you order your dictionaries in yomichan.
In other words, the first bilingual dictionary shown on the Yomichan popup
is the definition that is chosen here (or if there is no bilingual dictionary,
the first monolingual dictionary shown on the popup.)

Note that this will contain **ALL definitions** in said dictionary.

### `{jpmn-secondary-definition}`
Contains all bilingual dictionaries that is not in the primary definition.

### `{jpmn-extra-definitions}`
Contains all monolingual dictionaries that is not in the primary definition.

### `{jpmn-frequencies}`
Contains the frequency list info, and extra css info
required to display the frequency info.

### `{jpmn-min-freq}`
Contains the smallest frequency in the entire list of installed frequencies.

### `{jpmn-pitch-accent-graphs}`
Contains the pitch accent graphs for all [PA dictionaries](yomichantemplates#definitions).

### `{jpmn-utility-dictionaries}`
Contains the pitch accent info for all [Utility dictionaries](yomichantemplates#definitions).


<!--
**NOTE:** The template code works specifically for if the bilingual dictionaries you use are either
`JMdict (English)` or `新和英` (and must have exactly that tag).
If you are using other bilingual dictionaries, you will have to edit the template code
by stringing together `op` statements.
For example, to add a third monolingual dictionary with the tag of `AmazingDictionary`,
then you can do so by changing the conditions to the following:


**NOTE:** The template code works specifically for if the bilingual dictionaries you use are either
-->

<!--

TODO include points:
- monolingual:
    - primary: 1st mono
    - secondary: all bilingual (ignore if not first option)
    - extra: all other monolingual definitions

- bilingual:
    - primary: 1st bilingual
    - secondary: all other bilingual definitions
    - extra: all monolingual definitions

- note that the above setting makes it difficult to switch between immediately
    - however, only other solution I can think of is using the following fields:
        - first bilingual
        - other bilingual
        - first monolingual
        - other bilingual
        - notes
    - messy, and seperate notes field is not as fun to work with
        - rather just have everything in one field for simplicity
    - if you want to switch, just switch in yomichan templates settings
    - also if you want to test old cards in monolingual:
        - make new cards since it's testing slightly different things

-->


# Monolingual Setup

By default, the primary definition chooses the first bilingual dictionary.
If you want to use the monolingual dictionary first, navigate to the
options at the top of the templates page.

Within this, change the following line:

```
{{~#set "opt-first-definition-type" "bilingual"}}{{/set~}}
```

to:

```
{{~#set "opt-first-definition-type" "monolingual"}}{{/set~}}
```


<!--
# Using a bilingual dictionary first

TODO outdated

By default, the primary definition chooses the first monolingual dictionary.
If you want to use the bilingual dictionary first, navigate to the
options at the top of the templates page.

Within this, change the following:
```
{{~#set "opt-first-dictionary-type" "monolingual"}}{{/set~}}
{{~#set "opt-second-dictionary-type" "bilingual"}}{{/set~}}
```

into:

```
{{~#set "opt-first-dictionary-type" "bilingual"}}{{/set~}}
{{~#set "opt-second-dictionary-type" "monolingual"}}{{/set~}}
```
-->


# Categorization of Dictionaries
The template code **only works** if the bilingual dictionaries
and Yomichan dictionaries for pitch accent are explicitly specified in the templates.

In other words, (as of writing this)
if you use bilingual dictionaries that are not `JMdict` or `新和英`,
or you use a Yomichan dictionary for pitch accent that isn't
`NHK日本語発音アクセント新辞典`,
then you will have to add your dictionary to the handlebars code.

To add another dictionary,
you will have to edit the regex string set at the top of the template code,
under either `bilingual-dict-regex` or `pitch-accent-dict-regex`.
Monolingual dictionaries are considered to be dictionaries that aren't either
of the two above, so no handlebars code has to be changed if one were to
use more monolingual dictionaries.


To modify a regex string:

* Determine the exact tag your dictionary has.
  An easy way to see this is by getting a word that is defined in the dictionary and
  exporting it into Anki.
  Within Anki, the dictionary tag should appear in parenthesis before the definition.

* Add the dictionary tag to the string, by joining it with the `|` character in the first parenthesis.
  For example, if your dictionary tag is `Amazing Dictionary`, change the line

  ```
  {{~#set "bilingual-dict-regex"~}} ^(([Jj][Mm][Dd]ict)(?! Surface Forms)(.*)|新和英.*|日本語文法辞典.*)(\[object Object\])?$ {{~/set~}}
  ```
  to:
  ```
  {{~#set "bilingual-dict-regex"~}} ^(([Jj][Mm][Dd]ict)(?! Surface Forms)(.*)|新和英.*|日本語文法辞典.*|Amazing Dictionary)(\[object Object\])?$ {{~/set~}}
  ```

To test whether the regex works, one can use the following template to test:
```
{{~#*inline "jpmn-test-dict-type"~}}
{{~#scope~}}
{{~#each definition.definitions~}}
- {{dictionary}}: {{~> jpmn-get-dict-type . dictionaryName=dictionary}}
{{/each~}}
{{~/scope~}}
{{~/inline~}}
```

An example output of the above is the following:
```
- 旺文社国語辞典 第十一版:monolingual
- 明鏡国語辞典:monolingual
- ハイブリッド新辞林:monolingual
- 新明解国語辞典 第五版:monolingual
- デジタル大辞泉:monolingual
- 漢字源:monolingual
- シン・漢字遣い参考:monolingual
- JMdict (English):bilingual
- JMdict (English):bilingual
- 新和英:bilingual
- NHK日本語発音アクセント新辞典:pitch-accent
- NHK日本語発音アクセント新辞典:pitch-accent
```


# Customizing Frequency List Entries
You may have noticed that in the sample screenshots that
the frequency list dictionary name is shortened.
This is done in CSS, and if you want to shorten your own frequency dictionaries,
you will have to add to the styles sheet of the card.
Sample code to shorten the `Innocent Ranked` to `Inn.` is shown below:
```
.frequencies__group[data-details="Innocent Ranked"] .frequencies__dictionary .frequencies__dictionary-inner {
  display: none;
}
.frequencies__group[data-details="Innocent Ranked"] .frequencies__dictionary:after {
  content: "Inn.";
}
```

If you want to outright not show a frequency list entry, you can do the following:
```
.frequencies__group[data-details="Innocent Ranked"] {
  display: none;
}
```

# Customizing Pitch Accent Graph Entries
Similar customization can be done to pitch accent graphs.

Sample code to change `NHK` to `NHK (2016)` is shown below:
```
.pa-graphs__group[data-details="NHK"] .pa-graphs__dictionary .pa-graphs__dictionary-inner {
  display: none;
}
.pa-graphs__group[data-details="NHK"] .pa-graphs__dictionary:after {
  content: "NHK (2016)";
}
```

Sample code to not show an entry is shown below:
```
.pa-graphs__group[data-details="NHK"] {
  display: none;
}
```


# Further links
- moved to the [jp resources page](jpresources#further-reading)
