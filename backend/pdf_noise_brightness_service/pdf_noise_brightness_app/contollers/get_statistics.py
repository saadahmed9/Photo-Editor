import json


def write_stats (newData):
    obj= read_stats()
    for key,value in newData.items():
        obj[key] = value
    with open("media/datasets/stats.json", "w") as outfile:
        json_object = json.dumps(obj, indent=4)
        outfile.write(json_object)


def read_stats():
    with open('media/datasets/stats.json', 'r') as openfile:
        json_object = json.load(openfile)
    return json_object