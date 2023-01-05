import { Module } from '../module';
import { getOption } from '../options';
import { InfoCircleSetting } from '../side-modules/infoCircleSetting';
import { CardSide, popupMenuMessage } from '../utils';

const persistKey = 'jpmn-websocket';
const settingId = 'info_circle_text_settings_websocket_toggle';

export class WebSocketUtils extends Module {
  private readonly setting = new InfoCircleSetting(settingId, persistKey);
  private readonly cardSide: CardSide;

  constructor(cardSide: CardSide) {
    super('webSocketUtils');
    this.cardSide = cardSide;
  }

  openWebSocket() {
    // ideally, the socket should be a global variable stored between cards
    // but Persistence only stores strings due to its window.sessionStorage
    // implementation.

    const url = getOption('webSocketUtils.url');
    const socket: WebSocket = new WebSocket(url);

    socket.onopen = (_e) => {
      this.logger.debug(`Socket initialized with url=${url}`);

      if (getOption('webSocketUtils.sendSentence')) {
        const ele = document.getElementById('full_sentence');
        if (ele !== null) {
          const sentence = ele.innerText.trim();
          if (sentence.length > 0) {
            this.logger.debug(`Socket sending sentence=${sentence}`);
            socket.send(sentence);
          }
        }
      }

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

  main() {
    // automatically activates if setting says so
    // +!! is a combination of + and !!
    // !! converts anything to boolean, + converts to number
    // truly amazing
    let state = this.setting.initDisplay(+!!getOption('webSocketUtils.defaultIsEnabled'));
    if (state === 1 && this.cardSide === "back") {
      this.openWebSocket();
    }

    // toggle state
    this.setting.btn.onclick = () => {
      const newState = this.setting.getNextState();
      if (newState === 0) {
        this.setting.displayAs(newState);
        popupMenuMessage("Disabled websocket");
      } else if (newState === 1) {
        // switched to on
        if (this.cardSide === "back") {
          this.openWebSocket();
        } else {
          this.setting.displayAs(newState);
        }
        popupMenuMessage("Enabled websocket");
      }
    };

  }

}
