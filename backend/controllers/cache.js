const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const hashModel = require('../config/models');
const redis = require('./redis');
const logger = require('../config/logger');

/**
 * Autocaching method that fetches all programs endpoint
 * and stores the response to redis
 */
exports.cache = async (req, res) => {
    console.time('AUTO FETCH');
    const d1 = await fetch('http://localhost:3000/api/svt/program/AO');
    const atillo = await d1.json();
    console.time('cache');
    redis.cache(atillo);
    fs.writeFile(path.join(__dirname, '../public/json/test.json'), null, err => {
        if (err) return console.error(err);
        return console.log('successfully wrote test file');
    });
    console.timeEnd('cache');
    console.timeEnd('AUTO FETCH');
};

/**
 * Check if cache exists, else go to next router.get for same path
 */
exports.checkCache = async (req, res, next) => {
    console.time('getById');
    async function getById() {
        if (req.params.id === 'AO') return redis.getKey('*');
        if (req.params.id === 'populart') return redis.getMostPopular(50);
        if (req.params.id.match(/^[A-Z]{1}/)) return redis.getKey(`${req.params.id}*`);
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
function parseCache(keys, length = keys.length) {
    const getHash = async key => redis.getKeyHash(key);
    const resp = keys.map(async key => {
        const hash = await getHash(key);
        return hashModel.hashModel(key, hash);
    });
    const data = length < keys.length ? Promise.all(resp).splice(0, length) : Promise.all(resp);
    return data;
}

exports.checkNewCache = async (req, res, next) => {
    async function getById() {
        if (req.params.id === 'AO') {
            const keys = await redis.getKeys('*');
            return parseCache(keys);
        }
        if (req.params.id === 'populart') {
            const keys = await redis.getKeys('*');
            return parseCache(keys, 50);
        }
        if (req.params.id.match(/^[A-Z]{1}/)) {
            const keys = redis.getKeys(`${req.params.id}*`);
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
