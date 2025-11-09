const avatarInput = document.getElementById('avatarInput');
const avatarImg = document.getElementById('avatarPreviewImg');
const editBadge = document.getElementById('editBadge');
const swatches = document.querySelectorAll('.swatch');

editBadge.addEventListener('click', () => avatarInput.click());
document.querySelector('.avatar-disk label').addEventListener('click', () => avatarInput.click());

avatarInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file || !file.type.startsWith('image/')) return alert('Pilih file gambar.');
  const reader = new FileReader();
  reader.onload = evt => {
    avatarImg.src = evt.target.result;
    localStorage.setItem('profileAvatar', evt.target.result);
  };
  reader.readAsDataURL(file);
});

const savedAvatar = localStorage.getItem('profileAvatar');
if (savedAvatar) avatarImg.src = savedAvatar;

function applyTheme(theme) {
  document.body.classList.remove('theme-pink', 'theme-blue');
  if (theme === 'pink') {
    document.body.classList.add('theme-pink');
    document.documentElement.style.setProperty('--page-bg', '#ffeef0');
  } else {
    document.body.classList.add('theme-blue');
    document.documentElement.style.setProperty('--page-bg', '#dff3ff');
  }
}

swatches.forEach(s => {
  s.addEventListener('click', () => {
    swatches.forEach(x => x.classList.remove('selected'));
    s.classList.add('selected');
    applyTheme(s.dataset.theme);
  });
});

applyTheme(document.querySelector('.swatch.selected').dataset.theme);

document.getElementById('cancelBtn').addEventListener('click', () => {
  const card = document.querySelector('.card');
  card.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-8px)' }, { transform: 'translateY(0)' }], { duration: 300 });
});

document.getElementById('saveBtn').addEventListener('click', () => {
  document.querySelectorAll('.error').forEach(e => e.style.display = 'none');
  const name = document.getElementById('name').value.trim();
  const gender = document.getElementById('gender').value;
  const birth = document.getElementById('birth').value;
  const emailEl = document.getElementById('email');
  const phone = document.getElementById('phone').value.trim();

  let ok = true;
  if (!name) { document.getElementById('err-name').style.display = 'block'; ok = false; }
  if (!gender) { document.getElementById('err-gender').style.display = 'block'; ok = false; }
  if (!birth) { document.getElementById('err-birth').style.display = 'block'; ok = false; }
  if (!emailEl.checkValidity()) { document.getElementById('err-email').style.display = 'block'; ok = false; }

  if (!ok) return createToast('Lengkapi field yang wajib.', true);

  localStorage.setItem('profileData', JSON.stringify({ name, gender, birth, email: emailEl.value.trim(), phone }));
  createToast('Profile saved (lokal)');
});

function createToast(msg, isError = false) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '32px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '10px 16px',
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    background: isError ? '#ffeef0' : 'white',
    color: isError ? '#b00020' : '#111',
    zIndex: 9999
  });
  document.body.appendChild(toast);
  setTimeout(() => toast.style.opacity = '0', 900);
  setTimeout(() => toast.remove(), 1200);
}

const birthInput = document.getElementById('birth');
const birthDisplay = document.getElementById('birthDisplay');
birthInput.addEventListener('change', () => {
  if (!birthInput.value) return birthDisplay.textContent = '';
  const d = new Date(birthInput.value + 'T00:00:00');
  birthDisplay.textContent = 'Dipilih: ' + d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
});

const savedProfile = localStorage.getItem('profileData');
if (savedProfile) {
  const p = JSON.parse(savedProfile);
  if (p.name) document.getElementById('name').value = p.name;
  if (p.gender) document.getElementById('gender').value = p.gender;
  if (p.birth) { document.getElementById('birth').value = p.birth; birthInput.dispatchEvent(new Event('change')); }
  if (p.email) document.getElementById('email').value = p.email;
  if (p.phone) document.getElementById('phone').value = p.phone;
}
