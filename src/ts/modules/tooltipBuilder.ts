import { Module } from "../module"
import { getOption } from "../options"
import { AutoPitchAccent, AutoPitchAccentArgs } from "./autoPitchAccent";
import { SentenceParser } from "./sentenceParser";

export type TooltipBuilderArgs = {
  displayPA?: boolean;
  displayPAOnHover?: boolean;
};


export class TooltipBuilder extends Module {
  private readonly autoPA: AutoPitchAccent;
  private readonly sentParser: SentenceParser

  private readonly displayPA: boolean;
  private readonly displayPAOnHover: boolean;

  constructor(args?: TooltipBuilderArgs) {
    super("sm:tooltipBuilder");

    const paArgs: AutoPitchAccentArgs = {
      attemptGlobalColor: false,
      showTitle: false,
      removeNasal: true,
    }
    this.autoPA = new AutoPitchAccent("tb:autoPitchAccent", paArgs);

    this.sentParser = new SentenceParser("tb:sentenceParser");

    this.displayPA = args?.displayPA ?? true;
    this.displayPAOnHover = args?.displayPAOnHover ?? true;
  }

  main() {
    // ...
  }
}
