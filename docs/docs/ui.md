This entire section is dedicated to showcasing various aspects of the
common user interface.


# Summary
Most of the user interface is already shown off in the [GUI demo](/jp-mining-note/#demos){:target="_blank"},
and I would recommend watching it before continuing.
However, to dispell any mysteries, here is a fully annotated summary of the user interface.


{{ img("UI annotated summary", "assets/eg_fushinnsha_diagram.png") }}

Additional information on some parts of the UI is stated below.

---

# Info Circle

=== "Default"
    <figure markdown>
      {{ img("info circle example", "assets/info_circle.gif") }}
      <figcaption>
        On hover, the info circle on the top left corner just shows some basic info.
        However, it also serves as a notification system to the user, when it has a color.
      </figcaption>
    </figure>

=== "Error"
    <figure markdown>
      {{ img("info circle error example", "assets/info_circle_error.gif") }}
      <figcaption>
        This should only appear when some javascript code fails.
        In other words, this should **not** appear under normal circumstances.
        If you get this without modifying the note in any way,
        please see [this section](faq.md#errors){:target="_blank"} for basic troubleshooting.
      </figcaption>
    </figure>

=== "Warning"
    <figure markdown>
      {{ img("info circle error example", "assets/info_circle_warning.gif") }}
      <figcaption>
        This serves to warn the user about something.
        It can appear without completely breaking the functionality of the card.
        In other words, you can choose to ignore it.
      </figcaption>
    </figure>

=== "Leech"
    <figure markdown>
      {{ img("info circle error example", "assets/info_circle_leech.gif") }}
      <figcaption>
        When the card is a leech, the circle is highlighted yellow (or blue in light mode)
        to indicate that it is a leech.
        This is only shown on the back side of the card.
      </figcaption>
    </figure>




## Locking the Info Circle

{{ feature_version("0.10.3.0") }}

You can toggle (click on) the info circle to lock the tooltip in place.
This may be useful for copying/pasting errors and other debugging purposes.

---


# Kanji Hover
<i><sup>Main page: [Kanji Hover](kanjihover.md)</sup></i>

Kanji hover shows you if you have seen the kanji in previous cards or not.
This is useful if you want to check whether you have seen the reading
in a previous card, to differentiate between similar kanjis, etc.

By default, it searches for the kanji within the "Word" field,
only for notes of the same type (JP Mining Note).

{{ img("kanji hover demo", "assets/kanji_hover.gif") }}

Notice how some results are greyed out.
Those results are results from cards that have not been reviewed yet.
Conversely, as non-greyed out results come from cards that you have already reviewed,
they should represent words that you already know.


!!! note
    The maximum number of results, as well as the exact queries themselves,
    can be changed in the [options file](runtimeoptions.md){:target="_blank"}.

---

# Same Reading Indicator
{{ feature_version("0.11.0.0") }}

When a word with the same reading has been detected,
an indicator will be shown.
This indicator will be yellow (or blue on light mode) for new cards only.
After the first review, the indicator will be the same color as the info circle.

TODO gif

The query ignores pitch accent.
For example, if you have the cards 自身 and 自信,
the indicator will still be shown and point to each other.

---

# Word Pitch
The colors and what the lines mean are all described in the
official anki addon page as specified
[here](https://ankiweb.net/shared/info/1225470483).

## Colored Pitch Accent
<i><sup>Main page: [Auto Pitch Accent (Colored Pitch Accent)](autopa.md#colored-pitch-accent)</sup></i>

Pitch accent can already be set very easily by writing the position in `PAOverride`.
Moreover, the reading, word and pitch overline can be automatically colored
in Migaku style colors according to the main pitch accent groups.

This automatic coloring behavior is **disabled by default**,
and must be enabled in the [options file](runtimeoptions.md){:target="_blank"}:

??? examplecode "Enabling colored pitch accent *(click here)*"
    ```json
    "auto-pitch-accent": {
      "enabled": true, // (1)!
      "colored-pitch-accent": {
        "enabled": true,
        // ...
      }
      // ...
    }
    ```

    1.  The `auto-pitch-accent` module must be enabled to use colored pitch accent.

![type:video](assets/pa_override_color.mp4)



---


# Images in Definition Fields
Outside of the normal click to zoom image at the top right,
any customly inserted images, including images inserted directly by Yomichan,
will be converted to text which you have to hover over to reveal.
Of course, this image can also be clicked on to zoom.
See the video demo below to see exactly what happens.

![type:video](assets/img_utils.mp4)

??? info "How to disable *(click here)*"
    This image conversion can be globally disabled
    in the [runtime options file](runtimeoptions.md){:target="_blank"}:

    ```json
    "img-utils": {
      "stylize-images-in-glossary": false,
      // ...
    }
    ```
    Additionally, if you want to only disable this for some particular images,
    [edit the HTML](faq.md#how-do-i-edit-the-fields-raw-html){:target="_blank"}
    of the desired field, and add `data-do-not-convert="true"`.

    An example is shown below:
    ```
    <img src="your_image.png" data-do-not-convert="true">
    ```


# Image Blur
{{ feature_version("0.10.3.0") }}

This allows you to blur the images of cards marked with a NSFW tag.

This behavior is **disabled by default**. In other words, you will not be able to blur
images unless the following setting is explicitly enabled
in the [runtime options file](runtimeoptions.md){:target="_blank"}:


??? examplecode "Enabling image blur *(click here)*"
    ```json
    "img-utils": {
      "enabled": true, // (1)!
      "nsfw-toggle": {
        "enabled": true,
        // ...
      }
    }
    ```

    1.  The `img-utils` module must be enabled to use the image blur feature.

<figure markdown>
  {{ img("example toggle blur gif", "assets/anki_blur/example.gif") }}
</figure>



To mark a card as NSFW, add any of the following tags to the card:

> `nsfw`・`NSFW`・`-NSFW`




!!! note
    Recall that you can use custom text in the `Picture` field instead of having an actual picture.
    This is useful if you simply don't want to save a particular image.


## Change Review Session State
The above demo shows how you can un-blur an image temporarily.
In other words, if you see that card again during the same review session,
the image will be blurred again.


The state of this can be changed for a review session.
To do this, hover over the info circle, and click on the eyeball to the top left to toggle between states.
This state will be maintained for the entire review session, but will be lost on the next session.

The tabs below show the available states.
By default, states cycle from left to right.


=== "Only Blur if NSFW"

    | Not Marked | Marked (with `NSFW` tag) |
    |:-:|:-:|
    | {{ img("", "assets/anki_blur/unmarked_revealed.png") }} | ![](assets/anki_blur/marked_blurred.png) |

=== "Always Blurred"

    | Not Marked | Marked (with `NSFW` tag) |
    |:-:|:-:|
    | ![](assets/anki_blur/unmarked_blurred.png) | ![](assets/anki_blur/marked_blurred.png) |

=== "Always Revealed"

    | Not Marked | Marked (with `NSFW` tag) |
    |:-:|:-:|
    | {{ img("", "assets/anki_blur/unmarked_revealed.png") }} | {{ img("", "assets/anki_blur/marked_revealed.png") }} |


??? example "Demos *(click here)*"

    === "Regular, unmarked card"
        {{ img("", "assets/anki_blur/example_session_toggle_unmarked.gif") }}

    === "Card marked as NSFW"
        {{ img("", "assets/anki_blur/example_session_toggle_marked.gif") }}

    !!! note
        Both examples have the info circle toggled (clicked), so the tooltip persists.


## Additional Details

- The eyeball to toggle the blur between an image will not be shown unless the card is marked as NSFW
    (or the review session state is "Always Blurred").
- Clicking on the blurred image will do nothing; you must click on the eye to un-blur the image.
    Forcing the user to click in a smaller area makes accidental reveals less common.
- After revealing the image, you can click on the image to zoom, as normal.
    You cannot click on a blurred image to zoom.
- Most things can be changed in the runtime options,
    including what tags can be used, the default initial state on PC/mobile, etc.
- This was heavily inspired by
    [Marv's implementation](https://github.com/MarvNC/JP-Resources#anki-card-blur)
    of the same feature.

---



# Conclusion
Outside of the user interface, the note has plenty of fields you can use
to further modify the card. Head over to the [Usage](usage.md) page to see just that.


