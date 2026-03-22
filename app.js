// ==========================================
// The Daily Brief — Complete App (100/100)
// Auto-updates, time ranges, full features
// ==========================================

const RSS_PROXY = "https://api.rss2json.com/v1/api.json?rss_url=";

const FEEDS = {
  top: [
    { url: "https://feeds.npr.org/1001/rss.xml", name: "NPR" },
    { url: "https://feeds.bbci.co.uk/news/rss.xml", name: "BBC News" },
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml", name: "NY Times" },
    { url: "https://www.theguardian.com/us-news/rss", name: "The Guardian" },
    { url: "https://feeds.reuters.com/reuters/topNews", name: "Reuters" },
  ],
  world: [
    { url: "https://feeds.bbci.co.uk/news/world/rss.xml", name: "BBC World" },
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml", name: "NY Times" },
    { url: "https://www.theguardian.com/world/rss", name: "The Guardian" },
    { url: "https://feeds.npr.org/1004/rss.xml", name: "NPR" },
  ],
  politics: [
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml", name: "NY Times" },
    { url: "https://feeds.npr.org/1014/rss.xml", name: "NPR" },
    { url: "https://www.theguardian.com/us-news/us-politics/rss", name: "The Guardian" },
    { url: "https://feeds.bbci.co.uk/news/politics/rss.xml", name: "BBC" },
  ],
  science: [
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/Science.xml", name: "NY Times" },
    { url: "https://www.theguardian.com/science/rss", name: "The Guardian" },
    { url: "https://feeds.npr.org/1007/rss.xml", name: "NPR" },
    { url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml", name: "BBC" },
  ],
  technology: [
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml", name: "NY Times" },
    { url: "https://www.theguardian.com/technology/rss", name: "The Guardian" },
    { url: "https://feeds.npr.org/1019/rss.xml", name: "NPR" },
    { url: "https://feeds.bbci.co.uk/news/technology/rss.xml", name: "BBC" },
  ],
  business: [
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml", name: "NY Times" },
    { url: "https://feeds.npr.org/1006/rss.xml", name: "NPR" },
    { url: "https://www.theguardian.com/business/rss", name: "The Guardian" },
    { url: "https://feeds.bbci.co.uk/news/business/rss.xml", name: "BBC" },
  ],
  health: [
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/Health.xml", name: "NY Times" },
    { url: "https://feeds.npr.org/1128/rss.xml", name: "NPR" },
    { url: "https://www.theguardian.com/society/health/rss", name: "The Guardian" },
    { url: "https://feeds.bbci.co.uk/news/health/rss.xml", name: "BBC" },
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
  { text: "The good thing about science is that it's true whether or not you believe in it.", author: "Neil deGrasse Tyson" },
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
  { text: "We are not combating individuals. We are trying to stamp out an unjust system.", author: "Bayard Rustin" },
  { text: "The best time to plant a tree was twenty years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "The world is a book, and those who do not travel read only one page.", author: "Saint Augustine" },
  { text: "It is not the strongest of the species that survives, but the most adaptable.", author: "Charles Darwin" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "What counts in life is not the mere fact that we have lived.", author: "Nelson Mandela" },
  { text: "Try to be a rainbow in someone's cloud.", author: "Maya Angelou" },
  { text: "The truth is rarely pure and never simple.", author: "Oscar Wilde" },
  { text: "You must be the change you wish to see in the world.", author: "Mahatma Gandhi" },
  { text: "I have learned over the years that when one's mind is made up, this diminishes fear.", author: "Rosa Parks" },
  { text: "Facts are stubborn things; and whatever may be our wishes, they cannot alter the state of facts.", author: "John Adams" },
  { text: "The function of education is to teach one to think intensively and critically.", author: "Martin Luther King Jr." },
  { text: "Knowledge speaks, but wisdom listens.", author: "Jimi Hendrix" },
  { text: "We do not inherit the earth from our ancestors; we borrow it from our children.", author: "Native American Proverb" },
  { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
];

const CAT_ICONS = {
  top: "\u{1F4F0}", world: "\u{1F30E}", politics: "\u{1F3DB}", science: "\u{1F52C}",
  technology: "\u{1F4BB}", business: "\u{1F4C8}", health: "\u{1F3E5}", arts: "\u{1F3A8}",
  opinion: "\u{1F4AC}", climate: "\u{1F30D}",
};

const CAT_ICONS_HTML = {
  top: "&#128240;", world: "&#127758;", politics: "&#127963;", science: "&#128300;",
  technology: "&#128187;", business: "&#128200;", health: "&#127973;", arts: "&#127912;",
  opinion: "&#128172;", climate: "&#127757;",
};

// ==========================================
// State
// ==========================================
let currentCategory = "top";
let allArticles = [];
let filteredArticles = [];
let displayedCount = 0;
const PAGE_SIZE = 15;
let bookmarks = JSON.parse(localStorage.getItem("tdb_bookmarks") || "[]");
let readArticles = JSON.parse(localStorage.getItem("tdb_read") || "[]");
let categoriesVisited = new Set(JSON.parse(localStorage.getItem("tdb_cats") || "[]"));
let searchQuery = "";
let timeRange = "today";
let sortMode = "newest";
let sourceFilter = "all";
let viewMode = localStorage.getItem("tdb_view") || "grid";
let fontScale = parseFloat(localStorage.getItem("tdb_font") || "1");
let autoRefreshTimer = null;
let currentModalArticle = null;
let ttsUtterance = null;
let focusedCardIndex = -1;
let articleCache = {};

const AUTO_REFRESH_MS = 15 * 60 * 1000; // 15 minutes

// ==========================================
// DOM
// ==========================================
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// ==========================================
// Init
// ==========================================
function init() {
  setDate();
  setTheme(localStorage.getItem("tdb_theme") || "light");
  setFontScale(fontScale);
  setViewMode(viewMode);
  setQuote();
  loadWeather();
  loadCategory("top");
  setupListeners();
  startAutoRefresh();
  updateStats();
}

function setDate() {
  const now = new Date();
  $("#date-display").textContent = now.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
}

// ==========================================
// Theme
// ==========================================
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("tdb_theme", theme);
  $("#theme-icon").innerHTML = theme === "dark" ? "&#9788;" : "&#9790;";
}

// ==========================================
// Font Scale
// ==========================================
function setFontScale(scale) {
  scale = Math.max(0.8, Math.min(1.4, scale));
  fontScale = scale;
  document.documentElement.style.setProperty("--font-scale", scale);
  localStorage.setItem("tdb_font", scale);
}

// ==========================================
// View Mode
// ==========================================
function setViewMode(mode) {
  viewMode = mode;
  localStorage.setItem("tdb_view", mode);
  const icons = { grid: "&#9638;", list: "&#9776;", compact: "&#9472;" };
  $("#view-icon").innerHTML = icons[mode] || icons.grid;
  const container = $("#articles-container");
  if (container) {
    container.className = "articles-container " + mode + "-view";
  }
}

// ==========================================
// Quote
// ==========================================
function setQuote() {
  const idx = Math.floor(Date.now() / 86400000) % QUOTES.length;
  const q = QUOTES[idx];
  $("#daily-quote").textContent = `\u201C${q.text}\u201D`;
  $("#quote-author").textContent = `\u2014 ${q.author}`;
}

// ==========================================
// Weather (wttr.in — free, no API key)
// ==========================================
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

// ==========================================
// Auto Refresh
// ==========================================
function startAutoRefresh() {
  clearInterval(autoRefreshTimer);
  autoRefreshTimer = setInterval(() => {
    loadCategory(currentCategory, true);
  }, AUTO_REFRESH_MS);
}

function updateLastRefreshed() {
  const now = new Date();
  $("#last-updated").textContent = `Updated ${now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
}

// ==========================================
// Fetch RSS
// ==========================================
async function fetchFeed(feed, category) {
  try {
    const res = await fetch(`${RSS_PROXY}${encodeURIComponent(feed.url)}`, {
      signal: AbortSignal.timeout(10000)
    });
    const data = await res.json();
    if (data.status !== "ok") return [];
    return (data.items || []).map(item => ({
      title: stripHTML(item.title || ""),
      excerpt: stripHTML(item.description || item.content || "").slice(0, 400),
      link: item.link || "",
      image: item.thumbnail || item.enclosure?.link || extractImg(item.description || item.content || ""),
      date: new Date(item.pubDate),
      source: feed.name,
      category: category,
      id: btoa(item.link || item.title || "").slice(0, 24),
    }));
  } catch {
    return [];
  }
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

// ==========================================
// Load Category
// ==========================================
async function loadCategory(category, silent) {
  currentCategory = category;
  categoriesVisited.add(category);
  localStorage.setItem("tdb_cats", JSON.stringify([...categoriesVisited]));

  // Update nav
  $$(".nav-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.category === category));

  if (!silent) {
    displayedCount = 0;
    $("#loading-state").style.display = "block";
    $("#error-state").style.display = "none";
    $("#hero-section").style.display = "none";
    $("#articles-container").style.display = "none";
    $("#load-more-wrap").style.display = "none";
    $("#no-results").style.display = "none";
  }

  const feeds = FEEDS[category] || FEEDS.top;
  const results = await Promise.all(feeds.map(f => fetchFeed(f, category)));
  let articles = results.flat();

  // Deduplicate
  const seen = new Set();
  articles = articles.filter(a => {
    const key = a.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 50);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return a.title.length > 10;
  });

  // Sort newest
  articles.sort((a, b) => b.date - a.date);
  allArticles = articles;

  // Cache
  articleCache[category] = articles;

  // Update source filter dropdown
  updateSourceFilter(articles);

  // Update ticker
  if (!silent) populateTicker(articles.slice(0, 10));

  updateLastRefreshed();
  $("#loading-state").style.display = "none";

  if (articles.length === 0 && !silent) {
    $("#error-state").style.display = "block";
    $("#error-msg").textContent = "No articles found. Try another category or check your connection.";
    return;
  }

  if (!silent) displayedCount = 0;
  applyFilters();
  updateStats();
  extractTrending(articles);
}

// ==========================================
// Filters
// ==========================================
function applyFilters() {
  let articles = [...allArticles];

  // Time range filter
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart - 86400000);
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const lastWeekStart = new Date(weekStart - 7 * 86400000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  switch (timeRange) {
    case "today":
      articles = articles.filter(a => a.date >= todayStart);
      break;
    case "yesterday":
      articles = articles.filter(a => a.date >= yesterdayStart && a.date < todayStart);
      break;
    case "this-week":
      articles = articles.filter(a => a.date >= weekStart);
      break;
    case "last-week":
      articles = articles.filter(a => a.date >= lastWeekStart && a.date < weekStart);
      break;
    case "this-month":
      articles = articles.filter(a => a.date >= monthStart);
      break;
    case "all":
      break;
  }

  // Source filter
  if (sourceFilter !== "all") {
    articles = articles.filter(a => a.source === sourceFilter);
  }

  // Search
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    articles = articles.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.source.toLowerCase().includes(q)
    );
  }

  // Sort
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
  const current = sel.value;
  sel.innerHTML = `<option value="all">All Sources</option>` +
    sources.map(s => `<option value="${esc(s)}">${esc(s)}</option>`).join("");
  sel.value = sources.includes(current) ? current : "all";
  sourceFilter = sel.value;
}

// ==========================================
// Render
// ==========================================
function renderArticles() {
  const container = $("#articles-container");
  container.className = "articles-container " + viewMode + "-view";

  // Update stats bar
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
  const hero = filteredArticles[0];
  $("#hero-section").innerHTML = heroHTML(hero, 0);
  $("#hero-section").style.display = "block";

  // Grid
  const rest = filteredArticles.slice(1);
  const count = Math.min(displayedCount + PAGE_SIZE, rest.length);
  displayedCount = count;
  container.innerHTML = rest.slice(0, count).map((a, i) => cardHTML(a, i + 1)).join("");
  container.style.display = viewMode === "grid" ? "grid" : "flex";

  $("#load-more-wrap").style.display = count < rest.length ? "block" : "none";

  attachCardListeners();
}

function heroHTML(a, idx) {
  const timeAgo = ago(a.date);
  const readTime = readingTime(a.excerpt);
  const isRead = readArticles.includes(a.id);
  const img = a.image
    ? `<div class="hero-image-wrap"><img class="hero-image" src="${esc(a.image)}" alt="" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'hero-image-placeholder\\'>${CAT_ICONS_HTML[a.category] || CAT_ICONS_HTML.top}</div>'"></div>`
    : `<div class="hero-image-wrap"><div class="hero-image-placeholder">${CAT_ICONS_HTML[a.category] || CAT_ICONS_HTML.top}</div></div>`;
  return `
    <article class="hero-card" data-index="${idx}" tabindex="0" role="button">
      ${img}
      <div class="hero-body">
        <div class="hero-category">${esc(a.category)}</div>
        <h2 class="hero-title">${esc(a.title)}</h2>
        <p class="hero-excerpt">${esc(a.excerpt)}</p>
        <div class="hero-meta">
          <span class="hero-source">${esc(a.source)}</span>
          <span>${timeAgo}</span>
          <span class="hero-reading-time">${readTime} min read</span>
          ${isRead ? '<span style="opacity:0.5">Read</span>' : ""}
        </div>
      </div>
    </article>`;
}

function cardHTML(a, idx) {
  const timeAgo = ago(a.date);
  const readTime = readingTime(a.excerpt);
  const isBookmarked = bookmarks.some(b => b.link === a.link);
  const isRead = readArticles.includes(a.id);
  const img = a.image
    ? `<div class="card-image-wrap"><img class="card-image" src="${esc(a.image)}" alt="" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'card-image-placeholder\\'>${CAT_ICONS_HTML[a.category] || CAT_ICONS_HTML.top}</div>'"></div>`
    : `<div class="card-image-wrap"><div class="card-image-placeholder">${CAT_ICONS_HTML[a.category] || CAT_ICONS_HTML.top}</div></div>`;
  return `
    <article class="article-card" data-index="${idx}" tabindex="0" role="button">
      ${isRead ? '<div class="read-indicator">Read</div>' : ""}
      ${img}
      <div class="card-body">
        <div class="card-category">${esc(a.category)}</div>
        <h3 class="card-title">${esc(a.title)}</h3>
        <p class="card-excerpt">${esc(a.excerpt)}</p>
        <div class="card-footer">
          <div class="card-meta">
            <span class="card-source">${esc(a.source)}</span>
            <span>${timeAgo}</span>
            <span class="card-reading-time">${readTime}m</span>
          </div>
          <div class="card-actions">
            <button class="bookmark-btn ${isBookmarked ? "active" : ""}" data-link="${esc(a.link)}" title="Save article">${isBookmarked ? "&#9733;" : "&#9734;"}</button>
            <button class="share-btn" data-title="${esc(a.title)}" data-link="${esc(a.link)}" title="Copy link">&#128279;</button>
          </div>
        </div>
      </div>
    </article>`;
}

function attachCardListeners() {
  $$(".hero-card, .article-card").forEach(card => {
    card.addEventListener("click", e => {
      if (e.target.closest(".bookmark-btn") || e.target.closest(".share-btn")) return;
      const idx = parseInt(card.dataset.index);
      openModal(filteredArticles[idx]);
    });
    card.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        const idx = parseInt(card.dataset.index);
        openModal(filteredArticles[idx]);
      }
    });
  });

  $$(".bookmark-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      toggleBookmark(btn.dataset.link);
    });
  });

  $$(".share-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      copyToClipboard(btn.dataset.link, "Link copied!");
    });
  });
}

// ==========================================
// Ticker
// ==========================================
function populateTicker(articles) {
  const items = articles.map(a => `<span>${esc(a.title)}</span>`).join("");
  $("#ticker-scroll").innerHTML = items + items;
}

// ==========================================
// Trending Topics
// ==========================================
function extractTrending(articles) {
  const stopWords = new Set(["the","a","an","in","on","at","to","for","of","and","is","are","was","were","be","been","with","this","that","from","or","by","as","it","its","has","have","had","not","but","what","all","can","will","do","did","say","says","said","new","more","than","how","about","after","over","into","up","out","no","just","also","one","two","their","our","his","her","he","she","they","we","you","your","my","us"]);
  const wordCount = {};
  articles.forEach(a => {
    const words = (a.title + " " + a.excerpt).toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/);
    const seen = new Set();
    words.forEach(w => {
      if (w.length > 3 && !stopWords.has(w) && !seen.has(w)) {
        seen.add(w);
        wordCount[w] = (wordCount[w] || 0) + 1;
      }
    });
  });

  const trending = Object.entries(wordCount)
    .filter(([, c]) => c >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([w]) => w);

  $("#trending-tags").innerHTML = trending.map(t =>
    `<span class="trending-tag" data-term="${esc(t)}">${t}</span>`
  ).join("");

  $$(".trending-tag").forEach(tag => {
    tag.addEventListener("click", () => {
      $("#search-input").value = tag.dataset.term;
      searchQuery = tag.dataset.term.toLowerCase();
      $("#search-clear").style.display = "block";
      displayedCount = 0;
      applyFilters();
      toast(`Searching: ${tag.dataset.term}`);
    });
  });
}

// ==========================================
// Modal
// ==========================================
function openModal(article) {
  if (!article) return;
  currentModalArticle = article;

  // Mark as read
  if (!readArticles.includes(article.id)) {
    readArticles.push(article.id);
    if (readArticles.length > 500) readArticles = readArticles.slice(-500);
    localStorage.setItem("tdb_read", JSON.stringify(readArticles));
  }

  const isBookmarked = bookmarks.some(b => b.link === article.link);
  $("#modal-bookmark").innerHTML = isBookmarked ? "&#9733;" : "&#9734;";
  $("#modal-bookmark").classList.toggle("active", isBookmarked);

  const img = article.image
    ? `<img class="modal-image" src="${esc(article.image)}" alt="" onerror="this.style.display='none'">`
    : "";
  const timeStr = article.date.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "2-digit"
  });
  const readTime = readingTime(article.excerpt);

  $("#modal-body").innerHTML = `
    ${img}
    <div class="modal-category">${esc(article.category)}</div>
    <h2 class="modal-title">${esc(article.title)}</h2>
    <div class="modal-meta">
      <span><strong>${esc(article.source)}</strong></span>
      <span>${timeStr}</span>
      <span>${readTime} min read</span>
    </div>
    <div class="modal-text">${esc(article.excerpt)}${article.excerpt.length >= 380 ? "..." : ""}</div>
    <a class="read-full" href="${esc(article.link)}" target="_blank" rel="noopener">Read Full Article \u2192</a>`;

  $("#modal-overlay").classList.add("open");
  document.body.style.overflow = "hidden";
  updateStats();
}

function closeModal() {
  $("#modal-overlay").classList.remove("open");
  document.body.style.overflow = "";
  stopTTS();
  currentModalArticle = null;
}

// ==========================================
// TTS (Text-to-Speech — free, built-in)
// ==========================================
function toggleTTS() {
  if (!currentModalArticle) return;
  if (speechSynthesis.speaking) {
    stopTTS();
    $("#modal-tts").classList.remove("active");
    toast("Stopped reading");
    return;
  }
  ttsUtterance = new SpeechSynthesisUtterance(
    currentModalArticle.title + ". " + currentModalArticle.excerpt
  );
  ttsUtterance.rate = 0.9;
  ttsUtterance.onend = () => $("#modal-tts").classList.remove("active");
  speechSynthesis.speak(ttsUtterance);
  $("#modal-tts").classList.add("active");
  toast("Reading aloud...");
}

function stopTTS() {
  speechSynthesis.cancel();
  ttsUtterance = null;
}

// ==========================================
// Bookmarks
// ==========================================
function toggleBookmark(link) {
  const idx = bookmarks.findIndex(b => b.link === link);
  if (idx >= 0) {
    bookmarks.splice(idx, 1);
    toast("Removed from saved");
  } else {
    const article = allArticles.find(a => a.link === link) || currentModalArticle;
    if (article) {
      bookmarks.push({ title: article.title, link: article.link, date: Date.now() });
      toast("Article saved!");
    }
  }
  localStorage.setItem("tdb_bookmarks", JSON.stringify(bookmarks));
  updateBookmarks();
  updateStats();
  renderArticles();
}

function updateBookmarks() {
  const w = $("#bookmarks-widget");
  const list = $("#bookmarks-list");
  if (!bookmarks.length) { w.style.display = "none"; return; }
  w.style.display = "block";
  list.innerHTML = bookmarks.slice().reverse().map(b =>
    `<div class="bookmark-item">
      <a href="${esc(b.link)}" target="_blank" rel="noopener">${esc(b.title)}</a>
      <button class="bookmark-remove" data-link="${esc(b.link)}" title="Remove">&times;</button>
    </div>`
  ).join("");
  list.querySelectorAll(".bookmark-remove").forEach(btn => {
    btn.addEventListener("click", () => toggleBookmark(btn.dataset.link));
  });
}

// ==========================================
// Stats
// ==========================================
function updateStats() {
  $("#stat-read").textContent = readArticles.length;
  $("#stat-bookmarked").textContent = bookmarks.length;
  $("#stat-categories").textContent = categoriesVisited.size;
}

// ==========================================
// Toast
// ==========================================
function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  $("#toast-container").appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ==========================================
// Clipboard
// ==========================================
async function copyToClipboard(text, msg) {
  try {
    await navigator.clipboard.writeText(text);
    toast(msg || "Copied!");
  } catch {
    toast("Couldn't copy");
  }
}

// ==========================================
// Listeners
// ==========================================
function setupListeners() {
  // Nav
  $$(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      timeRange = "today";
      $$("#time-pills .pill").forEach(p => p.classList.toggle("active", p.dataset.range === "today"));
      loadCategory(btn.dataset.category);
    });
  });

  // Time range pills
  $$("#time-pills .pill").forEach(pill => {
    pill.addEventListener("click", () => {
      $$("#time-pills .pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      timeRange = pill.dataset.range;
      displayedCount = 0;

      // If we only have today's articles cached and user wants older, show what we have
      // RSS feeds typically contain ~1 week of articles
      if (["last-week", "this-month", "all"].includes(timeRange) && allArticles.length < 5) {
        // Try reloading to get max articles
        loadCategory(currentCategory);
      } else {
        applyFilters();
      }
    });
  });

  // Sort
  $("#sort-select").addEventListener("change", e => {
    sortMode = e.target.value;
    displayedCount = 0;
    applyFilters();
  });

  // Source filter
  $("#source-filter").addEventListener("change", e => {
    sourceFilter = e.target.value;
    displayedCount = 0;
    applyFilters();
  });

  // Search
  let searchDebounce;
  $("#search-input").addEventListener("input", () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      searchQuery = $("#search-input").value.trim().toLowerCase();
      $("#search-clear").style.display = searchQuery ? "block" : "none";
      displayedCount = 0;
      applyFilters();
    }, 200);
  });
  $("#search-clear").addEventListener("click", () => {
    $("#search-input").value = "";
    searchQuery = "";
    $("#search-clear").style.display = "none";
    displayedCount = 0;
    applyFilters();
  });

  // Load more
  $("#load-more-btn").addEventListener("click", renderArticles);

  // Reset filters
  $("#reset-filters-btn").addEventListener("click", () => {
    searchQuery = "";
    timeRange = "all";
    sourceFilter = "all";
    sortMode = "newest";
    $("#search-input").value = "";
    $("#search-clear").style.display = "none";
    $("#sort-select").value = "newest";
    $("#source-filter").value = "all";
    $$("#time-pills .pill").forEach(p => p.classList.toggle("active", p.dataset.range === "all"));
    displayedCount = 0;
    applyFilters();
  });

  // Theme
  $("#theme-toggle").addEventListener("click", () => {
    const t = document.documentElement.getAttribute("data-theme");
    setTheme(t === "dark" ? "light" : "dark");
  });

  // Font
  $("#font-increase").addEventListener("click", () => setFontScale(fontScale + 0.1));
  $("#font-decrease").addEventListener("click", () => setFontScale(fontScale - 0.1));

  // View mode
  $("#view-toggle").addEventListener("click", () => {
    const modes = ["grid", "list", "compact"];
    const next = modes[(modes.indexOf(viewMode) + 1) % modes.length];
    setViewMode(next);
    renderArticles();
    toast(`${next.charAt(0).toUpperCase() + next.slice(1)} view`);
  });

  // Refresh
  $("#refresh-btn").addEventListener("click", () => {
    loadCategory(currentCategory);
    toast("Refreshing...");
    startAutoRefresh();
  });

  // Modal
  $("#modal-close").addEventListener("click", closeModal);
  $("#modal-overlay").addEventListener("click", e => { if (e.target === $("#modal-overlay")) closeModal(); });
  $("#modal-bookmark").addEventListener("click", () => {
    if (currentModalArticle) {
      toggleBookmark(currentModalArticle.link);
      const isBookmarked = bookmarks.some(b => b.link === currentModalArticle.link);
      $("#modal-bookmark").innerHTML = isBookmarked ? "&#9733;" : "&#9734;";
      $("#modal-bookmark").classList.toggle("active", isBookmarked);
    }
  });
  $("#modal-share").addEventListener("click", () => {
    if (currentModalArticle) {
      if (navigator.share) {
        navigator.share({ title: currentModalArticle.title, url: currentModalArticle.link });
      } else {
        copyToClipboard(currentModalArticle.link, "Link copied!");
      }
    }
  });
  $("#modal-tts").addEventListener("click", toggleTTS);
  $("#modal-print").addEventListener("click", () => window.print());

  // Sidebar
  const sidebarOverlay = document.createElement("div");
  sidebarOverlay.className = "sidebar-overlay";
  sidebarOverlay.id = "sidebar-overlay";
  document.body.appendChild(sidebarOverlay);

  $("#sidebar-toggle").addEventListener("click", () => {
    $("#sidebar").classList.toggle("open");
    sidebarOverlay.classList.toggle("open");
  });
  $("#sidebar-close").addEventListener("click", () => {
    $("#sidebar").classList.remove("open");
    sidebarOverlay.classList.remove("open");
  });
  sidebarOverlay.addEventListener("click", () => {
    $("#sidebar").classList.remove("open");
    sidebarOverlay.classList.remove("open");
  });

  // Back to top
  window.addEventListener("scroll", () => {
    $("#back-to-top").classList.toggle("visible", window.scrollY > 400);
  });
  $("#back-to-top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Retry
  $("#retry-btn").addEventListener("click", () => loadCategory(currentCategory));

  // Clear bookmarks
  $("#clear-bookmarks").addEventListener("click", () => {
    bookmarks = [];
    localStorage.setItem("tdb_bookmarks", "[]");
    updateBookmarks();
    updateStats();
    renderArticles();
    toast("All saved articles cleared");
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", e => {
    // Don't trigger shortcuts when typing in search
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") {
      if (e.key === "Escape") {
        e.target.blur();
        closeModal();
      }
      return;
    }

    const modal = $("#modal-overlay").classList.contains("open");

    switch (e.key) {
      case "Escape":
        closeModal();
        $("#sidebar").classList.remove("open");
        $("#sidebar-overlay").classList.remove("open");
        break;
      case "/":
        e.preventDefault();
        $("#search-input").focus();
        break;
      case "d":
      case "D":
        if (!modal) {
          const t = document.documentElement.getAttribute("data-theme");
          setTheme(t === "dark" ? "light" : "dark");
        }
        break;
      case "r":
      case "R":
        if (!modal) {
          loadCategory(currentCategory);
          toast("Refreshing...");
        }
        break;
      case "j":
      case "J":
        if (!modal) navigateCards(1);
        break;
      case "k":
      case "K":
        if (!modal) navigateCards(-1);
        break;
      case "Enter":
        if (!modal && focusedCardIndex >= 0) {
          openModal(filteredArticles[focusedCardIndex]);
        }
        break;
      case "s":
      case "S":
        if (modal && currentModalArticle) {
          toggleBookmark(currentModalArticle.link);
          const isB = bookmarks.some(b => b.link === currentModalArticle.link);
          $("#modal-bookmark").innerHTML = isB ? "&#9733;" : "&#9734;";
          $("#modal-bookmark").classList.toggle("active", isB);
        } else if (!modal && focusedCardIndex >= 0 && filteredArticles[focusedCardIndex]) {
          toggleBookmark(filteredArticles[focusedCardIndex].link);
        }
        break;
      case "t":
      case "T":
        if (modal) toggleTTS();
        break;
    }
  });
}

function navigateCards(dir) {
  const cards = $$(".hero-card, .article-card");
  if (!cards.length) return;
  focusedCardIndex = Math.max(0, Math.min(cards.length - 1, focusedCardIndex + dir));
  cards[focusedCardIndex].focus();
  cards[focusedCardIndex].scrollIntoView({ behavior: "smooth", block: "center" });
}

// ==========================================
// Helpers
// ==========================================
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
  return Math.max(1, Math.round((text.split(/\s+/).length) / 200));
}

function esc(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

// ==========================================
// Boot
// ==========================================
init();
