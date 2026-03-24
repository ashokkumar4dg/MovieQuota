const DAILY_COUNT = 10;
const STORAGE_KEY = "moviequota-v2";
const APP_CONFIG = window.CINESWIPE_CONFIG || {};
let remoteTitles = [];

const POSTER_FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop stop-color="#0d1624"/>
          <stop offset="1" stop-color="#13243b"/>
        </linearGradient>
      </defs>
      <rect width="600" height="900" fill="url(#g)"/>
      <text x="50%" y="46%" fill="#f3f7ff" font-family="Arial, sans-serif" font-size="48" text-anchor="middle">MovieQuota</text>
      <text x="50%" y="53%" fill="#9db4d2" font-family="Arial, sans-serif" font-size="24" text-anchor="middle">Poster unavailable</text>
    </svg>
  `);

const RECOMMENDATION_DETAILS = {
  "laapataa-ladies": {
    platform: "Netflix",
    languages: "Hindi, English"
  },
  fallout: {
    platform: "Prime Video",
    languages: "English, Hindi"
  },
  mirzapur: {
    platform: "Prime Video",
    languages: "Hindi, English"
  },
  maharaja: {
    platform: "Netflix",
    languages: "Hindi, English"
  }
};

const TITLES = [
  {
    id: "dune-part-two",
    title: "Dune: Part Two",
    type: "Movie",
    industry: "Hollywood",
    year: 2024,
    duration: "2h 46m",
    imdb: 8.5,
    tmdb: 8.3,
    genres: ["Sci-Fi", "Adventure", "Epic"],
    description: "Paul Atreides steps into prophecy, war and revenge as Arrakis turns into the center of a brutal power clash.",
    poster: "https://image.tmdb.org/t/p/w780/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg"
  },
  {
    id: "shogun",
    title: "Shogun",
    type: "Series",
    industry: "Hollywood",
    year: 2024,
    duration: "Season 1",
    imdb: 8.6,
    tmdb: 8.5,
    genres: ["Drama", "War", "Political"],
    description: "A stranded English sailor gets pulled into feudal Japan, where survival depends on strategy, alliances and silence.",
    poster: "https://image.tmdb.org/t/p/w780/7O4iVfOMQmdCSxhOg1WnzG1AgYT.jpg"
  },
  {
    id: "animal",
    title: "Animal",
    type: "Movie",
    industry: "Indian",
    year: 2023,
    duration: "3h 21m",
    imdb: 6.1,
    tmdb: 6.8,
    genres: ["Action", "Crime", "Drama"],
    description: "A son's obsession with his father pushes him into an intense spiral of violence, loyalty and emotional damage.",
    poster: "https://image.tmdb.org/t/p/w780/rjrQ0yS6D7v0J8Oa9gD0B6s8K0v.jpg"
  },
  {
    id: "12th-fail",
    title: "12th Fail",
    type: "Movie",
    industry: "Indian",
    year: 2023,
    duration: "2h 27m",
    imdb: 8.8,
    tmdb: 8.0,
    genres: ["Drama", "Biography", "Motivation"],
    description: "A determined student from Chambal fights poverty, pressure and repeated failure to chase a civil services dream.",
    poster: "https://image.tmdb.org/t/p/w780/eH7A3eG6i7k0nD7x8uY9lT0m4Mc.jpg"
  },
  {
    id: "solo-leveling",
    title: "Solo Leveling",
    type: "Anime",
    industry: "Anime",
    year: 2024,
    duration: "Season 1",
    imdb: 8.3,
    tmdb: 8.6,
    genres: ["Anime", "Fantasy", "Action"],
    description: "The world's weakest hunter gains a strange power that lets him level up alone and become something terrifying.",
    poster: "https://image.tmdb.org/t/p/w780/9vO9d7kq0Fx6FQ6v6K0W0sYF5Jp.jpg"
  },
  {
    id: "oppenheimer",
    title: "Oppenheimer",
    type: "Movie",
    industry: "Hollywood",
    year: 2023,
    duration: "3h",
    imdb: 8.3,
    tmdb: 8.1,
    genres: ["Drama", "History", "Thriller"],
    description: "The race to build the atomic bomb becomes a portrait of genius, guilt, ambition and irreversible consequences.",
    poster: "https://image.tmdb.org/t/p/w780/ptpr0kGAckfQkJeJIt8st5dglvd.jpg"
  },
  {
    id: "fighter",
    title: "Fighter",
    type: "Movie",
    industry: "Indian",
    year: 2024,
    duration: "2h 46m",
    imdb: 6.4,
    tmdb: 6.1,
    genres: ["Action", "Patriotic", "Drama"],
    description: "Elite air force pilots face deadly combat and personal sacrifice while a rising threat escalates across borders.",
    poster: "https://image.tmdb.org/t/p/w780/5f3K9J1Y6rT7k3m3Q6tt4S6nJfP.jpg"
  },
  {
    id: "queen-of-tears",
    title: "Queen of Tears",
    type: "Series",
    industry: "K-Drama",
    year: 2024,
    duration: "Season 1",
    imdb: 8.2,
    tmdb: 8.4,
    genres: ["Romance", "Drama", "Comedy"],
    description: "A married couple at breaking point gets one more emotional chance when illness, ego and family politics collide.",
    poster: "https://image.tmdb.org/t/p/w780/4VLfN0E6hO0L3PqkzDzqCCpt5TR.jpg"
  },
  {
    id: "maharaja",
    title: "Maharaja",
    type: "Movie",
    industry: "Indian",
    year: 2024,
    duration: "2h 21m",
    imdb: 8.4,
    tmdb: 8.0,
    genres: ["Thriller", "Crime", "Drama"],
    description: "A barber walks into a police station demanding justice for a stolen object, but the truth is darker than it looks.",
    poster: "https://image.tmdb.org/t/p/w780/8h7i4nVQY5sKSdD3mUNm0gJx4mA.jpg"
  },
  {
    id: "fallout",
    title: "Fallout",
    type: "Series",
    industry: "Hollywood",
    year: 2024,
    duration: "Season 1",
    imdb: 8.3,
    tmdb: 8.4,
    genres: ["Sci-Fi", "Adventure", "Dark Comedy"],
    description: "Centuries after the apocalypse, a vault dweller enters a savage world where survival is ugly and absurd.",
    poster: "https://image.tmdb.org/t/p/w780/AnsSKR9LuK0T9bAOcPVA3PUvyWj.jpg"
  },
  {
    id: "crew",
    title: "Crew",
    type: "Movie",
    industry: "Indian",
    year: 2024,
    duration: "1h 58m",
    imdb: 6.0,
    tmdb: 7.0,
    genres: ["Comedy", "Drama", "Heist"],
    description: "Three flight attendants stuck in a failing airline get pulled into a stylish mess of lies, gold and hustle.",
    poster: "https://image.tmdb.org/t/p/w780/euXzHfCQlV5kC4S0lG6X4wZ6J5z.jpg"
  },
  {
    id: "deadpool-wolverine",
    title: "Deadpool & Wolverine",
    type: "Movie",
    industry: "Hollywood",
    year: 2024,
    duration: "2h 8m",
    imdb: 8.0,
    tmdb: 7.8,
    genres: ["Action", "Comedy", "Superhero"],
    description: "Chaos, meta jokes and multiverse damage hit full speed when Deadpool drags Wolverine into one more bad idea.",
    poster: "https://image.tmdb.org/t/p/w780/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg"
  },
  {
    id: "demon-slayer-hashira",
    title: "Demon Slayer: Hashira Training",
    type: "Anime",
    industry: "Anime",
    year: 2024,
    duration: "Arc",
    imdb: 8.1,
    tmdb: 8.2,
    genres: ["Anime", "Action", "Fantasy"],
    description: "Tanjiro trains with the Hashira to prepare for a final battle that demands speed, endurance and absolute focus.",
    poster: "https://image.tmdb.org/t/p/w780/7iMBZzVZtG0o2o4F4n4a58FmSPr.jpg"
  },
  {
    id: "kill",
    title: "Kill",
    type: "Movie",
    industry: "Indian",
    year: 2024,
    duration: "1h 55m",
    imdb: 7.6,
    tmdb: 7.7,
    genres: ["Action", "Thriller", "Violence"],
    description: "A train ride turns into a brutal survival gauntlet when commandos face a relentless gang in close quarters.",
    poster: "https://image.tmdb.org/t/p/w780/muYQ9lM4QmvdAezL8C3Bm0dM1pY.jpg"
  },
  {
    id: "the-bear",
    title: "The Bear",
    type: "Series",
    industry: "Hollywood",
    year: 2024,
    duration: "Season 3",
    imdb: 8.6,
    tmdb: 8.2,
    genres: ["Drama", "Comedy", "Food"],
    description: "Pressure, grief and ambition simmer in a restaurant kitchen where every tiny mistake feels like disaster.",
    poster: "https://image.tmdb.org/t/p/w780/sHFlbKS3WLqMnp9t2ghADIJFnuQ.jpg"
  },
  {
    id: "laapataa-ladies",
    title: "Laapataa Ladies",
    type: "Movie",
    industry: "Indian",
    year: 2024,
    duration: "2h 4m",
    imdb: 8.4,
    tmdb: 8.1,
    genres: ["Comedy", "Drama", "Social"],
    description: "A wedding mix-up sends two brides into very different journeys that turn quietly funny and deeply humane.",
    poster: "https://image.tmdb.org/t/p/w780/f2KpPqbT53B2B2sGc3rN8jY5Onf.jpg"
  },
  {
    id: "frieren",
    title: "Frieren: Beyond Journey's End",
    type: "Anime",
    industry: "Anime",
    year: 2024,
    duration: "Season 1",
    imdb: 8.9,
    tmdb: 8.8,
    genres: ["Anime", "Fantasy", "Adventure"],
    description: "After the hero's journey ends, an elf mage learns what time, memory and companionship actually mean.",
    poster: "https://image.tmdb.org/t/p/w780/dqV0Eh5DWWpU5pD8Pynsln1zp0j.jpg"
  },
  {
    id: "mirzapur",
    title: "Mirzapur",
    type: "Series",
    industry: "Indian",
    year: 2024,
    duration: "Season 3",
    imdb: 8.4,
    tmdb: 8.0,
    genres: ["Crime", "Drama", "Thriller"],
    description: "Power shifts again in Purvanchal as revenge, politics and family bloodlines push everyone closer to collapse.",
    poster: "https://image.tmdb.org/t/p/w780/q0Qx09i74To7s7FjvZsFWxjYf0K.jpg"
  },
  {
    id: "inside-out-2",
    title: "Inside Out 2",
    type: "Movie",
    industry: "Hollywood",
    year: 2024,
    duration: "1h 36m",
    imdb: 7.8,
    tmdb: 7.6,
    genres: ["Animation", "Comedy", "Family"],
    description: "Riley's mind gets even messier when new emotions arrive and start fighting for control during her teen years.",
    poster: "https://image.tmdb.org/t/p/w780/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg"
  },
  {
    id: "heeramandi",
    title: "Heeramandi",
    type: "Series",
    industry: "Indian",
    year: 2024,
    duration: "Season 1",
    imdb: 6.3,
    tmdb: 5.9,
    genres: ["Drama", "Period", "Romance"],
    description: "Love, power and betrayal play out in a lavish world where courtesans negotiate both desire and survival.",
    poster: "https://image.tmdb.org/t/p/w780/8cXbitj7lU8I0qvT1dQ0gQe0g6m.jpg"
  },
  {
    id: "blue-lock",
    title: "Blue Lock",
    type: "Anime",
    industry: "Anime",
    year: 2024,
    duration: "Season 1",
    imdb: 8.2,
    tmdb: 8.3,
    genres: ["Anime", "Sports", "Drama"],
    description: "Hundreds of strikers enter a ruthless football experiment where ego matters as much as talent.",
    poster: "https://image.tmdb.org/t/p/w780/tOB7iElR5B09h5C1dTObgATJE0p.jpg"
  }
];

const els = {
  dayLabel: document.getElementById("dayLabel"),
  progressText: document.getElementById("progressText"),
  progressFill: document.getElementById("progressFill"),
  card: document.getElementById("recommendationCard"),
  posterImage: document.getElementById("posterImage"),
  typeBadge: document.getElementById("typeBadge"),
  industryBadge: document.getElementById("industryBadge"),
  titleText: document.getElementById("titleText"),
  metaText: document.getElementById("metaText"),
  imdbBadge: document.getElementById("imdbBadge"),
  tmdbBadge: document.getElementById("tmdbBadge"),
  descriptionText: document.getElementById("descriptionText"),
  genreRow: document.getElementById("genreRow"),
  ratingStar: document.getElementById("ratingStar"),
  ratingEmoji: document.getElementById("ratingEmoji"),
  ratingState: document.getElementById("ratingState"),
  skipButton: document.getElementById("skipButton"),
  interestedButton: document.getElementById("interestedButton"),
  doneState: document.getElementById("doneState"),
  summaryText: document.getElementById("summaryText"),
  unlockText: document.getElementById("unlockText"),
  recommendationBox: document.getElementById("recommendationBox"),
  recommendationGrid: document.getElementById("recommendationGrid"),
  doneHistoryButton: document.getElementById("doneHistoryButton"),
  retakeButton: document.getElementById("retakeButton"),
  doneHistoryPreview: document.getElementById("doneHistoryPreview"),
  doneHistoryList: document.getElementById("doneHistoryList"),
  historyPanel: document.getElementById("historyPanel"),
  historyContent: document.getElementById("historyContent"),
  closeHistoryButton: document.getElementById("closeHistoryButton"),
  tabButtons: Array.from(document.querySelectorAll(".tab-button"))
};

let state = loadState();
let currentTab = "today";
let ratingPreview = 0;
let isAnimating = false;

bootstrap();

async function bootstrap() {
  ensureUserId();
  await hydrateRemoteTitles();
  ensureTodayBatch();
  bindEvents();
  render();
}

function loadState() {
  const fallback = {
    userId: "",
    activeDate: todayKey(),
    batches: {},
    history: {}
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function ensureUserId() {
  if (!state.userId) {
    state.userId = crypto.randomUUID();
    saveState();
  }
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function dateOffsetKey(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function formatDateLabel(dateKey) {
  return new Date(dateKey).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}

function formatTomorrowHint() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "short" });
}

function ensureTodayBatch() {
  const key = todayKey();
  state.activeDate = key;
  if (!state.batches[key]) {
    const previousIds = Object.values(state.batches).flat();
    state.batches[key] = pickDailyTitles(key, previousIds, getSourceTitles()).map((item) => item.id);
  }
  saveState();
}

function pickDailyTitles(seedInput, previousIds, sourceTitles) {
  const available = sourceTitles.filter((item) => !previousIds.includes(item.id));
  const pool = available.length >= DAILY_COUNT ? available : sourceTitles;
  return [...pool]
    .sort((a, b) => seededRandom(`${seedInput}-${a.id}`) - seededRandom(`${seedInput}-${b.id}`))
    .slice(0, DAILY_COUNT);
}

function seededRandom(seed) {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(Math.sin(hash) * 10000) % 1;
}

function getSourceTitles() {
  return remoteTitles.length ? remoteTitles : TITLES;
}

function getTodayTitles() {
  const ids = state.batches[state.activeDate] || [];
  const sourceTitles = getSourceTitles();
  return ids.map((id) => sourceTitles.find((item) => item.id === id)).filter(Boolean);
}

function getTodayActions() {
  return state.history[state.activeDate] || {};
}

function getCurrentTitle() {
  const actions = getTodayActions();
  return getTodayTitles().find((item) => !actions[item.id]) || null;
}

function getCompletedCount() {
  return Object.keys(getTodayActions()).length;
}

async function hydrateRemoteTitles() {
  if (!APP_CONFIG.titlesEndpoint) {
    return;
  }

  try {
    const response = await fetch(APP_CONFIG.titlesEndpoint, {
      headers: buildRemoteHeaders()
    });
    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`);
    }
    const payload = await response.json();
    const list = Array.isArray(payload) ? payload : payload.titles;
    if (Array.isArray(list) && list.length) {
      remoteTitles = normalizeTitles(list);
    }
  } catch (error) {
    console.warn("Remote title fetch failed", error);
  }
}

function normalizeTitles(items) {
  return items
    .filter((item) => item && (item.id || item.source_id) && item.title)
    .map((item, index) => ({
      id: item.id || item.source_id || `remote-${index}`,
      title: item.title,
      type: item.type || item.content_type || "Movie",
      industry: item.industry || item.language || "Mixed",
      year: item.year || extractYear(item.release_date) || "New",
      duration: item.duration || item.runtime || "Trending pick",
      imdb: Number(item.imdb || item.imdb_rating || item.vote_average || 0).toFixed(1),
      tmdb: Number(item.tmdb || item.tmdb_rating || item.vote_average || 0).toFixed(1),
      genres: Array.isArray(item.genres) ? item.genres : ["Trending"],
      description: item.description || item.overview || "Fresh recommendation for today's audience.",
      poster: item.poster || item.poster_url || item.backdrop_url || POSTER_FALLBACK
    }));
}

function extractYear(value) {
  return value && typeof value === "string" ? value.slice(0, 4) : null;
}

function buildRemoteHeaders() {
  const headers = { "x-device-token": state.userId };
  if (APP_CONFIG.apiKey) {
    headers.Authorization = `Bearer ${APP_CONFIG.apiKey}`;
  }
  return headers;
}

async function syncAction(payload) {
  if (!APP_CONFIG.actionsEndpoint) {
    return;
  }

  try {
    await fetch(APP_CONFIG.actionsEndpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...buildRemoteHeaders()
      },
      body: JSON.stringify({
        deviceToken: state.userId,
        ...payload
      })
    });
  } catch (error) {
    console.warn("Action sync failed", error);
  }
}

function render() {
  const completed = getCompletedCount();
  els.dayLabel.textContent = formatDateLabel(state.activeDate);
  els.progressText.textContent = `${completed} / ${DAILY_COUNT} completed`;
  els.progressFill.style.width = `${(completed / DAILY_COUNT) * 100}%`;

  const current = getCurrentTitle();
  if (!current) {
    renderDoneState();
    renderHistory();
    return;
  }

  els.card.classList.remove("hidden");
  els.doneState.classList.add("hidden");
  els.doneHistoryPreview.classList.add("hidden");
  ratingPreview = 0;

  els.posterImage.src = current.poster || POSTER_FALLBACK;
  els.posterImage.alt = `${current.title} poster`;
  els.posterImage.onerror = () => {
    els.posterImage.onerror = null;
    els.posterImage.src = POSTER_FALLBACK;
  };
  els.typeBadge.textContent = current.type;
  els.industryBadge.textContent = current.industry;
  els.titleText.textContent = current.title;
  els.metaText.textContent = `${current.year} - ${current.duration}`;
  els.imdbBadge.textContent = `IMDb ${current.imdb}`;
  els.tmdbBadge.textContent = `TMDB ${current.tmdb}`;
  els.descriptionText.textContent = current.description;

  els.genreRow.innerHTML = "";
  current.genres.forEach((genre) => {
    const span = document.createElement("span");
    span.textContent = genre;
    els.genreRow.appendChild(span);
  });

  updateRatingUI(0);
  renderHistory();
}

function renderDoneState() {
  const entries = Object.values(getTodayActions());
  const likedCount = entries.filter((entry) => entry.liked).length;
  els.summaryText.textContent = `You rated ${entries.length} titles today and liked ${likedCount}.`;
  els.unlockText.textContent = `New recommendations unlock after ${formatTomorrowHint()}.`;
  renderRecommendations(entries);
  renderHistory();
  els.card.classList.add("hidden");
  els.doneState.classList.remove("hidden");
}

function renderRecommendations(entries) {
  const picks = getPersonalRecommendations(entries);
  els.recommendationGrid.innerHTML = "";

  if (!picks.length) {
    els.recommendationBox.classList.add("hidden");
    return;
  }

  picks.forEach((item) => {
    const details = RECOMMENDATION_DETAILS[item.id];
    const card = document.createElement("article");
    card.className = "recommendation-card-mini";
    card.innerHTML = `
      <div class="recommendation-head">
        <h3>${item.title}</h3>
        <span class="recommendation-rating">IMDb ${item.imdb}</span>
      </div>
      <p class="subtle">${item.reason}</p>
      <p class="recommendation-line">${item.type}${details ? ` - ${details.platform} - ${details.languages}` : ""}</p>
      <a class="watch-link" href="https://t.me/MovieQuota" target="_blank" rel="noreferrer">Watch Online</a>
    `;
    els.recommendationGrid.appendChild(card);
  });

  els.recommendationBox.classList.remove("hidden");
}

function getPersonalRecommendations(entries) {
  const strong = entries.filter((entry) => Number(entry.rating) >= 4);
  const pool = strong.length ? strong : entries.filter((entry) => entry.liked);
  if (!pool.length) {
    return [];
  }

  const sourceTitles = getSourceTitles();
  const seen = new Set(Object.values(state.history).flatMap((day) => Object.keys(day)));
  const genreScores = {};
  const industryScores = {};

  pool.forEach((entry) => {
    const title = sourceTitles.find((item) => item.id === entry.titleId);
    if (!title) {
      return;
    }
    const weight = Number(entry.rating) || 3;
    title.genres.forEach((genre) => {
      genreScores[genre] = (genreScores[genre] || 0) + weight;
    });
    industryScores[title.industry] = (industryScores[title.industry] || 0) + weight;
  });

  const topGenre = Object.entries(genreScores).sort((a, b) => b[1] - a[1])[0]?.[0];
  const topIndustry = Object.entries(industryScores).sort((a, b) => b[1] - a[1])[0]?.[0];

  return sourceTitles
    .filter((item) => !seen.has(item.id))
    .map((item) => ({
      ...item,
      score:
        (topGenre && item.genres.includes(topGenre) ? 4 : 0) +
        (topIndustry && item.industry === topIndustry ? 3 : 0) +
        Number(item.imdb) / 2,
      reason:
        topGenre && item.genres.includes(topGenre)
          ? `Because you rated ${topGenre.toLowerCase()} titles highly, this is a strong match.`
          : "This matches your recent ratings and likes."
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);
}

function renderStarText(rating) {
  const value = Number(rating) || 0;
  let stars = "";
  for (let i = 1; i <= 5; i += 1) {
    stars += i <= value ? "★" : "☆";
  }
  return stars;
}

function renderHistory() {
  let entries = [];
  if (currentTab === "week") {
    for (let offset = 0; offset > -7; offset -= 1) {
      entries.push(...Object.values(state.history[dateOffsetKey(offset)] || {}));
    }
  } else {
    const key = currentTab === "yesterday" ? dateOffsetKey(-1) : todayKey();
    entries = Object.values(state.history[key] || {});
  }

  els.historyContent.innerHTML = "";

  if (!entries.length) {
    els.historyContent.innerHTML = `<div class="empty-state">No activity here yet.</div>`;
    return;
  }

  entries
    .sort((a, b) => new Date(b.actedAt) - new Date(a.actedAt))
    .forEach((entry) => {
      const item = document.createElement("article");
      item.className = "history-item";
      item.innerHTML = `
        <img src="${entry.poster || POSTER_FALLBACK}" alt="${entry.title} poster" />
        <div class="history-meta">
          <strong>${entry.title}</strong>
          <p>${entry.liked ? "Liked" : "Skipped"} - ${entry.rating ? `${entry.rating}/5` : "No rating"}</p>
          ${entry.rating ? `<p class="history-stars">${renderStarText(entry.rating)}</p>` : ""}
          <p class="subtle">${new Date(entry.actedAt).toLocaleString()}</p>
        </div>
      `;
      const image = item.querySelector("img");
      image.onerror = () => {
        image.onerror = null;
        image.src = POSTER_FALLBACK;
      };
      els.historyContent.appendChild(item);
    });
}

function renderDoneHistoryPreview() {
  const entries = Object.values(getTodayActions()).sort((a, b) => new Date(b.actedAt) - new Date(a.actedAt));
  els.doneHistoryList.innerHTML = "";

  entries.forEach((entry) => {
    const item = document.createElement("article");
    item.className = "done-history-item";
    item.innerHTML = `
      <img src="${entry.poster || POSTER_FALLBACK}" alt="${entry.title} poster" />
      <div class="done-history-body">
        <strong class="done-history-title">${entry.title}</strong>
        <div class="done-history-divider"></div>
        ${entry.rating ? `<p class="history-stars">${renderStarText(entry.rating)}</p>` : ""}
        <p class="subtle">Rated ${entry.rating ? `${entry.rating}/5` : "No rating"} at ${new Date(entry.actedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
      </div>
    `;
    const image = item.querySelector("img");
    image.onerror = () => {
      image.onerror = null;
      image.src = POSTER_FALLBACK;
    };
    els.doneHistoryList.appendChild(item);
  });
}

function updateRatingUI(rating) {
  const value = Number(rating) || 0;
  els.ratingStar.innerHTML = "";
  for (let i = 1; i <= 5; i += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `rating-star-button${i <= value ? " filled" : ""}`;
    button.dataset.rating = String(i);
    button.textContent = i <= value ? "★" : "☆";
    button.setAttribute("aria-label", `Rate ${i} star${i === 1 ? "" : "s"}`);
    els.ratingStar.appendChild(button);
  }
  els.ratingState.textContent = value ? `Locked at ${value}/5` : "Tap 1-5 stars to rate";
  els.ratingEmoji.textContent = "";
}

function bindEvents() {
  els.skipButton.onclick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    commitAction({ swipeDirection: "left", liked: false, rating: null, animateClass: "auto-advance-left", haptic: [18, 12, 22] });
  };

  els.interestedButton.onclick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    commitAction({ swipeDirection: "right", liked: true, rating: null, animateClass: "auto-advance-right", haptic: [18, 12, 22] });
  };

  els.ratingStar.onpointermove = (event) => {
    if (!window.matchMedia("(hover: hover)").matches) {
      return;
    }
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const rating = Number(target.dataset.rating || 0);
    if (!rating || rating === ratingPreview) {
      return;
    }
    ratingPreview = rating;
    updateRatingUI(rating);
  };

  els.ratingStar.onpointerleave = () => {
    if (!window.matchMedia("(hover: hover)").matches) {
      return;
    }
    ratingPreview = 0;
    updateRatingUI(0);
  };

  els.ratingStar.onclick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const rating = Number(target.dataset.rating || 0);
    if (!rating || isAnimating) {
      return;
    }
    ratingPreview = 0;
    updateRatingUI(rating);
    vibrate([12, 8, 18]);
    window.setTimeout(() => {
      commitAction({ swipeDirection: "right", liked: true, rating, animateClass: "auto-advance-right", haptic: [12, 8, 18] });
    }, 140);
  };

  els.closeHistoryButton.onclick = () => {
    els.historyPanel.classList.add("hidden");
  };

  els.doneHistoryButton.onclick = () => {
    renderDoneHistoryPreview();
    els.doneHistoryPreview.classList.remove("hidden");
    els.doneHistoryPreview.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  els.retakeButton.onclick = () => {
    state.history[state.activeDate] = {};
    saveState();
    els.doneHistoryPreview.classList.add("hidden");
    render();
  };

  els.tabButtons.forEach((button) => {
    button.onclick = () => {
      currentTab = button.dataset.tab;
      els.tabButtons.forEach((item) => item.classList.toggle("active", item === button));
      renderHistory();
    };
  });

  bindSwipeGestures();
}

function bindSwipeGestures() {
  let startX = 0;
  let diffX = 0;
  let active = false;

  els.card.addEventListener("pointerdown", (event) => {
    const blocked = event.target instanceof HTMLElement && event.target.closest(".rating-block, .outside-actions");
    if (blocked || isAnimating) {
      active = false;
      return;
    }
    startX = event.clientX;
    diffX = 0;
    active = true;
  });

  els.card.addEventListener("pointermove", (event) => {
    if (!active) {
      return;
    }
    diffX = event.clientX - startX;
    if (diffX > 14) {
      els.card.classList.add("swipe-right");
      els.card.classList.remove("swipe-left");
    } else if (diffX < -14) {
      els.card.classList.add("swipe-left");
      els.card.classList.remove("swipe-right");
    } else {
      els.card.classList.remove("swipe-left", "swipe-right");
    }
  });

  ["pointerup", "pointercancel", "pointerleave"].forEach((name) => {
    els.card.addEventListener(name, () => {
      if (!active) {
        return;
      }
      active = false;
      if (diffX > 48) {
        commitAction({ swipeDirection: "right", liked: true, rating: null, animateClass: "auto-advance-right", haptic: [18, 12, 22] });
      } else if (diffX < -48) {
        commitAction({ swipeDirection: "left", liked: false, rating: null, animateClass: "auto-advance-left", haptic: [18, 12, 22] });
      } else {
        els.card.classList.remove("swipe-left", "swipe-right");
      }
    });
  });
}

function commitAction(partial) {
  const current = getCurrentTitle();
  if (!current || isAnimating) {
    return;
  }

  const finalize = () => {
    const todayHistory = state.history[state.activeDate] || {};
    todayHistory[current.id] = {
      titleId: current.id,
      title: current.title,
      poster: current.poster,
      liked: Boolean(partial.liked),
      swipeDirection: partial.swipeDirection || "right",
      rating: partial.rating || null,
      actedAt: new Date().toISOString()
    };
    state.history[state.activeDate] = todayHistory;
    saveState();
    void syncAction({
      titleId: current.id,
      swipeDirection: partial.swipeDirection || "right",
      liked: Boolean(partial.liked),
      rating: partial.rating || null
    });
    vibrate(partial.haptic || 35);
    els.card.classList.remove("swipe-left", "swipe-right", "auto-advance-left", "auto-advance-right");
    isAnimating = false;
    render();
  };

  if (partial.animateClass) {
    isAnimating = true;
    els.card.classList.remove("swipe-left", "swipe-right", "auto-advance-left", "auto-advance-right");
    void els.card.offsetWidth;
    els.card.classList.add(partial.animateClass);
    window.setTimeout(finalize, 240);
    return;
  }

  finalize();
}

function vibrate(pattern = 35) {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}
