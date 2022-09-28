"""
Config file used for both build.py and install.py
"""

CONFIG = {
    # you need dart-sass!
    "sass-path": "sass",

    # rooted under (root)/config
    # I use `user_jpmn_opts.jsonc`
    "opts-path": "jpmn_opts.jsonc",

    # rooted under (root)
    # ignores folder if it doesn't exist
    "templates-override-folder": "overrides",

    # Option to have custom CSS.
    # The last takes priorty over the first,
    # i.e. the "extra" folder takes priority over default in `["default", "extra"]`.
    # Don't remove "default" unless you know what you're doing.
    "css-folders": ["default", "dictionaries"],

    # Option to have custom javascript.
    "extra-javascript": [],

    "compile-options": {
        "keybinds-enabled": True,

        "always-filled-fields": [],

        "never-filled-fields": [],

        "enabled-modules": [
            # HIGHLY RECOMMENDED to have this enabled if you want a nice looking card
            # (unless you are not using images in your cards of course)
            "img-utils",

            "sent-utils",
            "kanji-hover",
            "auto-pitch-accent",
            "open_on_new",
        ],
    },
}
