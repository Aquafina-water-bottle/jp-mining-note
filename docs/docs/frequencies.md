The frequencies of a card can be found on the back side of the card,
at the top right corner.

By default, the shown frequency is the value in `FrequencySort`.
All other frequencies can be viewed by hovering over the dropdown arrow.

(TODO gif)

---

# Sorting by Frequency
This note type comes with a `FrequencySort` field,
which is the equivalent of Marv's `Frequency` field in
[this](https://github.com/MarvNC/JP-Resources#sorting-mined-anki-cards-by-frequency) guide.

To summarize how `FrequencySort` is generated: all frequencies
(filtering out the useless ones) are averaged using a
[harmonic mean](https://en.wikipedia.org/wiki/Harmonic_mean),
which can be thought of as a mean that heavily leans towards the minimum.

However, some exceptions apply:
- If the word exists in a downloaded grammar dictionary, then the frequency value is set to 0, because we make the assumption that grammar points should be studied as soon as possible.
- If there are no frequencies, then it is set to `9999999`.

By default, nothing is done to re-order your cards according to this value.
You will need to manually re-order your cards, or use an add-on to automatically do so.
Visit the aformentioned link (and scroll down to `Usage`)
to see exactly that.

---

# List Mode

Older versions of the note displayed the frequencies similarly to
Yomichan: as a list of existing frequencies.
If you wish to do this, set the following {{ RTO }} to `list-all`:

```json
"freqUtils.displayMode": "list-all",
```

(TODO IMAGE)


## List Mode Maximum

The list mode defaults to showing a total of 4 frequencies by default,
before overflowing into the dropdown.
This limit can be changed with the following {{ RTO }}:

```json
"freqUtils.listAll.max": 4,
```
