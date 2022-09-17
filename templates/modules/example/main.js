
/// {% set globals %}

// insert globals that will transfer between cards here (but also can disappear at any point)
// this section is best used for temporary caches
// ...

/// {% endset %}






/// {% set functions %}

// ================
//  example module
// ================



const JPMNExample = (() => {

  const logger = new JPMNLogger("example");

  // private functions and variables here
  // ...

  class JPMNExample {
    constructor() {
      // ...
    }

    run() {
      // ...
    }
  }


  return JPMNExample;

})();

/// {% endset %}






/// {% set run %}

if ({{ utils.opt("modules", "example", "enabled") }}) {
  const example = new JPMNExample()
  example.run();
}

/// {% endset %}

