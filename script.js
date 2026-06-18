// ======== عناصر DOM الرئيسية ========
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const typingElement = document.getElementById('typingText');
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

// ======== نظام الجزيئات ========
let particlesArray = [];
let mouse = { x: null, y: null };

function setCanvasSize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
setCanvasSize();
window.addEventListener('resize', () => { setCanvasSize(); initParticles(); });
window.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; });
window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1; this.speedX = Math.random() * 2 - 1; this.speedY = Math.random() * 2 - 1;
        const colors = ['rgba(212, 175, 55,', 'rgba(0, 212, 255,', 'rgba(191, 0, 255,', 'rgba(255, 255, 255,'];
        this.color = colors[Math.floor(Math.random() * colors.length)]; this.opacity = Math.random() * 0.8 + 0.2;
    }
    update() {
        this.x += this.speedX; this.y += this.speedY;
        if (mouse.x !== null && mouse.y !== null) {
            const dx = this.x - mouse.x; const dy = this.y - mouse.y; const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 120) { const force = (120 - distance) / 120; this.x += dx * force * 0.05; this.y += dy * force * 0.05; }
        }
        if (this.x > canvas.width + 10) this.x = -10; if (this.x < -10) this.x = canvas.width + 10;
        if (this.y > canvas.height + 10) this.y = -10; if (this.y < -10) this.y = canvas.height + 10;
    }
    draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fillStyle = `${this.color} ${this.opacity})`; ctx.fill(); }
}

function initParticles() {
    particlesArray = []; const isMobile = window.innerWidth < 768;
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

function animateParticles() { ctx.clearRect(0,0,canvas.width,canvas.height); particlesArray.forEach(p => { p.update(); p.draw(); }); connectParticles(); requestAnimationFrame(animateParticles); }
initParticles(); animateParticles();

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
    const sections = document.querySelectorAll('section[id]'); const scrollPos = window.scrollY + 150;
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

// ======== نظام الإشعارات (مشترك) ========
function showNotification(message, type) { 
    const existing = document.querySelector('.admin-notification'); if (existing) existing.remove(); 
    const colors = { success: '#00c853', danger: '#ff4444', warning: '#ffbb33', info: '#33b5e5' }; 
    const icons = { success: 'fa-check-circle', danger: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' }; 
    const notif = document.createElement('div'); notif.className = 'admin-notification'; 
    notif.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%) translateY(-100px);background:' + (colors[type] || colors.info) + ';color:white;padding:14px 28px;border-radius:10px;font-family:Tajawal,sans-serif;font-size:14px;font-weight:600;z-index:99999;box-shadow:0 10px 40px rgba(0,0,0,0.4);transition:transform 0.4s cubic-bezier(0.68,-0.55,0.265,1.55);display:flex;align-items:center;gap:10px;'; 
    notif.innerHTML = '<i class="fas ' + (icons[type] || icons.info) + '"></i> ' + message; 
    document.body.appendChild(notif); requestAnimationFrame(() => { notif.style.transform = 'translateX(-50%) translateY(0)'; }); 
    setTimeout(() => { notif.style.transform = 'translateX(-50%) translateY(-100px)'; setTimeout(() => notif.remove(), 400); }, 3000); 
}

// ==========================================
// إعدادات البيانات - لعرض المشاريع في الصفحة الرئيسية
// ==========================================
let projects = JSON.parse(localStorage.getItem('aligen_projects')) || getDefaultProjects();
let customCategories = JSON.parse(localStorage.getItem('aligen_categories')) || [
    { key: 'development', label: 'تطوير ويب' }, { key: 'design', label: 'تصميم UI/UX' },
    { key: 'ai', label: 'ذكاء اصطناعي' }, { key: 'mobile', label: 'تطبيقات جوال' },
    { key: 'marketing', label: 'تسويق رقمي' }, { key: 'other', label: 'أخرى' }
];

function getDefaultProjects() {
    return [
        { id: 'p1', title: 'Ali Suhail CV', category: 'development', icon: 'fa-shopping-cart', description: 'سيفي شخصي ', rating: 5, views: 1250, link: 'https://alisuhail.com', image: '', visible: true },
]; }
       /* { id: 'p2', title: 'نظام روبوت محادثة ذكي', category: 'ai', icon: 'fa-robot', description: 'Chatbot متقدم بالذكاء الاصطناعي لخدمة العملاء على مدار الساعة.', rating: 4.5, views: 980, link: '#', image: '', visible: true },
        { id: 'p3', title: 'هوية بصرية شاملة لمؤسسة', category: 'design', icon: 'fa-palette', description: 'تصميم هوية بصرية كاملة تشمل الشعار والأدوات التسويقية.', rating: 4, views: 756, link: '#', image: '', visible: true },
        { id: 'p4', title: 'نظام محاسبة وإدارة مالي', category: 'development', icon: 'fa-calculator', description: 'نظام محاسبي سحابي متكامل مع تقارير مالية آلية ولوحة تحكم تفاعلية.', rating: 5, views: 1520, link: '#', image: '', visible: true }
    ];
}*/

function getCategoryBadgeClass(cat) { 
    const map = { development: 'badge-dev', design: 'badge-design', ai: 'badge-ai', mobile: 'badge-mobile', marketing: 'badge-marketing', other: 'badge-other' };
    return map[cat] || 'badge-custom'; 
}
function getCategoryLabel(cat) { 
    const found = customCategories.find(c => c.key === cat);
    return found ? found.label : cat; 
}
function getStarsHTML(rating) { let s = ''; for (let i = 1; i <= 5; i++) { if (i <= Math.floor(rating)) s += '<i class="fas fa-star"></i>'; else if (i - 0.5 <= rating) s += '<i class="fas fa-star-half-stroke"></i>'; else s += '<i class="far fa-star" style="color:#555"></i>'; } return s; }

// عرض المعرض على الصفحة الرئيسية
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

function renderFiltersOnMainPage() {
    const filterContainer = document.querySelector('.filter-container');
    if (!filterContainer) return;
    const usedCategories = [...new Set(projects.filter(p => p.visible).map(p => p.category))];
    let html = '<button class="filter-btn active" data-filter="all"><span>الكل</span></button>';
    usedCategories.forEach(catKey => {
        const label = getCategoryLabel(catKey);
        html += `<button class="filter-btn" data-filter="${catKey}"><span>${label}</span></button>`;
    });
    filterContainer.innerHTML = html;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active'); applyPortfolioFilter();
        });
    });
}

// التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    renderFiltersOnMainPage();       
    renderPortfolioOnMainPage();     
    applyPortfolioFilter();          
    document.body.classList.add('loaded');
});
