import { Router } from 'express';
import svtapi from '../../../controllers/svtplay';

const router = Router();

router.get('/episodes/:slug', async (req, res, next) => {
    console.log(req.params.slug);
    const data = await svtapi.getEpisodes(req.params.slug);
    return res.json({ data });
});

module.exports = router;
