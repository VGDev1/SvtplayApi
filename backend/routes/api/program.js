const express = require('express');
const redis = require('../../controllers/redis');
const logger = require('../../config/logger');
const cache = require('../../controllers/cache');
const svtapi = require('../../controllers/svtplay');

const router = express.Router();

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

/**
 * Router for getting a json response of programs
 * @param /:id takes a Character or special-string
 * A-Ö, for a repsonse of all programs that starts with the character,
 * AO - responds with all programs available
 * populart - response with the 50 most popular programs right now
 */
router.get('/program/:id', cache.checkNewCache, async (req, res, next) => {
    logger.info(req.params.id);
    const data = await getAllPrograms();
    redis.cache(data);
    return res.json({ program: data });
});

module.exports = router;
