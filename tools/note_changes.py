from __future__ import annotations

from dataclasses import dataclass

import os

from typing import Sequence, Optional
from json_handler import JsonHandler
from version import Version
import action
import batch
import utils


@dataclass
class NoteChange:
    version: Version
    actions: list[action.Action]
    post_actions: list[action.Action]
    fields: list[str]

# hard coded for now to prevent arbitrary code injection type things
ACTION_TYPE_TO_OBJECT_CLASS = {
        "BatchUpdate": action.BatchUpdate,
        "NoteToUser": action.NoteToUser,
        "RenameField": action.RenameField,
        "AddField": action.AddField,
        "MoveField": action.MoveField,
        "DeleteField": action.DeleteField,
        "SetField": action.SetField,
        "YomichanTemplatesChange": action.YomichanTemplatesChange,
        "YomichanFormatChange": action.YomichanFormatChange,
}


def parse_actions(actions_data):
    batch_func_str_to_func = {f.__name__: f for f in batch.PUBLIC_FUNCTIONS}

    # actions
    actions = []
    for action_data in actions_data:
        action_type = action_data["type"]
        action_obj_cls = ACTION_TYPE_TO_OBJECT_CLASS[action_type]

        if action_type == "BatchUpdate":
            # override the batch_func parameter with the one in batch.py
            params = action_data["params"]
            params["batch_func"] = batch_func_str_to_func[params["batch_func"]]
            action_obj = action_obj_cls(**params)

        elif "params" in action_data:
            params = action_data["params"]
            if isinstance(params, list):
                action_obj = action_obj_cls(*params)
            else:
                assert isinstance(params, dict)
                action_obj = action_obj_cls(**params)
        else:
            action_obj = action_obj_cls()

        actions.append(action_obj)

    return actions

def get_note_changes(json_handler: utils.JsonHandler, file_path: str | None = None) -> tuple[NoteChange]:
    if file_path is None:
        file_path = os.path.join(utils.get_root_folder(), "data", "note_changes.json5")
    json_data = json_handler.read_file(file_path)

    previous_fields: list[str] | None = None

    # converts from json -> python objects
    # fills from bottom-up
    note_changes: list[NoteChange] = []

    for note_change_data in reversed(json_data["note_changes"]):
        version = Version.from_str(note_change_data["version"])

        actions = parse_actions(note_change_data["actions"])
        if "post_actions" in note_change_data:
            post_actions = parse_actions(note_change_data["post_actions"])
        else:
            post_actions = []

        # fields
        fields = note_change_data["fields"]

        if fields == "SAME": # attempts to copy from previous
            if previous_fields is None:
                raise RuntimeError("Cannot use SAME fields without any fields to begin with")
            fields = previous_fields.copy() # shallow copy
        previous_fields = fields.copy()

        nc = NoteChange(version, actions, post_actions, fields)
        note_changes.append(nc)

    return tuple(reversed(note_changes))


def get_version_fields(note_changes: Sequence[NoteChange], current_ver: Version) -> list[str]:
    original_fields = None

    for data in reversed(note_changes):
        ver = data.version
        if ver <= current_ver:
            # records last known fields_check
            original_fields = data.fields
        else:
            break

    assert original_fields is not None
    return original_fields


def get_expected_fields(version_str: Optional[str] = None) -> list[str]:
    json_handler = JsonHandler()
    #note_data = utils.get_note_data(json_handler)
    note_name = "JP Mining Note"
    if version_str is None:
        version_str = utils.get_version_from_anki(note_name)
    version = Version.from_str(version_str)
    note_changes = get_note_changes(json_handler)
    expected_fields = get_version_fields(note_changes, version)

    return expected_fields




#NOTE_CHANGES = [
#
#    NoteChange(
#        version=Version(0, 12, 0, 0),
#        actions=[
#            action.AddField("YomichanWordTags", 35 - 1),
#            action.AddField("IsHintCard", 18 - 1),
#            action.AddField("AltDisplayClozeDeletionCard", 13 - 1),
#            action.MoveField("IsTargetedSentenceCard", 16 - 1),
#            action.MoveField("Hint", 15 - 1),
#            action.MoveField("HintNotHidden", 16 - 1),
#            action.MoveField("FrequenciesStylized", 33 - 1),
#            action.MoveField("FrequencySort", 34 - 1),
#
#            # webpack branch
#            # TODO verify changes
#            # TODO merge with above honestly
#            action.RenameField("SeparateClozeDeletionCard", "SeparateAudioCard"),
#            action.RenameField("AltDisplayClozeDeletionCard", "AltDisplayAudioCard"),
#            action.AddField("SeparateSentenceAudioCard", 28-1),
#            action.AddField("IsAudioCard", 21-1),
#            action.AddField("IsSentenceFirstCard", 21-1),
#
#            # affects all previously added fields
#            # currently commented out because it's not supported in ankiconnect yet
#            #action.ChangeFieldFontSize("WordReadingHiragana", 10),
#            #action.ChangeFieldFontSize("PrimaryDefinitionPicture", 20), # default
#            #action.ChangeFieldFontSize("PAOverrideText", 20), # default
#            #action.ChangeFieldFontSize("YomichanWordTags", 10),
#            #action.ChangeFieldFontSize("IsHintCard", 10),
#            #action.ChangeFieldFontSize("IsAudioCard", 10),
#            #action.ChangeFieldFontSize("SeparateSentenceAudioCard", 10),
#
#            action.YomichanTemplatesChange(),
#            action.YomichanFormatChange(
#                "YomichanWordTags", "(empty)", "{tags}"
#            ),
#            action.NoteToUser(
#                description="If you are using Anki version 2.1.49 or below, please see the link below:\n"
#                "https://aquafina-water-bottle.github.io/jp-mining-note/faq/#the-frequency-list-display-looks-squished"
#            ),
#        ],
#        fields=[
#            "Key",
#            "Word",
#            "WordReading",
#            "PAOverride",
#            "PAOverrideText",
#            "AJTWordPitch",
#            "PrimaryDefinition",
#            "PrimaryDefinitionPicture",
#            "Sentence",
#            "SentenceReading",
#            "AltDisplayWord",
#            "AltDisplaySentence",
#            "AltDisplayPASentenceCard",
#            "AltDisplayAudioCard",
#            "AdditionalNotes",
#            "Hint",
#            "HintNotHidden",
#            "IsSentenceCard",
#            "IsTargetedSentenceCard",
#            "IsClickCard",
#            "IsHoverCard",
#            "IsHintCard",
#            "IsSentenceFirstCard",
#            "IsAudioCard",
#            "PAShowInfo",
#            "PATestOnlyWord",
#            "PADoNotTest",
#            "PASeparateWordCard",
#            "PASeparateSentenceCard",
#            "SeparateAudioCard",
#            "SeparateSentenceAudioCard",
#            "Picture",
#            "WordAudio",
#            "SentenceAudio",
#            "PAGraphs",
#            "PAPositions",
#            "FrequenciesStylized",
#            "FrequencySort",
#            "PASilence",
#            "WordReadingHiragana",
#            "YomichanWordTags",
#            "SecondaryDefinition",
#            "ExtraDefinitions",
#            "UtilityDictionaries",
#            "Comment",
#        ],
#    ),
#
#
#    NoteChange(
#        version=Version(0, 11, 0, 0),
#        actions=[
#            action.AddField("WordReadingHiragana", 30 - 1),
#            action.AddField("PrimaryDefinitionPicture", 7 - 1),
#            action.AddField("PAOverrideText", 5 - 1),
#            action.BatchUpdate(
#                batch_func=batch.fill_word_reading_hiragana_field,
#                ankiconnect_actions={
#                    "findNotes",
#                    "notesInfo",
#                    "multi",
#                    "updateNoteFields",
#                },
#                description="Automatically fills the `WordReadingHiragana` field",
#            ),
#            action.BatchUpdate(
#                batch_func=batch.separate_pa_override_field,
#                ankiconnect_actions={
#                    "findNotes",
#                    "notesInfo",
#                    "multi",
#                    "updateNoteFields",
#                },
#                description="Separates the `PAOverride` field to `PAOverride` and `PAOverrideText` "
#                "as appropriate",
#            ),
#            action.YomichanTemplatesChange(),
#            action.YomichanFormatChange(
#                "WordReadingHiragana", "(empty)", "{jpmn-word-reading-hiragana}"
#            ),
#            action.NoteToUser(
#                description="If you are using the nsfw-toggle function, the option name was changed\n"
#                "from `nsfw-toggle` to `image-blur`. Please change it in your runtime options\n"
#                "to continue using it.\n"
#                "See: https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/media/_jpmn-options.js"
#            ),
#            action.NoteToUser(
#                description="The way keybinds are specified has been changed (to allow keys to still function\n"
#                "as expected even with CapsLock enabled.)\n"
#                "Keybinds will no longer work until you update the runtime options.\n"
#                "For example, update `n` to `KeyN`.\n"
#            ),
#            action.NoteToUser("Update Notes Permalink: https://github.com/Aquafina-water-bottle/jp-mining-note/blob/master/CHANGELOG.md#update-notes-01100"),
#        ],
#        fields=[
#            "Key",
#            "Word",
#            "WordReading",
#            "PAOverride",
#            "PAOverrideText",
#            "AJTWordPitch",
#            "PrimaryDefinition",
#            "PrimaryDefinitionPicture",
#            "Sentence",
#            "SentenceReading",
#            "AltDisplay",
#            "AltDisplayPASentenceCard",
#            "AdditionalNotes",
#            "IsSentenceCard",
#            "IsClickCard",
#            "IsHoverCard",
#            "IsTargetedSentenceCard",
#            "PAShowInfo",
#            "PATestOnlyWord",
#            "PADoNotTest",
#            "PASeparateWordCard",
#            "PASeparateSentenceCard",
#            "SeparateClozeDeletionCard",
#            "Hint",
#            "HintNotHidden",
#            "Picture",
#            "WordAudio",
#            "SentenceAudio",
#            "PAGraphs",
#            "PAPositions",
#            "PASilence",
#            "WordReadingHiragana",
#            "FrequenciesStylized",
#            "FrequencySort",
#            "SecondaryDefinition",
#            "ExtraDefinitions",
#            "UtilityDictionaries",
#            "Comment",
#        ],
#    ),
#
#
#    NoteChange(
#        version=Version(0, 10, 2, 0),
#        actions=[
#            action.YomichanTemplatesChange(),
#            action.BatchUpdate(
#                batch_func=batch.standardize_frequencies_styling,
#                ankiconnect_actions={
#                    "findNotes",
#                    "notesInfo",
#                    "multi",
#                    "updateNoteFields",
#                },
#                description="Updates the FrequenciesStylized field to match the styling "
#                "of all the other stylized Yomichan fields (PAGraphs, PAPositions)",
#            ),
#            action.NoteToUser(
#                description="If you are using CSS Injector, a new file `editor.css` must be added.\n"
#                "See: https://aquafina-water-bottle.github.io/jp-mining-note/setup/#css-injector"
#            ),
#        ],
#        fields=[
#            "Key",
#            "Word",
#            "WordReading",
#            "PAOverride",
#            "AJTWordPitch",
#            "PrimaryDefinition",
#            "Sentence",
#            "SentenceReading",
#            "AltDisplay",
#            "AltDisplayPASentenceCard",
#            "AdditionalNotes",
#            "IsSentenceCard",
#            "IsClickCard",
#            "IsHoverCard",
#            "IsTargetedSentenceCard",
#            "PAShowInfo",
#            "PATestOnlyWord",
#            "PADoNotTest",
#            "PASeparateWordCard",
#            "PASeparateSentenceCard",
#            "SeparateClozeDeletionCard",
#            "Hint",
#            "HintNotHidden",
#            "Picture",
#            "WordAudio",
#            "SentenceAudio",
#            "PAGraphs",
#            "PAPositions",
#            "PASilence",
#            "FrequenciesStylized",
#            "FrequencySort",
#            "SecondaryDefinition",
#            "ExtraDefinitions",
#            "UtilityDictionaries",
#            "Comment",
#        ],
#    ),
#
#    NoteChange(
#        version=Version(0, 10, 0, 0),
#        actions=[
#            action.RenameField("WordPitch", "AJTWordPitch"),
#            action.AddField("PAOverride", 4 - 1),
#            action.AddField("PAPositions", 28 - 1),
#            action.MoveField("AJTWordPitch", 5 - 1),
#            action.YomichanTemplatesChange(),
#            action.YomichanFormatChange(
#                "PAPositions", "(empty)", "{jpmn-pitch-accent-positions}"
#            ),
#        ],
#        fields=[
#            "Key",
#            "Word",
#            "WordReading",
#            "PAOverride",
#            "AJTWordPitch",
#            "PrimaryDefinition",
#            "Sentence",
#            "SentenceReading",
#            "AltDisplay",
#            "AltDisplayPASentenceCard",
#            "AdditionalNotes",
#            "IsSentenceCard",
#            "IsClickCard",
#            "IsHoverCard",
#            "IsTargetedSentenceCard",
#            "PAShowInfo",
#            "PATestOnlyWord",
#            "PADoNotTest",
#            "PASeparateWordCard",
#            "PASeparateSentenceCard",
#            "SeparateClozeDeletionCard",
#            "Hint",
#            "HintNotHidden",
#            "Picture",
#            "WordAudio",
#            "SentenceAudio",
#            "PAGraphs",
#            "PAPositions",
#            "PASilence",
#            "FrequenciesStylized",
#            "FrequencySort",
#            "SecondaryDefinition",
#            "ExtraDefinitions",
#            "UtilityDictionaries",
#            "Comment",
#        ],
#    ),
#
#    NoteChange(
#        version=Version(0, 9, 1, 0),
#        actions=[
#            action.MoveField("PAShowInfo", 15 - 1),
#            action.MoveField("PASeparateWordCard", 19 - 1),
#            action.MoveField("PASeparateSentenceCard", 19 - 1),
#            action.AddField("FrequencySort", 29 - 1),
#            action.YomichanTemplatesChange(),
#            action.YomichanFormatChange("FrequencySort", "(empty)", "{jpmn-min-freq}"),
#        ],
#        fields=[
#            "Key",
#            "Word",
#            "WordReading",
#            "WordPitch",
#            "PrimaryDefinition",
#            "Sentence",
#            "SentenceReading",
#            "AltDisplay",
#            "AltDisplayPASentenceCard",
#            "AdditionalNotes",
#            "IsSentenceCard",
#            "IsClickCard",
#            "IsHoverCard",
#            "IsTargetedSentenceCard",
#            "PAShowInfo",
#            "PATestOnlyWord",
#            "PADoNotTest",
#            "PASeparateWordCard",
#            "PASeparateSentenceCard",
#            "SeparateClozeDeletionCard",
#            "Hint",
#            "HintNotHidden",
#            "Picture",
#            "WordAudio",
#            "SentenceAudio",
#            "PAGraphs",
#            "PASilence",
#            "FrequenciesStylized",
#            "FrequencySort",
#            "SecondaryDefinition",
#            "ExtraDefinitions",
#            "UtilityDictionaries",
#            "Comment",
#        ],
#    ),
#
#    NoteChange(
#        version=Version(0, 9, 0, 0),
#        actions=[
#            action.BatchUpdate(
#                batch_func=batch.add_downstep_inner_span_tag,
#                ankiconnect_actions={
#                    "findNotes",
#                    "notesInfo",
#                    "multi",
#                    "updateNoteFields",
#                },
#                description="Updates the WordPitch field to work with the new AJT Pitch "
#                "Accent config settings",
#            ),
#            action.SetField("PASilence", "[sound:_silence.wav]"),
#            action.AJTPitchAccentConfigChange(
#                "update the 'styles' -> '&#42780;' field"
#            ),
#            action.YomichanTemplatesChange(),
#            action.YomichanFormatChange(
#                "PASilence", "[sound:silence.wav]", "[sound:_silence.wav]"
#            ),
#        ],
#        fields=[  # same as below
#            "Key",
#            "Word",
#            "WordReading",
#            "WordPitch",
#            "PrimaryDefinition",
#            "Sentence",
#            "SentenceReading",
#            "AltDisplay",
#            "AltDisplayPASentenceCard",
#            "AdditionalNotes",
#            "IsSentenceCard",
#            "IsClickCard",
#            "IsHoverCard",
#            "IsTargetedSentenceCard",
#            "PASeparateWordCard",
#            "PASeparateSentenceCard",
#            "PAShowInfo",
#            "PATestOnlyWord",
#            "PADoNotTest",
#            "SeparateClozeDeletionCard",
#            "Hint",
#            "HintNotHidden",
#            "Picture",
#            "WordAudio",
#            "SentenceAudio",
#            "PAGraphs",
#            "PASilence",
#            "FrequenciesStylized",
#            "SecondaryDefinition",
#            "ExtraDefinitions",
#            "UtilityDictionaries",
#            "Comment",
#        ],
#    ),
#
#    NoteChange(
#        version=Version(0, 0, 0, 0),
#        actions=[],
#        fields=[
#            "Key",
#            "Word",
#            "WordReading",
#            "WordPitch",
#            "PrimaryDefinition",
#            "Sentence",
#            "SentenceReading",
#            "AltDisplay",
#            "AltDisplayPASentenceCard",
#            "AdditionalNotes",
#            "IsSentenceCard",
#            "IsClickCard",
#            "IsHoverCard",
#            "IsTargetedSentenceCard",
#            "PASeparateWordCard",
#            "PASeparateSentenceCard",
#            "PAShowInfo",
#            "PATestOnlyWord",
#            "PADoNotTest",
#            "SeparateClozeDeletionCard",
#            "Hint",
#            "HintNotHidden",
#            "Picture",
#            "WordAudio",
#            "SentenceAudio",
#            "PAGraphs",
#            "PASilence",
#            "FrequenciesStylized",
#            "SecondaryDefinition",
#            "ExtraDefinitions",
#            "UtilityDictionaries",
#            "Comment",
#        ],
#    ),
#]
