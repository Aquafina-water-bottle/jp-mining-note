
TODO introduction

- CSS: styles for the note
- can change font size, colors, hide elements, reposition certain elements, etc.

---

# How To Add Custom CSS

There are two options to add custom CSS:

1.  **Edit the styles directly.**

    This is the recommended way for most people to modify the CSS.

1.  **Add SCSS files.**

    These SCSS files are built with the note to extend the current CSS.

    This is recommended way for people who [build the note](building.md).


<!--

You can [directly edit the note's CSS](#option-1-how-to-directly-edit-the-css),
but lose all the changes you made when you update.

If you want to keep CSS changes between updates, please only **add** CSS
to the very end of the styles sheet.

-->



??? info "Option 1: Edit the styles directly {{CLICKHERE}}"

    TODO video

    1. Navigate to the following:

        > (Main window) →  `Browse` →  `Cards...` (middle of the screen) →  `Styling` (top left)

    1. Scroll all the way to the bottom, and add any CSS to the bottom of the styles.


<!--

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
-->

??? info "Option 2: Add SCSS Files {{CLICKHERE}}"

    1. [Build the note](building.md) if you haven't already, and ensure everything works.

    1. Create the following folder structure: `(project root)/overrides/scss/extra`.
        The project root is usually `jp-mining-note`.

    1. Add the folder to the end of `css-folders` list in `config.py`.
        For example:
        ```
        "css-folders": ["base", "responsive", "dictionaries", "extra"],
        ```

        TODO update the exact folders

    1. Under the `extra` folder, use the following files to override the correct CSS:

        - `style.scss`: The main CSS for the card templates.
            This is likely the file you want to edit, when adding custom CSS.
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


<!--
!!! note
    You might have noticed that this is the SCSS, not CSS.
    However, SCSS is complete superset of CSS
    (with some small exceptions).
    In other words, if you don't know any SCSS, you can write normal CSS
    and have it behave completely the same.
-->
