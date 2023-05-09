
This page is dedicated to showcasing
how images can be displayed and interacted with.



# Main Image
The main image (shown to the right of the word box)
is exactly the contents of the `Picture` field.
As you likely already know, this image can be clicked to zoom in.

(TODO gif)


This display of the picture automatically adjusts for any aspect ratio.
For the best looking cards, it is recommended that you use images with
aspect ratios between 16:9 (landscape) to 1:1 (square).


(TODO screenshots)


!!! note
    Instead of a picture, it is possible to use text within the `Picture` field.
    This is useful if you forgot to add the picture
    (or didn't want to add it in the first place),
    and would like to describe the scene in words.

    Do not use more than one picture, or combine pictures and text within the `Picture` field.
    If you have an image and would like to add text,
    add the text in the `PrimaryDefinition` or `AdditionalNotes` field.
    If you want to add more than one image, add the remaining images under
    `PrimaryDefinitionPicture` or `PrimaryDefinition`.

---


# Automatically Add Images Using Tags

{{ feature_version("0.11.0.0") }}

One can automatically add a specific image if a card contains
a specific tag.

This is particularily useful for cards made from written media, such as books.
One can save an image of the cover (in the media folder), and add
the appropriate tag to all of the cards
to automatically set the image to the cover of the book.

This is specified under the {{ RTO_FILE }}:

```json
"imgStylizer.setMainImageFromTags": [],
```

Example:

```json
"imgStylizer.setMainImageFromTags": [
  {
    "tag": "青春ブタ野郎・LN1",
    "file-name": "_青春ブタ野郎-LN1.png"
  }
],
```

TODO example gif

---




# Collapsed Images

Any customly inserted images, including images inserted directly by Yomichan,
will be converted to text which you have to hover over to reveal.
Of course, this image can also be clicked on to zoom.
See the video demo below to see exactly what happens.

![type:video](assets/images/collapsed_images.mp4)

## How to Disable Collapsed Images

There are several ways of disabling collapsed images.

1. Place your images in the `PrimaryDefinitionPicture` field, as shown in the [section below](images.md#the-primarydefinitionpicture-field).

1. Disable it globally in the {{ RTO_FILE }}:

    ```json
    // alternatively, try "none" instead of "float".
    "imgStylizer.glossary.primaryDef.mode.yomichan": "float",
    ```

1. Disable it per card, by adding the following tag: `img-yomichan-float`.
    Alternatively, try adding `img-yomichan-no-styling`.


1. To disable this for only specific images,
    [edit the HTML](faq.md#how-do-i-edit-the-fields-raw-html)
    of the desired field, and add `data-do-not-convert="true"`.

    For example:
    ```html
    <img src="your_image.png" data-do-not-convert="true">
    ```

---


# The `PrimaryDefinitionPicture` Field
{{ feature_version("0.11.0.0") }}

This field can be used to place images in the Primary Definition section without collapsing the image.
Large images are automatically resized to fit the area.

This is useful if one wants to put images in place of, or to suppliment definitions.
For example, using images for words such as "frog" or "chair" is much easier to understand
compared to using the monolingual definition.

=== "Right of the definition (Default)"
    <figure markdown>
      {{ img("Primary Definition Picture (right)", "assets/images/primarydefinitionpicture/right_of_def.png") }}
      <figcaption>
        <span style="font-style: normal">(突っ伏す)</span>
        Usually, the image is placed to the right (like on Wikipedia).
      </figcaption>
    </figure>

=== "No Definition"
    <figure markdown>
      {{ img("Primary Definition Picture (no definition)", "assets/images/primarydefinitionpicture/no_def.png") }}
      <figcaption>
        <span style="font-style: normal">(雑巾)</span>
        Naturally, the picture appears to the left if there is no definition.
        As of version `0.12.0.0`, the size of the picture will also be slightly increased.
      </figcaption>
    </figure>


=== "Below the definition"
    <figure markdown>
      {{ img("Primary Definition Picture (bottom)", "assets/images/primarydefinitionpicture/below_def.png") }}
      <figcaption>
        <span style="font-style: normal">(雑巾)</span>
        The image is below the definition if the
        [appropriate options](#changing-automatic-positioning-behavior)
        are set.
      </figcaption>
    </figure>

=== "Above the definition"
    <figure markdown>
      {{ img("Primary Definition Picture (above)", "assets/images/primarydefinitionpicture/above_def.png") }}
      <figcaption>
        <span style="font-style: normal">(雑巾)</span>
        The image is above the definition if the
        [appropriate options](#changing-automatic-positioning-behavior)
        are set.
      </figcaption>
    </figure>



!!! note
    Although not recommended, the `PrimaryDefinitionPicture`
    does not need to contain pictures.
    For example, one can add text, tables, or links to the field.


## Changing Automatic Positioning Behavior
{{ feature_version("0.12.0.0") }}

The following {{ RTO }} can be used to change how the primary definition picture is positioned:

```json
// Valid options (case sensitive): "auto", "bottom", "right", "top"
"imgStylizer.glossary.floatImg.position": "auto",
```
The options `bottom`, `right`, and `top` force the image to always be placed
below, to the right, and above the definition, respectively.

`auto` is the default behavior, and will automatically position the picture
to the left if there is no text. Otherwise, the image is placed to the right.



## Force Positioning

The automatic repositioning as described above may not be perfect.
Fortunately, there are ways to force the position of this image,
by adding any of the following tags to the card:

* `img-right` forces the image to be to the right.
* `img-bottom` forces the image to be below the text.
* `img-top` forces the image to be above the text.

---


# Image Blur
{{ feature_version("0.10.3.0") }}

Images on cards can be automatically blurred by marking it with a NSFW tag.
To mark a card as NSFW, add any of the following tags to the card:

> `nsfw`・`NSFW`・`-NSFW`

This behavior is **disabled by default**. In other words, you will not be able to blur
images unless the following setting is explicitly enabled
in the {{ RTO_FILE }}:

```json
"imgStylizer.mainImage.blur.enabled": true, // (1)!
```

1.  The `imgStylizer` module must be enabled to use the image blur feature.
    For example:
    ```json
    "imgStylizer.enabled": true,
    ```
    This is enabled by default, so you likely don't need to manually enable this module.

<figure markdown>
  {{ img("example toggle blur gif", "assets/images/anki_blur/example.gif") }}
</figure>



!!! note
    Recall that you can use custom text in the `Picture` field instead of having an actual picture.
    This is useful if you simply don't want to save a particular image.


## Change Review Session State
The above demo shows how you can un-blur an image temporarily.
This means that if you see that card again during the same review session,
the image will be blurred again.

This state can be changed for a review session.
To toggle between review-session states, hover over the info circle,
and click on the eyeball to the top left.
This state will be maintained for the entire review session, but will be lost on the next session.

The tabs below show the available states.
By default, states cycle from left to right.


=== "Only Blur if NSFW"

    | Not Marked | Marked (with `NSFW` tag) |
    |:-:|:-:|
    | {{ img("", "assets/images/anki_blur/unmarked_revealed.png") }} | ![](assets/images/anki_blur/marked_blurred.png) |

=== "Always Blurred"

    | Not Marked | Marked (with `NSFW` tag) |
    |:-:|:-:|
    | ![](assets/images/anki_blur/unmarked_blurred.png) | ![](assets/images/anki_blur/marked_blurred.png) |

=== "Always Revealed"

    | Not Marked | Marked (with `NSFW` tag) |
    |:-:|:-:|
    | {{ img("", "assets/images/anki_blur/unmarked_revealed.png") }} | {{ img("", "assets/images/anki_blur/marked_revealed.png") }} |


??? example "Demos <small>(click here)</small>"

    === "Regular, unmarked card"
        {{ img("", "assets/images/anki_blur/example_session_toggle_unmarked.gif") }}

    === "Card marked as NSFW"
        {{ img("", "assets/images/anki_blur/example_session_toggle_marked.gif") }}

    !!! note
        Both examples have the info circle toggled (clicked), so the tooltip persists.


## Mobile Usage

- TODO the eye to the top right of the image is not shown to prevent fat finger unblurs
- if you want to unblur, you must change review session state via the info circle as shown above


## Additional Details

- The eyeball to toggle the blur between an image will not be shown unless the card is marked as NSFW
    (or the review session state is "Always Blurred").
- Clicking on the blurred image will do nothing; you must click on the eye to un-blur the image.
    Forcing the user to click in a smaller area makes accidental unblurs less common.
- After revealing the image, you can click on the image to zoom, as normal.
    You cannot click on a blurred image to zoom.
- Most things can be changed in the runtime options,
    including what tags can be used, the default initial state on PC/mobile, etc.
- This was heavily inspired by
    [Marv's implementation](https://github.com/MarvNC/JP-Resources#anki-card-blur)
    of the same feature.


