/**
 * Function that combines data from both SVT API endpoints
 * and converts them to one json object for each program.
 * @param {{Object[]}} JsonSimple - parsed json from the createSimpleJson
 * @param {Array} JsonAdvanced  - parsed json from the createAdvancedJson method
 */

export const createAdvancedJson = (JsonSimple, JsonAdvanced) => {
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
 * Trims the slug recieved from svtApi in order to match new APi
 * @param url the JSON value of url-key from SVT Api
 */
export function trimUrl(url) {
    const trimmed = url.split('/');
    if (trimmed.length === 2) return trimmed[1];
    return trimmed[2];
}
/**
 * Function that parses ONLY data from the SVT api at
 * https://www.svtplay.se/api/search_autocomplete_list
 * @param json - data to parse through the SimpleJson parser
 */
export function createSimpleJson(json) {
    console.time('simple');
    const data = { program: [] };
    for (let i = 0; i < json.length; i++) {
        data.program.push({
            title: json[i].title,
            url: trimUrl(json[i].url),
            thumbnail: json[i].thumbnail.replace(140, 400),
            popularity: json[i].popularity,
        });
    }
    console.timeEnd('simple');
    return data;
}

/**
 * Sorted the result from createAdvancedJson
 * Sorts objects by value of popularity key
 */
export function createSortedJson(json) {
    console.time('sorted');
    const sorted = json.program.sort((a, b) => parseFloat(b.popularity) - parseFloat(a.popularity));
    console.timeEnd('sorted');
    return sorted;
}
