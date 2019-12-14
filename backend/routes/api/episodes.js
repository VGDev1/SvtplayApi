const express = require('express');
const svtapi = require('../../controllers/svtplay');

const router = express.Router();

router.get('/episodes/:slug', async (req, res, next) => {
    console.log(req.params.slug);
    const data = await svtapi.getEpisodes(req.params.slug);
    return res.json({ data });
});

module.exports = router;
