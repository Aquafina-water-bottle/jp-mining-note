import { getOption } from './options'

// TODO change these args to not require a constructor
// (it seems like other APIs don't require a constructor too)
//class LoggerArgsMsg {
//  isHtml: boolean;
//  key: string | null;
//
//  constructor() {
//    this.isHtml = false;
//    this.key = null;
//  }
//}
//
//class LoggerArgs extends LoggerArgsMsg {
//  unique: boolean;
//
//  constructor() {
//    super();
//    this.unique = false;
//  }
//}


type LoggerArgsMsg = {
  isHtml?: boolean;
  key?: string;
}

type LoggerArgs = LoggerArgsMsg & {
  unique?: boolean;
}




const leechClass = "info-circle-leech";
const warnClass = "info-circle-warning";
const errorClass = "info-circle-error";

type ColorClass = typeof leechClass | typeof warnClass | typeof errorClass;



const debugGroupId = "info_circle_text_debug";
const  infoGroupId = "info_circle_text_info";
const leechGroupId = "info_circle_text_leech";
const  warnGroupId = "info_circle_text_warning";
const errorGroupId = "info_circle_text_error";

type GroupId = typeof debugGroupId | typeof infoGroupId | typeof leechGroupId | typeof warnGroupId | typeof errorGroupId;



export class Logger {
  private name: string | null;
  private uniqueKeys: Set<string>;

  constructor(name: string | null=null) {
    this.name = name;
    this.uniqueKeys = new Set();
  }

  debug(message: string, level: number=3, args?: LoggerArgs) {
    // TODO config
    const debugLevel = getOption("debug.level");
    const debugToConsole = getOption("debug.toConsole");

    if (level >= debugLevel) {
      if (debugToConsole) {
        console.log(message);
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

  error(message: string, args?: LoggerArgs) {
    this.printMsg(message, errorGroupId, errorClass, args);
  }

  leech() {
    this.printMsg("", leechGroupId, leechClass);
  }

  private printMsg(message: string, eleId: GroupId, colorClass: ColorClass | null, args: LoggerArgs = {}) {

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

    let infoCirc = document.getElementById("info_circle");
    if (colorClass !== null) {
      infoCirc?.classList.toggle(colorClass, true);
    }
  }

  private appendMsg(message: string | Array<string>, groupEle: HTMLElement, args: LoggerArgsMsg = {}) {

    let msgEle = document.createElement('div');
    msgEle.classList.add("info-circle__message")
    if (args?.key) {
      msgEle.setAttribute("data-key", args.key);
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

