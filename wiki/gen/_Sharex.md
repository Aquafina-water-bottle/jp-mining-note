{% import "sharex_input.ps1" as sharex %}
{% from "macros.html" import sharex_display with context %}



# f1: screenshot and clipboard
- adds the image to the note
- adds a tag to the note (tag is exactly the window name of the current application)
- adds the clipboard to AdditionalNotes (I use this for copying/pasting context)

{{ sharex_display(sharex.screenshot_and_clipboard) }}

# shift+f1: screenshot (only)
- the above without clipboard (adds image and tag)

{{ sharex_display(sharex.screenshot) }}

# f2: audio
- adds audio to anki

{{ sharex_display(sharex.audio) }}

# shift+f3: update sentence
- update the sentence without losing the bold (python script + clipboard)
- remove sentence reading
- good for when the sentence just doesn't match

{{ sharex_display(sharex.update_sentence) }}

# ctrl+f3 - copy from previous:
- set additional notes and picture to previous card
- also copy all tags
- good for adding more than 1 sentence with the same text box

{{ sharex_display(sharex.copy_from_previous) }}

# ctrl+shift+f2: fix sentence and freq
- update the previous note with the current's frequency, sentence & sentence reading
- remove current note !
- good for the orthographic dict!

{{ sharex_display(sharex.fix_sent_and_freq) }}
