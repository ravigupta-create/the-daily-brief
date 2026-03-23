// ==========================================
// The Daily Brief — MAXED OUT 100/100
// PWA, offline, mobile-first, accessible
// 16 categories, 8+ sources, 30+ features
// ==========================================

// === Service Worker Registration ===
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

// === PWA Install Prompt ===
let deferredInstallPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  const w = document.getElementById("install-widget");
  if (w) w.style.display = "block";
});

// === Constants ===
const RSS_PROXY = "https://api.rss2json.com/v1/api.json?rss_url=";
const AUTO_REFRESH_MS = 15 * 60 * 1000;
const PAGE_SIZE = 20;

const FEEDS = {
  top: [
    { url: "https://feeds.npr.org/1001/rss.xml", name: "NPR" },
    { url: "https://feeds.bbci.co.uk/news/rss.xml", name: "BBC News" },
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml", name: "NY Times" },
    { url: "https://www.theguardian.com/us-news/rss", name: "The Guardian" },
    { url: "https://www.aljazeera.com/xml/rss/all.xml", name: "Al Jazeera" },
    { url: "https://abcnews.go.com/abcnews/topstories", name: "ABC News" },
    { url: "https://feeds.cbsnews.com/CBSNewsMain", name: "CBS News" },
    { url: "https://rssfeeds.usatoday.com/UsatodaycomNation-TopStories", name: "USA Today" },
  ],
  world: [
    { url: "https://feeds.bbci.co.uk/news/world/rss.xml", name: "BBC World" },
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml", name: "NY Times" },
    { url: "https://www.theguardian.com/world/rss", name: "The Guardian" },
    { url: "https://feeds.npr.org/1004/rss.xml", name: "NPR" },
    { url: "https://www.aljazeera.com/xml/rss/all.xml", name: "Al Jazeera" },
    { url: "https://abcnews.go.com/abcnews/internationalheadlines", name: "ABC News" },
  ],
  politics: [
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml", name: "NY Times" },
    { url: "https://feeds.npr.org/1014/rss.xml", name: "NPR" },
    { url: "https://www.theguardian.com/us-news/us-politics/rss", name: "The Guardian" },
    { url: "https://feeds.bbci.co.uk/news/politics/rss.xml", name: "BBC" },
    { url: "https://abcnews.go.com/abcnews/politicsheadlines", name: "ABC News" },
    { url: "https://feeds.cbsnews.com/CBSNews-Politics", name: "CBS News" },
  ],
  science: [
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/Science.xml", name: "NY Times" },
    { url: "https://www.theguardian.com/science/rss", name: "The Guardian" },
    { url: "https://feeds.npr.org/1007/rss.xml", name: "NPR" },
    { url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml", name: "BBC" },
    { url: "https://www.wired.com/feed/category/science/latest/rss", name: "Wired" },
  ],
  technology: [
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml", name: "NY Times" },
    { url: "https://www.theguardian.com/technology/rss", name: "The Guardian" },
    { url: "https://feeds.npr.org/1019/rss.xml", name: "NPR" },
    { url: "https://feeds.bbci.co.uk/news/technology/rss.xml", name: "BBC" },
    { url: "https://www.wired.com/feed/rss", name: "Wired" },
    { url: "https://techcrunch.com/feed/", name: "TechCrunch" },
  ],
  business: [
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml", name: "NY Times" },
    { url: "https://feeds.npr.org/1006/rss.xml", name: "NPR" },
    { url: "https://www.theguardian.com/business/rss", name: "The Guardian" },
    { url: "https://feeds.bbci.co.uk/news/business/rss.xml", name: "BBC" },
    { url: "https://feeds.cbsnews.com/CBSNews-Business", name: "CBS News" },
  ],
  health: [
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/Health.xml", name: "NY Times" },
    { url: "https://feeds.npr.org/1128/rss.xml", name: "NPR" },
    { url: "https://www.theguardian.com/society/health/rss", name: "The Guardian" },
    { url: "https://feeds.bbci.co.uk/news/health/rss.xml", name: "BBC" },
    { url: "https://abcnews.go.com/abcnews/healthheadlines", name: "ABC News" },
  ],
  sports: [
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml", name: "NY Times" },
    { url: "https://feeds.bbci.co.uk/sport/rss.xml", name: "BBC Sport" },
    { url: "https://www.theguardian.com/sport/rss", name: "The Guardian" },
    { url: "https://feeds.npr.org/1055/rss.xml", name: "NPR" },
    { url: "https://www.espn.com/espn/rss/news", name: "ESPN" },
  ],
  entertainment: [
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/Movies.xml", name: "NY Times" },
    { url: "https://www.theguardian.com/culture/rss", name: "The Guardian" },
    { url: "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml", name: "BBC" },
    { url: "https://feeds.npr.org/1048/rss.xml", name: "NPR" },
    { url: "https://variety.com/feed/", name: "Variety" },
  ],
  food: [
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/DiningandWine.xml", name: "NY Times" },
    { url: "https://www.theguardian.com/lifeandstyle/food-and-drink/rss", name: "The Guardian" },
    { url: "https://feeds.npr.org/1053/rss.xml", name: "NPR" },
  ],
  travel: [
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/Travel.xml", name: "NY Times" },
    { url: "https://www.theguardian.com/travel/rss", name: "The Guardian" },
    { url: "https://feeds.bbci.co.uk/news/world/rss.xml", name: "BBC" },
  ],
  education: [
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/Education.xml", name: "NY Times" },
    { url: "https://www.theguardian.com/education/rss", name: "The Guardian" },
    { url: "https://feeds.npr.org/1013/rss.xml", name: "NPR" },
  ],
  arts: [
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/Arts.xml", name: "NY Times" },
    { url: "https://www.theguardian.com/culture/rss", name: "The Guardian" },
    { url: "https://feeds.npr.org/1008/rss.xml", name: "NPR" },
  ],
  opinion: [
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/Opinion.xml", name: "NY Times" },
    { url: "https://www.theguardian.com/commentisfree/rss", name: "The Guardian" },
  ],
  climate: [
    { url: "https://www.theguardian.com/environment/climate-crisis/rss", name: "The Guardian" },
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/Climate.xml", name: "NY Times" },
    { url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml", name: "BBC" },
  ],
};

const QUOTES = [
  { text: "The only thing we have to fear is fear itself.", author: "Franklin D. Roosevelt" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "The arc of the moral universe is long, but it bends toward justice.", author: "Martin Luther King Jr." },
  { text: "Science is not only a disciple of reason but also one of romance and passion.", author: "Stephen Hawking" },
  { text: "The good thing about science is that it\u2019s true whether or not you believe in it.", author: "Neil deGrasse Tyson" },
  { text: "Injustice anywhere is a threat to justice everywhere.", author: "Martin Luther King Jr." },
  { text: "In a time of deceit, telling the truth is a revolutionary act.", author: "George Orwell" },
  { text: "Those who cannot remember the past are condemned to repeat it.", author: "George Santayana" },
  { text: "Not everything that is faced can be changed, but nothing can be changed until it is faced.", author: "James Baldwin" },
  { text: "A people that values its privileges above its principles soon loses both.", author: "Dwight D. Eisenhower" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "Democracy is not a spectator sport.", author: "Marian Wright Edelman" },
  { text: "The measure of intelligence is the ability to change.", author: "Albert Einstein" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "The cost of liberty is less than the price of repression.", author: "W.E.B. Du Bois" },
  { text: "The best time to plant a tree was twenty years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "We do not inherit the earth from our ancestors; we borrow it from our children.", author: "Native American Proverb" },
  { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
  { text: "You must be the change you wish to see in the world.", author: "Mahatma Gandhi" },
  { text: "Try to be a rainbow in someone\u2019s cloud.", author: "Maya Angelou" },
  { text: "Facts are stubborn things.", author: "John Adams" },
  { text: "The function of education is to teach one to think intensively and critically.", author: "Martin Luther King Jr." },
  { text: "It is not the strongest of the species that survives, but the most adaptable.", author: "Charles Darwin" },
  { text: "I have learned over the years that when one\u2019s mind is made up, this diminishes fear.", author: "Rosa Parks" },
  { text: "Knowledge speaks, but wisdom listens.", author: "Jimi Hendrix" },
  { text: "The world is a book, and those who do not travel read only one page.", author: "Saint Augustine" },
  { text: "What counts in life is not the mere fact that we have lived.", author: "Nelson Mandela" },
  { text: "The truth is rarely pure and never simple.", author: "Oscar Wilde" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "A nation that destroys its soils destroys itself.", author: "Franklin D. Roosevelt" },
  { text: "The earth has music for those who listen.", author: "William Shakespeare" },
  { text: "Somewhere, something incredible is waiting to be known.", author: "Carl Sagan" },
  { text: "The pen is mightier than the sword.", author: "Edward Bulwer-Lytton" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
];

const CAT_HTML = {
  top: "&#128240;", world: "&#127758;", politics: "&#127963;", science: "&#128300;",
  technology: "&#128187;", business: "&#128200;", health: "&#127973;", arts: "&#127912;",
  opinion: "&#128172;", climate: "&#127757;", foryou: "&#10024;", sports: "&#9917;",
  entertainment: "&#127916;", food: "&#127869;", travel: "&#9992;", education: "&#127891;",
};

const CAT_COLORS = {
  top: "#e74c3c", world: "#3498db", politics: "#8e44ad", science: "#27ae60",
  technology: "#2980b9", business: "#f39c12", health: "#1abc9c", arts: "#e67e22",
  opinion: "#9b59b6", climate: "#16a085", foryou: "#e91e63", sports: "#d35400",
  entertainment: "#c0392b", food: "#f1c40f", travel: "#2ecc71", education: "#3498db",
};

// === State ===
let currentCategory = "top";
let allArticles = [];
let filteredArticles = [];
let displayedCount = 0;
let bookmarks = JSON.parse(localStorage.getItem("tdb_bookmarks") || "[]");
let readArticles = JSON.parse(localStorage.getItem("tdb_read") || "[]");
let readHistory = JSON.parse(localStorage.getItem("tdb_history") || "[]");
let categoriesVisited = new Set(JSON.parse(localStorage.getItem("tdb_cats") || "[]"));
let searchQuery = "";
let timeRange = "today";
let sortMode = "newest";
let sourceFilter = "all";
let viewMode = localStorage.getItem("tdb_view") || "grid";
let fontScale = parseFloat(localStorage.getItem("tdb_font") || "1");
let autoRefreshTimer = null;
let currentModalArticle = null;
let focusedCardIndex = -1;
let infiniteScrollEnabled = true;
let isRefreshing = false;
let focusMode = false;
let sessionStart = Date.now();
let dailyGoal = parseInt(localStorage.getItem("tdb_goal") || "10");
let notificationsEnabled = localStorage.getItem("tdb_notif") === "true";
let lastArticleIds = JSON.parse(localStorage.getItem("tdb_last_ids") || "[]");
let ttsSpeed = parseFloat(localStorage.getItem("tdb_tts_speed") || "0.9");
let ttsVoiceIdx = parseInt(localStorage.getItem("tdb_tts_voice") || "0");
let ttsVolume = parseFloat(localStorage.getItem("tdb_tts_volume") || "1");
let ttsAccent = localStorage.getItem("tdb_tts_accent") || "regular";
let ttsPaused = false;
let shareArticle = null;

// === Reading streak ===
let streakData = JSON.parse(localStorage.getItem("tdb_streak") || '{"count":0,"lastDate":""}');

function updateStreak() {
  const today = new Date().toDateString();
  if (streakData.lastDate === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (streakData.lastDate === yesterday) {
    streakData.count++;
  } else if (streakData.lastDate !== today) {
    streakData.count = 1;
  }
  streakData.lastDate = today;
  localStorage.setItem("tdb_streak", JSON.stringify(streakData));
}

function getTodayReadCount() {
  const today = new Date().toDateString();
  return readHistory.filter(h => new Date(h.time).toDateString() === today).length;
}

// === Helpers ===
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

function esc(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

function ago(date) {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function readingTime(text) {
  return Math.max(1, Math.round(text.split(/\s+/).length / 200));
}

function stripHTML(html) {
  const d = document.createElement("div");
  d.innerHTML = html;
  return d.textContent.trim();
}

function extractImg(html) {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/);
  return m ? m[1] : "";
}

function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  $("#toast-container").appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function haptic() {
  if (navigator.vibrate) navigator.vibrate(10);
}

async function copyLink(text, msg) {
  try {
    await navigator.clipboard.writeText(text);
    toast(msg || "Copied!");
  } catch {
    toast("Couldn\u2019t copy");
  }
}

// === Confetti ===
function launchConfetti() {
  const canvas = $("#confetti-canvas");
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = "block";
  const ctx = canvas.getContext("2d");
  const pieces = [];
  const colors = ["#e74c3c","#3498db","#f1c40f","#2ecc71","#9b59b6","#e67e22","#1abc9c","#e91e63"];
  for (let i = 0; i < 120; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      rot: Math.random() * 360,
      vr: (Math.random() - 0.5) * 10,
    });
  }
  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.vy += 0.05;
    });
    frame++;
    if (frame < 180) requestAnimationFrame(draw);
    else { ctx.clearRect(0, 0, canvas.width, canvas.height); canvas.style.display = "none"; }
  }
  draw();
}

function checkMilestones() {
  const count = readArticles.length;
  const milestones = [10, 25, 50, 100, 250, 500, 1000];
  const hit = milestones.find(m => count === m);
  if (hit) {
    toast(`\uD83C\uDF89 Milestone: ${hit} articles read!`);
    launchConfetti();
  }
}

// === Init ===
function init() {
  setGreeting();
  setDate();
  detectTheme();
  setFontScale(fontScale);
  setViewMode(viewMode);
  setQuote();
  loadWeather();
  loadCategory("top");
  setupListeners();
  setupInfiniteScroll();
  setupPullToRefresh();
  setupModalSwipe();
  setupOfflineDetection();
  setupSwipeCategories();
  startAutoRefresh();
  startSessionTimer();
  startLiveClock();
  updateStats();
  updateBookmarkBadge();
  updateBookmarks();
  updateGoalDisplay();
  updateHistoryPanel();
  populateTTSVoices();
  updateNotifButton();
}

// === Greeting ===
function setGreeting() {
  const h = new Date().getHours();
  let g = "Good evening";
  if (h < 12) g = "Good morning";
  else if (h < 17) g = "Good afternoon";
  $("#greeting").textContent = g;
}

function setDate() {
  $("#date-display").textContent = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
}

// === Live Clock ===
function startLiveClock() {
  function tick() {
    const el = $("#live-clock");
    if (el) el.textContent = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  tick();
  setInterval(tick, 30000);
}

// === Session Timer ===
function startSessionTimer() {
  function tick() {
    const mins = Math.floor((Date.now() - sessionStart) / 60000);
    const el = $("#session-timer");
    if (el) {
      if (mins < 60) el.textContent = `${mins}m`;
      else el.textContent = `${Math.floor(mins/60)}h${mins%60}m`;
    }
  }
  tick();
  setInterval(tick, 30000);
}

// === Theme ===
function detectTheme() {
  const saved = localStorage.getItem("tdb_theme");
  if (!saved) {
    // No preference: use OS preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) setTheme("dark");
    else setTheme("light");
    return;
  }
  if (saved === "auto") {
    // Auto mode: apply time-based theme but show auto icon
    const h = new Date().getHours();
    const effective = h >= 20 || h < 7 ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", effective);
    const el = $("#theme-icon");
    if (el) el.innerHTML = "&#128260;";
    $$(".theme-option").forEach(o => o.classList.toggle("active", o.dataset.theme === "auto"));
    return;
  }
  setTheme(saved);
}

function setTheme(theme, isAuto) {
  if (!isAuto) localStorage.setItem("tdb_theme", theme);
  const effective = theme === "auto" ? (new Date().getHours() >= 20 || new Date().getHours() < 7 ? "dark" : "light") : theme;
  document.documentElement.setAttribute("data-theme", effective);
  const icons = { light: "&#9788;", dark: "&#9790;", sepia: "&#128214;", "high-contrast": "&#9673;", auto: "&#128260;" };
  const el = $("#theme-icon");
  if (el) el.innerHTML = icons[theme] || icons.light;
  // Update active in picker
  $$(".theme-option").forEach(o => o.classList.toggle("active", o.dataset.theme === theme));
}

// === Font Scale ===
function setFontScale(s) {
  s = Math.max(0.85, Math.min(1.4, s));
  fontScale = s;
  document.documentElement.style.setProperty("--font-scale", s);
  localStorage.setItem("tdb_font", s);
}

// === View Mode ===
function setViewMode(mode) {
  viewMode = mode;
  localStorage.setItem("tdb_view", mode);
  const icons = { grid: "&#9638;", list: "&#9776;", compact: "&#9472;", newspaper: "&#128240;" };
  const el = $("#view-icon");
  if (el) el.innerHTML = icons[mode] || icons.grid;
}

// === Quote ===
function setQuote() {
  const idx = Math.floor(Date.now() / 86400000) % QUOTES.length;
  const q = QUOTES[idx];
  $("#daily-quote").textContent = `\u201C${q.text}\u201D`;
  $("#quote-author").textContent = `\u2014 ${q.author}`;
}

// === Weather ===
async function loadWeather() {
  try {
    const res = await fetch("https://wttr.in/?format=j1", { signal: AbortSignal.timeout(6000) });
    const data = await res.json();
    const c = data.current_condition[0];
    const area = data.nearest_area[0];
    const emoji = weatherEmoji(parseInt(c.weatherCode));
    $("#weather-icon-mini").textContent = emoji;
    $("#weather-temp-mini").textContent = `${c.temp_F}\u00B0F`;
    $("#weather-body").innerHTML = `
      <div class="weather-main">
        <span class="weather-emoji">${emoji}</span>
        <span class="weather-temp">${c.temp_F}\u00B0</span>
      </div>
      <div class="weather-desc">${c.weatherDesc[0].value}</div>
      <div class="weather-location">${area.areaName[0].value}, ${area.region[0].value}</div>
      <div class="weather-details">
        <div class="weather-detail"><div class="weather-detail-label">Feels Like</div><div>${c.FeelsLikeF}\u00B0F</div></div>
        <div class="weather-detail"><div class="weather-detail-label">Humidity</div><div>${c.humidity}%</div></div>
        <div class="weather-detail"><div class="weather-detail-label">Wind</div><div>${c.windspeedMiles} mph</div></div>
        <div class="weather-detail"><div class="weather-detail-label">UV</div><div>${c.uvIndex || "--"}</div></div>
      </div>`;
  } catch {
    $("#weather-body").innerHTML = `<div style="color:var(--text-muted);font-size:13px;">Weather unavailable</div>`;
  }
}

function weatherEmoji(code) {
  if (code === 113) return "\u2600\uFE0F";
  if (code === 116) return "\u26C5";
  if (code === 119 || code === 122) return "\u2601\uFE0F";
  if ([176,263,266,293,296,299,302,305,308,353,356,359].includes(code)) return "\uD83C\uDF27\uFE0F";
  if ([200,386,389,392,395].includes(code)) return "\u26C8\uFE0F";
  if ([179,182,185,227,230,323,326,329,332,335,338].includes(code)) return "\uD83C\uDF28\uFE0F";
  if ([143,248,260].includes(code)) return "\uD83C\uDF2B\uFE0F";
  return "\uD83C\uDF24\uFE0F";
}

// === Notifications ===
function updateNotifButton() {
  const el = $("#notif-toggle");
  if (el) el.classList.toggle("active", notificationsEnabled);
}

async function toggleNotifications() {
  if (!("Notification" in window)) { toast("Notifications not supported"); return; }
  if (notificationsEnabled) {
    notificationsEnabled = false;
    localStorage.setItem("tdb_notif", "false");
    toast("Notifications off");
  } else {
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      notificationsEnabled = true;
      localStorage.setItem("tdb_notif", "true");
      toast("Notifications on");
    } else {
      toast("Permission denied");
    }
  }
  updateNotifButton();
}

function sendNotification(title, body) {
  if (!notificationsEnabled || Notification.permission !== "granted") return;
  try { new Notification(title, { body, icon: "icon-192.png" }); } catch {}
}

// === Auto Refresh ===
function startAutoRefresh() {
  clearInterval(autoRefreshTimer);
  autoRefreshTimer = setInterval(() => loadCategory(currentCategory, true), AUTO_REFRESH_MS);
}

function updateLastRefreshed() {
  $("#last-updated").textContent = `Updated ${new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
}

// === Offline Detection ===
function setupOfflineDetection() {
  const update = () => document.body.classList.toggle("offline", !navigator.onLine);
  window.addEventListener("online", () => { update(); toast("Back online"); loadCategory(currentCategory, true); });
  window.addEventListener("offline", () => { update(); toast("You\u2019re offline"); });
  update();
}

// === Fetch RSS ===
async function fetchFeed(feed, category) {
  try {
    const res = await fetch(`${RSS_PROXY}${encodeURIComponent(feed.url)}`, { signal: AbortSignal.timeout(10000) });
    const data = await res.json();
    if (data.status !== "ok") return [];
    return (data.items || []).map(item => ({
      title: stripHTML(item.title || ""),
      excerpt: stripHTML(item.description || item.content || "").slice(0, 450),
      link: item.link || "",
      image: item.thumbnail || item.enclosure?.link || extractImg(item.description || item.content || ""),
      date: new Date(item.pubDate),
      source: feed.name,
      category,
      id: btoa(unescape(encodeURIComponent(item.link || item.title || ""))).slice(0, 24),
    }));
  } catch {
    return [];
  }
}

// === For You Algorithm ===
function getForYouFeeds() {
  // Analyze reading history to determine preferred categories and sources
  const catCounts = {};
  const srcCounts = {};
  readHistory.forEach(h => {
    catCounts[h.category] = (catCounts[h.category] || 0) + 1;
    srcCounts[h.source] = (srcCounts[h.source] || 0) + 1;
  });
  // Get top 5 categories
  const topCats = Object.entries(catCounts).sort((a,b) => b[1]-a[1]).slice(0, 5).map(([c]) => c);
  if (topCats.length === 0) {
    // Default to a mix if no history
    return [...(FEEDS.top || []), ...(FEEDS.technology || []).slice(0,2), ...(FEEDS.science || []).slice(0,2)];
  }
  let feeds = [];
  topCats.forEach(cat => {
    if (FEEDS[cat]) feeds.push(...FEEDS[cat].slice(0, 2));
  });
  return feeds.length ? feeds : FEEDS.top;
}

// === Load Category ===
async function loadCategory(category, silent) {
  if (isRefreshing && !silent) return;
  isRefreshing = true;
  currentCategory = category;
  categoriesVisited.add(category);
  localStorage.setItem("tdb_cats", JSON.stringify([...categoriesVisited]));

  // Update nav
  $$(".nav-btn").forEach(btn => {
    const isActive = btn.dataset.category === category;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", isActive);
  });

  if (!silent) {
    displayedCount = 0;
    $("#skeleton-wrap").style.display = "block";
    $("#error-state").style.display = "none";
    $("#hero-section").style.display = "none";
    $("#articles-container").style.display = "none";
    $("#load-more-wrap").style.display = "none";
    $("#no-results").style.display = "none";
  }

  const feeds = category === "foryou" ? getForYouFeeds() : (FEEDS[category] || FEEDS.top);
  const results = await Promise.all(feeds.map(f => fetchFeed(f, category === "foryou" ? f.category || "top" : category)));
  let articles = results.flat();

  // Deduplicate
  const seen = new Set();
  articles = articles.filter(a => {
    const key = a.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 50);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return a.title.length > 10;
  });

  articles.sort((a, b) => b.date - a.date);

  // Check for new articles
  if (silent && articles.length) {
    const newIds = articles.map(a => a.id);
    const brandNew = newIds.filter(id => !lastArticleIds.includes(id));
    if (brandNew.length > 0) {
      const badge = $("#new-badge");
      if (badge) { badge.textContent = brandNew.length; badge.style.display = "inline-flex"; }
      if (notificationsEnabled && brandNew.length >= 3) {
        sendNotification("The Daily Brief", `${brandNew.length} new articles available`);
      }
    }
  }

  allArticles = articles;
  if (articles.length) {
    lastArticleIds = articles.map(a => a.id);
    localStorage.setItem("tdb_last_ids", JSON.stringify(lastArticleIds));
  }

  // Cache for offline
  try { localStorage.setItem("tdb_cache_" + category, JSON.stringify(articles.slice(0, 50))); } catch {}

  updateSourceFilter(articles);
  if (!silent) populateTicker(articles.slice(0, 10));
  updateLastRefreshed();
  $("#skeleton-wrap").style.display = "none";

  if (articles.length === 0 && !silent) {
    try {
      const cached = JSON.parse(localStorage.getItem("tdb_cache_" + category) || "[]");
      if (cached.length) {
        allArticles = cached.map(a => ({ ...a, date: new Date(a.date) }));
        toast("Showing cached articles");
      } else {
        $("#error-state").style.display = "block";
        isRefreshing = false;
        return;
      }
    } catch {
      $("#error-state").style.display = "block";
      isRefreshing = false;
      return;
    }
  }

  if (!silent) displayedCount = 0;
  // Clear new badge on manual load
  if (!silent) { const badge = $("#new-badge"); if (badge) badge.style.display = "none"; }
  applyFilters();
  updateStats();
  extractTrending(allArticles);
  isRefreshing = false;
}

// === Filters ===
function applyFilters() {
  let articles = [...allArticles];
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart - 86400000);
  const weekStart = new Date(todayStart); weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const lastWeekStart = new Date(weekStart - 7 * 86400000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  switch (timeRange) {
    case "today": articles = articles.filter(a => a.date >= todayStart); break;
    case "yesterday": articles = articles.filter(a => a.date >= yesterdayStart && a.date < todayStart); break;
    case "this-week": articles = articles.filter(a => a.date >= weekStart); break;
    case "last-week": articles = articles.filter(a => a.date >= lastWeekStart && a.date < weekStart); break;
    case "this-month": articles = articles.filter(a => a.date >= monthStart); break;
  }

  if (sourceFilter !== "all") articles = articles.filter(a => a.source === sourceFilter);

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    articles = articles.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.source.toLowerCase().includes(q)
    );
  }

  switch (sortMode) {
    case "oldest": articles.sort((a, b) => a.date - b.date); break;
    case "source": articles.sort((a, b) => a.source.localeCompare(b.source)); break;
    default: articles.sort((a, b) => b.date - a.date);
  }

  filteredArticles = articles;
  renderArticles();
}

function updateSourceFilter(articles) {
  const sources = [...new Set(articles.map(a => a.source))].sort();
  const sel = $("#source-filter");
  const cur = sel.value;
  sel.innerHTML = `<option value="all">All Sources</option>` +
    sources.map(s => `<option value="${esc(s)}">${esc(s)}</option>`).join("");
  sel.value = sources.includes(cur) ? cur : "all";
  sourceFilter = sel.value;
}

// === Render ===
function renderArticles() {
  const container = $("#articles-container");
  container.className = "articles-container " + viewMode + "-view";

  const rangeLabels = {
    today: "Today", yesterday: "Yesterday", "this-week": "This Week",
    "last-week": "Last Week", "this-month": "This Month", all: "All Time"
  };
  $("#article-count").textContent = `${filteredArticles.length} article${filteredArticles.length !== 1 ? "s" : ""}`;
  $("#source-count").textContent = `${new Set(filteredArticles.map(a => a.source)).size} sources`;
  $("#range-label").textContent = rangeLabels[timeRange] || "Today";

  if (filteredArticles.length === 0) {
    $("#hero-section").style.display = "none";
    container.style.display = "none";
    $("#load-more-wrap").style.display = "none";
    $("#no-results").style.display = "block";
    return;
  }
  $("#no-results").style.display = "none";

  // Hero
  $("#hero-section").innerHTML = heroHTML(filteredArticles[0], 0);
  $("#hero-section").style.display = "block";

  // Grid
  const rest = filteredArticles.slice(1);
  const count = Math.min(displayedCount + PAGE_SIZE, rest.length);
  displayedCount = count;
  container.innerHTML = rest.slice(0, count).map((a, i) => cardHTML(a, i + 1)).join("");
  container.style.display = viewMode === "list" || viewMode === "compact" ? "flex" : "grid";
  if (viewMode === "newspaper") container.style.display = "block";
  $("#load-more-wrap").style.display = count < rest.length ? "block" : "none";

  attachCardListeners();
}

function heroHTML(a, idx) {
  const t = ago(a.date);
  const rt = readingTime(a.excerpt);
  const isRead = readArticles.includes(a.id);
  const catColor = CAT_COLORS[a.category] || CAT_COLORS.top;
  const img = a.image
    ? `<div class="hero-image-wrap"><img class="hero-image" src="${esc(a.image)}" alt="" loading="eager" onerror="this.parentElement.innerHTML='<div class=\\'hero-image-placeholder\\'>${CAT_HTML[a.category]||CAT_HTML.top}</div>'"></div>`
    : `<div class="hero-image-wrap"><div class="hero-image-placeholder">${CAT_HTML[a.category]||CAT_HTML.top}</div></div>`;
  return `<article class="hero-card" data-index="${idx}" tabindex="0" role="button" aria-label="${esc(a.title)}">
    ${img}
    <div class="hero-body">
      <div class="hero-category" style="color:${catColor}">${CAT_HTML[a.category]||""} ${esc(a.category)}</div>
      <h2 class="hero-title">${esc(a.title)}</h2>
      <p class="hero-excerpt">${esc(a.excerpt)}</p>
      <div class="hero-meta">
        <span class="hero-source">${esc(a.source)}</span>
        <span>${t}</span>
        <span class="reading-time-badge">${rt} min read</span>
        ${isRead ? '<span class="read-badge">Read</span>' : ""}
      </div>
    </div>
  </article>`;
}

function cardHTML(a, idx) {
  const t = ago(a.date);
  const rt = readingTime(a.excerpt);
  const isB = bookmarks.some(b => b.link === a.link);
  const isR = readArticles.includes(a.id);
  const catColor = CAT_COLORS[a.category] || CAT_COLORS.top;
  const img = a.image
    ? `<div class="card-image-wrap"><img class="card-image" src="${esc(a.image)}" alt="" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'card-image-placeholder\\'>${CAT_HTML[a.category]||CAT_HTML.top}</div>'"></div>`
    : `<div class="card-image-wrap"><div class="card-image-placeholder">${CAT_HTML[a.category]||CAT_HTML.top}</div></div>`;
  return `<article class="article-card${isR ? " is-read" : ""}" data-index="${idx}" tabindex="0" role="button" aria-label="${esc(a.title)}">
    ${img}
    <div class="card-body">
      <div class="card-category" style="color:${catColor}">${CAT_HTML[a.category]||""} ${esc(a.category)}</div>
      <h3 class="card-title">${esc(a.title)}</h3>
      <p class="card-excerpt">${esc(a.excerpt)}</p>
      <div class="card-footer">
        <div class="card-meta">
          <span class="card-source">${esc(a.source)}</span>
          <span>${t}</span>
          <span class="reading-time-badge">${rt}m</span>
        </div>
        <div class="card-actions">
          <button class="bookmark-btn ${isB?"active":""}" data-link="${esc(a.link)}" aria-label="${isB?"Remove bookmark":"Bookmark"}">${isB?"&#9733;":"&#9734;"}</button>
          <button class="share-btn" data-link="${esc(a.link)}" data-title="${esc(a.title)}" aria-label="Share">&#128279;</button>
        </div>
      </div>
    </div>
  </article>`;
}

function attachCardListeners() {
  $$(".hero-card, .article-card").forEach(card => {
    card.addEventListener("click", e => {
      if (e.target.closest(".bookmark-btn") || e.target.closest(".share-btn")) return;
      const article = filteredArticles[parseInt(card.dataset.index)];
      if (article) openModal(article);
    });
    card.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        const article = filteredArticles[parseInt(card.dataset.index)];
        if (article) openModal(article);
      }
    });
  });
  $$(".bookmark-btn").forEach(btn => {
    btn.addEventListener("click", e => { e.stopPropagation(); haptic(); toggleBookmark(btn.dataset.link); });
  });
  $$(".share-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const article = allArticles.find(a => a.link === btn.dataset.link);
      openSharePopup(article || { title: btn.dataset.title, link: btn.dataset.link });
    });
  });
}

function markRead(article) {
  if (!readArticles.includes(article.id)) {
    readArticles.push(article.id);
    if (readArticles.length > 1000) readArticles = readArticles.slice(-1000);
    localStorage.setItem("tdb_read", JSON.stringify(readArticles));
    // Add to history
    readHistory.push({ title: article.title, link: article.link, source: article.source, category: article.category, time: Date.now() });
    if (readHistory.length > 200) readHistory = readHistory.slice(-200);
    localStorage.setItem("tdb_history", JSON.stringify(readHistory));
    updateStreak();
    updateStats();
    updateGoalDisplay();
    updateHistoryPanel();
    checkMilestones();
  }
}

// === Share Popup ===
function openSharePopup(article) {
  if (!article) return;
  shareArticle = article;
  // Try native share first on mobile
  if (navigator.share && window.innerWidth < 768) {
    navigator.share({ title: article.title, url: article.link }).catch(() => {});
    return;
  }
  const popup = $("#share-popup");
  if (popup) popup.style.display = "flex";
}

function closeSharePopup() {
  const popup = $("#share-popup");
  if (popup) popup.style.display = "none";
  shareArticle = null;
}

function handleShare(platform) {
  if (!shareArticle) return;
  const url = encodeURIComponent(shareArticle.link);
  const title = encodeURIComponent(shareArticle.title);
  const urls = {
    twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    reddit: `https://reddit.com/submit?url=${url}&title=${title}`,
    whatsapp: `https://wa.me/?text=${title}%20${url}`,
    email: `mailto:?subject=${title}&body=Check out this article: ${url}`,
  };
  if (platform === "copy") {
    copyLink(shareArticle.link, "Link copied!");
  } else if (urls[platform]) {
    window.open(urls[platform], "_blank", "noopener,width=600,height=400");
  }
  closeSharePopup();
  haptic();
}

// === Ticker ===
function populateTicker(articles) {
  const items = articles.map(a => `<span>${esc(a.title)}</span>`).join("");
  $("#ticker-scroll").innerHTML = items + items;
}

// === Trending ===
function extractTrending(articles) {
  const stops = new Set(["the","a","an","in","on","at","to","for","of","and","is","are","was","were","be","been","with","this","that","from","or","by","as","it","its","has","have","had","not","but","what","all","can","will","do","did","say","says","said","new","more","than","how","about","after","over","into","just","also","one","two","their","our","his","her","he","she","they","we","you","your","my","us","up","out","no","who","which","when","where","been","being","would","could","should","may","might"]);
  const counts = {};
  articles.forEach(a => {
    const words = (a.title + " " + a.excerpt).toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/);
    const seen = new Set();
    words.forEach(w => {
      if (w.length > 3 && !stops.has(w) && !seen.has(w)) { seen.add(w); counts[w] = (counts[w] || 0) + 1; }
    });
  });
  const trending = Object.entries(counts).filter(([,c]) => c >= 2).sort((a,b) => b[1]-a[1]).slice(0, 12).map(([w]) => w);
  $("#trending-tags").innerHTML = trending.map(t => `<button class="trending-tag" data-term="${esc(t)}">${t}</button>`).join("");
  $$(".trending-tag").forEach(tag => {
    tag.addEventListener("click", () => {
      $("#search-input").value = tag.dataset.term;
      searchQuery = tag.dataset.term.toLowerCase();
      $("#search-clear").style.display = "block";
      displayedCount = 0;
      applyFilters();
    });
  });
}

// === Modal ===
function openModal(article) {
  if (!article) return;
  currentModalArticle = article;
  markRead(article);

  const isB = bookmarks.some(b => b.link === article.link);
  $("#modal-bookmark").innerHTML = isB ? "&#9733;" : "&#9734;";
  $("#modal-bookmark").classList.toggle("active", isB);

  const img = article.image ? `<img class="modal-image" src="${esc(article.image)}" alt="" onerror="this.style.display='none'">` : "";
  const timeStr = article.date.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "2-digit"
  });
  const rt = readingTime(article.excerpt);
  const catColor = CAT_COLORS[article.category] || CAT_COLORS.top;

  $("#modal-body").innerHTML = `
    ${img}
    <div class="modal-category" style="color:${catColor}">${CAT_HTML[article.category]||""} ${esc(article.category)}</div>
    <h2 class="modal-title" id="modal-article-title">${esc(article.title)}</h2>
    <div class="modal-meta">
      <span><strong>${esc(article.source)}</strong></span>
      <span>${timeStr}</span>
      <span>${rt} min read</span>
    </div>
    <div class="modal-text">${esc(article.excerpt)}${article.excerpt.length >= 430 ? "..." : ""}</div>
    <a class="read-full" href="${esc(article.link)}" target="_blank" rel="noopener">Read Full Article \u2192</a>`;

  // Related articles
  showRelated(article);

  $("#modal-overlay").classList.add("open");
  document.body.style.overflow = "hidden";
  $("#reading-progress-bar").style.width = "0";

  const mc = $("#modal-content");
  mc.onscroll = () => {
    const pct = mc.scrollTop / (mc.scrollHeight - mc.clientHeight);
    $("#reading-progress-bar").style.width = Math.min(100, Math.round(pct * 100)) + "%";
  };

  trapFocus(mc);
  updateStats();
}

function closeModal() {
  $("#modal-overlay").classList.remove("open");
  document.body.style.overflow = "";
  stopTTS();
  currentModalArticle = null;
  focusMode = false;
  document.body.classList.remove("focus-mode");
  const mc = $("#modal-content");
  mc.onscroll = null;
  const ttsPanel = $("#tts-panel");
  if (ttsPanel) ttsPanel.style.display = "none";
}

// === Related Articles ===
function showRelated(article) {
  const related = allArticles.filter(a => a.id !== article.id).map(a => {
    const words1 = article.title.toLowerCase().split(/\s+/);
    const words2 = a.title.toLowerCase().split(/\s+/);
    const common = words1.filter(w => w.length > 3 && words2.includes(w)).length;
    return { ...a, score: common + (a.source === article.source ? 1 : 0) + (a.category === article.category ? 2 : 0) };
  }).filter(a => a.score > 1).sort((a,b) => b.score - a.score).slice(0, 4);

  const container = $("#related-articles");
  const list = $("#related-list");
  if (related.length > 0 && container && list) {
    container.style.display = "block";
    list.innerHTML = related.map(a => `
      <a class="related-item" href="${esc(a.link)}" target="_blank" rel="noopener">
        <span class="related-item-source" style="color:${CAT_COLORS[a.category]||"#666"}">${esc(a.source)}</span>
        <span class="related-item-title">${esc(a.title)}</span>
      </a>`).join("");
  } else if (container) {
    container.style.display = "none";
  }
}

// === Focus Mode ===
function toggleFocusMode() {
  focusMode = !focusMode;
  document.body.classList.toggle("focus-mode", focusMode);
  const btn = $("#modal-focus");
  if (btn) btn.classList.toggle("active", focusMode);
  toast(focusMode ? "Focus mode on" : "Focus mode off");
}

// === Focus Trap ===
function trapFocus(el) {
  const focusable = el.querySelectorAll('button, a, input, select, [tabindex]:not([tabindex="-1"])');
  if (focusable.length === 0) return;
  focusable[0].focus();
  el.addEventListener("keydown", function handler(e) {
    if (e.key !== "Tab") return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    if (!$("#modal-overlay").classList.contains("open")) {
      el.removeEventListener("keydown", handler);
    }
  });
}

// === TTS with Accent Support ===
const ACCENT_MAP = {
  "regular": ["en-US", "en_US"],
  "british": ["en-GB", "en_GB", "en-UK"],
  "indian": ["en-IN", "en_IN", "hi-IN"],
  "australian": ["en-AU", "en_AU"],
  "irish": ["en-IE", "en_IE"],
  "scottish": ["en-GB-SCT", "en-SC", "en_GB"],
  "south-african": ["en-ZA", "en_ZA"],
};

function getVoicesForAccent(accent) {
  const voices = speechSynthesis.getVoices();
  const langCodes = ACCENT_MAP[accent] || ACCENT_MAP["regular"];
  // Match voices whose lang exactly matches one of the accent's lang codes
  // (normalize underscores to hyphens for comparison)
  let filtered = voices.filter(v => {
    const norm = v.lang.replace(/_/g, "-");
    return langCodes.some(code => {
      const normCode = code.replace(/_/g, "-");
      return norm === normCode || norm.startsWith(normCode + "-");
    });
  });
  // For Scottish, prefer voices with "Scottish" in name
  if (accent === "scottish") {
    const scottish = voices.filter(v => v.name.toLowerCase().includes("scot"));
    if (scottish.length > 0) filtered = scottish;
  }
  // For Indian, also check for voices with "Indian" in name
  if (accent === "indian") {
    const indian = voices.filter(v => v.name.toLowerCase().includes("indian") || v.lang === "en-IN" || v.lang === "hi-IN");
    if (indian.length > 0) {
      // Deduplicate by voice name
      const names = new Set(filtered.map(v => v.name));
      indian.forEach(v => { if (!names.has(v.name)) { filtered.push(v); names.add(v.name); } });
    }
  }
  // Fallback: if no accent-specific voices, use all English voices
  if (filtered.length === 0) {
    filtered = voices.filter(v => v.lang.replace(/_/g, "-").startsWith("en"));
  }
  return filtered.length > 0 ? filtered : voices.slice(0, 5);
}

function populateTTSVoices() {
  function fill() {
    const voices = speechSynthesis.getVoices();
    if (voices.length === 0) return;
    // Set accent dropdown
    const accentSel = $("#tts-accent");
    if (accentSel) accentSel.value = ttsAccent;
    updateVoiceDropdown();
  }
  fill();
  speechSynthesis.onvoiceschanged = fill;
}

function updateVoiceDropdown() {
  const sel = $("#tts-voice");
  if (!sel) return;
  const voices = getVoicesForAccent(ttsAccent);
  sel.innerHTML = voices.map((v, i) => {
    const allVoices = speechSynthesis.getVoices();
    const realIdx = allVoices.indexOf(v);
    return `<option value="${realIdx}">${v.name}</option>`;
  }).join("");
  // Try to restore saved voice
  const allVoices = speechSynthesis.getVoices();
  if (ttsVoiceIdx < allVoices.length) {
    const found = voices.includes(allVoices[ttsVoiceIdx]);
    if (found) sel.value = ttsVoiceIdx;
    else if (voices.length > 0) {
      ttsVoiceIdx = speechSynthesis.getVoices().indexOf(voices[0]);
      sel.value = ttsVoiceIdx;
    }
  }
}

function toggleTTS() {
  if (!currentModalArticle) return;
  const panel = $("#tts-panel");

  if (speechSynthesis.speaking && !ttsPaused) {
    // Pause
    speechSynthesis.pause();
    ttsPaused = true;
    updateTTSButtons();
    return;
  }

  if (ttsPaused) {
    // Resume
    speechSynthesis.resume();
    ttsPaused = false;
    updateTTSButtons();
    return;
  }

  // Start new speech
  if (panel) panel.style.display = "block";
  startTTS();
}

function startTTS() {
  stopTTS();
  if (!currentModalArticle) return;

  const u = new SpeechSynthesisUtterance(currentModalArticle.title + ". " + currentModalArticle.excerpt);
  u.rate = ttsSpeed;
  u.volume = ttsVolume;
  const voices = speechSynthesis.getVoices();
  if (voices[ttsVoiceIdx]) u.voice = voices[ttsVoiceIdx];
  u.onend = () => {
    ttsPaused = false;
    updateTTSButtons();
    const panel = $("#tts-panel");
    if (panel) panel.style.display = "none";
    $("#modal-tts").classList.remove("active");
  };
  speechSynthesis.speak(u);
  $("#modal-tts").classList.add("active");
  updateTTSButtons();
  toast("Reading aloud...");
}

function stopTTS() {
  speechSynthesis.cancel();
  ttsPaused = false;
  updateTTSButtons();
}

function updateTTSButtons() {
  const playPause = $("#tts-play-pause");
  if (playPause) {
    if (speechSynthesis.speaking && !ttsPaused) {
      playPause.innerHTML = "&#10074;&#10074;"; // pause icon
      playPause.classList.add("active");
    } else {
      playPause.innerHTML = "&#9654;&#65039;"; // play icon
      playPause.classList.remove("active");
    }
  }
}

// === Bookmarks ===
function toggleBookmark(link) {
  const idx = bookmarks.findIndex(b => b.link === link);
  if (idx >= 0) {
    bookmarks.splice(idx, 1);
    toast("Removed from saved");
  } else {
    const a = allArticles.find(x => x.link === link) || currentModalArticle;
    if (a) { bookmarks.push({ title: a.title, link: a.link, source: a.source, date: Date.now() }); toast("Article saved!"); }
  }
  localStorage.setItem("tdb_bookmarks", JSON.stringify(bookmarks));
  haptic();
  updateBookmarks();
  updateBookmarkBadge();
  updateStats();
  renderArticles();
}

function updateBookmarks() {
  const w = $("#bookmarks-widget"), list = $("#bookmarks-list");
  if (!w || !list) return;
  if (!bookmarks.length) { w.style.display = "none"; return; }
  w.style.display = "block";
  list.innerHTML = bookmarks.slice().reverse().map(b =>
    `<div class="bookmark-item">
      <a href="${esc(b.link)}" target="_blank" rel="noopener">${esc(b.title)}</a>
      <button class="bookmark-remove" data-link="${esc(b.link)}" aria-label="Remove">&times;</button>
    </div>`
  ).join("");
  list.querySelectorAll(".bookmark-remove").forEach(btn => {
    btn.addEventListener("click", () => toggleBookmark(btn.dataset.link));
  });
}

function updateBookmarkBadge() {
  const badge = $("#bookmark-badge");
  if (!badge) return;
  if (bookmarks.length > 0) {
    badge.style.display = "flex";
    badge.textContent = bookmarks.length;
  } else {
    badge.style.display = "none";
  }
}

function exportBookmarks() {
  const data = JSON.stringify(bookmarks, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "daily-brief-bookmarks.json"; a.click();
  URL.revokeObjectURL(url);
  toast("Bookmarks exported!");
}

function importBookmarks(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (Array.isArray(data)) {
        const newCount = data.filter(b => !bookmarks.some(existing => existing.link === b.link)).length;
        data.forEach(b => {
          if (b.link && b.title && !bookmarks.some(existing => existing.link === b.link)) {
            bookmarks.push(b);
          }
        });
        localStorage.setItem("tdb_bookmarks", JSON.stringify(bookmarks));
        updateBookmarks();
        updateBookmarkBadge();
        updateStats();
        toast(`Imported ${newCount} bookmarks!`);
      }
    } catch {
      toast("Invalid bookmark file");
    }
  };
  reader.readAsText(file);
}

// === Reading History Panel ===
function updateHistoryPanel() {
  const list = $("#history-list");
  if (!list) return;
  if (readHistory.length === 0) {
    list.innerHTML = '<div style="color:var(--text-muted);font-size:13px;">No articles read yet</div>';
    return;
  }
  const recent = readHistory.slice().reverse().slice(0, 20);
  list.innerHTML = recent.map(h => `
    <div class="history-item">
      <a href="${esc(h.link)}" target="_blank" rel="noopener">${esc(h.title)}</a>
      <span class="history-meta">${esc(h.source)} &middot; ${ago(new Date(h.time))}</span>
    </div>`).join("");
}

// === Daily Goal ===
function updateGoalDisplay() {
  const todayCount = getTodayReadCount();
  const pct = Math.min(100, Math.round((todayCount / dailyGoal) * 100));
  const bar = $("#goal-progress-bar");
  const text = $("#goal-text");
  const target = $("#goal-target");
  if (bar) bar.style.width = pct + "%";
  if (text) text.textContent = `${todayCount} / ${dailyGoal} articles today`;
  if (target) target.textContent = dailyGoal;
  if (todayCount >= dailyGoal && todayCount > 0) {
    if (bar) bar.classList.add("complete");
  } else {
    if (bar) bar.classList.remove("complete");
  }
}

// === Stats ===
function updateStats() {
  const sr = $("#stat-read");
  if (sr) sr.textContent = readArticles.length;
  const sb = $("#stat-bookmarked");
  if (sb) sb.textContent = bookmarks.length;
  const sc = $("#stat-categories");
  if (sc) sc.textContent = categoriesVisited.size;
  const ss = $("#stat-streak");
  if (ss) ss.textContent = `${streakData.count} day${streakData.count !== 1 ? "s" : ""}`;
  const st = $("#stat-today");
  if (st) st.textContent = getTodayReadCount();
  // Favorite source
  const sf = $("#stat-fav-source");
  if (sf && readHistory.length > 0) {
    const srcCounts = {};
    readHistory.forEach(h => { srcCounts[h.source] = (srcCounts[h.source] || 0) + 1; });
    const top = Object.entries(srcCounts).sort((a,b) => b[1]-a[1])[0];
    sf.textContent = top ? top[0] : "--";
  }
}

// === Infinite Scroll ===
function setupInfiniteScroll() {
  const sentinel = $("#scroll-sentinel");
  if (!sentinel) return;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && infiniteScrollEnabled && displayedCount < filteredArticles.length - 1) {
      renderArticles();
    }
  }, { rootMargin: "200px" });
  obs.observe(sentinel);
}

// === Pull to Refresh (mobile touch) ===
function setupPullToRefresh() {
  let startY = 0, pulling = false;
  const ptr = $("#pull-refresh");

  document.addEventListener("touchstart", e => {
    if (window.scrollY === 0 && e.touches.length === 1) {
      startY = e.touches[0].clientY;
      pulling = true;
    }
  }, { passive: true });

  document.addEventListener("touchmove", e => {
    if (!pulling) return;
    const dy = e.touches[0].clientY - startY;
    if (dy > 60 && window.scrollY === 0) {
      ptr.classList.add("visible");
    }
  }, { passive: true });

  document.addEventListener("touchend", () => {
    if (ptr.classList.contains("visible")) {
      ptr.classList.remove("visible");
      loadCategory(currentCategory);
      toast("Refreshing...");
    }
    pulling = false;
  }, { passive: true });
}

// === Modal Swipe to Close (mobile) ===
function setupModalSwipe() {
  const mc = $("#modal-content");
  let startY = 0, currentY = 0, dragging = false;

  mc.addEventListener("touchstart", e => {
    if (mc.scrollTop <= 0) {
      startY = e.touches[0].clientY;
      dragging = true;
    }
  }, { passive: true });

  mc.addEventListener("touchmove", e => {
    if (!dragging) return;
    currentY = e.touches[0].clientY - startY;
    if (currentY > 0) {
      mc.style.transform = `translateY(${Math.min(currentY, 200)}px)`;
      mc.style.transition = "none";
    }
  }, { passive: true });

  mc.addEventListener("touchend", () => {
    if (!dragging) return;
    dragging = false;
    mc.style.transition = "transform 0.3s ease";
    if (currentY > 100) {
      closeModal();
    }
    mc.style.transform = "";
    currentY = 0;
  }, { passive: true });
}

// === Swipe between categories (mobile) ===
function setupSwipeCategories() {
  let startX = 0, startY = 0;
  const nav = $("#main-content");
  if (!nav) return;
  nav.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  nav.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(dy) * 2) {
      const cats = Object.keys(FEEDS);
      cats.unshift("foryou");
      const idx = cats.indexOf(currentCategory);
      if (dx < 0 && idx < cats.length - 1) {
        loadCategory(cats[idx + 1]);
        haptic();
      } else if (dx > 0 && idx > 0) {
        loadCategory(cats[idx - 1]);
        haptic();
      }
    }
  }, { passive: true });
}

// === Listeners ===
function setupListeners() {
  // Nav
  $$(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      haptic();
      timeRange = "today";
      $$("#time-pills .pill").forEach(p => {
        const isToday = p.dataset.range === "today";
        p.classList.toggle("active", isToday);
        p.setAttribute("aria-checked", isToday);
      });
      loadCategory(btn.dataset.category);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Time range
  $$("#time-pills .pill").forEach(pill => {
    pill.addEventListener("click", () => {
      $$("#time-pills .pill").forEach(p => { p.classList.remove("active"); p.setAttribute("aria-checked", "false"); });
      pill.classList.add("active");
      pill.setAttribute("aria-checked", "true");
      timeRange = pill.dataset.range;
      displayedCount = 0;
      applyFilters();
    });
  });

  // Sort
  $("#sort-select").addEventListener("change", e => { sortMode = e.target.value; displayedCount = 0; applyFilters(); });

  // Source filter
  $("#source-filter").addEventListener("change", e => { sourceFilter = e.target.value; displayedCount = 0; applyFilters(); });

  // Search (debounced)
  let searchTimer;
  $("#search-input").addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      searchQuery = $("#search-input").value.trim().toLowerCase();
      $("#search-clear").style.display = searchQuery ? "block" : "none";
      displayedCount = 0;
      applyFilters();
    }, 250);
  });
  $("#search-clear").addEventListener("click", () => {
    $("#search-input").value = ""; searchQuery = "";
    $("#search-clear").style.display = "none";
    displayedCount = 0; applyFilters();
  });

  // Load more
  $("#load-more-btn").addEventListener("click", renderArticles);

  // Reset filters
  $("#reset-filters-btn").addEventListener("click", () => {
    searchQuery = ""; timeRange = "all"; sourceFilter = "all"; sortMode = "newest";
    $("#search-input").value = ""; $("#search-clear").style.display = "none";
    $("#sort-select").value = "newest"; $("#source-filter").value = "all";
    $$("#time-pills .pill").forEach(p => {
      const isAll = p.dataset.range === "all";
      p.classList.toggle("active", isAll);
      p.setAttribute("aria-checked", isAll);
    });
    displayedCount = 0; applyFilters();
  });

  // Theme picker
  $("#theme-toggle").addEventListener("click", (e) => {
    e.stopPropagation();
    const picker = $("#theme-picker");
    if (picker) picker.classList.toggle("open");
  });
  $$(".theme-option").forEach(opt => {
    opt.addEventListener("click", (e) => {
      e.stopPropagation();
      const theme = opt.dataset.theme;
      setTheme(theme);
      localStorage.setItem("tdb_theme", theme);
      const picker = $("#theme-picker");
      if (picker) picker.classList.remove("open");
      haptic();
    });
  });
  document.addEventListener("click", () => {
    const picker = $("#theme-picker");
    if (picker) picker.classList.remove("open");
  });

  // Font
  $("#font-increase").addEventListener("click", () => setFontScale(fontScale + 0.08));
  $("#font-decrease").addEventListener("click", () => setFontScale(fontScale - 0.08));

  // View (now 4 modes)
  $("#view-toggle").addEventListener("click", () => {
    const modes = ["grid", "list", "compact", "newspaper"];
    setViewMode(modes[(modes.indexOf(viewMode) + 1) % modes.length]);
    renderArticles();
    toast(`${viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} view`);
    haptic();
  });

  // Refresh
  $("#refresh-btn").addEventListener("click", () => {
    loadCategory(currentCategory);
    toast("Refreshing...");
    startAutoRefresh();
  });

  // Notifications
  const notifBtn = $("#notif-toggle");
  if (notifBtn) notifBtn.addEventListener("click", toggleNotifications);

  // Modal
  $("#modal-close").addEventListener("click", closeModal);
  $("#modal-overlay").addEventListener("click", e => { if (e.target === $("#modal-overlay")) closeModal(); });
  $("#modal-bookmark").addEventListener("click", () => {
    if (currentModalArticle) {
      toggleBookmark(currentModalArticle.link);
      const isB = bookmarks.some(b => b.link === currentModalArticle.link);
      $("#modal-bookmark").innerHTML = isB ? "&#9733;" : "&#9734;";
      $("#modal-bookmark").classList.toggle("active", isB);
    }
  });
  $("#modal-share").addEventListener("click", () => {
    if (currentModalArticle) openSharePopup(currentModalArticle);
  });
  $("#modal-tts").addEventListener("click", toggleTTS);
  $("#modal-focus").addEventListener("click", toggleFocusMode);
  $("#modal-print").addEventListener("click", () => window.print());

  // TTS panel controls
  const ttsAccentEl = $("#tts-accent");
  if (ttsAccentEl) {
    ttsAccentEl.addEventListener("change", () => {
      ttsAccent = ttsAccentEl.value;
      localStorage.setItem("tdb_tts_accent", ttsAccent);
      updateVoiceDropdown();
      // If currently playing, restart with new accent
      if (speechSynthesis.speaking) {
        stopTTS();
        startTTS();
      }
    });
  }
  const ttsSpeedEl = $("#tts-speed");
  if (ttsSpeedEl) {
    ttsSpeedEl.addEventListener("input", () => {
      ttsSpeed = parseFloat(ttsSpeedEl.value);
      const val = $("#tts-speed-val");
      if (val) val.textContent = ttsSpeed.toFixed(1) + "x";
      localStorage.setItem("tdb_tts_speed", ttsSpeed);
    });
  }
  const ttsVolumeEl = $("#tts-volume");
  if (ttsVolumeEl) {
    ttsVolumeEl.addEventListener("input", () => {
      ttsVolume = parseFloat(ttsVolumeEl.value);
      const val = $("#tts-volume-val");
      if (val) val.textContent = Math.round(ttsVolume * 100) + "%";
      localStorage.setItem("tdb_tts_volume", ttsVolume);
    });
  }
  const ttsVoiceEl = $("#tts-voice");
  if (ttsVoiceEl) {
    ttsVoiceEl.addEventListener("change", () => {
      ttsVoiceIdx = parseInt(ttsVoiceEl.value);
      localStorage.setItem("tdb_tts_voice", ttsVoiceIdx);
    });
  }
  const ttsPlayPause = $("#tts-play-pause");
  if (ttsPlayPause) {
    ttsPlayPause.addEventListener("click", () => {
      if (speechSynthesis.speaking && !ttsPaused) {
        speechSynthesis.pause();
        ttsPaused = true;
      } else if (ttsPaused) {
        speechSynthesis.resume();
        ttsPaused = false;
      } else {
        startTTS();
      }
      updateTTSButtons();
    });
  }
  const ttsStopBtn = $("#tts-stop");
  if (ttsStopBtn) {
    ttsStopBtn.addEventListener("click", () => {
      stopTTS();
      const panel = $("#tts-panel");
      if (panel) panel.style.display = "none";
      $("#modal-tts").classList.remove("active");
    });
  }

  // Share popup
  $$(".share-btn-social").forEach(btn => {
    btn.addEventListener("click", () => handleShare(btn.dataset.platform));
  });
  const shareClose = $("#share-popup-close");
  if (shareClose) shareClose.addEventListener("click", closeSharePopup);
  const sharePopup = $("#share-popup");
  if (sharePopup) sharePopup.addEventListener("click", e => { if (e.target === sharePopup) closeSharePopup(); });

  // Sidebar
  $("#sidebar-toggle").addEventListener("click", toggleSidebar);
  $("#sidebar-close").addEventListener("click", closeSidebar);
  $("#sidebar-overlay").addEventListener("click", closeSidebar);

  // Back to top + global progress
  window.addEventListener("scroll", () => {
    $("#back-to-top").classList.toggle("visible", window.scrollY > 400);
    // Global reading progress
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    const gp = $("#global-progress");
    if (gp) gp.style.width = progress + "%";
  }, { passive: true });
  $("#back-to-top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Retry
  $("#retry-btn").addEventListener("click", () => loadCategory(currentCategory));

  // Clear bookmarks
  $("#clear-bookmarks").addEventListener("click", () => {
    bookmarks = []; localStorage.setItem("tdb_bookmarks", "[]");
    updateBookmarks(); updateBookmarkBadge(); updateStats(); renderArticles();
    toast("All saved articles cleared");
  });

  // Export/import bookmarks
  const exportBtn = $("#export-bookmarks");
  if (exportBtn) exportBtn.addEventListener("click", exportBookmarks);
  const importInput = $("#import-bookmarks");
  if (importInput) importInput.addEventListener("change", e => {
    if (e.target.files[0]) importBookmarks(e.target.files[0]);
    e.target.value = "";
  });

  // Daily goal controls
  const goalInc = $("#goal-increase");
  if (goalInc) goalInc.addEventListener("click", () => {
    dailyGoal = Math.min(50, dailyGoal + 5);
    localStorage.setItem("tdb_goal", dailyGoal);
    updateGoalDisplay();
  });
  const goalDec = $("#goal-decrease");
  if (goalDec) goalDec.addEventListener("click", () => {
    dailyGoal = Math.max(5, dailyGoal - 5);
    localStorage.setItem("tdb_goal", dailyGoal);
    updateGoalDisplay();
  });

  // Install PWA
  const installBtn = $("#install-btn");
  if (installBtn) {
    installBtn.addEventListener("click", async () => {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        const result = await deferredInstallPrompt.userChoice;
        if (result.outcome === "accepted") toast("App installed!");
        deferredInstallPrompt = null;
        $("#install-widget").style.display = "none";
      }
    });
  }

  // Mobile bottom nav
  $$(".bottom-nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      $$(".bottom-nav-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      haptic();
      switch (action) {
        case "home":
          window.scrollTo({ top: 0, behavior: "smooth" });
          closeSidebar();
          break;
        case "search":
          window.scrollTo({ top: 0, behavior: "smooth" });
          closeSidebar();
          setTimeout(() => $("#search-input").focus(), 300);
          break;
        case "bookmarks":
          toggleSidebar();
          setTimeout(() => {
            const bw = $("#bookmarks-widget");
            if (bw) bw.scrollIntoView({ behavior: "smooth" });
          }, 350);
          break;
        case "sidebar":
          toggleSidebar();
          break;
      }
    });
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", e => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") {
      if (e.key === "Escape") { e.target.blur(); closeModal(); }
      return;
    }
    const modal = $("#modal-overlay").classList.contains("open");
    switch (e.key) {
      case "Escape": closeModal(); closeSidebar(); closeSharePopup(); break;
      case "/": e.preventDefault(); $("#search-input").focus(); break;
      case "d": case "D": if (!modal) { const cur = localStorage.getItem("tdb_theme"); setTheme(cur === "dark" ? "light" : "dark"); localStorage.setItem("tdb_theme", cur === "dark" ? "light" : "dark"); } break;
      case "r": case "R": if (!modal) { loadCategory(currentCategory); toast("Refreshing..."); } break;
      case "j": case "J": if (!modal) navigateCards(1); break;
      case "k": case "K": if (!modal) navigateCards(-1); break;
      case "Enter": if (!modal && focusedCardIndex >= 0) { const a = filteredArticles[focusedCardIndex]; if (a) openModal(a); } break;
      case "s": case "S":
        if (modal && currentModalArticle) {
          toggleBookmark(currentModalArticle.link);
          const isB = bookmarks.some(b => b.link === currentModalArticle.link);
          $("#modal-bookmark").innerHTML = isB ? "&#9733;" : "&#9734;";
          $("#modal-bookmark").classList.toggle("active", isB);
        } else if (!modal && focusedCardIndex >= 0 && filteredArticles[focusedCardIndex]) {
          toggleBookmark(filteredArticles[focusedCardIndex].link);
        }
        break;
      case "t": case "T": if (modal) toggleTTS(); break;
      case "f": case "F": if (modal) toggleFocusMode(); break;
      case "n": case "N":
        if (!modal) {
          const cats = ["top","foryou",...Object.keys(FEEDS).filter(c => c !== "top")];
          const idx = cats.indexOf(currentCategory);
          if (idx < cats.length - 1) loadCategory(cats[idx + 1]);
        }
        break;
      case "p": case "P":
        if (!modal) {
          const cats2 = ["top","foryou",...Object.keys(FEEDS).filter(c => c !== "top")];
          const idx2 = cats2.indexOf(currentCategory);
          if (idx2 > 0) loadCategory(cats2[idx2 - 1]);
        }
        break;
    }
  });
}

function toggleSidebar() {
  $("#sidebar").classList.toggle("open");
  $("#sidebar-overlay").classList.toggle("open");
}

function closeSidebar() {
  $("#sidebar").classList.remove("open");
  $("#sidebar-overlay").classList.remove("open");
}

function navigateCards(dir) {
  const cards = $$(".hero-card, .article-card");
  if (!cards.length) return;
  focusedCardIndex = Math.max(0, Math.min(cards.length - 1, focusedCardIndex + dir));
  cards[focusedCardIndex].focus();
  cards[focusedCardIndex].scrollIntoView({ behavior: "smooth", block: "center" });
}

// === Boot ===
init();
