import express from 'express';
import logger from '../../config/logger';
import { getM3u8Link } from '../../controllers/svtplay';

const router = express.Router();

/**
 * @router to get m3u8 link for show
 * @param id svtVideoId for the show
 */
router.get('/m3u8/:id', async (req, res) => {
    try {
        const resp = await getM3u8Link(req.params.id);
        res.json({ m3u8: resp });
    } catch (e) {
        logger.error(e);
    }
});

module.exports = router;
