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



export class FolderTab extends RunnableModule {

  // we store the actual HTML element instead of the raw HTML because the raw html string
  // will NOT preserve javascript event handlers
  private definitionStorage: Partial<Record<EntryId, HTMLElement>> = {};
  private currentEntryId: EntryId = "primary-definition";

  constructor() {
    super('folderTab')
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
    const primaryDefBlockquoteEle = document.getElementById("primary_definition");
    const menuInput = document.getElementById("folder_tab_button_menu_input") as HTMLInputElement | null;

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

      const entryEle = document.getElementById(`folder_tab_menu_entry_${entry.entryId}`);
      if (primaryDefBlockquoteEle && entryEle) {
        entryEle.onclick = () => {

          if (this.currentEntryId === entry.entryId) {
            this.logger.debug(`cannot set to itself: ${entry.entryId}`);
            return; // do nothing
          }

          // clears out current text
          primaryDefBlockquoteEle.innerHTML = "";

          const c = this.definitionStorage[entry.entryId];
          if (c) {
            primaryDefBlockquoteEle.appendChild(c);
          }

          if (menuInput) {
            menuInput.checked = false;
          }

          this.currentEntryId = entry.entryId;
        }
      }
    }
  }


  main() {
    // TODO make sure this checks VW
    this.populateFolderTab();
  }
}
