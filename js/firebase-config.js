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
 * @param {Object} data - { name, phone, line, service, location, budget, message }
 * @returns {Promise<Object>}
 */
async function saveInquiry(data) {
  const inquiryData = {
    ...data,
    status: 'new', // 'new' | 'contacted' | 'surveyed' | 'completed' | 'cancelled'
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
 * @returns {Promise<Array>}
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

  // Fallback: Read from LocalStorage
  const localData = JSON.parse(localStorage.getItem('permpoon_inquiries') || '[]');
  if (localData.length === 0) {
    // Seed with realistic demo leads if empty
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
 * @param {string} id 
 * @param {string} newStatus 
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

  // Update in LocalStorage
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
 * @param {string} id 
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

  // Delete from LocalStorage
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
