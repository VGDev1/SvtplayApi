import { Router } from 'express';
import { getKeys, getKeyHash } from '../../controllers/redis';
import logger from '../../config/logger';
import { hashModel } from '../../config/models';

const router = Router();

router.use(require('./svt/program'));
router.use(require('./svt/episodes'));
router.use(require('./svt/videoId'));
router.use(require('./svt/m3u8'));
/**
 * Return 404 error if trying to access root path
 */
router.get('/', (req, res) => {
    res.status(404).json({ message: 'forbidden' });
});

/* DEBUG ROUTE */

router.get('/test', async (req, res) => {
    try {
        console.time('newDB');
        const data = await getKeys('*');
        const getHash = async key => getKeyHash(key);
        const resp = data.map(async key => {
            const hash = await getHash(key);
            return hashModel(key, hash);
        });
        const obj = await Promise.all(resp);
        console.timeEnd('newDB');
        res.json({ program: obj });
    } catch (e) {
        logger.error(e.message);
    }
});

export default router;
