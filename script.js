// ===== SCRIPT.JS - Universal Script untuk Semua Page =====

// ----- INJECT TOP LEFT BUTTON -----
function injectTopLeftButton() {
  // Cek apakah button sudah ada
  if (document.querySelector(".top-left")) return;

  const topLeftHTML = `
    <div class="top-left">
      <button class="logo-btn" id="menu-btn">
        <img
          src="images/logo-small.png"
          alt="OutfitSync small logo"
          class="logo-small"
        />
        <img src="assets/arrow.png" alt="Arrow icon" class="arrow-icon" />
      </button>

      <!-- Dropdown Vertical Menu -->
      <div class="dropdown-menu" id="dropdown-menu">
        <button id="profile-btn">
          <img src="assets/profile-icon.png" alt="Profile" />
        </button>
        <button id="shuffle-btn">
          <img src="assets/shuffle-icon.png" alt="Shuffle" />
        </button>
        <button id="add-btn">
          <img src="assets/add-icon.png" alt="Add" />
        </button>
        <button id="home-btn">
          <img src="assets/home-icon.png" alt="Home" />
        </button>
        <button id="wardrobe-btn">
          <img src="assets/wardrobe-icon.png" alt="Wardrobe" />
        </button>
        <button id="calendar-btn">
          <img src="assets/calendar-icon.png" alt="Calendar" />
        </button>
      </div>
    </div>
  `;

  // Insert at the beginning of body
  document.body.insertAdjacentHTML("afterbegin", topLeftHTML);

  // Initialize dropdown functionality
  initDropdown();

  // Initialize navigation
  initNavigation();
}

// ----- DROPDOWN FUNCTIONALITY -----
function initDropdown() {
  const menuBtn = document.getElementById("menu-btn");
  const dropdownMenu = document.getElementById("dropdown-menu");

  if (menuBtn && dropdownMenu) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle("show");
      menuBtn.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (!menuBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove("show");
        menuBtn.classList.remove("active");
      }
    });
  }
}

// ----- NAVIGATION FUNCTIONALITY -----
function initNavigation() {
  // Profile button
  const profileBtn = document.getElementById("profile-btn");
  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      window.location.href = "profile-page.html";
    });
  }

  // Shuffle button
  const shuffleBtn = document.getElementById("shuffle-btn");
  if (shuffleBtn) {
    shuffleBtn.addEventListener("click", () => {
      window.location.href = "shuffle-page.html";
    });
  }

  // Add button
  const addBtn = document.getElementById("add-btn");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      window.location.href = "add-page.html";
    });
  }

  // Home button
  const homeBtn = document.getElementById("home-btn");
  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      window.location.href = "home-page.html";
    });
  }

  // Wardrobe button
  const wardrobeBtn = document.getElementById("wardrobe-btn");
  if (wardrobeBtn) {
    wardrobeBtn.addEventListener("click", () => {
      window.location.href = "wardrobe-page.html";
    });
  }

  // Calendar button
  const calendarBtn = document.getElementById("calendar-btn");
  if (calendarBtn) {
    calendarBtn.addEventListener("click", () => {
      window.location.href = "calendar-page.html";
    });
  }
}

// ----- AUTO INJECT UNTUK PAGE DENGAN CLASS TERTENTU -----
document.addEventListener("DOMContentLoaded", () => {
  // Cek apakah page ini membutuhkan top-left button
  const needsButton = document.querySelector(
    ".home-page, .profile-page, .wardrobe-page, .calendar-page, .shuffle-page, .add-page"
  );

  if (needsButton) {
    injectTopLeftButton();
    document.body.style.overflow = "auto";
  }

  // Update date jika ada element date
  if (document.querySelector(".date")) {
    updateDateTime();
    updateWeather();
  }
});

// ----- UPDATE DATE & TIME (untuk homepage) -----
function updateDateTime() {
  const dateElement = document.querySelector(".date span");
  if (dateElement) {
    const now = new Date();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const dayName = days[now.getDay()];
    const month = months[now.getMonth()];
    const date = now.getDate();

    dateElement.innerHTML = `${dayName} <strong>${month} ${date}</strong> Today`;
  }
}

// ----- WEATHER (WeatherAPI.com) -----
const WEATHER_API_KEY = "810d424ddb294f039a4102022251111";
const WEATHER_API_URL = "https://api.weatherapi.com/v1/current.json";

function fetchWeather(q) {
  const url = `${WEATHER_API_URL}?key=${WEATHER_API_KEY}&q=${encodeURIComponent(
    q
  )}&aqi=no`;

  return fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error("Weather API error");
    }
    return res.json();
  });
}

function updateWeather() {
  const weatherElement = document.getElementById("weather");
  if (!weatherElement) return;

  // If somehow key missing:
  if (!WEATHER_API_KEY) {
    weatherElement.textContent = "No API key";
    return;
  }

  function renderWeather(data) {
    try {
      const temp = Math.round(data.current.temp_c);
      const conditionText = data.current.condition.text || "";
      let icon = "☀";

      const lower = conditionText.toLowerCase();
      if (lower.includes("cloud")) icon = "☁";
      else if (lower.includes("rain") || lower.includes("drizzle")) icon = "🌧";
      else if (lower.includes("storm") || lower.includes("thunder")) icon = "⛈";
      else if (lower.includes("snow") || lower.includes("sleet")) icon = "❄";
      else if (
        lower.includes("fog") ||
        lower.includes("mist") ||
        lower.includes("haze") ||
        lower.includes("smoke")
      )
        icon = "🌫";

      weatherElement.textContent = `${temp}°C ${icon}`;
    } catch (e) {
      weatherElement.textContent = "—";
    }
  }

  // Prefer geolocation if allowed
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const q = `${pos.coords.latitude},${pos.coords.longitude}`;
        fetchWeather(q)
          .then(renderWeather)
          .catch(() => {
            // fallback to fixed city (change if you like)
            fetchWeather("Jakarta")
              .then(renderWeather)
              .catch(() => (weatherElement.textContent = "—"));
          });
      },
      () => {
        // User denied/failed → fallback to fixed city
        fetchWeather("Jakarta")
          .then(renderWeather)
          .catch(() => (weatherElement.textContent = "—"));
      }
    );
  } else {
    // No geolocation support → fixed city
    fetchWeather("Jakarta")
      .then(renderWeather)
      .catch(() => (weatherElement.textContent = "—"));
  }
}


// ========== INDEX.HTML SPECIFIC CODE ==========

// ----- LANDING PAGE FADE -----
setTimeout(() => {
  const landing = document.getElementById("landing");
  const loginPage = document.getElementById("login-page");

  if (landing && loginPage) {
    landing.classList.add("fade-out");

    setTimeout(() => {
      landing.style.display = "none";
      loginPage.classList.remove("hidden");
      loginPage.classList.add("fade-in");
    }, 1000);
  }
}, 500);

// ----- PAGE SWITCHING -----
const loginPage = document.getElementById("login-page");
const signupPage = document.getElementById("signup-page");

// tombol/link "Sign up" di login page
const signUpLink = document.querySelector(".login-page .signup-text a");

// tombol/link "Sign in" di signup page
const signInLink = document.getElementById("signin-link");

if (signUpLink) {
  signUpLink.addEventListener("click", (e) => {
    e.preventDefault();
    loginPage.classList.add("hidden");
    signupPage.classList.remove("hidden");
    signupPage.classList.add("fade-in");
  });
}

if (signInLink) {
  signInLink.addEventListener("click", (e) => {
    e.preventDefault();
    signupPage.classList.add("hidden");
    loginPage.classList.remove("hidden");
    loginPage.classList.add("fade-in");
  });
}

// ----- VERIFY EMAIL PAGE -----
const signupForm = document.querySelector(".signup-form");
const verifyPage = document.getElementById("verify-page");

if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    signupPage.classList.add("hidden");
    verifyPage.classList.remove("hidden");
    verifyPage.classList.add("fade-in");
  });
}

// ----- RESEND CODE FUNCTIONALITY -----
const resendLink = document.querySelector(".resend-text a");

if (resendLink) {
  resendLink.addEventListener("click", (e) => {
    e.preventDefault();

    resendLink.textContent = "Code sent!";
    resendLink.style.pointerEvents = "none";
    resendLink.style.color = "#aaa";

    let countdown = 30;
    const parentText = resendLink.parentElement;
    const countdownText = document.createElement("span");
    countdownText.style.marginLeft = "8px";
    countdownText.style.color = "#777";
    countdownText.textContent = `Please wait ${countdown}s`;
    parentText.appendChild(countdownText);

    const interval = setInterval(() => {
      countdown--;
      countdownText.textContent = `Please wait ${countdown}s`;

      if (countdown <= 0) {
        clearInterval(interval);
        countdownText.remove();
        resendLink.textContent = "Resend Code";
        resendLink.style.pointerEvents = "auto";
        resendLink.style.color = "#000";
      }
    }, 1000);
  });
}

// ----- VERIFIED PAGE SWITCH -----
const confirmBtn = document.querySelector(".verify-page .btn-main");
const verifiedPage = document.getElementById("verified-page");

if (confirmBtn) {
  confirmBtn.addEventListener("click", (e) => {
    e.preventDefault();
    verifyPage.classList.add("hidden");
    verifiedPage.classList.remove("hidden");
    verifiedPage.classList.add("fade-in");
  });
}

// ----- DONE BUTTON (kembali ke login) -----
const doneBtn = document.querySelector(".verified-page .btn-main");

if (doneBtn) {
  doneBtn.addEventListener("click", () => {
    verifiedPage.classList.add("hidden");
    loginPage.classList.remove("hidden");
    loginPage.classList.add("fade-in");
  });
}

// ----- LOGIN -> MAIN LANDING -> HOME PAGE -----
const loginForm = document.querySelector(".login-form");
const mainLanding = document.getElementById("main-landing");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    loginPage.classList.add("hidden");
    mainLanding.classList.remove("hidden");
    mainLanding.classList.add("fade-in");

    // Setelah main landing muncul, tunggu 1.5 detik lalu redirect ke home-page.html
    setTimeout(() => {
      mainLanding.classList.add("fade-out");
      setTimeout(() => {
        window.location.href = "home-page.html";
      }, 1000);
    }, 1500);
  });
}
