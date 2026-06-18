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
const loginForm = document.getElementById('adminLoginForm');
const passwordInput = document.getElementById('adminPassword');
const loginError = document.getElementById('loginError');
const adminPanel = document.getElementById('adminPanel');
const togglePanelBtn = document.getElementById('togglePanelBtn');
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
let customCategories = JSON.parse(localStorage.getItem('aligen_categories')) || [
    { key: 'development', label: 'تطوير ويب' }, { key: 'design', label: 'تصميم UI/UX' },
    { key: 'ai', label: 'ذكاء اصطناعي' }, { key: 'mobile', label: 'تطبيقات جوال' },
    { key: 'marketing', label: 'تسويق رقمي' }, { key: 'other', label: 'أخرى' }
];
let currentAdminFilter = 'all';

function getDefaultProjects() {
    return [
        { id: 'p1', title: 'منصة تجارة إلكترونية متكاملة', category: 'development', icon: 'fa-shopping-cart', description: 'متجر إلكتروني احترافي مع لوحة تحكم متقدمة وإدارة مخزون ذكية.', rating: 5, views: 1250, link: '#', image: '', visible: true },
        { id: 'p2', title: 'نظام روبوت محادثة ذكي', category: 'ai', icon: 'fa-robot', description: 'Chatbot متقدم بالذكاء الاصطناعي لخدمة العملاء على مدار الساعة.', rating: 4.5, views: 980, link: '#', image: '', visible: true }
    ];
}

// دوال مساعدة
function saveProjects() { localStorage.setItem('aligen_projects', JSON.stringify(projects)); updateAdminStats(); }
function generateId() { return 'p' + Date.now() + Math.random().toString(36).substr(2, 5); }
function getCategoryBadgeClass(cat) { 
    const map = { development: 'badge-dev', design: 'badge-design', ai: 'badge-ai', mobile: 'badge-mobile', marketing: 'badge-marketing', other: 'badge-other' };
    return map[cat] || 'badge-custom'; 
}
function getCategoryLabel(cat) { 
    const found = customCategories.find(c => c.key === cat);
    return found ? found.label : cat; 
}
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
    if (filtered.length === 0) { projectsListContainer.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>لا توجد مشاريع</p><small>ابدأ بإضافة مشروعك الأول!</small></div>'; return; }
    let html = '';
    filtered.forEach(proj => {
        const isHidden = !proj.visible;
        html += '<div class="project-item ' + (isHidden ? 'hidden-project' : '') + '" data-id="' + proj.id + '">';
        html += proj.image ? '<img src="' + proj.image + '" alt="" class="proj-img">' : '<div class="proj-icon"><i class="fas ' + proj.icon + '"></i></div>';
        html += '<div class="proj-details"><div class="proj-title">' + proj.title + (isHidden ? ' <span class="proj-badge badge-hidden">مخفي</span>' : '') + '</div>';
        html += '<div class="proj-meta"><span class="proj-badge ' + getCategoryBadgeClass(proj.category) + '">' + getCategoryLabel(proj.category) + '</span><span>' + getStarsHTML(proj.rating) + '</span><span><i class="fas fa-eye"></i> ' + proj.views + '</span></div></div>';
        html += '<div class="proj-actions"><button class="action-btn edit" onclick="editProject(\'' + proj.id + '\')"><i class="fas fa-edit"></i></button><button class="action-btn toggle-vis" onclick="toggleVisibility(\'' + proj.id + '\')"><i class="fas ' + (isHidden ? 'fa-eye' : 'fa-eye-slash') + '"></i></button><button class="action-btn delete" onclick="deleteProject(\'' + proj.id + '\')"><i class="fas fa-trash"></i></button></div></div>';
    });
    projectsListContainer.innerHTML = html;
}

// عمليات المشاريع
projectForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const projData = { id: editingIdInput.value || generateId(), title: document.getElementById('projTitle').value.trim(), category: document.getElementById('projCategory').value, icon: document.getElementById('projIcon').value.trim() || 'fa-code', description: document.getElementById('projDescription').value.trim(), rating: parseFloat(document.getElementById('projRating').value) || 5, views: parseInt(document.getElementById('projViews').value) || 0, link: document.getElementById('projLink').value.trim() || '#', image: document.getElementById('projImage').value.trim() || uploadedImage, visible: document.getElementById('projVisible').checked };
    if (editingIdInput.value) { const idx = projects.findIndex(p => p.id === editingIdInput.value); if (idx !== -1) { projects[idx] = { ...projects[idx], ...projData }; showNotification('تم تعديل المشروع بنجاح', 'success'); } resetProjectForm(); } 
    else { projects.push(projData); showNotification('تمت إضافة المشروع بنجاح', 'success'); projectForm.reset(); document.getElementById('projIcon').value = 'fa-code'; document.getElementById('projVisible').checked = true; uploadedImage = ""; document.getElementById('imagePreview').style.display = 'none'; }
    saveProjects(); renderAdminProjectsList(currentAdminFilter, searchInput.value);
});

window.editProject = function(id) {
    const proj = projects.find(p => p.id === id); if (!proj) return;
    editingIdInput.value = id; document.getElementById('projTitle').value = proj.title; document.getElementById('projCategory').value = proj.category; document.getElementById('projIcon').value = proj.icon; document.getElementById('projDescription').value = proj.description; document.getElementById('projRating').value = proj.rating; document.getElementById('projViews').value = proj.views; document.getElementById('projLink').value = proj.link; document.getElementById('projImage').value = proj.image || ''; document.getElementById('projVisible').checked = proj.visible;
    formSectionTitle.innerHTML = '<i class="fas fa-edit"></i> <span>تعديل المشروع</span>'; submitProjectBtn.innerHTML = '<i class="fas fa-save"></i><span>حفظ التعديلات</span>'; cancelEditBtn.style.display = 'inline-flex';
};
cancelEditBtn.addEventListener('click', resetProjectForm);
function resetProjectForm() { editingIdInput.value = ''; projectForm.reset(); document.getElementById('projIcon').value = 'fa-code'; document.getElementById('projVisible').checked = true; formSectionTitle.innerHTML = '<i class="fas fa-plus-circle"></i> <span>إضافة مشروع جديد</span>'; submitProjectBtn.innerHTML = '<i class="fas fa-plus"></i><span>إضافة المشروع</span>'; cancelEditBtn.style.display = 'none'; uploadedImage = ""; document.getElementById('imagePreview').style.display = 'none'; }

window.toggleVisibility = function(id) { const idx = projects.findIndex(p => p.id === id); if (idx !== -1) { projects[idx].visible = !projects[idx].visible; saveProjects(); renderAdminProjectsList(currentAdminFilter, searchInput.value); showNotification(projects[idx].visible ? 'تم إظهار المشروع' : 'تم إخفاء المشروع', 'info'); } };
window.deleteProject = function(id) { const proj = projects.find(p => p.id === id); if (!proj) return; if (confirm('هل أنت متأكد من حذف "' + proj.title + '"؟')) { projects = projects.filter(p => p.id !== id); saveProjects(); renderAdminProjectsList(currentAdminFilter, searchInput.value); showNotification('تم حذف المشروع', 'danger'); if (editingIdInput.value === id) resetProjectForm(); } };

// البحث والفلترة
searchInput.addEventListener('input', () => { renderAdminProjectsList(currentAdminFilter, searchInput.value); });
adminFilterTabs.forEach(tab => { tab.addEventListener('click', () => { adminFilterTabs.forEach(t => t.classList.remove('active')); tab.classList.add('active'); currentAdminFilter = tab.dataset.filter; renderAdminProjectsList(currentAdminFilter, searchInput.value); }); });

// التصدير والاستيراد
exportBtn.addEventListener('click', () => { const blob = new Blob([JSON.stringify(projects, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'aligen_backup.json'; a.click(); URL.revokeObjectURL(url); showNotification('تم تصدير البيانات', 'success'); });
importBtn.addEventListener('click', () => importFileInput.click());
importFileInput.addEventListener('change', (e) => { const file = e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = (event) => { try { const imported = JSON.parse(event.target.result); if (Array.isArray(imported)) { projects = imported; saveProjects(); renderAdminProjectsList(currentAdminFilter); showNotification('تم استيراد البيانات', 'success'); } } catch (err) { showNotification('ملف غير صالح!', 'danger'); } }; reader.readAsText(file); importFileInput.value = ''; });

// نظام الإشعارات
function showNotification(message, type) { const existing = document.querySelector('.admin-notification'); if (existing) existing.remove(); const colors = { success: '#00c853', danger: '#ff4444', warning: '#ffbb33', info: '#33b5e5' }; const icons = { success: 'fa-check-circle', danger: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' }; const notif = document.createElement('div'); notif.className = 'admin-notification'; notif.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%) translateY(-100px);background:' + (colors[type] || colors.info) + ';color:white;padding:14px 28px;border-radius:10px;font-family:Tajawal,sans-serif;font-size:14px;font-weight:600;z-index:99999;box-shadow:0 10px 40px rgba(0,0,0,0.4);transition:transform 0.4s;display:flex;align-items:center;gap:10px;'; notif.innerHTML = '<i class="fas ' + (icons[type] || icons.info) + '"></i> ' + message; document.body.appendChild(notif); requestAnimationFrame(() => { notif.style.transform = 'translateX(-50%) translateY(0)'; }); setTimeout(() => { notif.style.transform = 'translateX(-50%) translateY(-100px)'; setTimeout(() => notif.remove(), 400); }, 3000); }

// التحكم في فتح/إغلاق اللوحة
function closeLogin() { loginModal.style.display = 'none'; adminBackdrop.classList.remove('active'); }

// تسجيل الدخول
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (passwordInput.value === adminPasswordStored) { isAuthenticated = true; sessionStorage.setItem('aligen_auth', 'true'); closeLogin(); adminPanel.style.display = 'flex'; showNotification('مرحباً! تم تسجيل الدخول', 'success'); }
    else { loginError.style.display = 'flex'; loginError.classList.add('show'); passwordInput.value = ''; passwordInput.focus(); loginError.style.animation = 'none'; void loginError.offsetWidth; loginError.style.animation = 'shake 0.5s ease'; }
});

togglePanelBtn.addEventListener('click', () => { adminPanel.classList.toggle('collapsed'); });

// تبديل وضع الصورة
function switchImageMode(mode) {
    const uploadSection = document.getElementById("uploadSection"); const urlSection = document.getElementById("urlSection");
    const uploadBtn = document.getElementById("uploadModeBtn"); const urlBtn = document.getElementById("urlModeBtn");
    if(mode === "upload"){ uploadSection.style.display = "block"; urlSection.style.display = "none"; uploadBtn.classList.add("active"); urlBtn.classList.remove("active"); }
    else { uploadSection.style.display = "none"; urlSection.style.display = "block"; urlBtn.classList.add("active"); uploadBtn.classList.remove("active"); }
}

// رفع الصورة
document.getElementById("projectImageUpload").addEventListener("change", function(e){
    const file = e.target.files[0]; if(!file) return; const reader = new FileReader();
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

// فتح رابط المشروع
function openProjectLink() { 
    const link = document.getElementById("projLink").value; 
    if(link) { window.open(link, "_blank"); } else { showNotification("يرجى إدخال رابط أولاً", "warning"); } 
}

// ملء القائمة المنسدلة للتصنيفات
function populateAdminCategoryDropdown() {
    const select = document.getElementById('projCategory');
    let html = '<option value="">اختر التصنيف...</option>';
    customCategories.forEach(cat => { html += `<option value="${cat.key}">${cat.label}</option>`; });
    select.innerHTML = html;
}

// التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    if (!isAuthenticated) { 
        loginModal.style.display = 'block'; 
        adminPanel.style.display = 'none'; 
    } else { 
        loginModal.style.display = 'none'; 
        adminPanel.style.display = 'flex'; 
    }
    populateAdminCategoryDropdown();
    updateAdminStats();
    renderAdminProjectsList('all', '');
});

