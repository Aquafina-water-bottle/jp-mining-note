import enum

#class Const(enum.Enum):
#    SAME = enum.auto()

FIELDS = {
    "Key": {
        "auto_fill": True,
        "customize": False,
        "setup": "{expression}",
        "anime_cards_import": "front",
    },

    "Word": {
        "auto_fill": True,
        "customize": False,
        "setup": "{expression}",
        "anime_cards_import": "front",
    },

    "WordReading": {
        "auto_fill": True,
        "customize": False,
        "setup": "{furigana-plain}",
        "anime_cards_import": "Reading",
    },

    "PAOverride": {
        "auto_fill": False,
        "customize": False,
    },

    "AJTWordPitch": {
        "auto_fill": True,
        "customize": False,
    },

    "PrimaryDefinition": {
        "auto_fill": True,
        "customize": False,
        "setup": "{jpmn-primary-definition}",
        "anime_cards_import": "Glossary",
    },

    "Sentence": {
        "auto_fill": True,
        "customize": False,
        "setup": "{cloze-prefix}<b>{cloze-body}</b>{cloze-suffix}",
    },

    "SentenceReading": {
        "auto_fill": True,
        "customize": False,
    },

    "AltDisplay": {
        "auto_fill": False,
        "customize": False,
    },

    "AltDisplayPASentenceCard": {
        "auto_fill": False,
        "customize": False,
    },

    "AdditionalNotes": {
        "auto_fill": False,
        "customize": False,
    },

    "IsSentenceCard": {
        "auto_fill": False,
        "customize": True,
    },

    "IsClickCard": {
        "auto_fill": False,
        "customize": True,
        "personal_setup": "1",
    },

    "IsHoverCard": {
        "auto_fill": False,
        "customize": True,
    },

    "IsTargetedSentenceCard": {
        "auto_fill": False,
        "customize": True,
    },

    "PAShowInfo": {
        "auto_fill": False,
        "customize": True,
        "personal_setup": "1",
    },

    "PATestOnlyWord": {
        "auto_fill": False,
        "customize": True,
        "personal_setup": "1",
    },

    "PADoNotTest": {
        "auto_fill": False,
        "customize": True,
    },

    "PASeparateWordCard": {
        "auto_fill": False,
        "customize": True,
    },

    "PASeparateSentenceCard": {
        "auto_fill": False,
        "customize": True,
    },

    "SeparateClozeDeletionCard": {
        "auto_fill": False,
        "customize": True,
    },

    "Hint": {
        "auto_fill": False,
        "customize": False,
    },

    "HintNotHidden": {
        "auto_fill": False,
        "customize": False,
        "anime_cards_import": "Hint",
    },

    "Picture": {
        "auto_fill": True,
        "customize": False,
        "anime_cards_import": "Picture",
    },

    "WordAudio": {
        "auto_fill": True,
        "customize": False,
        "setup": "{audio}",
        "anime_cards_import": "WordAudio",
    },

    "SentenceAudio": {
        "auto_fill": True,
        "customize": False,
        "anime_cards_import": "SentenceAudio",
    },

    "PAGraphs": {
        "auto_fill": True,
        "customize": False,
        "setup": "{jpmn-pitch-accent-graphs}",
        "anime_cards_import": "Graph",
    },

    "PAPositions": {
        "auto_fill": True,
        "customize": False,
        "setup": "{jpmn-pitch-accent-positions}",
    },

    "PASilence": {
        "auto_fill": True,
        "customize": False,
        "setup": "[sound:_silence.wav]",
    },

    "FrequenciesStylized": {
        "auto_fill": True,
        "customize": False,
        "setup": "{jpmn-frequencies}",
    },

    "FrequencySort": {
        "auto_fill": True,
        "customize": False,
        "setup": "{jpmn-min-freq}",
    },

    "SecondaryDefinition": {
        "auto_fill": True,
        "customize": False,
        "setup": "{jpmn-secondary-definition}",
    },

    "ExtraDefinitions": {
        "auto_fill": True,
        "customize": False,
        "setup": "{jpmn-extra-definitions}",
    },

    "UtilityDictionaries": {
        "auto_fill": True,
        "customize": False,
        "setup": "{jpmn-utility-dictionaries}",
    },

    "Comment": {
        "auto_fill": False,
        "customize": False,
    },

}
