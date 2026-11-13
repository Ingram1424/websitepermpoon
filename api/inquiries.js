const db = require('./_db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const result = await db.query(
        'SELECT id, name, phone, line, service, location, budget, message, status, data, created_at FROM inquiries ORDER BY created_at DESC'
      );
      const items = result.rows.map(row => ({
        id: row.id,
        name: row.name,
        phone: row.phone,
        line: row.line,
        service: row.service,
        location: row.location,
        budget: row.budget,
        message: row.message,
        status: row.status,
        createdAt: row.created_at,
        timestamp: new Date(row.created_at).getTime(),
        ...(row.data || {})
      }));
      return res.status(200).json({ success: true, items });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const id = body.id || 'lead_' + Date.now();
      const { name, phone, line, service, location, budget, message, status = 'new' } = body;

      await db.query(
        `INSERT INTO inquiries (id, name, phone, line, service, location, budget, message, status, data, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
         ON CONFLICT (id) DO UPDATE
         SET name = EXCLUDED.name, phone = EXCLUDED.phone, line = EXCLUDED.line,
             service = EXCLUDED.service, location = EXCLUDED.location, budget = EXCLUDED.budget,
             message = EXCLUDED.message, status = EXCLUDED.status, data = EXCLUDED.data`,
        [id, name, phone, line, service, location, budget, message, status, JSON.stringify(body)]
      );
      return res.status(200).json({ success: true, id, message: 'Inquiry saved successfully' });
    }

    if (req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { id, status } = body;
      if (!id || !status) {
        return res.status(400).json({ error: 'Missing id or status' });
      }
      await db.query('UPDATE inquiries SET status = $1 WHERE id = $2', [status, id]);
      return res.status(200).json({ success: true, message: 'Status updated' });
    }

    if (req.method === 'DELETE') {
      const id = req.query.id;
      if (!id) {
        return res.status(400).json({ error: 'Missing id query param' });
      }
      await db.query('DELETE FROM inquiries WHERE id = $1', [id]);
      return res.status(200).json({ success: true, message: 'Inquiry deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Inquiries Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
