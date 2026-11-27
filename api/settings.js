const db = require('./_db');
const { setCorsHeaders, requireAdmin } = require('./_auth');

module.exports = async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const key = req.query.key || 'site_info';

  try {
    if (req.method === 'GET') {
      const result = await db.query('SELECT data, updated_at FROM site_settings WHERE key = $1', [key]);
      if (result.rows && result.rows.length > 0 && result.rows[0].data) {
        return res.status(200).json({ success: true, data: result.rows[0].data, updatedAt: result.rows[0].updated_at });
      }
      const defaultData = {
        companyName: "บริษัท เพิ่มพูน คอนทรัคชั่น จำกัด",
        tagline: "รับเหมาก่อสร้าง ปรับปรุงรีโนเวท ซ่อมแซมอาคาร รวมทั้งระบบประปาและระบบสุขาภิบาล",
        phone: "089-123-4567",
        phone2: "02-987-6543",
        email: "contact@phoemphoon.com",
        lineId: "@permpoon",
        address: "เลขที่ 19/57 ซอยเลียบคลองสอง 27 แขวงสามวาตะวันตก เขตคลองสามวา กรุงเทพมหานคร 10510",
        workDays: "จันทร์ - เสาร์: 08:30 - 17:30 น.",
        rateBuild: 14500,
        rateRenovate: 6500,
        rateInterior: 9000,
        rateExtension: 8500
      };
      return res.status(200).json({ success: true, data: defaultData, updatedAt: new Date().toISOString() });
    }

    if (req.method === 'POST') {
      if (!requireAdmin(req, res)) return;

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

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('API Settings Error');
    return res.status(503).json({ success: false, error: 'ระบบไม่สามารถประมวลผลคำขอได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง' });
  }
};
