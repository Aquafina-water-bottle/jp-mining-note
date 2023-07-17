import pytest

from tools.action_runner import Version, FieldEditSimulator, Verifier
import tools.note_changes as nc
from tools.json_handler import JsonHandler


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
    # s = FieldEditSimulator(note_changes.NOTE_CHANGES[-1].fields)
    # actions = sum((data.actions for data in reversed(note_changes.NOTE_CHANGES)), start=[])
    # s.simulate(actions)
    # s.verify(note_changes.NOTE_CHANGES[0].fields)

    json_handler = JsonHandler()
    NOTE_CHANGES = nc.get_note_changes(json_handler)

    original_fields = NOTE_CHANGES[-1].fields
    new_fields = NOTE_CHANGES[0].fields
    verifier = Verifier(original_fields, new_fields)
    actions = sum((data.actions for data in reversed(NOTE_CHANGES)), start=[])
    verifier.verify_simulator(actions)


@pytest.fixture
def sim():
    return FieldEditSimulator(["A", "B", "C", "D", "E"])


class TestFieldEditSimulator:
    def test_rename_to_existing_field(self, sim):
        with pytest.raises(
            Exception, match="Cannot rename field A -> C: C field already exists"
        ):
            sim._rename_field("A", "C")

    def test_rename(self, sim):
        sim._rename_field("A", "F")
        assert sim.simulated_fields == ["F", "B", "C", "D", "E"]

    def test_add(self, sim):
        sim._add_field("F", 3)
        assert sim.simulated_fields == ["A", "B", "C", "F", "D", "E"]

    def test_add_same_field(self, sim):
        sim._add_field("B", 1)
        assert sim.simulated_fields == ["A", "B", "C", "D", "E"]

    def test_add_same_field_different_pos(self, sim):
        sim._add_field("A", 1)
        assert sim.simulated_fields == ["B", "A", "C", "D", "E"]

    def test_move_backwards(self, sim):
        sim._add_field("C", 0)
        assert sim.simulated_fields == ["C", "A", "B", "D", "E"]

    def test_move_same_pos(self, sim):
        sim._add_field("C", 2)
        assert sim.simulated_fields == ["A", "B", "C", "D", "E"]

    def test_move_forwards(self, sim):
        sim._add_field("C", 3)
        assert sim.simulated_fields == ["A", "B", "D", "C", "E"]

    def test_delete_field(self, sim):
        sim._delete_field("C")
        assert sim.simulated_fields == ["A", "B", "D", "E"]
