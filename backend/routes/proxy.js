const express = require('express');
const fetch = require('fetch');

const router = express.Router();

router.get('/:url', (req, res) => {
    const { url } = req.params;
    console.log(url);
    // fetch(`localhost:8080/${url}`);
    res.json({ message: url });
});


module.exports = router;
