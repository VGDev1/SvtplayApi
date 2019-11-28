const express = require('express');

const svtapi = require('../controllers/svtplay.js');

const router = express.Router();

router.get('/', (req, res) => {
    const { url } = req.query;
    console.log(url);
    const resp = svtapi.getURL(url)
        .then((r) => res.json({ message: r }))
        .catch((e) => console.log(e));
});


module.exports = router;
