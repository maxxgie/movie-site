# CineVault

A personal movie streaming site you can reach from any device. Browse and search a full
catalogue, keep a watchlist, write reviews, and play films back with a proper video player.

Built with **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4**, with movie metadata
from **TMDB**.

---

## Features

| Feature | Where |
| --- | --- |
| Cinematic home page with hero, rows, genre shortcuts | `/` |
| Search by title with genre / year / rating filters and sorting | `/search`, `/browse` |
| Movie detail pages: cast, crew, budgets, similar titles | `/movie/[id]` |
| Trailer embed (YouTube) on the detail page and in the hero | `/movie/[id]` |
| Streaming player: HLS + MP4 + YouTube, custom controls, speed, fullscreen | `/watch/[id]` |
| Resume where you left off, plus a "Continue Watching" row | localStorage |
| Watchlist ("My List") | `/my-list` |
| Star ratings + written reviews with a rating breakdown | `/reviews` |
| Dark / light theme with persistence | header toggle |

---

## 1. Get it running locally

```bash
cd movie-site
npm install
cp .env.example .env.local     # then add your TMDB key
npm run dev
```

Open http://localhost:3000.

To reach the dev server from your phone or another device on the same Wi-Fi, run
`npm run dev:lan` and open `http://<your-computer-ip>:3000`.

The site works **without** a TMDB key - it falls back to a bundled sample catalogue of 30
titles so you can work on the rest of the app. Add a key to switch to the live catalogue.

### Getting a TMDB key

1. Sign up at <https://www.themoviedb.org>.
2. Open **Account Settings → API → Request an API Key**.
3. Copy the **API Key (v3 auth)** value into `.env.local` as `TMDB_API_KEY`.

A v4 read access token works too - put it in `TMDB_ACCESS_TOKEN` instead.

```env
TMDB_API_KEY=your_key_here
DATA_DIR=./data
```

---

## 2. Adding your own streams

Movie metadata comes from TMDB; **playback comes from you**. Streams are described in
`data/sources.json`, keyed by TMDB movie id, and are read at runtime - edit the file and
reload, no rebuild needed.

```json
{
  "550": [
    {
      "id": "550-1080",
      "label": "My Server",
      "type": "hls",
      "url": "https://media.example.com/movies/550/master.m3u8",
      "quality": "1080p",
      "server": "Primary"
    },
    {
      "id": "550-720",
      "label": "Backup",
      "type": "mp4",
      "url": "https://media.example.com/movies/550/720.mp4",
      "quality": "720p"
    }
  ]
}
```

Field reference:

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | Unique id for this source |
| `label` | yes | Shown in the source menu |
| `type` | yes | `hls`, `mp4` or `youtube` |
| `url` | yes | Stream URL (`youtube` = a full embed URL) |
| `quality` | no | Label like `1080p` / `4K` |
| `server` | no | Grouping label |
| `demo` | no | Marks the source as placeholder content |

`hls` streams play natively in Safari and through `hls.js` in Chrome, Firefox and Edge.

Out of the box two titles ship with Blender Foundation's **Big Buck Bunny** demo clip so
you can test the player immediately. It is free to use (CC-BY) and is clearly labelled as a
demo in the UI.

---

## 3. Deploying so you can watch from anywhere

### Docker (recommended for a VPS)

```bash
cp .env.example .env      # add your TMDB key
docker compose up -d --build
```

The site is then on `http://your-server-ip:3000`. Put a domain in front of it with
Caddy, Nginx or Traefik for HTTPS:

```caddy
movie.example.com {
    reverse_proxy localhost:3000
}
```

Caddy handles the certificate automatically.

### Plain Node server

```bash
npm ci
npm run build
npm start
```

The server listens on `PORT` (default 3000). Put it behind a reverse proxy (Caddy, Nginx,
Traefik) and run it under systemd or pm2 to keep it alive.

### Vercel

```bash
npx vercel
```

Vercel works fine for browsing and playback, but the server-side review store writes to
disk, which is read-only there. Reviews will not persist unless you swap
`src/lib/reviews-store.ts` for a hosted database - the file-based store is behind that one
module, so it is a contained change.

---

## 4. Project layout

```
data/
  sources.json         <- your stream sources (runtime, hot-editable)
  reviews.json         <- reviews written by visitors (generated)
src/
  app/
    page.tsx           home
    browse/            catalogue with filters
    search/            search results
    movie/[id]/        detail page
    watch/[id]/        player page
    my-list/           watchlist
    reviews/           all reviews
    api/reviews/       GET + POST + DELETE review endpoints
  components/          UI (player, cards, filters, reviews, header...)
  lib/
    tmdb.ts            TMDB client with caching + seed fallback
    sources.ts         stream source loader
    reviews-store.ts   review persistence
    types.ts           shared types
  providers/           theme + watchlist (localStorage) state
```

---

## 5. Scripts

```bash
npm run dev        # development server
npm run build      # production build
npm start          # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

---

## Notes

- Poster art and metadata are provided by [TMDB](https://www.themoviedb.org). This product
  uses the TMDB API but is not endorsed or certified by TMDB.
- The watchlist and playback progress are stored in the browser with `localStorage`; the
  reviews are stored on the server.
- **This project ships no copyrighted video.** It is a front end: you point it at the
  content you are licensed to show.
