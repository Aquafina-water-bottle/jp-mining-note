"""
Config file used for both build.py and install.py
"""

CONFIG = {
    # you need dart-sass!
    "sass-path": "sass",

    # A custom options file specified by the user.
    # To use this, copy the existing `config/jpmn_opts.jsonc` into
    #  a different file, say, `config/user_jpmn_opts.jsonc`,
    #  and then set the value to "user_jpmn_opts.jsonc".
    # Rooted under (root)/config.
    "opts-path": "jpmn_opts.jsonc",

    # Rooted under (root)
    # Ignores folder if it doesn't exist.
    "templates-override-folder": "overrides",

    "compile-options": {
        # toggles whether keybinds can be used or not
        "keybinds-enabled": True,

        # toggles whether the runtime options should be read from a file or not.
        "hardcoded-runtime-options": False,


        # Adds an external links section to the "Extra Info" field.
        "external-links": {
            # Thanks to Timm#3250 and his Anki template for the following list of websites:
            # - 伏せ字
            # - 日本語俗語辞書
            # - 広辞苑無料検索
            # - コトバンク

            "jisho.org": "https://jisho.org/search/{{Word}}",

            "jpdb.io": "https://jpdb.io/search?q={{Word}}",

            # 用例
            "yourei.jp":
                "http://yourei.jp/{{Word}}",

            # 伏せ字
            #"fuseji.net":
            #    "http://fuseji.net/{{Word}}",

            # 日本語俗語辞書
            #"zokugo-dict.com":
            #    "http://search.zokugo-dict.com/search.cgi?charset=utf&q={{Word}}",

            # 広辞苑無料検索
            #"sakura-paris.org/dict":
            #    "https://sakura-paris.org/dict/%E5%BA%83%E8%BE%9E%E8%8B%91/prefix/{{Word}}",

            # コトバンク
            #"kotobank.jp":
            #    "https://kotobank.jp/gs/?q={{Word}}",
        },


        # forces the behavior of the cards to act
        # as if the field is filled or not filled
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
        # WARNING: if you are using other people's modules,
        #  make sure you only run modules from people you trust!
        # WARNING: You now have the ability to reorder the module execution.
        #  Do not re-order the default modules, unless you know what you are doing!
        "allow-user-defined-modules": False,

        "enabled-modules": [
            "sent-utils",
            "kanji-hover",
            "auto-pitch-accent",

            # HIGHLY RECOMMENDED to have this enabled if you want a nice looking card
            # (unless you are not using images in your cards of course)
            "img-utils",

            "customize-open-fields",
        ],
    },
}
