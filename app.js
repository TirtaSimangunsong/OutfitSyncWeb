// --- Ambil "Slot" dari index.html ---
const appRoot = document.getElementById('app-root');
const navbarContainer = document.getElementById('navbar-container');

/**
 * Fungsi serbaguna untuk memuat file HTML ke elemen target.
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
 * Fungsi untuk memuat "Halaman" ke <main>
 * @param {string} pageName - Nama file di folder /pages (misal: 'home')
 */
async function loadPage(pageName) {
  await loadHtml(`pages/${pageName}.html`, appRoot);
  
  // LOGIKA PENTING: Sembunyikan navbar jika di halaman auth
  const authPages = ['login', 'signup', 'landing', 'verify', 'verified'];
  if (authPages.includes(pageName)) {
    navbarContainer.style.display = 'none';
  } else {
    // Gunakan 'flex' atau 'grid' sesuai CSS navbar Anda
    navbarContainer.style.display = 'flex'; 
  }
  
  // "Hidupkan" tombol/form di halaman yang baru dimuat
  initializePageEvents(pageName);
}

/**
 * "Menghidupkan" tombol-tombol di dalam navbar
 * Fungsi ini HANYA dipanggil SATU KALI.
 */
function addNavbarEvents() {
  // Pastikan ID ini ('nav-home', 'nav-wardrobe') SAMA
  // dengan ID di file components/bottom-nav.html
  
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
 * Dipanggil setiap kali loadPage() sukses.
 */
function initializePageEvents(pageName) {
  switch (pageName) {
    case 'landing':
      // Otomatis pindah ke login setelah 2 detik
      setTimeout(() => {
        loadPage('login');
      }, 2000);
      break;

    case 'login':
      const loginForm = document.getElementById('login-form');
      if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
          e.preventDefault();
          console.log('Login disubmit!');
          //
          // --- LOGIKA FIREBASE LOGIN ANDA MASUK DI SINI ---
          //
          // Jika sukses:
          // loadPage('home');
        });
      }
      
      const signupLink = document.getElementById('nav-to-signup');
      if(signupLink) {
        signupLink.addEventListener('click', (e) => {
          e.preventDefault();
          loadPage('signup'); // Pindah ke halaman signup
        });
      }
      break;
      
    case 'signup':
      const signupForm = document.getElementById('signup-form');
      if(signupForm) {
        signupForm.addEventListener('submit', (e) => {
          e.preventDefault();
          console.log('Signup disubmit!');
          //
          // --- LOGIKA FIREBASE SIGNUP ANDA MASUK DI SINI ---
          //
          // Jika sukses:
          // loadPage('verify');
        });
      }

      const signinLink = document.getElementById('nav-to-signin');
      if(signinLink) {
        signinLink.addEventListener('click', (e) => {
          e.preventDefault();
          loadPage('login'); // Kembali ke login
        });
      }
      break;
      
    case 'home':
      // Logika untuk halaman home (jika ada)
      break;
    
    case 'profile':
      // Logika untuk halaman profile (misal tombol logout)
      break;
  }
}

// --- TITIK MULAI APLIKASI ---
/**
 * Fungsi utama untuk menjalankan aplikasi saat pertama kali dibuka
 */
async function initializeApp() {
  // 1. Muat komponen navbar
  await loadHtml('components/bottom-nav.html', navbarContainer);
  
  // 2. "Hidupkan" tombol-tombol navbar
  addNavbarEvents();

  // 3. Cek status login Firebase (akan kita bahas nanti)
  // Untuk sekarang, kita mulai dari 'landing'
  loadPage('landing'); 
}

// Jalankan aplikasi!
initializeApp();