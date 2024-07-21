const mongoose = require('mongoose');

const ArticleSchma = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  tags: [String],
  link: { type: String, default: null },
});

module.exports = mongoose.model('Article', ArticleSchma);
