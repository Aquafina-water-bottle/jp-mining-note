TODO intro

# UI Summary

important things to notice:
- tested content (front side of the card) is always above the line
- frequencies exist at the top right corner
    - shows FreqSort by default, dropdown shows all other frequencies
- info circle at the top left shows a bunch of random info,
    including any warnings and errors (acts like a notification system)

<br>

## Mobile UI Summary

(image)

- mostly the same as the standard desktop design, except:
    - the definition is placed above the sentence and image,
        in order to prioritize the definition (prevents scrolling down)
    - switching between definitions is done through the `<`, `>` and `menu` buttons

TODO (move this to setup actually)

- android:
    - may have to uncomment @import statement
    - may have to adjust pitch accent for their device:
        ```
        .android {
          --pa-overline-height-above-text: 0.2em;
        }
        ```

---


- Quickstart (page after setup: for the most important things of the card!)
    - base ui summary
        - reminder that themes exist!
        - include info circle stuff here!
            - tags, normal/warning/error/leech
        - section for mobile
    - common changes
        - plain definitions
        - adjusting zoom & font sizes
        - display language
    - important field summary
        - AltDisplay (and variants)
        - IsSentenceCard (and variants)
        - PrimaryDefinition
        - AdditionalNotes
        - Key
    - keybinds
    - cross-note tools:
        - kanji hover
        - word indicators
    - images:
        - blurring images
        - primary definition image
    - pitch accent:
        - customizing pitch accent with numbers
        - pitch accent coloring
    - selected text
        - warning on jmdict!
        - maybe move this to a separate page?
