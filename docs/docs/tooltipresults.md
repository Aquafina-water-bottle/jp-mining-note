TODO add intro

- for kanji hover and same reading indicator
- TODO generalize this page to not only be for kanji hover


# Details
- pitch accents should be exactly the same pitch accents as shown on the specified card
- pitch accents are stripped of extra information (nasal and devoiced)
    - all the extra color was very distracting, and stole the attention away from the important part
        (the example words found)


# Result Queries & Categorization
The exact results shown through Kanji Hover is not completely trivial,
so this process is explained below.

The words are searched and sorted into 3 categories:

- The two oldest, not new cards (already reviewed before, in order of add date)
- The two latest, not new cards (the most recent two cards that you have reviewed, in order of add date)
- The two oldest, new cards (the first 2 new cards that you will see with the kanji)

The last category (the new cards) are greyed out to show that you haven't reviewed
the card yet (i.e. you may not know the word yet).
Conversely, the first two categories (the non-new cards) represent words that you likely already
know, so they are not greyed out.

The exact numbers shown in each category can be changed in the
{{ RTO_FILE}}:

```
"kanji-hover": {
  "max-non-new-oldest": ...
  "max-non-new-latest": ...
  "max-new-latest": ...
}
```



# Results Sorting
The above makes the assumption that you are reviewing in order of creation date,
rather than the time of first review, to save resources.
In other words, if you re-ordered your cards to be different from the add-date,
then the kanji hover will not be able to recognize that.

For people who review in order of frequency only, then the assumption above is completely broken.

Unfortunately, there is currently no way to order the results by anything
other than by the creation date.



# Suspended Cards
Some assumptions are made about suspended cards.
For example, suspended cards flagged as `green` are counted in the "non-new" cards category
(known words), and suspended cards flagged as `red` are counted as words that you
do not know AND will not study in the future (not shown in any category).
This can be changed in the {{ RTO_FILE}}:

```
"kanji-hover": {
  "non-new-query": ...
  "new-query": ...
}
```


