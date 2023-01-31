import { RunnableAsyncModule } from "../module"
import { getOption } from "../options"
import { selectPersist, SPersistInterface } from '../spersist';

export class KanjiHover extends RunnableAsyncModule {

  private readonly persist: SPersistInterface | null;

  constructor() {
    super('kanjiHover')
    this.persist = selectPersist();
  }

  main() {
    // ...
  }
}
