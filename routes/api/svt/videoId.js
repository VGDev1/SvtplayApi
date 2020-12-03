import { Router } from 'express';
import logger from '../../../config/logger';
import { getSvtVideoId } from '../../../controllers/svtplay';

const router = Router();

/**
 * Get Video id for certain program
 * where /:id path is the svtVideoId for the show
 */
router.get('/getVideoId/:id', async (req, res, next) => {
    try {
        const r = await getSvtVideoId(req.params.id);
        return res.json({ svtVideoId: r });
    } catch (e) {
        return next(e);
    }
});

module.exports = router;
