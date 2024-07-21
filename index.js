const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const axios = require('axios');
const session = require('express-session');
// const passport = require('passport');
// const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

const Article = require('./models/Article');

const app = express();
app.use(express.json());

// Load env variables
dotenv.config();

// MongoDb connection
mongoose.connect(process.env.MONGO_URI);

// LinkedIn app credentials
// const LINKEDIN_KEY = process.env.LINKEDIN_CLIENT_ID;
// const LINKEDIN_SECRET = process.env.LINKEDIN_CLIENT_SECRET;

const PORT = process.env.PORT || 5000;

app.get('/articles', async (req, res) => {
  const articles = await Article.find();
});

const generateArticle = async () => {
  try {
    const response =
      (process.env.OPEN_AI_ENGINE_URL,
      {
        prompt: 'Generate a unique programming article on JavaScript:',
        max_tokens: 1500,
        n: 1,
        stop: ['\n'],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
        },
      });

    const content = response.data.choices[0].text;
    const title = content.split('\n')[0];
    const body = content.split('\n').slice(1).join('\n');
    const tags = ['JavaScript'];

    const article = new Article({ title, body, tags });
    await article.save();

    article.link = `http://localhost:3000/articles/${article._id}`;
    await article.save();
  } catch (error) {
    console.error('Error generating article:', error);
  }
};

cron.schedule('0 9 * * *', generateArticle); // Runs every day at 9 AM

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
