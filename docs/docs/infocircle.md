hello world

# Interface

=== "Default"
    <figure markdown>
      {{ img("info circle example", "assets/info_circle/info.gif") }}
      <figcaption>
        On hover, the info circle on the top left corner just shows some basic info,
        However, it also serves as a notification system to the user, when it has a color.
      </figcaption>
    </figure>

=== "Default (back)"
    <figure markdown>
      (TODO IMAGE)
      <figcaption>
        By default, the info circle shows the tags at the back side of the card only.
        These tags can be clicked on (to search for the tag).
      </figcaption>
    </figure>

=== "Error"
    <figure markdown>
      {{ img("info circle error example", "assets/info_circle/error.gif") }}
      <figcaption>
        This should only appear when some javascript code fails.
        In other words, this should **not** appear under normal circumstances.
        If you get this without modifying the note in any way,
        please see [this section](faq.md#errors-warnings) for basic troubleshooting.
      </figcaption>
    </figure>

=== "Warning"
    <figure markdown>
      {{ img("info circle error example", "assets/info_circle/warning.gif") }}
      <figcaption>
        This serves to warn the user about something.
        It can appear without completely breaking the functionality of the card.
        In other words, you can choose to ignore it.
      </figcaption>
    </figure>

=== "Leech"
    <figure markdown>
      {{ img("info circle error example", "assets/info_circle/leech.gif") }}
      <figcaption>
        When the card is a leech, the circle is highlighted yellow (or blue in light mode)
        to indicate that it is a leech.
        This is only shown on the back side of the card.
      </figcaption>
    </figure>



---

# Locking the Info Circle

{{ feature_version("0.10.3.0") }}

You can toggle (click on) the info circle to lock the tooltip in place.
This may be useful for copying/pasting errors and other debugging purposes.


---

# Buttons

- Image Blur Toggle Button
    - toggles global status of image blur for the session (link)
- Refresh Button
    - refreshes kanji hover and word indicators (link)


