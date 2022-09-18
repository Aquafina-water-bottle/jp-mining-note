
There are many options that can be set within the (javascript) runtime options file.
To edit this, navigate to your profile's
[media folder](faq.md#where-is-the-x-folder-in-anki)),
and open the `_jpmn-options.js` file as a text file.


TODO gif for windows (open as notepad)


The contents of the file should look something like the following:
```
var JPMNOpts = (function (my) {
  my.settings = {
    ... // a bunch of settings
  }
  return my;
}(JPMNOpts || {}));
```

I recommend going through this file and selecting the options that best fits your workflow.
As each setting is already documented in the file,
the settings will not be documented heavily here.
Instead, a small number of hand selected settings will be showcased below,
to give you a taste of what is available.

TODO flesh out below

# Keybinds
TODO gif with screenkey

# Modules
Many javascript heavy code are separated into modules by default.
These can be enabled and disabled at the user's will if the user
wants to sacrifice functionality for a potentially faster card.

Some examples include:

- kanji hover
- pitch accent selection.
- sentence processing
- image processing

These modules likely also also have their own collection of settings
to modify the behavior of said module.

# Colored Quotes instead of PA Indicator
TODO picture comparisons between word PA indicator in quotes / word PA with PA indicator

# Greyed out fields
TODO picture comparisons empty fields / empty fields but greyed out

# Open Extra Info
TODO gif

