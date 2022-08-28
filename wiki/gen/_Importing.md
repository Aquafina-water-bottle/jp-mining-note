# Importing Anki Cards

- see reference for general info on what fields are what

- right click cards (ctrl+a to select all)
- notes -> change note type

general notes:
- assuming your card does not have a separate key and word field,
  key and word should be the same
- keep WordPitch empty, unless you already have a field with AJT
  pitch accent generated
- keep SentenceReading empty, unless you already have a field
  with furigana generated


example with animecards:
| jp-mining-note | Anime Card |
|------|-----|
{% for f, v in FIELDS.items() -%}
| {{ f }} | {{ "`" + v["anime_cards_import"] + "`" if "anime_cards_import" in v else "" }} |
{% endfor %}


(anything not specified will be set to `(Nothing)`



afterwards:
- select all jp-mining-note notes
- edit -> bulk add pitch accents
- edit -> bulk add furigana
- TODO mass edit PASilence

notes:
- frequency info cannot be easily auto-generated (lmk if you know how to)
- 
