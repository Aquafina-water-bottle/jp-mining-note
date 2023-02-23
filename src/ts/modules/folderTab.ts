import { RunnableModule } from "../module"
import { getOption } from "../options"


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

type FolderMenuEntry = {
  eleId: EleId;
  entryId: EntryId;
};

const ENTRIES: FolderMenuEntry[] = [
  {
    eleId: "primary_definition",
    entryId: "primary-definition",
  },
  {
    eleId: "secondary_definition_details",
    entryId: "secondary-definition",
  },
  {
    eleId: "additional_notes_details",
    entryId: "additional-notes",
  },
  {
    eleId: "extra_definitions_details",
    entryId: "extra-definitions",
  },
  {
    eleId: "extra_info_details",
    entryId: "extra-info",
  },
]

type FolderTabElements = {
  primaryDefBlockquoteEle: HTMLElement,
  menuInput: HTMLInputElement,
  btnLeft: HTMLElement,
  btnRight: HTMLElement,
}



export class FolderTab extends RunnableModule {

  // we store the actual HTML element instead of the raw HTML because the raw html string
  // will NOT preserve javascript event handlers
  private definitionStorage: Partial<Record<EntryId, HTMLElement>> = {};
  private availableEntries: FolderMenuEntry[] = [];
  private currentEntryId: EntryId = "primary-definition";

  constructor() {
    super('folderTab')
  }

  private updateButton(btn: HTMLElement, entry: FolderMenuEntry | null, eles: FolderTabElements) {
    // disable if null
    btn.classList.toggle("folder-tab__button--disabled", entry === null)

    if (entry === null) {
      btn.onclick = () => {}; // nothing
    } else {
      btn.onclick = () => {
        this.selectEntry(entry, eles)
      }
    }

  }

  private updateButtons(entry: FolderMenuEntry, eles: FolderTabElements) {
    // updates left/right buttons

    // finds location of entry in availableEntries
    const i = this.availableEntries.indexOf(entry);
    if (i === -1) {
      this.logger.debug(`cannot find entry: ${entry.entryId}`)
      return;
    }
    const prevEntry = i === 0 ? null : this.availableEntries[i-1];
    const nextEntry = i === this.availableEntries.length-1 ? null : this.availableEntries[i+1];

    this.updateButton(eles.btnLeft, prevEntry, eles);
    this.updateButton(eles.btnRight, nextEntry, eles);
  }

  private selectEntry(entry: FolderMenuEntry, eles: FolderTabElements) {

    if (this.currentEntryId === entry.entryId) {
      this.logger.debug(`cannot set to itself: ${entry.entryId}`);
      return; // do nothing
    }

    // clears out current text
    eles.primaryDefBlockquoteEle.innerHTML = "";

    const c = this.definitionStorage[entry.entryId];
    if (c) {
      eles.primaryDefBlockquoteEle.appendChild(c);
    }
    eles.menuInput.checked = false;

    this.currentEntryId = entry.entryId;
    this.updateButtons(entry, eles);
  }

  private setDisabled(entry: FolderMenuEntry) {
    const entryEle = document.getElementById(`folder_tab_menu_entry_${entry.entryId}`);
    if (entryEle !== null) {
      this.logger.debug(`setting ${entry.entryId} to disabled...`)
      entryEle.setAttribute("disabled", "true");
    }
  }

  /*
  - add the correct js handlers to close the menu button
  - disables buttons if necessary
type EntryId =   */
  populateFolderTab() {
    const primaryDefBlockquoteEle = document.getElementById("primary_definition") as HTMLElement | null;
    const menuInput = document.getElementById("folder_tab_button_menu_input") as HTMLInputElement | null;
    const btnLeft = document.getElementById("folder_tab_button_left") as HTMLElement | null;
    const btnRight = document.getElementById("folder_tab_button_right") as HTMLElement | null;
    if (!primaryDefBlockquoteEle || !menuInput || !btnLeft || !btnRight) {
      return; // something is null for some reason
    }

    const eles: FolderTabElements = {
      primaryDefBlockquoteEle: primaryDefBlockquoteEle,
      menuInput: menuInput,
      btnLeft: btnLeft,
      btnRight: btnRight,
    } as const;

    for (const entry of ENTRIES) {
      // this works since in the templates, the element is not assigned an id if greyed out / not shown
      const ele = document.getElementById(entry.eleId)
      if (ele === null) {
        this.setDisabled(entry);
        continue;
      }

      // exception for extra info since it's implemented differently in the templates
      if (entry.entryId === "extra-info" && ele.style.display === "none") {
        this.setDisabled(entry);
        continue;
      }

      // loads definitionStorage
      const blockquoteEle = ele.querySelector(".glossary-blockquote");
      if (blockquoteEle !== null) {
        this.definitionStorage[entry.entryId] = blockquoteEle.children[0] as HTMLElement;
      } else if (entry.entryId === "primary-definition") {
        // special case: primary_definition is itself a blockquote
        this.definitionStorage[entry.entryId] = ele.children[0] as HTMLElement;
      } else {
        this.logger.debug(`Cannot set glossary-blockquote from ${entry.eleId}`);
        return;
      }

      this.availableEntries.push(entry);

      const entryEle = document.getElementById(`folder_tab_menu_entry_${entry.entryId}`);

      if (entryEle) {
        entryEle.onclick = () => {
          this.selectEntry(entry, eles);
        }
      }
    }

    // hard codes current left/right buttons
    if (this.availableEntries.length > 0) {
      this.updateButtons(this.availableEntries[0], eles);
    }
  }


  main() {
    // TODO make sure this checks VW
    this.populateFolderTab();
  }
}
