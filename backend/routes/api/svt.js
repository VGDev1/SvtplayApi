import { Router } from 'express';

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
    return res.status(200).end();
});

export default router;
