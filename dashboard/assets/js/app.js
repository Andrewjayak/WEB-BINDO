
/**
 * Atomix Academy - app.js
 * Site-wide scripts for navigation, interactivity, form handling, and simple state (login).
 * This file is meant to be used across pages in /index.html, /auth/*.html, /dashboard/*.html.
 * 
 * Features:
 * - Mobile navbar (hamburger) toggle
 * - Smooth scroll and scrollspy for section links
 * - Login state manager (localStorage) to toggle Login/Dashboard buttons
 * - FAQ accordion
 * - Stats counter animation on in-view
 * - Registration form → WhatsApp message composer (+ phone normalization)
 * - Dynamic subject options based on selected level (SMP/SMA)
 * - Simple reveal-on-scroll helper
 */

// ===========================
// Utilities
// ===========================
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

const on = (el, evt, cb, opts) => el && el.addEventListener(evt, cb, opts || false);

const debounce = (fn, wait=100) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(null, args), wait);
  };
};

const throttle = (fn, limit=100) => {
  let inThrottle = false;
  return function (...args) {
    if (inThrottle) return;
    inThrottle = true;
    fn.apply(this, args);
    setTimeout(() => { inThrottle = false; }, limit);
  }
};

const isInView = (el, threshold = 0.1) => {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  const elemTop = rect.top;
  const elemBottom = rect.bottom;
  const height = rect.height || 1;
  const visible = Math.min(vh, elemBottom) - Math.max(0, elemTop);
  return (visible / height) >= threshold;
};

// ===========================
// Auth (LocalStorage-based)
// ===========================
const AUTH_KEY = 'aa_logged_in';
const AUTH_USER_KEY = 'aa_user';

const AAAuth = {
  isLoggedIn() {
    try {
      return localStorage.getItem(AUTH_KEY) === 'true';
    } catch (e) {
      return false;
    }
  },
  login(userObj = { name: 'Siswa', phone: '' }) {
    try {
      localStorage.setItem(AUTH_KEY, 'true');
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userObj));
      window.dispatchEvent(new Event('aa-auth-changed'));
    } catch (e) {}
  },
  logout() {
    try {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      window.dispatchEvent(new Event('aa-auth-changed'));
    } catch (e) {}
  },
  getUser() {
    try {
      const raw = localStorage.getItem(AUTH_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }
};
// Expose for other pages if needed
window.AAAuth = AAAuth;

// ===========================
// Navbar: hamburger toggle
// ===========================
const hamburger = $('.hamburger');
const navMenu   = $('.nav-menu');
if (hamburger && navMenu) {
  on(hamburger, 'click', () => {
    navMenu.classList.toggle('active');
  });
  // Close on link click (mobile UX)
  $$('.nav-menu a').forEach(a => {
    on(a, 'click', () => navMenu.classList.remove('active'));
  });
}

// ===========================
// Smooth scrolling for hash links
// ===========================
$$('a[href^="#"]').forEach(anchor => {
  const href = anchor.getAttribute('href');
  if (href === '#' || href.length < 2) return;
  on(anchor, 'click', (e) => {
    // only smooth scroll on same-page anchors
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80; // -80 for sticky navbar
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ===========================
// Scrollspy: highlight current section
// ===========================
const sections = $$('section[id]');
const navLinks = $$('.nav-link');
const updateActiveLink = throttle(() => {
  let currentId = null;
  sections.forEach(sec => {
    if (isInView(sec, 0.6)) currentId = sec.id;
  });
  if (!currentId) return;
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === `#${currentId}`) link.classList.add('active');
    else link.classList.remove('active');
  });
}, 120);
on(window, 'scroll', updateActiveLink);
on(window, 'resize', updateActiveLink);
updateActiveLink();

// ===========================
// Login state → toggle Login/Dashboard
// ===========================
const loginBtn = $('#loginBtn');
const dashboardBtn = $('#dashboardBtn');
const renderAuthButtons = () => {
  const loggedIn = AAAuth.isLoggedIn();
  if (loginBtn && dashboardBtn) {
    if (loggedIn) {
      loginBtn.classList.add('hidden');
      dashboardBtn.classList.remove('hidden');
    } else {
      loginBtn.classList.remove('hidden');
      dashboardBtn.classList.add('hidden');
    }
  }
};
renderAuthButtons();
on(window, 'storage', (e) => { if (e.key === AUTH_KEY) renderAuthButtons(); });
on(window, 'aa-auth-changed', renderAuthButtons);

// ===========================
// FAQ Accordion
// ===========================
const faqItems = $$('.faq-item');
faqItems.forEach(item => {
  const q = $('.faq-question', item);
  on(q, 'click', () => {
    const isOpen = item.classList.contains('active');
    // close all
    faqItems.forEach(i => i.classList.remove('active'));
    // toggle current
    if (!isOpen) item.classList.add('active');
  });
});

// ===========================
// Counter animation (stats)
// ===========================
const counters = $$('.counter');
let countersStarted = false;
const animateCounter = (el) => {
  const targetRaw = String(el.dataset.target || '0');
  // Extract number and suffix/prefix if any
  const match = targetRaw.match(/^(\D*)([\d\.]+)(\D*)$/);
  let prefix = '', number = 0, suffix = '';
  if (match) {
    prefix = match[1] || '';
    number = parseFloat(match[2] || '0');
    suffix = match[3] || '';
  } else {
    number = parseFloat(targetRaw) || 0;
  }
  const duration = 1500; // ms
  const startTime = performance.now();
  const startVal = 0;
  const animate = (now) => {
    const p = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
    const val = Math.floor(startVal + (number - startVal) * eased);
    el.textContent = `${prefix}${val}${suffix}`;
    if (p < 1) requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
};

const maybeStartCounters = () => {
  if (countersStarted) return;
  const container = $('#stats');
  if (container && isInView(container, 0.3)) {
    countersStarted = true;
    counters.forEach(animateCounter);
  }
};
on(window, 'scroll', maybeStartCounters);
on(window, 'resize', maybeStartCounters);
maybeStartCounters();

// ===========================
// Reveal on scroll (simple)
// ===========================
const revealables = [
  ...$$('.feature-card'),
  ...$$('.program-card'),
  ...$$('.schedule-box'),
  ...$$('.promo-box'),
  ...$$('.about-text'),
  ...$$('.about-img'),
  ...$$('.tutor-card'),
  ...$$('.testimonial-card'),
  ...$$('.faq-item'),
  ...$$('.contact-form')
];

const revealInit = () => {
  revealables.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity .45s ease, transform .45s ease';
  });
};
const revealTick = throttle(() => {
  revealables.forEach(el => {
    if (isInView(el, 0.15)) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }
  });
}, 120);

revealInit();
revealTick();
on(window, 'scroll', revealTick);
on(window, 'resize', revealTick);

// ===========================
// Registration Form → WhatsApp
// ===========================
const WA_NUMBER = '6281234567890'; // admin number without +

const SMP_SUBJECTS = ['Matematika', 'Fisika', 'Bahasa Inggris'];
const SMA_SUBJECTS = ['Matematika', 'Fisika', 'Kimia', 'Matematika Lanjutan', 'Bahasa Inggris'];

const SMP_PRICE = 450000;
const SMA_PRICE = 550000;

const currency = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

const normalizePhone = (raw) => {
  if (!raw) return '';
  let s = String(raw).replace(/[\s\-_.()]/g, '');
  // If starts with +62 or 62 leave, if starts with 0 -> replace with 62
  if (s.startsWith('+62')) s = s.slice(1);
  if (s.startsWith('0')) s = '62' + s.slice(1);
  // keep only digits
  s = s.replace(/[^\d]/g, '');
  return s;
};

const setOptions = (select, options) => {
  if (!select) return;
  // Preserve first placeholder option
  const placeholder = select.querySelector('option[value=""]');
  select.innerHTML = '';
  if (placeholder) select.appendChild(placeholder);
  options.forEach(opt => {
    const o = document.createElement('option');
    o.value = opt;
    o.textContent = opt;
    select.appendChild(o);
  });
  // Reset to placeholder
  select.value = '';
};

const ensureFormHelpers = () => {
  const form = $('#registrationForm');
  if (!form) return;
  let helper = form.querySelector('.price-helper');
  if (!helper) {
    helper = document.createElement('p');
    helper.className = 'help-text price-helper';
    form.appendChild(helper);
  }
  return helper;
};

const updateSubjectOptionsAndPrice = () => {
  const kelas = $('#kelas');
  const mapel = $('#mata_pelajaran');
  const helper = ensureFormHelpers();
  if (!kelas || !mapel) return;
  const level = kelas.value;
  if (level === 'SMP') {
    setOptions(mapel, SMP_SUBJECTS);
    if (helper) helper.textContent = `Harga paket SMP: ${currency(SMP_PRICE)} / bulan`;
  } else if (level === 'SMA') {
    setOptions(mapel, SMA_SUBJECTS);
    if (helper) helper.textContent = `Harga paket SMA: ${currency(SMA_PRICE)} / bulan`;
  } else {
    // reset to full options
    setOptions(mapel, [...new Set([...SMP_SUBJECTS, ...SMA_SUBJECTS])]);
    if (helper) helper.textContent = '';
  }
};

const initRegistrationForm = () => {
  const form = $('#registrationForm');
  if (!form) return;

  // Initialize options & price helper on load
  updateSubjectOptionsAndPrice();

  on($('#kelas'), 'change', updateSubjectOptionsAndPrice);

  on(form, 'submit', (e) => {
    e.preventDefault();
    const nama  = $('#nama')?.value?.trim() || '';
    const kelas = $('#kelas')?.value || '';
    const mapel = $('#mata_pelajaran')?.value || '';
    const hpRaw = $('#nomor_hp')?.value || '';
    const phone = normalizePhone(hpRaw);

    if (!nama || !kelas || !mapel || !phone) {
      // rudimentary UX feedback
      [$('#nama'), $('#kelas'), $('#mata_pelajaran'), $('#nomor_hp')].forEach(el => {
        if (el && !el.value) el.classList.add('form-error'); else el && el.classList.remove('form-error');
      });
      alert('Mohon lengkapi semua data pendaftaran.');
      return;
    }

    // Determine price info
    const price = kelas === 'SMP' ? SMP_PRICE : (kelas === 'SMA' ? SMA_PRICE : 0);
    const priceText = price ? currency(price) + ' / bulan' : 'N/A';

    // Persist minimal info (could be used on auth/register page)
    try {
      localStorage.setItem('aa_last_registration', JSON.stringify({ nama, kelas, mapel, phone }));
    } catch (e) {}

    // Compose WhatsApp message
    const msg = [
      `Halo Admin Atomix Academy,`,
      ``,
      `Saya ${nama} ingin mendaftar.`,
      `Level: ${kelas}`,
      `Mata Pelajaran: ${mapel}`,
      `Nomor: +${phone}`,
      `Perkiraan harga: ${priceText}`,
      ``,
      `Mohon informasi jadwal & ketersediaan kelas. Terima kasih.`
    ].join('\n');

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  });
};
initRegistrationForm();

// ===========================
// Minimal page guards (optional usage on other pages):
// If page sets <body data-page="dashboard"> and user not logged in → redirect.
// If page sets <body data-page="auth"> and user already logged in → redirect to dashboard.
// ===========================
const pageType = document.body?.dataset?.page || '';
if (pageType === 'dashboard' && !AAAuth.isLoggedIn()) {
  // Redirect to login page
  try { window.location.href = '../auth/auth.html'; } catch (e) {}
}
if (pageType === 'auth' && AAAuth.isLoggedIn()) {
  // Redirect to dashboard
  try { window.location.href = '../dashboard/dashboard.html'; } catch (e) {}
}

// ===========================
// Convenience: simulate login from console
// Usage: AAAuth.login({name:'Evelyn', phone:'+6281xxx'})
// ===========================
console.debug('[Atomix] app.js loaded');
