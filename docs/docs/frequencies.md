The frequencies of a card can be found on the back side of the card,
at the top right corner.

By default, the shown frequency is the value in `FrequencySort`.
All other frequencies can be viewed by hovering over the dropdown arrow.

(TODO gif)

---

# List Mode

Older versions of the note displayed the frequencies similarly to
Yomichan: as a list of existing frequencies.
If you wish to do this, set the following {{ RTO }} to `summary`:

```json
{
  "freqUtils.displayMode": "summary",
}
```

(TODO IMAGE)

<br>

## List Mode Maximum

The list mode defaults to showing a total of 4 frequencies by default,
before overflowing into the dropdown.
This limit can be changed with the following {{ RTO }}:

```json
{
  "freqUtils.listAll.max": 4,
}
```
