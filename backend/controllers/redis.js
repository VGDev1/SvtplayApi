import redis from 'redis';
import bluebird from 'bluebird';
import logger from '../config/logger';

const client = redis.createClient();

bluebird.promisifyAll(client);

client.on('connect', () => {
    logger.info('connected to redis DB');
});
client.on('error', err => {
    logger.error(`Error ${err}`);
});

/**
 * @deprecated replaced by cache.js controller
 */
export async function cache(data) {
    for (let i = 0; i < data.length; i++) {
        client.hset(data[i].title, 'id', data[i].id);
        client.hset(data[i].title, 'slug', data[i].slug);
        client.hset(data[i].title, 'thumbnail', data[i].thumbnail);
        client.hset(data[i].title, 'popularity', data[i].popularity);
        client.hset(data[i].title, 'type', data[i].type);
    }
}

/**
 * Set a multiple hashes (field, values) to a key in RedisDB
 * @async
 * @exports
 * @param {string[]} array an array containting ["keyName", "Field1", "Value1". "Field2", "Value2"...]
 *
 */
exports.testSetHmap = async array => {
    if (!Array.isArray(array)) throw new Error('An array is required to set hash in RedisDB');
    if (array.length < 3) throw new Error('Length of array must be atleast 3. [keyName, Field, Value, ...] ');
    return client.hmsetAsync(array);
};

/**
 * Get all field - values for a key from Redis
 * @param entry - key pattern to get hash from
 * returns an object with the entry name followed
 * by all field values
 */
async function getHashKey(entry) {
    return new Promise((fullfill, reject) => {
        client.hgetall(entry, (err, keys) => {
            if (err) reject(new Error(`failed to get key ${entry}`));
            return fullfill({ entry, keys });
        });
    });
}

/**
 * Function that recieves a key from @function getKey
 * It then passes the array forward to @function getHashKey ,
 * takes the response, parses and returns it as an Object
 */
export async function getCacheArray(data) {
    const array = [];
    await getHashKey(data).then(resp => array.push(resp));
    return {
        name: array[0].entry,
        svtId: array[0].keys.id,
        slug: array[0].keys.slug,
        thumbnail: array[0].keys.thumbnail.replace(140, 400),
        popularity: array[0].keys.popularity,
        type: array[0].keys.type,
    };
}

export async function getKeys(key) {
    return client.keysAsync(key);
}

export async function getKeyHash(key) {
    return client.hgetallAsync(key);
}

/**
 * Get keys from Redis DB by pattern matching
 * @param key - key pattern to fetch from db. A* A? etc.
 * returns JSON as a string. to use as valid json,
 * JSON.parse() the response from this function.
 */
async function getKey(key) {
    return new Promise((fullfill, reject) => {
        if (key === undefined || null) {
            return reject(new Error('Requested a key that does not exist'));
        }
        const data = [];
        return client.keys(key, async (err, keys) => {
            if (err) {
                return reject(logger.info(err));
            }
            if (key === ('X*' || null || undefined)) {
                data.push({ error: `no entries in db for ${key}` });
                return fullfill(data);
            }
            console.time('loop_getcachearray');
            for (let i = 0, len = keys.length; i < len; i++) {
                Promise.all(data.push(getCacheArray(keys[i])));
            }
            console.timeEnd('loop_getcachearray');
            const resp = JSON.stringify(data);
            return fullfill(JSON.parse(resp));
        });
    });
}

/**
 * erases all local Redis db entries
 */
function flushCache() {
    logger.info('flushing db...');
    client.flushall();
}

exports.flush = flushCache;
exports.getCacheArray = getCacheArray;
exports.getKey = getKey;
