# บริษัท เพิ่มพูน คอนทรัคชั่น จำกัด (Poemphoon Construction Co., Ltd.)

เว็บไซต์องค์กรสไตล์ Minimal & Clean พร้อมระบบฐานข้อมูล **Firebase Cloud Firestore** และเชื่อมต่อขึ้น Production บน **Vercel** เรียบร้อยแล้ว 🚀

---

## 🌐 ลิงก์ออนไลน์จริง (Live Production)

- 🏠 **หน้าแรกของเว็บไซต์:**  
  👉 **[https://permpoon-construction.vercel.app](https://permpoon-construction.vercel.app)**

- 📊 **ระบบหลังบ้านจัดการข้อมูลลูกค้า (CRM Admin):**  
  👉 **[https://permpoon-construction.vercel.app/admin.html](https://permpoon-construction.vercel.app/admin.html)**

- ⚙️ **หน้าแดชบอร์ด Vercel:**  
  👉 **[https://vercel.com/tw6/permpoon-construction](https://vercel.com/tw6/permpoon-construction)**

---

## 🔥 ข้อมูลการเชื่อมต่อระบบ

### 1. ฐานข้อมูล Firebase Firestore
- **Project ID:** `permpoon-15ae8`
- **Config File:** [js/firebase-config.js](file:///Users/ingram/Downloads/เว็บบริษัทเพิ่มพูน/js/firebase-config.js)
- **ระบบที่เชื่อมต่อแล้ว:**
  - แบบฟอร์มนัดสำรวจหน้างาน ➔ บันทึกตรงเข้า Firestore collection `inquiries`
  - ระบบรีวิวลูกค้า ➔ ดึงและบันทึกตรงเข้า Firestore collection `reviews`

### 2. โฮสติ้ง Vercel
- **Team:** `tw6`
- **Project Name:** `permpoon-construction`
- **Production Domain:** `permpoon-construction.vercel.app`

---

## 💻 คำสั่งอัปเดตงาน (เมื่อมีการแก้ไขโค้ด)

```bash
# ดีพลอยอัปเดตเวอร์ชันใหม่ขึ้น Vercel ทันที
vercel --prod
```
