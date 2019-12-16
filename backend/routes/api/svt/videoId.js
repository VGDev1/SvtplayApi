import { Router } from 'express';
import logger from '../../../config/logger';
import { getSvtVideoId } from '../../../controllers/svtplay';

const router = Router();

/**
 * Get Video id for certain program
 * where /:id path is the svtVideoId for the show
 */
router.get('/getVideoId/:id', (req, res, next) => {
    console.log(req.params.id);
    getSvtVideoId(req.params.id)
        .then(r => res.json({ svtVideoId: r }))
        .catch(e => logger.error(e));
});

module.exports = router;
