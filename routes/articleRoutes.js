import { Router } from 'express';
import { getPaginatedArticles } from '../controllers/articleController.js';

const router = Router();

router.get('/', getPaginatedArticles);

export default router;
