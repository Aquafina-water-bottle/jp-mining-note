import { RunnableModule } from '../module';
import { getOption } from '../options';

type EleId =
  | 'primary_definition'
  | 'secondary_definition_details'
  | 'additional_notes_details'
  | 'extra_definitions_details'
  | 'extra_info_details';

type EntryId =
  | 'primary-definition'
  | 'secondary-definition'
  | 'additional-notes'
  | 'extra-definitions'
  | 'extra-info';

type ButtonId =
  | 'folder_tab_button_primary_def'
  | 'folder_tab_button_secondary_def'
  | 'folder_tab_button_additional_notes'
  | 'folder_tab_button_extra_def'
  | 'folder_tab_button_extra_info';

type InputId =
  | 'folder_tab_input_primary_def'
  | 'folder_tab_input_secondary_def'
  | 'folder_tab_input_additional_notes'
  | 'folder_tab_input_extra_def'
  | 'folder_tab_input_extra_info';

type CheckboxTextId =
  | 'folder_tab_text_primary_def'
  | 'folder_tab_text_secondary_def'
  | 'folder_tab_text_additional_notes'
  | 'folder_tab_text_extra_def'
  | 'folder_tab_text_extra_info';


type FolderMenuEntry = {
  eleId: EleId;
  entryId: EntryId;
  buttonId: ButtonId;
  inputId: InputId;
  checkboxTextId: CheckboxTextId;
};

const ENTRIES: FolderMenuEntry[] = [
  {
    eleId: 'primary_definition',
    entryId: 'primary-definition',
    buttonId: 'folder_tab_button_primary_def',
    inputId: 'folder_tab_input_primary_def',
    checkboxTextId: 'folder_tab_text_primary_def',
  },
  {
    eleId: 'secondary_definition_details',
    entryId: 'secondary-definition',
    buttonId: 'folder_tab_button_secondary_def',
    inputId: 'folder_tab_input_secondary_def',
    checkboxTextId: 'folder_tab_text_secondary_def',
  },
  {
    eleId: 'additional_notes_details',
    entryId: 'additional-notes',
    buttonId: 'folder_tab_button_additional_notes',
    inputId: 'folder_tab_input_additional_notes',
    checkboxTextId: 'folder_tab_text_additional_notes',
  },
  {
    eleId: 'extra_definitions_details',
    entryId: 'extra-definitions',
    buttonId: 'folder_tab_button_extra_def',
    inputId: 'folder_tab_input_extra_def',
    checkboxTextId: 'folder_tab_text_extra_def',
  },
  {
    eleId: 'extra_info_details',
    entryId: 'extra-info',
    buttonId: 'folder_tab_button_extra_info',
    inputId: 'folder_tab_input_extra_info',
    checkboxTextId: 'folder_tab_text_extra_info',
  },
];

const smallDotPath = "M 12,14 C 11.45,14 10.979333,13.804 10.588,13.412 10.196,13.020667 10,12.55 10,12 10,11.45 10.196,10.979 10.588,10.587 10.979333,10.195667 11.45,10 12,10 c 0.55,0 1.021,0.195667 1.413,0.587 C 13.804333,10.979 14,11.45 14,12 14,12.55 13.804333,13.020667 13.413,13.412 13.021,13.804 12.55,14 12,14 Z";

type FolderTabElements = {
  primaryDefBlockquoteEle: HTMLElement;
  //menuInput: HTMLInputElement;
  //btnLeft: HTMLElement;
  //btnRight: HTMLElement;
};

export class FolderTab extends RunnableModule {
  // we store the actual HTML element instead of the raw HTML because the raw html string
  // will NOT preserve javascript event handlers
  private definitionStorage: Partial<Record<EntryId, HTMLElement>> = {};
  private availableEntries: FolderMenuEntry[] = [];
  //private currentEntryId: EntryId = 'primary-definition';
  private readonly keepTabsWhenEmpty = getOption("folderTab.keepTabsWhenEmpty");
  private readonly mode = getOption("folderTab.mode");

  constructor() {
    super('folderTab');
  }

  private selectEntry(entry: FolderMenuEntry, eles: FolderTabElements) {
    if (this.mode === "unique") {
      // clears out current text
      eles.primaryDefBlockquoteEle.innerHTML = '';
      const c = this.definitionStorage[entry.entryId];
      if (c) {
        eles.primaryDefBlockquoteEle.appendChild(c);
      }
    } else {
      const inputEle = document.getElementById(entry.inputId) as HTMLInputElement | null;
      if (inputEle === null) { // shouldn't happen
        return;
      }

      if (entry.entryId === "primary-definition") { // exception to maintain html format
        document.getElementById("primary_definition_wrapper")?.classList.toggle("hidden", inputEle.checked);
      } else {
        // standard
        const checkboxTextEle = document.getElementById(entry.checkboxTextId);
        if (checkboxTextEle === null) { // shouldn't happen
          return;
        }
        checkboxTextEle.classList.toggle("hidden", inputEle.checked);
      }
    }


  }

  private setDisabled(entry: FolderMenuEntry) {
    const entryEle = document.getElementById(entry.inputId);
    if (entryEle !== null) {
      this.logger.debug(`setting ${entry.entryId} to disabled...`);
      (entryEle as HTMLInputElement).disabled = true;
    }

    if (this.keepTabsWhenEmpty) {
      const buttonEle = document.getElementById(entry.buttonId);
      if (buttonEle) {
        // svg -> path
        buttonEle.children[0].children[0].setAttribute("d", smallDotPath);
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
      if (ele === null) { // shouldn't happen
        this.setDisabled(entry);
        continue;
      }

      if (this.mode === "multiple") {
        const inputEle = document.getElementById(entry.inputId);
        if (inputEle !== null) {
          (inputEle as HTMLInputElement).type = "checkbox";
        }
      }

      // exception for extra info since it's implemented differently in the templates
      if (entry.entryId === 'extra-info' && document.getElementById("extra_info_outer_display")?.classList.contains("outer-display2")) {
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
        if (ele.classList.contains("hidden")) {
          this.setDisabled(entry);
          continue; // is not actually available
        }
      } else {
        this.logger.debug(`Cannot set glossary-blockquote from ${entry.eleId}`);
        return;
      }

      if (this.mode === "multiple") { // loads into the text divs beforehand
        const checkboxTextEle = document.getElementById(entry.checkboxTextId);
        const c = this.definitionStorage[entry.entryId];

        if (entry.entryId !== "primary-definition" && checkboxTextEle !== null && c) {
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
      const primaryDefEle = document.getElementById(ENTRIES[0].eleId)
      primaryDefEle?.classList.toggle("glossary-primary-definition--folder-tab", true);
      primaryDefEle?.classList.toggle("hidden", false); // shows regardless

      this.selectEntry(this.availableEntries[0], eles);
      const firstInputEle = document.getElementById(this.availableEntries[0].inputId) as HTMLInputElement | null;
      if (firstInputEle !== null) {
        firstInputEle.checked = true; // so it's visually checked
      }
    } else {
      // horrible edge case: no tabs to show
      document.getElementById("dh_left")?.classList.toggle("dh-left--no-folder-tabs", true);
    }

    if (this.keepTabsWhenEmpty) {
      const folderTabEle = document.getElementById("folder_tab");
      folderTabEle?.classList.toggle("folder-tab--show-when-empty", true)
    }

  }

  main() {
    // note that the default options specifically disables this on non-mobile devices! (VW >= 620)
    this.populateFolderTab();
  }
}
