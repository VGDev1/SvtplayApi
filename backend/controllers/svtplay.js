const fetch = require('node-fetch');

const programUrl = 'https://api.svt.se/contento/graphql?ua=svtplaywebb-play-render-prod-client&operationName=ProgramsListing&variables=%7B%22legacyIds%22%3A%5B24186554%5D%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%221eeb0fb08078393c17658c1a22e7eea3fbaa34bd2667cec91bbc4db8d778580f%22%7D%7D';
const programUrlSimple = 'https://www.svtplay.se/api/search_autocomplete_list';
const programApiUrl = 'https://api.svt.se/video/';
const specificProgramUrl1 = 'https://api.svt.se/contento/graphql?ua=svtplaywebb-play-render-prod-client&operationName=VideoPage&variables=%7B%22legacyIds%22%3A%';
const specificProgramUrl2 = '%22%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22ae75c500d4f6f8743f6673f8ade2f8af89fb019d4b23f464ad84658734838c78%22%7D%7D';

const getURLProxy = async (apiurl) => {
    const data = await fetch(`http://127.0.0.1:8080/${apiurl}`, { headers: { 'x-requested-with': 'api' } });
    const resp = await data.json();
    return resp;
};

const createSimpleJson = (json) => {
    const data = { program: [] };
    for (let i = 0; i < json.length; i++) {
        data.program.push(
            [json[i].title,
                json[i].popularity,
                json[i].thumbnail],
        );
    }
    return data;
};

const createAdvancedJson = (JsonSimple, JsonAdvanced) => {
    const data = { program: [] };
    for (let i = 0; i < JsonAdvanced.data.programAtillO.flat.length; i++) {
        data.program.push(
            [JsonSimple.program[i][0],
                JsonSimple.program[i][1],
                JsonAdvanced.data.programAtillO.flat[i].id],
        );
    }
    return data;
};

const createSortedJson = (json) => {
    const sorted = json.program.sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]));
    return sorted;
};

const getSvtVideoId = async (videoid) => {
    const json = await getURLProxy(specificProgramUrl1 + videoid + specificProgramUrl2);
    const svtVideoId = json.data.listablesByEscenicId[0].videoSvtId;
    return svtVideoId;
};

const getM3u8Link = async (svtVideoId) => {
    const json = await getURLProxy(programApiUrl + svtVideoId);
    const m3u8 = json.videoReferences[1].url;
    return m3u8;
};

exports.getURLProxy = getURLProxy;
exports.createSimpleJson = createSimpleJson;
exports.createAdvancedJson = createAdvancedJson;
exports.createSortedJson = createSortedJson;
exports.getSvtVideoId = getSvtVideoId;
exports.getM3u8Link = getM3u8Link;