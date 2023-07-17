
!!! warning
    This entire section will be **completely overhauled** in version 0.12.0.0,
    meaning that this information will be completely changed when that version releases.
    See the `dev` branch on Github if you want to see the work in progress.


# Overview

An easy way to override and extend parts of the card templates is by using an
`overrides` folder.
This folder (specified under `config.py` under the `templates-override-folder` option)
allows you to override any file under the `src` folder (outside of `scss` files).

Primarily, this allows you to override sections of template code found under
`src/jp-mining-note`, such as `src/jp-mining-note/partials/hint.html`.

The structure of the `overrides` folder must match the structure in the `src` folder.
For example, if you want to override the hint file (`src/jp-mining-note/partials/hint.html`),
the new file must be created under `overrides/jp-mining-note/partials/hint.html`


---

# Example (Add external links)


!!! warning
    The following is deprecated starting from Version 0.10.3.0.
    Version 0.10.3.0 allows the user to customize
    external links in the compile options (`config.py`).

    This is only here to serve as a placeholder example (while I try to think of
    other practical examples people would use).
    Let me know if you have any ideas!


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



