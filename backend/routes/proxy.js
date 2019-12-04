const express = require('express');
const logger = require('../config/logger');
const svtapi = require('../controllers/svtplay.js');

const router = express.Router();

router.get('/', (req, res) => {
    const { url } = req.query;
    logger.info(url);
    svtapi
        .getURLProxy(url)
        .then((resp) => res.json({ message: resp }))
        .catch((e) => logger.info(e));
});

module.exports = router;
