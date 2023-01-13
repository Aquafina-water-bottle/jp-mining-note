from __future__ import annotations

from dataclasses import dataclass, field
import batch

import action


class Version:
    # ints: tuple[int, int, int, int]

    def __init__(self, *args):
        assert len(args) == 4
        self.ints = tuple(args)

    @classmethod
    def from_str(cls, str_ver):
        assert str_ver.count(".") == 3
        assert str_ver.replace(".", "").isdigit()
        ints = tuple(int(i) for i in str_ver.split("."))
        return cls(*ints)

    def cmp(self, other):
        """
        returns:
        -1 if self < other
        1  if self > other
        0  if self == other
        """
        assert isinstance(other, Version), other

        for i, j in zip(self.ints, other.ints):
            if i < j:
                return -1
            if i > j:
                return 1

        return 0

    def __eq__(self, other):
        return self.cmp(other) == 0

    def __lt__(self, other):
        return self.cmp(other) == -1

    def __le__(self, other):
        return self < other or self == other

    def __ne__(self, other):
        return not (self == other)

    def __gt__(self, other):
        return not (self <= other)

    def __ge__(self, other):
        return not (self < other)

    def __repr__(self):
        return f"Version({', '.join(str(x) for x in self.ints)})"

    def __str__(self):
        return f"({'.'.join(str(x) for x in self.ints)})"


@dataclass
class NoteChange:
    version: Version
    actions: list[action.Action]
    fields: list[str]
    option_actions: list[action.OptAction] = field(init=False)


NOTE_CHANGES = [

    NoteChange(
        version=Version(0, 12, 0, 0),
        actions=[
            action.AddField("YomichanWordTags", 35 - 1),
            action.AddField("IsHintCard", 18 - 1),
            action.AddField("AltDisplayClozeDeletionCard", 13 - 1),
            action.MoveField("IsTargetedSentenceCard", 16 - 1),
            action.MoveField("Hint", 15 - 1),
            action.MoveField("HintNotHidden", 16 - 1),
            action.MoveField("FrequenciesStylized", 33 - 1),
            action.MoveField("FrequencySort", 34 - 1),

            # webpack branch
            # TODO verify changes
            action.RenameField("SeparateClozeDeletionCard", "SeparateAudioCard"),
            action.RenameField("AltDisplayClozeDeletionCard", "AltDisplayAudioCard"),
            action.AddField("SeparateSentenceAudioCard", 28-1),
            action.AddField("IsAudioCard", 21-1),
            action.AddField("IsSentenceFirstCard", 21-1),

            # affects all previously added fields
            # currently commented out because it's not supported in ankiconnect yet
            #action.ChangeFieldFontSize("WordReadingHiragana", 10),
            #action.ChangeFieldFontSize("PrimaryDefinitionPicture", 20), # default
            #action.ChangeFieldFontSize("PAOverrideText", 20), # default
            #action.ChangeFieldFontSize("YomichanWordTags", 10),
            #action.ChangeFieldFontSize("IsHintCard", 10),
            #action.ChangeFieldFontSize("IsAudioCard", 10),
            #action.ChangeFieldFontSize("SeparateSentenceAudioCard", 10),

            action.YomichanTemplatesChange(),
            action.YomichanFormatChange(
                "YomichanWordTags", "(empty)", "{tags}"
            ),
            action.NoteToUser(
                description="If you are using Anki version 2.1.49 or below, please see the link below:\n"
                "https://aquafina-water-bottle.github.io/jp-mining-note/faq/#the-frequency-list-display-looks-squished"
            ),
        ],
        fields=[
            "Key",
            "Word",
            "WordReading",
            "PAOverride",
            "PAOverrideText",
            "AJTWordPitch",
            "PrimaryDefinition",
            "PrimaryDefinitionPicture",
            "Sentence",
            "SentenceReading",
            "AltDisplay",
            "AltDisplayPASentenceCard",
            "AltDisplayAudioCard",
            "AdditionalNotes",
            "Hint",
            "HintNotHidden",
            "IsSentenceCard",
            "IsTargetedSentenceCard",
            "IsClickCard",
            "IsHoverCard",
            "IsHintCard",
            "IsSentenceFirstCard",
            "IsAudioCard",
            "PAShowInfo",
            "PATestOnlyWord",
            "PADoNotTest",
            "PASeparateWordCard",
            "PASeparateSentenceCard",
            "SeparateAudioCard",
            "SeparateSentenceAudioCard",
            "Picture",
            "WordAudio",
            "SentenceAudio",
            "PAGraphs",
            "PAPositions",
            "FrequenciesStylized",
            "FrequencySort",
            "PASilence",
            "WordReadingHiragana",
            "YomichanWordTags",
            "SecondaryDefinition",
            "ExtraDefinitions",
            "UtilityDictionaries",
            "Comment",
        ],
    ),


    NoteChange(
        version=Version(0, 11, 0, 0),
        actions=[
            action.AddField("WordReadingHiragana", 30 - 1),
            action.AddField("PrimaryDefinitionPicture", 7 - 1),
            action.AddField("PAOverrideText", 5 - 1),
            action.BatchUpdate(
                batch_func=batch.fill_word_reading_hiragana_field,
                ankiconnect_actions={
                    "findNotes",
                    "notesInfo",
                    "multi",
                    "updateNoteFields",
                },
                description="Automatically fills the `WordReadingHiragana` field",
            ),
            action.BatchUpdate(
                batch_func=batch.separate_pa_override_field,
                ankiconnect_actions={
                    "findNotes",
                    "notesInfo",
                    "multi",
                    "updateNoteFields",
                },
                description="Separates the `PAOverride` field to `PAOverride` and `PAOverrideText` "
                "as appropriate",
            ),
            action.YomichanTemplatesChange(),
            action.YomichanFormatChange(
                "WordReadingHiragana", "(empty)", "{jpmn-word-reading-hiragana}"
            ),
            action.NoteToUser(
                description="If you are using the nsfw-toggle function, the option name was changed\n"
                "from `nsfw-toggle` to `image-blur`. Please change it in your runtime options\n"
                "to continue using it.\n"
                "See: https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/media/_jpmn-options.js"
            ),
            action.NoteToUser(
                description="The way keybinds are specified has been changed (to allow keys to still function\n"
                "as expected even with CapsLock enabled.)\n"
                "Keybinds will no longer work until you update the runtime options.\n"
                "For example, update `n` to `KeyN`.\n"
            ),
            action.NoteToUser("Update Notes Permalink: https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/CHANGELOG.md#update-notes-01100"),
        ],
        fields=[
            "Key",
            "Word",
            "WordReading",
            "PAOverride",
            "PAOverrideText",
            "AJTWordPitch",
            "PrimaryDefinition",
            "PrimaryDefinitionPicture",
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
            "PAPositions",
            "PASilence",
            "WordReadingHiragana",
            "FrequenciesStylized",
            "FrequencySort",
            "SecondaryDefinition",
            "ExtraDefinitions",
            "UtilityDictionaries",
            "Comment",
        ],
    ),


    NoteChange(
        version=Version(0, 10, 2, 0),
        actions=[
            action.YomichanTemplatesChange(),
            action.BatchUpdate(
                batch_func=batch.standardize_frequencies_styling,
                ankiconnect_actions={
                    "findNotes",
                    "notesInfo",
                    "multi",
                    "updateNoteFields",
                },
                description="Updates the FrequenciesStylized field to match the styling "
                "of all the other stylized Yomichan fields (PAGraphs, PAPositions)",
            ),
            action.NoteToUser(
                description="If you are using CSS Injector, a new file `editor.css` must be added.\n"
                "See: https://aquafina-water-bottle.github.io/jp-mining-note/setup/#css-injector"
            ),
        ],
        fields=[
            "Key",
            "Word",
            "WordReading",
            "PAOverride",
            "AJTWordPitch",
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
            "PAPositions",
            "PASilence",
            "FrequenciesStylized",
            "FrequencySort",
            "SecondaryDefinition",
            "ExtraDefinitions",
            "UtilityDictionaries",
            "Comment",
        ],
    ),

    NoteChange(
        version=Version(0, 10, 0, 0),
        actions=[
            action.RenameField("WordPitch", "AJTWordPitch"),
            action.AddField("PAOverride", 4 - 1),
            action.AddField("PAPositions", 28 - 1),
            action.MoveField("AJTWordPitch", 5 - 1),
            action.YomichanTemplatesChange(),
            action.YomichanFormatChange(
                "PAPositions", "(empty)", "{jpmn-pitch-accent-positions}"
            ),
        ],
        fields=[
            "Key",
            "Word",
            "WordReading",
            "PAOverride",
            "AJTWordPitch",
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
            "PAPositions",
            "PASilence",
            "FrequenciesStylized",
            "FrequencySort",
            "SecondaryDefinition",
            "ExtraDefinitions",
            "UtilityDictionaries",
            "Comment",
        ],
    ),

    NoteChange(
        version=Version(0, 9, 1, 0),
        actions=[
            action.MoveField("PAShowInfo", 15 - 1),
            action.MoveField("PASeparateWordCard", 19 - 1),
            action.MoveField("PASeparateSentenceCard", 19 - 1),
            action.AddField("FrequencySort", 29 - 1),
            action.YomichanTemplatesChange(),
            action.YomichanFormatChange("FrequencySort", "(empty)", "{jpmn-min-freq}"),
        ],
        fields=[
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
    ),

    NoteChange(
        version=Version(0, 9, 0, 0),
        actions=[
            action.BatchUpdate(
                batch_func=batch.add_downstep_inner_span_tag,
                ankiconnect_actions={
                    "findNotes",
                    "notesInfo",
                    "multi",
                    "updateNoteFields",
                },
                description="Updates the WordPitch field to work with the new AJT Pitch "
                "Accent config settings",
            ),
            action.SetField("PASilence", "[sound:_silence.wav]"),
            action.AJTPitchAccentConfigChange(
                "update the 'styles' -> '&#42780;' field"
            ),
            action.YomichanTemplatesChange(),
            action.YomichanFormatChange(
                "PASilence", "[sound:silence.wav]", "[sound:_silence.wav]"
            ),
        ],
        fields=[  # same as below
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
    ),

    NoteChange(
        version=Version(0, 0, 0, 0),
        actions=[],
        fields=[
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
    ),
]
