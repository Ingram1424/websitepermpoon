const express = require('express');
const path = require('path');
const { setCorsHeaders, loginAdmin, verifyToken, logoutAdmin } = require('./api/_auth');
const { isPgConnected } = require('./api/_db');

const app = express();
const PORT = process.env.PORT || 3000;

// Security: Disable X-Powered-By
app.disable('x-powered-by');

// Security Headers Middleware (BUG-06)
app.use((req, res, next) => {
  setCorsHeaders(req, res);
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' https: data: blob: 'unsafe-inline' 'unsafe-eval'; " +
    "img-src 'self' https: data: blob:; " +
    "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.tailwindcss.com https://cdnjs.cloudflare.com; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com;"
  );
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

// Body parsing with generous limit for project uploads & settings
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Auth Endpoints (BUG-04 Server-side Auth)
app.post('/api/auth/login', (req, res) => {
  const { pin } = req.body || {};
  const result = loginAdmin(pin);
  if (result.success) {
    return res.status(200).json(result);
  }
  return res.status(401).json(result);
});

app.get('/api/auth/verify', (req, res) => {
  if (verifyToken(req)) {
    return res.status(200).json({ success: true, authenticated: true });
  }
  return res.status(401).json({ success: false, authenticated: false, error: 'Unauthorized' });
});

app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  logoutAdmin(token);
  return res.status(200).json({ success: true });
});

// Business API Endpoints
const settingsHandler = require('./api/settings');
const inquiriesHandler = require('./api/inquiries');
const reviewsHandler = require('./api/reviews');
const portfolioHandler = require('./api/portfolio');

app.all('/api/settings', (req, res) => settingsHandler(req, res));
app.all('/api/inquiries', (req, res) => inquiriesHandler(req, res));
app.all('/api/reviews', (req, res) => reviewsHandler(req, res));
app.all('/api/portfolio', (req, res) => portfolioHandler(req, res));

// Health check endpoint for system monitoring
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'permpoon-construction-website',
    db_connected: isPgConnected(),
    timestamp: new Date().toISOString()
  });
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

app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Custom 404 handler for unknown API routes (clean, without leaking server details)
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: 'API endpoint not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Permpoon Construction web server listening on port ${PORT}`);
});
