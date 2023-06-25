from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class FuriganaSegment:
    text: str
    reading: str


@dataclass(frozen=True)
class FuriganaSegmentGroup:
    is_kana: bool
    text: str
    text_normalized: Optional[str]


HIRAGANA = list(
    "ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすず"
    "せぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴ"
    "ふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろわ"
    "をんーゎゐゑゕゖゔゝゞ・「」。、"
)
HIRAGANA_SET = set(HIRAGANA)
FULL_KANA = list(
    "ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソ"
    "ゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペ"
    "ホボポマミムメモャヤュユョヨラリルレロワヲンーヮヰヱヵヶヴ"
    "ヽヾ・「」。、"
)


def kata2hira(text: str, ignore: str = "") -> str:
    # taken directly from jaconv's source code
    # separate function instead of using `jaconv` for the sake of fewer dependencies
    # for end users
    # NOTE: doesn't convert long katakana marks unfortunately

    def _to_dict(_from, _to):
        return dict(zip(_from, _to))

    def _to_ord_list(chars):
        return list(map(ord, chars))

    FULL_KANA_ORD = _to_ord_list(FULL_KANA)
    K2H_TABLE = _to_dict(FULL_KANA_ORD, HIRAGANA)

    def _exclude_ignorechar(ignore, conv_map):
        for character in map(ord, ignore):
            conv_map[character] = character
        return conv_map

    def _convert(text, conv_map):
        return text.translate(conv_map)

    _conv_map = _exclude_ignorechar(ignore, K2H_TABLE.copy())
    return _convert(text, _conv_map)


def is_hiragana(text: str) -> bool:
    for c in text:
        if c not in HIRAGANA_SET:
            return False
    return True


def is_kana(word):
    for char in word:
        if char < "ぁ" or char > "ヾ":
            return False
    return True


def create_furigana_groups(term: str, reading: str) -> list[FuriganaSegmentGroup]:
    # Creates groups that separate consecutive characters of kana and kanji, i.e.
    # - 成り立つ -> 成、り、立、つ
    # - あだ名 -> あだ、名
    groups: list[FuriganaSegmentGroup] = []
    text_pre = ""
    c_is_kana_pre = is_kana(term[0])
    for c in term:
        c_is_kana = is_kana(c)
        if c_is_kana == c_is_kana_pre:  # always false on the first case
            text_pre += c
        else:
            groups.append(_create_group(is_kana=c_is_kana_pre, text=text_pre))
            c_is_kana_pre = c_is_kana
            text_pre = c
    groups.append(_create_group(is_kana=c_is_kana_pre, text=text_pre))
    return groups


def segments_to_plain_furigana(segments: list[FuriganaSegment]) -> str:
    result = []
    for segment in segments:
        if segment.reading == "":
            result.append(segment.text)
        else: # kanji
            result.append(f" {segment.text}[{segment.reading}]")
    return "".join(result)


def distribute_furigana(term: str, reading: str) -> list[FuriganaSegment]:
    """
    algorithm copied from Yomichan
    """
    if term == reading or len(term) == 0:  # same
        return [FuriganaSegment(term, reading)]

    groups = create_furigana_groups(term, reading)
    reading_normalized = kata2hira(reading)
    segments = _segmentize_furigana(reading, reading_normalized, groups, 0)
    if segments is not None:
        return segments

    # fallback if nothing works
    return [FuriganaSegment(term, reading)]


def _create_group(is_kana: bool, text: str):
    text_normalized = None
    if is_kana:
        text_normalized = kata2hira(text)
    return FuriganaSegmentGroup(is_kana, text, text_normalized)


def _segmentize_furigana(
    reading: str,
    reading_normalized: str,
    groups: list[FuriganaSegmentGroup],
    groups_start: int,
) -> Optional[list[FuriganaSegment]]:
    """
    - A None return means 'ambiguous'. For example:
        転た寝, うたたね can be 転[う]た寝[たね] or 転[うた]た寝[ね]
    """

    group_count = len(groups) - groups_start
    if group_count <= 0:  # base case?
        # returns a list when the _segmentize_furigana() recursion reaches the end
        return [] if len(reading) == 0 else None

    # group properties
    group = groups[groups_start]
    g_text = group.text
    g_text_len = len(g_text)
    g_is_kana = group.is_kana
    g_text_normalized = group.text_normalized

    if g_is_kana:  # kana group handling
        if g_text_normalized is not None and reading_normalized.startswith(
            g_text_normalized
        ):  # sanity check

            segments = _segmentize_furigana(
                reading[g_text_len:],
                reading_normalized[g_text_len:],
                groups,
                groups_start + 1,
            )

            if segments is not None:
                if reading.startswith(g_text):
                    segments.insert(0, FuriganaSegment(g_text, ""))
                else:
                    segments = _get_furigana_kana_segments(g_text, reading) + segments
                return segments

        return None  # in case nothing works for some reason

    else:
        # Kanji group handling
        # Try to segmentize multiple times from i: len(reading) -> len(g.text)
        # - Does order even matter? The algorithm only picks a unique value anyways?
        # - Why can't the for loop go from len(g.text) -> len(reading)?
        # - Likely because the last if group_count == 1 statement!
        result = None
        for i in range(len(reading), g_text_len-1, -1):
            segments = _segmentize_furigana(
                reading[i:],
                reading_normalized[i:],
                groups,
                groups_start + 1,
            )

            if segments is not None:
                if result is not None:
                    # ambiguous! more than one result was gotten
                    return None

                segment_reading = reading[:i]
                segments.insert(0, FuriganaSegment(g_text, segment_reading))
                result = segments

            # Should essentially be the base case, where reading[i:] is "",
            # meaning that an empty list is returned
            if group_count == 1:
                break

        return result


def _get_furigana_kana_segments(text: str, reading: str) -> list[FuriganaSegment]:
    """
    Literally when does this ever get called?
    """
    text_len = len(text)
    new_segments = []
    start = 0
    state = reading[0] == text[0]  # TODO: error handling?

    for i in range(1, text_len):
        new_state = reading[i] == text[i]
        if state == new_state:
            continue
        new_text = text[start:i]
        new_reading = "" if state else reading[start:i]
        new_segments.append(FuriganaSegment(new_text, new_reading))
        state = new_state
        start = i

    return new_segments


if __name__ == "__main__":
    print(distribute_furigana("成り立つ", "なりたつ"))
    #print(distribute_furigana("り立つ", "りたつ"))
    #print(_segmentize_furigana("たつ", "たつ", create_furigana_groups("り立つ", "りたつ"), 1))
    print(distribute_furigana("あだ名は", "あだなは"))
    print(distribute_furigana("ぴったり", "ぴったり"))
    print(distribute_furigana("描かれた絵の表面", "かかれたえのひょうめん"))
    print(distribute_furigana("転た寝", "うたたね"))
