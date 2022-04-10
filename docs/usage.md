
# Creating the Cards
* texthooker setup: https://rentry.co/mining
* use texthooker with yomichan to create all cards
* can alternatively use yomichan search page


## Automating Pictures and Sentence Audio
* TODO link a butt load of resources here and explain them a bit
* TODO link backups just in case (i.e. webarchive)
* TODO explain each link properly and all



https://github.com/Ajatt-Tools/mpvacious
* cross platform, mpv plugin
* automatically adds audio and image to card based off of subtitles

https://github.com/killergerbah/asbplayer
* cross platform, browser video player
* personally don't use it but it also has automatic audio / image adding capabilities

https://rentry.co/mining
* windows, sharex
* details correct sharex setup in said link
* useful for things that don't have an easy way of getting audio such as visual novels
* also has details on how to setup multiple other workflows in full, VERY USEFUL

https://github.com/eshrh/ames
* linux, sharex alternative
* useful as an alternative to the above

https://github.com/lrorpilla/jidoujisho
* android, can create anki cards
* never personally used it to create anki cards (yet), but other features look good




# Test What You Want: Card Options
* TODO alternate display field
   * optional furigana
   * word / sentence card
* TODO how to create different cards / set card type + pretty pictures
* TODO hint and additional notes

## Card Options: Default values


## Testing Pitch Accent
* TODO add details on how to test pitch accent with the colored indicators
* TODO hover over circle or look on top right if forget what the colors mean



# Customization
TODO add further details
TODO put this in some other document

## Changing default value for binary field
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

