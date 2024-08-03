import { Router } from 'express';
import { getPaginatedArticles } from '../controllers/articleController';

const router = Router();

router.get('/', getPaginatedArticles);

export default router;
