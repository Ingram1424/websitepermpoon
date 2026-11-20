const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsing with generous limit for project uploads & settings
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// API Endpoints (reusing existing PostgreSQL handlers)
const settingsHandler = require('./api/settings');
const inquiriesHandler = require('./api/inquiries');
const reviewsHandler = require('./api/reviews');
const portfolioHandler = require('./api/portfolio');

app.all('/api/settings', (req, res) => settingsHandler(req, res));
app.all('/api/inquiries', (req, res) => inquiriesHandler(req, res));
app.all('/api/reviews', (req, res) => reviewsHandler(req, res));
app.all('/api/portfolio', (req, res) => portfolioHandler(req, res));

// Health check endpoint for Railway monitoring
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'permpoon-construction-website' });
});

// Serve static assets
app.use(express.static(__dirname));

// HTML Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Permpoon Construction web server listening on port ${PORT}`);
});
