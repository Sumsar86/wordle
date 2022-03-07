"""This module alows to access system-specific parameters and functions"""
import sys

PATH = "./words/lemma2013.txt"
arg = sys.argv[1]


def does_word_exist(word):
    """
    Opens the text file at PATH.
    Reads in all of the words.
    Checks if "word" is contained within.
    Returns "true" if word is contained and "false" if not.
    """
    try:
        with open(PATH, "r", encoding="utf-8") as text_file:
            words = list(map(lambda x: x.strip("\n"), text_file.readlines()))
            if word in words:
                return "true"
            return "false"
    except IOError as error:
        print(f"Error: could not open file at {PATH}")
        print(error)

    return "false"


print(does_word_exist(arg))
