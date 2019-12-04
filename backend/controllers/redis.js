const redis = require('redis');
const rejson = require('redis-rejson');
const logger = require('../config/logger');

rejson(redis);

const client = redis.createClient();

client.on('connect', () => {
    logger.info('connected to redis DB');
});
client.on('error', (err) => {
    logger.error(`Error ${err}`);
});

async function Cache(data) {
    for (let i = 0; i < data.length; i++) {
        client.hset(data[i][0], 'thumbnail', data[i][1]);
        client.hset(data[i][0], 'svtId', data[i][2]);
        client.hset(data[i][0], 'popularitet', data[i][3]);
        client.hset(data[i][0], 'type', 'application/json; charset=utf-8');
    }
}

function jsonSet(data) {
    client.json_set('allaProgram', '.', data, (err) => {
        if (err) {
            throw err;
        }
        logger.info('Set JSON at key');
        client.json_get('my-json', '.test', (err, value) => {
            if (err) {
                throw err;
            }
            logger.info('value of test:', value); // outputs 1234
            client.quit();
        });
    });
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
            if (err) reject(console.error(err));
            return fullfill({ entry, keys });
        });
    });
}

async function getCacheArray(data) {
    const array = [];
    await getHashKey(data).then((resp) => array.push(resp));
    return {
        name: array[0].entry,
        thumbnail: array[0].keys.thumbnail,
        svtId: array[0].keys.svtId,
        popularitet: array[0].keys.popularitet,
    };
}

/**
 * Get keys from Redis DB  by pattern matching
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
            for (let i = 0, len = keys.length; i < len; i++) {
                data.push(await getCacheArray(keys[i]));
            }
            return fullfill(JSON.stringify(data));
        });
    });
}

/**
 * Gets the n most popular program on SVTPlay
 * @param {*} n - numbers of popular programs wanted to be reieceved.
 */
async function getMostPopular(n) {
    const db = await getKey('*');
    const json = await JSON.parse(db);
    return json.sort((a, b) => parseFloat(b.popularitet) - parseFloat(a.popularitet)).splice(0, n);
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
exports.jsonSet = jsonSet;
exports.getKey = getKey;
exports.getMostPopular = getMostPopular;
