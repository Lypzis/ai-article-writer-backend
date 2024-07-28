const express = require('express');
const { getPaginatedArticles } = require('../controllers/articleController');

const router = express.Router();

router.get('/', getPaginatedArticles);

module.exports = router;
