const DAILY_COUNT = 10;
const STORAGE_KEY = "cineswipe-v1";
const APP_CONFIG = window.CINESWIPE_CONFIG || {};
let remoteTitles = [];
const POSTER_FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop stop-color="#16263d"/>
          <stop offset="1" stop-color="#0c1422"/>
        </linearGradient>
      </defs>
      <rect width="600" height="900" fill="url(#g)"/>
      <text x="50%" y="46%" fill="#f4f7fb" font-family="Arial, sans-serif" font-size="46" text-anchor="middle">MovieQuota</text>
      <text x="50%" y="53%" fill="#9eb2c8" font-family="Arial, sans-serif" font-size="24" text-anchor="middle">Poster unavailable</text>
    </svg>
  `);

const RECOMMENDATION_DETAILS = {
  "laapataa-ladies": {
    platform: "Netflix",
    languages: "Hindi, English",
    note: "Available on Netflix. Hindi is primary, with English support available."
  },
  "fallout": {
    platform: "Prime Video",
    languages: "English, Hindi",
    note: "Available on Prime Video. English is original, and Hindi availability is supported on Prime Video India."
  },
  "mirzapur": {
    platform: "Prime Video",
    languages: "Hindi, English",
    note: "Available on Prime Video. Hindi is primary, with English support available."
  },
  "maharaja": {
    platform: "Netflix",
    languages: "Hindi, English",
    note: "Available on Netflix with Hindi access and English support."
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
  skipButton: document.getElementById("skipButton"),
  interestedButton: document.getElementById("interestedButton"),
  ratingGrid: document.getElementById("ratingGrid"),
  ratingState: document.getElementById("ratingState"),
  doneState: document.getElementById("doneState"),
  summaryText: document.getElementById("summaryText"),
  unlockText: document.getElementById("unlockText"),
  recommendationBox: document.getElementById("recommendationBox"),
  recommendationGrid: document.getElementById("recommendationGrid"),
  historyPanel: document.getElementById("historyPanel"),
  historyContent: document.getElementById("historyContent"),
  historyToggle: document.getElementById("historyToggle"),
  closeHistoryButton: document.getElementById("closeHistoryButton"),
  doneHistoryButton: document.getElementById("doneHistoryButton"),
  retakeButton: document.getElementById("retakeButton"),
  tabButtons: Array.from(document.querySelectorAll(".tab-button"))
};

let state = loadState();
let currentTab = "today";

bootstrap();

async function bootstrap() {
  ensureDeviceToken();
  await hydrateRemoteTitles();
  ensureTodayBatch();
  renderRatingButtons();
  bindEvents();
  render();
}

function loadState() {
  const fallback = {
    userId: crypto.randomUUID(),
    history: {},
    batches: {},
    activeDate: todayKey()
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return fallback;
    }
    return { ...fallback, ...JSON.parse(raw) };
  } catch (error) {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function ensureDeviceToken() {
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

function ensureTodayBatch() {
  const key = todayKey();
  state.activeDate = key;
  const sourceTitles = getSourceTitles();

  if (!state.batches[key]) {
    const previousIds = Object.values(state.batches).flat();
    const selection = pickDailyTitles(key, previousIds, sourceTitles);
    state.batches[key] = selection.map((item) => item.id);
  }

  saveState();
}

function pickDailyTitles(seedInput, previousIds, sourceTitles) {
  const available = sourceTitles.filter((item) => !previousIds.includes(item.id));
  const pool = available.length >= DAILY_COUNT ? available : sourceTitles;
  const seeded = [...pool].sort((a, b) => seededRandom(`${seedInput}-${a.id}`) - seededRandom(`${seedInput}-${b.id}`));
  return seeded.slice(0, DAILY_COUNT);
}

function seededRandom(seed) {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(Math.sin(hash) * 10000) % 1;
}

function getTodayTitles() {
  const ids = state.batches[state.activeDate] || [];
  const sourceTitles = getSourceTitles();
  return ids.map((id) => sourceTitles.find((item) => item.id === id)).filter(Boolean);
}

function getTodayActions() {
  return state.history[state.activeDate] || {};
}

function getCompletedCount() {
  return Object.keys(getTodayActions()).length;
}

function getCurrentTitle() {
  const todayTitles = getTodayTitles();
  const actions = getTodayActions();
  return todayTitles.find((item) => !actions[item.id]) || null;
}

function render() {
  const completed = getCompletedCount();
  const percent = completed / DAILY_COUNT * 100;
  els.dayLabel.textContent = formatDateLabel(state.activeDate);
  els.progressText.textContent = `${completed} / ${DAILY_COUNT} completed`;
  els.progressFill.style.width = `${percent}%`;

  const current = getCurrentTitle();
  if (!current) {
    renderDoneState();
    renderHistory();
    return;
  }

  els.card.classList.remove("hidden");
  els.doneState.classList.add("hidden");

  els.posterImage.src = current.poster;
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
    const pill = document.createElement("span");
    pill.className = "chip chip-soft";
    pill.textContent = genre;
    els.genreRow.appendChild(pill);
  });

  updateRatingUI(null);
  renderHistory();
}

function renderDoneState() {
  const todayEntries = Object.values(getTodayActions());
  const likedCount = todayEntries.filter((entry) => entry.liked).length;
  const topGenres = summarizeTopGenres(todayEntries);
  els.summaryText.textContent = `You liked ${likedCount} titles today. Top mood: ${topGenres || "Still learning your taste"}.`;
  renderRecommendation(todayEntries);
  els.unlockText.textContent = `New recommendations unlock after ${formatTomorrowHint()}.`;
  els.card.classList.add("hidden");
  els.doneState.classList.remove("hidden");
}

function summarizeTopGenres(entries) {
  const counter = {};
  const sourceTitles = getSourceTitles();
  entries.forEach((entry) => {
    const item = sourceTitles.find((title) => title.id === entry.titleId);
    if (!item || !entry.liked) {
      return;
    }
    item.genres.forEach((genre) => {
      counter[genre] = (counter[genre] || 0) + 1;
    });
  });
  const top = Object.entries(counter).sort((a, b) => b[1] - a[1])[0];
  return top ? top[0] : "";
}

function renderRecommendation(entries) {
  const recommendations = getPersonalRecommendations(entries);
  if (!recommendations.length) {
    els.recommendationBox.classList.add("hidden");
    return;
  }

  els.recommendationGrid.innerHTML = "";
  recommendations.forEach((recommendation) => {
    const details = RECOMMENDATION_DETAILS[recommendation.id] || null;
    const card = document.createElement("article");
    card.className = "recommendation-card-mini";
    card.innerHTML = `
      <h3>${recommendation.title}</h3>
      <p class="subtle">${recommendation.reason}</p>
      <div class="recommendation-meta">
        <span class="chip chip-soft">${recommendation.type}</span>
        <span class="rating-pill">IMDb ${recommendation.imdb}</span>
      </div>
      ${details ? `<p class="recommendation-extra">${details.platform} • ${details.languages}</p><p class="recommendation-extra">${details.note}</p>` : ""}
    `;
    els.recommendationGrid.appendChild(card);
  });
  els.recommendationBox.classList.remove("hidden");
}

function getPersonalRecommendations(entries) {
  const sourceTitles = getSourceTitles();
  const watchedToday = new Set(entries.map((entry) => entry.titleId));
  const strongLikes = entries.filter((entry) => Number(entry.rating) >= 8);
  const ratedPool = strongLikes.length ? strongLikes : entries.filter((entry) => entry.liked);

  if (!ratedPool.length) {
    return [];
  }

  const genreScores = {};
  const industryScores = {};

  ratedPool.forEach((entry) => {
    const item = sourceTitles.find((title) => title.id === entry.titleId);
    if (!item) {
      return;
    }
    const weight = Number(entry.rating) || 7;
    item.genres.forEach((genre) => {
      genreScores[genre] = (genreScores[genre] || 0) + weight;
    });
    industryScores[item.industry] = (industryScores[item.industry] || 0) + weight;
  });

  const topGenre = getTopKey(genreScores);
  const topIndustry = getTopKey(industryScores);
  const seenEver = getSeenTitleIds();
  const pool = sourceTitles
    .filter((item) => !watchedToday.has(item.id))
    .filter((item) => !seenEver.has(item.id))
    .map((item) => ({
      item,
      score: getRecommendationScore(item, topGenre, topIndustry) + getMetadataBonus(item.id)
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || Number(b.item.imdb) - Number(a.item.imdb));

  const picks = [];
  const moviePick = pool.find((entry) => entry.item.type === "Movie");
  const seriesPick = pool.find((entry) => entry.item.type !== "Movie");

  if (moviePick) {
    picks.push({
      ...moviePick.item,
      reason: buildRecommendationReason(moviePick.item, topGenre, topIndustry)
    });
  }

  if (seriesPick) {
    picks.push({
      ...seriesPick.item,
      reason: buildRecommendationReason(seriesPick.item, topGenre, topIndustry)
    });
  }

  return picks.slice(0, 2);
}

function getRecommendationScore(item, topGenre, topIndustry) {
  let score = 0;
  if (topGenre && item.genres.includes(topGenre)) {
    score += 4;
  }
  if (topIndustry && item.industry === topIndustry) {
    score += 3;
  }
  score += Number(item.imdb || 0) / 2;
  return score;
}

function getMetadataBonus(id) {
  return RECOMMENDATION_DETAILS[id] ? 1.5 : 0;
}

function buildRecommendationReason(item, topGenre, topIndustry) {
  if (topGenre && topIndustry && item.genres.includes(topGenre) && item.industry === topIndustry) {
    return `Because you rated ${topGenre.toLowerCase()} ${topIndustry.toLowerCase()} titles highly, you should also watch this.`;
  }
  if (topGenre && item.genres.includes(topGenre)) {
    return `You clicked 8, 9 or 10 more often on ${topGenre.toLowerCase()} picks, so this is a strong match.`;
  }
  if (topIndustry && item.industry === topIndustry) {
    return `You seem to enjoy ${topIndustry.toLowerCase()} recommendations more, so this fits your current taste.`;
  }
  return "This matches your recent high-rating pattern and should fit your taste.";
}

function getTopKey(counter) {
  const top = Object.entries(counter).sort((a, b) => b[1] - a[1])[0];
  return top ? top[0] : "";
}

function getSeenTitleIds() {
  const ids = new Set();
  Object.values(state.history).forEach((dayEntries) => {
    Object.values(dayEntries).forEach((entry) => {
      ids.add(entry.titleId);
    });
  });
  return ids;
}

function getSourceTitles() {
  return remoteTitles.length ? remoteTitles : TITLES;
}

async function hydrateRemoteTitles() {
  if (APP_CONFIG.titlesEndpoint) {
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
        return;
      }
    } catch (error) {
      console.warn("Remote title fetch failed", error);
    }
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
  if (!value || typeof value !== "string") {
    return null;
  }
  return value.slice(0, 4);
}

function buildRemoteHeaders() {
  const headers = {
    "x-device-token": state.userId
  };

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

function formatTomorrowHint() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "short" });
}

function renderRatingButtons() {
  els.ratingGrid.innerHTML = "";
  for (let rating = 1; rating <= 10; rating += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "rating-button";
    if (rating <= 3) {
      button.classList.add("low");
    } else if (rating <= 7) {
      button.classList.add("mid");
    } else {
      button.classList.add("high");
    }
    button.textContent = rating;
    button.dataset.rating = String(rating);
    button.setAttribute("aria-label", `Rate ${rating} out of 10`);
    els.ratingGrid.appendChild(button);
  }
}

function updateRatingUI(selectedRating) {
  const buttons = Array.from(els.ratingGrid.querySelectorAll(".rating-button"));
  buttons.forEach((button) => {
    const isSelected = Number(button.dataset.rating) === selectedRating;
    button.classList.toggle("selected", isSelected);
  });
  els.ratingState.textContent = selectedRating ? `Locked at ${selectedRating}/10` : "Tap 1-10 to lock";
}

function bindEvents() {
  els.interestedButton.addEventListener("click", () => {
    commitAction({ swipeDirection: "right", liked: true, rating: null });
  });
  els.skipButton.addEventListener("click", () => {
    commitAction({ swipeDirection: "left", liked: false, rating: null });
  });

  els.ratingGrid.addEventListener("click", (event) => {
    const target = event.target.closest(".rating-button");
    if (!target) {
      return;
    }
    const rating = Number(target.dataset.rating);
    commitAction({ swipeDirection: "right", liked: true, rating });
  });

  els.historyToggle.addEventListener("click", toggleHistoryPanel);
  els.closeHistoryButton.addEventListener("click", toggleHistoryPanel);
  els.doneHistoryButton.addEventListener("click", () => {
    els.historyPanel.classList.remove("hidden");
    renderHistory();
  });
  els.retakeButton.addEventListener("click", resetTodayProgress);

  els.tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      currentTab = button.dataset.tab;
      els.tabButtons.forEach((item) => item.classList.toggle("active", item === button));
      renderHistory();
    });
  });

  bindSwipeGestures();
}

function bindSwipeGestures() {
  let startX = 0;
  let diffX = 0;
  let active = false;

  els.card.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") {
      els.card.setPointerCapture(event.pointerId);
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
    if (diffX > 18) {
      els.card.classList.add("swipe-right");
      els.card.classList.remove("swipe-left");
    } else if (diffX < -18) {
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
      if (diffX > 55) {
        animateThen(() => commitAction({ swipeDirection: "right", liked: true, rating: null }));
      } else if (diffX < -55) {
        animateThen(() => commitAction({ swipeDirection: "left", liked: false, rating: null }));
      }
      els.card.classList.remove("swipe-left", "swipe-right");
    });
  });
}

function animateThen(callback) {
  window.setTimeout(callback, 120);
}

function commitAction(partial) {
  const current = getCurrentTitle();
  if (!current) {
    return;
  }

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
  vibrate();
  render();
}

function vibrate() {
  if (navigator.vibrate) {
    navigator.vibrate(35);
  }
}

function toggleHistoryPanel() {
  els.historyPanel.classList.toggle("hidden");
  renderHistory();
}

function renderHistory() {
  const selectedDateKey = getTabDateKey(currentTab);
  let entries = [];

  if (currentTab === "week") {
    entries = getLastSevenDaysEntries();
  } else {
    entries = Object.values(state.history[selectedDateKey] || {});
  }

  els.historyContent.innerHTML = "";

  if (!entries.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No activity here yet.";
    els.historyContent.appendChild(empty);
    return;
  }

  entries
    .sort((a, b) => new Date(b.actedAt) - new Date(a.actedAt))
    .forEach((entry) => {
      const item = document.createElement("article");
      item.className = "history-item";
      const poster = entry.poster || POSTER_FALLBACK;
      item.innerHTML = `
        <img src="${poster}" alt="${entry.title} poster" />
        <div class="history-meta">
          <strong>${entry.title}</strong>
          <p>${entry.liked ? "Liked" : "Skipped"} - ${entry.rating ? `${entry.rating}/10` : "No rating"}</p>
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

function getTabDateKey(tab) {
  if (tab === "yesterday") {
    return dateOffsetKey(-1);
  }
  return todayKey();
}

function getLastSevenDaysEntries() {
  const items = [];
  for (let offset = 0; offset > -7; offset -= 1) {
    const dateKey = dateOffsetKey(offset);
    items.push(...Object.values(state.history[dateKey] || {}));
  }
  return items;
}

function formatDateLabel(dateKey) {
  const date = new Date(dateKey);
  return date.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
}

function resetTodayProgress() {
  state.history[state.activeDate] = {};
  saveState();
  els.historyPanel.classList.add("hidden");
  vibrate();
  render();
}
