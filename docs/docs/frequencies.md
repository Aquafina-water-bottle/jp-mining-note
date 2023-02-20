TODO update this section entirely!


# Limiting number of frequencies
This {{ CSS }} allows you to limit the number of frequencies shown at the top right corner.

??? example "Instructions *(click here)*"
    1. Under `extra/style.scss`, add the following code:

        ```css
        /* max 5 frequencies shown */
        .frequencies div.frequencies__group:nth-child(n+6) {
          display: none;
        }
        ```

    2. (Optional) Under `extra/field.scss`, add the following code:

        ```css
        /* max 5 frequencies shown */
        anki-editable[field="FrequenciesStylized"] div.frequencies__group:nth-child(n+6) {
          color: var(--text-color--3);
        }
        ```
        This will grey out the frequencies past the 5th frequency in the editor.


??? example "TODO: ONLY VERSION `0.12.0.0` and over, NOT RELEASED YET"
    By default, a maximum of 4 frequencies are shown.
    Any more frequency list entries will appear in a dropdown arrow
    to the right of the frequencies.

    You can edit the following {{ RTO }} to adjust this number:
    ```json
    {
      "modules": {
        "freq-utils": {
          "max": 4
        }
      }
    }
    ```

