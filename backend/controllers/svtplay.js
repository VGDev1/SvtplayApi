import fetch from 'node-fetch';
import { createSimpleJson, createAdvancedJson, createSortedJson } from '../services/parsers';
import logger from '../config/logger';

// prettier-ignore
export const programUrl =          'https://api.svt.se/contento/graphql?ua=svtplaywebb-play-render-prod-client&operationName=ProgramsListing&variables={"legacyIds":[24186554]}&extensions={"persistedQuery":{"version":1,"sha256Hash":"1eeb0fb08078393c17658c1a22e7eea3fbaa34bd2667cec91bbc4db8d778580f"}}';
export const programUrlSimple = 'https://www.svtplay.se/api/search_autocomplete_list';
export const programApiUrl = 'https://api.svt.se/video/';
export const specificProgramUrl1 = 'https://api.svt.se/contento/graphql?ua=svtplaywebb-play-render-prod-client&operationName=VideoPage&variables={"legacyIds":"';
export const specificProgramUrl2 = '"}&extensions={"persistedQuery":{"version":1,"sha256Hash":"ae75c500d4f6f8743f6673f8ade2f8af89fb019d4b23f464ad84658734838c78"}}';

/**
 * Function to fetch url that has no CORS header present via
 * local cors proxy on port 8080
 * @param apiurl - url to fetch
 * @param lable - lable is only for time debug purposes
 */
export const getURLProxy = async (apiurl, lable) => {
    console.time(`Proxy ${lable}`);
    const data = await fetch(`http://127.0.0.1:8080/${apiurl}`, {
        headers: { 'x-requested-with': 'api' },
    });
    const resp = await data.json();
    console.timeEnd(`Proxy ${lable}`);
    return resp;
};

/**
 * function for fetching response data from a rest-api
 * @param apiurl - url to fetch json data from
 */
export const getURL = async apiurl => {
    console.time('programUrl');
    const data = await fetch(`${apiurl}`);
    const resp = await data.json();
    console.timeEnd('programUrl');
    return resp;
};

export const getSvtVideoId = async videoid => {
    const json = await getURL(specificProgramUrl1 + videoid + specificProgramUrl2);
    const svtVideoId = json.data.listablesByEscenicId[0].videoSvtId;
    return svtVideoId;
};

export const getM3u8Link = async svtVideoId => {
    const json = await getURL(programApiUrl + svtVideoId);
    let link = '';
    for (let i = 0; i < json.videoReferences.length; i++) {
        if (json.videoReferences[i].format === 'hls') link = json.videoReferences[i].url;
    }
    const m3u8 = decodeURIComponent(link).replace(/-fmp4/g, '');
    return m3u8;
};

export const getEpisodes = async slug => {
    const url = `https://api.svt.se/contento/graphql?ua=svtplaywebb-play-render-prod-client&operationName=TitlePage&variables={"titleSlugs":"${slug}"}&extensions={"persistedQuery":{"version":1,"sha256Hash":"4122efcb63970216e0cfb8abb25b74d1ba2bb7e780f438bbee19d92230d491c5"}}`;
    const json = await getURL(url);
    const data = await json.data.listablesBySlug[0].associatedContent;
    const resp = [];
    for (let i = 0; i < data.length; i++) {
        resp.push(data[i]);
    }
    return Promise.all(resp);
};

/**
 * Function for getting all programs from both svt API's
 *  and returning parsed, fully functional json for backend response
 */
export async function getAllPrograms() {
    const AdvancedJson = getURL(programUrl, 'programUrl');
    const getSimple = await getURLProxy(programUrlSimple, 'simple');
    const simpleJson = createSimpleJson(getSimple);
    const pr = Promise.all([simpleJson, AdvancedJson]);
    try {
        const p = await pr;
        const d = createAdvancedJson(p[0], p[1]);
        return createSortedJson(d);
    } catch (e) {
        return logger.error(e);
    }
}
