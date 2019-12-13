const redis = require('redis');
const bluebird = require('bluebird');
const logger = require('../config/logger');

const client = redis.createClient();

bluebird.promisifyAll(client);

client.on('connect', () => {
    logger.info('connected to redis DB');
});
client.on('error', (err) => {
    logger.error(`Error ${err}`);
});

/**
 * @deprecated replaced by cache.js controller
 */
async function Cache(data) {
    for (let i = 0; i < data.length; i++) {
        client.hset(data[i].title, 'id', data[i].id);
        client.hset(data[i].title, 'slug', data[i].slug);
        client.hset(data[i].title, 'thumbnail', data[i].thumbnail);
        client.hset(data[i].title, 'popularity', data[i].popularity);
        client.hset(data[i].title, 'type', data[i].type);
    }
}

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
async function getCacheArray(data) {
    const array = [];
    await getHashKey(data).then((resp) => array.push(resp));
    return {
        name: array[0].entry,
        svtId: array[0].keys.id,
        slug: array[0].keys.slug,
        thumbnail: array[0].keys.thumbnail.replace(140, 400),
        popularity: array[0].keys.popularity,
        type: array[0].keys.type,
    };
}

exports.getKeys = async (key) => {
    return client.keysAsync(key);
};

exports.getKeyHash = async (key) => {
    return client.hgetallAsync(key);
};

/**
 * Get keys from Redis DB by pattern matching
 * @param key - key pattern to fetch from db. A* A? etc.
 * returns JSON as a string. to use as valid json,
 * JSON.parse() the response from this function.
 */
async function getKey(key) {
    return new Promise((fullfill, reject) => {
        if (key == undefined || null) {
            return reject(new Error('Requested a key that does not exist'));
        }
        const data = [];
        return client.keys(key, async (err, keys) => {
            if (err) {
                return reject(logger.info(err));
            }
            if (key == ('X*' || null || undefined)) {
                data.push({ error: `no entries in db for ${key}` });
                return fullfill(data);
            }
            console.time('loop_getcachearray');
            for (let i = 0, len = keys.length; i < len; i++) {
                data.push(await getCacheArray(keys[i]));
            }
            console.timeEnd('loop_getcachearray');
            const resp = await JSON.stringify(data);
            return fullfill(JSON.parse(resp));
        });
    });
}

/**
 * Gets the n most popular program on SVTPlay
 * @param {*} n - numbers of popular programs wanted to be reieceved.
 */
async function getMostPopular(n) {
    const db = await getKey('*');
    return db.sort((a, b) => parseFloat(b.popularity) - parseFloat(a.popularity)).splice(0, n);
}

/**
 * erases all local Redis db entries
 */

function flushCache() {
    logger.info('flushing db...');
    client.flushall();
}

exports.cache = Cache;
exports.flush = flushCache;
exports.getCacheArray = getCacheArray;
exports.getKey = getKey;
exports.getMostPopular = getMostPopular;
