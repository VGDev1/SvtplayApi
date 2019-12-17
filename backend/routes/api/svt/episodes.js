import { Router } from 'express';
import { getEpisodes } from '../../../controllers/svtplay';

const router = Router();

router.get('/episodes/:slug', async (req, res, next) => {
    try {
        console.log(req.params.slug);
        const data = await getEpisodes(req.params.slug);
        return res.json({ data });
    } catch (e) {
        return next(e);
    }
});

module.exports = router;
