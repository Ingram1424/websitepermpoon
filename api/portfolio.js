const db = require('./_db');
const { setCorsHeaders, requireAdmin } = require('./_auth');

module.exports = async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    if (req.method === 'GET') {
      const result = await db.query(
        'SELECT id, title, category, badge, location, img, description, area, duration, status, data, created_at FROM portfolio ORDER BY created_at DESC'
      );
      if (!result.rows || result.rows.length === 0) {
        return res.status(200).json({ success: true, items: db.INITIAL_DATA.portfolio });
      }
      const items = (result.rows || []).map(row => ({
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
      if (!requireAdmin(req, res)) return;

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
      if (!requireAdmin(req, res)) return;

      const id = req.query.id;
      if (!id) return res.status(400).json({ success: false, error: 'Missing id' });
      await db.query('DELETE FROM portfolio WHERE id = $1', [id]);
      return res.status(200).json({ success: true, message: 'Portfolio item deleted' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('API Portfolio Error');
    return res.status(503).json({ success: false, error: 'ระบบไม่สามารถประมวลผลคำขอได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง' });
  }
};
