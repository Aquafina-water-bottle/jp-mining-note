
# Highlight the word within the tooltips
{{ feature_version("0.11.0.0") }}

Within the tooltips, the word is not highlighted by default.
This {{ CSS }} allows the words to be highlighted within the sentence.


=== "Highlighted"
    {{ img("", "assets/uicustomization/tooltip/highlighted.png") }}


=== "Not Highlighted (default)"
    {{ img("", "assets/uicustomization/tooltip/not_highlighted.png") }}


??? example "Instructions *(click here)*"

    1. Under `extra/style.scss`, add the following code:

        ```css
        .hover-tooltip .hover-tooltip__sent-div b {
          font-weight: bold;
          color: var(--accent);
        }
        ```

---


