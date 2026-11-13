const db = require('./_db');

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const key = req.query.key || 'site_info';

  try {
    if (req.method === 'GET') {
      const result = await db.query('SELECT data, updated_at FROM site_settings WHERE key = $1', [key]);
      if (result.rows.length > 0) {
        return res.status(200).json({ success: true, data: result.rows[0].data, updatedAt: result.rows[0].updated_at });
      }
      return res.status(200).json({ success: true, data: null });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const data = body.data || body;
      await db.query(
        `INSERT INTO site_settings (key, data, updated_at) 
         VALUES ($1, $2, CURRENT_TIMESTAMP)
         ON CONFLICT (key) DO UPDATE 
         SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP`,
        [key, JSON.stringify(data)]
      );
      return res.status(200).json({ success: true, message: 'Settings saved successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Settings Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
