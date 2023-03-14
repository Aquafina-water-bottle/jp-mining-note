# Yomichan Templates Changelog
The versioning differs from the card template version:
it simply refers to the year/month/date
of the changes.
Versioning only starts at v23.01.16.0 since that was the first version when
I started explicitly recording the changes.


## v23.03.14.2
- Updated `{freq}` to match Marv's code (v23.03.13.1)

## v23.03.14.1
- added a bunch of options:
    ```
    {{~! ========================== Other Options ============================ ~}}
    {{~set "opt-wrap-first-line-spans" true ~}}
    {{~set "opt-primary-def-one-dict-entry-only" false ~}}
    {{~set "opt-jmdict-list-format" false ~}}

    {{~! ======================== Non-JPMN Options =========================== ~}}
    {{~set "opt__non-jpmn__stylize-glossary" true ~}}
    {{~set "opt__non-jpmn__one-dict-entry-only-no-list" false ~}}
    {{~set "opt__non-jpmn__export-dictionary-tag" true ~}}
    {{~set "opt__non-jpmn__remove-first-line-enabled" false ~}}
    {{~#set "opt__non-jpmn__remove-first-line-except-dicts-regex"~}} ^(JMdict.*|Nico/Pixiv)$ {{~/set~}}
    ```
- removed dead logic for italics

## v23.02.27.1
- Updated `{freq}` to match Marv's code

## v23.02.12.1
- Added support for `JMdict Forms` as a utility dictionary

## v23.02.05.1
- Updated `{freq}` to match Marv's code

## v23.01.19.0
- Fixed a minor bug where the "・" regex replace for the NHK dictionary was not working as expected with the newline span wrapper

## v23.01.16.0
- Added support for `ignored-freq-dict-regex` to ignore arbitrary frequency dictionaries
