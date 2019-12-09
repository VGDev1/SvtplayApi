const fetch = require('node-fetch');
const redis = require('../controllers/redis');
// eslint-ignore
const programUrl =
    'https://api.svt.se/contento/graphql?ua=svtplaywebb-play-render-prod-client&operationName=ProgramsListing&variables={"legacyIds":[24186554]}&extensions={"persistedQuery":{"version":1,"sha256Hash":"1eeb0fb08078393c17658c1a22e7eea3fbaa34bd2667cec91bbc4db8d778580f"}}';
const programUrlSimple = 'https://www.svtplay.se/api/search_autocomplete_list';
const programApiUrl = 'https://api.svt.se/video/';
const specificProgramUrl1 =
    'https://api.svt.se/contento/graphql?ua=svtplaywebb-play-render-prod-client&operationName=VideoPage&variables={"legacyIds":"';
const specificProgramUrl2 =
    '"}&extensions={"persistedQuery":{"version":1,"sha256Hash":"ae75c500d4f6f8743f6673f8ade2f8af89fb019d4b23f464ad84658734838c78"}}';

/**
 * Function to fetch url that has no CORS header present via
 * local cors proxy on port 8080
 * @param apiurl - url to fetch
 * @param lable - lable is only for time debug purposes
 */
const getURLProxy = async (apiurl, lable) => {
    console.time(`fetch${lable}`);
    const data = await fetch(`http://127.0.0.1:8080/${apiurl}`, {
        headers: { 'x-requested-with': 'api' },
    });
    console.timeEnd(`fetch${lable}`);
    console.time(`json${lable}`);
    const resp = await data.json();
    console.timeEnd(`json${lable}`);
    return resp;
};

/**
 * function for fetching response data from a rest-api
 * @param apiurl - url to fetch json data from
 */
const getURL = async (apiurl) => {
    console.time('programUrl');
    const data = await fetch(`${apiurl}`);
    console.timeEnd('programUrl');
    console.time('json');
    const resp = await data.json();
    console.timeEnd('json');
    return resp;
};
/**
 * Function that parses ONLY data from the SVT api at
 * https://www.svtplay.se/api/search_autocomplete_list
 * @param json - data to parse through the SimpleJson parser
 */

const createSimpleJson = (json) => {
    console.time('simple');
    const data = { program: [] };
    for (let i = 0; i < json.length; i++) {
        data.program.push({
            title: json[i].title,
            url: json[i].url.split('/').pop(),
            thumbnail: json[i].thumbnail,
            popularity: json[i].popularity,
        });
    }
    console.timeEnd('simple');
    return data;
};

/**
 * Function that combines data from both SVT API endpoints
 * and converts them to one json object for each program.
 * @param {*} JsonSimple - parsed json from the @function createSimpleJson method
 * @param {*} JsonAdvanced  - parsed json from the @function createAdvancedJson method
 */

const createAdvancedJson = (JsonSimple, JsonAdvanced) => {
    console.time('advanced');
    const data = { program: [] };
    for (let i = 0; i < JsonAdvanced.data.programAtillO.flat.length; i++) {
        data.program.push({
            title: JsonSimple.program[i].title,
            id: JsonAdvanced.data.programAtillO.flat[i].id,
            slug: JsonSimple.program[i].url,
            thumbnail: JsonSimple.program[i].thumbnail,
            popularity: JsonSimple.program[i].popularity,
            // eslint-disable-next-line no-underscore-dangle
            type: JsonAdvanced.data.programAtillO.flat[i].__typename,
        });
    }
    console.timeEnd('advanced');
    return data;
};

/**
 * Sorted the result from @function createAdvancedJson
 * Sorts the objects by the value from popularity key
 */

const createSortedJson = (json) => {
    console.time('sorted');
    const sorted = json.program.sort((a, b) => parseFloat(b.popularity) - parseFloat(a.popularity));
    console.timeEnd('sorted');
    return sorted;
};

const getSvtVideoId = async (videoid) => {
    const json = await getURL(specificProgramUrl1 + videoid + specificProgramUrl2);
    const svtVideoId = json.data.listablesByEscenicId[0].videoSvtId;
    return svtVideoId;
};

const getM3u8Link = async (svtVideoId) => {
    const json = await getURL(programApiUrl + svtVideoId);
    const link = json.videoReferences[1].url;
    const m3u8 = decodeURIComponent(link).replace(/-fmp4/g, '');
    return m3u8;
};

const getEpisodes = async (slug) => {
    const url = `https://api.svt.se/contento/graphql?ua=svtplaywebb-play-render-prod-client&operationName=TitlePage&variables={"titleSlugs":"${slug}"}&extensions={"persistedQuery":{"version":1,"sha256Hash":"4122efcb63970216e0cfb8abb25b74d1ba2bb7e780f438bbee19d92230d491c5"}}`;
    const json = await getURL(url);
    const data = await json.data.listablesBySlug[0].associatedContent;
    const resp = [];
    for (let i = 0; i < data.length; i++) {
        resp.push(await data[i]);
    }
    return resp;
};

// methods exports
exports.getURLProxy = getURLProxy;
exports.getURL = getURL;
exports.createSimpleJson = createSimpleJson;
exports.createAdvancedJson = createAdvancedJson;
exports.createSortedJson = createSortedJson;
exports.getSvtVideoId = getSvtVideoId;
exports.getM3u8Link = getM3u8Link;
exports.getEpisodes = getEpisodes;
// variable exports
exports.programUrl = programUrl;
exports.programUrlSimple = programUrlSimple;
exports.programApiUrl = programApiUrl;
exports.specificProgramUrl1 = specificProgramUrl1;
exports.specificProgramUrl2 = specificProgramUrl2;
