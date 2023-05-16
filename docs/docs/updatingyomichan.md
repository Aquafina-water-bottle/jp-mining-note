TODO introduction?


---


# Updating Yomichan's Anki Card Format

To update the Yomichan Format, the steps should be almost the same as the
one specified already in the [setup](setupyomichan.md#yomichan-fields).
The most important difference is that if a new field was added or a field has been renamed,
then **the field will not show up automatically in Yomichan**.


!!! warning
    Doing the above WILL clear all the fields that you previously had, unless there
    is a matching field in that other card.


## Refreshing Yomichan Fields

??? example "Video Demo <small>(click here)</small>"
    ![type:video](assets/updating/updating_yomichan_fields.mp4)

1. As always, create a [backup](faq.md#how-do-i-backup-yomichan-settings)
    of your Yomichan settings, just in case.
1. After installing the note update, create a temporary copy of the note by: <br>
    `Tools` <br>
    →  `Manage Note Types` <br>
    →  `Add` <br>
    →  Select `Clone: JP Mining Note` →  `Ok` <br>
    →  Name the note anything you want (the following examples will use `JP Mining Note copy`)  →  `Ok`<br>
    →  `Close`
1. If you are currently viewing Yomichan Settings, please refresh the page.
1. Head over to Anki Card Format [as before](setupyomichan.md#yomichan-fields).
1. In the top right corner, change `Model` to `JP Mining Note copy`,
    and then change it back to `JP Mining Note`.
    (If you don't see `JP Mining Note copy`, please refresh the page.)
1. Update the fields as specified.
    - It should be specified in the text you see when updating.
        However, you should also simply compare the table on the
        [setup page](setupyomichan.md#yomichan-fields) to your filled out fields.
1. Remove the temporary note: <br>
    `Tools` <br>
    →  `Manage Note Types` <br>
    →  (select `JP Mining Note copy`) <br>
    →  `Delete`

!!! info "Explanation"
    Using the temporary copy of the updated card
    means that fields that remain unchanged between the old card and new card
    will be transferred automatically in the Yomichan Format.
    If you simply choose some random model like `Basic`,
    then almost none of the fields will be preserved, as the `Basic` card
    does not have any matching fields with the `JP Mining Note` model.

---


# Updating Yomichan Templates
Like the above, you can simply follow the steps already specified in [setup](setupyomichan.md#yomichan-templates).

Again, please make a [backup](faq.md#how-do-i-backup-yomichan-settings)
of your Yomichan settings just in case,
and again, please make sure you **reset the existing templates** (unless you know what you are doing).

Note that your Yomichan template options will be reset if you follow all the steps.
I recommend temporarily saving a copy of the Yomichan templates so you can easily
reset your Yomichan template options after updating.


---
