# Overview

[Yomichan](https://github.com/FooSoft/yomichan)
is the main program that will create the cards. You can download Yomichan as a Firefox extension
or under the Chrome web store.

This section will go over the minimal Yomichan setup to work with this card type.

**If you have never used Yomichan before**, please see
[this page](https://learnjapanese.moe/yomichan/) first to get it working.

---

# Preliminary Steps
If you have used Yomichan before, please make a
[backup of your settings](faq.md#how-do-i-backup-yomichan-settings)
(just in case).


Additionally, if you downloaded Yomichan from a file, try updating that as well.
Most users should have installed it from their browser's extension page, in which case
nothing has to be done.

!!! warning "Warning for Firefox Users"
    The default version for Yomichan on Firefox
    is [over three years old](https://github.com/FooSoft/yomichan/issues/2295),
    and is not compatible with this note.
    If you are using Firefox, ensure that your Yomichan version is indeed the latest version,
    by clicking on the Yomichan icon and clicking on the question mark.

    If it isn't, then I recommend to switch to Chrome (or Chromium) for immersion.

<!--
TODO Yomitan, once it's stable...

If it isn't, there are two main ways of fixing it:

1. [Manual Download](https://github.com/FooSoft/yomichan/releases)
    with
    [Firefox: Developer edition](https://www.mozilla.org/en-US/firefox/developer/)
    The manual download will NOT work on regular firefox, because it is unsigned.
    `xpinstall.signatures.required`

You may also have to download the Firefox Developer edition, and set 
to `false`.
-->

---


# Yomichan Fields
To edit the fields that Yomichan will automatically fill out, do the following:

![type:video](assets/setupyomichan/yomichan_anki_format.mp4)

1. Navigate to Yomichan Settings.
1. Go to the `Anki` section.
1. Select `Anki card format...`.
1. Set "Model" as `JP Mining Note`.
1. Copy and paste the following values into the fields
   (the custom markers won't be available in the dropdown arrow):


??? example "Click here to see the fields to copy and paste."

    {{ yomichan_fields_table() | indent(4) }}


The above fields will create, by default,
a basic **vocab card** in **bilingual format**,
with all other definitions in collapsable fields.

!!! note
    Anything field marked with `*` are binary fields, and
    **should be configured to each user's personal preferences.**

    To change the default value of any of the fields, simply fill
    the field in within the aforementioned `Anki card format...` section.

    For example, if you want the card to be a sentence card by default,
    fill the `IsSentenceCard` field here.


The custom markers like `{jpmn-primary-definition}` is not provided by Yomichan by default.
See the section below to make these markers usable.

---



# Yomichan Templates
Yomichan supports user inserted template code that allows the automatic
separation of bilingual and monolingual dictionary definitions, custom stylization, etc.
This note type makes heavy use of these custom templates.

To make the new markers usable, do the following:

![type:video](assets/setupyomichan/import_yomichan_templates.mp4)

1. Navigate to Yomichan Settings.
1. Make sure that advanced settings are turned on (bottom left corner).
1. Go to the `Anki` section
1. Select `Configure Anki card templates...`
1. If you have existing template code already, I highly recommend
   **resetting the templates** (bottom right corner, red button)
   unless you know exactly what you are doing.

After resetting the templates,
**without** removing any of the existing template code,
add the following template code as follows:

1. Copy and paste the code below to the **top** of the default Yomichan template code:

    ??? examplecode "Click here to show the template code to copy."

        ```handlebars
        {% filter indent(width=8) -%}
        {{ TOP_YOMICHAN }}
        {% endfilter %}
        ```

2. Copy and paste the code below to the **bottom** of the default Yomichan template code:

    ??? examplecode "Click here to show the template code to copy."

        ```handlebars
        {% filter indent(width=8) -%}
        {{ BOTTOM_YOMICHAN }}
        {% endfilter %}
        ```

---

# Make an example card!
TODO re-record with renji's texthooker, and show result card

At this point, you should be able to make cards with Yomichan!

??? example "Click here to show some example Japanese sentences."

    「や、いらっしゃい。ま、毒を食らわば皿までって言うしね。あ、違うか。乗り掛かった船？」
    { .jp-quote-text }

    「なによぅ…甲斐甲斐しく会いに来た女に対して、最初に言うセリフがそれ？」
    { .jp-quote-text }

    「あの時逃げ出した私の罰…あの時の汚辱は今ここで、全部そそいでやるんだ…」
    { .jp-quote-text }

    「貴方なんなんです？なにか、妙に銃口慣れしていますね…若者特有の空威張りという訳でもなさそうですし…」
    { .jp-quote-text }

{{ img("adding a card with Yomichan", "assets/setupyomichan/add_card.gif") }}

Obviously, just Yomichan alone doesn't fill every field.
Notably, the picture and sentence audio is missing.

Outside of that, there are some final settings you can adjust within the Yomichan templates
if the card doesn't look quite right.


---


# Yomichan Templates Options Summary

## Monolingual Definition
If you want the first definition you see (the `PrimaryDefinition` field) to be monolingual,
change the following line at the top of the templates code:

{% raw %}
```handlebars
{{~set "opt-first-definition-type" "bilingual" ~}}
```
to
```handlebars
{{~set "opt-first-definition-type" "monolingual" ~}}
```
{% endraw %}


Additionally, a common thing that people want to do with monolingual dictionaries is to remove the first line
of the definition, because it may contain extra info that the user does not want.
See [here](definitions.md#hiding-the-first-line-of-a-definition)
to do exactly that.


!!! note

    If you are using monolingual dictionaries, on your first few cards,
    please check that your dictionaries are in the expected places.
    Extra bilingual definitions should be under `Secondary Definition`,
    and extra monolingual definitions should be under `Extra Definitions`.

    If your dictionaries are ending up in the wrong sections,
    then it is likely a problem with how the template code categorizes the dictionaries.
    See [here](definitions.md#dictionary-placement) for more info.




<!--

IT WORKS WITH OLD JMDICT!!
THIS SECTION IS NO LONGER NECESSARY!!!

## Legacy JMdict

The newest JMdict Yomichan dictionary, informally known as "JMdict Extra",
contains many things outside of the plain definitions,
including antonyms, example sentences, and alternate forms.
This dictionary can be downloaded
[here](https://github.com/Aquafina-water-bottle/jmdict-english-yomichan).

If you are using JMdict Extra, then nothing has to be done.

However, if you are using a legacy versions of JMdict,
your definitions will export incorrectly (in a non-compact form).

??? example "Compact Legacy JMdict Option {{ CLICK_HERE }}"
    To export legacy JMdict in compact form, change the following option:
    set the following option to `false`:

    {% raw %}
    ```handlebars
    {{~set "opt-jmdict-list-format" false ~}}
    ```
    {% endraw %}



then the exported compact list will not be fully compact.
This is a [known issue](https://github.com/FooSoft/yomichan/issues/2297) with Yomichan's
default handlebars.

However, with the power of custom CSS and handlebars, the issue is fixed in this note type.
To fix it, set `opt-jmdict-list-format` to `true`, i.e.

{% raw %}
```handlebars
{{~set "opt-jmdict-list-format" true ~}}
```
{% endraw %}

-->
---


# Additional Instructions for Other Platforms

Outside of creating cards on the PC,
there are some other platforms that one can create cards from.



## Android Setup

If you wish to add cards on Android, use
[AnkiconnectAndroid](https://github.com/KamWithK/AnkiconnectAndroid)
and follow the instructions on the AnkiconnectAndroid's README page.
It might help to export a copy of Yomichan settings from your PC and import said settings on Android,
instead of re-doing all of the steps on Android.

!!! note
    Occasionally, importing your Yomichan settings from the PC may lead to
    AnkiconnectAndroid not working.
    See [here](https://github.com/KamWithK/AnkiconnectAndroid#common-errors-and-solutions)
    for additional troubleshooting.


!!! note

    There is currently no way to automatically add an image (e.g. a screenshot) automatically.
    Images must be added manually within AnkiDroid.

    Although screenshots cannot be added automatically,
    the runtime options supports automatically adding images
    based off of tags, which is mostly useful for novels.
    See [here](images.md#automatically-add-images-using-tags)
    for more info.





## Kindle Setup

One can use something like [ann2html](https://github.com/xythh/ann2html)
to export a Yomichan-able HTML file based on the Kindle's vocabulary builder.
This allows you to add the cards through Yomichan on the PC.



---


# Enjoy your new one-click cards!

If you've made it this far, then congratulations!
Most fields of the cards have been automatically filled out, just from Yomichan alone!

This concludes the setup process for creating cards with Yomichan.

From here, you likely fall under one of the two categories below:


1. **I'm new to sentence mining.**

    If you're new to sentence mining, there are likely some things things
    that you would like to set up. These include:

    1. Getting the actual text to use Yomichan on.
    1. Getting the pictures and/or sentence audio from the media into the card.

    Head over to the [Setup: Everything Else](setupeverythingelse.md) page to see exactly that.
    If you are also new to Yomichan, I also recommend downloading
    [these dictionaries](setupother.md#other-dictionaries).


1. **I already have a sentence mining workflow.**

    If you have a workflow already setup,
    you may have to do some minor tweaks to your current workflow
    to match the new field names.
    For example, the exporting sentence audio and picture fields may be different
    compared to your previous card.

    Other than that, you are completely finished with the setup process!

    !!! note
        See [Setup: Everything Else (Notes on Various Programs)](setupeverythingelse.md#notes-on-various-programs)
        for specific tips on a select few programs.







