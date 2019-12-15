import { Router } from 'express';
import { error } from '../../../config/logger';
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
        .catch(e => error(e));
});

module.exports = router;
