const express = require('express');
const redis = require('../../controllers/redis');
const logger = require('../../config/logger');
const svtapi = require('../../controllers/svtplay');

const router = express.Router();

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

module.exports = router;
