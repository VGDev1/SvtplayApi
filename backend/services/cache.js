import fetch from 'node-fetch';
import { writeFile } from 'fs';
import path from 'path';
import logger from '../config/logger';
import { hashModel } from '../config/models';
import { cache, getKeys, getKeyHash } from '../controllers/redis';

/**
 * Autocaching method that fetches all programs endpoint
 * and stores the response to redis
 */
exports.cache = async (req, res) => {
    console.time('AUTO FETCH');
    const d1 = await fetch('http://localhost:3000/api/svt/program/AO');
    const atillo = await d1.json();
    console.time('cache');
    cache(atillo);
    writeFile(path.join(__dirname, '../public/json/test.json'), null, err => {
        if (err) return console.error(err);
        return console.log('successfully wrote test file');
    });
    console.timeEnd('cache');
    console.timeEnd('AUTO FETCH');
};

/**
 * Check if cache exists, else go to next router.get for same path
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
    const data = await getById().catch(e => console.log(e));
    console.timeEnd('getDB');
    try {
        if (data.length === 0) return next();
        if (data && data[0].err) return res.json({ err: data[0].err });
        if (data) {
            const sorted = data.sort((a, b) => {
                const x = a.name.toLowerCase();
                const y = b.name.toLowerCase();
                if (x < y) {
                    return -1;
                }
                if (x > y) {
                    return 1;
                }
                return 0;
            });
            return res.json({ program: sorted });
        }
        return next();
    } catch (e) {
        console.log(e);
    }
    return logger.info('Did not find any cache. Was an error thrown?');
};

/**
 * function that parses data from RedisDB and returns correct JSON format
 * @param {string[]} keys all keys recieved from DB
 * @param {number} length the length of response wanted (used for most popular, etc)
 * @returns {Promise<any[]>} test
 */
async function parseCache(keys) {
    const getHash = async key => getKeyHash(key);
    const resp = keys.map(async key => {
        const hash = await getHash(key);
        return hashModel(key, hash);
    });
    const data = await Promise.all(resp);
    return data;
}

export const checkNewCache = async (req, res, next) => {
    async function getById() {
        if (req.params.id === 'AO') {
            const keys = await getKeys('*');
            return parseCache(keys);
        }
        if (req.params.id === 'populart') {
            const keys = await getKeys('*');
            const data = await parseCache(keys);
            const pops = data.sort((a, b) => parseFloat(b.popularity) - parseFloat(a.popularity));
            return pops;
        }
        if (req.params.id.match(/^[A-Z]{1}/)) {
            const keys = await getKeys(`${req.params.id}*`);
            return parseCache(keys);
        }
        if (!/^[A-Z]{1}/.test(req.params.id)) return res.send({ error: 'Invalid request. Must be uppercase' }).end();
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
