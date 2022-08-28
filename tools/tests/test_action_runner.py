from tools.action_runner import Version, FieldEditSimulator
import tools.note_changes as note_changes


def test_version_cmp():
    assert not Version(0, 0, 10, 1) == Version(0, 0, 1, 10)
    assert Version(0, 0, 10, 1) >= Version(0, 0, 1, 10)
    assert not Version(0, 0, 10, 1) <= Version(0, 0, 1, 10)
    assert Version(0, 0, 10, 1) > Version(0, 0, 1, 10)
    assert not Version(0, 0, 10, 1) < Version(0, 0, 1, 10)
    assert Version(0, 0, 10, 1) != Version(0, 0, 1, 10)

    assert Version(0, 0, 10, 1) == Version(0, 0, 10, 1)
    assert Version(0, 0, 10, 1) >= Version(0, 0, 10, 1)
    assert Version(0, 0, 10, 1) <= Version(0, 0, 10, 1)
    assert not Version(0, 0, 10, 1) > Version(0, 0, 10, 1)
    assert not Version(0, 0, 10, 1) < Version(0, 0, 10, 1)
    assert not Version(0, 0, 10, 1) != Version(0, 0, 10, 1)

    assert Version(0, 0, 10, 1) == Version.from_str("0.0.10.1")


def test_note_changes():
    s = FieldEditSimulator(note_changes.NOTE_CHANGES[-1].fields)
    actions = sum((data.actions for data in note_changes.NOTE_CHANGES), start=[])
    s.simulate(actions)
    s.verify(note_changes.NOTE_CHANGES[0].fields)
