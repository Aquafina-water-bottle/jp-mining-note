import { getOption } from './options';

type LoggerArgsMsg = {
  isHtml?: boolean;
  key?: string;
};

type LoggerArgs = LoggerArgsMsg & {
  unique?: boolean;
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
  private uniqueKeys: Set<string>;

  constructor(name: string | null = null) {
    this.name = name;
    this.uniqueKeys = new Set();
  }

  debug(message: string, level: number = 3, args?: LoggerArgs) {
    const debugLevel = getOption('debug.level');
    const debugToConsole = getOption('debug.toConsole');

    const onlyShowCertainModules = getOption('debug.onlyShowCertainModules');
    const validModules = getOption('debug.onlyShowCertainModules.modules') as (string | null)[];
    if (onlyShowCertainModules && !validModules.includes(this.name)) {
      return;
    }

    if (level >= debugLevel) {
      if (debugToConsole) {
        let displayMsg: string = message;
        if (this.name !== null) {
          displayMsg = `(${this.name}) ${message}`;
        }
        console.log(displayMsg);
      } else {
        this.printMsg(message, debugGroupId, null, args);
      }
    }
  }

  info(message: string, args?: LoggerArgs) {
    this.printMsg(message, infoGroupId, null, args);
  }

  warn(message: string, args?: LoggerArgs) {
    this.printMsg(message, warnGroupId, warnClass, args);
  }

  // returns string to throw if necessary
  // i.e. throw Error(logger.error(...))
  error(message: string, args?: LoggerArgs): string {
    this.printMsg(message, errorGroupId, errorClass, args);
    return message;
  }

  leech() {
    this.printMsg('', leechGroupId, leechClass);
  }

  private printMsg(
    message: string,
    eleId: GroupId,
    colorClass: ColorClass | null,
    args: LoggerArgs = {}
  ) {
    let key: string | null = null;
    if (args?.unique) {
      if (args?.key) {
        key = message;
      }
      if (key !== null && this.uniqueKeys.has(key)) {
        return;
      }
    }

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
    message: string | Array<string>,
    groupEle: HTMLElement,
    args: LoggerArgsMsg = {}
  ) {
    let msgEle = document.createElement('div');
    msgEle.classList.add('info-circle__message');
    if (args?.key) {
      msgEle.setAttribute('data-key', args.key);
    }

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
      let displayMsg: string = message;
      if (this.name !== null) {
        displayMsg = `(${this.name}) ${message}`;
      }

      if (args?.isHtml) {
        msgEle.innerHTML = displayMsg;
      } else {
        msgEle.textContent = displayMsg;
      }
    }

    groupEle.appendChild(msgEle);
  }
}

export const LOGGER = new Logger();
