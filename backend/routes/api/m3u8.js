const express = require('express');
const redis = require('../../controllers/redis');
const logger = require('../../config/logger');
const svtapi = require('../../controllers/svtplay');

const router = express.Router();

/**
 * @router to get m3u8 link for show
 * @param id svtVideoId for the show
 */
router.get('/m3u8/:id', async (req, res, next) => {
    try {
        const resp = await svtapi.getM3u8Link(req.params.id);
        res.json({ m3u8: resp });
    } catch (e) {
        logger.error(e);
    }
});

module.exports = router;
