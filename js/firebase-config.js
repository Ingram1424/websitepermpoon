/**
 * Permpoon Construction & Design Co., Ltd.
 * Firebase & Cloud Firestore Configuration & Services
 */

// 1. Firebase Configuration Object (Connected to project: permpoon-15ae8)
const firebaseConfig = {
  apiKey: "AIzaSydbre0q-1Wsk5RN5E0uILPtO1qJffLGOa8",
  authDomain: "permpoon-15ae8.firebaseapp.com",
  projectId: "permpoon-15ae8",
  storageBucket: "permpoon-15ae8.firebasestorage.app",
  messagingSenderId: "500706462069",
  appId: "1:500706462069:web:426a14ba3252711b3c6b3c"
};

// Check if localStorage has custom override config
const savedConfig = localStorage.getItem('permpoon_firebase_config');
const activeConfig = savedConfig ? JSON.parse(savedConfig) : firebaseConfig;

// 2. Initialize Firebase
let db = null;
let isFirebaseActive = false;

try {
  if (typeof firebase !== 'undefined' && activeConfig.apiKey) {
    if (!firebase.apps.length) {
      firebase.initializeApp(activeConfig);
    }
    db = firebase.firestore();
    isFirebaseActive = true;
    console.log("✅ Firebase Firestore Connected successfully to permpoon-15ae8!");
  } else {
    console.warn("ℹ️ Running in Smart Fallback Mode (LocalStorage).");
  }
} catch (error) {
  console.error("⚠️ Firebase initialization error, falling back to local storage:", error);
}

// 3. Database Services

/**
 * Save new contact / consultation lead
 */
async function saveInquiry(data) {
  const inquiryData = {
    ...data,
    status: 'new',
    createdAt: new Date().toISOString(),
    timestamp: Date.now()
  };

  if (isFirebaseActive && db) {
    try {
      const docRef = await db.collection('inquiries').add(inquiryData);
      console.log("Lead saved to Firebase Firestore with ID:", docRef.id);
      return { success: true, id: docRef.id, mode: 'firebase' };
    } catch (err) {
      console.error("Firebase save error, saving to local fallback:", err);
    }
  }

  // Fallback: Save to LocalStorage
  const existing = JSON.parse(localStorage.getItem('permpoon_inquiries') || '[]');
  const id = 'local_' + Date.now();
  existing.unshift({ id, ...inquiryData });
  localStorage.setItem('permpoon_inquiries', JSON.stringify(existing));
  return { success: true, id, mode: 'local' };
}

/**
 * Fetch all contact inquiries (for Admin Dashboard)
 */
async function getInquiries() {
  if (isFirebaseActive && db) {
    try {
      const snapshot = await db.collection('inquiries').orderBy('timestamp', 'desc').get();
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } catch (err) {
      console.warn("Could not fetch from Firebase, reading local storage:", err);
    }
  }

  const localData = JSON.parse(localStorage.getItem('permpoon_inquiries') || '[]');
  if (localData.length === 0) {
    const demoLeads = [
      {
        id: 'demo_1',
        name: 'คุณธีรเดช วรการุณ',
        phone: '081-998-7766',
        line: 'theeradech.w',
        service: 'สร้างบ้านใหม่',
        location: 'บางกรวย, นนทบุรี',
        budget: '1.5 - 3 ล้าน',
        message: 'ต้องการสร้างบ้านเดี่ยว 2 ชั้น ที่ดิน 80 ตร.ว. อยากนัดคุยแบบแปลนวันเสาร์นี้',
        status: 'new',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        timestamp: Date.now() - 3600000 * 4
      },
      {
        id: 'demo_2',
        name: 'คุณพัชราภรณ์ สุขสวัสดิ์',
        phone: '089-445-5678',
        line: 'patchara_p',
        service: 'รีโนเวทบ้าน',
        location: 'ลาดพร้าว 71, กทม.',
        budget: '7 แสน - 1.5 ล้าน',
        message: 'ทาวน์โฮม 3 ชั้น อยากทุบเปิดช่องแสง ทำห้องนั่งเล่นและครัวใหม่ทั้งหมด',
        status: 'contacted',
        createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
        timestamp: Date.now() - 3600000 * 28
      },
      {
        id: 'demo_3',
        name: 'คุณอรรถพล เจริญพาณิชย์',
        phone: '095-223-8899',
        line: 'attapol.c',
        service: 'ตกแต่งภายใน',
        location: 'สุขุมวิท 39, กทม.',
        budget: '3 - 7 แสน',
        message: 'คอนโด 2 ห้องนอน ต้องการบิวท์อินตู้เสื้อผ้า Walk-in และชุดวางทีวี',
        status: 'completed',
        createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
        timestamp: Date.now() - 3600000 * 72
      }
    ];
    localStorage.setItem('permpoon_inquiries', JSON.stringify(demoLeads));
    return demoLeads;
  }
  return localData;
}

/**
 * Update Inquiry status
 */
async function updateInquiryStatus(id, newStatus) {
  if (isFirebaseActive && db && !id.startsWith('local_') && !id.startsWith('demo_')) {
    try {
      await db.collection('inquiries').doc(id).update({ status: newStatus });
      return true;
    } catch (err) {
      console.error("Firebase update status error:", err);
    }
  }

  const list = JSON.parse(localStorage.getItem('permpoon_inquiries') || '[]');
  const index = list.findIndex(item => item.id === id);
  if (index !== -1) {
    list[index].status = newStatus;
    localStorage.setItem('permpoon_inquiries', JSON.stringify(list));
    return true;
  }
  return false;
}

/**
 * Delete an inquiry
 */
async function deleteInquiry(id) {
  if (isFirebaseActive && db && !id.startsWith('local_') && !id.startsWith('demo_')) {
    try {
      await db.collection('inquiries').doc(id).delete();
      return true;
    } catch (err) {
      console.error("Firebase delete error:", err);
    }
  }

  const list = JSON.parse(localStorage.getItem('permpoon_inquiries') || '[]');
  const filtered = list.filter(item => item.id !== id);
  localStorage.setItem('permpoon_inquiries', JSON.stringify(filtered));
  return true;
}

/**
 * Customer Reviews Service
 */
async function getReviews() {
  if (isFirebaseActive && db) {
    try {
      const snapshot = await db.collection('reviews').orderBy('timestamp', 'desc').get();
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } catch (err) {
      console.warn("Could not fetch reviews from Firebase, fallback:", err);
    }
  }

  const localReviews = JSON.parse(localStorage.getItem('permpoon_reviews') || '[]');
  if (localReviews.length === 0) {
    const initialReviews = [
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
    localStorage.setItem('permpoon_reviews', JSON.stringify(initialReviews));
    return initialReviews;
  }
  return localReviews;
}

async function saveReview(reviewData) {
  const data = {
    ...reviewData,
    rating: Number(reviewData.rating) || 5,
    timestamp: Date.now(),
    createdAt: new Date().toISOString()
  };

  if (isFirebaseActive && db) {
    try {
      const docRef = await db.collection('reviews').add(data);
      return { success: true, id: docRef.id };
    } catch (err) {
      console.error("Firebase save review error:", err);
    }
  }

  const existing = JSON.parse(localStorage.getItem('permpoon_reviews') || '[]');
  existing.unshift({ id: 'rev_' + Date.now(), ...data });
  localStorage.setItem('permpoon_reviews', JSON.stringify(existing));
  return { success: true, id: 'rev_' + Date.now() };
}

/**
 * 4. Site Settings (แก้ไขข้อมูลเว็บไซต์และเบอร์ติดต่อ)
 */
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
  rateExtension: 8500
};

async function getSiteSettings() {
  if (isFirebaseActive && db) {
    try {
      const doc = await db.collection('settings').doc('site_info').get();
      if (doc.exists) {
        const data = doc.data();
        if (data.address && data.address.includes('งามวงศ์วาน')) {
          data.address = DEFAULT_SITE_SETTINGS.address;
          data.email = DEFAULT_SITE_SETTINGS.email;
          data.companyName = DEFAULT_SITE_SETTINGS.companyName;
          try {
            await db.collection('settings').doc('site_info').set(data, { merge: true });
          } catch (e) {}
        }
        return { ...DEFAULT_SITE_SETTINGS, ...data };
      }
    } catch (err) {
      console.warn("Could not load site settings from Firebase, reading local:", err);
    }
  }

  const saved = localStorage.getItem('permpoon_site_settings');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.address && parsed.address.includes('งามวงศ์วาน')) {
        parsed.address = DEFAULT_SITE_SETTINGS.address;
        parsed.email = DEFAULT_SITE_SETTINGS.email;
        parsed.companyName = DEFAULT_SITE_SETTINGS.companyName;
        localStorage.setItem('permpoon_site_settings', JSON.stringify(parsed));
      }
      return { ...DEFAULT_SITE_SETTINGS, ...parsed };
    } catch (e) {}
  }
  return DEFAULT_SITE_SETTINGS;
}

async function saveSiteSettings(newSettings) {
  const merged = { ...DEFAULT_SITE_SETTINGS, ...newSettings };
  if (isFirebaseActive && db) {
    try {
      await db.collection('settings').doc('site_info').set(merged, { merge: true });
    } catch (err) {
      console.error("Error saving site settings to Firebase:", err);
    }
  }
  localStorage.setItem('permpoon_site_settings', JSON.stringify(merged));
  return true;
}

/**
 * 5. Portfolio Projects CRUD (เพิ่ม/ลบ/แก้ไขผลงานโครงการ)
 */
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
    title: 'รีโนเวททาวน์โฮมเก่าเป็น Modern Nordic',
    category: 'renovation',
    badge: 'รีโนเวท',
    location: 'ลาดพร้าว, กทม.',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    desc: 'พลิกโฉมทาวน์โฮมเก่ายุค 90 ให้กลายเป็นบ้านมินิมอลนอร์ดิกสุดโมเดิร์น ทุบผนังเปิด Open Plan วางระบบไฟประปาร้อยท่อใหม่หมด',
    area: '180 ตร.ม.',
    duration: '3.5 เดือน',
    status: 'ตรงตาม BOQ'
  },
  {
    id: 'proj_3',
    title: 'ตกแต่งภายในและบิวท์อิน คอนโด 2 Bedroom',
    category: 'interior',
    badge: 'ตกแต่งภายใน',
    location: 'สุขุมวิท, กทม.',
    img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    desc: 'งานบิวท์อินเฟอร์นิเจอร์สั่งทำพิเศษ ไม้ HMR เกรดทนชื้น ปิดผิวลามิเนตลายไม้และหินอ่อน ตู้เสื้อผ้า Walk-in Closet พร้อมไฟ LED',
    area: '65 ตร.ม.',
    duration: '45 วัน',
    status: 'รับประกัน 1 ปี'
  },
  {
    id: 'proj_4',
    title: 'ต่อเติมครัวไทยหลังบ้าน & โรงจอดรถ',
    category: 'extension',
    badge: 'งานต่อเติม',
    location: 'บางนา, สมุทรปราการ',
    img: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    desc: 'ต่อเติมครัวไทยระบายอากาศได้ดี ตอกเสาเข็มไมโครไพล์ I-18 ลึก 19 เมตรถึงชั้นดินดาน โครงสร้างแยกอิสระจากตัวบ้านเดิม 100%',
    area: '45 ตร.ม.',
    duration: '30 วัน',
    status: 'ลงเข็มไมโครไพล์'
  },
  {
    id: 'proj_5',
    title: 'คฤหาสน์หรู Contemporary Luxury',
    category: 'house',
    badge: 'สร้างบ้านเดี่ยว',
    location: 'ปทุมธานี',
    img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    desc: 'โครงการบ้านพักอาศัยระดับลักชัวรี 2 ชั้น พร้อมสระว่ายน้ำส่วนตัว คานโครงสร้างขนาดใหญ่รองรับแผ่นดินไหว ระบบ Solar Air-Flow',
    area: '580 ตร.ม.',
    duration: '12 เดือน',
    status: 'ประกันโครงสร้าง 5 ปี'
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

async function getPortfolioProjects() {
  if (isFirebaseActive && db) {
    try {
      const snapshot = await db.collection('portfolio').get();
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } catch (err) {
      console.warn("Could not load portfolio from Firebase, fallback:", err);
    }
  }

  const local = JSON.parse(localStorage.getItem('permpoon_portfolio') || '[]');
  if (local.length === 0) {
    localStorage.setItem('permpoon_portfolio', JSON.stringify(INITIAL_PROJECTS));
    return INITIAL_PROJECTS;
  }
  return local;
}

async function savePortfolioProject(proj) {
  const isNew = !proj.id;
  const projectData = {
    ...proj,
    timestamp: Date.now()
  };

  if (isFirebaseActive && db) {
    try {
      if (isNew) {
        const ref = await db.collection('portfolio').add(projectData);
        return { success: true, id: ref.id };
      } else {
        await db.collection('portfolio').doc(proj.id).set(projectData, { merge: true });
        return { success: true, id: proj.id };
      }
    } catch (err) {
      console.error("Firebase portfolio save error:", err);
    }
  }

  const list = JSON.parse(localStorage.getItem('permpoon_portfolio') || JSON.stringify(INITIAL_PROJECTS));
  if (isNew) {
    const id = 'proj_' + Date.now();
    list.unshift({ id, ...projectData });
  } else {
    const idx = list.findIndex(p => p.id === proj.id);
    if (idx !== -1) list[idx] = { ...list[idx], ...projectData };
  }
  localStorage.setItem('permpoon_portfolio', JSON.stringify(list));
  return { success: true };
}

async function deletePortfolioProject(id) {
  if (isFirebaseActive && db && !id.startsWith('proj_')) {
    try {
      await db.collection('portfolio').doc(id).delete();
    } catch (err) {
      console.error("Firebase delete project error:", err);
    }
  }

  const list = JSON.parse(localStorage.getItem('permpoon_portfolio') || JSON.stringify(INITIAL_PROJECTS));
  const filtered = list.filter(p => p.id !== id);
  localStorage.setItem('permpoon_portfolio', JSON.stringify(filtered));
  return true;
}

/**
 * 6. Admin Passcode Security
 */
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
