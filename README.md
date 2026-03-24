# CineSwipe

Static prototype for a Telegram-friendly daily movie and series recommendation page.

## Files

- `index.html`: layout and card/history markup
- `styles.css`: glassmorphism UI and responsive styling
- `app.js`: daily batch logic, swipe actions, local history, optional remote fetch
- `config.js`: safe local config loaded by default
- `config.example.js`: remote endpoint config example
- `supabase-schema.sql`: starter Supabase schema
- `supabase-edge-function.ts`: sample Edge Function for titles + action sync
- `vercel.json`: static deploy config

## Run

Open `index.html` directly in a browser.

## Current behavior

- Shows 10 recommendations per day
- Saves likes, skips and ratings in local storage
- Shows today, yesterday and last 7 days history
- Uses local curated data by default
- Can fetch live titles from a remote endpoint if `window.CINESWIPE_CONFIG` is present

## Enable live data

1. Copy `config.example.js` to `config.js`
2. Set `titlesEndpoint` to your API or Supabase Edge Function URL
3. Optionally set `actionsEndpoint` to save likes, skips and ratings remotely
4. Return JSON in either of these shapes:

```json
[
  {
    "id": "abc123",
    "title": "Dune: Part Two",
    "content_type": "movie",
    "industry": "Hollywood",
    "release_date": "2024-03-01",
    "runtime": "2h 46m",
    "imdb_rating": 8.5,
    "tmdb_rating": 8.3,
    "genres": ["Sci-Fi", "Adventure"],
    "overview": "Description here",
    "poster_url": "https://..."
  }
]
```

or

```json
{ "titles": [ ... ] }
```

## Next production steps

- Add Supabase anonymous session mapping for each browser
- Replace local-only history with Supabase-backed history
- Add cron job to refresh daily batches
- Pull poster and overview data from TMDB
- Deploy static frontend on Vercel, Netlify or Cloudflare Pages
