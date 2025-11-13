import { auth, db, storage } from '../firebase-init.js';
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

/**
 * Menyimpan data user ke /users/{uid} saat signup/login Google.
 */
export async function saveUserDataToFirestore(user, name) {
  const userDocRef = doc(db, "users", user.uid);
  const userDocSnap = await getDoc(userDocRef);
  if (!userDocSnap.exists()) {
    await setDoc(userDocRef, {
      name: name || user.displayName, 
      email: user.email 
    });
    console.log("User data saved to Firestore");
  } else {
    console.log("User data already exists.");
  }
}

/**
 * Memuat data user dari Firestore & Storage, lalu menampilkannya di UI.
 */
export async function loadUserData(user) {
  if (!user) return;

  // 1. Ambil Data Teks
  try {
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      
      const elements = {
        'home-user-name': `Hello, ${userData.name || 'User'}!`,
        'profile-user-name': userData.name || 'N/A',
        'profile-user-email': userData.email || user.email,
        'profile-user-gender': userData.gender || 'N/A',
        'profile-user-birthdate': userData.birthDate || 'N/A',
        'profile-user-phone': userData.phoneNumber || 'N/A'
      };
      
      for (const id in elements) {
        const el = document.getElementById(id);
        if (el) el.textContent = elements[id];
      }
    }
  } catch (error) {
    console.error("Error getting user document:", error);
  }

  // 2. Ambil Gambar Profil
  try {
    const profileImgRef = ref(storage, `profile_images/${user.uid}.jpg`); 
    const url = await getDownloadURL(profileImgRef);
    const homeAvatar = document.getElementById('home-user-avatar');
    const profileAvatar = document.getElementById('profile-user-avatar');
    if (homeAvatar) homeAvatar.src = url;
    if (profileAvatar) profileAvatar.src = url;
  } catch (error) {
    const defaultAvatar = 'images/avatar.png'; 
    const homeAvatar = document.getElementById('home-user-avatar');
    const profileAvatar = document.getElementById('profile-user-avatar');
    if (homeAvatar) homeAvatar.src = defaultAvatar;
    if (profileAvatar) profileAvatar.src = defaultAvatar;
  }
}