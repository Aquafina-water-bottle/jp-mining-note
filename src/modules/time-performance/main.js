
/// {% set globals %}

var timePerformanceCache = nullish(timePerformanceCache, {});

/// {% endset %}






/// {% set functions %}

// =========
//  time-performance
// =========

const JPMNTimePerformance = (() => {

  const logger = new JPMNLogger("time-performance");
  const performanceLogLvl = ({{ utils.opt("modules", "time-performance", "debug-level") }});
  const roundPrecision = ({{ utils.opt("modules", "time-performance", "precision") }});
  const displayFull = ({{ utils.opt("modules", "time-performance", "display-full") }});

  const sortFuncs = {
    "mostRecent": (a, b) => -(timePerformanceCache[a].mostRecent - timePerformanceCache[b].mostRecent),

    /// {% if (note.side == "front") %}
    "currentSideAvg": (a, b) => -(timePerformanceCache[a].timeAvgFront - timePerformanceCache[b].timeAvgFront),
    /// {% else %}
    "currentSideAvg": (a, b) => -(timePerformanceCache[a].timeAvgBack - timePerformanceCache[b].timeAvgBack),
    /// {% endif %}

  }

  const sortFuncKey = {{ utils.opt("modules", "time-performance", "sort-func") }};

  const sortFunc = sortFuncs[sortFuncKey];

  class JPMNTimePerformance {
    constructor() {
      this.startTime = {}
    }

    start(id) {
      this.startTime[id] = performance.now()
    }

    stop(id) {
      const stopTime = performance.now()
      const timeTook = stopTime - this.startTime[id]

      let result = null;

      if (!(id in timePerformanceCache)) {
        timePerformanceCache[id] = {
          mostRecent: 0,
          timeAvgFront: 0,
          nFront: 0,
          timeAvgBack: 0,
          nBack: 0,
        }
      }

      result = timePerformanceCache[id];
      result.mostRecent = timeTook,

      /// {% if (note.side == "front") %}
      result.timeAvgFront += (timeTook - result.timeAvgFront) / (result.nFront + 1);
      result.nFront += 1;
      /// {% else %}
      // average formula but cooler
      result.timeAvgBack += (timeTook - result.timeAvgBack) / (result.nBack + 1);
      result.nBack += 1;
      /// {% endif %}
    }


    print(id) {
      let result = timePerformanceCache[id]

      let msg = ""

      if (displayFull) {
        let full = []

        msg += `${id}: `;

        full.push(`recent: ${result.mostRecent.toFixed(roundPrecision)}`);

        if (result.nBack) {
          full.push(`back: ${result.timeAvgBack.toFixed(roundPrecision)}: ${result.nBack}`);
        }
        if (result.nFront) {
          full.push(`front: ${result.timeAvgFront.toFixed(roundPrecision)}: ${result.nFront}`);
        }

        if (full.length) {
          msg += "(" + full.join(", ") + ")";
        }
      } else {

        if (sortFuncKey === "currentSideAvg") {
          /// {% if (note.side == "front") %}
          msg += `(${result.timeAvgFront.toFixed(roundPrecision)}: ${result.nFront})`;
          /// {% else %}
          msg += `(${result.timeAvgBack.toFixed(roundPrecision)}: ${result.nBack})`;
          /// {% endif %}
        } else {
          msg += `(${result.mostRecent.toFixed(roundPrecision)})`;
        }

        msg += ` ${id}`;

      }

      logger.debug(msg, performanceLogLvl);


    }

    dump() {
      if (sortFunc === null) {
        logger.warn("Invalid sort function");
        return;
      }

      for (const id of Object.keys(this.startTime).sort(sortFunc)) {
        this.print(id);
      }

    }

  }


  return JPMNTimePerformance;

})();

let TIME_PERFORMANCE = new JPMNTimePerformance();
TIME_PERFORMANCE.start("functions");


/// {% endset %}




