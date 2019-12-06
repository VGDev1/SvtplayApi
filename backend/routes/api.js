const express = require('express');
const fetch = require('fetch');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(404).json({ message: 'forbidden path', error: 'Endpoint does not exist.' });
});

/* API path for svt */
router.use('/svt', require('./api/svt'));

module.exports = router;
