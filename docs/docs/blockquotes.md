
TODO:

- mobile vs desktop interface
- mobile interface: multiple vs unique
- 


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
    {{ img("", "assets/uicustomization/open_fields/closed.png") }}

=== "Using example config (new card)"
    {{ img("", "assets/uicustomization/open_fields/open.png") }}

=== "Using example config (non-new card)"
    {{ img("", "assets/uicustomization/open_fields/partially_open.png") }}


---



## Do not hide empty collapsed fields

Collapsable fields that are empty are usually not shown at all.
This {{ RTO }} allows them to be shown (but greyed out) when empty.
```json
{
  "greyed-out-collapsable-fields-when-empty": ...
}
```

=== "Empty fields greyed out (`true`)"
    {{ img("", "assets/uicustomization/greyed_out_fields/grey.png") }}

=== "Empty fields not shown (`false`, default)"
    {{ img("", "assets/uicustomization/greyed_out_fields/hidden.png") }}
