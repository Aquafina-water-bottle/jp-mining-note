import json
import urllib.request

import bs4

def request(action, **params):
    return {'action': action, 'params': params, 'version': 6}

def invoke(action, **params):
    requestJson = json.dumps(request(action, **params)).encode('utf-8')
    response = json.load(urllib.request.urlopen(urllib.request.Request('http://localhost:8765', requestJson)))
    if len(response) != 2:
        raise Exception('response has an unexpected number of fields')
    if 'error' not in response:
        raise Exception('response is missing required error field')
    if 'result' not in response:
        raise Exception('response is missing required result field')
    if response['error'] is not None:
        raise Exception(response['error'])
    return response['result']

def main():
    response = invoke("cardsInfo", cards=[1666077412193, 1661744719425, 1661742796748, 1658692528576])
    for c in response:
        for side in ("question", "answer"):
            with open(f"templates/{c['cardId']}_{side}.html", "w", encoding="utf-8") as f:

                # remove all script tags!
                soup = bs4.BeautifulSoup(c[side], 'html.parser')
                scripts = soup.find_all("script")
                for script in scripts:
                    script.decompose()

                f.write(str(soup))

if __name__ == "__main__":
    main()
