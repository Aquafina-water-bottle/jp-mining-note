
# Errors
This section documents frequent errors that
may show up on the info circle at the top right.

{{ img("info circle error example", "assets/info_circle_error.gif") }}

---



## Javascript handler error: \`failed to issue request\`
This is an indication that Anki-Connect is failing.
There are two main reasons that Anki-Connect can fail:

1. Ensure that Anki-Connect is installed. If it is installed, be sure to restart Anki
    to ensure the add-on is actually running.

2. If you are using an older version of Anki (2.1.49 and below),
    see the note in the Anki-Connect setup section
    [here](setup.md#anki-connect).

---


## ReferenceError: EFDRC is not defined
You are likely using an old version of this note type
if you get this, as this error is ignored by default within the
[options file](runtimeoptions.md).
See the
[example options file](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/media/_jpmn-options.js){:target="_blank"}
(under `ignored-errors`) for more infomation on this error.

---


## General Error Troubleshooting

If none of the above worked, the following will be some general troubleshooting tips
that can help you figure out what the error is:

1. Do you have a [conflicting addon](setup.md#conflicting-add-ons){:target="_blank"} installed?

1. Try disabling all of your add-ons other than the mandatory ones listed in the setup page.
    Note that you have to restart Anki after disabling the add-ons for the changes to take effect.

    If it works after this step, please let me know which add-on(s) conflicts with this note type!
    To do this, re-enable the add-ons one-by-one (remembering to restart Anki each time!).

1. With all of your non-mandatory add-ons disabled, try to upgrade Anki to the latest version,
    and see if the issue still persists.
    If this works but an add-on you consider mandatory no longer works, please let me know!
    (I won't be able to upgrade the add-on for you, but I can potentially point to alternatives
    and/or add it to the documentation somewhere so others are aware of the issue.)


If you can't manage to fix it, please submit an issue!

---




# Troubleshooting

---


## The sentence quotes are on completely different lines!
If your card looks like this:

{{ img("quotes on different lines", "assets/quote_different_lines.png") }}

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

!!! info

    This happens if you copy/paste directly from certain pages into the sentence field,
    such as some texthooker pages.
    This can also happen if you copy/paste from a texthooker page to a different field,
    say `AdditionalNotes`, and then copy a section of `AdditionalNotes` to `Sentence`.

    Additionally, the sharex clipboard shortcut shouldn't have this problem because it
    explicitly uses `<br>` instead of `<div>`

---


## The Show/Hide button doesn't do anything.
The show/hide button requires that the displayed sentence has a bolded element.
For example, this means if the currently displayed sentence comes from the `AltDisplay`
field and nothing in that field is bolded, then the show/hide button will do nothing.

---


## The replay audio button plays the sentence, word, and then sentence.
This is playing the audio from the front of the card,
and then the back of the card, in sequence.
To fix it so you only hear the audio displayed in the back of the card,
go to:

`Decks` (main anki browser) <br>
→  The gear beside your deck <br>
→  `Options` <br>
→  `Audio` section <br>
→  Toggle `Skip question when replaying answer`

<!--
This is a bug related to the above.
Unfortunately, I can't find another way to selectively suppress audio from playing,
so the bug is here to stay until a better solution is found.
-->

---



# Card Editing

---


## How do I use this note type as an Anime Card?
[Anime Cards](https://animecards.site/ankicards/#anime-cardsword-context-cards){:target="_blank"}
are simply regular vocab cards with a non-collapsable hint field.
To use this as an Anime Card, follow the steps to make a vocab card ([here](cardtypes#vocab-card)),
and use the `HintNotHidden` field for your hint.

---



## How do I change the default value of a binary field?
In Yomichan Format, you can simply toggle the field.
Any new card that is created will now default to that default value.

Of course, this will not affect existing cards.
To change existing cards, I recommend bulk-editing your cards,
say, with [this add-on](https://ankiweb.net/shared/info/291119185){:target="_blank"}.

!!! warning
    As always, before mass editing your collection, please
    [backup your Anki data](faq.md#how-do-i-backup-my-anki-data).

Alternatively, you can use the following commands to bulk edit your cards
in the current deck:

```
# assuming you are at the root of the repo,
# i.e. after the `git clone ...` and `cd jp-mining-note`
cd ./tools

# sets all `IsSentenceCard` fields to be filled
python3 batch.py --fill-field "IsSentenceCard"

# empties all `IsSentenceCard` fields
python3 batch.py --empty-field "IsSentenceCard"
```

!!! note
    You technically have a second option, and that is to change the code itself
    (i.e. flip `#` with `^` for the desired field).
    However, you should only do this if you know what you are doing,
    and are fine with knowing that you may lose those changes
    if you update this note.


---


## How do I remove an empty card without deleting the entire note?
!!! quote
    To remove the empty cards, go to `Tools` →  `Empty Cards` in the main window.
    You will be shown a list of empty cards and be given the option to delete them.

<sup>Taken from the
[official Anki documentation](https://docs.ankiweb.net/templates/generation.html#card-generation--deletion){:target="_blank"}.
</sup>

---


## How do I edit the field's raw HTML?
Within the card browser,
select a field to edit,
and then type `ctrl+shift+x`.

Alternatively, on newer versions of Anki, you can click on the top-right corner
on the code button.

{{ img("Anki edit html", "assets/anki/edit_html.gif") }}

---


# Other Questions

---



## Where is the (X) folder in Anki?
See the [official documentation](https://docs.ankiweb.net/files.html#file-locations){:target="_blank"}
to find the `Anki2` folder.

* Your **profile folder** is under `Anki2/PROFILE_NAME`.
* Your **media folder** is under `Anki2/PROFILE_NAME/collections.media`.
* Your **addons folder** is under `Anki2/addons21`.

---




{{ img("anki export package", "assets/anki/media_export.png", 'align=right width="300"') }}
## How do I backup my Anki data?

The following makes a **complete backup** of your collection, including media.

> Main Window →  `File` (top left corner) →  `Export...` →  `Anki Collection Package`

See the [official documentation](https://docs.ankiweb.net/backups.html){:target="_blank"}
for more info.

<br>


---



## How do I backup Yomichan settings?

1. Navigate to Yomichan Settings.
1. Go to the `Backup` section
1. Select `Export Settings`

{{ img("how-to import Yomichan settings", "assets/yomichan/import_settings.gif") }}



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

Removing this field will affect cards where you test pitch accent,
i.e. with `PAShowInfo` filled.


---


## How do you see the currently installed version of this note?
Preview any card. At the top left corner, the version should be displayed.


<figure markdown>
{{ img("version highlighted", "assets/version.png") }}
</figure>



---

## Do you plan on supporting any other language other than Japanese?
Unfortunately, other languages outside of Japanese will not be supported.

The reason for this decision is best explained in the
"When are you going to add support for $MYLANGUAGE?" question
within [Yomichan's README](https://github.com/FooSoft/yomichan#frequently-asked-questions){:target="_blank"}:

!!! quote
    Developing Yomichan requires a decent understanding of Japanese sentence structure and grammar, and other languages are likely to have their own unique set of rules for syntax, grammar, inflection, and so on. Supporting additional languages would not only require many additional changes to the codebase, it would also incur significant maintenance overhead and knowledge demands for the developers. Therefore, suggestions and contributions for supporting new languages will be declined, allowing Yomichan's focus to remain Japanese-centric.





