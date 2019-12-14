import api from './api';
import proxy from './proxy';

const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'Express' });
});

router.use('/proxy', proxy);
router.use('/api', api);

module.exports = router;
