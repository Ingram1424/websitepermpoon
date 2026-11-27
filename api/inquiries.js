const db = require('./_db');
const { setCorsHeaders, requireAdmin } = require('./_auth');

module.exports = async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    if (req.method === 'GET') {
      // Sensitive Customer Data: Only admin allowed!
      if (!requireAdmin(req, res)) return;

      const result = await db.query(
        'SELECT id, name, phone, line, service, location, budget, message, status, data, created_at FROM inquiries ORDER BY created_at DESC'
      );
      const items = (result.rows || []).map(row => ({
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

      // Validate Phone Format (BUG-07 Server-side validation)
      const cleanPhone = String(phone || '').replace(/[-\s]/g, '').trim();
      if (!cleanPhone || !/^0[0-9]{8,9}$/.test(cleanPhone)) {
        return res.status(400).json({ 
          success: false, 
          error: 'กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง (ตัวเลข 9-10 หลักขึ้นต้นด้วย 0)' 
        });
      }

      await db.query(
        `INSERT INTO inquiries (id, name, phone, line, service, location, budget, message, status, data, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
         ON CONFLICT (id) DO UPDATE
         SET name = EXCLUDED.name, phone = EXCLUDED.phone, line = EXCLUDED.line,
             service = EXCLUDED.service, location = EXCLUDED.location, budget = EXCLUDED.budget,
             message = EXCLUDED.message, status = EXCLUDED.status, data = EXCLUDED.data`,
        [id, name, cleanPhone, line, service, location, budget, message, status, JSON.stringify(body)]
      );
      return res.status(200).json({ success: true, id, message: 'Inquiry saved successfully' });
    }

    if (req.method === 'PATCH') {
      if (!requireAdmin(req, res)) return;

      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { id, status } = body;
      if (!id || !status) {
        return res.status(400).json({ success: false, error: 'Missing id or status' });
      }
      await db.query('UPDATE inquiries SET status = $1 WHERE id = $2', [status, id]);
      return res.status(200).json({ success: true, message: 'Status updated' });
    }

    if (req.method === 'DELETE') {
      if (!requireAdmin(req, res)) return;

      const id = req.query.id;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Missing id query param' });
      }
      await db.query('DELETE FROM inquiries WHERE id = $1', [id]);
      return res.status(200).json({ success: true, message: 'Inquiry deleted' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('API Inquiries Error');
    return res.status(503).json({ success: false, error: 'ระบบไม่สามารถประมวลผลคำขอได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง' });
  }
};
