const express = require('express');

const svtapi = require('../controllers/svtplay.js');

const router = express.Router();

router.get('/', (req, res) => {
    const { url } = req.query;
    console.log(url);
    svtapi.getURLProxy(url)
        .then((resp) => res.json({ message: resp }))
        .catch((e) => console.log(e));
});


module.exports = router;
