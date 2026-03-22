// ==========================================
// The Daily Brief — App Logic
// ==========================================

const RSS_PROXY = "https://api.rss2json.com/v1/api.json?rss_url=";

// RSS feed sources organized by category
const FEEDS = {
  top: [
    { url: "https://feeds.npr.org/1001/rss.xml", name: "NPR" },
    { url: "https://feeds.bbci.co.uk/news/rss.xml", name: "BBC News" },
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml", name: "NY Times" },
    { url: "https://www.theguardian.com/us-news/rss", name: "The Guardian" },
  ],
  world: [
    { url: "https://feeds.bbci.co.uk/news/world/rss.xml", name: "BBC World" },
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml", name: "NY Times World" },
    { url: "https://www.theguardian.com/world/rss", name: "The Guardian" },
    { url: "https://feeds.npr.org/1004/rss.xml", name: "NPR World" },
  ],
  politics: [
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml", name: "NY Times" },
    { url: "https://feeds.npr.org/1014/rss.xml", name: "NPR Politics" },
    { url: "https://www.theguardian.com/us-news/us-politics/rss", name: "The Guardian" },
    { url: "https://feeds.bbci.co.uk/news/politics/rss.xml", name: "BBC Politics" },
  ],
  science: [
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/Science.xml", name: "NY Times" },
    { url: "https://www.theguardian.com/science/rss", name: "The Guardian" },
    { url: "https://feeds.npr.org/1007/rss.xml", name: "NPR Science" },
    { url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml", name: "BBC Science" },
  ],
  technology: [
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml", name: "NY Times" },
    { url: "https://www.theguardian.com/technology/rss", name: "The Guardian" },
    { url: "https://feeds.npr.org/1019/rss.xml", name: "NPR Tech" },
    { url: "https://feeds.bbci.co.uk/news/technology/rss.xml", name: "BBC Tech" },
  ],
  business: [
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml", name: "NY Times" },
    { url: "https://feeds.npr.org/1006/rss.xml", name: "NPR Business" },
    { url: "https://www.theguardian.com/business/rss", name: "The Guardian" },
    { url: "https://feeds.bbci.co.uk/news/business/rss.xml", name: "BBC Business" },
  ],
  health: [
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/Health.xml", name: "NY Times" },
    { url: "https://feeds.npr.org/1128/rss.xml", name: "NPR Health" },
    { url: "https://www.theguardian.com/society/health/rss", name: "The Guardian" },
    { url: "https://feeds.bbci.co.uk/news/health/rss.xml", name: "BBC Health" },
  ],
  opinion: [
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/Opinion.xml", name: "NY Times" },
    { url: "https://www.theguardian.com/commentisfree/rss", name: "The Guardian" },
  ],
};

// Curated quotes for thoughtful readers
const QUOTES = [
  { text: "The only thing we have to fear is fear itself.", author: "Franklin D. Roosevelt" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "The arc of the moral universe is long, but it bends toward justice.", author: "Martin Luther King Jr." },
  { text: "A nation that destroys its soils destroys itself.", author: "Franklin D. Roosevelt" },
  { text: "Science is not only a disciple of reason but, also, one of romance and passion.", author: "Stephen Hawking" },
  { text: "The test of our progress is not whether we add more to the abundance of those who have much; it is whether we provide enough for those who have too little.", author: "Franklin D. Roosevelt" },
  { text: "The good thing about science is that it's true whether or not you believe in it.", author: "Neil deGrasse Tyson" },
  { text: "Injustice anywhere is a threat to justice everywhere.", author: "Martin Luther King Jr." },
  { text: "We are not combating individuals. We are trying to stamp out an unjust system.", author: "Bayard Rustin" },
  { text: "The measure of intelligence is the ability to change.", author: "Albert Einstein" },
  { text: "In a time of deceit, telling the truth is a revolutionary act.", author: "George Orwell" },
  { text: "The cost of liberty is less than the price of repression.", author: "W.E.B. Du Bois" },
  { text: "Those who cannot remember the past are condemned to repeat it.", author: "George Santayana" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Not everything that is faced can be changed, but nothing can be changed until it is faced.", author: "James Baldwin" },
  { text: "A people that values its privileges above its principles soon loses both.", author: "Dwight D. Eisenhower" },
  { text: "The best time to plant a tree was twenty years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The world is a book, and those who do not travel read only one page.", author: "Saint Augustine" },
  { text: "Democracy is not a spectator sport.", author: "Marian Wright Edelman" },
];

// Category emoji icons for placeholders
const CAT_ICONS = {
  top: "&#128240;", world: "&#127758;", politics: "&#127963;", science: "&#128300;",
  technology: "&#128187;", business: "&#128200;", health: "&#129657;", opinion: "&#128172;",
};

// ==========================================
// State
// ==========================================
let currentCategory = "top";
let allArticles = [];
let displayedCount = 0;
const ARTICLES_PER_PAGE = 12;
let bookmarks = JSON.parse(localStorage.getItem("tdb_bookmarks") || "[]");
let searchQuery = "";

// ==========================================
// DOM Elements
// ==========================================
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const dateDisplay = $("#date-display");
const loadingState = $("#loading-state");
const errorState = $("#error-state");
const heroSection = $("#hero-section");
const articlesGrid = $("#articles-grid");
const loadMoreWrap = $("#load-more-wrap");
const loadMoreBtn = $("#load-more-btn");
const searchInput = $("#search-input");
const searchClear = $("#search-clear");
const tickerScroll = $("#ticker-scroll");
const modalOverlay = $("#modal-overlay");
const modalBody = $("#modal-body");
const modalClose = $("#modal-close");
const backToTop = $("#back-to-top");
const themeToggle = $("#theme-toggle");
const themeIcon = $("#theme-icon");
const retryBtn = $("#retry-btn");
const dailyQuote = $("#daily-quote");
const quoteAuthor = $("#quote-author");

// ==========================================
// Initialize
// ==========================================
function init() {
  setDate();
  setTheme(localStorage.getItem("tdb_theme") || "light");
  setQuote();
  loadWeather();
  loadCategory("top");
  setupListeners();
  updateBookmarksWidget();
}

function setDate() {
  const now = new Date();
  const opts = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  dateDisplay.textContent = now.toLocaleDateString("en-US", opts);
}

// ==========================================
// Theme
// ==========================================
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("tdb_theme", theme);
  themeIcon.innerHTML = theme === "dark" ? "&#9788;" : "&#9790;";
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  setTheme(current === "dark" ? "light" : "dark");
});

// ==========================================
// Quote
// ==========================================
function setQuote() {
  const dayIndex = Math.floor(Date.now() / 86400000) % QUOTES.length;
  const q = QUOTES[dayIndex];
  dailyQuote.textContent = `"${q.text}"`;
  quoteAuthor.textContent = `— ${q.author}`;
}

// ==========================================
// Weather (free, no API key — wttr.in)
// ==========================================
async function loadWeather() {
  try {
    const res = await fetch("https://wttr.in/?format=j1", { signal: AbortSignal.timeout(5000) });
    const data = await res.json();
    const current = data.current_condition[0];
    const area = data.nearest_area[0];
    const tempF = current.temp_F;
    const desc = current.weatherDesc[0].value;
    const humidity = current.humidity;
    const windMph = current.windspeedMiles;
    const feelsLike = current.FeelsLikeF;
    const city = area.areaName[0].value;
    const region = area.region[0].value;

    const emoji = getWeatherEmoji(parseInt(current.weatherCode));

    // Mini weather in utility bar
    $("#weather-icon-mini").textContent = emoji;
    $("#weather-temp-mini").textContent = `${tempF}°F`;

    // Full weather widget
    $("#weather-body").innerHTML = `
      <div class="weather-main">
        <span class="weather-emoji">${emoji}</span>
        <span class="weather-temp">${tempF}°</span>
      </div>
      <div class="weather-desc">${desc}</div>
      <div class="weather-location">${city}, ${region}</div>
      <div class="weather-details">
        <div class="weather-detail">
          <div class="weather-detail-label">Feels Like</div>
          <div>${feelsLike}°F</div>
        </div>
        <div class="weather-detail">
          <div class="weather-detail-label">Humidity</div>
          <div>${humidity}%</div>
        </div>
        <div class="weather-detail">
          <div class="weather-detail-label">Wind</div>
          <div>${windMph} mph</div>
        </div>
        <div class="weather-detail">
          <div class="weather-detail-label">UV Index</div>
          <div>${current.uvIndex || '--'}</div>
        </div>
      </div>
    `;
  } catch (e) {
    $("#weather-body").innerHTML = `<div style="color:var(--text-muted);font-size:13px;">Weather unavailable</div>`;
    $("#weather-icon-mini").textContent = "--";
    $("#weather-temp-mini").textContent = "";
  }
}

function getWeatherEmoji(code) {
  if (code === 113) return "\u2600\uFE0F";
  if (code === 116) return "\u26C5";
  if (code === 119 || code === 122) return "\u2601\uFE0F";
  if ([176, 263, 266, 293, 296, 299, 302, 305, 308, 353, 356, 359].includes(code)) return "\uD83C\uDF27\uFE0F";
  if ([200, 386, 389, 392, 395].includes(code)) return "\u26C8\uFE0F";
  if ([179, 182, 185, 227, 230, 281, 284, 311, 314, 317, 320, 323, 326, 329, 332, 335, 338, 350, 362, 365, 368, 371, 374, 377].includes(code)) return "\uD83C\uDF28\uFE0F";
  if ([143, 248, 260].includes(code)) return "\uD83C\uDF2B\uFE0F";
  return "\uD83C\uDF24\uFE0F";
}

// ==========================================
// Fetch & Parse RSS
// ==========================================
async function fetchFeed(feed) {
  try {
    const res = await fetch(`${RSS_PROXY}${encodeURIComponent(feed.url)}`, {
      signal: AbortSignal.timeout(8000)
    });
    const data = await res.json();
    if (data.status !== "ok") return [];
    return (data.items || []).map((item) => ({
      title: cleanHTML(item.title || ""),
      excerpt: cleanHTML(item.description || item.content || "").slice(0, 300),
      link: item.link,
      image: item.thumbnail || item.enclosure?.link || extractImage(item.description || item.content || ""),
      date: new Date(item.pubDate),
      source: feed.name,
      category: currentCategory,
    }));
  } catch (e) {
    return [];
  }
}

function cleanHTML(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent.trim();
}

function extractImage(html) {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/);
  return match ? match[1] : "";
}

async function loadCategory(category) {
  currentCategory = category;
  searchQuery = "";
  searchInput.value = "";
  searchClear.style.display = "none";
  displayedCount = 0;

  // Update nav
  $$(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.category === category);
  });

  // Show loading
  loadingState.style.display = "block";
  errorState.style.display = "none";
  heroSection.style.display = "none";
  articlesGrid.style.display = "none";
  loadMoreWrap.style.display = "none";

  const feeds = FEEDS[category] || FEEDS.top;
  const results = await Promise.all(feeds.map(fetchFeed));
  let articles = results.flat();

  // Deduplicate by title similarity
  const seen = new Set();
  articles = articles.filter((a) => {
    const key = a.title.toLowerCase().slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by date, newest first
  articles.sort((a, b) => b.date - a.date);
  allArticles = articles;

  loadingState.style.display = "none";

  if (articles.length === 0) {
    errorState.style.display = "block";
    $("#error-msg").textContent = "No articles found. Try another category.";
    return;
  }

  // Populate ticker with top headlines
  populateTicker(articles.slice(0, 8));

  // Render
  renderArticles();
}

// ==========================================
// Render
// ==========================================
function renderArticles() {
  const filtered = searchQuery
    ? allArticles.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery) ||
          a.excerpt.toLowerCase().includes(searchQuery) ||
          a.source.toLowerCase().includes(searchQuery)
      )
    : allArticles;

  if (filtered.length === 0) {
    heroSection.style.display = "none";
    articlesGrid.innerHTML = `<div class="no-results">No articles match your search.</div>`;
    articlesGrid.style.display = "block";
    loadMoreWrap.style.display = "none";
    return;
  }

  // Hero (first article)
  const hero = filtered[0];
  heroSection.innerHTML = createHeroCard(hero, 0);
  heroSection.style.display = "block";

  // Grid (rest)
  const remaining = filtered.slice(1);
  const toShow = remaining.slice(0, displayedCount + ARTICLES_PER_PAGE);
  displayedCount = toShow.length;

  articlesGrid.innerHTML = toShow.map((a, i) => createArticleCard(a, i + 1)).join("");
  articlesGrid.style.display = "grid";

  loadMoreWrap.style.display = displayedCount < remaining.length ? "block" : "none";

  // Attach click handlers
  attachCardListeners();
}

function createHeroCard(article, index) {
  const timeAgo = getTimeAgo(article.date);
  const imgHtml = article.image
    ? `<img class="hero-image" src="${escAttr(article.image)}" alt="" loading="lazy" onerror="this.outerHTML='<div class=\\'hero-image-placeholder\\'>${CAT_ICONS[article.category] || CAT_ICONS.top}</div>'">`
    : `<div class="hero-image-placeholder">${CAT_ICONS[article.category] || CAT_ICONS.top}</div>`;

  return `
    <article class="hero-card" data-index="${index}">
      ${imgHtml}
      <div class="hero-body">
        <div class="hero-category">${escHTML(article.category)}</div>
        <h2 class="hero-title">${escHTML(article.title)}</h2>
        <p class="hero-excerpt">${escHTML(article.excerpt)}</p>
        <div class="hero-meta">
          <span class="hero-source">${escHTML(article.source)}</span>
          <span>${timeAgo}</span>
        </div>
      </div>
    </article>
  `;
}

function createArticleCard(article, index) {
  const timeAgo = getTimeAgo(article.date);
  const isBookmarked = bookmarks.some((b) => b.link === article.link);
  const imgHtml = article.image
    ? `<img class="card-image" src="${escAttr(article.image)}" alt="" loading="lazy" onerror="this.outerHTML='<div class=\\'card-image-placeholder\\'>${CAT_ICONS[article.category] || CAT_ICONS.top}</div>'">`
    : `<div class="card-image-placeholder">${CAT_ICONS[article.category] || CAT_ICONS.top}</div>`;

  return `
    <article class="article-card" data-index="${index}">
      ${imgHtml}
      <div class="card-body">
        <div class="card-category">${escHTML(article.category)}</div>
        <h3 class="card-title">${escHTML(article.title)}</h3>
        <p class="card-excerpt">${escHTML(article.excerpt)}</p>
        <div class="card-footer">
          <div>
            <span class="card-source">${escHTML(article.source)}</span>
            <span> &middot; ${timeAgo}</span>
          </div>
          <button class="bookmark-btn ${isBookmarked ? "active" : ""}" data-link="${escAttr(article.link)}" title="Save article">
            ${isBookmarked ? "&#9733;" : "&#9734;"}
          </button>
        </div>
      </div>
    </article>
  `;
}

function attachCardListeners() {
  // Card clicks -> open modal
  $$(".hero-card, .article-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".bookmark-btn")) return;
      const idx = parseInt(card.dataset.index);
      const filtered = searchQuery
        ? allArticles.filter(
            (a) =>
              a.title.toLowerCase().includes(searchQuery) ||
              a.excerpt.toLowerCase().includes(searchQuery)
          )
        : allArticles;
      openModal(filtered[idx]);
    });
  });

  // Bookmark buttons
  $$(".bookmark-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const link = btn.dataset.link;
      toggleBookmark(link);
    });
  });
}

// ==========================================
// Ticker
// ==========================================
function populateTicker(articles) {
  tickerScroll.innerHTML = articles
    .map((a) => `<span>${escHTML(a.title)}</span>`)
    .join("");
  // Duplicate for seamless loop
  tickerScroll.innerHTML += articles
    .map((a) => `<span>${escHTML(a.title)}</span>`)
    .join("");
}

// ==========================================
// Modal
// ==========================================
function openModal(article) {
  if (!article) return;
  const imgHtml = article.image
    ? `<img class="modal-image" src="${escAttr(article.image)}" alt="" onerror="this.style.display='none'">`
    : "";
  const timeStr = article.date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  modalBody.innerHTML = `
    ${imgHtml}
    <div class="modal-category">${escHTML(article.category)}</div>
    <h2 class="modal-title">${escHTML(article.title)}</h2>
    <div class="modal-meta">${escHTML(article.source)} &middot; ${timeStr}</div>
    <div class="modal-text">${escHTML(article.excerpt)}${article.excerpt.length >= 290 ? "..." : ""}</div>
    <a class="read-full" href="${escAttr(article.link)}" target="_blank" rel="noopener">Read Full Article &rarr;</a>
  `;

  modalOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

// ==========================================
// Bookmarks
// ==========================================
function toggleBookmark(link) {
  const idx = bookmarks.findIndex((b) => b.link === link);
  if (idx >= 0) {
    bookmarks.splice(idx, 1);
  } else {
    const article = allArticles.find((a) => a.link === link);
    if (article) {
      bookmarks.push({ title: article.title, link: article.link });
    }
  }
  localStorage.setItem("tdb_bookmarks", JSON.stringify(bookmarks));
  updateBookmarksWidget();
  renderArticles(); // refresh bookmark icons
}

function updateBookmarksWidget() {
  const widget = $("#bookmarks-widget");
  const list = $("#bookmarks-list");
  if (bookmarks.length === 0) {
    widget.style.display = "none";
    return;
  }
  widget.style.display = "block";
  list.innerHTML = bookmarks
    .map(
      (b) =>
        `<div class="bookmark-item"><a href="${escAttr(b.link)}" target="_blank" rel="noopener">${escHTML(b.title)}</a></div>`
    )
    .join("");
}

// ==========================================
// Listeners
// ==========================================
function setupListeners() {
  // Nav buttons
  $$(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => loadCategory(btn.dataset.category));
  });

  // Search
  searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value.toLowerCase().trim();
    searchClear.style.display = searchQuery ? "block" : "none";
    displayedCount = 0;
    renderArticles();
  });
  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    searchQuery = "";
    searchClear.style.display = "none";
    displayedCount = 0;
    renderArticles();
  });

  // Load more
  loadMoreBtn.addEventListener("click", () => {
    renderArticles();
  });

  // Modal
  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // Back to top
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 400);
  });
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Retry
  retryBtn.addEventListener("click", () => loadCategory(currentCategory));

  // Clear bookmarks
  $("#clear-bookmarks").addEventListener("click", () => {
    bookmarks = [];
    localStorage.setItem("tdb_bookmarks", "[]");
    updateBookmarksWidget();
    renderArticles();
  });
}

// ==========================================
// Helpers
// ==========================================
function getTimeAgo(date) {
  const now = new Date();
  const diff = now - date;
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

function escHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function escAttr(str) {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ==========================================
// Boot
// ==========================================
init();
