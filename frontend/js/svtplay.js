const programUrl = 'https://api.svt.se/contento/graphql?ua=svtplaywebb-play-render-prod-client&operationName=ProgramsListing&variables=%7B%22legacyIds%22%3A%5B24186554%5D%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%221eeb0fb08078393c17658c1a22e7eea3fbaa34bd2667cec91bbc4db8d778580f%22%7D%7D';
const programUrlSimple = 'https://www.svtplay.se/api/search_autocomplete_list';
const programApiUrl = 'https://api.svt.se/video/';
const specificProgramUrl1 = 'https://api.svt.se/contento/graphql?ua=svtplaywebb-play-render-prod-client&operationName=VideoPage&variables=%7B%22legacyIds%22%3A%';
const specificProgramUrl2 = '%22%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22ae75c500d4f6f8743f6673f8ade2f8af89fb019d4b23f464ad84658734838c78%22%7D%7D';

async function getURL(apiurl) {
    const data = await fetch(`http://127.0.0.1:8080/${apiurl}`, { headers: { 'x-requested-with': 'api' } });
    const resp = await data.json();
    return resp;
}

function createSimpleJson(json) {
    const data = { program: [] };
    for (let i = 0; i < json.length; i++) {
        data.program.push(
            [json[i].title,
                json[i].popularity,
                json[i].thumbnail],
        );
    }
    return data;
}

function createAdvancedJson(JsonSimple, JsonAdvanced) {
    const data = { program: [] };
    for (let i = 0; i < JsonAdvanced.data.programAtillO.flat.length; i++) {
        data.program.push(
            [JsonSimple.program[i][0],
                JsonSimple.program[i][1],
                JsonAdvanced.data.programAtillO.flat[i].id],
        );
    }
    return data;
}

function createSortedJson(json) {
    const sorted = json.program.sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]));
    return sorted;
}

async function getM3u8Link(svtVideoId) {
    const json = await getURL(programApiUrl + svtVideoId);
    const m3u8 = json.videoReferences[1].url;
    return m3u8;
}

async function getSvtVideoId(videoid) {
    const json = await getURL(specificProgramUrl1 + videoid + specificProgramUrl2);
    const svtVideoId = json.data.listablesByEscenicId[0].videoSvtId;
    return svtVideoId;
}

async function getAllPrograms() {
    const jsonSimple = getURL(programUrlSimple).then((d) => createSimpleJson(d));
    const jsonAdvanced = getURL(programUrl);
    const promises = Promise.all([jsonSimple, jsonAdvanced]);
    promises
        .then((p) => createAdvancedJson(p[0], p[1]))
        .then((d) => createSortedJson(d))
        .then((r) => console.log(r))
        .catch((e) => console.error(e));
}

getAllPrograms();
getSvtVideoId('2213942344').then((d) => console.log(d));
