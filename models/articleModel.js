import { Schema, model } from 'mongoose';

const ArticleSchma = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  tags: [String],
  link: { type: String, default: null },
});

export default model('Article', ArticleSchma);
