import express from 'express';
import logger from '../config/logger';
import { getURLProxy } from '../controllers/svtplay';

const router = express.Router();

router.get('/', async (req, res) => {
    const { url } = req.query;
    logger.info(url);
    try {
        const data = getURLProxy(url);
        const resp = await data.json();
        return res.json({ message: resp });
    } catch (e) {
        return logger.error(e);
    }
});

export default router;
