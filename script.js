// Wait 5 seconds, then fade out landing and show login
setTimeout(() => {
  const landing = document.getElementById('landing');
  const loginPage = document.getElementById('login-page');

  // Fade out landing
  landing.classList.add('fade-out');

  // After fade animation, hide landing and show login
  setTimeout(() => {
    landing.style.display = 'none';
    loginPage.classList.remove('hidden');
    loginPage.classList.add('fade-in');
  }, 1000); // matches CSS transition duration
}, 500); // delay before showing login
