const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const cors = require('cors');
const axios = require('axios');

const Article = require('./models/Article');

const app = express();
app.use(express.json());

app.use(cors()); // Use cors

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
  res.json(articles);
});

const generateArticle = async () => {
  try {
    const response = await axios.post(
      process.env.OPEN_AI_ENGINE_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert writer on programming topics.',
          },
          {
            role: 'user',
            content:
              'Generate a unique and detailed programming article on JavaScript. The article should include an introduction, main content with explanations and examples, and a conclusion.',
          },
        ],
        max_tokens: 1500,
        n: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
        },
      }
    );
    console.log('Full response:', JSON.stringify(response.data, null, 2));

    const content = response.data.choices[0].message.content;

    console.log('Generated content:', content);

    const title = content.split('\n')[0];
    const body = content.split('\n').slice(1).join('\n');
    const description = 'test description';
    const tags = ['JavaScript'];

    const article = new Article({ title, body, tags, description });
    await article.save();

    article.link = `http://localhost:3000/articles/${article._id}`;
    await article.save();
  } catch (error) {
    console.error(
      'Error generating article:',
      error.response ? error.response.data : error.message
    );
  }
};

cron.schedule('0 9 * * *', generateArticle); // Runs every day at 9 AM

// test 01
generateArticle();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
