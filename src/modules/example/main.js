
/// {% set functions %}

// =========
//  Example
// =========

const JPMNExample = (() => {

  const logger = new JPMNLogger("example");

  // private functions and variables here
  // ...

  class JPMNExample {
    constructor() {
      // ...
    }

    run() {
      logger.warn("Hello world!");
      // ...
    }
  }


  return JPMNExample;

})();

/// {% endset %}






/// {% set run %}

if ({{ utils.opt("modules", "example", "enabled") }}) {
  const example = new JPMNExample();
  example.run();
}

/// {% endset %}

