"""
both generates files and updates anki card template
"""

import generate
import update


def main():
    generate.main()
    update.main()

if __name__ == "__main__":
    main()

