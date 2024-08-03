import express, { json } from 'express';
import helmet from 'helmet';
import { schedule } from 'node-cron';
require('dotenv').config();

import './config/db';
import { generateArticleCore } from './controllers/articleController';

import articleRoutes from './routes/articleRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

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

// Schedule the task to run every 4 hours
schedule(
  '0 */4 * * *',
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

console.log(
  'Cron job scheduled: Generate article every 4 hours in America/New_York timezone'
);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
