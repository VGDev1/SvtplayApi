const express = require('express');
const cache = require('express-redis-cache')();

const router = express.Router();
const svtapi = require('../../controllers/svtplay');

const getAllPrograms = async () => {
    const p1 = svtapi.getURLProxy(svtapi.programUrlSimple, 'simple').then((r) => svtapi.createSimpleJson(r));
    const p2 = svtapi.getURL(svtapi.programUrl, 'programUrl');
    const pr = Promise.all([p1, p2]);
    try {
        const p = await pr;
        const d = svtapi.createAdvancedJson(p[0], p[1]);
        return svtapi.createSortedJson(d);
    } catch (e) {
        return console.error(e);
    }
};

router.get('/', (req, res) => {
    res.status(404).json({ message: 'forbidden' });
});

router.get('/getVideoId/:id', (req, res, next) => {
    svtapi
        .getSvtVideoId(req.params.id)
        .then((r) => res.json({ svtVideoId: r }))
        .catch((e) => console.log(e));
});

router.get('/program/:id', cache.route(), (req, res, next) => {
    if (req.params.id === 'AO') {
        getAllPrograms().then((d) => res.json(d));
    } else if (req.params.id === 'populart') {
        getAllPrograms()
            .then((d) => d.slice(0, 50))
            .then((r) => res.json(r));
    }
});

/* GET users listing. */
router.get('/m3u8/:id', (req, res, next) => {
    svtapi
        .getM3u8Link(req.params.id)
        .then((link) => res.json({ m3u8: link }))
        .catch((e) => console.log(e));
});

module.exports = router;
