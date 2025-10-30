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
    // sembunyikan login page
    loginPage.classList.add('hidden');
    // tampilkan signup page
    signupPage.classList.remove('hidden');
    signupPage.classList.add('fade-in');
  });
}

if (signInLink) {
  signInLink.addEventListener('click', (e) => {
    e.preventDefault();
    // sembunyikan signup page
    signupPage.classList.add('hidden');
    // tampilkan login page
    loginPage.classList.remove('hidden');
    loginPage.classList.add('fade-in');
  });
}

//Verify email page
const signupForm = document.querySelector('.signup-form');
const verifyPage = document.getElementById('verify-page');

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // sembunyikan signup page
    signupPage.classList.add('hidden');
    // tampilkan verify page
    verifyPage.classList.remove('hidden');
    verifyPage.classList.add('fade-in');
  });
}

