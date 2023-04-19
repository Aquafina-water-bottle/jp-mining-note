
TODO redo this entire page...

- videos for post-build setup
- link extra/style.scss to the correct setup
- link styles tab to the correct setup

---

# How To Add Custom CSS

If you have already read the [Modding Overview](modding.md) page,
you should already know that there are two ways of modding the note:

1. You can [directly edit the note's CSS](#option-1-how-to-directly-edit-the-css),
    but lose all the changes you made when you update.

    This is the plug-and-play solution and requires no additional setup.

1. *(Recommended)* [Create new CSS files](#option-2-how-to-extend-the-css),
    which are built with the note to extend the current CSS.
    This allows you to **not lose changes** between updates.

    Unfortunately, this **requires additional setup**, and will likely take some time to get working.

---

# Option 1: How to directly edit the CSS { #how-to-directly-edit-the-css }
!!! warning
    When editing any of the style sheets below, it is recommended to append the given CSS code
    to the *very bottom* of the existing CSS instead of adding to the existing CSS.
    This is to avoid potential errors where the existing CSS may potentially override your custom CSS.
    This would also help with copying/pasting your CSS changes between updates.


* Any time `style.scss` is mentioned, edit the styles sheet in the Anki template.
    This can be accessed by:

    > (Main window) →  `Browse` →  `Cards...` (middle of the screen) →  `Styling` (top left)

* Any time `fields.scss` is mentioned, edit the `fields.css` file under the
    [addons folder](faq.md#where-is-the-x-folder-in-anki):
    ```
    Anki2/addons21/181103283/user_files/field.css
    ```

* Any time `editor.scss` is mentioned, edit the `editor.css` file under the
    addons folder:
    ```
    Anki2/addons21/181103283/user_files/editor.css
    ```

---

# Option 2: How to extend the CSS { #how-to-extend-the-css }

TODO video!

1. [Build the note](building.md) if you haven't already, and ensure everything works.

1. Create the following folder structure: `(project root)/overrides/scss/extra`.
    The project root is usually `jp-mining-note`.

1. Add the folder to the end of `css-folders` in `config.py`.
    This should result in the following:
    ```
    "css-folders": ["base", "responsive", "dictionaries", "extra"],
    ```

    TODO update the exact folders

1. Under the `extra` folder, use the following files to override the correct CSS:

    - `style.scss`: The main CSS for the card templates.
    - `field.scss`: The CSS used by [CSS injector](setupanki.md#css-injector)
        to customize individual fields.
    - `editor.scss`: The CSS used by CSS injector to customize the editor around the fields.

    All of the files are optional. This means you do not need to create all three files
    for the folder to be valid.

    The resulting folder should be of the format:
    ```
    (project root)
      L overrides
         L scss
            L extra
               L field.scss
               L editor.scss
               L style.scss
    ```

1. Rebuild and reinstall the template.
    The CSS should be automatically applied to the note.


!!! note

    You might have noticed that this is the SCSS, not CSS.
    However, SCSS is complete superset of CSS
    (with some small exceptions).
    In other words, if you don't know any SCSS, you can write normal CSS
    and have it behave completely the same.

