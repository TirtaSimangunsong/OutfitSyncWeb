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

function moveSpotTo(index, animate = true) {
  if (index < 0 || index >= items.length) return;

  const item = items[index];

  // simpan index aktif
  activeIndex = index;

  // update state active
  items.forEach((i) => i.classList.remove("active"));
  item.classList.add("active");

  // hitung posisi tengah item relatif ke container
  const itemCenter = item.offsetTop + item.offsetHeight / 2; // tidak terpengaruh transform
  const newTop = itemCenter - SPOT_SIZE / 2; // TANPA -8 LAGI

  if (animate) {
    spotlight.style.transition = "top 420ms cubic-bezier(.2,.9,.2,1)";
    spotlight.style.transform = "translate(-50%, 0) scale(0.9)";
    void spotlight.offsetWidth; // force reflow
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

function setOpenState(isOpen) {
  open = !!isOpen;
  capsule.classList.toggle("open", open);
  wrap.classList.toggle("active", open);

  if (open) {
    panel.classList.remove("hidden");

    setTimeout(() => {
      // kalau belum ada yang pernah diklik, default ke index 0
      if (activeIndex < 0) activeIndex = 0;

      moveSpotTo(activeIndex, false);
      spotlight.style.opacity = 1;
    }, 50);
  } else {
    // hanya sembunyikan spotlight & panel
    spotlight.style.opacity = 0;
    panel.classList.add("hidden");
  }
}

capsule.addEventListener("click", () => setOpenState(!open));

items.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    const targetPage = btn.dataset.target; // Misal: "home"
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
  setOpenState(false);
  SPOT_SIZE =
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--spot-size")
    ) || SPOT_SIZE;
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
