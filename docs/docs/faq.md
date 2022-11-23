---
hide:
  - navigation
  - footer
---



# Errors & Warnings { .text-yellow }
This section documents frequent errors that
may show up on the info circle at the top right.

<figure markdown>
{{ img("info circle error example", "assets/info_circle/error.gif") }}
</figure>

---



## (Error) AnkiConnect failed to issue request.
This is an indication that Anki-Connect is failing.
There are two main reasons that Anki-Connect can fail:

1. Ensure that Anki-Connect is installed. If it is installed, be sure to restart Anki
    to ensure the add-on is actually running.

2. If you are using an older version of Anki (2.1.49 and below),
    see the note in the Anki-Connect setup section
    [here](setupanki.md#anki-connect).

---



## (Warning) JPMNOpts was not defined in the options file. Was there an error?

If you see this as an isolated warning without any other errors,
it is very likely that you are using Anki version 2.1.49 or below.
Please check your Anki version to confirm this:

> Main Window →  `Help` →  `About...`

If your Anki version is indeed 2.1.49 or below, then this should only appear on the front side of your first card of the session.
To check, try flipping the card and back. This warning should dissappear once you do.

The only side effect of this is that the user-defined runtime options will not be used for the front side of the first card,
and the defaults will be used instead.

There are two ways to fix this:

1. [Update Anki](setupanki.md#updating-anki) to a higher version.
1. Compile the card with [hard-coded defaults](moddingtips.md#custom-runtime-options).

??? info "Why this happens *(click here)*"

    The `<script ... src="_jpmn-options.js">` tag seems to runs asynchronously on 2.1.49 and below,
    meaning that the order of when this is ran is not constant compared to the main javascript block.
    With that being said, the exact tag seems to run synchronously on 2.1.50 and above,
    so it is guaranteed to run before the main javascript block on these versions.

    With my current knowledge, the only way to guarantee the order of this import is asynchronous functions,
    or some other asynchronous features.
    For example, a simple `await import(...)` should work.
    However, asynchronous features have been avoided throughout the development of this,
    as it currently seems to
    [behave unpredictably](moddingtips.md#avoid-asynchronous-javascript-features-in-anki)
    within Anki.



---


## General Error Troubleshooting

If none of the above worked, the following will be some general troubleshooting tips
that can help you figure out what the error is:

<!-- Un-comment this when any conflicting add-ons are actually discovered
1. Do you have a [conflicting addon](setup.md#conflicting-add-ons){:target="_blank"} installed?
-->

1. Try disabling all of your add-ons other than the mandatory ones listed in the setup page.
    Note that you have to restart Anki after disabling the add-ons for the changes to take effect.

    If it works after this step, please let me know which add-on(s) conflicts with this note type!
    To do this, re-enable the add-ons one-by-one (remembering to restart Anki each time!).

1. With all of your non-mandatory add-ons disabled, try to upgrade Anki to the latest version,
    and see if the issue still persists.
    If this works but an add-on you consider mandatory no longer works, please let me know!
    (I won't be able to upgrade the add-on for you, but I can potentially point to alternatives
    and/or add it to the documentation somewhere so others are aware of the issue.)


If you can't manage to fix it, please reach out to me on [Discord](faq.md#discord-contact-info),
or [submit an issue](https://github.com/Aquafina-water-bottle/jp-mining-note/issues)!

---




# Troubleshooting { .text-yellow }

---

## The word is incorrectly highlighted / not highlighted at all.

The word is usually highlighted by default, but the word may not be highlighted for the following reasons:

- The sentence field got updated by an external program.
    A notable example is [asbplayer](setupeverythingelse.md#asbplayer).
- The card was imported from an older deck that did not highlight the tested word.

As of version `0.11.1.0`, the card will automatically attempt to highlight the word
if the word was not highlighted in the first place.
However, this highlight may yield incorrect results.
*This is expected behavior*, and you are expected to manually bold the sentence
if the highlight is incorrect.

See [here](ui.md#automatic-word-highlighting) for more info.

---

## The Show/Hide button doesn't do anything.
The show/hide button requires that the displayed sentence has a bolded element.
For example, this means if the currently displayed sentence comes from the `AltDisplay`
field and nothing in that field is bolded, then the show/hide button will do nothing.

This potentially relates to the issue above.

---


## The replay audio button plays the sentence, word, and then sentence.
This is playing the audio from the front of the card,
and then the back of the card, in sequence.
To fix it so you only hear the audio displayed in the back of the card,
go to:

`Decks` (main anki browser) <br>
→  Deck settings (the gear beside your deck) <br>
→  `Options` <br>
→  `Audio` section <br>
→  Toggle `Skip question when replaying answer`

<!--
This is a bug related to the above.
Unfortunately, I can't find another way to selectively suppress audio from playing,
so the bug is here to stay until a better solution is found.
-->

---

## The `Tools` →  `Check Media` interface removes the font files.
This is a known bug, and unfortunately, this bug will **not be fixed**.

If you want to use this tool, temporarily move the fonts outside of the media folder.
If you accidentally removed the fonts,
[redownload the fonts](https://github.com/Aquafina-water-bottle/jp-mining-note/tree/master/media)
and re-add them into the [media folder](faq.md#where-is-the-x-folder-in-anki) of your profile.

This will not be fixed because to make debugging easier for the developer.
When a user is asked to export a card, the exported file will not contain the font files,
meaning that the result `.apkg` file will be about 1MB instead of some 20MB,
allowing it to be shared easily on a place like Discord.

---


## The sentence quotes are on completely different lines!
If your card looks like this:

{{ img("quotes on different lines", "assets/faq/quote_different_lines.png") }}

then your `Sentence` field is likely formatted internally similar to the following example:
```html
<div>そうデスサーヴァントの凸守を<b>差し置いて</b></div>
<div>マスターと行動を共にするとは万死に値するデース</div>
```

To fix this, edit the `Sentence` [field html](faq.md#how-do-i-edit-the-fields-raw-html)
to remove the `<div>` tags, and add `<br>` tags
wherever a line break should appear.
For example, the above should be changed into:
```html
そうデスサーヴァントの凸守を<b>差し置いて</b><br>
マスターと行動を共にするとは万死に値するデース
```

??? info "Why this can happen *(click here)*"

    This happens if you copy/paste directly from certain pages into the sentence field,
    such as some texthooker pages.
    This can also happen if you copy/paste from a texthooker page to a different field,
    say `AdditionalNotes`, and then copy a section of `AdditionalNotes` to `Sentence`.

    The [updating sentence with clipboard hotkey](jpresources.md#update-sentence-with-clipboard)
    shouldn't have this problem, as `<div>` tags are not present by default.

---


# Card Editing { .text-yellow }

---

## How do I set the default card type?
In [Yomichan's Anki Card Format](setupyomichan.md#yomichan-fields),
you can simply fill the field.

For example, if you want to set the default card type to be a sentence card,
fill the `IsSentenceCard` field there.

---

## How do I automatically change the value of a binary field on multiple existing cards?

You have three main options:

!!! warning
    As always, before mass editing your collection, please
    [backup your Anki data](faq.md#how-do-i-backup-my-anki-data).


1. [Batch Editing Addon](https://ankiweb.net/shared/info/291119185){:target="_blank"}

2. Python script:

    ```
    # assuming you are at the root of the repo,
    # i.e. after the `git clone ...` and `cd jp-mining-note`
    cd ./tools

    # sets all `IsSentenceCard` fields to be filled
    python3 batch.py --fill-field "IsSentenceCard"

    # empties all `IsSentenceCard` fields
    python3 batch.py --empty-field "IsSentenceCard"
    ```

3. Regex Search (TODO)

---

## How do I disable furigana on card generation?

1. In [Yomichan's Anki Card Format](setupyomichan.md#yomichan-fields),
    ensure that the `SentenceReading` field is empty.

1. If you are using the AJT Furigana addon, edit the config and set `generate_on_note_add` to `false`.
    Afterwards, restart Anki.

---

## How do I bulk generate furigana?

1. Head to the Card Browser window:

    > Main Window →  `Browse`

1. Select all notes without furigana, with the following search:
    ```
    "note:JP Mining Note" SentenceReading:
    ```

1. Head over to:

    > `Edit` (top left corner) →  `Bulk-add furigana`.


---

## How do I bulk generate pitch accents?

!!! note
    This will only batch generate the `AJTWordPitch` field.
    Pitch accent graphs and positions cannot be automatically generated.
    This is important to note if you are using colored pitch accent.
    If `PAPositions` is not filled, then the card cannot be automatically colored.

1. Head to the Card Browser window:

    > Main Window →  `Browse`

1. Select all notes with an empty `AJTWordPitch` field, with the following search:
    ```
    "note:JP Mining Note" AJTWordPitch:
    ```

1. Head over to:

    > `Edit` (top left corner) →  `Bulk-add pitch accents`.

There may be some cards that still have an empty `AJTWordPitch` field.
This is simply because the add-on did not contain the pitch data for those words.

---

## How do I remove an empty card without deleting the entire note?
!!! quote
    To remove the empty cards, go to `Tools` →  `Empty Cards` in the main window.
    You will be shown a list of empty cards and be given the option to delete them.

    <sup>
    Taken directly from [Anki's official documentation](https://docs.ankiweb.net/files.html#file-locations).
    </sup>

---


## How do I edit the field's raw HTML?
Within the card browser,
select a field to edit,
and then type `ctrl+shift+x`.

Alternatively, on newer versions of Anki, you can click on the top-right corner
on the code button.

{{ img("Anki edit html", "assets/faq/edit_html.gif") }}

---


## How do I use this note type as an Anime Card?
An anime card is a vocab card with a picture and native audio, which
is the default setup for this card.

If you want to add hints that aren't collapsed by default,
use the `HintNotHidden` field.

<!--
[Anime Cards](https://animecards.site/ankicards/#anime-cardsword-context-cards){:target="_blank"}
are simply regular vocab cards with a non-collapsable hint field.
To use this as an Anime Card, follow the steps to make a vocab card ([here](cardtypes#vocab-card)),
and use the `HintNotHidden` field for your hint.
-->

---




# Other Questions { .text-yellow }

---



## Where is the (X) folder in Anki?

You must first locate the `Anki2` folder.
The location of this folder is different for each operating system.

!!! quote

    === "Windows"

        On **Windows**, the latest Anki versions store your Anki files in your
        appdata folder. You can access it by opening the file manager, and
        typing `%APPDATA%\Anki2` in the location field. Older versions of Anki
        stored your Anki files in a folder called `Anki` in your `Documents`
        folder.

    === "Mac"

        On **Mac** computers, recent Anki versions store all their files in the
        `~/Library/Application Support/Anki2` folder. The Library folder is
        hidden by default, but can be revealed in Finder by holding down the
        option key while clicking on the Go menu. If you're on an older Anki
        version, your Anki files will be in your `Documents/Anki` folder.

    === "Linux"

        On **Linux**, recent Anki versions store your data in
        `~/.local/share/Anki2`, or `$XDG_DATA_HOME/Anki2` if you have set a
        custom data path. Older versions of Anki stored your files in
        `~/Documents/Anki` or `~/Anki`.

    <sup>
    Taken directly from [Anki's official documentation](https://docs.ankiweb.net/files.html#file-locations).
    </sup>


* Your **profile folder** is under `Anki2/PROFILE_NAME`.
* Your **media folder** is under `Anki2/PROFILE_NAME/collections.media`.
* Your **addons folder** is under `Anki2/addons21`.

---




{{ img("anki export package", "assets/faq/media_export.png", 'align=right width="300"') }}
## How do I backup my Anki data?

The following makes a **complete backup** of your collection, including media:

> Main Window →  `File` (top left corner) →  `Export...` →  `Anki Collection Package`

The following makes a temporary backup of your collection, not including media:

> Main Window →  `File` (top left corner) →  `Create Backup`

See [Anki's official documentation](https://docs.ankiweb.net/backups.html){:target="_blank"}
for more info.

---



## How do I backup Yomichan settings?

1. Navigate to Yomichan Settings.
1. Go to the `Backup` section
1. Select `Export Settings`

{{ img("how-to import Yomichan settings", "assets/faq/yomichan_import_settings.gif") }}

---




## How do I export notes?

1. Navigate to the Card Browser, by doing the following:

    > Main Window →  `Browse`

1. Select a note. Hold down `ctrl` to select multiple individual notes.

1. Right click the selected notes, and navigate to:

    > `Notes` →  `Export Notes...`

---





## How do I see the version of jp-mining-note?

Preview any card. The version should be displayed at the top left corner.

For mobile, the version be shown at the top right corner.
Note that this is only displayed on versions `0.11.1.0` and above.

<figure markdown>
{{ img("version location", "assets/faq/jpmn_version.png") }}
</figure>

---



## How do I see the version of Anki?

Navigate to:

> `Help` →  `About`

<figure markdown>
{{ img("version location", "assets/faq/anki_version.png") }}
</figure>

---





## What card type should I use?
The short answer is: whichever one you want. :)

The long answer is: whichever one you want,
because everyone has their own preferences on what card types they like.
I recommend being open about it and experiment with them, to see which one you like.


---



## What is the point of the `PASilence` field?
This is a hack to not play the sentence audio on the front side,
even if you set-up your Anki client to do so.
With this field filled correctly, the play sentence audio button will appear at the front,
and will not be autoplayed.

Leaving this field empty will affect cards where you test pitch accent,
i.e. with `PAShowInfo` filled.
In particular, this will cause Anki to autoplay the sentence audio on
the front side of cards that test pitch accent, which is undesirable.

---




## Do you plan on supporting any other language other than Japanese?
Unfortunately, other languages outside of Japanese will not be supported.

The reason for this decision is best explained in the
"When are you going to add support for $MYLANGUAGE?" question
within [Yomichan's README](https://github.com/FooSoft/yomichan#frequently-asked-questions){:target="_blank"}:

!!! quote
    Developing Yomichan requires a decent understanding of Japanese sentence structure and grammar, and other languages are likely to have their own unique set of rules for syntax, grammar, inflection, and so on. Supporting additional languages would not only require many additional changes to the codebase, it would also incur significant maintenance overhead and knowledge demands for the developers. Therefore, suggestions and contributions for supporting new languages will be declined, allowing Yomichan's focus to remain Japanese-centric.


# Discord Contact Info { .text-yellow }
Username: `Aquafina water bottle#3026` (user id: `244677612272746496`)

Servers:

* [TheMoeWay]({{THEMOEWAY_LINK}}) (I recommend using the `jp-mining-note` thread in the `#resources-sharing` channel)
* Refold (JP) server  (I recommend using the `jp-mining-note` thread in the `#sentence-mining-workflows` channel)




