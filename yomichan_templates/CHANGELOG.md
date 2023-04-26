# Yomichan Templates Changelog

The yomichan template versions will be incremented thusly:
- Major: Increment if any public-facing marker is removed, or changed in a large way that causes
    the default behavior to be different
- Minor: Incremented when any new features or markers are added
- Patch: Incremented when any bugfix, settings variable change, comment change, basic refactor, etc. is made

Public facing markers are markers starting with `jpmn` (whereas private markers are ones starting with `_jpmn`).

The Yomichan template version is incremented independently from the jp-mining-note version.


## v1.0.6
- Changed the order of dictionary categorization from ignored -> bilingual -> utility, to ignored -> utility -> bilingual

## v1.0.5
- Changed `opt-jmdict-list-format` to be `true` by default

## v1.0.4
- Added warning when "Result grouping mode" is set to "No grouping"

## v1.0.3
- Added `KireiCake` and `NEW斎藤和英大辞典` to `bilingual-dict-regex`
- Added `JMdict Extra` as a valid 'Extra' version

## v1.0.2
- Changed `opt-selection-text-enabled` to `true` by default

## v1.0.1
- Added JMedict to utility dictionaries regex

## v1.0.0
Changed versioning to semantic versioning since it's honestly easier to bump the versions this way.
- Date versions work the best for things that don't change very often, and it seems like this has been
    changing frequently enough to warrant proper semantic versioning.

- Versioning before this point simply refers to the year/month/date of the changes.
    Versioning only starts at v23.01.16.0 since that was the first version when
    I started explicitly recording the changes.

## v23.03.15.1
- Renamed a few plaintext options so that all defaults are `false`
- Changed some options to check for booleans without `===` operator (i.e. if (x) instead if (x === false))

## v23.03.14.3
- Renamed `opt__non-jpmn__*` -> `opt__plaintext__*`

## v23.03.14.2
- Updated `{freq}` to match Marv's code (v23.03.13.1)
- Reworked first line removal options to be shared among jpmn and non-jpmn settings:
    - Renamed `opt__non-jpmn__remove-first-line-except-dicts-regex` -> `opt-first-line-dicts-regex`
    - Added `opt-first-line-regex-mode`
- Fixed `opt-primary-def-one-dict-entry-only` not working if `opt__non-jpmn__one-dict-entry-only-no-list` is set to false (default)

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
