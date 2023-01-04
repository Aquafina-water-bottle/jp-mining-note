import { Module } from '../module';
import { getOption } from '../options';

export class WebsocketUtils extends Module {
  main() {
    const url = getOption('websocketUtils.url');
    const socket: WebSocket = new WebSocket(url);

    socket.onopen = (_e) => {
      this.logger.debug(`Socket initialized with url=${url}`);

      if (getOption('websocketUtils.sendSentence')) {
        const ele = document.getElementById('full_sentence');
        if (ele !== null) {
          const sentence = ele.innerText.trim();
          if (sentence.length > 0) {
            this.logger.debug(`Socket sending sentence=${sentence}`);
            socket.send(sentence);
          }
        }
      }
    };

    socket.onclose = (_e) => {
      this.logger.debug(`Socket closed with url=${url}`);
    };

    socket.onerror = (_e) => {
      this.logger.error(`Socket error`);
    };
  }
}
