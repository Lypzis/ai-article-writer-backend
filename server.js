const express = require('express');
const helmet = require('helmet');
const cron = require('node-cron');
require('dotenv').config();

require('./config/db');
const { generateArticleCore } = require('./controllers/articleController');

const articleRoutes = require('./routes/articleRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Middleware for parsing JSON bodies
app.use(express.json());

// Define routes
app.use('/api/articles', articleRoutes);

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).send('The requested resource was not found.');
});

// Schedule the task to run every 5 minutes
cron.schedule('0 0 */2 * *', async () => {
  console.log('Running scheduled task: generateArticle');

  try {
    await generateArticleCore(); // Assuming generateArticle doesn't need req, res in cron context
    console.log('Article generated successfully');
  } catch (error) {
    console.error('Error in scheduled task:', error);
  }
});

console.log('Cron job scheduled: Generate article every 2 days');

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
