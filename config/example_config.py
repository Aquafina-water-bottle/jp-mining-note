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

    "compile-options": {
        # toggles whether keybinds can be used or not
        "keybinds-enabled": True,

        # toggles whether the runtime options should be read from a file or not.
        "hardcoded-runtime-options": False,

        "always-filled-fields": [],

        "never-filled-fields": [],


        # Option to have custom CSS.
        # The last takes priorty over the first,
        # i.e. the "extra" folder takes priority over base in
        #   `["base", "dictionaries" "extra"]`
        # Don't remove "base" unless you know what you're doing.
        "css-folders": ["base", "dictionaries"],


        # Allows modules that didn't come with the note to be used.
        # Additionally, allows custom re-ordering of modules.
        "allow-user-defined-modules": False,

        "enabled-modules": [
            # HIGHLY RECOMMENDED to have this enabled if you want a nice looking card
            # (unless you are not using images in your cards of course)
            "img-utils",

            "sent-utils",
            "kanji-hover",
            "auto-pitch-accent",
            "customize-open-fields",
        ],
    },
}
