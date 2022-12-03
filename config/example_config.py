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

    "translation-file": "src/data/translations.jsonc",

    "compile-options": {
        # toggles whether the runtime options should be read from a file or not.
        "hardcoded-runtime-options": False,

        # forces the behavior of the cards to act
        # as if the field is filled or not filled
        "always-filled-fields": [],
        "never-filled-fields": [],

        # Where the external links are placed
        # Available options: "Primary Definition", "Extra Info"
        #"external-links-position": "Primary Definition",
        "external-links-position": "Extra Info",

        # Adds an external links section to the "Extra Info" field.
        # DuckDuckGo bang links are provided as a slightly more future-proof
        # alternative to raw links, as DDG bangs can be updated by the community
        # if/when old links break.
        "external-links": {
            # Example external link that uses an image: one for light mode, and one for dark mode
            # If you want to use one image for both themes, just use the same file twice.
            # NOTE: If you are using custom images, remember to copy/paste them into your media folder
            #  for them to show!
            "jpdb.io": {
                "icon-type": "image",
                "icon-image-light": "_icon_jpdb_lightmode.png",
                "icon-image-dark":  "_icon_jpdb_darkmode.png",
                "url": "https://jpdb.io/search?q={{text:Word}}",
            },

            "jisho.org": {
                "icon-type": "image",
                "icon-image-light": "_icon_jisho_lightmode.png",
                "icon-image-dark":  "_icon_jisho_darkmode.png",
                "url": "https://jisho.org/search/{{text:Word}}",
                #"url": "https://duckduckgo.com/?t=ffab&q=%21jisho+{{text:Word}}",
            },

            "image_search": {
                "icon-type": "image",
                "icon-image-light": "_icon_image_black.svg",
                "icon-image-dark":  "_icon_image_white.svg",
                "url": "https://www.google.co.jp/search?q={{text:Word}}&tbm=isch",
                # regular search on google.com
                #"url": "https://www.google.com/search?q={{text:Word}}&tbm=isch",
                #"url": "https://duckduckgo.com/?t=ffab&q=%21gi+{{text:Word}}",
                "hover-display": "google.co.jp (Image search)",
            },

            # Example external link that uses text instead of an image.
            # Notice that that icon-type is "text" instead of "image".
            #"yourei.jp": {
            #    "icon-type": "text",
            #    "icon-text": "用",
            #    "url": "http://yourei.jp/{{text:Word}}",
            #    #"url": "https://duckduckgo.com/?t=ffab&q=%21yourei+{{text:Word}}",
            #    #"hover-display": "用例",
            #},

            #"fuseji.net": {
            #    "icon-type": "text",
            #    "icon-text": "伏",
            #    "url": "http://fuseji.net/{{text:Word}}",
            #    #"hover-display": "伏せ字",
            #},

            #"zokugo-dict.com": {
            #    "icon-type": "text",
            #    "icon-text": "俗",
            #    "url": "http://search.zokugo-dict.com/search.cgi?charset=utf&q={{text:Word}}",
            #    #"hover-display": "日本語俗語辞書",
            #},

            #"sakura-paris.org/dict": {
            #    "icon-type": "text",
            #    "icon-text": "広辞苑",
            #    "url": "https://sakura-paris.org/dict/%E5%BA%83%E8%BE%9E%E8%8B%91/prefix/{{text:Word}}",
            #    #"hover-display": "広辞苑無料検索",
            #},

            #"kotobank.jp": {
            #    "icon-type": "text",
            #    "icon-text": "コ",
            #    "url": "https://kotobank.jp/gs/?q={{text:Word}}",
            #    #"url": "https://duckduckgo.com/?t=ffab&q=%21kotobank+{{text:Word}}",
            #    #"hover-display": "コトバンク",
            #},
        },


        # Option to have custom CSS.
        # The last takes priorty over the first,
        # i.e. the "extra" folder takes priority over base in
        #   `["base", "responsive", "dictionaries" "extra"]`
        # Don't remove "base" unless you know what you're doing.
        "css-folders": ["base", "responsive", "dictionaries"],


        # Allows modules that didn't come with the note to be used.
        # Additionally, allows custom re-ordering of modules.
        # WARNING: if you are using other people's modules,
        #  make sure you only run modules from people you trust!
        # WARNING: You now have the ability to reorder the module execution.
        #  Do not re-order the default modules, unless you know what you are doing!
        "allow-user-defined-modules": False,

        "enabled-modules": [
            # This is a debugging tool, so this is disabled by default.
            #"time-performance",

            # toggles whether keybinds can be used or not
            "keybinds",

            "auto-pitch-accent",

            # HIGHLY RECOMMENDED to have this enabled if you want a nice looking card
            # (unless you are not using images in your cards whatsoever.)
            # If you do not want to use `img-utils`, at least use `img-utils-minimal`.
            "img-utils",
            #"img-utils-minimal",

            "sent-utils",
            "auto-highlight-word",

            "kanji-hover",
            "collapsible-fields-utils",
            "word-indicators",

            "info-circle-utils",
            "freq-utils",
            "fix-ruby-positioning",
            "check-duplicate-key",
        ],

        "breakpoints": {
            "display-sentence-shrink": 1600,
            "display-sentence-remove-newlines": 1300,
            "max-width-backside": 850,
            "combine-picture": 620,
        },

        # This is a hack to allow the user to triple-click the definition and copy
        # without selecting everything below the line.
        # - This seems to ONLY affect the texthooker page;
        #   regular copy/pastes through everything I tried
        #   (pyperclip, text editor paste, pasting into Anki, etc)
        #   does not suffer from this problem.
        # - This hack is NO LONGER NEEDED with the newer clipboard inserter plugin found here:
        #   https://github.com/laplus-sadness/lap-clipboard-inserter
        #     - This option is enabled by default just in case, as it doesn't seem to cause any problems.
        "clipboard-inserter-0px-hack-enabled": True,


        # Allows the user to customize the displayed words on the card,
        # while specifying fallback languages if the language doesn't have the key/pair value.
        # Currently, the following languages are supported:
        # - "en": English
        # - "jp": Japanese
        "display-languages": ["en"],
        #"display-languages": ["jp", "en"],

        # Options to affect how the furigana is display on the full sentence (back side) of the card.
        "full-sentence-ruby": {
            # Specifies when the ruby is displayed
            # - valid options: "hover", "click", "both"
            # - "both" means that both hovering and clicking works, i.e. clicking can
            #   freeze / unfreeze the furigana in place.
            "display-mode": "hover",

            # Specifies how the ruby is displayed
            # valid options: "opacity", "font-size",
            # - "opacity" adds invisible spacing between words
            # - "font-size" adds spacing only when ruby is displayed, which will increase the
            #   height of the ruby, and can cause characters to overflow into the next line
            "fill-mode": "opacity",

            # An option that only affects the note when fill-mode is font size.
            # adds a smooth transition between no furigana and furigana
            "fill-mode-font-size-transition": True,
        },

    },
}
