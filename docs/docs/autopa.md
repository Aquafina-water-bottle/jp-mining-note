

# Auto Selected Pitch Accent
- TODO details on exactly how the displayed pitch accent is displayed

priority:

- PA Override number
- PA Override raw text
- PA Positions
- AJT Word Pitch

if module disabled:

- only shows AJT Word Pitch

reading:

- AJT word pitch by default
- can be changed to hiragana / katakana / katakana with long vowel marks
- ajt word pitch is katakana with long vowel marks (most of the time)
    - some words don't have long vowel marks (i.e. adjectives ending with 〜しい will be displayed as 〜シイ and not 〜シー)


# Colored Pitch Accent
- TODO basic usage (options)
- TODO tags to override
- TODO does not automatically work with non-integer PAOverride value (use tags instead)


# Pitch Accent Styling Details

- TODO outdated
- TODO only if you care about the exact text value
- TODO what bold does


Editing the content in `WordPitch` requires some special attention.
To preserve the style and get expected results, you must use `Ctrl + Shift + x` when editing the field,
and edit the html tags directly. Use other cards as examples of what the html should look like.

TODO more details + example (華)

- TODO replace with positions :eyes:

example of something that has all possible formats (bold, overline, downstep, nasal, devoiced)
```html
チュ<span style="text-decoration:overline;" class="pitchoverline">ーカ<span class="nasal">°</span></span><span class="downstep"><span class="downstep-inner">ꜜ</span></span><span class="nopron">ク</span>セイ<b>・チュ<span style="text-decoration:overline;" class="pitchoverline">ーカ<span class="nasal">°</span><span class="nopron">ク</span></span><span class="downstep"><span class="downstep-inner">ꜜ</span></span>セイ</b>
```


The `WordPitch` field may have more than one pitch accent for a given word.
To choose which pitch accent is correct to the sentence,
one can bold the unused pitch accents to grey them out.


<figure markdown>
{{ img("word pitch with bolded field to grey out", "assets/bold_pa.png") }}
</figure>

