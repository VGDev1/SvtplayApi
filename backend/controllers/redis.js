const redis = require('redis');
const rejson = require('redis-rejson');
const logger = require('../config/logger');

function Cache(data) {
    const cacheTime = (60 - new Date().getMinutes()) * 60;
    console.log(cacheTime);
    for (let i = 0; i < data.length; i++) {
        console.log(data[i][0]);
    }
}

exports.cache = Cache;
