# Summary

On Android, it is possible to review and create JPMN cards similarly to desktop.
It is expected that you have setup Anki and Yomichan properly on your desktop machine
before continuing with this page.

---

# Reviewing

To review Anki cards on Android, use
[**AnkiDroid**](https://github.com/ankidroid/Anki-Android).

In order to review the same cards on desktop, you must sync your collection with AnkiWeb.
More tech savy users can sync their collections using a
[self-hosted server](https://docs.ankiweb.net/sync-server.html).

!!! note
    If your collection on AnkiWeb is large, your initial sync to AnkiWeb will likely take a
    very long time.
    After your first sync, your collection may not actually be fully synced even if AnkiDroid says so.
    Keep pressing the sync button until you are sure that everything is indeed synced.

---

# AnkiDroid Usage Tips

- Set the night theme to "Dark" if you want a similar dark theme to Anki's desktop client.
- Under the card browser, the default settings show the `Question` and `Answer` as columns, which likely
    looks very strange. I recommend changing the columns to `Sort field` and `Due` respectively.
- If you are using pass/fail, you can remove the bottom bar by doing the following:

    > `Settings` →  `Appearance` →  `Answer buttons position` →  Select `None`

    In replacement of the bottom bar, you can use custom gestures. I personally use:

    - Show answer: Swipe up
    - Answer button 1: Swipe right
    - Answer recommended: Swipe left
- If you are using custom gestures, I recommend disabling most (if not all) tap gestures.
    This is because you will likely have to tap on various parts of the screen
    when reviewing, to reveal various parts of the card.


---

# Creating Cards

There are two main ways of creating cards on Android.
Both require AnkiDroid to be installed.

1. [**AnkiconnectAndroid**](https://github.com/KamWithK/AnkiconnectAndroid) <small>(recommended)</small>

    AnkiconnectAndroid is an implementation of Anki-Connect, on Android.
    Combined with Kiwi browser, you can use Yomichan directly on your Android device,
    and have the exact same setup as you would on desktop.
    To do this, follow the instructions on the AnkiconnectAndroid's README page.

    It might help to export a copy of Yomichan settings from your PC and import said settings on Android,
    instead of re-doing all of the steps on Android.

    !!! note

        There is currently no way to automatically add an image (e.g. a screenshot) automatically.
        Images must be added manually within AnkiDroid.

        Although screenshots cannot be added automatically,
        the runtime options supports automatically adding images
        based off of tags, which is mostly useful for novels.
        See [here](images.md#automatically-add-images-using-tags)
        for more info.


1. [**jidoujisho**](https://github.com/lrorpilla/jidoujisho)

    This is a all-in-one solution app that allows you to immerse in various ways.
    Although a great immersion tool, the main problem it has currently in relation
    to this note is that its card exporter is not as powerful as Yomichan,
    and certain features will not be available.
