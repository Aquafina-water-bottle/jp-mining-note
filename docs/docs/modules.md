
!!! warning
    This entire section will be **completely overhauled** in version 0.12.0.0,
    meaning that this information will be completely changed when that version releases.
    See the `dev` branch on Github if you want to see the work in progress.


# Overview

Modules (not to be confused with regular
[javascript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules))
is a hybrid template/javascript system that allows code separation
at the file level, but allows the javascript to be compiled into each template,
rather than separate files.

The biggest advantage of this over a monolithic system is that individual modules
can be enabled, disabled, created, and modified at ease,
all without editing the source files.

---

# Example (Hello World)

The following will enable a the hello world module,
which prints a "Hello world!" at the front of any card
(as a warning on the [info circle](ui.md#info-circle)).


1. Under `config/config.py`, add `"example"` to `enabled-modules`.

    ```
    "compile-options": {
        "allow-user-defined-modules": True,

        "enabled-modules": [
            ...
            "customize-open-fields",  # Make sure a comma is here!
            "example"
        ]
    },
    ```

2. Under `config/jpmn_opts.jsonc` (or more preferably, your own options file specified
    under `opts-path` in `config.py`),
    add the following:

    ```
    "modules": {
      "customize-open-fields": {
        ...
      },  // Make sure there is a comma here!

      "example": {
        "enabled": true
      }
    }
    ```

3. Rebuild the note, and preview any card.
    The front side of any card should have a "Hello world!" warning,
    while the back side should remain normal.


---


# Quickstart
If you want to get to inserting your own javascript
as soon as possible, do the following:

1. Follow the steps of the example above, and make sure the example module is working.
2. Copy the `example` module into `overrides/modules`.

    This should result in the following file structure:
    ```
    overrides
     L modules
        L example
           L main.html
           L main.js
    ```

From here, all you have to do is edit the `main.js` and `main.html` to your liking.

!!! note

    The `js` module is of type `JavascriptContainer`, which is defined under
    `tools/make.py`.
    This interface allows you to define javascript within certain parts of a card,
    and restrict it to a certain subset of templates (sides and card types).
    Please see [the aformentioned file](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/tools/make.py)
    to view the existing interface.
    Likewise, see the [base javascript file](https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/src/jp-mining-note/base.js)
    (`src/jp-mining-note/base.js`)
    to view how the interface is used.

If you want more detailed explanations on what has been happening up
until this point, continue reading below.


---


# Enabling & Disabling Modules
Modules can be easily enabled and disabled
by modifying the `enabled-modules` option under `config/config.py`.
Comment out any existing module, or add any modules you want to the list.

Additionally, if you are using modules outside the default modules that come
enabled with the note (including the `example` module),
the `allow-user-defined-modules` option should be set to `True`.


---


# Modding Existing Modules

Modules can be defined in the same style as the
[template overrides](overrides.md) above.
This means that if you want to edit a module, you can simply
override the module files themselves by copying the module folder into
`overrides/modules` folder.

For example, if you want to override the `auto-pitch-accent` module,
copy the `auto-pitch-accent` folder into `overrides/module/auto-pitch-accent`.

!!! note
    In the quickstart, we did exactly this with the `example` module.
    Since the example module is completely overwritten by the user,
    the previous example module code is completely ignored.


---

# Creating More Modules
The easiest way to create a new module is by copying the `example` folder,
and renaming it to something different.
This folder should be placed under `overrides/modules` under most cases.
However, if you are looking to contribute to the project,
place this under `src/modules` instead.


Certain parts of the code should be renamed as well to avoid conflicts with the existing
`example` module, including the `MOD.id`, import path, `JPMNLogger` constructor,
and runtime option call (`utils.opt`).

Of course, make sure all the renames are consistent.
For example, all of the following should be the same:

- `MOD.id`
- module folder name
- `JPMNLogger` constructor argument

Afterwards, make sure to add the module id to `enabled-modules`, and
ensure that `allow-user-defined-modules` is set to `True`.

If everything is done correctly,
the note should include your custom module after the next build!


---

# Why not just separate the code with files?

**Short answer**: <br>
In an attempt to keep the card as stable as possible between versions.

**Long answer**: <br>
Anki specifically states this in its
[official documentation](https://docs.ankiweb.net/templates/styling.html?highlight=javascript#javascript):

!!! quote
    Javascript functionality is provided without any support or warranty.

Many javascript-related things seem to behave strangely in Anki, which prevents the ability
to separate files easily.
Here have been the solutions I have tried before moving to this approach:

??? example "Link an external script with the `<script>` tag"

    There are two main problems with this approach:

    1. On older Anki versions (2.1.49 and below), all `<script>` tags loads asynchronously
        compared to each other.

        This means if any file must be ran before a file is loaded, then the script would fail.

        On versions 2.1.50 and above, it appears that Anki loads `<script>` tags synchronously.
        However, there is no guarantee that this will be the case for the future.

    2. Certain javascript in the main template has to be ran before loading in any file.

        This requirement exists for this note type due to the runtime-options file exists.
        The global `JPMNOpts` has to exist for any external files that uses runtime options to work.

        This can be fixed by importing the options separately for each file, but that naturally
        leads us to the examples shown in the following section.


??? example "Regular imports within Javascript"

    All other examples of importing without a separate `<script src="...">`
    requires asynchronous javascript features, which should be
    [avoided](moddingtips.md#avoid-asynchronous-javascript-features-in-anki)
    as much as possible.

    Examples:

    ```html

    <script>

      // https://forums.ankiweb.net/t/linking-to-external-javascript/1713
      var injectScript = (src) => {
      return new Promise((resolve, reject) => { // a Promise is an asynchronous feature!
          const script = document.createElement('script');
          script.src = src;
          script.async = true;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
      });

      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import
      // this import function is an asynchronous function!

      (async () => {
        await import("/modules/my-module.js");
        // ...
      })();

    </script>

    <!-- type="module" forces this entire script to run asynchronously! -->
    <script type="module">

      // for the `import` statement to work, the script must be of type="module"
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
      import { export1 } from "module-name";

    </script>
    ```

In conclusion, this is a design decision made after lots of trial and error when attempting
to work with Anki's Javascript parser.

I believe this is the best way to ensure that the note stays resilient across Anki updates,
as the javascript itself has very few hacks to get it to behave well.



