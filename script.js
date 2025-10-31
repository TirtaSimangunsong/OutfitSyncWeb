// ----- LANDING PAGE FADE -----
setTimeout(() => {
  const landing = document.getElementById('landing');
  const loginPage = document.getElementById('login-page');

  landing.classList.add('fade-out');

  setTimeout(() => {
    landing.style.display = 'none';
    loginPage.classList.remove('hidden');
    loginPage.classList.add('fade-in');
  }, 1000);
}, 500);


// ----- PAGE SWITCHING -----
const loginPage = document.getElementById('login-page');
const signupPage = document.getElementById('signup-page');

// tombol/link "Sign up" di login page
const signUpLink = document.querySelector('.login-page .signup-text a');

// tombol/link "Sign in" di signup page
const signInLink = document.getElementById('signin-link');

if (signUpLink) {
  signUpLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginPage.classList.add('hidden');
    signupPage.classList.remove('hidden');
    signupPage.classList.add('fade-in');
  });
}

if (signInLink) {
  signInLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupPage.classList.add('hidden');
    loginPage.classList.remove('hidden');
    loginPage.classList.add('fade-in');
  });
}


// ----- VERIFY EMAIL PAGE -----
const signupForm = document.querySelector('.signup-form');
const verifyPage = document.getElementById('verify-page');

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    signupPage.classList.add('hidden');
    verifyPage.classList.remove('hidden');
    verifyPage.classList.add('fade-in');
  });
}


// ----- RESEND CODE FUNCTIONALITY -----
const resendLink = document.querySelector('.resend-text a');

if (resendLink) {
  resendLink.addEventListener('click', (e) => {
    e.preventDefault();

    resendLink.textContent = 'Code sent!';
    resendLink.style.pointerEvents = 'none';
    resendLink.style.color = '#aaa';

    let countdown = 30;
    const parentText = resendLink.parentElement;
    const countdownText = document.createElement('span');
    countdownText.style.marginLeft = '8px';
    countdownText.style.color = '#777';
    countdownText.textContent = `Please wait ${countdown}s`;
    parentText.appendChild(countdownText);

    const interval = setInterval(() => {
      countdown--;
      countdownText.textContent = `Please wait ${countdown}s`;

      if (countdown <= 0) {
        clearInterval(interval);
        countdownText.remove();
        resendLink.textContent = 'Resend Code';
        resendLink.style.pointerEvents = 'auto';
        resendLink.style.color = '#000';
      }
    }, 1000);
  });
}


// ----- VERIFIED PAGE SWITCH -----
const confirmBtn = document.querySelector('.verify-page .btn-main');
const verifiedPage = document.getElementById('verified-page');

if (confirmBtn) {
  confirmBtn.addEventListener('click', (e) => {
    e.preventDefault();
    verifyPage.classList.add('hidden');
    verifiedPage.classList.remove('hidden');
    verifiedPage.classList.add('fade-in');
  });
}


// ----- DONE BUTTON (kembali ke login) -----
const doneBtn = document.querySelector('.verified-page .btn-main');

if (doneBtn) {
  doneBtn.addEventListener('click', () => {
    verifiedPage.classList.add('hidden');
    loginPage.classList.remove('hidden');
    loginPage.classList.add('fade-in');
  });
}


// ----- LOGIN -> MAIN LANDING -----
const loginForm = document.querySelector('.login-form');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loginPage.classList.add('hidden');
    mainLanding.classList.remove('hidden');
    mainLanding.classList.add('fade-in');
  });
}

// ----- MAIN LANDING -> HOME PAGE (otomatis) -----
const mainLanding = document.getElementById('main-landing');
const homePage = document.getElementById('home-page');

if (mainLanding && homePage) {
  // Saat main landing muncul, tunggu sebentar lalu pindah ke home
  const observer = new MutationObserver(() => {
    if (!mainLanding.classList.contains('hidden')) {
      setTimeout(() => {
        mainLanding.classList.add('fade-out');
        setTimeout(() => {
          mainLanding.style.display = 'none';
          homePage.classList.remove('hidden');
          homePage.classList.add('fade-in');
        }, 1000); // waktu transisi fade-out
      }, 1500); // waktu tampil sebelum pindah
    }
  });

  observer.observe(mainLanding, { attributes: true, attributeFilter: ['class'] });
}

// ----- MAIN LANDING ----- //
const topLeftBtn = document.querySelector('.top-left'); // tombol kiri atas

if (mainLanding && homePage) {
  // tombol kiri atas tetap tampil (tidak ikut fade)
  if (topLeftBtn) {
    topLeftBtn.style.position = 'fixed';
    topLeftBtn.style.top = '1.2rem';
    topLeftBtn.style.left = '1.2rem';
    topLeftBtn.style.zIndex = '1000';
  }

  // jalankan transisi otomatis
  const observer = new MutationObserver(() => {
    if (!mainLanding.classList.contains('hidden')) {
      setTimeout(() => {
        mainLanding.classList.add('fade-out');
        setTimeout(() => {
          mainLanding.style.display = 'none';
          homePage.classList.remove('hidden');
          homePage.classList.add('fade-in');
        }, 1000); // waktu fade-out
      }, 1500); // waktu tampil main landing
    }
  });

  observer.observe(mainLanding, { attributes: true, attributeFilter: ['class'] });
}

//transisi main landing page -> homepage
if (mainLanding && homePage) {
  const observer = new MutationObserver(() => {
    if (!mainLanding.classList.contains('hidden')) {
      setTimeout(() => {
        mainLanding.classList.add('fade-out');
        setTimeout(() => {
          mainLanding.style.display = 'none';
          homePage.classList.remove('hidden');
          homePage.classList.add('fade-in');
        }, 1000);
      }, 1500);
    }
  });

  observer.observe(mainLanding, { attributes: true, attributeFilter: ['class'] });
}


