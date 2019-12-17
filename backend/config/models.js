/**
 *
 * @param {string} key
 * @param {Object} data - an object containing JSON (key: value)
 */
export async function hashModel(key, data) {
    if (data.constructor.name !== 'Object') throw new Error('data must be a JSON Object');
    return {
        title: key,
        id: data.id,
        slug: data.slug,
        thumbnail: data.thumbnail.replace(140, 400),
        popularity: data.popularity,
        type: data.type,
    };
}

/**
 * Function that takes an object of hashModel and parses it to two arrays
 * @usage used for setHashMap in redis
 * @param {{Object:string}} object object containing fields -> values
 * @returns {Promise<[][]>} returns a promise of nestled arrays: [0] is fields, [1] is values
 */
export async function hashArrays(object) {
    if (object.constructor.name !== 'Object') throw new Error('object must be a JSON Object');
    else {
        let fields = [];
        let values = [];
        fields = Object.keys(object);
        values = Object.values(object);
        return [fields.slice(1), values.slice(1)];
    }
}
