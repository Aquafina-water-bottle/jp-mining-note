For the purposes of this note type, a blockquote is simply a name given to
group together the following sections of text:

- Primary Definition
- Secondary Definition
- Additional Notes
- Extra Definitions
- Extra Info

These are called "blockquotes" because they are stylized as a blockquote,
and are internally contained inside a `blockquote` HTML tag.

Topics such as how dictionaries are selected are not covered here.
For those topics, see the [Definitions](#definitions.md) page instead.

---


# Desktop Interface

TODO image

On desktop, only the Primary definition is revealed by default.
All other blockquotes are shown by un-collapsing the individual sections.

---

# Mobile Interface
TODO

On mobile, the collapsible sections are replaced with tabs.
Clicking on these tabs reveal the relevant section.

TODO table of icon to section

---



# Automatically show a blockquote

Collapsed fields are collapsed by default.
These fields can be set to be automatically opened
under the following {{ RTO }}:

```json
"blockquotes.open.enabled": true,
```

??? example "Example Config <small>(click here)</small>"
    ```json
    "blockquotes.open.enabled": true,
    "blockquotes.open.secondaryDefinition": true,

    "blockquotes.openOnNew.enabled": true, // (1)!
    "blockquotes.openOnNew.extraInfo": true,
    ```

    1.  This allows a blockquote to be open on new cards only.
        The `blockquotes.open.enabled` option always opens a blockquote.
        regardless of whether the card is new or not.

=== "Default"
    {{ img("", "assets/uicustomization/open_fields/closed.png") }}

=== "Using example config (new card)"
    {{ img("", "assets/uicustomization/open_fields/open.png") }}

=== "Using example config (non-new card)"
    {{ img("", "assets/uicustomization/open_fields/partially_open.png") }}

!!! note "Usage on mobile"
    On mobile devices, only one blockquote can be shown by default, meaning
    these options will have no effect. To allow these options to work,
    you must enable the showing of multiple blockquotes in the first place.
    See [here](#showing-multiple-blockquotes-on-mobile) to do just that.


    Additionally, the `blockquotes.openOnNew.*` options will not work on mobile,
    because this is a feature that requires AnkiConnect to be downloaded.


---



# Hide empty collapsed fields


=== "Empty fields greyed out"
    {{ img("", "assets/uicustomization/greyed_out_fields/grey.png") }}

=== "Empty fields not shown (default)"
    {{ img("", "assets/uicustomization/greyed_out_fields/hidden.png") }}


Collapsable fields that are empty are hidden by default.
These can be greyed out instead, using the following {{ RTO }}:
```json
"blockquotes.hideEmpty": false,
```

---


# Do not hide tabs when empty

On mobile, the tabs will be hidden when empty.
This {{ RTO }} allows them to be shown (but replaced with a small dot) when empty.
```json
"blockquotes.folderTab.showDotWhenEmpty": true,
```

=== "Dot replacing empty tabs (`true`)"
    TODO

=== "Hidden tabs (`false`, default)"
    TODO

---


# Showing multiple blockquotes on mobile

Some users may prefer seeing multiple definitions at the same time.
To do this, set the following {{ RTO }}:

```json
"blockquotes.folderTab.mode": "multiple",
```

TODO image


---



