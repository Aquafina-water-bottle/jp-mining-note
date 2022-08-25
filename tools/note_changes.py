import action
from action_runner import Version

CONFIG_CHANGES = {
    Version(0, 9, 0, 0): {
        "actions": [
            action.MoveField("PAShowInfo", 15),
            action.MoveField("PASeparateWordCard", 19),
            action.MoveField("PASeparateSentenceCard", 19),
            action.AddField("FrequencySort", 29),
            action.AJTPitchAccentconfigChange(),
        ],
        "fields_check": [
            "Key",
            "Word",
            "WordReading",
            "WordPitch",
            "PrimaryDefinition",
            "Sentence",
            "SentenceReading",
            "AltDisplay",
            "AltDisplayPASentenceCard",
            "AdditionalNotes",
            "IsSentenceCard",
            "IsClickCard",
            "IsHoverCard",
            "IsTargetedSentenceCard",
            "PAShowInfo",
            "PATestOnlyWord",
            "PADoNotTest",
            "PASeparateWordCard",
            "PASeparateSentenceCard",
            "SeparateClozeDeletionCard",
            "Hint",
            "HintNotHidden",
            "Picture",
            "WordAudio",
            "SentenceAudio",
            "PAGraphs",
            "PASilence",
            "FrequenciesStylized",
            "FrequencySort",
            "SecondaryDefinition",
            "ExtraDefinitions",
            "UtilityDictionaries",
            "Comment",
        ],
    },
    Version(0, 8, 1, 0): {
        "fields_check": [
            "Key",
            "Word",
            "WordReading",
            "WordPitch",
            "PrimaryDefinition",
            "Sentence",
            "SentenceReading",
            "AltDisplay",
            "AltDisplayPASentenceCard",
            "AdditionalNotes",
            "IsSentenceCard",
            "IsClickCard",
            "IsHoverCard",
            "IsTargetedSentenceCard",
            "PASeparateWordCard",
            "PASeparateSentenceCard",
            "PAShowInfo",
            "PATestOnlyWord",
            "PADoNotTest",
            "SeparateClozeDeletionCard",
            "Hint",
            "HintNotHidden",
            "Picture",
            "WordAudio",
            "SentenceAudio",
            "PAGraphs",
            "PASilence",
            "FrequenciesStylized",
            "SecondaryDefinition",
            "ExtraDefinitions",
            "UtilityDictionaries",
            "Comment",
        ],
    },
}








