import redis from 'redis';
import bluebird from 'bluebird';
import logger from '../config/logger';

const client = redis.createClient();

bluebird.promisifyAll(redis.Multi.prototype);
bluebird.promisifyAll(redis.RedisClient.prototype);

client.on('connect', () => {
    logger.info('connected to redis DB');
});
client.on('error', err => {
    logger.error(`Error ${err}`);
});

/**
 * @deprecated
 * ! REPLACED BY setHashMap
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
 * @async
 * @exports
 * @description
 * Set a multiple hashes (field, values) to a key in RedisDB
 * set hash to key as { key : fields[i], values[i] }
 * @param {string} key the key to set hashMap to
 * @param {string[]} fields an array containting all fields [field1, field2 ...]
 * @param {any[]} values values to set to fields [value1, value2 ...]
 */
export async function setHashMap(key, fields, values) {
    if (!Array.isArray(fields && values)) throw Error('args: field & values must be typeof Arrays');
    if (fields.length !== values.length) throw Error(`Fields: (length: ${fields.length}) Values: (length: ${values.length}) must have equal length`);
    return fields.forEach((field, i) => client.hmsetAsync(key, [field, values[i]]).Multi);
}
/**
 * Get all keys from redisDB by pattern matching
 * @param {any} key keypattern to match redis GET-query (MUST BE FOLLOWED BY * to get ALL! [ ex. 'A*' ] )
 */
export async function getKeys(key) {
    return client.keysAsync(key);
}
/**
 * Get all hashes (field, value) beloning to a key in RedisDB
 * @param {any} key keypattern to match redis GET-query (MUST BE FOLLOWED BY * to get ALL! [ ex. 'A*' ] )
 */
export async function getKeyHash(key) {
    return client.hgetallAsync(key);
}

/**
 * erases all local Redis db entries
 * ! USE WITH CAUTION
 */
export function flushCache() {
    logger.info('flushing db...');
    return client.flushall();
}
