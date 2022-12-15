
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

1. *(Recommended)* Create new CSS files, which are built with the note to extend the current CSS.
    This allows you to **not lose changes** between updates.

    Unfortunately, this **requires additional setup**, and will likely take some time to get working.

??? info "Option 1: How to directly edit the CSS *(click here)*"
    !!! warning
        When editing any of the style sheets below, it is recommended to append the given CSS code
        to the *very bottom* of the existing css instead of adding to the existing CSS.
        This is to avoid potential errors where the existing css may potentially override your custom css.


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

    1. Add the folder to the end of `css-folders` in `config.py`.
        This should result in the following:
        ```
        "css-folders": ["base", "responsive", "dictionaries", "extra"],
        ```

    1. Under the `extra` folder, use the following files to override the correct css:

        - `style.scss`: The main CSS for the card templates.
        - `field.scss`: The CSS used by [CSS injector](setupanki.md#css-injector)
            to customize individual fields.
        - `editor.scss`: The CSS used by CSS injector to customize the editor around the fields.

        All of the files are optional. This means you do not need to create all three files
        for the folder to be valid.

        The resulting folder should be of the format:
        ```
        (project root)
          L src
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



# Examples
See the [UI Customization](uicustomization.md) page for many examples on how CSS can be used.


<!--
!!! note
    Unlike [regular overrides](overrides.md) and [modules](modules.md),
    custom CSS cannot be defined in the `overrides` folder,
    due to a complication in the current build system.
    I will be working on a way to define this in the `overrides` folder in the future.
-->
