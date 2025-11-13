import { db, auth } from '../firebase-init.js';
import { collection, query, where, orderBy, limit, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { renderItemsToContainer } from '../utils/renderer.js';

let homeListeners = [];

function attachTopPicksListener(userId) {
  const q = query(
    collection(db, "wardrobeItems"),
    where("userId", "==", userId),
    where("isLiked", "==", true),
    limit(10)
  );
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderItemsToContainer(items, 'top-picks-container', 'top-picks-empty');
  }, (error) => {
    console.error("Error fetching Top Picks: ", error);
  });
  homeListeners.push(unsubscribe);
}

function attachRecentlyAddedListener(userId) {
  const q = query(
    collection(db, "wardrobeItems"),
    where("userId", "==", userId),
    orderBy("timestamp", "desc"),
    limit(10)
  );
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderItemsToContainer(items, 'recently-added-container', 'recently-added-empty');
  }, (error) => {
    console.error("Error fetching Recently Added: ", error);
  });
  homeListeners.push(unsubscribe);
}

export function initHomePage() {
  const currentUser = auth.currentUser;
  if (currentUser) {
    attachTopPicksListener(currentUser.uid);
    attachRecentlyAddedListener(currentUser.uid);
  }
}

export function cleanupHomePage() {
  homeListeners.forEach(unsubscribe => unsubscribe());
  homeListeners = [];
}