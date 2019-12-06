const express = require('express');
const logger = require('../config/logger');
const svtapi = require('../controllers/svtplay.js');

const router = express.Router();

router.get('/', async (req, res) => {
    const { url } = req.query;
    logger.info(url);
    try {
        const data = svtapi.getURLProxy(url);
        const resp = await data.json();
        return res.json({ message: resp });
    } catch (e) {
        return logger.error(e);
    }
});

module.exports = router;
