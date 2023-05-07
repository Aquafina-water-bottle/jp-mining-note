TODO add intro

- for kanji hover and same reading indicator
- TODO generalize this page to not only be for kanji hover

---

# Pitch Accent Display
- pitch accents should be exactly the same pitch accents as shown on the specified card
- pitch accents are stripped of extra information (nasal and devoiced)
    - all the extra color was very distracting, and stole the attention away from the important part
        (the example words found)

---

# Cache Tooltip Results

TODO

- problem: mobile (and anki-web) does not have access to Anki-Connect
    - yes, Android has AnkiConnect Android, but its implementation is incomplete
    - even if it were complete, it is currently a lot slower than the standard desktop Anki-Connect
    - kanji hover and word indicators fully depend on Anki-Connect in order to work!
- solution: cache results of kanji hover and word indicators, into the `CardCache` field
- requires building the note!!!
    - may be implemented as a separate note in the future (so you can run the script within Anki)
- also requires node (npx node)

## General warnings

- cannot use Anki while running the script (Anki-Connect blocks using Anki, and the script continuously makes calls to Anki-Connect during its lifetime)
- will take a long time to run!!! this is because Anki-Connect itself is a bit slow when doing mass operations like this

## How to (first time)

1. open Anki (so that Anki-Connect is running)
1. Build the note! You might have to refresh the npm dependencies `npm ci`
1. Test the script out first, by running it on a single card.
    For example, take a note ID of any JPMN note (Card browser →  Right click a note →  `Info...`), and use the following:
    ```
    node ./src/_js/jpmn_card_cache.js --custom-query="nid:1234567890"
    ```
1. Sync on both PC and mobile.
1. Check that kanji hover and word indicators work!


## How to (every other time)
1. open Anki (so that Anki-Connect is running)
1. build the note, if you haven't already
1. Run the following:
    ```bash
    node ./src/_js/jpmn_card_cache.js
    ```

- above caches for 8 days (expected that you run this, say, once every saturday)
- run with `--help` for list of all available flags
- TODO: MacOS cannot find Anki-Connect???


---

# Result Queries & Categorization

TODO add writeup on new.newest

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
{{ RTO }}:

```json
// maximum number of words per category
"tooltips.categoryMax.nonNew.oldest": 2,
"tooltips.categoryMax.nonNew.newest": 2,
"tooltips.categoryMax.new.oldest": 2,
"tooltips.categoryMax.new.newest": 0,
```


TODO: add this to each query to hide results from cards that are due today
```
-(prop:due=0 -rated:1)
```

---


# Results Sorting
The above makes the assumption that you are reviewing in order of creation date,
rather than the time of first review, to save resources.
In other words, if you re-ordered your cards to be different from the add-date,
then the kanji hover will not be able to recognize that.

For people who review in order of frequency only, then the assumption above is completely broken.

Unfortunately, there is currently no way to order the results by anything
other than by the creation date.

---


# Suspended Cards
TODO add difference between hidden and removed

Some assumptions are made about suspended cards.
For example, suspended cards flagged as `green` are counted in the "non-new" cards category
(known words), and suspended cards flagged as `red` are counted as words that you
do not know AND will not study in the future (not shown in any category).
This can be changed in the {{ RTO_FILE}}:

```
"tooltips.query.nonNew.base": "-is:new OR (is:suspended is:new flag:3)",
"tooltips.query.nonNew.hidden": "is:suspended flag:1",
"tooltips.query.nonNew.removed": "",
```


---

# Customizing Sentences & Pitch Accent

TODO link to runtime options? or visa versa?

Any {{ RTO }} under the `sentParser` and `autoPA` group can be set under
`tooltips.overrideOptions.sentenceParser` and
`tooltips.overrideOptions.autoPitchAccent`
respectively.
Additionally, the `kanjiHover` and `wordIndicators` category
has their own `overrideOptions` section that behaves the exact same as the above,
except they only affect Kanji Hover and Word Indicators, respectively.

This allows for very fine grained control on how the sentences and pitch accent
should be displayed.

!!! note
    When the sentence is being parsed by the tooltip builder,
    it is considered a "full sentence" internally.
    Therefore, only the `fullSent` group of options will affect the resulting sentence.


---


# Highlight the word within the tooltips
{{ feature_version("0.12.0.0") }}

Within the tooltips, the word within the sentence is not highlighted by default.
This is to emphasize the importance of the kanji over the word.
However, this comes at the cost of having to scan through the entire sentence to find the word.

The following {{ RTO }} re-enables the highlighted word:
```json
"tooltips.highlightWordInSentence": true,
```

=== "Highlighted"
    {{ img("", "assets/uicustomization/tooltip/highlighted.png") }}

    TODO this is no longer bolded


=== "Not Highlighted (default)"
    {{ img("", "assets/uicustomization/tooltip/not_highlighted.png") }}


---

# Display newlines in mobile tooltip sentences

TODO wrap with custom css text

```css
.mobile-popup .hover-tooltip__sent-div br {
  display: inline;
}
```

