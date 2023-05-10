from __future__ import annotations


class Version:
    def __init__(
        self,
        main: int,
        major: int,
        minor: int,
        patch: int,
        pre_release: int | None = None,
    ):
        self.ints = (main, major, minor, patch)
        self.pre_release: int | None = pre_release

    @classmethod
    def from_str(cls, str_ver):
        """
        standard:
            x.x.x.x

        prerelease:
            x.x.x.x-prerelease-1
        """
        assert str_ver.count(".") == 3
        # assert str_ver.replace(".", "").isdigit()
        elements = str_ver.split(".")
        main = int(elements[0])
        major = int(elements[1])
        minor = int(elements[2])

        patch = elements[3]
        PREREL_SEP = "-prerelease-"
        if PREREL_SEP in patch:
            patch, pre_release = (int(x) for x in patch.split(PREREL_SEP))
            return cls(main, major, minor, patch, pre_release=pre_release)
        else:
            patch = int(patch)

        return cls(main, major, minor, patch)

    def cmp(self, other, check_prerelease=False):
        """
        returns:
        -1 if self < other
        1  if self > other
        0  if self == other

        check_prerelease determines whether the prerelease number is compared
        when comparing versions
        """
        assert isinstance(other, Version), other

        for i, j in zip(self.ints, other.ints):
            if i < j:
                return -1
            if i > j:
                return 1

        # TODO write tests for this
        if check_prerelease:
            if self.pre_release is not None and other.pre_release is not None:
                if self.pre_release > other.pre_release:
                    return 1
                if self.pre_release < other.pre_release:
                    return -1
                return 0
            if self.pre_release is not None:  # self < other
                return -1
            elif other.pre_release is not None:  # self > other
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
        return f"Version({self})"

    def __str__(self):
        return f"{'.'.join(str(x) for x in self.ints)}{'' if self.pre_release is None else '-prerelease-' + str(self.pre_release)}"
