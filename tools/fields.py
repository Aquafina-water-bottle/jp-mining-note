from dataclasses import dataclass

@dataclass
class Field:
    name: str
    font_size: int

FIELDS = [
    Field("Key", 40),
    Field("Word", 20),
    Field("WordReading", 20),
    Field("PAOverride", 20),
    Field("PAOverrideText", 20),
    Field("AJTWordPitch", 20),
    Field("PrimaryDefinition", 20),
    Field("PrimaryDefinitionPicture", 20),
    Field("Sentence", 20),
    Field("SentenceReading", 20),
    Field("AltDisplay", 20),
    Field("AltDisplayPASentenceCard", 20),
    Field("AdditionalNotes", 20),
    Field("Hint", 15),
    Field("HintNotHidden", 15),
    Field("IsSentenceCard", 10),
    Field("IsTargetedSentenceCard", 10),
    Field("IsClickCard", 10),
    Field("IsHoverCard", 10),
    Field("IsHintCard", 10),
    Field("PAShowInfo", 10),
    Field("PATestOnlyWord", 10),
    Field("PADoNotTest", 10),
    Field("PASeparateWordCard", 10),
    Field("PASeparateSentenceCard", 10),
    Field("SeparateClozeDeletionCard", 10),
    Field("Picture", 20),
    Field("WordAudio", 15),
    Field("SentenceAudio", 15),
    Field("PAGraphs", 15),
    Field("PAPositions", 15),
    Field("FrequenciesStylized", 15),
    Field("FrequencySort", 10),
    Field("PASilence", 10),
    Field("WordReadingHiragana", 10),
    Field("YomichanWordTags", 10),
    Field("SecondaryDefinition", 15),
    Field("ExtraDefinitions", 15),
    Field("UtilityDictionaries", 15),
    Field("Comment", 20),
]
