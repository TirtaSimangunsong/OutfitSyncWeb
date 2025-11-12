import { db, auth } from '../firebase-init.js';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { renderItemsToContainer } from '../utils/renderer.js';

let wardrobeListeners = [];
let allWardrobeItems = []; 
let currentWardrobeFilter = 'all';

async function handleLikeClick(itemId, currentLikeStatus) {
  const userId = auth.currentUser.uid;
  if (!userId || !itemId) return;

  const newLikeStatus = !currentLikeStatus;

  const itemIndex = allWardrobeItems.findIndex(i => i.id === itemId);
  if (itemIndex > -1) {
    allWardrobeItems[itemIndex] = { ...allWardrobeItems[itemIndex], isLiked: newLikeStatus };
  }
  
  applyWardrobeFilter(currentWardrobeFilter);

  try {
    const itemRef = doc(db, "wardrobeItems", itemId);
    await updateDoc(itemRef, { isLiked: newLikeStatus });
  } catch (error) {
    console.error("Gagal update 'isLiked': ", error);
    allWardrobeItems[itemIndex] = { ...allWardrobeItems[itemIndex], isLiked: currentLikeStatus };
    applyWardrobeFilter(currentWardrobeFilter);
  }
}

function applyWardrobeFilter(category) {
  currentWardrobeFilter = category;
  
  document.querySelectorAll('#wardrobe-filter-chips .chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.category === category);
  });
  
  const filteredList = (category === 'all' || !category)
    ? allWardrobeItems
    : allWardrobeItems.filter(item => 
        (item.category && item.category.toLowerCase() === category.toLowerCase()) ||
        (category.toLowerCase() === 'footwear' && item.category && item.category.toLowerCase() === 'shoes')
      );
      
  renderItemsToContainer(filteredList, 'wardrobe-grid-container', 'wardrobe-empty-message');
}

function attachWardrobeListener(userId) {
  const q = query(
    collection(db, "wardrobeItems"),
    where("userId", "==", userId)
  );
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    allWardrobeItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    applyWardrobeFilter(currentWardrobeFilter);
  }, (error) => {
    console.error("Error listener 'wardrobeItems': ", error);
  });
  
  wardrobeListeners.push(unsubscribe);
}

export function initWardrobePage() {
  const currentUser = auth.currentUser;
  if (currentUser) {
    attachWardrobeListener(currentUser.uid);
    
    const chipGroup = document.getElementById('wardrobe-filter-chips');
    chipGroup.addEventListener('click', (e) => {
      if (e.target.classList.contains('chip')) {
        applyWardrobeFilter(e.target.dataset.category);
      }
    });

    const grid = document.getElementById('wardrobe-grid-container');
    grid.addEventListener('click', (e) => {
      const likeBtn = e.target.closest('.like-btn');
      if (likeBtn) {
        const itemId = likeBtn.dataset.id;
        const isLiked = likeBtn.dataset.liked === 'true';
        handleLikeClick(itemId, isLiked);
      }
    });
    
    const likesBtn = document.getElementById('nav-to-favorites');
    if (likesBtn) {
      likesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert("Halaman 'Favorites' belum dibuat");
      });
    }
  }
}

export function cleanupWardrobePage() {
  wardrobeListeners.forEach(unsubscribe => unsubscribe());
  wardrobeListeners = [];
  allWardrobeItems = [];
  currentWardrobeFilter = 'all';
}