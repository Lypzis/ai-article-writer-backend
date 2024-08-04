import dotenv from 'dotenv';
dotenv.config();
import express, { json } from 'express';
import helmet from 'helmet';
import { schedule } from 'node-cron';

import './config/db.js';
import { generateArticleCore } from './controllers/articleController.js';
import articleRoutes from './routes/articleRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// Middleware for parsing JSON bodies
app.use(json());

// Define routes
app.use('/api/articles', articleRoutes);

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).send('The requested resource was not found.');
});

/// Schedule the task to run every 2 days at midnight
const cron = schedule(
  '0 0 */2 * *',
  async () => {
    console.log('Running scheduled task: generateArticle');

    try {
      const article = await generateArticleCore();
      console.log('Article generated successfully:', article.title);
    } catch (error) {
      console.error('Error in scheduled task:', error.message);
    }
  },
  {
    timezone: 'America/New_York', // Eastern Time Zone (ET)
  }
);

cron.start();

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
