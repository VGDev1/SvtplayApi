const express = require('express');
const redis = require('../../controllers/redis');
const logger = require('../../config/logger');

const router = express.Router();
const svtapi = require('../../controllers/svtplay');

const getAllPrograms = async () => {
    const p1 = svtapi
        .getURLProxy(svtapi.programUrlSimple, 'simple')
        .then((r) => svtapi.createSimpleJson(r));
    const p2 = svtapi.getURL(svtapi.programUrl, 'programUrl');
    const pr = Promise.all([p1, p2]);
    try {
        const p = await pr;
        const d = svtapi.createAdvancedJson(p[0], p[1]);
        return svtapi.createSortedJson(d);
    } catch (e) {
        return logger.error(e);
    }
};

/**
 * Return 404 error if trying to access root path
 */
router.get('/', (req, res) => {
    res.status(404).json({ message: 'forbidden' });
});

/**
 * Get Video id for certain program
 */
router.get('/getVideoId/:id', (req, res, next) => {
    svtapi
        .getSvtVideoId(req.params.id)
        .then((r) => res.json({ svtVideoId: r }))
        .catch((e) => logger.error(e));
});

/**
 * Check if cache exists, else go to next getter for same path
 */
router.get('/program/:id', async (req, res, next) => {
    function id() {
        if (req.params.id == 'AO') return '*';
        if (req.params.id == 'X' || undefined || null) return next();
        if (req.params.id == 'populart') return '*';
        return `${req.params.id}*`;
    }
    const data = await redis.getKey(id()).catch((e) => logger.error(`Error: ${e.message}`));
    if (data != undefined && data.length > 2) return res.json({ data: JSON.parse(data) });
    return logger.info('Did not find any cache. Or was an error thrown?');
});

router.get('/program/:id', async (req, res, next) => {
    logger.info(req.params.id);
    return res.json({ error: 'Endpoint does not exist' });
});

/* GET users listing. */
router.get('/m3u8/:id', (req, res, next) => {
    svtapi
        .getM3u8Link(req.params.id)
        .then((link) => res.json({ m3u8: link }))
        .catch((e) => logger.info(e));
});

module.exports = router;
