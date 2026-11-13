/**
 * Permpoon Construction & Design Co., Ltd.
 * Railway Cloud Database Integration & Services
 * Connected to Railway Postgres via serverless proxy /api/*
 */

const RAILWAY_API_BASE = '/api';
let isRailwayActive = true;

// Helper with timeout to prevent blocking UI
async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 3000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// 1. Initial / Default Site Settings
const DEFAULT_SITE_SETTINGS = {
  companyName: "บริษัท เพิ่มพูน คอนสตรัคชั่น จำกัด",
  tagline: "รับเหมาก่อสร้าง ปรับปรุงรีโนเวท ซ่อมแซมอาคาร รวมทั้งระบบประปาและระบบสุขาภิบาล",
  phone: "089-123-4567",
  phone2: "02-987-6543",
  line: "@permpoon",
  email: "phoemphoon.pp@gmail.com",
  address: "เลขที่ 19/57 ซอยเลียบคลองสอง 27 แขวงสามวาตะวันตก เขตคลองสามวา กรุงเทพมหานคร 10510",
  businessHours: "จันทร์ - เสาร์ (08:30 - 18:00 น.)",
  rateBuild: 14500,
  rateRenovate: 6500,
  rateInterior: 9000,
  rateExtension: 8500,

  heroBadge: "รับเหมาก่อสร้าง • ปรับปรุงรีโนเวท • ซ่อมแซมอาคาร • ระบบประปาและสุขาภิบาล",
  heroTitle1: "สร้างและรีโนเวททุกพื้นที่",
  heroTitle2: "ด้วยมาตรฐานช่างมืออาชีพ",
  heroTitle3: "งบไม่บานปลาย ไม่ทิ้งงาน",
  heroDesc: "เราคือบริษัทรับเหมาก่อสร้างและรีโนเวทครบวงจร ประสบการณ์กว่า 15 ปี เน้นคุณภาพวัสดุตามมาตรฐาน มอก. โปร่งใสด้วย BOQ ละเอียดไม่มีหมกเม็ด พร้อมทีมช่างมืออาชีพส่งมอบงานตรงเวลา 100%",
  heroImg: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
  heroImgTitle: "บ้านเดี่ยว Modern Tropical",
  heroImgSub: "โครงการส่งมอบสำเร็จ • จ.นนทบุรี",
  heroImgBadge: "100% เสร็จสมบูรณ์",

  stat1Num: "15+ ปี",
  stat1Text: "ประสบการณ์งานวิศวกรรมช่าง",
  stat2Num: "1,200+",
  stat2Text: "โครงการที่ส่งมอบสำเร็จ",
  stat3Num: "100%",
  stat3Text: "การันตีตามสัญญา ไม่ทิ้งงาน",
  stat4Num: "4.9 / 5",
  stat4Text: "ความพึงพอใจจากเจ้าของบ้าน",

  servicesTitle: "บริการครบวงจร เรื่องบ้านและอาคาร",
  servicesSubtitle: "ดูแลตั้งแต่การออกแบบ สถาปัตย์ วิศวกรรม ก่อสร้าง จนถึงส่งมอบงานเสร็จสมบูรณ์",
  svc1Title: "รับเหมาก่อสร้างบ้านและอาคาร",
  svc1Desc: "สร้างบ้านเดี่ยว ทาวน์โฮม อาคารพาณิชย์ และโกดังเก็บสินค้า ออกแบบตามหลักวิศวกรรมพร้อมยื่นขออนุญาตก่อสร้างครบวงจร",
  svc2Title: "รีโนเวทบ้าน คอนโด ทาวน์โฮม",
  svc2Desc: "ปรับปรุงบ้านเก่าให้สวยทันสมัย ปรับแปลน รื้อถอน เสริมโครงสร้าง และแก้ปัญหาน้ำรั่วซึมทรุดร้าวอย่างถาวร",
  svc3Title: "ตกแต่งภายใน & บิวท์อิน (Built-in)",
  svc3Desc: "ออกแบบตกแต่งสไตล์ Minimal, Modern, Nordic บิวท์อินตู้เสื้อผ้า ครัว ห้องนั่งเล่น วัสดุ HMR กันชื้น Soft-close",
  svc4Title: "งานต่อเติมครัว หลังคา และโรงรถ",
  svc4Desc: "ต่อเติมครัวหลังบ้าน โรงรถหน้าบ้าน ลงเสาเข็มไมโครไพล์แยกโครงสร้าง ป้องกันปัญหาการทรุดตัวและดึงรั้ง 100%",
  svc5Title: "งานระบบ ไฟฟ้า ประปา สุขาภิบาล",
  svc5Desc: "ติดตั้งตู้เมนไฟ เดินสายไฟร้อยท่อ เดินท่อน้ำดี PPR ท่อน้ำเสีย ได้มาตรฐานการไฟฟ้านครหลวงและการประปา",
  svc6Title: "สำรวจหน้างาน ออกแบบ & ทำ BOQ",
  svc6Desc: "บริการส่งวิศวกรเข้าวัดพื้นที่จริง ให้คำแนะนำแนวทางก่อสร้าง พร้อมจัดทำใบเสนอราคา BOQ ละเอียดไม่มีหมกเม็ด"
};

const DEFAULT_SERVICES_LIST = [
  {
    id: 'svc_1',
    title: 'รับเหมาก่อสร้างบ้านและอาคาร',
    desc: 'สร้างบ้านเดี่ยว ทาวน์โฮม อาคารพาณิชย์ และโกดังเก็บสินค้า ออกแบบตามหลักวิศวกรรมพร้อมยื่นขออนุญาตก่อสร้างครบวงจร',
    icon: 'fa-solid fa-house',
    point1: 'งานโครงสร้าง คสล. / โครงสร้างเหล็ก',
    point2: 'สถาปัตย์ 2D / 3D Perspective',
    modalKey: 'construction',
    actionText: 'ดูขอบเขตงานและมาตรฐาน',
    actionLink: ''
  },
  {
    id: 'svc_2',
    title: 'รีโนเวทบ้าน คอนโด ทาวน์โฮม',
    desc: 'ปรับปรุงบ้านเก่าให้สวยทันสมัย ปรับแปลน รื้อถอน เสริมโครงสร้าง และแก้ปัญหาน้ำรั่วซึมทรุดร้าวอย่างถาวร',
    icon: 'fa-solid fa-hammer',
    point1: 'รื้อถอนและเสริมกำลังโครงสร้าง',
    point2: 'ปูกระเบื้อง ทาสี เปลี่ยนระบบไฟประปา',
    modalKey: 'renovation',
    actionText: 'ดูขอบเขตงานและมาตรฐาน',
    actionLink: ''
  },
  {
    id: 'svc_3',
    title: 'ตกแต่งภายใน & บิวท์อิน (Built-in)',
    desc: 'ออกแบบตกแต่งสไตล์ Minimal, Modern, Nordic บิวท์อินตู้เสื้อผ้า ครัว ห้องนั่งเล่น วัสดุ HMR กันชื้น Soft-close',
    icon: 'fa-solid fa-couch',
    point1: 'ไม้ HMR เกรดกันชื้น ไม่บวมน้ำ',
    point2: 'ออกแบบภาพ 3D เสมือนจริงก่อนผลิต',
    modalKey: 'interior',
    actionText: 'ดูขอบเขตงานและมาตรฐาน',
    actionLink: ''
  },
  {
    id: 'svc_4',
    title: 'งานต่อเติมครัว หลังคา และโรงรถ',
    desc: 'ต่อเติมครัวหลังบ้าน โรงรถหน้าบ้าน ลงเสาเข็มไมโครไพล์แยกโครงสร้าง ป้องกันปัญหาการทรุดตัวและดึงรั้ง 100%',
    icon: 'fa-solid fa-kitchen-set',
    point1: 'เสาเข็มไมโครไพล์ Spun Micropile',
    point2: 'โครงสร้างแยกอิสระจากตัวบ้านเดิม',
    modalKey: 'extension',
    actionText: 'ดูขอบเขตงานและมาตรฐาน',
    actionLink: ''
  },
  {
    id: 'svc_5',
    title: 'งานระบบ ไฟฟ้า ประปา สุขาภิบาล',
    desc: 'ติดตั้งตู้เมนไฟ เดินสายไฟร้อยท่อ เดินท่อน้ำดี PPR ท่อน้ำเสีย ได้มาตรฐานการไฟฟ้านครหลวงและการประปา',
    icon: 'fa-solid fa-bolt',
    point1: 'เบรกเกอร์กันดูด RCBO สายดิน',
    point2: 'ท่อน้ำดีเชื่อมความร้อน ไร้รั่วซึม',
    modalKey: 'mep',
    actionText: 'ดูขอบเขตงานและมาตรฐาน',
    actionLink: ''
  },
  {
    id: 'svc_6',
    title: 'สำรวจหน้างาน ออกแบบ & ทำ BOQ',
    desc: 'บริการส่งวิศวกรเข้าวัดพื้นที่จริง ให้คำแนะนำแนวทางก่อสร้าง พร้อมจัดทำใบเสนอราคา BOQ ละเอียดไม่มีหมกเม็ด',
    icon: 'fa-solid fa-ruler-combined',
    point1: 'สำรวจฟรี ไม่มีค่าใช้จ่ายและข้อผูกมัด',
    point2: 'เอกสาร BOQ แยกวัสดุ-ค่าแรงชัดเจน',
    modalKey: '',
    actionText: 'นัดหมายสำรวจหน้างานฟรี',
    actionLink: '#contact'
  }
];

const INITIAL_PROJECTS = [
  {
    id: 'proj_1',
    title: 'บ้านพักอาศัยโมเดิร์นทรอปิคอล 2 ชั้น',
    category: 'house',
    badge: 'สร้างบ้านเดี่ยว',
    location: 'จ.นนทบุรี',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    desc: 'งานก่อสร้างบ้านเดี่ยวสไตล์ Modern Tropical เน้นความโปร่งโล่ง รับลมธรรมชาติ ประหยัดพลังงาน โครงสร้างคอนกรีตเสริมเหล็กมาตรฐาน มอก.',
    area: '320 ตร.ม.',
    duration: '8 เดือน',
    status: 'ส่งมอบตรงเวลา'
  },
  {
    id: 'proj_2',
    title: 'รีโนเวททาวน์โฮม 3 ชั้นสไตล์ Japandi',
    category: 'renovation',
    badge: 'รีโนเวทบ้าน',
    location: 'ลาดพร้าว, กทม.',
    img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    desc: 'ปรับโฉมทาวน์โฮมเก่าอายุ 25 ปี ให้กลายเป็นบ้านสไตล์มินิมอลอบอุ่น แก้ปัญหารอยร้าวและระบบประปารั่วซึมถาวร',
    area: '180 ตร.ม.',
    duration: '3 เดือน',
    status: 'งบไม่บานปลาย'
  },
  {
    id: 'proj_3',
    title: 'ตกแต่งภายใน Penthouse คอนโดหรู',
    category: 'interior',
    badge: 'ตกแต่งภายใน',
    location: 'สุขุมวิท, กทม.',
    img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    desc: 'บิวท์อินเฟอร์นิเจอร์ไม้ HMR ปิดผิวลามิเนตลายหินอ่อน ซ่อนไฟ LED Warm-light ควบคุมด้วยระบบ Smart Home ทั้งยูนิต',
    area: '145 ตร.ม.',
    duration: '45 วัน',
    status: 'งานประณีต 100%'
  },
  {
    id: 'proj_4',
    title: 'ต่อเติมห้องครัวโมเดิร์น & โรงรถหลังคาไวนิล',
    category: 'extension',
    badge: 'งานต่อเติม',
    location: 'รามอินทรา, กทม.',
    img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    desc: 'ต่อเติมครัวหลังบ้านพร้อมเคาน์เตอร์ปูนหล่อ และโรงจอดรถหน้าบ้าน ลงเสาเข็มไมโครไพล์ I-18 ลึก 21 เมตร แยกโครงสร้างอิสระ',
    area: '65 ตร.ม.',
    duration: '25 วัน',
    status: 'รับประกันโครงสร้าง'
  },
  {
    id: 'proj_5',
    title: 'ปรับปรุงระบบไฟฟ้าและประปา อาคารพาณิชย์ 4 ชั้น',
    category: 'mep',
    badge: 'งานระบบ MEP',
    location: 'สาทร, กทม.',
    img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    desc: 'เดินสายไฟร้อยท่อเหล็ก EMT ใหม่ทั้งตึก ติดตั้งตู้ MDB แยกชั้น และเปลี่ยนระบบท่อน้ำดีเป็น PPR ไร้รอยต่อ ปลอดภัยได้มาตรฐาน มอก.',
    area: '400 ตร.ม.',
    duration: '30 วัน',
    status: 'มาตรฐานความปลอดภัย'
  },
  {
    id: 'proj_6',
    title: 'ออกแบบและตกแต่ง Modern Office Space',
    category: 'interior',
    badge: 'ตกแต่งภายใน',
    location: 'สาทร, กทม.',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    desc: 'ตกแต่งออฟฟิศทำงานสไตล์ Modern Loft โทนอบอุ่น กั้นห้องประชุมกระจก Acoustic Glass เก็บเสียงระดับสูง พร้อมระบบตู้ Rack และ LAN',
    area: '240 ตร.ม.',
    duration: '40 วัน',
    status: 'ตรวจรับรอบเดียว'
  }
];

const INITIAL_REVIEWS = [
  {
    id: 'rev_1',
    name: 'คุณกิตติศักดิ์ พ.',
    role: 'เจ้าของบ้านเดี่ยว ม.เศรษฐสิริ นนทบุรี',
    rating: 5,
    comment: 'ประทับใจทีมงานเพิ่มพูนมากครับ รีโนเวทบ้านเดี่ยว 2 ชั้น ช่างทำงานเรียบร้อย ตรงเวลา ส่งอัปเดตงานในไลน์กลุ่มทุกวันศุกร์ ไม่ต้องคอยตามจี้ คุมงบได้ตาม BOQ เป๊ะ',
    timestamp: Date.now() - 3600000 * 200
  },
  {
    id: 'rev_2',
    name: 'คุณวิภาวรรณ ส.',
    role: 'โครงการบ้านกลางเมือง ลาดพร้าว',
    rating: 5,
    comment: 'ต่อเติมครัวหลังบ้านและโรงจอดรถ ลงเข็มไมโครไพล์แยกโครงสร้างให้ ผ่านหน้าฝนมาไม่มีปัญหารอยร้าวหรือรั่วซึมเลยค่ะ มีวิศวกรมาคุมงานจริง สบายใจมากค่ะ',
    timestamp: Date.now() - 3600000 * 400
  },
  {
    id: 'rev_3',
    name: 'คุณธนากร ภ.',
    role: 'Life Asoke Hype, กทม.',
    rating: 5,
    comment: 'งานบิวท์อินคอนโด 2 ห้องนอน เก็บงานประณีต ฟิตติ้ง Soft-close ทั้งหมด ทีมงานให้คำปรึกษาโทนสีและระบบไฟดีมาก ห้องออกมาสวยตรงปกเหมือน 3D เลยครับ',
    timestamp: Date.now() - 3600000 * 600
  }
];

// 2. Site Settings Service
async function getSiteSettings() {
  let settings = { ...DEFAULT_SITE_SETTINGS };
  const saved = localStorage.getItem('permpoon_site_settings');
  if (saved) {
    try {
      settings = { ...settings, ...JSON.parse(saved) };
    } catch (e) {}
  }

  try {
    const res = await fetchWithTimeout(`${RAILWAY_API_BASE}/settings?key=site_info`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        settings = { ...settings, ...json.data };
        localStorage.setItem('permpoon_site_settings', JSON.stringify(settings));
        isRailwayActive = true;
      }
    }
  } catch (err) {
    console.warn('Could not fetch settings from Railway, using local cache:', err.message);
  }

  return settings;
}

async function saveSiteSettings(newSettings) {
  let current = { ...DEFAULT_SITE_SETTINGS };
  try {
    const saved = localStorage.getItem('permpoon_site_settings');
    if (saved) current = { ...current, ...JSON.parse(saved) };
  } catch (e) {}

  const merged = { ...current, ...newSettings };
  localStorage.setItem('permpoon_site_settings', JSON.stringify(merged));

  try {
    const res = await fetchWithTimeout(`${RAILWAY_API_BASE}/settings?key=site_info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(merged)
    });
    if (res.ok) {
      isRailwayActive = true;
    }
  } catch (err) {
    console.warn('Could not sync settings to Railway (saved locally):', err.message);
  }
  return true;
}

// 3. Dynamic Services List
async function getServicesList() {
  let list = null;
  const saved = localStorage.getItem('permpoon_services_list');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) list = parsed;
    } catch (e) {}
  }

  try {
    const res = await fetchWithTimeout(`${RAILWAY_API_BASE}/settings?key=services_list`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data && Array.isArray(json.data.items) && json.data.items.length > 0) {
        list = json.data.items;
        localStorage.setItem('permpoon_services_list', JSON.stringify(list));
        isRailwayActive = true;
      }
    }
  } catch (err) {
    console.warn('Could not fetch services list from Railway, using cache:', err.message);
  }

  return list || DEFAULT_SERVICES_LIST;
}

async function saveServicesList(list) {
  if (!Array.isArray(list)) list = DEFAULT_SERVICES_LIST;
  localStorage.setItem('permpoon_services_list', JSON.stringify(list));

  try {
    await fetchWithTimeout(`${RAILWAY_API_BASE}/settings?key=services_list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: list })
    });
  } catch (err) {
    console.warn('Could not sync services list to Railway (saved locally):', err.message);
  }
  return true;
}

// 4. Inquiries / Leads Service
async function saveInquiry(data) {
  const inquiryData = {
    ...data,
    status: 'new',
    createdAt: new Date().toISOString(),
    timestamp: Date.now()
  };

  const existing = JSON.parse(localStorage.getItem('permpoon_inquiries') || '[]');
  const localId = 'lead_' + Date.now();
  inquiryData.id = localId;
  existing.unshift(inquiryData);
  localStorage.setItem('permpoon_inquiries', JSON.stringify(existing));

  try {
    const res = await fetchWithTimeout(`${RAILWAY_API_BASE}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryData)
    });
    if (res.ok) {
      const json = await res.json();
      return { success: true, id: json.id || localId, mode: 'railway' };
    }
  } catch (err) {
    console.warn('Saved inquiry locally (Railway sync fallback):', err.message);
  }

  return { success: true, id: localId, mode: 'local' };
}

async function getInquiries() {
  let items = null;
  try {
    const res = await fetchWithTimeout(`${RAILWAY_API_BASE}/inquiries`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.items)) {
        items = json.items;
        localStorage.setItem('permpoon_inquiries', JSON.stringify(items));
        isRailwayActive = true;
      }
    }
  } catch (err) {
    console.warn('Could not fetch inquiries from Railway, reading local:', err.message);
  }

  if (!items) {
    items = JSON.parse(localStorage.getItem('permpoon_inquiries') || '[]');
  }
  return items;
}

async function updateInquiryStatus(id, newStatus) {
  const list = JSON.parse(localStorage.getItem('permpoon_inquiries') || '[]');
  const index = list.findIndex(item => item.id === id);
  if (index !== -1) {
    list[index].status = newStatus;
    localStorage.setItem('permpoon_inquiries', JSON.stringify(list));
  }

  try {
    await fetchWithTimeout(`${RAILWAY_API_BASE}/inquiries`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus })
    });
  } catch (err) {
    console.warn('Could not sync status update to Railway (updated locally):', err.message);
  }
  return true;
}

async function deleteInquiry(id) {
  const list = JSON.parse(localStorage.getItem('permpoon_inquiries') || '[]');
  const filtered = list.filter(item => item.id !== id);
  localStorage.setItem('permpoon_inquiries', JSON.stringify(filtered));

  try {
    await fetchWithTimeout(`${RAILWAY_API_BASE}/inquiries?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.warn('Could not sync delete to Railway (deleted locally):', err.message);
  }
  return true;
}

// 5. Customer Reviews Service
async function getReviews() {
  let items = null;
  try {
    const res = await fetchWithTimeout(`${RAILWAY_API_BASE}/reviews`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.items) && json.items.length > 0) {
        items = json.items;
        localStorage.setItem('permpoon_reviews', JSON.stringify(items));
        isRailwayActive = true;
      }
    }
  } catch (err) {
    console.warn('Could not fetch reviews from Railway, reading local:', err.message);
  }

  if (!items || items.length === 0) {
    const localReviews = JSON.parse(localStorage.getItem('permpoon_reviews') || '[]');
    items = localReviews.length > 0 ? localReviews : INITIAL_REVIEWS;
  }
  return items;
}

async function saveReview(reviewData) {
  const data = {
    ...reviewData,
    id: reviewData.id || 'rev_' + Date.now(),
    rating: Number(reviewData.rating) || 5,
    timestamp: Date.now(),
    createdAt: new Date().toISOString()
  };

  const existing = JSON.parse(localStorage.getItem('permpoon_reviews') || '[]');
  existing.unshift(data);
  localStorage.setItem('permpoon_reviews', JSON.stringify(existing));

  try {
    const res = await fetchWithTimeout(`${RAILWAY_API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      const json = await res.json();
      return { success: true, id: json.id || data.id };
    }
  } catch (err) {
    console.warn('Saved review locally (Railway sync fallback):', err.message);
  }
  return { success: true, id: data.id };
}

// 6. Portfolio Projects Service
async function getPortfolioProjects() {
  let items = null;
  try {
    const res = await fetchWithTimeout(`${RAILWAY_API_BASE}/portfolio`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.items) && json.items.length > 0) {
        items = json.items;
        localStorage.setItem('permpoon_portfolio', JSON.stringify(items));
        isRailwayActive = true;
      }
    }
  } catch (err) {
    console.warn('Could not fetch portfolio from Railway, reading local:', err.message);
  }

  if (!items || items.length === 0) {
    const local = JSON.parse(localStorage.getItem('permpoon_portfolio') || '[]');
    items = local.length > 0 ? local : INITIAL_PROJECTS;
  }
  return items;
}

async function savePortfolioProject(proj) {
  const isNew = !proj.id;
  const projectData = {
    ...proj,
    id: proj.id || 'proj_' + Date.now(),
    timestamp: Date.now()
  };

  const list = JSON.parse(localStorage.getItem('permpoon_portfolio') || JSON.stringify(INITIAL_PROJECTS));
  if (isNew) {
    list.unshift(projectData);
  } else {
    const idx = list.findIndex(p => p.id === proj.id);
    if (idx !== -1) list[idx] = { ...list[idx], ...projectData };
  }
  localStorage.setItem('permpoon_portfolio', JSON.stringify(list));

  try {
    const res = await fetchWithTimeout(`${RAILWAY_API_BASE}/portfolio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData)
    });
    if (res.ok) {
      const json = await res.json();
      return { success: true, id: json.id || projectData.id };
    }
  } catch (err) {
    console.warn('Saved portfolio item locally (Railway sync fallback):', err.message);
  }

  return { success: true, id: projectData.id };
}

async function deletePortfolioProject(id) {
  const list = JSON.parse(localStorage.getItem('permpoon_portfolio') || JSON.stringify(INITIAL_PROJECTS));
  const filtered = list.filter(p => p.id !== id);
  localStorage.setItem('permpoon_portfolio', JSON.stringify(filtered));

  try {
    await fetchWithTimeout(`${RAILWAY_API_BASE}/portfolio?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.warn('Deleted portfolio item locally (Railway sync fallback):', err.message);
  }
  return true;
}

// 7. Admin PIN Security
const DEFAULT_ADMIN_PIN = "1234";

function getAdminPin() {
  return localStorage.getItem('permpoon_admin_pin') || DEFAULT_ADMIN_PIN;
}

function verifyAdminPin(inputPin) {
  return String(inputPin).trim() === getAdminPin();
}

function updateAdminPin(newPin) {
  if (!newPin || newPin.length < 4) return false;
  localStorage.setItem('permpoon_admin_pin', String(newPin).trim());
  return true;
}

// Backwards-compatible aliases for legacy scripts
const isFirebaseActive = false;
