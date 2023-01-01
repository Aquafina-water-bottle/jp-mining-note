# This module is completely outdated

#import pytest
#
#from tools.jpmnopts_updater import JPMNOptsUpdater, OptAction, MoveOptAction, OverwriteValueOptAction, ChangeDefaultValueOptAction
#
#
#@pytest.fixture
#def updater():
#    template = """
#// preserve comments
#{
#    "k1": "{{ k1 }}",
#    "k2": {
#        "k3": "{{ k2.k3 }}",
#        "k4": "{{ k2.k4 }}",
#        "k6": "{{ k2.k6 }}",
#        "k7": "{{ k2.k7 }}"
#    },
#    "k5": "{{ k5 }}"
#}
#"""
#
#    options = {
#        "k1": "value 1",
#        "k2": {
#            "k3": "value 3",
#            "k4": True,
#            "k6": ["hello", "world"],
#            "k7": {"k8": "value 8"}
#        },
#        "k5": 0.1,
#    }
#
#    upt = JPMNOptsUpdater(
#        template,
#        options,
#    )
#
#    return upt
#
#@pytest.fixture
#def updater_small():
#    template = """
#// preserve comments
#{
#    "k1": "{{ k1 }}",
#}
#"""
#
#    options = {
#        "k1": "value 1",
#    }
#
#    upt = JPMNOptsUpdater(
#        template,
#        options,
#    )
#
#    return upt
#
#
#def test_flatten(updater: JPMNOptsUpdater):
#
#    json = {
#        "k1": "v1",
#        "k2": {
#            "k3": "v3",
#            "k4": {
#                "k5": "v5",
#            }
#        },
#    }
#
#    assert updater.flatten(json) == {
#        "k1": "v1",
#        "k2.k3": "v3",
#        "k2.k4.k5": "v5",
#    }
#
#
##def test_more_options():
##    template = """{ "k1": "{{ k1 }}" }"""
##
##    options = {
##        "k1": "value 1",
##        "k2": "value 2",
##    }
##
##    upt = JPMNOptsUpdater(
##        template,
##        options,
##    )
#
#
#def test_flatten_options(updater: JPMNOptsUpdater):
#    assert updater.flatten_options() == {
#        "k1": "value 1",
#        "k2.k3": "value 3",
#        "k2.k4": True,
#        "k2.k6": ["hello", "world"],
#        "k2.k7": {"k8": "value 8"},
#        "k5": 0.1
#    }
#
#
#def test_flatten_options_more_templates():
#    template = """{ "k1": "{{ k1 }}", "k2": "{{ k2 }}" }"""
#
#    options = {
#        "k1": "value 1",
#    }
#
#    upt = JPMNOptsUpdater(
#        template,
#        options,
#    )
#
#    with pytest.raises(RuntimeError, match="Key not found: k2"):
#        upt.flatten_options()
#
#
#class TestApplyActions:
#
#    def test_MoveOptAction(self, updater_small: JPMNOptsUpdater):
#        options = {"a": "b"}
#        actions: list[OptAction] = [MoveOptAction("a", "c")]
#
#        assert updater_small.apply_actions(options, actions) == {
#            "k1": "value 1",
#            "c": "b",
#        }
#
#    def test_OverwriteValueOptAction(self, updater_small: JPMNOptsUpdater):
#        options = {}
#        actions: list[OptAction] = [OverwriteValueOptAction("k1", "new value")]
#
#        assert updater_small.apply_actions(options, actions) == {
#            "k1": "new value",
#        }
#
#    def test_ChangeDefaultValueOptAction(self, updater_small: JPMNOptsUpdater):
#        options = {"a": "b"}
#        actions: list[OptAction] = [ChangeDefaultValueOptAction("a", "c", "b")]
#
#        assert updater_small.apply_actions(options, actions) == {
#            "k1": "value 1",
#            "a": "c",
#        }
#
#    def test_ChangeDefaultValueOptAction_not_default(self, updater_small: JPMNOptsUpdater):
#        options = {"a": "b"}
#        actions: list[OptAction] = [ChangeDefaultValueOptAction("a", "c", "not b")]
#
#        assert updater_small.apply_actions(options, actions) == {
#            "k1": "value 1",
#            "a": "b",
#        }
#
#class TestGenerate:
#
#    def test_default(self, updater_small: JPMNOptsUpdater):
#        user_options = {}
#        actions = []
#
#        result_str = """
#// preserve comments
#{
#    "k1": "value 1",
#}
#"""
#
#        assert updater_small.generate(user_options, actions).strip() == result_str.strip()
#
#
#    def test_different(self, updater_small: JPMNOptsUpdater):
#        user_options = {"k1": "value 2"}
#        actions = []
#
#        result_str = """
#// preserve comments
#{
#    "k1": "value 2",
#}
#"""
#
#        assert updater_small.generate(user_options, actions).strip() == result_str.strip()

