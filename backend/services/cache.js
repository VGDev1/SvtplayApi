import { writeFile } from 'fs';
import path from 'path';
import logger from '../config/logger';
import { hashModel, hashArrays } from '../config/models';
import { getKeys, getKeyHash, setHashMap } from '../controllers/redis';
import { getAllPrograms } from '../controllers/svtplay';

/**
 * caches an object in RedisDB
 * @param {{string: any}} data json object to cache
 * @returns {Promise<string>} success string or error
 */
export async function cache(data) {
    try {
        data.map(async (obj, i) => {
            const fv = await hashArrays(obj);
            setHashMap(data[i].title, fv[0], fv[1]).catch(e => logger.error(e.message));
        });
        return 'success';
    } catch (e) {
        return logger.error(e);
    }
}

/**
 * Autocaching method that fetches all programs endpoint
 * and stores the response to redis
 */
export const autoCache = async (req, res) => {
    console.time('fetch');
    const program = await getAllPrograms();
    console.timeEnd('fetch');
    console.time('write');
    writeFile(path.join(__dirname, '../public/test.json'), JSON.stringify(program), err => {
        if (err) return logger.error(err.message);
        return null;
    });
    console.timeEnd('write');
    console.time('cache');
    cache(program);
    console.timeEnd('cache');
};

/**
 * Check if cache exists, else go to next router.get for same path
 * @deprecated
 * ! NOT IN USE
 */
export const checkCache = async (req, res, next) => {
    console.time('getById');
    async function getById() {
        if (req.params.id === 'AO') return getKeys('*');
        // if (req.params.id === 'populart') return getMostPopular(50);
        if (req.params.id.match(/^[A-Z]{1}/)) return getKeys(`${req.params.id}*`);
        if (!/^[A-Z]{1}/.test(req.params.id)) {
            return res.send({ error: 'Invalid request. Must be uppercase' }).end();
        }
        return next();
    }
    console.timeEnd('getById');
    console.time('getDB');
    const data = await getById().catch(e => next(e.message));
    console.timeEnd('getDB');
    try {
        if (data.length === 0) return next();
        if (data && data[0].err) return res.json({ err: data[0].err });
        if (data) {
            const sorted = data.sort((a, b) => {
                const x = a.name.toLowerCase();
                const y = b.name.toLowerCase();
                if (x < y) return -1;
                if (x > y) return 1;
                return 0;
            });
            return res.json({ program: sorted });
        }
        return next();
    } catch (e) {
        logger.error(e);
    }
    return logger.info('Did not find any cache. Was an error thrown?');
};

/**
 * function that parses data from RedisDB and returns correct JSON format
 * @param {string[]} keys all keys recieved from DB
 * @param {number} length the length of response wanted (used for most popular, etc)
 * @returns {Promise<any[]>}
 */
async function parseCache(keys) {
    const getHash = async key => getKeyHash(key);
    const resp = keys.map(async (key, i) => {
        const hash = await getHash(key);
        return hashModel(key, hash);
    });
    const data = await Promise.all(resp);
    return data;
}

/**
 * Middleware that checks redisDB for cache based on request param ID
 */
export const checkNewCache = async (req, res, next) => {
    const query = decodeURIComponent(req.params.id);
    async function getById() {
        if (query === 'AO') {
            console.time('keys');
            const keys = await getKeys('*');
            console.timeEnd('keys');
            console.time('cache');
            return parseCache(keys);
        }
        if (query === 'populart') {
            const keys = await getKeys('*');
            const data = await parseCache(keys);
            const pops = data.sort((a, b) => parseFloat(b.popularity) - parseFloat(a.popularity)).splice(0, 50);
            return pops;
        }
        if (query.match(/^[A-Z]{1}/) || query.match(/[Ä-Ö]{1}/)) {
            const keys = await getKeys(`${query}*`);
            return parseCache(keys);
        }
        if (!/^[A-Z]{1}/.test(query)) return res.send({ error: 'Invalid request. Must be uppercase' }).end();
        return next();
    }
    try {
        console.time('newDB');
        const data = await getById();
        if (data.length === 0) return next();
        console.timeEnd('newDB');
        return res.json({ program: data });
    } catch (e) {
        return logger.error(e.message);
    }
};
