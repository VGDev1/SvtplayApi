const redis = require('redis');
const rejson = require('redis-rejson');
const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');

rejson(redis);

const client = redis.createClient();
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
 * Get cache from Redis db
 * @param {*} data - json object to iterate over
 * to check if Redis db contains hashSet for keys in data
 */

/**
 * Get key from Redis
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
