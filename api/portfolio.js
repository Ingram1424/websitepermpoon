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
        'SELECT id, title, category, badge, location, img, description, area, duration, status, data, created_at FROM portfolio ORDER BY created_at DESC'
      );
      const items = result.rows.map(row => ({
        id: row.id,
        title: row.title,
        category: row.category,
        badge: row.badge,
        location: row.location,
        img: row.img,
        desc: row.description,
        area: row.area,
        duration: row.duration,
        status: row.status,
        createdAt: row.created_at,
        timestamp: new Date(row.created_at).getTime(),
        ...(row.data || {})
      }));
      return res.status(200).json({ success: true, items });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const id = body.id || 'proj_' + Date.now();
      const { title, category, badge, location, img, desc, area, duration, status } = body;

      await db.query(
        `INSERT INTO portfolio (id, title, category, badge, location, img, description, area, duration, status, data, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP)
         ON CONFLICT (id) DO UPDATE
         SET title = EXCLUDED.title, category = EXCLUDED.category, badge = EXCLUDED.badge,
             location = EXCLUDED.location, img = EXCLUDED.img, description = EXCLUDED.description,
             area = EXCLUDED.area, duration = EXCLUDED.duration, status = EXCLUDED.status,
             data = EXCLUDED.data`,
        [id, title, category, badge, location, img, desc || body.description, area, duration, status, JSON.stringify(body)]
      );
      return res.status(200).json({ success: true, id, message: 'Portfolio item saved' });
    }

    if (req.method === 'DELETE') {
      const id = req.query.id;
      if (!id) return res.status(400).json({ error: 'Missing id' });
      await db.query('DELETE FROM portfolio WHERE id = $1', [id]);
      return res.status(200).json({ success: true, message: 'Portfolio item deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Portfolio Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
