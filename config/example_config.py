"""
Config file used for both build.py and install.py
"""

CONFIG = {
    "sass-path": "sass",

    "jp-mining-note": {

        # rooted under (root)/config
        # I use `user_jpmn_opts.jsonc`
        "opts-path": "jpmn_opts.jsonc",
    },

    "compile-options": {
        "always-filled-fields": [],

        "never-filled-fields": [],

        "enabled-modules": [
            "img-utils",
            "sent-utils",
            "kanji-hover",
            "auto-pitch-accent",
        ],
    },
}
