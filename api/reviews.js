const db = require('./_db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const result = await db.query(
        'SELECT id, name, role, rating, comment, data, created_at FROM reviews ORDER BY created_at DESC'
      );
      const items = result.rows.map(row => ({
        id: row.id,
        name: row.name,
        role: row.role,
        rating: row.rating,
        comment: row.comment,
        createdAt: row.created_at,
        timestamp: new Date(row.created_at).getTime(),
        ...(row.data || {})
      }));
      return res.status(200).json({ success: true, items });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const id = body.id || 'rev_' + Date.now();
      const { name, role, rating = 5, comment } = body;

      await db.query(
        `INSERT INTO reviews (id, name, role, rating, comment, data, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
         ON CONFLICT (id) DO UPDATE
         SET name = EXCLUDED.name, role = EXCLUDED.role, rating = EXCLUDED.rating,
             comment = EXCLUDED.comment, data = EXCLUDED.data`,
        [id, name, role, rating, comment, JSON.stringify(body)]
      );
      return res.status(200).json({ success: true, id, message: 'Review saved' });
    }

    if (req.method === 'DELETE') {
      const id = req.query.id;
      if (!id) return res.status(400).json({ error: 'Missing id' });
      await db.query('DELETE FROM reviews WHERE id = $1', [id]);
      return res.status(200).json({ success: true, message: 'Review deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Reviews Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
