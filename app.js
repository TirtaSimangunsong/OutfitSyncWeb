// --- Ambil "Slot" dari index.html ---
const appRoot = document.getElementById('app-root');
const navbarContainer = document.getElementById('navbar-container');

// Variabel untuk melacak CSS halaman yang sedang aktif
let currentPageStyle = null;
// Variabel untuk melacak CSS layout (seperti auth)
let currentLayoutStyle = null;

/**
 * Memuat file HTML ke elemen target.
 * @param {string} path - Path ke file (misal: 'pages/home.html')
 * @param {HTMLElement} targetElement - Elemen DOM tujuan
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
 * Memuat CSS yang persisten (selalu ada, seperti navbar).
 * @param {string} path - Path ke file CSS
 */
function loadPersistentStyle(path) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = path;
  document.head.appendChild(link);
}

/**
 * Memuat CSS khusus untuk layout (misal: layout auth).
 * @param {string} layoutName - Nama file CSS di folder /pages
 */
function loadLayoutStyle(layoutName) {
  // Hapus layout CSS lama jika ada
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
 * @param {string} pageName - Nama file CSS di folder /pages
 */
function loadPageStyle(pageName) {
  // 1. Hapus CSS halaman lama (jika ada)
  if (currentPageStyle) {
    currentPageStyle.remove();
  }

  // 2. Buat <link> baru untuk CSS halaman baru
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `pages/${pageName}.css`;
  
  // 3. Tambahkan ke <head>
  document.head.appendChild(link);

  // 4. Simpan referensinya untuk dihapus nanti
  currentPageStyle = link;
}

/**
 * Fungsi untuk memuat "Halaman" ke <main>
 * @param {string} pageName - Nama file di folder /pages (misal: 'home')
 */
async function loadPage(pageName) {
  // Tentukan layout berdasarkan halaman
  const authPages = ['login', 'signup', 'verify'];
  if (authPages.includes(pageName)) {
    loadLayoutStyle('auth-layout'); // Muat CSS layout auth
  } else {
    loadLayoutStyle(null); // Hapus CSS layout jika bukan halaman auth
  }

  // 1. Muat dan ganti style CSS halaman
  loadPageStyle(pageName); 

  // 2. Muat konten HTML
  await loadHtml(`pages/${pageName}.html`, appRoot);
  
  // 3. Atur visibilitas navbar
  const pagesWithNavbar = ['home', 'profile', 'wardrobe', 'add-page', 'shuffle'];
  if (pagesWithNavbar.includes(pageName)) {
    navbarContainer.style.display = 'flex'; // 'flex' atau 'grid'
  } else {
    navbarContainer.style.display = 'none';
  }
  
  // 4. "Hidupkan" tombol/form
  initializePageEvents(pageName);
}

/**
 * "Menghidupkan" tombol-tombol di dalam navbar
 */
function addNavbarEvents() {
  document.getElementById('nav-home').addEventListener('click', (e) => {
    e.preventDefault();
    loadPage('home');
  });
  
  document.getElementById('nav-wardrobe').addEventListener('click', (e) => {
    e.preventDefault();
    loadPage('wardrobe');
  });

  document.getElementById('nav-add').addEventListener('click', (e) => {
    e.preventDefault();
    loadPage('add-page');
  });

  document.getElementById('nav-shuffle').addEventListener('click', (e) => {
    e.preventDefault();
    loadPage('shuffle');
  });

  document.getElementById('nav-profile').addEventListener('click', (e) => {
    e.preventDefault();
    loadPage('profile');
  });
}

/**
 * "Menghidupkan" tombol/form di dalam HALAMAN (appRoot)
 */
function initializePageEvents(pageName) {
  switch (pageName) {
    
    // ### INI YANG HILANG ###
    case 'landing':
      // Otomatis pindah ke login setelah 2 detik
      setTimeout(() => {
        loadPage('login');
      }, 2000); // 2000 milidetik = 2 detik
      break;
    // ########################

    case 'login':
      const loginForm = document.getElementById('login-form');
      if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
          e.preventDefault();
          console.log('Login disubmit!');
          // ... LOGIKA FIREBASE LOGIN ...
          // Jika sukses:
          loadPage('home');
        });
      }
      const signupLink = document.getElementById('nav-to-signup');
      if(signupLink) {
        signupLink.addEventListener('click', (e) => {
          e.preventDefault();
          loadPage('signup');
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
          // Jika sukses:
          loadPage('verify');
        });
      }
      const signinLink = document.getElementById('nav-to-signin');
      if(signinLink) {
        signinLink.addEventListener('click', (e) => {
          e.preventDefault();
          loadPage('login');
        });
      }
      break;

    case 'home':
      // Jika ada logika untuk home (misal tombol dropdown) bisa ditambahkan di sini
      break;
  }
}

// --- TITIK MULAI APLIKASI ---
async function initializeApp() {
  // 1. Muat HTML komponen navbar
  await loadHtml('components/bottom-nav.html', navbarContainer);
  
  // 2. Muat CSS komponen navbar (buat file 'components/bottom-nav.css')
  loadPersistentStyle('components/bottom-nav.css');

  // 3. "Hidupkan" tombol-tombol navbar
  addNavbarEvents();

  // 4. Muat halaman awal (landing)
  // onAuthStateChanged akan menggantikan ini nanti
  loadPage('landing');
}

// Jalankan aplikasi!
initializeApp();