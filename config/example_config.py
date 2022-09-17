"""
Config file used for both build.py and install.py
"""

CONFIG = {
    # you need dart-sass!
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
            "img-utils", # HIGHLY RECOMMENDED to have this enabled (if you want a nice looking card)
            "sent-utils",
            "kanji-hover",
            "auto-pitch-accent",
            "open_on_new",
        ],
    },
}
