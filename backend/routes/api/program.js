import { Router } from 'express';
import { cache } from '../../controllers/redis';
import { checkNewCache } from '../../services/cache';
import logger from '../../config/logger';

const svtapi = require('../../controllers/svtplay');

const router = Router();

/**
 * Function for getting all programs from both svt API's
 *  and returning parsed, fully functional json for backend response
 */
const getAllPrograms = async () => {
    const getSimple = await svtapi.getURLProxy(svtapi.programUrlSimple, 'simple');
    const simpleJson = svtapi.createSimpleJson(getSimple);
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
router.get('/program/:id', checkNewCache, async (req, res, next) => {
    logger.info(req.params.id);
    const data = await getAllPrograms();
    cache(data);
    return res.json({ program: data });
});

module.exports = router;
