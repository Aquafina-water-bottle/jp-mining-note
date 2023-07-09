
So you want to update jp-mining-note? Awesome, here's what you got in store!

---

# What to Expect

Updating JPMN usually comprises of updating two things separately:

- **The JPMN template itself within Anki**.
    The internal updater does most of the work, so you should not have to do much on this end.
- **External settings**, such as the Yomichan settings required to interface with Anki.
    The internal updater CANNOT interface with these, so you will have to manually update these if they exist.

## What to Expect: Updating the JPMN template

- Any changes you made to the templates **WILL BE LOST** (outside of the small dedicated section at the bottom of the CSS). This is because the updater replaces your template **in place**, and overrides any changes.
- Fields may be added, repositioned, etc. Existing fields should not be removed.
- It runs any necessary batch edits to all notes, meaning the data within any given note may be subtly changed.

As the updater can do many things to your collection, it is always recommended
to make [a complete backup](faq.md#how-do-i-backup-my-anki-data)
of your collection before updating.

## What to Expect: External Settings

After running the main updater, there may be changes that the user must make,
because the updater simply cannot update those particular details.
User-required changes are usually present for major updates
(i.e. if any of the first two numbers in the version change).

Some common user-required changes include:

- Updating the Yomichan templates
- Updating optional add-on configs

All of these user required changes should be listed under the [Setup Changes](setupchanges.md) page,
which should be read after running the main installer.

---

# Updating!

Now that you have a general idea of what's going to happen...

[See how to update JPMN here!](updatingjpmn.md){ .md-button }
