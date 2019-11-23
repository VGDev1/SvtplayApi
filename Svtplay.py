from __future__ import absolute_import, unicode_literals
import requests
import json
import re
import codecs
import collections
import operator

program_url = 'https://api.svt.se/contento/graphql?ua=svtplaywebb-play-render-prod-client&operationName=ProgramsListing&variables=%7B%22legacyIds%22%3A%5B24186554%5D%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%221eeb0fb08078393c17658c1a22e7eea3fbaa34bd2667cec91bbc4db8d778580f%22%7D%7D'
program_url_simple = 'https://www.svtplay.se/api/search_autocomplete_list'


def requestJson(url):
    response = requests.get(url)

    if response.status_code != 200:
        return None
    else: 
        result = json.loads(json.dumps(response.json()))
        return result

def createMostPopularSimple(dictFile):
    mostPopular_dict = {}
    for i in dictFile:
        mostPopular_dict[i['title']] = i['popularity'] , i['thumbnail']
    return mostPopular_dict

def createMostPopularAdvanced(Simple, Advanced):
    dict = {}
    for i in Advanced['data']['programAtillO']['flat']:
        dict[i['name']] = Simple.get(i['name'])[0], Simple.get(i['name'])[1], i['id']
    return dict    

def createSortedList(list):
    sortedMostPopular = sorted(mostPopular_dict.items(), key=operator.itemgetter(1), reverse=True)
    return sortedMostPopular

def createJson(dict):
    result = json.dumps(dict, ensure_ascii=False)
    return result

def createFile(json):
    file1  = codecs.open('myJson.json', "w+", "utf-8")
    file1.write(json)
      

all_titels_simplelist = requestJson(program_url_simple)
all_titels = requestJson(program_url)
simple_dict = createMostPopularSimple(all_titels_simplelist)
advanced_dict = createMostPopularAdvanced(simple_dict, all_titels)
createFile(createJson(advanced_dict))


print(advanced_dict)

