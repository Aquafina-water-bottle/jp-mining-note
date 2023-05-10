from __future__ import annotations

"""
Use this in Anki, replacing "full_sentence" with whatever

<script>
(() => {
  function sendText(id) {
    const sentEle = document.getElementById(id);
    if (sentEle !== null) {
      const sentence = sentEle.innerText.trim();
      if (sentence.length > 0) {
        socket.send(sentence);
      }
    }
  }

  const url = "ws://localhost:6678";
  const socket = new WebSocket(url);

  socket.onopen = (_e) => {
    sendText("full_sentence");
    sendText("primary_definition_raw_text");
  };
})();
</script>


"""


import asyncio
import websockets

CONNECTIONS = set()


async def register(websocket):
    CONNECTIONS.add(websocket)
    try:
        async for message in websocket:
            print(f"server will now echo '{message}' to all other connections")
            connections = [c for c in CONNECTIONS if c != websocket]
            websockets.broadcast(connections, message)
        await websocket.wait_closed()
    finally:
        CONNECTIONS.remove(websocket)


async def main():
    async with websockets.serve(register, "localhost", 6678):
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())
