const express = require('express');
const fetch = require('fetch');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

/* GET users listing. */
router.get('/m3u8', (req, res, next) => {
    res.json({ error: { message: 'nothing here yet', yeetLevel: 'yeeeeeet.' } });
});

module.exports = router;
