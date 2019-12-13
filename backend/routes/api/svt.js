const express = require('express');
const redis = require('../../controllers/redis');
const logger = require('../../config/logger');
const cache = require('../../controllers/cache');

const router = express.Router();
const svtapi = require('../../controllers/svtplay');

/**
 * Function for getting all programs from both svt API's
 *  and returning parsed, fully functional json for backend response
 */
const getAllPrograms = async () => {
    const getSimple = svtapi.getURLProxy(svtapi.programUrlSimple, 'simple');
    const simpleJson = svtapi.createSimpleJson(await getSimple);
    const AdvancedJson = svtapi.getURL(svtapi.programUrl, 'programUrl');
    const pr = Promise.all([simpleJson, AdvancedJson]);
    try {
        const p = await pr;
        const d = svtapi.createAdvancedJson(p[0], p[1]);
        return svtapi.createSortedJson(d);
    } catch (e) {
        return logger.error(e);
    }
};

router.get('/test', async (req, res) => {
    console.time('newDB');
    const data = await redis.getKeys('*');
    const getHash = async (key) => redis.getKeyHash(key);
    const resp = data.map(async (key) => {
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
    res.json({ obj });
});

/**
 * Return 404 error if trying to access root path
 */
router.get('/', (req, res) => {
    res.status(404).json({ message: 'forbidden' });
});

/**
 * Get Video id for certain program
 * where /:id path is the svtVideoId for the show
 */
router.get('/getVideoId/:id', (req, res, next) => {
    console.log(req.params.id);
    svtapi
        .getSvtVideoId(req.params.id)
        .then((r) => res.json({ svtVideoId: r }))
        .catch((e) => logger.error(e));
});

/**
 * Router for getting a json response of programs
 * @param /:id takes a Character or special-string
 * A-Ö, for a repsonse of all programs that starts with the character,
 * AO - responds with all programs available
 * populart - response with the 50 most popular programs right now
 */
router.get('/program/:id', cache.checkCache, async (req, res, next) => {
    logger.info(req.params.id);
    const data = await getAllPrograms();
    redis.cache(data);
    return res.json({ program: data });
});

/*
 * Get M3u8 link for a show where
 * /:id is the ...
 */
router.get('/m3u8/:id', (req, res, next) => {
    svtapi
        .getM3u8Link(req.params.id)
        .then((link) => res.json({ m3u8: link }))
        .catch((e) => logger.info(e));
});

router.get('/episodes/:slug', async (req, res, next) => {
    console.log(req.params.slug);
    const data = await svtapi.getEpisodes(req.params.slug);
    return res.json({ data });
});

module.exports = router;
