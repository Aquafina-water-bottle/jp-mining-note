Batch commands are actions that affect multiple notes all at once.
Usually, these commands affect all `JP Mining Note` notes.
Please use these commands with caution, and always backup your collection
before doing large changes to your Anki collection!

---

# Running batch commands

Before running any batch command, ensure Anki is open, and Anki-Connect is installed.

There are two ways of running batch commands.

1. If you are using
    [JPMN Manager](https://ankiweb.net/shared/info/{{ JPMN_MGR_CODE }}),
    you can run it by navigating to the following:

    > `Tools` →  `JPMN Manager` →  `Run batch command`

1. Alternatively, you can run batch commands directly through command line:

    === "Windows"
        ```bat
        :: Ensure you have Anki open, and with Anki-Connect running
        :: Also ensure that you have python 3.9+ installed.
        python tools\batch.py YOUR_BATCH_COMMAND
        ```
    === "MacOS & Linux"
        ```bash
        # Ensure you have Anki open, and with Anki-Connect running
        # Also ensure that you have python 3.9+ installed.
        # You may have to use `python3` instead of `python`.
        python3 tools/batch.py YOUR_BATCH_COMMAND
        ```

---

# Available batch commands

Below contains an incomplete list of available batch commands.

Most batch commands are ad-hoc commands written for one-time usage,
usually for importing notes or updating notes.
If you want the full list, run the following command:
```
python3 tools/batch.py --help
```


## fill_field

> usage: `fill_field [-h] [--value VALUE] [--query QUERY] field_name`

Sets the given field to `1`.

Some examples:
```aconf
# set all cards to sentence cards
fill_field IsSentenceCard

# does the above, but fills the field with `x` instead of `1`:
fill_field IsSentenceCard --value "x"
```



## empty_field

> usage: `empty_field [-h] [--query QUERY] field_name`

Empties the given field.




## copy_field

> usage: `copy_field [-h] [--query QUERY] src dest`

Copies the contents of the source (src) field to the destination (dest) field.


## verify_fields

> usage: `verify_fields [-h] [--version VERSION]`

Checks that the fields and its order is correct
with the current version.


## reposition_fields

> usage: `reposition_fields [-h] [--version VERSION]`

Automatically reorders the field list to be the expected order


