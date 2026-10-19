# บริษัท เพิ่มพูน คอนสตรัคชั่น แอนด์ ดีไซน์ จำกัด (Permpoon Website)

เว็บไซต์องค์กรสไตล์ Minimal & Clean พร้อมระบบฐานข้อมูล **Firebase Cloud Firestore** และเชื่อมต่อระบบขึ้น **Vercel** เรียบร้อยแล้ว

---

## 🚀 ลิงก์ออนไลน์ (Live Website)

- **ลิงก์หน้าเว็บไซต์หลัก:** [https://temporary-agile-sequoia-n6i0owa.vercel.app](https://temporary-agile-sequoia-n6i0owa.vercel.app)
- **ระบบหลังบ้านจัดการข้อมูล (Admin):** [https://temporary-agile-sequoia-n6i0owa.vercel.app/admin.html](https://temporary-agile-sequoia-n6i0owa.vercel.app/admin.html)

> ⭐️ **การผูกเข้าบัญชี Vercel ถาวร (Claim Deployment):**  
> คลิกที่ลิงก์นี้เพื่อบันทึกโปรเจกต์เข้าสู่บัญชี Vercel ของคุณถาวร:  
> [https://vercel.com/claim-deployment?code=e7944c1c-8dca-4d1b-bffd-0e2e7552d3d2](https://vercel.com/claim-deployment?code=e7944c1c-8dca-4d1b-bffd-0e2e7552d3d2)

---

## 🛠️ สรุประบบที่จัดทำเสร็จสมบูรณ์

### 1. ฐานข้อมูล Firebase Firestore (`js/firebase-config.js`)
- **ระบบจัดเก็บข้อมูลลูกค้าติดต่อ (Inquiries / Leads):**
  - เมื่อลูกค้ากรอกแบบฟอร์มนัดหมายสำรวจหน้างาน ข้อมูลจะถูกบันทึกส่งตรงเข้า Firestore Collection `inquiries`
  - มีระบบ **Smart Fallback Mode** หากยังไม่ได้ใส่ API Key หรือขณะออฟไลน์ ข้อมูลจะถูกเก็บลง LocalStorage อัตโนมัติ ไม่สูญหาย 100%
- **ระบบรีวิวลูกค้า (Reviews):**
  - ดึงข้อมูลรีวิวมาแสดงผลบนหน้าแรกแบบ Real-time
  - ลูกค้าสามารถกดปุ่ม **"+ เขียนรีวิวประสบการณ์"** บนหน้าแรกเพื่อส่งรีวิวเข้าฐานข้อมูลได้ทันที

### 2. ระบบหลังบ้าน CRM Admin (`admin.html`)
- ดูรายการลูกค้าที่ติดต่อเข้ามาทั้งหมด พร้อมปุ่มโทรออกด่วน (`tel:`) และ LINE
- อัปเดตสถานะงาน (`ใหม่`, `ติดต่อแล้ว`, `นัดสำรวจแล้ว`, `สำเร็จ`, `ยกเลิก`)
- ดาวน์โหลดรายชื่อลูกค้าเป็นไฟล์ Excel / CSV ได้ด้วยคลิกเดียว
- มีแท็บสำหรับ **วาง Firebase Config** ผ่านหน้าเว็บได้โดยตรง ไม่ต้องแก้โค้ด

### 3. การดีพลอยบน Vercel (`vercel.json`)
- ติดตั้ง **Vercel CLI** พร้อมคอนฟิก Clean URLs และ Security Headers
- อัปโหลดขึ้น Production บน Vercel เรียบร้อย

---

## 🔑 วิธีเชื่อมต่อ Firebase ของคุณเอง (ทำเพียง 3 นาที)

1. เข้าไปที่ [Firebase Console](https://console.firebase.google.com/) แล้วกด **"Add project"** ตั้งชื่อโปรเจกต์ (เช่น `permpoon-construction`)
2. ไปที่เมนู **Build -> Firestore Database** แล้วกด **Create database** (เลือกโหมด Start in test mode)
3. ไปที่ **Project Settings (รูปเฟือง) -> General -> Your apps** กดปุ่มไอคอนเว็บ `</>` เพื่อสร้าง Web App
4. คัดลอกโค้ด `firebaseConfig` ที่ได้ เช่น:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcd..."
};
```
5. นำไปวางในไฟล์ [js/firebase-config.js](file:///Users/ingram/Downloads/เว็บบริษัทเพิ่มพูน/js/firebase-config.js) หรือเปิดหน้า **Admin -> แท็บ "ตั้งค่า Firebase Database"** แล้วกดบันทึกได้ทันที!

---

## 💻 คำสั่งสำหรับรันและดีพลอย (Terminal Commands)

```bash
# รันเซิร์ฟเวอร์ดูในเครื่อง (Local)
python3 -m http.server 3000

# ดีพลอยขึ้น Vercel ด้วยตัวเองอีกครั้ง
vercel --prod
```
