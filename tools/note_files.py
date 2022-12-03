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

    "id": "jp-mining-note",
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
    #"scss-files": [
    #    "style.scss"
    #    "editor.scss"
    #    "field.scss"
    #],
    "build": [
        # - read from (root)/templates
        # - written to (root)/(build folder)
        # - release mode copies to (root)
        # - input-dir of "build" roots input dir to (root)/(build folder)
        #   instead of the default (root)/templates

        #{
        #    "input-file": "scss/field.scss",
        #    "output-file": "_field.css",
        #    "type": "scss",
        #},

        {
            "input-file": "scss",
            "output-file": "tmp/scss",
            "type": "copy",
            "to-release": False,
        },

        {
            "input-file": "scss/style.scss",
            "output-file": "tmp/scss/style.scss",
            "type": "jinja",
            "to-release": False,
        },
        {
            "input-file": "tmp/scss/style.scss",
            "output-file": "jp-mining-note/style.css",
            "type": "scss",
            "input-dir": "build",
        },

        {
            "input-file": "scss/field.scss",
            "output-file": "tmp/scss/field.scss",
            "type": "jinja",
            "to-release": False,
        },
        {
            "input-file": "tmp/scss/field.scss",
            "output-file": "media/_field.css",
            "type": "scss",
            "input-dir": "build",
        },

        {
            "input-file": "scss/editor.scss",
            "output-file": "tmp/scss/editor.scss",
            "type": "jinja",
            "to-release": False,
        },
        {
            "input-file": "tmp/scss/editor.scss",
            "output-file": "media/_editor.css",
            "type": "scss",
            "input-dir": "build",
        },

        {
            "input-file": "jp-mining-note/_jpmn-options.js",
            "output-file": "media/_jpmn-options.js",
            "type": "jinja",
        },

        #{
        #    "input-file": "jp-mining-note/_jpmn-options.js",
        #    "output-file": "tmp/media/_jpmn-options.js",
        #    "type": "jinja",
        #},

        #{
        #    "input-file": "tmp/media/_jpmn-options.js",
        #    "output-file": "media/_jpmn-options.js",
        #    "type": "OPTIONS",
        #    "input-dir": "build",
        #},

    ],
    "media-install": {
        "static": [
            # assumption: these don't have to be built from media-build
            "_silence.wav",
            # "GenEiKoburiMin6-R.ttf",
            "NotoSansJP-Regular.otf",
            "NotoSansJP-Bold.otf",
            "NotoSerifJP-Regular.otf",
            "NotoSerifJP-Bold.otf",

            # TODO install folder
            "_icon_jpdb_darkmode.png",
            "_icon_jpdb_lightmode.png",
            "_icon_jisho_darkmode.png",
            "_icon_jisho_lightmode.png",
            "_icon_image_black.svg",
            "_icon_image_white.svg",
        ],
        "dynamic": [
            "_editor.css",
            "_field.css",
        ],
        "options": [
            "_jpmn-options.js",
        ],
    },
}
