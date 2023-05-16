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
  // moved to lazy getters because a call to getOption fails when the option is an override type
  private _debugLevel: number | null = null;
  private _toConsole: boolean | null = null;
  private _debugConsoleLevel: number | null = null;

  getDebugLevel() {
    if (this._debugLevel === null) {
      this._debugLevel = getOption('logger.debugLevel');
    }
    return this._debugLevel
  }

  getToConsole() {
    if (this._toConsole === null) {
      this._toConsole = getOption('logger.toConsole');
    }
    return this._toConsole
  }

  getDebugConsoleLevel() {
    if (this._debugConsoleLevel === null) {
      this._debugConsoleLevel = getOption('logger.debugConsoleLevel');
    }
    return this._debugConsoleLevel
  }

  constructor(name: string | null = null) {
    this.name = name;
  }

  debug(message: string, level: number = 3, args?: LoggerArgs) {
    //const debugToConsole = getOption('logger.consoleLevel');

    const onlyShowCertainModules = getOption('logger.debug.onlyShowCertainModules');
    const validModules = getOption('logger.debug.onlyShowCertainModules.modules') as (
      | string
      | null
    )[];
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
    if (level >= this.getDebugLevel()) {
      this.printMsg(dispMsg, debugGroupId, null, args);
    }
    if (this.getToConsole() && level >= this.getDebugConsoleLevel()) {
      console.log(dispMsg);
    }
  }

  info(message: string, args?: LoggerArgs) {
    const dispMsg = this.formatMsg(message);
    this.printMsg(dispMsg, infoGroupId, null, args);
    if (this.getToConsole()) {
      console.info(dispMsg);
    }
  }

  warn(message: string, args?: LoggerArgs) {
    const dispMsg = this.formatMsg(message);
    if (this.getToConsole()) {
      console.warn(dispMsg);
    }

    if (!args?.ignoreOptions) {
      let ignoredWarns = getOption('logger.warn.ignore');
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
    if (this.getToConsole()) {
      console.error(dispMsg);
    }

    if (!args?.ignoreOptions) {
      let ignoredErrors = getOption('logger.error.ignore');
      for (let substr of ignoredErrors) {
        if (dispMsg.includes(substr)) {
          return;
        }
      }
    }

    this.printMsg(dispMsg, errorGroupId, errorClass, args);
  }

  errorStack(stack: string, msg?: string, url?: string, lineNo?: number, columnNo?: number) {
    if (this.getToConsole()) {
      console.error(stack);
    }

    try {
      let ignoredErrors = getOption('logger.error.ignore');
      for (let substr of ignoredErrors) {
        if (stack.includes(substr)) {
          return;
        }
      }

      let stackList = stack.split(' at ');
      for (let i = 1; i < stackList.length; i++) {
        stackList[i] = '>>> ' + stackList[i];
      }

      stackList[0] = 'Stack: ' + stackList[0];
      // array.splice(index, 0, item) is the equivalent of list.insert(index, item)
      stackList.splice(0, 0, `${msg}`);
      stackList.splice(1, 0, `URL: ${url}, position: ${lineNo}:${columnNo}`);

      this.printMsg(stackList, errorGroupId, errorClass);

    } catch (e) {
      // in case the above fails for some reason
      // better to throw an error that is not as prettily formatted
      // than to essentially have it go missing
      const fullMsg = `msg: ${msg} || url: ${url} || lineNo: ${lineNo} || colNo: ${columnNo} || stack: ${stack} || Could not show standard errorStack.`;
      this.error(fullMsg);
    }
  }

  leech(displayMsg = true) {
    if (displayMsg) {
      this.printMsg('', leechGroupId, leechClass);
    } else {
      let infoCirc = document.getElementById('info_circle');
      infoCirc?.classList.toggle(leechClass, true);
    }
    if (this.getToConsole()) {
      console.info('Leech');
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
