/**
 * Permpoon Construction & Design Co., Ltd.
 * Website Main JavaScript Logic (Minimalist Edition)
 */

// 1. Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-nav-link');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    const icon = mobileMenuBtn.querySelector('i');
    if (mobileMenu.classList.contains('hidden')) {
      icon.className = 'fa-solid fa-bars text-lg';
    } else {
      icon.className = 'fa-solid fa-xmark text-lg';
    }
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars text-lg';
    });
  });
}

// 2. Active Navbar Highlight on Scroll
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY;

  sections.forEach(current => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 100;
    const sectionId = current.getAttribute('id');
    const navLink = document.querySelector(`.nav-item[href*="${sectionId}"]`);

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      if (navLink) navLink.classList.add('active');
    } else {
      if (navLink) navLink.classList.remove('active');
    }
  });
});

// 3. Portfolio Filter
function setupPortfolioFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.onclick = () => {
      filterButtons.forEach(b => {
        b.className = 'filter-btn px-3.5 py-1.5 rounded-lg font-medium transition bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200';
      });
      btn.className = 'filter-btn active px-3.5 py-1.5 rounded-lg font-medium transition bg-zinc-900 text-white';

      const filter = btn.getAttribute('data-filter');
      const items = document.querySelectorAll('.portfolio-item');
      items.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    };
  });
}

// 4. Portfolio Projects Data & Modal
let portfolioData = [
  {
    title: 'บ้านพักอาศัยโมเดิร์นทรอปิคอล 2 ชั้น',
    badge: 'สร้างบ้านเดี่ยว',
    location: 'นนทบุรี',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
    desc: 'งานก่อสร้างบ้านเดี่ยวสไตล์ Modern Tropical เน้นความโปร่งโล่ง รับลมธรรมชาติ ประหยัดพลังงาน โครงสร้างคอนกรีตเสริมเหล็กมาตรฐาน มอก. พร้อมงานตกแต่งระแนงไม้และกระจกตัดแสงเขียวสองชั้น',
    area: '320 ตร.ม.',
    duration: '8 เดือน',
    status: 'ส่งมอบตรงเวลา'
  },
  {
    title: 'รีโนเวททาวน์โฮมเก่าเป็น Modern Nordic',
    badge: 'รีโนเวท',
    location: 'ลาดพร้าว, กรุงเทพฯ',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
    desc: 'พลิกโฉมทาวน์โฮมเก่ายุค 90 ให้กลายเป็นบ้านมินิมอลนอร์ดิกสุดโมเดิร์น ทุบผนังเปิด Open Plan เชื่อมห้องนั่งเล่นกับพื้นที่ทานอาหาร วางระบบไฟประปาร้อยท่อใหม่หมด แก้งานรั่วซึมถาวร',
    area: '180 ตร.ม.',
    duration: '3.5 เดือน',
    status: 'ตรงตาม BOQ'
  },
  {
    title: 'ตกแต่งภายในและบิวท์อิน คอนโด 2 Bedroom',
    badge: 'ตกแต่งภายใน',
    location: 'สุขุมวิท, กรุงเทพฯ',
    img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80',
    desc: 'งานบิวท์อินเฟอร์นิเจอร์สั่งทำพิเศษ ไม้ HMR เกรดทนชื้น ปิดผิวลามิเนตลายไม้และหินอ่อน ตู้เสื้อผ้า Walk-in Closet พร้อมไฟ LED อัตโนมัติ ครบชุดพร้อมเข้าอยู่',
    area: '65 ตร.ม.',
    duration: '45 วัน',
    status: 'รับประกัน 1 ปี'
  },
  {
    title: 'ต่อเติมครัวไทยหลังบ้าน & โรงจอดรถ',
    badge: 'งานต่อเติม',
    location: 'บางนา, สมุทรปราการ',
    img: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1000&q=80',
    desc: 'ต่อเติมครัวไทยระบายอากาศได้ดี ตอกเสาเข็มไมโครไพล์ I-18 ลึก 19 เมตรถึงชั้นดินดาน โครงสร้างแยกอิสระจากตัวบ้านเดิม 100% ไม่ดึงรั้ง ไม่ทรุดร้าว พร้อมหลังคาไวนิลกันความร้อน',
    area: '45 ตร.ม.',
    duration: '30 วัน',
    status: 'รับประกันทรุดตัว'
  },
  {
    title: 'คฤหาสน์หรู Contemporary Luxury',
    badge: 'สร้างบ้านเดี่ยว',
    location: 'ปทุมธานี',
    img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80',
    desc: 'โครงการบ้านพักอาศัยระดับลักชัวรี 2 ชั้น พร้อมสระว่ายน้ำส่วนตัว คานโครงสร้างขนาดใหญ่รองรับแผ่นดินไหว ระบบระบายอากาศ Solar Air-Flow และเดินท่อสายไฟลงใต้ดินทั้งโครงการ',
    area: '580 ตร.ม.',
    duration: '12 เดือน',
    status: 'รับประกันโครงสร้าง 5 ปี'
  },
  {
    title: 'ออกแบบและตกแต่ง Modern Office Space',
    badge: 'ตกแต่งภายใน',
    location: 'สาทร, กรุงเทพฯ',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
    desc: 'ตกแต่งออฟฟิศทำงานสไตล์ Modern Loft โทนอบอุ่น กั้นห้องประชุมกระจก Acoustic Glass เก็บเสียงระดับสูง พร้อมงานระบบตู้ Rack และระบบ LAN สำหรับ 30 สถานีงาน',
    area: '240 ตร.ม.',
    duration: '40 วัน',
    status: 'ส่งมอบเรียบร้อย'
  }
];

function openPortfolioModal(index) {
  const data = portfolioData[index];
  if (!data) return;

  document.getElementById('modal-img').src = data.img;
  document.getElementById('modal-badge').innerText = data.badge;
  document.getElementById('modal-location').innerHTML = `<i class="fa-solid fa-location-dot mr-1"></i> ${data.location}`;
  document.getElementById('modal-title').innerText = data.title;
  document.getElementById('modal-desc').innerText = data.desc;
  document.getElementById('modal-area').innerText = data.area;
  document.getElementById('modal-duration').innerText = data.duration;
  document.getElementById('modal-status').innerText = data.status;

  const modal = document.getElementById('portfolio-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closePortfolioModal() {
  const modal = document.getElementById('portfolio-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = 'auto';
}

// 5. Service Detail Modal
const serviceData = {
  construction: {
    icon: '<i class="fa-solid fa-house text-zinc-800"></i>',
    title: 'รับเหมาก่อสร้างบ้านและอาคาร (Turnkey Construction)',
    desc: 'บริการสร้างบ้านและอาคารแบบครบวงจร ตั้งแต่ขั้นตอนออกแบบ เขียนแบบขออนุญาต จัดทำ BOQ ยื่นกู้ธนาคาร จนถึงการก่อสร้างและส่งมอบพร้อมเข้าอยู่',
    items: [
      'งานออกแบบ 2D แบบสถาปัตย์ วิศวกรรม และภาพ 3D เสมือนจริง',
      'งานโครงสร้างคอนกรีตเสริมเหล็ก (คสล.) หรือ โครงสร้างเหล็ก มอก.',
      'ทีมวิศวกรโยธาควบคุมงานและเซ็นรับรองความปลอดภัย',
      'งานสถาปัตยกรรม ก่อ-ฉาบ ปูกระเบื้อง ทาสี สุขภัณฑ์ครบวงจร',
      'รายงานความคืบหน้าผ่าน Line Group พร้อมภาพถ่ายทุกสัปดาห์'
    ]
  },
  renovation: {
    icon: '<i class="fa-solid fa-hammer text-zinc-800"></i>',
    title: 'รีโนเวทบ้าน คอนโด ทาวน์โฮม (Renovation)',
    desc: 'บริการปรับปรุงบ้านเก่า คืนชีวิตให้บ้านน่าอยู่ ปลอดภัย และตอบรับวิถีชีวิตยุคใหม่ พร้อมแก้ไขปัญหาโครงสร้างทรุด ผนังแตกร้าว หรือน้ำรั่วซึมอย่างตรงจุด',
    items: [
      'ปรับแปลน รื้อถอนผนัง และเสริมโครงสร้างเพื่อความปลอดภัย',
      'วางระบบไฟฟ้าและประปาใหม่ทั้งระบบด้วยท่อมาตรฐาน',
      'เปลี่ยนหลังคา ฝ้าเพดาน และแก้ปัญหารอยรั่วซึมถาวร',
      'ปูกระเบื้องใหม่ เปลี่ยนสุขภัณฑ์ ทาสีเกรดพรีเมียมเช็ดล้างได้',
      'สรุปงบประมาณชัดเจนใน BOQ คุมงบได้ 100% ไม่มีงบบานปลาย'
    ]
  },
  interior: {
    icon: '<i class="fa-solid fa-couch text-zinc-800"></i>',
    title: 'ตกแต่งภายใน & บิวท์อิน (Built-in)',
    desc: 'ออกแบบและผลิตเฟอร์นิเจอร์บิวท์อินเฉพาะบุคคล ใช้พื้นที่ให้คุ้มค่าทุกตารางนิ้ว คัดสรรวัสดุคุณภาพสูง เช่น ไม้จริง ไม้ HMR กันชื้น อุปกรณ์ฟิตติ้ง Soft-close',
    items: [
      'ออกแบบ 3D Interior Rendering เห็นภาพเสมือนจริงก่อนผลิต',
      'ชุดครัว บิวท์อินตู้เสื้อผ้า Walk-in closet ชั้นวางทีวี และเคาน์เตอร์',
      'อุปกรณ์บานพับและรางลิ้นชัก Soft-close ทนทานยาวนาน',
      'งานผนังตกแต่ง กรุผนังลายหินอ่อน ระแนงไม้ ซ่อนไฟ LED Warm-light',
      'ติดตั้งโดยทีมช่างไม้ฝีมือประณีต ละเอียดทุกรอยต่อ'
    ]
  },
  extension: {
    icon: '<i class="fa-solid fa-kitchen-set text-zinc-800"></i>',
    title: 'งานต่อเติมครัว หลังคา และโรงจอดรถ',
    desc: 'บริการต่อเติมพื้นที่ใช้สอยรอบบ้าน ด้วยหลักวิศวกรรมที่ถูกต้อง แยกโครงสร้างอิสระจากตัวบ้านเดิม 100% เพื่อป้องกันการดึงรั้งและรอยแตกร้าวในอนาคต',
    items: [
      'ตอกเสาเข็มไมโครไพล์ (Spun Micropile) ลึกถึงชั้นดินแข็ง',
      'คานคอดินและโครงสร้างเหล็กกล่องมาตรฐาน กัลวาไนซ์กันสนิม',
      'งานเคาน์เตอร์ครัวปูนหล่อแข็งแรง ปูกระเบื้องพร้อมใช้งาน',
      'ติดตั้งระบบดูดควัน ท่อระบายอากาศ และระบบดักไขมัน',
      'มุงหลังคาไวนิล เมทัลชีทบุฉนวน PU Foam กันร้อนและซับเสียง'
    ]
  },
  mep: {
    icon: '<i class="fa-solid fa-bolt text-zinc-800"></i>',
    title: 'งานระบบ ไฟฟ้า ประปา สุขาภิบาล',
    desc: 'ติดตั้ง ปรับปรุง และบำรุงรักษางานระบบอาคารให้ปลอดภัย ถูกต้องตามระเบียบการไฟฟ้านครหลวงและการประปา',
    items: [
      'เดินสายไฟร้อยท่อ ตู้ควบคุมไฟ Consumer Unit พร้อมเบรกเกอร์ RCBO',
      'ตอกหลักดิน (Ground Rod) วัดค่าความต้านทานดินตามเกณฑ์มาตรฐาน',
      'เดินท่อน้ำดี PPR เชื่อมด้วยความร้อน ไร้ปัญหารั่วซึมตลอดอายุการใช้งาน',
      'ติดตั้งถังเก็บน้ำ ปั๊มน้ำอัตโนมัติ และระบบสุขาภิบาลดักกลิ่นย้อน',
      'วางระบบกล้องวงจรปิด CCTV, LAN และ Smart Home Automation'
    ]
  }
};

function openServiceDetail(serviceKey) {
  let service = serviceData[serviceKey];
  if (!service) {
    // Try to find in dynamic services list
    const saved = localStorage.getItem('permpoon_services_list');
    if (saved) {
      try {
        const list = JSON.parse(saved);
        const found = list.find(s => s.id === serviceKey || s.modalKey === serviceKey || s.title === serviceKey);
        if (found) {
          service = {
            icon: `<i class="${found.icon || 'fa-solid fa-hammer'} text-zinc-800"></i>`,
            title: found.title,
            desc: found.desc,
            items: [found.point1, found.point2].filter(Boolean)
          };
        }
      } catch (e) {}
    }
  }
  if (!service) return;

  document.getElementById('service-modal-icon').innerHTML = service.icon || '<i class="fa-solid fa-hammer text-zinc-800"></i>';
  document.getElementById('service-modal-title').innerText = service.title;
  document.getElementById('service-modal-desc').innerText = service.desc;

  const listContainer = document.getElementById('service-modal-list');
  listContainer.innerHTML = '';
  if (service.items && service.items.length) {
    service.items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'flex items-start gap-2';
      li.innerHTML = `<i class="fa-solid fa-check text-zinc-800 text-[10px] mt-1"></i> <span>${item}</span>`;
      listContainer.appendChild(li);
    });
  }

  const modal = document.getElementById('service-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closeServiceModal() {
  const modal = document.getElementById('service-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = 'auto';
}

// 6. Interactive Service Area Checker
const availableAreas = [
  'คลองสามวา', 'เลียบคลองสอง', 'สามวาตะวันตก', 'สามวา', 'มีนบุรี', 'หทัยราษฎร์', 'นิมิตใหม่', 'รามอินทรา', 'คู้บอน',
  'กรุงเทพ', 'กทม', 'บางนา', 'บางเขน', 'ลาดพร้าว', 'จตุจักร', 'ห้วยขวาง', 'สุขุมวิท', 'พระราม', 'สาทร',
  'บางแค', 'ตลิ่งชัน', 'สายไหม', 'ดอนเมือง', 'ประเวศ', 'บางกะปิ', 'คันนายาว', 'สวนหลวง',
  'นนทบุรี', 'บางใหญ่', 'ปากเกร็ด', 'บางบัวทอง', 'เมืองนนทบุรี', 'ไทรน้อย', 'บางกรวย',
  'ปทุมธานี', 'รังสิต', 'คลองหลวง', 'ลำลูกกา', 'ธัญบุรี', 'เมืองปทุมธานี',
  'สมุทรปราการ', 'บางพลี', 'สำโรง', 'แพรกษา', 'เมืองสมุทรปราการ', 'บางบ่อ',
  'สมุทรสาคร', 'มหาชัย', 'กระทุ่มแบน',
  'นครปฐม', 'ศาลายา', 'พุทธมณฑล', 'นครชัยศรี',
  'ชลบุรี', 'พัทยา', 'ศรีราชา', 'บางแสน', 'ระยอง', 'ฉะเชิงเทรา', 'อยุธยา', 'สระบุรี'
];

function checkServiceArea() {
  const input = document.getElementById('area-search-input');
  const resultBox = document.getElementById('area-result');
  const query = (input.value || '').trim().toLowerCase();

  if (!query) {
    resultBox.className = 'p-3 rounded-xl text-xs bg-amber-50 text-amber-800 border border-amber-200 block';
    resultBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation mr-1"></i> กรุณากรอกชื่อเขต อำเภอ หรือจังหวัดของคุณ';
    return;
  }

  const isMatched = availableAreas.some(area => query.includes(area.toLowerCase()) || area.toLowerCase().includes(query));

  if (isMatched) {
    resultBox.className = 'p-3 rounded-xl text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 block animate-fade-in';
    resultBox.innerHTML = `
      <div class="font-bold flex items-center gap-1.5 text-emerald-800">
        <i class="fa-solid fa-circle-check"></i> พื้นที่ "${input.value}" อยู่ในเขตให้บริการหลัก
      </div>
      <p class="mt-1 text-[11px] text-emerald-700">
        ทีมวิศวกรพร้อมเข้าสำรวจหน้างานและประเมินราคา <strong>ฟรี ภายใน 24-48 ชม.</strong>
      </p>
    `;
  } else {
    resultBox.className = 'p-3 rounded-xl text-xs bg-zinc-100 text-zinc-700 border border-zinc-200 block animate-fade-in';
    resultBox.innerHTML = `
      <div class="font-semibold text-zinc-800">
        พื้นที่ "${input.value}" รับพิจารณาตามขนาดโครงการ
      </div>
      <p class="mt-1 text-[11px] text-zinc-500">
        ส่งแปลนหรือรายละเอียดมาให้ทีมงานช่วยตรวจสอบเบื้องต้นได้ทาง LINE @permpoon ครับ
      </p>
    `;
  }
}

// 7. Cost Calculator Logic
let currentRate = 14500;
let currentArea = 150;

const calcButtons = document.querySelectorAll('.calc-btn');
calcButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    calcButtons.forEach(b => {
      b.className = 'calc-btn p-2.5 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-medium text-xs transition';
    });
    btn.className = 'calc-btn active p-2.5 rounded-xl border border-zinc-900 bg-zinc-900 text-white font-medium text-xs transition';

    currentRate = parseFloat(btn.getAttribute('data-rate'));
    calculateEstimate();
  });
});

function updateArea(val) {
  currentArea = parseInt(val);
  document.getElementById('area-display').innerText = `${currentArea} ตร.ม.`;
  calculateEstimate();
}

function calculateEstimate() {
  const selectedTier = document.querySelector('input[name="material_tier"]:checked');
  const tierMultiplier = selectedTier ? parseFloat(selectedTier.value) : 1;

  const effectiveRate = Math.round(currentRate * tierMultiplier);
  const totalCost = Math.round(effectiveRate * currentArea);

  // Update displays
  document.getElementById('unit-cost').innerText = effectiveRate.toLocaleString('th-TH');
  document.getElementById('estimated-cost').innerText = `฿${totalCost.toLocaleString('th-TH')}`;

  // Update timeline estimate
  const timelineElem = document.getElementById('estimated-timeline');
  if (currentArea <= 50) {
    timelineElem.innerText = '3 - 6 สัปดาห์';
  } else if (currentArea <= 150) {
    timelineElem.innerText = '2 - 4 เดือน';
  } else if (currentArea <= 300) {
    timelineElem.innerText = '5 - 7 เดือน';
  } else {
    timelineElem.innerText = '8 - 12 เดือน';
  }
}

// 8. FAQ Accordion Toggle
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const content = item.querySelector('.faq-content');
  const icon = btn.querySelector('i');

  const isHidden = content.classList.contains('hidden');

  // Close other open faqs
  document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
  document.querySelectorAll('.faq-toggle i').forEach(i => i.style.transform = 'rotate(0deg)');

  if (isHidden) {
    content.classList.remove('hidden');
    icon.style.transform = 'rotate(180deg)';
  } else {
    content.classList.add('hidden');
    icon.style.transform = 'rotate(0deg)';
  }
}

// 9. Toast Notification & Form Submission
function showToast(message, isSuccess = true) {
  const toast = document.getElementById('toast');
  const msgElem = document.getElementById('toast-message');
  const iconElem = document.getElementById('toast-icon');

  msgElem.innerText = message;
  if (isSuccess) {
    iconElem.className = 'w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]';
    iconElem.innerHTML = '<i class="fa-solid fa-check"></i>';
  } else {
    iconElem.className = 'w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px]';
    iconElem.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
  }

  toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 4500);
}

// 10. Contact Form Submission (Saves to Firebase / LocalStorage)
async function handleContactSubmit(event) {
  event.preventDefault();
  
  const form = document.getElementById('contact-form');
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;

  const data = {
    name: document.getElementById('form-name').value.trim(),
    phone: document.getElementById('form-phone').value.trim(),
    line: (document.getElementById('form-line')?.value || '').trim(),
    service: document.getElementById('form-service').value,
    location: document.getElementById('form-location').value.trim(),
    message: (document.getElementById('form-message')?.value || '').trim(),
  };

  if (!data.name || !data.phone || !data.location) {
    showToast('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (*)', false);
    return;
  }

  // Show loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> กำลังบันทึกข้อมูล...';

  try {
    if (typeof saveInquiry === 'function') {
      await saveInquiry(data);
    }
    showToast(`ขอบคุณครับคุณ ${data.name}! ข้อมูลถูกบันทึกลงระบบแล้ว วิศวกรจะรีบติดต่อกลับครับ`);
    form.reset();
  } catch (err) {
    console.error("Error submitting form:", err);
    showToast('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง หรือโทรติดต่อโดยตรง', false);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
}

// 11. Customer Reviews Dynamic Loading & Modal
async function loadHomeReviews() {
  const container = document.getElementById('home-reviews-grid');
  if (!container || typeof getReviews !== 'function') return;

  try {
    const reviews = await getReviews();
    if (!reviews || reviews.length === 0) return;

    container.innerHTML = reviews.slice(0, 6).map(rev => `
      <div class="p-6 rounded-2xl bg-[#fafaf9] border border-zinc-200 flex flex-col justify-between">
        <div class="space-y-3">
          <div class="flex text-amber-500 text-xs">
            ${'<i class="fa-solid fa-star"></i>'.repeat(rev.rating || 5)}
          </div>
          <p class="text-xs text-zinc-600 leading-relaxed font-light">
            "${escapeHtml(rev.comment)}"
          </p>
        </div>
        <div class="pt-4 border-t border-zinc-200 mt-4 text-xs">
          <div class="font-bold text-zinc-900">${escapeHtml(rev.name)}</div>
          <div class="text-[11px] text-zinc-500">${escapeHtml(rev.role || 'ลูกค้า')}</div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.warn("Could not load dynamic reviews, keeping static fallback:", err);
  }
}

function openWriteReviewModal() {
  const modal = document.getElementById('write-review-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
}

function closeWriteReviewModal() {
  const modal = document.getElementById('write-review-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
  }
}

async function handlePublicReviewSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('pub-rev-name').value.trim();
  const role = document.getElementById('pub-rev-role').value.trim();
  const rating = Number(document.getElementById('pub-rev-rating').value) || 5;
  const comment = document.getElementById('pub-rev-comment').value.trim();

  if (typeof saveReview === 'function') {
    await saveReview({ name, role, rating, comment });
    closeWriteReviewModal();
    showToast('ขอบคุณสำหรับรีวิวของคุณครับ! ข้อมูลถูกบันทึกเรียบร้อย');
    loadHomeReviews();
  }
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text).replace(/[&<>"']/g, function(m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
  });
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
  const portfolioModal = document.getElementById('portfolio-modal');
  const serviceModal = document.getElementById('service-modal');
  const reviewModal = document.getElementById('write-review-modal');

  if (e.target === portfolioModal) closePortfolioModal();
  if (e.target === serviceModal) closeServiceModal();
  if (e.target === reviewModal) closeWriteReviewModal();
});

// Close modals with Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePortfolioModal();
    closeServiceModal();
    closeWriteReviewModal();
  }
});

// 12. Dynamic CMS Data Synchronization (Portfolio & Site Settings)
async function loadDynamicPortfolio() {
  const grid = document.getElementById('portfolio-grid');
  if (!grid || typeof getPortfolioProjects !== 'function') return;

  try {
    const projects = await getPortfolioProjects();
    if (projects && projects.length > 0) {
      portfolioData = projects;
      grid.innerHTML = projects.map((p, idx) => `
        <div class="portfolio-item bg-white rounded-2xl overflow-hidden border border-zinc-200 hover:shadow-md transition cursor-pointer group" data-category="${escapeHtml(p.category || 'house')}" onclick="openPortfolioModal(${idx})">
          <div class="aspect-[16/10] overflow-hidden bg-zinc-100 relative">
            <img src="${escapeHtml(p.img || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80')}" alt="${escapeHtml(p.title)}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" onerror="this.src='https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'">
            <span class="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[10px] font-semibold text-zinc-800 px-2.5 py-0.5 rounded-full shadow-xs">${escapeHtml(p.badge || 'ผลงาน')}</span>
          </div>
          <div class="p-4 space-y-1">
            <div class="text-[11px] text-zinc-400">${escapeHtml(p.location || 'กรุงเทพและปริมณฑล')} • ${escapeHtml(p.area || '')}</div>
            <h4 class="font-bold text-zinc-900 text-sm group-hover:text-zinc-600 transition">${escapeHtml(p.title)}</h4>
            <div class="flex justify-between items-center pt-2 text-[11px]">
              <span class="text-zinc-500"><i class="fa-regular fa-clock mr-1"></i> ${escapeHtml(p.duration || '-')}</span>
              <span class="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">${escapeHtml(p.status || 'ส่งมอบเรียบร้อย')}</span>
            </div>
          </div>
        </div>
      `).join('');

      setupPortfolioFilters();
    }
  } catch (err) {
    console.warn("Could not load dynamic portfolio:", err);
  }
}

async function loadDynamicSiteSettings() {
  if (typeof getSiteSettings !== 'function') return;

  try {
    const settings = await getSiteSettings();
    if (!settings) return;

    // 0. Company Name & Tagline
    if (settings.companyName) {
      document.querySelectorAll('[data-bind="companyName"]').forEach(el => {
        el.innerText = settings.companyName;
      });
    }
    if (settings.tagline) {
      document.querySelectorAll('[data-bind="tagline"]').forEach(el => {
        el.innerText = settings.tagline;
      });
    }

    // 1. Phone numbers
    if (settings.phone) {
      document.querySelectorAll('[data-bind="phone"]').forEach(el => {
        el.innerText = settings.phone;
      });
      document.querySelectorAll('[data-bind-href="phone"]').forEach(el => {
        el.href = `tel:${settings.phone.replace(/[^0-9]/g, '')}`;
      });
    }

    if (settings.phone2) {
      document.querySelectorAll('[data-bind="phone2"]').forEach(el => {
        el.innerText = settings.phone2;
      });
      document.querySelectorAll('[data-bind-href="phone2"]').forEach(el => {
        el.href = `tel:${settings.phone2.replace(/[^0-9]/g, '')}`;
      });
    }

    // 2. LINE
    if (settings.line) {
      document.querySelectorAll('[data-bind="line"]').forEach(el => {
        el.innerText = el.innerText.includes('Line:') ? `Line: ${settings.line}` : `${settings.line} (มี @ ข้างหน้า)`;
      });
      document.querySelectorAll('[data-bind-href="line"]').forEach(el => {
        const lineId = settings.line.replace('@', '');
        el.href = `https://line.me/ti/p/~${lineId}`;
      });
    }

    // 3. Address & Email
    if (settings.address) {
      document.querySelectorAll('[data-bind="address"]').forEach(el => {
        el.innerText = settings.address;
      });
    }
    if (settings.email) {
      document.querySelectorAll('[data-bind="email"]').forEach(el => {
        el.innerText = settings.email;
      });
    }

    // 4. Hero Section, Stats & Services Section Bindings
    const dynamicKeys = [
      'heroBadge', 'heroTitle1', 'heroTitle2', 'heroTitle3', 'heroDesc',
      'heroImgTitle', 'heroImgSub', 'heroImgBadge',
      'stat1Num', 'stat1Text', 'stat2Num', 'stat2Text', 'stat3Num', 'stat3Text', 'stat4Num', 'stat4Text',
      'servicesTitle', 'servicesSubtitle',
      'svc1Title', 'svc1Desc', 'svc2Title', 'svc2Desc', 'svc3Title', 'svc3Desc',
      'svc4Title', 'svc4Desc', 'svc5Title', 'svc5Desc', 'svc6Title', 'svc6Desc'
    ];
    dynamicKeys.forEach(k => {
      if (settings[k] !== undefined) {
        document.querySelectorAll(`[data-bind="${k}"]`).forEach(el => {
          el.innerText = settings[k];
        });
      }
    });

    if (settings.heroImg) {
      document.querySelectorAll('[data-bind-src="heroImg"]').forEach(el => {
        el.src = settings.heroImg;
      });
    }

    // 5. Calculator rates
    if (settings.rateBuild) {
      const btn = document.querySelector('.calc-btn[data-type="build"]');
      if (btn) btn.setAttribute('data-rate', settings.rateBuild);
    }
    if (settings.rateRenovate) {
      const btn = document.querySelector('.calc-btn[data-type="renovate"]');
      if (btn) btn.setAttribute('data-rate', settings.rateRenovate);
    }
    if (settings.rateInterior) {
      const btn = document.querySelector('.calc-btn[data-type="interior"]');
      if (btn) btn.setAttribute('data-rate', settings.rateInterior);
    }
    if (settings.rateExtension) {
      const btn = document.querySelector('.calc-btn[data-type="extension"]');
      if (btn) btn.setAttribute('data-rate', settings.rateExtension);
    }

    // Recalculate if active button rate changed
    const activeCalc = document.querySelector('.calc-btn.active');
    if (activeCalc) {
      currentRate = parseFloat(activeCalc.getAttribute('data-rate')) || currentRate;
      calculateEstimate();
    }

    // Dynamic services cards rendering
    await renderDynamicServices();
  } catch (err) {
    console.warn("Could not load dynamic site settings:", err);
  }
}

/**
 * 4.3 Dynamic Services Cards Rendering
 */
async function renderDynamicServices() {
  const container = document.getElementById('services-grid');
  if (!container || typeof getServicesList !== 'function') return;

  try {
    const list = await getServicesList();
    if (!list || !Array.isArray(list) || list.length === 0) return;

    container.innerHTML = list.map((svc, index) => {
      const numStr = String(index + 1).padStart(2, '0');
      const iconClass = svc.icon || 'fa-solid fa-hammer';
      const title = svc.title || 'บริการ';
      const desc = svc.desc || '';
      const point1 = svc.point1 ? `
        <li class="flex items-center gap-2">
          <span class="w-4 h-4 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-[9px] shrink-0 font-bold"><i class="fa-solid fa-check"></i></span>
          <span>${svc.point1}</span>
        </li>` : '';
      const point2 = svc.point2 ? `
        <li class="flex items-center gap-2">
          <span class="w-4 h-4 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-[9px] shrink-0 font-bold"><i class="fa-solid fa-check"></i></span>
          <span>${svc.point2}</span>
        </li>` : '';

      const pointsHtml = (point1 || point2) ? `
        <ul class="text-[11px] text-zinc-700 space-y-2 pt-3 border-t border-zinc-100">
          ${point1}
          ${point2}
        </ul>` : '';

      let actionBtn = '';
      if (svc.modalKey) {
        actionBtn = `
          <button onclick="openServiceDetail('${svc.modalKey}')" class="mt-6 pt-3.5 border-t border-zinc-100 text-xs text-zinc-800 hover:text-zinc-900 font-semibold flex items-center justify-between group/btn cursor-pointer w-full text-left">
            <span>${svc.actionText || 'ดูขอบเขตงานและมาตรฐาน'}</span> <i class="fa-solid fa-arrow-right text-[10px] text-zinc-400 group-hover/btn:text-zinc-900 group-hover/btn:translate-x-1 transition-all"></i>
          </button>`;
      } else {
        const link = svc.actionLink || '#contact';
        actionBtn = `
          <a href="${link}" class="mt-6 pt-3.5 border-t border-zinc-100 text-xs text-zinc-900 font-bold flex items-center justify-between group/btn cursor-pointer">
            <span>${svc.actionText || 'นัดหมายสำรวจหน้างานฟรี'}</span> <i class="fa-solid fa-arrow-right text-[10px] text-zinc-900 group-hover/btn:translate-x-1 transition-all"></i>
          </a>`;
      }

      return `
        <div class="p-6 rounded-2xl bg-white border border-zinc-200/90 hover:border-zinc-900/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-zinc-900 before:opacity-0 group-hover:before:opacity-100 before:transition-opacity">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-xl bg-zinc-900 text-amber-400 flex items-center justify-center text-lg shadow-sm group-hover:bg-zinc-800 group-hover:scale-105 transition-all">
                <i class="${iconClass}"></i>
              </div>
              <span class="font-mono text-xs font-bold text-zinc-300 group-hover:text-zinc-900 transition-colors">${numStr}</span>
            </div>
            <h3 class="font-bold text-zinc-900 text-base mb-2">${title}</h3>
            <p class="text-xs text-zinc-500 leading-relaxed font-light mb-4">${desc}</p>
            ${pointsHtml}
          </div>
          ${actionBtn}
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error("Failed to render dynamic services:", err);
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  setupPortfolioFilters();
  loadDynamicPortfolio();
  loadDynamicSiteSettings();
  renderDynamicServices();
  loadHomeReviews();
});

