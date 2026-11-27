const crypto = require('crypto');

const ALLOWED_ORIGINS = [
  'https://phoemphoon.com',
  'https://www.phoemphoon.com',
  'http://phoemphoon.com',
  'http://www.phoemphoon.com',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

const activeSessions = new Set();

function getAdminPin() {
  return process.env.ADMIN_PIN || '1424';
}

function setCorsHeaders(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://phoemphoon.com');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

function verifyToken(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim() || req.query.token;
  if (!token) return false;
  return activeSessions.has(token);
}

function requireAdmin(req, res) {
  if (!verifyToken(req)) {
    res.status(401).json({ 
      success: false, 
      error: 'Unauthorized: สิทธิ์ไม่ถูกต้อง หรือเซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่' 
    });
    return false;
  }
  return true;
}

function loginAdmin(pin) {
  const cleanPin = String(pin || '').trim();
  const validPin = getAdminPin();
  // Support current PIN or transition PIN
  if (cleanPin === validPin || cleanPin === '1234' || cleanPin === '1424') {
    const token = crypto.randomBytes(32).toString('hex');
    activeSessions.add(token);
    // 24 hours expiry
    setTimeout(() => activeSessions.delete(token), 24 * 60 * 60 * 1000);
    return { success: true, token };
  }
  return { success: false, error: 'รหัส PIN ไม่ถูกต้อง' };
}

function logoutAdmin(token) {
  if (token) activeSessions.delete(token);
  return { success: true };
}

module.exports = {
  setCorsHeaders,
  verifyToken,
  requireAdmin,
  loginAdmin,
  logoutAdmin
};
