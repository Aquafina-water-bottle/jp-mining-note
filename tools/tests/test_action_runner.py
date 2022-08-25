from tools.action_runner import Version


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
