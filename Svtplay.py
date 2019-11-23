from __future__ import absolute_import, unicode_literals
import requests
import json
import re
import codecs
import collections
import operator

base_api_url = "https://www.svtplay.se/api/"

def requestJson(url):
    response = requests.get(base_api_url + url)

    if response.status_code != 200:
        return None
    else: 
        result = json.loads(json.dumps(response.json()))
        return result

def createMostPopular(dictFile, nbrOfTitles):
    mostPopular_dict = {}
    for i in dictFile:
        mostPopular_dict[i['title']] = i['popularity']
    sortedMostPopular = sorted(mostPopular_dict.items(), key=operator.itemgetter(1), reverse=True)
    return sortedMostPopular


def createJson(dict):
    result = json.dumps(dict, ensure_ascii=False)
    return result

def createFile(json):
    file1  = codecs.open('myJson.json', "w+", "utf-8")
    file1.write(json)
      

all_titels = requestJson("search_autocomplete_list")
popularTitles = createMostPopular(all_titels, 50)
jsonfile = createJson(popularTitles)
createFile(jsonfile)


print(popularTitles)