
TODO see [Updating](updating.md) to see how to update your note in general

this page are notes from updating from major versions to another.

# 0.11.x.x →  0.12.x.x

Most of the backend has completely changed with this update.
For casual users, the main difference is that the options file is completely different.

## Runtime Options
The contents of the existing options file `_jpmn-options.js` is now completely defunct,
due to new way of how the options are defined.

1. Locate your `_jpmn-options.js` file (see [Runtime Options](runtimeoptions.md)).
1. Make a backup of this file (say, by copying it somewhere else).
1. Run this command: TODO
1. If you have any changed options, change the equivalent options back. See here on how to do this: TODO


## Note Editor
- may have noticed editor looks fancy now
- ensure fields are in the correct order: TODO
- ensure fields have the correct font sizes: TODO
- ensure certain fields are collapsed: TODO
    - at least CardCache should be collapsed
    - I also collapse: SecondaryDefinition, ExtraDefinitions, UtilityDictionaries, AltDisplayPASentenceCard, AltDisplayAudioCard


## Developer Notes
If you have been using any custom overrides, CSS, or Javascript,
you will want to check that all of these are updated.

- A decent number of HTML partials has been changed. Please check all your overrides to make
    sure your overrides are matching with the new partials.
- Some common CSS classes have been renamed, so some custom CSS might not work without changes.
- Custom Javascript is now handled completely differently, due to the introdution of webpack and typescript.
    See here: TODO


