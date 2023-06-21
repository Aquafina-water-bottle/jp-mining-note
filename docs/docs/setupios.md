# Summary

On iOS (iPhone and iPad), it is possible to review JPMN cards.
However, **I am not currently aware of a setup that can create cards with iOS**.
If you do know of a setup that can create cards on iOS, please let me know!

It is expected that you have setup Anki and Yomichan properly on your desktop machine
before continuing with this page.

---

# Reviewing

To review Anki cards on [iOS](https://apps.ankiweb.net/#ios), use
[AnkiMobile](https://apps.apple.com/us/app/ankimobile-flashcards/id373493387).

You'll probably notice that
[AnkiMobile costs a bit of money](https://faqs.ankiweb.net/why-does-ankimobile-cost-more-than-a-typical-mobile-app.html).
If you don't want to pay for whatever reason,
the best free alternative is to simply use [AnkiWeb](https://apps.ankiweb.net/#).


!!! warning
    Other "Anki"-like apps on the App Store are not officially supported by Anki,
    and will almost certainly not work with this note.
    **Please only use AnkiMobile or AnkiWeb if you are on iOS**.
    More info can be found from the official Anki documentation
    [here](https://faqs.ankiweb.net/ankiapp-is-not-part-of-the-anki-ecosystem.html).

!!! warning
    This note does not officially support AnkiWeb as of writing this (2023/06/21).
    However, the main features of the note will almost likely still work.

In order to review the same cards on desktop, you must sync your collection with AnkiWeb.
More tech savy users can sync their collections using a
[self-hosted server](https://docs.ankiweb.net/sync-server.html).


## Tap Gestures
You will likely tap on various parts of the screen
when reviewing, to reveal various parts of the card.
However, AnkiMobile has tap gestures are enabled by default,
which will interfere with using the note.


Tap gestures can be customized under:

> (settings gear) →  `Review` →  `Taps`

I recommend using the following tap gesture settings:

| Side | Position | Action |
|-|-|-|
| When question shown | Bottom Left | Show Answer |
| When question shown | Bottom Center | Show Answer |
| When question shown | Bottom Right | Show Answer |
| When answer shown | Bottom left | Replay Audio |
| (Everything else) |  | None |

To explain what the above does:

- There is no other way to show the answer outside of gestures.
    There is usually nothing on the bottom third of the screen when the question
    is shown, so it is safe to use that to show the answer.
    This is compared to the top third of the screen, where various parts of the card can be interacted with,
    such as the info circle and click cards.

- You may have noticed that audio buttons do not show on AnkiMobile.
    This is due to an [AnkiMobile bug](https://github.com/Aquafina-water-bottle/jp-mining-note/issues/6).
    In order to emulate the intended experience (where the audio buttons are shown on the bottom left),
    I recommend setting the "Bottom Left" tap gesture to "Replay Audio".

