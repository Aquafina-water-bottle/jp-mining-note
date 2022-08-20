import json
import urllib.request

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


# removes all no pitch accent data fields


#def batch_field(field_name: str, lmbda):
def clear_pitch_accent_data():
    notes = invoke('findNotes', query=r'"note:JP Mining Note" "PAGraphs:*No pitch accent data*"')

    # creates multi request
    actions = []

    for nid in notes:
        action = {
            "action": "updateNoteFields",
            "params": {
                "note": {
                    "id": nid,
                    "fields": {
                        "PAGraphs": ""
                    }
                }
            }
        }

        actions.append(action)

    notes = invoke('multi', actions=actions)


def main():
    #clear_pitch_accent_data()
    pass

if __name__ == "__main__":
    main()
