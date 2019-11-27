const express = require('express');
const fetch = require('fetch');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

/* GET users listing. */
router.use('/svt', require('./api/svt'));

module.exports = router;
