import os
import json
import urllib.request

import utils

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

#export_params = {
#    "deck": "JPMN-Examples",
#    "path": "/home/austin/pgc/other/weeb/anki/jp-mining-note/tmp/Deck.apkg",
#    "includeSched": False,
#}
#print(invoke("exportPackage", **export_params))


def main():

    tools_folder = os.path.dirname(os.path.abspath(__file__))
    root_folder = os.path.join(tools_folder, "..")

    version = utils.get_version()

    path = os.path.join(root_folder, "versions", f"{version}-jpmn_example_cards.apkg")
    utils.gen_dirs(path)

    export_params = {
        "deck": "JPMN-Examples",
        "path": path,
        "includeSched": False,
    }

    if not invoke("exportPackage", **export_params):
        raise Exception("exportPackage returned False")



if __name__ == "__main__":
    main()
