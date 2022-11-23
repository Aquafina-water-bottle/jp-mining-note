
!!! warning

    Since this note is still in beta, the CSS itself,
    including the class names and structure of the HTML,
    is subject to heavy change.
    This is because when mobile support is being worked on,
    the CSS will likely heavily change to support mobile.

    If you are planning on changing the CSS,
    be vigilant with potential changes in future updates!


---

# How To Add Custom CSS

If you have already read the [Modding Overview](modding.md) page,
you should already know that there are two ways of modding the note:

1. You can directly edit the CSS files, but lose all the changes you made when you update.

    This is the plug-and-play solution and requires no additional setup.

1. *(Recommended)* Add new files to add to the existing CSS, as to not lose changes between updates.

    Unfortunately, this requires additional setup, and will likely take some time to get working.

??? info "Option 1: How to directly edit the CSS *(click here)*"

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


??? info "Option 2 (Recommended): How to extend the CSS *(click here)*"

    1. [Build the note](building.md) if you haven't already, and ensure everything works.

    1. Make a new folder under `(project root)/src/scss` (for example, `src/scss/extra`).

        !!! note
            Unlike [regular overrides](overrides.md) and [modules](modules.md),
            custom CSS cannot be defined in the `overrides` folder,
            due to a complication in the current build system.
            I will be working on a way to define this in the `overrides` folder in the future.

    1. Add the folder to the end of `css-folders` in `config.py`.
        This should result in the following:
        ```
        "css-folders": ["base", "dictionaries", "extra"],
        ```
    1. Under the `extra` folder, use the following files to override the correct css:
        - `style.scss`: The main css for the card templates.
        - `field.scss`: The css used by [CSS injector](setupanki.md#css-injector)
            to customize individual fields.
        - `editor.scss`: The css used by CSS injector to customize the editor around the fields.

        All of the files are optional. This means you do not need to create all three files
        for the folder to be valid.

        The resulting folder should be of the format:
        ```
        src
         L scss
            L base
               L ...
            L dictionaries
               L ...
            L extra
               L field.scss
               L editor.scss
               L style.scss
        ```

    1. Rebuild and reinstall the template.
        The css should be automatically applied to the note.


    !!! note

        You might have noticed that this is the SCSS, not CSS.
        However, SCSS is complete superset of CSS
        (with some small exceptions).
        In other words, if you don't know any SCSS, you can write normal CSS
        and have it behave completely the same.


<!--
Many existing variables already exist (see `templates/scss/base/common.scss`),
and can be overwritten easily.

For example, any variable within the `style.scss` file can be replaced by putting
the following under `extra/style.scss`:
```
:root {
    --variable: 5px;
}
```
-->

---



<!--
# Hiding Several Dictionary Tags
Alternatively, you can hide all dictionaries that are not
a specific dictionary:

1. Under `extra/style.scss`, add the following code:
    ```css
    /* hide dictionaries other than "JMdict (English)" */
    ol li:not([data-details="JMdict (English)"]) .dict-group__tag-list {
      display: none;
    }
    ```

2. (Optional) Under `extra/field.scss`, add the following code:
    ```css
    /* greys out all dictionaries that aren't JMdict (English) */
    anki-editable ol li:not([data-details="JMdict (English)"]) .dict-group__tag-list {
      color: var(--text-color--3);
    }
    ```
-->


# Examples
See the [UI Customization](uicustomization.md) page for many examples on how CSS can be used.

