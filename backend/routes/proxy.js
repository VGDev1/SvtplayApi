const express = require('express');
const fetch = require('fetch');

const router = express.Router();

router.get('/', (req, res) => {
    const { url } = req.query;
    console.log(url);
    // fetch(`localhost:8080/${url}`);
    res.json({ message: url });
});


module.exports = router;
