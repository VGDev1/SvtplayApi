const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
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
    fs.writeFile(path.join(__dirname, '../public/json/test.json'), null, (err) => {
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
        if (req.params.id == 'AO') return redis.getKey('*');
        if (req.params.id == 'populart') return redis.getMostPopular(50);
        if (req.params.id.match(/^[A-Z]{1}/)) return redis.getKey(`${req.params.id}*`);
        if (!/^[A-Z]{1}/.test(req.params.id)) {
            return res.send({ error: 'Invalid request. Must be uppercase' }).end();
        }
        return next();
    }
    console.timeEnd('getById');
    console.time('getDB');
    const data = await getById().catch((e) => console.log(e));
    console.timeEnd('getDB');
    try {
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
    } catch (e) {
        return null;
    }
    return logger.info('Did not find any cache. Was an error thrown?');
};
