const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'local_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) {}
}

// Initial mock data if DB empty
const INITIAL_DATA = {
  site_settings: {
    site_info: {
      companyName: "บริษัท เพิ่มพูน คอนทรัคชั่น จำกัด",
      tagline: "รับเหมาก่อสร้าง ปรับปรุงรีโนเวท ซ่อมแซมอาคาร รวมทั้งระบบประปาและระบบสุขาภิบาล",
      phone: "089-123-4567",
      phone2: "02-987-6543",
      email: "contact@phoemphoon.com",
      lineId: "@permpoon",
      address: "เลขที่ 19/57 ซอยเลียบคลองสอง 27 แขวงสามวาตะวันตก เขตคลองสามวา กรุงเทพมหานคร 10510",
      workDays: "จันทร์ - เสาร์: 08:30 - 17:30 น."
    }
  },
  inquiries: [],
  reviews: [
    {
      id: "rev_1",
      name: "คุณสมชาย วรเศรษฐ์",
      role: "เจ้าของบ้านเดี่ยว 2 ชั้น (บางนา)",
      rating: 5,
      comment: "ประทับใจทีมงานเพิ่มพูนมากครับ รีโนเวทบ้านเดี่ยว 2 ชั้น ช่างทำงานเรียบร้อย ตรงเวลา ส่งอัปเดตงานในไลน์กลุ่มทุกวันศุกร์ ไม่ต้องคอยตามจี้ คุมงบได้ตาม BOQ เป๊ะ",
      created_at: new Date().toISOString()
    },
    {
      id: "rev_2",
      name: "คุณพิมพา สุวรรณมาศ",
      role: "เจ้าของทาวน์โฮม (รามอินทรา)",
      rating: 5,
      comment: "ต่อเติมครัวหลังบ้านและโรงจอดรถกับเพิ่มพูน วิศวกรให้คำแนะนำเรื่องโครงสร้างดีมาก ลงเสาเข็มไมโครไพล์ถูกต้อง ไม่มีทรุดร้าว งานเสร็จก่อนกำหนด 1 สัปดาห์ แนะนำเลยค่ะ",
      created_at: new Date().toISOString()
    },
    {
      id: "rev_3",
      name: "คุณธีรเดช กิตติคุณานนต์",
      role: "เจ้าของอาคารพาณิชย์ 3 คูหา",
      rating: 5,
      comment: "รีโนเวทตึกแถวเป็นโฮมออฟฟิศ งานระบบไฟฟ้าและประปาทำได้มาตรฐานสูงมาก ตรวจงานร่วมกับโฟร์แมนทุกขั้นตอน แก้ไขงานตามแบบรวดเร็ว ราคาโปร่งใสคุ้มค่าครับ",
      created_at: new Date().toISOString()
    }
  ],
  portfolio: [
    {
      id: "proj_1",
      title: "บ้านพักอาศัยโมเดิร์นทรอปิคอล 2 ชั้น",
      category: "house",
      badge: "สร้างใหม่",
      location: "นนทบุรี",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      description: "งานก่อสร้างบ้านเดี่ยวสไตล์ Modern Tropical เน้นความโปร่งโล่ง รับแสงธรรมชาติ",
      area: "350 ตร.ม.",
      duration: "10 เดือน",
      status: "completed",
      created_at: new Date().toISOString()
    },
    {
      id: "proj_2",
      title: "รีโนเวททาวน์โฮม 3 ชั้น",
      category: "renovate",
      badge: "รีโนเวท",
      location: "ลาดพร้าว กรุงเทพฯ",
      img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      description: "ปรับปรุงโครงสร้างและตกแต่งใหม่ทั้งหลัง สไตล์ Japandi เรียบหรู",
      area: "220 ตร.ม.",
      duration: "4 เดือน",
      status: "completed",
      created_at: new Date().toISOString()
    },
    {
      id: "proj_3",
      title: "ตกแต่งภายในคอนโด Luxury Duplex",
      category: "interior",
      badge: "ตกแต่งภายใน",
      location: "สุขุมวิท กรุงเทพฯ",
      img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
      description: "งานบิลท์อินไม้แท้ ดีไซน์โมเดิร์นคลาสสิก พร้อมระบบไฟอัจฉริยะ",
      area: "140 ตร.ม.",
      duration: "3 เดือน",
      status: "completed",
      created_at: new Date().toISOString()
    },
    {
      id: "proj_4",
      title: "ต่อเติมครัวไทยและ Glasshouse โรงจอดรถ",
      category: "extension",
      badge: "ต่อเติม",
      location: "ราชพฤกษ์",
      img: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80",
      description: "งานโครงสร้างเสาเข็มไมโครไพล์แยกส่วน หลังคาไวนิลกันความร้อน",
      area: "65 ตร.ม.",
      duration: "45 วัน",
      status: "completed",
      created_at: new Date().toISOString()
    },
    {
      id: "proj_5",
      title: "สร้างคฤหาสน์หรู Contemporary Luxury",
      category: "house",
      badge: "สร้างใหม่",
      location: "บางนา-ตราด",
      img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
      description: "ก่อสร้างพร้อมตกแต่งครบวงจร พร้อมสระว่ายน้ำระบบเกลือ",
      area: "650 ตร.ม.",
      duration: "14 เดือน",
      status: "completed",
      created_at: new Date().toISOString()
    },
    {
      id: "proj_6",
      title: "รีโนเวทและตกแต่งสำนักงาน Modern Industrial",
      category: "interior",
      badge: "ตกแต่งภายใน",
      location: "สาทร กรุงเทพฯ",
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      description: "ปรับโฉมออฟฟิศ 2 ชั้น เน้นพื้นที่ Co-working space โปร่งทันสมัย",
      area: "280 ตร.ม.",
      duration: "3.5 เดือน",
      status: "completed",
      created_at: new Date().toISOString()
    }
  ]
};

function readLocalDb() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
      return INITIAL_DATA;
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    return INITIAL_DATA;
  }
}

function writeLocalDb(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {}
}

let pool = null;
let pgAvailable = false;
let hasAttemptedInit = false;

function getConnectionString() {
  return process.env.DATABASE_URL || 
         process.env.COOLIFY_DATABASE_URL || 
         "postgres://postgres:7FhVs8XYm426Pc3UIdvTTo8uFPaAGcC8ShKwRBqG7OXsmMPAHd8tg5FU23GHBvoj@iyncmxsrumdcojtlgnl6seeq:5432/permpoon";
}

function getPool() {
  if (!pool) {
    const connectionString = getConnectionString();
    pool = new Pool({
      connectionString,
      ssl: false,
      max: 5,
      connectionTimeoutMillis: 2000,
      idleTimeoutMillis: 10000
    });

    pool.on('error', (err) => {
      pgAvailable = false;
    });
  }
  return pool;
}

async function initPgTables(client) {
  if (hasAttemptedInit) return;
  hasAttemptedInit = true;
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key VARCHAR(100) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS inquiries (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255),
        phone VARCHAR(50),
        line VARCHAR(100),
        service VARCHAR(100),
        location TEXT,
        budget VARCHAR(100),
        message TEXT,
        status VARCHAR(50) DEFAULT 'new',
        data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS reviews (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255),
        role VARCHAR(100),
        rating INT DEFAULT 5,
        comment TEXT,
        data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS portfolio (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255),
        category VARCHAR(100),
        badge VARCHAR(100),
        location VARCHAR(255),
        img TEXT,
        description TEXT,
        area VARCHAR(100),
        duration VARCHAR(100),
        status VARCHAR(100),
        data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed site_settings if empty
    const setCheck = await client.query("SELECT 1 FROM site_settings WHERE key = 'site_info'");
    if (setCheck.rows.length === 0) {
      await client.query(
        "INSERT INTO site_settings (key, data, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP)",
        ['site_info', JSON.stringify(INITIAL_DATA.site_settings.site_info)]
      );
    }

    // Seed reviews if empty
    const revCheck = await client.query("SELECT COUNT(*) as cnt FROM reviews");
    if (parseInt(revCheck.rows[0].cnt, 10) === 0) {
      for (const r of INITIAL_DATA.reviews) {
        await client.query(
          "INSERT INTO reviews (id, name, role, rating, comment, data, created_at) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)",
          [r.id, r.name, r.role, r.rating, r.comment, JSON.stringify(r)]
        );
      }
    }

    // Seed portfolio if empty
    const portCheck = await client.query("SELECT COUNT(*) as cnt FROM portfolio");
    if (parseInt(portCheck.rows[0].cnt, 10) === 0) {
      for (const p of INITIAL_DATA.portfolio) {
        await client.query(
          "INSERT INTO portfolio (id, title, category, badge, location, img, description, area, duration, status, data, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP)",
          [p.id, p.title, p.category, p.badge, p.location, p.img, p.description, p.area, p.duration, p.status, JSON.stringify(p)]
        );
      }
    }

    pgAvailable = true;
  } catch (err) {
    pgAvailable = false;
  }
}

// Fallback execution on local JSON DB
function executeLocalQuery(text, params = []) {
  const db = readLocalDb();
  const lower = text.trim().toLowerCase();

  // 1. site_settings
  if (lower.includes('from site_settings')) {
    const key = params[0] || 'site_info';
    const data = db.site_settings[key] || db.site_settings['site_info'] || INITIAL_DATA.site_settings.site_info;
    return { rows: [{ data, updated_at: new Date().toISOString() }] };
  }
  if (lower.includes('into site_settings')) {
    const key = params[0] || 'site_info';
    const data = typeof params[1] === 'string' ? JSON.parse(params[1]) : params[1];
    db.site_settings[key] = data;
    writeLocalDb(db);
    return { rows: [{ key, data }] };
  }

  // 2. inquiries
  if (lower.includes('from inquiries')) {
    if (lower.includes('delete')) {
      const id = params[0];
      db.inquiries = db.inquiries.filter(i => i.id !== id);
      writeLocalDb(db);
      return { rows: [] };
    }
    return { rows: db.inquiries || [] };
  }
  if (lower.includes('into inquiries')) {
    const [id, name, phone, line, service, location, budget, message, status, dataStr] = params;
    const existingIdx = db.inquiries.findIndex(i => i.id === id);
    const item = {
      id, name, phone, line, service, location, budget, message, status: status || 'new',
      data: typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr,
      created_at: new Date().toISOString()
    };
    if (existingIdx !== -1) {
      db.inquiries[existingIdx] = { ...db.inquiries[existingIdx], ...item };
    } else {
      db.inquiries.unshift(item);
    }
    writeLocalDb(db);
    return { rows: [item] };
  }
  if (lower.includes('update inquiries')) {
    const [status, id] = params;
    const item = db.inquiries.find(i => i.id === id);
    if (item) {
      item.status = status;
      writeLocalDb(db);
    }
    return { rows: item ? [item] : [] };
  }

  // 3. reviews
  if (lower.includes('from reviews')) {
    if (lower.includes('delete')) {
      const id = params[0];
      db.reviews = db.reviews.filter(r => r.id !== id);
      writeLocalDb(db);
      return { rows: [] };
    }
    return { rows: db.reviews || INITIAL_DATA.reviews };
  }
  if (lower.includes('into reviews')) {
    const [id, name, role, rating, comment, dataStr] = params;
    const item = {
      id, name, role, rating: Number(rating) || 5, comment,
      data: typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr,
      created_at: new Date().toISOString()
    };
    const existingIdx = db.reviews.findIndex(r => r.id === id);
    if (existingIdx !== -1) db.reviews[existingIdx] = item;
    else db.reviews.unshift(item);
    writeLocalDb(db);
    return { rows: [item] };
  }

  // 4. portfolio
  if (lower.includes('from portfolio')) {
    if (lower.includes('delete')) {
      const id = params[0];
      db.portfolio = db.portfolio.filter(p => p.id !== id);
      writeLocalDb(db);
      return { rows: [] };
    }
    return { rows: db.portfolio || INITIAL_DATA.portfolio };
  }
  if (lower.includes('into portfolio')) {
    const [id, title, category, badge, location, img, desc, area, duration, status, dataStr] = params;
    const item = {
      id, title, category, badge, location, img, description: desc, area, duration, status,
      data: typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr,
      created_at: new Date().toISOString()
    };
    const existingIdx = db.portfolio.findIndex(p => p.id === id);
    if (existingIdx !== -1) db.portfolio[existingIdx] = item;
    else db.portfolio.unshift(item);
    writeLocalDb(db);
    return { rows: [item] };
  }

  return { rows: [] };
}

module.exports = {
  INITIAL_DATA,
  getPool,
  isPgConnected() {
    return pgAvailable;
  },
  async query(text, params = []) {
    try {
      const p = getPool();
      const client = await Promise.race([
        p.connect(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500))
      ]);
      try {
        if (!hasAttemptedInit) {
          await initPgTables(client);
        }
        const res = await client.query(text, params);
        pgAvailable = true;
        // Mirror mutation into local DB
        try { executeLocalQuery(text, params); } catch (e) {}
        return res;
      } finally {
        client.release();
      }
    } catch (err) {
      pgAvailable = false;
      // Resilient fallback to local JSON database: never fail with 500!
      return executeLocalQuery(text, params);
    }
  }
};
