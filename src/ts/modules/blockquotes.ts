import { cardIsNew } from '../isNew';
import { RunnableModule } from '../module';
import { checkOptTags, getOption } from '../options';
import { getTags } from '../utils';

type EntryId =
  | 'primary-definition'
  | 'secondary-definition'
  | 'additional-notes'
  | 'extra-definitions'
  | 'extra-info';

type HideFirstLineMode = 'show' | 'first-line' | 'extra-text' | 'tags' | 'none';

type RemoveListMode = 'always' | 'never' | 'on-singular';

const ENTRIES = [
  {
    optionId: 'primaryDefinition',
    eleId: 'primary_definition',
    entryId: 'primary-definition',
    buttonId: 'folder_tab_button_primary_def',
    inputId: 'folder_tab_input_primary_def',
    checkboxTextId: 'folder_tab_text_primary_def',
  } as const,
  {
    optionId: 'secondaryDefinition',
    eleId: 'secondary_definition_details',
    entryId: 'secondary-definition',
    buttonId: 'folder_tab_button_secondary_def',
    inputId: 'folder_tab_input_secondary_def',
    checkboxTextId: 'folder_tab_text_secondary_def',
  } as const,
  {
    optionId: 'additionalNotes',
    eleId: 'additional_notes_details',
    entryId: 'additional-notes',
    buttonId: 'folder_tab_button_additional_notes',
    inputId: 'folder_tab_input_additional_notes',
    checkboxTextId: 'folder_tab_text_additional_notes',
  } as const,
  {
    optionId: 'extraDefinitions',
    eleId: 'extra_definitions_details',
    entryId: 'extra-definitions',
    buttonId: 'folder_tab_button_extra_def',
    inputId: 'folder_tab_input_extra_def',
    checkboxTextId: 'folder_tab_text_extra_def',
  } as const,
  {
    optionId: 'extraInfo',
    eleId: 'extra_info_details',
    entryId: 'extra-info',
    buttonId: 'folder_tab_button_extra_info',
    inputId: 'folder_tab_input_extra_info',
    checkboxTextId: 'folder_tab_text_extra_info',
  } as const,
] as const;

type BlockquoteEntry = (typeof ENTRIES)[number];

const smallDotPath =
  'M 12,14 C 11.45,14 10.979333,13.804 10.588,13.412 10.196,13.020667 10,12.55 10,12 10,11.45 10.196,10.979 10.588,10.587 10.979333,10.195667 11.45,10 12,10 c 0.55,0 1.021,0.195667 1.413,0.587 C 13.804333,10.979 14,11.45 14,12 14,12.55 13.804333,13.020667 13.413,13.412 13.021,13.804 12.55,14 12,14 Z';

type FolderTabElements = {
  primaryDefBlockquoteEle: HTMLElement;
  //menuInput: HTMLInputElement;
  //btnLeft: HTMLElement;
  //btnRight: HTMLElement;
};

function openDetailsTag(ele: HTMLDetailsElement) {
  ele.setAttribute('open', 'true');
}

export class Blockquotes extends RunnableModule {
  // we store the actual HTML element instead of the raw HTML because the raw html string
  // will NOT preserve javascript event handlers
  private definitionStorage: Partial<Record<EntryId, HTMLElement>> = {};
  private availableEntries: BlockquoteEntry[] = [];
  //private currentEntryId: EntryId = 'primary-definition';
  private readonly showDotWhenEmpty = getOption('blockquotes.folderTab.showDotWhenEmpty');
  private readonly folderTabMode = getOption('blockquotes.folderTab.mode');

  constructor() {
    super('blockquotes');
  }

  private selectEntry(entry: BlockquoteEntry, eles: FolderTabElements) {
    if (this.folderTabMode === 'unique') {
      // clears out current text
      eles.primaryDefBlockquoteEle.innerHTML = '';
      const c = this.definitionStorage[entry.entryId];
      if (c) {
        eles.primaryDefBlockquoteEle.appendChild(c);
      }
    } else {
      const inputEle = document.getElementById(entry.inputId) as HTMLInputElement | null;
      if (inputEle === null) {
        // shouldn't happen
        return;
      }

      if (entry.entryId === 'primary-definition') {
        // exception to maintain html format
        document
          .getElementById('primary_definition_wrapper')
          ?.classList.toggle('hidden', inputEle.checked);
      } else {
        // standard
        const checkboxTextEle = document.getElementById(entry.checkboxTextId);
        if (checkboxTextEle === null) {
          // shouldn't happen
          return;
        }
        checkboxTextEle.classList.toggle('hidden', inputEle.checked);
      }
    }
  }

  private setDisabled(entry: BlockquoteEntry) {
    const entryEle = document.getElementById(entry.inputId);
    if (entryEle !== null) {
      this.logger.debug(`setting ${entry.entryId} to disabled...`);
      (entryEle as HTMLInputElement).disabled = true;
    }

    if (this.showDotWhenEmpty) {
      const buttonEle = document.getElementById(entry.buttonId);
      if (buttonEle) {
        // svg -> path
        buttonEle.children[0].children[0].setAttribute('d', smallDotPath);
      }
    }
  }

  populateFolderTab() {
    const primaryDefBlockquoteEle = document.getElementById(
      'primary_definition'
    ) as HTMLElement | null;

    if (!primaryDefBlockquoteEle) {
      return; // something is null for some reason
    }

    // in case we ever need to pass in elements
    const eles: FolderTabElements = {
      primaryDefBlockquoteEle: primaryDefBlockquoteEle,
    } as const;

    for (const entry of ENTRIES) {
      // this works since in the templates, the element is not assigned an id if greyed out / not shown
      const ele = document.getElementById(entry.eleId);
      if (ele === null) {
        // shouldn't happen
        this.setDisabled(entry);
        continue;
      }

      if (this.folderTabMode === 'multiple') {
        const inputEle = document.getElementById(entry.inputId);
        if (inputEle !== null) {
          (inputEle as HTMLInputElement).type = 'checkbox';
        }
      }

      // exception for extra info since it's implemented differently in the templates
      if (
        entry.entryId === 'extra-info' &&
        document
          .getElementById('extra_info_outer_display')
          ?.classList.contains('outer-display2')
      ) {
        this.setDisabled(entry);
        continue;
      }

      // loads definitionStorage
      const blockquoteEle = ele.querySelector('.glossary-blockquote');
      if (blockquoteEle !== null) {
        this.definitionStorage[entry.entryId] = blockquoteEle.children[0] as HTMLElement;
      } else if (entry.entryId === 'primary-definition') {
        // special case: primary_definition is itself a blockquote
        this.definitionStorage[entry.entryId] = ele.children[0] as HTMLElement;
        if (ele.classList.contains('hidden')) {
          this.setDisabled(entry);
          continue; // is not actually available
        }
      } else {
        this.logger.debug(`Cannot set glossary-blockquote from ${entry.eleId}`);
        return;
      }

      if (this.folderTabMode === 'multiple') {
        // loads into the text divs beforehand
        const checkboxTextEle = document.getElementById(entry.checkboxTextId);
        const c = this.definitionStorage[entry.entryId];

        if (entry.entryId !== 'primary-definition' && checkboxTextEle !== null && c) {
          checkboxTextEle.appendChild(c);
        }
      }

      this.availableEntries.push(entry);

      const buttonEle = document.getElementById(entry.buttonId);

      if (buttonEle) {
        buttonEle.onclick = () => {
          this.selectEntry(entry, eles);
        };
      }
    }

    // hard codes current left/right buttons
    if (this.availableEntries.length > 0) {
      // edge case: when nothing is shown in the primary definition,
      // but others are available
      const primaryDefEle = document.getElementById(ENTRIES[0].eleId);
      primaryDefEle?.classList.toggle('glossary-primary-definition--folder-tab', true);
      primaryDefEle?.classList.toggle('hidden', false); // shows regardless

      this.selectEntry(this.availableEntries[0], eles);
      const firstInputEle = document.getElementById(
        this.availableEntries[0].inputId
      ) as HTMLInputElement | null;
      if (firstInputEle !== null) {
        firstInputEle.checked = true; // so it's visually checked
      }
    } else {
      // horrible edge case: no tabs to show
      document
        .getElementById('dh_left')
        ?.classList.toggle('dh-left--no-folder-tabs', true);
    }

    if (this.showDotWhenEmpty) {
      const blockquotesEle = document.getElementById('folder_tab');
      blockquotesEle?.classList.toggle('folder-tab--show-when-empty', true);
    }
  }

  private openBlockquotes(mode: 'open' | 'openOnNew') {
    if (getOption('blockquotes.folderTab.enabled')) {
      if (getOption('blockquotes.folderTab.mode') === 'multiple') {
        // AND check number

        // TODO combine logic with if new
        for (const entry of ENTRIES) {
          if (getOption(`blockquotes.${mode}.${entry.optionId}`)) {
            const buttonEle = document.getElementById(entry.buttonId);
            // TODO check if input is already open (to avoid closing things)
            if (buttonEle !== null) {
              buttonEle.click();
            }
          }
        }
      } else {
        // TODO check number
        for (const entry of ENTRIES) {
          if (getOption(`blockquotes.${mode}.${entry.optionId}`)) {
            this.logger.warn(
              `Cannot open ${entry.optionId} by default if blockquotes.folderTab.mode is not 'multiple'`
            );
          }
        }
      }
    } else {
      // default
      for (const entry of ENTRIES) {
        if (getOption(`blockquotes.${mode}.${entry.optionId}`)) {
          const ele = document.getElementById(entry.eleId);

          // check for nodeName to handle primaryDef edge case
          // TODO what if primary definition does have a details tag?
          if (ele !== null && ele.nodeName === 'DETAILS') {
            openDetailsTag(ele as HTMLDetailsElement);
          }
        }
      }
    }
  }

  private async attemptOpenBlockquotesNew() {
    if (await cardIsNew('back')) {
      this.openBlockquotes('openOnNew');
    }
  }

  private getParseFirstLineMode(
    modeType: 'primaryDefinition' | 'secondaryDefinition' | null
  ): HideFirstLineMode {
    let defaultMode = getOption(`blockquotes.simplifyDefinitions.hideFirstLineMode`);

    if (modeType !== null) {
      const lineMode = checkOptTags(getTags(), [
        [
          `blockquotes.simplifyDefinitions.tagOverride.${modeType}.hideFirstLine`,
          'first-line',
        ],
        [`blockquotes.simplifyDefinitions.tagOverride.${modeType}.showFirstLine`, 'show'],
      ]);

      if (lineMode !== undefined) {
        return lineMode;
      }
    }

    return defaultMode as HideFirstLineMode;
  }

  // hides the first line (or parts of it)
  private parseFirstLine(
    eleId: string,
    lineMode: HideFirstLineMode,
    dictsOverride: Record<string, string>
  ) {
    const ele = document.getElementById(eleId);
    if (ele === null) {
      return;
    }
    for (const liEle of ele.querySelectorAll('ol li[data-details]')) {
      const dictName = liEle.getAttribute('data-details');

      // attempts to get dictsOverride[dictName], fallsback to lineMode
      const dictMode = dictName === null ? lineMode : dictsOverride[dictName] ?? lineMode;

      if (dictMode === 'first-line') {
        ele.classList.add('glossary-blockquote--hide-first-line');
      } else if (dictMode === 'tags') {
        ele.classList.add('glossary-blockquote--hide-tags');
      } else if (dictMode === 'extra-text') {
        ele.classList.add('glossary-blockquote--hide-extra-text');
      } else if (dictMode === 'show') {
        ele.classList.add('glossary-blockquote--show');
      } // "none" is ignored
    }
  }

  // hides the list numbers if necessary
  private attemptHideList(removeListMode: 'always' | 'on-singular') {
    const ele = document.getElementById('primary_definition');
    if (ele === null) {
      return;
    }

    if (removeListMode === 'always') {
      ele.classList.add('glossary-blockquote--hide-list-numbers');
    }

    if (removeListMode === 'on-singular') {
      const eleText = document.getElementById('primary_definition_raw_text');
      const len = eleText?.querySelectorAll('ol > li').length;
      if (len && len == 1) {
        // found only one li element
        ele.classList.add('glossary-blockquote--hide-list-numbers');
      }
    }
  }

  private parseFirstLines() {
    const dictsOverride = getOption(
      'blockquotes.simplifyDefinitions.dictsOverride.hideFirstLineMode'
    );

    this.parseFirstLine(
      'primary_definition',
      this.getParseFirstLineMode('primaryDefinition'),
      dictsOverride
    );
    this.parseFirstLine(
      'secondary_definition_details',
      this.getParseFirstLineMode('secondaryDefinition'),
      dictsOverride
    );
    this.parseFirstLine(
      'extra_definitions_details',
      this.getParseFirstLineMode(null),
      dictsOverride
    );

    const removeListMode = getOption(
      'blockquotes.simplifyDefinitions.removeListMode'
    ) as RemoveListMode;
    if (removeListMode !== 'never') {
      this.attemptHideList(removeListMode);
    }
  }

  main() {
    // only ran on back side, according to main.ts

    if (getOption('blockquotes.hideEmpty')) {
      for (const ele of document.querySelectorAll('.glossary-details--grey')) {
        ele.classList.add('hidden');
      }
    }

    // note that the default options specifically disables this on non-mobile devices! (VW >= 620)
    if (getOption('blockquotes.folderTab.enabled')) {
      this.populateFolderTab();
    }

    if (getOption('blockquotes.simplifyDefinitions.enabled')) {
      this.parseFirstLines();
    }

    if (getOption('blockquotes.open.enabled')) {
      this.openBlockquotes('open');
    }
    if (getOption('blockquotes.openOnNew.enabled')) {
      this.attemptOpenBlockquotesNew();
    }
  }
}
