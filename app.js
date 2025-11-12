// --- Ambil "Slot" dari index.html ---
const appRoot = document.getElementById('app-root');
const sidebarContainer = document.getElementById('sidebar-container');

// Variabel untuk melacak CSS & JS
let currentPageStyle = null;
let currentLayoutStyle = null;
let currentPageScript = null; // Untuk melacak script halaman

/**
 * Memuat file HTML ke elemen target.
 */
async function loadHtml(path, targetElement) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`File ${path} tidak ditemukan`);
    targetElement.innerHTML = await response.text();
  } catch (error) {
    console.error(`Gagal memuat ${path}:`, error);
    targetElement.innerHTML = `<p>Error memuat konten.</p>`;
  }
}

/**
 * Memuat file SCRIPT (JS) secara dinamis
 */
function loadScript(path) {
  // Hapus script halaman lama jika ada
  if (currentPageScript) {
    currentPageScript.remove();
  }
  
  const script = document.createElement('script');
  script.src = path;
  script.type = 'module';
  script.id = 'page-script'; // Beri ID untuk dihapus nanti
  document.body.appendChild(script);
  currentPageScript = script;
}

/**
 * Menghapus script halaman
 */
function removePageScript() {
  if (currentPageScript) {
    currentPageScript.remove();
    currentPageScript = null;
  }
}

/**
 * Memuat CSS yang persisten (selalu ada).
 */
function loadPersistentStyle(path) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = path;
  document.head.appendChild(link);
}

/**
 * Memuat CSS khusus untuk layout (misal: layout auth).
 */
function loadLayoutStyle(layoutName) {
  if (currentLayoutStyle) {
    currentLayoutStyle.remove();
  }
  if (layoutName) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `pages/${layoutName}.css`;
    document.head.appendChild(link);
    currentLayoutStyle = link;
  } else {
    currentLayoutStyle = null;
  }
}

/**
 * Memuat CSS khusus halaman (dan menghapus yang lama).
 */
function loadPageStyle(pageName) {
  if (currentPageStyle) {
    currentPageStyle.remove();
  }
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `pages/${pageName}.css`;
  document.head.appendChild(link);
  currentPageStyle = link;
}

/**
 * Fungsi untuk memuat "Halaman" ke <main>
 */
// Deklarasikan di scope global agar bisa dipanggil dari event
window.loadPage = async (pageName) => {
  // Hapus script halaman lama sebelum memuat yang baru
  removePageScript(); 

  // Tentukan layout berdasarkan halaman
  const authPages = ['login', 'signup', 'verify'];
  if (authPages.includes(pageName)) {
    loadLayoutStyle('auth-layout');
    sidebarContainer.style.display = 'none'; // Sembunyikan sidebar
  } else {
    loadLayoutStyle(null);
    sidebarContainer.style.display = 'block'; // Tampilkan sidebar
  }

  // 1. Muat dan ganti style CSS halaman
  loadPageStyle(pageName); 

  // 2. Muat konten HTML
  await loadHtml(`pages/${pageName}.html`, appRoot);
  
  // 3. "Hidupkan" tombol/form
  initializePageEvents(pageName);
}

/**
 * "Menghidupkan" event listener untuk halaman yang baru dimuat
 */
function initializePageEvents(pageName) {
  switch (pageName) {
    case 'landing':
      setTimeout(() => {
        window.loadPage('login');
      }, 2000);
      break;

    case 'login':
      const loginForm = document.getElementById('login-form');
      if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
          e.preventDefault();
          console.log('Login disubmit!');
          // ... LOGIKA FIREBASE LOGIN ...
          window.loadPage('home'); // Ganti ke home
        });
      }
      const signupLink = document.getElementById('nav-to-signup');
      if(signupLink) {
        signupLink.addEventListener('click', (e) => {
          e.preventDefault();
          window.loadPage('signup');
        });
      }
      break;
      
    case 'signup':
      const signupForm = document.getElementById('signup-form');
      if(signupForm) {
        signupForm.addEventListener('submit', (e) => {
          e.preventDefault();
          console.log('Signup disubmit!');
          // ... LOGIKA FIREBASE SIGNUP ...
          // window.loadPage('verify');
        });
      }
      const signinLink = document.getElementById('nav-to-signin');
      if(signinLink) {
        signinLink.addEventListener('click', (e) => {
          e.preventDefault();
          window.loadPage('login');
        });
      }
      break;
    
    case 'profile':
      // Menghubungkan tombol "Edit Profile" ke halaman edit
      const editBtn = document.getElementById('nav-to-edit-profile');
      if (editBtn) {
        editBtn.addEventListener('click', (e) => {
          e.preventDefault();
          window.loadPage('edit-profile'); // Memuat halaman edit
        });
      }
      break;
    
    case 'edit-profile':
      // Halaman edit-profile memiliki JS sendiri
      // Kita perlu memuat script-nya secara manual
      loadScript('pages/edit-profile.js');

      // Tambahkan listener untuk tombol "Kembali"
      const backBtn = document.getElementById('nav-to-profile');
      if (backBtn) {
        backBtn.addEventListener('click', (e) => {
          e.preventDefault();
          window.loadPage('profile'); // Kembali ke profile
        });
      }
      break;

    case 'home':
      // ... (Event listener untuk home) ...
      break;
  }
}

// --- TITIK MULAI APLIKASI ---
async function initializeApp() {
  // 1. Muat HTML komponen sidebar
  await loadHtml('components/sidebar.html', sidebarContainer);
  
  // 2. Muat CSS komponen sidebar
  loadPersistentStyle('components/sidebar.css');

  // 3. Muat JS komponen sidebar
  loadScript('components/sidebar.js'); // Menggunakan loadScript

  // 4. Tambahkan listener global untuk navigasi dari sidebar
  window.addEventListener('navigate', (event) => {
    const pageName = event.detail.page;
    if (pageName) {
      window.loadPage(pageName);
    }
  });

  // 5. Muat halaman awal (landing)
  // Nanti diganti onAuthStateChanged
  window.loadPage('landing');
}

// Jalankan aplikasi!
initializeApp();