/* eslint-disable import/no-named-as-default-member */
import { Router } from 'express';
import { checkNewCache, cache } from '../../../services/cache';
import logger from '../../../config/logger';
import { getAllPrograms } from '../../../controllers/svtplay';

const router = Router();

/**
 * Router for getting a json response of programs
 * @param /:id takes a Character or special-string
 * A-Ö, for a repsonse of all programs that starts with the character,
 * AO - responds with all programs available
 * populart - response with the 50 most popular programs right now
 */
router.get('/program/:id', checkNewCache, async (req, res, next) => {
    try {
        logger.info(req.params.id);
        console.log('hej');
        const data = await getAllPrograms();
        cache(data);
        return res.json({ program: data });
    } catch (e) {
        return next(e);
    }
});

module.exports = router;
