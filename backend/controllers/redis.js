const redis = require('redis');
const rejson = require('redis-rejson');
const logger = require('../config/logger');

const client = redis.createClient();
client.on('error', (err) => {
    logger.error(`Error ${err}`);
});

function Cache(data) {
    for (let i = 0; i < data.length; i++) {
        client.hset(data[i][0], 'thumbnail', data[i][1]);
        client.hset(data[i][0], 'svtId', data[i][2]);
        client.hset(data[i][0], 'populäritet', data[i][3]);
        client.hset(data[i][0], 'type', 'application/json; charset=utf-8');
    }
}

function getCache(data) {
    for (let i = 0; i < data.length; i++) {
        const tn = client.hget(data[i][0], 'thumbnail');
        const id = client.hget(data[i][0], 'svtId');
        const pop = client.hget(data[i][0], 'populäritet');
    }
}

function flushCache() {
    client.flushall();
}

exports.cache = Cache;
exports.flush = flushCache;
exports.getCache = getCache;
