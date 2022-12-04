


# Adding Text

The main two fields that one can add text to is
`PrimaryDefinition` and `AdditionalNotes`.
Bolding anything in these sections will highlight the word in a light yellow (or blue in light mode) tint,
to make the bolded text stand out more.

{{ img("", "assets/text/bold.png") }}

<br>

## `PrimaryDefinition` field
The `PrimaryDefinition` field contains the main content, and should be the main field to edit
if one wants to put down more notes about the card.

<br>


## `AdditionalNotes` field
The `AdditionalNotes` field is useful if you want to write down even more notes,
but keep it in a collapsible field to reduce vertical space.

Here are some suggestions on how you can use this field:

* Recording the source where the scene came from
* Adding custom notes on the scene's context
* Recording the sentences surrounding the mined sentence

In general, this field should be used for any info that is not crucial
to understanding the tested content.

---



# UI Options

## Automatically open collapsed fields

Collapsed fields are collapsed by default.
These fields can be set to be automatically opened
under the following {{ RTO }}:

```json
{
  "modules": {
    "customize-open-fields": {
      ...
    }
  }
}
```

??? example "Example Config *(click here)*"
    ```json
    "customize-open-fields": {
      "enabled": false,

      // Force a field to be always open
      "open": [
        "Secondary Definition"
      ],

      // Opens the specified collapsable field if the card is new.
      "open-on-new-enabled": {
        "type": "pc-mobile",
        "pc": true,
        "mobile": false
      },

      "open-on-new": [
        "Extra Info"
      ]
    }
    ```

=== "Default"
    {{ img("", "assets/text/open_fields/closed.png") }}

=== "Using example config (new card)"
    {{ img("", "assets/text/open_fields/open.png") }}

=== "Using example config (non-new card)"
    {{ img("", "assets/text/open_fields/partially_open.png") }}


---



## Greyed out empty fields

Collapsable fields that are empty are usually not shown at all.
This {{ RTO }} allows them to be shown (but greyed out) when empty.
```json
{
  "greyed-out-collapsable-fields-when-empty": ...
}
```

=== "Empty fields greyed out (`true`)"
    {{ img("", "assets/text/greyed_out_fields/grey.png") }}

=== "Empty fields not shown (`false`, default)"
    {{ img("", "assets/text/greyed_out_fields/hidden.png") }}




