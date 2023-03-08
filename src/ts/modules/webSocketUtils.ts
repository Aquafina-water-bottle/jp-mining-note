import { RunnableModule } from '../module';
import { getOption } from '../options';
import { InfoCircleSetting } from './infoCircleSetting';
import { getCardSide, popupMenuMessage } from '../utils';
import { getFieldValue } from '../fields';
import { selectPersist, SPersistInterface } from '../spersist';

const settingId = 'info_circle_text_settings_websocket_toggle';
const persistKeySetting = 'jpmn-websocket-setting';
const persistKey = 'jpmn-websocket';

export class WebSocketUtils extends RunnableModule {
  private readonly setting = new InfoCircleSetting(settingId, persistKeySetting);
  private readonly persist: SPersistInterface | null;

  constructor() {
    super('webSocketUtils');
    this.persist = selectPersist('window');
  }

  fallbackSendMsg() {
    // fallback implementation when the websocket object can't be persisted

    const url = getOption('webSocketUtils.url');

    const socket: WebSocket = new WebSocket(url);

    socket.onopen = (_e) => {
      this.logger.debug(`Socket initialized with url=${url}`);

      this.sendMsgFromSocket(socket);

      this.setting.displayAs(1);

      // force close due to socket not being stored indefinitely!
      socket.close();
    };

    socket.onclose = (_e) => {
      this.logger.debug(`Socket closed with url=${url}`);
    };

    socket.onerror = (_e) => {
      this.logger.error(`Cannot open websocket.`);
      this.setting.displayAs(0); // reset display
    };
  }

  createWebSocket(sendMsgOnOpen: boolean) {
    const url = getOption('webSocketUtils.url');
    const socket = new WebSocket(url);

    socket.onopen = (_e) => {
      this.logger.debug(`Socket initialized with url=${url}`);
      this.setting.displayAs(1);
      if (sendMsgOnOpen) {
        this.sendMsg();
      }
    };

    socket.onclose = (_e) => {
      this.logger.debug(`Socket closed with url=${url}`);
      this.setting.displayAs(0); // reset display
    };

    socket.onerror = (_e) => {
      this.logger.error(`Cannot open websocket.`);
      this.setting.displayAs(0); // reset display
    };

    return socket;
  }

  openWebSocket() {
    if (this.persist === null) {
      // TODO ignore warnings?
      this.logger.warn(
        'No available SPersist implementation. Cannot open and persist websocket.'
      );
      return;
    }

    if (this.persist.has(persistKey)) {
      //console.log(this.persist.has(persistKey))
      const webSocket = this.persist.get(persistKey) as WebSocket;
      //console.log(webSocket)
      if (
        webSocket.readyState === WebSocket.CLOSING ||
        webSocket.readyState === WebSocket.CLOSED
      ) {
        // create new instance
        this.persist.set(persistKey, this.createWebSocket(false));
      }
    } else {
      this.persist.set(persistKey, this.createWebSocket(false));
    }
  }

  // opens the websocket if it doesn't exist or it's closed,
  // and sends the message (either on open, or instantly if already opened)
  openAndUseWebSocket() {
    if (this.persist === null) {
      // TODO ignore warnings?
      this.logger.warn(
        'No available SPersist implementation. Falling back to instant open/close websocket.'
      );
      this.fallbackSendMsg();
      return;
    }

    if (this.persist.has(persistKey)) {
      const ws = this.persist.get(persistKey) as WebSocket;
      if (ws.readyState === WebSocket.CLOSING || ws.readyState === WebSocket.CLOSED) {
        // create new instance
        this.persist.set(persistKey, this.createWebSocket(true));
      } else {
        this.sendMsg();
      }
    } else {
      this.persist.set(persistKey, this.createWebSocket(true));
    }
  }

  sendMsg() {
    if (this.persist === null) {
      // TODO ignore warnings?
      this.logger.warn('No available SPersist implementation. Cannot use sendMsg().');
      return;
    }

    if (!this.persist.has(persistKey)) {
      this.logger.warn('Websocket not found in SPersist.');
      return;
    }

    const ws = this.persist.get(persistKey) as WebSocket;
    this.sendMsgFromSocket(ws);
  }

  sendMsgFromSocket(ws: WebSocket) {
    if (getOption('webSocketUtils.sendSentence')) {
      //const ele = document.getElementById('full_sentence');
      //if (ele !== null) {
      //  //const sentence = ele.textContent?.trim() ?? '';
      //  const sentence = ele.textContent?.trim() ?? '';
      //  if (sentence.length > 0) {
      //    this.logger.debug(`Socket sending sentence=${sentence}`);
      //    ws.send(sentence);
      //  }
      //}

      const sentenceField = getFieldValue("Sentence");
      const ele = document.createElement("span"); // to strip html
      ele.innerHTML = sentenceField;
      //const sentence = ele.textContent?.trim() ?? '';
      const sentence = ele.textContent?.trim() ?? '';
      if (sentence.length > 0) {
        this.logger.debug(`Socket sending sentence=${sentence}`);
        ws.send(sentence);
      }

    }
  }

  closeWebSocket() {
    this.setting.displayAs(0);
    if (this.persist?.has(persistKey)) {
      const socket = this.persist?.pop(persistKey) as WebSocket;
      socket.close();
    }
  }

  main() {
    // automatically activates if setting says so
    // +!! is a combination of + and !!
    // !! converts anything to boolean, + converts to number
    // truly amazing
    let state = this.setting.initDisplay(+!!getOption('webSocketUtils.defaultIsEnabled'));
    const cardSide = getCardSide();

    if (state === 1 && cardSide === 'back') {
      //this.openWebSocket();
      //this.sendMsg();
      //if (this.persist.has
      this.openAndUseWebSocket();
    }

    // toggle state
    this.setting.btn.onclick = () => {
      const newState = this.setting.getNextState();
      if (newState === 0) {
        this.closeWebSocket()
        popupMenuMessage('Disabled websocket');
      } else if (newState === 1) {
        // switched to on
        if (cardSide === 'back') {
          this.openAndUseWebSocket();
        } else {
          this.openWebSocket();
        }
        popupMenuMessage('Enabled websocket');
      }
    };
  }
}
