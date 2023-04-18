




# Settings / CSS for [Renji's texthooker](https://github.com/Renji-XD/texthooker-ui)
I use the following stylizations to remove unnecessary padding within the document,
and to behave more similarly to Anacreon's texthooker.

**Settings:**

| Setting | Value |
|-|-|
| Preserve Whitespace | {{ UNCHECKED_CHECKBOX }} |
| Remove Whitespace | {{ CHECKED_CHECKBOX }} |

**Custom CSS:**
```css
main > p {
  padding: 0rem !important;
}

main {
  padding-left: min(5%, 5rem) !important;
  padding-right: min(5%, 5rem) !important;
}

body > div > textarea {
  font-size: 24px !important;
}
```


??? note "Using a custom font <small>(click here)</small>"
    I set the font to be Noto Sans, but this will likely not work without
    downloading and installing the font first
    (e.g. from [here](https://github.com/googlefonts/noto-cjk/tree/main/Sans/OTF/Japanese)).
    Below is the actual full CSS that I use in conjuction with the installed font:

    ```css
    main > p {
      padding: 0rem !important;
    }

    main {
      padding-left: min(5%, 5rem) !important;
      padding-right: min(5%, 5rem) !important;
      font-family: "Noto Sans CJK JP" !important; /* <-- new! */
    }

    body > div > textarea {
      font-size: 24px !important;
    }
    ```




# Send text from Anki to your texthooker

!!! warning
    THIS CODE IS DEPRECATED in favor of [AJT Autocopy](https://ankiweb.net/shared/info/1995103628).
    If you still wish to use a websocket setup to prevent clipboard flooding,
    I recommend writing an Anki Add-on instead of the code below.

This is a very quick hack to have text from Anki to appear on a websocket based texthooker.

Requires Python, written for [Renji's texthooker](https://github.com/Renji-XD/texthooker-ui).

??? example "Instructions <small>(click here)</small>"
    1. Save as `server.py`:
        ```python
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
        ```

    1. Paste this on the back side of your Anki template:
        ```html
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
        ```

    1. Replace `full_sentence` and `primary_definition_raw_text` with whatever id.
    1. Install `websockets` with pip, i.e. `pip3 install websockets`
    1. Change the web port on the texthooker page to `6678`.

    Whenever you want to connect Anki to the texthooker page:

    1. Run `server.py`, i.e. `python3 server.py`
    1. Ensure the web port is the same on the texthooker page, i.e. `6678`
    1. Enable the websocket connection on the texthooker page.



# Mikagu pitch accent alternatives
- [migaku updated](https://github.com/MikeMoolenaar/Migaku-Japanese-Addon-Updated)
    - Fork of migaku to be updated for anki version 2.1.50+
- [anki-jrp](https://github.com/Ben-Kerman/anki-jrp)
    - Completely stand-alone plugin from migaku with a completely different codebase
    - Only does one thing: adds pitch accent colors (along with furigana)

