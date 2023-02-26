import { getOption } from './options';

type LoggerArgsMsg = {
  isHtml?: boolean;
  //key?: string;
};

type LoggerArgs = LoggerArgsMsg & {
  //unique?: boolean;
  ignoreOptions?: boolean;
};

const leechClass = 'info-circle-leech';
const warnClass = 'info-circle-warning';
const errorClass = 'info-circle-error';

type ColorClass = typeof leechClass | typeof warnClass | typeof errorClass;

const debugGroupId = 'info_circle_text_debug';
const infoGroupId = 'info_circle_text_info';
const leechGroupId = 'info_circle_text_leech';
const warnGroupId = 'info_circle_text_warning';
const errorGroupId = 'info_circle_text_error';

type GroupId =
  | typeof debugGroupId
  | typeof infoGroupId
  | typeof leechGroupId
  | typeof warnGroupId
  | typeof errorGroupId;

export class Logger {
  private name: string | null;
  //private uniqueKeys: Set<string>;
  private readonly debugLevel: number;
  private readonly toConsole: boolean;
  private readonly debugConsoleLevel: number;

  constructor(name: string | null = null) {
    this.name = name;
    //this.uniqueKeys = new Set();
    this.debugLevel = getOption('logger.debugLevel');
    this.toConsole = getOption('logger.toConsole');
    this.debugConsoleLevel = getOption('logger.debugConsoleLevel');
  }

  debug(message: string, level: number = 3, args?: LoggerArgs) {
    //const debugToConsole = getOption('logger.consoleLevel');

    const onlyShowCertainModules = getOption('logger.debug.onlyShowCertainModules');
    const validModules = getOption('logger.debug.onlyShowCertainModules.modules') as (string | null)[];
    if (onlyShowCertainModules && !validModules.includes(this.name)) {
      return;
    }

    //if (level >= debugLevel) {
    //  if (debugToConsole) {
    //    let displayMsg: string = message;
    //    if (this.name !== null) {
    //      displayMsg = `(${this.name}) ${message}`;
    //    }
    //    console.log(displayMsg);
    //  } else {
    //    this.printMsg(message, debugGroupId, null, args);
    //  }
    //}

    const dispMsg = this.formatMsg(message);
    if (level >= this.debugLevel) {
      this.printMsg(dispMsg, debugGroupId, null, args);
    }
    if (this.toConsole && level >= this.debugConsoleLevel) {
      console.log(dispMsg)
    }

  }

  info(message: string, args?: LoggerArgs) {
    const dispMsg = this.formatMsg(message);
    this.printMsg(dispMsg, infoGroupId, null, args);
    if (this.toConsole) {
      console.info(dispMsg)
    }
  }

  warn(message: string, args?: LoggerArgs) {
    const dispMsg = this.formatMsg(message);
    if (this.toConsole) {
      console.warn(dispMsg)
    }

    if (!args?.ignoreOptions) {
      let ignoredWarns = getOption("logger.warn.ignore");
      for (let substr of ignoredWarns) {
        if (dispMsg.includes(substr)) {
          return;
        }
      }
    }

    this.printMsg(dispMsg, warnGroupId, warnClass, args);
  }

  error(message: string, args?: LoggerArgs) {
    const dispMsg = this.formatMsg(message);
    if (this.toConsole) {
      console.error(dispMsg)
    }

    if (!args?.ignoreOptions) {
      let ignoredErrors = getOption("logger.error.ignore");
      for (let substr of ignoredErrors) {
        if (dispMsg.includes(substr)) {
          return;
        }
      }
    }

    this.printMsg(dispMsg, errorGroupId, errorClass, args);
  }

  errorStack(stack: string) {
    if (this.toConsole) {
      console.error(stack);
    }

    try {
      let ignoredErrors = getOption("logger.error.ignore");
      for (let substr of ignoredErrors) {
        if (stack.includes(substr)) {
          return;
        }
      }

      let stackList = stack.split(" at ");
      for (let i = 1; i < stackList.length; i++) {
        stackList[i] = ">>> " + stackList[i];
      }
      //this.error(stackList.join("<br>"), {isHtml: true});
      this.printMsg(stackList, errorGroupId, errorClass);
    } catch (e) {
      // in case the above fails for some reason
      // better to throw an error that is not as prettily formatted
      // than to essentially have it go missing
      this.error(stack);
    }

  }

  leech(displayMsg=true) {
    if (displayMsg) {
      this.printMsg('', leechGroupId, leechClass);
    } else {
      let infoCirc = document.getElementById('info_circle');
      infoCirc?.classList.toggle(leechClass, true);
    }
    if (this.toConsole) {
      console.info("Leech");
    }
  }

  private formatMsg(message: string) {
    let displayMsg: string = message;
    if (this.name !== null) {
      displayMsg = `(${this.name}) ${message}`;
    }
    return displayMsg;
  }

  private printMsg(
    message: string | string[],
    eleId: GroupId,
    colorClass: ColorClass | null,
    args: LoggerArgs = {}
  ) {
    //let key: string | null = null;
    //if (args?.unique) {
    //  if (args?.key) {
    //    key = message;
    //  }
    //  if (key !== null && this.uniqueKeys.has(key)) {
    //    return;
    //  }
    //}

    let groupEle = document.getElementById(eleId);
    if (groupEle !== null) {
      this.appendMsg(message, groupEle, args);
    }

    let infoCirc = document.getElementById('info_circle');
    if (colorClass !== null) {
      infoCirc?.classList.toggle(colorClass, true);
    }
  }

  private appendMsg(
    message: string | string[],
    groupEle: HTMLElement,
    args: LoggerArgsMsg = {}
  ) {
    let msgEle = document.createElement('div');
    msgEle.classList.add('info-circle__message');
    //if (args?.key) {
    //  msgEle.setAttribute('data-key', args.key);
    //}

    if (Array.isArray(message)) {
      if (message.length > 0) {
        msgEle.textContent = message[0];

        for (let line of message.slice(1)) {
          let lineEle = document.createElement('div');
          lineEle.textContent = line;
          msgEle.appendChild(lineEle);
        }
      }
    } else {
      //const displayMsg = this.formatMsg(message);

      if (args?.isHtml) {
        msgEle.innerHTML = message;
      } else {
        msgEle.textContent = message;
      }
    }

    groupEle.appendChild(msgEle);
  }
}

export const LOGGER = new Logger();
