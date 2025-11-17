// File: components/sidebar.js

const wrap = document.getElementById("wrap");
const capsule = document.getElementById("capsule");
const panel = document.getElementById("panel");
const itemsContainer = document.getElementById("items");
const spotlight = document.getElementById("spotlight");
const items = Array.from(itemsContainer.querySelectorAll(".item"));

let SPOT_SIZE =
  parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--spot-size")
  ) || 62;

let open = false;
// index item yang sedang/terakhir aktif
let activeIndex = -1;

/**
 * Tentukan index default berdasarkan halaman.
 * Di home-page, kita mau default ke button "home".
 * Kalau tidak ketemu, fallback ke item pertama (index 0).
 */
function getDefaultActiveIndex() {
  // target default di home-page
  const DEFAULT_TARGET = "home";

  const homeIndex = items.findIndex(
    (btn) => btn.dataset.target === DEFAULT_TARGET
  );

  if (homeIndex >= 0) return homeIndex;
  return 0; // fallback kalau entah kenapa "home" tidak ada
}

/**
 * Pastikan activeIndex sudah punya nilai yang valid.
 * Kalau belum pernah di-set (masih -1), pakai default (home).
 */
function ensureActiveIndex() {
  if (activeIndex >= 0) return;
  activeIndex = getDefaultActiveIndex();
}

/**
 * Pindahkan bubble (spotlight) ke item ke-index tertentu
 */
function moveSpotTo(index, animate = true) {
  if (index < 0 || index >= items.length) return;

  const item = items[index];

  // simpan index aktif
  activeIndex = index;

  // update state active pada button
  items.forEach((i) => i.classList.remove("active"));
  item.classList.add("active");

  // posisi tengah item relatif ke container (lebih stabil daripada getBoundingClientRect)
  const itemCenter = item.offsetTop + item.offsetHeight / 2;
  const newTop = itemCenter - SPOT_SIZE / 2;

  if (animate) {
    spotlight.style.transition = "top 420ms cubic-bezier(.2,.9,.2,1)";
    spotlight.style.transform = "translate(-50%, 0) scale(0.9)";
    // force reflow
    void spotlight.offsetWidth;
    spotlight.style.top = `${newTop}px`;
    setTimeout(
      () => (spotlight.style.transform = "translate(-50%, 0) scale(1)"),
      120
    );
  } else {
    spotlight.style.transition = "none";
    spotlight.style.top = `${newTop}px`;
  }
}

/**
 * Buka / tutup sidebar
 */
function setOpenState(isOpen) {
  open = !!isOpen;
  capsule.classList.toggle("open", open);
  wrap.classList.toggle("active", open);

  if (open) {
    panel.classList.remove("hidden");

    setTimeout(() => {
      // kalau belum ada yang pernah diklik, pakai default (home)
      ensureActiveIndex();
      moveSpotTo(activeIndex, false);
      spotlight.style.opacity = 1;
    }, 50);
  } else {
    // hanya sembunyikan spotlight & panel
    spotlight.style.opacity = 0;
    panel.classList.add("hidden");
  }
}

/* ==== EVENT LISTENERS ==== */

capsule.addEventListener("click", () => setOpenState(!open));

items.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    const targetPage = btn.dataset.target; // contoh: "home"
    moveSpotTo(idx, true);

    if (targetPage) {
      const navEvent = new CustomEvent("navigate", {
        detail: { page: targetPage },
      });
      window.dispatchEvent(navEvent);
    }
  });
});

window.addEventListener("load", () => {
  // hitung ulang SPOT_SIZE kalau ada perubahan di CSS
  SPOT_SIZE =
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--spot-size")
    ) || SPOT_SIZE;

  // pastikan state awal: sidebar tertutup, activeIndex belum di-set
  setOpenState(false);
});

window.addEventListener("resize", () => {
  if (open && activeIndex >= 0) {
    // reposisi spotlight sesuai item aktif saat window berubah ukuran
    moveSpotTo(activeIndex, false);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setOpenState(false);
});

// state "selected" untuk capsule (warna pink tetap)
capsule.addEventListener("click", () => {
  capsule.classList.toggle("selected");
});
