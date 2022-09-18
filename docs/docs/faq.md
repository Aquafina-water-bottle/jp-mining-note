<!--
TODO reword this maybe?

Remember that all cards are fully customizable!
You are absolutely free to tear the code apart and make these card formats your own.
-->



<!--
# How do I get rid of all of this pitch accent info?
See [here](usage#wait-i-dont-want-to-test-pitch-accent).
-->


# Troubleshooting

---

## Where is the (X) folder in Anki?
See the [official documentation](https://docs.ankiweb.net/files.html#file-locations)
to find the `Anki2` folder.

* Your **profile folder** is under `Anki2/PROFILE_NAME`.
* Your **media folder** is under `Anki2/PROFILE_NAME/collections.media`.
* Your **addons folder** is under `Anki2/addons21`.

---


## The sentence quotes are on completely different lines!
<!--
If your card looks like this:
--->

(TODO)

- edit the underlying html (ctrl+shift+x) and remove the `<div>` and `</div>` tags.
- happens if you copy/paste directly from certain pages (i.e. texthooker)
- the sharex clipboard shortcut shouldn't have this problem because it uses `<br>` instead of `<div>`

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


## Pitch accent bold doesn't work on the last downstep
- TODO
- weird quirk with css injector
- only solution I know of atm is to edit the raw html and move the `</b>` to the very end of the html

---


## The info circle displays an error!

The following will be some general troubleshooting tips that can help you figure out
what the error is:

1. Is AnkiConnect installed? If it isn't, please see [this](setup#required-anki-add-ons).

2. Do you have a [conflicting addon](setup#conflicting-add-ons) installed?

3. As a generalized version of the above,
   try disabling all of your add-ons other than the mandatory ones listed in the setup page.
   Note that you have to restart Anki after disabling the add-ons for the changes to take effect.

   If it works after this step, please let me know which add-on(s) conflicts with this note type!
   To do this, re-enable the add-ons one-by-one (remembering to restart Anki each time!).

4. With all of your non-mandatory add-ons disabled, try to upgrade Anki to the latest version,
   and see if the issue still persists.
   If this works but an add-on you consider mandatory no longer works, please let me know!
   (I won't be able to upgrade the add-on for you, but I can potentially point to alternatives
    and/or add it to the documentation somewhere so others are aware of the issue.)

- TODO expand list in the future

If you can't manage to fix it, please submit an issue!

---



# Card Editing

---


## How do I use this note type as an Anime Card?
[Anime Cards](https://animecards.site/ankicards/#anime-cardsword-context-cards)
are simply regular vocab cards with a non-collapsable hint field.
To use this as an Anime Card, follow the steps to make a vocab card ([here](cardtypes#vocab-card)),
and use the `HintNotHidden` field for your hint.

---



## How do I change the default value of a binary field?
In Yomichan Format, you can simply toggle the field.
Any new card that is created will now default to that default value.

Of course, this will not affect existing cards.
To change existing cards, I recommend bulk-editing your cards,
say, with [this add-on](https://ankiweb.net/shared/info/291119185).


(TODO write a way with python)


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
[official Anki documentation](https://docs.ankiweb.net/templates/generation.html#card-generation--deletion).
</sup>

---


## How do I edit the field's raw HTML?
- ctrl+shift+x

---


# Other Questions

---

## What card type should I use?
The short answer is: whichever one you want. :)

The long answer is: whichever one you want,
because everyone has their own preferences on what card types they like.
I recommend being open about it and experiment with them, to see which one you like.


---



## What is the point of the `PASilence` field?
It's a hack to not play audio even if you setup your Anki client to do so.
See the `PASilence` field in the [field reference](usage#anki-field-reference) for more information.

---


## How do you see the currently installed version of this note?
Preview any card. At the top left corner the version should be displayed.
For example:

```
Vocab (info circle)
JP Mining Note: Version (VERSION DISPLAYED HERE)
```

TODO image

---

## Do you plan on supporting any other language other than Japanese?
Unfortunately, other languages outside of Japanese will not be supported.

The reason for this decision is best explained in the
"When are you going to add support for $MYLANGUAGE?" question
within [Yomichan's README](https://github.com/FooSoft/yomichan#frequently-asked-questions):

!!! quote
    Developing Yomichan requires a decent understanding of Japanese sentence structure and grammar, and other languages are likely to have their own unique set of rules for syntax, grammar, inflection, and so on. Supporting additional languages would not only require many additional changes to the codebase, it would also incur significant maintenance overhead and knowledge demands for the developers. Therefore, suggestions and contributions for supporting new languages will be declined, allowing Yomichan's focus to remain Japanese-centric.





