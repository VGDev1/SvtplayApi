const express = require('express');
const redis = require('../../controllers/redis');
const logger = require('../../config/logger');
const cache = require('../../controllers/cache');

const router = express.Router();

router.use(require('./program'));
router.use(require('./episodes'));
router.use(require('./videoId'));
router.use(require('./m3u8'));

/**
 * Return 404 error if trying to access root path
 */
router.get('/', (req, res) => {
    res.status(404).json({ message: 'forbidden' });
});

/* DEBUG ROUTE */

router.get('/test', async (req, res) => {
    try {
        console.time('newDB');
        const data = await redis.getKeys('*');
        const getHash = async key => redis.getKeyHash(key);
        const resp = data.map(async key => {
            const hash = await getHash(key);
            return {
                name: key,
                id: hash.id,
                slug: hash.slug,
                thumbnail: hash.thumbnail,
                popularity: hash.popularity,
                type: hash.type,
            };
        });
        const obj = await Promise.all(resp);
        console.timeEnd('newDB');
        res.json({ program: obj });
    } catch (e) {
        logger.error(e.message);
    }
});

module.exports = router;
