
// Atomix Academy - auth.js (Login logic + demo seeding)
// Terhubung dengan window.AAAuth dari assets/js/app.js

(function () {
  const form = document.getElementById('loginForm');
  const errorEl = document.getElementById('loginError');
  const idEl = document.getElementById('identifier');
  const passEl = document.getElementById('password');
  const rememberEl = document.getElementById('remember');
  const toggleBtn = document.getElementById('togglePassword');

  // Akun demo yang diminta
  const DEMO_USER = 'Sharon';
  const DEMO_PASS = 'Juara Atomix';

  // ===== Utilities for storage =====
  function readUsers() {
    try { return JSON.parse(localStorage.getItem('aa_users') || '[]'); }
    catch { return []; }
  }
  function saveUsers(users) {
    try { localStorage.setItem('aa_users', JSON.stringify(users)); } catch(_) {}
  }
  function findUserByIdentifier(identifier) {
    const users = readUsers();
    const idLower = (identifier || '').toLowerCase().trim();
    return users.find(u =>
      (u.username || '').toLowerCase() === idLower ||
      (u.email || '').toLowerCase() === idLower
    );
  }

  // ===== Seed demo account (persisted) =====
  (function ensureDemoUser(){
    try {
      const users = readUsers();
      const exists = users.some(u => (u.username || '').toLowerCase() === DEMO_USER.toLowerCase());
      if (!exists) {
        users.push({
          id: 'UDEMO',
          fullName: 'Sharon Demo',
          username: DEMO_USER,
          email: 'sharon@atomix.demo',
          phone: '',
          password: DEMO_PASS,
          createdAt: new Date().toISOString()
        });
        saveUsers(users);
        console.info('[Atomix] Demo user seeded:', DEMO_USER);
      }
    } catch (e) {
      console.warn('[Atomix] Failed to seed demo user:', e);
    }
  })();

  // Prefill identifier bila "ingat saya" pernah diaktifkan
  try {
    const lastId = localStorage.getItem('aa_last_identifier') || '';
    if (lastId && idEl) idEl.value = lastId;
    const remembered = localStorage.getItem('aa_remember') === 'true';
    if (rememberEl) rememberEl.checked = remembered;
  } catch (_) {}

  // Jika sudah login, arahkan ke dashboard
  if (window.AAAuth && AAAuth.isLoggedIn()) {
    try { window.location.replace('../dashboard/dashboard.html'); } catch (_) {}
    return;
  }

  // Show/Hide password
  if (toggleBtn && passEl) {
    toggleBtn.addEventListener('click', () => {
      const t = passEl.getAttribute('type') === 'password' ? 'text' : 'password';
      passEl.setAttribute('type', t);
      toggleBtn.textContent = t === 'password' ? 'Lihat' : 'Sembunyi';
    });
  }

  function validate(id, pass) {
    if (!id || !pass) return 'Isi username/email dan password.';
    if (pass.length < 6 && !(id === DEMO_USER && pass === DEMO_PASS)) {
      return 'Password minimal 6 karakter.';
    }
    return null;
  }

  function loginSuccess(userObj) {
    // Simpan pilihan "ingat saya"
    try {
      const remember = !!(rememberEl && rememberEl.checked);
      localStorage.setItem('aa_remember', remember ? 'true' : 'false');
      if (remember && idEl && idEl.value) {
        localStorage.setItem('aa_last_identifier', idEl.value);
      } else {
        localStorage.removeItem('aa_last_identifier');
      }
    } catch (_) {}

    // Set state login (gunakan AAAuth agar konsisten di seluruh site)
    try {
      if (window.AAAuth) {
        AAAuth.login({ name: userObj.fullName || userObj.username || 'Siswa', phone: '' });
      } else {
        localStorage.setItem('aa_logged_in', 'true');
        localStorage.setItem('aa_user', userObj.username || userObj.email || 'user');
      }
    } catch (_) {}

    // Redirect ke dashboard
    try { window.location.replace('../dashboard/dashboard.html'); } catch (_) {}
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (errorEl) errorEl.textContent = '';

    const identifier = (idEl?.value || '').trim();
    const password = (passEl?.value || '').toString();

    // Validasi dasar
    const v = validate(identifier, password);
    if (v) {
      if (errorEl) errorEl.textContent = v;
      return;
    }

    // Cek akun demo (jalur cepat tanpa cek di storage)
    if (identifier === DEMO_USER && password === DEMO_PASS) {
      return loginSuccess({ username: DEMO_USER, fullName: 'Sharon Demo' });
    }

    // Cari user terdaftar di localStorage
    const user = findUserByIdentifier(identifier);
    if (!user) {
      if (errorEl) errorEl.textContent = 'Akun tidak ditemukan.';
      return;
    }
    if (user.password !== password) {
      if (errorEl) errorEl.textContent = 'Password salah.';
      return;
    }

    loginSuccess(user);
  });
})();
