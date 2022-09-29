
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



# Custom HTML: Template Overrides
- `overrides` folder (or whatever folder you specify under `templates-override-folder` in config.py)
- same format as existing `templates` folder


## Example: External links in "Extra Info"

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
    ??? quote "Extra Info with External Links"
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


## Example: Hello World module

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

## Defining your own modules

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




# Custom CSS
- allows for custom themes / complete user customization
- can override variables, etc.
- simply appends the css at the very end of the existing css


how-to:

- make new folder under `scss` (e.g. `scss/extra`) and add to `css-folders` in config.py, e.g.
    ```
    "css-folders": ["default", "dictionaries", "extra"],
    ```
- folder should be of the format:
    ```
    extra
     L field.scss
     L editor.scss
     L style.scss
    ```
    - all files are optional: only create and use the ones you need





# Field Editing
This section describes import PSAs on what you should you if you want to
edit the fields of the note (i.e. adding, removing, renaming, and moving).

Fields editing in this context refers to the fields that you can edit
in the `Fields` (list) menu, found under (Main window) →  `Browse` →  `Fields...`.


<figure markdown>
{{ img("anki field window", "assets/anki/fields_window.png") }}
</figure>



## Installer details
- TODO look at updating section


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







