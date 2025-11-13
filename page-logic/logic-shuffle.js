import { db, auth } from '../firebase-init.js';
import { 
  collection, 
  query, 
  where, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { renderItemsToContainer } from '../utils/renderer.js';

let shuffleLists = {}; // Cache

async function loadShuffleData(userId) {
  const q = query(
    collection(db, "wardrobeItems"),
    where("userId", "==", userId)
  );
  
  try {
    const snapshot = await getDocs(q);
    const allItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    shuffleLists.accessories = allItems.filter(it => it.category && it.category.toLowerCase() === "accessory");
    shuffleLists.tops = allItems.filter(it => it.category && it.category.toLowerCase() === "top");
    shuffleLists.bottoms = allItems.filter(it => it.category && it.category.toLowerCase() === "bottom");
    shuffleLists.shoes = allItems.filter(it => it.category && (it.category.toLowerCase() === "shoes" || it.category.toLowerCase() === "footwear"));
    shuffleLists.bags = allItems.filter(it => it.category && it.category.toLowerCase() === "bag");

    renderItemsToContainer(shuffleLists.accessories, 'accessories-container', 'accessories-empty');
    renderItemsToContainer(shuffleLists.tops, 'tops-container', 'tops-empty');
    renderItemsToContainer(shuffleLists.bottoms, 'bottoms-container', 'bottoms-empty');
    renderItemsToContainer(shuffleLists.shoes, 'shoes-container', 'shoes-empty');
    renderItemsToContainer(shuffleLists.bags, 'bags-container', 'bags-empty');

  } catch (error) {
    console.error("Gagal memuat data 'shuffle': ", error);
  }
}

function shuffleToRandomStyle() {
  const allItems = [
    ...(shuffleLists.accessories || []),
    ...(shuffleLists.tops || []),
    ...(shuffleLists.bottoms || []),
    ...(shuffleLists.shoes || []),
    ...(shuffleLists.bags || [])
  ];

  const availableStyles = [...new Set(allItems.map(item => item.style).filter(Boolean))];
  if (availableStyles.length === 0) {
    alert("Tidak ada item dengan 'style' untuk di-shuffle.");
    return;
  }

  const randomStyle = availableStyles[Math.floor(Math.random() * availableStyles.length)];
  alert(`Shuffle untuk style: ${randomStyle}`);

  const scrollToStyle = (containerId, list, style) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const itemsWithStyle = list.filter(item => item.style === style);
    if (itemsWithStyle.length > 0) {
      const randomItem = itemsWithStyle[Math.floor(Math.random() * itemsWithStyle.length)];
      const itemElement = container.querySelector(`.item-card[data-id="${randomItem.id}"]`);
      if (itemElement) {
        itemElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  scrollToStyle('accessories-container', shuffleLists.accessories, randomStyle);
  scrollToStyle('tops-container', shuffleLists.tops, randomStyle);
  scrollToStyle('bottoms-container', shuffleLists.bottoms, randomStyle);
  scrollToStyle('shoes-container', shuffleLists.shoes, randomStyle);
  scrollToStyle('bags-container', shuffleLists.bags, randomStyle);
}

function getShuffleOutfit() {
  const getCenterItem = (containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return null;
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + (containerRect.width / 2);
    let closestCard = null;
    let minDistance = Infinity;
    
    container.querySelectorAll('.item-card').forEach(card => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + (cardRect.width / 2);
      const distance = Math.abs(containerCenter - cardCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestCard = card;
      }
    });

    if (!closestCard) return null;
    const itemId = closestCard.dataset.id;
    const category = containerId.split('-')[0];
    return (shuffleLists[category] || []).find(item => item.id === itemId) || null;
  };

  const outfit = {
    Accessory: getCenterItem('accessories-container'),
    Top: getCenterItem('tops-container'),
    Bottom: getCenterItem('bottoms-container'),
    Shoes: getCenterItem('shoes-container'),
    Bag: getCenterItem('bags-container')
  };

  let outfitMessage = "Outfit Pilihan Anda:\n";
  if(outfit.Accessory) outfitMessage += `Accessory: ${outfit.Accessory.name}\n`;
  if(outfit.Top) outfitMessage += `Top: ${outfit.Top.name}\n`;
  if(outfit.Bottom) outfitMessage += `Bottom: ${outfit.Bottom.name}\n`;
  if(outfit.Shoes) outfitMessage += `Shoes: ${outfit.Shoes.name}\n`;
  if(outfit.Bag) outfitMessage += `Bag: ${outfit.Bag.name}\n`;
  alert(outfitMessage);
}


export function initShufflePage() {
  const currentUser = auth.currentUser;
  if (currentUser) {
    loadShuffleData(currentUser.uid);
    document.getElementById('shuffle-btn-shuffle').addEventListener('click', shuffleToRandomStyle);
    document.getElementById('shuffle-btn-next').addEventListener('click', getShuffleOutfit);
  }
}

export function cleanupShufflePage() {
  shuffleLists = {}; // Kosongkan cache
}