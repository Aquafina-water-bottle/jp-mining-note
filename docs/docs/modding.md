
<!--
If you are looking to simply install the card, see the appropriate
wiki page here (TODO link to setup).
-->

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
To ensure that your changes aren't lost, new files

TODO is this even necessary?


# Prerequisites
You must be able to successfully build the template
in order to start modding the note.
See the [build page](building.md) for more details.

Additionally, it is recommended that you go through the
[compile-time options](compileopts.md) section in the build page after your first successful build,
as it may contain what you are looking for.


<!--
## Extra Javascript & CSS
- primarily for testing, not for production use
- appends whatever javascript you want to the very end of the anonymous function
-->



# Custom Templates: Overrides
- `overrides` folder (or whatever folder you specify under `templates-override-folder` in config.py)
- same format as existing `src` folder
- primarily to override html
- see the [modules](modding.md#custom-js-modules) section on the recommended way to add custom javascript

!!! note
    - no guaranteed backwards compatability (especially while the note is still in beta)
    - although you won't lose your changes upon update, your changes might also not work on the next update
    - example: if the layout of the file changes at all, i.e. a css class gets renamed,
        and you are still using the old class name after the update, it may not behave as expected


## How-To (Overrides)

TODO

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
    ??? example "Extra Info with External Links"
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




# Custom JS: Modules
- TODO basic explanation
- primary use is for javascript (and currently only used for javascript)
- javascript-only modules do not require any edits to the raw html
- some modules may still have to edit the raw html -> cannot update the note
    - recommend using template overrides
- uses runtime options


## Example (Hello World)

It would be easiest to show an example first, before diving into the how-to.


The following will enable a the hello world module,
which prints a "Hello world!" at the front of any card
(as a warning on the [info circle](usage.md#info-circle)).

`config.py`:
```
"compile-options": {
    "allow-user-defined-modules": True,

    "enabled-modules": [
        ...

        "example"
    ]
},
```


runtime options file (`jpmn_opts.jsonc`):
```
...
"modules": {
  ...
  "example": {
    "enabled": true
  }
}
```

## How-To (Modules)

- modules can be defined in the same style as the template overrides above
    - module files can even be completely overwritten if you define the same file
- define modules in the overrides folder

- quickstart: copy the `example` module into `overrides/modules`
    - result should have the two files:
        - `overrides/modules/example/main.html`
        - `overrides/modules/example/main.js`
    - all you have to do now is edit the `main.js` and `main.html` files to your liking
    - these files will overwrite the previous example

- when renaming:
    - do your best to keep the naming consistent with everything else
    - make sure you enable them in the config and runtime options



## Why not just separate the code with files?

**Short answer**: <br>
In an attempt to keep the card as stable as possible between versions.

**Long answer**: <br>
Anki specifically states this in its
[official documentation](https://docs.ankiweb.net/templates/styling.html?highlight=javascript#javascript):

!!! quote
    Javascript functionality is provided without any support or warranty

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



# Custom CSS
- allows for custom themes / complete user customization
- can override variables, etc.
- simply appends the css at the very end of the existing css


## How-To (Custom CSS)

- make new folder under `src/scss` (e.g. `extra`) and add to `css-folders` in config.py, e.g.
    ```
    "css-folders": ["base", "dictionaries", "extra"],
    ```

- folder should be of the format:
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
    - all files are optional: only create and use the ones you need

!!! note
    Unlike everything else here, custom CSS cannot be defined in the `overrides` folder.
    I will be working on a way to define it in the `overrides` folder in the future.

!!! note
    Yes, this is the SCSS, not CSS. However, SCSS is almost a complete superset of CSS.
    In other words, if you don't know any SCSS, you can write normal CSS
    and have it behave completely the same.

- many existing variables can be overwritten (see `templates/scss/base/common.scss`)




## Example (Zoom)
Let's say we want to increase the size of the card, without affecting any of Anki's GUI.

1. Create a folder called `extra`, like above.

1. Create a `style.scss` file under `extra`.

1. Add the following code to the `field.scss` file:

    ```
    :root {
      /* Times 1.1 of the original size.
       * If you want to make the note smaller, use a value like 0.9.
       */
      --zoom: 1.1;
    }
    ```

1. Under `config.py`, set the `css-folders` option:
    ```
    "css-folders": ["base", "dictionaries", "extra"],
    ```

1. Rebuild and reinstall the template.



# Field Editing
This section describes import PSAs on what you should you if you want to
edit the fields of the note (i.e. adding, removing, renaming, and moving).

Fields editing in this context refers to the fields that you can edit
in the `Fields` (list) menu, found under (Main window) →  `Browse` →  `Fields...`.


<figure markdown>
{{ img("anki field window", "assets/anki/fields_window.png") }}
</figure>



## Installer details
- TODO updating section -> re-state some stuff


## Do not remove or rename fields

- do not remove fields!
    - even if compiling them out with always-filled/never-filled fields (below)
    - to move out of you way, move them below `Comment` and run `install.py` with `--ignore-order` flag on further updates
    - install script requires all expected fields to be present (you no longer cannot update if you remove a field)
        - simply re-add the field if you removed it before
    - is a design choice made by the updating script to make it easier to update the note
    - this rule may be removed in the future, but it will be kept strict for now to make the dev's life easier

- do not rename fields
    - similarily to the above, so the updater knows what fields already exist

## How to add & reorder fields
- if wanting to add field: recommend to add below `Comment` field to seemlessly update
    - if field added above `Comment` and want to update, run `install.py` with `--ignore-order` flag








<!--
- especially since your changes will likely edit the raw html
- contributing to the project + enabling the features on your system should guarantee that
  your additions aren't lost upon each update
-->


<!--
# Modding the Note

- runtime options
    - options in javascript
    - can implement certain features only with runtime options and no modules
    - TODO write this in a separate page

- what to use: modules / runtime options only
    - whichever you think is simpler to implement and to maintain
    - usually modules


## Where to add your feature?
- only care about this if you plan on contributing your feature btw
-->




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

??? example "Example Asynchronous Javascript"

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

??? example "Example (safer) asynchronous javascript"

    ```javascript
    let ele = document.getElementById("example");
    async function runMeAsynchronously() {
      // ...
      ele.innerText += "this should only appear once!";
    }
    ```



## Make your changes shown!
If you think your changes will be useful for others,
I highly recommend contributing your work to this project!

TODO


## Contributing
TODO separate page

- before:
    - I'm relatively new to people contributing to my work, so I'm not sure how to format this section
    - (As of writing this), I highly recommend you reach out before-hand so we can discuss the changes you want to make

- during:
    - attempt to match style around the code

- final steps:
    - use black to format all python files (TODO script)
    - make sure tests run (maybe CI at some point?)
    - update documentation (see docs/ folder) if necessary


```bash
# Build for release, if you want to contribute to the project
python3 ./make.py --release
```




<!--
# Making an Issue
TODO

- prefer chats over issues (a lot easier / faster to get things done)

- if only specific cards OR modified version of note, please export + send
    - when in doubt, send it regardless ;)
- provide as much details as you can, including:
    - anki version
    - operating system
    - screenshots, if applicable
    - how to reproduce the behavior & expected behavior
- TODO issue.md template would be cool
-->


