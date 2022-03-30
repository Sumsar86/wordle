"""These modules return current day and a random list element and set the seed"""
from datetime import datetime, timedelta
from random import seed, choice


PATH = "./words/lemma2013_5tahte.txt"
DATE_OFFSET = 0


def rand_word_per_day(words):
    """
    Returns a random word from list "words".
    The word will change once per day.
    The word stays the same unless the day changes.
    Adds DATE_OFFSET number of days to the current day.
    """
    time = datetime.now() + timedelta(days=DATE_OFFSET)
    seed(time.day)
    return choice(words)


def rand_word(words):
    """
    Returns a random word from list "words" every time called.
    """
    return choice(words)


def word():
    """
    Opens the text file at PATH.
    Reads in all of the words contained within.
    Chooses a random word to return.
    If no file is found "None" is returned.
    """
    words = []
    try:
        with open(PATH, "r", encoding="utf-8") as text_file:
            words = list(map(lambda x: x.strip("\n"), text_file.readlines()))
        return rand_word(words)
    except IOError as error:
        print(f"Error: could not open file at {PATH}")
        print(error)

    return None


print(word())
