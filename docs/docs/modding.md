
# Modding (The Obvious Way)
Throughout the documentation and within the templates alone, you will likely
see warning messages to not edit the templates directly unless you are willing
to lose your changes when you update the note.

The most obvious way to mod the note is directly in the pre-built template downloaded.
If you are completely fine with losing your changes upon each update,
and don't want to take advantages of certain tools that comes with this note
(such as compile options),
then you can simply edit the template and ignore the rest of this page.

---


# Modding (The Recommended Way)
To ensure that your changes aren't lost, the recommended way to make changes
to the existing templates is to add new files, rather than editing existing ones.
This allows you to continuously update with the note, while having your
custom files stay in place.

!!! warning

    There is no guaranteed backwards compatability for anything mentioned here
    (especially while the note is still in beta).
    Although you won't lose your changes upon update,
    your changes might also not work on the next update.
    For example, if the file that you are overriding gets renamed, you will have to rename the file
    to match the newly renamed file.

    I will try my best to keep things backwards compatable,
    but given the current state of the note (particularily the CSS),
    it might not be possible to do most of the time.
    When this note comes out of beta, backward-incompatable changes should be
    harshly reduced.

---

# Prerequisites
You must be able to successfully build the template
in order to start modding the note.

[Click here to see how to build the template!](building.md){ .md-button }



