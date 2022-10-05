
# Introduction
This page describes all the ways of modding your note,
and goes into depth on the ways you can mod your note
**without losing your changes** between updates.



## Modding (The Obvious Way)
Throughout the documentation and within the templates alone, you will likely
see warning messages to not edit the templates directly unless you are willing
to lose your changes when you update the note.

The most obvious way to mod the note is directly in the pre-built template downloaded.
If you are completely fine with losing your changes upon each update,
and don't want to take advantages of certain tools that comes with this note
(such as compile-time options),
then you can simply edit the template and ignore the rest of this page.



## Modding Overview
To ensure that your changes aren't lost, the recommended way to make changes
to the existing templates is to add new files, rather than editing existing ones.
This allows you to continuously update with the note, while having your
custom files stay in place.

!!! warning

    There is no guaranteed backwards compatability for anything mentioned here
    (especially while the note is still in beta).
    Although you won't lose your changes upon update,
    your changes might also not work on the next update.
    For example, if the file that you are overriding gets renamed, you will have to rename the file
    to match the newly renamed file.

    I will try my best to keep things backwards compatable,
    but given the current state of the note (particularily the CSS),
    it might not be possible to do most of the time.
    When this note comes out of beta, backward-incompatable changes should be
    harshly reduced.

---

# Prerequisites
You must be able to successfully build the template
in order to start modding the note.
See the [build page](building.md) for more details.

Additionally, it is recommended that you go through the
[compile-time options](compileopts.md) section in the build page after your first successful build,
as it may contain what you are looking for.


---

# Custom Templates: Overrides
An easy way to override and extend parts of the card templates is by using an
`overrides` folder.
This folder (specified under `config.py` under the `templates-override-folder` option)
allows you to override any file under the `src` folder (outside of `scss` files).

Primarily, this allows you to override sections of template code found under
`src/jp-mining-note`, such as `src/jp-mining-note/partials/hint.html`.

!!! note
    Overrides are primarily for extending the HTML aspect of the templates.

    If you are instead looking to modify javascript, see
    [here](modding.md#custom-js-modules).
    Likewise, for CSS modifications, see
    [here](modding.md#custom-css).

The structure of the `overrides` folder must match the structure in the `src` folder.
For example, if you want to override the hint file (`src/jp-mining-note/partials/hint.html`),
the new file must be created under `overrides/jp-mining-note/partials/hint.html`


## Example (Add external links)

Let's say we want to rewrite the `Extra Info` section to have external links that search
for the tested word.

1. **Look for the partial** within the `src` folder. <br>
    This leads us to the `src/jp-mining-note/partials/extra_info.html` file.

2. **Override the partial**. <br>
    Now that we know the location of the partial, we create the same file in `overrides`.
    This new file should be of the path
    `overrides/jp-mining-note/partials/extra_info.html`.

3. **Write the code**. <br>
    Using the partial under `src` as an example, the following code is
    a modified version of the original HTML where we removed the dependency
    on the `PAGraphs` and `UtilityDictionaries` fields.
    Additionally, at the very bottom, a link to Jisho and Yourei is provided.

    Copy and paste the code below to your newly created file
    (`overrides/jp-mining-note/partials/extra_info.html`).

    {% raw %}
    ??? examplecode "Extra Info with External Links"
        ```htmldjango
        <details class="glossary-details glossary-details--small" id="extra_info_details">
        <summary>Extra Info</summary>
        <blockquote class="glossary-blockquote glossary-blockquote--small highlight-bold">
          <div class="glossary-text glossary-text--extra-info">

            {% call IF("PAGraphs") %}
              <div class="pa-graphs">
                {{ T("PAGraphs") }}
              </div>
            {% endcall %}

            {% call IF("UtilityDictionaries") %}
              <div class="utility-dicts">
                {{ T("UtilityDictionaries") }}
              </div>
            {% endcall %}

            <a href="https://jisho.org/search/{{ T('Word') }}">辞書</a
            >・<a href="http://yourei.jp/{{ T('Word') }}">用例</a>

          </div>
        </blockquote>
        </details>
        ```
    {% endraw %}

4. **Rebuild and reinstall the template**. <br>
    After rebuilding and reinstalling, your `Extra Info` section should now have two links
    at the bottom.

---



# Custom JS: Modules
Modules (not to be confused with regular
[javascript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules))
is a hybrid template/javascript system that allows code separation
at the file level, but allows the javascript to be compiled into each template,
rather than separate files.

The biggest advantage of this over a monolithic system is that individual modules
can be enabled, disabled, created, and modified at ease,
all without editing the source files.


## Example (Hello World)

The following will enable a the hello world module,
which prints a "Hello world!" at the front of any card
(as a warning on the [info circle](usage.md#info-circle)).


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


## Quickstart
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


## Enabling & Disabling Modules
Modules can be easily enabled and disabled
by modifying the `enabled-modules` option under `config/config.py`.
Comment out any existing module, or add any modules you want to the list.

Additionally, if you are using modules outside the default modules that come
enabled with the note (including the `example` module),
the `allow-user-defined-modules` option should be set to `True`.


## Modding Existing Modules

Modules can be defined in the same style as the
[template overrides](modding.md#custom-templates-overrides) above.
This means that if you want to edit a module, you can simply
override the module files themselves by copying the module folder into
`overrides/modules` folder.

For example, if you want to override the `auto-pitch-accent` module,
copy the `auto-pitch-accent` folder into `overrides/module/auto-pitch-accent`.

!!! note
    In the quickstart, we did exactly this with the `example` module.
    Since the example module is completely overwritten by the user,
    the previous example module code is completely ignored.

## Creating More Modules
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


## Why not just separate the code with files?

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
    [avoided](modding.md#avoid-asynchronous-javascript-features-in-anki)
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

---


# Custom CSS

!!! warning

    Since this note is still in beta, the CSS in particular is subject to heavy change.
    This is because when mobile support is being worked on,
    the CSS will likely heavily change to support mobile.

    If you are planning on changing the CSS,
    be vigilant with potential changes in future updates!


If you want to extend the CSS, do the following:

1. Make a new folder under `src/scss` (for example, `extra`).

    !!! note
        Unlike everything else here, custom CSS cannot be defined in the `overrides` folder,
        due to a complication in the current build system.
        I will be working on a way to define this in the `overrides` folder in the future.

2. Add the folder to the end of `css-folders` in `config.py`.
    This should result in the following:
    ```
    "css-folders": ["base", "dictionaries", "extra"],
    ```
3. Under the `extra` folder, use the following files to override the correct css:
    - `style.scss`: The main css for the card templates.
    - `field.scss`: The css used by [CSS injector](setup.md#css-injector)
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

!!! note

    You might have noticed that this is the SCSS, not CSS.
    However, SCSS is complete superset of CSS
    (with some small exceptions).
    In other words, if you don't know any SCSS, you can write normal CSS
    and have it behave completely the same.




## Example (Zoom)
Let's say we want to increase (or decrease) the size of the card,
without affecting any of Anki's GUI.

1. Create a folder called `extra`, like above,
    and include the folder under `css-folders` like above

1. Create a `style.scss` file under `extra`.

1. Add the following code to the `style.scss` file:

    ```
    :root {
      /* Times 1.1 of the original size.
       * If you want to make the note smaller, use a value below 1, like 0.9.
       */
      --zoom: 1.1;
    }
    ```

1. Rebuild and reinstall the template.

---


# Field List Editing
This section describes import PSAs on what you should you if you want to
edit the fields of the note (i.e. adding, removing, renaming, and moving).

Fields editing in this context refers to the fields that you can edit
in the `Fields` (list) menu, found under (Main window) →  `Browse` →  `Fields...`.


<figure markdown>
{{ img("anki field window", "assets/anki/fields_window.png") }}
</figure>

!!! note
    If you never plan on updating the note, you can safely modify the field list
    to your heart's content, and ignore the rest of this section.



## Installer details
The installer, when detecting a higher version, attempts to find and apply any
changes to the field list when necessary.
These changes are specified under `tools/note_changes.py`.

By default, the installer expects the field list to be completely
un-changed after installation, and does many checks to verify this before and after installation.


## Do not remove fields
One of the checks that the installer does is to ensure that all fields are present.
This is a design choice to remove as many assumptions as possible,
so that it is easier for the installer to update the note.

!!! note
    This design choice may be changed in the future, but will likely remain until
    the end of the beta release.

If you want to remove a field, the best alternative is to do the following:

1. Move the field below the `Comment` field, so the field is out of your way.
2. Whenever you decide to update the note to a new version,
    run the installation script with the `--ignore-order` flag.


## Do not rename fields
There is currently no way to let the installer know that you renamed a field.
Therefore, you should not rename fields at all, as this will cause the initial field
list check to fail.

If you are completely insistent on renaming a field, you must change all templates
that uses the field to match your preferred field name.


!!! note
    Similarily to the above, this may be changed in the future, but will likely remain until
    the end of the beta release.


## How to add & reorder fields
If you want to add a field while preserving the existing field order upon updates,
add the field under the `Comment` field.
This is because the installer only checks the subset of fields above the `Comment` field,
when verifying correctness.

If you don't care about preserving field order,
you can simply add the field anywhere you want,
and then run the installation script with `--ignore-order`
whenever you want to update the note to a new version.


---


# Other


## Javascript print statements
Anki doesn't come with a way to use `console.log()` normally, so I made one myself.

```javascript
// global logger
LOGGER.error("message");
LOGGER.warn("message");
LOGGER.info("message");
LOGGER.debug("message");

// module-specific logger
const logger = JPMNLogger("module-name");
logger.error("message");
logger.warn("message");
logger.info("message");
logger.debug("message");
```

The above functions prints a message of the given log level to the info circle.
To see the message, hover over the info circle.

To use the `debug` function, make sure that the `debug` option is set to `true`
in the javascript options.



## Avoid asynchronous javascript features in Anki

??? examplecode "Example Asynchronous Javascript"

    ```html
    <script>

      // Example 1: normal asynchronous functions
      async function runMeAsynchronously() {
        // ...
      }

      // Example 2: promises
      function giveMeAPromise() {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve("Success!");
          }, 1000);
        });
      }

      giveMeAPromise().then(() => {
        LOGGER.warn("The promise is complete!", unique=false);
      });

    </script>

    <!-- Example 3: anything wrapped in type="module" -->
    <script type="module">
      // everything here is run asynchronously
      // ...
    </script>
    ```

TODO reason:

- functions can be executed multiple times
- reproducible way: use example 2 on both the front/back side of the card, and switch sides quickly
    - should be two warnings
- but worst case is for cases which I don't know how to reproduce
    - rarely, asynchronous functions run more than once
    - including the async functions defined currently in modules like `kanji-hover`
    - to cirumvent having their actions done twice, define the affected elements outside the asynchronous section
        - the function still runs twice (so any side-effects of the function will still happen)
        - however, other instances of the function should not work on the elements defined outside

- avoiding asynchronous features makes things more predictable within anki

??? examplecode "Example (safer) asynchronous javascript"

    ```javascript
    let ele = document.getElementById("example");
    async function runMeAsynchronously() {
      // ...
      ele.innerText += "this should only appear once!";
    }
    ```



