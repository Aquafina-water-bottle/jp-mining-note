
# Creating the Cards
I use a texthooker setup, which is able to extract subtitles or text into the browser.
Once the text is on the browser, you can use Yomichan to select the word and create the
Anki card.
This texthooker setup works for most games, and any show with subtitle file.
The texthooker process has already been explained in great detail by
many other smart people in the following links:
* [Texthooker basics](https://rentry.co/mining#browser)
* [Texthooker basics & Visual Novels](https://learnjapanese.moe/vn/#playing-visual-novels-to-learn-japanese)

The setup also works with video files if the video player supports automated copying of subtitles,
and if you have the correct subtitle files.
* MPV with either mpvacious or Immersive plugins supports this workflow, as detailed in the next section.
* Many anime subtitle files can be found under
[kitsuneko](https://kitsunekko.net/dirlist.php?dir=subtitles%2Fjapanese%2F).



## Automating Pictures and Sentence Audio
Yomichan is able to automatically generate everything EXCEPT the pictures and sentence audio
from the media you are watching.
Fortunately, exactly that can be automated as well.
However, the tools to automate that will likely be slightly different for each individual
user as it depends on their desired workflow.
Instead of walking you through how to get these to work,
I will instead provide a list of resources you can use.



#### [mpvacious](https://github.com/Ajatt-Tools/mpvacious)
* Cross platform plugin for [MPV](https://mpv.io/), a media player.
* Given a subtitle file for a movie file, it can automatically add sentence audio and images with one `Ctrl+n` command.
* I personally use this.

#### [Immersive](https://github.com/Ben-Kerman/immersive)
* A powerful alternative to the mpvacious plugin above, with certain different capabilities.
* Can also be used to automatically extract sentence audio and pictures.

#### [asbplayer](https://github.com/killergerbah/asbplayer)
* Cross platform browser video player.
* This also has card image and audio exporting capabilities.

#### [ShareX](https://getsharex.com/)
* Windows media recorder which can both take screenshots and record audio.
* This can be automated to add audio and pictures to the most recently added anki card
  by following the instructions
  [here](https://rentry.co/mining#sharex).
* Useful for things that don't have an easy way of getting audio, such as visual novels.
* I personally use this.

#### [ames](https://github.com/eshrh/ames)
* ShareX alternative for Linux.
* Primarily used to automate audio and picture extraction to the most recently added anki card.
* I personally use this.

#### [Ankiconnect for Android](https://github.com/KamWithK/AnkiconnectAndroid)
* Allows the standard mining workflow for Android, including with Yomichan.

#### [jidoujisho](https://github.com/lrorpilla/jidoujisho)
* Android reader and media player, which can also create Anki cards.
* Note that this app does not use Yomichan, which means that certain fields may not be filled automatically



# Test What You Want: Card Options and Editing

## Definitions used
**Binary Field:**
A field that checks whether it is filled or not with any value, say `1`.
The default is implied by the name of the field, and a value of "true" means that the field is filled.
For example, the `IsSentenceCard` field will turn the card into a sentence card if filled.
If it is not filled, then the card will be a word card.
To fill a field automatically, see here (TODO).

**Note vs Card** (Anki fundamentals):
In a nutshell, a note is a collection of fillable fields.
One note can create multiple cards, and cards are the actual things you see and study off of.
See the official Anki documentation
[here](https://docs.ankiweb.net/getting-started.html#key-concepts)
for additional information.

**PA:** Short for "Pitch Accent".


## What on earth am I looking at!?
There are many things displayed by default just on the front side alone,
so I would like to first go through how I personally use these.

(TODO picture of a vocab card, front side)

Breaking down the components of the above card:
* The green circle indicates if and how I should test the pitch accent. This is explained in a later section.
* The audio button plays the entire sentence audio.
* There is a collapsible field to show the entire sentence, with its furigana readings.

To mark a card as correct, **NEITHER** the audio button and show entire sentence field should
be used to assist in your answer. The reason why I have these in the front is because
if I have an answer that I'm not confident in, or if this is the first time I see the card,
I use these fields to test my hearing before I flip the card and see the true answer on the back side.

If that is not useful for you, you are free to ignore or remove those sections entirely
in your note type.


(TODO picture of a vocab card, back side)


The backside is mostly self explanatory. We note the following features:
* Images are zoomable by clicking on them.
* Furigana can be shown by hovering over the full sentence.
* Due to the initial Yomichan field setup, the tested word is automatically highlighted.
* All bolded entries in the definition are also highlighted, to make the bolded content stand out more.
* Many collapsible fields exist to reduce vertical space usage.


## Modifying the Front Side


#### Sentence or vocab cards?
With this note type, you can test either the **entire sentence** or **just the word** itself.
By default, the card tests just for the word, and it can be changed to a sentence card
by toggling the `IsSentenceCard` field.


(TODO) picture of vocab vs sentence cards


#### Full control over the display
Vocab cards show the `Word` field and sentence cards show the `Sentence` fields by default.
However, you can modify what is exactly shown in the front by using the `AltDisplay` field.
For example, I personally use the `Sentence` field to contain text for the entire audio clip.
If I want to test only a portion of the sentence, I put what I want to test into the `AltDisplay` field.


(TODO) picture of difference between sentence


One nice feature is that the AltDisplay has hoverable furigana text enabled by default.
I personally use this to insert furigana for certain names, since I'm usually not
testing myself on how to read a name.


(TODO) picture of furigana over a name


Similarly, if you are using a vocab card, you can use `AltDisplay`
to show something that differs from the `Word` field.


#### Hints
Finally, you can include a customized hint to show at the front of the card, by using the `Hint` field.
This will show as a collapsible field at the front of card.

(TODO) picture of a hint field



## Modifying the Back Side
Not much has to be said about modifying the back side of the card.

The `PrimaryDefinition` field contains the main content, and should be the main field to edit
if one wants to put down more notes about the card.

The `AdditionalNotes` field is useful if you want to put down even more notes,
but keep it in a collapsible field to reduce vertical space.
I personally use it to write down the context of the scene, among other things.



#### Furigana Syntax
The `SentenceReading` field has automatically generated furigana, which can be incorrect at times.
Editing furigana is simple; the syntax for furigana is straight forward
and is best shown with examples:

`不審者[ふしんしゃ]` →  <ruby>不審者<rt>ふしんしゃ</rt></ruby>

`怪[あや]しげな 悪魔[あくま]` →  <ruby>怪<rt>あや</rt></ruby>しげな<ruby>悪魔<rt>あくま</rt></ruby>

Notice that a space is required to the left of the first kanji to indicate what characters the furigana goes over. If there is no space, the second example will look like the following:
<ruby>怪<rt>あや</rt></ruby><ruby>しげな悪魔<rt>あくま</rt></ruby>





## Testing Pitch Accent
This note type provides many options to target exactly what parts of pitch accent
you want to test yourself on. Let's start out with the basics...

#### "Wait, I don't want to test pitch accent!!"

If you do not want to test pitch accent,
all you have to do is fill the `PADoNotShowInfoLegacy` by default.
This will remove the PA indicator at the front of the card,
and you can now safely ignore this entire section.

#### "I want to make a transition to test pitch accent at some point..."

See (TODO) on how I recommend exactly this.


#### Of course I want to test pitch accent!"

Great! There are two main levels of pitch accent that can be tested with this note,
and that is word level and sentence level pitch accent.
How this card indicates what pitch accent is tested is by the PA indicator, which is a colored circle
to the left of the sentence or word.

(picture)

Here are what the colors represent:

* **Green:** the entire display is tested.
  For example, if a sentence is displayed and the PA indicator is green,
  then sentence level pitch accent is tested.
  If a word is displayed, then the word pitch accent is tested.
* **Blue:** Only the word is tested within the sentence.
  To see the word that is tested, there is a button to toggle whether the word is highlighted or not.
  The word that is highlighted is exactly what is bolded in the `Sentence`
  (or `AltDisplay` / `AltDisplayPASentenceCard`) field.
* **Red:** Pitch accent should not be tested in any way.

If you ever forget what the colors mean, you can hover your mouse over the circle to
get a description of what is being tested.

(TODO picture)

Finally, here is how to select what pitch accent being tested:
* By default, the entire display is tested.
* To test just the word pitch accent, fill the `PATestOnlyWord` field.
* To create completely separate cards to just test pitch accent on,
  use the fields `PASeparateSentenceCard` and/or `PASeparateWordCard`.
* **NOTE:** if a PA word card is created, then the default card does not test pitch accent.
  Similarly, if a PA sentence card is created, then the default card only tests the word pitch accent.


##### What Pitch Accent is tested (summary)
The following shows the logic of how pitch accent is tested:
(TODO flowchart instead of if statements)
```
if (PADoNotShowInfoLegacy):
    - Pitch accent indicator is COMPLETELY REMOVED.
else if (PADoNotTest || PASeparateWordCard):
    - Pitch accent Indicator: Do not test pitch accent
else if (PATestOnlyWord || PASeparateSentenceCard):
    - Pitch accent Indicator: Test word level pitch accent
else:
    - Pitch accent Indicator: Test sentence level pitch accent (default value)
```


##### Modifying Pitch Accent
Editing the content in `WordPitch` requires some special attention.
To preserve the style and get expected results, you must use `Ctrl + Shift + x` when editing the field,
and edit the html tags directly. Use other cards as examples of what the html should look like.

The `WordPitch` field may have more than one pitch accent for a given word.
To choose which pitch accent is correct to the sentence,
one can bold the unused pitch accents to grey them out.
See below on what this looks like: (TODO)


## Cloze Deletion Cards
TODO


## Miscellaneous Notes
* The contents of `Comment` does not appear in any card.
  You can use this to write down anything that you don't want to be shown in any card.
* The `Positions` field is populated with the pitch accent positions
  (indicates the mora of which the downstep happens).
  Although filled, this is currently UNUSED, and can be safely removed without any adverse effects.
* You might have noticed that there are multiple fields to display pitch accent.
  The main field that is used is the `WordPitch` field,
  because it is the easiest to edit.
  The reason for the other fields (`Graph` and `Position`) is to confirm that the
  pitch accent generated in `WordPitch` is "correct", in case of any doubts.


## Anki Field Reference
The following table provides a quick reference of what each field does.
If you are new to this card format, I recommend reading the above sections first
to better understand how the cards can be edited in the first place.

Notice: **bolded** fields are fields that are automatically filled,
and fields marked with a `*` are binary fields that can be customized by the user.

|  Anki Fields               | Yomichan Format |
|----------------------------|-----------------|
| **Word**                   | The tested word |
| **WordReading**            | Tested word with hiragana readings |
| **WordPitch**              | Word pitch info generated by the "AJT Pitch" Accent plugin |
| **PrimaryDefinition**      | The first group of definitions, shown automatically at the back of the card. I usually add to this field to place any information necessary to understand the card. |
| **Sentence**               | The full sentence. The tested word is indicated automatically by bolding being bolded. To test more than one word, bold more words. |
| **SentenceReading**        | The above sentence with furigana automatically generated from the "AJT Furigana" plugin. |
|  AltDisplay                | An alternate display for either the word or sentence card. Use this to override what is shown in the front of the card. |
|  AltDisplayPASentenceCard  | Equivalent to the above, specifically for the Sentence Pitch Accent card (if it exists). |
|  AdditionalNotes           | A collapsible field to place text that you don't want to show up automatically in the back side of the card. This is to save vertical scrolling space used by the PrimaryDefinition field. I use this to field to write down the context of the scene, miscellaneous grammar notes, etc. |
|  Hint                      | A collapsible field shown at the front of the card. |
| *IsSentenceCard            | Whether the card tests the entire sentence or word. <br> *Default:* Tests only the word (i.e. the default card is a vocab card). |
| *PASeparateWordCard        | Whether we create another card to test just the pitch accent of the word. Also sets the PA Indicator of the main card to not test anything. <br> *Default:* No. |
| *PASeparateSentenceCard    | Whether we create another card to test the pitch accent of the entire sentence. Also sets the PA Indicator of the main card to test only the word. <br> *Default:* No. |
| *PATestOnlyWord            | Whether we test the pitch accent of only the word. <br> *Default:* No. (We test the pitch accent of the entire sentence or word ⸺   as according to `IsSentenceCard`)|
| *PADoNotTest               | Sets the PA indicator to not test anything. <br> *Default:* False. (We do indeed test the pitch accent) |
| *PADoNotShowInfoLegacy     | Completely removes the PA indicator. In other words, pitch accent is completely ignored, and implicitly goes untested. <br> *Default:* False (the PA indicator is always present). |
| *SeparateClozeDeletionCard | Whether we create another card to test just the hearing of the word. <br> *Default:* No. |
| **Picture**                | Extracted / cusotm photo of the scene |
| **WordAudio**              | Yomichan generated word audio |
| **SentenceAudio**          | Extracted sentence audio. Can be blank |
| **Graph**                  | Pitch accent graphs |
| **Position**               | Pitch accent positions (which mora contains the downstep). <br> NOTE: This field is currently unused. |
| **PASilence**              | Should be exactly `[sound:silence.wav]`. This field is present specifically to utilize an Anki hack to not automatically play audio, overriding the deck preferences if it says that audio is automatically played. **DO NOT CHANGE THIS!** |
| **SecondaryDefinition**    | Secondary group of definitions, in a collapsible field, if it exists. Useful for monolingual transitions. |
| **ExtraDefinitions**       | Any other extra definitions, in a collapsible field, if it exists. |
|  Comment                   | Text that is not shown in any card. This is a place where you can write down notes without affecting the card itself. |





# Customization
TODO add further details
TODO put this in some other document

## Changing default value for a binary field
* option A: rename field, swap `#` and `^` in card type
* option B: just default in yomichan
  * may require batch scripting to change existing cards, TODO show sample python code of batch scripting

## Customization Tips
* not testing pitch accent? set `PADoNotShowInfoLegacy` to filled (or change default value)
* Want to make the default card a sentence card? Change default value of `IsSentenceCard`.
* starting to test pitch accent? (what I recommend) create separate cards
   * word -> word (and sentence if fully understood now)
   * sentence -> word/sentence
   * all future cards test word pitch accent
* Remember that anki cards are fully customizable!
   Feel free to use as much or as little of of my cards as you want!



# Other

## Anki Tips
* how to remove empty cards (link to anki)
* editing a field's html: ctrl+shift+x
* want to add a duplicate word? Change the `Word` field to something different and add the card
   * If the card was a vocab card, make sure to change the `AltDisplay` field to match the word

## Other Resources
* animecards site
* themoeway -> yomichan section
* https://ankiweb.net/shared/info/1557722832
* https://github.com/Ajatt-Tools/AnkiNoteTypes

