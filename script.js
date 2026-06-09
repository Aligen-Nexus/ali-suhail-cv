// ======== عناصر DOM الرئيسية ========
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const contactForm = document.getElementById('contactForm');
const typingElement = document.getElementById('typingText');
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

// ======== نظام الجزيئات ========
let particlesArray = [];
let mouse = { x: null, y: null };

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

setCanvasSize();
window.addEventListener('resize', () => { setCanvasSize(); initParticles(); });
window.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; });
window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        const colors = ['rgba(212, 175, 55,', 'rgba(0, 212, 255,', 'rgba(191, 0, 255,', 'rgba(255, 255, 255,'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.8 + 0.2;
    }
    update() {
        this.x += this.speedX; this.y += this.speedY;
        if (mouse.x !== null && mouse.y !== null) {
            const dx = this.x - mouse.x; const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 120) { const force = (120 - distance) / 120; this.x += dx * force * 0.05; this.y += dy * force * 0.05; }
        }
        if (this.x > canvas.width + 10) this.x = -10; if (this.x < -10) this.x = canvas.width + 10;
        if (this.y > canvas.height + 10) this.y = -10; if (this.y < -10) this.y = canvas.height + 10;
    }
    draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fillStyle = `${this.color} ${this.opacity})`; ctx.fill(); }
}

function initParticles() {
    particlesArray = [];
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 50 : Math.min((canvas.width * canvas.height) / 8000, 150);
    for (let i = 0; i < count; i++) { particlesArray.push(new Particle()); }
}

function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
            const dx = particlesArray[a].x - particlesArray[b].x; const dy = particlesArray[a].y - particlesArray[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 130) { const opacity = (130 - distance) / 130 * 0.15; ctx.strokeStyle = `rgba(212, 175, 55, ${opacity})`; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(particlesArray[a].x, particlesArray[a].y); ctx.lineTo(particlesArray[b].x, particlesArray[b].y); ctx.stroke(); }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// ======== تأثير الكتابة ========
const titles = ['مدير مالي محترف', 'مطور ويب Full-Stack', 'مستشار رقمي متخصص', 'خبير التحول الرقمي', 'مبتكر تقني'];
let titleIndex = 0, charIndex = 0, isDeleting = false, typeSpeed = 100;

function typeWriter() {
    const current = titles[titleIndex];
    if (isDeleting) { typingElement.textContent = current.substring(0, charIndex - 1); charIndex--; typeSpeed = 50; } 
    else { typingElement.textContent = current.substring(0, charIndex + 1); charIndex++; typeSpeed = 100; }
    if (!isDeleting && charIndex === current.length) { typeSpeed = 2000; isDeleting = true; }
    else if (isDeleting && charIndex === 0) { isDeleting = false; titleIndex = (titleIndex + 1) % titles.length; typeSpeed = 500; }
    setTimeout(typeWriter, typeSpeed);
}
typeWriter();

// ======== شريط التنقل ========
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
    updateActiveNavLink();
});

hamburger.addEventListener('click', () => { hamburger.classList.toggle('active'); navMenu.classList.toggle('active'); });
navLinks.forEach(link => { link.addEventListener('click', () => { hamburger.classList.remove('active'); navMenu.classList.remove('active'); }); });
document.addEventListener('click', (e) => { if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) { hamburger.classList.remove('active'); navMenu.classList.remove('active'); } });

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 150;
    sections.forEach(section => {
        const top = section.offsetTop; const height = section.offsetHeight; const id = section.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + height) { navLinks.forEach(link => { link.classList.toggle('active', link.getAttribute('href') === `#${id}`); }); }
    });
}

scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ======== حركات الظهور عند التمرير ========
const fadeObserver = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); }); }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// ======== عداد الإحصائيات ========
const statCards = document.querySelectorAll('.stat-card[data-count]');
let countersAnimated = false;
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
            countersAnimated = true;
            statCards.forEach(card => {
                const target = parseInt(card.dataset.count); const numEl = card.querySelector('.stat-number');
                let current = 0; const increment = target / 60;
                const counter = setInterval(() => { current += increment; if (current >= target) { numEl.textContent = target + '+'; clearInterval(counter); } else { numEl.textContent = Math.floor(current); } }, 33);
            });
        }
    });
}, { threshold: 0.5 });
statCards.forEach(card => counterObserver.observe(card));

// ======== أشرطة المهارات المتحركة ========
const skillItems = document.querySelectorAll('.skill-item[data-skill]');
let skillsAnimated = false;
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !skillsAnimated) {
            skillsAnimated = true;
            skillItems.forEach(item => { const level = item.dataset.skill; const fill = item.querySelector('.progress-fill'); setTimeout(() => { fill.style.width = level + '%'; }, 200); });
        }
    });
}, { threshold: 0.3 });
skillItems.forEach(item => skillObserver.observe(item.closest('.skill-category')));

// ==========================================
// إعدادات الأمان والبيانات - لوحة الإدارة
// ==========================================
let adminPasswordStored = localStorage.getItem("adminPassword") || "991278";
const ADMIN_PASSWORD = 'aligen2024';
let isAuthenticated = sessionStorage.getItem('aligen_auth') === 'true';
let uploadedImage = "";




// عناصر DOM الخاصة بالإدارة
const adminBackdrop = document.getElementById('adminBackdrop');
const loginModal = document.getElementById('adminLoginModal');
const loginCloseBtn = document.getElementById('loginCloseBtn');
const loginForm = document.getElementById('adminLoginForm');
const passwordInput = document.getElementById('adminPassword');
const loginError = document.getElementById('loginError');
const adminPanel = document.getElementById('adminPanel');
const closePanelBtn = document.getElementById('closePanelBtn');
const togglePanelBtn = document.getElementById('togglePanelBtn');
const openAdminBtn = document.getElementById('openAdminBtn');
const logoutBtn = document.getElementById('logoutAdminBtn');
const projectForm = document.getElementById('projectForm');
const editingIdInput = document.getElementById('editingProjectId');
const formSectionTitle = document.getElementById('formSectionTitle');
const submitProjectBtn = document.getElementById('submitProjectBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const projectsListContainer = document.getElementById('projectsListContainer');
const searchInput = document.getElementById('searchProjects');
const adminFilterTabs = document.querySelectorAll('.filter-tab');
const exportBtn = document.getElementById('exportDataBtn');
const importBtn = document.getElementById('importDataBtn');
const importFileInput = document.getElementById('importFileInput');
const totalProjectsEl = document.getElementById('totalProjectsCount');
const totalViewsEl = document.getElementById('totalViewsCount');
const activeProjectsEl = document.getElementById('activeProjectsCount');
const hiddenProjectsEl = document.getElementById('hiddenProjectsCount');

let projects = JSON.parse(localStorage.getItem('aligen_projects')) || getDefaultProjects();
let currentAdminFilter = 'all';

// البيانات الافتراضية
function getDefaultProjects() {
    return [
        { id: 'p1', title: 'منصة تجارة إلكترونية متكاملة', category: 'development', icon: 'fa-shopping-cart', description: 'متجر إلكتروني احترافي مع لوحة تحكم متقدمة وإدارة مخزون ذكية.', rating: 5, views: 1250, link: '#', image: '', visible: true },
        { id: 'p2', title: 'نظام روبوت محادثة ذكي', category: 'ai', icon: 'fa-robot', description: 'Chatbot متقدم بالذكاء الاصطناعي لخدمة العملاء على مدار الساعة.', rating: 4.5, views: 980, link: '#', image: '', visible: true },
        { id: 'p3', title: 'هوية بصرية شاملة لمؤسسة', category: 'design', icon: 'fa-palette', description: 'تصميم هوية بصرية كاملة تشمل الشعار والأدوات التسويقية.', rating: 4, views: 756, link: '#', image: '', visible: true },
        { id: 'p4', title: 'نظام محاسبة وإدارة مالي', category: 'development', icon: 'fa-calculator', description: 'نظام محاسبي سحابي متكامل مع تقارير مالية آلية ولوحة تحكم تفاعلية.', rating: 5, views: 1520, link: '#', image: '', visible: true },
        { id: 'p5', title: 'منصة تحليل بيانات ذكية', category: 'ai', icon: 'fa-chart-line', description: 'أداة تحليل بيانات متقدمة باستخدام الذكاء الاصطناعي لاتخاذ قرارات استراتيجية.', rating: 4.5, views: 890, link: '#', image: '', visible: true },
        { id: 'p6', title: 'تصميم واجهة تطبيق جوال', category: 'design', icon: 'fa-mobile-alt', description: 'تصميم UI/UX احترافي لتطبيق جوال في مجال الخدمات المالية والتسوق.', rating: 5, views: 1100, link: '#', image: '', visible: true }
    ];
}

// دوال مساعدة
function saveProjects() { localStorage.setItem('aligen_projects', JSON.stringify(projects)); updateAdminStats(); renderPortfolioOnMainPage(); applyPortfolioFilter(); }
function generateId() { return 'p' + Date.now() + Math.random().toString(36).substr(2, 5); }
// function getCategoryBadgeClass(cat) { const map = { development: 'badge-dev', design: 'badge-design', ai: 'badge-ai', mobile: 'badge-mobile', marketing: 'badge-marketing', other: 'badge-other' }; return map[cat] || 'badge-other'; }
// function getCategoryLabel(cat) { const map = { development: 'تطوير ويب', design: 'تصميم', ai: 'ذكاء اصطناعي', mobile: 'تطبيقات جوال', marketing: 'تسويق رقمي', other: 'أخرى' }; return map[cat] || cat; }

function getCategoryBadgeClass(cat) { 
    const map = { development: 'badge-dev', design: 'badge-design', ai: 'badge-ai', mobile: 'badge-mobile', marketing: 'badge-marketing', other: 'badge-other' };
    return map[cat] || 'badge-custom'; // إذا كان تصنيفاً جديداً سيعطيه كلاس custom
}

function getCategoryLabel(cat) { 
    const found = customCategories.find(c => c.key === cat);
    return found ? found.label : cat; // يبحث عن الاسم العربي، وإذا لم يجده يطبع المفتاح
}

let customCategories = JSON.parse(localStorage.getItem('aligen_categories')) || [
    { key: 'development', label: 'تطوير ويب' },
    { key: 'design', label: 'تصميم UI/UX' },
    { key: 'ai', label: 'ذكاء اصطناعي' },
    { key: 'mobile', label: 'تطبيقات جوال' },
    { key: 'marketing', label: 'تسويق رقمي' },
    { key: 'other', label: 'أخرى' }
];
function saveCategories() { localStorage.setItem('aligen_categories', JSON.stringify(customCategories)); }

function getStarsHTML(rating) { let s = ''; for (let i = 1; i <= 5; i++) { if (i <= Math.floor(rating)) s += '<i class="fas fa-star"></i>'; else if (i - 0.5 <= rating) s += '<i class="fas fa-star-half-stroke"></i>'; else s += '<i class="far fa-star" style="color:#555"></i>'; } return s; }

// تحديث إحصائيات لوحة الإدارة
function updateAdminStats() {
    const total = projects.length; const visible = projects.filter(p => p.visible).length; const hidden = total - visible;
    const views = projects.reduce((sum, p) => sum + (p.views || 0), 0);
    animateAdminNumber(totalProjectsEl, total); animateAdminNumber(totalViewsEl, views); animateAdminNumber(activeProjectsEl, visible); animateAdminNumber(hiddenProjectsEl, hidden);
}
function animateAdminNumber(el, target) { const current = parseInt(el.textContent) || 0; if (current === target) return; let start = current; const duration = 400; const startTime = performance.now(); function tick(now) { const elapsed = now - startTime; const progress = Math.min(elapsed / duration, 1); el.textContent = Math.floor(start + (target - start) * progress); if (progress < 1) requestAnimationFrame(tick); } requestAnimationFrame(tick); }

// عرض قائمة المشاريع في لوحة الإدارة
function renderAdminProjectsList(filter, search) {
    let filtered = [...projects];
    if (filter === 'visible') filtered = filtered.filter(p => p.visible);
    else if (filter === 'hidden') filtered = filtered.filter(p => !p.visible);
    if (search) { const s = search.toLowerCase(); filtered = filtered.filter(p => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s)); }
    if (filtered.length === 0) { projectsListContainer.innerHTML = '<div class="empty-state"><i class="fas ' + (search ? 'fa-search' : 'fa-inbox') + '"></i><p>' + (search ? 'لا توجد نتائج' : 'لا توجد مشاريع') + '</p><small>' + (search ? 'جرب كلمات بحث أخرى' : 'ابدأ بإضافة مشروعك الأول!') + '</small></div>'; return; }
    let html = '';
    filtered.forEach(proj => {
        const isHidden = !proj.visible;
        html += '<div class="project-item ' + (isHidden ? 'hidden-project' : '') + '" data-id="' + proj.id + '">';
        html += proj.image ? '<img src="' + proj.image + '" alt="" class="proj-img" onerror="this.style.display=\'none\';">' : '<div class="proj-icon"><i class="fas ' + proj.icon + '"></i></div>';
        html += '<div class="proj-details"><div class="proj-title">' + proj.title + (isHidden ? ' <span class="proj-badge badge-hidden">مخفي</span>' : '') + '</div>';
        html += '<div class="proj-meta"><span class="proj-badge ' + getCategoryBadgeClass(proj.category) + '">' + getCategoryLabel(proj.category) + '</span><span style="font-size:11px">' + getStarsHTML(proj.rating) + '</span><span style="font-size:11px"><i class="fas fa-eye" style="margin-left:3px"></i>' + proj.views + '</span></div></div>';
        
        
        html += '<div class="proj-actions"><button class="action-btn edit" onclick="editProject(\'' + proj.id + '\')" title="تعديل"><i class="fas fa-edit"></i></button><button class="action-btn toggle-vis" onclick="toggleVisibility(\'' + proj.id + '\')" title="' + (isHidden ? 'إظهار' : 'إخفاء') + '"><i class="fas ' + (isHidden ? 'fa-eye' : 'fa-eye-slash') + '"></i></button><button class="action-btn delete" onclick="deleteProject(\'' + proj.id + '\')" title="حذف"><i class="fas fa-trash"></i></button></div></div>';
    });
    projectsListContainer.innerHTML = html;
}

// عرض المعرض على الصفحة الرئيسية (هذا هو المسؤول عن إظهار الأعمال والنصوص)
function renderPortfolioOnMainPage() {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;
    const visible = projects.filter(p => p.visible);
    grid.innerHTML = '';
    visible.forEach(proj => {
        const card = document.createElement('div');
        card.className = 'glass project-card';
        card.dataset.category = proj.category;
        card.innerHTML = '<div class="project-thumbnail">' + (proj.image ? '<img src="' + proj.image + '" class="project-image" style="width:100%;height:100%;object-fit:cover;">' : '<div class="project-icon"><i class="fas ' + proj.icon + '"></i></div>') + '<div class="project-overlay"><a href="' + (proj.link || '#') + '" class="view-details-btn">عرض التفاصيل</a></div></div><div class="project-info"><span class="project-category-badge ' + getCategoryBadgeClass(proj.category) + '">' + getCategoryLabel(proj.category) + '</span><h3 class="project-title">' + proj.title + '</h3><p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.7;">' + proj.description + '</p><div class="project-meta"><div class="star-rating">' + getStarsHTML(proj.rating) + '</div><div class="view-count"><i class="fas fa-eye"></i> <span>' + proj.views.toLocaleString() + ' مشاهدة</span></div></div></div>';
        grid.appendChild(card);
    });
}

// فلتر المعرض الرئيسي
function applyPortfolioFilter() {
    const activeBtn = document.querySelector('.filter-btn.active');
    const filterValue = activeBtn ? activeBtn.dataset.filter : 'all';
    document.querySelectorAll('#portfolioGrid .project-card').forEach(card => {
        if (filterValue === 'all' || card.dataset.category === filterValue) { card.classList.remove('hidden'); card.style.animation = 'fadeInUp 0.5s ease forwards'; } else { card.classList.add('hidden'); }
    });
}
document.querySelectorAll('.filter-btn').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); applyPortfolioFilter(); }); });

// عمليات المشاريع
projectForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const projData = { id: editingIdInput.value || generateId(), title: document.getElementById('projTitle').value.trim(), category: document.getElementById('projCategory').value, icon: document.getElementById('projIcon').value.trim() || 'fa-code', description: document.getElementById('projDescription').value.trim(), rating: parseFloat(document.getElementById('projRating').value) || 5, views: parseInt(document.getElementById('projViews').value) || 0, link: document.getElementById('projLink').value.trim() || '#', image: document.getElementById('projImage').value.trim() || uploadedImage, visible: document.getElementById('projVisible').checked };
    if (editingIdInput.value) { const idx = projects.findIndex(p => p.id === editingIdInput.value); if (idx !== -1) { projects[idx] = { ...projects[idx], ...projData }; showNotification('تم تعديل المشروع بنجاح', 'success'); } resetProjectForm(); } else { projects.push(projData); showNotification('تمت إضافة المشروع بنجاح', 'success'); projectForm.reset(); document.getElementById('projIcon').value = 'fa-code'; document.getElementById('projVisible').checked = true; uploadedImage = ""; document.getElementById('imagePreview').style.display = 'none'; }
    saveProjects(); renderAdminProjectsList(currentAdminFilter, searchInput.value);
});

window.editProject = function(id) {
    const proj = projects.find(p => p.id === id); if (!proj) return;
    editingIdInput.value = id; document.getElementById('projTitle').value = proj.title; document.getElementById('projCategory').value = proj.category; document.getElementById('projIcon').value = proj.icon; document.getElementById('projDescription').value = proj.description; document.getElementById('projRating').value = proj.rating; document.getElementById('projViews').value = proj.views; document.getElementById('projLink').value = proj.link; document.getElementById('projImage').value = proj.image || ''; document.getElementById('projVisible').checked = proj.visible;
    formSectionTitle.innerHTML = '<i class="fas fa-edit"></i> <span>تعديل المشروع</span>'; submitProjectBtn.innerHTML = '<i class="fas fa-save"></i><span>حفظ التعديلات</span>'; cancelEditBtn.style.display = 'inline-flex';
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
};
cancelEditBtn.addEventListener('click', resetProjectForm);
function resetProjectForm() { editingIdInput.value = ''; projectForm.reset(); document.getElementById('projIcon').value = 'fa-code'; document.getElementById('projVisible').checked = true; formSectionTitle.innerHTML = '<i class="fas fa-plus-circle"></i> <span>إضافة مشروع جديد</span>'; submitProjectBtn.innerHTML = '<i class="fas fa-plus"></i><span>إضافة المشروع</span>'; cancelEditBtn.style.display = 'none'; uploadedImage = ""; document.getElementById('imagePreview').style.display = 'none'; }

window.toggleVisibility = function(id) { const idx = projects.findIndex(p => p.id === id); if (idx !== -1) { projects[idx].visible = !projects[idx].visible; saveProjects(); renderAdminProjectsList(currentAdminFilter, searchInput.value); showNotification(projects[idx].visible ? 'تم إظهار المشروع' : 'تم إخفاء المشروع', 'info'); } };
window.deleteProject = function(id) { const proj = projects.find(p => p.id === id); if (!proj) return; if (confirm('هل أنت متأكد من حذف "' + proj.title + '"؟\n\nهذا الإجراء لا يمكن التراجع عنه!')) { projects = projects.filter(p => p.id !== id); saveProjects(); renderAdminProjectsList(currentAdminFilter, searchInput.value); showNotification('تم حذف المشروع', 'danger'); if (editingIdInput.value === id) resetProjectForm(); } };

// البحث والفلترة
searchInput.addEventListener('input', () => { renderAdminProjectsList(currentAdminFilter, searchInput.value); });
adminFilterTabs.forEach(tab => { tab.addEventListener('click', () => { adminFilterTabs.forEach(t => t.classList.remove('active')); tab.classList.add('active'); currentAdminFilter = tab.dataset.filter; renderAdminProjectsList(currentAdminFilter, searchInput.value); }); });

// التصدير والاستيراد
exportBtn.addEventListener('click', () => { const blob = new Blob([JSON.stringify(projects, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'aligen_backup_' + new Date().toISOString().split('T')[0] + '.json'; a.click(); URL.revokeObjectURL(url); showNotification('تم تصدير البيانات بنجاح', 'success'); });
importBtn.addEventListener('click', () => importFileInput.click());
importFileInput.addEventListener('change', (e) => { const file = e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = (event) => { try { const imported = JSON.parse(event.target.result); if (Array.isArray(imported) && imported.length > 0) { if (confirm('سيتم استبدال ' + projects.length + ' مشروع بـ ' + imported.length + ' مشروع. متابعة؟')) { projects = imported; saveProjects(); renderAdminProjectsList(currentAdminFilter); showNotification('تم استيراد البيانات بنجاح', 'success'); } } else { throw new Error('Invalid'); } } catch (err) { showNotification('ملف غير صالح! تأكد أنه JSON صحيح', 'danger'); } }; reader.readAsText(file); importFileInput.value = ''; });

// نظام الإشعارات
function showNotification(message, type) { const existing = document.querySelector('.admin-notification'); if (existing) existing.remove(); const colors = { success: '#00c853', danger: '#ff4444', warning: '#ffbb33', info: '#33b5e5' }; const icons = { success: 'fa-check-circle', danger: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' }; const notif = document.createElement('div'); notif.className = 'admin-notification'; notif.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%) translateY(-100px);background:' + (colors[type] || colors.info) + ';color:white;padding:14px 28px;border-radius:10px;font-family:Tajawal,sans-serif;font-size:14px;font-weight:600;z-index:99999;box-shadow:0 10px 40px rgba(0,0,0,0.4);transition:transform 0.4s cubic-bezier(0.68,-0.55,0.265,1.55);display:flex;align-items:center;gap:10px;'; notif.innerHTML = '<i class="fas ' + (icons[type] || icons.info) + '"></i> ' + message; document.body.appendChild(notif); requestAnimationFrame(() => { notif.style.transform = 'translateX(-50%) translateY(0)'; }); setTimeout(() => { notif.style.transform = 'translateX(-50%) translateY(-100px)'; setTimeout(() => notif.remove(), 400); }, 3000); }

// التحكم في فتح/إغلاق اللوحة
function openLogin() { adminBackdrop.classList.add('active'); loginModal.classList.add('active'); passwordInput.focus(); }
function closeLogin() { adminBackdrop.classList.remove('active'); loginModal.classList.remove('active'); loginError.classList.remove('show'); loginError.style.display = 'none'; passwordInput.value = ''; }
function openPanel() { adminBackdrop.classList.add('active'); adminPanel.classList.add('open'); adminPanel.classList.remove('collapsed'); openAdminBtn.style.display = 'none'; updateAdminStats(); renderAdminProjectsList(currentAdminFilter); }
function closePanel() { adminBackdrop.classList.remove('active'); adminPanel.classList.remove('open'); adminPanel.classList.remove('collapsed'); openAdminBtn.style.display = 'flex'; resetProjectForm(); }
function logout() { isAuthenticated = false; sessionStorage.removeItem('aligen_auth'); closePanel(); openAdminBtn.innerHTML = '<i class="fas fa-cog"></i>'; showNotification('تم تسجيل الخروج', 'info'); }

// ربط الأحداث
openAdminBtn.addEventListener('click', () => { if (isAuthenticated) openPanel(); else openLogin(); });
closePanelBtn.addEventListener('click', closePanel); loginCloseBtn.addEventListener('click', closeLogin); logoutBtn.addEventListener('click', logout);
togglePanelBtn.addEventListener('click', () => { adminPanel.classList.toggle('collapsed'); });
adminBackdrop.addEventListener('click', (e) => { if (e.target === adminBackdrop) { if (loginModal.classList.contains('active')) closeLogin(); else if (adminPanel.classList.contains('open')) closePanel(); } });

// تسجيل الدخول
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (passwordInput.value === adminPasswordStored) { isAuthenticated = true; sessionStorage.setItem('aligen_auth', 'true'); closeLogin(); openPanel(); openAdminBtn.innerHTML = '<i class="fas fa-user-shield"></i>'; showNotification('مرحباً! تم تسجيل الدخول بنجاح', 'success'); }
    else { loginError.style.display = 'flex'; loginError.classList.add('show'); passwordInput.value = ''; passwordInput.focus(); loginError.style.animation = 'none'; void loginError.offsetWidth; loginError.style.animation = 'shake 0.5s ease'; }
});

// إغلاق بـ Escape
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (loginModal.classList.contains('active')) closeLogin(); else if (adminPanel.classList.contains('open')) closePanel(); } });

// تبديل وضع الصورة
function switchImageMode(mode) {
    const uploadSection = document.getElementById("uploadSection"); const urlSection = document.getElementById("urlSection");
    const uploadBtn = document.getElementById("uploadModeBtn"); const urlBtn = document.getElementById("urlModeBtn");
    if(mode === "upload"){ uploadSection.style.display = "block"; urlSection.style.display = "none"; uploadBtn.classList.add("active"); urlBtn.classList.remove("active"); }
    else { uploadSection.style.display = "none"; urlSection.style.display = "block"; urlBtn.classList.add("active"); uploadBtn.classList.remove("active"); }
}

// رفع الصورة
document.getElementById("projectImageUpload").addEventListener("change", function(e){
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = function(event){ uploadedImage = event.target.result; const preview = document.getElementById("imagePreview"); preview.src = uploadedImage; preview.style.display = "block"; };
    reader.readAsDataURL(file);
});

// تغيير كلمة السر
function changeAdminPassword() {
    const current = document.getElementById("currentPassword").value; const newPass = document.getElementById("newPassword").value;
    const confirm = document.getElementById("confirmPassword").value; const msg = document.getElementById("passwordMessage");
    if(current !== adminPasswordStored){ msg.innerHTML = "❌ كلمة السر الحالية غير صحيحة"; msg.style.color = "#ff4d4d"; return; }
    if(newPass.length < 6){ msg.innerHTML = "⚠ كلمة السر يجب أن تكون 6 أحرف على الأقل"; msg.style.color = "#ffaa00"; return; }
    if(newPass !== confirm){ msg.innerHTML = "⚠ كلمة السر الجديدة غير متطابقة"; msg.style.color = "#ffaa00"; return; }
    adminPasswordStored = newPass; localStorage.setItem("adminPassword", newPass);
    msg.innerHTML = "✅ تم تغيير كلمة السر بنجاح"; msg.style.color = "#00ff99";
    document.getElementById("currentPassword").value = ""; document.getElementById("newPassword").value = ""; document.getElementById("confirmPassword").value = "";
}

//a فتح رابط المشروع
/* function openProjectLink() { const link = document.getElementById("projLink").value; if(link) { window.open(link, "_blank"); } else { alert("يرجى إدخال رابط"); } } 
*/

function openProjectLink() { 
    const link = document.getElementById("projLink").value; 
    if(link) { 
        window.open(link, "_blank"); 
    } else { 
        showNotification("يرجى إدخال رابط أولاً", "warning"); // إشعار أنيق أصفر
    } 
}
// التهيئة عند تحميل الصفحة
/* document.addEventListener('DOMContentLoaded', () => {
    if (isAuthenticated) { openAdminBtn.innerHTML = '<i class="fas fa-user-shield"></i>'; }
    renderPortfolioOnMainPage();
    applyPortfolioFilter();
    document.body.classList.add('loaded');
}); */

//a التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    if (isAuthenticated) { openAdminBtn.innerHTML = '<i class="fas fa-user-shield"></i>'; }
    
    // تهيئة النظام الديناميكي للتصنيفات والمشاريع
    populateAdminCategoryDropdown(); // ملء القائمة المنسدلة في لوحة الإدارة
    renderFiltersOnMainPage();       // توليد أزرار الفلترة في الصفحة الرئيسية تلقائياً
    renderPortfolioOnMainPage();     // عرض المشاريع
    applyPortfolioFilter();          // تطبيق الفلتر
    
    document.body.classList.add('loaded');
});


//a توليد أزرار الفلترة ديناميكياً بناءً على المشاريع الموجودة
function renderFiltersOnMainPage() {
    const filterContainer = document.querySelector('.filter-container');
    if (!filterContainer) return;

    // جمع التصنيفات المستخدمة في المشاريع المرئية فقط
    const usedCategories = [...new Set(projects.filter(p => p.visible).map(p => p.category))];

    let html = '<button class="filter-btn active" data-filter="all"><span>الكل</span></button>';
    usedCategories.forEach(catKey => {
        const label = getCategoryLabel(catKey);
        html += `<button class="filter-btn" data-filter="${catKey}"><span>${label}</span></button>`;
    });

    filterContainer.innerHTML = html;

    // إعادة ربط حدث النقر بالأزرار الجديدة
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyPortfolioFilter();
        });
    });
}

//a ملء القائمة المنسدلة في لوحة الإدارة
function populateAdminCategoryDropdown() {
    const select = document.getElementById('projCategory');
    let html = '<option value="">اختر التصنيف...</option>';
    customCategories.forEach(cat => {
        html += `<option value="${cat.key}">${cat.label}</option>`;
    });
    select.innerHTML = html;
}

// إظهار/إخفاء خانة إضافة تصنيف جديد
function toggleAddCategoryForm() {
    const box = document.getElementById('addCategoryBox');
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
}

// إضافة التصنيف الجديد وحفظه
function addNewCategory() {
    const keyInput = document.getElementById('newCatKey');
    const labelInput = document.getElementById('newCatLabel');
    const key = keyInput.value.trim().toLowerCase().replace(/\s+/g, '-');
    const label = labelInput.value.trim();

    if (!key || !label) { showNotification('يرجى ملء المفتاح والاسم العربي', 'warning'); return; }
    if (customCategories.find(c => c.key === key)) { showNotification('هذا المفتاح موجود مسبقاً', 'warning'); return; }

    customCategories.push({ key, label });
    saveCategories();
    populateAdminCategoryDropdown(); // تحديث القائمة المنسدلة
    
    // اختيار التصنيف الجديد تلقائياً
    keyInput.value = ''; labelInput.value = '';
    document.getElementById('projCategory').value = key;
    document.getElementById('addCategoryBox').style.display = 'none';
    showNotification('تم إضافة التصنيف بنجاح', 'success');
}


