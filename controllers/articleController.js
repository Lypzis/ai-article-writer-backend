import axios from 'axios';
import Article from '../models/articleModel.js';
import testData from '../test/mockData.js';
import dotenv from 'dotenv';
dotenv.config();

// Get articles
export const getPaginatedArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 articles per page

    const skip = (page - 1) * limit;

    // Fetch paginated data and total count of documents
    const [articles, total] = await Promise.all([
      Article.find().skip(skip).limit(limit).exec(),
      Article.countDocuments().exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: articles,
      pagination: {
        page,
        limit,
        totalPages,
        totalArticles: total,
      },
    });
  } catch (error) {
    console.error('Error fetching paginated articles:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch articles',
      error: error.message,
    });
  }
};

// Core function to generate an article
export const generateArticleCore = async () => {
  const useMockData = process.env.USE_MOCK_DATA === 'true';

  let content;

  if (useMockData) {
    content = testData;
  } else {
    const response = await axios.post(
      process.env.OPEN_AI_ENGINE_URL,
      {
        model: process.env.OPEN_AI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are an expert writer on programming topics.',
          },
          {
            role: 'user',
            content: `Generate a unique and detailed programming article on JavaScript.
              The article should include an introduction, main content with explanations and examples, a conclusion, and some tags.`,
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

    content = response.data.choices[0].message.content.split('\n');
  }

  const title = content[0];
  const body = content.slice(1, -1).join('\n');
  const description = content[3];
  const tags = content
    .slice(-1)
    .join('')
    .replace('Tags: ', '')
    .split(',')
    .map(text => text.trim());

  const article = new Article({ title, body, tags, description });
  await article.save();

  return article;
};
