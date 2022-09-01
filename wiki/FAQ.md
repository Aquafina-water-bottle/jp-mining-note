Remember that all cards are fully customizable!
You are absolutely free to tear the code apart and make these card formats your own.



<!--
# How do I get rid of all of this pitch accent info?
See [here](usage#wait-i-dont-want-to-test-pitch-accent).
-->


# How do I change the default value of a binary field?
In Yomichan Format, you can simply toggle the field.
Any new card that is created will now default to that default value.

Of course, this will not affect existing cards.
To change existing cards, I recommend using something to bulk-edit
your cards.
I recommend [This add-on](https://ankiweb.net/shared/info/291119185)
to do just that.

(TODO write a way with python)


**Note**: <br>
You technically have a second option, and that is to change the code itself
(i.e. flip `#` with `^` for the desired field).
However, you should only do this if you know what you are doing,
and are fine with knowing you may lose those changes
if you update this note.


<!--
You have two main options:

**Option A:** You can simply fill the field in Yomichan.
When any new card is created, the option will be defaulted to true.

If you have many existing cards that you want to change,
this approach will then require batch changes to the cards.
To do Anki batch editing, you can either use [plugins](a) or do python scripting.

I personally use the latter, with some example scripts here (TODO).


**Option B:** To completely change the default value without requiring to fill the field,
you can rename the field to make more sense and swap all instances of `#` with `^`, and visa versa.
For example, if your goal is to make the cards a sentence card by default,
here are the following steps:
* Rename the field `IsSentenceCard` →  `IsVocabCard`
* Replace all instances of `{{#IsVocabCard}}` →  `{{^IsVocabCard}}`
* Replace all instances of `{{^IsVocabCard}}` →  `{{#IsVocabCard}}`
-->

# The sentence quotes are on completely different lines!
If your card looks like this:



# The Show/Hide button doesn't do anything.
The show/hide button requires that the displayed sentence has a bolded element.
For example, this means if the currently displayed sentence comes from the `AltDisplay`
field and nothing in that field is bolded, then the show/hide button will do nothing.


# What is the point of the `PASilence` field?
It's a hack to not play audio even if you setup your Anki client to do so.
See the `PASilence` field in the [field reference](usage#anki-field-reference) for more information.


# The replay audio button plays the sentence, word, and then sentence.
This is playing the audio from the front of the card,
and then the back of the card, in sequence.
To fix it so you only hear the audio displayed in the back of the card,
go to:

`Decks` (main anki browser) <br>
→  The gear beside your deck <br>
→  `Options` <br>
→  `Audio` section <br>
→  Toggle `Skip question when replaying answer`

<!--
This is a bug related to the above.
Unfortunately, I can't find another way to selectively suppress audio from playing,
so the bug is here to stay until a better solution is found.
-->


# Pitch accent bold doesn't work on the last downstep
- TODO
- weird quirk with css injector
- only solution I know of atm is to edit the raw html and move the `</b>` to the very end of the html


# What card type should I use?
The short answer is: whichever one you want. :)

The long answer is: whichever one you want,
because everyone has their own preferences on what card types they like.
I recommend being open about it and experiment with them, to see which one you like.


<!--
See here (TODO link to card types page)
Surprisingly, there's a lot of debate on this within the community.
In short,
[many](http://www.alljapaneseallthetime.com/blog/10000-sentences-why/)
[people](https://refold.la/roadmap/stage-2/a/basic-sentence-mining#Mine-Sentences-Not-Words)
prefer sentence cards, whereas
[many](https://learnjapanese.moe/guide/#mining)
[others](https://animecards.site/ankicards/#sentence-cards-vs-anime-cards)
prefer vocab cards.
Hell,
[some people](https://tatsumoto.neocities.org/blog/discussing-various-card-templates.html#targeted-sentence-cards-or-mpvacious-cards)
even use a funny combination of both.
Instead of giving a direct answer,
I would advise you to test all of them out to see which works best for you.
-->


<!--
I'm still not 100% sure what the best way to test pitch accent is,
so this section is removed until then

# How would I transition to test pitch accent with this note type?
Note that this answer is my personal opinion on how this should be done.

TODO
* starting to test pitch accent? (what I recommend) create separate cards
   * word -> word (and sentence if fully understood now)
   * sentence -> word/sentence
   * all future cards test word pitch accent

-->


# How do I use this note type as an Anime Card?
Anime Cards, as defined [here](https://animecards.site/ankicards/#anime-cardsword-context-cards),
are simply regular vocab cards with a non-collapsable hint field.
To use this as an Anime Card, follow the steps to make a vocab card ([here](cardtypes#vocab-card)),
and use the `HintNotHidden` field for your hint.


