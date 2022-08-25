"""
specifies the date for each note type, primarily the names, file locations,
and how to build/install each one.

Although in a style of a config file, you likely aren't going to change this.
"""

NOTE_DATA = {
    # - read from (root)/templates/(note name)
    # - written to (root)/(build folder)/(note name)
    # - css is read from (root)/templates/scss/(note name).scss
    # - release mode copes to (root)/(note name) folder
    "jp-mining-note": {
        # list of note types to install
        "model-name": "JP Mining Note",
        "templates": {
            "main": {
                "name": "Mining Card",
            },
            "pa_sent": {
                "name": "PA Sentence Card",
            },
            "pa_word": {
                "name": "PA Word Card",
            },
            "cloze_deletion": {
                "name": "Cloze Deletion Card",
            },
        },
        "media-build": [
            # - read from (root)/templates
            # - written to (root)/(build folder)/media
            # - release mode copies to (root)/media
            {
                "input-file": "scss/field.scss",
                "output-file": "field.css",
                "type": "scss",
            },
            {
                "input-file": "jp-mining-note/_jpmn-options.js",
                "output-file": "_jpmn-options.js",
                "type": "jinja",
            },
        ],
        "media-install": {
            "static": [
                "_silence.wav",
                # "GenEiKoburiMin6-R.ttf",
                "NotoSansJP-Regular.otf",
                "NotoSansJP-Bold.otf",
                "NotoSerifJP-Regular.otf",
                "NotoSerifJP-Bold.otf",
            ],
            "dynamic": [
                "field.css",
            ],
            "options": [
                "_jpmn-options.js",
            ],
        },
    },
}
