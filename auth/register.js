// Atomix Academy - register.js
// Mendaftarkan user baru ke localStorage dan auto-login → redirect ke dashboard

(function(){
  const form = document.getElementById('registerForm');
  const errorEl = document.getElementById('registerError');

  if (!form) return;

  // Toggle show/hide password for both fields
  Array.from(form.querySelectorAll('.showpass')).forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const wrap = btn.closest('label') || btn.parentElement;
      const input = wrap.querySelector('input[type="password"], input[type="text"]');
      if (!input) return;
      const t = input.getAttribute('type') === 'password' ? 'text' : 'password';
      input.setAttribute('type', t);
      btn.textContent = t === 'password' ? 'Lihat' : 'Sembunyi';
    });
  });

  function readUsers() {
    try { return JSON.parse(localStorage.getItem('aa_users') || '[]'); }
    catch { return []; }
  }
  function saveUsers(users) {
    try { localStorage.setItem('aa_users', JSON.stringify(users)); } catch(_) {}
  }
  function isUsernameTaken(username) {
    const u = (username || '').toLowerCase().trim();
    return readUsers().some(x => (x.username || '').toLowerCase() === u);
  }
  function isEmailTaken(email) {
    const e = (email || '').toLowerCase().trim();
    return readUsers().some(x => (x.email || '').toLowerCase() === e);
  }

  function validate(data) {
    const fullName = (data.get('fullName') || '').toString().trim();
    const username = (data.get('username') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const password = (data.get('password') || '').toString();
    const confirmPassword = (data.get('confirmPassword') || '').toString();
    const agree = data.get('agree');

    if (!fullName || !username || !email || !password || !confirmPassword) {
      return 'Semua kolom wajib diisi.';
    }
    if (username.length < 3) return 'Username minimal 3 karakter.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Format email tidak valid.';
    if (password.length < 6) return 'Kata sandi minimal 6 karakter.';
    if (password !== confirmPassword) return 'Konfirmasi kata sandi tidak cocok.';
    if (!agree) return 'Anda harus menyetujui S&K.';
    if (isUsernameTaken(username)) return 'Username sudah digunakan.';
    if (isEmailTaken(email)) return 'Email sudah terdaftar.';
    return null;
  }

  function normalizePhone(raw) {
    if (!raw) return '';
    let s = String(raw).replace(/[\s\-_.()]/g, '');
    if (s.startsWith('+62')) s = s.slice(1);
    if (s.startsWith('0')) s = '62' + s.slice(1);
    return s.replace(/[^\d]/g, '');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (errorEl) errorEl.textContent = '';

    const data = new FormData(form);
    const v = validate(data);
    if (v) {
      if (errorEl) errorEl.textContent = v;
      return;
    }

    const user = {
      id: 'U' + Math.random().toString(36).slice(2, 10),
      fullName: (data.get('fullName') || '').toString().trim(),
      username: (data.get('username') || '').toString().trim(),
      email: (data.get('email') || '').toString().trim(),
      phone: normalizePhone(data.get('phone') || ''),
      password: (data.get('password') || '').toString(),
      createdAt: new Date().toISOString()
    };

    const users = readUsers();
    users.push(user);
    saveUsers(users);

    // Auto login (pakai AAAuth biar konsisten di seluruh site)
    try {
      if (window.AAAuth) {
        AAAuth.login({ name: user.fullName || user.username, phone: user.phone ? ('+'+user.phone) : '' });
      } else {
        localStorage.setItem('aa_logged_in', 'true');
        localStorage.setItem('aa_user', user.username);
      }
    } catch (_) {}

    // Redirect ke dashboard
    try { window.location.replace('../dashboard/dashboard.html'); } catch (_) {}
  });
})();
 